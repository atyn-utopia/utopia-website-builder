# Architecture: Cat Rumah Malaysia

**Version:** 1.0
**Date:** 2026-04-15
**Architect:** Alpha — System Architect
**Project:** House Painting Service + Paint Products (Cat Rumah Malaysia)
**Domain:** cat-rumah-malaysia.vercel.app
**Status:** Complete
**Next:** Cyclops — Database Engineer + Sora — SEO Strategist (parallel)

---

## Site Purpose

A Malaysian house painting service + paint products website optimised for local SEO across major Malaysian cities. Offers interior wall painting, exterior wall/weathershield painting, ceiling painting, epoxy floor painting, fence painting, and outdoor metal paint using premium brands (Nippon Paint, Jotun, Dulux). Pricing from **RM3.50/sqft**.

### Key Business Lines
1. Cat Dinding Rumah (interior wall painting)
2. Cat Luar Rumah (exterior wall / weathershield)
3. Cat Siling (ceiling painting)
4. Cat Epoxy Lantai (epoxy floor)
5. Cat Pagar Rumah (fence painting)
6. Outdoor Metal Paint

### Target Audience
Malaysian homeowners searching in Bahasa Melayu, English, and Mandarin for affordable house repainting services. Primary market is Klang Valley; secondary markets are state capitals and major towns.

---

## 1. Folder & Routing Structure

### URL Structure (with i18n)

```
/ms                                          → Bahasa Melayu homepage (DEFAULT)
/en                                          → English homepage
/zh                                          → Chinese homepage
/ms/cat-rumah/kuala-lumpur                   → Malay location page
/en/cat-rumah/kuala-lumpur                   → English location page
/zh/cat-rumah/kuala-lumpur                   → Chinese location page
/ms/redirect-whatsapp-1                      → WhatsApp redirect (Malay)
```

**Product slug:** `cat-rumah` — kept short, SEO-friendly, works across all three locales, matches brand name. Stays identical in all locales.

**Default locale:** `ms` (Bahasa Melayu) — main audience is Malaysian homeowners. next-intl uses prefix-always strategy so `/ms/` is explicit in URL for hreflang correctness.

### Complete App Router Folder Tree

