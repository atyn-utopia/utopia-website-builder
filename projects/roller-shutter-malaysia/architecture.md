# Roller Shutter Door Malaysia — System Architecture

**Version:** 1.0
**Date:** 2026-04-06
**Architect:** Alpha
**Project:** Roller Shutter Door (Sales + Service)
**Domain:** roller-shutter-malaysia.vercel.app
**Brand:** Roller Shutter Door Malaysia

---

## 1. Folder & Routing Structure

### Next.js App Router — Complete Folder Tree

```
projects/roller-shutter-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                          # Locale layout (i18n provider, meta) — NO header/footer
│   │   ├── page.tsx                            # Homepage (includes own header + footer inline)
│   │   ├── roller-shutter/
│   │   │   └── [location]/
│   │   │       └── page.tsx                    # Location pages (includes own header + footer inline)
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx                        # WhatsApp redirect (server)
│   │       └── RedirectClient.tsx              # WhatsApp redirect (client)
│   ├── api/
│   │   └── phones/
│   │       └── route.ts                        # Phone number API
│   ├── layout.tsx                              # Root app layout (fonts, globals)
│   ├── globals.css                             # Global styles
│   ├── robots.ts                               # robots.txt
│   └── sitemap.ts                              # Sitemap
│
├── components/
│   ├── sections/
│   │   ├── FomoBanner.tsx                      # FOMO urgency banner
│   │   ├── Nav.tsx                             # Navigation bar
│   │   ├── HeroSection.tsx                     # Hero with CTA
│   │   ├── StatsSection.tsx                    # Trust stats/counters
│   │   ├── ProductsSection.tsx                 # 6 roller shutter types
│   │   ├── HowItWorksSection.tsx               # Process steps
│   │   ├── RiskProblemSection.tsx              # Pain points / why you need this
│   │   ├── MidCTASection.tsx                   # Mid-page CTA
│   │   ├── GoogleReviewsSection.tsx            # Google reviews/testimonials
│   │   ├── WhyChooseSection.tsx                # USPs / differentiators
│   │   ├── GallerySection.tsx                  # Project gallery
│   │   ├── LocationsAccordionSection.tsx       # Locations by region (accordion)
│   │   ├── NearbyLocationsSection.tsx          # Nearby locations (location pages only)
│   │   ├── FAQSection.tsx                      # FAQ accordion
│   │   ├── FinalCTASection.tsx                 # Final CTA
│   │   ├── FooterSection.tsx                   # Footer
│   │   └── Breadcrumbs.tsx                     # Breadcrumbs (location pages only)
│   ├── ui/
│   │   ├── WhatsAppButton.tsx                  # WhatsApp CTA button (green #25D366)
│   │   ├── PhoneButton.tsx                     # Click-to-call button
│   │   └── LanguageSwitcher.tsx                # Language switcher
│   └── schema/
│       ├── OrganizationSchema.tsx
│       ├── LocalBusinessSchema.tsx
│       ├── FAQSchema.tsx
│       ├── BreadcrumbSchema.tsx
│       └── ProductSchema.tsx
│
├── config/
│   ├── locations.ts                            # All 50 locations with slugs, display names, regions
│   ├── products.ts                             # 6 roller shutter types + 5 services
│   └── site.ts                                 # Site config (domain, brand, phone fallback)
│
├── lib/
│   ├── getPhoneNumber.ts                       # Phone fetch + random rotation logic
│   └── supabase.ts                             # Supabase client
│
├── i18n/
│   ├── routing.ts                              # next-intl routing config
│   └── request.ts                              # next-intl request config
│
├── messages/
│   ├── ms.json                                 # Bahasa Melayu (DEFAULT)
│   ├── en.json                                 # English
│   └── zh.json                                 # Mandarin Chinese (Simplified)
│
├── middleware.ts                                # next-intl middleware (locale detection)
├── next.config.ts
├── package.json
└── tsconfig.json
```

### URL Structure

| Locale | Homepage | Location Page | WhatsApp Redirect |
|---|---|---|---|
| Bahasa Melayu (default) | `/ms` | `/ms/roller-shutter/kuala-lumpur` | `/ms/redirect-whatsapp-1` |
| English | `/en` | `/en/roller-shutter/kuala-lumpur` | `/en/redirect-whatsapp-1` |
| Mandarin Chinese | `/zh` | `/zh/roller-shutter/kuala-lumpur` | `/zh/redirect-whatsapp-1` |

**Root `/`** redirects to `/ms` (default locale).

---

