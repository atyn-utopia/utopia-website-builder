# Katil Hospital 24 Jam — System Architecture

**Agent:** Alpha — System Architect
**Project slug:** `katilhospital-24jam`
**Domain:** `katilhospital-24jam.vercel.app`
**Company:** Ibnu Sina Care Sdn. Bhd. (`company_id = d6cc8f48-ea42-4420-b9d6-73ca63263be0`)
**Date:** 2026-04-23
**Status:** Architecture approved for Cyclops + Sora handoff.

---

## Blockers

None. Every input is confirmed in `inputs.md`. One clarification carried forward (not blocking):

- The CLAUDE.md rule requires **150–180 locations with ≥10 per state**. The reference `projects/electric-wheelchair-malaysia/config/locations.ts` currently contains only **84 locations** and therefore does NOT satisfy the rule on its own. The expanded canonical list (159 locations across 14 states, each state has ≥10) already exists at `projects/electrician-24-hour/config/locations.ts`. **Kimmy / scaffolding step MUST copy the 159-location file from `electrician-24-hour`, not the 84-location file from `electric-wheelchair-malaysia`.** State counts verified: Klang Valley 25, Perak 12, Johor 12, Selangor 10, Negeri Sembilan 10, Melaka 10, Penang 10, Kedah 10, Perlis 10, Kelantan 10, Terengganu 10, Pahang 10, Sabah 10, Sarawak 10 → total 159.

---

## 1. Folder & Routing Structure

Full Next.js 15 App Router tree for `projects/katilhospital-24jam/`:

```
projects/katilhospital-24jam/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                          ← locale shell ONLY (no header/footer — see §7)
│   │   ├── page.tsx                            ← homepage (SSR, ISR revalidate=3600)
│   │   ├── HomePageClient.tsx                  ← homepage client interactivity
│   │   ├── katil-hospital/
│   │   │   └── [location]/
│   │   │       ├── page.tsx                    ← location page (SSR, generateStaticParams)
│   │   │       └── LocationPageClient.tsx      ← location client interactivity
│   │   ├── blog/
│   │   │   ├── page.tsx                        ← blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx                    ← blog post (layout MUST match electric-wheelchair reference)
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx                        ← server page: getPhoneNumber → waLink
│   │       └── RedirectClient.tsx              ← client window.location redirect
│   ├── api/
│   │   └── phones/
│   │       └── route.ts                        ← phone API (optional diagnostic)
│   ├── globals.css                             ← global tokens + .blog-content styles
│   ├── layout.tsx                              ← root HTML shell (minimal)
│   ├── icon.svg                                ← favicon — SAME red-clock icon as logo
│   ├── robots.ts                               ← /robots.txt generator
│   └── sitemap.ts                              ← /sitemap.xml generator (all pages × 3 locales)
├── components/
│   ├── BlogNav.tsx
│   ├── BlogFooter.tsx
│   ├── LanguageSwitcher.tsx                    ← MS / EN / ZH picker
│   └── schema/
│       ├── BreadcrumbSchema.tsx
│       ├── FAQSchema.tsx
│       ├── LocalBusinessSchema.tsx
│       ├── OrganizationSchema.tsx
│       └── ProductSchema.tsx
├── config/
│   ├── site.ts                                 ← domain, brand, locales, product slug
│   └── locations.ts                            ← 159 Malaysia locations (copied from electrician-24-hour)
├── i18n/
│   ├── routing.ts                              ← locales: ['ms','en','zh'], defaultLocale: 'ms', localePrefix: 'always'
│   └── request.ts                              ← loads messages/{locale}.json
├── lib/
│   ├── supabase.ts                             ← shared Supabase client singleton
│   ├── getPhoneNumber.ts                       ← leads-mode logic (single for this project)
│   ├── getBlogPosts.ts                         ← blog queries (WEBSITE = katilhospital-24jam.vercel.app)
│   └── waRedirect.ts                           ← /{locale}/redirect-whatsapp-1 URL builder
├── messages/
│   ├── ms.json                                 ← AUTHORED FIRST (default locale)
│   ├── en.json                                 ← translated from ms
│   └── zh.json                                 ← translated from ms
├── public/
│   ├── brand_assets/                           ← images copied from projects/katilhospital-24jam/brand_assets/ for runtime
│   ├── hero/                                   ← hero photos (bed, doctor mascot)
│   ├── product/                                ← 8 SKU photos (only used as fallback; real source = Supabase)
│   ├── review/                                 ← 16 customer review screenshots for gallery
│   ├── google-review/                          ← Google Review branding (real logo, not generic stars)
│   ├── usp/                                    ← USP icon set
│   └── diagram/                                ← how-it-works step diagrams
├── brand_assets/                               ← raw asset drop-zone (not served; for designers)
├── global.d.ts                                 ← window.uwc typing for tracking
├── middleware.ts                               ← next-intl middleware
├── next.config.ts                              ← loadEnvConfig('/../..') + createNextIntlPlugin
├── package.json                                ← dev port 3015 (see collision check below)
├── postcss.config.mjs
├── tsconfig.json
└── .env.local → ../../.env.local               ← symlink to repo-root shared credentials
```

