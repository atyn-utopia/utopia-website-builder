# AuntyRokiah Katering — System Architecture (Alpha)

> Single source of truth for Cyclops, Sora, Nana, Kagura, Kimmy, Hanabi, Layla.
> Project slug: `katering-auntyrokiah` • Product slug: `pakej-katering` • Domain: `auntyrokiah-katering.utopiaai.my`
> Company: Kak Kenduri Sdn. Bhd. (`ce95071b-e575-4983-bdd4-66910f45fe34`)
> Locales: `ms` (default) • `en` • `zh` — `localePrefix: 'always'`
> Phone: `60174287801` (leads_mode `single`)

This architecture follows `CLAUDE.md` (Webcore Data Layer, Dynamic Product Data, Frontend Design Rules, Anti-Generic Design Guardrails) and `docs/full-website-setup.md`. The reference scaffold is `projects/tablechair-rental-malaysia/`. The data layer is identical to `tablechair-rental-malaysia/lib/webcore.ts` — **DO NOT** create `lib/supabase.ts`, `lib/getProducts.ts`, `lib/getPhoneNumber.ts`, or `lib/getBlogPosts.ts` (their Supabase-JS-client variants are not cache-tag aware and silently break webhook invalidation).

---

## 1. Folder & Routing Structure

```
projects/katering-auntyrokiah/
├── app/
│   ├── layout.tsx                                   ← minimal root (no chrome, no fonts)
│   ├── robots.ts                                    ← /robots.txt
│   ├── sitemap.ts                                   ← /sitemap.xml (all 3 locales)
│   ├── icon.svg                                     ← favicon = isolated kenduri-pot crest from logo
│   ├── [locale]/
│   │   ├── layout.tsx                               ← locale layout — fonts + tracking <script> + NextIntlClientProvider + OrganizationSchema ONLY. NO header/footer.
│   │   ├── page.tsx                                 ← homepage (server) — queries webcore.getProducts() + getWhatsAppLink()
│   │   ├── HomePageClient.tsx                       ← homepage client interactions (countdown, special section, etc.)
│   │   ├── pakej-katering/
│   │   │   └── [location]/
│   │   │       ├── page.tsx                         ← SSR location page — same section order as homepage + Breadcrumb + Nearby
│   │   │       └── LocationPageClient.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx                             ← blog listing (auto-fill grid)
│   │   │   └── [slug]/
│   │   │       └── page.tsx                         ← blog post (sticky-sidebar layout, blog-content CSS)
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx                             ← server: reads ?loc=, calls getPhoneNumber(loc), builds wa.me URL
│   │       └── RedirectClient.tsx                   ← client: window.location.href = url
│   └── api/
│       └── revalidate/
│           └── route.ts                             ← POST, validates x-webcore-secret, calls revalidateTag() for each tag in body
├── components/
│   ├── LanguageSwitcher.tsx                         ← MS / EN / ZH switcher (preserves current path)
│   ├── PageShell.tsx                                ← shared visual primitives ONLY (no header/footer — each page owns its chrome)
│   ├── Ornaments.tsx                                ← decorative SVG/gradient pieces
│   ├── tracking/
│   │   ├── WhatsAppClickTracker.tsx                 ← window.uwc('click', { label: 'whatsapp-<phone>' })
│   │   ├── ProductImpressionTracker.tsx             ← IntersectionObserver → uwc('impression', { label: 'product-<slug>' })
│   │   └── BlogClickTracker.tsx                     ← uwc('click', { label: 'blog-<slug>' })
│   └── schema/
│       ├── OrganizationSchema.tsx                   ← Organization JSON-LD (rendered in locale layout)
│       ├── ProductSchema.tsx                        ← Product (per pakej, rendered on homepage + location pages)
│       ├── FAQSchema.tsx                            ← FAQPage
│       ├── LocalBusinessSchema.tsx                  ← LocalBusiness (rendered on each location page)
│       └── BreadcrumbSchema.tsx                     ← BreadcrumbList (location + blog pages)
├── config/
│   ├── site.ts                                      ← domain, brand, locales, fallback phone, palette tokens, WA messages per locale
│   └── locations.ts                                 ← 160 location records (slug, name, state, stateSlug, nearbyMap)
├── i18n/
│   ├── routing.ts                                   ← defineRouting({ locales: ['ms','en','zh'], defaultLocale: 'ms', localePrefix: 'always' })
│   └── request.ts                                   ← getRequestConfig → loads messages/<locale>.json
├── lib/
│   └── webcore.ts                                   ← THE ONLY data layer (fetch + next.tags); exports getProducts, getPhoneNumber, waLink, getWhatsAppLink, getBlogPosts, getBlogPost, getRecentBlogPosts, getBlogPostSlugs
├── messages/
│   ├── ms.json                                      ← default locale
│   ├── en.json
│   └── zh.json
├── middleware.ts                                    ← next-intl middleware, matcher excludes /api /_next /_vercel and file URIs
├── next.config.ts                                   ← loadEnvConfig('../..') + next-intl plugin + remotePatterns (pexels, unsplash, placehold.co, supabase storage)
├── global.d.ts                                      ← declare window.uwc(event, { label })
├── postcss.config.mjs                               ← @tailwindcss/postcss
├── tsconfig.json
├── package.json                                     ← scripts.dev = "next dev --port 30XX" (assign a free port)
├── .env.local → ../../.env.local                    ← symlink to shared Supabase creds
├── architecture.md
├── database.md (Cyclops)
├── seo-plan.md (Sora)
├── copy-homepage.md (Nana)
├── copy-locations.md (Nana)
├── design-direction.md (Kagura)
├── technical-seo-i18n.md (Kimmy)
└── brand_assets/
    ├── logo.png
    └── pakej screenshots (3)
```

