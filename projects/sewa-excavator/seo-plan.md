# sewa-excavator — SEO Plan

> **Author:** Sora (SEO Strategist)
> **Project:** Abang Excavator — Sewa Excavator No.1 Malaysia
> **Domain:** `sewa-excavator.vercel.app`
> **Default locale:** `ms` (Bahasa Melayu) — `localePrefix: 'always'`
> **Locales:** `ms`, `en`, `zh`
> **Reference architecture:** `projects/sewa-excavator/architecture.md`
> **Reference location set:** `projects/skylift-malaysia/config/locations.ts` (adapted)

This document is the source of truth for Nana (copywriter), Kimmy (technical SEO + i18n), and Hanabi (blog writer). Every keyword, slug, title template, and internal link below is to be implemented exactly as specified.

---

## 1. Keyword Map

> **Volumes measured 2026-08-06** — Google Ads Keyword Planner, geo Malaysia (2458),
> avg monthly searches. Verify with
> `node scripts/google-automation/keyword-volume.mjs --plan <this file> --lang ms`.
> Pushed to webcore (`GET /api/public/keywords?website=sewaexcavator.my`).
>
> The original "Volume tier" column was an estimate written without data, and it was
> wrong often enough to matter: **15 of 22 Malay head terms had no measurable volume**,
> including almost the entire product line. Those are demoted below, and the terms
> people actually search are added in §1.1b.
>
> `0` means "under Keyword Planner's disclosure threshold (~10/mo in MY)", not
> literally nobody. That is fine for a long-tail phrase and fatal for a head term.

### 1.1 Bahasa Melayu (`ms`) — primary market keyword set

**Head terms — these carry the H1, meta title and slugs.**

| Keyword | Intent | Vol/mo | Trend | Target page type |
|---|---|---:|---|---|
| `sewa excavator` | commercial | **210** | ↑ +33% | homepage H1 |
| `harga sewa excavator` | commercial-info | **20** | flat | homepage + blog |
| `sewa excavator malaysia` | commercial | **10** | ↓ -67% | homepage |
| `sewa excavator murah` | commercial | **10** | ↓ -67% | homepage |
| `sewa excavator harian` | commercial | **10** | ↓ -100% | homepage (calculator) |
| `sewa excavator bulanan` | commercial | **10** | ↓ -33% | homepage (calculator) |
| `abang excavator` | navigational | **10** | — | homepage (brand) |

### 1.1a Demoted — no measurable volume

Keep as body copy at most; never as an H1, meta title, slug or "money keyword".
This heading is load-bearing: the volume gate reads it and stops treating these as
head terms, so do not fold this table back into §1.1.

| Keyword | Vol/mo | Note |
|---|---:|---|
| `sewa volvo excavator` | 0 | wrong word order — use `excavator volvo` (170), see §1.1b |
| `sewa volvo ec200` | 0 | the bare model `volvo ec200` does have volume (10) |
| `sewa volvo ec400` | 0 | the bare model `volvo ec400` does have volume (10) |
| `sewa excavator mingguan` | 0 | weekly framing is not searched; daily and monthly are |
| `sewa excavator 20 tan` | 0 | tonnage phrasing is not how buyers search in MS |
| `sewa excavator 40 tan` | 0 | ditto |
| `sewa excavator dengan operator` | 0 | keep as an FAQ answer, not a target |
| `sewa excavator tanpa operator` | 0 | ditto |
| `sewa excavator untuk kontraktor` | 0 | audience framing, not a search phrase |
| `sewa excavator tapak bina` | 0 | ditto |
| `harga sewa excavator murah` | 0 | stacked modifiers; `harga sewa excavator` (20) is the real one |
| `cara pilih excavator yang sesuai` | 0 | blog title, not a keyword |
| `excavator volvo ec200 vs ec400` | 0 | blog title; `volvo ec200` / `volvo ec400` carry the volume |
| `panduan sewa excavator pertama kali` | 0 | blog title, not a keyword |
| `sewa excavator no.1 malaysia` | 0 | slogan, not a search phrase |

### 1.1c Location pattern

Never gated — low per-city volume is the point of 150+ pages.
`sewa excavator {location}` · `kadar sewa excavator {location}` → `/excavator/[location]`

### 1.1b Discovered — real demand the original plan missed

Found via `keyword-volume.mjs --ideas`. **`sewa backhoe` outranks the site's own head
term**, and mini-excavator demand is entirely unserved.

| Keyword | Vol/mo | Trend | Recommended use |
|---|---:|---|---|
| `sewa backhoe` | **320** | ↑ +28% | biggest single opportunity — needs its own product/section; currently absent from the site |
| `excavator volvo` | **170** | flat | products section heading — replaces `sewa volvo excavator` (0) |
| `sewa mini excavator` | **90** | ↑ +26% | unserved segment; product card + location-page mention |
| `sewa excavator sehari` | **70** | flat | 7× `sewa excavator harian` (10) — prefer "sehari" in calculator copy |
| `sewa jentera berat` | **30** | flat | category-level term; useful in intro copy + blog |
| `volvo ec200` | **10** | ↓ -50% | product card title (bare model, no `sewa` prefix) |
| `volvo ec400` | **10** | ↑ +50% | product card title |
| `kadar sewa excavator` | **10** | flat | FAQ heading |

### 1.2 English (`en`) — reclassify: this is NOT the secondary market

> **`excavator rental` (260/mo) outranks `sewa excavator` (210/mo).** The site's default
> locale is `ms` and the whole `/en` tree was planned as secondary — the data says the
> English tree deserves equal weight, not second billing. Worth deciding deliberately
> rather than inheriting the original assumption.

| Keyword | Intent | Vol/mo | Trend | Target page type |
|---|---|---:|---|---|
| `excavator rental` | commercial | **260** | ↑ +41% | `/en` homepage H1 |
| `excavator rental malaysia` | commercial | **50** | flat | `/en` homepage |
| `excavator rental price` | commercial-info | **20** | ↑ +67% | `/en` homepage + blog |
| `cheap excavator rental` | commercial | **10** | — | `/en` homepage |
| `monthly excavator rental` | commercial | **10** | ↓ -100% | `/en` (calculator) |
| `20 ton excavator rental` | commercial | **10** | ↓ -100% | `/en` homepage |
| `how to choose the right excavator` | informational | **10** | — | blog |

### 1.2a Demoted — no measurable volume (`en`)

