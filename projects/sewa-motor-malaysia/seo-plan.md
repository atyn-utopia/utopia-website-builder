# Sewa Motor Malaysia — SEO Plan

**Domain:** sewamotor.my
**Brand:** Sewa Motor Malaysia
**Country:** Malaysia
**Languages:** English (en), Mandarin Chinese (zh)
**Total pages:** 258 (2 homepage + 256 location pages)
**Product slug:** sewa-motor

---

## 1. Primary Keyword Strategy

### 1.1 English Keywords

| Tier | Keywords | Search Intent |
|---|---|---|
| **Primary** | sewa motor Malaysia, motor rental Malaysia, motorcycle rental Malaysia | Transactional — user wants to rent a motorcycle |
| **Secondary** | rent motorcycle Malaysia, motorbike hire Malaysia, scooter rental Malaysia, bike rental Malaysia, motor rent Malaysia | Transactional — variant phrasing |
| **Long-tail** | cheap motorcycle rental Kuala Lumpur, daily motor rental near me, weekly motorbike hire KL, monthly scooter rental Malaysia, budget motorcycle rental Selangor, affordable motor rental Johor Bahru | Transactional — price/location qualified |
| **Product** | Honda Vario 160 rental Malaysia, Yamaha NMax 155 rental, rent Honda PCX 160, Honda Wave 125 sewa, Yamaha Y15ZR rental, Modenas Kriss rental | Transactional — model-specific |
| **Intent** | how to rent a motorcycle in Malaysia, motorcycle rental price Malaysia, motor rental same day delivery, motor rental with delivery Malaysia | Informational/transactional hybrid |
| **Location modifier** | motor rental {city}, sewa motor {city}, motorcycle rental {city}, rent motorbike {city} | Transactional — geo-modified |

### 1.2 Mandarin Chinese Keywords

| Tier | Keywords | Notes |
|---|---|---|
| **Primary** | 马来西亚摩托车出租, 马来西亚租摩托, 马来西亚机车租赁 | Core money keywords |
| **Secondary** | 租摩托车, 摩托车租借, 电单车出租马来西亚, 租电单车 | Variant phrasing; 电单车 is common in Malaysian Chinese |
| **Long-tail** | 吉隆坡便宜摩托车出租, 马来西亚日租摩托, 马来西亚月租摩托车, 新山租摩托车 | Price/location qualified |
| **Product** | 租Honda Vario 160, Yamaha NMax出租, Honda PCX租借 | Model-specific |
| **Location modifier** | {city}摩托车出租, {city}租摩托, {city}电单车出租 | Geo-modified |

### 1.3 Keyword-to-Page Assignment (Anti-Cannibalization Rules)

| Page | Primary Keyword (EN) | Primary Keyword (ZH) | Rule |
|---|---|---|---|
| Homepage `/en` | sewa motor Malaysia, motor rental Malaysia, motorcycle rental Malaysia | 马来西亚摩托车出租, 马来西亚租摩托 | Country-level terms ONLY. Never use a city name in homepage H1/title. |
| Location page `/en/sewa-motor/kuala-lumpur` | sewa motor Kuala Lumpur, motor rental Kuala Lumpur | 吉隆坡摩托车出租, 吉隆坡租摩托 | City-level terms ONLY. Never use "Malaysia" as the geo-modifier on location pages. |

**Anti-cannibalization principle:** The homepage targets "Malaysia" as the geo-modifier. Location pages target the specific city/area name. This prevents Google from being confused about which page should rank for which query.

---

## 2. Page Hierarchy & URL Structure

### 2.1 URL Map

```
/                                          → 301 redirect to /en
/en                                        → Homepage (EN) — "motor rental Malaysia"
/zh                                        → Homepage (ZH) — "马来西亚摩托车出租"
/en/sewa-motor/kuala-lumpur                → Location page (EN) — "sewa motor Kuala Lumpur"
/zh/sewa-motor/kuala-lumpur                → Location page (ZH) — "吉隆坡摩托车出租"
/en/sewa-motor/petaling-jaya               → Location page (EN) — "sewa motor Petaling Jaya"
/zh/sewa-motor/petaling-jaya               → Location page (ZH) — "八打灵再也摩托车出租"
... (128 locations x 2 languages = 256 location pages)
```

### 2.2 Hierarchy Model

```
Homepage (hub)
├── /en/sewa-motor/kuala-lumpur (spoke)
├── /en/sewa-motor/petaling-jaya (spoke)
├── /en/sewa-motor/shah-alam (spoke)
├── /en/sewa-motor/johor-bahru (spoke)
├── /en/sewa-motor/george-town (spoke)
├── /en/sewa-motor/ipoh (spoke)
├── ... (122 more location pages)
└── (each location page links to 3-5 nearby locations)
```

