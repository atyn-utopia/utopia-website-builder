## Kak Kenduri — Technical SEO + i18n + Lead Tracking

**Author:** Kimmy (Technical Implementation Specialist)
**Project:** tablechair-rental-malaysia
**Domain:** `tablechair-rental-malaysia.vercel.app`
**Brand:** Kak Kenduri
**Product slug:** `table-chair-rental`
**Locales:** `en` (default, x-default), `ms`, `zh`
**Phone (single mode):** `60174287801`
**URLs:** 3 homepages + 114 location pages = 117 indexable URLs

All code blocks below are paste-ready. Every helper and file path matches `architecture.md` section 1.

---

# PART A — TECHNICAL SEO

## 1. `generateMetadata()` — Homepage + Location page

### 1.1 Homepage — `app/[locale]/page.tsx`

```ts
// app/[locale]/page.tsx  (excerpt — metadata only)
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

const SITE_URL = 'https://tablechair-rental-malaysia.vercel.app'

type Params = { locale: 'en' | 'ms' | 'zh' }

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`
  languages['x-default'] = `${SITE_URL}/en`

  return {
    metadataBase: new URL(SITE_URL),
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: 'Kak Kenduri',
      title: t('meta.title'),
      description: t('meta.description'),
      locale: locale === 'en' ? 'en_MY' : locale === 'ms' ? 'ms_MY' : 'zh_CN',
      images: [
        {
          url: `${SITE_URL}/og/home-${locale}.jpg`,
          width: 1200,
          height: 630,
          alt: t('meta.title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`${SITE_URL}/og/home-${locale}.jpg`],
    },
    robots: { index: true, follow: true },
  }
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
```

### 1.2 Location page — `app/[locale]/table-chair-rental/[location]/page.tsx`

```ts
// app/[locale]/table-chair-rental/[location]/page.tsx  (excerpt — metadata only)
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { LOCATIONS } from '@/config/locations'

const SITE_URL = 'https://tablechair-rental-malaysia.vercel.app'
const PRODUCT_SLUG = 'table-chair-rental'

type Params = { locale: 'en' | 'ms' | 'zh'; location: string }

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale, location } = await params
  const loc = LOCATIONS.find((l) => l.slug === location)
  if (!loc) return {}

  const t = await getTranslations({ locale, namespace: 'location' })
  const city = loc.display[locale]

  const title = t('meta.title', { city })
  const description = t('meta.description', { city })

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}/${PRODUCT_SLUG}/${location}`
  }
  languages['x-default'] = `${SITE_URL}/en/${PRODUCT_SLUG}/${location}`

  const canonical = `${SITE_URL}/${locale}/${PRODUCT_SLUG}/${location}`

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Kak Kenduri',
      title,
      description,
      locale: locale === 'en' ? 'en_MY' : locale === 'ms' ? 'ms_MY' : 'zh_CN',
      images: [
        {
          url: `${SITE_URL}/og/location-${location}-${locale}.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og/location-${location}-${locale}.jpg`],
    },
    robots: { index: true, follow: true },
  }
}

export async function generateStaticParams() {
  const params: Params[] = []
  for (const locale of routing.locales) {
    for (const loc of LOCATIONS) {
      params.push({ locale, location: loc.slug })
    }
  }
  return params
}
```

> `t('meta.title', { city })` resolves to, for example, `Table & Chair Rental Shah Alam | From RM3.60 | Kak Kenduri` in `en`, `Sewa Meja Dan Kerusi Shah Alam | Dari RM3.60 | Kak Kenduri` in `ms`, `莎阿南桌椅出租 | RM3.60起 | Kak Kenduri` in `zh`. Formula from `seo-plan.md` section 3.2.

---

## 2. hreflang block (all 3 locales + x-default)

Next.js renders the `alternates.languages` map from `generateMetadata()` as `<link rel="alternate" hreflang="...">` tags automatically. For the Shah Alam example the emitted HTML is:

```html
<link rel="canonical" href="https://tablechair-rental-malaysia.vercel.app/en/table-chair-rental/shah-alam" />
<link rel="alternate" hreflang="en" href="https://tablechair-rental-malaysia.vercel.app/en/table-chair-rental/shah-alam" />
<link rel="alternate" hreflang="ms" href="https://tablechair-rental-malaysia.vercel.app/ms/table-chair-rental/shah-alam" />
<link rel="alternate" hreflang="zh" href="https://tablechair-rental-malaysia.vercel.app/zh/table-chair-rental/shah-alam" />
<link rel="alternate" hreflang="x-default" href="https://tablechair-rental-malaysia.vercel.app/en/table-chair-rental/shah-alam" />
```

Rules:
1. Every one of the 117 pages emits its own 4-entry hreflang block (self-reference included).
2. `x-default` always points to the `en` variant of that specific slug.
3. `canonical` is always self-canonical (locale-prefixed).
4. `sitemap.ts` also includes `<xhtml:link>` alternates (see section 5 below).

---

## 3. Schema JSON-LD

All JSON-LD helpers live in `lib/schema.ts`. Each page imports the helpers it needs and renders `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />` inside its root fragment.

### `lib/schema.ts`

```ts
// lib/schema.ts
export const SITE_URL = 'https://tablechair-rental-malaysia.vercel.app'
export const BRAND_NAME = 'Kak Kenduri'
export const LEGAL_NAME = 'Kak Kenduri Sdn. Bhd.'
export const BRAND_LOGO = `${SITE_URL}/brand/kak-kenduri-logo.png`
export const BRAND_PHONE = '+60174287801'
export const BRAND_EMAIL = 'kerusimejamy@gmail.com'
export const BRAND_PRICE_RANGE = 'RM3.60 - RM86.40'

export const BRAND_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'No. 3, Lot 156, Jalan Jurubina U1/18',
  addressLocality: 'Shah Alam',
  addressRegion: 'Selangor',
  postalCode: '40150',
  addressCountry: 'MY',
} as const

export const BRAND_GEO = {
  '@type': 'GeoCoordinates',
  latitude: 3.0738,
  longitude: 101.5183,
} as const

export const CORE_PRODUCTS = [
  { id: 'standard-chair',  nameKey: 'standardChair',  low: '3.60',  high: '9.60'  },
  { id: 'banquet-chair',   nameKey: 'banquetChair',   low: '14.40', high: '21.60' },
  { id: 'chiavari-chair',  nameKey: 'chiavariChair',  low: '21.60', high: '28.80' },
  { id: 'long-table',      nameKey: 'longTable',      low: '72.00', high: '86.40' },
  { id: 'round-table',     nameKey: 'roundTable',     low: '72.00', high: '86.40' },
  { id: 'cocktail-table',  nameKey: 'cocktailTable',  low: '86.40', high: '86.40' },
] as const

export const STATES_SERVED = [
  'Selangor', 'Kuala Lumpur', 'Johor', 'Negeri Sembilan', 'Perak',
  'Penang', 'Melaka', 'Pahang', 'Kedah', 'Terengganu', 'Kelantan', 'Perlis',
]

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: LEGAL_NAME,
    alternateName: BRAND_NAME,
    url: SITE_URL,
    logo: BRAND_LOGO,
    email: BRAND_EMAIL,
    telephone: BRAND_PHONE,
    address: BRAND_ADDRESS,
    sameAs: [
      `https://wa.me/${BRAND_PHONE.replace('+', '')}`,
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: BRAND_PHONE,
        contactType: 'customer service',
        areaServed: 'MY',
        availableLanguage: ['en', 'ms', 'zh'],
      },
    ],
  }
}

export function websiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/${locale}#website`,
    url: `${SITE_URL}/${locale}`,
    name: BRAND_NAME,
    inLanguage: locale,
    publisher: { '@id': `${SITE_URL}#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/${locale}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function localBusinessHomepageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    additionalType: 'https://www.productontology.org/id/Party_equipment_rental_service',
    '@id': `${SITE_URL}/${locale}#localbusiness`,
    name: LEGAL_NAME,
    image: BRAND_LOGO,
    logo: BRAND_LOGO,
    url: `${SITE_URL}/${locale}`,
    telephone: BRAND_PHONE,
    email: BRAND_EMAIL,
    priceRange: BRAND_PRICE_RANGE,
    address: BRAND_ADDRESS,
    geo: BRAND_GEO,
    areaServed: STATES_SERVED.map((s) => ({ '@type': 'State', name: s })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '08:00',
        closes: '22:00',
      },
    ],
  }
}

export function localBusinessLocationSchema(
  locale: string,
  slug: string,
  cityDisplay: string,
) {
  const url = `${SITE_URL}/${locale}/table-chair-rental/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    additionalType: 'https://www.productontology.org/id/Party_equipment_rental_service',
    '@id': `${url}#localbusiness`,
    name: `${BRAND_NAME} — ${cityDisplay}`,
    image: BRAND_LOGO,
    logo: BRAND_LOGO,
    url,
    telephone: BRAND_PHONE,
    email: BRAND_EMAIL,
    priceRange: BRAND_PRICE_RANGE,
    address: BRAND_ADDRESS,
    geo: BRAND_GEO,
    areaServed: { '@type': 'City', name: cityDisplay, addressCountry: 'MY' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '08:00',
        closes: '22:00',
      },
    ],
  }
}

export function breadcrumbLocationSchema(
  locale: string,
  slug: string,
  cityDisplay: string,
  labels: { home: string; locations: string },
) {
  const base = `${SITE_URL}/${locale}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: labels.home,      item: base },
      { '@type': 'ListItem', position: 2, name: labels.locations, item: `${base}#service-area` },
      { '@type': 'ListItem', position: 3, name: cityDisplay,      item: `${base}/table-chair-rental/${slug}` },
    ],
  }
}