`daily excavator rental` · `weekly excavator rental` · `volvo excavator rental` ·
`volvo ec200 rental` · `volvo ec400 rental` · `40 ton excavator rental` ·
`excavator with operator rental` · `excavator rental for contractors` ·
`construction site excavator rental` · `excavator daily rental rate` ·
`volvo ec200 vs ec400` · `excavator rental guide malaysia`

**Location pattern:** `excavator rental {location}` · `excavator hire {location}`

### 1.2b Discovered — English demand the plan missed

| Keyword | Vol/mo | Recommended use |
|---|---:|---|
| `excavator on rent` | **260** | equal to `excavator rental` — worth a heading variant |
| `mini excavator rental` | **140** | unserved, mirrors `sewa mini excavator` (90) |
| `compact excavator rental` | **140** | same segment, different wording |
| `excavator rental near me` | **70** | "near me" intent → location pages should target it |
| `rent digger near me` | **70** | "digger" is a real MY search token, absent from the plan |
| `long reach excavator rental` | **20** | equipment variant, unserved |

### 1.3 Chinese (`zh`) — Mandarin-reading Chinese contractor segment

> **Measured 2026-08-06: only 2 of 19 ZH keywords have any volume** — `挖掘机出租` (10)
> and `挖土机出租` (10). Everything else, including all the "high tier" entries below,
> returned 0. Treat `/zh` as an accessibility/parity tree, not a traffic channel, and do
> not invest further copy effort here.
>
> ZH keywords are **not** stored in webcore — the keyword store accepts only `en` and
> `ms`, so this table is the only record of them.

| Keyword | Intent | Vol/mo | Target page type |
|---|---|---:|---|
| `挖掘机出租` | commercial | **10** | homepage H1 |
| `挖土机出租` | commercial | **10** | homepage |
| `马来西亚挖掘机出租` | commercial | 0 | demoted — body copy only |
| `便宜挖掘机出租` | commercial | mid | homepage |
| `挖掘机出租价格` | commercial-info | mid | homepage + blog |
| `挖掘机日租` | commercial | mid | homepage (USP / calculator) |
| `挖掘机月租` | commercial | mid | homepage (USP / calculator) |
| `挖掘机周租` | commercial | mid | homepage (calculator) |
| `沃尔沃挖掘机租赁` | commercial | mid | homepage (products) |
| `沃尔沃 ec200 出租` | commercial | mid | homepage (product card) |
| `沃尔沃 ec400 出租` | commercial | mid | homepage (product card) |
| `20 吨挖掘机出租` | commercial | mid | homepage |
| `40 吨挖掘机出租` | commercial | mid | homepage |
| `带司机挖掘机出租` | commercial-long | mid | homepage + blog |
| `工地挖掘机出租` | commercial-long | low | homepage |
| `承包商挖掘机出租` | commercial-long | low | homepage |
| `挖掘机出租 {location}` | commercial-long | per-location | `/excavator/[location]` |
| `{location} 挖掘机租赁` | commercial-long | per-location | `/excavator/[location]` (FAQ) |
| `挖掘机租赁价格指南` | informational | mid | blog |
| `如何选择合适的挖掘机` | informational | mid | blog |
| `沃尔沃 EC200 与 EC400 对比` | informational | mid | blog (variant comparison) |
| `Abang Excavator` | navigational | low | homepage (brand) |

### 1.4 Cannibalisation guard

- **Homepage** owns: `sewa excavator malaysia`, `excavator rental malaysia`, `马来西亚挖掘机出租`. Variant terms (`volvo ec200`, `volvo ec400`) live in product-card eyebrows on the homepage, not as standalone pages.
- **Location pages** own: `sewa excavator {location}` exclusively — the homepage must NOT include a specific city name in its H1.
- **Blog posts** own: informational long-tails (`bagaimana`, `panduan`, `harga`, `vs`, `how to`, `guide`, `如何`, `指南`). No blog post may use the bare commercial term `sewa excavator` as its title — always include an informational modifier.

---

## 2. Page Hierarchy & URL Structure

### 2.1 Routing surface

```
/{locale}                                    Homepage
/{locale}/excavator/{location}               Location landing (163 × 3 locales)
/{locale}/blog                               Blog listing
/{locale}/blog/{slug}                        Blog article
/{locale}/redirect-whatsapp-1?loc={slug}     WhatsApp redirect (dynamic, force-dynamic)
```

`localePrefix: 'always'` — even the default `ms` locale carries its prefix.

### 2.2 Example URLs (all three locales)

Homepage:
```
https://sewa-excavator.vercel.app/ms
https://sewa-excavator.vercel.app/en
https://sewa-excavator.vercel.app/zh
```

Kuala Lumpur location page:
```
https://sewa-excavator.vercel.app/ms/excavator/kuala-lumpur
https://sewa-excavator.vercel.app/en/excavator/kuala-lumpur
https://sewa-excavator.vercel.app/zh/excavator/kuala-lumpur
```

Blog listing:
```
https://sewa-excavator.vercel.app/ms/blog
https://sewa-excavator.vercel.app/en/blog
https://sewa-excavator.vercel.app/zh/blog
```

Blog post (slug is locale-independent — same slug across all three locales; content translated):
```
https://sewa-excavator.vercel.app/ms/blog/harga-sewa-excavator-malaysia-2026
https://sewa-excavator.vercel.app/en/blog/harga-sewa-excavator-malaysia-2026
https://sewa-excavator.vercel.app/zh/blog/harga-sewa-excavator-malaysia-2026
```

WhatsApp redirect:
```
https://sewa-excavator.vercel.app/ms/redirect-whatsapp-1?loc=kuala-lumpur
```

### 2.3 Sitemap inventory

| Route group | Count per locale | × 3 locales | Total |
|---|---|---|---|
| Homepage | 1 | 3 | 3 |
| Location pages | 163 | 3 | 489 |
| Blog listing | 1 | 3 | 3 |
| Blog posts (initial 10) | 10 | 3 | 30 |
| **Total at launch** | | | **525** |

Redirect routes excluded from sitemap (`dynamic = 'force-dynamic'`, no SEO value).

---

## 3. Hreflang Specification

Every page emits exactly **4 hreflang link tags**: one per locale plus `x-default = ms`. Implemented via `generateMetadata({ params })` returning `alternates.languages` (Kimmy wires this in).

