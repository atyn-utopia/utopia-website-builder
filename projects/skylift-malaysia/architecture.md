# Architecture — Skylift Malaysia

> System architect: **Alpha**
> Project slug: `skylift-malaysia`
> Domain: `skylift-malaysia.vercel.app`
> Company: Scaffolding Malaysia Sdn. Bhd. (`7c15d93f-c2f7-488d-b38c-4b85d65a06d1`)
> Reference baseline: `projects/electrician-24-hour/`

This document is the single source of truth for `skylift-malaysia`. Every downstream agent (Cyclops, Sora, Nana, Kagura, Kimmy, Hanabi, Layla) must build on top of what is defined here. Do not deviate without an architecture revision.

---

## 1. Folder & Routing Structure

The project lives at `projects/skylift-malaysia/` and follows the Utopia Webcore layout (Next.js 15 App Router + next-intl 4 + Tailwind 4 + shared Supabase).

```
projects/skylift-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              ← locale layout (fonts, tracking, NextIntlClientProvider, OrganizationSchema)
│   │   │                             ── MUST NOT contain header/footer (see Layout-ownership rule)
│   │   ├── page.tsx                ← homepage (server) — renders the full section stack
│   │   ├── HomePageClient.tsx      ← homepage client interactions (FOMO countdown, gallery, etc.)
│   │   ├── skylift/
│   │   │   └── [location]/
│   │   │       ├── page.tsx        ← location page (server, ISR)
│   │   │       └── LocationPageClient.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx            ← blog listing (Hanabi-driven content)
│   │   │   └── [slug]/page.tsx     ← blog post detail
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx            ← WhatsApp redirect (server, force-dynamic)
│   │       └── RedirectClient.tsx
│   ├── api/
│   │   └── phones/route.ts         ← phone number JSON endpoint (debug/diagnostic only)
│   ├── globals.css                 ← Tailwind 4 layer + design tokens + .blog-content styles
│   ├── layout.tsx                  ← root layout (minimal; just <html><body>{children})
│   ├── icon.svg                    ← favicon — MUST reuse the icon mark from the Skylift Malaysia logo
│   ├── robots.ts                   ← /robots.txt
│   └── sitemap.ts                  ← /sitemap.xml (homepage + 5 product anchors + ~165 location pages × 3 locales + blog × 3 locales)
├── components/
│   ├── BlogNav.tsx
│   ├── BlogFooter.tsx
│   ├── LanguageSwitcher.tsx        ← EN / MS / ZH
│   └── schema/
│       ├── BreadcrumbSchema.tsx
│       ├── FAQSchema.tsx
│       ├── LocalBusinessSchema.tsx
│       ├── OrganizationSchema.tsx
│       └── ProductSchema.tsx       ← also used for the Service / Rental Skylift unit schema
├── config/
│   ├── site.ts                     ← brand, domain, tagline, productSlug=skylift, locales
│   └── locations.ts                ← all 13 Malaysia states, ≥10 sub-locations each, 150–180 total
├── i18n/
│   ├── routing.ts                  ← locales=['en','ms','zh'], defaultLocale='en', localePrefix='always'
│   └── request.ts                  ← per-request locale + messages loader
├── lib/
│   ├── supabase.ts                 ← shared singleton client
│   ├── getPhoneNumber.ts           ← all 4 leads modes; project starts in `single` mode
│   ├── getBlogPosts.ts             ← WEBSITE = 'skylift-malaysia.vercel.app'
│   └── waRedirect.ts               ← `/{locale}/redirect-whatsapp-1?loc={slug}` builder
├── messages/
│   ├── en.json
│   ├── ms.json
│   └── zh.json
├── brand_assets/
│   ├── pasted-image-1777340424136.png   ← hero photo (transparent cutout, female site supervisor)
│   └── pasted-image-1777340430396.png
├── middleware.ts                   ← next-intl middleware
├── next.config.ts                  ← loadEnvConfig from repo root + createNextIntlPlugin
├── postcss.config.mjs
├── tsconfig.json
├── global.d.ts                     ← `window.uwc` declaration for tracking
├── package.json                    ← dev script on a unique port (e.g. 3010)
└── .env.local → ../../.env.local   ← symlink to shared Supabase credentials
```