### Dev port

Port **3015** is assigned. Collision check vs sibling projects (verified from each `package.json`):

| Project | Port |
|---|---|
| admin | 3005 |
| cat-rumah-malaysia | 3010 |
| electric-wheelchair-malaysia | 3004 |
| electrician-24-hour | 3011 |
| oxihome-malaysia | 3004 (conflicts with EWM but not us) |
| roller-shutter-malaysia | 3002 |
| service-aircond-malaysia | 3002 |
| sewa-motor-malaysia | 3003 |
| hollywood-night | 3000 (default) |
| tablechair-rental-malaysia | 3000 (default) |
| **katilhospital-24jam** | **3015 (new — no collision)** |

### Favicon & logo icon rule

`app/icon.svg` MUST reuse the exact red-clock icon from the logo (see `brand_assets/logo dark.png` + `icon.svg` in the reference asset pack). Extract the clock glyph as a standalone SVG so it renders crisp at 16×16 and 32×32. Logo and favicon share one icon — no drift.

### `.env.local` symlink

`ln -sf ../../.env.local .env.local` inside the project folder. `next.config.ts` calls `loadEnvConfig(process.cwd() + '/../..')` so Supabase env vars resolve from the monorepo root for both `next dev` and `next build`.

---

## 2. Page Inventory

Every route that ships on production:

### Homepage — 3 routes (one per locale)
- `/ms` (DEFAULT locale — Bahasa Melayu)
- `/en`
- `/zh`

### Location pages — 477 routes (159 locations × 3 locales)
- `/ms/katil-hospital/[location]`
- `/en/katil-hospital/[location]`
- `/zh/katil-hospital/[location]`

`[location]` = every slug in `config/locations.ts`. Emitted via `generateStaticParams`. Every location also appears in the sitemap and the homepage "Coverage" section.

### Blog listing — 3 routes
- `/ms/blog`
- `/en/blog`
- `/zh/blog`

### Blog post — N × 3 routes
- `/ms/blog/[slug]`, `/en/blog/[slug]`, `/zh/blog/[slug]`

Slugs come from `blog_posts.slug` where `website = katilhospital-24jam.vercel.app` AND `status = 'published'`. Minimum 10 posts per locale (Hanabi).

### WhatsApp redirect — 3 routes
- `/ms/redirect-whatsapp-1` (+ optional `?loc=<slug>` query)
- `/en/redirect-whatsapp-1`
- `/zh/redirect-whatsapp-1`

### SEO endpoints — 2 routes
- `/robots.txt` — generated by `app/robots.ts`
- `/sitemap.xml` — generated by `app/sitemap.ts` (all homepages + all 477 location pages + all blog URLs in all locales)

### Total route count
3 (homepage) + 477 (location) + 3 (blog list) + 3N (blog posts) + 3 (WA redirect) + 2 (SEO) ≈ **488 + 3N** pages when N = number of blog posts.

---

## 3. Data Flow

### 3.1 Phone numbers → WhatsApp redirect (leads_mode = `single`)