```
projects/cat-rumah-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                          → Root locale layout (fonts, metadata base, next-intl provider)
│   │   │                                          *** NO header/footer here — pages own their own ***
│   │   ├── page.tsx                            → Homepage
│   │   │
│   │   ├── cat-rumah/
│   │   │   └── [location]/
│   │   │       └── page.tsx                    → Dynamic location page (ISR)
│   │   │
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx                        → WhatsApp redirect server component
│   │       └── RedirectClient.tsx              → Client component (random phone pick + redirect)
│   │
│   ├── globals.css                             → Tailwind v4 base styles
│   ├── icon.svg                                → Favicon (brand icon)
│   ├── robots.ts                               → robots.txt generation
│   └── sitemap.ts                              → Auto-generated sitemap.xml (all locales + locations)
│
├── components/
│   ├── sections/
│   │   ├── FomoBanner.tsx                      → Urgency banner ("Rumah Lama Nampak Baru Dalam 5 Jam")
│   │   ├── Nav.tsx                             → Navigation bar with language switcher
│   │   ├── Hero.tsx                            → Hero section (RM3.50/sqft headline)
│   │   ├── Stats.tsx                           → Trust stats (4.9/5 Google, houses painted, years, brands)
│   │   ├── Products.tsx                        → 6 paint service cards (interior/exterior/ceiling/epoxy/fence/metal)
│   │   ├── HowItWorks.tsx                      → 3-step process (Contact → Site Visit & Quote → Painted)
│   │   ├── RiskProblem.tsx                     → Pain points (faded walls, cracks, mould, cost of renovation)
│   │   ├── MidCta.tsx                          → Mid-page call-to-action
│   │   ├── GoogleReviews.tsx                   → Google Reviews with Google branding (4.9/5)
│   │   ├── WhyChoose.tsx                       → Why choose us (premium brands, fast, warranty)
│   │   ├── Gallery.tsx                         → Before/after painting gallery
│   │   ├── LocationsAccordion.tsx              → All locations grouped by state
│   │   ├── Faq.tsx                             → FAQ section (location-aware)
│   │   ├── FinalCta.tsx                        → Final call-to-action
│   │   ├── Footer.tsx                          → Footer with links, contact, sitemap
│   │   ├── Breadcrumbs.tsx                     → Breadcrumbs (location pages only)
│   │   └── NearbyLocations.tsx                 → Nearby locations (location pages only)
│   │
│   ├── ui/
│   │   ├── WhatsAppButton.tsx                  → Green (#25D366) WhatsApp CTA, opens new tab
│   │   ├── LanguageSwitcher.tsx                → ms/en/zh language toggle
│   │   └── StarRating.tsx                      → Star rating display
│   │
│   └── seo/
│       ├── StructuredData.tsx                  → JSON-LD schema injection
│       └── BreadcrumbSchema.tsx                → BreadcrumbList schema
│
├── config/
│   ├── site.ts                                 → Site-wide config (domain, product slug, phone, etc.)
│   ├── locations.ts                            → Location metadata (name, slug, state, stateSlug, nearby)
│   └── products.ts                             → 6 paint service definitions
│
├── lib/
│   ├── supabase.ts                             → Supabase client initialization
│   ├── getPhoneNumbers.ts                      → Query phone numbers by website + location
│   └── utils.ts                                → Shared utility functions
│
├── i18n/
│   ├── routing.ts                              → next-intl routing config (locales: ms, en, zh; default ms)
│   └── request.ts                              → next-intl request config (message loading)
│
├── messages/
│   ├── ms.json                                 → Bahasa Melayu translations (default)
│   ├── en.json                                 → English translations
│   └── zh.json                                 → Mandarin Chinese translations
│
├── brand_assets/                               → Logo, colors, images from catrumah.com.my
├── middleware.ts                               → next-intl middleware (locale detection + routing)
├── next.config.ts                              → loadEnvConfig from repo root
├── .env.local                                  → Symlink to ../../.env.local
├── architecture.md                             → This file
├── package.json
└── tsconfig.json
```

---

## 2. Page Inventory

| Page | Route Pattern | Count per Locale | Total (3 locales) |
|------|---------------|------------------|--------------------|
| Homepage | `/[locale]` | 1 | 3 |
| Location pages | `/[locale]/cat-rumah/[location]` | 16 | 48 |
| WhatsApp redirect | `/[locale]/redirect-whatsapp-1` | 1 | 3 |
| **Total** | | **18** | **54** |

### Homepage (`/[locale]`)
- National landing page for "Cat Rumah Malaysia"
- Covers all 6 paint services (interior / exterior / ceiling / epoxy / fence / metal)
- Hero: "Rumah Lama Terus Nampak Baru Dalam 5 Jam!" + "Dari RM3.50/sqft"
- No location-specific content
- Contains all sections in the standard section order (see section 7)

### Location Pages (`/[locale]/cat-rumah/[location]`)
- One page per city (16 cities)
- Location-specific H1, meta title, meta description, FAQ, and unique intro copy
- Includes Breadcrumbs and Nearby Locations extras
- Same section order as homepage plus the location-specific extras

### WhatsApp Redirect (`/[locale]/redirect-whatsapp-1`)
- Server component loads phone numbers from Supabase
- Client component picks one at random and redirects to `https://wa.me/[number]`
- Accepts `?loc=[slug]` query param for location-specific number lookup
- Falls back to `location_slug = 'all'` default numbers if no location-specific match

---

## 3. Data Flow