### 3.1 Homepage (`/[locale]`)

```html
<link rel="alternate" hreflang="ms" href="https://sewa-excavator.vercel.app/ms" />
<link rel="alternate" hreflang="en" href="https://sewa-excavator.vercel.app/en" />
<link rel="alternate" hreflang="zh" href="https://sewa-excavator.vercel.app/zh" />
<link rel="alternate" hreflang="x-default" href="https://sewa-excavator.vercel.app/ms" />
<link rel="canonical" href="https://sewa-excavator.vercel.app/{locale}" />
```

### 3.2 Location page (`/[locale]/excavator/[location]`)

```html
<link rel="alternate" hreflang="ms" href="https://sewa-excavator.vercel.app/ms/excavator/{location}" />
<link rel="alternate" hreflang="en" href="https://sewa-excavator.vercel.app/en/excavator/{location}" />
<link rel="alternate" hreflang="zh" href="https://sewa-excavator.vercel.app/zh/excavator/{location}" />
<link rel="alternate" hreflang="x-default" href="https://sewa-excavator.vercel.app/ms/excavator/{location}" />
<link rel="canonical" href="https://sewa-excavator.vercel.app/{locale}/excavator/{location}" />
```

### 3.3 Blog listing (`/[locale]/blog`)

```html
<link rel="alternate" hreflang="ms" href="https://sewa-excavator.vercel.app/ms/blog" />
<link rel="alternate" hreflang="en" href="https://sewa-excavator.vercel.app/en/blog" />
<link rel="alternate" hreflang="zh" href="https://sewa-excavator.vercel.app/zh/blog" />
<link rel="alternate" hreflang="x-default" href="https://sewa-excavator.vercel.app/ms/blog" />
<link rel="canonical" href="https://sewa-excavator.vercel.app/{locale}/blog" />
```

### 3.4 Blog post (`/[locale]/blog/[slug]`)

```html
<link rel="alternate" hreflang="ms" href="https://sewa-excavator.vercel.app/ms/blog/{slug}" />
<link rel="alternate" hreflang="en" href="https://sewa-excavator.vercel.app/en/blog/{slug}" />
<link rel="alternate" hreflang="zh" href="https://sewa-excavator.vercel.app/zh/blog/{slug}" />
<link rel="alternate" hreflang="x-default" href="https://sewa-excavator.vercel.app/ms/blog/{slug}" />
<link rel="canonical" href="https://sewa-excavator.vercel.app/{locale}/blog/{slug}" />
```

### 3.5 Notes

- `x-default` always points to the `ms` URL (default locale).
- Slug stays identical across locales so alternates resolve cleanly.
- WhatsApp redirect route emits `<meta name="robots" content="noindex,nofollow" />` and no hreflang — it is a transient redirect, not an indexable page.

---

## 4. Meta Title + Description Templates

Title target: ≤60 chars Latin / ~30 chars CJK. Description target: 150–160 chars Latin / 75–80 chars CJK.

Merge fields:
- `{location}` — name from `config/locations.ts`, e.g. `Kuala Lumpur`
- `{state}` — `loc.state`, e.g. `Selangor`

### 4.1 Homepage

| Locale | Meta title | Meta description |
|---|---|---|
| `ms` | `Sewa Excavator No.1 Malaysia — Volvo EC200 & EC400 \| Abang Excavator` | `Sewa excavator Volvo EC200 & EC400 dengan harga harian, mingguan, atau bulanan terbaik di Malaysia. Sebut harga segera melalui WhatsApp — Abang Excavator.` |
| `en` | `Excavator Rental Malaysia — Volvo EC200 & EC400 \| Abang Excavator` | `Rent a Volvo EC200 or EC400 excavator at the best daily, weekly, and monthly rates in Malaysia. Instant quote via WhatsApp — Abang Excavator.` |
| `zh` | `马来西亚挖掘机出租 — 沃尔沃 EC200 与 EC400 \| Abang Excavator` | `沃尔沃 EC200、EC400 挖掘机日租、周租、月租，价格全马最优。WhatsApp 立即报价 — Abang Excavator。` |

### 4.2 Location page (`/{locale}/excavator/{location}`)

| Locale | Meta title | Meta description |
|---|---|---|
| `ms` | `Sewa Excavator {location} — Volvo EC200 & EC400 \| Abang Excavator` | `Sewa excavator Volvo EC200 atau EC400 di {location}, {state}. Kadar harian dan bulanan, hantar terus ke tapak. Sebut harga WhatsApp Abang Excavator sekarang.` |
| `en` | `Excavator Rental in {location} — Volvo EC200 & EC400 \| Abang Excavator` | `Rent a Volvo EC200 or EC400 excavator in {location}, {state}. Daily and monthly rates with site delivery. Get an instant quote from Abang Excavator on WhatsApp.` |
| `zh` | `{location} 挖掘机出租 — 沃尔沃 EC200 与 EC400 \| Abang Excavator` | `{location}（{state}）沃尔沃 EC200 / EC400 挖掘机出租，日租与月租价格透明，送货到工地。WhatsApp 即可获取 Abang Excavator 报价。` |

### 4.3 Blog listing

| Locale | Meta title | Meta description |
|---|---|---|
| `ms` | `Panduan Sewa Excavator — Blog Abang Excavator Malaysia` | `Panduan, tips, dan perbandingan untuk sewa excavator di Malaysia. Belajar pilih Volvo EC200 atau EC400 dan kawal kos projek anda.` |
| `en` | `Excavator Rental Guides — Abang Excavator Malaysia Blog` | `Guides, tips and comparisons for excavator rental in Malaysia. Learn how to pick a Volvo EC200 or EC400 and keep your project on budget.` |
| `zh` | `挖掘机出租指南 — Abang Excavator 马来西亚博客` | `马来西亚挖掘机出租指南、贴士与对比。学习如何选择沃尔沃 EC200 或 EC400，并控制项目预算。` |

### 4.4 Blog post (Hanabi populates exact strings in `blog_translations.meta_title` / `meta_description`)

Template (used when Hanabi has not authored a bespoke meta):

| Locale | Meta title | Meta description |
|---|---|---|
| `ms` | `{post_title} \| Abang Excavator` | `{post_excerpt — ~155 chars, must include the post's primary keyword}` |
| `en` | `{post_title} \| Abang Excavator` | `{post_excerpt — ~155 chars, must include the post's primary keyword}` |
| `zh` | `{post_title} \| Abang Excavator` | `{post_excerpt — ~75 chars, must include the post's primary keyword}` |

