# Kimmy — Technical SEO & i18n Implementation
## Cat Rumah Malaysia (cat-rumah-malaysia.vercel.app)

**Date:** 2026-04-15
**Agent:** Kimmy — Technical Implementation Specialist
**Default locale:** `ms` (Bahasa Melayu) — critical: overrides any default `en` pattern
**Locales:** `ms` (default), `en`, `zh`
**Locations:** 16 (kuala-lumpur, petaling-jaya, shah-alam, subang-jaya, puchong, cheras, ampang, klang, kajang, cyberjaya, putrajaya, seremban, melaka, johor-bahru, ipoh, george-town)
**Page combinations:** 3 homepages + 48 location pages + 3 redirect pages = **54 pages**
**Product slug:** `cat-rumah`

---

## Part A: Technical SEO

### A1. `generateMetadata()` — Homepage

```typescript
// app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://cat-rumah-malaysia.vercel.app'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  const titles: Record<string, string> = {
    ms: 'Cat Rumah Malaysia | Servis Dari RM3.50/sqft',
    en: 'House Painting Malaysia | From RM3.50/sqft — Cat Rumah Malaysia',
    zh: '马来西亚房屋油漆服务 | RM3.50/平方尺起 — Cat Rumah Malaysia',
  }

  const descriptions: Record<string, string> = {
    ms: 'Servis cat rumah Malaysia dari RM3.50/sqft. Cat dinding, luar, siling, epoxy lantai & pagar. Nippon, Jotun, Dulux. WhatsApp sekarang!',
    en: 'Professional house painting Malaysia from RM3.50/sqft. Interior, exterior, ceiling, epoxy floor & fence. Nippon, Jotun, Dulux. WhatsApp now!',
    zh: '马来西亚专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧地坪、围栏油漆。立邦、Jotun、多乐士。立即 WhatsApp！',
  }

  const title = titles[locale] ?? titles.ms
  const description = descriptions[locale] ?? descriptions.ms

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ms': '/ms',
        'en': '/en',
        'zh': '/zh',
        'x-default': '/ms', // OVERRIDE: x-default → ms (Malaysia-first project)
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Cat Rumah Malaysia',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'zh'
            ? 'Cat Rumah Malaysia — 专业房屋油漆服务'
            : locale === 'en'
            ? 'Cat Rumah Malaysia — Professional House Painting'
            : 'Cat Rumah Malaysia — Servis Cat Rumah Profesional',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  }
}
```

---

### A2. `generateMetadata()` — Location Pages

```typescript
// app/[locale]/cat-rumah/[location]/page.tsx
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { cityNames } from '@/config/locations'

type Props = {
  params: Promise<{ locale: string; location: string }>
}

const baseUrl = 'https://cat-rumah-malaysia.vercel.app'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, location } = await params

  const cityMap = cityNames[location]
  if (!cityMap) return { title: 'Cat Rumah Malaysia' }

  const city = cityMap[locale as 'ms' | 'en' | 'zh'] ?? cityMap.ms

  const buildTitle = (l: string): string => {
    if (l === 'en') return `House Painting ${cityMap.en} | From RM3.50/sqft — Cat Rumah Malaysia`
    if (l === 'zh') return `${cityMap.zh}房屋油漆服务 | RM3.50/平方尺起 — Cat Rumah Malaysia`
    return `Cat Rumah ${cityMap.ms} | Dari RM3.50/sqft — Cat Rumah Malaysia`
  }

  const buildDescription = (l: string): string => {
    if (l === 'en')
      return `Professional house painting in ${cityMap.en} from RM3.50/sqft. Interior, exterior, ceiling, epoxy & fence. Nippon, Jotun, Dulux. Free quote in 1 hour. WhatsApp now.`
    if (l === 'zh')
      return `${cityMap.zh}专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧、围栏。立邦、Jotun、多乐士。1小时内免费报价。立即 WhatsApp。`
    return `Servis cat rumah profesional di ${cityMap.ms} dari RM3.50/sqft. Cat dinding, luar, siling, epoxy & pagar. Nippon, Jotun, Dulux. Quote percuma dalam 1 jam. WhatsApp sekarang.`
  }

  const title = buildTitle(locale)
  const description = buildDescription(locale)

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}/cat-rumah/${location}`,
      languages: {
        'ms': `/ms/cat-rumah/${location}`,
        'en': `/en/cat-rumah/${location}`,
        'zh': `/zh/cat-rumah/${location}`,
        'x-default': `/ms/cat-rumah/${location}`, // OVERRIDE: x-default → ms
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/cat-rumah/${location}`,
      siteName: 'Cat Rumah Malaysia',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-location.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'zh'
            ? `Cat Rumah Malaysia ${cityMap.zh}房屋油漆服务`
            : locale === 'en'
            ? `Cat Rumah Malaysia — House Painting ${cityMap.en}`
            : `Cat Rumah Malaysia — Servis Cat Rumah ${cityMap.ms}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  }
}
```

---

### A3. Hreflang — Root Layout (`app/[locale]/layout.tsx`)

Next.js injects hreflang automatically from `alternates.languages` in `generateMetadata()`. The layout adds explicit fallback tags for crawlers parsing the root layout, and `x-default` always points to **ms**.

See section **B6** below for the full layout file.

---

### A4. JSON-LD Schema — Homepage

Schemas chosen: **Organization**, **WebSite**, **LocalBusiness**, **Service**, **FAQPage**, **BreadcrumbList**, **AggregateRating** (nested inside LocalBusiness).

```typescript
// components/seo/HomepageSchema.tsx
import { cityNames } from '@/config/locations'

type HomepageSchemaProps = {
  locale: string
  phoneNumber: string // e.g. "+60174287801" — from Supabase or fallback
  faqs: Array<{ question: string; answer: string }>
}

export function HomepageSchema({ locale, phoneNumber, faqs }: HomepageSchemaProps) {
  const baseUrl = 'https://cat-rumah-malaysia.vercel.app'

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Cat Rumah Malaysia',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://www.facebook.com/catrumahmalaysia',
      'https://www.instagram.com/catrumahmalaysia',
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Cat Rumah Malaysia',
    inLanguage: ['ms-MY', 'en-MY', 'zh-Hans-MY'],
    publisher: { '@id': `${baseUrl}/#organization` },
  }

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business`,
    name: 'Cat Rumah Malaysia',
    description:
      locale === 'zh'
        ? '马来西亚专业房屋油漆承包商。室内、外墙、天花板、环氧地坪、围栏与户外金属漆，使用立邦、Jotun、多乐士高端品牌。RM3.50/平方尺起。'
        : locale === 'en'
        ? 'Professional house painting contractors across Malaysia. Interior, exterior, ceiling, epoxy floor, fence and outdoor metal paint using premium Nippon, Jotun and Dulux brands. From RM3.50/sqft.'
        : 'Kontraktor cat rumah profesional di seluruh Malaysia. Cat dinding, luar, siling, epoxy lantai, pagar dan cat besi luar menggunakan jenama premium Nippon Paint, Jotun dan Dulux. Dari RM3.50/sqft.',
    url: baseUrl,
    telephone: phoneNumber,
    image: `${baseUrl}/og-image.jpg`,
    logo: `${baseUrl}/logo.png`,
    priceRange: 'RM',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
      addressRegion: 'Kuala Lumpur',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 3.139003,
      longitude: 101.686855,
    },
    areaServed: Object.values(cityNames).map((city) => ({
      '@type': 'City',
      name: city[locale as 'ms' | 'en' | 'zh'] ?? city.ms,
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '21:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'zh' ? '房屋油漆服务' : locale === 'en' ? 'House Painting Services' : 'Servis Cat Rumah',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '室内墙壁油漆' : locale === 'en' ? 'Interior Wall Painting' : 'Cat Dinding Rumah',
          },
          priceCurrency: 'MYR',
          price: '3.50',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '3.50',
            priceCurrency: 'MYR',
            unitCode: 'FTK', // square foot
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '外墙防水油漆' : locale === 'en' ? 'Exterior Wall / Weathershield' : 'Cat Luar Rumah (Weathershield)',
          },
          priceCurrency: 'MYR',
          price: '3.50',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '天花板油漆' : locale === 'en' ? 'Ceiling Painting' : 'Cat Siling',
          },
          priceCurrency: 'MYR',
          price: '3.50',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '环氧地坪漆' : locale === 'en' ? 'Epoxy Floor Paint' : 'Cat Epoxy Lantai',
          },
          priceCurrency: 'MYR',
          price: '2000',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '围栏油漆' : locale === 'en' ? 'Fence Painting' : 'Cat Pagar Rumah',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '户外金属漆' : locale === 'en' ? 'Outdoor Metal Paint' : 'Cat Besi Luar Rumah',
          },
          priceCurrency: 'MYR',
          price: '1800',
        },
      ],
    },
    brand: [
      { '@type': 'Brand', name: 'Nippon Paint' },
      { '@type': 'Brand', name: 'Jotun' },
      { '@type': 'Brand', name: 'Dulux' },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Cat Rumah Malaysia',
        item: `${baseUrl}/${locale}`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
```

---

### A5. JSON-LD Schema — Location Pages

Schemas: **LocalBusiness** (scoped to city), **Service**, **FAQPage**, **BreadcrumbList**, **AggregateRating**.

