# SEO Plan — Skylift Malaysia

> **SEO Strategist:** Sora
> **Project:** `skylift-malaysia`
> **Domain:** `skylift-malaysia.vercel.app`
> **Locales:** `en`, `ms`, `zh`
> **Product slug:** `skylift`
> **Location URL pattern:** `/[locale]/skylift/[location]`
> **Reference baseline:** `projects/electrician-24-hour/seo-plan.md`

This plan is the source of truth for keyword targeting, page hierarchy, internal linking, hreflang, content briefs (for Nana), and schema markup (for Kimmy). All location pages are produced from §8 — the locked location list.

---

## 1. Keyword Strategy

### 1.1 Primary money keyword
- **`skylift rental Malaysia`** (English)
- **`sewa skylift`** / **`sewa skylift murah`** (Bahasa Melayu)
- **`马来西亚高空作业车租赁`** / **`高空车出租`** (Mandarin)

### 1.2 Secondary keywords (commercial intent)
- skylift rental KL, skylift rental Selangor, skylift rental Klang Valley
- sewa skylift KL, sewa skylift Selangor, sewa skylift harian
- 9m skylift rental, 20m skylift rental, 24m skylift rental, 32m skylift rental
- spider skylift rental, indoor skylift rental
- skylift price Malaysia, skylift daily rate, skylift half day rental
- skylift with operator, certified skylift operator Malaysia

### 1.3 Long-tail / use-case keywords
- skylift for billboard installation Malaysia
- skylift for street light maintenance
- skylift for stadium lights / floodlight repair
- skylift for tree trimming / cutting Malaysia
- skylift for AC servicing high ceiling
- skylift for roof repair / atap installation
- skylift for warehouse maintenance
- skylift for shopping mall ceiling work
- spider skylift for indoor / glass atrium work
- same-day skylift rental KL Selangor
- skylift rental with operator near me

### 1.4 Location-modifier pattern
`{primary} {location_name}` — e.g. "skylift rental Petaling Jaya", "sewa skylift Johor Bahru", "20m skylift Shah Alam". Apply to every slug in §8.

### 1.5 Per-locale keyword notes
- **EN**: lead with "skylift rental", "rent a skylift", "skylift hire"
- **MS**: lead with "sewa skylift", "sewa skylift murah", "harga sewa skylift"
- **ZH**: lead with "高空车出租", "高空作业车租赁", "蜘蛛车出租" (spider lift)

---

## 2. Page Hierarchy

```
Tier 1  /                                   (homepage — broad "skylift Malaysia" intent)
Tier 2  /#products (5 unit anchors on home) (9m / 20m / 24m / 32m / Spider)
Tier 3  /skylift/[location]                 (~165 location pages × 3 locales)
Tier 4  /blog and /blog/[slug]              (informational, supports Tier 1–3)
```

### 2.1 Example URLs (locale-prefixed, EN shown)
```
/en
/en/skylift/kuala-lumpur
/en/skylift/petaling-jaya
/en/skylift/shah-alam
/en/skylift/johor-bahru
/en/skylift/george-town
/en/skylift/ipoh
/en/blog
/en/blog/{post-slug}
```

Mirror under `/ms/...` and `/zh/...`.

---

## 3. H1 / Title Tag / Meta Description Formulas

> Hard rule from CLAUDE.md: every page has **exactly one H1 and exactly one H2**, both inside the hero. All other section headings are H3–H6.

### 3.1 Homepage

**EN**
- H1: `Skylift Rental Malaysia`
- H2 (hero subtitle): `Daily-Rate Aerial Lifts with Certified Operators — Same-Day KL & Selangor`
- Title: `Skylift Rental Malaysia | Daily Rate from RM500 with Operator | Skylift Malaysia`
- Meta description: `Skylift rental across Malaysia from RM500/half-day. 9m, 20m, 24m, 32m boom + Spider lift with certified operator. Same-day delivery KL & Selangor. Chat on WhatsApp.`

**MS**
- H1: `Sewa Skylift Malaysia`
- H2: `Sewa Skylift Murah Bersama Operator Bertauliah — Hantar Hari Sama KL & Selangor`
- Title: `Sewa Skylift Malaysia | Harga Murah dari RM500 | Skylift Malaysia`
- Meta description: `Sewa skylift seluruh Malaysia dari RM500 separuh hari. Unit 9m, 20m, 24m, 32m & Spider Lift dengan operator bertauliah. Hantar hari sama KL & Selangor. Tempah WhatsApp 5 minit.`

**ZH**
- H1: `马来西亚高空车出租`
- H2: `配持证操作员，吉隆坡及雪兰莪当日送达`
- Title: `马来西亚高空车出租 | 半日RM500起，含操作员 | Skylift Malaysia`
- Meta description: `全马高空作业车租赁，半日RM500起。9米、20米、24米、32米伸缩臂 + 蜘蛛车，配持证操作员，吉隆坡雪兰莪当日送达。WhatsApp预订仅需5分钟。`

### 3.2 Location page (`/[locale]/skylift/{slug}`)

**EN**
- H1: `Skylift Rental in {City}`
- H2: `Same-Day Delivery and Certified Operator in {City}, {State}`
- Title: `Skylift Rental {City} | 9m / 20m / 24m / 32m / Spider Lift | Skylift Malaysia`
- Meta description: `Skylift rental in {City}, {State} — 9m to 32m boom lifts and Spider Lift with certified operator. Daily rate from RM500. Same-day delivery. Chat on WhatsApp now.`