### MANDATORY layout-ownership rule (Alpha enforcement)
`app/[locale]/layout.tsx` **must NOT contain a header/nav/FOMO bar or a footer**. It is responsible only for:
- `<html lang>` + `<body>` shell
- Font loading
- Utopia Webcore tracking script
- `NextIntlClientProvider`
- `OrganizationSchema`

Each page component (`page.tsx` for the homepage, `[location]/page.tsx` for location pages, `blog/page.tsx`, `blog/[slug]/page.tsx`) **owns its own FOMO banner, navigation, and footer inline**. This prevents duplicate rendering, double-mounted listeners, and locale-prefix bugs in nav links.

### MANDATORY page-layout-parity rule (Alpha enforcement)
The homepage and every location page must render the **identical section order** (listed in §2 below). Location pages may **add** Breadcrumbs and a Nearby Locations module, but must not omit any homepage section, reorder sections, or rename them. Kagura and Kimmy are bound by this rule.

---

## 2. Page Inventory

### 2.1 Homepage — `/[locale]`
Three pages total: `/en`, `/ms`, `/zh`.

**Mandatory section order (Kagura/Kimmy must follow exactly):**

1. **FOMO Banner** — sticky top, red or black background, white text, live countdown (HH:MM:SS) ticking down to end-of-day promo
2. **Nav** — logo + EN/MS/ZH switcher + WhatsApp CTA (`#25D366`)
3. **Hero** — single H1 + single H2; transparent-cutout supervisor photo placed freely (no card / box / shadow panel behind the cutout); WhatsApp CTA in green
4. **USP Bar (3-point)** — immediately below the hero, mandatory:
   1. Daily Rate from RM500
   2. Same-Day Delivery (KL/Selangor)
   3. Trained Operator Included
5. **Products** — dynamic grid from Supabase (`products` WHERE website = domain AND is_active = true ORDER BY sort_order), 5 units (9m / 20m / 24m / 32m / Spider) joined with `product_photos`
6. **How It Works** — 3–4 step booking flow ending in WhatsApp tempahan
7. **Risk / Problem** — what goes wrong without proper skylift / certified operator
8. **Mid CTA** — image-background section with overlay + WhatsApp green CTA
9. **Google Reviews** — testimonial cards (image background allowed)
10. **Why Choose** — differentiators (Klang Valley fleet size, certified operators, insurance, MOSHA compliance, etc.)
11. **Gallery** — Customer Gallery grid (16+ project photos). Column count must evenly divide image count — never leave a blank slot at any breakpoint
12. **Locations Accordion** — collapsible by state (13 states), revealing all sub-location links
13. **FAQ** — common questions, FAQSchema injected
14. **Final CTA** — image-background section with overlay + WhatsApp green CTA
15. **Footer** — brand, locale switcher, locations link, blog link, copyright. **No phone number, no domain text** anywhere visible.

### 2.2 Location pages — `/[locale]/skylift/[location]`
~150–180 sub-locations × 3 locales ⇒ ~450–540 location pages.

Same 15-section stack as homepage, with two **additions** (no removals, no reordering):
- **Breadcrumb** (after Nav, before Hero) — Home › Skylift › {Location}
- **Nearby Locations** (after Locations Accordion, before FAQ) — internal links to neighbouring sub-locations from `nearbyMap`

Each location page must have unique copy (hero title, intro paragraph, FAQ phrasing, location-specific keywords). Nana owns this. WhatsApp CTAs include `?loc={slug}` so `getPhoneNumber` can route correctly when the website later switches to `location` or `hybrid` leads mode.

### 2.3 Blog pages
- `/[locale]/blog` — listing, auto-fill grid `minmax(340px, 1fr)`, layout matches `electric-wheelchair-malaysia` reference
- `/[locale]/blog/[slug]` — article page with breadcrumb, max-740px article column, sticky recent-posts sidebar, table of contents, WhatsApp green CTA banner at bottom