1. User clicks any WhatsApp button (nav, hero, inline, FAB, final CTA, blog banner) → `waRedirect(locale, undefined, optionalLocationSlug)` returns `/{locale}/redirect-whatsapp-1?loc={slug}`.
2. Server page `app/[locale]/redirect-whatsapp-1/page.tsx` runs `export const dynamic = 'force-dynamic'`, reads `?loc=…`, calls `getPhoneNumber(loc)`.
3. `lib/getPhoneNumber.ts`:
   a. Reads HTTP `host` header → `katilhospital-24jam.vercel.app`.
   b. Looks up `company_websites.leads_mode` WHERE `domain = host` → `'single'`.
   c. Queries `phone_numbers` WHERE `website = host` AND `is_active = true`.
   d. Mode `single` returns `rows[0]` → `phone_number` + `whatsapp_text`.
4. `waLink(phone, whatsappText)` builds `https://wa.me/60174287801?text=…`.
5. `RedirectClient` (client component) runs `window.location.href = url` in `useEffect` and also tracks `window.uwc('click', { label: 'whatsapp-60174287801' })`.
6. Fallback — if Supabase unreachable: `FALLBACK_PHONE = '60174287801'`, `FALLBACK_WA_TEXT = 'Hi, saya berminat dengan perkhidmatan sewa / beli katil hospital dari Katil Hospital 24 Jam. Boleh bantu?'`.

### 3.2 Products → homepage & location grids

- Every page that shows the product grid queries `products` joined with `product_photos` WHERE `products.website = 'katilhospital-24jam.vercel.app'` AND `products.is_active = true` ORDER BY `sort_order`.
- ISR — every page sets `export const revalidate = 3600`. Editing Supabase propagates within 1 hour without redeploy.
- Adding a product in DB → appears on site automatically. Setting `is_active = false` → disappears. **No hardcoded product arrays in the frontend.** `config/products.ts` MUST NOT exist as the source of truth (acceptable only as an emergency-offline fallback).
- Grid uses CSS `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))` or an equivalent responsive column set that works with 1, 6, 8, or 20 products.

### 3.3 Location slugs → pages & sitemap

- `config/locations.ts` exports `locations: Location[]` (159 rows) + `nearbyMap: Record<slug, slug[]>`.
- `app/[locale]/katil-hospital/[location]/page.tsx` implements:
  ```ts
  export async function generateStaticParams() {
    return locations.flatMap(loc =>
      routing.locales.map(locale => ({ locale, location: loc.slug }))
    );
  }
  ```
- `app/sitemap.ts` iterates `locales × locations` and emits canonical URLs plus hreflang alternates.

### 3.4 Translations

- `next-intl` loads `messages/{ms,en,zh}.json` via `i18n/request.ts` (`getRequestConfig`).
- Copy priority: **MS authored first** (Nana). EN + ZH are translations from MS — never translated from EN.
- Middleware enforces `localePrefix: 'always'` — every URL has a locale segment (no bare `/`).

### 3.5 Revalidation summary

| Surface | Strategy | Value |
|---|---|---|
| Homepage | ISR | `revalidate = 3600` |
| Location pages | ISR + `generateStaticParams` | `revalidate = 3600` |
| Blog listing | ISR | `revalidate = 3600` |
| Blog post | ISR | `revalidate = 3600` |
| WhatsApp redirect | Dynamic | `dynamic = 'force-dynamic'` (reads live host + DB) |

---

## 4. Database Requirements (for Cyclops)

Cyclops MUST use the EXISTING shared Supabase project. **Do NOT create a new Supabase project — every website uses the single shared instance distinguished by the `website` column.** Credentials at repo-root `.env.local`, symlinked into the project.

Existing columns Cyclops must populate (verified against `lib/getPhoneNumber.ts` and `lib/getBlogPosts.ts`):

### `company_websites`
- `company_id` = `d6cc8f48-ea42-4420-b9d6-73ca63263be0` (Ibnu Sina Care Sdn. Bhd.)
- `domain` = `katilhospital-24jam.vercel.app`
- `leads_mode` = `'single'`

