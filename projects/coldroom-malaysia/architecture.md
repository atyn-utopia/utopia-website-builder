# Architecture: coldroom-malaysia

Agent: Alpha — System Architect
Status: Complete
Next: Cyclops (Database) + Sora (SEO) — run in parallel

---

## Site Purpose

A Malaysian cold room rental SEO website covering the **13 Peninsular Malaysia states** with **150–180 sub-locations**. The business is **rental-led, cold-chain logistics-emphasised, and HALAL-compliant**, owned by **Cold Truck Malaysia Sdn. Bhd.** (parent company also offering cold truck rental as a cross-sell).

### Key Business Lines
1. Cold room rental (per-pallet/day, per-box/day, per-cubic-meter pricing)
2. 4 temperature tiers (frozen / freezer / chiller / cool storage)
3. Cold-chain logistics + same-day delivery
4. Cold truck rental cross-sell (parent-company synergy)

### Confirmed Project Inputs
| Field | Value |
|-------|-------|
| Project slug | `coldroom-malaysia` |
| Company | Cold Truck Malaysia Sdn. Bhd. |
| Company UUID | `99e92ff1-d776-4154-9346-426e3cb91936` |
| Product name | Cold Room Rental |
| Product slug | `cold-room` |
| Brand name | Cold Room Malaysia |
| Tagline | Refrigerated Cold Room Delivery & Rental Malaysia |
| Domain | `coldroom-malaysia.vercel.app` |
| Site URL | `https://coldroom-malaysia.vercel.app` |
| Languages | `en` (default), `ms`, `zh` |
| Phone | `60192799832` |
| Leads mode | `single` |
| Default WA text | `Hi, saya berminat dengan Cold Room Rental. Boleh saya dapatkan info lanjut?` |
| Reference site | https://www.coldroommalaysia.com.my/ |

---

## 1. Folder & Routing Structure

### URL Structure (with i18n, prefix-always)

```
/en                                              → English homepage
/ms                                              → Bahasa Melayu homepage
/zh                                              → Mandarin homepage
/en/cold-room/kuala-lumpur                       → English location page
/ms/cold-room/petaling-jaya                      → Malay location page
/zh/cold-room/johor-bahru                        → Mandarin location page
/en/blog                                         → English blog listing
/en/blog/[slug]                                  → English blog post
/ms/blog, /zh/blog, etc.                         → same per locale
/en/redirect-whatsapp-1?loc=[slug]               → WhatsApp redirect (English)
/ms/redirect-whatsapp-1, /zh/redirect-whatsapp-1 → WhatsApp redirect (other locales)
/sitemap.xml                                     → Sitemap (all locales × all pages)
/robots.txt                                      → Robots
```

Default locale (`en`) is included in the URL path (next-intl `localePrefix: 'always'` for hreflang correctness).

### Complete App Router Folder Tree

Mirrors `projects/electric-wheelchair-malaysia/` exactly.

