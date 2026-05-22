# Wall Panel Malaysia — System Architecture

**Owner Company:** Encik Beku Aircond Sdn. Bhd. (`16e62068-365d-4907-b7f0-763a173d8afa`)
**Brand:** Wall Panel Malaysia
**Domain:** `wall-panel-malaysia.vercel.app`
**Tagline:** Premium Wall Panel Installation Across Malaysia
**Target country:** Malaysia (nationwide)
**Languages:** English (`en`, default + `x-default`), Bahasa Melayu (`ms`), Mandarin Chinese (`zh`)
**Product URL slug:** `wall-panel`
**Leads mode:** `single` — one default WhatsApp number `601116655300`
**CTA model:** WhatsApp-only — every CTA links to `/[locale]/redirect-whatsapp-1?loc={slug}`
**Deployment:** Vercel
**Architect:** Alpha
**Date:** 2026-05-11

---

## 1. Folder & Routing Structure

### Next.js App Router — complete folder tree

```
projects/wall-panel-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                          # PROVIDER SHELL ONLY — no header/footer chrome
│   │   ├── page.tsx                            # Homepage (owns its own InlineHeader + InlineFooter)
│   │   ├── HomePageClient.tsx                  # Client-side interactions (countdown, observers)
│   │   ├── wall-panel/
│   │   │   └── [location]/
│   │   │       ├── page.tsx                    # Location page (SSR + generateStaticParams)
│   │   │       └── LocationPageClient.tsx      # Client-side interactions
│   │   ├── blog/
│   │   │   ├── page.tsx                        # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx                    # Individual blog post
│   │   ├── redirect-whatsapp-1/
│   │   │   ├── page.tsx                        # Server: resolves phone via webcore
│   │   │   └── RedirectClient.tsx              # Client: window.location.href = wa.me/...
│   │   └── not-found.tsx
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts                        # Webcore webhook: validates x-webcore-secret, calls revalidateTag()
│   ├── layout.tsx                              # Root <html> shell + global font + tracking script
│   ├── globals.css                             # Tailwind v4 base + brand tokens + .blog-content rules + .eyebrow
│   ├── icon.svg                                # Favicon — SAME icon used inside the Wall Panel Malaysia logo
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── sections/
│   │   ├── FomoBanner.tsx                      # Sticky countdown promo strip — top of every page
│   │   ├── InlineHeader.tsx                    # Imported per-page (NOT in layout.tsx)
│   │   ├── InlineFooter.tsx                    # Imported per-page (NOT in layout.tsx)
│   │   ├── HeroSection.tsx                     # H1 + H2 + WhatsApp CTA + hero image
│   │   ├── UspBar.tsx                          # 3-point USP strip (mandatory below hero)
│   │   ├── ProductGrid.tsx                     # Dynamic — fed by getProducts() from webcore
│   │   ├── PromoPricingSection.tsx             # Market vs Our vs Promo price anchor
│   │   ├── StyleGallery.tsx                    # Wood / Fluted / PVC / Acoustic / Marble visuals
│   │   ├── ProcessSection.tsx                  # How it works (Survey → Quote → Install)
│   │   ├── UseCaseSplit.tsx                    # Home owner vs Office owner side-by-side
│   │   ├── TrustSection.tsx                    # Free installation, warranty, technicians
│   │   ├── CustomerGallery.tsx                 # Completed installs masonry
│   │   ├── FaqSection.tsx                      # FAQ accordion
│   │   ├── FinalCta.tsx                        # Dark/image-bg CTA with 3 trust tags
│   │   └── LocationCloud.tsx                   # Homepage → all location pages
│   ├── location/
│   │   ├── LocationHero.tsx                    # Location-specific H1 + intro
│   │   ├── LocationIntro.tsx                   # Unique location intro paragraph
│   │   ├── LocationFaq.tsx                     # 5 location-specific Q&A
│   │   ├── Breadcrumbs.tsx                     # Home › Wall Panel › {Location}
│   │   └── NearbyLocations.tsx                 # 4–6 neighbours (internal linking)
│   ├── blog/
│   │   ├── BlogNav.tsx
│   │   ├── BlogFooter.tsx
│   │   ├── BlogCard.tsx
│   │   ├── BlogCtaBanner.tsx                   # WhatsApp green CTA banner inside articles
│   │   └── TableOfContents.tsx
│   ├── ui/
│   │   ├── WhatsAppButton.tsx                  # Always #25D366, links to redirect-whatsapp-1?loc=...
│   │   ├── ProductCard.tsx                     # object-fit: contain, "Free Installation" badge
│   │   ├── PriceTag.tsx                        # Market / Our / Promo display
│   │   ├── Eyebrow.tsx                         # ALL-CAPS mono label above every section heading
│   │   ├── LanguageSwitcher.tsx                # Preserves pathname when swapping locale
│   │   └── FloatingWhatsApp.tsx                # Sticky FAB on every page
│   └── schema/
│       ├── OrganizationSchema.tsx
│       ├── LocalBusinessSchema.tsx
│       ├── ProductSchema.tsx
│       ├── FaqSchema.tsx
│       ├── BreadcrumbSchema.tsx
│       └── ArticleSchema.tsx                   # For blog post pages
│
├── config/
│   ├── site.ts                                 # domain, brand, locales, fallback phone, font config
│   └── locations.ts                            # 150+ Malaysia locations + nearbyMap + region groups
│
├── i18n/
│   ├── routing.ts                              # next-intl routing definition
│   └── request.ts                              # next-intl request resolver
│
├── lib/
│   ├── webcore.ts                              # SINGLE data layer — products, phones, blog (cache-tagged)
│   ├── waRedirect.ts                           # Helper: builds /[locale]/redirect-whatsapp-1?loc=... URL
│   └── seo.ts                                  # Metadata builders, hreflang helpers
│
├── messages/
│   ├── en.json
│   ├── ms.json
│   └── zh.json
│
├── public/
│   └── og/                                     # OG image assets
│
├── brand_assets/                               # Reference image + logo + colours (already populated)
│
├── middleware.ts                               # next-intl middleware (locale detection + prefix)
├── next.config.ts                              # loadEnvConfig(cwd + '/../..') + next-intl plugin
├── postcss.config.mjs
├── tailwind.config.ts                          # Tailwind v4 — brand tokens
├── global.d.ts                                 # declare window.uwc tracking type
├── tsconfig.json
├── package.json
├── screenshot.mjs
├── serve.mjs
└── .env.local → ../../.env.local               # Symlink to shared Supabase credentials
```