### Phone Number Flow
```
User clicks WhatsApp button (green, target="_blank")
  → navigates to /[locale]/redirect-whatsapp-1?loc=[slug]
  → Server reads host header → fetches leads_mode from company_websites
  → Server queries Supabase phone_numbers:
      SELECT * FROM phone_numbers
      WHERE website = 'cat-rumah-malaysia.vercel.app'
        AND is_active = true
  → Applies leads_mode logic (single → returns the one default row)
  → Client redirects to https://wa.me/60174287801?text=[whatsapp_text]
```

### Location Slug → Page Mapping
```
config/locations.ts
  → exports Location[] array with 16 entries
  → each entry: { name, slug, state, stateSlug, nearby: string[] }

app/[locale]/cat-rumah/[location]/page.tsx
  → generateStaticParams() reads locations.ts → returns all slugs × 3 locales
  → generateMetadata() builds unique title + description per location + locale
  → Page component renders sections with location-specific props
```

### Translation Loading (next-intl)
```
middleware.ts
  → detects locale from URL prefix
  → next-intl routing config: locales ['ms', 'en', 'zh'], default 'ms'

i18n/request.ts
  → loads messages/[locale].json based on active locale

app/[locale]/layout.tsx
  → wraps children in NextIntlClientProvider with loaded messages
  → NO header/footer rendering here

Components
  → use useTranslations('namespace') hook to access translated strings
```

### ISR / Revalidation Strategy

| Page | Strategy | Revalidate | Reason |
|------|----------|------------|--------|
| Homepage | ISR | 3600s (1hr) | Phone numbers may change |
| Location pages | ISR | 3600s (1hr) | Phone numbers may change |
| WhatsApp redirect | Dynamic (no cache) | N/A | Must fetch fresh phone numbers every time |
| Sitemap | ISR | 86400s (24hr) | Locations rarely change |

---

## 4. Database Requirements (for Cyclops)

Cyclops does NOT design new schema — uses the existing shared `phone_numbers` and `company_websites` tables. Cyclops's job is to seed the correct rows for this project.

### Required rows in `company_websites`
- `domain`: `cat-rumah-malaysia.vercel.app`
- `leads_mode`: `single`
- (other metadata as schema requires)

### Required rows in `phone_numbers`
Seed ONE default row:

```sql
INSERT INTO phone_numbers (
  website,
  location_slug,
  phone_number,
  label,
  type,
  is_active,
  whatsapp_text,
  percentage
) VALUES (
  'cat-rumah-malaysia.vercel.app',
  'all',
  '60174287801',
  'default',
  'default',
  true,
  'Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?',
  100
);
```

### Column naming reminders (VERY IMPORTANT — match existing schema)
- Table: `phone_numbers`
- Column: `website` (NOT `website_slug`)
- Default row uses `location_slug = 'all'` (NOT `null`)
- `website` value is the Vercel domain `cat-rumah-malaysia.vercel.app`
- No `product_slug` column — rows are filtered by `website` only, then leads_mode logic applies

### RLS
- Public anon read: `SELECT` where `is_active = true`
- Writes restricted to service role

### No new tables
- Location data lives in `config/locations.ts` (static), not in the database.

---

## 5. SEO Requirements (for Sora)

Sora must plan the following (do not plan SEO here — Alpha only lists requirements):

### Keyword focus
- Primary: "cat rumah", "house painting Malaysia", "servis cat rumah", "油漆服务 马来西亚"
- Secondary: "cat dinding rumah", "cat luar rumah", "cat siling", "cat epoxy lantai", "cat pagar", "painter near me"
- Location modifiers: "{service} {city}" pattern — e.g. "cat rumah Kuala Lumpur", "house painter Petaling Jaya"
- Pricing long-tails: "harga cat rumah per kaki persegi", "house painting price Malaysia", "tukang cat rumah murah"
- Trilingual coverage: ms (primary), en, zh

### Page hierarchy
- Homepage targets national/brand keywords
- Location pages target city-specific keywords
- Each location page must have unique intro + FAQ — no duplicate content

