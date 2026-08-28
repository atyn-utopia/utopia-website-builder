// Playwright session helpers for automating the residual UI-only Google
// toggles (GA4 Signals / user-provided data, Ads counting, Ads import-metrics).
//
// Strategy (from research, see MANUAL-STEPS.md "Playwright fallback"):
//   - launchPersistentContext(userDataDir) + channel:'chrome' (real Chrome).
//   - NEVER script the Google login form — that's where "browser may not be
//     secure" fires. A human logs in ONCE (headed) via `--login`; the profile
//     dir then holds cookies + device-trust for all future headless-ish runs.
//   - Detect an expired session (redirect to accounts.google.com) and surface
//     a clear "re-login" message instead of timing out on a missing element.
//   - Use getByRole/getByText only (they pierce GA/Ads open shadow DOM). Never
//     target Material/Angular hashed CSS classes.

import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

// Profile lives beside the other Google creds — gitignored by living outside the repo.
export const PROFILE_DIR = join(homedir(), '.google-credentials', 'pw-google-profile');

const ACCOUNTS_RE = /accounts\.google\.com/;
const PRODUCT_HOST_RE = /^https:\/\/(analytics|ads)\.google\.com/;

/**
 * Open the persistent, already-authenticated browser context.
 * Default = Playwright's bundled Chromium, which coexists with the user's own
 * running Chrome. Pass channel:'chrome' for the real Chrome (better for the
 * login step's bot-detection) — but that binary CANNOT launch while the user's
 * Chrome is already open, so it's opt-in via --real-chrome (quit Chrome first).
 */
export async function openContext({ headless = false, channel } = {}) {
  mkdirSync(PROFILE_DIR, { recursive: true });
  const opts = {
    headless,
    viewport: { width: 1440, height: 900 },
    // Hide the automation fingerprint so Google's login doesn't throw
    // "This browser or app may not be secure":
    //  - drop --enable-automation (removes the "controlled by test software" tell)
    //  - --disable-blink-features=AutomationControlled sets navigator.webdriver = false
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
  };
  if (channel) opts.channel = channel;
  return chromium.launchPersistentContext(PROFILE_DIR, opts);
}

/** One-time manual login. Human types password + 2FA; we just persist the profile. */
export async function loginFlow({ channel } = {}) {
  console.log('\n🔐 One-time Google login');
  console.log('   A Chrome window will open. Sign in as the account that owns the GA4/Ads');
  console.log('   properties (utopiacoliving@gmail.com), complete 2FA, and tick');
  console.log('   "Don\'t ask again on this device". Then just wait — this closes itself.\n');

  const ctx = await openContext({ headless: false });
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto('https://analytics.google.com/');

  try {
    // Land on a product host (not the login/chooser) = logged in.
    await page.waitForURL(PRODUCT_HOST_RE, { timeout: 300_000 });
    console.log('✓ Login detected.');
  } catch {
    console.log('⚠️  Did not detect a product page within 5 min.');
    console.log('   If you completed login, the session is still saved. Otherwise re-run --login.');
  }
  await ctx.close(); // clean close flushes refreshed cookies back to the profile
  console.log('✓ Session persisted to', PROFILE_DIR, '\n');
}

/**
 * Navigate and assert we're still authenticated. Throws a clear re-login error
 * if Google bounced us to the sign-in / account-chooser page.
 */
export async function gotoChecked(page, url, label = 'page') {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  if (ACCOUNTS_RE.test(page.url())) {
    throw new Error(
      `Session expired while opening ${label} (redirected to accounts.google.com).\n` +
      `   Re-run the one-time login:  node finalize-manual-toggles.mjs --login`,
    );
  }
  return page;
}

/**
 * GA4 sometimes wraps its app in an <iframe>; Playwright locators don't cross
 * iframe boundaries. Return the Frame that actually holds the app (or the page
 * itself). CONTENT-BASED — a URL substring check is a trap: GA4 loads an empty
 * API-proxy iframe (analyticssuitefrontend-pa...) whose query string contains
 * "analytics.google", which hijacked the old check and sent every locator into
 * an empty frame (confirmed 2026-07-17). Main frame wins whenever it has the app.
 */
export async function resolveAppFrame(page, probeSelector = 'reach-expansion-panel-header') {
  if (await page.locator(probeSelector).count().catch(() => 0)) return page;
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    if (await f.locator(probeSelector).count().catch(() => 0)) return f;
  }
  return page;
}

/** Screenshot proof, auto-named + timestamped, under _screenshots/<domain>/. */
export async function shot(page, dir, name) {
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${name}-${Date.now()}.png`);
  await page.screenshot({ path: file });
  console.log('   📸', file);
  return file;
}

/**
 * Idempotent toggle: read a Material switch's aria-checked and only click if it
 * isn't already in the desired state. Returns 'already' | 'changed' | 'missing'.
 */
export async function ensureSwitch(scope, name, { desired = true } = {}) {
  const sw = scope.getByRole('switch', { name }).first();
  if (!(await sw.count())) return 'missing';
  const checked = (await sw.getAttribute('aria-checked')) === 'true';
  if (checked === desired) return 'already';
  await sw.click();
  return 'changed';
}
