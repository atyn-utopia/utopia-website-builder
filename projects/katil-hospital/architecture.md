# Encik Beku — serviceaircond.my
## Technical Architecture Plan

**Version:** 1.0  
**Date:** 2026-04-01  
**Architect:** Alpha  
**Project:** Aircond Service & Installation (Encik Beku)  
**Domain:** serviceaircond.my

---

## 1. Folder & Routing Structure

### Next.js App Router — Complete Folder Tree

```
projects/service-aircond-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                          # Root locale layout (i18n provider, meta)
│   │   ├── page.tsx                            # Homepage
│   │   ├── service-aircond/
│   │   │   └── [location]/
│   │   │       └── page.tsx                    # Location pages
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
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppButton.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── LocationsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── FAQSection.tsx
│   │   └── CTASection.tsx
│   ├── schema/
│   │   ├── OrganizationSchema.tsx
│   │   ├── LocalBusinessSchema.tsx
│   │   ├── FAQSchema.tsx
│   │   ├── BreadcrumbSchema.tsx
│   │   └── ProductSchema.tsx
│   └── LanguageSwitcher.tsx
│
├── config/
│   ├── locations.ts                            # All 38 locations with slugs, names, regions
│   ├── products.ts                             # Service types
│   └── site.ts                                 # Site config (domain, brand, defaults)
│
├── lib/
│   ├── getPhoneNumber.ts                       # Phone fetch + rotation logic
│   └── supabase.ts                             # Supabase client
│
├── i18n/
│   ├── routing.ts                              # next-intl routing config
│   └── request.ts                              # next-intl request config
│
├── messages/
│   ├── en.json
│   ├── ms.json
│   └── zh.json
│
├── middleware.ts                                # next-intl middleware
├── next.config.ts
├── package.json
└── tsconfig.json
```

### URL Structure

| Locale | Homepage | Location Page |
|---|---|---|
| English (default) | `/en` | `/en/service-aircond/kuala-lumpur` |
| Bahasa Melayu | `/ms` | `/ms/service-aircond/kuala-lumpur` |
| Mandarin Chinese | `/zh` | `/zh/service-aircond/kuala-lumpur` |

---

## 2. Page Inventory

### Pages per locale (3 locales)

| Page | Route | Per locale |
|---|---|---|
| Homepage | `/[locale]` | 1 |
| Location pages | `/[locale]/service-aircond/[location]` | 38 |
| WhatsApp redirect | `/[locale]/redirect-whatsapp-1` | 1 |

### 38 Target Locations

**Klang Valley (17):** kuala-lumpur, petaling-jaya, shah-alam, subang-jaya, cheras, ampang, puchong, bangsar, damansara, cyberjaya, putrajaya, kajang, bangi, rawang, klang, setia-alam, kepong

**Northern (5):** penang, ipoh, alor-setar, sungai-petani, taiping

**Southern (7):** johor-bahru, melaka, batu-pahat, muar, kluang, skudai, iskandar-puteri

**East Coast (4):** kuantan, kota-bharu, kuala-terengganu, temerloh

**East Malaysia (5):** kota-kinabalu, kuching, miri, sandakan, sibu

**Total: (38 locations × 3 locales) + (1 homepage × 3) + (1 redirect × 3) = 120 pages**

---

## 3. Data Flow

### Phone Number Rotation
1. User clicks WhatsApp button → redirected to `/[locale]/redirect-whatsapp-1`
2. Server component calls `getPhoneNumber()` → queries Supabase for active numbers matching website + product + location
3. Picks one at random → builds `wa.me/` URL
4. Client component redirects to WhatsApp

### Translation Loading
- next-intl loads `messages/[locale].json` per request
- Location-specific copy (intros, FAQs) passed as props from server components

### ISR Strategy
- Homepage + location pages: static at build time, revalidate every 24h
- Phone number fetch: always dynamic (no cache)

---

## 4. Database Requirements (for Cyclops)

### phone_numbers table
- `id` uuid PK
- `website` text ('serviceaircond.my')
- `product_slug` text ('service-aircond')
- `location_slug` text (e.g. 'kuala-lumpur')
- `phone_number` text (E.164 format)
- `label` text (optional, e.g. "KL Team 1")
- `is_active` boolean (default true)
- `created_at` timestamptz

**Index:** (website, product_slug, location_slug, is_active)

### RLS
- Public SELECT where is_active = true
- INSERT/UPDATE/DELETE restricted to service role

---

## 5. SEO Structure (for Sora)

### Keyword targets
- Primary: "aircond service", "servis aircond", "冷气服务"
- Location modifiers: "{service} {city}" pattern
- Long-tail: "aircond service near me {city}", "harga servis aircond {city}"

### Page hierarchy
- Homepage targets national keywords
- Location pages target city-specific keywords
- Internal linking: homepage → all locations, each location → 3-5 nearby locations

### hreflang: en, ms, zh + x-default (en)

---

## 6. i18n Requirements (for Kimmy)

- **Languages:** English (en), Bahasa Melayu (ms), Mandarin Chinese (zh)
- **Default locale:** en
- **Library:** next-intl
- **Fallback:** missing keys fall back to en
- **Chinese:** Simplified Chinese (zh-Hans)

---

## 7. Technical Decisions

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase
- **i18n:** next-intl
- **Deployment:** Vercel

### Brand Design Tokens
```
--color-brand-orange: #E8732A    (primary CTA, headings)
--color-brand-navy:   #1B3A5C    (primary text, navbar, footer)
--color-brand-sky:    #7EC8E3    (accent, hover states)
--color-brand-white:  #FFFFFF
--color-brand-off-white: #F8F6F2 (page background)
--color-brand-gray:   #4A5568    (body text)
```