### Route table

| Route | Purpose | Caching |
|---|---|---|
| `/` | Middleware redirect → `/en` (or detected locale) | n/a |
| `/[locale]` | Homepage (3 variants: `/en`, `/ms`, `/zh`) | SSG + tag-based revalidation |
| `/[locale]/wall-panel/[location]` | Location page (150+ × 3 locales) | SSG + tag-based revalidation |
| `/[locale]/blog` | Blog listing | SSG + tag-based revalidation |
| `/[locale]/blog/[slug]` | Blog post | SSG + tag-based revalidation |
| `/[locale]/redirect-whatsapp-1?loc={slug}` | Server-side WA redirect | `dynamic = 'force-dynamic'` + `revalidate = 0` |
| `/api/revalidate` | Webcore webhook receiver (POST) | dynamic route handler |
| `/sitemap.xml` | All indexable URLs in all locales | regenerated on tag invalidation |
| `/robots.txt` | Allow all + sitemap reference | static |

### Layout-ownership rule (HARD RULE)

`app/[locale]/layout.tsx` is a **provider shell only**: it sets `<html lang>`, loads the global font (Inter), injects the tracking script in `<head>`, wraps children in `NextIntlClientProvider`, mounts `OrganizationSchema`, and renders `{children}`. It **MUST NOT** render any header, navigation, footer, FOMO banner, or floating CTA.

Every page (`page.tsx`) imports `FomoBanner` + `InlineHeader` at the top of its return tree and `InlineFooter` + `FloatingWhatsApp` at the bottom. This prevents the duplicate-chrome bug that has hit past projects when chrome was shared in the layout.

---

## 2. Page Inventory

### Pages built

| Page | Route | Per locale | Count |
|---|---|---|---|
| Homepage | `/[locale]` | 1 | 3 |
| Location pages | `/[locale]/wall-panel/[location]` | 150+ | 450+ |
| Blog listing | `/[locale]/blog` | 1 | 3 |
| Blog post | `/[locale]/blog/[slug]` | 10+ | 30+ |
| WhatsApp redirect | `/[locale]/redirect-whatsapp-1` | 1 | 3 (dynamic handler) |
| API — revalidate | `/api/revalidate` | — | 1 (no locale) |
| sitemap.xml | `/sitemap.xml` | — | 1 |
| robots.txt | `/robots.txt` | — | 1 |

**Total rendered pages: ~490 (3 homepages + ~450 location pages + 3 blog listings + 30+ blog posts), plus 3 dynamic redirect routes and the API route.**

### Target locations — Malaysia (150+ cities)

Mirror the proven full-coverage list from `projects/electric-wheelchair-malaysia/config/locations.ts`, extended to satisfy the CLAUDE.md rule of **10+ sub-locations per state** and a total between **150 and 180**. Final list must include all 14 state/region groupings below. Cyclops and Sora must operate on this exact list.