### `phone_numbers` (seed 1 row before deploy)
- `website` = `katilhospital-24jam.vercel.app` (NOTE: column is `website`, NOT `website_slug`)
- `location_slug` = `'all'` (string literal `'all'`, NEVER null — defaults use `'all'`)
- `phone_number` = `60174287801`
- `whatsapp_text` = MS seed copy from `inputs.md`
- `percentage` = 100
- `label` = `'default'`
- `type` = `'default'`
- `is_active` = `true`

### `products` (8 rows — Cyclops inserts during Step 10)
Columns: `website`, `parent_id` (nullable for top-level SKUs), `name`, `slug`, `description`, `sale_price`, `rental_price`, `sort_order`, `is_active`.
- `website` = `katilhospital-24jam.vercel.app` on every row
- 5 primary beds/mattresses + 3 cross-sell (oxygen / wheelchair / CPAP) — all `is_active = true`
- `sort_order` 1–8 controls grid order
- Prices and descriptions from Cyclops + Nana collaboration

### `product_photos` (N rows, FK → products.id)
- `product_id` — FK to `products.id`
- `url` — absolute CDN/hosted URL (never a relative path; never `Downloads/…`)
- Source images copied from the reference asset pack into the website's `public/product/` or hosted on Supabase Storage / Pexels — URLs only come from this table.

### `blog_posts` (Hanabi inserts ≥10 rows — Step 11)
- `slug`, `cover_image_url`, `website`, `status = 'published'`, `published_at`

### `blog_translations` (one row per post × locale, ms+en+zh)
- `post_id` FK, `locale` (or `language` — match the exact column in existing schema), `title`, `content`, `excerpt`, `meta_title`, `meta_description`

Cyclops must **verify existing schema** before inserting — do not invent columns, do not rename, do not add.

---

## 5. SEO Structure (for Sora)

Sora must produce `seo-plan.md` covering:

### Locales & hreflang
- 3 locales: `ms` (default, `hreflang="ms-MY"`), `en` (`en-MY`), `zh` (`zh-CN`).
- Every page emits `<link rel="alternate" hreflang="…" href="…" />` for all three locales + `x-default` → `/ms/…`.
- `openGraph.locale` = `ms_MY` / `en_MY` / `zh_CN`.

### Keyword tiers (MS primary — translate for EN + ZH)
- **Tier 1 (homepage H1):** "katil hospital 24 jam", "sewa katil hospital", "jual katil hospital"
- **Tier 2 (homepage H2 + USP):** "tilam hospital anti-decubitus", "katil hospital elektrik", "penghantaran 24 jam Malaysia"
- **Tier 3 (location pages):** `{tier-1 keyword} {city}` e.g. "sewa katil hospital Kuala Lumpur", "jual katil hospital Johor Bahru"
- **Tier 4 (blog):** how-to, comparison, and condition-specific long-tails ("tilam angin untuk pesakit terlantar", "beli vs sewa katil hospital", "cara pilih katil hospital elektrik")

### Page hierarchy
- Homepage → primary product landing pages (cross-linked via the dynamic product grid — each SKU could eventually get its own page, but for v1 the location page is the primary SEO template).
- Homepage → all 159 location pages (Coverage section + footer sitemap block).
- Each location page → nearby 4 locations (`nearbyMap`) + back to homepage.
- Blog listing → every blog post → WhatsApp CTA + related-post internal links.

### Internal linking rings
- Homepage → state-grouped location index → individual location pages.
- Location page → nearby locations (via `getNearbyLocations(slug)`).
- Blog posts → product grid + relevant location pages (Kimmy enforces during content injection).
- Footer includes a collapsed state-grouped location list on every page.

### Schema markup (Kimmy implements, Sora specifies which)
- `OrganizationSchema` — site-wide (in `app/[locale]/layout.tsx`)
- `ProductSchema` — homepage (one per featured SKU)
- `LocalBusinessSchema` — homepage + every location page
- `BreadcrumbSchema` — location pages + blog posts
- `FAQSchema` — homepage + every location page

---

## 6. i18n Requirements (for Kimmy)

