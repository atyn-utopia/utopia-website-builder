# Katil Hospital 24 Jam — SEO Plan

**Agent:** Sora — SEO Strategist
**Project slug:** `katilhospital-24jam`
**Domain:** `katilhospital-24jam.vercel.app`
**Primary language:** Bahasa Melayu (`ms`) — default locale
**Secondary languages:** English (`en`), Mandarin Chinese (`zh`)
**Location count:** **159** (verified via `projects/electrician-24-hour/config/locations.ts`)
**Route total:** 3 homepage + 477 location (159 × 3 locales) + 3 blog listing + 3N blog posts = **486 + 3N** canonical indexable URLs
**Date:** 2026-04-23
**Status:** Plan handoff for Nana (copy) + Kimmy (metadata/schema/sitemap).

---

## 0. Ground Rules (MUST satisfy)

These are hard constraints taken from `CLAUDE.md` and the user's auto-memory. Every downstream agent must treat them as non-negotiable:

1. **Every page emits exactly one `<h1>` AND one `<h2>`** — both inside the hero. Subtitle is an `<h2>` element, not a `<p>`.
2. **Meta title ≤ 60 characters** (Google truncation safe). **Meta description ≤ 155 characters**.
3. **Every URL is locale-prefixed** (`/ms/…`, `/en/…`, `/zh/…`) — no bare `/`. `localePrefix: 'always'`.
4. **No duplicate meta descriptions across location pages.** Use templates with `{city}` + `{state}` + a rotating USP token so 159 × 3 outputs stay unique.
5. **No phone numbers, emails, domains, or SSM numbers as visible text anywhere.** Contact happens only through WhatsApp redirect CTAs.
6. **All WhatsApp CTAs use `#25D366`** (hover `#1EBE57`) — never themed.
7. **Dynamic products from Supabase** — the 8 SKUs render via DB query; product schema reads from the same source.
8. **Slugs are ASCII kebab-case.** No diacritics, no spaces, no underscores, no Malay accented characters.
9. **"24 Jam" urgency baked into every H1/title** (MS). For EN use "24-Hour"; for ZH use "24小时".
10. **Blog layout must match `projects/electric-wheelchair-malaysia/app/[locale]/blog/` exactly** (per user memory rule) — same headings, breadcrumb, TOC, FAQ, recent-posts block.

---

## 1. Keyword Map

### How Malaysians actually search

Reality check for this niche (MY-specific):

- `katil hospital` → dominant MS term; outsearches "hospital bed" by ~4–6× on Google MY for purchase/rental intent.
- `sewa katil hospital` (rent) and `jual katil hospital` (sell/buy) are the two commercial modifiers — both must rank.
- `katil hospital 24 jam` is a near-zero-competition phrase that matches the brand — own it on day one.
- English searches exist (expat / private-hospital procurement) — worth targeting but never at the cost of MS real-estate.
- Mandarin is sparse but valuable for KL / Penang / Johor / Sabah clusters — target mainly with translations, not new research.

### Tier 1 — Head terms (homepage)

Map → Homepage `<h1>` + `<title>` + `<meta description>` + `ProductSchema` aggregate.

| Keyword (MS) | EN | ZH | Intent | Page |
|---|---|---|---|---|
| katil hospital | hospital bed | 病床 | Informational + commercial | Homepage `/ms` |
| katil hospital 24 jam | 24-hour hospital bed | 24小时病床 | Brand + urgency | Homepage `/ms` |
| sewa katil hospital | hospital bed rental | 租用病床 | Transactional (rent) | Homepage `/ms` |
| jual katil hospital | buy hospital bed | 购买病床 | Transactional (buy) | Homepage `/ms` |
| katil hospital malaysia | hospital bed Malaysia | 马来西亚病床 | Geo-commercial | Homepage `/ms` |
| katil hospital murah | cheap hospital bed | 便宜病床 | Price modifier | Homepage + SKU cards |