| State / Region | Min cities | Required slugs (seed list — expand to ≥10 each) |
|---|---|---|
| Klang Valley (KL + Selangor metro) | 25 | kuala-lumpur, petaling-jaya, shah-alam, subang-jaya, puchong, cheras, ampang, kepong, setapak, wangsa-maju, bangsar, mont-kiara, damansara, sri-petaling, bukit-jalil, cyberjaya, putrajaya, kajang, bangi, semenyih, rawang, selayang, gombak, klang, port-klang |
| Selangor (outside KV) | 10 | sepang, banting, kuala-selangor, hulu-langat, serdang, sungai-besar, sabak-bernam, kuala-kubu-bharu, jenjarom, dengkil |
| Negeri Sembilan | 10 | seremban, nilai, port-dickson, rembau, kuala-pilah, bahau, tampin, gemas, mantin, lukut |
| Melaka | 10 | melaka, ayer-keroh, alor-gajah, jasin, masjid-tanah, durian-tunggal, batu-berendam, bukit-rambai, klebang, bukit-katil |
| Johor | 10 | johor-bahru, iskandar-puteri, kulai, batu-pahat, muar, kluang, segamat, pontian, mersing, kota-tinggi |
| Perak | 10 | ipoh, taiping, teluk-intan, sitiawan, kampar, batu-gajah, lumut, parit-buntar, kuala-kangsar, tanjung-malim |
| Penang | 10 | george-town, butterworth, bukit-mertajam, nibong-tebal, bayan-lepas, balik-pulau, jelutong, gelugor, tanjung-bungah, tasek-gelugor |
| Kedah | 10 | alor-setar, sungai-petani, kulim, langkawi, jitra, kuala-kedah, baling, sik, kuah, pendang |
| Perlis | 10 | kangar, arau, padang-besar, simpang-empat, kaki-bukit, beseri, mata-ayer, sanglang, chuping, kuala-perlis |
| Kelantan | 10 | kota-bharu, pasir-mas, tanah-merah, machang, gua-musang, kuala-krai, bachok, tumpat, pasir-puteh, rantau-panjang |
| Terengganu | 10 | kuala-terengganu, kemaman, dungun, marang, besut, setiu, hulu-terengganu, jerteh, paka, kerteh |
| Pahang | 10 | kuantan, temerloh, bentong, raub, jerantut, pekan, kuala-lipis, mentakab, cameron-highlands, genting-highlands |
| Sabah | 10 | kota-kinabalu, sandakan, tawau, lahad-datu, keningau, semporna, beaufort, kudat, ranau, papar |
| Sarawak | 10 | kuching, miri, sibu, bintulu, sri-aman, sarikei, kapit, limbang, mukah, samarahan |

**Estimated total: ~155 locations.** Final exact list is locked in `config/locations.ts` and is the single source of truth for Sora (keyword map), Nana (intros + FAQs), Kimmy (hreflang + sitemap), and Layla (deployment).

### Mandatory section order — homepage AND every location page (IDENTICAL)

The homepage and every location page render the SAME sections in the SAME order. Location pages add two extra blocks at fixed insertion points (Breadcrumbs above hero; Nearby Locations above Final CTA) and replace `LocationCloud` with `NearbyLocations`. No other deviations are permitted — this is the page-parity rule.

1. **FomoBanner** (sticky, top of viewport) — red or black background, live countdown HH:MM:SS, white text, WhatsApp CTA. Translated for all 3 locales.
2. **InlineHeader** — logo, nav links (Styles, Locations, Process, Blog), language switcher, WhatsApp CTA.
3. **(Location pages only)** **Breadcrumbs** — `Home › Wall Panel › {Location}`.
4. **HeroSection** — single H1 + single H2 + WhatsApp CTA + hero image (clean modern interior with wall panel). Promo price teaser visible.
5. **UspBar** (MANDATORY 3 points) — `Free Installation Included` / `5 Premium Styles to Choose` / `Homes + Offices Nationwide`. Eyebrow + body under each.
6. **ProductGrid** — dynamic from `getProducts()` (Standard Wall Panel + Marble Wall Panel families). `object-fit: contain`. "Free Installation" badge on every card. Promo price highlighted vs market price.
7. **PromoPricingSection** — anchor-effect block showing Market Price → Our Price → Promo Price for both Standard and Marble.
8. **StyleGallery** — visual swatches for Wood / Fluted / PVC / Acoustic / Marble (Gold / Silver / Black). Each style sits under its own H3 with an eyebrow.
9. **ProcessSection** — exactly 3 steps: (1) WhatsApp us your space, (2) Free measurement + quote, (3) Installation in 3–7 days.
10. **UseCaseSplit** — Homeowner (living room / bedroom / TV feature wall) vs Office Owner (boardroom / reception / cabin) two-column.
11. **TrustSection** — Free installation included, premium materials, trained installers, warranty.
12. **CustomerGallery** — completed installations masonry. No empty grid slots — column count must divide image count evenly at every breakpoint.
13. **FaqSection** — 6–8 questions (homepage); location pages use 5 unique location-specific Q&A.
14. **(Homepage only)** **LocationCloud** — links to all 150+ location pages, grouped by state.
14b. **(Location pages only)** **NearbyLocations** — 4–6 geographically nearest neighbours from `nearbyMap`.
15. **FinalCta** — image/dark background, 3 trust tags (`Free Installation` / `Lifetime Care` / `Across Malaysia`), WhatsApp CTA.
16. **InlineFooter** — quick links, locations top-12, language switcher, legal. No phone number or domain shown as visible text.
17. **FloatingWhatsApp** — sticky FAB visible at all viewport heights.

