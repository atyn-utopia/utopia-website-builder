#!/usr/bin/env node
// finalize-manual-toggles.mjs
// ---------------------------------------------------------------------------
// Closes the last ~4 residual per-site clicks that the API scripts can't do:
//   #1 GA4 "Google signals data collection"            → ON
//   #2 GA4 "User-provided data collection" (+auto)     → ON
//   #3 Ads conversion counting  Every → One-per-click
//   #4 Ads GA4 link "Import app and web metrics"       → ON
//
// Design (per 2026-07-14 research):
//   • API-FIRST for GA4. We TRY a raw-REST v1alpha PATCH via the USER OAuth
//     (utopiacoliving@gmail.com — the identity that accepted the ToS). ga4-create.mjs's
//     older attempt failed because it used the SERVICE ACCOUNT; the consent-
//     gated write may succeed as the user. If it does, no browser opens.
//   • PLAYWRIGHT FALLBACK for GA4, and PLAYWRIGHT-ONLY for Ads #3/#4 (those
//     have no API write path — counting_type is immutable on auto-imported
//     actions; the import-metrics toggle has no API field at all).
//   • ALWAYS VERIFY. GA4 + Ads changes are read back through the API
//     (googleSignalsSettings / userProvidedDataSettings / conversion_action
//     .counting_type). #4 is verified by the toggle's own aria-checked + a
//     screenshot (no API exists for it).
//   • IDEMPOTENT. Every step reads current state first and SKIPS if already set.
//
// One-time setup (per machine):  node finalize-manual-toggles.mjs --login
//   → opens Chrome, you log in by hand (password + 2FA), session is persisted.
//
// Per-site run:  node finalize-manual-toggles.mjs --domain katilhospital.com.my
//   reads configs/<domain>.json for ga4.propertyId + ads.{customerId,conversionActionId}
//
// Flags:
//   --login          one-time manual Google login (persist the browser profile)
//   --domain <d>     site to finalize (required unless --login)
//   --only <list>    comma list: ga4-signals,ga4-userdata,ads-counting,ads-metrics
//   --dry-run        report current state only; change nothing
//   --no-api-write   skip the GA4 API-write attempt; go straight to the browser
//   --headless       try the new headless Chrome (default is headed — safest w/ Google)
//   --pause          drop into Playwright Inspector at each browser step (for selector tuning)
// ---------------------------------------------------------------------------

import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getUserAuth } from './lib/auth.mjs';
import { openContext, loginFlow, gotoChecked, resolveAppFrame, shot, ensureSwitch, PROFILE_DIR } from './lib/pw.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIGS_DIR = join(__dirname, 'configs');
const GA4_ADMIN_BASE = 'https://analyticsadmin.googleapis.com/v1alpha';

// ─── arg parsing (same shape as the other scripts) ─────────────────────────
function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = process.argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i++; }
  }
  return args;
}
const args = parseArgs();

const ALL_STEPS = ['ga4-signals', 'ga4-userdata', 'ads-counting', 'ads-metrics'];
const steps = args.only ? String(args.only).split(',').map((s) => s.trim()) : ALL_STEPS;
const DRY = !!args['dry-run'];
const HEADLESS = !!args.headless;
const NO_API_WRITE = !!args['no-api-write'];
const PAUSE = !!args.pause;
const PROBE = !!args.probe;                               // navigate + verify selectors, NEVER commit
const CHANNEL = args['real-chrome'] ? 'chrome' : undefined; // real Chrome (quit yours first) vs bundled Chromium

// ─── GA4 raw-REST helpers (user OAuth) ─────────────────────────────────────
function ga4Auth() { return getUserAuth(); }

async function ga4Read(auth, propertyId, resource) {
  const res = await auth.request({ url: `${GA4_ADMIN_BASE}/properties/${propertyId}/${resource}` });
  return res.data;
}

// Legacy configs stored only the G-XXXX measurement id. Resolve the numeric
// property id by scanning account properties' web streams (stops at first match).
async function resolvePropertyId(measurementId) {
  const { google } = await import('googleapis');
  const admin = google.analyticsadmin({ version: 'v1beta', auth: getUserAuth() });
  const sums = await admin.accountSummaries.list({ pageSize: 200 });
  const props = (sums.data.accountSummaries || []).flatMap((a) => (a.propertySummaries || []).map((p) => p.property));
  for (const prop of props) {
    const streams = await admin.properties.dataStreams.list({ parent: prop }).catch(() => ({ data: {} }));
    const hit = (streams.data.dataStreams || []).find((s) => s.webStreamData?.measurementId === measurementId);
    if (hit) return prop.replace('properties/', '');
  }
  return null;
}
async function ga4Patch(auth, propertyId, resource, updateMask, body) {
  const res = await auth.request({
    method: 'PATCH',
    url: `${GA4_ADMIN_BASE}/properties/${propertyId}/${resource}?updateMask=${encodeURIComponent(updateMask)}`,
    data: body,
  });
  return res.data;
}

