# Kak Kenduri — Table & Chair Rental Malaysia — System Architecture

**Brand:** Kak Kenduri Sdn. Bhd.
**Domain:** `tablechair-rental-malaysia.vercel.app`
**Target country:** Malaysia
**Languages:** English (`en`, default), Bahasa Melayu (`ms`), Mandarin Chinese (`zh`)
**Primary product slug (URL segment):** `table-chair-rental`
**Leads mode:** `single` (one default phone: `60174287801`)
**Deployment:** Vercel
**CTA:** WhatsApp only — dynamic phone number via `/[locale]/redirect-whatsapp-1?loc={slug}`

---

## 1. Folder & Routing Structure

```
projects/tablechair-rental-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                      # Locale provider only — NO header/footer
│   │   ├── page.tsx                        # Homepage (owns its own inline header/footer)
│   │   ├── table-chair-rental/
│   │   │   └── [location]/
│   │   │       └── page.tsx                # Location page (owns its own inline header/footer)
│   │   ├── redirect-whatsapp-1/
│   │   │   └── route.ts                    # Server route: resolves phone from Supabase
│   │   └── not-found.tsx
│   ├── layout.tsx                          # Root <html> shell + Inter font
│   ├── globals.css                         # Tailwind base + custom CSS vars for brand palette
│   ├── icon.svg                            # Favicon (gold/sage KK mark)
│   ├── robots.ts
│   └── sitemap.ts                          # Homepage + 38 location pages × 3 locales
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── ServiceArea.tsx
│   │   ├── ProductGrid.tsx                 # 6 core products (chairs + tables)
│   │   ├── AdditionalRentals.tsx           # 7+ add-ons
│   │   ├── ThreeStepProcess.tsx
│   │   ├── CustomerGallery.tsx             # 24-image masonry
│   │   ├── InlineHeader.tsx                # Imported by each page (NOT in layout)
│   │   └── InlineFooter.tsx                # Imported by each page (NOT in layout)
│   ├── ui/
│   │   ├── WhatsAppButton.tsx              # Links to /[locale]/redirect-whatsapp-1?loc=...
│   │   ├── ProductCard.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── SchemaMarkup.tsx
│   └── location/
│       ├── LocationHero.tsx
│       └── LocationFAQ.tsx
├── config/
│   ├── locations.ts                        # 38 location slugs + display names + state
│   ├── products.ts                         # 6 core products + pricing tiers
│   ├── additional.ts                       # 7+ add-on rentals
│   ├── gallery.ts                          # 24 customer gallery image URLs
│   └── site.ts                             # domain, brand, colors, Inter font
├── lib/
│   ├── supabase.ts                         # Shared Supabase client (anon key)
│   ├── getPhoneNumber.ts                   # Server-only: resolve phone by host + leads_mode
│   ├── i18n.ts                             # next-intl config (en/ms/zh, default en)
│   └── schema.ts                           # JSON-LD helpers
├── messages/
│   ├── en.json
│   ├── ms.json
│   └── zh.json
├── i18n/
│   └── routing.ts                          # next-intl routing definition
├── middleware.ts                           # next-intl locale middleware
├── .env.local                              # Symlink → ../../.env.local (shared Supabase)
├── next.config.ts                          # loadEnvConfig(cwd + '/../..')
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Route Table

| Route | Purpose |
|---|---|
| `/` | Middleware redirects to `/en` (or detected locale) |
| `/[locale]` | Homepage (3 variants: `/en`, `/ms`, `/zh`) |
| `/[locale]/table-chair-rental/[location]` | Location page (38 × 3 = 114 variants) |
| `/[locale]/redirect-whatsapp-1?loc={slug}` | Server route — resolves phone + redirects to `wa.me/...` |
| `/sitemap.xml` | All indexable URLs |
| `/robots.txt` | Allow all, reference sitemap |

### Layout Ownership Rule (critical)

`app/[locale]/layout.tsx` contains ONLY the `NextIntlClientProvider` wrapper and Inter font class. It does NOT render a header, footer, nav, or any chrome. Each page (`page.tsx`) imports `InlineHeader` + `InlineFooter` from `components/sections/` and renders them directly so that each route owns its full markup tree. This is a hard rule learned from past projects.

---

## 2. Page Inventory

### Homepage — `/[locale]`
- 3 variants: `/en`, `/ms`, `/zh`
- Hero headline emphasises "Same-day delivery across Klang Valley & nationwide"
- Shows all 6 core products + add-on rentals + 24-image gallery
- Links out to all 38 location pages via the service-area section

### Location pages — `/[locale]/table-chair-rental/[location]`
- **38 locations × 3 locales = 114 pages**
- Mirror homepage section order exactly (see Section Order below)
- Unique intro paragraph + location-specific FAQ (5 questions) per page
- Dynamic phone via the shared redirect route with `loc` query param

### Redirect route — `/[locale]/redirect-whatsapp-1`
- Server route handler reads `host` header + `loc` query param
- Queries Supabase and 302-redirects to WhatsApp

### Page count
- 3 homepages
- 114 location pages
- 1 redirect handler
- **117 rendered pages + 1 route handler**

### 38 Location Slugs (final list)

```
Selangor (10):    shah-alam, petaling-jaya, subang-jaya, klang, kajang,
                  ampang, puchong, cheras, bangi, rawang