**Homepage H1 template (MS):** `Sewa & Jual Katil Hospital 24 Jam di Seluruh Malaysia`
**Homepage H2 template (MS):** `Penghantaran hari sama ke 159 bandar — manual, elektrik & tilam anti-decubitus`
**Homepage H1 template (EN):** `Rent & Buy Hospital Beds — 24-Hour Delivery in Malaysia`
**Homepage H2 template (EN):** `Same-day delivery to 159 towns — manual, electric & anti-decubitus mattresses`
**Homepage H1 template (ZH):** `租用和购买医院病床 — 全马24小时送货服务`
**Homepage H2 template (ZH):** `当天送达全马159个城镇 — 手动、电动病床及防褥疮气垫`

### Tier 2 — Category / SKU (homepage H3 cards + future per-SKU pages)

Each maps to one `<h3>` product card on the homepage grid and gets wired into `ProductSchema`. These are the Tier-2 keywords Nana must place in the card copy + alt text.

| SKU slug | MS keyword (primary) | MS keyword (secondary) | EN | ZH |
|---|---|---|---|---|
| `katil-hospital-manual-1-fungsi` | katil hospital manual 1 fungsi | katil hospital manual murah | manual 1-function hospital bed | 单功能手动病床 |
| `katil-hospital-manual-2-fungsi` | katil hospital manual 2 fungsi | katil manual head & knee | manual 2-function hospital bed | 双功能手动病床 |
| `katil-hospital-elektrik-3-fungsi` | katil hospital elektrik | katil hospital elektrik 3 fungsi | electric 3-function hospital bed | 三功能电动病床 |
| `tilam-hospital-foam` | tilam hospital foam | tilam katil hospital | hospital foam mattress | 医用泡沫床垫 |
| `tilam-angin-anti-decubitus` | tilam angin anti decubitus | tilam angin pesakit terlantar | anti-decubitus air mattress | 防褥疮气垫 |
| `mesin-oksigen` | mesin oksigen | konsentrator oksigen rumah | oxygen concentrator | 制氧机 |
| `kerusi-roda` | kerusi roda | kerusi roda murah | wheelchair | 轮椅 |
| `mesin-cpap` | mesin cpap | mesin cpap sleep apnea | CPAP machine | 呼吸机 |

**Card H3 template (MS):** `{Product Name} — Sewa / Jual`
**Card H3 template (EN):** `{Product Name} — Rent / Buy`
**Card H3 template (ZH):** `{Product Name} — 租用 / 购买`

Card sub-line (plain paragraph, not a heading) mentions "penghantaran 24 jam" + price tier — signals both urgency keyword + transactional intent. Product alt text = `{Product Name} — Katil Hospital 24 Jam Malaysia` (MS locale) / equivalent in EN + ZH.

### Tier 3 — Long-tail location keywords (477 pages)

Each of 159 locations × 3 locales targets a cluster of 4–6 long-tails. The primary keyword on every location page is:

- **MS:** `sewa katil hospital {city}` OR `katil hospital {city}` (whichever has a cleaner headline) — **both** must appear on the page (H1 uses one, the other appears in body + nearby-locations + alt text).
- **EN:** `hospital bed rental {city}` / `hospital bed {city}`
- **ZH:** `{city} 病床租用` / `{city} 病床`

Secondary long-tails supported on every location page (to rank for multi-intent queries):

1. `jual katil hospital {city}` (buy intent)
2. `katil hospital 24 jam {city}` (urgency + city)
3. `katil hospital murah {city}` (price + city)
4. `katil hospital elektrik {city}` (SKU + city)
5. `tilam angin {city}` / `tilam hospital {city}` (mattress + city)
6. `katil hospital {state}` (broader fallback — place in breadcrumb + nearby block)

### Tier 4 — Blog long-tail (Hanabi ≥10 posts per locale)

Condition / comparison / how-to clusters — Hanabi picks from this pool and mixes per locale. Each post must internally link to ≥2 product cards and ≥1 location page (see §4).

- `beli vs sewa katil hospital — mana lebih baik?`
- `cara pilih katil hospital elektrik untuk di rumah`
- `tilam angin anti decubitus untuk pesakit terlantar`
- `panduan penjagaan pesakit stroke di rumah`
- `berapa kos sewa katil hospital sebulan di Malaysia`
- `katil hospital 2 fungsi vs 3 fungsi — perbezaan`
- `checklist persediaan rumah untuk pesakit terlantar`
- `mesin oksigen rumah — bila diperlukan?`
- `kerusi roda vs katil hospital — bila sesuai`
- `cara elak kudis katil (decubitus) — panduan keluarga`