// ─── Ads client (reuses the ads-import-conversion.mjs auth pattern) ─────────
async function adsCustomer(customerId) {
  const TOKEN_FILE = join(homedir(), '.google-credentials', 'utopia-ads-token.txt');
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
    ?? (existsSync(TOKEN_FILE) ? readFileSync(TOKEN_FILE, 'utf8').trim() : null);
  const OAUTH_PATH = join(homedir(), '.google-credentials', 'utopia-user-oauth.json');
  if (!developerToken || !existsSync(OAUTH_PATH)) return null; // Ads verify is best-effort
  const { GoogleAdsApi, enums } = await import('google-ads-api');
  const oauth = JSON.parse(readFileSync(OAUTH_PATH, 'utf8'));
  const client = new GoogleAdsApi({
    client_id: oauth.client_id,
    client_secret: oauth.client_secret,
    developer_token: developerToken,
  });
  const customer = client.Customer({ customer_id: String(customerId).replace(/-/g, ''), refresh_token: oauth.refresh_token });
  return { customer, enums };
}

async function adsCountingType(customerId, conversionActionId) {
  const c = await adsCustomer(customerId);
  if (!c) return null;
  const rows = await c.customer.query(`
    SELECT conversion_action.id, conversion_action.counting_type
    FROM conversion_action
    WHERE conversion_action.id = ${conversionActionId}
  `);
  return rows[0]?.conversion_action?.counting_type ?? null; // enum: 2 = ONE_PER_CLICK, 3 = MANY_PER_CLICK
}

