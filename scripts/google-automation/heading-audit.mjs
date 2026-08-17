// Fleet heading + metadata audit, against the LIVE site.
//
// webcore crawls every page and stores what it actually read: meta title,
// meta description, the H1s, the H2s, and every image's alt text. That is a
// far better oracle than grepping source — the wizard checklist can pass on a
// component that renders nothing, but a crawl only sees what shipped.
//
// Checks (from CLAUDE.md → Frontend Design Rules):
//   · exactly one H1 per page
//   · exactly one H2 per page
//   · meta title + meta description present
//   · every image has non-empty alt text
//   · (advisory) the H1 contains a primary keyword
//
// Blog ARTICLES are bucketed separately — see the note printed at the end.
//
// Usage:
//   node heading-audit.mjs --website sewaexcavator.my
//   node heading-audit.mjs --all
//   node heading-audit.mjs --all --out ../../fleet-heading-audit.md
//
// Read-only: no API key needed, nothing is written to webcore.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getKeywords } from './lib/webcore.mjs';
import { parseArgs } from './lib/seo-plan.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));

function fleetDomains() {
  const dir = join(HERE, 'configs');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    try {
      const cfg = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      if (cfg.domain) out.push(cfg.domain);
    } catch { /* skip unreadable config */ }
  }
  return [...new Set(out)].sort();
}

const websites = args.all
  ? fleetDomains()
  : args.website && args.website !== true ? [String(args.website)] : [];

if (!websites.length) {
  console.error('Usage: node heading-audit.mjs (--website <domain> | --all) [--out <path>]');
  console.error(`\n  --all covers the ${fleetDomains().length} domains in configs/.`);
  process.exit(1);
}

/** Blog articles legitimately carry several H2s (Hanabi writes H1→H2→H3→H4). */
const isBlogArticle = (path) => /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?blog\/.+/.test(path);

const md = [];
const say = (s = '') => { console.log(s); md.push(s); };

say('# Fleet heading audit');
say('');
say(`Source: webcore's crawl of the live sites · ${websites.length} site(s)`);
say('');

const fleet = [];

for (const website of websites) {
  let data;
  try {
    data = await getKeywords(website);
  } catch (e) {
    say(`## ${website}`);
    say('');
    say(`_Could not read: ${e.message}_`);
    say('');
    continue;
  }

  const pages = data.pages ?? [];
  if (!pages.length) {
    say(`## ${website}`);
    say('');
    say('_No crawled pages yet — webcore has not indexed this site._');
    say('');
    fleet.push({ website, pages: 0, issues: 0, articles: 0 });
    continue;
  }

  const primary = (data.primary_keywords ?? []).map((k) => k.toLowerCase());
  const issues = [];
  let articles = 0;
  let h1KeywordHits = 0;
  let h1KeywordEligible = 0;

  for (const p of pages) {
    const h1 = p.h1 ?? [];
    const h2 = p.h2 ?? [];
    const images = p.images ?? [];
    const article = isBlogArticle(p.path);
    if (article) articles++;

    const at = `${p.path} [${p.lang ?? '?'}]`;

    if (h1.length !== 1) issues.push({ at, rule: 'one H1', detail: `${h1.length} H1` });
    // Articles are exempt from the single-H2 rule; the listing page is not.
    if (!article && h2.length !== 1) issues.push({ at, rule: 'one H2', detail: `${h2.length} H2` });

    if (!p.meta_title) issues.push({ at, rule: 'meta title', detail: 'missing' });
    if (!p.meta_description) issues.push({ at, rule: 'meta description', detail: 'missing' });

    const noAlt = images.filter((i) => !i.alt || !String(i.alt).trim()).length;
    if (noAlt) issues.push({ at, rule: 'image alt', detail: `${noAlt}/${images.length} without alt` });

    if (primary.length && h1.length) {
      h1KeywordEligible++;
      if (h1.some((h) => primary.some((k) => h.toLowerCase().includes(k)))) h1KeywordHits++;
    }
  }

  fleet.push({ website, pages: pages.length, issues: issues.length, articles });

  say(`## ${website}`);
  say('');
  say(`${pages.length} pages crawled (${articles} blog articles) · **${issues.length} issues**`);
  if (primary.length) {
    say(`Primary keyword in H1: ${h1KeywordHits}/${h1KeywordEligible} pages`);
  } else {
    say('_No primary keywords stored in webcore — the H1-keyword check was skipped._');
  }
  say('');

  if (issues.length) {
    // Group by rule so the shape of the problem is visible at a glance.
    const byRule = new Map();
    for (const i of issues) {
      if (!byRule.has(i.rule)) byRule.set(i.rule, []);
      byRule.get(i.rule).push(i);
    }
    say('| Rule | Pages affected | Examples |');
    say('|---|---:|---|');
    for (const [rule, list] of [...byRule.entries()].sort((a, b) => b[1].length - a[1].length)) {
      const ex = list.slice(0, 3).map((i) => `\`${i.at}\` (${i.detail})`).join('<br>');
      say(`| ${rule} | ${list.length} | ${ex} |`);
    }
    say('');
  }
}

if (websites.length > 1) {
  say('## Fleet summary');
  say('');
  say('| Site | Pages | Articles | Issues |');
  say('|---|---:|---:|---:|');
  for (const f of [...fleet].sort((a, b) => b.issues - a.issues)) {
    say(`| ${f.website} | ${f.pages} | ${f.articles} | ${f.issues} |`);
  }
  say('');
}

say('---');
say('');
say('> **On the H2 rule.** `CLAUDE.md` requires exactly one H2 per page, but');
say('> Hanabi is specified to write articles as H1→H2→H3→H4, which needs several.');
say('> This audit exempts `/blog/<slug>` pages from the single-H2 rule and counts');
say('> them separately. The two rules genuinely contradict — worth settling in');
say('> `CLAUDE.md` rather than letting each script guess.');
say('');
say('> A page missing from this report is a page webcore has not crawled, not a');
say('> page that passed.');

if (args.out && args.out !== true) {
  writeFileSync(args.out, md.join('\n'));
  console.log(`\n📄 Report → ${args.out}`);
}
