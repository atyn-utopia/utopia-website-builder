# sewa-excavator — System Architecture

> **Author:** Alpha (System Architect)
> **Project:** Abang Excavator — Sewa Excavator No.1 Malaysia
> **Domain:** `sewa-excavator.vercel.app`
> **Created:** 2026-05-22

This document is the single source of truth for the technical build of `sewa-excavator`. Cyclops, Sora, Nana, Kagura, Kimmy, Hanabi, and Layla all build on top of it. Inputs are already confirmed in `projects/sewa-excavator/inputs.md` — nothing in this document re-asks the user.

---

## 1. Folder & Routing Structure

```
projects/sewa-excavator/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                       # locale layout — fonts, NextIntlClientProvider, tracking, OrganizationSchema. NO header, NO footer (page-owned).
│   │   ├── page.tsx                         # homepage (Server Component)
│   │   ├── HomePageClient.tsx               # client-side interactivity (calculator, FOMO timer, mobile nav, observers)
│   │   ├── excavator/
│   │   │   └── [location]/
│   │   │       ├── page.tsx                 # location landing page (Server Component)
│   │   │       └── LocationPageClient.tsx   # location-page client interactivity
│   │   ├── blog/
│   │   │   ├── page.tsx                     # blog index — auto-fill grid (electric-wheelchair-malaysia parity)
│   │   │   └── [slug]/
│   │   │       └── page.tsx                 # individual blog post — article + sticky sidebar
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx                     # server component — calls getPhoneNumber({loc}) and builds wa.me URL
│   │       └── RedirectClient.tsx           # client redirect + fallback link
│   ├── api/
│   │   ├── revalidate/
│   │   │   └── route.ts                     # POST — webcore webhook handler (revalidateTag)
│   │   └── phones/
│   │       └── route.ts                     # optional debug endpoint — returns currently-selected phone for QA
│   ├── globals.css                          # Tailwind 4 + brand tokens + .blog-content + .eyebrow utilities
│   ├── layout.tsx                           # root layout (minimal — html shell only)
│   ├── icon.svg                             # favicon — orange Volvo excavator silhouette extracted from logo
│   ├── robots.ts                            # robots.txt — allow all crawlers, point at sitemap
│   └── sitemap.ts                           # sitemap — homepage × 3 locales + all locations × 3 + blog posts × 3
├── components/
│   ├── BlogNav.tsx
│   ├── BlogFooter.tsx
│   ├── FomoBanner.tsx                       # red/black sticky banner with live countdown
│   ├── LanguageSwitcher.tsx                 # MS / EN / 中文 toggle (locale-prefix-always)
│   ├── Eyebrow.tsx                          # <span className="eyebrow"> — ALL CAPS mono label above every section heading
│   ├── BrandStrip.tsx                       # 4–8 partner/cert logos (grayscale → colour on hover)
│   ├── GoogleReviewCard.tsx                 # G-logo + "Posted on Google" + 5-star Google-yellow row
│   ├── RentalCalculator.tsx                 # special section — Volvo EC200/EC400 × daily/weekly/monthly × days → live quote
│   ├── tracking/
│   │   ├── ImpressionObserver.tsx           # IntersectionObserver → window.uwc('impression', ...)
│   │   └── WhatsAppClickTracker.tsx         # wraps WA buttons, fires uwc('click', ...)
│   └── schema/
│       ├── BreadcrumbSchema.tsx
│       ├── FAQSchema.tsx
│       ├── LocalBusinessSchema.tsx
│       ├── OrganizationSchema.tsx
│       └── ProductSchema.tsx
├── config/
│   ├── site.ts                              # domain, brand, locales, fallbackPhone, whatsappMessages.{ms,en,zh}
│   └── locations.ts                         # 150–180 sub-locations, 13 states + KL/Putrajaya/Labuan, with nearbyMap
├── i18n/
│   ├── routing.ts                           # defineRouting — locales=['ms','en','zh'], defaultLocale='ms', localePrefix='always'
│   └── request.ts                           # getRequestConfig — loads messages/{locale}.json
├── lib/
│   ├── webcore.ts                           # MANDATORY — products, phones, blog (cache-tag fetches). Pattern copied from projects/tablechair-rental-malaysia/lib/webcore.ts.
│   └── waRedirect.ts                        # builds /{locale}/redirect-whatsapp-1?loc=...&message=...
├── messages/
│   ├── ms.json                              # Bahasa Melayu (default locale)
│   ├── en.json                              # English
│   └── zh.json                              # 简体中文
├── public/
│   └── (brand assets copied from projects/sewa-excavator/brand_assets/ — logos, product cutouts, hero photo)
├── brand_assets/                            # source assets (logos for light/dark bg, EC200 cutout, EC400 lifestyle)
├── middleware.ts                            # next-intl middleware — matcher excludes /api, /_next, /_vercel, file extensions
├── next.config.ts                           # loadEnvConfig('../..'), withNextIntl, images.remotePatterns
├── postcss.config.mjs                       # @tailwindcss/postcss
├── tsconfig.json
├── global.d.ts                              # window.uwc(eventType, options) declaration
├── package.json                             # "dev": "next dev --port 3025"
├── screenshot.mjs                           # Puppeteer screenshot helper
├── serve.mjs                                # localhost wrapper (per CLAUDE.md)
└── .env.local → ../../.env.local            # symlink to shared Supabase credentials
```