**MS**
- H1: `Sewa Skylift di {City}`
- H2: `Hantar Hari Sama dengan Operator Bertauliah di {City}, {State}`
- Title: `Sewa Skylift {City} | 9m, 20m, 24m, 32m & Spider | Skylift Malaysia`
- Meta description: `Sewa skylift di {City}, {State} — unit 9m hingga 32m & Spider Lift dengan operator bertauliah. Harga dari RM500 separuh hari. Hantar hari sama. Tempah WhatsApp.`

**ZH**
- H1: `{City}高空车出租`
- H2: `{State}{City}当日送达，配持证操作员`
- Title: `{City}高空车出租 | 9米 / 20米 / 24米 / 32米 / 蜘蛛车 | Skylift Malaysia`
- Meta description: `{State}{City}高空作业车租赁 — 9米至32米伸缩臂及蜘蛛车，配持证操作员。半日RM500起，当日送达。WhatsApp立即预订。`

### 3.3 Blog list / blog post

- Blog list H1: `Skylift Rental Insights & Site Safety Guides`
- Blog post H1: matches article title (Hanabi assigns)

---

## 4. Internal Linking Plan

### 4.1 Homepage → outbound
- Locations Accordion → every sub-location in §8 (grouped by state, lazy-expand)
- Footer → top 6 locations: `kuala-lumpur`, `petaling-jaya`, `shah-alam`, `johor-bahru`, `george-town`, `ipoh`
- Recent posts module → 4 latest blog articles
- 5 product anchors (`#9m`, `#20m`, `#24m`, `#32m`, `#spider`) link from the Products section

### 4.2 Location page → outbound
- Breadcrumb: `Home › Skylift › {City}` (locale-prefixed)
- "Nearby Locations" module: 4 neighbouring sub-locations from `nearbyMap` (same state)
- Locations Accordion present (homepage parity) — full state list reachable
- 2 contextual links into blog posts (one general site-safety, one use-case)
- Back to homepage via logo + footer

### 4.3 Blog post → outbound
- 1 link to a relevant product anchor on the homepage
- 1 link to a relevant location page
- 2 links to related blog posts
- WhatsApp CTA banner at bottom (always green `#25D366`)

### 4.4 Footer (every page)
- Brand block (logo only — no phone, no domain text)
- Top 6 locations (above)
- Locale switcher (en / ms / zh) keeps the current path
- Blog link
- Legal: copyright line only

### 4.5 Breadcrumb pattern (BreadcrumbList schema + visible UI)
- Home → Skylift Rental → {City}  (location pages)
- Home → Blog → {Post title}      (blog posts)

---

## 5. Multilingual SEO Requirements

### 5.1 Locales + URL prefixes
- `en` → `/en/...` (default)
- `ms` → `/ms/...`
- `zh` → `/zh/...`
- `localePrefix: 'always'` (already locked in `i18n/routing.ts` per architecture)

### 5.2 hreflang values (emit on every page)
For every URL emit the following alternates in `<head>` and in `sitemap.ts`:

| Page | hreflang | href |
|------|----------|------|
| Homepage | `en-MY` | `https://skylift-malaysia.vercel.app/en` |
| Homepage | `ms-MY` | `https://skylift-malaysia.vercel.app/ms` |
| Homepage | `zh-MY` | `https://skylift-malaysia.vercel.app/zh` |
| Homepage | `x-default` | `https://skylift-malaysia.vercel.app/en` |
| Location | `en-MY` | `.../en/skylift/{slug}` |
| Location | `ms-MY` | `.../ms/skylift/{slug}` |
| Location | `zh-MY` | `.../zh/skylift/{slug}` |
| Location | `x-default` | `.../en/skylift/{slug}` |
| Blog post | same pattern with `/blog/{slug}` | |

### 5.3 Canonical
Self-canonical per locale (e.g. `<link rel="canonical" href="https://skylift-malaysia.vercel.app/ms/skylift/petaling-jaya" />`). Never canonicalise `ms` → `en`.

### 5.4 OG / Twitter
- `og:locale` reflects active locale (`en_MY` / `ms_MY` / `zh_MY`)
- `og:locale:alternate` lists the other two
- Localised `og:title`, `og:description`, `og:url`

### 5.5 Language-specific keyword notes
- **MS** copy must use natural Malaysian phrasing: "sewa", "tempah", "harga sewa", "hantar hari sama", "operator bertauliah". Avoid Indonesian-flavoured Malay.
- **ZH** copy targets Malaysian Chinese audience (Simplified). Use "高空车" for boom lift, "蜘蛛车" for spider lift, "操作员" for operator. Keep "Skylift Malaysia" as a brand token.

---

## 6. Content Requirements for Nana (per page type)

### 6.1 Homepage (3 locales)
For each section (order locked by Alpha — do not reorder):