### 4.5 Open Graph

`generateMetadata` also sets `openGraph.locale`:
- `ms` → `ms_MY`
- `en` → `en_MY`
- `zh` → `zh_CN` (closest crawler-supported value)

`openGraph.alternateLocale` = the other two values for each page.

---

## 5. H1 / H2 Formulas (one H1 + one H2 per page — both in the hero only)

### 5.1 Homepage

| Locale | H1 (hero title) | H2 (hero subtitle) |
|---|---|---|
| `ms` | `Sewa Excavator No.1 Malaysia` | `Volvo EC200 dan EC400 — harian, mingguan, bulanan` |
| `en` | `Excavator Rental, No.1 in Malaysia` | `Volvo EC200 and EC400 — daily, weekly, monthly hire` |
| `zh` | `马来西亚 No.1 挖掘机出租` | `沃尔沃 EC200 与 EC400 — 日租、周租、月租` |

### 5.2 Location page

| Locale | H1 | H2 |
|---|---|---|
| `ms` | `Sewa Excavator di {location}` | `Volvo EC200 dan EC400 untuk projek anda di {state}` |
| `en` | `Excavator Rental in {location}` | `Volvo EC200 and EC400 for your project in {state}` |
| `zh` | `{location} 挖掘机出租` | `沃尔沃 EC200 与 EC400，助力 {state} 项目` |

### 5.3 Blog listing

| Locale | H1 | H2 |
|---|---|---|
| `ms` | `Blog Abang Excavator` | `Panduan dan tips sewa excavator di Malaysia` |
| `en` | `Abang Excavator Blog` | `Guides and tips for excavator rental in Malaysia` |
| `zh` | `Abang Excavator 博客` | `马来西亚挖掘机出租指南与贴士` |

### 5.4 Blog post

- H1 = `blog_translations.title` for that locale (Hanabi authored).
- H2 = `blog_translations.excerpt` (or a `messages/{locale}.json` key `blog.postSubtitleTemplate` if the excerpt is too long for a hero subtitle).

### 5.5 Section heading (H3/H4) keyword discipline

| Section | H3 (ms / en / zh) |
|---|---|
| Products | `Pilih excavator Volvo anda` / `Pick your Volvo excavator` / `选择您的沃尔沃挖掘机` |
| Calculator | `Kira kos sewa segera` / `Estimate your rental cost instantly` / `立即估算租赁成本` |
| Process | `Cara sewa excavator dalam 4 langkah` / `Rent an excavator in 4 steps` / `4 步租赁挖掘机` |
| Why us | `Kenapa kontraktor pilih Abang Excavator` / `Why contractors choose Abang Excavator` / `为何承包商选择 Abang Excavator` |
| Reviews | `4.9/5 pada Google Reviews` (aggregate copy — keyword carried elsewhere) |
| Locations | `Sewa excavator seluruh Malaysia` / `Excavator rental nationwide Malaysia` / `全马挖掘机出租` |
| FAQ | `Soalan lazim sewa excavator` / `Excavator rental FAQ` / `挖掘机出租常见问题` |
| Nearby (location page) | `Sewa excavator berdekatan {location}` / `Excavator rental near {location}` / `{location} 附近挖掘机出租` |

Every keyword-bearing H3/H4 above is forbidden in H5/H6 (lint check at build).

---

## 6. Internal Linking Plan

### 6.1 Homepage (`/[locale]`)

- **Locations section** renders **every entry** in `config/locations.ts` grouped by state. Each city links to `/{locale}/excavator/{slug}`. All 163 cities appear here so the homepage is the canonical hub.
- **Top-cities strip** (above the full grid): the first 10 entries — `Kuala Lumpur`, `Petaling Jaya`, `Shah Alam`, `Johor Bahru`, `Ipoh`, `George Town`, `Kuantan`, `Kota Kinabalu`, `Kuching`, `Melaka` — rendered as pill chips. Same target URLs.
- **Products section** links each product card to its WhatsApp redirect (commercial intent stays in the WA flow — no product detail pages).
- **Blog listing** linked from nav + footer.
- **FAQ section** may deep-link 2–3 questions to relevant blog posts once Hanabi has published them.

### 6.2 Location page (`/[locale]/excavator/[location]`)

- **Breadcrumb**: `Home → Locations → {location.name}` — `Home` → `/{locale}`, `Locations` → `/{locale}#locations`.
- **Nearby Locations strip** (between Locations section and Final CTA): **6 sibling cities** driven by `getNearbyLocations(slug)` returning `peers.slice(0, 6)`. Extended from skylift's 4 to 6 so each location distributes more PageRank into its state.
- **Locations section** still renders the full 163 list (parity with homepage; lets crawlers reach any location from any location in one hop).
- **Blog teaser strip** (3 most recent posts at the bottom, above the Final CTA) — drives blog crawl depth.
- Every WA CTA on the page passes `?loc={location.slug}` to `/redirect-whatsapp-1` (required for forward-compat with `hybrid` mode).

### 6.3 Blog post (`/[locale]/blog/[slug]`) — Hanabi enforces

Mandatory anchors in every post body:

1. **One link to homepage** (`/{locale}`) — anchor text uses primary keyword `sewa excavator Malaysia` / `excavator rental Malaysia` / `马来西亚挖掘机出租`.
2. **Three links to location pages** — pick relevant city slugs per post (e.g. KL post → `/ms/excavator/kuala-lumpur`, `/ms/excavator/petaling-jaya`, `/ms/excavator/shah-alam`).
3. **One link to a product anchor on the homepage** — `/{locale}#products` or directly to the WA redirect with WA text mentioning the variant (e.g. for variant-focused posts).
4. **One link to a sibling blog post** — Hanabi cross-links pairs (e.g. EC200-vs-EC400 ↔ Daily-vs-Monthly).
5. **Sticky sidebar** lists 3 most recent blog posts (driven by `getRecentBlogPosts(locale, slug, 3)`).
6. **WA CTA banner** at end of article uses primary keyword as anchor + `/{locale}/redirect-whatsapp-1?loc=all`.

### 6.4 Footer (global, every page)

