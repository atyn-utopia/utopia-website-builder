---
name: keyword-research
description: Verify a Sora seo-plan.md against real Google search volume before the build (pre-build gate, Step B2), and audit it against Search Console impressions after launch (Step 16). Use when a keyword plan needs checking, when a head term looks invented, when picking blog topics from real query data, or when asked whether the site's keywords actually get searched. Internal Utopia only; uses the shared automation account's credentials on this machine.
---

# Keyword Research (pre-build gate + post-launch audit)

Sora writes `seo-plan.md` from model knowledge — **no search-volume data enters the
pipeline anywhere**. Nana writes every H1 from that plan, Kimmy builds every meta
title and slug from it, Hanabi picks blog topics from it. So an invented head term
propagates into the entire site, and nothing catches it until someone opens Search
Console months later.

These two scripts close both ends of that gap.

## Where the scripts live

```
scripts/google-automation/
  keyword-volume.mjs        # pre-build gate  — Google Ads Keyword Planner API
  gsc-keyword-audit.mjs     # post-launch     — Search Console API
  lib/seo-plan.mjs          # shared seo-plan.md keyword extractor
```

They sit alongside the Gloo automation scripts, which share the same
`google-ads-api` + `googleapis` dependencies — run `npm install` in that folder
once per machine. The scripts contain **no secrets**; they read credentials at
runtime from `~/.google-credentials`, which is never in the repo.

Credentials required (both already granted by `oauth-login.mjs`):
- `~/.google-credentials/utopia-ads-token.txt` — Ads developer token
- `~/.google-credentials/utopia-user-oauth.json` — OAuth with `adwords` + `webmasters`

---

## 1. Pre-build gate — `keyword-volume.mjs`

Runs at **Step B2**, between Sora and Nana. Blocking.

```bash
cd scripts/google-automation

# See what will be checked — no API call, no cost
node keyword-volume.mjs --plan <path>/seo-plan.md --list

# The gate. Exit code 1 if any HEAD term is below --min
node keyword-volume.mjs --plan <path>/seo-plan.md --lang ms

# Discovery — what people DO search around a seed
node keyword-volume.mjs --ideas "pakej aqiqah" --lang ms
```

| Flag | Meaning |
|---|---|
| `--plan <path>` | Extract keywords from a Sora `seo-plan.md` |
| `--keywords "a,b,c"` | Explicit list instead of a plan |
| `--ideas "<seed>"` | Discovery mode — returns real keywords by volume |
| `--lang <code>` | `ms` \| `en` \| `zh_CN` … (default `ms`). Resolved live against the API |
| `--geo <cc>` | Country code (default `MY`) |
| `--min <n>` | Volume below this counts as a failure (default `10`) |
| `--top <n>` | Only check the first N keywords |
| `--list` | Print the extracted keywords and exit |
| `--json <path>` | Also write raw results as JSON |
| `--from-webcore --website <d>` | Use the site's stored webcore keywords as the input list |
| `--website <d> --push` | Push verified volumes back to webcore (needs `WEBCORE_API_KEY`) |
| `--dry-run` | With `--push`, print the payload instead of sending it |
| `--replace` | With `--push`, clear the site's existing rows first (default merges) |

### Closing the loop with webcore — `--push`

Verified volumes are only useful if the other agents can reach them. `seo-plan.md`
is a file; webcore's keyword store is a public read. Pushing puts the numbers
where Nana, Kimmy and Hanabi can `GET` them before writing copy:

```bash
export WEBCORE_API_KEY=uwc_...   # server-only, never committed
node keyword-volume.mjs --plan <path>/seo-plan.md --lang ms \
  --website <registered-domain> --push --dry-run   # inspect first
```

- Head terms go to `primary_keywords`, the rest to `secondary_keywords`; only
  keywords at or above `--min` are promoted either way.
- Upserts on `(website, search_word, language)` — verified: a store with 1 row
  went to 8 after pushing 8 (the pre-existing row was updated, not duplicated).
- **`source` is ignored on write.** The script sends `source: 'keyword-planner'`
  but webcore stores every pushed row as `manual`, so there is currently **no way
  to tell Keyword-Planner rows from hand-entered ones** in the store. If that
  distinction matters, ask the webcore admin to honour the field.
- **The public GET is CDN-cached for 300s** (`cache-control: public, max-age=300`).
  Verifying a push immediately will show the *old* data and look like the write
  failed. Add a cache-buster:
  `curl "…/keywords?website=<d>&_cb=$RANDOM"`
- **`--website` must be the exact registered domain**, never the `*.vercel.app`
  URL, or the write orphans and stays invisible.