### Hreflang
- Every page includes hreflang tags for `ms`, `en`, `zh` + `x-default` (→ `ms`)

### Meta requirements
- Homepage: title ~60 chars, description ~155 chars, national focus with pricing hook (RM3.50/sqft)
- Location pages: title includes city + "cat rumah", description includes city + service promise
- All pages: self-referencing canonical

### Schema Markup Plan
| Page | Schema Types |
|------|-------------|
| Homepage | Organization, WebSite, Service, AggregateRating (4.9/5) |
| Location pages | LocalBusiness, Service, FAQPage, BreadcrumbList, AggregateRating |
| All pages | BreadcrumbList |

### Internal linking
- Homepage → all 16 location pages (via Locations Accordion)
- Location pages → homepage (breadcrumbs + nav)
- Location pages → 3 nearby locations (via Nearby Locations section)
- Footer → key city pages + homepage

---

## 6. i18n Requirements

### Confirmed Languages

| Language | Locale Code | Status |
|----------|-------------|--------|
| Bahasa Melayu | `ms` | **DEFAULT** |
| English | `en` | Secondary |
| Mandarin Chinese | `zh` | Secondary |

### Implementation Details
- **Library:** next-intl
- **Routing strategy:** Prefix-based, `prefix-always` (`/ms/...`, `/en/...`, `/zh/...`)
- **Default locale:** `ms` (still uses `/ms/` prefix for hreflang correctness)
- **Root `/` redirect:** redirects to `/ms`
- **Message files:** `messages/ms.json`, `messages/en.json`, `messages/zh.json`
- **Language switcher:** in Nav component, preserves current path when switching
- **Location slugs:** stay in lowercase-hyphen English (e.g. `/zh/cat-rumah/kuala-lumpur`, not `/zh/cat-rumah/吉隆坡`)
- **Product slug:** `cat-rumah` across all locales (stays identical)
- **Fallback:** missing keys fall back to `ms`
- **Chinese variant:** Simplified (`zh-Hans`)

### Font
- **Inter** globally for all locales (per user preference — no serif fonts anywhere)
- For `zh` locale, add Noto Sans SC as fallback for CJK glyphs
- Inter headings use tight tracking; body uses generous line-height

---

## 7. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 (App Router) | Server components, ISR, file-based routing |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Database | Supabase (shared instance) | Shared across all SEO websites per CLAUDE.md |
| i18n | next-intl | Proven in existing projects |
| Deployment | Vercel | Automatic ISR, previews |
| Font | Inter (global) | User preference — no serif |
| WhatsApp buttons | #25D366 green, new tab | User preference |
| Images | Real images from catrumah.com.my wixstatic CDN | User preference — no placeholders |

### Brand Design Tokens (seed — Kagura may refine)
```
--color-brand-teal:       #1FB8A7   (primary CTA, accents)
--color-brand-charcoal:   #1E2430   (primary text, navbar)
--color-brand-off-white:  #F7F8FA   (page background)
--color-brand-light-gray: #E8ECF1   (surface cards)
--color-brand-gray:       #5A6472   (body text)
--color-whatsapp-green:   #25D366   (WhatsApp buttons only)
```

### Key Architecture Rules

1. **Layout ownership:** `app/[locale]/layout.tsx` MUST NOT contain header/footer. Each page component (homepage, location pages) owns its Nav + Footer inline. This prevents duplicate header/footer rendering bugs seen in past projects.

