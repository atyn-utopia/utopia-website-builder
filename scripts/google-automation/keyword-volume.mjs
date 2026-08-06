// Pre-build keyword volume gate.
//
// Sora invents keywords from model knowledge — nothing in the pipeline checks
// whether anyone actually searches them. This script asks the Google Ads
// Keyword Planner API for real historical volume BEFORE Nana writes any copy,
// so a dead head term is caught while it still costs one string change instead
// of a full site rebuild + 301 map.
//
// Usage:
//   node keyword-volume.mjs --plan ../path/to/seo-plan.md --lang ms
//   node keyword-volume.mjs --keywords "pakej aqiqah,aqiqah murah" --lang ms
//   node keyword-volume.mjs --ideas "pakej aqiqah" --lang ms          # discovery
//   node keyword-volume.mjs --plan plan.md --lang ms --json out.json
//
// Flags:
//   --plan <path>       extract keywords from a Sora seo-plan.md
//   --keywords "a,b,c"  explicit comma-separated list
//   --ideas "<seed>"    discovery mode: what DOES get searched around this seed
//   --lang <code>       language constant code (ms | en | zh_CN ...). default: ms
//   --geo <cc>          country code. default: MY
//   --min <n>           volume below this counts as a fail. default: 10
//   --list              print the extracted keywords and exit (no API call)
//   --json <path>       also write the raw results as JSON
//
// Exit code 1 when any keyword lands under --min, so this works as a real gate.
//
// Prerequisites: same as ads-import-conversion.mjs —
//   ~/.google-credentials/utopia-ads-token.txt   (Ads developer token)
//   ~/.google-credentials/utopia-user-oauth.json (OAuth w/ adwords scope)

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { extractKeywordsFromPlan, parseArgs, guessLanguage } from './lib/seo-plan.mjs';
import { getKeywords, pushKeywords, toWebcoreLanguage, getApiKey } from './lib/webcore.mjs';

const args = parseArgs(process.argv.slice(2));

const LANG = args.lang && args.lang !== true ? String(args.lang) : 'ms';
const GEO = args.geo && args.geo !== true ? String(args.geo).toUpperCase() : 'MY';
const MIN = args.min && args.min !== true ? Number(args.min) : 10;
const CUSTOMER_ID = args['customer-id'] && args['customer-id'] !== true
  ? String(args['customer-id']).replace(/-/g, '')
  : '1933757591'; // Utopia central account (direct admin — no MCC hop needed)

// ─── Collect the keyword list ─────────────────────────────────────
let keywords = [];
let source = '';
let planMeta = null;

const WEBSITE = args.website && args.website !== true ? String(args.website) : null;

if (args['from-webcore']) {
  if (!WEBSITE) {
    console.error('❌ --from-webcore needs --website <domain>');
    process.exit(1);
  }
  const stored = await getKeywords(WEBSITE);
  keywords = (stored.keywords ?? []).map((k) => k.search_word).filter(Boolean);
  planMeta = {
    keywords,
    primary: stored.primary_keywords ?? [],
    templates: [],
    excluded: [],
    sources: [`webcore (${keywords.length} stored rows)`],
  };
  source = `webcore keywords store for ${WEBSITE}`;
  if (!keywords.length) {
    console.error(`❌ webcore has no keyword rows for ${WEBSITE}. Use --plan or --keywords instead.`);
    process.exit(1);
  }
} else if (args.plan && args.plan !== true) {
  if (!existsSync(args.plan)) {
    console.error(`❌ Plan file not found: ${args.plan}`);
    process.exit(1);
  }
  const r = extractKeywordsFromPlan(args.plan);
  keywords = r.keywords;
  planMeta = r;
  source = args.plan;
} else if (args.keywords && args.keywords !== true) {
  keywords = String(args.keywords).split(',').map((s) => s.trim()).filter(Boolean);
  source = 'CLI --keywords';
} else if (!args.ideas) {
  console.error('Usage: node keyword-volume.mjs (--plan <path> | --keywords "a,b" | --ideas "<seed>" | --from-webcore --website <d>)');
  console.error('       [--lang ms] [--geo MY] [--min 10] [--top N] [--list] [--json <path>]');
  console.error('       [--website <domain> --push]   push verified volumes back to webcore');
  process.exit(1);
}

if (args.push && !WEBSITE) {
  console.error('❌ --push needs --website <domain> (the exact registered domain, never the *.vercel.app URL)');
  process.exit(1);
}
if (args.push && !getApiKey()) {
  console.error('❌ --push needs WEBCORE_API_KEY in the environment.');
  console.error('   export WEBCORE_API_KEY=uwc_...    (server-only; never commit it)');
  process.exit(1);
}

