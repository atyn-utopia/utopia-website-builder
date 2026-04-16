# Architecture: electric-wheelchair.com.my

Agent: Alpha — System Architect
Status: Complete
Next: Cyclops — Database Engineer + Sora — SEO Strategist (parallel)

---

## Site Purpose

A Malaysian electric wheelchair website optimized for local SEO across ~80 cities.
Offers **rental** (from RM400/month) and **sales** (from RM2,400), plus **wheelchair repair** and **spare parts**.
Targets buyers, renters, and caregivers searching for electric wheelchairs across Malaysia.

### Key Business Lines
1. Electric wheelchair rental (monthly)
2. Electric wheelchair purchase
3. Wheelchair repair services
4. Wheelchair spare parts

---

## 1. Folder & Routing Structure

### URL Structure (with i18n)

```
/en                                          → English homepage
/ms                                          → Malay homepage
/zh                                          → Chinese homepage
/en/electric-wheelchair/kuala-lumpur          → English location page
/ms/electric-wheelchair/kuala-lumpur          → Malay location page
/zh/electric-wheelchair/kuala-lumpur          → Chinese location page
/en/redirect-whatsapp-1                      → WhatsApp redirect (English)
```

Default locale (`en`) is included in the URL path (next-intl prefix-always strategy for clarity and hreflang correctness).

### Complete App Router Folder Tree

```
app/
├── [locale]/
│   ├── layout.tsx                              → Root locale layout (fonts, metadata base, next-intl provider)
│   │                                             *** NO header/footer here — pages own their own ***
│   ├── page.tsx                                → Homepage
│   │
│   ├── electric-wheelchair/
│   │   └── [location]/
│   │       └── page.tsx                        → Dynamic location page (ISR)
│   │
│   └── redirect-whatsapp-1/
│       ├── page.tsx                            → WhatsApp redirect server component
│       └── RedirectClient.tsx                  → Client component (random phone pick + redirect)
│
├── globals.css                                 → Tailwind v4 base styles
├── icon.svg                                    → Favicon (brand icon)
├── robots.ts                                   → robots.txt generation
└── sitemap.ts                                  → Auto-generated sitemap.xml (all locales + locations)

components/
├── sections/
│   ├── FomoBanner.tsx                          → Urgency/scarcity banner
│   ├── Nav.tsx                                 → Navigation bar with language switcher
│   ├── Hero.tsx                                → Hero section (rental + sales messaging)
│   ├── Stats.tsx                               → Trust stats (units delivered, cities, etc.)
│   ├── Products.tsx                            → Product cards (rental vs purchase options)
│   ├── HowItWorks.tsx                          → 3-step process (Contact → Assessment → Delivered)
│   ├── RiskProblem.tsx                         → Pain points / why you need this
│   ├── MidCta.tsx                              → Mid-page call-to-action
│   ├── GoogleReviews.tsx                       → Google Reviews with Google branding
│   ├── WhyChoose.tsx                           → Why choose us / differentiators
│   ├── Gallery.tsx                             → Customer/product gallery
│   ├── LocationsAccordion.tsx                  → All locations grouped by state
│   ├── Faq.tsx                                 → FAQ section (location-aware)
│   ├── FinalCta.tsx                            → Final call-to-action
│   ├── Footer.tsx                              → Footer with links, contact, sitemap
│   ├── Breadcrumbs.tsx                         → Breadcrumbs (location pages only)
│   └── NearbyLocations.tsx                     → Nearby locations (location pages only)
│
├── ui/
│   ├── WhatsAppButton.tsx                      → Green (#25D366) WhatsApp CTA, opens new tab
│   ├── LanguageSwitcher.tsx                    → en/ms/zh language toggle
│   └── StarRating.tsx                          → Star rating display
│
└── seo/
    ├── StructuredData.tsx                      → JSON-LD schema injection
    └── BreadcrumbSchema.tsx                    → BreadcrumbList schema

config/
├── architecture.md                             → This file
├── site.ts                                     → Site-wide config (domain, product slug, phone, etc.)
└── locations.ts                                → Location metadata (name, slug, state, stateSlug, nearby)

lib/
├── supabase.ts                                 → Supabase client initialization
├── getPhoneNumbers.ts                          → Query phone numbers by website + product + location
└── utils.ts                                    → Shared utility functions

i18n/
├── routing.ts                                  → next-intl routing config (locales: en, ms, zh)
└── request.ts                                  → next-intl request config (message loading)

messages/
├── en.json                                     → English translations
├── ms.json                                     → Bahasa Melayu translations
└── zh.json                                     → Mandarin Chinese translations

middleware.ts                                   → next-intl middleware (locale detection + routing)
```