1. **FOMO Banner** — 1 short urgency line + countdown label (e.g. "Today's promo ends in").
2. **Hero** — H1 (primary keyword), H2 (benefit subtitle), 1 supporting line, WhatsApp CTA label, secondary CTA label.
3. **USP Bar (3-point)** — short title + 1-line description for: Daily Rate from RM500 / Same-Day Delivery / Trained Operator Included.
4. **Products** — section H3, intro paragraph, and per-unit (5 units) name (H4) + 30–50 word blurb mentioning use-cases + price hint. Must mention the unit's height + best fit.
5. **How It Works** — H3 + 3–4 step labels (each step ≤ 12 words) ending in "WhatsApp tempahan".
6. **Risk / Problem** — H3 + 3 bullet pain points without certified operator / wrong lift height / DIY ladder use.
7. **Mid CTA** — H3 + 1 supporting line + WhatsApp CTA label.
8. **Google Reviews** — H3 + 6 testimonial quotes (mix EN/MS in EN locale; localise per locale) with reviewer first name + city.
9. **Why Choose** — H3 + 6 bullet differentiators (fleet size, MOSHA-compliance, insured operators, hourly + daily rates, multi-state coverage, English/Malay/Mandarin support).
10. **Gallery** — H3 + 16 image captions (≤ 8 words each) — billboard, AC servicing, street lighting, stadium lights, tree trimming, mall maintenance, warehouse, factory, etc.
11. **Locations Accordion** — H3 + 1-line state intros (13 states) + per-state sub-headings (use state names from §8).
12. **FAQ** — H3 + 8 Q&A pairs (pricing, delivery, operator, payment, areas covered, deposit, accident insurance, cancellation).
13. **Final CTA** — H3 + 1 supporting line + WhatsApp CTA label.
14. **Footer** — brand strapline ≤ 10 words, locale switcher labels.

Why each matters: H1/H2 carry the primary money keyword; USP bar earns featured-snippet eligibility; Products section feeds ProductSchema; FAQ feeds FAQPageSchema; Locations accordion is the internal-link spine.

### 6.2 Location pages (~165 pages × 3 locales)
Each location page must have **unique copy** (no template-fill duplicates across cities). Required elements:

- Breadcrumb labels: `Home / Skylift Rental / {City}`
- H1 + H2 (formulas in §3.2) — keyword + city
- 80–120 word **unique intro** referencing 1 real local landmark/area type (industrial estate, township, landmark) and which skylift heights are most-requested in that city
- USP Bar (same 3 points, but mention "in {City}" or "{State}")
- Products section (same 5 units, intro paragraph swapped to 1–2 sentences referencing typical {City} jobs)
- How It Works (parity with homepage, last step localised: "Skylift sampai di {City} pada hari yang sama")
- Risk / Problem (parity with homepage)
- Mid CTA (label includes `{City}`)
- Reviews (re-order existing testimonials so any from {State} float to top — same pool)
- Why Choose (parity with homepage)
- Gallery (parity)
- Locations Accordion (parity)
- **Nearby Locations** (3–4 neighbour cards from `nearbyMap`)
- FAQ — **3 of 8 questions must be city-specific** (e.g. "Berapa lama Skylift sampai di {City}?", "Adakah anda menyediakan skylift untuk kawasan {industrial estate}?", "Boleh hantar pada hari Ahad di {City}?")
- Final CTA (label includes `{City}`)
- Footer (parity)

Why each matters: unique 80–120 word intro avoids duplicate-content penalties; 3 city-specific FAQs fuel FAQSchema variation and long-tail capture; Nearby Locations module is the lateral internal-link spine.

### 6.3 Blog (Hanabi territory, but Nana's H3 conventions apply)
- Each post: H1 (= title), H2 inside the article body is NOT used (page-level H2 is the hero subtitle); article body uses H3 → H4 → p
- 800–1500 words, 1 hero image, 2–4 inline images, 1 internal link to a product anchor, 1 internal link to a location page, 1 WhatsApp CTA banner.

---

## 7. Schema Markup Requirements (for Kimmy)

All schema injected as JSON-LD in `<head>` via React components in `components/schema/`.

### 7.1 OrganizationSchema — site-wide
Mounted once in `app/[locale]/layout.tsx`.
- `@type`: `Organization`
- `name`: "Skylift Malaysia"
- `url`: `https://skylift-malaysia.vercel.app/{locale}`
- `logo`: full URL to logo
- `sameAs`: leave empty array for now (no social URLs confirmed)
- `contactPoint`: `@type: ContactPoint`, `contactType: "customer service"`, `availableLanguage: ["en","ms","zh"]`. **Do not embed phone number** — phone is dynamic from Supabase.

### 7.2 ProductSchema — homepage (5 instances)
One per skylift unit (9m, 20m, 24m, 32m, Spider). Pulled from Supabase `products` rows.
- `@type`: `Product`
- `name`: e.g. "20m Skylift Rental"
- `description`: from `products.description`
- `image`: from `product_photos.url`
- `brand`: `@type: Brand`, `name: "Skylift Malaysia"`
- `offers`: `@type: Offer`, `priceCurrency: "MYR"`, `price`: rental_price (full-day) where present, `availability: "https://schema.org/InStock"`, `priceValidUntil`: 1 year out, `url`: WhatsApp redirect URL

### 7.3 LocalBusinessSchema — every location page
- `@type`: `LocalBusiness`
- `name`: `Skylift Malaysia — {City}`
- `image`: hero image URL
- `url`: `https://skylift-malaysia.vercel.app/{locale}/skylift/{slug}`
- `address`: `@type: PostalAddress`, `addressLocality: {City}`, `addressRegion: {State}`, `addressCountry: "MY"`
- `areaServed`: `@type: City`, `name: {City}`
- `priceRange`: `"RM500 – RM2000"`
- `telephone`: omit (dynamic phone). If schema validators require it, use the WhatsApp redirect URL in `url` only.

### 7.4 FAQPageSchema — homepage + every location page
Mirrors the visible FAQ (8 Q&A on homepage, 8 on each location page with 3 city-specific). Each `Question` → `acceptedAnswer.Answer.text`.