## 2. Page Inventory

### Pages per locale (3 locales: ms, en, zh)

| Page | Route | Per locale | Total |
|---|---|---|---|
| Homepage | `/[locale]` | 1 | 3 |
| Location pages | `/[locale]/roller-shutter/[location]` | 50 | 150 |
| WhatsApp redirect | `/[locale]/redirect-whatsapp-1` | 1 | 3 |

### Grand Total: (50 locations x 3 locales) + (1 homepage x 3) + (1 redirect x 3) = **156 pages**

### 50 Target Locations

**Klang Valley (20):**
kuala-lumpur, petaling-jaya, shah-alam, subang-jaya, cheras, ampang, puchong, bangsar, damansara, cyberjaya, putrajaya, kajang, bangi, rawang, klang, kepong, seri-kembangan, balakong, sungai-buloh, batu-caves

**Southern Selangor & Industrial (6):**
port-klang, glenmarie, hicom-shah-alam, pandan-indah, sri-damansara, kota-damansara

**Negeri Sembilan (3):**
seremban, nilai, senawang

**Northern (6):**
penang, ipoh, alor-setar, sungai-petani, taiping, butterworth

**Southern (7):**
johor-bahru, melaka, batu-pahat, muar, kluang, skudai, iskandar-puteri

**East Coast (4):**
kuantan, kota-bharu, kuala-terengganu, temerloh

**East Malaysia (4):**
kota-kinabalu, kuching, miri, sandakan

### Section Order (Homepage)

All pages follow this IDENTICAL section order:

1. FOMO Banner
2. Nav
3. Hero
4. Stats
5. Products (6 roller shutter types)
6. How It Works
7. Risk/Problem
8. Mid CTA
9. Google Reviews
10. Why Choose
11. Gallery
12. Locations Accordion
13. FAQ
14. Final CTA
15. Footer

### Section Order (Location Pages)

Same as homepage with two additions:

1. FOMO Banner
2. Nav
3. **Breadcrumbs** (Home > Roller Shutter > {City})
4. Hero
5. Stats
6. Products
7. How It Works
8. Risk/Problem
9. Mid CTA
10. Google Reviews
11. Why Choose
12. Gallery
13. Locations Accordion
14. **Nearby Locations** (3-5 geographically close cities)
15. FAQ
16. Final CTA
17. Footer

### Layout Rule

`app/[locale]/layout.tsx` must NOT contain header or footer. Each page (homepage, location pages) owns its own header and footer inline within the page file.

---

## 3. Data Flow

### Phone Number Rotation

1. User clicks WhatsApp button or CTA on any page
2. Redirected to `/[locale]/redirect-whatsapp-1`
3. Server component calls `getPhoneNumber()`:
   - Queries Supabase: `SELECT phone_number FROM phone_numbers WHERE website = 'roller-shutter-malaysia.vercel.app' AND product_slug = 'roller-shutter' AND location_slug = :location AND is_active = true`
   - If location-specific numbers exist, picks one at random
   - If none found, falls back to `location_slug = 'all'`
   - If still none found, uses FALLBACK_PHONE: `60174287801`
4. Builds WhatsApp URL: `https://wa.me/{phone_number}?text={pre-filled message}`
5. Client component (`RedirectClient.tsx`) performs the redirect

### Fallback Chain

```
location-specific number → location_slug='all' default → FALLBACK_PHONE (60174287801)
```

### Translation Loading

- next-intl loads `messages/[locale].json` per request
- Location-specific copy (intros, FAQs, meta) stored in translation files keyed by location slug
- Location display names stored in `config/locations.ts`

### Static Generation (generateStaticParams)

All 150 location pages + 3 homepages statically generated at build time via `generateStaticParams()` returning all locale x location combinations.

### ISR / Revalidation Strategy

| Page type | Revalidation |
|---|---|
| Homepage | `revalidate = 86400` (24 hours) |
| Location pages | `revalidate = 86400` (24 hours) |
| WhatsApp redirect | Dynamic (no cache) — always fetches fresh phone number |
| Phone API | Dynamic (no cache) |

---

## 4. Database Requirements (for Cyclops)

### phone_numbers table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `website` | text | `'roller-shutter-malaysia.vercel.app'` |
| `product_slug` | text | `'roller-shutter'` |
| `location_slug` | text | e.g. `'kuala-lumpur'`, default entries use `'all'` |
| `phone_number` | text | E.164 format, e.g. `'60174287801'` |
| `label` | text | Optional, e.g. "KL Team 1" |
| `is_active` | boolean | Default `true` |
| `created_at` | timestamptz | Auto-generated |