### Routing surface (Next.js App Router)

| Route pattern | Locales | Notes |
|---|---|---|
| `/[locale]` | `ms`, `en`, `zh` | Homepage. Default locale `ms` still resolves to `/ms` (localePrefix `always`). |
| `/[locale]/excavator/[location]` | × 3 | One generated page per entry in `config/locations.ts`. |
| `/[locale]/blog` | × 3 | Listing — server-rendered from `getBlogPosts(locale)`. |
| `/[locale]/blog/[slug]` | × 3 | Individual post — `getBlogPost(slug, locale)`. |
| `/[locale]/redirect-whatsapp-1` | × 3 | Dynamic — `export const dynamic = 'force-dynamic'`, `export const revalidate = 0`. Only place revalidate=0 is allowed. |
| `/api/revalidate` | n/a | POST webhook from webcore admin. |
| `/sitemap.xml`, `/robots.txt` | n/a | Generated by `app/sitemap.ts`, `app/robots.ts`. |

`middleware.ts` matcher: `['/((?!api|_next|_vercel|.*\\..*).*)']` so `/api/revalidate`, `/sitemap.xml`, and `/robots.txt` bypass the locale prefix.

---

## 2. Page Inventory

Total static surface (before blog posts):
- 1 homepage × 3 locales = **3 pages**
- ~160 location pages × 3 locales = **~480 pages**
- 1 blog listing × 3 locales = **3 pages**
- N blog posts × 3 locales (Hanabi: minimum 10 posts) = **30+ pages**
- 1 WhatsApp redirect × 3 locales (dynamic) = **3 routes**

Grand total at launch: **~520 unique URLs**, all in the sitemap.

### Per-page mandatory blocks

**Homepage (`/[locale]`)**

| # | Section | Component / source |
|---|---|---|
| 1 | FOMO banner (red/black bg, live countdown) | `<FomoBanner>` |
| 2 | Top nav (logo + MS/EN/中文 switcher + WA CTA) | inline in `page.tsx` |
| 3 | Hero — H1 + H2 + WA CTA + EC200/EC400 hero image | inline |
| 4 | Brand / collaborator logo strip (4–8 muted logos) | `<BrandStrip>` |
| 5 | 3-point USP bar (icons highlighted, NO section heading) | inline |
| 6 | Products — dynamic grid from `getProducts()` | inline + `<ImpressionObserver>` |
| 7 | **Special section — Rental Calculator** (Volvo EC200/EC400 × daily/weekly/monthly × days → live quote, charcoal panel, orange accents) | `<RentalCalculator>` |
| 8 | Process — "How to rent" steps (each step has eyebrow + H3) | inline |
| 9 | Why us — trust signals (each card eyebrow + H3) | inline |
| 10 | Customer Reviews — Google-treatment cards | `<GoogleReviewCard>` |
| 11 | Gallery — filled grid (no blank cells) | inline |
| 12 | FAQ — accordion + FAQ schema | inline + `<FAQSchema>` |
| 13 | Locations — grouped by state with internal links | inline |
| 14 | Final CTA — image-bg, WA CTA, eyebrow + H3 | inline |
| 15 | Footer (page-owned, NOT in layout.tsx) | inline |