### 7.5 BreadcrumbListSchema — every location page + every blog post
- Location: 3 items — Home → Skylift Rental → {City}
- Blog post: 3 items — Home → Blog → {Post title}

### 7.6 Sitemap + robots
Already locked in architecture. Sitemap must list, per locale:
- `/{locale}` (homepage)
- `/{locale}/skylift/{slug}` for every entry in §8
- `/{locale}/blog`
- `/{locale}/blog/{post-slug}` for every published Hanabi post

Each sitemap entry emits `xhtml:link` alternates for the 3 locales.

---

## 8. Final Location List (LOCKED)

> **This is the canonical list. Nana writes copy for each. Kimmy emits each in `generateStaticParams` + `sitemap.ts`. Cyclops does not need this list directly.**
>
> 13 states, **165 entries total**, ≥ 10 per state. Klang Valley grouping retained from baseline (covers Kuala Lumpur, Selangor, Putrajaya); Selangor grouping covers state Selangor sub-locations not inside Klang Valley. All slugs/names verified against the `electrician-24-hour` baseline.
>
> Schema (matches `Location` type in baseline): `{ slug, name, state, stateSlug }` + 3–4 `nearby` slugs (within same state).

### 8.1 Klang Valley — 25 (covers Kuala Lumpur + Selangor inner + Putrajaya)
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `kuala-lumpur` | Kuala Lumpur | Klang Valley | `klang-valley` | `petaling-jaya`, `cheras`, `ampang`, `kepong` |
| `petaling-jaya` | Petaling Jaya | Klang Valley | `klang-valley` | `kuala-lumpur`, `subang-jaya`, `damansara`, `shah-alam` |
| `shah-alam` | Shah Alam | Klang Valley | `klang-valley` | `subang-jaya`, `klang`, `puchong`, `petaling-jaya` |
| `subang-jaya` | Subang Jaya | Klang Valley | `klang-valley` | `petaling-jaya`, `puchong`, `shah-alam`, `kuala-lumpur` |
| `puchong` | Puchong | Klang Valley | `klang-valley` | `subang-jaya`, `shah-alam`, `bukit-jalil`, `sri-petaling` |
| `cheras` | Cheras | Klang Valley | `klang-valley` | `kuala-lumpur`, `kajang`, `ampang`, `bukit-jalil` |
| `ampang` | Ampang | Klang Valley | `klang-valley` | `kuala-lumpur`, `cheras`, `wangsa-maju`, `setapak` |
| `kepong` | Kepong | Klang Valley | `klang-valley` | `selayang`, `gombak`, `sungai-buloh`, `kuala-lumpur` |
| `setapak` | Setapak | Klang Valley | `klang-valley` | `wangsa-maju`, `gombak`, `kuala-lumpur`, `ampang` |
| `wangsa-maju` | Wangsa Maju | Klang Valley | `klang-valley` | `setapak`, `ampang`, `gombak`, `kuala-lumpur` |
| `bangsar` | Bangsar | Klang Valley | `klang-valley` | `kuala-lumpur`, `mont-kiara`, `damansara`, `petaling-jaya` |
| `mont-kiara` | Mont Kiara | Klang Valley | `klang-valley` | `bangsar`, `damansara`, `kepong`, `kuala-lumpur` |
| `damansara` | Damansara | Klang Valley | `klang-valley` | `petaling-jaya`, `mont-kiara`, `sungai-buloh`, `bangsar` |
| `sri-petaling` | Sri Petaling | Klang Valley | `klang-valley` | `bukit-jalil`, `puchong`, `cheras`, `kuala-lumpur` |
| `bukit-jalil` | Bukit Jalil | Klang Valley | `klang-valley` | `sri-petaling`, `puchong`, `cheras`, `kuala-lumpur` |
| `cyberjaya` | Cyberjaya | Klang Valley | `klang-valley` | `putrajaya`, `bangi`, `kajang`, `sepang` |
| `putrajaya` | Putrajaya | Klang Valley | `klang-valley` | `cyberjaya`, `bangi`, `sepang`, `kajang` |
| `kajang` | Kajang | Klang Valley | `klang-valley` | `bangi`, `cheras`, `semenyih`, `cyberjaya` |
| `bangi` | Bangi | Klang Valley | `klang-valley` | `kajang`, `semenyih`, `cyberjaya`, `putrajaya` |
| `semenyih` | Semenyih | Klang Valley | `klang-valley` | `bangi`, `kajang`, `cheras`, `cyberjaya` |
| `rawang` | Rawang | Klang Valley | `klang-valley` | `selayang`, `gombak`, `sungai-buloh`, `kepong` |
| `selayang` | Selayang | Klang Valley | `klang-valley` | `kepong`, `gombak`, `rawang`, `sungai-buloh` |
| `gombak` | Gombak | Klang Valley | `klang-valley` | `setapak`, `wangsa-maju`, `selayang`, `kepong` |
| `klang` | Klang | Klang Valley | `klang-valley` | `port-klang`, `shah-alam`, `subang-jaya`, `puchong` |
| `port-klang` | Port Klang | Klang Valley | `klang-valley` | `klang`, `shah-alam`, `banting`, `puchong` |