### Critical Rules

- Column name is `website` (NOT `website_slug`)
- Default/fallback rows use `location_slug = 'all'` (NOT null)
- FALLBACK_PHONE: `60174287801`

### Indexes

- Composite index on `(website, product_slug, location_slug, is_active)`

### RLS (Row Level Security)

- Public `SELECT` where `is_active = true`
- `INSERT` / `UPDATE` / `DELETE` restricted to service role only

### Seed Data

Insert at minimum one default row:

```sql
INSERT INTO phone_numbers (website, product_slug, location_slug, phone_number, is_active)
VALUES ('roller-shutter-malaysia.vercel.app', 'roller-shutter', 'all', '60174287801', true);
```

---

## 5. SEO Structure (for Sora)

### Primary Keywords

| Language | Primary Keywords |
|---|---|
| Bahasa Melayu (default) | "roller shutter", "pintu roller shutter", "pintu besi gulung" |
| English | "roller shutter door", "roller shutter Malaysia" |
| Mandarin Chinese | "卷帘门", "铁卷门马来西亚" |

### Location Modifier Pattern

- BM: "roller shutter {city}" / "pintu roller shutter di {city}"
- EN: "roller shutter door {city}" / "roller shutter installation {city}"
- ZH: "{city}卷帘门" / "{city}铁卷门安装"

### Long-tail Keywords

- "harga roller shutter {city}"
- "repair roller shutter 24 jam {city}"
- "roller shutter motor upgrade {city}"
- "fire rated roller shutter {city}"
- "emergency roller shutter repair near me"

### Page Hierarchy

Flat hub-and-spoke model:

```
/ (homepage) → /roller-shutter/[location] (50 location pages)
```

### Internal Linking Strategy

- Homepage locations accordion links to all 50 location pages
- Each location page links to 3-5 geographically nearby locations (Nearby Locations section)
- Footer links to top 6-8 high-traffic locations
- Breadcrumbs on location pages: Home > Roller Shutter > {City}

### hreflang Configuration

Every page includes hreflang tags for all 3 locales + x-default:

```html
<link rel="alternate" hreflang="ms" href="https://roller-shutter-malaysia.vercel.app/ms/..." />
<link rel="alternate" hreflang="en" href="https://roller-shutter-malaysia.vercel.app/en/..." />
<link rel="alternate" hreflang="zh" href="https://roller-shutter-malaysia.vercel.app/zh/..." />
<link rel="alternate" hreflang="x-default" href="https://roller-shutter-malaysia.vercel.app/ms/..." />
```

**x-default points to `ms` (Bahasa Melayu).**

### Per-Page SEO

- Unique meta title and description per location per language
- H1 includes location name + primary keyword
- Schema markup: LocalBusiness, FAQPage, BreadcrumbList, Product
- Unique introductory paragraph per location (no duplicate content across locations)
- Image alt text includes location + product keywords

---

## 6. i18n Requirements (for Kimmy)

### Confirmed Languages

| Language | Locale Code | URL Prefix | Role |
|---|---|---|---|
| Bahasa Melayu | `ms` | `/ms` | **DEFAULT** locale, x-default |
| English | `en` | `/en` | Secondary |
| Mandarin Chinese | `zh` | `/zh` | Tertiary (Simplified Chinese) |

### Implementation

- **Library:** next-intl
- **Routing:** Locale prefix in URL path (mandatory for all locales)
- **Default locale:** `ms` — root `/` redirects to `/ms`
- **Locale detection:** Accept-Language header > cookie > default to `ms`
- **Fallback:** Missing translation keys fall back to `ms`

### Translation File Structure (messages/*.json)

```json
{
  "metadata": {
    "title": "...",
    "description": "..."
  },
  "nav": { ... },
  "hero": { ... },
  "stats": { ... },
  "products": { ... },
  "howItWorks": { ... },
  "riskProblem": { ... },
  "midCta": { ... },
  "reviews": { ... },
  "whyChoose": { ... },
  "gallery": { ... },
  "locations": { ... },
  "faq": { ... },
  "finalCta": { ... },
  "footer": { ... },
  "breadcrumbs": { ... },
  "nearbyLocations": { ... },
  "fomoBanner": { ... },
  "common": {
    "callNow": "...",
    "whatsappUs": "...",
    "freeQuote": "..."
  },
  "locationPages": {
    "kuala-lumpur": {
      "intro": "...",
      "metaTitle": "...",
      "metaDescription": "...",
      "faq": [ ... ]
    }
  }
}
```