**Location page (`/[locale]/excavator/[location]`) — IDENTICAL section order to homepage**, with two additions:

- Between (2) Nav and (3) Hero → **Breadcrumb** (`<BreadcrumbSchema>` + visual breadcrumb)
- Between (13) Locations and (14) Final CTA → **Nearby Locations** strip (driven by `locations[].nearbyMap`)

The location page MUST NOT omit any of the 15 homepage sections. Every section pulls localised, location-tailored copy from `messages/{locale}.json` + Nana's location copy bundle.

**Blog listing (`/[locale]/blog`)**
- `<BlogNav>` → header banner with eyebrow + H1 → auto-fill `minmax(340px,1fr)` grid of cards → `<BlogFooter>`.
- Match `projects/electric-wheelchair-malaysia/app/[locale]/blog/page.tsx` layout exactly.

**Blog post (`/[locale]/blog/[slug]`)**
- `<BlogNav>` → Breadcrumb → article column (max 740px) + sticky sidebar (recent posts) → article TOC → WA CTA banner (green) → `<BlogFooter>`.
- Article body rendered via `dangerouslySetInnerHTML` against the `.blog-content` CSS in `globals.css`.

**WhatsApp redirect (`/[locale]/redirect-whatsapp-1`)**
- Server reads `?loc` query, calls `getPhoneNumber(loc)`, builds `wa.me` URL via `waLink()`, hands to `<RedirectClient>` which does `window.location.href = url` in a `useEffect`. Has a visible fallback link styled in `--wa-green`.

---

## 3. Data Flow

### 3.1 Supabase → site (read path) — webcore data layer is MANDATORY

Every read goes through `lib/webcore.ts` using `fetch()` against the Supabase REST API with Next.js cache tags. There is **NO** `lib/supabase.ts`, **NO** `lib/getProducts.ts`, **NO** `lib/getPhoneNumber.ts`, **NO** `lib/getBlogPosts.ts`. The Supabase JS client is not cache-tag-aware and silently breaks invalidation.

Reference implementation (copy then adapt): `projects/tablechair-rental-malaysia/lib/webcore.ts`.

Exported surface:

| Function | Cache tag | Purpose |
|---|---|---|
| `getProducts()` → `{ core, additional }` | `webcore-products` | Filter `website = sewa-excavator.vercel.app` AND `is_active = true`, order by `sort_order`, embed `product_photos(url)`. `core` = rental_price set, `additional` = rental_price null. |
| `getPhoneNumber(locationSlug?)` → `PhoneResult` | `webcore-phones` | Reads host from `headers()`, fetches `company_websites.leads_mode` + `phone_numbers` rows, applies 4-mode logic. Fallback to `siteConfig.fallbackPhone` + `siteConfig.whatsappMessages.ms`. |
| `waLink(phone, message?)` | (pure) | `https://wa.me/${phone}?text=${encoded}` |
| `getWhatsAppLink(locationSlug?, override?)` | `webcore-phones` | Combines `getPhoneNumber()` + `waLink()`. |
| `getBlogPosts(locale)` | `webcore-blog` | Listing query — joins `blog_translations` with `language = locale`. |
| `getBlogPost(slug, locale)` | `webcore-blog` | Single-post fetch. |
| `getRecentBlogPosts(locale, exceptSlug, limit=3)` | `webcore-blog` | Sidebar feed. |
| `getBlogPostSlugs()` | `webcore-blog` | For `generateStaticParams` on blog post route. |

Every `fetch()` call includes:
```ts
{
  headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Accept: 'application/json' },
  next: { tags: ['webcore-products' | 'webcore-phones' | 'webcore-blog'] }
}
```

### 3.2 Cache invalidation — tag-based ONLY

- **NEVER** use `export const revalidate = N` on any page. Sole exception: the WhatsApp redirect, which uses `export const dynamic = 'force-dynamic'` + `export const revalidate = 0` because it must always re-execute.
- All other invalidation flows through `revalidateTag()` triggered by the webcore admin webhook:

`app/api/revalidate/route.ts` (identical across all sites):
1. POST handler.
2. Validates `x-webcore-secret` header against `process.env.WEBCORE_REVALIDATE_SECRET`.
3. Reads `{ tags: string[] }` from request body.
4. Calls `revalidateTag(tag)` for each tag.
5. Returns `200 {"revalidated": [...]}`.