**Files explicitly forbidden** (CLAUDE.md):
- `lib/supabase.ts`
- `lib/getProducts.ts`
- `lib/getPhoneNumber.ts`
- `lib/getBlogPosts.ts`
- `config/products.ts` as a display source (a tiny static fallback array is permitted ONLY for offline development — never read on production paths)

---

## 2. Page Inventory

Locales: `ms` (default), `en`, `zh`. Every URL renders for all three locales with `localePrefix: 'always'`.

| Route | Per-locale count | Total |
|------|------------------:|------:|
| Homepage `/[locale]` | 1 × 3 | **3** |
| Location pages `/[locale]/pakej-katering/[location]` | 160 × 3 | **480** |
| Blog listing `/[locale]/blog` | 1 × 3 | **3** |
| Blog posts `/[locale]/blog/[slug]` | ≥10 × 3 | **≥30** |
| WhatsApp redirect `/[locale]/redirect-whatsapp-1` | 1 × 3 | **3** |
| `/api/revalidate` (POST) | – | 1 |
| `/sitemap.xml` + `/robots.txt` | – | 2 |

**Generation strategy**
- Homepage: server component, dynamic via webcore tags (no `revalidate = N`).
- Location pages: `generateStaticParams()` returns the cartesian product of 3 locales × 160 location slugs (480 entries). Data fetched per-render via webcore — tag invalidation refreshes them all without a redeploy.
- Blog listing + posts: server components, `generateStaticParams()` enumerates locales × `getBlogPostSlugs()`.
- WA redirect: `export const dynamic = 'force-dynamic'` + `export const revalidate = 0` — must re-pick phone on every hit (this is the only `revalidate = N` allowed, per CLAUDE.md).
- `sitemap.ts` enumerates: homepage × 3, all 480 location URLs, blog index × 3, every blog slug × 3. WA redirect excluded.

---

## 3. Data Flow

### 3.1 The webcore module (`lib/webcore.ts`)

Mirror of `projects/tablechair-rental-malaysia/lib/webcore.ts`. Every read calls:

```ts
fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
  headers: { apikey, Authorization: `Bearer ${SUPABASE_KEY}`, Accept: 'application/json' },
  next: { tags: [tag] },
})
```

Tag whitelist (exactly three):
- `webcore-products` — products + product_photos reads
- `webcore-phones` — phone_numbers + company_websites reads
- `webcore-blog` — blog_posts + blog_translations reads

Exports required for this site:
- `getProducts(): Promise<{ core: Product[]; additional: Product[] }>` — `core` = pakej rows with a price; `additional` = the Air Balang add-on (rule: if you wish to separate add-ons in the UI, branch on `parent_id` or a price-field heuristic — confirm the convention with Cyclops; do NOT hardcode names)
- `getPhoneNumber(locationSlug?: string): Promise<PhoneResult>`
- `waLink(phone, message?)`, `getWhatsAppLink(locationSlug?, override?)`
- `getBlogPosts(locale)`, `getBlogPost(slug, locale)`, `getRecentBlogPosts(locale, exceptSlug, limit)`, `getBlogPostSlugs()`