---

## 2. Page Inventory

### Total pages: 3 page types x 3 languages = effective page count below

| Page | Route Pattern | Count per Locale | Total (3 locales) |
|------|---------------|------------------|--------------------|
| Homepage | `/[locale]` | 1 | 3 |
| Location pages | `/[locale]/electric-wheelchair/[location]` | ~80 | ~240 |
| WhatsApp redirect | `/[locale]/redirect-whatsapp-1` | 1 | 3 |
| **Total** | | **~82** | **~246** |

### Homepage (`/[locale]`)
- General landing page for "Electric Wheelchair Malaysia"
- Covers rental, sales, repair, and spare parts
- Contains all sections in the standard section order
- No location-specific content

### Location Pages (`/[locale]/electric-wheelchair/[location]`)
- One page per city (~80 cities)
- Location-specific H1, meta title, meta description, FAQ, and copy
- Includes Breadcrumbs and Nearby Locations (extra sections)
- Same section order as homepage plus the location-specific extras

### WhatsApp Redirect (`/[locale]/redirect-whatsapp-1`)
- Server component loads phone numbers from Supabase
- Client component picks one at random and redirects to `https://wa.me/[number]`
- Accepts `?location=kuala-lumpur` query param for location-specific number lookup
- Falls back to `location_slug = 'all'` default numbers if no location-specific match

---

## 3. Data Flow

### Phone Number Flow
```
User clicks WhatsApp button (green, target="_blank")
  → navigates to /[locale]/redirect-whatsapp-1?location=[slug]
  → Server component queries Supabase:
      SELECT phone_number FROM phone_numbers
      WHERE website = 'electric-wheelchair.com.my'
        AND product_slug = 'electric-wheelchair'
        AND (location_slug = '[slug]' OR location_slug = 'all')
        AND is_active = true
  → Client component picks one number at random
  → Redirects to https://wa.me/6010888XXXX?text=[prefilled message]
```

### Location Slug → Page Mapping
```
config/locations.ts
  → exports Location[] array with ~80 entries
  → each entry: { name, slug, state, stateSlug }

app/[locale]/electric-wheelchair/[location]/page.tsx
  → generateStaticParams() reads locations.ts → returns all slugs
  → generateMetadata() builds unique title + description per location + locale
  → Page component renders sections with location-specific props
```