Every section heading (H3–H6) must have an `.eyebrow` ALL-CAPS mono label directly above it (e.g. `UNIT CATALOGUE`, `PROCESS`, `LIVE NOW`). Hero H1 + H2 are the only headings without an eyebrow.

---

## 3. Data Flow — Webcore Layer (CRITICAL)

Every read in this project — products, phone numbers, blog posts — goes through **`lib/webcore.ts`** using `fetch()` against the Supabase REST API with Next.js cache tags. This is the ONLY supported pattern. There is NO `lib/supabase.ts`, NO `lib/getProducts.ts`, NO `lib/getPhoneNumber.ts`, and NO `lib/getBlogPosts.ts` in this project.

### `lib/webcore.ts` exports

```
getProducts()         → { core: Product[]; additional: Product[] }   tag: 'webcore-products'
getPhoneNumber(loc?)  → { phone, whatsappText, label }                tag: 'webcore-phones'
waLink(phone, text)   → 'https://wa.me/{phone}?text={text}'           (pure helper)
getWhatsAppLink(loc?) → '/[locale]/redirect-whatsapp-1?loc={loc}'     (pure helper)
getBlogPosts(locale)  → BlogPostSummary[]                             tag: 'webcore-blog'
getBlogPost(slug,loc) → BlogPostFull | null                           tag: 'webcore-blog'
```

Each `fetch()` call inside webcore MUST pass `{ next: { tags: ['webcore-products' | 'webcore-phones' | 'webcore-blog'] } }`. Reference implementation: `projects/tablechair-rental-malaysia/lib/webcore.ts`.

### Cache invalidation — tag-based only

- **No `export const revalidate = N`** on any page or layout. Time-based ISR is forbidden by CLAUDE.md.
- The webcore admin sends a webhook POST to `/api/revalidate` after every product / phone / blog mutation.
- `app/api/revalidate/route.ts` validates the `x-webcore-secret` header against the `WEBCORE_REVALIDATE_SECRET` env var, then calls `revalidateTag()` for each tag in the JSON body.
- **Sole exception:** `app/[locale]/redirect-whatsapp-1/page.tsx` sets `export const dynamic = 'force-dynamic'` and `export const revalidate = 0` because it must re-execute on every click to honour leads-mode rotation.

### Phone number flow (leads_mode = `single`)

1. User clicks any WhatsApp CTA → navigates to `/[locale]/redirect-whatsapp-1?loc={slug}` (homepage uses `loc=all`; each location page passes its own slug).
2. Server component calls `getPhoneNumber(loc)` from webcore.
3. Webcore reads the HTTP host header → `wall-panel-malaysia.vercel.app`.
4. Fetches `leads_mode` from `company_websites` where `domain = host` → `'single'`.
5. Fetches all active rows from `phone_numbers` where `website = host` and `is_active = true`.
6. `single` mode logic: return the first row (ordered with `label = 'default'` first) → `60 111 6655 300`.
7. Builds `https://wa.me/{phone}?text={encodeURIComponent(whatsapp_text)}`.
8. `RedirectClient` runs `window.location.href = url` to send the user to WhatsApp.

The full 4-mode logic (`single` / `rotation` / `location` / `hybrid` with weighted percentage selection) is preserved in `getPhoneNumber()` even though this project only uses `single` — so the owner can switch modes later in the admin without code changes.

### Translation flow (next-intl)

- `messages/{en,ms,zh}.json` loaded by `i18n/request.ts` per request.
- Location-specific copy (intros + 5-question FAQ per location) lives under `locations.{slug}.{intro|faq}` in each JSON file.
- Locale detection order: URL path → `NEXT_LOCALE` cookie → `Accept-Language` header → default `en`.
- Language switcher swaps only the `/en`, `/ms`, `/zh` prefix while preserving the rest of the pathname.