export function faqPageSchema(qa: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function itemListLocationsSchema(
  locale: string,
  items: Array<{ slug: string; name: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${locale}/table-chair-rental/${it.slug}`,
      name: it.name,
    })),
  }
}

export function productSchemaForLocation(
  locale: string,
  slug: string,
  cityDisplay: string,
  product: { id: string; name: string; image: string; low: string; high: string },
) {
  const pageUrl = `${SITE_URL}/${locale}/table-chair-rental/${slug}`
  const nextYear = new Date().getFullYear() + 1
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${pageUrl}#product-${product.id}`,
    name: product.name,
    image: product.image,
    brand: { '@type': 'Brand', name: BRAND_NAME },
    category: 'Party equipment rental',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MYR',
      lowPrice: product.low,
      highPrice: product.high,
      priceValidUntil: `${nextYear}-12-31`,
      availability: 'https://schema.org/InStock',
      areaServed: { '@type': 'City', name: cityDisplay, addressCountry: 'MY' },
      seller: { '@id': `${SITE_URL}#organization` },
    },
  }
}
```

### Usage in layout / pages

**`app/[locale]/layout.tsx` — Organization schema (global):**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
/>
```

**Homepage — add LocalBusiness (homepage variant), WebSite, ItemList of 38 locations, optional FAQPage:**

```tsx
// app/[locale]/page.tsx  (inside returned JSX)
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessHomepageSchema(locale)) }} />
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema(locale)) }} />
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLocationsSchema(locale, LOCATIONS.map(l => ({ slug: l.slug, name: l.display[locale] })))) }} />
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(homepageFaqsForLocale(locale))) }} />
```

**Location page — LocalBusiness, BreadcrumbList, FAQPage, 6 Product blocks:**

```tsx
// app/[locale]/table-chair-rental/[location]/page.tsx  (inside returned JSX)
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLocationSchema(locale, loc.slug, city)) }} />
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLocationSchema(locale, loc.slug, city, {
  home: t('breadcrumbs.home'),
  locations: t('breadcrumbs.locations'),
})) }} />
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(locationFaqs)) }} />
{CORE_PRODUCTS.map((p) => (
  <script
    key={p.id}
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(productSchemaForLocation(locale, loc.slug, city, {
        id: p.id,
        name: t(`products.${p.nameKey}.name`),
        image: PRODUCT_IMAGES[p.id],
        low: p.low,
        high: p.high,
      })),
    }}
  />
))}
```

All schemas reference the canonical HQ address and the single phone `+60174287801`. No `product_slug` appears anywhere. Each location-page `Product` has a unique `@id` (`<page-url>#product-<id>`) so Google never collapses the 6 × 38 product nodes into one.

---

## 4. Image & SVG alt text audit

All alt text is stored under `shared.alt` in each `messages/*.json` file (see section 10) and rendered via `t('alt.<key>', { city })`. The list below is the canonical formula for every image on the site.

### Alt text table (EN / MS / ZH)

| Image | EN formula | MS formula | ZH formula |
|---|---|---|---|
| Hero (homepage) | `Table and chair rental Malaysia — Kak Kenduri` | `Sewa meja dan kerusi Malaysia — Kak Kenduri` | `马来西亚桌椅出租 — Kak Kenduri` |
| Hero (location page) | `Table and chair rental in {city} — Kak Kenduri` | `Sewa meja dan kerusi di {city} — Kak Kenduri` | `{city}桌椅出租 — Kak Kenduri` |
| Product 1 — Standard Chair | `Standard plastic chair rental — stackable kenduri seating` | `Sewa kerusi plastik standard — kerusi kenduri boleh disusun` | `标准塑料椅出租 — 可堆叠宴会座椅` |
| Product 2 — Banquet Chair | `Banquet chair rental — padded hotel-grade seating` | `Sewa kerusi banquet — tempat duduk gred hotel bercushion` | `宴会椅出租 — 酒店级软垫座椅` |
| Product 3 — Chiavari Chair | `Chiavari chair rental — elegant wedding seating` | `Sewa kerusi Chiavari — tempat duduk majlis perkahwinan anggun` | `Chiavari 椅出租 — 优雅婚礼座椅` |
| Product 4 — Long Table 6ft | `Long buffet table rental — 6ft with pleated skirting` | `Sewa meja panjang buffet 6 kaki — bersama kain skirting` | `6尺自助长桌出租 — 含褶裙桌布` |
| Product 5 — Round Table 10 seater | `Round table rental — 10-seater for weddings and banquets` | `Sewa meja bulat 10 orang — untuk majlis kahwin dan banquet` | `圆桌出租 — 10人座婚宴桌` |
| Product 6 — Cocktail Table | `Cocktail table rental — high-top with white spandex cover` | `Sewa meja cocktail tinggi — bersama sarung spandex putih` | `鸡尾酒桌出租 — 白色 spandex 桌套` |
| Additional 1 — Couch Chair | `Couch chair rental — vintage pelamin sofa seating` | `Sewa sofa pelamin — gaya vintage untuk VIP` | `沙发椅出租 — 复古舞台座椅` |
| Additional 2 — Tent / Canopy | `Tent canopy rental — 20x20ft waterproof event canopy` | `Sewa khemah canopy — 20x20 kaki kalis air` | `帐篷出租 — 20x20 尺防水活动帐篷` |
| Additional 3 — Transparent Canopy | `Transparent canopy rental — clear PVC evening tent` | `Sewa khemah transparent — PVC jernih majlis malam` | `透明帐篷出租 — 透明 PVC 夜间帐篷` |
| Additional 4 — Air Cooler | `Industrial air cooler rental for outdoor tents` | `Sewa air cooler industrial untuk khemah luar` | `工业冷风机出租 — 户外帐篷降温` |
| Additional 5 — Commercial Fan | `Commercial fan rental — heavy-duty event cooling` | `Sewa kipas commercial berkuasa tinggi untuk event` | `商用风扇出租 — 大型活动降温` |
| Additional 6 — PA System | `PA system rental with microphone and speakers` | `Sewa PA system bersama mikrofon dan speaker` | `音响系统出租 — 含麦克风与音箱` |
| Additional 7 — Catering Equipment | `Catering equipment rental — chafing dish and buffet trays` | `Sewa peralatan catering — chafing dish dan dulang buffet` | `餐饮设备出租 — 保温锅与自助餐盘` |
| Additional 8 — Popcorn Machine | `Popcorn machine rental — retro red for parties` | `Sewa mesin popcorn retro merah untuk majlis` | `爆米花机出租 — 复古红色派对机` |
| Additional 9 — Cotton Candy Machine | `Cotton candy machine rental — pink and blue for events` | `Sewa mesin gula kapas pink dan biru untuk majlis` | `棉花糖机出租 — 粉红与蓝色派对机` |
| Gallery images 1–24 | `Kak Kenduri customer event {n} — table and chair setup` | `Majlis pelanggan Kak Kenduri {n} — susun meja kerusi` | `Kak Kenduri 客户活动现场 {n} — 桌椅布置` |
| Logo (header + footer) | `<a>` parent has `aria-label="Kak Kenduri homepage"` — SVG inside is `aria-hidden="true"` (text logo next to mark provides context) |
| WhatsApp icon | `aria-hidden="true"` — button text "WhatsApp Kak Kenduri" provides context |
| Google logo / stars | `aria-hidden="true"` — text label "Google · 4.9★" provides context |
| Globe (language switcher) | `aria-hidden="true"` — visible language code provides context |
| Chevron / arrows | `aria-hidden="true"` — decorative |

### Translation keys (used by `t()`)

```jsonc
// messages/en.json — "shared.alt" fragment (see section 10 for full file)
"alt": {
  "heroHome": "Table and chair rental Malaysia — Kak Kenduri",
  "heroLocation": "Table and chair rental in {city} — Kak Kenduri",
  "standardChair": "Standard plastic chair rental — stackable kenduri seating",
  "banquetChair": "Banquet chair rental — padded hotel-grade seating",
  "chiavariChair": "Chiavari chair rental — elegant wedding seating",
  "longTable": "Long buffet table rental — 6ft with pleated skirting",
  "roundTable": "Round table rental — 10-seater for weddings and banquets",
  "cocktailTable": "Cocktail table rental — high-top with white spandex cover",
  "couchChair": "Couch chair rental — vintage pelamin sofa seating",
  "tentCanopy": "Tent canopy rental — 20x20ft waterproof event canopy",
  "transparentCanopy": "Transparent canopy rental — clear PVC evening tent",
  "airCooler": "Industrial air cooler rental for outdoor tents",
  "commercialFan": "Commercial fan rental — heavy-duty event cooling",
  "paSystem": "PA system rental with microphone and speakers",
  "cateringEquipment": "Catering equipment rental — chafing dish and buffet trays",
  "popcornMachine": "Popcorn machine rental — retro red for parties",
  "cottonCandy": "Cotton candy machine rental — pink and blue for events",
  "gallery": "Kak Kenduri customer event {n} — table and chair setup",
  "logoAria": "Kak Kenduri homepage"
}
```

### Audit rules enforced by Kimmy

- Every `<img>` has an `alt` attribute sourced from `t('shared.alt.<key>')`; never hardcoded English.
- Every meaningful `<svg>` has `aria-hidden="true"` if decorative, or a sibling visible label.
- `<a>` wrapping the logo has `aria-label={t('shared.alt.logoAria')}`.
- All location-page images pass the `{ city }` interpolation so alt text is locale-and-city aware.

---

## 5. `app/sitemap.ts` — 117 URLs with hreflang alternates

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { LOCATIONS } from '@/config/locations'

const SITE_URL = 'https://tablechair-rental-malaysia.vercel.app'
const PRODUCT_SLUG = 'table-chair-rental'

export const revalidate = 86400 // 24h

function buildLanguages(pathSuffix: string) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${pathSuffix}`
  }
  languages['x-default'] = `${SITE_URL}/en${pathSuffix}`
  return languages
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  // Homepages — 3 URLs (en priority 1.0, others 0.9)
  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: locale === 'en' ? 1.0 : 0.9,
      alternates: { languages: buildLanguages('') },
    })
  }

  // Location pages — 114 URLs (en 0.8, others 0.7)
  for (const locale of routing.locales) {
    for (const loc of LOCATIONS) {
      const suffix = `/${PRODUCT_SLUG}/${loc.slug}`
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: locale === 'en' ? 0.8 : 0.7,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  return entries
}
```

Emits exactly **3 + 114 = 117** URL entries. Each entry carries `<xhtml:link>` alternates for `en`, `ms`, `zh` and `x-default` via Next's sitemap generator.