### Language Switcher

- Displayed in Nav on all pages
- Switches locale while preserving current page path
- Example: `/ms/roller-shutter/kuala-lumpur` > `/en/roller-shutter/kuala-lumpur`

---

## 7. Technical Decisions

| Technology | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | SSG + ISR, nested layouts |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Database | Supabase | Multi-tenant, RLS, shared across websites |
| i18n | next-intl | Best App Router integration |
| Deployment | Vercel | Native Next.js support |
| Font | Inter | User preference — sans-serif for all text |

### Key Architectural Decisions

1. **Static generation** — All 156 pages pre-rendered at build time. ISR handles updates.
2. **Locale in URL path** — `/ms/`, `/en/`, `/zh/` for SEO authority on one domain.
3. **ms as default locale** — Bahasa Melayu is the primary audience. Root `/` redirects to `/ms`.
4. **No product hub page** — Location listing on homepage directly via accordion.
5. **Homepage and location pages share identical section order** — Only copy and phone numbers differ, plus location pages add Breadcrumbs and Nearby Locations.
6. **Layout.tsx has NO header/footer** — Each page owns its complete layout inline.
7. **WhatsApp-only CTA** — All CTAs route to `wa.me/{phone}` with pre-filled message. WhatsApp buttons use green (#25D366).
8. **Supabase fallback chain** — Location-specific > `location_slug='all'` default > hardcoded FALLBACK_PHONE.
9. **24-hour emergency messaging** — Prominent in FOMO banner, hero, and CTA sections as key differentiator.
10. **Phone number column is `website`** — Not `website_slug`. Value: `'roller-shutter-malaysia.vercel.app'`.
11. **Default location_slug is `'all'`** — Not null.

### Brand Design Tokens (to be finalized by Kagura)

Suggested direction — industrial/security aesthetic:

```
--color-brand-charcoal:   #2D2D2D    (primary text, navbar)
--color-brand-steel:      #5A6978    (secondary text, accents)
--color-brand-orange:     #E87A2E    (primary CTA, headings, urgency)
--color-brand-dark:       #1A1A2E    (dark sections, footer)
--color-brand-light:      #F5F5F5    (page background)
--color-brand-white:      #FFFFFF    (cards, surfaces)
--color-whatsapp:         #25D366    (WhatsApp buttons only)
```

### Products Data (config/products.ts)

```ts
export const products = [
  { slug: 'mild-steel', name: 'Mild Steel Roller Shutter' },
  { slug: 'aluminium', name: 'Aluminium Roller Shutter' },
  { slug: 'polycarbonate', name: 'Polycarbonate/Transparent Roller Shutter' },
  { slug: 'fire-rated', name: 'Fire-Rated Roller Shutter' },
  { slug: 'grille', name: 'Grille Roller Shutter' },
  { slug: 'motorised', name: 'Motorised/Automatic Roller Shutter' },
];

export const services = [
  { slug: 'installation', name: 'New Installation' },
  { slug: 'repair', name: 'Repair & Troubleshooting (24hr Emergency)' },
  { slug: 'maintenance', name: 'Regular Maintenance' },
  { slug: 'motor-upgrade', name: 'Motor Upgrade' },
  { slug: 'spring-replacement', name: 'Spring Replacement' },
];
```

### Locations Data (config/locations.ts)

```ts
export const locations = [
  // Klang Valley (20)
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur', region: 'Klang Valley' },
  { slug: 'petaling-jaya', name: 'Petaling Jaya', region: 'Klang Valley' },
  { slug: 'shah-alam', name: 'Shah Alam', region: 'Klang Valley' },
  // ... all 50 locations with slug, display name, and region
];

export const nearbyMap: Record<string, string[]> = {
  'kuala-lumpur': ['petaling-jaya', 'cheras', 'ampang', 'bangsar', 'kepong'],
  'petaling-jaya': ['kuala-lumpur', 'shah-alam', 'subang-jaya', 'damansara', 'puchong'],
  // ... nearby mappings for all 50 locations
};
```

### Site Config (config/site.ts)

```ts
export const siteConfig = {
  domain: 'roller-shutter-malaysia.vercel.app',
  brandName: 'Roller Shutter Door Malaysia',
  productSlug: 'roller-shutter',
  fallbackPhone: '60174287801',
  defaultLocale: 'ms',
  locales: ['ms', 'en', 'zh'],
  emergency: true, // 24-hour emergency repair
};
```