After deployment, the webcore admin **Integrations** panel must be configured to point at `https://sewa-excavator.vercel.app/api/revalidate` with the same shared secret. Layla runs the curl test in `CLAUDE.md` to verify.

### 3.3 Translation loading (next-intl)

1. Browser hits `/`, middleware (`middleware.ts`) detects no locale prefix → 307 redirects to `/ms`.
2. `app/[locale]/layout.tsx` awaits `params`, validates `locale` against `routing.locales`, calls `notFound()` if invalid.
3. `getMessages()` from `next-intl/server` → calls `i18n/request.ts` → dynamic-imports `messages/{locale}.json`.
4. `<NextIntlClientProvider messages={messages}>` wraps children so both Server and Client Components can call `useTranslations()` / `getTranslations()`.
5. The Server Component pages call `getTranslations('section.key')` directly; Client Components (`HomePageClient`, `LocationPageClient`, `RentalCalculator`, `LanguageSwitcher`) call `useTranslations('section.key')`.

### 3.4 Location slug → page mapping

- `config/locations.ts` exports a typed array `locations: Location[]`. Each entry: `{ slug, name, state, stateSlug, nearbyMap: string[] }`.
- `app/[locale]/excavator/[location]/page.tsx` exports:
  ```ts
  export async function generateStaticParams() {
    return locations.flatMap(loc =>
      routing.locales.map(locale => ({ locale, location: loc.slug }))
    );
  }
  ```
- Unknown slug → `notFound()`.
- The same array drives `app/sitemap.ts` and the homepage's location-grid block.

### 3.5 WhatsApp redirect flow

1. User taps a WA CTA anywhere on the site → href is `/${locale}/redirect-whatsapp-1?loc=${slug}` (or no `loc` on homepage/blog).
2. Client-side tracker fires `window.uwc('click', { label: 'whatsapp-{phone}' })`.
3. `/redirect-whatsapp-1/page.tsx` is `force-dynamic` — runs on every request.
4. Calls `getPhoneNumber(loc)` → webcore reads `company_websites.leads_mode` for `sewa-excavator.vercel.app` (= `'single'`) → returns the `label='default'` row from `phone_numbers`.
5. Builds `wa.me` URL via `waLink()`, hands URL to `<RedirectClient>` which navigates the browser. Fallback link is visible in case JS is disabled.

For `leads_mode = 'single'` the location query string never changes routing — it is still passed for forward-compatibility (so a future mode change to `location`/`hybrid` works without code changes).

---

## 4. Database Requirements (shared schema — NO new tables)

The schema is shared across all Utopia Webcore sites. Cyclops does **not** design new tables. For this domain, the following rows must exist:

### 4.1 `company_websites` — 1 row

```sql
INSERT INTO company_websites (company_id, domain, leads_mode)
VALUES ('f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c', 'sewa-excavator.vercel.app', 'single');
```

- `company_id` → Utopia Holiday Sdn. Bhd.
- `leads_mode = 'single'` (confirmed in inputs).

### 4.2 `phone_numbers` — 1 row (seed)

```sql
INSERT INTO phone_numbers
  (website, location_slug, phone_number, label, type, is_active, whatsapp_text, percentage)
VALUES
  ('sewa-excavator.vercel.app', 'all', '60174287801', 'default', 'default', true,
   'Hi Abang Excavator, saya berminat untuk sewa excavator. Boleh dapatkan sebut harga?', 100);
```

Column reminders (do not invent column names):
- `website` (NOT `website_slug`) — exact deployed domain.
- `location_slug = 'all'` (NOT `null`) for defaults.
- `label = 'default'`, `type = 'default'` for the seed row.
- `percentage = 100` even in single mode (weights are relative, harmless).

### 4.3 `products` — 2 rows (Volvo EC200 + Volvo EC400)

Cyclops to insert during Step 10:

```sql
INSERT INTO products (website, name, slug, description, sale_price, rental_price, sort_order, is_active)
VALUES
  ('sewa-excavator.vercel.app', 'Volvo EC200', 'volvo-ec200',
   '<short description from Nana — keep editorial copy on the page, not in DB>',
   NULL, <RM/day rate>, 1, true),
  ('sewa-excavator.vercel.app', 'Volvo EC400', 'volvo-ec400',
   '<short description from Nana>',
   NULL, <RM/day rate>, 2, true);
```