// `--only <lang>` keeps just the keywords written in that language. A plan
// usually holds MS + EN + ZH in one file; measuring English phrases under Malay
// targeting (and storing them tagged `ms`) would put wrong data in webcore.
//
// Language-neutral phrases (brand/model strings like "volvo ec200 vs ec400")
// belong to exactly ONE run, or they'd be pushed twice under two languages.
// They ride with `--neutral` (default `ms`, the fleet's default locale).
if (args.only && args.only !== true) {
  const want = String(args.only).toLowerCase();
  const neutralHome = args.neutral && args.neutral !== true ? String(args.neutral).toLowerCase() : 'ms';
  const before = keywords.length;
  const neutral = [];
  keywords = keywords.filter((k) => {
    const g = guessLanguage(k);
    if (g === null) { if (want === neutralHome) { neutral.push(k); return true; } return false; }
    return g === want;
  });
  const suffix = neutral.length ? `, incl. ${neutral.length} neutral` : '';
  console.log(`\n🈯 --only ${want}: ${keywords.length}/${before} keywords${suffix}`);
}

// `--top N` keeps the gate on head terms instead of every long-tail phrase.
if (args.top && args.top !== true) keywords = keywords.slice(0, Number(args.top));

if (args.list) {
  console.log(`\n📋 ${keywords.length} measurable keywords from ${source}:\n`);
  keywords.forEach((k, i) => console.log(`  ${String(i + 1).padStart(3)}. ${k}`));
  if (planMeta) {
    if (planMeta.templates.length) {
      console.log(`\n  🗺  ${planMeta.templates.length} location templates (not gated — low volume is by design):`);
      planMeta.templates.forEach((k) => console.log(`      · ${k}`));
    }
    if (planMeta.excluded.length) {
      console.log(`\n  🚫 ${planMeta.excluded.length} excluded by the plan's do-not-chase list:`);
      planMeta.excluded.forEach((k) => console.log(`      · ${k}`));
    }
    console.log(`\n  Sections: ${planMeta.sources.join(' · ')}`);
  }
  console.log('\nRe-run without --list to fetch volumes.\n');
  process.exit(0);
}

// ─── Credentials ──────────────────────────────────────────────────
const TOKEN_FILE = join(homedir(), '.google-credentials', 'utopia-ads-token.txt');
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  ?? (existsSync(TOKEN_FILE) ? readFileSync(TOKEN_FILE, 'utf8').trim() : null);
if (!developerToken) {
  console.error('❌ No Google Ads developer token at ~/.google-credentials/utopia-ads-token.txt');
  process.exit(1);
}

const OAUTH_PATH = join(homedir(), '.google-credentials', 'utopia-user-oauth.json');
if (!existsSync(OAUTH_PATH)) {
  console.error('❌ No user OAuth token at ~/.google-credentials/utopia-user-oauth.json');
  console.error('   Run `node oauth-login.mjs` first (needs the adwords scope).');
  process.exit(1);
}
const oauth = JSON.parse(readFileSync(OAUTH_PATH, 'utf8'));

const { GoogleAdsApi, enums } = await import('google-ads-api');

const client = new GoogleAdsApi({
  client_id: oauth.client_id,
  client_secret: oauth.client_secret,
  developer_token: developerToken,
});
const customer = client.Customer({
  customer_id: CUSTOMER_ID,
  refresh_token: oauth.refresh_token,
});

// ─── Resolve language + geo constants (never hardcode the IDs) ─────
async function resolveLanguage(code) {
  const rows = await customer.query(`
    SELECT language_constant.id, language_constant.code, language_constant.name
    FROM language_constant
    WHERE language_constant.code = '${code}'
  `);
  if (!rows.length) {
    const all = await customer.query(`
      SELECT language_constant.code, language_constant.name
      FROM language_constant WHERE language_constant.targetable = true
    `);
    console.error(`❌ Unknown language code "${code}". Targetable codes include:`);
    console.error('   ' + all.map((r) => r.language_constant.code).sort().join(', '));
    process.exit(1);
  }
  return rows[0].language_constant;
}

async function resolveGeo(countryCode) {
  const rows = await customer.query(`
    SELECT geo_target_constant.id, geo_target_constant.name,
           geo_target_constant.country_code, geo_target_constant.target_type
    FROM geo_target_constant
    WHERE geo_target_constant.country_code = '${countryCode}'
      AND geo_target_constant.target_type = 'Country'
      AND geo_target_constant.status = 'ENABLED'
  `);
  if (!rows.length) {
    console.error(`❌ No country geo target for "${countryCode}".`);
    process.exit(1);
  }
  return rows[0].geo_target_constant;
}

const lang = await resolveLanguage(LANG);
const geo = await resolveGeo(GEO);