**SEO reason:** Flat hub-and-spoke architecture concentrates link equity on the homepage while passing authority to location pages through the location grid. No intermediate hub page is needed because 128 locations can be displayed directly on the homepage.

### 2.3 Top 20 Priority Locations (by search volume potential)

These locations should receive the most polished copy and be featured prominently:

1. kuala-lumpur
2. petaling-jaya
3. shah-alam
4. johor-bahru
5. george-town
6. ipoh
7. subang-jaya
8. klang
9. kajang
10. cheras
11. ampang
12. puchong
13. seremban
14. kota-kinabalu
15. kuching
16. melaka
17. cyberjaya
18. putrajaya
19. bangsar
20. bukit-bintang

---

## 3. H1 / Title Tag / Meta Description Formulas

### 3.1 Homepage (EN)

```
Title:    Sewa Motor Malaysia | #1 Motorcycle Rental from RM30/day | sewamotor.my
H1:       Motor Rental Malaysia — Sewa Motor from RM30/day
Meta:     Rent motorcycles across Malaysia from RM30/day. Honda Vario, Yamaha NMax, PCX & more. Same-day delivery. WhatsApp to book now. Sewa motor murah seluruh Malaysia.
```

**SEO reasons:**
- Title includes primary keyword "Sewa Motor Malaysia" at the front (highest click-through weight position)
- Price point "RM30/day" adds specificity and attracts price-conscious searchers
- H1 uses both "Motor Rental Malaysia" and "Sewa Motor" to capture English and Malay search intent
- Meta description includes product names (Honda, Yamaha) for long-tail matching and "same-day delivery" as a differentiator

### 3.2 Homepage (ZH)

```
Title:    马来西亚摩托车出租 | 每日RM30起 | 全马送货 | sewamotor.my
H1:       马来西亚摩托车出租 — 每日RM30起，当天送达
Meta:     马来西亚全国摩托车出租服务。Honda Vario、Yamaha NMax、PCX等车型可选。日租RM30起，提供当天送货服务。WhatsApp即时预订。
```

### 3.3 Location Page (EN) — Formula

```
Title:    Sewa Motor {City} | Motorcycle Rental from RM30/day | sewamotor.my
H1:       Sewa Motor {City} — Rent Motorcycles from RM30/day
Meta:     Looking for motorcycle rental in {City}? Rent Honda Vario, Yamaha NMax, PCX & more from RM30/day. Same-day delivery in {City}. WhatsApp to book now.
```

**Example — Kuala Lumpur (EN):**
```
Title:    Sewa Motor Kuala Lumpur | Motorcycle Rental from RM30/day | sewamotor.my
H1:       Sewa Motor Kuala Lumpur — Rent Motorcycles from RM30/day
Meta:     Looking for motorcycle rental in Kuala Lumpur? Rent Honda Vario, Yamaha NMax, PCX & more from RM30/day. Same-day delivery in KL. WhatsApp to book now.
```

### 3.4 Location Page (ZH) — Formula

```
Title:    {City_ZH}摩托车出租 | 每日RM30起 | sewamotor.my
H1:       {City_ZH}摩托车出租 — 每日RM30起，当天送达
Meta:     在{City_ZH}寻找摩托车出租？Honda Vario、Yamaha NMax、PCX等车型可选。日租RM30起，{City_ZH}当天送货。WhatsApp即时预订。
```

**Example — Kuala Lumpur (ZH):**
```
Title:    吉隆坡摩托车出租 | 每日RM30起 | sewamotor.my
H1:       吉隆坡摩托车出租 — 每日RM30起，当天送达
Meta:     在吉隆坡寻找摩托车出租？Honda Vario、Yamaha NMax、PCX等车型可选。日租RM30起，吉隆坡当天送货。WhatsApp即时预订。
```

### 3.5 Title/Meta Rules

| Rule | Reason |
|---|---|
| Title must be under 60 characters | Google truncates longer titles |
| Meta description must be 120-155 characters | Optimal display length in SERPs |
| Primary keyword appears in first 30 characters of title | Early-position keywords have higher CTR weight |
| Every title ends with `sewamotor.my` | Brand recognition and trust signal |
| Every meta includes a price point | Attracts price-sensitive clicks, improves CTR |
| Every meta includes a CTA ("WhatsApp to book now") | Signals clear transactional intent to Google |

---

## 4. Internal Linking Plan

### 4.1 Homepage → Location Pages

The homepage contains a **Location Grid** section displaying all 128 locations as clickable cards/links.