| Block | Links |
|---|---|
| Brand | logo → `/{locale}` |
| Products | EC200 anchor → `/{locale}#products`, EC400 anchor → `/{locale}#products` |
| Top Locations | 6 cities — `kuala-lumpur`, `johor-bahru`, `ipoh`, `george-town`, `kota-kinabalu`, `kuching` |
| Resources | Blog → `/{locale}/blog`, FAQ → `/{locale}#faq` |
| Language | MS / EN / 中文 switcher (preserves path under new locale prefix) |

### 6.5 Blog listing → posts

Renders every published post (ordered by `published_at` desc). Each card links to `/{locale}/blog/{slug}` and fires `uwc('click', { label: 'blog-{slug}' })`.

### 6.6 Anchor text rules (no over-optimisation)

- Vary anchor text. For a single city target, alternate between `sewa excavator {location}`, `{location}`, `kontraktor di {location}`, and naked URL strings. Never repeat the exact-match phrase on every link in the same body.
- WA CTA buttons use action labels (`WhatsApp Now`, `Sebut Harga`, `立即询价`) — they do **not** carry SEO anchor weight (WA targets the `noindex` redirect route).

---

## 7. Schema Markup Matrix

| Schema type | Homepage | Location page | Blog listing | Blog post | Owner |
|---|---|---|---|---|---|
| `Organization` | yes | yes | yes | yes | `OrganizationSchema` in `app/[locale]/layout.tsx` — site-wide |
| `LocalBusiness` | no | yes (`areaServed = location.name`) | no | no | `LocalBusinessSchema` inline in `excavator/[location]/page.tsx` |
| `Product` | yes (2 — EC200 + EC400) | yes (same 2, with `areaServed`) | no | no | `ProductSchema` inline in homepage + location page |
| `BreadcrumbList` | no (only one level) | yes (Home → Locations → {location}) | yes (Home → Blog) | yes (Home → Blog → {post}) | `BreadcrumbSchema` inline |
| `FAQPage` | yes | yes | no | yes (only if post has an FAQ block ≥3 Q&A) | `FAQSchema` inline |
| `Article` | no | no | no | yes | inline in `blog/[slug]/page.tsx` |
| `WebSite` + `SearchAction` | yes | no | no | no | inline in homepage |

Schema notes:
- All schema rendered via `<script type="application/ld+json">` server-side (no client JS).
- `Organization.name = 'Abang Excavator'`, `legalName = 'Utopia Holiday Sdn. Bhd.'`, `url = 'https://sewa-excavator.vercel.app/ms'`.
- `Organization.sameAs` populated only if real social URLs are confirmed; otherwise omit (do not invent).
- `LocalBusiness.@type = 'GeneralContractor'` (closest schema.org match for equipment rental). `priceRange = 'RM$$'`.
- `Product.brand = { '@type': 'Brand', name: 'Volvo' }`, `Product.manufacturer = 'Volvo Construction Equipment'`.
- `Product.offers.priceCurrency = 'MYR'`, `Product.offers.availability = 'https://schema.org/InStock'`. Price pulled from `getProducts()` `rental_price` (daily rate).
- `Article.author = { '@type': 'Organization', name: 'Abang Excavator' }` — no individual byline.
- `FAQPage` emitted only when ≥3 Q&A (Google guideline minimum).

---

## 8. Initial Blog Post Slate (10 Posts)

Hanabi writes each post in **all three locales**. Slug is identical across locales (Malay-style, kebab-case). Primary keyword required in title.

| # | Slug | Primary kw (ms) | Title (ms) | Title (en) | Title (zh) |
|---|---|---|---|---|---|
| 1 | `harga-sewa-excavator-malaysia-2026` | `harga sewa excavator` | `Harga Sewa Excavator Malaysia 2026 — Panduan Kadar Harian, Mingguan, Bulanan` | `Excavator Rental Price Malaysia 2026 — Daily, Weekly, and Monthly Rate Guide` | `2026 马来西亚挖掘机出租价格 — 日租、周租、月租指南` |
| 2 | `volvo-ec200-vs-ec400-mana-satu-untuk-projek-anda` | `volvo ec200 vs ec400` | `Volvo EC200 vs EC400 — Mana Satu Untuk Projek Anda?` | `Volvo EC200 vs EC400 — Which One Fits Your Project?` | `沃尔沃 EC200 与 EC400 — 哪款更适合您的项目？` |
| 3 | `cara-pilih-excavator-yang-sesuai-untuk-tapak-bina` | `cara pilih excavator` | `Cara Pilih Excavator Yang Sesuai Untuk Tapak Bina Anda` | `How to Choose the Right Excavator for Your Construction Site` | `如何为工地挑选合适的挖掘机` |
| 4 | `sewa-excavator-dengan-operator-vs-tanpa-operator` | `sewa excavator dengan operator` | `Sewa Excavator Dengan Operator vs Tanpa Operator — Yang Mana Lebih Berbaloi?` | `Excavator Rental With or Without Operator — Which Is Better Value?` | `带司机与不带司机的挖掘机出租 — 哪种更划算？` |
| 5 | `panduan-sewa-excavator-pertama-kali-untuk-kontraktor-baru` | `panduan sewa excavator pertama kali` | `Panduan Sewa Excavator Pertama Kali Untuk Kontraktor Baru` | `First-Time Excavator Rental Guide for New Contractors in Malaysia` | `新承包商首次租赁挖掘机完整指南` |
| 6 | `kadar-sewa-excavator-harian-vs-bulanan-mana-jimat` | `sewa excavator harian` | `Kadar Sewa Excavator Harian vs Bulanan — Mana Lebih Jimat?` | `Daily vs Monthly Excavator Rental — Which Saves You More?` | `日租与月租挖掘机 — 哪种更省钱？` |
| 7 | `senarai-semak-keselamatan-tapak-bina-excavator` | `keselamatan tapak bina excavator` | `Senarai Semak Keselamatan Tapak Bina Sebelum Hantar Excavator` | `Construction Site Safety Checklist Before Your Excavator Arrives` | `挖掘机进场前的工地安全检查表` |
| 8 | `excavator-20-tan-vs-40-tan-perbandingan-prestasi` | `excavator 20 tan vs 40 tan` | `Excavator 20 Tan vs 40 Tan — Perbandingan Prestasi dan Kos` | `20-Ton vs 40-Ton Excavator — Performance and Cost Comparison` | `20 吨与 40 吨挖掘机 — 性能与成本对比` |
| 9 | `5-kesilapan-biasa-ketika-sewa-excavator-malaysia` | `kesilapan sewa excavator` | `5 Kesilapan Biasa Ketika Sewa Excavator di Malaysia (dan Cara Elak)` | `5 Common Mistakes When Renting an Excavator in Malaysia (and How to Avoid Them)` | `在马来西亚租赁挖掘机的 5 个常见错误（以及如何避免）` |
| 10 | `cara-jimat-kos-sewa-excavator-untuk-projek-skala-besar` | `cara jimat kos sewa excavator` | `Cara Jimat Kos Sewa Excavator Untuk Projek Skala Besar` | `How to Cut Excavator Rental Costs on Large-Scale Projects` | `如何降低大型项目的挖掘机租赁成本` |