console.log(`\n🔎 Keyword Planner — ${geo.name} (${geo.id}) · ${lang.name} (${lang.id})`);

// ─── Discovery mode ───────────────────────────────────────────────
if (args.ideas && args.ideas !== true) {
  const seed = String(args.ideas);
  console.log(`💡 Ideas around "${seed}"\n`);
  const res = await customer.keywordPlanIdeas.generateKeywordIdeas({
    customer_id: CUSTOMER_ID,
    language: `languageConstants/${lang.id}`,
    geo_target_constants: [`geoTargetConstants/${geo.id}`],
    keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH,
    include_adult_keywords: false,
    keyword_seed: { keywords: seed.split(',').map((s) => s.trim()) },
  });

  const rows = (res.results ?? res ?? [])
    .map((r) => ({
      keyword: r.text,
      volume: Number(r.keyword_idea_metrics?.avg_monthly_searches ?? 0),
      competition: r.keyword_idea_metrics?.competition ?? 'UNKNOWN',
    }))
    .filter((r) => r.volume > 0)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 60);

  const w = Math.max(20, ...rows.map((r) => r.keyword.length));
  console.log(`  ${'KEYWORD'.padEnd(w)}  ${'VOL/MO'.padStart(8)}  COMPETITION`);
  console.log(`  ${'-'.repeat(w)}  ${'-'.repeat(8)}  ${'-'.repeat(11)}`);
  for (const r of rows) {
    console.log(`  ${r.keyword.padEnd(w)}  ${String(r.volume).padStart(8)}  ${compLabel(r.competition)}`);
  }
  console.log(`\n  ${rows.length} ideas with real volume. Feed the top ones back into Sora's plan.\n`);
  if (args.json && args.json !== true) writeFileSync(args.json, JSON.stringify(rows, null, 2));
  process.exit(0);
}

// ─── Validation mode: historical metrics for exact keywords ───────
console.log(`📋 ${keywords.length} keywords from ${source}\n`);

if (planMeta && !planMeta.primary.length) {
  console.log('⚠️  No head-term section found in this plan, so nothing can fail the gate.');
  console.log('   Give the plan an H2/H3 like "Primary money keywords" (or pass');
  console.log('   --keywords with the head terms) to make this blocking.\n');
}

// The API caps a single historical-metrics request; chunk defensively.
const CHUNK = 500;
const results = [];
for (let i = 0; i < keywords.length; i += CHUNK) {
  const batch = keywords.slice(i, i + CHUNK);
  const res = await customer.keywordPlanIdeas.generateKeywordHistoricalMetrics({
    customer_id: CUSTOMER_ID,
    keywords: batch,
    language: `languageConstants/${lang.id}`,
    geo_target_constants: [`geoTargetConstants/${geo.id}`],
    keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH,
    include_adult_keywords: false,
  });
  results.push(...(res.results ?? []));
}

function compLabel(c) {
  if (typeof c === 'number') return ['UNSPECIFIED', 'UNKNOWN', 'LOW', 'MEDIUM', 'HIGH'][c] ?? String(c);
  return String(c ?? 'UNKNOWN');
}

/** Compare the last 3 months against the 3 before them. */
function trend(monthly) {
  if (!monthly || monthly.length < 6) return '';
  const n = monthly.map((m) => Number(m.monthly_searches ?? 0));
  const recent = n.slice(-3).reduce((a, b) => a + b, 0);
  const prior = n.slice(-6, -3).reduce((a, b) => a + b, 0);
  if (!prior) return '';
  const delta = ((recent - prior) / prior) * 100;
  if (delta > 20) return `↑ +${Math.round(delta)}%`;
  if (delta < -20) return `↓ ${Math.round(delta)}%`;
  return '→ flat';
}

// The API normalises what it echoes back — notably it space-separates CJK
// tokens (`aqiqah 配套价格` comes back as `aqiqah 配套 价格`). Match on a
// whitespace-stripped key so those don't look like missing results.
const matchKey = (s) => String(s).toLowerCase().replace(/\s+/g, '');

const byKey = new Map();
for (const r of results) {
  const m = r.keyword_metrics ?? {};
  byKey.set(matchKey(r.text), {
    volume: Number(m.avg_monthly_searches ?? 0),
    competition: compLabel(m.competition),
    trend: trend(m.monthly_search_volumes),
  });
}

// The input list stays authoritative — one row per keyword we asked about.
const primarySet = new Set((planMeta?.primary ?? []).map(matchKey));
const rows = keywords.map((k) => {
  const hit = byKey.get(matchKey(k));
  return {
    keyword: k,
    isPrimary: primarySet.has(matchKey(k)),
    volume: hit?.volume ?? 0,
    competition: hit?.competition ?? 'UNKNOWN',
    trend: hit?.trend ?? '',
  };
}).sort((a, b) => (b.isPrimary - a.isPrimary) || (b.volume - a.volume));