### 3.2 Product flow (homepage + location pages)

1. Page server-component calls `getProducts()`.
2. webcore issues `GET /rest/v1/products?select=*,product_photos(url)&website=eq.auntyrokiah-katering.utopiaai.my&is_active=eq.true&order=sort_order.asc` tagged `webcore-products`.
3. Result is mapped to `Product[]` with `photos[].url`.
4. Grid renders with **CSS grid auto-fill** (`repeat(auto-fill, minmax(280px, 1fr))`) so 4 pakej today and 8 tomorrow both look balanced. Card heights aligned via `display: flex; flex-direction: column`.
5. Card photo treatment for catering: prefer **`object-fit: cover`** (lifestyle plated-food shots sell the result) — pick ONE treatment for the entire grid (CLAUDE.md product-card rule).
6. Pakej Jimat shows "Best Seller" badge derived from data (e.g. label or sort_order = 1) — copy badge text from messages JSON.

### 3.3 Phone / leads-mode flow

1. User taps any WhatsApp CTA → href = `/[locale]/redirect-whatsapp-1?loc=<location-slug-or-empty>`.
2. Redirect page server component reads `searchParams.loc`, calls `getPhoneNumber(loc)`.
3. Inside webcore:
   - `getHostDomain()` reads the `host` (or `x-forwarded-host`) header.
   - `getLeadsMode(domain)` queries `company_websites?select=leads_mode&domain=eq.<host>` → returns `'single'` for this site.
   - `getPhoneRows(domain)` queries `phone_numbers?select=...&website=eq.<host>&is_active=eq.true`.
   - Mode `single` → returns the row with `label = 'default'` (or first row), wrapping the WhatsApp message.
4. `waLink(phone, text)` builds `https://wa.me/<phone>?text=<encoded>`.
5. `RedirectClient` sets `window.location.href = url`. Tracking script has already fired `uwc('click', { label: 'whatsapp-<phone>' })` from the originating button.

### 3.4 Tag-based invalidation (the ONLY revalidation mechanism)

- Admin mutates a row in Supabase → webcore admin sends `POST https://auntyrokiah-katering.utopiaai.my/api/revalidate` with header `x-webcore-secret: <secret>` and body `{"tags":["webcore-products"]}` (or `webcore-phones` / `webcore-blog`).
- `/api/revalidate/route.ts` validates the secret against `WEBCORE_REVALIDATE_SECRET`, then runs `revalidateTag(tag, 'default')` for every tag in the body.
- Next.js drops the matching fetch cache entries → next request re-fetches from Supabase → site updates **without a redeploy**.
- **Never** set `export const revalidate = N` on any page. The only exception (already noted) is the WA redirect page using `revalidate = 0` + `dynamic = 'force-dynamic'`.
- After first deploy, redeploy once (or run `vercel env pull && vercel --prod`) so the new env var is bound to the running build. Verify with the curl in CLAUDE.md (expect `200 {"revalidated":["webcore-products"]}`).

### 3.5 Location slug → page resolution

- `config/locations.ts` exports `locations: Location[]` (160 records, each with `slug, name, state, stateSlug, nearbyMap[]`) and a helper `getLocationBySlug(slug)`.
- Location page calls `generateStaticParams()` from this array → emits 480 pages (3 locales × 160 slugs).
- Page body reads `getLocationBySlug(params.location)` → loads unique copy block from `messages/<locale>.json` keyed by slug (Nana supplies a unique intro + FAQ per location; locations that share generic state-level copy use a fallback key but headings/keywords stay location-specific).
- Nearby links rendered from `nearbyMap[]`, linking to `/[locale]/pakej-katering/<nearby-slug>`.

### 3.6 next-intl message loading

- `middleware.ts` rewrites bare URLs to include a locale prefix.
- `i18n/request.ts` resolves locale from the URL and dynamically imports `messages/<locale>.json`.
- `app/[locale]/layout.tsx` wraps children in `<NextIntlClientProvider messages={messages}>`.
- Locale switching via `<LanguageSwitcher>` preserves the current path while swapping the prefix (e.g. `/ms/pakej-katering/seremban` → `/zh/pakej-katering/seremban`).