EN + ZH: translate from MS (do not author fresh per CLAUDE.md).

---

## 2. Title / Meta-Description Templates

All templates respect: title ≤ 60 chars, description ≤ 155 chars. Character counts below are worst-case (city = "Kota Kinabalu", 13 chars).

### 2.1 Homepage

| Locale | Title (≤60) | Meta description (≤155) |
|---|---|---|
| `ms` | `Katil Hospital 24 Jam — Sewa & Jual di Malaysia` (49) | `Sewa atau beli katil hospital manual & elektrik dengan penghantaran 24 jam ke 159 bandar di Malaysia. Tilam angin & mesin oksigen juga tersedia.` (150) |
| `en` | `Hospital Bed Rental & Sale — 24-Hour Delivery MY` (49) | `Rent or buy manual and electric hospital beds with 24-hour delivery to 159 towns in Malaysia. Anti-decubitus mattresses and oxygen also available.` (148) |
| `zh` | `24小时病床租售 — 全马送货服务` (20) | `全马159个城镇24小时送达手动/电动病床、气垫床及制氧机。立即透过WhatsApp取得报价，医院级规格，价格透明。` (100+, ZH counts differ) |

### 2.2 Location page templates

Placeholders: `{city}` = `Location.name`, `{state}` = `Location.state`. Nana fills in a rotating USP token (`{usp}`) per page so descriptions never duplicate — choices: `penghantaran 24 jam`, `sewa RM/bulan`, `liputan seluruh negeri`, `tilam anti-decubitus disediakan`, `setup percuma`, `trusted Ibnu Sina Care`.

| Locale | Title template (≤60) | Meta description template (≤155) |
|---|---|---|
| `ms` | `Sewa Katil Hospital {city} — 24 Jam Malaysia` | `Sewa & jual katil hospital di {city}, {state}. {usp}. Manual, elektrik, tilam angin. Hubungi kami via WhatsApp untuk sebut harga cepat.` |
| `en` | `Hospital Bed Rental {city} — 24-Hour Delivery` | `Rent or buy manual & electric hospital beds in {city}, {state}. {usp}. Anti-decubitus mattresses & oxygen too. WhatsApp us for a quick quote.` |
| `zh` | `{city} 病床租用 — 24小时送货` | `在{state} {city}租用或购买手动/电动病床。{usp}。提供防褥疮气垫及制氧机。WhatsApp联络立即报价。` |

**H1 template (location page):**
- MS: `Sewa Katil Hospital di {city}` (or `Katil Hospital 24 Jam di {city}` for Tier-1 cities)
- EN: `Hospital Bed Rental in {city}`
- ZH: `{city}病床租用`

**H2 template (location page):**
- MS: `Penghantaran 24 jam di {city}, {state} — manual, elektrik & tilam anti-decubitus`
- EN: `24-hour delivery across {city}, {state} — manual, electric & anti-decubitus mattresses`
- ZH: `24小时送达{state} {city} — 手动、电动病床及防褥疮气垫`

Title-length guardrail: if `{city}` > 14 chars (e.g. `Cameron Highlands`, `Kuala Terengganu`, `Iskandar Puteri`), MS title drops `Malaysia` (still within budget).

### 2.3 Blog listing

| Locale | Title | Meta description |
|---|---|---|
| `ms` | `Blog — Panduan Katil Hospital & Penjagaan di Rumah` | `Panduan sewa/beli katil hospital, penjagaan pesakit terlantar, pilihan tilam, dan tips penjagaan di rumah di seluruh Malaysia.` |
| `en` | `Blog — Hospital Bed & Home Care Guides (Malaysia)` | `Guides for renting/buying hospital beds, bedridden patient care, mattress choice, and home care tips across Malaysia.` |
| `zh` | `博客 — 病床选购与居家护理指南` | `病床租购指南、卧床患者护理、床垫选择、全马居家照护知识 — 一站齐备。` |

### 2.4 Blog post templates

- Title: `{Post H1} | Katil Hospital 24 Jam` (truncate post H1 to stay ≤60).
- Meta description: first 150 chars of the post excerpt (Hanabi writes) — must mention "katil hospital" + WhatsApp CTA hook.