2. **Section order parity:** Homepage and location pages MUST have IDENTICAL section order. Location pages may add `Breadcrumbs` and `NearbyLocations` but must not omit any homepage section.

   **Section order (homepage + location pages):**
   ```
   1.  FOMO Banner
   2.  Nav
   3.  Hero
   4.  Stats
   5.  Products           (6 paint service cards)
   6.  How It Works       (3 steps — NOT 4)
   7.  Risk / Problem
   8.  Mid CTA
   9.  Google Reviews     (with Google branding + 4.9/5)
   10. Why Choose
   11. Gallery            (before/after)
   12. Locations Accordion
   13. FAQ
   14. Final CTA
   15. Footer
   ```

   **Location page extras (inserted at fixed positions):**
   - `Breadcrumbs` — between `Nav` (2) and `Hero` (3)
   - `NearbyLocations` — between `Locations Accordion` (12) and `FAQ` (13)

3. **Database column naming (MUST match existing schema):**
   - Table: `phone_numbers`
   - Column: `website` (NOT `website_slug`) — value `cat-rumah-malaysia.vercel.app`
   - Default row: `location_slug = 'all'` (NOT `null`)

4. **WhatsApp links:** All WhatsApp links MUST use `target="_blank" rel="noopener noreferrer"` to open in a new tab.

5. **How It Works:** Exactly **3 steps** (Contact → Site Visit & Quote → Painted). Not 4.

6. **Google Reviews section:** MUST include Google logo in the section header and a small Google icon on each review card. Display 4.9/5 aggregate rating prominently.

7. **Favicon:** Set via `app/icon.svg` using brand icon.

8. **Layout uniqueness:** Hero, Products, Google Reviews, and Gallery sections must use a DIFFERENT layout from every other project in `projects/`. Kagura must review existing projects first and propose a unique visual direction.

9. **No empty spaces:** No unused whitespace gaps between sections. Every section must earn its vertical space.

10. **Inter font only:** No serif fonts anywhere in the site.