---

## 4. Database Requirements (for Cyclops)

All rows scoped by `website = 'auntyrokiah-katering.utopiaai.my'`. Use existing tables — DO NOT add new ones.

| Table | Rows to seed | Critical columns |
|------|-------------|------------------|
| `companies` | (exists) | already has Kak Kenduri Sdn. Bhd. UUID `ce95071b-e575-4983-bdd4-66910f45fe34` |
| `company_websites` | 1 | `company_id = ce95071b-...`, `domain = 'auntyrokiah-katering.utopiaai.my'`, `leads_mode = 'single'` |
| `phone_numbers` | 1 | `website = 'auntyrokiah-katering.utopiaai.my'`, `location_slug = 'all'` (literal string — NOT NULL), `phone_number = '60174287801'`, `label = 'default'`, `type = 'default'`, `is_active = true`, `whatsapp_text = 'Hi, saya berminat dengan Pakej Katering AuntyRokiah...'`, `percentage = 100` |
| `products` | 4 | rows below |
| `product_photos` | ≥1 per product | `product_id` FK, `url` (pexels/unsplash/Supabase storage, no watermarks) |
| `blog_posts` | ≥10 | `website`, `slug`, `cover_image_url`, `published_at`, `status='published'` |
| `blog_translations` | ≥30 (10 posts × 3 locales) | FK `blog_post_id`, `language` ∈ {ms,en,zh}, `title`, `content` (HTML), `excerpt`, `meta_title`, `meta_description` |

**Products to insert** (source: `inputs.md`):

| sort_order | slug | name (MS) | sale_price | rental_price | notes |
|---:|---|---|---:|---:|---|
| 1 | `pakej-jimat` | Pakej Katering Jimat | 15 | null | Best Seller — Nasi Minyak, Ayam Merah, Acar Timun, Papadom |
| 2 | `pakej-standard` | Pakej Katering Standard | 21 | null | + Daging Hitam |
| 3 | `pakej-premium` | Pakej Katering Premium | 25 | null | + Buah, Kuih |
| 4 | `add-on-air-balang` | Add-on Air Balang | 80 | null | RM80 / 1 balang per 50 pax — Oren / Sirap / Anggur. `parent_id` = NULL (standalone add-on row). UI separates via `getProducts()` returning it in `additional` if a price/parent heuristic identifies it; otherwise render in a clearly-labelled "Add-on" subgrid. |

**Schema rules (already established by past projects — Cyclops must verify before insert):**
- `phone_numbers.website` is a column name; do **not** use `website_slug`.
- Default phone row uses `location_slug = 'all'` (literal), **never** NULL.
- All FKs cascade-delete on `products` → `product_photos` and `blog_posts` → `blog_translations`.
- `blog_translations.language` is the lowercase locale code (`ms`, `en`, `zh`).

---

## 5. SEO Structure (for Sora)

### 5.1 Keyword targets (every location page must own these stems)
- Primary: `pakej katering [location]`, `katering kenduri [location]`, `catering [location]`, `catering Malaysia` (only on homepage / generic content)
- Use-case combos (drive long-tail intent): `katering kenduri kahwin [location]`, `katering aqiqah [location]`, `katering doa selamat [location]`, `katering rumah terbuka [location]`, `minum petang katering [location]`, `corporate catering [location]`, `katering majlis tahlil [location]`, `nasi minyak [location]`
- English equivalents on `en` pages: `catering services in [location]`, `wedding catering [location]`, `aqiqah catering [location]`, etc.
- Mandarin equivalents on `zh` pages: 马来婚宴餐饮 / 餐饮配套 [城市] (Sora confirms final phrasing).

### 5.2 Page hierarchy

```
/[locale]                                       ← brand + nationwide pakej landing
  ├─ /[locale]/pakej-katering/<location>        ← 160 location-specific landing pages
  ├─ /[locale]/blog                              ← topical authority hub
  │   └─ /[locale]/blog/<slug>                  ← 10+ articles linking back to homepage + locations
  └─ /[locale]/redirect-whatsapp-1              ← noindex (robots meta + sitemap exclusion)
```

### 5.3 hreflang

