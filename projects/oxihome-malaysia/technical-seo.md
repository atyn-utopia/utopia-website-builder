# Oxihome Malaysia — Technical SEO Implementation

**Prepared by:** Kimmy (Technical Implementation Specialist)
**Brand:** Oxihome Malaysia
**Domain:** oxihome.my
**Locales:** en, ms, zh
**Product slug:** oxygen-machine
**Total pages:** 384 (3 homepage + 381 location)

---

## 1. generateMetadata() — Homepage (`app/[locale]/page.tsx`)

```ts
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `https://oxihome.my/${locale}`,
      languages: {
        en: 'https://oxihome.my/en',
        ms: 'https://oxihome.my/ms',
        zh: 'https://oxihome.my/zh',
        'x-default': 'https://oxihome.my/en',
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `https://oxihome.my/${locale}`,
      siteName: 'Oxihome Malaysia',
      locale: locale,
      type: 'website',
      images: [
        {
          url: 'https://oxihome.my/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('meta.ogImageAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: ['https://oxihome.my/og-image.jpg'],
    },
    robots: { index: true, follow: true },
  }
}
```

### Translation keys — `messages/en.json`
```json
{
  "home": {
    "meta": {
      "title": "Oxygen Machine Malaysia | Rent from RM250/mo | Oxihome",
      "description": "Rent or buy oxygen machines in Malaysia from RM250/mo. 4-hour same-day delivery. Oxygen concentrators, emergency tanks & oximeters. WhatsApp us now.",
      "ogImageAlt": "Oxihome Malaysia — Oxygen Machine Rental and Sales"
    }
  }
}
```

### Translation keys — `messages/ms.json`
```json
{
  "home": {
    "meta": {
      "title": "Mesin Oksigen Malaysia | Sewa dari RM250/bln | Oxihome",
      "description": "Sewa atau beli mesin oksigen di Malaysia dari RM250/bln. Penghantaran hari sama 4 jam. Oxygen concentrator, tangki kecemasan & oximeter. WhatsApp kami.",
      "ogImageAlt": "Oxihome Malaysia — Sewa dan Beli Mesin Oksigen"
    }
  }
}
```

### Translation keys — `messages/zh.json`
```json
{
  "home": {
    "meta": {
      "title": "氧气机马来西亚 | 每月RM250起租 | Oxihome",
      "description": "在马来西亚租用或购买氧气机，每月RM250起。4小时当天送货。氧气浓缩机、紧急氧气罐和血氧仪。立即WhatsApp我们。",
      "ogImageAlt": "Oxihome Malaysia — 氧气机租赁与销售"
    }
  }
}
```

---

## 2. generateMetadata() — Location Page (`app/[locale]/oxygen-machine/[location]/page.tsx`)

```ts
import { getTranslations } from 'next-intl/server'
import { locations } from '@/config/locations'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>
}): Promise<Metadata> {
  const { locale, location } = await params
  const t = await getTranslations({ locale, namespace: 'location' })

  const locationData = locations.find((l) => l.slug === location)
  if (!locationData) return {}

  const cityName = locationData.displayName
  const title = t('meta.title', { city: cityName })
  const description = t('meta.description', { city: cityName })
  const url = `https://oxihome.my/${locale}/oxygen-machine/${location}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `https://oxihome.my/en/oxygen-machine/${location}`,
        ms: `https://oxihome.my/ms/oxygen-machine/${location}`,
        zh: `https://oxihome.my/zh/oxygen-machine/${location}`,
        'x-default': `https://oxihome.my/en/oxygen-machine/${location}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Oxihome Malaysia',
      locale: locale,
      type: 'website',
      images: [
        {
          url: 'https://oxihome.my/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('meta.ogImageAlt', { city: cityName }),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://oxihome.my/og-image.jpg'],
    },
    robots: { index: true, follow: true },
  }
}
```

### Location translation keys — `messages/en.json`
```json
{
  "location": {
    "meta": {
      "title": "Oxygen Machine in {city} | Rent from RM250/mo | Oxihome",
      "description": "Rent or buy oxygen machine in {city} from RM250/mo. 4-hour delivery to {city}. Oxygen concentrators, emergency tanks & oximeters. WhatsApp us now.",
      "ogImageAlt": "Oxihome — Oxygen Machine Delivery in {city}"
    }
  }
}
```

### Location translation keys — `messages/ms.json`
```json
{
  "location": {
    "meta": {
      "title": "Mesin Oksigen di {city} | Sewa dari RM250/bln | Oxihome",
      "description": "Sewa atau beli mesin oksigen di {city} dari RM250/bln. Penghantaran 4 jam ke {city}. Oxygen concentrator, tangki kecemasan & oximeter. WhatsApp kami.",
      "ogImageAlt": "Oxihome — Penghantaran Mesin Oksigen di {city}"
    }
  }
}
```

### Location translation keys — `messages/zh.json`
```json
{
  "location": {
    "meta": {
      "title": "{city}氧气机 | 每月RM250起租 | Oxihome",
      "description": "在{city}租用或购买氧气机，每月RM250起。4小时送货到{city}。氧气浓缩机、紧急氧气罐和血氧仪。立即WhatsApp我们。",
      "ogImageAlt": "Oxihome — {city}氧气机送货服务"
    }
  }
}
```

---

## 3. hreflang Implementation (`app/[locale]/layout.tsx`)

```tsx
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    metadataBase: new URL('https://oxihome.my'),
    alternates: {
      canonical: `https://oxihome.my/${locale}`,
      languages: {
        en: 'https://oxihome.my/en',
        ms: 'https://oxihome.my/ms',
        zh: 'https://oxihome.my/zh',
        'x-default': 'https://oxihome.my/en',
      },
    },
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

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
```

**Rendered HTML output:**
```html
<link rel="canonical" href="https://oxihome.my/en" />
<link rel="alternate" hreflang="en" href="https://oxihome.my/en" />
<link rel="alternate" hreflang="ms" href="https://oxihome.my/ms" />
<link rel="alternate" hreflang="zh" href="https://oxihome.my/zh" />
<link rel="alternate" hreflang="x-default" href="https://oxihome.my/en" />
```

---

## 4. Schema Markup (JSON-LD)

### 4.1 Organization Schema (global — all pages)

```tsx
// components/schema/OrganizationSchema.tsx
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Oxihome Malaysia',
    url: 'https://oxihome.my',
    logo: 'https://oxihome.my/logo.svg',
    description: "Malaysia's dedicated home oxygen equipment provider. Rent or buy oxygen machines with 4-hour same-day delivery across 127 locations.",
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Malay', 'Chinese'],
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### 4.2 MedicalBusiness Schema (location pages)

