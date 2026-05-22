# Wall Panel Malaysia — SEO Plan

**Author:** Sora (SEO Strategist)
**Project:** wall-panel-malaysia
**Domain:** `wall-panel-malaysia.vercel.app`
**Brand:** Wall Panel Malaysia (operated by Encik Beku Aircond Sdn. Bhd.)
**Product slug:** `wall-panel`
**Locales:** `en` (default / `x-default`), `ms`, `zh` (Simplified)
**Leads mode:** `single` — `601116655300`
**Scale:** 3 homepages + (≈155 locations × 3 locales = ~465 location pages) + 3 blog hubs + (10+ blog posts × 3 locales ≈ 30+) = **~500+ indexable URLs**

> Canonical 155-location slug list lives in `config/locations.ts` (built per the architecture's state-by-state seed table). Sora, Nana, Cyclops and Kimmy all operate on that file as the single source of truth. This plan references slugs verbatim from it.

---

## 0. Canonical Locations (excerpt — full list in `config/locations.ts`)

The full slug set is locked in `config/locations.ts` per Alpha's architecture (Section 2, state-by-state seed table) and must total **between 150 and 180 with ≥10 sub-locations per state across all 14 state groupings** (Klang Valley, Selangor, Negeri Sembilan, Melaka, Johor, Perak, Penang, Kedah, Perlis, Kelantan, Terengganu, Pahang, Sabah, Sarawak). Expected total: ~155.

Display names by locale follow this pattern (EN = official Roman name, MS = same Roman name with Malay diacritics where applicable, ZH = standard Simplified Chinese transliteration):

| Sample slug | EN display | MS display | ZH display |
|---|---|---|---|
| `kuala-lumpur` | Kuala Lumpur | Kuala Lumpur | 吉隆坡 |
| `petaling-jaya` | Petaling Jaya | Petaling Jaya | 八打灵再也 |
| `shah-alam` | Shah Alam | Shah Alam | 莎阿南 |
| `johor-bahru` | Johor Bahru | Johor Bahru | 新山 |
| `george-town` | George Town | George Town | 乔治市 |
| `ipoh` | Ipoh | Ipoh | 怡保 |
| `kota-kinabalu` | Kota Kinabalu | Kota Kinabalu | 亚庇 |
| `kuching` | Kuching | Kuching | 古晋 |

Kimmy: store `displayName.en | ms | zh` on every location row in `config/locations.ts` so Nana and the meta-builder can pull localised names without string lookups.

---

## 1. Primary Keyword Strategy

### 1.1 Money keywords (homepage)

| Locale | Primary keyword (homepage target) |
|---|---|
| EN | `wall panel Malaysia` |
| MS | `panel dinding Malaysia` |
| ZH | `马来西亚墙板` |

### 1.2 Secondary cluster — supports homepage + product grid + style gallery

These appear in homepage body copy, product card titles/descriptions, style gallery H3s, and homepage FAQ.

**English — head + buyer-intent terms**
- `wall panel installation Malaysia`
- `wall panel installer Malaysia`
- `wall panel for home`
- `wall panel for office`
- `feature wall panel`
- `wall panel price Malaysia`
- `wall panel per sqft`
- `free installation wall panel`
- `wall panel supplier Malaysia`
- `wall panel design Malaysia`

**English — style-modified (one H3 per style on the homepage)**
- `wood wall panel` / `wood wall panel Malaysia`
- `fluted wall panel` / `fluted wall panel Malaysia`
- `PVC wall panel` / `PVC wall panel Malaysia`
- `acoustic wall panel` / `acoustic wall panel Malaysia`
- `marble wall panel` / `marble wall panel Malaysia`
- `gold marble wall panel`
- `silver marble wall panel`
- `black marble wall panel`
- `PU marble wall panel`

**Bahasa Melayu**
- `pemasangan panel dinding`
- `panel dinding kayu`
- `panel dinding fluted` (loan term — used in Malaysian trade)
- `panel dinding PVC`
- `panel dinding akustik`
- `panel dinding marmar`
- `panel dinding rumah`
- `panel dinding pejabat`
- `harga panel dinding`
- `panel dinding sekaki persegi` (per sqft)
- `panel dinding pemasangan percuma`
- `panel dinding feature wall`

**Mandarin (Simplified)**
- `墙板安装`
- `木墙板`
- `木纹墙板`
- `凹槽墙板` (fluted)
- `PVC墙板`
- `隔音墙板` (acoustic)
- `大理石墙板`
- `客厅墙板`
- `办公室墙板`
- `墙板价格`
- `墙板每平方尺`
- `免费安装墙板`

### 1.3 Long-tail (feed FAQ + blog + location intros)

**EN**
- `how much does wall panel cost per sqft in Malaysia`
- `best wall panel for living room Malaysia`
- `acoustic wall panel for home office`
- `wood vs PVC wall panel which is better`
- `real marble vs PU marble wall panel`
- `wall panel installation time Malaysia`
- `wall panel maintenance Malaysia`
- `feature wall panel for TV background`
- `wall panel for bedroom Malaysia`
- `office reception wall panel design`

**MS**
- `harga panel dinding sekaki persegi Malaysia`
- `panel dinding mana lebih baik kayu atau PVC`
- `panel dinding marmar tulen vs PU marmar`
- `panel dinding untuk ruang tamu`
- `panel dinding feature wall TV`
- `panel dinding bilik tidur`
- `panel dinding pejabat reception`
- `pemasangan panel dinding berapa lama`

**ZH**
- `马来西亚墙板每平方尺多少钱`
- `客厅墙板哪种最好`
- `木墙板与PVC墙板的区别`
- `天然大理石与PU大理石墙板`
- `电视背景墙板设计`
- `卧室墙板`
- `办公室前台墙板`

### 1.4 Location-modifier patterns (per page type)

```
Homepage         → {primary}                                        (no city)
Location page    → {primary_short} {city}  (+ style-modified body)
```

| Locale | Location page pattern |
|---|---|
| EN | `wall panel installation {City}` (primary) + `wood / fluted / PVC / acoustic / marble wall panel {City}` (body H3s) |
| MS | `pemasangan panel dinding {Bandar}` + `panel dinding kayu / fluted / PVC / akustik / marmar {Bandar}` |
| ZH | `{城市}墙板安装` + `{城市}木墙板 / 凹槽墙板 / PVC墙板 / 隔音墙板 / 大理石墙板` |

**Cannibalisation rule:** the homepage is the only page targeting bare national terms (`wall panel Malaysia`, `panel dinding Malaysia`, `马来西亚墙板`). Every location page is city-modified, and every style subheading inside a location page is also city-modified. Blog posts target informational long-tails only — never the city-modified commercial terms.

### 1.5 Keyword × location matrix scale

5 styles × ~155 locations × 3 locales ≈ **~2,325 long-tail style+city targets** plus ~465 city-only primary targets. The style-modified longtails are addressed inside each location page via H3 subheadings ("Wood Wall Panel Installation in Shah Alam", "Marble Wall Panel Installation in Shah Alam", etc.) — no extra URLs are generated.

---

## 2. Page Hierarchy + URL Plan

Flat hub-and-spoke. No intermediate `/wall-panel` index page — the homepage IS the product hub. Blog is a parallel editorial hub.

```
/[locale]                                          ← national hub
  └── /[locale]/wall-panel/[location]              ← ~155 spokes per locale
/[locale]/blog                                     ← editorial hub
  └── /[locale]/blog/[slug]                        ← 10+ articles per locale
```

### 2.1 URL inventory

| Page | Route template | Per locale | Total locales | Indexable count |
|---|---|---|---|---|
| Homepage | `/[locale]` | 1 | 3 | 3 |
| Location | `/[locale]/wall-panel/[location]` | ~155 | 3 | ~465 |
| Blog hub | `/[locale]/blog` | 1 | 3 | 3 |
| Blog post | `/[locale]/blog/[slug]` | 10+ | 3 | 30+ |
| WhatsApp redirect | `/[locale]/redirect-whatsapp-1` | 1 (dynamic) | 3 | NOT indexable — `noindex,nofollow` |
| API revalidate | `/api/revalidate` | — | — | NOT indexable |
| sitemap.xml | `/sitemap.xml` | — | — | special |
| robots.txt | `/robots.txt` | — | — | special |

**Total indexable URLs: ~501** (3 homepages + ~465 location pages + 3 blog hubs + 30+ blog posts).

### 2.2 Primary-keyword matrix (sample — same pattern applies to all ~155 slugs × 3 locales)

| URL | Primary keyword |
|---|---|
| `/en` | wall panel Malaysia |
| `/ms` | panel dinding Malaysia |
| `/zh` | 马来西亚墙板 |
| `/en/wall-panel/kuala-lumpur` | wall panel installation Kuala Lumpur |
| `/ms/wall-panel/kuala-lumpur` | pemasangan panel dinding Kuala Lumpur |
| `/zh/wall-panel/kuala-lumpur` | 吉隆坡墙板安装 |
| `/en/wall-panel/shah-alam` | wall panel installation Shah Alam |
| `/ms/wall-panel/shah-alam` | pemasangan panel dinding Shah Alam |
| `/zh/wall-panel/shah-alam` | 莎阿南墙板安装 |
| `/en/wall-panel/johor-bahru` | wall panel installation Johor Bahru |
| `/en/wall-panel/george-town` | wall panel installation George Town (Penang) |
| `/en/wall-panel/kota-kinabalu` | wall panel installation Kota Kinabalu |
| `/en/wall-panel/kuching` | wall panel installation Kuching |
| `/en/blog` | wall panel ideas Malaysia (informational hub) |
| `/en/blog/wood-vs-pvc-wall-panel` | wood vs PVC wall panel Malaysia |

Each (locale, slug) pair is a distinct ranking target — Nana must produce unique copy for each.

---

## 3. On-Page SEO Spec per Page Type

Character budgets: **title ≤ 60**, **meta description ≤ 158** (locale-independent — same byte limits apply).

### 3.1 Homepage

**EN**
- **Title:** `Wall Panel Installation Malaysia | From RM25/sqft | Wall Panel Malaysia`
- **H1:** `Premium Wall Panel Installation Across Malaysia`
- **H2:** `Wood, Fluted, PVC, Acoustic & Marble — From RM25/sqft with Free Installation`
- **Meta:** `Install wood, fluted, PVC, acoustic or marble wall panels in your home or office. From RM25/sqft with free installation across Malaysia. WhatsApp us for a free measure-up today.`

**MS**
- **Title:** `Pemasangan Panel Dinding Malaysia | Dari RM25/sqft | Wall Panel Malaysia`
- **H1:** `Pemasangan Panel Dinding Premium Di Seluruh Malaysia`
- **H2:** `Kayu, Fluted, PVC, Akustik & Marmar — Dari RM25/sqft Termasuk Pemasangan Percuma`
- **Meta:** `Pasang panel dinding kayu, fluted, PVC, akustik atau marmar untuk rumah dan pejabat. Dari RM25/sqft termasuk pemasangan percuma. WhatsApp untuk ukuran percuma sekarang.`

**ZH**
- **Title:** `马来西亚墙板安装 | RM25/sqft起 | Wall Panel Malaysia`
- **H1:** `马来西亚高端墙板安装服务`
- **H2:** `木纹、凹槽、PVC、隔音、大理石墙板 — RM25/sqft起 含免费安装`
- **Meta:** `家居与办公室墙板安装，提供木纹、凹槽、PVC、隔音与大理石五大风格，RM25/sqft起，含免费安装，覆盖全马。立即WhatsApp预约免费量度。`

### 3.2 Location page

**EN**
- **Title:** `Wall Panel Installation {City} | From RM25/sqft | Free Install`
- **H1:** `Wall Panel Installation in {City}`
- **H2:** `Wood, Fluted, PVC, Acoustic & Marble Panels — Free Installation in {City}`
- **Meta:** `Install wood, fluted, PVC, acoustic or marble wall panels in {City}. From RM25/sqft with free installation. WhatsApp Wall Panel Malaysia for a free measure-up in {City}.`

**MS**
- **Title:** `Pemasangan Panel Dinding {Bandar} | Dari RM25/sqft | Percuma`
- **H1:** `Pemasangan Panel Dinding Di {Bandar}`
- **H2:** `Panel Kayu, Fluted, PVC, Akustik & Marmar — Pemasangan Percuma Di {Bandar}`
- **Meta:** `Pasang panel dinding kayu, fluted, PVC, akustik atau marmar di {Bandar}. Dari RM25/sqft termasuk pemasangan percuma. WhatsApp untuk ukuran percuma di {Bandar}.`

**ZH**
- **Title:** `{城市}墙板安装 | RM25/sqft起 | 免费安装`
- **H1:** `{城市}墙板安装服务`
- **H2:** `木纹、凹槽、PVC、隔音、大理石墙板 — {城市}免费安装`
- **Meta:** `在{城市}安装木纹、凹槽、PVC、隔音或大理石墙板。RM25/sqft起，含免费安装。立即WhatsApp预约{城市}免费量度。`

### 3.3 Blog hub (`/[locale]/blog`)

**EN**
- **Title:** `Wall Panel Ideas, Pricing & Style Guides | Wall Panel Malaysia`
- **H1:** `Wall Panel Ideas, Pricing & Installation Guides`
- **H2:** `Honest Buyer Guides For Malaysian Homes & Offices`
- **Meta:** `Read wall panel buyer guides, design ideas and pricing breakdowns for Malaysian homes and offices. Wood, fluted, PVC, acoustic and marble — explained.`

**MS**
- **Title:** `Idea, Harga & Panduan Panel Dinding | Wall Panel Malaysia`
- **H1:** `Idea, Harga & Panduan Pemasangan Panel Dinding`
- **H2:** `Panduan Pembeli Untuk Rumah & Pejabat Di Malaysia`
- **Meta:** `Baca panduan pembeli, idea reka bentuk dan analisis harga panel dinding untuk rumah dan pejabat di Malaysia. Kayu, fluted, PVC, akustik & marmar — diterangkan.`

**ZH**
- **Title:** `墙板创意、价格与安装指南 | Wall Panel Malaysia`
- **H1:** `墙板创意、价格与安装指南`
- **H2:** `面向马来西亚家居与办公室的诚实购买指南`
- **Meta:** `阅读墙板购买指南、设计创意与价格分析，涵盖马来西亚家居与办公室。详解木纹、凹槽、PVC、隔音与大理石墙板。`

### 3.4 Blog post

- **Title pattern:** `{Article H1 (≤55 chars)} | Wall Panel Malaysia`
- **H1:** the article's main title (one only).
- **H2:** the article's deck / sub-title (one only).
- **Meta pattern:** 1–2 sentence summary that answers the article's main question, includes the primary keyword once and a soft CTA ("Read the full guide").
- **Hierarchy rule:** body sections use H3 and H4. Pull-quotes and image captions are `<p>` (no headings). Keyword-bearing subheadings (e.g. "Wood Wall Panel Pros and Cons") are H2 or H3 — never H5 or H6.

### 3.5 Heading hierarchy rules (all page types)

- **Exactly one `<h1>` and exactly one `<h2>` per page.** H1 = hero title. H2 = hero subtitle. Both belong to the hero region.
- All section titles use `<h3>`–`<h6>`.
- Keyword-bearing subheadings (style name + city, e.g. "Wood Wall Panel Installation in Shah Alam") MUST be `<h3>` or `<h4>` on landing pages, `<h2>`–`<h4>` on blog articles. Never `<h5>` / `<h6>` for keyword phrases.
- Every body block sits under a heading — zero orphan paragraphs. Every section heading has an `.eyebrow` ALL-CAPS mono label directly above it (per CLAUDE.md eyebrow rule).

### 3.6 Body keyword density guidance

- **Homepage body (~900–1100 words):** primary keyword 4–7 times across H1, H2, opening paragraph, USP bar, style gallery H3s, FAQ. Each style keyword (`wood wall panel`, `fluted wall panel`, `PVC wall panel`, `acoustic wall panel`, `marble wall panel`) 2–4 times — concentrated under its own H3 in StyleGallery. Brand name `Wall Panel Malaysia` 3–5 times. No keyword stuffing — every mention must read naturally.
- **Location page body (~550–750 unique words):** primary keyword (`wall panel installation {City}`) 4–6 times. The bare city name 6–10 times. Each style keyword 1–2 times. Promo price (`RM25/sqft`, `RM38/sqft`) mentioned once in the intro + once in the FAQ.
- **Blog post body (~900–1500 words):** primary keyword 5–8 times. Use 3–5 LSI variants (e.g. `wall cladding`, `feature wall`, `accent wall`, `interior panelling`). Internal anchor text to product/location pages 3–5 times per article.

### 3.7 Image alt text patterns

- **Hero image (homepage):** EN `Modern living room with wood wall panel feature wall by Wall Panel Malaysia` / MS `Ruang tamu moden dengan panel dinding kayu oleh Wall Panel Malaysia` / ZH `Wall Panel Malaysia 安装的现代客厅木纹墙板`
- **Hero image (location):** EN `Wall panel installation in {City} living room — Wall Panel Malaysia` / MS `Pemasangan panel dinding di {Bandar} — Wall Panel Malaysia` / ZH `Wall Panel Malaysia 在{城市}的墙板安装案例`
- **Product card:** EN `{Style} wall panel — RM{price}/sqft with free installation` (e.g. `Fluted wall panel — From RM25/sqft with free installation`). MS/ZH translate accordingly.
- **Style gallery swatch:** EN `{Style} wall panel sample close-up` / MS `Sampel panel dinding {gaya}` / ZH `{风格}墙板样品特写`
- **Customer gallery photo:** EN `Completed {style} wall panel installation in {city}` / MS `Pemasangan panel dinding {gaya} siap di {bandar}` / ZH `{城市}已完成的{风格}墙板安装`

Every image on every page MUST have non-empty alt text. Decorative-only background images use `alt=""` and `role="presentation"` (the eyebrow + heading + body carry the SEO weight).

---

## 4. Schema Markup Plan

All JSON-LD lives in `components/schema/*.tsx` and is injected via helpers in `lib/seo.ts`. Emit one `<script type="application/ld+json">` per schema type per page.

### 4.1 Per page type

| Page type | Schemas emitted |
|---|---|
| **Homepage** (×3 locales) | `Organization`, `LocalBusiness` (subtype `HomeAndConstructionBusiness`), `WebSite` (with `SearchAction`), `BreadcrumbList`, `Product` × 2 parents (Standard + Marble), `FAQPage`, `ItemList` (top-12 locations as `ListItem`) |
| **Location page** (×~465) | `LocalBusiness` (same HQ, `areaServed = {City}`, unique `@id` per URL), `BreadcrumbList` (Home → Wall Panel → {City}), `FAQPage` (5 visible Q&A), `Product` × 2 parents (scoped `@id` per page) |
| **Blog hub** | `Blog` / `CollectionPage`, `BreadcrumbList` |
| **Blog post** | `Article` (with `headline`, `image`, `author`, `datePublished`, `dateModified`, `publisher`), `BreadcrumbList`, `FAQPage` if the article has an FAQ block |

### 4.2 Required fields

**Organization (root — emitted from `app/[locale]/layout.tsx`)**
```
name: "Wall Panel Malaysia"
legalName: "Encik Beku Aircond Sdn. Bhd."
url: "https://wall-panel-malaysia.vercel.app/{locale}"
logo: "https://wall-panel-malaysia.vercel.app/og/logo.png"
sameAs: ["https://wa.me/601116655300"]
contactPoint: { telephone: "+601116655300", contactType: "customer service", areaServed: "MY", availableLanguage: ["en","ms","zh"] }
```

**LocalBusiness (homepage + every location page)**
```
"@type": ["LocalBusiness", "HomeAndConstructionBusiness"]
name: "Wall Panel Malaysia"
address: { addressCountry: "MY", addressRegion: "{State}", addressLocality: "{City — location pages}" }
telephone: "+601116655300"
priceRange: "RM25 - RM48 per sqft"
areaServed: "{City or 'Malaysia'}"
@id: "<full-url>#localbusiness"   ← unique per page to prevent collapse
```

**Product (homepage + every location page — emit BOTH parents)**
```
"@type": "Product",
"@id": "<page-url>#product-standard-wall-panel",
"name": "Standard Wall Panel (Wood / Fluted / PVC / Acoustic)",
"description": "...",
"image": ["..."],
"brand": { "@type": "Brand", "name": "Wall Panel Malaysia" },
"offers": {
  "@type": "AggregateOffer",
  "priceCurrency": "MYR",
  "lowPrice": "25.00",
  "highPrice": "50.00",
  "availability": "https://schema.org/InStock",
  "areaServed": "{City or Malaysia}"
}
```

```
"@type": "Product",
"@id": "<page-url>#product-marble-wall-panel",
"name": "Marble Wall Panel (Gold / Silver / Black)",
"offers": {
  "@type": "AggregateOffer",
  "priceCurrency": "MYR",
  "lowPrice": "38.00",
  "highPrice": "48.00",
  "availability": "https://schema.org/InStock"
}
```

Critical: each Product `@id` must be page-scoped (`<url>#product-...`) so Google does NOT collapse ~930 Product entries (2 × ~465) into one.

**FAQPage** — one `Question` per visible FAQ card; `acceptedAnswer.text` MUST match visible text exactly (hidden-FAQ schema is penalised).

**BreadcrumbList**
- Homepage: position 1 `Home` (current — usually omitted; emit only if breadcrumb is visible).
- Location: position 1 `Home` → `/{locale}`, position 2 `Wall Panel` → `/{locale}#styles` (anchor — no intermediate page exists), position 3 `{City}` (current, non-linked).
- Blog post: position 1 `Home`, position 2 `Blog` → `/{locale}/blog`, position 3 `{Article title}` (current).

**Article (blog post)**
```
"@type": "Article",
"headline": "<H1>",
"image": ["<cover_image_url>"],
"datePublished": "<ISO>",
"dateModified": "<ISO>",
"author": { "@type": "Organization", "name": "Wall Panel Malaysia" },
"publisher": { "@type": "Organization", "name": "Wall Panel Malaysia", "logo": { "@type": "ImageObject", "url": "<logo>" } },
"mainEntityOfPage": "<canonical-url>"
```

### 4.3 Validation gate

Kimmy runs every page-type sample (1 homepage, 3 location pages of varying state, 1 blog hub, 1 blog post) through Google's Rich Results Test before launch. Zero errors required. Warnings acceptable only on optional fields (e.g. `aggregateRating`, which we don't have at launch).

