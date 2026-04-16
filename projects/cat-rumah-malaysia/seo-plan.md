# SEO Plan: Cat Rumah Malaysia

**Version:** 1.0
**Date:** 2026-04-15
**SEO Strategist:** Sora
**Project:** Cat Rumah Malaysia — House Painting Service
**Domain:** https://cat-rumah-malaysia.vercel.app
**Default locale:** `ms` (Bahasa Melayu) | Secondary: `en`, `zh`
**Market:** Malaysia only
**Pages covered:** 1 homepage + 16 location pages × 3 locales = 54 indexable pages
**URL pattern:** `/[locale]/cat-rumah/[location]` (product slug `cat-rumah` identical in all locales)

---

## 1. Primary Keyword Strategy

### 1.1 Core money keywords (head terms)

| Locale | Core keyword | Intent | Why |
|--------|--------------|--------|-----|
| ms | **cat rumah** | Commercial | Highest-volume MS head term; matches brand name; covers both DIY and service intent |
| ms | **servis cat rumah** | Transactional | Pure service intent — zero ambiguity with paint-product searches |
| ms | **tukang cat rumah** | Transactional | Painter-hire intent; very strong local-service signal |
| en | **house painting Malaysia** | Commercial | Top EN head term for the national market |
| en | **house painter Malaysia** | Transactional | Service-hire intent |
| zh | **油漆服务 马来西亚** | Commercial | Top ZH service-intent head term in MY market |
| zh | **房屋油漆** | Commercial | Core MY-Chinese term for residential painting |

**Reason:** The brand name "Cat Rumah Malaysia" is itself the dominant MS search term, so we lean into exact-match on the homepage and use modifiers on location pages to avoid cannibalization.

### 1.2 Service-modifier long-tails (used on homepage + Products section anchor copy)

Bahasa Melayu:
- `cat dinding rumah` (interior wall)
- `cat luar rumah` / `cat dinding luar rumah` / `cat weathershield` (exterior)
- `cat siling rumah`
- `cat epoxy lantai` / `epoxy lantai rumah`
- `cat pagar rumah` / `cat pagar besi`
- `cat besi luar rumah`
- `harga cat rumah per kaki persegi`
- `cat rumah murah`
- `kontraktor cat rumah`
- `cat rumah Nippon Paint` / `cat rumah Jotun` / `cat rumah Dulux`

English:
- `interior wall painting Malaysia`
- `exterior wall painting Malaysia`
- `weathershield painting Malaysia`
- `ceiling painting service`
- `epoxy floor paint Malaysia`
- `fence painting service`
- `outdoor metal paint Malaysia`
- `house painting price per square foot Malaysia`
- `cheap house painter Malaysia`
- `Nippon Paint contractor Malaysia`

Mandarin (Simplified):
- `室内墙壁油漆`
- `外墙油漆` / `外墙防水漆`
- `天花板油漆`
- `环氧地坪漆` / `地板环氧漆`
- `围栏油漆` / `铁围栏油漆`
- `户外金属漆`
- `房屋油漆价格 马来西亚`
- `便宜油漆工 马来西亚`
- `立邦漆 承包商` / `Jotun 油漆` / `多乐士油漆`

### 1.3 Location-modifier pattern (used on all 16 location pages)

Template (filled per city):
- MS: `cat rumah {City}`, `servis cat rumah {City}`, `tukang cat rumah {City}`, `kontraktor cat rumah {City}`, `harga cat rumah {City}`
- EN: `house painting {City}`, `house painter {City}`, `interior wall painting {City}`, `exterior painting {City}`
- ZH: `{City} 油漆服务`, `{City} 房屋油漆`, `{City} 油漆工`

**Reason:** Google MY ranks city-modified queries separately from the bare head term — this is where dynamic location pages earn their traffic. By restricting the locality modifier to location pages (and NEVER putting city names in the homepage H1/title), we eliminate cannibalization between homepage and location pages.

### 1.4 Keyword-to-URL map (anti-cannibalization)