```
<section id="locations">
  <h2>Sewa Motor Across Malaysia</h2>
  <!-- Grouped by state -->
  <h3>Selangor</h3>
  <a href="/en/sewa-motor/petaling-jaya">Sewa Motor Petaling Jaya</a>
  <a href="/en/sewa-motor/shah-alam">Sewa Motor Shah Alam</a>
  <a href="/en/sewa-motor/subang-jaya">Sewa Motor Subang Jaya</a>
  ...
</section>
```

**SEO reason:** Every location page receives a direct link from the homepage (highest authority page). Grouping by state adds topical relevance signals and helps Google understand the geographic hierarchy.

**Anchor text rule:** Every link to a location page must use the format "Sewa Motor {City}" (EN) or "{City_ZH}摩托车出租" (ZH). Never use generic anchors like "Click here" or "Learn more".

### 4.2 Location Page → Nearby Locations

Each location page includes a "Nearby Areas" section linking to 3-5 geographically adjacent locations.

**Nearby location mappings (examples):**

| Location | Links to |
|---|---|
| kuala-lumpur | petaling-jaya, cheras, ampang, bangsar, bukit-bintang |
| petaling-jaya | kuala-lumpur, shah-alam, subang-jaya, damansara, seksyen-7 |
| shah-alam | petaling-jaya, klang, subang-jaya, seksyen-7 |
| johor-bahru | skudai, kulai, muar, batu-pahat |
| george-town | butterworth, bukit-mertajam, balik-pulau, nibong-tebal, sungai-dua |
| ipoh | kampar, taiping, seri-manjung, kinta |
| kuching | sibu, miri, sarawak |
| kota-kinabalu | sandakan, tawau, sabah |
| melaka | ayer-keroh, alor-gajah, jasin, kota-laksamana, bukit-cina |
| seremban | port-dickson, kuala-pilah, rembau, bahau, jempol |
| kuantan | temerloh, pekan, jerantut, raub |
| kota-bharu | machang, tanah-merah, kuala-krai, gua-musang |
| kuala-terengganu | marang, dungun, kemaman, besut |
| alor-setar | jitra, sungai-petani, kulim, kota-setar |
| kangar | arau, padang-besar, kuala-perlis |
| bangsar | mid-valley, bangsar-south, pantai-dalam, sri-petaling |
| bukit-bintang | kuala-lumpur, setapak, sentul, setiawangsa |
| subang-jaya | petaling-jaya, shah-alam, puchong, bandar-utama |
| cheras | kuala-lumpur, ampang, kajang, hulu-langat, serdang |
| cyberjaya | putrajaya, serdang, bandar-baru-bangi, sepang |

**SEO reason:** Internal links between related location pages create topical clusters. Google interprets these links as signals that the pages are contextually related, boosting the entire cluster's authority for location-based queries.

### 4.3 Footer Links

The footer on every page includes links to the **top 6 locations**:

1. Kuala Lumpur → `/[locale]/sewa-motor/kuala-lumpur`
2. Petaling Jaya → `/[locale]/sewa-motor/petaling-jaya`
3. Shah Alam → `/[locale]/sewa-motor/shah-alam`
4. Johor Bahru → `/[locale]/sewa-motor/johor-bahru`
5. George Town → `/[locale]/sewa-motor/george-town`
6. Ipoh → `/[locale]/sewa-motor/ipoh`

**SEO reason:** Footer links appear on every page (258 pages), giving these 6 priority locations the highest internal link count. This signals to Google that they are the most important location pages.

### 4.4 Breadcrumbs

Location pages use a 2-level breadcrumb:

```
Home → Sewa Motor {City}
```

- "Home" links to `/[locale]`
- "Sewa Motor {City}" is the current page (no link)

**SEO reason:** Breadcrumbs provide structured navigation context to Google. The BreadcrumbList schema (see Section 7) ensures these appear as rich results in SERPs.

### 4.5 Product Section Internal Links

On each location page, every product card should link back to the homepage with an anchor like "View all motorcycles" or "See full fleet". This creates a reverse link from spokes back to the hub.

**SEO reason:** Bidirectional linking between hub and spokes strengthens the topical authority of the entire site for motorcycle rental queries.

---

## 5. Multilingual SEO Requirements

### 5.1 hreflang Implementation

Every page must include hreflang tags in the `<head>` for all language variants plus x-default.

**Homepage:**
```html
<link rel="alternate" hreflang="en" href="https://sewamotor.my/en" />
<link rel="alternate" hreflang="zh" href="https://sewamotor.my/zh" />
<link rel="alternate" hreflang="x-default" href="https://sewamotor.my/en" />
```

**Location page (example: Kuala Lumpur):**
```html
<link rel="alternate" hreflang="en" href="https://sewamotor.my/en/sewa-motor/kuala-lumpur" />
<link rel="alternate" hreflang="zh" href="https://sewamotor.my/zh/sewa-motor/kuala-lumpur" />
<link rel="alternate" hreflang="x-default" href="https://sewamotor.my/en/sewa-motor/kuala-lumpur" />
```