11. **Shared env:** `.env.local` is a symlink to `../../.env.local`. `next.config.ts` must call `loadEnvConfig(process.cwd() + '/../..')` from `@next/env`.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://cat-rumah-malaysia.vercel.app
```

Same three vars must be added to Vercel via `vercel env add` before deploy.

---

## Site Config Values (for `config/site.ts`)

```ts
export const site = {
  domain: 'cat-rumah-malaysia.vercel.app',
  siteUrl: 'https://cat-rumah-malaysia.vercel.app',
  siteName: 'Cat Rumah Malaysia',
  tagline: 'Rumah Lama Terus Nampak Baru Dalam 5 Jam — Dari RM3.50/sqft',
  productSlug: 'cat-rumah',
  productName: 'Cat Rumah',
  phone: '60174287801',
  phoneDisplay: '+60 17-428 7801',
  whatsappText: 'Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?',
  supabaseWebsiteKey: 'cat-rumah-malaysia.vercel.app',
  defaultLocale: 'ms',
  locales: ['ms', 'en', 'zh'],
  brands: ['Nippon Paint', 'Jotun', 'Dulux'],
  rating: { value: 4.9, count: 200 },
  pricingFrom: 'RM3.50/sqft',
};
```

---

## Products Config (for `config/products.ts`)

The 6 paint services mirroring catrumah.com.my:

| Slug | MS Name | EN Name | ZH Name | Starting Price |
|------|---------|---------|---------|----------------|
| `cat-dinding-rumah` | Cat Dinding Rumah | Interior Wall Painting | 室内墙壁油漆 | RM3.50/sqft |
| `cat-luar-rumah` | Cat Luar Rumah | Exterior Wall / Weathershield | 外墙油漆 | RM3.50/sqft |
| `cat-siling` | Cat Siling | Ceiling Painting | 天花板油漆 | RM3.50/sqft |
| `cat-epoxy-lantai` | Cat Epoxy Lantai | Epoxy Floor Paint | 环氧地坪漆 | From RM2,000 |
| `cat-pagar-rumah` | Cat Pagar Rumah | Fence Painting | 围栏油漆 | Quote on site |
| `outdoor-metal-paint` | Cat Besi Luar | Outdoor Metal Paint | 户外金属漆 | From RM1,800 |

These are rendered as cards in the `Products` section — NOT separate pages. Location pages stay at `/[locale]/cat-rumah/[location]`; no nested `[product]/[location]` routes.

---

## 8. Location Data Summary

**16 Malaysian cities** — Klang Valley heavy + all major state capitals and high-demand towns where house painting service is in strong demand.

| # | City | Slug | State | Region |
|---|------|------|-------|--------|
| 1 | Kuala Lumpur | `kuala-lumpur` | WP Kuala Lumpur | Klang Valley |
| 2 | Petaling Jaya | `petaling-jaya` | Selangor | Klang Valley |
| 3 | Shah Alam | `shah-alam` | Selangor | Klang Valley |
| 4 | Subang Jaya | `subang-jaya` | Selangor | Klang Valley |
| 5 | Puchong | `puchong` | Selangor | Klang Valley |
| 6 | Cheras | `cheras` | Selangor/KL | Klang Valley |
| 7 | Ampang | `ampang` | Selangor | Klang Valley |
| 8 | Klang | `klang` | Selangor | Klang Valley |
| 9 | Kajang | `kajang` | Selangor | Klang Valley |
| 10 | Cyberjaya | `cyberjaya` | Selangor | Klang Valley |
| 11 | Putrajaya | `putrajaya` | WP Putrajaya | Klang Valley |
| 12 | Seremban | `seremban` | Negeri Sembilan | Southern |
| 13 | Melaka | `melaka` | Melaka | Southern |
| 14 | Johor Bahru | `johor-bahru` | Johor | Southern |
| 15 | Ipoh | `ipoh` | Perak | Northern |
| 16 | George Town (Penang) | `george-town` | Pulau Pinang | Northern |

**Rationale:** 11 Klang Valley entries (highest demand — dense housing, highest purchasing power, bulk of renovation/painting search volume), plus the 5 most-searched non-KV urban centres (JB, Penang, Ipoh, Melaka, Seremban). Sits within the requested 10–20 range and keeps build + copy cost manageable for launch.

Each entry in `config/locations.ts`:
```ts
{
  name: 'Kuala Lumpur',
  slug: 'kuala-lumpur',
  state: 'WP Kuala Lumpur',
  stateSlug: 'wp-kuala-lumpur',
  nearby: ['petaling-jaya', 'cheras', 'ampang'],
}
```

---

## Agent Handoff Summary

| Next Agent | Receives | Produces |
|------------|----------|----------|
| **Cyclops** (Database) | This architecture doc | Verified `company_websites` row + seeded `phone_numbers` row for `cat-rumah-malaysia.vercel.app` |
| **Sora** (SEO) | This architecture doc | Keyword plan, meta templates, schema markup plan, internal linking map |
| **Nana** (Copywriter) | Architecture + Sora's plan | Homepage copy + 16 location page copy blocks × 3 locales |
| **Kagura** (UI) | Architecture + Nana's copy | Unique design direction (reviews existing projects first) |
| **Kimmy** (Tech Impl) | Architecture + Nana's copy | Metadata, schema, alt text, i18n files, WhatsApp redirect |
| **Layla** (QA + Deploy) | Everything above | Integration test → GitHub push → Vercel deploy |

**Next step:** Cyclops and Sora run **in parallel**.

---

## Blockers & Notes

- **No blockers.** All inputs confirmed.
- **Reference site:** https://www.catrumah.com.my/ — mirror product listing and use wixstatic images directly (no placeholders).
- **Brand assets:** check `brand_assets/` folder — use any provided logos/colors. Otherwise derive from reference site.
- **Phone:** `+60 17-428 7801` (leads_mode: `single`).
- **Default language is `ms` (Bahasa Melayu)** — this is critical; most past projects defaulted to `en`. Translation fallback is to `ms`, not `en`.
- **Product slug decision:** `cat-rumah` (not `perkhidmatan-cat-rumah`) — shorter, cleaner URL, reads naturally in all three locales, and avoids URL bloat.