const w = Math.max(20, ...rows.map((r) => r.keyword.length));
console.log(`  ${'STATUS'.padEnd(6)} ${'TIER'.padEnd(9)} ${'KEYWORD'.padEnd(w)}  ${'VOL/MO'.padStart(8)}  ${'COMP'.padEnd(7)}  TREND`);
console.log(`  ${'-'.repeat(6)} ${'-'.repeat(9)} ${'-'.repeat(w)}  ${'-'.repeat(8)}  ${'-'.repeat(7)}  ${'-'.repeat(9)}`);

const deadPrimary = [];
const deadOther = [];
for (const r of rows) {
  let status = '✅';
  if (r.volume < MIN) {
    status = r.isPrimary ? '❌' : '⚠️ ';
    (r.isPrimary ? deadPrimary : deadOther).push(r);
  }
  const tier = r.isPrimary ? 'head' : 'long-tail';
  console.log(`  ${status.padEnd(6)} ${tier.padEnd(9)} ${r.keyword.padEnd(w)}  ${String(r.volume).padStart(8)}  ${r.competition.padEnd(7)}  ${r.trend}`);
}

const viable = rows.length - deadPrimary.length - deadOther.length;
console.log('');
console.log(`  ✅ ${viable} above ${MIN}/mo   ⚠️  ${deadOther.length} long-tail below threshold   ❌ ${deadPrimary.length} HEAD terms below threshold`);
console.log(`
  ℹ️  Keyword Planner reports 0 for anything under its disclosure threshold, so
     "0" means "under ~10/mo in ${geo.name}", not literally nobody. For a long-tail
     or blog keyword that is normal and fine — the page still catches the query.
     For a HEAD term it is fatal: every page in the site inherits it.`);

if (args.json && args.json !== true) {
  writeFileSync(args.json, JSON.stringify({ language: lang, geo, min: MIN, rows }, null, 2));
  console.log(`\n  📄 JSON → ${args.json}`);
}

// ─── Push verified volumes back to webcore ────────────────────────
// Without this the numbers live only in seo-plan.md, where no other agent can
// reach them. webcore's keyword store is publicly readable, so pushing makes
// the verified set available to Nana, Kimmy and Hanabi before they write copy.
if (args.push) {
  const wcLang = toWebcoreLanguage(LANG);
  if (!wcLang) {
    console.log(`\n⚠️  webcore stores only 'en' and 'ms' keywords — skipping the push for --lang ${LANG}.`);
    console.log('   Those keywords stay in seo-plan.md only.');
  } else {
    const pushRows = rows.map((r) => ({
      search_word: r.keyword,
      language: wcLang,
      volume: r.volume,
      source: 'keyword-planner',
    }));
    const primary = rows.filter((r) => r.isPrimary && r.volume >= MIN).map((r) => r.keyword);
    const secondary = rows.filter((r) => !r.isPrimary && r.volume >= MIN).map((r) => r.keyword);

    console.log(`\n📤 Pushing ${pushRows.length} rows to webcore for ${WEBSITE} (lang=${wcLang})…`);
    if (args['dry-run']) {
      console.log('   --dry-run: nothing sent. Payload preview:');
      console.log('   ' + JSON.stringify({ website: WEBSITE, rows: pushRows.slice(0, 3), primary_keywords: primary, secondary_keywords: secondary }, null, 2).replace(/\n/g, '\n   '));
    } else {
      const res = await pushKeywords(WEBSITE, {
        rows: pushRows,
        primary_keywords: primary,
        secondary_keywords: secondary,
        mode: args.replace ? 'replace' : undefined,
      }, getApiKey());
      console.log(`   ✅ saved=${res?.saved ?? '?'} truncated=${res?.truncated ?? 0}`);
      // The public GET is CDN-cached for 300s — verifying without a cache-buster
      // returns the pre-write state and looks like the push silently failed.
      console.log(`   Verify (cache-busted — the plain URL is cached 300s):`);
      console.log(`     curl -s "https://webcore.utopiaai.my/api/public/keywords?website=${WEBSITE}&_cb=$RANDOM"`);
    }
  }
}

if (deadPrimary.length) {
  console.log(`\n❌ GATE FAILED — ${deadPrimary.length} head term(s) below ${MIN}/mo:`);
  deadPrimary.forEach((r) => console.log(`     · ${r.keyword}`));
  console.log(`
  Fix these in seo-plan.md BEFORE Nana writes copy — they set every H1, meta
  title and slug on the site. Run \`--ideas "<seed>"\` to find what people
  actually search instead.\n`);
  process.exit(1);
}

console.log('\n✅ Gate passed — every head term has real search volume.\n');