### 2.4 Utility routes
- `/[locale]/redirect-whatsapp-1?loc={slug}` — server component resolves phone via `getPhoneNumber`, hands off to `RedirectClient` which `window.location.href`s the `wa.me` URL
- `/api/phones` — diagnostic JSON endpoint for the current website + leads mode (not user-facing)
- `/robots.txt`, `/sitemap.xml`

---

## 3. Data Flow

### 3.1 Phone numbers (Supabase → page → WhatsApp)
1. User clicks any WhatsApp CTA → navigates to `/{locale}/redirect-whatsapp-1?loc={slug?}`
2. Server reads `host` from request headers (will be `skylift-malaysia.vercel.app` in production)
3. Reads `leads_mode` from `company_websites` WHERE `domain = host` → starts as `'single'`
4. Reads active rows from `phone_numbers` WHERE `website = host` AND `is_active = true`
5. Applies leads-mode logic (`single` / `rotation` / `location` / `hybrid`)
6. Builds `https://wa.me/{phone}?text={whatsapp_text}` and redirects on the client
7. **Fallback**: if Supabase is unreachable, `lib/getPhoneNumber.ts` falls back to `60139499318` with a default WA text

### 3.2 Products (Supabase → ISR → grid)
- Homepage and every location page query `products` WHERE `website = 'skylift-malaysia.vercel.app'` AND `is_active = true` ORDER BY `sort_order`, joined with `product_photos.url`
- 5 starter rows: 9m Skylift, 20m Skylift, 24m Skylift, 32m Skylift, Spider Skylift
- ISR `revalidate = 3600` — adding/disabling a product propagates within 1 hour without redeploy
- Grid is responsive auto-fit; must render correctly at 1, 5, or 20 products
- **Never hardcode** product data in `config/`. `config/products.ts` may exist only as a Supabase-down fallback.

### 3.3 Locations → static params
- `config/locations.ts` is the single source of truth for routing
- `generateStaticParams` emits one entry per location for `/[locale]/skylift/[location]`
- `sitemap.ts` emits the same list × 3 locales + homepage + blog routes
- `nearbyMap` (state-grouped) drives the "Nearby Locations" module on each location page

### 3.4 Translations (next-intl)
- `i18n/routing.ts` declares `locales = ['en','ms','zh']`, `defaultLocale = 'en'`, `localePrefix = 'always'`
- `i18n/request.ts` resolves the active locale per request and lazy-imports `messages/{locale}.json`
- `middleware.ts` rewrites/redirects bare paths to the locale-prefixed equivalents
- Every page reads strings via `useTranslations` (client) or `getTranslations` (server). No hardcoded English text.

### 3.5 ISR / revalidation strategy
- Homepage + location pages + blog pages: `export const revalidate = 3600;` (1 hour)
- WhatsApp redirect: `export const dynamic = 'force-dynamic';` (must always pull live phone data)
- Sitemap: regenerated on each request (cheap; reflects new locations / blog posts immediately)

### 3.6 Tracking flow
- Tracking script in `[locale]/layout.tsx` `<head>` with `data-website="skylift-malaysia.vercel.app"`
- WhatsApp click: `window.uwc('click', { label: 'whatsapp-{phone}' })` fired before navigation
- Product card impression (IntersectionObserver, fire-once): `window.uwc('impression', { label: 'product-{slug}' })`
- Blog article click (on listing): `window.uwc('click', { label: 'blog-{slug}' })`

---

## 4. Database Requirements (handed to Cyclops)

Cyclops designs/seeds. Alpha only specifies what is needed.

### 4.1 Tables already in shared DB — Cyclops verifies + uses
- `company_websites` — needs one row: `company_id = '7c15d93f-c2f7-488d-b38c-4b85d65a06d1'`, `domain = 'skylift-malaysia.vercel.app'`, `leads_mode = 'single'`
- `phone_numbers` — needs one default row: `website = 'skylift-malaysia.vercel.app'`, `location_slug = 'all'`, `phone_number = '60139499318'`, `label = 'default'`, `type = 'default'`, `is_active = true`, `whatsapp_text = "Hi, saya berminat sewa skylift…"`, `percentage = 100`
- `products` — 5 rental units (9m / 20m / 24m / 32m / Spider), all scoped to `website = 'skylift-malaysia.vercel.app'`, with `rental_price` populated (use the half-day / full-day rates from inputs.md as guidance), `sort_order` ascending in the same order, `is_active = true`
- `product_photos` — at least one `url` per product (Pexels / Unsplash, Asian/Malaysian construction context)
- `blog_posts` + `blog_translations` — Hanabi inserts ≥10 articles × 3 locales