Kuala Lumpur (5): kuala-lumpur, cheras-kl, kepong, setapak, wangsa-maju
Johor (5):        johor-bahru, skudai, iskandar-puteri, pasir-gudang, kulai
N. Sembilan (3):  seremban, nilai, port-dickson
Perak (3):        ipoh, taiping, sitiawan
Penang (3):       georgetown, bayan-lepas, butterworth
Melaka (2):       melaka-city, alor-gajah
Pahang (2):       kuantan, temerloh
Kedah (2):        alor-setar, sungai-petani
Terengganu (1):   kuala-terengganu
Kelantan (1):     kota-bharu
Perlis (1):       kangar
```

### Mandatory Section Order (homepage AND every location page — IDENTICAL)

1. **FomoBanner** (MANDATORY) — urgency countdown strip at the very top: animated dot + text ("Weekend slots filling up fast...") + WhatsApp CTA. Black bg, white text, yellow dot. Must use `useTranslations()` for all text — zero hardcoded English.
2. **InlineHeader** — floating white pill nav: logo, nav links (Services, Locations, Gallery, Contact), language switcher, WhatsApp CTA button
3. **Hero** — H1, sub-headline, primary WhatsApp CTA, hero image with Google review badge
4. **USP Bar** (MANDATORY) — 3-point unique selling proposition strip below hero: Same-Day Delivery / Trusted by 8,000+ Events / Setup & Pickup Included. White bg, icon + title + subtitle per point. Must be translated for all locales.
5. **ProductGrid** — 6 core products (Standard / Banquet / Chiavari chairs + Long / Round / Cocktail tables) each with plain vs with-cover pricing
5. **AdditionalRentals** — canopy, air cooler, fan, PA system, catering, popcorn, cotton candy, couch chair, transparent canopy
6. **ThreeStepProcess** — (1) WhatsApp us, (2) Confirm + pay deposit, (3) Delivery & pickup (exactly 3 steps, per user design rule)
7. **CustomerGallery** — 24-image masonry from reference site
8. **(Location pages only)** LocationFAQ — 5 unique Q&A entries
9. **FinalCTA** (MANDATORY) — dark bg section with heading + subtitle + 3-point trust tags (e.g. "Same-day delivery", "Free setup & pickup", "No deposit needed") + WhatsApp CTA. The 3-point tags are mandatory and must be translated for all locales.
10. **InlineFooter** — contact, HQ address, quick links, social, language switcher, legal

Location pages insert the FAQ block between CustomerGallery and InlineFooter. No other section order deviations are permitted.

---

## 3. Data Flow

### Phone Number Flow (leads_mode = `single`)

1. Every WhatsApp CTA renders `<a href="/en/redirect-whatsapp-1?loc={slug}">` (homepage uses `loc=all`; location pages use their location slug).
2. The server route handler reads the HTTP `host` header → `tablechair-rental-malaysia.vercel.app`.
3. Fetches `leads_mode` from `company_websites` WHERE `domain = host` → `single`.
4. Fetches active rows from `phone_numbers` WHERE `website = host` AND `is_active = true`.
5. Single-mode logic: return the first row (ordered by `label = 'default'` first).
6. Builds `https://wa.me/{phone_number}?text={encodeURIComponent(whatsapp_text)}` and 302-redirects.

No `product_slug` column is referenced anywhere — it has been removed from the schema. `location_slug = 'all'` is the default fallback row for this single-mode project.

### Static Generation

- Homepage and all 114 location pages are statically generated.
- `generateStaticParams()` returns every `{locale, location}` combination from `config/locations.ts`.
- The redirect route is a dynamic server route (not statically generated — it must read per-request host).