---

## 5. Hreflang Plan

Every indexable page emits FOUR `<link rel="alternate">` tags PLUS self-canonical. Example for `/en/wall-panel/shah-alam`:

```html
<link rel="alternate" hreflang="en" href="https://wall-panel-malaysia.vercel.app/en/wall-panel/shah-alam" />
<link rel="alternate" hreflang="ms" href="https://wall-panel-malaysia.vercel.app/ms/wall-panel/shah-alam" />
<link rel="alternate" hreflang="zh" href="https://wall-panel-malaysia.vercel.app/zh/wall-panel/shah-alam" />
<link rel="alternate" hreflang="x-default" href="https://wall-panel-malaysia.vercel.app/en/wall-panel/shah-alam" />
<link rel="canonical" href="https://wall-panel-malaysia.vercel.app/en/wall-panel/shah-alam" />
```

### Rules for Kimmy

1. Every one of the ~500 indexable pages emits a 4-entry hreflang block (self-reference included — Google's hreflang spec requires it).
2. `x-default` always points to the `en` variant of that same logical page.
3. `canonical` is always self (the locale-prefixed URL itself).
4. Sitemap.xml must also include `<xhtml:link rel="alternate" hreflang="...">` for every URL group.
5. hreflang values are bare `en` / `ms` / `zh` — NOT `en-MY` / `ms-MY` / `zh-MY`. This keeps the brand discoverable in Singapore/Indonesia/Brunei MS+ZH searches without hard region-pinning.
6. Mandarin variant is **Simplified only** (`zh` = `zh-Hans`). No Traditional alternate.
7. The WhatsApp redirect page is `noindex,nofollow` and does NOT emit hreflang.

---

## 6. Sitemap Rules

`app/sitemap.ts` produces a single `/sitemap.xml` that includes every locale × every indexable page, with hreflang alternates per URL group.

### 6.1 Static entries (built at generation time)

For each `locale ∈ {en, ms, zh}`:
- `/{locale}` — homepage (priority 1.0, changefreq weekly)
- `/{locale}/blog` — blog hub (priority 0.7, changefreq weekly)
- For each `slug` in `config/locations.ts`: `/{locale}/wall-panel/{slug}` (priority 0.8, changefreq monthly)

### 6.2 Dynamic entries (fetched via webcore at build time)

`getBlogPosts(locale)` from `lib/webcore.ts` returns the live list of published posts per locale. For each row:
- `/{locale}/blog/{slug}` (priority 0.6, `lastModified = blog_posts.published_at`)

Blog post entries are revalidated via `revalidateTag('webcore-blog')` whenever the webcore admin webhooks. The sitemap regenerates with the next build / on-demand revalidate.

### 6.3 Hreflang in sitemap

Each URL entry is grouped with its locale alternates:
```xml
<url>
  <loc>https://wall-panel-malaysia.vercel.app/en/wall-panel/shah-alam</loc>
  <xhtml:link rel="alternate" hreflang="en" href=".../en/wall-panel/shah-alam"/>
  <xhtml:link rel="alternate" hreflang="ms" href=".../ms/wall-panel/shah-alam"/>
  <xhtml:link rel="alternate" hreflang="zh" href=".../zh/wall-panel/shah-alam"/>
  <xhtml:link rel="alternate" hreflang="x-default" href=".../en/wall-panel/shah-alam"/>
  <lastmod>2026-05-11</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 6.4 Excluded from sitemap

- `/[locale]/redirect-whatsapp-1` (dynamic, `noindex`)
- `/api/revalidate`
- `/` (root — gets 308-redirected by `next-intl` middleware to the locale-detected prefix)

### 6.5 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*/redirect-whatsapp-1*

Sitemap: https://wall-panel-malaysia.vercel.app/sitemap.xml
```

---

## 7. Internal Linking Matrix

The internal-link graph is what makes ~500 pages discoverable AND distributes ranking authority. Every link below is within-locale (a `/en/...` page never links to a `/ms/...` page — locale switches go through the language switcher only).

### 7.1 Homepage links to

| Target | Mechanism | Count |
|---|---|---|
| Every location page (within current locale) | `LocationCloud` section grouped by state | ~155 |
| Product anchor (#styles) | StyleGallery jump links | 5 |
| Blog hub | InlineHeader nav + InlineFooter quick links + LocationCloud footer | 3 |
| WhatsApp redirect | every WhatsApp CTA (hero, nav, sticky, USP, final) | ~6 inline links |
| Self (canonical) | `<link rel="canonical">` | 1 |

Anchor text rules:
- LocationCloud links: EN `Wall Panel Installation in {City}` / MS `Pemasangan Panel Dinding {Bandar}` / ZH `{城市}墙板安装` (exact-match keyword anchors — homepage is the highest authority page so partial-match exact anchors are fine here at scale because they vary per city).
- Blog hub link: EN `Wall Panel Guides & Ideas` / MS `Panduan & Idea Panel Dinding` / ZH `墙板指南与创意`.

### 7.2 Location page links to

| Target | Mechanism | Count |
|---|---|---|
| Homepage | InlineHeader logo + InlineFooter | 2 |
| 4–6 nearest neighbour locations (within locale) | `NearbyLocations` section, sourced from `config/locations.ts → nearbyMap` | 4–6 |
| Blog hub | InlineHeader nav | 1 |
| Top-12 locations | InlineFooter (KL, PJ, Shah Alam, JB, Penang, Ipoh, Seremban, Melaka, Kuantan, Kota Bharu, KK, Kuching) | 12 |
| WhatsApp redirect with `?loc={this-slug}` | every WhatsApp CTA | ~6 |

Anchor text rules:
- Nearby locations: EN `Wall panel installation in {Nearby city}` / MS `Pemasangan panel dinding di {Bandar berdekatan}` / ZH `{附近城市}墙板安装`.
- Homepage link: EN `Wall Panel Malaysia` (brand anchor) / MS `Wall Panel Malaysia` / ZH `Wall Panel Malaysia`.

### 7.3 Blog post links to

| Target | Mechanism | Count |
|---|---|---|
| 2–3 related blog posts | "Related guides" block at article bottom | 2–3 |
| Homepage | mid-article CTA banner + breadcrumb | 2 |
| 1–2 location pages (semantically relevant — e.g. an article on "Acoustic panels for KL offices" links to KL + PJ location pages) | inline body links + sidebar | 1–2 |
| Blog hub | breadcrumb | 1 |
| WhatsApp redirect | BlogCtaBanner | 1 |

Anchor text rules:
- Location links from blog: EN `wall panel installation in {City}` / MS `pemasangan panel dinding di {Bandar}` / ZH `{城市}墙板安装`.
- Related-post links: use the related post's H1 verbatim.

### 7.4 Footer top-12 (every page renders these)

`kuala-lumpur` · `petaling-jaya` · `shah-alam` · `johor-bahru` · `george-town` · `ipoh` · `seremban` · `melaka` · `kuantan` · `kota-bharu` · `kota-kinabalu` · `kuching`

Rationale: 12 highest-commercial-intent cities (state capitals + Klang Valley anchors). They receive ~500 inbound footer links each — maximum internal authority flow → fastest ranking on city-modified terms.

### 7.5 Cross-locale links

The `LanguageSwitcher` component (in InlineHeader + InlineFooter) preserves the current pathname when swapping locale (e.g. `/ms/wall-panel/shah-alam` → `/zh/wall-panel/shah-alam`). This is a navigational link with `hreflang` attribute set; do NOT use exact-match keyword anchor text on locale-switcher links — use the language label only (`English` / `Bahasa Melayu` / `中文`).

---

## 8. Blog Article Title Proposals (12 Starters for Hanabi)

Each article addresses a distinct buyer-intent stage (awareness / consideration / decision) and links back into the product + location graph. Hanabi expands these into 10+ posts × 3 locales (≥30 total articles). Each article needs an EN, MS, and ZH translation with locale-appropriate phrasing — these titles are the EN seeds.

### 8.1 Comparison / decision intent

1. **"Wood vs PVC Wall Panel: Which Is Best for Malaysian Homes?"** — head-to-head specs (durability, water-resistance, warmth, price). Internal-links to product page + Shah Alam + KL.
2. **"Real Marble vs PU Marble Wall Panel — What's the Actual Difference?"** — addresses the #1 customer confusion. Heavy use of `marble wall panel`, `PU marble`, `gloss marble` keywords. Links to Marble Wall Panel product anchor.
3. **"Acoustic vs Fluted Wall Panel: Which One Actually Reduces Noise?"** — debunks the assumption that fluted = soundproof. Strong long-tail capture.

### 8.2 Pricing / cost intent (highest commercial value)

4. **"How Much Does Wall Panel Cost Per Sqft in Malaysia? (2026 Pricing)"** — direct match for `wall panel price Malaysia` and `wall panel per sqft`. Includes the RM25/sqft and RM38/sqft anchors, breaks down what affects price (style, area, finishing). Links to homepage + Petaling Jaya + Cyberjaya.
5. **"Is Free Wall Panel Installation Really Free? What's Included in 2026"** — captures `free installation wall panel` searches, builds trust, links to homepage CTA.

### 8.3 Style / inspiration (top-of-funnel, awareness)

6. **"15 Fluted Wall Panel Ideas for Modern Living Rooms in Malaysia"** — listicle. Captures `fluted wall panel ideas`, `fluted wall panel living room`. Heavy visual / Pinterest play.
7. **"Marble Wall Panel for TV Feature Walls: 12 Designs Trending in 2026"** — captures `feature wall panel`, `TV feature wall marble`. Links to Marble product + KL + Damansara location pages.
8. **"Wood Wall Panel Bedroom Ideas: Warm, Hotel-Style Designs Malaysians Love"** — captures `wood wall panel bedroom`. Links to Wood variant + Shah Alam + Petaling Jaya.

### 8.4 Use-case / functional intent

9. **"Acoustic Wall Panel for Home Office: Does It Really Work? (Real Tests)"** — exact-match `acoustic wall panel for home office`. Targets WFH segment. Links to Acoustic variant + Cyberjaya + Bangsar.
10. **"Office Reception Wall Panel: 8 Designs That Impress Clients on Day 1"** — B2B angle. Captures `office wall panel design`, `office reception wall panel`. Links to KL + Mont Kiara + Putrajaya.

### 8.5 Materials / education intent

11. **"PVC Wall Panel: The Honest Pros, Cons & Maintenance Guide"** — captures `PVC wall panel`, `PVC wall panel maintenance`. Long-tail magnet.
12. **"Wall Panel Installation Timeline: From WhatsApp to Finished in 7 Days"** — captures `wall panel installation time Malaysia`, builds urgency. Links to homepage CTA + 3 location pages.

### 8.6 Optional location-modified articles (Hanabi may add 1–3 of these as bonus)

- **"Why Klang Valley Condos Are Choosing Acoustic Wall Panels in 2026"** (KL + PJ + Cyberjaya angle)
- **"Wall Panel Installation in Johor Bahru: A Buyer's Cheat Sheet"** (JB local intent)
- **"Penang Heritage Home Renovation: Adding Wood Wall Panel Without Killing the Character"** (George Town local intent)

### 8.7 Article spec for Hanabi (every post)

- One H1, one H2, H3–H4 for body sections (per CLAUDE.md heading rules).
- 900–1500 words EN; MS/ZH translations may be slightly shorter as is natural to the language but never thinner than 700 words.
- Primary keyword in H1, opening paragraph, one H3, and meta description.
- 3–5 internal links per article (per Section 7.3): 2–3 to related posts, 1–2 to location pages, 1 to homepage.
- 4–8 images with descriptive alt text (per Section 3.7 patterns).
- Excerpt (≤160 chars) for blog hub cards.
- Meta title ≤60 chars + meta description ≤158 chars.
- Inserted into `blog_posts` + `blog_translations` with `status = 'published'`.

---

## 9. Handoff Checklist

- [x] Section 0 — Canonical location source locked (`config/locations.ts`, ~155 slugs)
- [x] Section 1 — Primary / secondary / long-tail keywords per locale, cannibalisation rules
- [x] Section 2 — ~500 URL hierarchy mapped to primary keywords
- [x] Section 3 — Title / H1 / H2 / meta / alt-text patterns per page type per locale, plus density + heading rules
- [x] Section 4 — Schema markup plan (Organization, LocalBusiness, Product, FAQPage, BreadcrumbList, Article, WebSite, Blog/CollectionPage)
- [x] Section 5 — Hreflang policy (3 locales + x-default, bare codes, sitemap alternates)
- [x] Section 6 — Sitemap + robots.txt rules including dynamic blog ingestion via webcore
- [x] Section 7 — Internal linking matrix (homepage → all, location → 4–6 nearby + 12 footer, blog → 2–3 related + 1–2 locations)
- [x] Section 8 — 12 blog article title proposals for Hanabi (+ 3 optional location-modified bonuses)

### Downstream consumers

- **Nana** consumes Sections 0, 1.4, 3, 7 → produces ~465 unique location intros + 5 FAQ × ~465 + homepage copy × 3 locales + product descriptions × 3 locales + ~500 meta-title/description pairs.
- **Kimmy** consumes Sections 3, 4, 5, 6 → implements `lib/seo.ts` metadata builders, JSON-LD schema components, hreflang on every page, the sitemap + robots, the language switcher, and the `/api/revalidate` webhook handler.
- **Hanabi** consumes Section 8 → writes 10+ blog posts × 3 locales (≥30 entries) per the article spec in 8.7.
- **Cyclops** consumes Section 4 (product attributes for `Product` JSON-LD) and Section 2 (URL count, so seeded `phone_numbers.location_slug` defaults to `'all'`).
- **Layla** uses Section 6 to verify sitemap output post-deploy and Section 4 to spot-check Rich Results.

No blockers. Keyword strategy locked; downstream agents may proceed.
