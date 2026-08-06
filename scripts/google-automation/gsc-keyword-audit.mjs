// Post-launch keyword audit — did the plan survive contact with real search?
//
// `keyword-volume.mjs` checks a plan BEFORE the build using Ads estimates.
// This checks it AFTER launch using what Google actually did: Search Console
// impressions. It answers three questions the pipeline currently never asks:
//
//   1. Which planned keywords got ZERO impressions?      → the plan missed
//   2. Which UNPLANNED queries are pulling impressions?  → free wins to adopt
//   3. Which queries sit at position 5–20?               → striking distance,
//                                                          hand to Hanabi
//
// Usage:
//   node gsc-keyword-audit.mjs --domain majlisaqiqah.my --days 60
//   node gsc-keyword-audit.mjs --domain majlisaqiqah.my --plan ../path/seo-plan.md
//   node gsc-keyword-audit.mjs --domain majlisaqiqah.my --out audit.md
//
// Flags:
//   --domain <d>    site domain (required)
//   --days <n>      lookback window. default: 60 (GSC needs ~28 days to be useful)
//   --plan <path>   compare against a Sora seo-plan.md
//   --pages         also diff sitemap URLs against pages with impressions
//   --out <path>    write the report as markdown
//
// Prerequisite: ~/.google-credentials/utopia-user-oauth.json with the
// `webmasters` scope (already granted by oauth-login.mjs).

import { writeFileSync, existsSync } from 'node:fs';
import { google } from 'googleapis';
import { getUserAuth } from './lib/auth.mjs';
import { extractKeywordsFromPlan, normalizeKeyword, parseArgs, ymd } from './lib/seo-plan.mjs';

const args = parseArgs(process.argv.slice(2));
const domain = args.domain && args.domain !== true ? String(args.domain).replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
const days = args.days && args.days !== true ? Number(args.days) : 60;

if (!domain) {
  console.error('Usage: node gsc-keyword-audit.mjs --domain <domain> [--days 60] [--plan <path>] [--pages] [--out <path>]');
  process.exit(1);
}

if (args.plan && args.plan !== true && !existsSync(args.plan)) {
  console.error(`❌ Plan file not found: ${args.plan}`);
  process.exit(1);
}

const auth = getUserAuth();
const sc = google.searchconsole({ version: 'v1', auth });

// ─── Resolve which GSC property to read ───────────────────────────
const { data: siteList } = await sc.sites.list({});
const bare = domain.replace(/^www\./, '');
const candidates = (siteList.siteEntry ?? []).filter((s) => s.siteUrl.includes(bare));

if (!candidates.length) {
  console.error(`❌ No Search Console property matches "${domain}".`);
  console.error('   Properties on this account:');
  (siteList.siteEntry ?? []).forEach((s) => console.error(`     · ${s.siteUrl} (${s.permissionLevel})`));
  process.exit(1);
}
// A domain property covers every subdomain + protocol — prefer it.
const site = candidates.find((s) => s.siteUrl.startsWith('sc-domain:')) ?? candidates[0];

// GSC data lags ~2–3 days; asking for today returns an empty tail.
const end = new Date(Date.now() - 3 * 86400_000);
const start = new Date(end.getTime() - days * 86400_000);
const startDate = ymd(start);
const endDate = ymd(end);

console.log(`\n🔎 Search Console — ${site.siteUrl}`);
console.log(`   Window: ${startDate} → ${endDate} (${days} days)\n`);

async function queryGsc(dimensions, rowLimit = 25000) {
  const { data } = await sc.searchanalytics.query({
    siteUrl: site.siteUrl,
    requestBody: { startDate, endDate, dimensions, rowLimit, dataState: 'all' },
  });
  return data.rows ?? [];
}

const queryRows = await queryGsc(['query']);

if (!queryRows.length) {
  console.log('⚠️  No query data in this window.\n');
  console.log('   Either the property was verified too recently (GSC needs ~2–4 weeks');
  console.log('   before query data appears), or the site genuinely has no impressions.');
  console.log('   Check Indexing → Pages in GSC to tell those two apart.\n');
  process.exit(0);
}

const totals = queryRows.reduce(
  (a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }),
  { clicks: 0, impressions: 0 },
);

const md = [];
const say = (s = '') => { console.log(s); md.push(s); };

say(`# Keyword audit — ${domain}`);
say('');
say(`Window: **${startDate} → ${endDate}** · property \`${site.siteUrl}\``);
say('');
say(`- **${totals.impressions.toLocaleString()}** impressions · **${totals.clicks.toLocaleString()}** clicks`);
say(`- **${queryRows.length.toLocaleString()}** distinct queries returned at least one impression`);
say('');