- **webcore stores only `en` and `ms`.** A `--lang zh_CN` run refuses to push and
  says so; those keywords stay in `seo-plan.md` only.

Going the other way, `--from-webcore` pulls the site's stored keywords and fills
in live volumes — useful when someone has already loaded a Semrush export and you
want current numbers rather than a fresh guess.

### Tiers — this is the part that matters

The script splits keywords into **head** and **long-tail**, and only head terms
can fail the gate:

- **`head`** — from a plan section marked primary/money/head term. Every page
  inherits these. Zero volume here is fatal; stop and fix the plan.
- **`long-tail`** — everything else. Zero volume is normal and fine; the page
  still catches the query. Reported, never blocking.
- **`{location}` templates** — never measured. Low per-city volume is the whole
  point of 150–180 location pages.

If the script warns **"No head-term section found"**, nothing can fail the gate.
Fix the plan's headings (`### 1.2 Primary money keywords`) or pass `--keywords`.

> **`0` does not mean nobody.** Keyword Planner suppresses anything under its
> disclosure threshold, so `0` reads as "under ~10/mo in this market". For a
> long-tail phrase that's expected. For a head term it's still fatal.

### Plan formats the extractor handles

Plans are hand-written and inconsistent. The extractor reads backticked spans,
**bolded** cells, `"quoted"` terms, keyword-columns in tables (any column whose
header matches `/keyword/i`), and plain numbered/bulleted lists inside the
keyword-strategy section. It excludes do-not-chase sections, `{location}`
templates, file paths, and copy strings from the heading-placement maps.

---

## 2. Post-launch audit — `gsc-keyword-audit.mjs`

Runs at **Step 16**, ~60 days after the paid domain goes live. Re-run quarterly.

```bash
node gsc-keyword-audit.mjs --domain <paid-domain> --days 60 \
  --plan <path>/seo-plan.md --pages --out <path>/keyword-audit.md
```

| Flag | Meaning |
|---|---|
| `--domain <d>` | Site domain (required). Prefers the `sc-domain:` property when one exists |
| `--days <n>` | Lookback window (default `60`). GSC needs ~28 days minimum to be useful |
| `--plan <path>` | Compare against a Sora plan — enables sections 1 and 2 |
| `--pages` | Also diff sitemap URLs against pages with impressions |
| `--out <path>` | Write the markdown report |

Passing a domain with no matching property prints every property on the account —
useful for finding the exact `siteUrl` string.

### Reading the report

1. **Planned keywords** — matched by substring, because searchers add words.
   Head terms are bolded.
2. **Planned keywords with ZERO impressions** — the plan missed. Two very
   different causes: **not indexed** (crawl/quality problem — check GSC →
   Indexing → Pages) or **indexed with no volume** (keyword problem). Confirm
   which before rewriting anything.
3. **Unplanned queries with impressions** — the site ranks for these by accident.
   Cheapest wins on the whole list; fold them into headings and hand them to
   Hanabi.
4. **Striking distance (position 5–20)** — already ranking, not yet clicking. One
   targeted blog post moves these fastest.

Empty query data on a young site is normal — GSC needs 2–4 weeks before queries
appear at all.

---

---

## 3. Live heading audit — `heading-audit.mjs`

Read-only, no API key. webcore crawls each site and stores what it actually read
— meta title/description, every H1, every H2, every image alt. That is a better
oracle than grepping source: a component that renders nothing still greps as
present, but a crawl only sees what shipped.

```bash
node heading-audit.mjs --website sewaexcavator.my
node heading-audit.mjs --all --out fleet-heading-audit.md
```

Checks: exactly one H1, exactly one H2, meta title + description present, every
image has alt text, and (advisory) whether the H1 contains a stored primary
keyword.

**Coverage is the limitation, not the script.** As of Aug 2026 webcore had
crawled only 3 of 23 fleet domains, capped at 60 pages each, in one locale
only — so a site with 165 location pages across 3 locales gets a ~12% sample,
and 20 sites report zero pages. **A site missing from the report is uncrawled,
not passing.** Widening this needs the webcore admin to extend the crawl, not a
change here.

**The H2 rule contradicts itself in the docs.** `CLAUDE.md` demands exactly one
H2 per page; Hanabi is specified to write articles as H1→H2→H3→H4, which needs
several. This script exempts `/blog/<slug>` from the single-H2 rule and counts
articles separately — but the contradiction should be settled in `CLAUDE.md`
rather than re-guessed by every tool.

---

## Feeding results back

The gate and the audit are only worth running if their output reaches the plan.
After either one, edit `projects/{slug}/seo-plan.md` so Nana, Kimmy and Hanabi
inherit verified terms — and so the next site in the same vertical starts from
measured keywords instead of a fresh guess.