### Per-post primary keyword targets (Hanabi places in H1, intro paragraph, one H2/H3, meta title, meta description, hero image alt)

| # | ms primary | en primary | zh primary |
|---|---|---|---|
| 1 | `harga sewa excavator malaysia` | `excavator rental price malaysia` | `马来西亚挖掘机出租价格` |
| 2 | `volvo ec200 vs ec400` | `volvo ec200 vs ec400` | `沃尔沃 ec200 与 ec400` |
| 3 | `cara pilih excavator yang sesuai` | `how to choose the right excavator` | `如何选择合适的挖掘机` |
| 4 | `sewa excavator dengan operator` | `excavator rental with operator` | `带司机挖掘机出租` |
| 5 | `panduan sewa excavator pertama kali` | `first time excavator rental guide` | `首次租赁挖掘机指南` |
| 6 | `sewa excavator harian vs bulanan` | `daily vs monthly excavator rental` | `挖掘机日租与月租` |
| 7 | `keselamatan tapak bina excavator` | `excavator construction site safety` | `挖掘机工地安全` |
| 8 | `excavator 20 tan vs 40 tan` | `20 ton vs 40 ton excavator` | `20 吨与 40 吨挖掘机` |
| 9 | `kesilapan sewa excavator` | `mistakes renting excavator malaysia` | `租赁挖掘机常见错误` |
| 10 | `cara jimat kos sewa excavator` | `cut excavator rental cost` | `降低挖掘机租赁成本` |

---

## 9. Final Location List (config/locations.ts source-of-truth)

Adapted from `projects/skylift-malaysia/config/locations.ts` (159 entries) with **Labuan** added as its own region (4 sub-locations — federal territory exemption). Total **163**, all 13 states satisfy ≥10. Total 163 ∈ [150, 180].

### 9.1 Tally by region

| Region | Count |
|---|---|
| Klang Valley (KL + Selangor inner + Putrajaya) | 25 |
| Selangor (outer) | 10 |
| Negeri Sembilan | 10 |
| Melaka | 10 |
| Johor | 12 |
| Perak | 12 |
| Penang | 10 |
| Kedah | 10 |
| Perlis | 10 |
| Kelantan | 10 |
| Terengganu | 10 |
| Pahang | 10 |
| Sabah | 10 |
| Sarawak | 10 |
| **Labuan** | **4** |
| **TOTAL** | **163** |

> **Labuan exemption rationale:** Labuan is a small federal territory island. The 4 entries chosen (Victoria, Bandar Labuan, Rancha-Rancha, Layang-Layangan) are the actual populated centres on the island. The "≥10 per state" rule is honoured for all 13 states + Klang Valley aggregate. Total still 163 ∈ [150, 180].

### 9.2 Full slug + name + state list (paste-ready for `config/locations.ts`)