**Rules:**
- `x-default` always points to the English (`/en/`) version
- hreflang must be reciprocal: if `/en/` declares `/zh/` as alternate, then `/zh/` must declare `/en/` as alternate
- hreflang uses language codes only (`en`, `zh`), not locale-region codes
- Every page must declare itself in the hreflang set

**SEO reason:** hreflang prevents Google from treating EN and ZH versions as duplicate content. It ensures Chinese-language searchers see the ZH version in results and English-language searchers see the EN version.

### 5.2 URL Structure

| Language | URL Prefix | Example |
|---|---|---|
| English | `/en/` | `https://sewamotor.my/en/sewa-motor/kuala-lumpur` |
| Mandarin Chinese | `/zh/` | `https://sewamotor.my/zh/sewa-motor/kuala-lumpur` |

**Note:** The slug `sewa-motor` remains the same across both languages. It is NOT translated to Chinese in the URL. The slug is a product identifier, not translatable content.

**SEO reason:** Keeping the same slug structure across languages simplifies crawling, avoids redirect chains, and makes hreflang implementation cleaner.

### 5.3 Language-Specific Keyword Differences

| Concept | English | Chinese | Notes |
|---|---|---|---|
| motorcycle | motorcycle, motorbike, motor | 摩托车, 电单车, 机车 | 电单车 is Malaysian Chinese slang, very commonly searched |
| rental | rental, hire, rent, sewa | 出租, 租, 租赁, 租借 | "sewa" is Malay but commonly used by English speakers in Malaysia |
| same-day delivery | same-day delivery | 当天送达, 即日送货 | |
| cheap/budget | cheap, budget, affordable | 便宜, 经济, 实惠 | |
| daily/weekly/monthly | daily, weekly, monthly | 日租, 周租, 月租 | |

**Important:** The ZH copy should use 电单车 alongside 摩托车 because Malaysian Chinese speakers commonly search for 电单车 (the local term) rather than the mainland Chinese term 摩托车.

### 5.4 Canonical Tags

Each page's canonical tag must point to itself (the current language version), NOT to the English version.

```html
<!-- On /zh/sewa-motor/kuala-lumpur -->
<link rel="canonical" href="https://sewamotor.my/zh/sewa-motor/kuala-lumpur" />
```

**SEO reason:** Setting canonical to the English version would de-index the Chinese version. Each language version is a distinct page targeting different searchers.

---

## 6. Content Requirements for Nana

### 6.1 Homepage Content

| Content Element | Word Count (EN) | SEO Purpose |
|---|---|---|
| **Hero headline** | H1 as specified in Section 3 | Primary keyword placement |
| **Hero subheadline** | 15-25 words | Secondary keywords + value proposition |
| **Hero CTA text** | 3-5 words ("WhatsApp Us Now") | Clear transactional intent |
| **Introduction paragraph** | 80-120 words | Establishes topical authority for "motor rental Malaysia"; must mention: brand name, product types, price range, delivery, coverage area |
| **Product section heading** | H2: "Our Motorcycle Fleet" / "我们的摩托车车队" | Targets "motorcycle fleet rental" queries |
| **Product descriptions** | 30-50 words per motorcycle (x6) | Must include: model name, engine size, rental price, best-use scenario. Targets product-specific queries like "Honda Vario 160 rental" |
| **Location section heading** | H2: "Rent a Motorcycle Anywhere in Malaysia" / "全马各地摩托车出租" | Supports topical authority for country-wide coverage |
| **Location section intro** | 40-60 words | Must mention number of locations (128+), delivery coverage, ease of booking |
| **FAQ section** | 5-7 Q&A pairs, 40-80 words each | Targets informational queries; feeds FAQPage schema |
| **Footer tagline** | 10-15 words | Brand reinforcement |

**Homepage FAQ topics (must cover):**

1. How do I rent a motorcycle from Sewa Motor Malaysia?
2. What documents do I need to rent a motorcycle?
3. Do you deliver the motorcycle to my location?
4. What is the minimum rental period?
5. Can I rent a motorcycle without a Malaysian license?
6. What happens if the motorcycle breaks down?
7. How do I return the motorcycle?

**SEO reason for each element:**
- Introduction paragraph provides Google with enough context to understand the page topic
- Product descriptions target model-specific search queries that have lower competition
- FAQ section directly targets question-based queries and enables FAQ rich results in SERPs
- Sufficient word count (600-900 words total on homepage) prevents thin-content penalties

### 6.2 Location Page Content