---

## 6. `app/robots.ts`

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

const SITE_URL = 'https://tablechair-rental-malaysia.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/*/redirect-whatsapp-1'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
```

The redirect route is disallowed so crawlers don't waste budget bouncing to WhatsApp.

---

# PART B — INTERNATIONALISATION

## 7. `i18n/routing.ts`

```ts
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ms', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export type AppLocale = (typeof routing.locales)[number]
```

## 8. `i18n/request.ts`

```ts
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }

  let messages: Record<string, unknown>
  try {
    messages = (await import(`../messages/${locale}.json`)).default
  } catch {
    messages = (await import(`../messages/${routing.defaultLocale}.json`)).default
  }

  return {
    locale,
    messages,
    timeZone: 'Asia/Kuala_Lumpur',
  }
})
```

## 9. `middleware.ts`

```ts
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all paths except:
  //   - /api, /_next, /_vercel
  //   - static files (with a file extension)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

---

## 10. Translation files

All three files share an identical key structure. Translations are pulled from Nana's homepage copy and Sora's title/meta formulas. BM is natural (not literal), ZH is Simplified Chinese. A `shared` namespace holds strings used by both homepage and location pages.

### `messages/en.json`

```json
{
  "nav": {
    "services": "Services",
    "locations": "Locations",
    "gallery": "Gallery",
    "contact": "Contact",
    "whatsapp": "WhatsApp Kak Kenduri"
  },
  "shared": {
    "brand": "Kak Kenduri",
    "tagline": "Malaysia's same-day table and chair rental",
    "whatsappCta": "WhatsApp Kak Kenduri",
    "whatsappCtaShort": "WhatsApp us now",
    "whatsappMessageDefault": "Hi Kak Kenduri, I'd like to rent tables and chairs.",
    "whatsappMessageLocation": "Hi Kak Kenduri, I'd like to rent tables and chairs in {city}.",
    "priceFrom": "From RM3.60 per chair",
    "deliveryWindow": "Same-day delivery",
    "ratingBadge": "Google · 4.9★ · 380+ reviews",
    "reviewsLabel": "From real Google reviews",
    "stats": {
      "eventsValue": "8,000+",
      "eventsLabel": "kenduri, weddings and corporate events served since 2019",
      "deliveryValue": "Same-day",
      "deliveryLabel": "delivery across Klang Valley before 6pm",
      "priceValue": "From RM3.60",
      "priceLabel": "per chair — no hidden charges",
      "ratingValue": "4.9★",
      "ratingLabel": "average from real Google reviews"
    },
    "whyChoose": {
      "heading": "Why choose Kak Kenduri",
      "point1Title": "We own the lorries",
      "point1Body": "No middleman, no markup, no finger-pointing if something runs late.",
      "point2Title": "Real people on WhatsApp",
      "point2Body": "Humans reply 8am–10pm, seven days a week.",
      "point3Title": "Cleaned before every delivery",
      "point3Body": "15,000+ chairs and 800+ tables inventoried and washed before they leave Shah Alam.",
      "point4Title": "Transparent pricing",
      "point4Body": "Written quote before any money moves. Refundable deposit."
    },
    "midCta": {
      "heading": "One WhatsApp message is all it takes",
      "body": "Tell us the date, address and guest count. We confirm availability in minutes.",
      "button": "WhatsApp Kak Kenduri"
    },
    "gallery": {
      "heading": "Real kenduri we've set up",
      "subheading": "From real Google reviews",
      "badge": "Google · 4.9★"
    },
    "fomo": {
      "text": "Weekend slots are filling up fast — confirm your date on WhatsApp today.",
      "cta": "WhatsApp now"
    },
    "alt": {
      "heroHome": "Table and chair rental Malaysia — Kak Kenduri",
      "heroLocation": "Table and chair rental in {city} — Kak Kenduri",
      "standardChair": "Standard plastic chair rental — stackable kenduri seating",
      "banquetChair": "Banquet chair rental — padded hotel-grade seating",
      "chiavariChair": "Chiavari chair rental — elegant wedding seating",
      "longTable": "Long buffet table rental — 6ft with pleated skirting",
      "roundTable": "Round table rental — 10-seater for weddings and banquets",
      "cocktailTable": "Cocktail table rental — high-top with white spandex cover",
      "couchChair": "Couch chair rental — vintage pelamin sofa seating",
      "tentCanopy": "Tent canopy rental — 20x20ft waterproof event canopy",
      "transparentCanopy": "Transparent canopy rental — clear PVC evening tent",
      "airCooler": "Industrial air cooler rental for outdoor tents",
      "commercialFan": "Commercial fan rental — heavy-duty event cooling",
      "paSystem": "PA system rental with microphone and speakers",
      "cateringEquipment": "Catering equipment rental — chafing dish and buffet trays",
      "popcornMachine": "Popcorn machine rental — retro red for parties",
      "cottonCandy": "Cotton candy machine rental — pink and blue for events",
      "gallery": "Kak Kenduri customer event {n} — table and chair setup",
      "logoAria": "Kak Kenduri homepage"
    }
  },
  "footer": {
    "tagline": "Same-day table and chair rental across Malaysia.",
    "quickLinks": "Quick links",
    "topLocations": "Top locations",
    "contact": "Contact",
    "phone": "Phone",
    "email": "Email",
    "address": "No. 3, Lot 156, Jalan Jurubina U1/18, 40150 Shah Alam, Selangor",
    "hours": "8am – 10pm, every day",
    "legal": "© {year} Kak Kenduri Sdn. Bhd. All rights reserved."
  },
  "home": {
    "meta": {
      "title": "Table & Chair Rental Malaysia | Same-Day | Kak Kenduri",
      "description": "Rent banquet, chiavari & standard chairs, round tables, canopy, PA & catering gear across Malaysia. Same-day delivery from RM3.60. WhatsApp us now."
    },
    "hero": {
      "h1": "Table & Chair Rental Malaysia — Same-Day Delivery From RM3.60",
      "sub": "Kak Kenduri supplies chairs, tables, canopy and full kenduri equipment to homes, halls and event venues nationwide — delivered the same day you WhatsApp us.",
      "priceBadge": "From RM3.60 per chair",
      "primaryCta": "WhatsApp Kak Kenduri",
      "secondaryCta": "See all rentals",
      "trust": "8,000+ kenduri served · KL · Selangor · Johor · Malaysia-wide"
    },
    "risk": {
      "heading": "Planning a kenduri is already stressful enough.",
      "p1": "Last-minute supplier drop-outs, chairs that arrive wobbly, tables that don't fit your tent, covers that clash with your theme — the small stuff is what ruins big days. We've watched too many majlis start late because the rental lorry got lost in the kampung.",
      "p2": "Kak Kenduri was built to remove that anxiety. One WhatsApp message, one confirmed time slot, one clean lorry that arrives when it says it will. You focus on your guests; we handle the seating."
    },
    "serviceArea": {
      "heading": "38 service areas across 13 states",
      "intro": "We deliver chairs, tables and kenduri equipment across Selangor, Kuala Lumpur, Johor, Negeri Sembilan, Perak, Penang, Melaka, Pahang, Kedah, Terengganu, Kelantan and Perlis — covering kenduri, majlis perkahwinan, corporate events, engagement ceremonies, birthdays and funerals. Pick your city below and we'll confirm same-day availability."
    },
    "products": {
      "heading": "Core chairs & tables — rent by the piece or the full set",
      "standardChair": {
        "name": "Standard Chair",
        "tagline": "The workhorse plastic chair every kenduri needs.",
        "blurb": "Stackable, lightweight standard chair rental for kenduri, tahlil and backyard majlis. Plain at RM3.60 or with fabric cover at RM9.60 — we deliver by the hundred, same day, across Malaysia.",
        "cta": "WhatsApp to book standard chair"
      },
      "banquetChair": {
        "name": "Banquet Chair",
        "tagline": "Padded cushion, steel frame — hotel-grade comfort.",
        "blurb": "Banquet chair rental for wedding receptions, dinner majlis and corporate dinners. Cushioned seat, cleaned before every delivery. Plain at RM14.40, with ribbon cover at RM21.60.",
        "cta": "WhatsApp to book banquet chair"
      },
      "chiavariChair": {
        "name": "Chiavari Chair",
        "tagline": "The elegant wedding chair you see on Instagram.",
        "blurb": "Solid Chiavari chair rental at RM21.60 or the transparent acrylic Chiavari at RM28.80 — perfect for pelamin photos, bridal tables and luxe engagement majlis. Available nationwide with same-day delivery across Klang Valley.",
        "cta": "WhatsApp to book chiavari chair"
      },
      "longTable": {
        "name": "Long Table / Buffet 6ft",
        "tagline": "The 6-foot workhorse for buffet lines and prep.",
        "blurb": "Long table rental in standard 6ft size. Without cloth at RM72.00, with pleated skirting and cloth at RM86.40. Pair it with our catering gear for a full buffet setup.",
        "cta": "WhatsApp to book long table"
      },
      "roundTable": {
        "name": "Round Table (10-seater)",
        "tagline": "Seats 10 guests comfortably — the kenduri standard.",
        "blurb": "Round table rental that seats 10 guests — the go-to for Malay wedding receptions and Chinese banquet dinners. Plain at RM72.00, with cloth and overlay at RM86.40. Delivered stacked and ready.",
        "cta": "WhatsApp to book round table"
      },
      "cocktailTable": {
        "name": "Cocktail Table",
        "tagline": "High-top standing table for mingling and welcome drinks.",
        "blurb": "Cocktail table rental at RM86.40 including white spandex cover — perfect for reception foyers, corporate networking, and welcome areas. Delivered same day in KL, Selangor and Johor.",
        "cta": "WhatsApp to book cocktail table"
      }
    },
    "additional": {
      "heading": "Everything else your kenduri needs under one roof",
      "couch": "Couch Chair — Vintage-style sofa seating for the pelamin, photo corner and VIP area. Upholstered in cream or gold.",
      "tent": "Tent / Canopy — Standard 20ft × 20ft and 20ft × 40ft canopy rental for backyard kenduri. Waterproof top, steel frame, includes setup.",
      "transparentCanopy": "Transparent Canopy — Clear PVC transparent canopy rental for evening majlis with a view. Wind-rated, leak-proof.",
      "airCooler": "Air Cooler — Industrial air cooler rental that actually cools open kenduri tents. Each unit covers ~40 m².",
      "fan": "Commercial Fan — Heavy-duty commercial fan rental for canopy events. Quiet, powerful, comfortable through the longest doa.",
      "pa": "PA System — Full PA system rental with microphone, mixer and 2 speakers — ideal for MC, nasyid and akad nikah.",
      "catering": "Catering Equipment — Chafing dishes, soup warmers, water dispensers and buffet trays by the set.",
      "popcorn": "Popcorn Machine — Red retro popcorn machine rental for birthdays and kids' corners.",
      "cottonCandy": "Cotton Candy Machine — Pink or blue cotton candy machine rental — an instant crowd-pleaser."
    },
    "howItWorks": {
      "heading": "Book your rental in 3 steps",
      "step1Title": "WhatsApp us your date & address",
      "step1Body": "Tell us the event date, venue address, guest count and any add-ons. We confirm availability in minutes.",
      "step2Title": "Confirm quote & pay deposit",
      "step2Body": "We send a written quote with total and delivery window. Lock in your booking with a small refundable deposit.",
      "step3Title": "We deliver, set up & pick up",
      "step3Body": "Our crew arrives on the agreed time, unloads, stacks, and returns after the majlis to collect. You don't lift a single chair."
    },
    "reviews": {
      "heading": "From real Google reviews",
      "badge": "Google · 4.9★ · 380+ reviews",
      "r1Name": "Farah Iskandar — Shah Alam",
      "r1Body": "Booked 200 banquet chairs and 20 round tables for my sister's nikah last weekend. Lorry came at 8am sharp, boys stacked everything neatly, and pickup was just as smooth. Will use Kak Kenduri again for sure.",
      "r2Name": "Daniel Tan — Petaling Jaya",
      "r2Body": "Needed a last-minute chiavari chair setup for a corporate dinner in PJ and they actually delivered same day. The transparent chiavari chairs looked amazing on camera. Pricing was clear upfront.",
      "r3Name": "Aisyah Roslan — Johor Bahru",
      "r3Body": "From chairs to canopy, everything from Kak Kenduri for our kenduri rumah in JB. Easy to deal with on WhatsApp, no forms. Very reasonable pricing. Highly recommended."
    },
    "authority": {
      "heading": "Seven years seating Malaysia's biggest days",
      "p1": "Kak Kenduri Sdn. Bhd. has been renting out chairs, tables and kenduri equipment since 2019, serving over 8,000 events from Kangar to Kota Bharu. Our Shah Alam warehouse holds 15,000+ chairs, 800+ tables and a full fleet of add-ons — all cleaned, stacked and inventoried before every delivery.",
      "p2": "We own our own lorries, employ our own crew, and run our own logistics. That means no middleman markup, no finger-pointing if something runs late, and real humans answering your WhatsApp from 8am to 10pm, seven days a week."
    },
    "locationsCta": {
      "heading": "Find Kak Kenduri in your city",
      "sub": "We deliver same-day to 38 cities across Malaysia — tap your area for pricing, delivery windows and city-specific FAQs."
    },
    "faq": {
      "heading": "Frequently asked questions",
      "q1": "What areas do you deliver to in Malaysia?",
      "a1": "We deliver chairs and tables same-day across Selangor, Kuala Lumpur and Johor, and next-day to every other state from Perlis to Kelantan. Check your city page for the exact cutoff time and delivery window.",
      "q2": "How much deposit do I need to pay?",
      "a2": "A small refundable deposit is collected on confirmation — usually 30% of the total — and returned after pickup if all items are in good condition. We send a written quote before any money moves.",
      "q3": "Is there a minimum order?",
      "a3": "Yes, our minimum order is 50 chairs or one full canopy package for outstation deliveries. Within Klang Valley we're more flexible — WhatsApp us with your numbers.",
      "q4": "Can I cancel or change my booking?",
      "a4": "Cancellations made at least 72 hours before the event are fully refunded minus a small admin fee. Date changes within that window are free as long as we have stock on your new date."
    },
    "finalCta": {
      "heading": "Let's seat your next majlis — properly.",
      "sub": "One WhatsApp message is all it takes. We'll confirm availability, send a quote, and lock in same-day delivery.",
      "button": "WhatsApp Kak Kenduri Now"
    }
  },
  "location": {
    "meta": {
      "title": "Table & Chair Rental {city} | From RM3.60 | Kak Kenduri",
      "description": "Rent banquet chairs, chiavari chairs, round tables & canopy in {city}. Same-day delivery from RM3.60 per chair. WhatsApp Kak Kenduri for your {city} event today."
    },
    "h1": "Table & Chair Rental in {city} — Same-Day Delivery",
    "breadcrumbs": {
      "home": "Home",
      "locations": "Locations",
      "city": "{city}"
    },
    "banner": "Serving {city} and the surrounding area — same-day delivery from Shah Alam HQ.",
    "nearby": {
      "heading": "Nearby areas we also serve",
      "sub": "Tap a city to see its dedicated page."
    },
    "cta": {
      "heading": "Planning a kenduri in {city}?",
      "sub": "WhatsApp Kak Kenduri now — we'll confirm availability, send a quote and lock in same-day delivery.",
      "button": "WhatsApp Kak Kenduri"
    }
  }
}
```