### Confirmed locales
- **`ms`** — Bahasa Melayu — **DEFAULT** — authored first
- **`en`** — English — translated from MS
- **`zh`** — Mandarin Chinese (Simplified) — translated from MS

### `i18n/routing.ts` shape (configuration only)
- `locales: ['ms', 'en', 'zh']`
- `defaultLocale: 'ms'`
- `localePrefix: 'always'` — every URL includes a locale segment; no bare `/`

### Language switcher component spec (`components/LanguageSwitcher.tsx`)
- 3 options visible (MS / EN / ZH). Current locale highlighted.
- Swaps the leading locale segment of `usePathname()` — e.g. `/ms/katil-hospital/kuala-lumpur` → `/en/katil-hospital/kuala-lumpur`.
- Preserves query string and hash.
- Lives in the page-owned header (NOT in layout — see §7).
- Keyboard-accessible (tab focus + enter/space to select).
- Mobile-first: rendered as a compact dropdown or pill group.

### Translated meta
- `generateMetadata` per page reads `metadata.title`, `metadata.description` from the locale's message file.
- `alternates.languages` emits all three locale URLs.
- `openGraph.locale` maps `ms → ms_MY`, `en → en_MY`, `zh → zh_CN`.

### Message file sections (`messages/{locale}.json`)
- `nav`, `hero`, `usp`, `products`, `values` (why choose), `howItWorks` (3 steps), `gallery`, `googleReview`, `locations`, `faq`, `finalCta`, `footer`, `fomo`, `metadata`, `blog`.

### Authoring order (Nana)
1. Write all MS copy in full.
2. Translate MS → EN (not write-fresh).
3. Translate MS → ZH (not write-fresh).

---

## 7. Technical Decisions

### Stack (locked)
| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 4 (via `@tailwindcss/postcss`) |
| i18n | next-intl 4 |
| Database | Supabase (shared instance — NOT per-website) |
| Deployment | Vercel |
| Analytics | Utopia Webcore tracking script (`https://utopia-webcore.vercel.app/t.js`) |
| Typography | **Inter only** — headings AND body. No serif. (User memory rule.) |

### Locked design rules (from CLAUDE.md — apply verbatim)

- **Heading hierarchy — every page has EXACTLY one `<h1>` AND one `<h2>`, both inside the hero.** Subtitle is an `<h2>` element, NOT a `<p>`. All remaining section titles are `<h3>`–`<h6>`. Lint/count both before ship.
- **Dynamic products from Supabase (CRITICAL).** Homepage + location grids query `products` + `product_photos` where `website = 'katilhospital-24jam.vercel.app'` and `is_active = true`, ordered by `sort_order`. ISR `revalidate = 3600`. No hardcoded arrays in frontend source of truth.
- **No phone / domain / email / SSM as visible text anywhere.** All contact flows through WhatsApp redirect buttons exclusively.
- **FOMO banner — red or black only, live ticking countdown (HH:MM:SS), sticky top of first viewport.** Never brand-colour, never yellow/green. For this project: `#E11C1C` (primary red) or pure black.
- **WhatsApp CTAs use `#25D366`** (hover `#1EBE57`) on every instance — nav, hero, inline, FAB, final CTA, blog banner. Icon stays white. Never themed with brand colour.
- **Customer gallery — no blank slots.** Column count must evenly divide image count at every breakpoint, or list is padded/trimmed. No `auto-fill` stranding.
- **Location coverage — 159 locations, ≥10 per state, total within 150–180.** Copy the file from `projects/electrician-24-hour/config/locations.ts` (see Blockers).
- **Google Review branding.** Review card section uses the real Google Review logo/branding from the reference asset pack, not generic 5-star icons.
- **3 steps only** in How-It-Works (per user memory — never 4+).
- **Mobile-first + mobile-center alignment** for headings, buttons, cards, icons.
- **USP bar** — exactly 3 points, immediately below hero, on every homepage.
- **Buttons** — single rounded shape site-wide; only colour varies per variant.