### 4.2 Required column reference (from CLAUDE.md and live schema)
- `phone_numbers.website` (not `website_slug`); default row uses `location_slug = 'all'` (not `null`)
- `products.website` (not `website_slug`); join `product_photos.product_id`
- `blog_posts.website`; translations keyed via `blog_post_id` + `locale`

### 4.3 Cyclops deliverables
1. `database.md` — schema confirmation + the SQL seed scripts for the 4 inserts above
2. Verification queries (count of products, phone rows, company_websites row, blog rows) before Layla deploys

---

## 5. SEO Requirements (handed to Sora)

Sora plans the keyword strategy. Alpha only lists the requirements.

### 5.1 Keyword targets (must be researched/refined by Sora)
- Primary product: **skylift rental Malaysia**, **sewa skylift**, **skylift sewa murah**
- Mandarin variants for `zh` locale
- Per-unit: 9m skylift sewa, 20m skylift rental, 24m skylift sewa, 32m skylift rental, spider skylift rental
- Use-case: skylift untuk billboard / lampu jalan / atap / aircond servicing / stadium lights / tree trimming
- Location modifiers: every sub-location (e.g. "skylift rental Petaling Jaya", "sewa skylift Johor Bahru")

### 5.2 Page hierarchy
- Tier 1: Homepage (broadest "skylift Malaysia" intent)
- Tier 2: Product anchors on the homepage (5 units) — each must surface its own H3 and copy block
- Tier 3: Location pages (`/skylift/[location]`) — long-tail commercial intent
- Tier 4: Blog posts — informational + supporting links into Tier 1–3

### 5.3 Internal linking
- Every location page links back to the homepage and to ≥3 nearby locations (from `nearbyMap`)
- Homepage Locations Accordion links to all sub-locations grouped by state
- Blog posts contain ≥1 contextual link to a relevant product anchor and ≥1 contextual link to a relevant location page

### 5.4 hreflang + canonical
- `hreflang` alternates emitted for `en` / `ms` / `zh` on every page (and `x-default = en`)
- Canonical = self URL (locale-prefixed)

### 5.5 Schema markup
- `OrganizationSchema` — site-wide (in `[locale]/layout.tsx`)
- `ProductSchema` — per skylift unit on homepage (5 instances)
- `LocalBusinessSchema` — every location page
- `BreadcrumbSchema` — every location page + every blog post
- `FAQSchema` — homepage + every location page (location-specific Q&A)

### 5.6 Sora deliverables
1. `seo-plan.md` — keyword map, per-page H1/H2/title/description targets, internal-linking matrix, FAQ topic shortlist, hreflang plan

---

## 6. i18n Requirements (handed to Kimmy)

### 6.1 Confirmed locales
- `en` — English (default)
- `ms` — Bahasa Melayu
- `zh` — Mandarin (Simplified, audience: Malaysian Chinese)

### 6.2 Routing
- Library: `next-intl` v4
- `localePrefix: 'always'` — every URL is prefixed (`/en`, `/ms`, `/zh`)
- Default locale: `en`
- Middleware redirects bare `/foo` to `/en/foo`

### 6.3 Translation files
`messages/{en,ms,zh}.json` — Kimmy provides full coverage for the section keys:
`fomo`, `nav`, `hero`, `usp`, `products`, `howItWorks`, `risk`, `midCta`, `reviews`, `whyChoose`, `gallery`, `locations`, `faq`, `finalCta`, `footer`, `breadcrumb` (location pages), `nearby` (location pages), `blog` (listing + post labels: `title`, `readMore`, `noPosts`, `breadcrumbHome`, `breadcrumbBlog`, `publishedOn`, `minRead`, `recentPosts`, `metaTitle`, `metaDescription`).