### `messages/ms.json`

```json
{
  "nav": {
    "services": "Perkhidmatan",
    "locations": "Lokasi",
    "gallery": "Galeri",
    "contact": "Hubungi",
    "whatsapp": "WhatsApp Kak Kenduri"
  },
  "shared": {
    "brand": "Kak Kenduri",
    "tagline": "Sewa meja dan kerusi hantar sama hari seluruh Malaysia",
    "whatsappCta": "WhatsApp Kak Kenduri",
    "whatsappCtaShort": "WhatsApp Sekarang",
    "whatsappMessageDefault": "Hi Kak Kenduri, saya nak tanya pasal sewa meja dan kerusi.",
    "whatsappMessageLocation": "Hi Kak Kenduri, saya nak tanya pasal sewa meja dan kerusi di {city}.",
    "priceFrom": "Dari RM3.60 sekerusi",
    "deliveryWindow": "Hantar sama hari",
    "ratingBadge": "Google · 4.9★ · 380+ ulasan",
    "reviewsLabel": "Dari ulasan Google sebenar",
    "stats": {
      "eventsValue": "8,000+",
      "eventsLabel": "kenduri, majlis kahwin & event korporat sejak 2019",
      "deliveryValue": "Sama hari",
      "deliveryLabel": "seluruh Lembah Klang sebelum 6 petang",
      "priceValue": "Dari RM3.60",
      "priceLabel": "sekerusi — tiada caj tersembunyi",
      "ratingValue": "4.9★",
      "ratingLabel": "purata dari ulasan Google sebenar"
    },
    "whyChoose": {
      "heading": "Kenapa pilih Kak Kenduri",
      "point1Title": "Lori kami sendiri",
      "point1Body": "Tiada orang tengah, tiada markup, tiada tuding-menuding kalau lewat.",
      "point2Title": "Manusia betul di WhatsApp",
      "point2Body": "Kami jawab 8 pagi – 10 malam, tujuh hari seminggu.",
      "point3Title": "Dibersihkan sebelum setiap penghantaran",
      "point3Body": "15,000+ kerusi dan 800+ meja disusun & dibasuh sebelum keluar dari gudang Shah Alam.",
      "point4Title": "Harga telus",
      "point4Body": "Sebutharga bertulis sebelum sebarang duit berpindah. Deposit boleh dikembalikan."
    },
    "midCta": {
      "heading": "Satu mesej WhatsApp sahaja",
      "body": "Beritahu tarikh, alamat dan jumlah tetamu. Kami sahkan dalam beberapa minit.",
      "button": "WhatsApp Kak Kenduri"
    },
    "gallery": {
      "heading": "Majlis sebenar yang kami susun",
      "subheading": "Dari ulasan Google sebenar",
      "badge": "Google · 4.9★"
    },
    "fomo": {
      "text": "Slot hujung minggu cepat penuh — sahkan tarikh anda di WhatsApp hari ini.",
      "cta": "WhatsApp Sekarang"
    },
    "alt": {
      "heroHome": "Sewa meja dan kerusi Malaysia — Kak Kenduri",
      "heroLocation": "Sewa meja dan kerusi di {city} — Kak Kenduri",
      "standardChair": "Sewa kerusi plastik standard — kerusi kenduri boleh disusun",
      "banquetChair": "Sewa kerusi banquet — tempat duduk gred hotel bercushion",
      "chiavariChair": "Sewa kerusi Chiavari — tempat duduk majlis perkahwinan anggun",
      "longTable": "Sewa meja panjang buffet 6 kaki — bersama kain skirting",
      "roundTable": "Sewa meja bulat 10 orang — untuk majlis kahwin dan banquet",
      "cocktailTable": "Sewa meja cocktail tinggi — bersama sarung spandex putih",
      "couchChair": "Sewa sofa pelamin — gaya vintage untuk VIP",
      "tentCanopy": "Sewa khemah canopy — 20x20 kaki kalis air",
      "transparentCanopy": "Sewa khemah transparent — PVC jernih majlis malam",
      "airCooler": "Sewa air cooler industrial untuk khemah luar",
      "commercialFan": "Sewa kipas commercial berkuasa tinggi untuk event",
      "paSystem": "Sewa PA system bersama mikrofon dan speaker",
      "cateringEquipment": "Sewa peralatan catering — chafing dish dan dulang buffet",
      "popcornMachine": "Sewa mesin popcorn retro merah untuk majlis",
      "cottonCandy": "Sewa mesin gula kapas pink dan biru untuk majlis",
      "gallery": "Majlis pelanggan Kak Kenduri {n} — susun meja kerusi",
      "logoAria": "Halaman utama Kak Kenduri"
    }
  },
  "footer": {
    "tagline": "Sewa meja dan kerusi hantar sama hari seluruh Malaysia.",
    "quickLinks": "Pautan pantas",
    "topLocations": "Lokasi utama",
    "contact": "Hubungi",
    "phone": "Telefon",
    "email": "Emel",
    "address": "No. 3, Lot 156, Jalan Jurubina U1/18, 40150 Shah Alam, Selangor",
    "hours": "8 pagi – 10 malam, setiap hari",
    "legal": "© {year} Kak Kenduri Sdn. Bhd. Hak cipta terpelihara."
  },
  "home": {
    "meta": {
      "title": "Sewa Meja Dan Kerusi Malaysia | Sama Hari | Kak Kenduri",
      "description": "Sewa kerusi banquet, chiavari, meja bulat, khemah, PA & peralatan kenduri seluruh Malaysia. Hantar sama hari dari RM3.60. WhatsApp sekarang."
    },
    "hero": {
      "h1": "Sewa Meja Dan Kerusi Malaysia — Hantar Sama Hari Dari RM3.60",
      "sub": "Kak Kenduri bekalkan kerusi, meja, khemah dan peralatan kenduri lengkap ke rumah, dewan dan venue seluruh Malaysia — dihantar pada hari yang sama anda WhatsApp kami.",
      "priceBadge": "Dari RM3.60 sekerusi",
      "primaryCta": "WhatsApp Kak Kenduri",
      "secondaryCta": "Lihat semua sewaan",
      "trust": "8,000+ majlis disempurnakan · KL · Selangor · Johor · Seluruh Malaysia"
    },
    "risk": {
      "heading": "Merancang kenduri memang dah cukup stress.",
      "p1": "Supplier hilang saat akhir, kerusi goyang bila duduk, meja tak muat masuk khemah, sarung kerusi tak sepadan dengan tema — benda-benda kecil ni yang rosakkan hari besar anda. Kami dah terlalu banyak kali lihat majlis mula lewat sebab lori sewaan sesat di kampung.",
      "p2": "Kak Kenduri dibina untuk hapuskan kerisauan ni. Satu mesej WhatsApp, satu slot masa disahkan, satu lori bersih yang sampai tepat pada masa dijanjikan. Anda fokus dengan tetamu; kami uruskan tempat duduk."
    },
    "serviceArea": {
      "heading": "38 kawasan servis di 13 negeri",
      "intro": "Kami hantar kerusi, meja dan peralatan kenduri merentasi Selangor, Kuala Lumpur, Johor, Negeri Sembilan, Perak, Pulau Pinang, Melaka, Pahang, Kedah, Terengganu, Kelantan dan Perlis — meliputi kenduri, majlis perkahwinan, corporate event, majlis pertunangan, hari jadi dan kenduri arwah. Pilih bandar anda di bawah dan kami sahkan ketersediaan sama hari."
    },
    "products": {
      "heading": "Kerusi & meja utama — sewa biji atau set penuh",
      "standardChair": {
        "name": "Kerusi Standard",
        "tagline": "Kerusi plastik asas yang setiap kenduri perlu.",
        "blurb": "Sewa kerusi standard yang ringan, boleh disusun, untuk kenduri, tahlil dan majlis belakang rumah. Kosong RM3.60 atau bersama sarung kain RM9.60 — kami hantar beratus biji, sama hari, seluruh Malaysia.",
        "cta": "WhatsApp tempah kerusi standard"
      },
      "banquetChair": {
        "name": "Kerusi Banquet",
        "tagline": "Bantal empuk, rangka besi — selesa gred hotel.",
        "blurb": "Sewa kerusi banquet untuk majlis perkahwinan, makan malam dan dinner korporat. Tempat duduk bercushion, dibasuh sebelum setiap penghantaran. Kosong RM14.40, bersarung reben RM21.60.",
        "cta": "WhatsApp tempah kerusi banquet"
      },
      "chiavariChair": {
        "name": "Kerusi Chiavari",
        "tagline": "Kerusi majlis cantik yang anda selalu nampak di Instagram.",
        "blurb": "Sewa kerusi chiavari solid pada RM21.60 atau chiavari akrilik transparent RM28.80 — sesuai untuk gambar pelamin, meja pengantin dan majlis pertunangan mewah. Tersedia seluruh Malaysia dengan penghantaran sama hari di Lembah Klang.",
        "cta": "WhatsApp tempah kerusi chiavari"
      },
      "longTable": {
        "name": "Meja Panjang / Buffet 6 kaki",
        "tagline": "Meja 6 kaki yang jadi nadi setiap buffet dan dapur.",
        "blurb": "Sewa meja panjang saiz standard 6 kaki. Tanpa kain RM72.00, bersama kain skirting RM86.40. Gabungkan dengan peralatan catering untuk setup buffet lengkap.",
        "cta": "WhatsApp tempah meja panjang"
      },
      "roundTable": {
        "name": "Meja Bulat (10 orang)",
        "tagline": "Cukup untuk 10 tetamu — standard kenduri Malaysia.",
        "blurb": "Sewa meja bulat yang muat 10 tetamu — pilihan utama untuk majlis perkahwinan Melayu dan makan malam banquet Cina. Kosong RM72.00, bersama kain & overlay RM86.40. Dihantar tersusun dan siap pakai.",
        "cta": "WhatsApp tempah meja bulat"
      },
      "cocktailTable": {
        "name": "Meja Cocktail",
        "tagline": "Meja tinggi untuk berdiri, minuman selamat datang dan mingle.",
        "blurb": "Sewa meja cocktail pada RM86.40 termasuk sarung spandex putih — sesuai untuk foyer resepsi, networking korporat dan kawasan sambutan. Dihantar sama hari di KL, Selangor dan Johor.",
        "cta": "WhatsApp tempah meja cocktail"
      }
    },
    "additional": {
      "heading": "Semua keperluan kenduri anda di bawah satu bumbung",
      "couch": "Sofa Pelamin — Sofa gaya vintage untuk pelamin, photo corner dan kawasan VIP. Disalut kain cream atau emas.",
      "tent": "Khemah / Canopy — Sewa khemah standard 20×20 dan 20×40 kaki untuk kenduri belakang rumah. Atap kalis air, rangka besi, termasuk pemasangan.",
      "transparentCanopy": "Khemah Transparent — Sewa khemah PVC transparent untuk majlis malam. Tahan angin, kalis bocor.",
      "airCooler": "Air Cooler — Sewa air cooler industrial yang benar-benar menyejukkan khemah terbuka. Setiap unit ~40 m².",
      "fan": "Kipas Gergasi — Sewa kipas commercial berkuasa tinggi. Senyap, kuat, pastikan tetamu selesa sepanjang majlis doa.",
      "pa": "PA System — Sewa PA system lengkap dengan mikrofon, mixer dan 2 speaker — sesuai untuk MC, nasyid, akad nikah.",
      "catering": "Peralatan Catering — Chafing dish, soup warmer, water dispenser dan dulang buffet per set.",
      "popcorn": "Mesin Popcorn — Sewa mesin popcorn retro merah untuk hari jadi dan sudut kanak-kanak.",
      "cottonCandy": "Mesin Gula Kapas — Sewa mesin gula kapas pink atau biru — menghiburkan di mana-mana majlis."
    },
    "howItWorks": {
      "heading": "Tempah sewaan anda dalam 3 langkah",
      "step1Title": "WhatsApp tarikh & alamat anda",
      "step1Body": "Beritahu kami tarikh majlis, alamat venue, jumlah tetamu dan mana-mana add-on. Kami sahkan dalam beberapa minit.",
      "step2Title": "Sahkan sebutharga & bayar deposit",
      "step2Body": "Kami hantar sebutharga bertulis dengan jumlah dan slot penghantaran. Kunci tempahan dengan deposit boleh dikembalikan.",
      "step3Title": "Kami hantar, pasang & kutip balik",
      "step3Body": "Kru kami sampai pada masa yang dijanjikan, susun, dan datang semula selepas majlis untuk kutip. Anda tak angkat satu kerusi pun."
    },
    "reviews": {
      "heading": "Dari ulasan Google sebenar",
      "badge": "Google · 4.9★ · 380+ ulasan",
      "r1Name": "Farah Iskandar — Shah Alam",
      "r1Body": "Tempah 200 kerusi banquet dan 20 meja bulat untuk majlis akad kakak minggu lepas. Lori sampai pukul 8 pagi tepat, boys susun cantik, pickup pun smooth. Mesti guna Kak Kenduri lagi.",
      "r2Name": "Daniel Tan — Petaling Jaya",
      "r2Body": "Perlu setup chiavari last minute untuk dinner korporat di PJ dan diorang betul-betul hantar sama hari. Chiavari transparent nampak cantik dalam gambar. Harga jelas, tak ada caj tersembunyi.",
      "r3Name": "Aisyah Roslan — Johor Bahru",
      "r3Body": "Dari kerusi sampai canopy semua dari Kak Kenduri untuk kenduri rumah di JB. Senang nak deal, boleh WhatsApp terus tanpa banyak borang. Harga sangat berpatutan."
    },
    "authority": {
      "heading": "Tujuh tahun mengisi majlis terbesar Malaysia",
      "p1": "Kak Kenduri Sdn. Bhd. telah menyewakan kerusi, meja dan peralatan kenduri sejak 2019, melayani lebih 8,000 majlis dari Kangar hingga Kota Bharu. Gudang kami di Shah Alam menyimpan 15,000+ kerusi, 800+ meja dan armada add-on lengkap — semua dibersihkan, disusun dan direkodkan sebelum setiap penghantaran.",
      "p2": "Kami miliki lori sendiri, gaji kru sendiri dan uruskan logistik sendiri. Maknanya tiada markup orang tengah, tiada tuding-menuding kalau lewat, dan manusia sebenar yang jawab WhatsApp anda dari 8 pagi hingga 10 malam, tujuh hari seminggu."
    },
    "locationsCta": {
      "heading": "Jumpa Kak Kenduri di bandar anda",
      "sub": "Kami hantar sama hari ke 38 bandar seluruh Malaysia — tekan kawasan anda untuk harga, slot penghantaran dan soalan lazim."
    },
    "faq": {
      "heading": "Soalan lazim",
      "q1": "Kawasan mana yang anda hantar di Malaysia?",
      "a1": "Kami hantar kerusi dan meja sama hari di Selangor, Kuala Lumpur dan Johor, dan hari berikutnya ke semua negeri dari Perlis hingga Kelantan. Semak halaman bandar anda untuk waktu cutoff tepat.",
      "q2": "Berapa deposit yang perlu saya bayar?",
      "a2": "Deposit kecil yang boleh dikembalikan diambil semasa pengesahan — biasanya 30% dari jumlah — dan dikembalikan selepas pickup jika semua barang dalam keadaan baik.",
      "q3": "Ada tempahan minimum?",
      "a3": "Ya, tempahan minimum kami ialah 50 kerusi atau satu pakej khemah penuh untuk penghantaran luar kawasan. Dalam Lembah Klang kami lebih fleksibel.",
      "q4": "Boleh saya batal atau tukar tempahan?",
      "a4": "Pembatalan sekurang-kurangnya 72 jam sebelum majlis dibayar balik sepenuhnya tolak caj admin kecil. Tukar tarikh dalam tempoh itu adalah percuma selagi kami ada stok."
    },
    "finalCta": {
      "heading": "Mari aturkan majlis anda — dengan betul.",
      "sub": "Satu mesej WhatsApp sahaja. Kami sahkan ketersediaan, hantar sebutharga, dan kunci penghantaran sama hari.",
      "button": "WhatsApp Kak Kenduri Sekarang"
    }
  },
  "location": {
    "meta": {
      "title": "Sewa Meja Dan Kerusi {city} | Dari RM3.60 | Kak Kenduri",
      "description": "Sewa kerusi banquet, chiavari, meja bulat & khemah untuk kenduri di {city}. Hantar sama hari dari RM3.60 sekerusi. WhatsApp Kak Kenduri sekarang."
    },
    "h1": "Sewa Meja Dan Kerusi {city} — Hantar Sama Hari",
    "breadcrumbs": {
      "home": "Utama",
      "locations": "Lokasi",
      "city": "{city}"
    },
    "banner": "Melayani {city} dan kawasan sekitarnya — hantar sama hari dari gudang Shah Alam.",
    "nearby": {
      "heading": "Kawasan berdekatan yang kami juga layani",
      "sub": "Tekan bandar untuk lihat halaman khusus."
    },
    "cta": {
      "heading": "Rancang kenduri di {city}?",
      "sub": "WhatsApp Kak Kenduri sekarang — kami sahkan ketersediaan, hantar sebutharga dan kunci penghantaran sama hari.",
      "button": "WhatsApp Kak Kenduri"
    }
  }
}
```