### Static generation

- All homepages (3) and all location pages (~450) are SSG via `generateStaticParams()` returning every `{locale, location}` combination from `config/locations.ts`.
- Blog listing and blog posts SSG over `{locale, slug}` returned from `getBlogPosts()` at build time, then refreshed via `revalidateTag('webcore-blog')`.
- The redirect handler is dynamic; the `/api/revalidate` route is dynamic.

### Tracking (mandatory)

- Tracking script lives in the root `<head>` (rendered from `app/[locale]/layout.tsx`):
  ```html
  <script defer src="https://webcore.utopiaai.my/t.js" data-website="wall-panel-malaysia.vercel.app"></script>
  ```
- `global.d.ts` declares `window.uwc(eventType, { label })`.
- Fire `window.uwc('click', { label: 'whatsapp-{phone}' })` on every WhatsApp CTA click.
- Fire `window.uwc('impression', { label: 'product-{slug}' })` once per product card via IntersectionObserver.
- Fire `window.uwc('click', { label: 'blog-{slug}' })` on blog listing card clicks.

---

## 4. Database Requirements (handoff to Cyclops)

Cyclops operates on the **shared Supabase instance**. Do NOT create a new Supabase project. Symlink `.env.local` from the repo root and add `loadEnvConfig(cwd + '/../..')` in `next.config.ts`. Vercel must receive `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `WEBCORE_REVALIDATE_SECRET` as env vars for production.

### Existing shared tables (DO NOT recreate)

Cyclops should verify these tables exist and seed rows for this domain only:

- **`products`** — `id`, `website`, `parent_id`, `name`, `slug`, `description`, `sale_price`, `rental_price`, `sort_order`, `is_active`
- **`product_photos`** — `product_id` (FK → products), `url`
- **`phone_numbers`** — `website`, `location_slug`, `phone_number`, `whatsapp_text`, `percentage`, `label`, `type`, `is_active`
- **`company_websites`** — `company_id`, `domain`, `leads_mode`
- **`blog_posts`** — `slug`, `website`, `cover_image_url`, `status`, `published_at`
- **`blog_translations`** — `post_id` (FK), `locale`, `title`, `content`, `excerpt`, `meta_title`, `meta_description`

### Rows Cyclops must seed for this project

1. **`company_websites`** — one row:
   - `company_id = '16e62068-365d-4907-b7f0-763a173d8afa'` (Encik Beku Aircond Sdn. Bhd.)
   - `domain = 'wall-panel-malaysia.vercel.app'`
   - `leads_mode = 'single'`

2. **`phone_numbers`** — one default row:
   - `website = 'wall-panel-malaysia.vercel.app'`
   - `location_slug = 'all'` (string, NOT null — that is the default-row convention)
   - `phone_number = '601116655300'`
   - `whatsapp_text = 'Hi Wall Panel Malaysia, saya berminat dengan wall panel installation...'`
   - `percentage = 100`
   - `label = 'default'`
   - `type = 'default'`
   - `is_active = true`

3. **`products`** — two parent products + 7 variant children (or 9 standalone rows — Cyclops' final call):
   - **Standard Wall Panel** — variants: Wood, Fluted, PVC, Acoustic (market RM50/sqft, our RM30/sqft, promo from RM25/sqft)
   - **Marble Wall Panel** — variants: Gold, Silver, Black (market RM48/sqft, our RM48/sqft, promo from RM38/sqft)
   - Every product row: `website = 'wall-panel-malaysia.vercel.app'`, `is_active = true`, `sort_order` ascending, descriptive `description` field, `sale_price` storing the promo price in sen/cents or as a numeric per CLAUDE.md's existing convention (Cyclops to confirm with prior projects).
   - `rental_price` may be null (this is a sale/install business, not rental — confirm with Cyclops whether to store the per-sqft price in `sale_price`).

4. **`product_photos`** — at least one photo per product (multiple per Standard / Marble parent). URLs from `images.pexels.com` / `images.unsplash.com` showing real wall panel installations (no watermarks, no placeholders).

5. **`blog_posts` + `blog_translations`** — Hanabi populates after Gate 1; Cyclops just needs to confirm the tables accept this domain.

### Schema notes

- `phone_numbers` uses `website` (NOT `website_slug`). Default row uses `location_slug = 'all'` (string).
- RLS: public SELECT on `products`, `product_photos`, `phone_numbers`, `company_websites`, `blog_posts`, `blog_translations` (read-only for the anon key).
- No new tables, no schema changes — just inserts.

Cyclops' deliverable: a single `database.md` with seed SQL and verification queries.

---

## 5. SEO Structure (handoff to Sora)

### Primary keyword clusters

- **EN:** "wall panel Malaysia", "wall panel installation Malaysia", "wood wall panel KL", "marble wall panel Selangor", "fluted wall panel office", "PVC wall panel home", "acoustic wall panel"
- **MS:** "pemasangan wall panel Malaysia", "panel dinding kayu", "panel dinding marmar", "wall panel rumah {bandar}", "wall panel pejabat {bandar}"
- **ZH:** "马来西亚墙板安装", "木纹墙板", "大理石墙板", "{城市}墙板", "办公室墙板"

### Long-tail per location

`{style} wall panel {city}` and `wall panel installer {city}` patterns — Sora must produce the full keyword × location matrix (5 styles × ~155 locations × 3 locales ≈ 2,300 long-tail targets).

### Page hierarchy — hub-and-spoke

```
/[locale]                                ← hub (national keywords)
└── /[locale]/wall-panel/[location]      ← 155 spokes per locale (city-specific)
/[locale]/blog                           ← editorial hub
└── /[locale]/blog/[slug]                ← 10+ articles per locale
```

No intermediate `/wall-panel` index page — homepage IS the product hub.

### Internal linking

- Homepage → all 155 location pages (via `LocationCloud`, grouped by state).
- Each location page → 4–6 nearest neighbours (via `NearbyLocations` + `config/locations.ts → nearbyMap`).
- Footer → top 12 locations (KL, PJ, Shah Alam, JB, Penang, Ipoh, Seremban, Melaka, Kuantan, Kota Bharu, KK, Kuching).
- Blog articles → link back to relevant product anchors + 1–2 location pages each.

### hreflang

Every page emits three `hreflang` tags plus `x-default`:
- `en` → `/en/...`
- `ms` → `/ms/...`
- `zh` → `/zh/...`
- `x-default` → `/en/...`

### Schema markup

- **Homepage:** `Organization`, `LocalBusiness`, `WebSite` (with `SearchAction`), `BreadcrumbList`, `Product` (for each parent product), `FAQPage`.
- **Location pages:** `LocalBusiness` with `areaServed = {city}`, `BreadcrumbList`, `FAQPage`, `Product` (×2 parents).
- **Blog post pages:** `Article` (with author / datePublished / image), `BreadcrumbList`.
- **Blog listing:** `Blog` / `CollectionPage` + `BreadcrumbList`.

### Per-page heading & meta requirements

- Exactly one `<h1>` (hero title) and exactly one `<h2>` (hero subtitle) per page. Every other heading is `<h3>`–`<h6>`.
- Keyword-bearing subheadings (style names, location names, intent phrases) must sit in `<h3>` or `<h4>` on landing pages and `<h2>`–`<h4>` on blog posts. Never `<h5>` or `<h6>` for keywords.
- Unique meta title + meta description per locale × per location (≈ 465 unique pairs for location pages, plus 3 homepages, 3 blog listings, 30+ blog posts).
- Image alt text on every image, referencing the product style + location where relevant.
- Canonical tag pointing to the locale-prefixed URL.

Sora's deliverable: `seo-plan.md` with the keyword × location matrix, internal-link adjacency list, hreflang table, and meta-title/description patterns per page type per locale.

---

## 6. i18n Requirements (handoff to Kimmy)

### Confirmed locales — already locked

| Language | Code | URL prefix | Default? |
|---|---|---|---|
| English | `en` | `/en` | yes (also `x-default`) |
| Bahasa Melayu | `ms` | `/ms` | — |
| Mandarin Chinese (Simplified) | `zh` | `/zh` | — |

### Implementation

- **Library:** `next-intl` v4.
- **Routing strategy:** `localePrefix: 'always'` — every URL is locale-prefixed; no bare `/` pages.
- **Detection order:** URL path → `NEXT_LOCALE` cookie → `Accept-Language` header → default `en`.
- **Middleware:** `middleware.ts` uses `createMiddleware(routing)` with matcher `['/((?!api|_next|_vercel|.*\\..*).*)']` so `/api/revalidate` is excluded from locale rewriting.
- **Font:** Inter loaded once globally in the root `app/layout.tsx` via `next/font/google`. No serif fallback. (Body uses Inter; display headings may use the same Inter at heavier weights with tighter tracking — Kagura confirms in `design-direction.md`.)

### Translation scope

- UI chrome: header, nav, footer, language switcher, buttons, form placeholders, FOMO banner copy + countdown labels.
- Hero H1 + H2 + sub-paragraph + CTA per locale.
- USP bar (3 points × 3 locales).
- Product names + variant labels + price labels ("Market Price", "Our Price", "Promo Price From", "Free Installation").
- Style gallery copy (Wood / Fluted / PVC / Acoustic / Marble Gold / Marble Silver / Marble Black).
- Process section (3 steps × 3 locales).
- Use-case split (Homeowner / Office Owner copy × 3 locales).
- Trust section bullets.
- FAQ — homepage (6–8 Q&A × 3 locales) + per-location (5 Q&A × ~155 locations × 3 locales = ~2,325 entries).
- Location-specific intro paragraph (~155 × 3 = ~465 unique intros).
- Footer copy + legal + locations list.
- Meta title + meta description per page per locale.
- WhatsApp pre-filled message variants per locale (default + per-location optional).

### Language switcher

- Present in both `InlineHeader` and `InlineFooter`.
- Preserves current pathname when swapping locale (e.g. `/ms/wall-panel/shah-alam` → `/zh/wall-panel/shah-alam`).
- Visible on every page including the redirect page and blog.

### Fallbacks

- Missing keys fall back to `en`.
- Sora confirms Mandarin is Simplified (`zh` = `zh-Hans`) — no Traditional variant.

Kimmy's deliverable: full metadata builders, JSON-LD schema components, hreflang on every page, the language switcher, the `/api/revalidate` route handler, and the WhatsApp redirect page/handler — all per `technical-seo-i18n.md`.

---

## 7. Technical Decisions

| Area | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG + tag-based revalidation, server components, nested layouts |
| Styling | Tailwind CSS v4 | Utility-first, custom brand tokens, mobile-first |
| i18n | next-intl v4 | Best App Router support, path-based locale prefix |
| DB | Shared Supabase (multi-tenant via `website` column) | Single source of truth across 18+ websites |
| Data layer | `lib/webcore.ts` (fetch + cache tags) ONLY | Required by CLAUDE.md; the Supabase JS client breaks cache invalidation |
| Cache invalidation | `revalidateTag()` via `/api/revalidate` webhook | Forbidden: time-based `revalidate = N` |
| Deployment | Vercel | Native Next.js + parity with shared `.env.local` |
| CTA | WhatsApp-only via `/[locale]/redirect-whatsapp-1?loc={slug}` | Webcore resolves phone by host + leads_mode per click |
| Font | Inter (Google) — global | Modern sans, clean — matches the premium-but-approachable brand direction |
| Tracking | Utopia Webcore Tracking via `webcore.utopiaai.my/t.js` | `data-website="wall-panel-malaysia.vercel.app"` MUST match deployed domain |

### Key architectural decisions

1. **Shared DB, never a new Supabase project.** Symlink `.env.local`, load env from repo root in `next.config.ts`, mirror env vars on Vercel for production.
2. **Single data layer — `lib/webcore.ts`.** No `lib/supabase.ts`, no `lib/getProducts.ts`, no `lib/getPhoneNumber.ts`, no `lib/getBlogPosts.ts`. All reads go through webcore with tags `webcore-products`, `webcore-phones`, `webcore-blog`. Webcore admin invalidates on writes.
3. **Tag-based revalidation only.** Zero `export const revalidate = N` anywhere except `redirect-whatsapp-1/page.tsx` (which uses `dynamic = 'force-dynamic'` and `revalidate = 0`).
4. **`/api/revalidate` route handler.** Validates `x-webcore-secret` against `WEBCORE_REVALIDATE_SECRET` env var; calls `revalidateTag()` for each tag in body. `WEBCORE_REVALIDATE_SECRET` MUST be set in Vercel before deploy, and the same secret must be configured in the webcore admin's Integrations panel pointing at `https://wall-panel-malaysia.vercel.app/api/revalidate`. Site must be redeployed once after the env var is added.
5. **Layout owns no chrome.** `app/[locale]/layout.tsx` is a provider shell only. Each page renders its own `FomoBanner` + `InlineHeader` + `InlineFooter` + `FloatingWhatsApp`.
6. **Page parity is mandatory.** Homepage and every location page share the identical section order (see Section 2). Location pages insert `Breadcrumbs` above hero and replace `LocationCloud` with `NearbyLocations`. No other deviations.
7. **One H1 and one H2 per page.** H1 = hero title. H2 = hero subtitle. Both belong to the hero. Everything else is H3–H6. Keyword-bearing subheadings are H3/H4 only.
8. **3-point USP bar directly below the hero.** Mandatory on homepage and every location page.
9. **No phone numbers or domain text visible on the site.** All contact flows through the WhatsApp redirect. The phone number lives in Supabase only.
10. **Mobile-first center-aligned design.** Headings, buttons, icons, and stand-alone elements are centered on mobile. Body copy may be left-aligned. Re-screenshot mobile before marking design complete.
11. **WhatsApp CTAs always `#25D366` (hover `#1EBE57`).** Never themed with brand navy. Applies to nav CTA, hero CTA, inline CTAs, FAB, final CTA, blog CTA banner.
12. **Same rounded button shape site-wide.** Only colour varies between primary / secondary / WhatsApp variants.
13. **FOMO banner mandatory.** Red or black background, live countdown timer (HH:MM:SS), white text. Sticky at top of first viewport. Translated for all locales.
14. **Section eyebrow tags mandatory.** Every section heading (H3–H6) has an ALL-CAPS mono `.eyebrow` label directly above it. Hero H1/H2 are the only exception.
15. **Product card images `object-fit: contain` with internal padding.** Never `cover`. The entire wall panel sample must be visible.
16. **"Free Installation" badge** on every product card (project-specific requirement from inputs).
17. **Promo price anchored against market price.** Display strikethrough market price next to bold promo price — visible on cards, on the dedicated `PromoPricingSection`, and inside FAQ answers about pricing.
18. **Customer gallery grid — no empty slots.** Pick a column count that divides image count evenly at every breakpoint, or pad/trim the image list.
19. **Tracking script in `<head>` with `data-website="wall-panel-malaysia.vercel.app"` exactly.** Fired events: `click whatsapp-{phone}`, `impression product-{slug}`, `click blog-{slug}`.
20. **Logo icon = favicon.** The icon element used inside the Wall Panel Malaysia logo must be isolated and saved as `app/icon.svg` so the favicon is the same mark.
21. **Anti-generic design guardrails enforced:** custom brand palette (dark navy primary `#0E1A40`-ish + warm neutral background, never Tailwind blue/indigo), layered shadows with brand tint, gradient overlays on image backgrounds, tight tracking on display headings, generous line-height on body, `animate` only `transform` + `opacity` (never `transition-all`).
22. **Pricing always per sqft (RM).** All price displays show `RM {amount}/sqft`. Promo copy says `From RM25/sqft` for Standard and `From RM38/sqft` for Marble.