```ts
// Klang Valley — 25
{ slug: 'kuala-lumpur',       name: 'Kuala Lumpur',       state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'petaling-jaya',      name: 'Petaling Jaya',      state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'shah-alam',          name: 'Shah Alam',          state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'subang-jaya',        name: 'Subang Jaya',        state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'puchong',            name: 'Puchong',            state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'cheras',             name: 'Cheras',             state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'ampang',             name: 'Ampang',             state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'kepong',             name: 'Kepong',             state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'setapak',            name: 'Setapak',            state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'wangsa-maju',        name: 'Wangsa Maju',        state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'bangsar',            name: 'Bangsar',            state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'mont-kiara',         name: 'Mont Kiara',         state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'damansara',          name: 'Damansara',          state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'sri-petaling',       name: 'Sri Petaling',       state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'bukit-jalil',        name: 'Bukit Jalil',        state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'cyberjaya',          name: 'Cyberjaya',          state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'putrajaya',          name: 'Putrajaya',          state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'kajang',             name: 'Kajang',             state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'bangi',              name: 'Bangi',              state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'semenyih',           name: 'Semenyih',           state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'rawang',             name: 'Rawang',             state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'selayang',           name: 'Selayang',           state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'gombak',             name: 'Gombak',             state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'klang',              name: 'Klang',              state: 'Klang Valley', stateSlug: 'klang-valley' },
{ slug: 'port-klang',         name: 'Port Klang',         state: 'Klang Valley', stateSlug: 'klang-valley' },

// Selangor (outer) — 10
{ slug: 'sepang',             name: 'Sepang',             state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'banting',            name: 'Banting',            state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'kuala-selangor',     name: 'Kuala Selangor',     state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'hulu-langat',        name: 'Hulu Langat',        state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'serdang',            name: 'Serdang',            state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'sungai-buloh',       name: 'Sungai Buloh',       state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'kuala-kubu-bharu',   name: 'Kuala Kubu Bharu',   state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'sabak-bernam',       name: 'Sabak Bernam',       state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'hulu-selangor',      name: 'Hulu Selangor',      state: 'Selangor', stateSlug: 'selangor' },
{ slug: 'tanjung-karang',     name: 'Tanjung Karang',     state: 'Selangor', stateSlug: 'selangor' },

// Negeri Sembilan — 10
{ slug: 'seremban',           name: 'Seremban',           state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'nilai',              name: 'Nilai',              state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'port-dickson',       name: 'Port Dickson',       state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'rembau',             name: 'Rembau',             state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'kuala-pilah',        name: 'Kuala Pilah',        state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'jelebu',             name: 'Jelebu',             state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'jempol',             name: 'Jempol',             state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'tampin',             name: 'Tampin',             state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'bahau',              name: 'Bahau',              state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },
{ slug: 'gemas',              name: 'Gemas',              state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan' },

// Melaka — 10
{ slug: 'melaka',             name: 'Melaka',             state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'ayer-keroh',         name: 'Ayer Keroh',         state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'alor-gajah',         name: 'Alor Gajah',         state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'jasin',              name: 'Jasin',              state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'masjid-tanah',       name: 'Masjid Tanah',       state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'batu-berendam',      name: 'Batu Berendam',      state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'bukit-beruang',      name: 'Bukit Beruang',      state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'merlimau',           name: 'Merlimau',           state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'bemban',             name: 'Bemban',             state: 'Melaka', stateSlug: 'melaka' },
{ slug: 'durian-tunggal',     name: 'Durian Tunggal',     state: 'Melaka', stateSlug: 'melaka' },

// Johor — 12
{ slug: 'johor-bahru',        name: 'Johor Bahru',        state: 'Johor', stateSlug: 'johor' },
{ slug: 'iskandar-puteri',    name: 'Iskandar Puteri',    state: 'Johor', stateSlug: 'johor' },
{ slug: 'kulai',              name: 'Kulai',              state: 'Johor', stateSlug: 'johor' },
{ slug: 'batu-pahat',         name: 'Batu Pahat',         state: 'Johor', stateSlug: 'johor' },
{ slug: 'muar',               name: 'Muar',               state: 'Johor', stateSlug: 'johor' },
{ slug: 'kluang',             name: 'Kluang',             state: 'Johor', stateSlug: 'johor' },
{ slug: 'segamat',            name: 'Segamat',            state: 'Johor', stateSlug: 'johor' },
{ slug: 'pontian',            name: 'Pontian',            state: 'Johor', stateSlug: 'johor' },
{ slug: 'mersing',            name: 'Mersing',            state: 'Johor', stateSlug: 'johor' },
{ slug: 'kota-tinggi',        name: 'Kota Tinggi',        state: 'Johor', stateSlug: 'johor' },
{ slug: 'tangkak',            name: 'Tangkak',            state: 'Johor', stateSlug: 'johor' },
{ slug: 'yong-peng',          name: 'Yong Peng',          state: 'Johor', stateSlug: 'johor' },

// Perak — 12
{ slug: 'ipoh',               name: 'Ipoh',               state: 'Perak', stateSlug: 'perak' },
{ slug: 'taiping',            name: 'Taiping',            state: 'Perak', stateSlug: 'perak' },
{ slug: 'teluk-intan',        name: 'Teluk Intan',        state: 'Perak', stateSlug: 'perak' },
{ slug: 'sitiawan',           name: 'Sitiawan',           state: 'Perak', stateSlug: 'perak' },
{ slug: 'kampar',             name: 'Kampar',             state: 'Perak', stateSlug: 'perak' },
{ slug: 'batu-gajah',         name: 'Batu Gajah',         state: 'Perak', stateSlug: 'perak' },
{ slug: 'lumut',              name: 'Lumut',              state: 'Perak', stateSlug: 'perak' },
{ slug: 'parit-buntar',       name: 'Parit Buntar',       state: 'Perak', stateSlug: 'perak' },
{ slug: 'bagan-serai',        name: 'Bagan Serai',        state: 'Perak', stateSlug: 'perak' },
{ slug: 'kuala-kangsar',      name: 'Kuala Kangsar',      state: 'Perak', stateSlug: 'perak' },
{ slug: 'gerik',              name: 'Gerik',              state: 'Perak', stateSlug: 'perak' },
{ slug: 'tanjung-malim',      name: 'Tanjung Malim',      state: 'Perak', stateSlug: 'perak' },

// Penang — 10
{ slug: 'george-town',        name: 'George Town',        state: 'Penang', stateSlug: 'penang' },
{ slug: 'butterworth',        name: 'Butterworth',        state: 'Penang', stateSlug: 'penang' },
{ slug: 'bukit-mertajam',     name: 'Bukit Mertajam',     state: 'Penang', stateSlug: 'penang' },
{ slug: 'nibong-tebal',       name: 'Nibong Tebal',       state: 'Penang', stateSlug: 'penang' },
{ slug: 'bayan-lepas',        name: 'Bayan Lepas',        state: 'Penang', stateSlug: 'penang' },
{ slug: 'balik-pulau',        name: 'Balik Pulau',        state: 'Penang', stateSlug: 'penang' },
{ slug: 'jelutong',           name: 'Jelutong',           state: 'Penang', stateSlug: 'penang' },
{ slug: 'air-itam',           name: 'Air Itam',           state: 'Penang', stateSlug: 'penang' },
{ slug: 'tanjung-bungah',     name: 'Tanjung Bungah',     state: 'Penang', stateSlug: 'penang' },
{ slug: 'simpang-ampat',      name: 'Simpang Ampat',      state: 'Penang', stateSlug: 'penang' },

// Kedah — 10
{ slug: 'alor-setar',         name: 'Alor Setar',         state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'sungai-petani',      name: 'Sungai Petani',      state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'kulim',              name: 'Kulim',              state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'langkawi',           name: 'Langkawi',           state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'jitra',              name: 'Jitra',              state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'changlun',           name: 'Changlun',           state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'baling',             name: 'Baling',             state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'kulim-hi-tech',      name: 'Kulim Hi-Tech',      state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'yan',                name: 'Yan',                state: 'Kedah', stateSlug: 'kedah' },
{ slug: 'pendang',            name: 'Pendang',            state: 'Kedah', stateSlug: 'kedah' },

// Perlis — 10
{ slug: 'kangar',             name: 'Kangar',             state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'arau',               name: 'Arau',               state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'padang-besar',       name: 'Padang Besar',       state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'kuala-perlis',       name: 'Kuala Perlis',       state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'beseri',             name: 'Beseri',             state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'chuping',            name: 'Chuping',            state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'kaki-bukit',         name: 'Kaki Bukit',         state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'simpang-empat-perlis', name: 'Simpang Empat (Perlis)', state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'sanglang',           name: 'Sanglang',           state: 'Perlis', stateSlug: 'perlis' },
{ slug: 'mata-ayer',          name: 'Mata Ayer',          state: 'Perlis', stateSlug: 'perlis' },

// Kelantan — 10
{ slug: 'kota-bharu',         name: 'Kota Bharu',         state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'pasir-mas',          name: 'Pasir Mas',          state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'tanah-merah',        name: 'Tanah Merah',        state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'tumpat',             name: 'Tumpat',             state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'pasir-puteh',        name: 'Pasir Puteh',        state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'machang',            name: 'Machang',            state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'kuala-krai',         name: 'Kuala Krai',         state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'gua-musang',         name: 'Gua Musang',         state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'jeli',               name: 'Jeli',               state: 'Kelantan', stateSlug: 'kelantan' },
{ slug: 'bachok',             name: 'Bachok',             state: 'Kelantan', stateSlug: 'kelantan' },

// Terengganu — 10
{ slug: 'kuala-terengganu',   name: 'Kuala Terengganu',   state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'kemaman',            name: 'Kemaman',            state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'dungun',             name: 'Dungun',             state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'marang',             name: 'Marang',             state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'besut',              name: 'Besut',              state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'setiu',              name: 'Setiu',              state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'hulu-terengganu',    name: 'Hulu Terengganu',    state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'chukai',             name: 'Chukai',             state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'jerteh',             name: 'Jerteh',             state: 'Terengganu', stateSlug: 'terengganu' },
{ slug: 'paka',               name: 'Paka',               state: 'Terengganu', stateSlug: 'terengganu' },

// Pahang — 10
{ slug: 'kuantan',            name: 'Kuantan',            state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'temerloh',           name: 'Temerloh',           state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'bentong',            name: 'Bentong',            state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'raub',               name: 'Raub',               state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'jerantut',           name: 'Jerantut',           state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'maran',              name: 'Maran',              state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'pekan',              name: 'Pekan',              state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'rompin',             name: 'Rompin',             state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'cameron-highlands',  name: 'Cameron Highlands',  state: 'Pahang', stateSlug: 'pahang' },
{ slug: 'kuala-lipis',        name: 'Kuala Lipis',        state: 'Pahang', stateSlug: 'pahang' },

// Sabah — 10
{ slug: 'kota-kinabalu',      name: 'Kota Kinabalu',      state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'sandakan',           name: 'Sandakan',           state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'tawau',              name: 'Tawau',              state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'lahad-datu',         name: 'Lahad Datu',         state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'keningau',           name: 'Keningau',           state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'semporna',           name: 'Semporna',           state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'kudat',              name: 'Kudat',              state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'papar',              name: 'Papar',              state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'beaufort',           name: 'Beaufort',           state: 'Sabah', stateSlug: 'sabah' },
{ slug: 'ranau',              name: 'Ranau',              state: 'Sabah', stateSlug: 'sabah' },

// Sarawak — 10
{ slug: 'kuching',            name: 'Kuching',            state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'miri',               name: 'Miri',               state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'sibu',               name: 'Sibu',               state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'bintulu',            name: 'Bintulu',            state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'sri-aman',           name: 'Sri Aman',           state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'kota-samarahan',     name: 'Kota Samarahan',     state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'sarikei',            name: 'Sarikei',            state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'mukah',              name: 'Mukah',              state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'limbang',            name: 'Limbang',            state: 'Sarawak', stateSlug: 'sarawak' },
{ slug: 'lawas',              name: 'Lawas',              state: 'Sarawak', stateSlug: 'sarawak' },

// Labuan — 4 (federal territory exemption; see §9 note)
{ slug: 'victoria-labuan',    name: 'Victoria',           state: 'Labuan', stateSlug: 'labuan' },
{ slug: 'bandar-labuan',      name: 'Bandar Labuan',      state: 'Labuan', stateSlug: 'labuan' },
{ slug: 'rancha-rancha',      name: 'Rancha-Rancha',      state: 'Labuan', stateSlug: 'labuan' },
{ slug: 'layang-layangan',    name: 'Layang-Layangan',    state: 'Labuan', stateSlug: 'labuan' },
```