### `messages/zh.json`

```json
{
  "nav": {
    "services": "服务",
    "locations": "地区",
    "gallery": "案例",
    "contact": "联系",
    "whatsapp": "WhatsApp Kak Kenduri"
  },
  "shared": {
    "brand": "Kak Kenduri",
    "tagline": "马来西亚当天送达的桌椅出租",
    "whatsappCta": "立即 WhatsApp",
    "whatsappCtaShort": "立即WhatsApp",
    "whatsappMessageDefault": "你好 Kak Kenduri，我想了解桌椅出租。",
    "whatsappMessageLocation": "你好 Kak Kenduri，我想了解在{city}的桌椅出租。",
    "priceFrom": "每张椅 RM3.60 起",
    "deliveryWindow": "当天送达",
    "ratingBadge": "Google · 4.9★ · 380+ 评价",
    "reviewsLabel": "来自真实 Google 评价",
    "stats": {
      "eventsValue": "8,000+",
      "eventsLabel": "场婚宴、喜宴与企业活动（自2019年）",
      "deliveryValue": "当天送达",
      "deliveryLabel": "巴生谷全区晚上6点前抵达",
      "priceValue": "每张 RM3.60 起",
      "priceLabel": "无任何隐藏费用",
      "ratingValue": "4.9★",
      "ratingLabel": "Google 真实评价平均分"
    },
    "whyChoose": {
      "heading": "为何选择 Kak Kenduri",
      "point1Title": "自有车队",
      "point1Body": "没有中间商，没有加价，延误时也没有互相推诿。",
      "point2Title": "真人 WhatsApp 客服",
      "point2Body": "每天上午8点至晚上10点，真人实时回复。",
      "point3Title": "每次送货前清洁",
      "point3Body": "15,000+ 椅子与 800+ 桌子在离开莎阿南仓库前全部清洗登记。",
      "point4Title": "价格透明",
      "point4Body": "付款前先发书面报价，押金可退。"
    },
    "midCta": {
      "heading": "只需一条 WhatsApp 讯息",
      "body": "告诉我们日期、地址和宾客人数，几分钟内确认。",
      "button": "立即 WhatsApp"
    },
    "gallery": {
      "heading": "真实客户现场",
      "subheading": "来自真实 Google 评价",
      "badge": "Google · 4.9★"
    },
    "fomo": {
      "text": "周末档期正在快速售罄 — 今天就 WhatsApp 锁定日期。",
      "cta": "立即WhatsApp"
    },
    "alt": {
      "heroHome": "马来西亚桌椅出租 — Kak Kenduri",
      "heroLocation": "{city}桌椅出租 — Kak Kenduri",
      "standardChair": "标准塑料椅出租 — 可堆叠宴会座椅",
      "banquetChair": "宴会椅出租 — 酒店级软垫座椅",
      "chiavariChair": "Chiavari 椅出租 — 优雅婚礼座椅",
      "longTable": "6尺自助长桌出租 — 含褶裙桌布",
      "roundTable": "圆桌出租 — 10人座婚宴桌",
      "cocktailTable": "鸡尾酒桌出租 — 白色 spandex 桌套",
      "couchChair": "沙发椅出租 — 复古舞台座椅",
      "tentCanopy": "帐篷出租 — 20x20 尺防水活动帐篷",
      "transparentCanopy": "透明帐篷出租 — 透明 PVC 夜间帐篷",
      "airCooler": "工业冷风机出租 — 户外帐篷降温",
      "commercialFan": "商用风扇出租 — 大型活动降温",
      "paSystem": "音响系统出租 — 含麦克风与音箱",
      "cateringEquipment": "餐饮设备出租 — 保温锅与自助餐盘",
      "popcornMachine": "爆米花机出租 — 复古红色派对机",
      "cottonCandy": "棉花糖机出租 — 粉红与蓝色派对机",
      "gallery": "Kak Kenduri 客户活动现场 {n} — 桌椅布置",
      "logoAria": "Kak Kenduri 首页"
    }
  },
  "footer": {
    "tagline": "马来西亚当天送达的桌椅出租。",
    "quickLinks": "快速链接",
    "topLocations": "主要地区",
    "contact": "联系我们",
    "phone": "电话",
    "email": "电邮",
    "address": "No. 3, Lot 156, Jalan Jurubina U1/18, 40150 Shah Alam, Selangor",
    "hours": "每天上午8点 – 晚上10点",
    "legal": "© {year} Kak Kenduri Sdn. Bhd. 版权所有。"
  },
  "home": {
    "meta": {
      "title": "马来西亚桌椅出租 | 当天送达 | Kak Kenduri",
      "description": "Kak Kenduri 出租宴会椅、Chiavari 椅、圆桌、帐篷、音响与餐饮设备，覆盖全马。当天送达，价格 RM3.60 起。立即 WhatsApp 询问。"
    },
    "hero": {
      "h1": "马来西亚桌椅出租 — 当天送达 每张 RM3.60 起",
      "sub": "Kak Kenduri 为全马各地家庭、礼堂和活动场地提供桌椅、帐篷及完整宴会设备租赁，WhatsApp 下单当天送达。",
      "priceBadge": "每张椅 RM3.60 起",
      "primaryCta": "立即 WhatsApp",
      "secondaryCta": "查看所有出租品",
      "trust": "已服务 8,000+ 场宴会 · 吉隆坡 · 雪兰莪 · 柔佛 · 全马配送"
    },
    "risk": {
      "heading": "筹办宴会已经够让人头疼了。",
      "p1": "供应商临时消失、椅子一坐就摇、桌子塞不进帐篷、椅套颜色与主题冲突——就是这些小细节毁了大日子。我们看过太多场宴会因为租赁卡车在乡下迷路而延后开场。",
      "p2": "Kak Kenduri 就是为了消除这份焦虑而存在的。一条 WhatsApp 讯息、一个确认的送货时段、一辆干净准时的卡车。您专心招待宾客，我们处理所有座位安排。"
    },
    "serviceArea": {
      "heading": "全马 13 州 38 个服务地点",
      "intro": "我们为雪兰莪、吉隆坡、柔佛、森美兰、霹雳、槟城、马六甲、彭亨、吉打、登嘉楼、吉兰丹和玻璃市提供桌椅与宴会设备租赁——涵盖婚宴、喜宴、企业活动、订婚仪式、生日会和追思会。在下方选择您的城市，我们立即确认当天可用情况。"
    },
    "products": {
      "heading": "核心桌椅 — 单件或整套出租",
      "standardChair": {
        "name": "标准椅",
        "tagline": "每场宴会都需要的经济塑料椅。",
        "blurb": "轻巧可堆叠的标准椅租赁，适合宴会、祈福仪式和后院聚会。光椅 RM3.60，配布椅套 RM9.60 — 当天批量送达全马。",
        "cta": "WhatsApp 预订标准椅"
      },
      "banquetChair": {
        "name": "宴会椅",
        "tagline": "软垫钢架，酒店级舒适度。",
        "blurb": "宴会椅租赁，适合婚礼、晚宴和企业聚餐。软垫座椅，每次送货前清洁。光椅 RM14.40，配丝带椅套 RM21.60。",
        "cta": "WhatsApp 预订宴会椅"
      },
      "chiavariChair": {
        "name": "Chiavari 椅",
        "tagline": "社交媒体上最受欢迎的婚礼椅。",
        "blurb": "实心 Chiavari 椅 RM21.60 或透明亚克力 Chiavari RM28.80 — 完美呈现舞台、新人主桌和奢华订婚宴。全马供应，巴生谷当天送达。",
        "cta": "WhatsApp 预订 Chiavari 椅"
      },
      "longTable": {
        "name": "长桌 / 自助桌 6尺",
        "tagline": "自助餐线和后厨的万能 6 尺长桌。",
        "blurb": "6 尺标准长桌租赁。不含桌布 RM72.00，含褶裙桌布 RM86.40。搭配我们的餐饮设备打造完整自助餐台。",
        "cta": "WhatsApp 预订长桌"
      },
      "roundTable": {
        "name": "圆桌（10人座）",
        "tagline": "舒适容纳 10 位宾客 — 马来西亚宴会标准。",
        "blurb": "10 人圆桌租赁 — 马来婚宴和华人喜宴的首选。光桌 RM72.00，含桌布与桌面罩 RM86.40。堆叠送达，开箱即用。",
        "cta": "WhatsApp 预订圆桌"
      },
      "cocktailTable": {
        "name": "鸡尾酒桌",
        "tagline": "高脚站立桌，适合社交与欢迎酒会。",
        "blurb": "鸡尾酒桌租赁 RM86.40，含白色 spandex 桌套 — 适合婚宴入场大厅、企业交流和欢迎区。吉隆坡、雪兰莪、柔佛当天送达。",
        "cta": "WhatsApp 预订鸡尾酒桌"
      }
    },
    "additional": {
      "heading": "一站式满足宴会所有需求",
      "couch": "沙发椅 — 复古沙发椅，适合舞台、拍照角和 VIP 区。奶油色或金色布料。",
      "tent": "帐篷 / Canopy — 标准 20×20 尺和 20×40 尺帐篷租赁。防水顶布、钢架、含团队搭建。",
      "transparentCanopy": "透明帐篷 — 透明 PVC 帐篷租赁，适合户外夜间宴会。防风防漏。",
      "airCooler": "工业冷风机 — 真正为开放式帐篷降温。每台覆盖约 40 平方米。",
      "fan": "工业风扇 — 大型工业风扇租赁，适合帐篷活动。安静强劲。",
      "pa": "音响系统 — 含麦克风、调音台和 2 个音箱，适合 MC、婚礼仪式和祈祷。",
      "catering": "餐饮设备 — 保温锅、汤炉、饮水机和自助餐盘，按套出租。",
      "popcorn": "爆米花机 — 复古红色爆米花机，适合生日派对和儿童区。",
      "cottonCandy": "棉花糖机 — 粉红或蓝色棉花糖机租赁，派对必备。"
    },
    "howItWorks": {
      "heading": "3 个步骤完成预订",
      "step1Title": "WhatsApp 告诉我们日期与地址",
      "step1Body": "告诉我们活动日期、场地地址、宾客人数与附加项目。几分钟内确认。",
      "step2Title": "确认报价并支付押金",
      "step2Body": "我们会发送书面报价，含总额和送货时段。小额可退押金锁定订单。",
      "step3Title": "我们送达、布置与回收",
      "step3Body": "我们的团队准时到达、卸货、摆放，宴会结束后再回来回收。您一张椅子都不用搬。"
    },
    "reviews": {
      "heading": "来自真实 Google 评价",
      "badge": "Google · 4.9★ · 380+ 评价",
      "r1Name": "Farah Iskandar — 莎阿南",
      "r1Body": "上周为姐姐的婚礼订了 200 张宴会椅和 20 张圆桌。卡车早上 8 点准时到达，员工整齐地摆放，回收也很顺畅。下次还会用 Kak Kenduri。",
      "r2Name": "Daniel Tan — 八打灵再也",
      "r2Body": "在 PJ 的企业晚宴急需 Chiavari 椅，他们当天就送达了。透明 Chiavari 椅拍照非常好看。价格透明，无隐藏费用。",
      "r3Name": "Aisyah Roslan — 新山",
      "r3Body": "从椅子到帐篷全部由 Kak Kenduri 包办，在新山的家宴。WhatsApp 直接沟通，无需繁琐表格。价格非常合理，强烈推荐。"
    },
    "authority": {
      "heading": "七年为马来西亚最重要的日子摆好座位",
      "p1": "Kak Kenduri Sdn. Bhd. 自 2019 年以来一直出租桌椅与宴会设备，已服务从加央到哥打巴鲁超过 8,000 场活动。我们的莎阿南仓库存放 15,000+ 椅子、800+ 桌子以及全套附加设备 — 每次送货前全部清洁、堆叠、登记。",
      "p2": "我们拥有自己的卡车、聘用自己的团队、自己管理物流。这意味着没有中间商加价、没有延误时的互相推诿，真人每天早上 8 点至晚上 10 点回复 WhatsApp，每周 7 天。"
    },
    "locationsCta": {
      "heading": "在您的城市找到 Kak Kenduri",
      "sub": "我们当天送达全马 38 个城市 — 点击您的地区查看价格、送货时段和城市常见问题。"
    },
    "faq": {
      "heading": "常见问题",
      "q1": "您在马来西亚的送货范围是哪些地区？",
      "a1": "我们在雪兰莪、吉隆坡和柔佛当天送达桌椅，其他从玻璃市到吉兰丹的各州次日送达。请查看您的城市页面获取截止时间。",
      "q2": "需要支付多少押金？",
      "a2": "确认订单时收取小额可退押金 — 通常为总额的 30%，若所有物品归还完好，回收后退还。付款前先发书面报价。",
      "q3": "有最低订量吗？",
      "a3": "有，外州送货的最低订量为 50 张椅子或一个完整帐篷套装。巴生谷内更灵活 — WhatsApp 告诉我们您的数量即可。",
      "q4": "我可以取消或更改预订吗？",
      "a4": "活动前至少 72 小时取消可全额退款，扣除小额行政费。在此时段内更改日期免费，前提是新日期有库存。"
    },
    "finalCta": {
      "heading": "让我们为您的下一场宴会妥善安排座位。",
      "sub": "只需一条 WhatsApp 讯息。我们确认可用性、发送报价并锁定当天送达。",
      "button": "立即WhatsApp"
    }
  },
  "location": {
    "meta": {
      "title": "{city}桌椅出租 | RM3.60起 | Kak Kenduri",
      "description": "Kak Kenduri 在{city}提供宴会椅、Chiavari 椅、圆桌与帐篷出租，当天送达，价格 RM3.60 起。立即 WhatsApp 洽询。"
    },
    "h1": "{city}桌椅出租 — 当天送达",
    "breadcrumbs": {
      "home": "首页",
      "locations": "地区",
      "city": "{city}"
    },
    "banner": "服务{city}及周边地区 — 从莎阿南仓库当天送达。",
    "nearby": {
      "heading": "我们也服务的邻近地区",
      "sub": "点击城市查看专属页面。"
    },
    "cta": {
      "heading": "在{city}筹办宴会？",
      "sub": "立即 WhatsApp Kak Kenduri — 我们确认可用性、发送报价并锁定当天送达。",
      "button": "立即 WhatsApp"
    }
  }
}
```