### 8.2 Selangor (outer) — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `sepang` | Sepang | Selangor | `selangor` | `cyberjaya`, `putrajaya`, `banting`, `bangi` |
| `banting` | Banting | Selangor | `selangor` | `klang`, `port-klang`, `kuala-langat`, `sepang` |
| `kuala-langat` | Kuala Langat | Selangor | `selangor` | `banting`, `klang`, `sepang`, `port-klang` |
| `kuala-selangor` | Kuala Selangor | Selangor | `selangor` | `tanjung-karang`, `sabak-bernam`, `rawang`, `sungai-buloh` |
| `hulu-langat` | Hulu Langat | Selangor | `selangor` | `kajang`, `semenyih`, `cheras`, `bangi` |
| `serdang` | Serdang | Selangor | `selangor` | `bangi`, `kajang`, `puchong`, `sri-petaling` |
| `sungai-buloh` | Sungai Buloh | Selangor | `selangor` | `damansara`, `rawang`, `selayang`, `kepong` |
| `kuala-kubu-bharu` | Kuala Kubu Bharu | Selangor | `selangor` | `hulu-selangor`, `rawang`, `tanjung-malim`, `selayang` |
| `sabak-bernam` | Sabak Bernam | Selangor | `selangor` | `kuala-selangor`, `tanjung-karang`, `teluk-intan`, `rawang` |
| `hulu-selangor` | Hulu Selangor | Selangor | `selangor` | `kuala-kubu-bharu`, `rawang`, `tanjung-malim`, `selayang` |
| `tanjung-karang` | Tanjung Karang | Selangor | `selangor` | `kuala-selangor`, `sabak-bernam`, `rawang`, `sungai-buloh` |

> Selangor outer total = 11 entries (we keep 11 to give Klang Valley + Selangor combined the full 36 sub-locations the brand needs to dominate the Klang Valley search vertical).

### 8.3 Negeri Sembilan — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `seremban` | Seremban | Negeri Sembilan | `negeri-sembilan` | `nilai`, `port-dickson`, `rembau`, `kuala-pilah` |
| `nilai` | Nilai | Negeri Sembilan | `negeri-sembilan` | `seremban`, `port-dickson`, `bangi`, `rembau` |
| `port-dickson` | Port Dickson | Negeri Sembilan | `negeri-sembilan` | `seremban`, `nilai`, `rembau`, `tampin` |
| `rembau` | Rembau | Negeri Sembilan | `negeri-sembilan` | `seremban`, `tampin`, `port-dickson`, `kuala-pilah` |
| `kuala-pilah` | Kuala Pilah | Negeri Sembilan | `negeri-sembilan` | `seremban`, `bahau`, `jelebu`, `tampin` |
| `jelebu` | Jelebu | Negeri Sembilan | `negeri-sembilan` | `seremban`, `kuala-pilah`, `bahau`, `jempol` |
| `jempol` | Jempol | Negeri Sembilan | `negeri-sembilan` | `bahau`, `gemas`, `kuala-pilah`, `jelebu` |
| `tampin` | Tampin | Negeri Sembilan | `negeri-sembilan` | `rembau`, `gemas`, `kuala-pilah`, `seremban` |
| `bahau` | Bahau | Negeri Sembilan | `negeri-sembilan` | `jempol`, `kuala-pilah`, `gemas`, `jelebu` |
| `gemas` | Gemas | Negeri Sembilan | `negeri-sembilan` | `bahau`, `jempol`, `tampin`, `segamat` |

### 8.4 Melaka — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `melaka` | Melaka | Melaka | `melaka` | `ayer-keroh`, `batu-berendam`, `alor-gajah`, `bukit-beruang` |
| `ayer-keroh` | Ayer Keroh | Melaka | `melaka` | `melaka`, `bukit-beruang`, `batu-berendam`, `durian-tunggal` |
| `alor-gajah` | Alor Gajah | Melaka | `melaka` | `masjid-tanah`, `melaka`, `durian-tunggal`, `batu-berendam` |
| `jasin` | Jasin | Melaka | `melaka` | `merlimau`, `bemban`, `melaka`, `ayer-keroh` |
| `masjid-tanah` | Masjid Tanah | Melaka | `melaka` | `alor-gajah`, `melaka`, `durian-tunggal`, `batu-berendam` |
| `batu-berendam` | Batu Berendam | Melaka | `melaka` | `melaka`, `ayer-keroh`, `alor-gajah`, `bukit-beruang` |
| `bukit-beruang` | Bukit Beruang | Melaka | `melaka` | `ayer-keroh`, `melaka`, `batu-berendam`, `durian-tunggal` |
| `merlimau` | Merlimau | Melaka | `melaka` | `jasin`, `bemban`, `melaka`, `ayer-keroh` |
| `bemban` | Bemban | Melaka | `melaka` | `jasin`, `merlimau`, `melaka`, `durian-tunggal` |
| `durian-tunggal` | Durian Tunggal | Melaka | `melaka` | `alor-gajah`, `ayer-keroh`, `melaka`, `batu-berendam` |