Every page emits hreflang alternates for `ms-MY`, `en-MY`, `zh-MY`, plus `x-default = ms-MY` (default locale). Implemented via `generateMetadata` → `alternates.languages` and a `<link rel="alternate" hreflang="...">` for each version. URL pattern: `https://auntyrokiah-katering.utopiaai.my/<locale>/...`.

### 5.4 Internal link map
- Homepage → all 16 state hub anchors → ≥10 location pages per state via the Locations section.
- Each location page → 3–4 nearby locations (via `nearbyMap`), the homepage breadcrumb, and 2 contextual blog articles.
- Blog post → 2 product anchors + 1–2 location anchors (Hanabi enforces).
- Footer mini-map: top 12 marquee cities + state index links.

### 5.5 Per-page meta requirements
- Unique `<title>` and `<meta name="description">` on every page in every locale.
- Schema: Organization (locale layout), Product (homepage + location pages, one per pakej), FAQPage (homepage + locations), LocalBusiness (each location page, `areaServed` = location name), BreadcrumbList (location + blog post pages).

---

## 6. i18n Requirements (for Kimmy)

| Setting | Value |
|--------|-------|
| Library | `next-intl@4` |
| Locales | `['ms', 'en', 'zh']` |
| Default locale | `'ms'` |
| `localePrefix` | `'always'` (every URL carries `/ms/`, `/en/`, or `/zh/`) |
| Routing file | `i18n/routing.ts` exports `routing` from `defineRouting(...)` |
| Request resolution | `i18n/request.ts` uses `getRequestConfig` and dynamic-imports `messages/<locale>.json` |
| Middleware matcher | `['/((?!api|_next|_vercel|.*\\..*).*)' ]` (so `/api/revalidate` is NEVER rewritten) |
| Provider | `<NextIntlClientProvider messages={messages}>` in `app/[locale]/layout.tsx` |
| Language switcher | `components/LanguageSwitcher.tsx` — preserves path, swaps prefix, accessible via keyboard, mobile-friendly |

**Message file sections (each locale gets all of these):**
- `nav` — logo aria, primary links, CTA button label
- `fomo` — countdown copy + offer line
- `hero` — H1, H2 subtitle, CTA, USP eyebrow
- `usp` — 3 cards: icon name, title, 1-line body
- `brandStrip` — eyebrow + 4–8 partner / certification logo labels
- `products` — section eyebrow, H3 heading, pakej-specific labels (badge text, price suffix, CTA)
- `special` — section eyebrow, H3, copy for the chosen bespoke section (see Section 7)
- `process` — eyebrow, H3, 4 step labels + descriptions
- `reviews` — eyebrow, H3, "Posted on Google" label, aggregate badge
- `gallery` — eyebrow, H3, alt text array
- `faq` — eyebrow, H3, Q/A pairs (≥6 on homepage, ≥4 on each location page)
- `locations` — eyebrow, H3, state-group labels, "view all" copy
- `finalCta` — eyebrow, H3, body, button
- `footer` — eyebrow, columns, legal line
- `blog` — listing/post strings (title, readMore, breadcrumbHome, breadcrumbBlog, publishedOn, minRead, recentPosts, metaTitle, metaDescription, ctaBanner)
- `redirect` — "Opening WhatsApp…" / "Click here if it did not open"
- `locationSeo` — slug-keyed entries with per-location intro, FAQs, meta

Default copy is **Bahasa Melayu**. EN and ZH are full localisations, not stubs.

---

## 7. Technical Decisions

### 7.1 Stack
- **Framework:** Next.js 15 (App Router) — Server Components by default; only `*Client.tsx` files run on the client.
- **Styling:** Tailwind CSS 4 (`@tailwindcss/postcss`). Brand palette wired as CSS vars in `globals.css`.
- **i18n:** `next-intl@4` with `defineRouting` + `getRequestConfig`.
- **Database:** Supabase (shared instance). Reads via **`fetch()` + `next.tags`** through `lib/webcore.ts` — never via the JS client on read paths.
- **Hosting:** Vercel. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or unprefixed equivalents) + `WEBCORE_REVALIDATE_SECRET` set on the project before first deploy.
- **Analytics:** Utopia Webcore tracking — `<script defer src="https://webcore.utopiaai.my/t.js" data-website="auntyrokiah-katering.utopiaai.my">` inside `<head>` of `app/[locale]/layout.tsx`. `window.uwc` typed in `global.d.ts`.
- **Fonts:** **Plus Jakarta Sans** (display: H1–H4, eyebrows in JetBrains Mono is allowed for tags/timer) + **Inter** (body). Both loaded via `next/font/google` with `display: 'swap'`. No serif anywhere.