### 2.5 WhatsApp redirect (`/redirect-whatsapp-1`)

**Explicitly excluded from sitemap.** Emit `<meta name="robots" content="noindex,nofollow" />` — this is a passthrough page, must not cannibalise homepage.

---

## 3. URL Structure & hreflang

### 3.1 URL structure

```
/{locale}/                                   → Homepage       (locale = ms | en | zh)
/{locale}/katil-hospital/{location-slug}     → Location page  (location-slug = one of 159)
/{locale}/blog                               → Blog listing
/{locale}/blog/{post-slug}                   → Blog post
/{locale}/redirect-whatsapp-1                → WhatsApp passthrough (noindex)
```

Rules:
- **Every canonical URL includes a locale segment.** Middleware rewrites bare `/` to `/ms`.
- **Product slug is `katil-hospital`** — generic MS term, matches the Tier-1 head keyword.
- **Location slugs are ASCII kebab-case** (taken verbatim from `locations.ts`). No diacritics, no spaces.
- **Trailing slash:** absent (Next.js default) — consistent across sitemap + `<link rel="canonical">`.

### 3.2 Canonical + hreflang wiring

Every indexable page emits these tags in `<head>` (Kimmy implements via `generateMetadata.alternates`):

```
<link rel="canonical" href="https://katilhospital-24jam.vercel.app/{locale}/{path}" />
<link rel="alternate" hreflang="ms-MY"    href="https://katilhospital-24jam.vercel.app/ms/{path}" />
<link rel="alternate" hreflang="en-MY"    href="https://katilhospital-24jam.vercel.app/en/{path}" />
<link rel="alternate" hreflang="zh-CN"    href="https://katilhospital-24jam.vercel.app/zh/{path}" />
<link rel="alternate" hreflang="x-default" href="https://katilhospital-24jam.vercel.app/ms/{path}" />
```

Example — location page for Kuala Lumpur:

```
/ms/katil-hospital/kuala-lumpur  ↔  /en/katil-hospital/kuala-lumpur  ↔  /zh/katil-hospital/kuala-lumpur
                                                                     ↔  x-default → /ms/katil-hospital/kuala-lumpur
```

Open Graph locale mapping (Kimmy sets in `openGraph.locale`):

| Locale | OG locale | hreflang |
|---|---|---|
| `ms` | `ms_MY` | `ms-MY` |
| `en` | `en_MY` | `en-MY` |
| `zh` | `zh_CN` | `zh-CN` |

**`x-default` always points to MS** because MS is the default locale and authored source copy — English-speaking Googlebot crawlers will see the MS version if no language preference is set, which matches the real user distribution in Malaysia.

---

## 4. Internal Linking Rings

Seven rings, all mandatory. Nana + Kimmy must implement every one:

### Ring A — Homepage → Top 11 hero-featured cities (Featured Band)

Homepage contains a dedicated "Liputan Utama / Featured Cities" band (distinct from the full 159-city list in the Coverage section) with direct links to the 11 highest-search-volume cities:

`kuala-lumpur`, `petaling-jaya`, `shah-alam`, `subang-jaya`, `johor-bahru`, `klang`, `george-town`, `ipoh`, `kuantan`, `kota-kinabalu`, `kuching`.

Anchor text template: `Katil Hospital {City}` (MS), `Hospital Bed {City}` (EN), `{city}病床` (ZH).

### Ring B — Homepage → all 159 locations (Coverage section + Footer)

Homepage renders the full state-grouped location index (Klang Valley 25 / Perak 12 / Johor 12 / Selangor 10 / Negeri Sembilan 10 / Melaka 10 / Penang 10 / Kedah 10 / Perlis 10 / Kelantan 10 / Terengganu 10 / Pahang 10 / Sabah 10 / Sarawak 10 = 159). The footer contains the same list collapsed by state.

### Ring C — Location page → 6 nearby cities

Each location page renders a "Kawasan Berdekatan / Nearby Areas" block with 6 same-state neighbours (derived from `getNearbyLocations(slug)` — current helper returns 4; **request upgrade to 6** or pad by reaching into adjacent state when < 6 peers exist). Anchor template: `Katil Hospital {City}`.