### Translation Loading (next-intl)
```
middleware.ts
  → detects locale from URL prefix
  → next-intl routing config: locales ['en', 'ms', 'zh'], default 'en'

i18n/request.ts
  → loads messages/[locale].json based on active locale

app/[locale]/layout.tsx
  → wraps children in NextIntlClientProvider with loaded messages

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

Cyclops must design and implement the following in Supabase:

### Tables Required

**phone_numbers** (shared table — already exists from other projects)
- `website` column (NOT `website_slug`) — value: `'electric-wheelchair.com.my'`
- `product_slug` — value: `'electric-wheelchair'`
- `location_slug` — value: city slug or `'all'` for default (NOT `null`)
- `phone_number` — full international format
- `is_active` — boolean
- Must support multiple numbers per website+product+location combination
- Random selection happens in application code, not database

**Seed data requirements:**
- Default phone number(s) with `location_slug = 'all'`: `6010-888 9849`
- Optionally, location-specific numbers for high-priority cities (KL, JB, Penang, etc.)

### Row-Level Security
- Anon key: read-only access to `phone_numbers` where `is_active = true`
- No public write access

### No new tables needed for locations
- Location data lives in `config/locations.ts` (static, no database)
- This keeps builds fast and avoids unnecessary Supabase queries at build time

---

## 5. SEO Requirements (for Sora)

Sora must plan the following:

### Keyword Strategy
- Primary keyword: "electric wheelchair Malaysia"
- Secondary keywords: "electric wheelchair rental", "electric wheelchair for sale", "wheelchair repair Malaysia", "wheelchair spare parts"
- Location keywords: "electric wheelchair [city]", "electric wheelchair rental [city]"
- Long-tail: "rent electric wheelchair in [city]", "buy electric wheelchair [city]", "electric wheelchair repair near me [city]"
- Bilingual keywords: Malay and Chinese equivalents for all primary/secondary terms

### Page Hierarchy & Keyword Mapping
- Homepage → "Electric Wheelchair Malaysia" (broad national term)
- Location pages → "Electric Wheelchair [City]" (city-specific)
- Each location page must have unique copy (no duplicate content)

### Hreflang Implementation
- Every page needs hreflang tags for all 3 language versions:
  - `<link rel="alternate" hreflang="en" href="https://www.electric-wheelchair.com.my/en/..." />`
  - `<link rel="alternate" hreflang="ms" href="https://www.electric-wheelchair.com.my/ms/..." />`
  - `<link rel="alternate" hreflang="zh" href="https://www.electric-wheelchair.com.my/zh/..." />`
  - `<link rel="alternate" hreflang="x-default" href="https://www.electric-wheelchair.com.my/en/..." />`

### Meta Requirements Per Page Type
- **Homepage**: title ~60 chars, description ~155 chars, national keyword focus
- **Location pages**: title includes city name, description includes city + service type (rental/sales)
- All pages: canonical self-referencing URL

### Schema Markup Plan
| Page | Schema Types |
|------|-------------|
| Homepage | Organization, WebSite, Product (rental + sales) |
| Location pages | LocalBusiness, Product, FAQPage, BreadcrumbList |
| All pages | BreadcrumbList |

### Internal Linking Strategy
- Homepage → all location pages (via Locations Accordion)
- Location pages → homepage (via breadcrumb + nav)
- Location pages → 3 nearby locations (via Nearby Locations section)
- Footer → key location pages + homepage
- Cross-link between rental and sales content within pages

### Sitemap Requirements
- Include all 3 locale versions of every page
- Exclude redirect-whatsapp-1 from sitemap
- Submit to Google Search Console for .com.my domain

---

## 6. i18n Requirements

### Confirmed Languages

| Language | Locale Code | Status |
|----------|-------------|--------|
| English | `en` | Default |
| Bahasa Melayu | `ms` | Secondary |
| Mandarin Chinese | `zh` | Secondary |

### Implementation Details

- **Library:** next-intl
- **Routing strategy:** Prefix-based (`/en/...`, `/ms/...`, `/zh/...`)
- **Default locale:** `en` (still uses `/en/` prefix in URL)
- **Message files:** `messages/en.json`, `messages/ms.json`, `messages/zh.json`
- **Language switcher:** Visible in Nav component, switches locale while preserving current path
- **URL slugs:** Location slugs stay in English across all locales (e.g., `/zh/electric-wheelchair/kuala-lumpur` not `/zh/electric-wheelchair/吉隆坡`)
- **Product slug:** Stays as `electric-wheelchair` across all locales

### Translation Scope
All user-facing text must be translated:
- Navigation labels
- Section headings and body copy
- Button labels (WhatsApp CTA, etc.)
- FAQ questions and answers
- Meta titles and descriptions
- Alt text for images
- Location display names (city names in local language where applicable)

### Font Considerations
- Use **Inter** font for all languages (as per user preference)
- Inter has good Latin and CJK coverage
- For Chinese characters, Inter falls back to system fonts — consider adding Noto Sans SC as a fallback for zh locale

---

## 7. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 (App Router) | Server components, ISR, file-based routing |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Database | Supabase (shared instance) | Already used across all SEO websites |
| i18n | next-intl | Proven in existing projects, App Router support |
| Deployment | Vercel | Automatic ISR, edge network, preview deploys |
| Font | Inter (global) | User preference — no serif fonts |
| WhatsApp buttons | #25D366 green | User preference — WhatsApp brand color |
| Images | Real images from electric-wheelchair.com.my | User preference — no placeholders |

### Key Architecture Rules

1. **Layout ownership:** `app/[locale]/layout.tsx` must NOT contain header/footer. Each page component owns its own header and footer inline.

2. **Section order parity:** Homepage and location pages must have IDENTICAL section order:

```
FOMO Banner
Nav
Hero
Stats
Products
How It Works
Risk/Problem
Mid CTA
Google Reviews
Why Choose
Gallery
Locations Accordion
FAQ
Final CTA
Footer
```

Location page extras (inserted at specific positions):
- **Breadcrumbs** — between Nav and Hero
- **Nearby Locations** — between Locations Accordion and Final CTA

3. **Database column naming:**
   - Table: `phone_numbers`
   - Column: `website` (NOT `website_slug`)
   - Default: `location_slug = 'all'` (NOT `null`)

4. **WhatsApp links:** All WhatsApp links must use `target="_blank" rel="noopener noreferrer"` to open in a new tab.

5. **How It Works:** Exactly 3 steps (Contact → Assessment → Delivered). Not 4.

6. **Google Reviews section:** Must include Google logo in header and small Google icon on each review card.

7. **Favicon:** Must be set using brand icon in `app/icon.svg`.

8. **Layout uniqueness:** Hero, Product cards, Google Reviews, and Gallery sections must use a DIFFERENT layout from existing projects. Check `projects/` folder for used layouts before building.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://www.electric-wheelchair.com.my
```