### 7.2 Brand palette (from the logo)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Site background base (CLAUDE.md mandates **white**, not cream — cream is an accent only) |
| `--cream` | `#FAF3E5` | Optional warm panel for select sections (hero stripe, brand strip) |
| `--turmeric` | `#E89A2C` | Primary brand accent (CTAs, eyebrows pill, highlights) |
| `--spice-orange` | `#D9742A` | Secondary brand accent, hover state on primary |
| `--charcoal` | `#1F1A17` | Body text + H1/H2 |
| `--ink` | `#3C3531` | Secondary text |
| `--sambal` | `#C9252C` | FOMO bar background ONLY (urgency) |
| `--wa-green` | `#25D366` | WhatsApp CTAs ONLY |
| `--wa-green-hover` | `#1EBE57` | WhatsApp hover state |
| `--google-yellow` | `#FBBC04` | 5-star rating row |

No default Tailwind blue/indigo anywhere. Buttons share **one rounded shape** site-wide; only fill colour changes between primary (turmeric), secondary (charcoal outline), and WhatsApp (`#25D366`).

### 7.3 Section order (HOMEPAGE and EVERY LOCATION PAGE must render in this exact order)

1. **FOMO Banner** — sticky top, **red (`--sambal`) or black** background, live HH:MM:SS countdown (resets daily or to a fixed promo deadline), white text. Mandatory countdown ticker.
2. **Hero** — image background (kenduri spread / nasi minyak hero shot) + gradient overlay. **H1** = brand promise with primary keyword, **H2** = supporting subtitle. Single WhatsApp CTA (green). Logo crest free-floating (no card / rectangle) since the logo is a transparent crest.
3. **USP Bar** — 3 equal-width cards immediately below hero. **No section heading.** Each card has a tinted icon pill (turmeric ring or gradient), title, one-line body. Mobile center-aligned.
4. **Brand / Collaborator Logo Strip** — 4–8 muted-grayscale logos (e.g. "Featured in Harian Metro", "JAKIM-compliant supplier", supplier marks, halal cert) with hover-to-colour. Eyebrow above heading-free strip (eyebrow only, no H-level heading).
5. **Products / Pakej Catalogue** — dynamic grid from `webcore.getProducts()`. CSS grid auto-fill `repeat(auto-fill, minmax(280px, 1fr))`. Cards: image (`object-fit: cover`), title H4, 2-line clamped description, price, single rounded CTA pinning to the bottom via flex. Air Balang add-on rendered in a sibling "Add-on" sub-grid with its own eyebrow + H4.
6. **Special Section (BESPOKE — required)** — chosen for catering: **"Pilih Pakej Anda" guest-count → pakej recommender** (input field for jumlah tetamu → reactively recommends Jimat / Standard / Premium + shows total estimate). Sits in a turmeric-tinted panel between Products and Process. Eyebrow + H3. Alternative if dev complexity is too high: a **"Kenduri Use-Case Tabs"** module — Kenduri Kahwin / Aqiqah / Doa Selamat / Corporate — each tab swaps a curated lifestyle photo + 1-line caption + recommended pakej. Kagura picks ONE; the architecture requires one to exist.
7. **Process / How It Works** — 4 steps (Tempah → Sahkan Tarikh → Kami Hantar & Hidang → Anda Nikmati Majlis). Each step under its own H4 with eyebrow on the section header.
8. **Customer Reviews (Google treatment)** — H3 + aggregate "4.9 / 5 on Google Reviews" badge. Each card has the full-colour Google "G" mark top-right, reviewer name, "Posted on Google" label, 5-star row in `--google-yellow`, review body.
9. **Customer Gallery** — even-grid (3 / 4 / 6 cols depending on count) — **no blank slots, no half-empty last row**. Re-check at every breakpoint.
10. **FAQ** — eyebrow + H3, accordion of ≥6 Q/A. FAQPage schema. Each Q is its own H4.
11. **Locations** — eyebrow + H3, then state-grouped lists (Kuala Lumpur, Selangor, Johor, …) linking to `/[locale]/pakej-katering/<slug>`. On location pages this section emphasises **Nearby Locations** above the full state grid.
12. **Final CTA** — image background, eyebrow + H3, body, WhatsApp CTA (green).
13. **Footer** — eyebrow above each column heading, brand crest, quick links, locations index, blog, legal. **No visible phone number, no visible domain text.**