---

## 11. `components/LanguageSwitcher.tsx` (CSS-only, no useState)

```tsx
// components/LanguageSwitcher.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

const LABELS: Record<(typeof routing.locales)[number], string> = {
  en: 'English',
  ms: 'Bahasa Melayu',
  zh: '中文',
}

const SHORT: Record<(typeof routing.locales)[number], string> = {
  en: 'EN',
  ms: 'MS',
  zh: 'ZH',
}

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as (typeof routing.locales)[number]
  const pathname = usePathname() || '/'

  // Strip the current locale prefix from the pathname to get the "rest" path.
  // pathname is e.g. "/en/table-chair-rental/shah-alam" → rest "/table-chair-rental/shah-alam"
  const segments = pathname.split('/').filter(Boolean)
  const rest = routing.locales.includes(segments[0] as (typeof routing.locales)[number])
    ? '/' + segments.slice(1).join('/')
    : pathname
  const cleanRest = rest === '/' ? '' : rest

  return (
    <div className="relative group">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#E8B547]/30 bg-white/80 px-3 py-1.5 text-sm font-medium text-[#2A2620] transition-transform hover:-translate-y-0.5 hover:border-[#E8B547] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B547]"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 0 20" />
          <path d="M12 2a15.3 15.3 0 0 0 0 20" />
        </svg>
        <span>{SHORT[currentLocale]}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-3 w-3 opacity-70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <ul
        role="listbox"
        className="invisible absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-[#E8B547]/25 bg-white opacity-0 shadow-[0_12px_30px_-12px_rgba(232,181,71,0.45)] transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {routing.locales.map((l) => {
          const isActive = l === currentLocale
          return (
            <li key={l}>
              <Link
                href={`/${l}${cleanRest}`}
                lang={l}
                className={
                  'block px-4 py-2.5 text-sm transition-colors ' +
                  (isActive
                    ? 'bg-[#E8B547] font-semibold text-[#2A2620]'
                    : 'text-[#2A2620] hover:bg-[#FDF8EE]')
                }
              >
                {LABELS[l]}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

No `useState`. CSS-only dropdown via `group-hover` and `group-focus-within`. Position: in `InlineHeader` between nav links and the WhatsApp CTA button.

---

## 12. `app/[locale]/layout.tsx` (provider-only shell, NO header/footer)

```tsx
// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { organizationSchema } from '@/lib/schema'