### Layout ownership rule (CRITICAL — from alpha.md)
**`app/[locale]/layout.tsx` MUST NOT contain any header or footer.** It owns only:
- `<html lang>` + `<body>` shell
- `Inter` font variable
- Tracking `<script>` tag (with `data-website="katilhospital-24jam.vercel.app"` — exact match)
- `NextIntlClientProvider` with messages
- `OrganizationSchema`
- `{children}`

Each page component (homepage, location page, blog listing, blog post) **owns its own header and footer inline**. This prevents double-rendering that occurred in past projects when both the layout and the page included a header/footer.

### Homepage / location-page section parity rule (CRITICAL — from alpha.md)
Homepage and location pages MUST render the **identical section order**. Location pages may **add** two sections (Breadcrumbs at the top, Nearby Locations before the footer) but must not **omit** any homepage section.

### Database column reality check
- The phone-number table column is `website` — **NOT** `website_slug`. Verified in `projects/electric-wheelchair-malaysia/lib/getPhoneNumber.ts`.
- Default phone rows use `location_slug = 'all'` (string literal). **Never `null`.** Verified same file.
- Blog translation joins use `blog_translations.language` for the locale filter. Verified in `projects/electric-wheelchair-malaysia/lib/getBlogPosts.ts`.

### Tracking (mandatory)
- `<script defer src="https://utopia-webcore.vercel.app/t.js" data-website="katilhospital-24jam.vercel.app">` in the `<head>` of `app/[locale]/layout.tsx`.
- `global.d.ts` declares `window.uwc`.
- Events to fire:
  - `uwc('click', { label: 'whatsapp-60174287801' })` on every WhatsApp CTA press.
  - `uwc('impression', { label: 'product-{slug}' })` once per product card via `IntersectionObserver` (observer disconnects after first trigger).
  - `uwc('click', { label: 'blog-{slug}' })` on blog-listing card clicks.

---

## Appendix — Canonical Section Order

Both the homepage and every location page MUST render these sections in exactly this order. Location pages insert Breadcrumbs at the top and Nearby Locations before the footer — they may NOT omit any homepage section.

### Homepage order
1. FOMO countdown bar (red `#E11C1C` or black; ticking HH:MM:SS; sticky top)
2. Floating pill nav (logo with red clock icon; MS/EN/ZH switcher; WhatsApp green CTA #25D366)
3. Hero — H1 (main title) + H2 (subtitle) + primary WhatsApp green CTA + hero imagery (`pasted-image-1776907756088.png` bed + `pasted-image-1776907764125.png` doctor mascot)
4. 3-point USP bar (e.g. "Penghantaran 24 Jam", "Sewa RM/bulan", "Liputan Seluruh Malaysia")
5. Dynamic product grid (8 SKUs from Supabase, auto-fill responsive)
6. "Why Choose 24 Jam" value-props section
7. How-it-works — **3 steps only**
8. Customer gallery (16 WhatsApp-style review screenshots; no blank slots at any breakpoint)
9. Google Review card section (real Google Review branding, not generic stars)
10. FAQ (with `FAQSchema` JSON-LD)
11. Final CTA on dark-photo band (WhatsApp green CTA)
12. Footer (page-owned, inline — NOT in `layout.tsx`)

### Location page order
1. Breadcrumbs (`Home › Katil Hospital › {City}`) ← inserted
2. FOMO countdown bar
3. Floating pill nav
4. Hero (H1 = `Katil Hospital 24 Jam di {City}`, H2 = localised subtitle)
5. 3-point USP bar
6. Dynamic product grid
7. "Why Choose 24 Jam" value-props
8. How-it-works (3 steps)
9. Customer gallery (no blank slots)
10. Google Review card section
11. FAQ (location-specific questions)
12. Final CTA on dark-photo band
13. **Nearby Locations** (4 links via `getNearbyLocations(slug)`) ← inserted
14. Footer (page-owned, inline)

All WhatsApp buttons across both pages must use `#25D366` (hover `#1EBE57`) and pass `loc={slug}` on location pages for future leads-mode upgrades (harmless under `single`).

---

**End of architecture.** Cyclops and Sora may proceed in parallel. Nana waits on Sora's `seo-plan.md`.