```
projects/coldroom-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                          → Locale layout (Inter font, next-intl provider, tracking script, OrganizationSchema)
│   │   │                                         *** NO header/footer here — pages own their own ***
│   │   ├── page.tsx                            → Homepage (server, ISR revalidate=3600)
│   │   ├── HomePageClient.tsx                  → Client interactions (FOMO countdown, gallery filters, etc.)
│   │   │
│   │   ├── cold-room/
│   │   │   └── [location]/
│   │   │       ├── page.tsx                    → Dynamic location page (ISR revalidate=3600, generateStaticParams)
│   │   │       └── LocationPageClient.tsx      → Client interactions for location pages
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx                        → Blog listing (auto-fill grid, must match electric-wheelchair-malaysia)
│   │   │   └── [slug]/
│   │   │       └── page.tsx                    → Individual blog post (breadcrumbs → H1 → meta+read-time → TOC → body → FAQ → bottom CTA → recent posts → footer)
│   │   │
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx                        → WhatsApp redirect server (force-dynamic, reads loc query)
│   │       └── RedirectClient.tsx              → Client redirect to wa.me URL
│   │
│   ├── api/
│   │   └── phones/
│   │       └── route.ts                        → Phone number API (optional — used by getPhoneNumber if needed)
│   │
│   ├── globals.css                             → Tailwind v4 base + .blog-content styles
│   ├── layout.tsx                              → Root layout (minimal — just <html><body>{children})
│   ├── icon.svg                                → Favicon (MUST use the same icon as the logo)
│   ├── robots.ts                               → robots.txt generator (allow all)
│   └── sitemap.ts                              → sitemap.xml generator (all locales × homepage + locations + blog posts)
│
├── components/
│   ├── BlogNav.tsx                             → Blog top nav (used on /blog and /blog/[slug])
│   ├── BlogFooter.tsx                          → Blog footer
│   ├── LanguageSwitcher.tsx                    → en / ms / zh switcher (preserves current path)
│   │
│   ├── sections/
│   │   ├── FomoBanner.tsx                      → Sticky red OR black FOMO bar with LIVE COUNTDOWN (hh:mm:ss)
│   │   ├── Nav.tsx                             → Floating pill nav (Kak Kenduri pattern) + lang switcher + WhatsApp CTA
│   │   ├── Hero.tsx                            → Hero (H1 title + H2 subtitle, hero photo, primary WhatsApp CTA)
│   │   ├── UspBar.tsx                          → 3-point USP bar IMMEDIATELY below hero (mandatory)
│   │   ├── Stats.tsx                           → Trust stats (256,800 tonnes delivered, 1,730+ customers, 99% on-time, etc.)
│   │   ├── Products.tsx                        → 4 temperature-tier cards (DYNAMIC from Supabase products+product_photos)
│   │   ├── HowItWorks.tsx                      → EXACTLY 3 steps (Contact → Confirm → Delivered)
│   │   ├── RiskProblem.tsx                     → Cold-chain pain points (spoilage, HALAL contamination, downtime)
│   │   ├── MidCta.tsx                          → Mid-page WhatsApp CTA (#25D366)
│   │   ├── GoogleReviews.tsx                   → Google branding in header + Google icon on each review card
│   │   ├── WhyChoose.tsx                       → Differentiators (HALAL, 5-min WA response, full Peninsular coverage, same-day delivery)
│   │   ├── Gallery.tsx                         → Customer/project gallery — NO BLANK SLOTS at any breakpoint (column count must divide image count evenly)
│   │   ├── LocationsAccordion.tsx              → All 13 states grouped, 150–180 sub-locations linked
│   │   ├── Faq.tsx                             → FAQ section (location-aware on location pages)
│   │   ├── FinalCta.tsx                        → Final WhatsApp CTA (#25D366)
│   │   ├── Footer.tsx                          → Footer (NO phone/email/domain/SSM displayed as text — WhatsApp redirect only)
│   │   ├── Breadcrumbs.tsx                     → Breadcrumbs (location pages + blog posts only)
│   │   └── NearbyLocations.tsx                 → 3–6 nearby cities (location pages only)
│   │
│   ├── ui/
│   │   ├── WhatsAppButton.tsx                  → Official #25D366 (hover #1EBE57), white icon, target="_blank", same rounded shape site-wide
│   │   ├── StickyWhatsAppFab.tsx               → Floating bottom-right WhatsApp FAB (#25D366)
│   │   └── StarRating.tsx                      → Star rating display
│   │
│   └── schema/
│       ├── BreadcrumbSchema.tsx                → BreadcrumbList JSON-LD
│       ├── FAQSchema.tsx                       → FAQPage JSON-LD
│       ├── LocalBusinessSchema.tsx             → LocalBusiness JSON-LD (location pages)
│       ├── OrganizationSchema.tsx              → Organization JSON-LD (mounted in [locale]/layout.tsx)
│       └── ProductSchema.tsx                   → Product JSON-LD (per temperature-tier card)
│
├── config/
│   ├── site.ts                                 → Domain, brand, locales, productSlug, fallback phone
│   └── locations.ts                            → 150–180 sub-locations (≥10 per state × 13 states), each with { slug, name, state, stateSlug, nearby[] }
│
├── i18n/
│   ├── routing.ts                              → defineRouting({ locales: ['en','ms','zh'], defaultLocale: 'en', localePrefix: 'always' })
│   └── request.ts                              → getRequestConfig — loads messages/[locale].json
│
├── lib/
│   ├── supabase.ts                             → Singleton Supabase client (uses NEXT_PUBLIC_ vars)
│   ├── getPhoneNumber.ts                       → All 4 leads-mode logic (we use 'single')
│   ├── getBlogPosts.ts                         → Blog post queries (WEBSITE = 'coldroom-malaysia.vercel.app')
│   └── waRedirect.ts                           → Builds /[locale]/redirect-whatsapp-1?loc=...&message=... URL
│
├── messages/
│   ├── en.json                                 → English translations (nav, hero, products, locations, faq, footer, blog)
│   ├── ms.json                                 → Bahasa Melayu translations
│   └── zh.json                                 → Mandarin translations
│
├── brand_assets/                               → Logo, palette swatches, hero photos, gallery photos
├── temporary screenshots/                      → Puppeteer screenshot output
├── middleware.ts                               → next-intl middleware
├── next.config.ts                              → loadEnvConfig from repo root + withNextIntl plugin
├── postcss.config.mjs
├── global.d.ts                                 → declare window.uwc tracking interface
├── tsconfig.json
├── package.json
└── .env.local → ../../.env.local               → Symlink to shared Supabase credentials
```