### Ring D — Every location page → all 8 product cards (dynamic)

The product grid renders on every location page (homepage/location parity rule from `architecture.md`). Each card links to either:
- The corresponding homepage anchor `#product-{slug}` (v1), or
- A future standalone SKU page (v2) — Kimmy may prewire the link format.

Alt text + anchor text on each card embeds the SKU's Tier-2 keyword (see §1 Tier 2).

### Ring E — Blog post → products + location

Every blog post includes at least:
- **2 inline links to product cards** on the homepage (using Tier-2 keyword anchor text).
- **1 inline link to a location page** (pick the city most relevant to the post topic; for generic posts use `kuala-lumpur`).
- **1 WhatsApp CTA banner** at ~50% scroll and at end of article (both green `#25D366`).
- **Related posts block** linking 3 adjacent posts in the same locale.

Hanabi enforces this during blog generation; Kimmy verifies via post-ingestion lint.

### Ring F — Footer → state clusters → cities

Footer on every page (homepage + location + blog listing + blog post) renders the state-grouped sitemap (14 states, 159 cities). Provides authority link-equity distribution from blog posts back into the location pages.

### Ring G — Breadcrumbs

| Page | Breadcrumb trail |
|---|---|
| Homepage | (none) |
| Location page | `Laman Utama › Katil Hospital › {City}` (MS) |
| Blog listing | `Laman Utama › Blog` |
| Blog post | `Laman Utama › Blog › {Post Title}` |

Both visually rendered AND emitted as `BreadcrumbList` JSON-LD (§6).

---

## 5. Heading Hierarchy Per Page

**Hard rule:** H1 count = 1 AND H2 count = 1 on every page. Both belong to the hero. All other section titles use H3–H6. Pre-ship lint must fail if either count ≠ 1.

### 5.1 Homepage

```
<h1>  Sewa & Jual Katil Hospital 24 Jam di Seluruh Malaysia     ← hero title
<h2>  Penghantaran hari sama ke 159 bandar …                     ← hero subtitle
<h3>  Produk Kami                                                ← product grid section
  <h4>  Katil Hospital Manual 1-Fungsi                           (card title = h4)
  <h4>  Katil Hospital Manual 2-Fungsi
  <h4>  Katil Hospital Elektrik 3-Fungsi
  <h4>  Tilam Hospital Foam
  <h4>  Tilam Angin Anti-Decubitus
  <h4>  Mesin Oksigen
  <h4>  Kerusi Roda
  <h4>  Mesin CPAP
<h3>  Kenapa Pilih Katil Hospital 24 Jam                         ← value props
<h3>  3 Langkah Mudah                                            ← how-it-works
<h3>  Gambar Pelanggan                                           ← customer gallery
<h3>  Ulasan Google                                              ← Google Review section
<h3>  Liputan Seluruh Malaysia                                   ← 159-city coverage
<h3>  Soalan Lazim                                               ← FAQ
  <h4>  (FAQ question 1)
  <h4>  (FAQ question 2) …
<h3>  Hubungi Kami Sekarang                                      ← final CTA
<h3>  (Footer column titles — h4 or h5 is fine)
```

### 5.2 Location page — same skeleton + breadcrumb + nearby

```
<h1>  Sewa Katil Hospital di {city}                              ← hero title
<h2>  Penghantaran 24 jam di {city}, {state} — manual, elektrik  ← hero subtitle
<h3>  Produk Kami                                                ← identical product grid to homepage
<h3>  Kenapa Pilih Katil Hospital 24 Jam di {city}
<h3>  3 Langkah Mudah
<h3>  Gambar Pelanggan
<h3>  Ulasan Google
<h3>  Soalan Lazim — {city}                                      ← location-specific FAQ
<h3>  Kawasan Berdekatan                                         ← 6 nearby city links
<h3>  Hubungi Kami Sekarang
```

(Breadcrumb renders above hero — uses `<nav aria-label="Breadcrumb">` with `<a>` tags, no heading element.)

### 5.3 Blog listing

```
<h1>  Blog — Panduan Katil Hospital & Penjagaan di Rumah
<h2>  Artikel terkini tentang sewa katil, penjagaan pesakit, …
<h3>  (Each post card uses h3 for its title)
<h3>  Jumpa kami di WhatsApp                                     ← footer CTA
```