| Keyword family | Target page | Must NOT appear in H1/title of |
|----------------|-------------|---------------------------------|
| `cat rumah`, `house painting Malaysia`, `油漆服务 马来西亚` | Homepage `/[locale]` | Location pages |
| `cat rumah {city}`, `house painter {city}`, `{city} 油漆服务` | Location page `/[locale]/cat-rumah/{city}` | Homepage, other location pages |
| `cat dinding rumah`, `cat luar rumah`, `cat siling`, `cat epoxy lantai`, `cat pagar rumah`, `outdoor metal paint` | Products section on BOTH homepage and location pages (section H2, not H1) | — |

**Reason:** One H1 per page per keyword family. Service-modifier keywords live in H2s inside the Products section because the 6 services are NOT separate pages (per architecture §Products Config).

---

## 2. Page Hierarchy

```
Homepage /[locale]                           ← National/brand head terms
├── /[locale]/cat-rumah/kuala-lumpur         ← "cat rumah Kuala Lumpur"
├── /[locale]/cat-rumah/petaling-jaya        ← "cat rumah Petaling Jaya"
├── /[locale]/cat-rumah/shah-alam            ← "cat rumah Shah Alam"
├── /[locale]/cat-rumah/subang-jaya
├── /[locale]/cat-rumah/puchong
├── /[locale]/cat-rumah/cheras
├── /[locale]/cat-rumah/ampang
├── /[locale]/cat-rumah/klang
├── /[locale]/cat-rumah/kajang
├── /[locale]/cat-rumah/cyberjaya
├── /[locale]/cat-rumah/putrajaya
├── /[locale]/cat-rumah/seremban
├── /[locale]/cat-rumah/melaka
├── /[locale]/cat-rumah/johor-bahru
├── /[locale]/cat-rumah/ipoh
└── /[locale]/cat-rumah/george-town
```