- Both `sale_price = NULL` (rental-only site).
- `rental_price` populated so `getProducts()` puts them in `core` (not `additional`).
- `parent_id = NULL` — no variants nested in DB; rental period (daily/weekly/monthly) is computed in the front-end calculator, not modelled in the products table.

### 4.4 `product_photos` — 2+ rows

```sql
INSERT INTO product_photos (product_id, url)
VALUES
  ('<ec200_id>', 'https://<supabase-public-bucket>/.../volvo-ec200.png'),
  ('<ec400_id>', 'https://<supabase-public-bucket>/.../volvo-ec400.jpg');
```

Cyclops uploads the two photos from `projects/sewa-excavator/brand_assets/` to the shared Supabase storage bucket, then writes the public URLs into `product_photos.url`. EC200 photo is a cutout (PNG) → use `object-fit: contain` in cards. EC400 photo is lifestyle → use `object-fit: cover`. Per the design rules we must **pick ONE treatment per grid** — Kagura/Kimmy will choose contain for the product grid (both products are framed as silhouettes) and use the lifestyle shot only as a background elsewhere.

### 4.5 `blog_posts` + `blog_translations` — 10+ rows × 3 locales (Hanabi, Step 11)

- `blog_posts`: `website = 'sewa-excavator.vercel.app'`, `status = 'published'`, `slug`, `cover_image_url`, `published_at`.
- `blog_translations`: per-locale rows with `language ∈ {ms, en, zh}`, `title`, `content` (HTML), `excerpt`, `meta_title`, `meta_description`.
- Hanabi must publish each post in **all three locales** to keep parity with the language switcher.

### 4.6 Tables NOT in scope

- No new tables. No schema migrations. If Cyclops believes a new column or table is required, escalate — do not invent.

---

## 5. SEO Structure Requirements (for Sora)

Sora's `seo-plan.md` must cover the following — Alpha does not write the keyword plan itself.

### 5.1 Keyword themes

Primary (Malay-first, market reality for this product):
- `sewa excavator`, `sewa excavator murah`, `harga sewa excavator`, `sewa volvo excavator`, `sewa excavator harian`, `sewa excavator bulanan`, `sewa excavator malaysia`.

Variant-level:
- `sewa volvo ec200`, `sewa volvo ec400`, `sewa excavator 20 tonne`, `sewa excavator 40 tonne`.

Location-modified (per location, all three locales):
- `sewa excavator {location}`, `excavator rental {location}`, `挖掘机出租 {location}`.

Intent / commercial modifiers:
- `dengan operator`, `with operator`, `same day`, `kontraktor`, `tapak bina`, `construction site`.

English mirror — `excavator rental malaysia`, `volvo excavator rental`, `daily excavator rental kuala lumpur`, etc.
Chinese mirror — `马来西亚挖掘机出租`, `沃尔沃挖掘机租赁`, etc.

### 5.2 Page hierarchy

```
/{locale}                                        — primary commercial root, targets "sewa excavator malaysia"
  └── /{locale}/excavator/{location}             — long-tail commercial, "sewa excavator {location}"
        └── (internal links → 4 nearby locations + back to /{locale})
/{locale}/blog                                   — content hub, supports informational queries
  └── /{locale}/blog/{slug}                      — informational, internally links → /{locale} + relevant location
```

Sora must produce an explicit **internal-link map**:
- Every location page links to its 4 nearest siblings (via `locations[].nearbyMap`) + the homepage.
- Homepage links to all locations (Locations section).
- Every blog post includes ≥3 internal anchors: 1 to homepage, 1 to a relevant location page, 1 to another blog post.
- The blog listing page links to every published post.

### 5.3 Hreflang setup (mandatory)

Every page emits hreflang link tags for the three locale siblings + `x-default = ms` (default locale):

```html
<link rel="alternate" hreflang="ms" href="https://sewa-excavator.vercel.app/ms/excavator/kuala-lumpur" />
<link rel="alternate" hreflang="en" href="https://sewa-excavator.vercel.app/en/excavator/kuala-lumpur" />
<link rel="alternate" hreflang="zh" href="https://sewa-excavator.vercel.app/zh/excavator/kuala-lumpur" />
<link rel="alternate" hreflang="x-default" href="https://sewa-excavator.vercel.app/ms/excavator/kuala-lumpur" />
```