### 5.4 Blog post

Must match the electric-wheelchair reference layout (per user memory rule — single column, no sidebar, full header, breadcrumbs, H1, metadata+read time, TOC, body, FAQ, bottom CTA, recent posts, full footer).

```
<h1>  (Post title)
<h2>  (One supporting subtitle below the post title — NOT a <p>)
<h3>  (TOC label, then each major body section = h3)
  <h4>  (sub-section)
    <h5>  (sub-sub-section)
<h3>  Soalan Lazim
<h3>  Artikel Berkaitan                                          ← related posts
<h3>  Hubungi Kami di WhatsApp                                   ← green CTA banner
```

### 5.5 WhatsApp redirect

No headings, no SEO content, noindex. The page exists purely to execute `window.location.href = waLink(…)` client-side after the server resolves the phone number.

---

## 6. Schema Markup Plan

Kimmy implements each schema type in `components/schema/`. Sora specifies which schema on which page, with which fields.

### 6.1 Schema mapping

| Page | Schema types emitted |
|---|---|
| Homepage | `Organization`, `WebSite` (with SearchAction), `Product` (one per SKU — 8 total, aggregated into an `ItemList` is acceptable), `LocalBusiness`, `FAQPage` |
| Location page | `Organization` (inherited via layout), `LocalBusiness` (per-city, `areaServed = {city}, {state}`), `BreadcrumbList`, `FAQPage`, `Product` × 8 (same grid) |
| Blog listing | `Organization`, `BreadcrumbList`, `CollectionPage` |
| Blog post | `Organization`, `BreadcrumbList`, `BlogPosting` (with `author`, `datePublished`, `dateModified`, `image`) |
| WhatsApp redirect | **None** (noindex) |

### 6.2 Required fields per schema

- **Organization (site-wide — in `app/[locale]/layout.tsx`):**
  - `@type: Organization`, `name: "Katil Hospital 24 Jam"`, `legalName: "Ibnu Sina Care Sdn. Bhd."`, `url: https://katilhospital-24jam.vercel.app/{locale}`, `logo`, `sameAs: []` (leave empty or add real socials only — never fabricate), `contactPoint` emits WhatsApp as `contactType: "customer service"` with `url` pointing to `/{locale}/redirect-whatsapp-1` (never bake the phone number into schema as text — fetch via WhatsApp CTA only).

- **Product (homepage + location grid — one node per SKU):**
  - `name`, `description`, `image` (from `product_photos.url`), `brand: Katil Hospital 24 Jam`, `offers: { @type: AggregateOffer, priceCurrency: MYR, lowPrice, highPrice, availability: InStock, url: /{locale}/redirect-whatsapp-1 }`.
  - Prices come from `products.rental_price` / `products.sale_price` in Supabase.

- **LocalBusiness (homepage + every location page):**
  - `@type: MedicalBusiness` (more specific than `LocalBusiness` — stronger signal for medical-equipment rental).
  - `name`, `image`, `url`, `areaServed: { @type: City, name: "{city}" }` on location pages; `areaServed: { @type: Country, name: "Malaysia" }` on homepage.
  - **Do not emit `telephone`** (no phone numbers in visible text or structured data — use `potentialAction` with WhatsApp `url` instead).
  - `priceRange: "RM"` + `openingHoursSpecification: 24/7` (matches "24 Jam" brand).

- **BreadcrumbList (location + blog post):** array of `ListItem` with `position`, `name`, `item` (absolute URL).

- **FAQPage (homepage + every location page):**
  - 6–10 Q&A pairs. Homepage FAQ = generic + nationwide. Location FAQ must include ≥3 unique location-specific questions (e.g. "Adakah penghantaran 24 jam tersedia di {city}?", "Berapa kos sewa di {state}?").

- **BlogPosting (every blog post):** `headline`, `description`, `image`, `datePublished`, `dateModified`, `author: Organization`, `publisher: Organization`, `mainEntityOfPage`.

### 6.3 What NOT to emit