```typescript
// components/seo/LocationPageSchema.tsx

type LocationSchemaProps = {
  locale: string
  locationSlug: string
  cityName: string        // localised
  phoneNumber: string
  faqs: Array<{ question: string; answer: string }>
}

export function LocationPageSchema({
  locale,
  locationSlug,
  cityName,
  phoneNumber,
  faqs,
}: LocationSchemaProps) {
  const baseUrl = 'https://cat-rumah-malaysia.vercel.app'
  const pageUrl = `${baseUrl}/${locale}/cat-rumah/${locationSlug}`

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business-${locationSlug}`,
    name: `Cat Rumah Malaysia — ${cityName}`,
    description:
      locale === 'zh'
        ? `${cityName}专业房屋油漆承包商。室内、外墙、天花板、环氧、围栏与户外金属漆。使用立邦、Jotun、多乐士。RM3.50/平方尺起。`
        : locale === 'en'
        ? `Professional house painting contractors in ${cityName}. Interior, exterior, ceiling, epoxy, fence and outdoor metal paint using Nippon, Jotun and Dulux. From RM3.50/sqft.`
        : `Kontraktor cat rumah profesional di ${cityName}. Cat dinding, luar, siling, epoxy, pagar dan cat besi luar menggunakan Nippon, Jotun dan Dulux. Dari RM3.50/sqft.`,
    url: pageUrl,
    telephone: phoneNumber,
    image: `${baseUrl}/og-location.jpg`,
    logo: `${baseUrl}/logo.png`,
    priceRange: 'RM',
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressCountry: 'MY',
    },
    areaServed: { '@type': 'City', name: cityName },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '21:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
      bestRating: '5',
      worstRating: '1',
    },
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name:
      locale === 'zh'
        ? `${cityName}房屋油漆服务`
        : locale === 'en'
        ? `House Painting Service ${cityName}`
        : `Servis Cat Rumah ${cityName}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Cat Rumah Malaysia',
      url: baseUrl,
    },
    areaServed: { '@type': 'City', name: cityName },
    serviceType:
      locale === 'zh'
        ? '室内墙壁、外墙、天花板、环氧地坪、围栏、户外金属油漆'
        : locale === 'en'
        ? 'Interior, Exterior, Ceiling, Epoxy Floor, Fence and Outdoor Metal Painting'
        : 'Cat Dinding, Cat Luar, Cat Siling, Cat Epoxy Lantai, Cat Pagar dan Cat Besi Luar',
    url: pageUrl,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MYR',
      price: '3.50',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '3.50',
        priceCurrency: 'MYR',
        unitCode: 'FTK',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Cat Rumah Malaysia',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name:
          locale === 'zh' ? '房屋油漆服务' : locale === 'en' ? 'House Painting' : 'Servis Cat Rumah',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cityName,
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
```

---

### A6. Alt Text Guidelines — formulas per locale

All `<img>` / `<Image>` elements must provide locale-specific alt text. Use these exact formulas.

**Logo**
```
alt="Logo Cat Rumah Malaysia"                       // ms
alt="Cat Rumah Malaysia logo"                       // en
alt="Cat Rumah Malaysia 标志"                         // zh
```

**Hero image**
```
alt="Pasukan cat rumah profesional — Cat Rumah Malaysia"        // ms
alt="Professional house painting team — Cat Rumah Malaysia"     // en
alt="专业房屋油漆团队 — Cat Rumah Malaysia"                        // zh
```

**Product / service card images**

| Service | ms | en | zh |
|---|---|---|---|
| Cat Dinding | `Cat dinding rumah dalaman dengan Nippon Paint` | `Interior wall painting with Nippon Paint` | `使用立邦漆的室内墙壁油漆` |
| Cat Luar | `Cat luar rumah weathershield — kalis hujan dan matahari` | `Exterior weathershield painting — rain & sun proof` | `外墙防水漆 — 抗雨抗晒` |
| Cat Siling | `Cat siling putih bersih tanpa calar` | `Clean white ceiling painting — no cracks` | `雪白天花板油漆 — 无裂痕` |
| Cat Epoxy | `Cat epoxy lantai tahan minyak dan kalis air` | `Oil-resistant waterproof epoxy floor paint` | `防油防水环氧地坪漆` |
| Cat Pagar | `Cat pagar besi dan kayu — anti-karat` | `Metal and wooden fence painting — anti-rust` | `铁栏与木栏油漆 — 防锈处理` |
| Cat Besi Luar | `Cat besi luar grill dan auto-gate` | `Outdoor metal paint — grilles and auto-gates` | `户外金属漆 — 铁窗和电动门` |

**Gallery (before / after)**
```typescript
// formula — replace {city} with localised city name, {type} with 'sebelum'/'before'/'前' etc.
alt={`${type === 'before' ? 'Sebelum' : 'Selepas'} — cat rumah di ${cityMs}`}    // ms
alt={`${type === 'before' ? 'Before' : 'After'} — house painting in ${cityEn}`}  // en
alt={`${type === 'before' ? '施工前' : '施工后'} — ${cityZh}房屋油漆`}              // zh
```

**Location page hero (dynamic)**
```typescript
alt={`Servis cat rumah di ${cityName} — Cat Rumah Malaysia`}   // ms
alt={`House painting in ${cityName} — Cat Rumah Malaysia`}     // en
alt={`${cityName}房屋油漆服务 — Cat Rumah Malaysia`}             // zh
```

**Brand logos (Nippon / Jotun / Dulux)**
```
alt="Nippon Paint — jenama cat premium"       // ms
alt="Nippon Paint — premium paint brand"      // en
alt="立邦漆 — 高端油漆品牌"                       // zh
```
(Repeat with "Jotun" / "Dulux" substituted.)

**Google Reviews card**
```
alt="Ulasan Google 5 bintang — pelanggan Cat Rumah Malaysia"   // ms
alt="5-star Google review — Cat Rumah Malaysia customer"       // en
alt="Google 五星评价 — Cat Rumah Malaysia 客户"                   // zh
```

**OG image** (1200×630) alt:
- ms: `Cat Rumah Malaysia — Servis Cat Rumah Profesional Dari RM3.50/sqft`
- en: `Cat Rumah Malaysia — Professional House Painting From RM3.50/sqft`
- zh: `Cat Rumah Malaysia — 专业房屋油漆服务 RM3.50/平方尺起`

---

### A7. `app/sitemap.ts` — 54 entries

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { locations } from '@/config/locations'
import { locales } from '@/i18n/routing'

const baseUrl = 'https://cat-rumah-malaysia.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage per locale (3 entries)
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: locale === 'ms' ? 1.0 : 0.9, // ms is default → highest priority
      alternates: {
        languages: {
          'ms': `${baseUrl}/ms`,
          'en': `${baseUrl}/en`,
          'zh': `${baseUrl}/zh`,
          'x-default': `${baseUrl}/ms`,
        },
      },
    })
  }

  // Location pages (16 × 3 = 48 entries)
  for (const locale of locales) {
    for (const location of locations) {
      entries.push({
        url: `${baseUrl}/${locale}/cat-rumah/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: locale === 'ms' ? 0.8 : 0.7,
        alternates: {
          languages: {
            'ms': `${baseUrl}/ms/cat-rumah/${location.slug}`,
            'en': `${baseUrl}/en/cat-rumah/${location.slug}`,
            'zh': `${baseUrl}/zh/cat-rumah/${location.slug}`,
            'x-default': `${baseUrl}/ms/cat-rumah/${location.slug}`,
          },
        },
      })
    }
  }

  // WhatsApp redirect pages are intentionally EXCLUDED from sitemap
  // (they are utility pages, disallowed in robots.ts)

  return entries
  // Total: 3 + 48 = 51 indexable entries
  // (+ 3 redirect pages × 3 locales = 54 total page combinations in the app,
  //   but redirects are excluded from sitemap/indexing)
}
```

---

### A8. `app/robots.ts`

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/ms/redirect-whatsapp-1',
          '/en/redirect-whatsapp-1',
          '/zh/redirect-whatsapp-1',
          '/redirect-whatsapp-1',
        ],
      },
    ],
    sitemap: 'https://cat-rumah-malaysia.vercel.app/sitemap.xml',
    host: 'https://cat-rumah-malaysia.vercel.app',
  }
}
```

---

## Part B: i18n

### B1. `i18n/routing.ts`

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const locales = ['ms', 'en', 'zh'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'ms', // CRITICAL: ms is default, not en
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/cat-rumah/[location]': {
      ms: '/cat-rumah/[location]',
      en: '/cat-rumah/[location]',
      zh: '/cat-rumah/[location]',
    },
    '/redirect-whatsapp-1': {
      ms: '/redirect-whatsapp-1',
      en: '/redirect-whatsapp-1',
      zh: '/redirect-whatsapp-1',
    },
  },
})
```

---

### B2. `i18n/request.ts`

```typescript
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale // 'ms'
  }

  let messages: Record<string, unknown>
  try {
    messages = (await import(`../messages/${locale}.json`)).default
  } catch {
    console.warn(`Missing messages for locale "${locale}", falling back to "ms"`)
    messages = (await import('../messages/ms.json')).default
  }

  // Deep merge fallback: missing keys in en/zh fall back to ms values (ms is canonical)
  if (locale !== 'ms') {
    try {
      const fallback = (await import('../messages/ms.json')).default
      messages = deepMerge(fallback, messages)
    } catch {}
  }

  return { locale, messages }
})

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...base }
  for (const key in override) {
    if (
      typeof override[key] === 'object' &&
      override[key] !== null &&
      !Array.isArray(override[key]) &&
      typeof base[key] === 'object' &&
      base[key] !== null
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        override[key] as Record<string, unknown>
      )
    } else {
      result[key] = override[key]
    }
  }
  return result
}
```