Kimmy implements this via `generateMetadata({ params })` returning a `Metadata` object with `alternates.languages`.

### 5.4 Heading discipline (lint at build)

Every page (homepage, location, blog listing, blog post):
- Exactly **one H1** + exactly **one H2** (hero title + hero subtitle).
- Section headings = H3/H4 only. Never H5/H6 for keyword-bearing phrases.
- Every section has an `<Eyebrow>` immediately above its heading.
- No orphan paragraphs (every `<p>` lives under a heading-led block).

### 5.5 Schema markup (Kimmy)

- `Organization` — site-wide, in `app/[locale]/layout.tsx`.
- `Product` — homepage (per product card).
- `LocalBusiness` — each location page, with `areaServed = {location.name}`.
- `BreadcrumbList` — every location and blog-post page.
- `FAQPage` — homepage + every location page + every blog post (when there's an FAQ block).
- `Article` + `BreadcrumbList` — every blog post.

---

## 6. i18n Requirements

| Field | Value |
|---|---|
| Library | `next-intl` 4 |
| Locales | `ms`, `en`, `zh` |
| Default locale | `ms` (Bahasa Melayu) |
| Locale prefix | `always` — even `/ms` shows in URLs |
| Message files | `messages/ms.json`, `messages/en.json`, `messages/zh.json` |
| Switcher | `<LanguageSwitcher>` — labels: `MS`, `EN`, `中文` |

### 6.1 Confirmed by user (no re-asking)

Inputs.md confirms `ms` (default), `en`, `zh`. No additional locales.

### 6.2 `i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing';
export const locales = ['ms', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const routing = defineRouting({
  locales,
  defaultLocale: 'ms',
  localePrefix: 'always',
});
```

### 6.3 Message bundle skeleton (Kimmy + Nana populate)

```
{
  "common": { "rentNow", "callNow", "whatsappCta", "viewProducts", "viewLocations" },
  "nav":    { "home", "products", "locations", "blog", "contact" },
  "fomo":   { "eyebrow", "headline", "countdownLabel" },
  "hero":   { "eyebrow", "h1", "h2", "ctaPrimary", "ctaSecondary" },
  "brandStrip": { "eyebrow" },
  "usp":    { "items": [ {"icon","title","body"} × 3 ] },
  "products": { "eyebrow", "h3", "subtitle", "ctaLabel" },
  "calculator": { "eyebrow", "h3", "subtitle", "modelLabel", "periodLabel", "daysLabel", "quoteLabel", "ctaLabel",
                  "models": { "ec200", "ec400" }, "periods": { "daily", "weekly", "monthly" } },
  "process": { "eyebrow", "h3", "steps": [ {"title","body"} × 4 ] },
  "why":    { "eyebrow", "h3", "items": [ {"title","body"} × 4 ] },
  "reviews": { "eyebrow", "h3", "aggregate", "items": [ {"name","body","stars"} × 6 ] },
  "gallery": { "eyebrow", "h3" },
  "faq":    { "eyebrow", "h3", "items": [ {"q","a"} × 8 ] },
  "locationsBlock": { "eyebrow", "h3", "stateLabels": { ... } },
  "finalCta": { "eyebrow", "h3", "body", "ctaLabel" },
  "footer": { "tagline", "links", "copyright" },
  "blog":   { "title", "readMore", "noPosts", "breadcrumbHome", "breadcrumbBlog", "publishedOn", "minRead", "recentPosts", "metaTitle", "metaDescription" },
  "location": { "introTemplate", "faqIntro", "nearbyHeading", "ctaTemplate" }
}
```

Nana writes the actual copy; Kimmy ensures every key exists in all three files (missing keys = 500 in dev).

### 6.4 Locale-aware metadata

`generateMetadata({ params })` in every page returns localised `title`, `description`, `alternates.languages`, and `openGraph.locale`. Default OG image lives at `public/og/{locale}.png`.

---

## 7. Technical Decisions

### 7.1 Stack (confirmed)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 — App Router only |
| UI | React 19 Server Components by default; client only where interaction is required |
| Styling | Tailwind CSS v4 + `@tailwindcss/postcss` |
| i18n | `next-intl` v4 |
| Database | Supabase (shared instance — `xzydvhzcngpxdbyniliy.supabase.co`) |
| Data layer | **Webcore (`lib/webcore.ts`) — MANDATORY**. No Supabase JS client for reads. |
| Deployment | Vercel |
| Tracking | Utopia Webcore script (`https://webcore.utopiaai.my/t.js`) — global `window.uwc(eventType, options)` |
| Screenshot QA | Puppeteer via `screenshot.mjs` |
| Fonts | `Plus Jakarta Sans` (display + body, sans-only) + `JetBrains Mono` (eyebrows, numerals). Loaded via `next/font/google`. |

### 7.2 Non-obvious decisions (BLOCKING — every agent must respect)

1. **Webcore data layer is the only read path.**
   - All reads through `lib/webcore.ts` with `next: { tags: [...] }`. Tags: `webcore-products`, `webcore-phones`, `webcore-blog`.
   - **DO NOT create** `lib/supabase.ts`, `lib/getProducts.ts`, `lib/getPhoneNumber.ts`, or `lib/getBlogPosts.ts`. The setup guide's references to these files are superseded by CLAUDE.md.
   - Template: `projects/tablechair-rental-malaysia/lib/webcore.ts`.

2. **Tag-based invalidation only.**
   - **NEVER** set `export const revalidate = N` on any page.
   - Sole exception: `app/[locale]/redirect-whatsapp-1/page.tsx` uses `export const dynamic = 'force-dynamic'` + `export const revalidate = 0`.
   - `app/api/revalidate/route.ts` validates `x-webcore-secret` against `process.env.WEBCORE_REVALIDATE_SECRET` and calls `revalidateTag(tag)` for each tag in the JSON body.
   - `WEBCORE_REVALIDATE_SECRET` must be added to Vercel env vars and the site redeployed once before invalidation is functional.

3. **Layout ownership.**
   - `app/[locale]/layout.tsx` contains **only** `<html>`, `<head>` (tracking script), `<body>`, `NextIntlClientProvider`, `OrganizationSchema`, and `{children}`. **No header. No footer.**
   - Each page (`page.tsx` of homepage, location page, blog listing, blog post) owns its own header and footer inline so we never get duplicate-rendered chrome.

4. **Section parity.**
   - Homepage and location pages share the **identical** section order:

     ```
     1. FOMO banner (red/black, countdown)
     2. Top nav
     3. Hero (H1 + H2 + WA CTA)
     4. Brand / collaborator logo strip
     5. 3-point USP bar (no section heading, highlighted icons)
     6. Products grid (dynamic from getProducts)
     7. Special section — Rental Calculator (EC200/EC400 × daily/weekly/monthly × days → live quote)
     8. Process
     9. Why us
     10. Customer Reviews — Google treatment
     11. Gallery (no blank slots)
     12. FAQ (+ FAQ schema)
     13. Locations
     14. Final CTA (image-bg, WA)
     15. Footer (page-owned)
     ```

   - Location pages MAY add Breadcrumb (between 2 and 3) and Nearby Locations (between 13 and 14). They MUST NOT omit any of the 15 blocks.

5. **Special section = inline rental calculator.**
   - Component: `<RentalCalculator>` (Client Component).
   - Inputs: model select (`Volvo EC200` / `Volvo EC400`), period select (`Daily` / `Weekly` / `Monthly`), days input (number).
   - Output: live quote = `rental_price × days` (price comes from `getProducts()`; the rental_price column stores daily rate; weekly = day rate × 6 (1-day discount); monthly = day rate × 24 (6-day discount). Final multipliers locked by Cyclops + Nana during Step 10).
   - Visual: charcoal panel (`--brand-steel`), orange (`--brand-orange`) for active states, JetBrains Mono for numerals. Sits between (6) Products and (8) Process. CTA at the bottom of the panel = primary WA button.

6. **Section eyebrow component site-wide.**
   - Every section heading (H3+) has a sibling `<Eyebrow>` (ALL CAPS JetBrains Mono, orange pill on light bg, `<Eyebrow variant="light">` on dark/image bg).
   - Lint at QA time: zero bare headings anywhere on the site.

7. **Brand / collaborator logo strip below hero.**
   - 4–8 logos — placeholder examples for excavator trade until real partners are confirmed: "BCI Asia", "CIDB Malaysia", "Volvo CE Approved", "Featured in Property Insight", "ISO 9001", "SIRIM Verified". Grayscale by default → colour on hover.

8. **Google-review treatment on review cards.**
   - Every card: Google "G" multi-stroke logo in top-right, "POSTED ON GOOGLE" small-caps eyebrow, 5-star row in `#FBBC04`.
   - Section heading aggregate badge: "4.9 / 5 on Google Reviews" + Google G.

9. **Dev server port: `3025`.**
   - Verified unique against all existing projects in `projects/*/package.json` (highest in use today is `3024` — katering-auntyrokiah).
   - `package.json`: `"dev": "next dev --port 3025"`.

10. **Tracking is mandatory.**
    - `data-website="sewa-excavator.vercel.app"` on the webcore script tag in `app/[locale]/layout.tsx`.
    - `global.d.ts` declares `window.uwc(eventType, options)`.
    - WA buttons fire `uwc('click', { label: 'whatsapp-60174287801' })` (label = `whatsapp-{phone}`).
    - Product cards fire `uwc('impression', { label: 'product-{slug}' })` via IntersectionObserver, then disconnect.
    - Blog cards fire `uwc('click', { label: 'blog-{slug}' })` on tap.

11. **Visible-text rules.**
    - Phone number `60174287801` and the domain `sewa-excavator.vercel.app` are **never** rendered as visible text on any page. Phone number lives only in the WA redirect URL.

12. **Typography & background.**
    - Body background is **white** (`#FFFFFF`) by default. Dark sections use `--brand-charcoal` or `--brand-steel`.
    - Plus Jakarta Sans for everything; JetBrains Mono only for eyebrows and numerals (prices, timer digits, quote totals). No serif anywhere.

13. **WhatsApp CTA colour discipline.**
    - Every WA button = `#25D366` bg, `#1EBE57` hover, white icon. Same rounded shape across the site (border-radius token `--radius-full` or `--radius-2xl` — Kagura picks one).

14. **Locations count target.**
    - `config/locations.ts` must contain 150–180 entries with **≥10 per state**. Reference: `projects/skylift-malaysia/config/locations.ts` (159 entries — already in the right ballpark, can be reused/extended for excavator coverage. Cyclops/Sora confirm the final list.).

15. **Environment variables on Vercel.**
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY={anon_key}
    WEBCORE_REVALIDATE_SECRET={shared secret — issued by webcore admin}
    ```
    Layla adds these via `vercel env add` before the first production deploy. Adding the secret alone does not invalidate running deployments — a redeploy is required once after adding it.

### 7.3 Open dependencies (flag, not blocking)

- Hero / interior background photo: user said "I'll attach later" — Kagura builds the design using placeholder Pexels excavator imagery; user must drop the final hero into `brand_assets/` before Gate 1.
- Real partner logos: until provided, use the six placeholder labels listed in 7.7.
- Weekly / monthly multipliers in the calculator: Nana + Cyclops finalise during Step 10 copy lock-in.

---

## Handoff

| Agent | Reads | Produces |
|---|---|---|
| Cyclops | Sections 4, 7.2 | `database.md` — exact INSERTs for `company_websites`, `phone_numbers`, `products`, `product_photos`, plus storage upload instructions and the EC200/EC400 rental_price values. |
| Sora | Sections 5, 6 | `seo-plan.md` — keyword tables (ms/en/zh), heading map per page, internal-link map (homepage ↔ locations ↔ blog), hreflang block spec. |
| Nana | Sections 2, 5, 6, 7.2 | `copy-homepage.md`, `copy-locations.md` — populates every key in the message-bundle skeleton (6.3) in ms/en/zh. |
| Kagura | Sections 2, 7.2 (esp. layout, special section, typography) | `design-direction.md` — Mood, palette tokens (already in inputs.md), button shape, USP icon treatment, RentalCalculator visual spec, reviews-card spec. Unique vs the existing project portfolio. |
| Kimmy | Sections 1, 3, 5, 6, 7.2 | `technical-seo-i18n.md` + actual implementation of routing, middleware, metadata, schema, eyebrow component, WhatsApp redirect, tracking, revalidate route, calculator wiring. |
| Hanabi | Sections 4.5, 5, 6 | 10+ blog posts in `blog_posts` + `blog_translations` (ms/en/zh). |
| Layla | All | Deployment, env vars, webcore Integrations panel pointed at `/api/revalidate`, curl test, GitHub push, Vercel deploy. |