### Vercel environment variables (required before deploy)

```
NEXT_PUBLIC_SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY={anon_key}
SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
SUPABASE_ANON_KEY={anon_key}
WEBCORE_REVALIDATE_SECRET={generated_secret}
```

### Open items / notes for downstream agents

- **Cyclops:** seed `company_websites`, `phone_numbers`, and the 2 parent products (with their 7 variants) + photo URLs. Confirm whether to store per-sqft promo price in `sale_price` (likely yes, with `rental_price = null`).
- **Sora:** produce the keyword × location matrix (~2,300 long-tail targets), internal-link adjacency from `nearbyMap`, hreflang table, meta-title/description templates per page type per locale.
- **Nana:** ~155 unique location intros × 3 locales (≈ 465) + ~155 × 5 FAQ Q&A × 3 locales (≈ 2,325 entries) + homepage copy × 3 locales + product descriptions × 3 locales.
- **Kagura:** propose a unique visual direction that differentiates from past Utopia projects. Brand palette anchored on dark navy primary + warm neutral background (per inputs.md reference image). Minimalist warm interior photography (beige sofa on wood / marble panel backdrop). Asymmetric hero, layered product grid, premium-but-approachable mood. Avoid generic Tailwind blue/indigo and stock-watermarked photos.
- **Kimmy:** implement metadata, JSON-LD schema, hreflang on every page, the language switcher, `/api/revalidate` webhook handler, and the `/redirect-whatsapp-1` server page + client redirect. Tracking script + `window.uwc` declaration. `WEBCORE_REVALIDATE_SECRET` validation.
- **Hanabi:** 10+ blog posts × 3 locales after Gate 1. Topics: How wall panels transform living rooms, Wood vs PVC vs Acoustic, Marble panel design tips, Office wall panel ROI, Installation timeline, Maintenance, Acoustic benefits, Cost-per-sqft breakdown, Style trends 2026, Before/after case studies.
- **Layla:** verify the single default row exists in `phone_numbers`; verify products and photos load; verify blog posts load; verify tracking `data-website` matches the deployed domain exactly; verify `/api/revalidate` returns `200` with the correct secret and `401` without it; push to GitHub; deploy to Vercel; add the 5 env vars; report live URL.

### Blockers

None. All inputs from `inputs.md` are confirmed: company, product, slug, domain, brand name, languages (en/ms/zh), leads mode (`single`), phone (`601116655300`), pricing structure, USPs, and reference image. Proceeding to spawn Cyclops + Sora in parallel.