**Location slugs** (match Alpha's list exactly — verified against `architecture.md §8`):
`kuala-lumpur`, `petaling-jaya`, `shah-alam`, `subang-jaya`, `puchong`, `cheras`, `ampang`, `klang`, `kajang`, `cyberjaya`, `putrajaya`, `seremban`, `melaka`, `johor-bahru`, `ipoh`, `george-town`.

**Page tiers:**
- **Tier 1 (brand authority hub):** Homepage × 3 locales. Targets national head terms and aggregates all internal link equity.
- **Tier 2 (local landing pages):** 16 city pages × 3 locales = 48. Targets `{head term} + {city}` queries.
- **Utility (noindex):** `/[locale]/redirect-whatsapp-1` — Kimmy must set `robots: { index: false, follow: false }`. **Reason:** it's a tracking redirect, not content.

---

## 3. H1 / Title / Meta Formulas

Rules applied:
- Meta title **≤ 60 chars** (including separators)
- Meta description **≤ 155 chars**
- Every H1 contains the primary target keyword
- Every meta title contains the primary target keyword + brand
- Every meta description contains the target keyword + pricing hook (`RM3.50/sqft`) + CTA verb
- Self-referencing canonical on every page

### 3.1 Homepage

| Field | ms (default) | en | zh |
|-------|-------|-------|-------|
| **H1** | Cat Rumah Malaysia — Dari RM3.50/sqft | House Painting Malaysia — From RM3.50/sqft | 马来西亚房屋油漆 — RM3.50/平方尺起 |
| **Title formula** | `{Brand} \| Servis Cat Rumah Dari RM3.50/sqft` | `House Painting Malaysia \| From RM3.50/sqft` | `马来西亚房屋油漆服务 \| RM3.50/平方尺起` |
| **Title example** | Cat Rumah Malaysia \| Servis Dari RM3.50/sqft (55) | House Painting Malaysia \| From RM3.50/sqft (48) | 马来西亚房屋油漆服务 \| RM3.50/平方尺起 (23) |
| **Description** | Servis cat rumah Malaysia dari RM3.50/sqft. Cat dinding, luar, siling, epoxy lantai & pagar. Nippon Paint, Jotun, Dulux. WhatsApp sekarang! (152) | Professional house painting Malaysia from RM3.50/sqft. Interior, exterior, ceiling, epoxy floor & fence. Nippon, Jotun, Dulux. WhatsApp now! (146) | 马来西亚专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧地坪、围栏油漆。立邦、Jotun、多乐士。立即 WhatsApp！(64) |

### 3.2 Location page formula

**H1 formula (MS):** `Cat Rumah {City} — Dari RM3.50/sqft`
**H1 formula (EN):** `House Painting {City} — From RM3.50/sqft`
**H1 formula (ZH):** `{City} 房屋油漆服务 — RM3.50/平方尺起`

**Title formula (MS):** `Cat Rumah {City} | {Brand} Dari RM3.50/sqft`
**Title formula (EN):** `House Painter {City} | From RM3.50/sqft`
**Title formula (ZH):** `{City} 房屋油漆服务 | RM3.50/平方尺起`

**Description formula (MS):** `Servis cat rumah {City} dari RM3.50/sqft. Cat dinding, luar, siling & epoxy. Nippon Paint, Jotun, Dulux. Quote percuma — WhatsApp sekarang!`

**Description formula (EN):** `Trusted house painter {City} from RM3.50/sqft. Interior, exterior, ceiling & epoxy floor. Nippon, Jotun, Dulux. Free quote — WhatsApp now!`

**Description formula (ZH):** `{City} 专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧地坪。立邦、Jotun、多乐士。免费报价 — 立即 WhatsApp！`

### 3.3 Filled examples for real cities

**Kuala Lumpur — ms**
- H1: `Cat Rumah Kuala Lumpur — Dari RM3.50/sqft`
- Title: `Cat Rumah Kuala Lumpur | Dari RM3.50/sqft` (46 chars)
- Description: `Servis cat rumah Kuala Lumpur dari RM3.50/sqft. Cat dinding, luar, siling & epoxy. Nippon, Jotun, Dulux. Quote percuma — WhatsApp sekarang!` (140)

**Kuala Lumpur — en**
- H1: `House Painting Kuala Lumpur — From RM3.50/sqft`
- Title: `House Painter Kuala Lumpur | From RM3.50/sqft` (46)
- Description: `Trusted house painter Kuala Lumpur from RM3.50/sqft. Interior, exterior, ceiling & epoxy floor. Nippon, Jotun, Dulux. Free quote — WhatsApp now!` (146)

**Kuala Lumpur — zh**
- H1: `吉隆坡房屋油漆服务 — RM3.50/平方尺起`
- Title: `吉隆坡房屋油漆服务 | RM3.50/平方尺起` (20)
- Description: `吉隆坡专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧地坪。立邦、Jotun、多乐士。免费报价 — 立即 WhatsApp！` (67)

**Petaling Jaya — ms**
- H1: `Cat Rumah Petaling Jaya — Dari RM3.50/sqft`
- Title: `Cat Rumah Petaling Jaya | Dari RM3.50/sqft` (42)
- Description: `Servis cat rumah Petaling Jaya dari RM3.50/sqft. Cat dinding, luar, siling & epoxy. Nippon, Jotun, Dulux. Quote percuma — WhatsApp sekarang!` (141)

**Petaling Jaya — en**
- H1: `House Painting Petaling Jaya — From RM3.50/sqft`
- Title: `House Painter Petaling Jaya | From RM3.50/sqft` (47)
- Description: `Trusted house painter Petaling Jaya from RM3.50/sqft. Interior, exterior, ceiling & epoxy floor. Nippon, Jotun, Dulux. Free quote — WhatsApp now!` (147)

**Johor Bahru — ms**
- H1: `Cat Rumah Johor Bahru — Dari RM3.50/sqft`
- Title: `Cat Rumah Johor Bahru | Dari RM3.50/sqft` (40)
- Description: `Servis cat rumah Johor Bahru dari RM3.50/sqft. Cat dinding, luar, siling & epoxy. Nippon, Jotun, Dulux. Quote percuma — WhatsApp sekarang!` (139)

**Johor Bahru — zh**
- H1: `新山房屋油漆服务 — RM3.50/平方尺起`
- Title: `新山房屋油漆服务 | RM3.50/平方尺起` (19)
- Description: `新山专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧地坪。立邦、Jotun、多乐士。免费报价 — 立即 WhatsApp！` (66)

### 3.4 Standard H2 section headings (identical order on homepage and location pages — per architecture §Section Order)

For the location page, Nana must localize `{City}` where marked:

| # | Section | MS H2 | EN H2 | ZH H2 |
|---|---------|-------|-------|-------|
| 3 | Hero subheadline | Rumah Lama Nampak Baru Dalam 5 Jam | Make Your Old House Look New in 5 Hours | 让旧房焕然一新，仅需5小时 |
| 5 | Products | 6 Servis Cat Rumah Kami | Our 6 House Painting Services | 我们的6项房屋油漆服务 |
| 6 | How It Works | Cara Tempah Dalam 3 Langkah | How It Works in 3 Steps | 3个简单步骤 |
| 7 | Risk/Problem | Masalah Rumah Anda Sekarang | Problems With Your Home Right Now | 您家目前的问题 |
| 9 | Google Reviews | Ulasan Google 4.9/5 | 4.9/5 Google Reviews | 4.9/5 Google 评价 |
| 10 | Why Choose | Kenapa Pilih Cat Rumah Malaysia | Why Choose Cat Rumah Malaysia | 为什么选择 Cat Rumah Malaysia |
| 11 | Gallery | Galeri Sebelum & Selepas | Before & After Gallery | 前后对比图库 |
| 12 | Locations | Kami Beroperasi Di Seluruh Malaysia | We Serve All Over Malaysia | 我们服务全马来西亚 |
| 13 | FAQ (location page) | Soalan Lazim Cat Rumah {City} | FAQs — House Painting {City} | {City} 房屋油漆常见问题 |
| 14 | Final CTA | Dapatkan Quote Percuma Hari Ini | Get Your Free Quote Today | 立即获取免费报价 |

**Reason:** Parallel H2 structure across all 54 pages gives Google a predictable semantic template; keyword variation sits inside H3s and paragraph copy (handled by Nana) to avoid exact-match duplication.

---

## 4. Internal Linking Plan

### 4.1 Link graph

```
                ┌──────────────────────┐
                │  Homepage /[locale]  │◄────── Footer links (every page)
                └──────────┬───────────┘
                           │ Locations Accordion (12 → all 16 city links)
                           │ Footer (→ 6 featured Klang Valley cities)
                           ▼
           ┌──────────────────────────────────┐
           │  Location Pages /[locale]/       │
           │  cat-rumah/{city}  (×16)         │
           └───┬──────────────┬───────────────┘
               │              │
               │ Breadcrumbs  │ Nearby Locations (3 per page)
               │ (→ Home)     │ (→ sister city pages)
               ▼              ▼
         Homepage       3 nearest cities
```

### 4.2 Link rules

| From | To | Link type | Anchor text pattern | Reason |
|------|----|-----------|---------------------|--------|
| Homepage | All 16 location pages | `LocationsAccordion` section (12) | MS: `Cat Rumah {City}` / EN: `House Painting {City}` / ZH: `{City} 房屋油漆` | Flat link equity distribution from highest-authority page; exact-match city anchors fuel local ranking |
| Homepage | Same homepage in other locales | `LanguageSwitcher` | lang name | hreflang cluster + UX |
| Location page | Homepage | `Breadcrumbs` + `Nav` logo | Brand name | Sends link equity upstream; satisfies breadcrumb schema |
| Location page | 3 nearby cities | `NearbyLocations` section (between 12 and 13) | `Cat Rumah {NearbyCity}` | Topical proximity signals; retains users on-site |
| Location page | All 16 locations | `LocationsAccordion` (collapsed by default) | Same as homepage | Ensures every location page is ≤2 clicks from every other |
| All pages | Homepage + 6 featured cities (KL, PJ, Shah Alam, Johor Bahru, Penang, Ipoh) | `Footer` | City name | Sitewide link to top commercial targets |
| Location page | WhatsApp redirect | `WhatsAppButton` with `?loc={slug}` | CTA copy | Required for phone-number routing (architecture §Data Flow) |

**Nearby location pairings** (must match `config/locations.ts` — locked now by Sora so Nana + Kimmy use one source of truth):

| City | Nearby (3) |
|------|-----------|
| kuala-lumpur | petaling-jaya, cheras, ampang |
| petaling-jaya | kuala-lumpur, subang-jaya, shah-alam |
| shah-alam | petaling-jaya, subang-jaya, klang |
| subang-jaya | petaling-jaya, puchong, shah-alam |
| puchong | subang-jaya, petaling-jaya, cyberjaya |
| cheras | kuala-lumpur, ampang, kajang |
| ampang | kuala-lumpur, cheras, kajang |
| klang | shah-alam, petaling-jaya, subang-jaya |
| kajang | cheras, ampang, putrajaya |
| cyberjaya | putrajaya, puchong, kajang |
| putrajaya | cyberjaya, kajang, seremban |
| seremban | putrajaya, kajang, melaka |
| melaka | seremban, johor-bahru, putrajaya |
| johor-bahru | melaka, seremban, kuala-lumpur |
| ipoh | kuala-lumpur, petaling-jaya, george-town |
| george-town | ipoh, kuala-lumpur, petaling-jaya |

**Reason:** Geographical proximity first, capital-city fallback where a city is isolated (Ipoh/Penang) to avoid dangling link clusters.

### 4.3 Anti-cannibalization link discipline

- Homepage internal anchor text to city pages MUST use the city name — never the bare head term `cat rumah`.
- Bare head-term anchors (`cat rumah`) from footer or body copy MUST point to the homepage only.
- Products section anchors (`Cat Dinding Rumah`, `Cat Luar Rumah`, etc.) MUST be in-page jump links (`#products-...`), NOT external links, since services are not separate pages.

---

## 5. Multilingual SEO Requirements

### 5.1 URL structure

- `prefix-always` strategy (next-intl) — **every** URL carries its locale prefix including the default `ms`.
- Product slug `cat-rumah` and all 16 location slugs stay **lowercase-hyphen English** in all locales (architecture §6). Do NOT translate slugs.
- Root `/` → 301 → `/ms`.

### 5.2 hreflang requirements

Every page (homepage and every location page) MUST output a hreflang cluster containing:
- `ms-MY` → Bahasa Melayu version
- `en-MY` → English version
- `zh-Hans-MY` → Simplified Chinese version (per architecture §6)
- `x-default` → `ms-MY` version (default locale)

Plus self-referencing `<link rel="canonical">` pointing to the locale-specific URL.

#### Homepage hreflang example

```html
<link rel="canonical" href="https://cat-rumah-malaysia.vercel.app/ms" />
<link rel="alternate" hreflang="ms-MY" href="https://cat-rumah-malaysia.vercel.app/ms" />
<link rel="alternate" hreflang="en-MY" href="https://cat-rumah-malaysia.vercel.app/en" />
<link rel="alternate" hreflang="zh-Hans-MY" href="https://cat-rumah-malaysia.vercel.app/zh" />
<link rel="alternate" hreflang="x-default" href="https://cat-rumah-malaysia.vercel.app/ms" />
```

#### Location page hreflang example (Kuala Lumpur)

```html
<link rel="canonical" href="https://cat-rumah-malaysia.vercel.app/ms/cat-rumah/kuala-lumpur" />
<link rel="alternate" hreflang="ms-MY" href="https://cat-rumah-malaysia.vercel.app/ms/cat-rumah/kuala-lumpur" />
<link rel="alternate" hreflang="en-MY" href="https://cat-rumah-malaysia.vercel.app/en/cat-rumah/kuala-lumpur" />
<link rel="alternate" hreflang="zh-Hans-MY" href="https://cat-rumah-malaysia.vercel.app/zh/cat-rumah/kuala-lumpur" />
<link rel="alternate" hreflang="x-default" href="https://cat-rumah-malaysia.vercel.app/ms/cat-rumah/kuala-lumpur" />
```

**Reason:** Region-targeted hreflang (`-MY`) keeps us out of competition with Singapore/Indonesia variants of `cat rumah` / `house painting` — critical because Bahasa Indonesia and Bahasa Melayu share most vocabulary and Google sometimes conflates them. `x-default` → `ms` matches the architectural default and the primary audience.

### 5.3 Lang-specific keyword mapping

| Service slug | MS section H3 | EN section H3 | ZH section H3 |
|--------------|---------------|---------------|---------------|
| cat-dinding-rumah | Cat Dinding Rumah (Interior) | Interior Wall Painting | 室内墙壁油漆 |
| cat-luar-rumah | Cat Luar Rumah / Weathershield | Exterior Wall Weathershield | 外墙防水油漆 |
| cat-siling | Cat Siling Rumah | Ceiling Painting | 天花板油漆 |
| cat-epoxy-lantai | Cat Epoxy Lantai | Epoxy Floor Paint | 环氧地坪漆 |
| cat-pagar-rumah | Cat Pagar Rumah & Besi | Fence & Metal Painting | 围栏与铁件油漆 |
| outdoor-metal-paint | Cat Besi Luar Rumah | Outdoor Metal Paint | 户外金属漆 |

### 5.4 Sitemap

- `app/sitemap.ts` emits all 54 URLs (homepage × 3 + locations × 16 × 3), each with `alternates.languages` map — next-intl helper recommended.
- Redirect URL (`/[locale]/redirect-whatsapp-1`) **excluded** from sitemap — it's noindex.
- `lastModified` → build date; `changeFrequency: 'monthly'`; homepage `priority: 1.0`, location pages `priority: 0.8`.

### 5.5 robots.txt

- Allow all except `/*/redirect-whatsapp-1*`
- Reference sitemap at `https://cat-rumah-malaysia.vercel.app/sitemap.xml`

---

## 6. Content Requirements for Nana

### 6.1 Brief table — what Nana must write per page

| Page type | Copy blocks | Locales | Unique per-instance? | Target word count |
|-----------|-------------|---------|----------------------|-------------------|
| Homepage | FOMO banner line, Hero headline + subhead + USP bullets, Stats labels, 6 Product cards (name + 1-line benefit + price), 3 How-It-Works steps (title + desc), 4 Risk/Problem cards, Mid-CTA headline, 6 Google review quotes, 4 Why-Choose points, Gallery captions, Locations accordion state group titles, 6 homepage FAQ Q&A pairs, Final CTA headline, Footer tagline | ms, en, zh | n/a (one per locale) | 900–1100 per locale |
| Location page | **Unique intro paragraph (2–3 sentences mentioning city name + one local detail)**, location-aware Hero subheadline, reuse homepage Products/HowItWorks/etc., Nearby Locations intro line, **6 unique FAQs per city** (not reused), Final CTA line mentioning city | ms, en, zh | **YES — every city must be different; no boilerplate swap** | 400–600 unique words per city per locale |
| WhatsApp redirect | n/a — no content needed | n/a | n/a | n/a |

### 6.2 Mandatory elements per location page (SEO rules compliance)

Per CLAUDE.md §SEO Rules and §Dynamic Location Pages, every location page MUST include:

1. **Unique intro** — 2–3 sentence paragraph referencing at least ONE city-specific detail (housing type, climate note, neighbourhood name, or landmark). No template swapping. Example seeds Nana can use:
   - Kuala Lumpur → terrace houses in Bangsar, Cheras, Mont Kiara
   - Petaling Jaya → SS2, Damansara Uptown, PJ old town bungalows
   - Shah Alam → Seksyen 7, 13, gated community double-storeys
   - Johor Bahru → Iskandar Puteri, Bukit Indah, Mount Austin
   - George Town → pre-war shophouses, Tanjung Tokong condos
2. **Location-specific keywords** — city name must appear in H1, first paragraph, at least one H2, meta title, meta description, image alt text, and FAQ.
3. **6 FAQs per city** — see 6.3 below.
4. **Call-to-action** — WhatsApp button linking to `/[locale]/redirect-whatsapp-1?loc={city-slug}`.
5. **Dynamic phone number** — pulled from Supabase by Kimmy via the redirect page (no hardcoding).

### 6.3 FAQ template (Nana writes 6 unique Q&A per city × 3 locales = 18 per city)

FAQ slots (Nana varies answer per city, never copy-paste):
1. Harga / price per sqft + what it includes in {City}
2. Lead time — how fast can we start in {City}
3. Brands used (Nippon, Jotun, Dulux) and warranty
4. Interior vs exterior process difference for {City} climate/housing
5. Do we cover {specific neighbourhood in City}? list 3 neighbourhoods
6. How to get a free quote — WhatsApp CTA

**Reason:** 6 × 16 × 3 = 288 unique FAQ pairs. This is the largest single anti-duplicate-content lever on the site. Kimmy will read these into `FAQPage` schema (see §7).

### 6.4 Image alt text requirements (Nana writes, Kimmy implements)

Pattern: `{Service verb} {object} — {brand} — Cat Rumah {City}` (MS) / `{Service} by {brand} painter in {City}` (EN).
- Homepage hero image: `Kerja cat rumah profesional oleh Cat Rumah Malaysia — Nippon Paint`
- Location hero: `Cat dinding rumah di Kuala Lumpur — kontraktor Cat Rumah Malaysia`
- Gallery images: before/after pairs with `Sebelum: dinding rumah lama di {City}` / `Selepas: dinding dicat dengan Jotun di {City}`
- Product cards: `{Service name} — Nippon Paint / Jotun / Dulux`

Rule: Every image must have an alt, every alt ≤125 chars, no stuffing, city name appears on location pages only.

---

## 7. Schema Markup Requirements for Kimmy

All schemas emitted as JSON-LD via `<script type="application/ld+json">` inside `components/seo/StructuredData.tsx`.

### 7.1 Schema per page type

| Page | Schema types (required) | Notes |
|------|-------------------------|-------|
| **Homepage** | `Organization`, `WebSite` (+ `potentialAction` SearchAction), `Service` (national), `AggregateRating` (4.9/5, 200 reviews) attached to Organization | One of each, combined into a `@graph` array |
| **Location page** | `LocalBusiness` (subtype `HomeAndConstructionBusiness` → `HousePainter`), `Service` (painting, `areaServed` = city), `FAQPage` (6 Q&A from Nana), `BreadcrumbList`, `AggregateRating` (4.9/5) | `LocalBusiness.address.addressLocality = {city}`, `addressRegion = {state}`, `addressCountry = MY` |
| **All pages** | `BreadcrumbList` (Home → Location for location pages; just Home for homepage) | Shared component |
| **WhatsApp redirect** | None (noindex) | — |

### 7.2 Required fields

**Organization / LocalBusiness common fields:**
- `name`: "Cat Rumah Malaysia"
- `url`: full page URL
- `logo`: `https://cat-rumah-malaysia.vercel.app/icon.svg`
- `image`: hero image URL
- `telephone`: `+60174287801` (from `site.phone`)
- `priceRange`: `"RM$"` / from `RM3.50/sqft`
- `address.addressCountry`: `MY`
- `sameAs`: `[]` for now — extensible when social profiles are added
- `aggregateRating`: `{ ratingValue: 4.9, reviewCount: 200 }` (from `site.rating`)
- `brand`: `["Nippon Paint","Jotun","Dulux"]`

**Service schema:**
- `serviceType`: "House Painting"
- `provider`: `@id` reference to the Organization/LocalBusiness
- `areaServed`: `"Malaysia"` on homepage; `"{City}, {State}, MY"` on location pages
- `hasOfferCatalog`: `OfferCatalog` listing the 6 paint services with `itemOffered` + `priceSpecification` (RM3.50/sqft where applicable)

**FAQPage schema (location pages only):**
- Built from the 6 FAQs Nana writes per city, exactly matching the on-page Q&A text (Google requires parity).

**BreadcrumbList:**
- Homepage: 1 item — `Home`
- Location page: 2 items — `Home` → `Cat Rumah {City}`

### 7.3 Locale variants

- Emit one schema block per page in the page's current locale (name/description/FAQ localized).
- `inLanguage` field: `ms-MY` / `en-MY` / `zh-Hans-MY`.
- `@id` strings should include the locale prefix so Google can distinguish the three language variants of the same `LocalBusiness` entity: e.g. `https://cat-rumah-malaysia.vercel.app/ms/cat-rumah/kuala-lumpur#business`.

### 7.4 Schema validation gate

Before Layla deploys, Kimmy must validate at least:
- Homepage `ms`, `en`, `zh`
- Kuala Lumpur location page in all 3 locales
- Johor Bahru location page in all 3 locales

Via Google Rich Results Test + Schema.org validator. Zero errors is required. Warnings on optional fields are acceptable.

---

## Handoff

| Agent | What they now have |
|-------|--------------------|
| **Nana** | §3 formulas, §6 content brief + FAQ slots, location intro seeds, image alt patterns, service-row H3s |
| **Kimmy** | §3 meta formulas to wire into `generateMetadata`, §5 hreflang blocks, §7 schema spec, noindex directive for redirect page, sitemap inclusion list, robots.txt directive |
| **Kagura** | Keyword-placement constraints (H1/H2 must remain prominent; Google Reviews section must still show aggregate 4.9/5 visibly for `AggregateRating` content parity) |

**Source of truth for location slugs + nearby pairings:** this document (§2, §4.2) plus `config/locations.ts`. If any mismatch arises, Alpha's architecture wins for slugs; Sora's nearby pairings here must be copied into `config/locations.ts` verbatim.