### Translations (next-intl)

- Translations in `messages/{en,ms,zh}.json`.
- `next-intl` middleware handles locale detection (cookie → `Accept-Language` → default `en`) and rewrites URLs.
- Shared UI strings + per-location copy keyed by slug live under `locations.{slug}.{hero|intro|faq}`.
- Language switcher preserves the current pathname while swapping the `/en`, `/ms`, or `/zh` prefix.

### ISR / Revalidate Strategy

| Surface | `revalidate` | Reason |
|---|---|---|
| Homepage | `86400` (24h) | Copy/pricing rarely changes |
| Location pages | `3600` (1h) | Phone numbers may rotate if leads_mode changes later |
| `sitemap.ts` | `86400` (24h) | Matches location page cadence |
| Redirect route | dynamic (no cache) | Must read live host + DB on every hit |

On-demand revalidation endpoint can be added later when phone numbers are edited through the admin panel.

---

## 4. Database Requirements (handoff to Cyclops)

Cyclops operates on the **shared Supabase instance**. Do NOT create a new project. Symlink `.env.local` from the repo root and add `loadEnvConfig(cwd + '/../..')` in `next.config.ts`.

### Rows to seed

1. **`company_websites`** — one row:
   - `domain = 'tablechair-rental-malaysia.vercel.app'`
   - `leads_mode = 'single'`
   - brand metadata (name, logo URL)

2. **`phone_numbers`** — one default row (single mode):
   - `website = 'tablechair-rental-malaysia.vercel.app'`
   - `location_slug = 'all'`
   - `phone_number = '60174287801'`
   - `label = 'default'`
   - `type = 'default'`
   - `is_active = true`
   - `percentage = 100`
   - `whatsapp_text = 'Hi Kak Kenduri, saya berminat nak sewa meja dan kerusi...'` (MS default; EN/ZH variants optional)

3. **`blog_posts` / `blog_translations`** — not required for launch; Hanabi will populate later.

### Schema notes (do NOT recreate)

- `phone_numbers` columns available: `website`, `location_slug`, `phone_number`, `whatsapp_text`, `percentage`, `label`, `type`, `is_active`.
- The `product_slug` column has been removed from the schema — never query it or reference it in inserts.
- RLS: public read on `phone_numbers` and `company_websites`.

Cyclops' deliverable is a single seed SQL file with the two `INSERT`s above, plus verification queries.

---

## 5. SEO Structure (handoff to Sora)

### Primary keyword clusters

- **EN:** "table and chair rental Malaysia", "kenduri rental {city}", "wedding chair rental {city}", "event equipment rental Malaysia"
- **MS:** "sewa meja kerusi {bandar}", "sewa kerusi kenduri", "sewa khemah kenduri"
- **ZH:** "马来西亚桌椅出租", "婚宴椅子出租", "{城市}宴会桌椅租赁"
- **Long-tail:** "banquet chair rental {city}", "chiavari chair rental KL", "round table rental Shah Alam"

### Hierarchy

Flat hub-and-spoke:
```
/[locale]  ──►  /[locale]/table-chair-rental/[location]   (38 spokes per locale)
```

No intermediate `/table-chair-rental` index page — the homepage IS the hub. Internal links:
- Homepage → all 38 locations via ServiceArea grid
- Each location page → 4–6 geographically nearest neighbours
- Footer → top 6 locations (KL, PJ, Shah Alam, JB, Ipoh, Penang)

### hreflang

Every page emits three `hreflang` tags plus `x-default`:
- `en` → `/en/...`
- `ms` → `/ms/...`
- `zh` → `/zh/...`
- `x-default` → `/en/...`

### Schema markup (per page)

- Homepage: `Organization`, `LocalBusiness`, `WebSite` (with `SearchAction`), `BreadcrumbList`, `FAQPage` (optional)
- Location pages: `LocalBusiness` with `areaServed`, `BreadcrumbList`, `FAQPage`, `Product` for each of the 6 core items
- Gallery: `ImageObject` list

### Per-page requirements

- Unique meta title + meta description per locale per location (114 unique pairs)
- H1 must include location + primary keyword (e.g. "Sewa Meja & Kerusi Shah Alam — Hantar Sama Hari")
- All images have descriptive alt text referencing product + occasion
- Canonicals pointing to the locale-prefixed URL

---

## 6. i18n Requirements

### Confirmed locales

| Language | Code | URL prefix | Default? |
|---|---|---|---|
| English | `en` | `/en` | yes (x-default) |
| Bahasa Melayu | `ms` | `/ms` | — |
| Mandarin Chinese | `zh` | `/zh` | — |