| Content Element | Word Count (EN) | SEO Purpose |
|---|---|---|
| **H1** | As specified in Section 3 | City-specific primary keyword |
| **Unique introduction** | 100-150 words | MUST be unique per location. Mentions city name 2-3 times naturally. References local landmarks, neighborhoods, or use cases specific to that city. |
| **Why rent in {City}** | H2 section, 80-120 words | Targets "why rent motorcycle {city}" queries. Mentions local transport challenges, tourist attractions, or commuting needs. |
| **Product section** | Same 6 products as homepage, but intro line references city | "Rent a Honda Vario 160 in {City}" — location-keyword enrichment |
| **Delivery info** | 40-60 words | Mentions same-day delivery in {city}, coverage area, estimated delivery time |
| **FAQ section** | 4-6 Q&A pairs, 40-80 words each | Location-specific FAQs. At least 2 must be unique to the city. |
| **Nearby locations section** | Linked list with brief intro | Internal linking (see Section 4.2) |

**Location page FAQ topics (must include at least):**

1. How much does it cost to rent a motorcycle in {City}?
2. Do you deliver motorcycles in {City}?
3. What motorcycles are available for rent in {City}?
4. Can I rent a motorcycle for one day in {City}?

**Critical rule — unique content per location:**
Every location page MUST have a unique introduction paragraph. Google will penalize pages that repeat the same text with only the city name swapped. Nana must write genuinely distinct copy referencing:
- Local landmarks or areas (e.g., "Navigate KLCC and Bukit Bintang traffic easily")
- Local transport context (e.g., "Avoid the Petaling Jaya LRT crowds")
- Typical renters (e.g., "Popular with Langkawi tourists exploring the island")

### 6.3 Content for Both Languages

All content listed above must be written in both English and Mandarin Chinese. The Chinese version is NOT a direct translation — it should be a localized rewrite that sounds natural to Malaysian Chinese speakers.

**Chinese copy rules:**
- Use 电单车 alongside 摩托车 (Malaysian Chinese term for motorcycle)
- Use RM for pricing (not CNY or other currencies)
- Reference local areas using Chinese names where they exist (e.g., 吉隆坡 for Kuala Lumpur, 新山 for Johor Bahru, 槟城 for Penang/George Town)
- Keep a conversational Malaysian Chinese tone, not formal mainland Chinese

### 6.4 Content Nana Must NOT Write

- Do not write "Welcome to our website" or any generic filler
- Do not use "best" or "top" or "#1" in body copy (save superlatives for titles only)
- Do not stuff keywords unnaturally — aim for 1-2% keyword density
- Do not repeat the same FAQ answer across multiple location pages
- Do not reference competitors by name

---

## 7. Schema Markup Requirements for Kimmy

### 7.1 Organization Schema (Global — all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sewa Motor Malaysia",
  "url": "https://sewamotor.my",
  "logo": "https://sewamotor.my/logo.svg",
  "description": "Motorcycle rental service across Malaysia. Daily, weekly, and monthly rentals with same-day delivery.",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "Chinese"]
  },
  "areaServed": {
    "@type": "Country",
    "name": "Malaysia"
  }
}
```

**SEO reason:** Establishes the brand entity in Google's Knowledge Graph. The Organization schema is the foundation for all other structured data.

### 7.2 LocalBusiness Schema (Location pages only)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Sewa Motor {City}",
  "description": "Motorcycle rental in {City}. Rent Honda Vario, Yamaha NMax, Honda PCX & more from RM30/day with same-day delivery.",
  "url": "https://sewamotor.my/en/sewa-motor/{location-slug}",
  "telephone": "+60XXXXXXXXX",
  "areaServed": {
    "@type": "City",
    "name": "{City}"
  },
  "priceRange": "RM30 - RM60/day",
  "openingHours": "Mo-Su 08:00-22:00",
  "paymentAccepted": "Cash, Bank Transfer",
  "currenciesAccepted": "MYR"
}
```

**SEO reason:** LocalBusiness schema is critical for appearing in Google's local pack and Google Maps results. Each location page gets its own LocalBusiness entity to maximize local search visibility.

**Note:** The `telephone` field should use the dynamic phone number from Supabase. If multiple numbers exist, use the first active one for schema purposes.

### 7.3 FAQPage Schema (Homepage + all location pages)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does it cost to rent a motorcycle in {City}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Motorcycle rental in {City} starts from RM30/day for a Modenas Kriss MR3. Weekly rates start at RM170 and monthly rates from RM550."
      }
    }
  ]
}
```

**SEO reason:** FAQPage schema enables FAQ rich results in Google SERPs — expandable Q&A dropdowns that take up more SERP real estate and dramatically increase click-through rate.

### 7.4 BreadcrumbList Schema (Location pages only)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://sewamotor.my/en"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Sewa Motor {City}",
      "item": "https://sewamotor.my/en/sewa-motor/{location-slug}"
    }
  ]
}
```