// Navigate to GA4 Admin → Data collection (proven path: land on /admin, wait for
// the card grid to render, click the "Data collection" row-link). Returns the app
// frame (GA4 may iframe its app). GA4's SPA renders well after domcontentloaded.
async function openGa4DataCollection(page, propertyId, accountId) {
  // GA4's SPA router IGNORES programmatic hash-only changes (observed
  // 2026-07-17) — force a HARD load via about:blank first. With accountId we
  // can deep-link straight to the Data collection page (URL shape captured
  // live: #/a<ACCT>p<PROP>/admin/datapolicies/datacollection).
  const base = 'https://analytics.google.com/analytics/web/?hl=en';
  const deep = accountId
    ? `${base}#/a${accountId}p${propertyId}/admin/datapolicies/datacollection`
    : `${base}#/p${propertyId}/admin`;
  await page.goto('about:blank').catch(() => {});
  await gotoChecked(page, deep, 'GA4 Data collection');
  await page.waitForLoadState('networkidle', { timeout: 25_000 }).catch(() => {});
  const app = await resolveAppFrame(page);
  // Landed = the Signals card renders (its heading exists only on the Data
  // collection page). Fall back to click-through from the Admin grid.
  const landed = () => app.getByText('Google signals data collection').first().isVisible({ timeout: 4_000 }).catch(() => false);
  for (let i = 0; i < 3 && !(await landed()); i++) {
    await app.getByText('Data collection and modification').first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {});
    await app.getByText('Data collection', { exact: true }).first().click({ timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(2_500);
  }
  return app;
}

// Confirm a GA4 turn-on dialog: wait for the overlay dialog, optionally tick a
// checkbox inside it, click its confirm button, and wait for it to close.
// (Observed live 2026-07-17: fresh-property Signals shows banner "Turn on" →
// dialog "Turn on Google signals data collection" → confirm "Turn on".)
async function confirmGa4Dialog(app, { checkbox } = {}) {
  const dialog = app.getByRole('dialog');
  await dialog.waitFor({ state: 'visible', timeout: 10_000 });
  if (checkbox) await dialog.getByRole('checkbox', { name: checkbox }).check({ timeout: 5_000 }).catch(() => {});
  await dialog.getByRole('button', { name: /^Turn on$|^Activate$|^Save$/ }).last().click({ timeout: 8_000 });
  await dialog.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
}

// Expand a GA4 accordion card and CONFIRM it opened. DOM dump (2026-07-17)
// shows the expander is <reach-expansion-panel-header role=button
// aria-expanded=...> — normal clicks get swallowed by hit-target interception,
// so dispatch the click event directly and verify via aria-expanded.
async function expandGa4Card(app, page, titleRe) {
  const header = app.locator('reach-expansion-panel-header').filter({ hasText: titleRe }).first();
  await header.waitFor({ state: 'attached', timeout: 15_000 }).catch(() => {});
  const isOpen = async () => (await header.getAttribute('aria-expanded').catch(() => null)) === 'true';
  for (let i = 0; i < 4 && !(await isOpen()); i++) {
    // Plain click on the header ELEMENT works (proven M1, 2026-07-17).
    // dispatchEvent does NOT — the component ignores untrusted events.
    await header.click({ timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(2_500);
  }
  return isOpen();
}

// Re-read a GA4 setting with a short retry — the UI write can lag the API read.
async function ga4ReadRetry(auth, propertyId, resource, isDone, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const data = await ga4Read(auth, propertyId, resource).catch(() => null);
    if (data && isDone(data)) return data;
    if (i < tries - 1) await new Promise((r) => setTimeout(r, 4_000));
  }
  return ga4Read(auth, propertyId, resource).catch(() => ({}));
}

// ─── result tracking ───────────────────────────────────────────────────────
const results = [];
const record = (step, status, detail) => { results.push({ step, status, detail }); console.log(`   → ${status.toUpperCase()}: ${detail}`); };

// ═══════════════════════════════════════════════════════════════════════════
// STEP IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

// --- GA4 #1: Google Signals -------------------------------------------------
async function stepGa4Signals(ctx, cfg) {
  console.log('\n📶 [ga4-signals] Google signals data collection');
  const { propertyId } = cfg.ga4;
  const auth = ga4Auth();

  const cur = await ga4Read(auth, propertyId, 'googleSignalsSettings').catch((e) => ({ _err: e }));
  if (cur._err) return record('ga4-signals', 'error', `cannot read settings: ${cur._err.message}`);
  if (cur.state === 'GOOGLE_SIGNALS_ENABLED') return record('ga4-signals', 'skip', 'already enabled');
  if (DRY) return record('ga4-signals', 'dry', `currently ${cur.state}`);

  // Try API write (user OAuth) first.
  if (!NO_API_WRITE) {
    try {
      await ga4Patch(auth, propertyId, 'googleSignalsSettings', 'consent', { consent: 'GOOGLE_SIGNALS_CONSENT_CONSENTED' }).catch(() => {});
      await ga4Patch(auth, propertyId, 'googleSignalsSettings', 'state', { state: 'GOOGLE_SIGNALS_ENABLED' });
      const after = await ga4Read(auth, propertyId, 'googleSignalsSettings');
      if (after.state === 'GOOGLE_SIGNALS_ENABLED') return record('ga4-signals', 'done-api', 'enabled via API (no browser)');
    } catch (e) {
      console.log(`   ⚠️  API write failed (${e.response?.status || ''} ${e.message.split('\n')[0]}) — falling back to browser`);
    }
  }

  // Playwright fallback (rarely reached — the API path above usually wins for #1).
  const page = await ctx.newPage();
  try {
    const app = await openGa4DataCollection(page, propertyId, cfg.ga4?.accountId);
    if (PAUSE) await page.pause();

    // Activated properties show an inline switch; a FRESH property shows a blue
    // "Enhance user insights" banner with a "Turn on" button that opens a
    // confirmation dialog (observed live 2026-07-17).
    const outcome = await ensureSwitch(app, /Google signals/i, { desired: true });
    if (outcome === 'missing') {
      // The signals banner button is the first "Turn on" on the page when signals is off.
      await app.getByRole('button', { name: 'Turn on' }).first().click({ timeout: 10_000 });
      await confirmGa4Dialog(app);
    }
    await shot(page, cfg._shotDir, 'ga4-signals');

    const after = await ga4ReadRetry(auth, propertyId, 'googleSignalsSettings', (d) => d.state === 'GOOGLE_SIGNALS_ENABLED');
    if (after.state === 'GOOGLE_SIGNALS_ENABLED') record('ga4-signals', 'done-ui', 'enabled via browser (API-verified)');
    else record('ga4-signals', 'unverified', `clicked, but API still reads ${after.state} — check the screenshot`);
  } finally { await page.close(); }
}

// --- GA4 #2: User-provided data ---------------------------------------------
async function stepGa4UserData(ctx, cfg) {
  console.log('\n🤝 [ga4-userdata] User-provided data collection');
  const { propertyId } = cfg.ga4;
  const auth = ga4Auth();

  const cur = await ga4Read(auth, propertyId, 'userProvidedDataSettings').catch((e) => ({ _err: e }));
  if (cur._err) return record('ga4-userdata', 'error', `cannot read settings: ${cur._err.message}`);
  if (cur.userProvidedDataCollectionEnabled && cur.automaticallyDetectedDataCollectionEnabled)
    return record('ga4-userdata', 'skip', 'already enabled (+ auto-detect)');
  if (DRY) return record('ga4-userdata', 'dry', `enabled=${!!cur.userProvidedDataCollectionEnabled} auto=${!!cur.automaticallyDetectedDataCollectionEnabled}`);

  if (!NO_API_WRITE) {
    try {
      await ga4Patch(auth, propertyId, 'userProvidedDataSettings',
        'userProvidedDataCollectionEnabled,automaticallyDetectedDataCollectionEnabled',
        { userProvidedDataCollectionEnabled: true, automaticallyDetectedDataCollectionEnabled: true });
      const after = await ga4Read(auth, propertyId, 'userProvidedDataSettings');
      if (after.userProvidedDataCollectionEnabled) return record('ga4-userdata', 'done-api', 'enabled via API (no browser)');
    } catch (e) {
      console.log(`   ⚠️  API write failed (${e.response?.status || ''} ${e.message.split('\n')[0]}) — falling back to browser`);
    }
  }

  const page = await ctx.newPage();
  try {
    const app = await openGa4DataCollection(page, propertyId, cfg.ga4?.accountId);
    if (PAUSE) await page.pause();

    // Expand the "User-ID and user-provided data collection" card — verified via
    // aria-expanded / content probe (single text-clicks silently miss or
    // double-toggle mid-animation; observed 2026-07-17).
    const cardTitle = /User-ID and user-provided data collection/i;
    const contentProbe = () => app.getByText('User-ID collection').first().isVisible({ timeout: 2_000 }).catch(() => false);
    if (!(await expandGa4Card(app, page, cardTitle))) {
      await shot(page, cfg._shotDir, 'ga4-userdata-NOEXPAND');
      return record('ga4-userdata', 'error', 'card would not expand (see screenshot)');
    }

    let after = cur;
    // Only run the turn-on flow when the MAIN setting is off. (When main=ON and
    // only auto-detect is missing, there is no "Turn on" button — skip to the
    // auto-detect pass below.)
    if (!cur.userProvidedDataCollectionEnabled) {
      // CRITICAL scoping (learned 2026-07-17): when Signals is also off, the page's
      // FIRST "Turn on" belongs to the SIGNALS banner — the runner orders signals
      // first so its button is gone by now; take the LAST "Turn on" as extra guard.
      // The button may sit deep in the expanded card — scroll until it appears.
      const turnOns = app.getByRole('button', { name: 'Turn on' });
      for (let i = 0; i < 6 && !(await turnOns.count()); i++) {
        await page.mouse.wheel(0, 700);
        await page.waitForTimeout(800);
      }
      if (!(await turnOns.count())) { await shot(page, cfg._shotDir, 'ga4-userdata-NOBTN'); return record('ga4-userdata', 'error', 'no "Turn on" button found after expanding (see screenshot)'); }
      await turnOns.last().scrollIntoViewIfNeeded().catch(() => {});
      await turnOns.last().click({ timeout: 10_000 });
      await confirmGa4Dialog(app, { checkbox: /Collect automatically-detected user-provided data/i });
      await shot(page, cfg._shotDir, 'ga4-userdata');
      after = await ga4ReadRetry(auth, propertyId, 'userProvidedDataSettings', (d) => d.userProvidedDataCollectionEnabled);
    }

    // 2026-07 BETA UI: the turn-on dialog no longer carries the auto-detect
    // checkbox — it lives in the card once main is ON. We are ALREADY on the
    // Data collection page with the card expanded (do NOT re-navigate — a
    // hash-only SPA goto strands us on the Admin grid; observed 2026-07-17).
    if (after.userProvidedDataCollectionEnabled && !after.automaticallyDetectedDataCollectionEnabled) {
      console.log('   ↻ main setting ON, enabling auto-detect (post-enable pass)...');
      // DOM dump 2026-07-17: the control is <button role=switch
      // aria-label="Automatic Collection Toggle"> inside a mat-slide-toggle —
      // its accessible name shares NO words with the visible row text.
      const auto = app.getByRole('switch', { name: /Automatic Collection Toggle|automatically.detected/i })
        .or(app.getByRole('checkbox', { name: /automatically.detected/i })).first();
      let found = await auto.count();
      if (!found) {
        // The post-enable UI may need a fresh render of the card: reload the
        // page properly (openGa4DataCollection now verifies its landing).
        await openGa4DataCollection(page, propertyId, cfg.ga4?.accountId);
        await expandGa4Card(app, page, cardTitle);
        for (let i = 0; i < 6 && !(await auto.count()); i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(700); }
        found = await auto.count();
      }
      if (found) {
        const state = await auto.getAttribute('aria-checked').catch(() => null);
        if (state !== 'true') {
          await auto.scrollIntoViewIfNeeded().catch(() => {});
          await auto.click({ timeout: 8_000 }).catch(() => {});
          await app.getByRole('dialog').getByRole('button', { name: /Turn on|Confirm|Save|Acknowledge/i }).last().click({ timeout: 6_000 }).catch(() => {});
          await page.waitForTimeout(2_000);
        }
      }
      await shot(page, cfg._shotDir, 'ga4-userdata-autodetect');
      after = await ga4ReadRetry(auth, propertyId, 'userProvidedDataSettings', (d) => d.automaticallyDetectedDataCollectionEnabled);
    }

    if (after.userProvidedDataCollectionEnabled && after.automaticallyDetectedDataCollectionEnabled) record('ga4-userdata', 'done-ui', 'enabled + auto-detect via browser (API-verified)');
    else if (after.userProvidedDataCollectionEnabled) record('ga4-userdata', 'partial', 'main setting ON (API-verified); auto-detect still OFF — tick manually or re-run');
    else record('ga4-userdata', 'unverified', 'clicked, but API still reads disabled — check the screenshot');
  } finally { await page.close(); }
}

// --- Ads account resolution + deep-links ------------------------------------
// The login has several Ads accounts, so Ads shows a "Select a Google Ads
// account" chooser. Pick ours by its formatted id (1933757591 → 193-375-7591),
// then return the LANDED overview URL — which carries the exact session context
// params (ocid, __c, __u, uscid, authuser, __e). Deep-links MUST reuse those
// verbatim; hardcoding __c/__u to the plain customer id bounces to a re-login.
async function adsOverview(page, customerId) {
  const fmt = String(customerId).replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  await gotoChecked(page, 'https://ads.google.com/aw/overview?hl=en', 'Ads');
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  const onChooser = /selectaccount/.test(page.url())
    || (await page.getByText('Select a Google Ads account').isVisible({ timeout: 4_000 }).catch(() => false));
  if (onChooser) {
    await page.getByText(fmt).first().click({ timeout: 10_000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  }
  await page.waitForURL(/ocid=/, { timeout: 20_000 }).catch(() => {});
  return /[?&]ocid=/.test(page.url()) ? page.url() : null;
}

// Build an Ads deep-link by keeping the overview's session params and swapping path.
function adsDeepLink(overviewUrl, pathname, extra = {}) {
  const u = new URL(overviewUrl);
  u.pathname = pathname;
  for (const [k, v] of Object.entries(extra)) u.searchParams.set(k, v);
  return u.toString();
}

// --- Ads #3: counting Every → One -------------------------------------------
async function stepAdsCounting(ctx, cfg) {
  console.log('\n🔢 [ads-counting] Conversion counting  Every → One-per-click');
  const { customerId, conversionActionId } = cfg.ads;
  const enums = (await adsCustomer(customerId))?.enums;
  const ONE = enums?.ConversionActionCountingType?.ONE_PER_CLICK ?? 2;

  const before = await adsCountingType(customerId, conversionActionId);
  if (before === ONE) return record('ads-counting', 'skip', 'already ONE_PER_CLICK');
  if (DRY) return record('ads-counting', 'dry', `counting_type=${before} (want ${ONE}=ONE_PER_CLICK)`);

  const page = await ctx.newPage();
  try {
    const overview = await adsOverview(page, customerId);
    if (!overview) return record('ads-counting', 'error', 'could not resolve Ads account / ocid (chooser or session issue)');
    await gotoChecked(page, adsDeepLink(overview, '/aw/conversions/detail', { ctId: conversionActionId }), 'conversion detail');
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
    if (PAUSE) await page.pause();

    await page.getByRole('button', { name: 'Edit settings' }).click({ timeout: 15_000 });
    await page.getByText('Count', { exact: true }).first().click({ timeout: 8_000 }).catch(() => {}); // expand
    const one = page.getByRole('radio', { name: 'One' });
    if (await one.count()) { if (!(await one.isChecked())) await one.check(); }
    else { await page.getByText('One', { exact: true }).first().click({ timeout: 5_000 }); }
    await page.getByRole('button', { name: 'Save' }).first().click({ timeout: 8_000 });
    await page.getByRole('button', { name: 'Done' }).first().click({ timeout: 8_000 }).catch(() => {});
    await shot(page, cfg._shotDir, 'ads-counting');

    const after = await adsCountingType(customerId, conversionActionId);
    if (after === ONE) record('ads-counting', 'done-ui', 'ONE_PER_CLICK (API-verified)');
    else record('ads-counting', 'unverified', `clicked, but API still reads counting_type=${after} — check the screenshot`);
  } finally { await page.close(); }
}

// --- Ads #4: Import app and web metrics -------------------------------------
async function stepAdsMetrics(ctx, cfg) {
  console.log('\n📈 [ads-metrics] GA4 link "Import app and web metrics" → ON');
  const { customerId } = cfg.ads;
  if (DRY) return record('ads-metrics', 'dry', 'no API to read — would open Data manager and check the toggle');

  const page = await ctx.newPage();
  try {
    const overview = await adsOverview(page, customerId);
    if (!overview) return record('ads-metrics', 'error', 'could not resolve Ads account / ocid');

    // Try deep-link to Data manager (reusing session params); fall back to nav clicks.
    await gotoChecked(page, adsDeepLink(overview, '/aw/datamanager'), 'Data manager').catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
    if (!/datamanager/.test(page.url())) {
      await page.getByRole('button', { name: 'Tools' }).click({ timeout: 10_000 }).catch(() => {});
      await page.getByRole('link', { name: 'Data manager' }).click({ timeout: 10_000 }).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
    }
    if (PAUSE) await page.pause();

    // Data manager → the "Google Analytics (GA4)" connected-product row. Its action
    // is a dropdown (Manage / View stats), NOT the "Manage & link" that other
    // products (GBP, YouTube) show. Open the menu, then click "Manage".
    const gaRow = page.locator('div,li').filter({ hasText: /Google Analytics \(GA4\)/ }).filter({ hasText: /linked/i }).last();
    await gaRow.scrollIntoViewIfNeeded({ timeout: 8_000 }).catch(() => {});
    await gaRow.getByRole('button').last().click({ timeout: 12_000 }).catch(() => {});
    await page.getByRole('menuitem', { name: /^Manage$/ }).click({ timeout: 8_000 }).catch(async () => {
      await page.getByText('Manage', { exact: true }).first().click({ timeout: 6_000 }).catch(() => {});
    });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2_500);

    // That opens the GA4 linked-properties TABLE (one row per property). The Status
    // column literally reads "App and web metrics: On/Off" — so we can both verify
    // and skip from the table. Find OUR property's row (by numeric property id).
    const propId = String(cfg.ga4?.propertyId || cfg.ads?.ga4PropertyId || '');
    const dom = cfg.domain;
    // The table virtualizes (184 rows) — scroll until our row renders. A freshly
    // linked property (new build) sorts to the top, so this usually resolves fast.
    const rowFor = () => page.getByRole('row').filter({ hasText: propId }).or(page.getByRole('row').filter({ hasText: dom }));
    let row = rowFor();
    for (let i = 0; i < 40 && !(await row.count()); i++) {
      const rows = page.getByRole('row');
      const n = await rows.count();
      if (n > 1) await rows.nth(n - 1).scrollIntoViewIfNeeded({ timeout: 4_000 }).catch(() => {});
      await page.waitForTimeout(350);
      row = rowFor();
    }
    row = row.first();
    if (!(await row.count())) { await shot(page, cfg._shotDir, 'ads-metrics-NOROW'); return record('ads-metrics', 'error', `row for ${dom}/${propId} not found after scrolling (see screenshot)`); }
    await row.scrollIntoViewIfNeeded().catch(() => {});
    const statusText = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
    if (/App and web metrics:\s*On/i.test(statusText)) { await shot(page, cfg._shotDir, 'ads-metrics'); return record('ads-metrics', 'skip', 'already ON (per linked-properties table)'); }

    // Off → open that row's "Manage", flip the toggle, save.
    await row.getByRole('link', { name: /Manage/ }).first().click({ timeout: 10_000 }).catch(async () => {
      await row.getByRole('button', { name: /Manage/ }).first().click({ timeout: 6_000 }).catch(() => {});
    });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2_000);
    const outcome = await ensureSwitch(page, /Import app and web metrics/i, { desired: true });
    if (outcome === 'missing') { await shot(page, cfg._shotDir, 'ads-metrics-NOTOGGLE'); return record('ads-metrics', 'error', 'toggle not found after opening row Manage (see screenshot)'); }
    if (outcome === 'changed') await page.getByRole('button', { name: /Save/ }).first().click({ timeout: 8_000 }).catch(() => {});
    await shot(page, cfg._shotDir, 'ads-metrics');
    record('ads-metrics', outcome === 'already' ? 'skip' : 'done-ui', outcome === 'already' ? 'already ON' : 'toggled ON (aria-checked verified)');
  } finally { await page.close(); }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROBE MODE — navigate + confirm each selector resolves. Never commits.
// Opens editor/nav panels (harmless — Google persists nothing until Save/Turn-on/
// the toggle), reads current state, screenshots. Zero state change.
// ═══════════════════════════════════════════════════════════════════════════
async function check(scope, label, locator) {
  const ok = await locator.first().isVisible({ timeout: 9_000 }).catch(() => false);
  console.log(`     ${ok ? '✓ found ' : '✗ MISSING'} ${label}`);
  return ok;
}

const settle = (page, ms = 3500) => page.waitForTimeout(ms); // brief settle for GA/Ads SPA renders

async function probeGa4(page, cfg) {
  console.log('\n🔎 [probe ga4] Admin → Data collection');
  await gotoChecked(page, `https://analytics.google.com/analytics/web/?hl=en#/p${cfg.ga4.propertyId}/admin`, 'GA4 Admin');
  const app = await resolveAppFrame(page);
  console.log(`     app rendered in ${app === page ? 'main frame' : 'iframe'}`);
  // Wait for the Admin card grid to actually render (domcontentloaded fires too early on GA4's SPA).
  await app.getByText('Data collection and modification').first().waitFor({ state: 'visible', timeout: 30_000 })
    .then(() => console.log('     ✓ admin grid rendered'))
    .catch(() => console.log('     ✗ admin grid did NOT render in 30s'));
  await shot(page, cfg._shotDir, 'probe-ga4-1-admingrid');
  // "Data collection" is a ROW LINK inside the card (not a left-nav item).
  await app.getByText('Data collection', { exact: true }).first().click({ timeout: 15_000 })
    .then(() => console.log('     ✓ clicked "Data collection" link'))
    .catch((e) => console.log('     ✗ click "Data collection":', e.message.split('\n')[0]));
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  await settle(page);
  console.log('     landing url:', page.url());
  await shot(page, cfg._shotDir, 'probe-ga4-2-datacollection');
  // Loose text checks (exact control selectors TBD from this screenshot).
  await check(app, '#1 "Google signals" text', app.getByText(/Google signals/i));
  await check(app, '#2 "user-provided data" text', app.getByText(/user-provided data|User-ID/i));
}

async function probeAds(page, cfg) {
  console.log('\n🔎 [probe ads] select account → capture ocid');
  const cid = cfg.ads.customerId;
  const overview = await adsOverview(page, cid);
  console.log('     landing url:', page.url());
  console.log('     ocid:', page.url().match(/[?&]ocid=([^&]+)/)?.[1] || 'NONE');
  await shot(page, cfg._shotDir, 'probe-ads-1-overview');
  if (!overview) { console.log('     → stopping ads probe (no ocid). Screenshot shows what Ads rendered.'); return; }

  // #3 conversion detail (reuse session params)
  await gotoChecked(page, adsDeepLink(overview, '/aw/conversions/detail', { ctId: cfg.ads.conversionActionId }), 'conversion detail').catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  await settle(page);
  console.log('     conversion url:', page.url());
  await shot(page, cfg._shotDir, 'probe-ads-2-conversion');
  await check(page, '#3 "Edit settings" button', page.getByRole('button', { name: 'Edit settings' }));

  // #4 data manager (reuse session params)
  await gotoChecked(page, adsDeepLink(overview, '/aw/datamanager'), 'Data manager').catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  await settle(page);
  console.log('     data manager url:', page.url());
  await shot(page, cfg._shotDir, 'probe-ads-3-datamanager');
  await check(page, '#4 GA4 card "Manage"/"Manage & link"', page.getByRole('button', { name: /Manage/i }));
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  if (args.login) { await loginFlow({ channel: CHANNEL }); return; }

  const domain = args.domain;
  if (!domain) {
    console.error('Usage: node finalize-manual-toggles.mjs --domain <d> [--only ...] [--dry-run] [--headless] [--pause]');
    console.error('       node finalize-manual-toggles.mjs --login   (one-time)');
    process.exit(1);
  }

  const configPath = join(CONFIGS_DIR, `${domain}.json`);
  if (!existsSync(configPath)) { console.error(`❌ No config at ${configPath}. Run ga4-create.mjs + ads-import-conversion.mjs first.`); process.exit(1); }
  const cfg = JSON.parse(readFileSync(configPath, 'utf8'));

  // Validate the IDs each requested step needs.
  const needGa4 = steps.some((s) => s.startsWith('ga4'));
  const needAds = steps.some((s) => s.startsWith('ads'));

  let ga4PropertyId = cfg.ga4?.propertyId || cfg.ads?.ga4PropertyId;
  if (needGa4 && !ga4PropertyId) {
    // Legacy config: only the measurement id was stored. Resolve + cache it.
    const mid = cfg.ga4?.measurementId || cfg.ga4MeasurementId;
    if (mid) {
      console.log(`   🔎 No numeric GA4 propertyId in config; resolving from ${mid}...`);
      ga4PropertyId = await resolvePropertyId(mid).catch(() => null);
      if (ga4PropertyId) {
        cfg.ga4 = { ...(cfg.ga4 || {}), propertyId: ga4PropertyId, measurementId: mid };
        const { writeFileSync } = await import('node:fs');
        writeFileSync(configPath, JSON.stringify(cfg, null, 2));
        console.log(`   ✓ Resolved + cached propertyId ${ga4PropertyId}`);
      }
    }
  }
  if (needGa4) {
    if (!ga4PropertyId) { console.error('❌ No GA4 property id in config and could not resolve from measurementId. Run ga4-create.mjs.'); process.exit(1); }
    cfg.ga4 = { ...(cfg.ga4 || {}), propertyId: ga4PropertyId };
  }
  if (needAds) {
    if (!cfg.ads?.customerId || !cfg.ads?.conversionActionId) { console.error('❌ No ads.customerId / ads.conversionActionId in config. Run ads-import-conversion.mjs first.'); process.exit(1); }
  }

  cfg._shotDir = join(__dirname, '_screenshots', domain);

  console.log('\n' + '═'.repeat(64));
  console.log(`🎛️  Finalize manual toggles — ${domain}`);
  console.log('═'.repeat(64));
  console.log(`   steps:   ${steps.join(', ')}`);
  console.log(`   mode:    ${DRY ? 'DRY-RUN (no changes)' : 'live'}${HEADLESS ? ' · headless' : ' · headed'}${NO_API_WRITE ? ' · no-api-write' : ''}`);
  if (needGa4) console.log(`   GA4:     property ${ga4PropertyId}`);
  if (needAds) console.log(`   Ads:     customer ${cfg.ads.customerId}, conversion ${cfg.ads.conversionActionId}`);

  // ── PROBE: verify selectors on the live UI without committing anything ──
  if (PROBE) {
    console.log('\n🧪 PROBE MODE — navigating + checking selectors. Nothing is saved/changed.');
    const ctx = await openContext({ headless: HEADLESS, channel: CHANNEL });
    const page = ctx.pages()[0] ?? (await ctx.newPage());
    try {
      if (needGa4) await probeGa4(page, cfg);
      if (needAds && cfg.ads?.customerId) await probeAds(page, cfg);
    } catch (e) { console.error('\n❌ probe error:', e.message); }
    finally { await ctx.close(); }
    console.log(`\n📋 Probe done. Screenshots → _screenshots/${domain}/  (nothing was changed)\n`);
    return;
  }

  // Only launch a browser if a step might actually need one (GA4 API-write may skip it entirely,
  // but Ads steps always do, and DRY-run never does).
  const mightNeedBrowser = !DRY && (needAds || steps.some((s) => s.startsWith('ga4')));
  let ctx = null;
  const getCtx = async () => (ctx ??= await openContext({ headless: HEADLESS, channel: CHANNEL }));

  try {
    for (const step of steps) {
      const c = mightNeedBrowser ? await getCtx() : null;
      if (step === 'ga4-signals') await stepGa4Signals(c, cfg);
      else if (step === 'ga4-userdata') await stepGa4UserData(c, cfg);
      else if (step === 'ads-counting') await stepAdsCounting(c, cfg);
      else if (step === 'ads-metrics') await stepAdsMetrics(c, cfg);
      else record(step, 'error', 'unknown step (valid: ' + ALL_STEPS.join(', ') + ')');
    }
  } catch (e) {
    console.error('\n❌', e.message);
  } finally {
    if (ctx) await ctx.close();
  }

  // Summary
  console.log('\n' + '─'.repeat(64));
  console.log('SUMMARY');
  console.log('─'.repeat(64));
  for (const r of results) console.log(`  ${r.step.padEnd(14)} ${r.status.padEnd(12)} ${r.detail}`);
  const bad = results.filter((r) => ['error', 'unverified'].includes(r.status));
  if (bad.length) {
    console.log(`\n⚠️  ${bad.length} step(s) need a look. If a browser step failed, re-run that step with --pause to`);
    console.log('   tune the selector against the live UI:  --only ' + bad.map((r) => r.step).join(',') + ' --pause');
    process.exitCode = 1;
  } else if (!DRY) {
    console.log('\n✅ All requested toggles are in the desired state (API-verified where possible).');
  }
  console.log('');
}

main().catch((e) => { console.error('\n❌', e.message); process.exit(1); });