const SITE_URL = 'https://tablechair-rental-malaysia.vercel.app'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Params = { locale: string }

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return {}
  }
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`
  languages['x-default'] = `${SITE_URL}/en`

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: '%s | Kak Kenduri' },
    description: t('description'),
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      {children}
    </NextIntlClientProvider>
  )
}
```

No header, no footer, no nav, no chrome — each page imports its own `InlineHeader` and `InlineFooter`, per the architecture Layout Ownership Rule. Only Organization JSON-LD is injected globally.

---

## 13. Pages that need `t()` updates

Every rendered `.tsx` file must use `getTranslations()` (Server Components) or `useTranslations()` (Client Components). Update list:

1. `app/[locale]/page.tsx` — homepage (Server)
2. `app/[locale]/table-chair-rental/[location]/page.tsx` — location page (Server)
3. `app/[locale]/not-found.tsx` — 404 page (Server)
4. `components/sections/Hero.tsx` — headline, sub, CTAs, trust line, price badge (Server)
5. `components/sections/ServiceArea.tsx` — heading, intro, 38 location link labels (Server)
6. `components/sections/ProductGrid.tsx` — 6 product names, taglines, blurbs, CTAs (Server)
7. `components/sections/AdditionalRentals.tsx` — 9 add-on blurbs (Server)
8. `components/sections/ThreeStepProcess.tsx` — 3 step titles + bodies (Server)
9. `components/sections/CustomerGallery.tsx` — heading, sub, badge, 24 image alts (Server)
10. `components/sections/InlineHeader.tsx` — nav labels, WhatsApp CTA label, logo aria (Client — uses `useTranslations` + `useLocale`)
11. `components/sections/InlineFooter.tsx` — tagline, quick links, top-6 locations, contact labels, legal (Server)
12. `components/sections/FomoBanner.tsx` — text + CTA (Client — uses `useTranslations` + `useLocale`)
13. `components/sections/StatsBar.tsx` — 4 stat values + labels (Server)
14. `components/sections/WhyChoose.tsx` — heading + 4 points (Server)
15. `components/sections/GoogleReviews.tsx` — heading, badge, 3 review bodies (Server)
16. `components/sections/MidCta.tsx` — heading, body, button (Server)
17. `components/sections/FinalCta.tsx` — heading, sub, button (Server)
18. `components/sections/HomeFaq.tsx` — 4 Q&A pairs (Server)
19. `components/location/LocationHero.tsx` — H1, banner, breadcrumb labels (Server — uses `t('location.h1', { city })`)
20. `components/location/LocationFAQ.tsx` — 5 Q&A pairs per location (Server — reads `messages.locations[slug].faq`)
21. `components/location/NearbyLocations.tsx` — heading, sub, link labels (Server)
22. `components/ui/WhatsAppButton.tsx` — button label (Client — uses `useTranslations` + `useLocale`, builds `waRedirect()` href)
23. `components/ui/LanguageSwitcher.tsx` — language native names (Client — uses `useLocale`, already translation-safe in section 11)