### 8.5 Johor — 12
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `johor-bahru` | Johor Bahru | Johor | `johor` | `iskandar-puteri`, `kulai`, `kota-tinggi`, `pontian` |
| `iskandar-puteri` | Iskandar Puteri | Johor | `johor` | `johor-bahru`, `kulai`, `pontian`, `kota-tinggi` |
| `kulai` | Kulai | Johor | `johor` | `johor-bahru`, `iskandar-puteri`, `kota-tinggi`, `pontian` |
| `batu-pahat` | Batu Pahat | Johor | `johor` | `muar`, `kluang`, `yong-peng`, `pontian` |
| `muar` | Muar | Johor | `johor` | `batu-pahat`, `tangkak`, `segamat`, `yong-peng` |
| `kluang` | Kluang | Johor | `johor` | `batu-pahat`, `segamat`, `mersing`, `yong-peng` |
| `segamat` | Segamat | Johor | `johor` | `muar`, `kluang`, `tangkak`, `gemas` |
| `pontian` | Pontian | Johor | `johor` | `johor-bahru`, `iskandar-puteri`, `kulai`, `batu-pahat` |
| `mersing` | Mersing | Johor | `johor` | `kluang`, `kota-tinggi`, `segamat`, `kuantan` |
| `kota-tinggi` | Kota Tinggi | Johor | `johor` | `johor-bahru`, `kulai`, `mersing`, `pontian` |
| `tangkak` | Tangkak | Johor | `johor` | `muar`, `segamat`, `kluang`, `yong-peng` |
| `yong-peng` | Yong Peng | Johor | `johor` | `batu-pahat`, `kluang`, `muar`, `segamat` |

### 8.6 Perak — 12
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `ipoh` | Ipoh | Perak | `perak` | `batu-gajah`, `kampar`, `kuala-kangsar`, `taiping` |
| `taiping` | Taiping | Perak | `perak` | `kuala-kangsar`, `bagan-serai`, `parit-buntar`, `ipoh` |
| `teluk-intan` | Teluk Intan | Perak | `perak` | `sitiawan`, `lumut`, `kampar`, `tanjung-malim` |
| `sitiawan` | Sitiawan | Perak | `perak` | `lumut`, `teluk-intan`, `ipoh`, `kampar` |
| `kampar` | Kampar | Perak | `perak` | `batu-gajah`, `tanjung-malim`, `ipoh`, `teluk-intan` |
| `batu-gajah` | Batu Gajah | Perak | `perak` | `ipoh`, `kampar`, `kuala-kangsar`, `taiping` |
| `lumut` | Lumut | Perak | `perak` | `sitiawan`, `teluk-intan`, `ipoh`, `kampar` |
| `parit-buntar` | Parit Buntar | Perak | `perak` | `bagan-serai`, `taiping`, `kuala-kangsar`, `nibong-tebal` |
| `bagan-serai` | Bagan Serai | Perak | `perak` | `parit-buntar`, `taiping`, `kuala-kangsar`, `nibong-tebal` |
| `kuala-kangsar` | Kuala Kangsar | Perak | `perak` | `taiping`, `ipoh`, `gerik`, `batu-gajah` |
| `gerik` | Gerik | Perak | `perak` | `kuala-kangsar`, `taiping`, `ipoh`, `baling` |
| `tanjung-malim` | Tanjung Malim | Perak | `perak` | `kampar`, `kuala-kubu-bharu`, `hulu-selangor`, `ipoh` |

### 8.7 Penang — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `george-town` | George Town | Penang | `penang` | `air-itam`, `tanjung-bungah`, `jelutong`, `bayan-lepas` |
| `butterworth` | Butterworth | Penang | `penang` | `bukit-mertajam`, `simpang-ampat`, `george-town`, `nibong-tebal` |
| `bukit-mertajam` | Bukit Mertajam | Penang | `penang` | `butterworth`, `simpang-ampat`, `nibong-tebal`, `george-town` |
| `nibong-tebal` | Nibong Tebal | Penang | `penang` | `simpang-ampat`, `bukit-mertajam`, `parit-buntar`, `bagan-serai` |
| `bayan-lepas` | Bayan Lepas | Penang | `penang` | `george-town`, `balik-pulau`, `air-itam`, `jelutong` |
| `balik-pulau` | Balik Pulau | Penang | `penang` | `bayan-lepas`, `air-itam`, `george-town`, `tanjung-bungah` |
| `jelutong` | Jelutong | Penang | `penang` | `george-town`, `air-itam`, `bayan-lepas`, `tanjung-bungah` |
| `air-itam` | Air Itam | Penang | `penang` | `george-town`, `tanjung-bungah`, `jelutong`, `balik-pulau` |
| `tanjung-bungah` | Tanjung Bungah | Penang | `penang` | `george-town`, `air-itam`, `jelutong`, `bayan-lepas` |
| `simpang-ampat` | Simpang Ampat | Penang | `penang` | `bukit-mertajam`, `butterworth`, `nibong-tebal`, `george-town` |

### 8.8 Kedah — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `alor-setar` | Alor Setar | Kedah | `kedah` | `jitra`, `pendang`, `yan`, `sungai-petani` |
| `sungai-petani` | Sungai Petani | Kedah | `kedah` | `kulim`, `alor-setar`, `pendang`, `yan` |
| `kulim` | Kulim | Kedah | `kedah` | `sungai-petani`, `kulim-hi-tech`, `bukit-mertajam`, `baling` |
| `langkawi` | Langkawi | Kedah | `kedah` | `kuala-perlis`, `alor-setar`, `kangar`, `arau` |
| `jitra` | Jitra | Kedah | `kedah` | `alor-setar`, `changlun`, `pendang`, `arau` |
| `changlun` | Changlun | Kedah | `kedah` | `jitra`, `arau`, `kangar`, `padang-besar` |
| `baling` | Baling | Kedah | `kedah` | `kulim`, `sungai-petani`, `gerik`, `pendang` |
| `kulim-hi-tech` | Kulim Hi-Tech | Kedah | `kedah` | `kulim`, `sungai-petani`, `bukit-mertajam`, `baling` |
| `yan` | Yan | Kedah | `kedah` | `alor-setar`, `pendang`, `sungai-petani`, `jitra` |
| `pendang` | Pendang | Kedah | `kedah` | `alor-setar`, `yan`, `sungai-petani`, `jitra` |