- No `Product` `aggregateRating` / `review` unless real reviews exist in Supabase — never fabricate.
- No `telephone` field anywhere (enforced by "no contact info in visible text" rule).
- No `MedicalWebPage` schema — it requires health-claims vetting; stick to `MedicalBusiness`.

---

## 7. Sitemap & robots

### 7.1 `sitemap.xml` (generated by `app/sitemap.ts`)

Must enumerate **486 + 3N** URLs × hreflang alternates. Entry shape per URL:

```
<url>
  <loc>https://katilhospital-24jam.vercel.app/ms/katil-hospital/kuala-lumpur</loc>
  <xhtml:link rel="alternate" hreflang="ms-MY"     href=".../ms/…" />
  <xhtml:link rel="alternate" hreflang="en-MY"     href=".../en/…" />
  <xhtml:link rel="alternate" hreflang="zh-CN"     href=".../zh/…" />
  <xhtml:link rel="alternate" hreflang="x-default" href=".../ms/…" />
  <lastmod>{ISR-updated-at}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
```

Priority tiers:

| Page type | Priority |
|---|---|
| Homepage (`/ms`) | `1.0` |
| Homepage (`/en`, `/zh`) | `0.9` |
| Tier-1 location pages (11 featured cities × 3 locales) | `0.8` |
| Other location pages (148 × 3 locales) | `0.7` |
| Blog listing | `0.6` |
| Blog post | `0.6` |

**Excluded from sitemap:**
- `/{locale}/redirect-whatsapp-1` — passthrough only. Must also carry `robots: noindex,nofollow`.