---

## 2. Page Inventory

### Page-Type Counts

| Page | Route Pattern | Per Locale | × 3 Locales |
|------|---------------|-----------:|------------:|
| Homepage | `/[locale]` | 1 | 3 |
| Location pages | `/[locale]/cold-room/[location]` | 150–180 | 450–540 |
| Blog listing | `/[locale]/blog` | 1 | 3 |
| Blog posts | `/[locale]/blog/[slug]` | ≥10 (Hanabi) | ≥30 |
| WhatsApp redirect | `/[locale]/redirect-whatsapp-1` | 1 | 3 |
| Sitemap | `/sitemap.xml` | — | 1 |
| Robots | `/robots.txt` | — | 1 |
| **Total static + dynamic** | | **~163–192** | **~490–580** |

### Homepage (`/[locale]`)
- National landing page targeting "Cold Room Rental Malaysia"
- One H1 (hero title) + one H2 (hero subtitle in the SAME hero section, not a `<p>`)
- 3-point USP bar immediately below hero (mandatory)
- Live FOMO countdown banner (red OR black, never brand colour) at the very top
- Renders ALL homepage sections in the standard order (see Section 7 — Architecture Rule "Section order parity")
- No location-specific content
- Products grid is DYNAMIC from Supabase (NEVER hardcoded) — auto-adjusts to product count
- ISR `revalidate = 3600`

### Location Pages (`/[locale]/cold-room/[location]`)
- One page per sub-location × 3 locales — IDENTICAL section order as homepage plus Breadcrumbs and NearbyLocations
- Location-specific H1, H2, meta title, meta description, FAQ, intro copy (UNIQUE per location, written by Nana)
- Same dynamic Products grid
- WhatsApp CTAs append `?loc={location-slug}` so the redirect can route by location slug (already supported in `getPhoneNumber`; in `single` mode this just returns the default number)
- ISR `revalidate = 3600`
- `generateStaticParams` returns every slug from `config/locations.ts`

### Blog Listing (`/[locale]/blog`)
- Header banner with gradient
- Auto-fill grid (`minmax(340px, 1fr)`) — card per post (cover, date, title, excerpt, "Read More")
- Tracks `window.uwc('click', { label: 'blog-{slug}' })` on each card click
- Pulls from Supabase `blog_posts` + `blog_translations` filtered by website + locale + status='published'