**Rule:** zero hardcoded English strings longer than 3 words anywhere in `.tsx` files. Grep before handoff.

---

# PART C — LEAD TRACKING

## 14. `app/[locale]/redirect-whatsapp-1/page.tsx`

Accepts `?loc=` and `?message=` query params. Calls `getPhoneNumber(host, loc)` with the `(host, locationSlug?)` signature from `database.md`. Builds the `wa.me` URL server-side, passes it to the client component which opens it in a new tab.

```tsx
// app/[locale]/redirect-whatsapp-1/page.tsx
import { headers } from 'next/headers'
import { getPhoneNumber } from '@/lib/getPhoneNumber'
import RedirectClient from './RedirectClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { loc?: string; message?: string }

export default async function RedirectWhatsapp1Page({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const loc = sp.loc?.trim() || 'all'
  const overrideMessage = sp.message?.trim()

  const hdrs = await headers()
  const host = hdrs.get('host') ?? 'tablechair-rental-malaysia.vercel.app'

  const { phone, whatsappText } = await getPhoneNumber(host, loc)

  const text = overrideMessage && overrideMessage.length > 0 ? overrideMessage : whatsappText
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

  return <RedirectClient url={url} />
}
```

## 15. `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx`

```tsx
// app/[locale]/redirect-whatsapp-1/RedirectClient.tsx
'use client'

import { useEffect } from 'react'

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    // Open in a NEW TAB per user design rule.
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      // Popup blocked — fall back to same-tab navigation.
      window.location.href = url
    } else {
      // Bounce the current tab back to the homepage so users don't stare at a blank page.
      setTimeout(() => {
        if (window.history.length > 1) window.history.back()
        else window.location.href = '/'
      }, 150)
    }
  }, [url])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        background: '#FDF8EE',
        color: '#2A2620',
      }}
    >
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
          Opening WhatsApp…
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '999px',
            background: '#25D366',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '16px',
            textDecoration: 'none',
          }}
        >
          Click here if it did not open
        </a>
      </div>
    </div>
  )
}
```

## 16. `waRedirect()` helper — zero hardcoded `wa.me` anywhere

Place in `lib/waRedirect.ts` and import wherever a WhatsApp link is needed. **No `.tsx` file may contain the string `wa.me/` — grep before handoff.**

```ts
// lib/waRedirect.ts
// Build the internal tracking URL for every WhatsApp CTA.
// Never build a wa.me link outside of app/[locale]/redirect-whatsapp-1/page.tsx.

export function waRedirect(
  locale: string,
  message?: string,
  location?: string,
): string {
  const params = new URLSearchParams()
  if (location && location !== 'all') params.set('loc', location)
  if (message) params.set('message', message)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}
```

### Usage (every WhatsApp CTA across the site)

```tsx
// Any Server Component
import { getLocale, getTranslations } from 'next-intl/server'
import { waRedirect } from '@/lib/waRedirect'

const locale = await getLocale()
const t = await getTranslations('shared')

// Homepage / nav / hero / mid-cta / final-cta / footer — generic
const WA_LINK = waRedirect(locale, t('whatsappMessageDefault'))

// Location page — city-specific
const WA_LINK_LOCATION = waRedirect(
  locale,
  t('whatsappMessageLocation', { city }),
  loc.slug,
)

// Client Component
'use client'
import { useLocale, useTranslations } from 'next-intl'
import { waRedirect } from '@/lib/waRedirect'

function WhatsAppButton() {
  const locale = useLocale()
  const t = useTranslations('shared')
  const href = waRedirect(locale, t('whatsappMessageDefault'))
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="...">
      {t('whatsappCta')}
    </a>
  )
}
```

### WhatsApp wiring coverage

| CTA location | Helper call |
|---|---|
| `InlineHeader` nav button | `waRedirect(locale, t('shared.whatsappMessageDefault'))` |
| `FomoBanner` (own `useLocale`) | `waRedirect(locale, t('shared.whatsappMessageDefault'))` |
| Hero primary CTA | `waRedirect(locale, t('shared.whatsappMessageDefault'))` |
| Product card "Book" buttons | `waRedirect(locale, t('home.products.<product>.cta'))` |
| `ThreeStepProcess` CTA | `waRedirect(locale, t('shared.whatsappMessageDefault'))` |
| `MidCta` / `FinalCta` | `waRedirect(locale, t('shared.whatsappMessageDefault'))` |
| `InlineFooter` WhatsApp link | `waRedirect(locale, t('shared.whatsappMessageDefault'))` |
| Location page Hero / Mid / Final | `waRedirect(locale, t('shared.whatsappMessageLocation', { city }), loc.slug)` |
| Location page product cards | `waRedirect(locale, t('home.products.<product>.cta'), loc.slug)` |
| Nearby location links | standard `<Link>` — not a WhatsApp CTA |

### Default WhatsApp messages (stored in `shared.whatsappMessageDefault`)

- **en:** `Hi Kak Kenduri, I'd like to rent tables and chairs.`
- **ms:** `Hi Kak Kenduri, saya nak tanya pasal sewa meja dan kerusi.`
- **zh:** `你好 Kak Kenduri，我想了解桌椅出租。`

These match the locked inputs. The redirect page prefers the query-string `message` override; if absent, it falls back to the `whatsapp_text` stored in Supabase for the matched row.

### Handoff checklist

- [ ] `grep -r "wa.me/" app/ components/ lib/ --include="*.tsx" --include="*.ts"` returns zero hits outside `app/[locale]/redirect-whatsapp-1/page.tsx`.
- [ ] `grep -r "60174287801" app/ components/ --include="*.tsx"` returns zero hits (phone number lives only in DB + `lib/getPhoneNumber.ts` fallback).
- [ ] Every WhatsApp link has `target="_blank" rel="noopener noreferrer"`.
- [ ] Redirect page has `export const dynamic = 'force-dynamic'`.
- [ ] All client WhatsApp components use `useLocale()` to get the current locale.

---

## 17. `lib/supabase.ts` — SUPABASE_ / NEXT_PUBLIC_SUPABASE_ fallback

```ts
// lib/supabase.ts
// Shared Supabase browser-safe client used by server components.
// Supports both env var naming conventions so the same code runs
// under build-time (NEXT_PUBLIC_) and server-side runtime (SUPABASE_).

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  ''

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  ''

if (!supabaseUrl || !supabaseAnonKey) {
  // Do not throw at import time — `lib/getPhoneNumber.ts` has its own
  // hardcoded fallback phone (60174287801) and must never crash the build.
  // eslint-disable-next-line no-console
  console.warn(
    '[lib/supabase] Missing SUPABASE_URL / SUPABASE_ANON_KEY (and NEXT_PUBLIC_ variants). ' +
      'Client will be created with empty credentials; getPhoneNumber will use its fallback.',
  )
}

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'tablechair-rental-malaysia' } },
  })
  return _client
}

// Convenience default export for server files that want a ready client.
export const supabase = getSupabase()
```

**Vercel env vars to set (production + preview):**
- `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`

All four must be populated with identical values — this is the pattern used across the shared multi-tenant fleet.

---

## Final handoff checklist (pre-Layla)

- [ ] All 3 `messages/*.json` files validate as JSON.
- [ ] `generateStaticParams()` on both page types returns the full locale × location matrix (3 + 114).
- [ ] `sitemap.ts` emits exactly 117 entries with hreflang alternates.
- [ ] `robots.ts` disallows `/api/` and `/*/redirect-whatsapp-1`.
- [ ] `app/[locale]/layout.tsx` contains no `<header>`, `<footer>`, or chrome of any kind — only provider + Organization schema.
- [ ] Every WhatsApp button routes through `waRedirect()` — zero `wa.me/` outside the redirect page.
- [ ] `LanguageSwitcher` has no `useState`.
- [ ] All alt text goes through `t('shared.alt.<key>')`.
- [ ] Google Rich Results Test passes for one EN homepage, one MS location, one ZH location.
