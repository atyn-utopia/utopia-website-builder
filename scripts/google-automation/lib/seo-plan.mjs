// Shared helpers for the keyword tooling (keyword-volume.mjs, gsc-keyword-audit.mjs).
//
// The one job here is turning a Sora `seo-plan.md` into a flat list of keyword
// strings that are actually worth measuring. That is narrower than "every
// backticked span in the file", because a Sora plan also contains:
//
//   · heading/copy strings      (§3, §4 placement maps) — copy, not keywords
//   · a do-NOT-chase list       (§1.6)                  — deliberately excluded
//   · `{location}` templates    (location-page pattern) — can't be measured literally
//   · file paths, URLs, config  (everywhere)            — not keywords at all
//
// So extraction is scoped two ways: the "Keyword strategy" section, plus any
// table column whose header says "keyword" (which catches the blog plan's
// "Target keyword" column further down the doc).

import { readFileSync } from 'node:fs';

/**
 * Strip markdown emphasis before validating. Plans are inconsistent about this:
 * some mark keywords with backticks (`cat rumah`), others bold them
 * (**cat rumah**) — both are keywords and both must survive extraction.
 */
function stripEmphasis(s) {
  return String(s)
    .replace(/\*\*/g, '')
    .replace(/(^|\s)\*(\S[^*]*)\*(?=\s|$)/g, '$1$2')
    .replace(/`/g, '')                   // list items keep their backticks after splitting
    .replace(/^["'“”]+|["'“”]+$/g, '')   // some plans quote keywords instead
    .trim();
}

/** Inline-code spans that are clearly not keywords. */
function looksLikeKeyword(s) {
  if (!s || s.length < 3 || s.length > 80) return false;
  if (/[/\\<>()[\]=;:@#$%^*|"']/.test(s)) return false;   // paths, code, URLs
  if (/\.(md|ts|tsx|js|mjs|json|css|xml|png|jpg|svg)$/i.test(s)) return false;
  if (/^https?:/i.test(s)) return false;
  if (/_/.test(s)) return false;                          // snake_case identifiers
  if (/[a-z][A-Z]/.test(s)) return false;                 // camelCase identifiers
  if (/^\d+\.\s/.test(s)) return false;                   // "1. pilih pakej..." step labels
  if (s.trim().split(/\s+/).length > 8) return false;     // a sentence, not a keyword
  if (!/[a-z一-鿿]/i.test(s)) return false;       // must have letters
  return true;
}

/**
 * Headings that mark a subsection as "keywords we do NOT target".
 * `demoted` / `no measurable volume` matter as much as `do not chase`: after a
 * volume check, dead terms get moved into such a section, and they must stop
 * counting as head terms or the gate can never be made to pass.
 */
const NEGATIVE_HEADING = /do\s*not\s*chase|deliberately\s*not|not\s*target|avoid|exclude|never\s*use|demoted|no\s*(measurable\s*)?volume|zero\s*volume/i;

/**
 * Headings that mark head/money terms. These are the ones the gate blocks on:
 * every page inherits them, so a dead head term is a rebuild. Long-tail and
 * blog keywords sitting at zero volume is normal and only worth reporting.
 */
const PRIMARY_HEADING = /primary|money|head\s*term/i;

/** Split markdown into { heading, level, lines } blocks. */
function sections(md) {
  const out = [];
  let cur = { heading: '', level: 0, lines: [] };
  for (const line of md.split('\n')) {
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (m) {
      out.push(cur);
      cur = { heading: m[2].trim(), level: m[1].length, lines: [] };
    } else {
      cur.lines.push(line);
    }
  }
  out.push(cur);
  return out;
}

/** Pull the cells of any column whose header matches /keyword/i. */
function keywordColumnCells(lines) {
  const cells = [];
  const rows = [];
  for (const line of lines) {
    if (/^\s*\|/.test(line)) rows.push(line);
    else if (rows.length) { harvest(rows.splice(0)); }
  }
  if (rows.length) harvest(rows);

  function harvest(tbl) {
    if (tbl.length < 3) return;                       // header + separator + >=1 row
    const split = (l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
    const header = split(tbl[0]);
    const idx = header.map((h, i) => (/keyword/i.test(h) ? i : -1)).filter((i) => i >= 0);
    if (!idx.length) return;
    for (const row of tbl.slice(2)) {
      const c = split(row);
      for (const i of idx) if (c[i]) cells.push(c[i]);
    }
  }
  return cells;
}

/** Every inline-code span on a set of lines. */
function codeSpans(lines) {
  return lines.flatMap((l) => [...l.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim()));
}

/**
 * Plain-text list items — a third plan format, alongside backticks and bold:
 *
 *   1. cold room rental Malaysia
 *   - Variants: cold room for rent Malaysia, mobile cold room rental
 *
 * Only safe inside the keyword-strategy section, where every list item is a
 * keyword. The leading `Label:` is dropped and comma/slash lists are split.
 */
function listItems(lines) {
  const out = [];
  for (const line of lines) {
    const m = /^\s*(?:\d+[.)]|[-*•])\s+(.*)$/.exec(line);
    if (!m) continue;
    const label = /^([A-Z][\w\s-]{0,28}):\s*/.exec(m[1]);
    const body = label ? m[1].slice(label[0].length) : m[1];
    // A "Variants:" / "Use-case long-tail:" bullet inside a money-keyword
    // section is still a keyword, but it is not a head term.
    const demoted = !!label && /long-?tail|variant|pattern|use-?case|location/i.test(label[1]);
    for (const part of body.split(/[,、·]|\s\/\s/)) {
      const text = part.trim();
      if (text) out.push({ text, demoted });
    }
  }
  return out;
}

/**
 * Extract measurable keywords from a Sora seo-plan.md.
 *
 * @returns {{ keywords: string[], primary: string[], templates: string[],
 *             excluded: string[], sources: string[] }}
 *   keywords  — send these to the Keyword Planner
 *   primary   — the subset that are head/money terms (the gate blocks on these)
 *   templates — contain `{location}`; expected-low-volume by design, never gated
 *   excluded  — matched a do-NOT-chase subsection
 */
export function extractKeywordsFromPlan(path) {
  const md = readFileSync(path, 'utf8').replace(/```[\s\S]*?```/g, '');
  const secs = sections(md);

  const hits = new Set();
  const primary = new Set();
  const excluded = new Set();
  const sources = [];

  // Track whether we're inside the "Keyword strategy" H2, whether the current
  // H3 is a negative (do-not-chase) list, and whether it holds head terms.
  let inStrategy = false;
  let negative = false;
  let isPrimary = false;

  for (const s of secs) {
    if (s.level <= 2 && s.heading) {
      // Deliberately narrow: "2. Page hierarchy & keyword ownership" also
      // contains "keyword" but holds copy strings, not keywords.
      inStrategy = /keyword\s+(strategy|cluster|plan)|primary\s+keyword|money\s+keyword/i.test(s.heading);
      negative = NEGATIVE_HEADING.test(s.heading);
      isPrimary = PRIMARY_HEADING.test(s.heading);
    } else if (s.level === 3) {
      negative = NEGATIVE_HEADING.test(s.heading);
      isPrimary = PRIMARY_HEADING.test(s.heading);
    }

    const spans = inStrategy ? codeSpans(s.lines) : [];
    const cols = keywordColumnCells(s.lines).flatMap((c) => {
      const inner = [...c.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
      return inner.length ? inner : [c];
    });
    // Bolded keywords in prose count too, but only inside the strategy section —
    // elsewhere bold is used for emphasis on ordinary words.
    const bold = inStrategy
      ? s.lines.flatMap((l) => [...l.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1].trim()))
      : [];
    const items = inStrategy ? listItems(s.lines) : [];

    // `demoted` items stay keywords but never count as head terms.
    const demoted = new Set(items.filter((i) => i.demoted).map((i) => stripEmphasis(i.text).toLowerCase()));

    const found = [...new Set([...spans, ...cols, ...bold, ...items.map((i) => i.text)])]
      .map(stripEmphasis)
      .filter(looksLikeKeyword);
    if (!found.length) continue;

    if (negative) { found.forEach((f) => excluded.add(f.toLowerCase())); continue; }
    found.forEach((f) => {
      const k = f.toLowerCase();
      hits.add(k);
      if (isPrimary && !demoted.has(k)) primary.add(k);
    });
    if (found.length) sources.push(`${s.heading || '(preamble)'} → ${found.length}`);
  }

  // A keyword named in a do-not-chase list stays out even if mentioned elsewhere.
  for (const e of excluded) { hits.delete(e); primary.delete(e); }

  const notTemplate = (k) => !/[{}]/.test(k);
  const all = [...hits];

  return {
    keywords: all.filter(notTemplate),
    primary: [...primary].filter(notTemplate),
    templates: all.filter((k) => /[{}]/.test(k)),
    excluded: [...excluded],
    sources,
  };
}

// Malay function words + high-frequency nouns that rarely appear in English
// keywords. Deliberately not domain-specific — this runs across every project.
const MS_MARKERS = new Set([
  'sewa', 'harga', 'murah', 'dengan', 'tanpa', 'untuk', 'cara', 'panduan', 'pilih',
  'yang', 'sesuai', 'kali', 'pertama', 'tapak', 'bina', 'kontraktor', 'tan',
  'bulanan', 'harian', 'mingguan', 'kos', 'khidmat', 'pakej', 'perkhidmatan',
  'terbaik', 'berdekatan', 'di', 'ke', 'dan', 'atau', 'ialah', 'adalah', 'boleh',
  'beli', 'jual', 'kedai', 'servis', 'baiki', 'pasang', 'tempah', 'bilik',
  'rumah', 'kereta', 'motor', 'anak', 'lelaki', 'perempuan', 'siap', 'masak',
  'hantar', 'agih', 'sembelih', 'kambing', 'ekor', 'hukum', 'doa', 'majlis',
]);

// Tokens that are unambiguously English in this fleet's keyword space.
const EN_MARKERS = new Set([
  'rental', 'rent', 'price', 'cheap', 'daily', 'monthly', 'weekly', 'hourly',
  'with', 'for', 'how', 'the', 'right', 'guide', 'ton', 'construction', 'site',
  'contractors', 'rate', 'service', 'services', 'best', 'near', 'buy', 'sale',
  'affordable', 'package', 'delivery', 'installation', 'repair', 'company',
]);

/**
 * Guess a keyword's language.
 *
 * Returns 'zh' for anything containing CJK, 'ms' when a Malay marker is present,
 * 'en' when an English marker is present, and null when the phrase is
 * language-neutral (e.g. "volvo ec200 vs ec400") so the caller can decide.
 */
export function guessLanguage(keyword) {
  const s = String(keyword).toLowerCase();
  if (/[㐀-鿿豈-﫿]/.test(s)) return 'zh';
  const words = s.split(/[\s-]+/).filter(Boolean);
  const ms = words.some((w) => MS_MARKERS.has(w));
  const en = words.some((w) => EN_MARKERS.has(w));
  if (ms && !en) return 'ms';
  if (en && !ms) return 'en';
  if (ms && en) return 'ms';   // code-switched ("sewa excavator rental") reads as MS
  return null;                  // neutral — brand/model strings, numbers
}

/** Normalise a keyword/query for cross-source comparison. */
export function normalizeKeyword(s) {
  return String(s).toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Parse `--flag value` / `--flag` CLI args into an object. */
export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i++; }
  }
  return out;
}

/** YYYY-MM-DD for a Date, in UTC. */
export function ymd(d) {
  return d.toISOString().slice(0, 10);
}