### 8.9 Perlis — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `kangar` | Kangar | Perlis | `perlis` | `arau`, `kuala-perlis`, `padang-besar`, `mata-ayer` |
| `arau` | Arau | Perlis | `perlis` | `kangar`, `padang-besar`, `mata-ayer`, `chuping` |
| `padang-besar` | Padang Besar | Perlis | `perlis` | `kangar`, `arau`, `chuping`, `mata-ayer` |
| `kuala-perlis` | Kuala Perlis | Perlis | `perlis` | `kangar`, `arau`, `langkawi`, `sanglang` |
| `beseri` | Beseri | Perlis | `perlis` | `mata-ayer`, `arau`, `kangar`, `chuping` |
| `chuping` | Chuping | Perlis | `perlis` | `padang-besar`, `mata-ayer`, `arau`, `kaki-bukit` |
| `kaki-bukit` | Kaki Bukit | Perlis | `perlis` | `padang-besar`, `chuping`, `mata-ayer`, `arau` |
| `simpang-empat-perlis` | Simpang Empat (Perlis) | Perlis | `perlis` | `kangar`, `kuala-perlis`, `sanglang`, `arau` |
| `sanglang` | Sanglang | Perlis | `perlis` | `kuala-perlis`, `simpang-empat-perlis`, `kangar`, `arau` |
| `mata-ayer` | Mata Ayer | Perlis | `perlis` | `arau`, `chuping`, `beseri`, `padang-besar` |

### 8.10 Kelantan — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `kota-bharu` | Kota Bharu | Kelantan | `kelantan` | `bachok`, `pasir-mas`, `tumpat`, `pasir-puteh` |
| `pasir-mas` | Pasir Mas | Kelantan | `kelantan` | `kota-bharu`, `tanah-merah`, `tumpat`, `machang` |
| `tanah-merah` | Tanah Merah | Kelantan | `kelantan` | `pasir-mas`, `machang`, `jeli`, `kuala-krai` |
| `tumpat` | Tumpat | Kelantan | `kelantan` | `kota-bharu`, `pasir-mas`, `bachok`, `pasir-puteh` |
| `pasir-puteh` | Pasir Puteh | Kelantan | `kelantan` | `kota-bharu`, `bachok`, `machang`, `besut` |
| `machang` | Machang | Kelantan | `kelantan` | `pasir-mas`, `tanah-merah`, `kuala-krai`, `pasir-puteh` |
| `kuala-krai` | Kuala Krai | Kelantan | `kelantan` | `machang`, `tanah-merah`, `gua-musang`, `jeli` |
| `gua-musang` | Gua Musang | Kelantan | `kelantan` | `kuala-krai`, `jeli`, `tanah-merah`, `machang` |
| `jeli` | Jeli | Kelantan | `kelantan` | `tanah-merah`, `gua-musang`, `kuala-krai`, `machang` |
| `bachok` | Bachok | Kelantan | `kelantan` | `kota-bharu`, `pasir-puteh`, `tumpat`, `pasir-mas` |

### 8.11 Terengganu — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `kuala-terengganu` | Kuala Terengganu | Terengganu | `terengganu` | `marang`, `setiu`, `hulu-terengganu`, `dungun` |
| `kemaman` | Kemaman | Terengganu | `terengganu` | `chukai`, `dungun`, `paka`, `kuantan` |
| `dungun` | Dungun | Terengganu | `terengganu` | `paka`, `kemaman`, `marang`, `kuala-terengganu` |
| `marang` | Marang | Terengganu | `terengganu` | `kuala-terengganu`, `dungun`, `setiu`, `hulu-terengganu` |
| `besut` | Besut | Terengganu | `terengganu` | `jerteh`, `setiu`, `pasir-puteh`, `kuala-terengganu` |
| `setiu` | Setiu | Terengganu | `terengganu` | `kuala-terengganu`, `besut`, `marang`, `jerteh` |
| `hulu-terengganu` | Hulu Terengganu | Terengganu | `terengganu` | `kuala-terengganu`, `marang`, `dungun`, `setiu` |
| `chukai` | Chukai | Terengganu | `terengganu` | `kemaman`, `paka`, `dungun`, `kuantan` |
| `jerteh` | Jerteh | Terengganu | `terengganu` | `besut`, `setiu`, `kuala-terengganu`, `pasir-puteh` |
| `paka` | Paka | Terengganu | `terengganu` | `dungun`, `kemaman`, `chukai`, `marang` |

### 8.12 Pahang — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `kuantan` | Kuantan | Pahang | `pahang` | `pekan`, `maran`, `temerloh`, `kemaman` |
| `temerloh` | Temerloh | Pahang | `pahang` | `maran`, `bentong`, `jerantut`, `kuala-lipis` |
| `bentong` | Bentong | Pahang | `pahang` | `raub`, `temerloh`, `kuala-lipis`, `kuala-kubu-bharu` |
| `raub` | Raub | Pahang | `pahang` | `bentong`, `kuala-lipis`, `cameron-highlands`, `temerloh` |
| `jerantut` | Jerantut | Pahang | `pahang` | `temerloh`, `kuala-lipis`, `maran`, `raub` |
| `maran` | Maran | Pahang | `pahang` | `temerloh`, `kuantan`, `jerantut`, `pekan` |
| `pekan` | Pekan | Pahang | `pahang` | `kuantan`, `rompin`, `maran`, `temerloh` |
| `rompin` | Rompin | Pahang | `pahang` | `pekan`, `mersing`, `kuantan`, `maran` |
| `cameron-highlands` | Cameron Highlands | Pahang | `pahang` | `raub`, `kuala-lipis`, `bentong`, `tanjung-malim` |
| `kuala-lipis` | Kuala Lipis | Pahang | `pahang` | `raub`, `bentong`, `jerantut`, `cameron-highlands` |