### Blog Post (`/[locale]/blog/[slug]`)
- Per memory rule "Blog layout reference": MUST follow electric-wheelchair-malaysia exactly:
  - Full header (BlogNav)
  - Breadcrumbs
  - H1 (article title)
  - Metadata + read time
  - Table of contents
  - Body (rendered via dangerouslySetInnerHTML; styles from `globals.css .blog-content`)
  - FAQ
  - Bottom WhatsApp CTA banner (#25D366)
  - Recent posts row
  - Full footer
  - Single column, NO sidebar

### WhatsApp Redirect (`/[locale]/redirect-whatsapp-1`)
- `export const dynamic = 'force-dynamic'` (never cached — must always fetch latest phone)
- Server reads `loc` query param + host header, calls `getPhoneNumber(loc)`
- Client receives `wa.me/...?text=...` URL and immediately `window.location.href = url`
- Excluded from sitemap and robots-noindex
- Tracks `window.uwc('click', { label: 'whatsapp-{phone}' })` before redirect

### Sitemap & Robots
- `app/sitemap.ts` emits every locale × (homepage + every location + every blog post)
- Excludes `/redirect-whatsapp-1`
- `app/robots.ts` allows all crawlers, references sitemap URL

---

## 3. Data Flow

### Dynamic Products Flow (CRITICAL)

```
Homepage / Location page (server component, ISR 3600s)
  → lib/supabase.getSupabase()
  → SELECT * FROM products
        WHERE website = 'coldroom-malaysia.vercel.app'
          AND is_active = true
        ORDER BY sort_order
  → JOIN product_photos ON product_id
  → Pass products[] into <Products /> grid
  → Grid uses CSS auto-fill / responsive columns; gracefully renders 1, 4, 6, or N tiles
  → Adding/removing/disabling a product propagates within 1h without redeploy
  → If Supabase unreachable, optional config/products.ts fallback (NOT source of truth)
```

The 4 confirmed temperature-tier rows that Cyclops must insert (slugs):
- `frozen-storage-minus-18` (-18°C)
- `freezer-minus-5-to-minus-10` (-5°C to -10°C)
- `chiller-2-to-4` (2°C to 4°C)
- `cool-storage-7-to-10` (7°C to 10°C)

### Phone Number Flow (leads_mode = `single`)

```
User clicks any WhatsApp CTA (target="_blank")
  → /[locale]/redirect-whatsapp-1?loc={locationSlugOrEmpty}
  → Server (force-dynamic) reads HTTP host header
  → SELECT leads_mode FROM company_websites WHERE domain = 'coldroom-malaysia.vercel.app'
  → SELECT * FROM phone_numbers
        WHERE website = 'coldroom-malaysia.vercel.app'
          AND is_active = true
  → leads_mode = 'single' → return the first row (the seeded default)
  → Build wa.me URL with phone_number + URL-encoded whatsapp_text
  → Fire window.uwc('click', { label: 'whatsapp-60192799832' })
  → window.location.href = wa.me URL
```

### Location Slug → Page Mapping

```
config/locations.ts
  → exports Location[] (150–180 entries, ≥10 per state × 13 states)
  → entry shape: { slug, name, state, stateSlug, nearby[] }

app/[locale]/cold-room/[location]/page.tsx
  → generateStaticParams() returns all { locale, location } combinations
  → generateMetadata() builds unique title/description per locale × location
  → Page renders with location-specific copy from Nana's location pages copy file
```

### Translation Loading (next-intl 4)

```
middleware.ts
  → createMiddleware(routing) — detects locale from URL prefix, redirects /  →  /en

i18n/routing.ts
  → defineRouting({ locales: ['en','ms','zh'], defaultLocale: 'en', localePrefix: 'always' })

i18n/request.ts
  → getRequestConfig — imports messages/${locale}.json, returns { locale, messages }

app/[locale]/layout.tsx
  → wraps <NextIntlClientProvider messages={messages}>
  → Inter font globally

Components
  → const t = useTranslations('namespace'); t('key')
```

### Blog Flow

```
/[locale]/blog (server, ISR)
  → lib/getBlogPosts.listPosts(locale)
  → SELECT bp.*, bt.title, bt.excerpt, bt.cover_image_url
       FROM blog_posts bp
       JOIN blog_translations bt ON bt.post_id = bp.id
       WHERE bp.website = 'coldroom-malaysia.vercel.app'
         AND bp.status = 'published'
         AND bt.locale = $locale
       ORDER BY bp.published_at DESC

/[locale]/blog/[slug]
  → lib/getBlogPosts.getPost(locale, slug)
  → SELECT joined row by slug + locale
```

### ISR / Revalidation Strategy

| Page | Strategy | Revalidate | Reason |
|------|----------|------------|--------|
| Homepage | ISR | 3600s | Phone numbers + product list may change |
| Location pages | ISR | 3600s | Same |
| Blog listing | ISR | 3600s | Hanabi may publish new posts |
| Blog post | ISR | 3600s | Edits propagate within 1h |
| WhatsApp redirect | `force-dynamic` | — | Must read fresh phone every request |
| Sitemap | ISR | 86400s | Locations rarely change |

---

## 4. Database Requirements (for Cyclops)

Cyclops must populate the **shared Supabase database** (NEVER create a new project). Use real existing column names.

### `companies` (already exists)
- Confirm the row for `Cold Truck Malaysia Sdn. Bhd.` exists with UUID `99e92ff1-d776-4154-9346-426e3cb91936`. No insert needed.

### `company_websites` (already exists)
Insert one row:
- `company_id` = `99e92ff1-d776-4154-9346-426e3cb91936`
- `domain` = `coldroom-malaysia.vercel.app`
- `leads_mode` = `single`

### `phone_numbers` (already exists — DO NOT change schema)
**Real column names** (verified in CLAUDE.md):
- `website` (NOT `website_slug`)
- `location_slug` — `'all'` for default (NOT `null`)
- `phone_number`
- `whatsapp_text`
- `percentage`
- `label`
- `type`
- `is_active`

Insert ONE seed row (Step 13 of full-website-setup):
```
website        = 'coldroom-malaysia.vercel.app'
location_slug  = 'all'
phone_number   = '60192799832'
whatsapp_text  = 'Hi, saya berminat dengan Cold Room Rental. Boleh saya dapatkan info lanjut?'
percentage     = 100
label          = 'default'
type           = 'default'
is_active      = true
```

### `products` (already exists)
Insert 4 rows — one per temperature tier. All rows must use:
- `website` = `coldroom-malaysia.vercel.app`
- `is_active` = `true`
- `sort_order` = 1..4 (frozen first → cool storage last)
- `rental_price` = numeric (per-pallet/day baseline; e.g. 5.00); `sale_price` may be `null`

| sort_order | name | slug | description (temp + use cases) |
|---:|------|------|------|
| 1 | -18°C Frozen Cold Room | `frozen-storage-minus-18` | Frozen meat, chicken, seafood, frozen fruits & veg |
| 2 | -5°C to -10°C Freezer Cold Room | `freezer-minus-5-to-minus-10` | Bread, pizza dough, pastry, ice cream |
| 3 | 2°C to 4°C Chiller Cold Room | `chiller-2-to-4` | Dairy, milk, cheese, butter, fresh flowers |
| 4 | 7°C to 10°C Cool Storage | `cool-storage-7-to-10` | Pharmaceuticals, beverages, sauces |

### `product_photos` (already exists)
- For each of the 4 product rows, insert ≥1 row with `product_id` (FK) and `url` (Pexels/Unsplash high-res cold-storage / Asian-warehouse images — no watermarks). Aim for 2–3 photos per tier so the cards have visual variety.

### `blog_posts` + `blog_translations` (already exist)
Hanabi will populate later (Step 11). Cyclops only needs to confirm the tables exist and the website-scoped query pattern works:
- `blog_posts` — `website = 'coldroom-malaysia.vercel.app'`, `slug`, `cover_image_url`, `status = 'published'`, `published_at`
- `blog_translations` — `post_id` (FK), `locale` ∈ {`en`,`ms`,`zh`}, `title`, `content`, `excerpt`, `meta_title`, `meta_description`

### Row-Level Security
- Anon key: read-only on `phone_numbers`, `products`, `product_photos`, `blog_posts`, `blog_translations`, `company_websites` filtered by `is_active = true` / `status = 'published'`
- No public writes

### NOT Stored in DB
- Locations live in `config/locations.ts` (static, build-time) — no `locations` table needed.

---

## 5. SEO Requirements (for Sora)

Sora must produce `seo-plan.md` covering:

### Keyword Targets (per locale)

**English (`en`)**
- Primary: `cold room rental Malaysia`, `cold room delivery Malaysia`
- Secondary: `frozen cold room rental`, `chiller rental Malaysia`, `cold storage rental`, `halal cold room`, `cold chain logistics Malaysia`
- Location: `cold room rental [city]` × 150–180
- Long-tail: `rent -18 frozen cold room [city]`, `chiller rental for restaurant [city]`, `pharmaceutical cold storage [city]`

**Bahasa Melayu (`ms`)**
- Primary: `sewa cold room Malaysia`, `bilik sejuk untuk disewa`
- Secondary: `sewa freezer`, `sewa chiller`, `cold room halal`
- Location: `sewa cold room [bandar]`

**Mandarin (`zh`)**
- Primary: `冷库出租 马来西亚`, `冷藏室租赁`
- Secondary: `冷冻库出租`, `清真冷库`
- Location: `冷库出租 [城市名]`

### Page Hierarchy & Keyword Map
- Homepage → broad national term per locale
- Each location page → city-scoped keyword (UNIQUE copy — no duplicate content across locations)
- Blog → supporting / informational queries (cold-chain best practices, HALAL compliance, temperature charts, etc.)

### Hreflang
Every page emits `<link rel="alternate">` for all 3 locales + `x-default` pointing to the `en` version:
```
<link rel="alternate" hreflang="en"        href="https://coldroom-malaysia.vercel.app/en/..."/>
<link rel="alternate" hreflang="ms"        href="https://coldroom-malaysia.vercel.app/ms/..."/>
<link rel="alternate" hreflang="zh"        href="https://coldroom-malaysia.vercel.app/zh/..."/>
<link rel="alternate" hreflang="x-default" href="https://coldroom-malaysia.vercel.app/en/..."/>
```

### Meta Templates
- Homepage title ≤ 60 chars; description ≤ 155 chars; national keyword first.
- Location page title MUST contain the city name + product term + locale-appropriate term.
- Blog post titles use Hanabi's SEO-optimised titles; meta_description from `blog_translations.meta_description`.
- Every page has self-referencing canonical.

### Schema Markup Plan
| Page | Schemas |
|------|---------|
| Homepage | Organization, WebSite, Product (×4 tiers), FAQPage, BreadcrumbList |
| Location page | LocalBusiness, Product (×4 tiers), FAQPage, BreadcrumbList |
| Blog listing | Blog, BreadcrumbList |
| Blog post | BlogPosting, BreadcrumbList, FAQPage (if FAQ block present) |
| Redirect | none (excluded) |

### Internal Linking
- Homepage → all 150–180 location pages (LocationsAccordion grouped by state)
- Every location page → homepage (Nav + breadcrumb) + 3–6 nearby cities (NearbyLocations) + blog (Nav)
- Footer → top-priority cities (KL, JB, Penang, Ipoh, Kuantan, Melaka) + homepage + blog
- Blog post body → contextual links to product slugs and location pages; bottom CTA → WhatsApp redirect
- Cross-locale links via LanguageSwitcher

### Sitemap
- All locales × homepage + every location + every blog post + blog listing
- Exclude `/redirect-whatsapp-1`
- Submit on Google Search Console + Bing Webmaster after deploy

---

## 6. i18n Requirements

### Confirmed Languages

| Language | Locale Code | Status |
|----------|-------------|--------|
| English | `en` | Default |
| Bahasa Melayu | `ms` | Secondary |
| Mandarin Chinese | `zh` | Secondary |

### Implementation Details
- **Library:** next-intl 4
- **Routing:** prefix-always (`/en/...`, `/ms/...`, `/zh/...`) — default locale STILL has `/en/` prefix
- **Routing config:** `defineRouting({ locales: ['en','ms','zh'], defaultLocale: 'en', localePrefix: 'always' })`
- **Messages:** `messages/en.json`, `messages/ms.json`, `messages/zh.json`
- **Slugs stay English across locales:** `/zh/cold-room/kuala-lumpur` (NOT `/zh/冷库/吉隆坡`); product slug always `cold-room`
- **LanguageSwitcher:** preserves the current path when toggling

### Translation Scope
- Nav labels, CTA button text, hero H1+H2, USP bar, all section headings, body copy, FAQ Q&A, footer, blog UI strings (`blog.title`, `blog.readMore`, `blog.publishedOn`, `blog.minRead`, `blog.recentPosts`, `blog.metaTitle`, `blog.metaDescription`, etc.), meta titles, meta descriptions, image alt text
- City display names may stay in English (slug consistency); translate state names where applicable

### Font
- **Inter** globally for ALL locales (per memory rule "User design preferences" — no serif). Inter handles Latin + CJK with system-font fallback for `zh`. Optionally add Noto Sans SC as a fallback for `zh` if rendering looks off.

---

## 7. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 (App Router) | Server components, ISR, file-based routing |
| Styling | Tailwind CSS 4 (via `@tailwindcss/postcss`) | Utility-first, fast iteration |
| Database | Supabase (SHARED instance) | All websites share the same DB; distinguished by `website` column |
| i18n | next-intl 4 | Proven across existing projects; App Router native |
| Deployment | Vercel | ISR + edge + preview deploys |
| Analytics | Utopia Webcore Tracking (`https://webcore.utopiaai.my/t.js`) | Mandatory; `data-website="coldroom-malaysia.vercel.app"` |
| Font | Inter (global, no serif) | User memory preference |
| WhatsApp colour | `#25D366` (hover `#1EBE57`) | Official WhatsApp green — never themed |
| Brand palette | Deep orange (`#F57C00`/`#FF8A00`) accent + cool steel grey (`#3A3F45`) + crisp white | From `brand_assets/pasted-image-1777254709725.png`; never default Tailwind blue/indigo |

### Environment
- `.env.local` is a SYMLINK to repo-root `.env.local` (`ln -sf ../../.env.local .env.local`)
- `next.config.ts` runs `loadEnvConfig(process.cwd() + '/../..')` to load shared Supabase vars
- Vercel env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Tracking (mandatory)
- Script in `<head>` of `[locale]/layout.tsx` with `data-website="coldroom-malaysia.vercel.app"`
- `global.d.ts` declares `window.uwc(eventType, { label })`
- Track: `whatsapp-{phone}` clicks, `product-{slug}` impressions (IntersectionObserver, fire once), `blog-{slug}` clicks, `call-{phone}` if any tel: anywhere

### Site Config Values (for `config/site.ts`)
```
domain:           'coldroom-malaysia.vercel.app'
siteUrl:          'https://coldroom-malaysia.vercel.app'
brandName:        'Cold Room Malaysia'
tagline:          'Refrigerated Cold Room Delivery & Rental Malaysia'
productSlug:      'cold-room'
productName:      'Cold Room Rental'
fallbackPhone:    '60192799832'
fallbackWaText:   'Hi, saya berminat dengan Cold Room Rental. Boleh saya dapatkan info lanjut?'
defaultLocale:    'en'
locales:          ['en','ms','zh'] as const
```

---

## Architecture Rules (MANDATORY — passed forward verbatim)

These rules are non-negotiable. Every downstream agent (Cyclops, Sora, Nana, Kagura, Kimmy, Hanabi, Layla) must respect them.

### Rule 1 — Layout ownership
`app/[locale]/layout.tsx` MUST NOT contain header, nav, FOMO banner, or footer. It is responsible only for `<html>`, `<body>`, font, tracking script, NextIntlClientProvider, and OrganizationSchema. Each PAGE component (homepage, location page, blog page) renders its own FomoBanner / Nav / Footer inline. This prevents duplicate-rendering bugs.

### Rule 2 — Section order parity (Homepage and Location pages MUST be IDENTICAL)

```
1.  FomoBanner          (sticky top, red OR black bg, LIVE countdown hh:mm:ss)
2.  Nav                 (floating pill, with LanguageSwitcher + WhatsApp CTA)
3.  Hero                (H1 title + H2 subtitle in same section)
4.  UspBar              (3 points, immediately below hero — mandatory)
5.  Stats               (256,800 tonnes / 1,730+ customers / 99% on-time / 5-min response)
6.  Products            (DYNAMIC from Supabase, 4 temperature tiers, auto-grid)
7.  HowItWorks          (EXACTLY 3 steps — Contact → Confirm → Delivered)
8.  RiskProblem         (cold-chain pain points)
9.  MidCta              (#25D366 WhatsApp CTA)
10. GoogleReviews       (Google branding header + Google icon per card)
11. WhyChoose           (HALAL, same-day, full coverage, 5-min WA)
12. Gallery             (NO blank slots — pick column count that divides image count)
13. LocationsAccordion  (13 states, all 150–180 sub-locations linked)
14. Faq                 (location-aware on location pages)
15. FinalCta            (#25D366)
16. Footer              (NO phone/email/domain/SSM as visible text)
17. StickyWhatsAppFab   (floating bottom-right, #25D366)
```

Location pages add ONLY:
- **Breadcrumbs** — between Nav (#2) and Hero (#3)
- **NearbyLocations** — between LocationsAccordion (#13) and Faq (#14)

Location pages MUST NOT omit any homepage section.

### Rule 3 — Real DB column names
- Table: `phone_numbers` (NOT `phones`)
- Column: `website` (NOT `website_slug`)
- Default location: `location_slug = 'all'` (NOT `null`, NOT empty string)

### Rule 4 — Heading hierarchy
- EXACTLY one `<h1>` per page (hero title)
- EXACTLY one `<h2>` per page (hero subtitle — must be a real `<h2>` element, NOT a `<p>`)
- All other section titles use `<h3>`–`<h6>`
- Lint every page before marking design complete: H1 count = 1, H2 count = 1

### Rule 5 — WhatsApp CTAs
- ALL WhatsApp buttons (nav, hero, inline, mid-CTA, final, FAB, blog banner) use `#25D366` (hover `#1EBE57`)
- Icon stays white
- `target="_blank" rel="noopener noreferrer"` so it opens in a new tab
- Same rounded shape across the entire site — only colour differs between primary/secondary/CTA variants

### Rule 6 — FOMO banner
- Sticky at top of first viewport
- Background MUST be red OR black (never brand colour, never yellow/green)
- Includes a LIVE ticking countdown (hh:mm:ss) — not a static label
- Light/white text for legibility

### Rule 7 — No hardcoded contact info
- NEVER display phone, email, SSM, or domain as visible text anywhere on the site (hero, footer, contact, anywhere)
- All contact goes through the WhatsApp redirect CTA

### Rule 8 — Dynamic products
- Products grid queries Supabase `products` + `product_photos` joined by `product_id`
- ISR `revalidate = 3600` so DB changes propagate within 1h with no redeploy
- Grid auto-adjusts to product count (handle 1, 4, 6, or N gracefully)
- `config/products.ts` may exist as a fallback ONLY — Supabase is the source of truth
- Image URLs come from `product_photos.url` — never hardcoded in TSX

### Rule 9 — Gallery — no blank slots
- Customer/project gallery grid MUST never leave an empty cell at any breakpoint
- Pick a column count that evenly divides the image count, or pad/trim images to fully fill the last row
- Re-check desktop, tablet, and mobile

### Rule 10 — Location coverage
- `config/locations.ts` MUST contain ≥10 real, populated sub-locations per state across 13 states
- Total 150–180 locations
- Every entry must appear in `generateStaticParams` AND in the sitemap

### Rule 11 — Blog layout reference
- ALL blog posts MUST follow electric-wheelchair-malaysia layout exactly: full header → breadcrumbs → H1 → metadata + read-time → TOC → body → FAQ → bottom CTA → recent posts → full footer
- Single column, NO sidebar

### Rule 12 — Mobile-first
- Most users come from mobile — design mobile-first
- Headings, buttons, cards, and icons CENTER-ALIGNED on mobile
- Verify mobile layout before marking design complete

### Rule 13 — Pre-review checklist
- BEFORE presenting the site for user review, complete ALL detailing: heading hierarchy lint, mobile audit, no orphaned text, every image checked, custom brand colours
- Never show an unfinished site

### Rule 14 — Design uniqueness
- Hero, product card, Google Reviews, and Gallery layouts must DIFFER from existing projects in `projects/`
- Kagura researches and proposes a unique direction; Kimmy implements

### Rule 15 — Favicon = logo icon
- The icon inside the logo must double as `app/icon.svg` favicon
- Design icon-first; build the logo around it
- Works at 16×16 and 32×32

### Rule 16 — Tracking
- `data-website="coldroom-malaysia.vercel.app"` (must match exact deployed domain)
- Track: `whatsapp-{phone}` clicks, `product-{slug}` impressions (once per card), `blog-{slug}` clicks
- `global.d.ts` declares `window.uwc` typing

### Rule 17 — User-approval gates (blocking)
- Gate 1 (design) and Gate 2 (content) BOTH require explicit user confirmation
- Do not proceed past either gate without confirmation
- Layla deploys ONLY after Gate 2

---

## Environment Variables

```
# .env.local (symlinked from repo root)
NEXT_PUBLIC_SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY={shared anon key from repo root .env.local}
```

Add the same two vars to Vercel via `vercel env add` before deployment.

---

## Agent Handoff

| Next Agent | Receives | Produces |
|------------|----------|----------|
| **Cyclops** (Database) | This doc | Confirm `companies` row, insert `company_websites` (leads_mode=`single`), insert 4 `products` rows + ≥1 `product_photos` per product, seed `phone_numbers` row (in Step 13). Verify RLS. |
| **Sora** (SEO) | This doc | `seo-plan.md` — keyword map per locale, hreflang implementation spec, schema markup plan, meta templates, internal-linking map |
| **Nana** (Copywriter) | This doc + Sora's plan | `copy-homepage.md`, `copy-locations.md` — unique copy per locale × per location |
| **Kagura** (UI Design) | This doc + Nana's copy + brand assets | `design-direction.md` — unique hero/product/reviews/gallery layouts not used in other Utopia projects |
| **Kimmy** (Tech SEO + i18n + WA Redirect) | This doc + Sora + Nana | `technical-seo-i18n.md` — meta tags, schemas, alt text, hreflang, all 3 message JSONs, redirect implementation |
| **Hanabi** (Blog) | This doc + Sora | ≥10 SEO articles inserted into `blog_posts` + `blog_translations` (en/ms/zh) |
| **Layla** (QA + Deploy) | All of the above + Gate 2 user approval | GitHub push, Vercel deploy, env vars, live URL |

Cyclops and Sora run in parallel as the immediate next step.

---

## Blockers & Notes

- **No blockers identified.** All inputs are confirmed.
- **Brand assets:** One reference image provided (`brand_assets/pasted-image-1777254709725.png`) — orange-highlighted pallet on grey/white warehouse → palette: deep orange + cool steel grey + crisp white. No logo provided yet — Kagura must design icon-first; the same icon doubles as `app/icon.svg`.
- **Reference site for product/gallery/hero parity:** https://www.coldroommalaysia.com.my/ (mirror product listing, hero photo style, gallery, location list — but with a UNIQUE design direction per Kagura).
- **HALAL emphasis:** Mention prominently in Hero, USP bar, WhyChoose, FAQ, and at least one location-page paragraph — it is the key trust signal in the MY market.
- **Cold truck cross-sell:** Reference parent company Cold Truck Malaysia in WhyChoose / Footer copy (without displaying domain/phone — link via WhatsApp CTA only).
- **Pricing reference (for Nana):** From RM5/pallet/day, RM0.50/box/day, cold truck rental from RM600. Display as starting prices only; final quote via WhatsApp.