**Location pages add — but never omit:**
- Breadcrumb (`Home > Pakej Katering > <Location>`) above the Hero — visually subtle, schema present.
- Nearby Locations module inside the Locations section (top of that section, before the full state list).
- All headings (H1, H2, FAQs, etc.) include the location name to keep copy unique per slug (Nana writes per-location intros + FAQs).

### 7.4 Layout ownership (enforced)

- `app/[locale]/layout.tsx` renders ONLY: `<html>`, `<head>` (font links + tracking script), `<body>`, `<NextIntlClientProvider>`, `<OrganizationSchema />`, `{children}`. **No header, no footer, no nav.**
- Each page (`page.tsx` for homepage, blog listing, blog post, location) renders its own inline nav + footer. This prevents the double-render bug seen in prior projects.
- `components/PageShell.tsx` provides shared visual primitives (gradient backgrounds, eyebrow component, button component) but **does not** wrap pages in a header/footer chrome.

### 7.5 Anti-generic guardrails specific to this project

- **No flat shadows** — use layered, turmeric-tinted shadows on hero, product cards, and special section panel.
- **Animations** only on `transform` / `opacity` — never `transition-all`.
- **Hover, focus, active** states present on every interactive element (CTAs, cards, gallery items, language switcher, FAQ accordion).
- **Image realism** — only high-resolution, watermark-free Malaysian / Asian catering imagery (Pexels / Unsplash / brand-owned). Verify every hero, gallery, special-section, and product photo before Gate 1.
- **Mobile-first** — primary viewport is mobile. Headings, buttons, USP cards, icons center-aligned on mobile; body text may be left-aligned.
- **Tracking labels** (already enforced by code):
  - WhatsApp click → `whatsapp-<phone>`
  - Product impression → `product-<slug>` (IntersectionObserver, fires once)
  - Blog click → `blog-<slug>`

### 7.6 Deployment / env binding

1. `vercel link` the project to a new Vercel project named `auntyrokiah-katering`.
2. `vercel env add NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `WEBCORE_REVALIDATE_SECRET` for Production + Preview.
3. Add the custom domain `auntyrokiah-katering.utopiaai.my` in Vercel; configure DNS at `utopiaai.my` zone.
4. First deploy. Then point the Webcore admin Integrations panel at `https://auntyrokiah-katering.utopiaai.my/api/revalidate` with the same secret.
5. Smoke-test:
   ```
   curl -i -X POST https://auntyrokiah-katering.utopiaai.my/api/revalidate \
     -H "x-webcore-secret: <SECRET>" -H "content-type: application/json" \
     -d '{"tags":["webcore-products"]}'
   ```
   Expect `200 {"revalidated":["webcore-products"]}`.

---

## 8. Hand-off Map

| Agent | Consumes from this doc | Produces |
|---|---|---|
| Cyclops | Section 4 (Database Requirements) — products list, schema constraints, website domain string | `database.md` + executable SQL seeds |
| Sora | Section 5 (SEO Structure) — keyword stems, hierarchy, hreflang, link map | `seo-plan.md` |
| Nana | Sections 5 + 7.3 — section order, per-page headings/eyebrows, locales | `copy-homepage.md`, `copy-locations.md` (unique copy for all 160 × 3) |
| Kagura | Section 7.2 palette + 7.3 section order + special section choice | `design-direction.md` (visual system, mood, special-section pick) |
| Kimmy | Section 6 (i18n) + Sections 5/7 (schema, tracking, WA redirect) | `technical-seo-i18n.md` (implementation tickets) |
| Hanabi | Section 2 blog routes + Section 5 keyword stems + Section 4 blog tables | ≥10 articles inserted into `blog_posts` + `blog_translations` in MS/EN/ZH |
| Layla | Section 4 phone/company_websites + Section 7.6 deploy steps | Production deploy + smoke tests |

No item in this document is "TBD". Anything not explicitly delegated above is governed by `CLAUDE.md`.