### 9.3 `regionOrder` and `regionKeys` updates (add Labuan)

```ts
export const regionOrder = [
  'Klang Valley',
  'Selangor',
  'Negeri Sembilan',
  'Melaka',
  'Johor',
  'Perak',
  'Penang',
  'Kedah',
  'Perlis',
  'Kelantan',
  'Terengganu',
  'Pahang',
  'Sabah',
  'Sarawak',
  'Labuan',
] as const;

export const regionKeys: Record<string, string> = {
  'Klang Valley': 'klangValley',
  'Selangor': 'selangor',
  'Negeri Sembilan': 'negeriSembilan',
  'Melaka': 'melaka',
  'Johor': 'johor',
  'Perak': 'perak',
  'Penang': 'penang',
  'Kedah': 'kedah',
  'Perlis': 'perlis',
  'Kelantan': 'kelantan',
  'Terengganu': 'terengganu',
  'Pahang': 'pahang',
  'Sabah': 'sabah',
  'Sarawak': 'sarawak',
  'Labuan': 'labuan',
};
```

### 9.4 `getNearbyLocations()` — extend to 6 peers

```ts
export function getNearbyLocations(slug: string): Location[] {
  const loc = locations.find((l) => l.slug === slug);
  if (!loc) return [];
  const peers = locations.filter((l) => l.state === loc.state && l.slug !== slug);
  // Stable deterministic pick: first 6 peers in the state. Falls back to fewer if <6 exist (Labuan).
  return peers.slice(0, 6);
}
```

For Labuan, only 3 peers will be returned. The Nearby Locations strip on the location page should render whatever count is returned — Kimmy/Kagura, render as `grid-cols-3` on mobile / `grid-cols-6` on desktop with empty cells suppressed.

---

## 10. Handoff Summary

| Agent | Uses from this plan |
|---|---|
| **Nana** | §1 (keywords per locale → seed every section's copy), §5 (H1/H2/section H3 templates), §4 (meta title/description templates per page), §6.3 (anchor text rules for blog posts), §8 (10 post titles + per-post primary keywords) |
| **Kimmy** | §2 (routing), §3 (hreflang in `generateMetadata`), §4 (meta title/description in `generateMetadata`), §6 (link components site-wide), §7 (schema components), §9 (`config/locations.ts` payload) |
| **Hanabi** | §8 (slugs + titles + primary keywords for all 10 posts × 3 locales), §6.3 (internal-link mandate per post) |
| **Kagura** | §5 (heading slots inform visual hierarchy), §9 (Locations section count for visual density) |
| **Cyclops** | §9 (location count for `generateStaticParams` validation), §7 (Product schema fields drive product table data) |
| **Layla** | §2.3 (sitemap inventory for QA), §3 (hreflang sanity check post-deploy) |

End of plan.