### 7.2 `robots.txt` (generated by `app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*/redirect-whatsapp-1
Sitemap: https://katilhospital-24jam.vercel.app/sitemap.xml
```

Additional safety: `app/[locale]/redirect-whatsapp-1/page.tsx` sets `export const metadata = { robots: { index: false, follow: false } }`.

---

## 8. Content Uniqueness Rules

Google penalises thin / duplicated location pages. For 477 pages (159 × 3) this is the single biggest risk. Non-negotiable rules for Nana:

1. **Unique intro paragraph per city** — must mention the city by name in the first sentence AND reference ≥1 of: notable local hospital (e.g. Hospital Kuala Lumpur, Hospital Sultanah Aminah, Hospital Queen Elizabeth), local neighbourhood, or landmark. Use the provided `{city}`-specific fact bank — do NOT reuse boilerplate.
2. **Unique FAQ per city** — 6 Q&A pairs; 3 shared + 3 location-specific. Shared templates Nana may reuse: "Berapa lama penghantaran ke {city}?", "Boleh sewa bulanan di {city}?", "Adakah setup percuma di {city}?". Location-specific questions must reference a real local angle (nearby hospital, district council area, distance to KL, common local conditions).
3. **Unique meta description** — use the rotating `{usp}` token (§2.2) so no two cities share the same 155-char string. Kimmy lints for duplicate `<meta name="description">` in `app/sitemap.ts` CI output.
4. **Unique H2** — within MS locale, vary the subtitle suffix by state so "{state}" placeholders actually differ across the 159 pages. (14 state-specific variants × 11 subtitle permutations = 154 unique strings — sufficient to avoid patterned duplication.)
5. **Unique Nearby Locations block** — 6 different neighbours per page (by definition, since neighbours differ by state).
6. **No boilerplate copy blocks >2 sentences long may appear verbatim on >5 pages.** Nana paraphrases.
7. **Translations (EN + ZH) copy the MS uniqueness** — same intro angle per city, translated. Do not write fresh EN / ZH intros independently, or they'll diverge from MS and confuse hreflang crawlers.
8. **Image alt text** includes the city: `{Product Name} di {city}` (MS) / `{Product Name} in {city}` (EN) / `{city} {Product Name}` (ZH). Never copy-paste alt text across cities.

---

## 9. Tracking / Conversion Events

Aligns with `architecture.md` §7 Tracking block. Kimmy wires these via the Utopia Webcore `window.uwc` global.

| Event | Label | Trigger | Pages |
|---|---|---|---|
| `click` | `whatsapp-60174287801` | Every WhatsApp CTA press (nav, hero, inline, FAB, final CTA, blog banner) | All pages |
| `click` | `whatsapp-60174287801-{loc-slug}` | WhatsApp CTA press on location page (append `?loc={slug}` in the URL) | Location pages only |
| `impression` | `product-{slug}` | One-shot `IntersectionObserver` per product card (disconnect after first fire) | Homepage + location pages |
| `click` | `blog-{slug}` | Blog-listing card click | Blog listing |
| `click` | `blog-cta-{slug}` | End-of-post WhatsApp CTA click | Every blog post |
| `pageview` | (auto from `t.js`) | Every route change | All pages |

**`data-website="katilhospital-24jam.vercel.app"`** — must match the Vercel domain exactly. Any mismatch silently drops events. Verify with `curl -I` post-deploy.

---

## 10. Risks / Gaps

1. **Malay diacritics in slugs — avoid.** `locations.ts` already uses ASCII kebab-case (e.g. `alor-setar`, not `alor-setár`). Rule: any future city additions must be ASCII-only. Lint slugs via `/^[a-z0-9-]+$/`.
2. **City names with spaces / parentheses** — handled: `Simpang Empat (Perlis)` → `simpang-empat-perlis`. Keep parentheses out of slugs (they break URL parsers and share-link previews).
3. **Slug collision across states** — `locations.ts` already disambiguated `Simpang Empat (Perlis)` from `Simpang Ampat (Penang)` via different spellings. Any new duplicate slug must append the state (e.g. `kulim-kedah`).
4. **Medical-equipment SEO traps in MY:**
   - Google may treat aggressive "murah" / "sale" headlines on medical items as YMYL-sensitive. Counter: lean on brand trust signals (SSM registration via Ibnu Sina Care is **NOT visible on site per contact-info rule** — instead reference "syarikat berdaftar" without showing the number).
   - Do not use clinical / medical claims ("sembuh", "rawatan", "cure", "treatment"). Stay in rental + equipment vocabulary.
   - Photos of identifiable patients require consent. Customer gallery = WhatsApp screenshots (already consented) and Google review cards only. No third-party patient photos.
5. **ZH search volume is low for this niche.** ZH pages may take 3–6 months to index meaningfully. Expected — don't over-optimise; keep them present for brand coverage + hreflang compliance.
6. **Locale cannibalisation.** With `ms` as default + `en` + `zh` all indexable, Googlebot may occasionally serve EN to MY users. hreflang tags mitigate — but also set `openGraph.locale` correctly and add `lang="ms"` / `lang="en"` / `lang="zh"` on `<html>` per route.
7. **`katil hospital 24 jam` brand trademark collision** — the reference site `katilhospital24jam.my` belongs to a real MY competitor. This project's domain is `.vercel.app`, not the MY domain. Do not copy their copy verbatim; use only the layout inspiration per brief. Avoid trademark-infringing claims (e.g. "the original 24 Jam").
8. **Sitemap churn.** Every blog post + every product change triggers sitemap regeneration (ISR). Keep `changefreq` conservative (`weekly`) so Google doesn't over-crawl.
9. **`getNearbyLocations` returns only 4** in the current helper. Plan mandates 6. Kimmy must either (a) upgrade the helper to 6, or (b) pad with adjacent-state peers. Flag to Kimmy.
10. **Duplicate meta on 477 pages is the single biggest ship-blocker.** Nana must run a duplicate-description lint before handoff: hash every meta description and fail if any hash has count > 1.

---

## Handoff summary

- **Nana (copywriter):** write MS homepage + 159 MS location-page copies using the §1 + §2 + §8 templates. Ensure unique intro + FAQ + description per city. Translate MS → EN then MS → ZH.
- **Kimmy (tech):** implement §3 hreflang wiring, §6 schema, §7 sitemap/robots, §9 tracking, and fix the `getNearbyLocations` → 6 requirement.
- **Hanabi (blog):** produce ≥10 posts per locale from the §1 Tier-4 pool; each post hits Ring E (2 product + 1 location links + WA CTA banner).
- **Layla (QA):** pre-deploy lint — H1 == 1 + H2 == 1 on every page; meta-description uniqueness on all 486 routes; sitemap emits all canonical URLs; `/redirect-whatsapp-1` is `noindex` + absent from sitemap.

**End of SEO plan.** Proceed to Nana.