---

### B3. `middleware.ts`

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
```

---

### B4. Translation Files

**Namespace structure** (identical across all three locales):
- `meta` — page titles/descriptions
- `fomo` — urgency banner
- `nav` — navigation links + CTAs
- `hero` — headline, subheadline, CTA, trust bar
- `stats` — 4 trust stats
- `products` — heading + 6 service cards
- `howItWorks` — 3 steps (NOT 4)
- `riskProblem` — 3 pain points
- `midCta` — mid-page CTA
- `reviews` — Google reviews heading + 4 reviews
- `whyChoose` — 4 value props
- `gallery` — before/after heading
- `locations` — accordion + region groups
- `faq` — 6 Q&A pairs
- `finalCta` — closing CTA
- `footer` — tagline, column headings, copyright
- `location` — location-page helpers (nearby, breadcrumbs, H1 formulas)
- `whatsapp` — cta, ariaLabel
- `language` — switcher labels
- `brands` — brand trust strings

#### `messages/ms.json` (DEFAULT)

```json
{
  "meta": {
    "homeTitle": "Cat Rumah Malaysia | Servis Dari RM3.50/sqft",
    "homeDescription": "Servis cat rumah Malaysia dari RM3.50/sqft. Cat dinding, luar, siling, epoxy lantai & pagar. Nippon, Jotun, Dulux. WhatsApp sekarang!",
    "locationTitle": "Cat Rumah {city} | Dari RM3.50/sqft — Cat Rumah Malaysia",
    "locationDescription": "Servis cat rumah profesional di {city} dari RM3.50/sqft. Cat dinding, luar, siling, epoxy & pagar. Nippon, Jotun, Dulux. Quote percuma dalam 1 jam. WhatsApp sekarang."
  },
  "fomo": {
    "text": "Promo April 2026 — Cat rumah dari RM3.50/sqft. Quote percuma dalam 1 jam. WhatsApp sekarang."
  },
  "nav": {
    "brand": "Cat Rumah Malaysia",
    "home": "Utama",
    "services": "Servis",
    "reviews": "Ulasan",
    "gallery": "Galeri",
    "locations": "Lokasi",
    "faq": "Soalan Lazim",
    "cta": "WhatsApp Kami"
  },
  "hero": {
    "h1": "Cat Rumah Malaysia — Dari RM3.50/sqft",
    "subheadline": "Rumah Lama Nampak Baru Dalam 5 Jam. Kontraktor cat profesional guna Nippon Paint, Jotun & Dulux — tanpa bayaran tersembunyi.",
    "cta": "WhatsApp Sekarang",
    "ctaLong": "WhatsApp Untuk Quote Percuma",
    "trustRating": "4.9/5 Google",
    "trustHomes": "500+ rumah dicat",
    "trustYears": "8+ tahun pengalaman",
    "trustGuarantee": "Jaminan kepuasan"
  },
  "stats": {
    "rating": "4.9/5",
    "ratingLabel": "Ulasan Google",
    "homes": "500+",
    "homesLabel": "Rumah telah dicat",
    "years": "8+",
    "yearsLabel": "Tahun pengalaman",
    "brands": "3",
    "brandsLabel": "Jenama premium (Nippon, Jotun, Dulux)"
  },
  "products": {
    "heading": "6 Servis Cat Rumah Kami",
    "subheading": "Satu pasukan, satu jaminan — untuk setiap permukaan rumah anda.",
    "interior": {
      "title": "Cat Dinding Rumah",
      "description": "Cat dinding dalaman tahan lama dengan Nippon Paint Odour-less.",
      "price": "Dari RM3.50/sqft"
    },
    "exterior": {
      "title": "Cat Luar Rumah (Weathershield)",
      "description": "Cat luar kalis hujan & matahari Malaysia sepanjang tahun.",
      "price": "Dari RM3.50/sqft"
    },
    "ceiling": {
      "title": "Cat Siling",
      "description": "Siling putih bersih tanpa calar & tompok kuning.",
      "price": "Dari RM3.50/sqft"
    },
    "epoxy": {
      "title": "Cat Epoxy Lantai",
      "description": "Lantai garaj, stor & dapur tahan minyak dan kalis air.",
      "price": "Dari RM2,000"
    },
    "fence": {
      "title": "Cat Pagar Rumah",
      "description": "Pagar besi & kayu dibersihkan, anti-karat dan dicat semula.",
      "price": "Quote di tapak"
    },
    "metal": {
      "title": "Cat Besi Luar Rumah",
      "description": "Grill, pintu auto-gate dan railing — warna kekal 3 tahun+.",
      "price": "Dari RM1,800"
    }
  },
  "howItWorks": {
    "heading": "Cara Tempah Dalam 3 Langkah",
    "subheading": "Tanpa borang panjang, tanpa jual tekan — mula dari WhatsApp.",
    "step1": {
      "title": "Hubungi Kami di WhatsApp",
      "description": "Hantar gambar rumah anda. Kami balas dalam 1 jam dengan anggaran awal."
    },
    "step2": {
      "title": "Lawatan Tapak & Quote Percuma",
      "description": "Pasukan kami datang ukur, pilih warna, dan serahkan harga tetap — tanpa kos tersembunyi."
    },
    "step3": {
      "title": "Siap Dalam 5 Jam",
      "description": "Untuk kerja kecil, rumah anda siap dicat dalam hari yang sama. Projek besar disiapkan dalam 1–3 hari."
    }
  },
  "riskProblem": {
    "heading": "Masalah Rumah Anda Sekarang",
    "problem1": {
      "title": "Dinding pudar & kusam",
      "description": "Rumah nampak lama walaupun baru 5 tahun."
    },
    "problem2": {
      "title": "Retak rambut & kulat hitam",
      "description": "Tanda lembap menyerap masuk — boleh jadi lebih teruk kalau dibiarkan."
    },
    "problem3": {
      "title": "Kos renovasi melangit",
      "description": "Kontraktor lain caj RM10k+ untuk kerja yang patut jadi RM3k."
    }
  },
  "midCta": {
    "heading": "Berhenti Tangguh. Mula Cat Hari Ini.",
    "line": "Dapatkan quote percuma dalam 1 jam — tanpa ikatan, tanpa deposit dahulu.",
    "cta": "WhatsApp Kami Sekarang"
  },
  "reviews": {
    "heading": "Apa Pelanggan Kami Kata Di Google",
    "subheading": "4.9/5 bintang · 200+ ulasan disahkan Google",
    "googleBadge": "Disahkan Google",
    "review1": {
      "text": "Dari awal WhatsApp sampai siap dalam hari yang sama. Dinding ruang tamu saya nampak macam rumah show unit. Terbaik!",
      "name": "Aminah R.",
      "location": "Kuala Lumpur"
    },
    "review2": {
      "text": "Harga jujur, tak ada caj tersembunyi. Pakai Jotun dan kemasan sangat rapi. Dah tempah untuk rumah mak saya pula.",
      "name": "Jason T.",
      "location": "Petaling Jaya"
    },
    "review3": {
      "text": "Cat weathershield rumah dua tingkat. Pasukan datang ikut masa dan siap awal sehari. 5 bintang memang layak.",
      "name": "Mr Lim",
      "location": "Johor Bahru"
    },
    "review4": {
      "text": "Saya ingat cat rumah mahal. Rupanya Cat Rumah Malaysia bagi harga RM3.50/sqft je. Jimat RM5k dari quote kontraktor lain.",
      "name": "Siti N.",
      "location": "Shah Alam"
    }
  },
  "whyChoose": {
    "heading": "Kenapa Pilih Cat Rumah Malaysia",
    "reason1": {
      "title": "Jenama Premium Sahaja",
      "description": "Kami hanya pakai Nippon Paint, Jotun dan Dulux — bukan cat ekonomi murah."
    },
    "reason2": {
      "title": "Siap Dalam 5 Jam",
      "description": "Untuk kerja bilik atau ruang tamu, anda boleh balik ke rumah baru dalam sehari."
    },
    "reason3": {
      "title": "Quote Percuma, Tiada Ikatan",
      "description": "Lawatan tapak dan sebut harga tetap tanpa caj awal."
    },
    "reason4": {
      "title": "Jaminan Kepuasan",
      "description": "Kalau ada calar atau tompok, kami datang balik dan cat semula — percuma."
    }
  },
  "gallery": {
    "heading": "Galeri Sebelum & Selepas",
    "subheading": "Rumah sebenar pelanggan kami di Kuala Lumpur, PJ, Shah Alam dan seluruh Malaysia.",
    "beforeLabel": "Sebelum",
    "afterLabel": "Selepas"
  },
  "locations": {
    "heading": "Kami Beroperasi Di Seluruh Malaysia",
    "subheading": "16 bandar utama — dari Lembah Klang ke Johor Bahru dan Pulau Pinang. Klik bandar anda untuk harga dan masa kerja.",
    "regions": {
      "klangValley": "Lembah Klang",
      "southern": "Selatan Semenanjung",
      "northern": "Utara Semenanjung"
    }
  },
  "faq": {
    "heading": "Soalan Lazim Cat Rumah Malaysia",
    "q1": "Berapa harga cat rumah per kaki persegi?",
    "a1": "Harga standard kami mula dari RM3.50/sqft untuk cat dinding dalaman menggunakan Nippon Paint. Harga termasuk cat, tenaga kerja, tutup lantai dan pembersihan. Harga tetap kekal selepas lawatan tapak — tiada caj tambahan tersembunyi.",
    "q2": "Berapa lama kerja cat rumah perlu ambil masa?",
    "a2": "Untuk kerja satu bilik atau ruang tamu, kami boleh siap dalam masa 5 jam pada hari yang sama. Rumah teres penuh biasanya mengambil 1–3 hari bergantung kepada saiz dan permukaan yang perlu diperbaiki dahulu.",
    "q3": "Jenama cat apa yang anda guna?",
    "a3": "Kami hanya pakai tiga jenama premium: Nippon Paint, Jotun dan Dulux. Anda boleh pilih jenama dan siri mengikut bajet — kami terangkan perbezaan sebelum projek mula.",
    "q4": "Adakah quote percuma?",
    "a4": "Ya. Kami hantar pasukan untuk lawatan tapak dan sebut harga tanpa sebarang caj atau ikatan. Anda boleh batalkan jika harga tidak sesuai — tiada tekanan jualan.",
    "q5": "Kerja cat meliputi kawasan mana?",
    "a5": "Kami servis 16 bandar utama di seluruh Malaysia termasuk Kuala Lumpur, Petaling Jaya, Shah Alam, Johor Bahru, Pulau Pinang dan Ipoh. Untuk bandar lain, sila WhatsApp kami — kami boleh atur pasukan jika jarak berpatutan.",
    "q6": "Bagaimana kalau saya tak berpuas hati dengan hasil?",
    "a6": "Setiap projek dilindungi jaminan kepuasan. Kalau ada calar, tompok atau kemasan tidak rata, kami datang semula dan cat balik kawasan itu — percuma, tanpa soal."
  },
  "finalCta": {
    "headline": "Rumah Baru Bermula Hari Ini",
    "subheadline": "Quote percuma dalam 1 jam. Pasukan profesional. Dari RM3.50/sqft. Tiada ikatan.",
    "cta": "WhatsApp Kami Sekarang"
  },
  "footer": {
    "tagline": "Kontraktor cat rumah profesional Malaysia — guna jenama premium Nippon, Jotun dan Dulux.",
    "servicesHeading": "Servis",
    "locationsHeading": "Lokasi",
    "companyHeading": "Syarikat",
    "about": "Mengenai Kami",
    "contact": "Hubungi",
    "copyright": "© {year} Cat Rumah Malaysia. Hak cipta terpelihara."
  },
  "location": {
    "h1": "Servis Cat Rumah di {city}",
    "introTitle": "Cat rumah di {city}",
    "nearbyHeading": "Juga Berkhidmat Di Kawasan Berdekatan",
    "viewAll": "Lihat semua lokasi",
    "breadcrumbsHome": "Utama",
    "breadcrumbsService": "Servis Cat Rumah",
    "bookNow": "WhatsApp Sekarang"
  },
  "whatsapp": {
    "cta": "WhatsApp Sekarang",
    "ariaLabel": "Hubungi Cat Rumah Malaysia melalui WhatsApp",
    "defaultMessage": "Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?",
    "locationMessage": "Hi, saya berminat untuk servis cat rumah di {city}. Boleh dapatkan quotation?"
  },
  "language": {
    "label": "Bahasa",
    "ms": "Bahasa Melayu",
    "en": "English",
    "zh": "中文"
  },
  "brands": {
    "heading": "Jenama Premium Yang Kami Guna",
    "nippon": "Nippon Paint",
    "jotun": "Jotun",
    "dulux": "Dulux"
  }
}
```

#### `messages/en.json`

```json
{
  "meta": {
    "homeTitle": "House Painting Malaysia | From RM3.50/sqft — Cat Rumah Malaysia",
    "homeDescription": "Professional house painting Malaysia from RM3.50/sqft. Interior, exterior, ceiling, epoxy floor & fence. Nippon, Jotun, Dulux. WhatsApp now!",
    "locationTitle": "House Painting {city} | From RM3.50/sqft — Cat Rumah Malaysia",
    "locationDescription": "Professional house painting in {city} from RM3.50/sqft. Interior, exterior, ceiling, epoxy & fence. Nippon, Jotun, Dulux. Free quote in 1 hour. WhatsApp now."
  },
  "fomo": {
    "text": "April 2026 Promo — House painting from RM3.50/sqft. Free quote in 1 hour. WhatsApp us now."
  },
  "nav": {
    "brand": "Cat Rumah Malaysia",
    "home": "Home",
    "services": "Services",
    "reviews": "Reviews",
    "gallery": "Gallery",
    "locations": "Locations",
    "faq": "FAQ",
    "cta": "WhatsApp Us"
  },
  "hero": {
    "h1": "House Painting Malaysia — From RM3.50/sqft",
    "subheadline": "Make Your Old House Look New in 5 Hours. Professional painting contractors using Nippon Paint, Jotun and Dulux — no hidden fees.",
    "cta": "WhatsApp Us",
    "ctaLong": "WhatsApp for a Free Quote",
    "trustRating": "4.9/5 Google",
    "trustHomes": "500+ homes painted",
    "trustYears": "8+ years experience",
    "trustGuarantee": "Satisfaction guaranteed"
  },
  "stats": {
    "rating": "4.9/5",
    "ratingLabel": "Google Reviews",
    "homes": "500+",
    "homesLabel": "Homes painted",
    "years": "8+",
    "yearsLabel": "Years experience",
    "brands": "3",
    "brandsLabel": "Premium brands (Nippon, Jotun, Dulux)"
  },
  "products": {
    "heading": "Our 6 House Painting Services",
    "subheading": "One team, one guarantee — for every surface in your home.",
    "interior": {
      "title": "Interior Wall Painting",
      "description": "Long-lasting interior walls with Nippon Paint Odour-less.",
      "price": "From RM3.50/sqft"
    },
    "exterior": {
      "title": "Exterior Wall / Weathershield",
      "description": "Rain-proof and sun-proof exterior paint built for Malaysian weather.",
      "price": "From RM3.50/sqft"
    },
    "ceiling": {
      "title": "Ceiling Painting",
      "description": "Clean white ceilings — no cracks, no yellow stains.",
      "price": "From RM3.50/sqft"
    },
    "epoxy": {
      "title": "Epoxy Floor Paint",
      "description": "Oil-resistant, waterproof floors for garages, storerooms and kitchens.",
      "price": "From RM2,000"
    },
    "fence": {
      "title": "Fence Painting",
      "description": "Metal and wooden fences cleaned, anti-rust treated and repainted.",
      "price": "Quote on site"
    },
    "metal": {
      "title": "Outdoor Metal Painting",
      "description": "Grilles, auto-gates and railings — colour holds 3+ years.",
      "price": "From RM1,800"
    }
  },
  "howItWorks": {
    "heading": "How It Works in 3 Steps",
    "subheading": "No long forms, no hard sell — just start on WhatsApp.",
    "step1": {
      "title": "Message Us on WhatsApp",
      "description": "Send photos of your home. We reply within 1 hour with an early estimate."
    },
    "step2": {
      "title": "Site Visit & Free Quote",
      "description": "Our team visits, measures, helps you pick colours and delivers a fixed price — no hidden costs."
    },
    "step3": {
      "title": "Painted in as Fast as 5 Hours",
      "description": "Small jobs finish same-day. Larger homes are completed in 1–3 days."
    }
  },
  "riskProblem": {
    "heading": "Problems With Your Home Right Now",
    "problem1": {
      "title": "Faded, dull walls",
      "description": "Your house looks tired even though it's only 5 years old."
    },
    "problem2": {
      "title": "Hairline cracks & black mould",
      "description": "Early signs of damp — they only get worse if ignored."
    },
    "problem3": {
      "title": "Sky-high renovation quotes",
      "description": "Other contractors charge RM10k+ for work that should cost RM3k."
    }
  },
  "midCta": {
    "heading": "Stop Postponing. Start Painting Today.",
    "line": "Free quote in 1 hour — no commitment, no upfront deposit.",
    "cta": "WhatsApp Us Now"
  },
  "reviews": {
    "heading": "What Our Customers Say on Google",
    "subheading": "4.9/5 stars · 200+ Google-verified reviews",
    "googleBadge": "Google verified",
    "review1": {
      "text": "From first WhatsApp to finished walls in the same day. My living room looks like a show unit. Highly recommended.",
      "name": "Aminah R.",
      "location": "Kuala Lumpur"
    },
    "review2": {
      "text": "Honest pricing, no hidden charges. Used Jotun and the finish is razor-sharp. Already booked them for my mum's house.",
      "name": "Jason T.",
      "location": "Petaling Jaya"
    },
    "review3": {
      "text": "Weathershield painting for my double-storey. The team showed up on time and finished a day early. A real 5-star experience.",
      "name": "Mr Lim",
      "location": "Johor Bahru"
    },
    "review4": {
      "text": "I thought house painting was expensive. Cat Rumah Malaysia gave me RM3.50/sqft — that's RM5k cheaper than other quotes.",
      "name": "Siti N.",
      "location": "Shah Alam"
    }
  },
  "whyChoose": {
    "heading": "Why Choose Cat Rumah Malaysia",
    "reason1": {
      "title": "Premium Brands Only",
      "description": "We only use Nippon Paint, Jotun and Dulux — no cheap economy paint."
    },
    "reason2": {
      "title": "As Fast as 5 Hours",
      "description": "For bedrooms or living rooms, you move back in the same day."
    },
    "reason3": {
      "title": "Free Quote, No Strings",
      "description": "On-site visit and fixed price with zero upfront charges."
    },
    "reason4": {
      "title": "Satisfaction Guarantee",
      "description": "Any scratches or patches? We come back and repaint — free."
    }
  },
  "gallery": {
    "heading": "Before & After Gallery",
    "subheading": "Real customer homes in KL, PJ, Shah Alam and across Malaysia.",
    "beforeLabel": "Before",
    "afterLabel": "After"
  },
  "locations": {
    "heading": "We Serve All Over Malaysia",
    "subheading": "16 major cities — from the Klang Valley to Johor Bahru and Penang. Click your city for pricing and lead times.",
    "regions": {
      "klangValley": "Klang Valley",
      "southern": "Southern Peninsula",
      "northern": "Northern Peninsula"
    }
  },
  "faq": {
    "heading": "House Painting Malaysia — Frequently Asked Questions",
    "q1": "How much does house painting cost per square foot in Malaysia?",
    "a1": "Our standard rate starts at RM3.50/sqft for interior walls using Nippon Paint. That price includes paint, labour, floor covering and clean-up. The figure stays fixed after the site visit — no hidden add-ons.",
    "q2": "How long does a house painting job take?",
    "a2": "A single room or living area can be completed in as fast as 5 hours on the same day. A full terrace house usually takes 1–3 days depending on size and any surface repairs needed first.",
    "q3": "Which paint brands do you use?",
    "a3": "We only use three premium brands: Nippon Paint, Jotun and Dulux. You choose the brand and series that fits your budget — we'll explain the differences before we start.",
    "q4": "Is the quotation really free?",
    "a4": "Yes. We send a team for an on-site visit and fixed quotation with zero charges and no commitment. You can walk away if the price doesn't suit — no hard sell.",
    "q5": "Which areas do you cover?",
    "a5": "We serve 16 major cities across Malaysia including Kuala Lumpur, Petaling Jaya, Shah Alam, Johor Bahru, Penang and Ipoh. For other areas, WhatsApp us — we can often arrange a team if the distance is reasonable.",
    "q6": "What if I'm not happy with the result?",
    "a6": "Every project is covered by our satisfaction guarantee. If there are scratches, patches or uneven finish, we return and repaint that area — free, no questions asked."
  },
  "finalCta": {
    "headline": "Your New-Looking Home Starts Today",
    "subheadline": "Free quote in 1 hour. Professional team. From RM3.50/sqft. No commitment.",
    "cta": "WhatsApp Us Now"
  },
  "footer": {
    "tagline": "Professional house painting contractors in Malaysia — premium Nippon, Jotun and Dulux paint.",
    "servicesHeading": "Services",
    "locationsHeading": "Locations",
    "companyHeading": "Company",
    "about": "About Us",
    "contact": "Contact",
    "copyright": "© {year} Cat Rumah Malaysia. All rights reserved."
  },
  "location": {
    "h1": "House Painting in {city}",
    "introTitle": "House painting in {city}",
    "nearbyHeading": "Also Serving Nearby Areas",
    "viewAll": "View all locations",
    "breadcrumbsHome": "Home",
    "breadcrumbsService": "House Painting",
    "bookNow": "WhatsApp Us"
  },
  "whatsapp": {
    "cta": "WhatsApp Us",
    "ariaLabel": "Contact Cat Rumah Malaysia on WhatsApp",
    "defaultMessage": "Hi, I'm interested in house painting service. Can I get a quotation?",
    "locationMessage": "Hi, I'm interested in house painting service in {city}. Can I get a quotation?"
  },
  "language": {
    "label": "Language",
    "ms": "Bahasa Melayu",
    "en": "English",
    "zh": "中文"
  },
  "brands": {
    "heading": "Premium Brands We Use",
    "nippon": "Nippon Paint",
    "jotun": "Jotun",
    "dulux": "Dulux"
  }
}
```

#### `messages/zh.json`

```json
{
  "meta": {
    "homeTitle": "马来西亚房屋油漆服务 | RM3.50/平方尺起 — Cat Rumah Malaysia",
    "homeDescription": "马来西亚专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧地坪、围栏油漆。立邦、Jotun、多乐士。立即 WhatsApp！",
    "locationTitle": "{city}房屋油漆服务 | RM3.50/平方尺起 — Cat Rumah Malaysia",
    "locationDescription": "{city}专业房屋油漆服务，RM3.50/平方尺起。室内、外墙、天花板、环氧、围栏。立邦、Jotun、多乐士。1小时内免费报价。立即 WhatsApp。"
  },
  "fomo": {
    "text": "2026年4月促销 — 房屋油漆 RM3.50/平方尺起。1小时内免费报价。立即 WhatsApp 我们。"
  },
  "nav": {
    "brand": "Cat Rumah Malaysia",
    "home": "首页",
    "services": "服务",
    "reviews": "评价",
    "gallery": "相册",
    "locations": "地点",
    "faq": "常见问题",
    "cta": "联系我们 WhatsApp"
  },
  "hero": {
    "h1": "马来西亚房屋油漆 — RM3.50/平方尺起",
    "subheadline": "让旧房焕然一新，仅需5小时。专业油漆承包商使用立邦、Jotun 和多乐士 — 没有隐藏费用。",
    "cta": "立即WhatsApp",
    "ctaLong": "WhatsApp 索取免费报价",
    "trustRating": "4.9/5 Google 评价",
    "trustHomes": "500+ 已完工",
    "trustYears": "8+ 年经验",
    "trustGuarantee": "满意保证"
  },
  "stats": {
    "rating": "4.9/5",
    "ratingLabel": "Google 评价",
    "homes": "500+",
    "homesLabel": "已完工房屋",
    "years": "8+",
    "yearsLabel": "多年经验",
    "brands": "3",
    "brandsLabel": "高端品牌（立邦、Jotun、多乐士）"
  },
  "products": {
    "heading": "我们的6项房屋油漆服务",
    "subheading": "一支团队，一个保证 — 为您家中每一面墙壁服务。",
    "interior": {
      "title": "室内墙壁油漆",
      "description": "使用立邦无味漆，色彩持久。",
      "price": "RM3.50/平方尺起"
    },
    "exterior": {
      "title": "外墙防水漆 (Weathershield)",
      "description": "抗晒抗雨，专为马来西亚气候打造。",
      "price": "RM3.50/平方尺起"
    },
    "ceiling": {
      "title": "天花板油漆",
      "description": "雪白天花，无裂痕、无黄斑。",
      "price": "RM3.50/平方尺起"
    },
    "epoxy": {
      "title": "环氧地坪漆",
      "description": "车库、储藏室和厨房防油防水。",
      "price": "RM2,000 起"
    },
    "fence": {
      "title": "围栏油漆",
      "description": "铁栏与木栏清洗、防锈处理并重新上漆。",
      "price": "现场报价"
    },
    "metal": {
      "title": "户外金属漆",
      "description": "铁窗、电动门和扶手 — 颜色持久3年以上。",
      "price": "RM1,800 起"
    }
  },
  "howItWorks": {
    "heading": "3个简单步骤",
    "subheading": "无需冗长表格，不强推销售 — 从 WhatsApp 开始即可。",
    "step1": {
      "title": "WhatsApp 联系我们",
      "description": "发送房屋照片。1小时内回复初步估价。"
    },
    "step2": {
      "title": "上门勘察 & 免费报价",
      "description": "我们上门测量、协助选色，并提供固定价格 — 无隐藏费用。"
    },
    "step3": {
      "title": "最快 5 小时完成",
      "description": "小型工作当天完成。大型项目1–3天内交付。"
    }
  },
  "riskProblem": {
    "heading": "您家目前的问题",
    "problem1": {
      "title": "墙面褪色暗淡",
      "description": "明明才住5年，房子却像很旧。"
    },
    "problem2": {
      "title": "发丝裂缝与黑色霉斑",
      "description": "受潮的前兆 — 不处理只会越来越糟。"
    },
    "problem3": {
      "title": "天价装修报价",
      "description": "其他承包商RM3k的工程收费RM10k+。"
    }
  },
  "midCta": {
    "heading": "别再拖延。今天就开始油漆。",
    "line": "1小时内免费报价 — 无需承诺，无需预付定金。",
    "cta": "立即WhatsApp"
  },
  "reviews": {
    "heading": "顾客在 Google 怎么说",
    "subheading": "4.9/5 星 · 200+ 条 Google 认证评价",
    "googleBadge": "Google 认证",
    "review1": {
      "text": "从 WhatsApp 联系到完工只用一天。客厅像样板房一样，非常推荐。",
      "name": "Aminah R.",
      "location": "吉隆坡"
    },
    "review2": {
      "text": "价格诚实，无隐藏费用。使用 Jotun，收边非常精细。已经预约了妈妈家的工程。",
      "name": "Jason T.",
      "location": "八打灵再也"
    },
    "review3": {
      "text": "双层楼外墙漆。团队准时到达，提前一天完工。5星实至名归。",
      "name": "Mr Lim",
      "location": "新山"
    },
    "review4": {
      "text": "原以为油漆很贵，Cat Rumah Malaysia 只要 RM3.50/平方尺，比其他报价省了 RM5k。",
      "name": "Siti N.",
      "location": "莎阿南"
    }
  },
  "whyChoose": {
    "heading": "为什么选择 Cat Rumah Malaysia",
    "reason1": {
      "title": "仅使用高端品牌",
      "description": "只用立邦、Jotun 和多乐士 — 绝不使用廉价经济漆。"
    },
    "reason2": {
      "title": "最快 5 小时完成",
      "description": "卧室或客厅当日即可入住。"
    },
    "reason3": {
      "title": "免费报价，无拘无束",
      "description": "上门勘察与固定价格，无任何预付。"
    },
    "reason4": {
      "title": "满意保证",
      "description": "有任何刮痕或色斑？我们免费重新上漆。"
    }
  },
  "gallery": {
    "heading": "前后对比图库",
    "subheading": "吉隆坡、八打灵再也、莎阿南及全马顾客的真实案例。",
    "beforeLabel": "施工前",
    "afterLabel": "施工后"
  },
  "locations": {
    "heading": "我们服务全马来西亚",
    "subheading": "16个主要城市 — 从巴生谷到新山和槟城。点击您所在的城市查看价格与工期。",
    "regions": {
      "klangValley": "巴生谷",
      "southern": "南马",
      "northern": "北马"
    }
  },
  "faq": {
    "heading": "马来西亚房屋油漆 — 常见问题",
    "q1": "房屋油漆每平方尺多少钱？",
    "a1": "我们的标准价从 RM3.50/平方尺起，采用立邦油漆，包括油漆、工钱、地面覆盖与清理。上门勘察后价格固定，不会再加价。",
    "q2": "油漆工程需要多长时间？",
    "a2": "单个房间或客厅最快 5 小时完成。整栋排屋通常1–3天，具体视面积与墙面修补情况而定。",
    "q3": "你们使用什么品牌的油漆？",
    "a3": "我们只使用三个高端品牌：立邦、Jotun 和多乐士。您可以根据预算选择品牌和系列，我们会在开工前说明差异。",
    "q4": "报价真的免费吗？",
    "a4": "是的。我们派团队免费上门勘察并提供固定报价，无任何费用或约束。如果价格不合适，您可以直接拒绝，绝不强推。",
    "q5": "你们服务哪些地区？",
    "a5": "我们服务马来西亚16个主要城市，包括吉隆坡、八打灵再也、莎阿南、新山、槟城和怡保。其他地区请 WhatsApp 联系，距离合理我们也可以安排团队。",
    "q6": "如果对成果不满意怎么办？",
    "a6": "每个项目都有满意保证。若有刮痕、色斑或不平整，我们会回来免费重新上漆，绝无二话。"
  },
  "finalCta": {
    "headline": "您崭新的家，从今天开始",
    "subheadline": "1小时内免费报价。专业团队。RM3.50/平方尺起。无任何承诺。",
    "cta": "立即WhatsApp"
  },
  "footer": {
    "tagline": "马来西亚专业房屋油漆承包商 — 使用立邦、Jotun、多乐士高端油漆。",
    "servicesHeading": "服务",
    "locationsHeading": "地点",
    "companyHeading": "公司",
    "about": "关于我们",
    "contact": "联系",
    "copyright": "© {year} Cat Rumah Malaysia。版权所有。"
  },
  "location": {
    "h1": "{city}房屋油漆服务",
    "introTitle": "{city}房屋油漆",
    "nearbyHeading": "周边服务区域",
    "viewAll": "查看所有地点",
    "breadcrumbsHome": "首页",
    "breadcrumbsService": "房屋油漆服务",
    "bookNow": "立即WhatsApp"
  },
  "whatsapp": {
    "cta": "立即WhatsApp",
    "ariaLabel": "通过 WhatsApp 联系 Cat Rumah Malaysia",
    "defaultMessage": "你好，我想咨询房屋油漆服务，请问可以提供报价吗？",
    "locationMessage": "你好，我想咨询{city}的房屋油漆服务，请问可以提供报价吗？"
  },
  "language": {
    "label": "语言",
    "ms": "Bahasa Melayu",
    "en": "English",
    "zh": "中文"
  },
  "brands": {
    "heading": "我们使用的高端品牌",
    "nippon": "立邦漆 Nippon Paint",
    "jotun": "Jotun",
    "dulux": "多乐士 Dulux"
  }
}
```

---

### B5. `components/ui/LanguageSwitcher.tsx` — CSS-only dropdown

Native names, no `useState`, no client JS beyond hooks next-intl provides. Triggered via `:focus-within`.

```typescript
// components/ui/LanguageSwitcher.tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