**SEO reason:** BreadcrumbList schema shows breadcrumb trails in Google search results instead of the raw URL, improving visual appearance and click-through rate.

### 7.5 Product Schema (Homepage + all location pages — for each motorcycle)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Honda Vario 160 Rental",
  "description": "Rent a Honda Vario 160 scooter. 160cc engine, automatic transmission. Most popular choice for city commuting.",
  "brand": {
    "@type": "Brand",
    "name": "Honda"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "MYR",
    "lowPrice": "50",
    "highPrice": "900",
    "offerCount": "3",
    "offers": [
      {
        "@type": "Offer",
        "name": "Daily Rental",
        "price": "50",
        "priceCurrency": "MYR",
        "unitCode": "DAY",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Weekly Rental",
        "price": "280",
        "priceCurrency": "MYR",
        "unitCode": "WEE",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Monthly Rental",
        "price": "900",
        "priceCurrency": "MYR",
        "unitCode": "MON",
        "availability": "https://schema.org/InStock"
      }
    ]
  }
}
```

Repeat for all 6 motorcycles:

| Product | Daily | Weekly | Monthly |
|---|---|---|---|
| Honda Vario 160 | RM50 | RM280 | RM900 |
| Yamaha NMax 155 | RM55 | RM310 | RM1,000 |
| Honda PCX 160 | RM60 | RM340 | RM1,100 |
| Honda Wave 125 | RM35 | RM200 | RM650 |
| Yamaha Y15ZR | RM40 | RM230 | RM750 |
| Modenas Kriss MR3 | RM30 | RM170 | RM550 |

**SEO reason:** Product schema enables rich results with pricing in Google search, making listings more prominent and increasing CTR. The AggregateOffer structure shows a price range which is especially effective for rental businesses.

### 7.6 Schema Implementation Notes for Kimmy

1. All schema must be rendered as `<script type="application/ld+json">` in the `<head>` of each page
2. Location pages include: Organization + LocalBusiness + FAQPage + BreadcrumbList + Product (x6)
3. Homepage includes: Organization + FAQPage + Product (x6)
4. Schema must be language-aware — ZH pages should have Chinese text in `name` and `description` fields
5. Validate all schema using Google's Rich Results Test before deployment
6. Do NOT use microdata or RDFa — JSON-LD only

---

## 8. Technical SEO Checklist

### 8.1 Robots & Crawling

**robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://sewamotor.my/sitemap.xml
```

**SEO reason:** Explicit allow + sitemap declaration ensures all pages are discoverable. No pages need to be blocked.

### 8.2 Sitemap

The sitemap must include all 258 pages with:
- `<loc>` — full URL
- `<lastmod>` — last content update date
- `<changefreq>` — `weekly` for location pages, `daily` for homepage
- `<priority>` — `1.0` for homepage, `0.8` for location pages
- hreflang entries within the sitemap (recommended in addition to HTML hreflang)

### 8.3 Page Speed Requirements

| Metric | Target | Reason |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s | Core Web Vital — Google ranking factor |
| First Input Delay (FID) | < 100ms | Core Web Vital — Google ranking factor |
| Cumulative Layout Shift (CLS) | < 0.1 | Core Web Vital — Google ranking factor |

**Actionable requirements:**
- All images must use next/image with proper width/height to prevent CLS
- Hero images must be priority-loaded (`priority` prop in next/image)
- No render-blocking JavaScript
- Font loading must use `display: swap`

### 8.4 Image Alt Text Rules

| Image | Alt Text Formula |
|---|---|
| Motorcycle product image | "{Model Name} motorcycle available for rent in {City}" |
| Hero image | "Motorcycle rental service in Malaysia — Sewa Motor" |
| Location-specific imagery | "Motorcycle rental delivery in {City}, Malaysia" |

**SEO reason:** Alt text helps Google understand image content and enables image search traffic. Location-enriched alt text targets image searches for motorcycle rental in specific cities.

### 8.5 Open Graph & Social Meta

Every page must include:
```html
<meta property="og:title" content="{same as title tag}" />
<meta property="og:description" content="{same as meta description}" />
<meta property="og:url" content="{canonical URL}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://sewamotor.my/og-image.jpg" />
<meta property="og:locale" content="en_MY" />  <!-- or zh_MY -->
<meta property="og:site_name" content="Sewa Motor Malaysia" />
```

---

## 9. Complete Location Slug Reference

All 128 locations with their display names for title/H1 generation:

| Slug | Display Name (EN) | Display Name (ZH) | State |
|---|---|---|---|
| kuala-lumpur | Kuala Lumpur | 吉隆坡 | Kuala Lumpur |
| petaling-jaya | Petaling Jaya | 八打灵再也 | Selangor |
| shah-alam | Shah Alam | 莎阿南 | Selangor |
| subang-jaya | Subang Jaya | 梳邦再也 | Selangor |
| johor-bahru | Johor Bahru | 新山 | Johor |
| george-town | George Town | 乔治市 | Penang |
| ipoh | Ipoh | 怡保 | Perak |
| melaka | Melaka | 马六甲 | Melaka |
| kuching | Kuching | 古晋 | Sarawak |
| kota-kinabalu | Kota Kinabalu | 亚庇 | Sabah |
| seremban | Seremban | 芙蓉 | Negeri Sembilan |
| kuantan | Kuantan | 关丹 | Pahang |
| kota-bharu | Kota Bharu | 哥打巴鲁 | Kelantan |
| kuala-terengganu | Kuala Terengganu | 瓜拉登嘉楼 | Terengganu |
| alor-setar | Alor Setar | 亚罗士打 | Kedah |
| kangar | Kangar | 加央 | Perlis |
| putrajaya | Putrajaya | 布城 | Putrajaya |
| cyberjaya | Cyberjaya | 赛城 | Selangor |
| bangsar | Bangsar | 孟沙 | Kuala Lumpur |
| bukit-bintang | Bukit Bintang | 武吉免登 | Kuala Lumpur |
| cheras | Cheras | 蕉赖 | Kuala Lumpur |
| ampang | Ampang | 安邦 | Selangor |
| puchong | Puchong | 蒲种 | Selangor |
| kajang | Kajang | 加影 | Selangor |
| klang | Klang | 巴生 | Selangor |
| rawang | Rawang | 万挠 | Selangor |
| serdang | Serdang | 沙登 | Selangor |
| sepang | Sepang | 雪邦 | Selangor |
| gombak | Gombak | 鹅唛 | Selangor |
| hulu-langat | Hulu Langat | 乌鲁冷岳 | Selangor |
| klang-valley | Klang Valley | 巴生谷 | Selangor |
| damansara | Damansara | 白沙罗 | Selangor |
| damansara-heights | Damansara Heights | 白沙罗高原 | Kuala Lumpur |
| mont-kiara | Mont Kiara | 满家乐 | Kuala Lumpur |
| sri-petaling | Sri Petaling | 大城堡 | Kuala Lumpur |
| setapak | Setapak | 士拉巴 | Kuala Lumpur |
| sentul | Sentul | 冼都 | Kuala Lumpur |
| segambut | Segambut | 泗岩沫 | Kuala Lumpur |
| kepong | Kepong | 甲洞 | Kuala Lumpur |
| setiawangsa | Setiawangsa | 旺沙玛珠 | Kuala Lumpur |
| pantai-dalam | Pantai Dalam | 班底谷 | Kuala Lumpur |
| taman-desa | Taman Desa | 帝沙花园 | Kuala Lumpur |
| sri-hartamas | Sri Hartamas | 斯里哈达玛斯 | Kuala Lumpur |
| desa-parkcity | Desa ParkCity | 满家乐花园城 | Kuala Lumpur |
| taman-tun-dr.-ismail-(ttdi) | Taman Tun Dr. Ismail (TTDI) | TTDI | Kuala Lumpur |
| taman-melawati | Taman Melawati | 万达镇 | Selangor |
| kuchai-lama | Kuchai Lama | 旧古仔 | Kuala Lumpur |
| old-klang-road | Old Klang Road | 旧巴生路 | Kuala Lumpur |
| mid-valley | Mid Valley | 谷中城 | Kuala Lumpur |
| bangsar-south | Bangsar South | 孟沙南城 | Kuala Lumpur |
| sunway-velocity | Sunway Velocity | 双威伟乐城 | Kuala Lumpur |
| bandar-utama | Bandar Utama | 万达镇 | Selangor |
| seksyen-7 | Seksyen 7 | 第7区 | Selangor |
| bandar-puchong | Bandar Puchong | 蒲种市镇 | Selangor |
| bandar-baru-bangi | Bandar Baru Bangi | 万宜新镇 | Selangor |
| bangi | Bangi | 万宜 | Selangor |
| sungai-buloh | Sungai Buloh | 双溪毛糯 | Selangor |
| butterworth | Butterworth | 北海 | Penang |
| bukit-mertajam | Bukit Mertajam | 大山脚 | Penang |
| balik-pulau | Balik Pulau | 浮罗山背 | Penang |
| nibong-tebal | Nibong Tebal | 高渊 | Penang |
| sungai-dua | Sungai Dua | 双溪赖 | Penang |
| seberang-jaya | Seberang Jaya | 赛伯朗再也 | Penang |
| taiping | Taiping | 太平 | Perak |
| kampar | Kampar | 金宝 | Perak |
| seri-manjung | Seri Manjung | 实兆远 | Perak |
| manjung | Manjung | 曼绒 | Perak |
| kinta | Kinta | 近打 | Perak |
| cameron-highlands | Cameron Highlands | 金马仑高原 | Pahang |
| skudai | Skudai | 士古来 | Johor |
| kulai | Kulai | 古来 | Johor |
| muar | Muar | 麻坡 | Johor |
| batu-pahat | Batu Pahat | 峇株巴辖 | Johor |
| segamat | Segamat | 昔加末 | Johor |
| ayer-keroh | Ayer Keroh | 亚依淡 | Melaka |
| alor-gajah | Alor Gajah | 野新 | Melaka |
| jasin | Jasin | 淡边 | Melaka |
| kota-laksamana | Kota Laksamana | 古城区 | Melaka |
| bukit-cina | Bukit Cina | 三宝山 | Melaka |
| port-dickson | Port Dickson | 波德申 | Negeri Sembilan |
| kuala-pilah | Kuala Pilah | 瓜拉庇劳 | Negeri Sembilan |
| rembau | Rembau | 林茂 | Negeri Sembilan |
| bahau | Bahau | 马口 | Negeri Sembilan |
| jempol | Jempol | 淡边 | Negeri Sembilan |
| temerloh | Temerloh | 淡马鲁 | Pahang |
| pekan | Pekan | 北根 | Pahang |
| jerantut | Jerantut | 而连突 | Pahang |
| raub | Raub | 劳勿 | Pahang |
| machang | Machang | 马樟 | Kelantan |
| tanah-merah | Tanah Merah | 丹那美拉 | Kelantan |
| kuala-krai | Kuala Krai | 瓜拉吉赖 | Kelantan |
| gua-musang | Gua Musang | 话望生 | Kelantan |
| marang | Marang | 马江 | Terengganu |
| dungun | Dungun | 龙运 | Terengganu |
| kemaman | Kemaman | 甘马挽 | Terengganu |
| besut | Besut | 勿述 | Terengganu |
| sungai-petani | Sungai Petani | 双溪大年 | Kedah |
| kulim | Kulim | 居林 | Kedah |
| jitra | Jitra | 日得拉 | Kedah |
| langkawi | Langkawi | 浮罗交怡 | Kedah |
| kota-setar | Kota Setar | 哥打士打 | Kedah |
| arau | Arau | 亚娄 | Perlis |
| padang-besar | Padang Besar | 巴东勿刹 | Perlis |
| kuala-perlis | Kuala Perlis | 玻璃市港口 | Perlis |
| sandakan | Sandakan | 山打根 | Sabah |
| tawau | Tawau | 斗湖 | Sabah |
| miri | Miri | 美里 | Sarawak |
| sibu | Sibu | 诗巫 | Sarawak |
| bintulu | Bintulu | 民都鲁 | Sarawak |
| penang | Penang | 槟城 | Penang |
| selangor | Selangor | 雪兰莪 | Selangor |
| perak | Perak | 霹雳 | Perak |
| johor | Johor | 柔佛 | Johor |
| kedah | Kedah | 吉打 | Kedah |
| kelantan | Kelantan | 吉兰丹 | Kelantan |
| terengganu | Terengganu | 登嘉楼 | Terengganu |
| pahang | Pahang | 彭亨 | Pahang |
| negeri-sembilan | Negeri Sembilan | 森美兰 | Negeri Sembilan |
| perlis | Perlis | 玻璃市 | Perlis |
| sabah | Sabah | 沙巴 | Sabah |
| sarawak | Sarawak | 砂拉越 | Sarawak |
| pulau-pinang | Pulau Pinang | 槟城 | Penang |

---

## 10. Summary of Deliverables by Agent

| Agent | Deliverable | Input Needed |
|---|---|---|
| **Nana** | Homepage copy (EN + ZH), all location page copies (EN + ZH), FAQ content | This SEO plan (Sections 3, 6) + location list (Section 9) |
| **Kimmy** | Schema markup (5 types), meta tags, alt text, hreflang, OG tags, robots.txt, sitemap | This SEO plan (Sections 3, 5, 7, 8) |

---

## 11. Post-Launch SEO Actions

1. **Submit sitemap** to Google Search Console within 24 hours of launch
2. **Request indexing** for homepage and top 20 location pages manually
3. **Monitor** Search Console for crawl errors, especially hreflang issues
4. **Track rankings** for primary keywords within 2 weeks
5. **Build backlinks** from Malaysian business directories (e.g., Malaysia Yellow Pages, local tourism sites)
6. **Google Business Profile** — Create listings for top cities if applicable
7. **Monitor for cannibalization** — If a location page starts ranking for "motor rental Malaysia" (homepage keyword), add more internal links from that location page back to homepage