// ─── 1. Plan comparison ───────────────────────────────────────────
if (args.plan && args.plan !== true) {
  const plan = extractKeywordsFromPlan(args.plan);
  const planned = new Set(plan.keywords.map(normalizeKeyword));
  const primary = new Set(plan.primary.map(normalizeKeyword));

  // A planned keyword "landed" if any real query contains it — searchers add
  // words, so exact-match alone would understate the plan badly.
  const seen = queryRows.map((r) => ({ q: normalizeKeyword(r.keys[0]), ...r }));
  const landed = new Map();
  for (const k of planned) {
    const hits = seen.filter((s) => s.q.includes(k));
    if (hits.length) {
      landed.set(k, {
        impressions: hits.reduce((a, h) => a + h.impressions, 0),
        clicks: hits.reduce((a, h) => a + h.clicks, 0),
        variants: hits.length,
      });
    }
  }

  const missed = [...planned].filter((k) => !landed.has(k));
  const missedPrimary = missed.filter((k) => primary.has(k));

  say('## 1. Planned keywords');
  say('');
  say(`${landed.size}/${planned.size} planned keywords pulled impressions.`);
  say('');
  if (landed.size) {
    say('| Planned keyword | Impressions | Clicks | Query variants |');
    say('|---|---:|---:|---:|');
    [...landed.entries()]
      .sort((a, b) => b[1].impressions - a[1].impressions)
      .slice(0, 40)
      .forEach(([k, v]) => say(`| ${primary.has(k) ? `**${k}**` : k} | ${v.impressions} | ${v.clicks} | ${v.variants} |`));
    say('');
  }
  if (missed.length) {
    say(`### ❌ ${missed.length} planned keywords with ZERO impressions`);
    say('');
    if (missedPrimary.length) {
      say(`**${missedPrimary.length} of these are HEAD terms** — the site is built on them:`);
      say('');
      missedPrimary.forEach((k) => say(`- **${k}**`));
      say('');
    }
    const rest = missed.filter((k) => !primary.has(k));
    if (rest.length) {
      say('<details><summary>Long-tail misses</summary>');
      say('');
      rest.forEach((k) => say(`- ${k}`));
      say('');
      say('</details>');
      say('');
    }
    say('> Zero impressions has two causes and they need different fixes: the page');
    say('> is **not indexed** (check Indexing → Pages in GSC), or it is indexed and');
    say('> the keyword simply **has no volume**. Confirm which before rewriting copy.');
    say('');
  }

  // ─── 2. Unplanned winners ───────────────────────────────────────
  const unplanned = seen
    .filter((s) => ![...planned].some((k) => s.q.includes(k)))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);

  if (unplanned.length) {
    say('## 2. Unplanned queries pulling impressions');
    say('');
    say('These were never in the plan but Google is ranking the site for them —');
    say('the cheapest wins available. Fold the good ones into headings and blog topics.');
    say('');
    say('| Query | Impressions | Clicks | Avg position |');
    say('|---|---:|---:|---:|');
    unplanned.forEach((s) => say(`| ${s.keys[0]} | ${s.impressions} | ${s.clicks} | ${s.position.toFixed(1)} |`));
    say('');
  }
}

// ─── 3. Striking distance ─────────────────────────────────────────
const striking = queryRows
  .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 5)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 30);

say(`## ${args.plan ? '3' : '1'}. Striking distance (position 5–20)`);
say('');
say('Already ranking, not yet getting clicks. A dedicated blog post or a stronger');
say('on-page heading moves these fastest — hand them to Hanabi.');
say('');
if (striking.length) {
  say('| Query | Impressions | Clicks | Avg position |');
  say('|---|---:|---:|---:|');
  striking.forEach((r) => say(`| ${r.keys[0]} | ${r.impressions} | ${r.clicks} | ${r.position.toFixed(1)} |`));
} else {
  say('_None yet — normal for a site under ~8 weeks old._');
}
say('');

// ─── 4. Pages with zero impressions ───────────────────────────────
if (args.pages) {
  const pageRows = await queryGsc(['page']);
  const withImpressions = new Set(pageRows.map((r) => r.keys[0].replace(/\/$/, '')));

  async function sitemapUrls(url, depth = 0) {
    if (depth > 2) return [];
    try {
      const xml = await (await fetch(url)).text();
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
      if (/<sitemapindex/i.test(xml)) {
        const nested = await Promise.all(locs.map((l) => sitemapUrls(l, depth + 1)));
        return nested.flat();
      }
      return locs;
    } catch {
      return [];
    }
  }

  const urls = await sitemapUrls(`https://www.${domain.replace(/^www\./, '')}/sitemap.xml`);
  if (urls.length) {
    const dead = urls.filter((u) => !withImpressions.has(u.replace(/\/$/, '')));
    say(`## ${args.plan ? '4' : '2'}. Pages with zero impressions`);
    say('');
    say(`${dead.length} of ${urls.length} sitemap URLs got no impressions in this window.`);
    say('');
    if (dead.length) {
      say('<details><summary>Show URLs</summary>');
      say('');
      dead.slice(0, 200).forEach((u) => say(`- ${u}`));
      if (dead.length > 200) say(`- …and ${dead.length - 200} more`);
      say('');
      say('</details>');
      say('');
      say('> Check a sample in GSC → URL Inspection. Indexed-but-no-impressions is a');
      say('> keyword problem; not-indexed is a crawl/quality problem.');
      say('');
    }
  } else {
    say(`_Could not read https://www.${domain}/sitemap.xml — skipping the page diff._`);
    say('');
  }
}

if (args.out && args.out !== true) {
  writeFileSync(args.out, md.join('\n'));
  console.log(`\n📄 Report → ${args.out}\n`);
}