const localeConfig = [
  { code: 'ms', label: 'Bahasa Melayu', shortLabel: 'BM' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'zh', label: '中文', shortLabel: '中文' },
] as const

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('language')
  const pathname = usePathname()

  const currentOption = localeConfig.find((l) => l.code === locale)
  const currentLabel = currentOption?.shortLabel ?? 'BM'

  const getHrefForLocale = (targetLocale: string): string => {
    // Replace leading /{locale} segment
    const withoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
    return `/${targetLocale}${withoutLocale === '/' ? '' : withoutLocale}`
  }

  return (
    <div className="language-switcher" aria-label={t('label')}>
      <style>{`
        .language-switcher {
          position: relative;
          display: inline-block;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .language-switcher__trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: 1px solid rgba(30, 36, 48, 0.2);
          border-radius: 8px;
          color: #1E2430;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: border-color 0.15s ease, background 0.15s ease;
          user-select: none;
          outline: none;
        }
        .language-switcher__trigger:hover,
        .language-switcher:focus-within .language-switcher__trigger {
          border-color: #1FB8A7;
          background: rgba(31, 184, 167, 0.08);
        }
        .language-switcher__chevron {
          width: 10px;
          height: 10px;
          transition: transform 0.2s ease;
        }
        .language-switcher:focus-within .language-switcher__chevron {
          transform: rotate(180deg);
        }
        .language-switcher__dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 180px;
          background: #FFFFFF;
          border: 1px solid rgba(30, 36, 48, 0.1);
          border-radius: 10px;
          box-shadow: 0 12px 32px rgba(30, 36, 48, 0.12),
                      0 4px 10px rgba(30, 36, 48, 0.06);
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-4px);
          transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
          z-index: 50;
        }
        .language-switcher:focus-within .language-switcher__dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .language-switcher__option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          color: #1E2430;
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: background 0.12s ease, color 0.12s ease;
          white-space: nowrap;
        }
        .language-switcher__option:hover {
          background: rgba(31, 184, 167, 0.1);
          color: #1FB8A7;
        }
        .language-switcher__option--active {
          color: #1FB8A7;
          font-weight: 600;
          background: rgba(31, 184, 167, 0.06);
        }
        .language-switcher__option-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1FB8A7;
          opacity: 0;
        }
        .language-switcher__option--active .language-switcher__option-dot {
          opacity: 1;
        }
      `}</style>

      <div
        tabIndex={0}
        className="language-switcher__trigger"
        role="button"
        aria-haspopup="listbox"
        aria-label={t('label')}
      >
        <GlobeIcon />
        <span>{currentLabel}</span>
        <svg
          className="language-switcher__chevron"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M2 3.5L5 6.5L8 3.5" />
        </svg>
      </div>

      <div className="language-switcher__dropdown" role="listbox" aria-label={t('label')}>
        {localeConfig.map(({ code, label }) => (
          <a
            key={code}
            href={getHrefForLocale(code)}
            className={`language-switcher__option${locale === code ? ' language-switcher__option--active' : ''}`}
            role="option"
            aria-selected={locale === code}
            hrefLang={code}
          >
            <span className="language-switcher__option-dot" aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
```

---

### B6. `app/[locale]/layout.tsx` — NO header/footer (pages own them)

```typescript
// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import { locales } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        {/* Fallback hreflang — generateMetadata injects the authoritative tags */}
        <link rel="alternate" hrefLang="ms" href="https://cat-rumah-malaysia.vercel.app/ms" />
        <link rel="alternate" hrefLang="en" href="https://cat-rumah-malaysia.vercel.app/en" />
        <link rel="alternate" hrefLang="zh" href="https://cat-rumah-malaysia.vercel.app/zh" />
        <link rel="alternate" hrefLang="x-default" href="https://cat-rumah-malaysia.vercel.app/ms" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased bg-[#F7F8FA] text-[#1E2430]">
        {/*
          IMPORTANT: NO <Nav /> or <Footer /> rendered here.
          Each page component (homepage, location pages, redirect page) owns its
          own header/footer inline to prevent duplicate-render bugs.
        */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

> **Note:** `generateMetadata` lives in `app/[locale]/page.tsx` (homepage) and `app/[locale]/cat-rumah/[location]/page.tsx` (location pages). Do NOT add metadata to the layout — per-page metadata wins.

---

### B7. Page updates list — what each page must do

Every page in `app/[locale]/**` must follow these rules (enforced by Layla during QA):

1. **Zero hardcoded English strings.** Every visible string goes through `useTranslations()` / `getTranslations()`. Run `grep -R "\"[A-Z][a-z]* [a-z]" app/ components/` — should return nothing visible to end users.
2. **Every page owns its Nav + Footer inline** — import `<Nav />` and `<Footer />` inside each page component. No shared header/footer in layout.
3. **WhatsApp buttons use `waRedirect()` helper** (section C3). No hardcoded `wa.me/*` URLs anywhere.
4. **WhatsApp buttons open in new tab** — `target="_blank" rel="noopener noreferrer"` and background `#25D366`.
5. **Locale-aware internal links** — use `/${locale}/…` or the `Link` from `@/i18n/routing`, never bare `/cat-rumah/…`.
6. **Section order parity** — homepage + location pages must render sections in this order:
   `FomoBanner → Nav → (Breadcrumbs)? → Hero → Stats → Products → HowItWorks → RiskProblem → MidCta → GoogleReviews → WhyChoose → Gallery → LocationsAccordion → (NearbyLocations)? → Faq → FinalCta → Footer`
7. **Image alt text per section A6 formulas.** No missing `alt` attributes.
8. **HowItWorks is 3 steps, not 4.**
9. **Google Reviews section shows Google logo + 4.9/5 badge.**
10. **All images sourced from catrumah.com.my wixstatic CDN** — no `placehold.co`.

### B8. Locale-aware link helper

```typescript
// lib/localeHref.ts
export function localeHref(locale: string, path: string = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean === '/' ? '' : clean}`
}

// Usage:
// <Link href={localeHref(locale, `/cat-rumah/${slug}`)}>
```

---

## Part C: Lead Tracking — WhatsApp Redirect

### C1. `app/[locale]/redirect-whatsapp-1/page.tsx` (Server Component)

```typescript
// app/[locale]/redirect-whatsapp-1/page.tsx
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { RedirectClient } from './RedirectClient'
import { getPhoneForLocation } from '@/lib/getPhoneNumbers'
import { site } from '@/config/site'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    loc?: string
    ref?: string
    source?: string
  }>
}

// WhatsApp text per locale — user-memory mandate
const WA_CTA: Record<string, string> = {
  ms: 'WhatsApp Sekarang',
  en: 'WhatsApp Us',
  zh: '立即WhatsApp',
}

export default async function RedirectWhatsApp({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const locationSlug = sp.loc ?? 'all'
  const ref = sp.ref
  const source = sp.source

  const t = await getTranslations({ locale, namespace: 'whatsapp' })

  // Fetch phone + whatsapp_text from Supabase (server-side, always fresh)
  const phoneRow = await getPhoneForLocation({
    website: site.supabaseWebsiteKey, // 'cat-rumah-malaysia.vercel.app'
    locationSlug,
  })

  // Fall back to site config if DB lookup fails
  const phoneNumber = (phoneRow?.phone_number ?? site.phone).replace(/\D/g, '')
  const waText =
    phoneRow?.whatsapp_text ??
    (locale === 'zh'
      ? '你好，我想咨询房屋油漆服务，请问可以提供报价吗？'
      : locale === 'en'
      ? "Hi, I'm interested in house painting service. Can I get a quotation?"
      : 'Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?')

  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waText)}`

  return (
    <Suspense fallback={null}>
      <RedirectClient
        waUrl={waUrl}
        locale={locale}
        locationSlug={locationSlug}
        ref={ref}
        source={source}
        buttonLabel={WA_CTA[locale] ?? WA_CTA.ms}
        openingLabel={t('cta')}
      />
    </Suspense>
  )
}

// Always dynamic — phone number must always be fresh
export const dynamic = 'force-dynamic'
```

---

### C2. `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx` (Client Component)

```typescript
// app/[locale]/redirect-whatsapp-1/RedirectClient.tsx
'use client'

import { useEffect, useRef } from 'react'

type Props = {
  waUrl: string
  locale: string
  locationSlug: string
  ref?: string
  source?: string
  buttonLabel: string
  openingLabel: string
}

export function RedirectClient({
  waUrl,
  locale,
  locationSlug,
  ref: refProp,
  source,
  buttonLabel,
  openingLabel,
}: Props) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    // Fire analytics (fire-and-forget)
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'whatsapp_redirect', {
          event_category: 'lead',
          event_label: `cat-rumah/${locationSlug}`,
          locale,
          source: source ?? 'direct',
          ref: refProp ?? 'unknown',
        })
      }
    } catch {}

    // Redirect after short delay so analytics fire
    const timer = setTimeout(() => {
      // Open in new tab — the button a tag above also has target _blank
      window.location.href = waUrl
    }, 300)
    return () => clearTimeout(timer)
  }, [waUrl, locale, locationSlug, refProp, source])

  const openingCopy =
    locale === 'zh'
      ? '正在跳转至 WhatsApp…'
      : locale === 'en'
      ? 'Opening WhatsApp…'
      : 'Mengalihkan ke WhatsApp…'

  const fallbackCopy =
    locale === 'zh'
      ? '如未自动跳转，请点击下方按钮。'
      : locale === 'en'
      ? 'If you are not redirected automatically, tap the button below.'
      : 'Jika tidak dialih arah secara automatik, klik butang di bawah.'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] font-sans">
      <div className="text-center p-8 max-w-sm">
        {/* Brand spinner */}
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-[#1FB8A7]/20 border-t-[#1FB8A7] animate-spin"
          aria-hidden="true"
        />
        <div className="text-[#1E2430] text-xl font-semibold mb-2">{openingCopy}</div>
        <p className="text-[#5A6472] text-sm mb-6">{fallbackCopy}</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20c05c] transition-colors"
          aria-label={openingLabel}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {buttonLabel}
        </a>
      </div>
    </div>
  )
}
```

---

### C3. `waRedirect()` helper — zero hardcoded wa.me links anywhere

Every WhatsApp button/link across the site must use this helper. NO hardcoded `https://wa.me/...` anywhere.

```typescript
// lib/waRedirect.ts

/**
 * Builds the locale-aware, location-aware WhatsApp redirect URL.
 * Always points to /[locale]/redirect-whatsapp-1 so Supabase phone lookup
 * runs server-side. NEVER returns a direct wa.me link.
 */
export function waRedirect({
  locale,
  locationSlug,
  ref,
  source,
}: {
  locale: string
  locationSlug?: string
  ref?: string       // 'hero-cta' | 'mid-cta' | 'final-cta' | 'nav' | 'footer' | 'location-page' | 'faq' ...
  source?: string    // optional UTM-ish source
}): string {
  const params = new URLSearchParams()
  if (locationSlug && locationSlug !== 'all') params.set('loc', locationSlug)
  if (ref) params.set('ref', ref)
  if (source) params.set('source', source)

  const q = params.toString()
  return `/${locale}/redirect-whatsapp-1${q ? `?${q}` : ''}`
}
```

**WhatsAppButton component** — the ONLY place that renders the green button. Every page/section uses this.

```typescript
// components/ui/WhatsAppButton.tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { waRedirect } from '@/lib/waRedirect'

type Props = {
  locationSlug?: string
  ref?: string
  className?: string
  children?: React.ReactNode
  fullWidth?: boolean
}

export function WhatsAppButton({
  locationSlug,
  ref,
  className = '',
  children,
  fullWidth = false,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('whatsapp')

  const href = waRedirect({ locale, locationSlug, ref })

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('ariaLabel')}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#25D366] hover:bg-[#20c05c] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 transition-colors ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {children ?? t('cta')}
    </a>
  )
}
```

Usage:
```tsx
{/* Homepage hero */}
<WhatsAppButton ref="hero-cta">{t('hero.ctaLong')}</WhatsAppButton>

{/* Location page */}
<WhatsAppButton locationSlug={location.slug} ref="location-hero">
  {t('location.bookNow')}
</WhatsAppButton>
```

---

### C4. `lib/supabase.ts` — supports both `SUPABASE_*` and `NEXT_PUBLIC_SUPABASE_*`

```typescript
// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Accept either public or server-side env var names (platform quirks)
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  ''

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Log but don't throw during build — runtime fallback to site.phone still works
  console.warn(
    '[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY — phone number lookups will fall back to site.phone'
  )
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})
```

### C5. `lib/getPhoneNumbers.ts` — `leads_mode = single` for this project

```typescript
// lib/getPhoneNumbers.ts
import { supabase } from './supabase'

export type PhoneRow = {
  phone_number: string
  whatsapp_text: string | null
  location_slug: string
  label: string
  percentage: number
}

/**
 * Fetch the phone number for a given website + location.
 *
 * leads_mode = 'single' (this project): returns the single default row
 * where location_slug = 'all'. The `loc` query param is accepted for
 * future-proofing but ignored under 'single' mode.
 */
export async function getPhoneForLocation({
  website,
  locationSlug,
}: {
  website: string
  locationSlug: string
}): Promise<PhoneRow | null> {
  const { data, error } = await supabase
    .from('phone_numbers')
    .select('phone_number, whatsapp_text, location_slug, label, percentage')
    .eq('website', website)
    .eq('is_active', true)

  if (error || !data || data.length === 0) {
    console.warn('[getPhoneForLocation] no rows', { website, error })
    return null
  }

  // single mode: return the 'all' default row, or first row as fallback
  const defaultRow = data.find((r) => r.location_slug === 'all')
  return defaultRow ?? data[0]
}
```

---

## Part D: Supporting Config Files

### D1. `config/site.ts`

```typescript
// config/site.ts
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
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  brands: ['Nippon Paint', 'Jotun', 'Dulux'] as const,
  rating: { value: 4.9, count: 200 },
  pricingFrom: 'RM3.50/sqft',
} as const
```

### D2. `config/locations.ts` (16 cities)

```typescript
// config/locations.ts
export const locales = ['ms', 'en', 'zh'] as const
export type Locale = (typeof locales)[number]

export interface Location {
  slug: string
  region: 'klang-valley' | 'southern' | 'northern'
  state: string
  stateSlug: string
  names: Record<Locale, string>
  nearby: string[]
}

export const cityNames: Record<string, Record<Locale, string>> = {
  'kuala-lumpur':  { ms: 'Kuala Lumpur',  en: 'Kuala Lumpur',  zh: '吉隆坡' },
  'petaling-jaya': { ms: 'Petaling Jaya', en: 'Petaling Jaya', zh: '八打灵再也' },
  'shah-alam':     { ms: 'Shah Alam',     en: 'Shah Alam',     zh: '莎阿南' },
  'subang-jaya':   { ms: 'Subang Jaya',   en: 'Subang Jaya',   zh: '梳邦再也' },
  'puchong':       { ms: 'Puchong',       en: 'Puchong',       zh: '蒲种' },
  'cheras':        { ms: 'Cheras',        en: 'Cheras',        zh: '切拉斯' },
  'ampang':        { ms: 'Ampang',        en: 'Ampang',        zh: '安邦' },
  'klang':         { ms: 'Klang',         en: 'Klang',         zh: '巴生' },
  'kajang':        { ms: 'Kajang',        en: 'Kajang',        zh: '加影' },
  'cyberjaya':     { ms: 'Cyberjaya',     en: 'Cyberjaya',     zh: '赛城' },
  'putrajaya':     { ms: 'Putrajaya',     en: 'Putrajaya',     zh: '布城' },
  'seremban':      { ms: 'Seremban',      en: 'Seremban',      zh: '芙蓉' },
  'melaka':        { ms: 'Melaka',        en: 'Malacca',       zh: '马六甲' },
  'johor-bahru':   { ms: 'Johor Bahru',   en: 'Johor Bahru',   zh: '新山' },
  'ipoh':          { ms: 'Ipoh',          en: 'Ipoh',          zh: '怡保' },
  'george-town':   { ms: 'George Town',   en: 'George Town',   zh: '乔治市' },
}

export const locations: Location[] = [
  // Klang Valley (11)
  { slug: 'kuala-lumpur',  region: 'klang-valley', state: 'WP Kuala Lumpur', stateSlug: 'wp-kuala-lumpur', names: cityNames['kuala-lumpur'],  nearby: ['petaling-jaya', 'cheras', 'ampang'] },
  { slug: 'petaling-jaya', region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['petaling-jaya'], nearby: ['shah-alam', 'subang-jaya', 'kuala-lumpur'] },
  { slug: 'shah-alam',     region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['shah-alam'],     nearby: ['petaling-jaya', 'klang', 'subang-jaya'] },
  { slug: 'subang-jaya',   region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['subang-jaya'],   nearby: ['petaling-jaya', 'puchong', 'shah-alam'] },
  { slug: 'puchong',       region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['puchong'],       nearby: ['subang-jaya', 'cyberjaya', 'klang'] },
  { slug: 'cheras',        region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['cheras'],        nearby: ['kuala-lumpur', 'kajang', 'ampang'] },
  { slug: 'ampang',        region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['ampang'],        nearby: ['kuala-lumpur', 'cheras'] },
  { slug: 'klang',         region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['klang'],         nearby: ['shah-alam', 'subang-jaya', 'puchong'] },
  { slug: 'kajang',        region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['kajang'],        nearby: ['cheras', 'cyberjaya', 'putrajaya'] },
  { slug: 'cyberjaya',     region: 'klang-valley', state: 'Selangor',        stateSlug: 'selangor',        names: cityNames['cyberjaya'],     nearby: ['putrajaya', 'puchong', 'kajang'] },
  { slug: 'putrajaya',     region: 'klang-valley', state: 'WP Putrajaya',    stateSlug: 'wp-putrajaya',    names: cityNames['putrajaya'],     nearby: ['cyberjaya', 'kajang'] },
  // Southern (3)
  { slug: 'seremban',    region: 'southern', state: 'Negeri Sembilan', stateSlug: 'negeri-sembilan', names: cityNames['seremban'],    nearby: ['kajang', 'melaka'] },
  { slug: 'melaka',      region: 'southern', state: 'Melaka',          stateSlug: 'melaka',          names: cityNames['melaka'],      nearby: ['seremban', 'johor-bahru'] },
  { slug: 'johor-bahru', region: 'southern', state: 'Johor',           stateSlug: 'johor',           names: cityNames['johor-bahru'], nearby: ['melaka'] },
  // Northern (2)
  { slug: 'ipoh',        region: 'northern', state: 'Perak',           stateSlug: 'perak',           names: cityNames['ipoh'],        nearby: ['george-town'] },
  { slug: 'george-town', region: 'northern', state: 'Pulau Pinang',    stateSlug: 'pulau-pinang',    names: cityNames['george-town'], nearby: ['ipoh'] },
]
```

### D3. `next.config.ts` — load env from repo root

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import { loadEnvConfig } from '@next/env'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'node:path'

// Load shared .env.local from the repo root (../../)
loadEnvConfig(path.resolve(process.cwd(), '../..'))

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'www.catrumah.com.my' },
      { protocol: 'https', hostname: 'catrumah.com.my' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
}

export default withNextIntl(nextConfig)
```

---

## Part E: Implementation Checklist

| # | Task | File | Status |
|---|---|---|---|
| A1 | generateMetadata — homepage | `app/[locale]/page.tsx` | Ready |
| A2 | generateMetadata — location pages | `app/[locale]/cat-rumah/[location]/page.tsx` | Ready |
| A3 | hreflang (x-default → ms) | `app/[locale]/layout.tsx` + page metadata | Ready |
| A4 | Homepage schema (Organization, WebSite, LocalBusiness, FAQ, Breadcrumb, AggregateRating) | `components/seo/HomepageSchema.tsx` | Ready |
| A5 | Location schema (LocalBusiness, Service, FAQ, Breadcrumb, AggregateRating) | `components/seo/LocationPageSchema.tsx` | Ready |
| A6 | Alt text formulas | This doc | Ready |
| A7 | Sitemap — 51 indexable URLs (3 home + 48 location) | `app/sitemap.ts` | Ready |
| A8 | robots.ts (disallow redirect paths) | `app/robots.ts` | Ready |
| B1 | i18n routing (default `ms`, prefix-always) | `i18n/routing.ts` | Ready |
| B2 | i18n request + ms fallback | `i18n/request.ts` | Ready |
| B3 | next-intl middleware | `middleware.ts` | Ready |
| B4 | Translations (ms canonical) | `messages/ms.json` / `en.json` / `zh.json` | Ready |
| B5 | LanguageSwitcher (CSS-only, native names) | `components/ui/LanguageSwitcher.tsx` | Ready |
| B6 | Layout (NO header/footer, Inter only, NextIntlClientProvider, generateStaticParams) | `app/[locale]/layout.tsx` | Ready |
| B7 | Page rules | This doc | Ready |
| B8 | localeHref helper | `lib/localeHref.ts` | Ready |
| C1 | WhatsApp redirect page (server) | `app/[locale]/redirect-whatsapp-1/page.tsx` | Ready |
| C2 | Redirect client component | `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx` | Ready |
| C3 | `waRedirect()` helper + `WhatsAppButton` component | `lib/waRedirect.ts`, `components/ui/WhatsAppButton.tsx` | Ready |
| C4 | Supabase client (dual env var) | `lib/supabase.ts` | Ready |
| C5 | getPhoneForLocation (leads_mode single) | `lib/getPhoneNumbers.ts` | Ready |
| D1 | Site config | `config/site.ts` | Ready |
| D2 | Locations config (16 cities) | `config/locations.ts` | Ready |
| D3 | next.config.ts (env from root + next-intl plugin) | `next.config.ts` | Ready |

---

## Key Decisions (summary)

1. **`x-default` hreflang → `ms`** (NOT `en`) — Malaysian market is primary audience; ms is default locale. Applied in homepage metadata, location metadata, layout fallback `<link>` tags, and sitemap alternates.
2. **Fallback chain:** missing translation keys fall back to `ms` (not `en`) in `i18n/request.ts`.
3. **Schema types:** Homepage = Organization + WebSite + LocalBusiness + FAQPage + BreadcrumbList + AggregateRating (nested). Location pages = LocalBusiness (city-scoped) + Service + FAQPage + BreadcrumbList + AggregateRating. All include brand mentions (Nippon, Jotun, Dulux) and MYR pricing.
4. **Translation namespace structure:** 20 top-level namespaces (`meta`, `fomo`, `nav`, `hero`, `stats`, `products`, `howItWorks`, `riskProblem`, `midCta`, `reviews`, `whyChoose`, `gallery`, `locations`, `faq`, `finalCta`, `footer`, `location`, `whatsapp`, `language`, `brands`) — identical keys across `ms`/`en`/`zh`.
5. **Layout ownership:** `app/[locale]/layout.tsx` renders ONLY `<html>` shell + `NextIntlClientProvider`. NO Nav, NO Footer. Each page component owns its header/footer inline.
6. **WhatsApp wiring:** every button goes through `WhatsAppButton` → `waRedirect()` → `/[locale]/redirect-whatsapp-1?loc=…` → server fetches phone from Supabase → client redirects to `wa.me/…`. Zero hardcoded `wa.me` URLs outside `RedirectClient.tsx`.
7. **WhatsApp CTA text per locale:** ms `"WhatsApp Sekarang"`, en `"WhatsApp Us"`, zh `"立即WhatsApp"` (enforced in `hero.cta`, `whatsapp.cta`, midCta, finalCta, and redirect client button).
8. **Timing copy:** ms `"siap dalam 5 jam"`, en `"as fast as 5 hours"`, zh `"最快 5 小时完成"` (enforced in `howItWorks.step3.description` and `whyChoose.reason2`).
9. **Font:** Inter only, global — wired in `app/[locale]/layout.tsx` via `next/font/google`. No serif anywhere.
10. **Leads mode:** `single` — `getPhoneForLocation()` always returns the `location_slug = 'all'` default row; `?loc=` query param is accepted but ignored under single mode.
11. **Sitemap:** 51 entries (3 homepages + 48 location pages). Redirect pages excluded and disallowed in robots.
12. **Product slug:** `cat-rumah` — identical across all locales; location routes are `/[locale]/cat-rumah/[location]`.