### Implementation

- **Library:** `next-intl`
- **Routing strategy:** `always` — locale prefix is present on every URL (no bare `/` pages)
- **Detection order:** URL path → `NEXT_LOCALE` cookie → `Accept-Language` → default `en`
- **Middleware:** `middleware.ts` uses `next-intl/middleware` with `locales = ['en','ms','zh']` and `defaultLocale = 'en'`
- **Font:** Inter loaded once in root `app/layout.tsx` via `next/font/google` and applied globally. No serif fallback. This is a project-wide rule.

### Translation scope

- UI chrome (header, nav, footer, buttons, labels, form placeholders)
- Product names + pricing labels (plain / with cover)
- 3-step process copy
- Hero headline/sub-headline per locale
- Location-specific intro + FAQ blocks (keyed by slug under `locations.{slug}`)
- Meta titles / descriptions
- WhatsApp pre-filled message variants

### Language switcher

- Present in both header and footer
- Preserves the current pathname when swapping locale
- Example: `/ms/table-chair-rental/shah-alam` → `/zh/table-chair-rental/shah-alam`

---

## 7. Technical Decisions

| Area | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | SSG + ISR, nested layouts, server route handlers |
| Styling | Tailwind CSS v4 | Utility-first, custom brand tokens |
| Font | Inter (Google) — global | User rule: no serif anywhere |
| DB | Shared Supabase instance | Multi-tenant via `website` column |
| i18n | next-intl | Best App Router support, path-based locale |
| Deployment | Vercel | Native Next.js + env parity with shared `.env.local` |
| CTA | WhatsApp-only via `/redirect-whatsapp-1` | Server resolves phone by host + leads_mode |

### Key architectural decisions

1. **Shared DB, never a new Supabase project.** Symlink `.env.local`, load env from repo root in `next.config.ts`, add the same env vars to Vercel for production.
2. **Leads mode = `single`.** Exactly one default row in `phone_numbers` with `location_slug = 'all'`. Phone `60174287801`.
3. **No `product_slug` column.** The schema has been updated — queries use `website` + `location_slug` only.
4. **Static generation of all 117 pages.** ISR handles phone rotation if the owner later switches leads_mode.
5. **Layout owns no chrome.** `app/[locale]/layout.tsx` is a provider shell only. Each page renders its own `InlineHeader` / `InlineFooter`.
6. **Identical section order** across homepage and location pages (listed in Section 2). Location pages append FAQ between Gallery and Footer — that is the only difference.
7. **Real images from the reference site.** All product, hero, and 24 gallery images come from `static.wixstatic.com` per `reference-research.md`. No placeholder services. User has explicitly approved this.
8. **Brand palette:** gold `#E8B547`, sage `#9CB86F`, cream `#FDF8EE`, charcoal `#2A2620`, WhatsApp CTA `#25D366`. Forbidden: Tailwind default blue/indigo, flat `shadow-md`, `transition-all`, generic placeholders.
9. **3-step process only.** The booking process section must have exactly three steps (user design rule).
10. **No empty hero whitespace.** Hero must be dense — image, headline, sub-headline, price teaser, two CTAs, trust badges.
11. **Unique copy per location page.** Nana must write 38 unique intros + 38 unique 5-question FAQ sets per locale (114 total).
12. **Google review branding** on testimonials/gallery rail where social proof appears (user design rule).
13. **WhatsApp opens in new tab** (`target="_blank" rel="noopener"`) for every CTA (user design rule).
14. **Anti-generic guardrails enforced:** custom brand tokens, layered shadows with gold/sage tint, gradient overlays on hero/gallery images, tight tracking on display headings, `animate` only `transform` + `opacity`.

### Open items / notes for downstream agents

- **Cyclops:** just seed the two rows; no schema work required.
- **Sora:** produce the 38-location keyword map + internal link adjacency graph.
- **Nana:** 3 homepage copy sets + 114 unique location intros + 114 × 5 FAQs = 570 FAQ entries.
- **Kagura:** propose a visual direction that avoids the reference Wix template — same palette, but unique layout (asymmetric hero, layered product grid, masonry gallery with gold hairline dividers).
- **Kimmy:** implement metadata, JSON-LD, alt text, hreflang, language switcher, and the `/redirect-whatsapp-1` server route handler.
- **Layla:** verify the single default row exists in `phone_numbers` before production deploy.

### Blockers

None. All inputs are confirmed.