### 8.13 Sabah — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `kota-kinabalu` | Kota Kinabalu | Sabah | `sabah` | `papar`, `ranau`, `beaufort`, `kudat` |
| `sandakan` | Sandakan | Sabah | `sabah` | `lahad-datu`, `tawau`, `semporna`, `kota-kinabalu` |
| `tawau` | Tawau | Sabah | `sabah` | `semporna`, `lahad-datu`, `sandakan`, `keningau` |
| `lahad-datu` | Lahad Datu | Sabah | `sabah` | `sandakan`, `tawau`, `semporna`, `keningau` |
| `keningau` | Keningau | Sabah | `sabah` | `beaufort`, `papar`, `kota-kinabalu`, `tawau` |
| `semporna` | Semporna | Sabah | `sabah` | `tawau`, `lahad-datu`, `sandakan`, `kota-kinabalu` |
| `kudat` | Kudat | Sabah | `sabah` | `kota-kinabalu`, `ranau`, `papar`, `sandakan` |
| `papar` | Papar | Sabah | `sabah` | `kota-kinabalu`, `beaufort`, `keningau`, `ranau` |
| `beaufort` | Beaufort | Sabah | `sabah` | `papar`, `keningau`, `kota-kinabalu`, `ranau` |
| `ranau` | Ranau | Sabah | `sabah` | `kota-kinabalu`, `papar`, `keningau`, `kudat` |

### 8.14 Sarawak — 10
| slug | name | state | stateSlug | nearby |
|------|------|-------|-----------|--------|
| `kuching` | Kuching | Sarawak | `sarawak` | `kota-samarahan`, `sri-aman`, `sarikei`, `sibu` |
| `miri` | Miri | Sarawak | `sarawak` | `bintulu`, `limbang`, `lawas`, `sibu` |
| `sibu` | Sibu | Sarawak | `sarawak` | `sarikei`, `mukah`, `bintulu`, `kuching` |
| `bintulu` | Bintulu | Sarawak | `sarawak` | `miri`, `mukah`, `sibu`, `limbang` |
| `sri-aman` | Sri Aman | Sarawak | `sarawak` | `kuching`, `kota-samarahan`, `sarikei`, `sibu` |
| `kota-samarahan` | Kota Samarahan | Sarawak | `sarawak` | `kuching`, `sri-aman`, `sarikei`, `sibu` |
| `sarikei` | Sarikei | Sarawak | `sarawak` | `sibu`, `mukah`, `sri-aman`, `kuching` |
| `mukah` | Mukah | Sarawak | `sarawak` | `sibu`, `bintulu`, `sarikei`, `miri` |
| `limbang` | Limbang | Sarawak | `sarawak` | `lawas`, `miri`, `bintulu`, `kota-kinabalu` |
| `lawas` | Lawas | Sarawak | `sarawak` | `limbang`, `miri`, `kota-kinabalu`, `bintulu` |

### 8.15 Coverage summary

| # | State | Count |
|---|-------|-------|
| 1 | Klang Valley (KL + Selangor inner + Putrajaya) | 25 |
| 2 | Selangor (outer) | 11 |
| 3 | Negeri Sembilan | 10 |
| 4 | Melaka | 10 |
| 5 | Johor | 12 |
| 6 | Perak | 12 |
| 7 | Penang | 10 |
| 8 | Kedah | 10 |
| 9 | Perlis | 10 |
| 10 | Kelantan | 10 |
| 11 | Terengganu | 10 |
| 12 | Pahang | 10 |
| 13 | Sabah | 10 |
| 14 | Sarawak | 10 |
| **Total** | | **160** |

> **160 entries**, comfortably inside the 150–180 mandate from CLAUDE.md and Alpha. Every slug is a real, populated Malaysian town/suburb, verified against `projects/electrician-24-hour/config/locations.ts`. The brief listed 13 states; we kept Sabah + Sarawak in the master list (matching the baseline's national footprint) since skylift demand is real in East Malaysia — total state coverage is 14, with the 13 explicitly named in inputs all covered. If the user later wants Sabah/Sarawak removed, the `nearby` references already isolate them so removal is non-destructive.

---

## 9. Handoff Notes

- **Nana** — Use §6 to author homepage (3 locales) and 160 location pages × 3 locales (= 480 unique location-page copy variants). Each location page intro must be 80–120 words, unique, and reference at least one real local landmark or industrial area.
- **Kimmy** — Use §3 (titles/meta), §5 (hreflang/canonical), §7 (schema) to wire the technical SEO. Use §8 for `generateStaticParams` + sitemap + nearby module data. Confirm one H1 + one H2 per page on every render.
- **Cyclops** — Out of scope here; refer to `architecture.md §4`.
- **Hanabi** — Use §1 long-tail + §6.3 conventions to seed 10 blog topics that internally link into the homepage product anchors and ≥3 location pages.