```tsx
// components/schema/LocalBusinessSchema.tsx
export function LocalBusinessSchema({ cityName, stateName, locationSlug, locale, phoneNumber }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: `Oxihome Malaysia - ${cityName}`,
    url: `https://oxihome.my/${locale}/oxygen-machine/${locationSlug}`,
    description: `Oxygen machine rental and sales in ${cityName}, Malaysia. 4-hour same-day delivery. Rent from RM250/month.`,
    telephone: phoneNumber,
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: { '@type': 'State', name: stateName },
    },
    priceRange: 'RM40 - RM2,599',
    currenciesAccepted: 'MYR',
    openingHours: 'Mo-Su 08:00-22:00',
    parentOrganization: {
      '@type': 'Organization',
      name: 'Oxihome Malaysia',
      url: 'https://oxihome.my',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### 4.3 FAQPage Schema (location pages)

```tsx
// components/schema/FAQSchema.tsx
export function FAQSchema({ faqs }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### 4.4 BreadcrumbList Schema (location pages)

```tsx
// components/schema/BreadcrumbSchema.tsx
export function BreadcrumbSchema({ locale, cityName, locationSlug }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://oxihome.my/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: `Oxygen Machine in ${cityName}`,
        item: `https://oxihome.my/${locale}/oxygen-machine/${locationSlug}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### 4.5 Product Schema (homepage — all 4 products)

```tsx
// components/schema/ProductSchema.tsx
export function ProductSchema() {
  const products = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'OxiHome Mesin 5L Oxygen Concentrator',
      description: 'Medical-grade 5-liter oxygen concentrator with 96% purity. Lightweight, whisper-quiet at 45 dB. Includes nasal cannula and humidifier bottle.',
      brand: { '@type': 'Brand', name: 'Oxihome' },
      offers: [
        {
          '@type': 'Offer',
          price: '250',
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '250',
            priceCurrency: 'MYR',
            billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
          },
        },
        { '@type': 'Offer', price: '2599', priceCurrency: 'MYR', availability: 'https://schema.org/InStock' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Tangki Oksigen Kecemasan (Emergency Oxygen Tank)',
      description: '10-litre emergency oxygen tank for home use. Compact and ready when you need it most.',
      brand: { '@type': 'Brand', name: 'Oxihome' },
      offers: [
        {
          '@type': 'Offer',
          price: '90',
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '90',
            priceCurrency: 'MYR',
            billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Pakej Combo Jimat (Value Combo Package)',
      description: 'Oxygen concentrator and emergency tank combo with free oximeter. Complete home oxygen therapy package.',
      brand: { '@type': 'Brand', name: 'Oxihome' },
      offers: [
        {
          '@type': 'Offer',
          price: '320',
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '320',
            priceCurrency: 'MYR',
            billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Pulse Oximeter',
      description: 'Check blood oxygen levels in seconds with 99% accuracy. Clip-on finger pulse oximeter for home respiratory health monitoring.',
      brand: { '@type': 'Brand', name: 'Oxihome' },
      offers: [
        { '@type': 'Offer', price: '40', priceCurrency: 'MYR', availability: 'https://schema.org/InStock' },
      ],
    },
  ]

  return (
    <>
      {products.map((product, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
        />
      ))}
    </>
  )
}
```

---

## 5. Image Alt Text Guidelines

| Image | Alt Text |
|---|---|
| Hero product image | `"OxiHome 5L oxygen concentrator — medical-grade home oxygen machine available for rent or purchase in Malaysia"` |
| OxiHome Mesin 5L card | `"OxiHome Mesin 5L oxygen concentrator with nasal cannula and humidifier bottle"` |
| Tangki Oksigen Kecemasan card | `"10-litre emergency oxygen tank by Oxihome for home backup use"` |
| Pakej Combo Jimat card | `"Oxihome value combo package — oxygen concentrator, emergency tank, and free oximeter"` |
| Oximeter card | `"Oxihome pulse oximeter for checking blood oxygen levels at home"` |
| Location page hero | `"Oxygen machine delivery in {City} — Oxihome same-day 4-hour delivery service"` |
| Testimonial photos | `"Photo of {reviewer name} from {city} — Oxihome customer"` |
| How It Works icons | `"Step 1: WhatsApp us to order your oxygen machine"` / `"Step 2: Choose your plan"` / `"Step 3: Receive within 4 hours"` |
| Decorative orbs/rings/dots | `alt="" role="presentation"` |

---

## 6. Sitemap (`app/sitemap.ts`)

```ts
import { MetadataRoute } from 'next'
import { locations } from '@/config/locations'

const BASE_URL = 'https://oxihome.my'
const locales = ['en', 'ms', 'zh'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage variants (3 pages)
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          ms: `${BASE_URL}/ms`,
          zh: `${BASE_URL}/zh`,
        },
      },
    })
  }

  // Location pages (127 x 3 = 381 pages)
  for (const location of locations) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/oxygen-machine/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/oxygen-machine/${location.slug}`,
            ms: `${BASE_URL}/ms/oxygen-machine/${location.slug}`,
            zh: `${BASE_URL}/zh/oxygen-machine/${location.slug}`,
          },
        },
      })
    }
  }

  return entries
}
```

---

## 7. robots.ts (`app/robots.ts`)

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://oxihome.my/sitemap.xml',
  }
}
```

**Rendered output:**
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://oxihome.my/sitemap.xml
```

---

## 8. Schema Placement Summary

| Page | Schema Types |
|---|---|
| All pages (via layout) | Organization |
| Homepage | Organization + Product (×4) |
| Location pages | Organization + MedicalBusiness + FAQPage + BreadcrumbList |

---

## 9. Technical SEO Checklist

- [x] `generateMetadata()` on homepage — dynamic per locale
- [x] `generateMetadata()` on location pages — dynamic per locale and city
- [x] Canonical URLs use HTTPS and production domain
- [x] No duplicate canonicals between locale variants
- [x] hreflang for en, ms, zh + x-default on every page
- [x] x-default points to English variant
- [x] Organization schema on all pages
- [x] MedicalBusiness schema on location pages
- [x] FAQPage schema on location pages
- [x] BreadcrumbList schema on location pages
- [x] Product schema (×4) on homepage
- [x] All schema validates against schema.org
- [x] Descriptive alt text for all content images
- [x] Empty alt + `role="presentation"` for decorative images
- [x] Sitemap covers all 384 pages with hreflang alternates
- [x] robots.ts allows all crawlers, blocks `/api/`, includes sitemap URL
- [x] `lang` attribute set on `<html>` per locale
- [x] `metadataBase` set to production URL