---

## Site Config Values (for `config/site.ts`)

```
domain: 'electric-wheelchair.com.my'
siteUrl: 'https://www.electric-wheelchair.com.my'
siteName: 'Electric Wheelchair Malaysia'
tagline: 'Electric Wheelchair Rental & Sales in Malaysia'
productSlug: 'electric-wheelchair'
productName: 'Electric Wheelchair'
phone: '6010-888 9849'
supabaseWebsiteKey: 'electric-wheelchair.com.my'
```

---

## Location Data Summary

~80 locations across 14 states/territories:

| Region | Cities | Count |
|--------|--------|-------|
| Klang Valley | kuala-lumpur, petaling-jaya, shah-alam, subang-jaya, puchong, cheras, ampang, kepong, setapak, wangsa-maju, bangsar, mont-kiara, damansara, sri-petaling, bukit-jalil, cyberjaya, putrajaya, kajang, bangi, semenyih, rawang, selayang, gombak, klang, port-klang | 25 |
| Selangor (Other) | sepang, banting, kuala-selangor, hulu-langat, serdang | 5 |
| Negeri Sembilan | seremban, nilai, port-dickson | 3 |
| Melaka | melaka, ayer-keroh, alor-gajah | 3 |
| Johor | johor-bahru, iskandar-puteri, kulai, batu-pahat, muar, kluang, segamat, pontian, mersing, kota-tinggi | 10 |
| Perak | ipoh, taiping, teluk-intan, sitiawan, kampar, batu-gajah, lumut | 7 |
| Penang | george-town, butterworth, bukit-mertajam, nibong-tebal, bayan-lepas, balik-pulau | 6 |
| Kedah | alor-setar, sungai-petani, kulim, langkawi | 4 |
| Perlis | kangar | 1 |
| Kelantan | kota-bharu, pasir-mas, tanah-merah | 3 |
| Terengganu | kuala-terengganu, kemaman, dungun | 3 |
| Pahang | kuantan, temerloh, bentong, raub | 4 |
| Sabah | kota-kinabalu, sandakan, tawau, lahad-datu, keningau | 5 |
| Sarawak | kuching, miri, sibu, bintulu, sri-aman | 5 |
| **Total** | | **~84** |

---

## Agent Handoff Summary

| Next Agent | Receives | Produces |
|------------|----------|----------|
| **Cyclops** (Database) | This architecture doc | Supabase schema, RLS policies, seed data for `electric-wheelchair.com.my` |
| **Sora** (SEO) | This architecture doc | Keyword plan, meta templates, schema markup plan, internal linking map |
| **Nana** (Copywriter) | Architecture + Sora's SEO plan | Website copy for all sections, location-specific content |
| **Fanny** (Location Pages) | Architecture + Nana's copy | ~80 location page content files |
| **Kimmy** (Technical SEO) | Architecture + Nana's copy | Meta tags, schema markup, alt text |
| **Joy** (i18n) | Architecture + Nana's copy | ms.json and zh.json translations |

Cyclops and Sora run in parallel as the next step.

---

## Blockers & Notes

- **No blockers identified.** All required information has been provided.
- **Brand assets:** None provided. Real images must be sourced from https://www.electric-wheelchair.com.my/ at build time.
- **Repair & spare parts messaging:** These are secondary services. They should appear in the Products section and be mentioned in location page copy, but do not need dedicated pages.
- **Rental vs Sales:** Both must be prominently featured. Products section should clearly differentiate rental (from RM400/month) and purchase (from RM2,400) options.