Nana writes the actual copy strings; Kimmy wires them in.

### 6.4 Localized SEO
- `<title>` and `<meta name="description">` localized per page per locale
- `og:title`, `og:description`, `og:locale`, `og:locale:alternate` reflect the active locale
- `LanguageSwitcher` keeps the user on the same path when switching locales

---

## 7. Technical Decisions

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 15 (App Router, TypeScript) | Same baseline as `electrician-24-hour` |
| Styling | Tailwind CSS 4 + design tokens in `globals.css` | Custom brand palette (no default Tailwind blue/indigo) |
| i18n | next-intl 4 | `localePrefix: 'always'` |
| Database | Shared Supabase | Distinguished by `website = 'skylift-malaysia.vercel.app'` column |
| Env loading | `loadEnvConfig(process.cwd() + '/../..')` in `next.config.ts` | Reads `/.env.local` at repo root via symlink |
| Deployment | Vercel | Domain `skylift-malaysia.vercel.app`; same env vars added via `vercel env add` |
| Tracking | Utopia Webcore (`https://utopia-webcore.vercel.app/t.js`) | `data-website` MUST equal `skylift-malaysia.vercel.app` |
| ISR | `revalidate = 3600` site-wide | WhatsApp redirect remains `force-dynamic` |
| Leads mode | `single` at launch | Architecture supports later switch to `rotation` / `location` / `hybrid` with no code changes |
| Dev port | Use a unique port (e.g. `3010`) | Avoid clashing with sibling projects |

### 7.1 Brand decisions baked into the architecture
- **Hero treatment:** the supplied PNG is a transparent cutout — the architecture forbids wrapping it in any container, card, shadow box, or coloured panel. Place freely in the hero canvas (per CLAUDE.md hero-photo rule).
- **WhatsApp CTAs only:** no phone numbers or domain text anywhere on the rendered site. The phone number lives in Supabase and is only used inside the `wa.me` redirect URL.
- **Button shape:** one rounded button shape across the entire site; only the colour varies (primary yellow, dark, WhatsApp green for WhatsApp CTAs only).
- **Heading hierarchy:** every page lints to **exactly one H1 and exactly one H2**, both inside the hero. All other section titles are H3–H6.
- **FOMO banner:** sticky top, red or black background, live HH:MM:SS countdown, white/light text. Never brand-yellow.
- **Customer gallery:** column count must evenly divide image count at every breakpoint — no blank cells.

### 7.2 Locations strategy (handed to Sora to populate `config/locations.ts`)
13 Malaysian states × ≥10 sub-locations each, total **150–180** locations. Use the structural shape from `electrician-24-hour/config/locations.ts` (`{ slug, name, state, stateSlug }` + `nearbyMap`). States to cover:

Kuala Lumpur, Selangor, Putrajaya, Penang, Johor, Kedah, Negeri Sembilan, Melaka, Pahang, Perak, Terengganu, Kelantan, Perlis.

Klang Valley grouping is acceptable (as in the baseline), provided Kuala Lumpur, Selangor and Putrajaya sub-locations remain reachable from the locations accordion. Every sub-location must be a real, populated town/suburb (no inventions) and must appear in both `generateStaticParams` and `sitemap.ts`.

### 7.3 Open items / blockers
- **None blocking.** All inputs (company, domain, phone, languages, products, hero asset, palette, USPs) are confirmed in `inputs.md`.
- Sora must finalise the exact 150–180 location list before Nana writes location copy.
- Kagura's design direction must respect the industrial-yellow + charcoal palette and the transparent-cutout hero rule.

---

## Section-order quick reference (for Kagura + Kimmy)

> **Homepage and location pages render this exact order, top to bottom:**
>
> FOMO Banner → Nav → Hero → USP Bar (3-point) → Products → How It Works → Risk/Problem → Mid CTA → Google Reviews → Why Choose → Gallery → Locations Accordion → FAQ → Final CTA → Footer
>
> Location pages additionally insert **Breadcrumb** between Nav and Hero, and **Nearby Locations** between Locations Accordion and FAQ. No other deviations.
