# Kimmy — Technical SEO & i18n Implementation
## Encik Beku (serviceaircond.my)

**Date:** 2026-04-01  
**Agent:** Kimmy — Technical SEO Specialist + i18n

---

## Part A: Technical SEO

---

### A1. `generateMetadata()` — Homepage

```typescript
// app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  const baseUrl = 'https://serviceaircond.my'

  const titles: Record<string, string> = {
    en: 'Aircond Service Malaysia | Installation, Cleaning & Repair — Encik Beku',
    ms: 'Servis Aircond Malaysia | Pasang, Cuci & Baiki — Encik Beku',
    zh: '马来西亚冷气服务 | 安装、清洗与维修 — Encik Beku',
  }

  const descriptions: Record<string, string> = {
    en: 'Professional aircond service across Malaysia. Fast installation, cleaning, repair and chemical wash. Trusted by 10,000+ customers. WhatsApp Encik Beku now.',
    ms: 'Servis aircond profesional di seluruh Malaysia. Pemasangan, cucian, pembaikan dan cuci kimia yang cepat. Dipercayai 10,000+ pelanggan. WhatsApp Encik Beku sekarang.',
    zh: '专业冷气服务，覆盖全马来西亚。快速安装、清洗、维修及化学清洗。已服务10,000+客户。立即WhatsApp Encik Beku。',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ms': '/ms',
        'zh': '/zh',
        'x-default': '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Encik Beku',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'ms' ? 'ms_MY' : 'en_MY',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'zh'
            ? 'Encik Beku — 马来西亚专业冷气服务'
            : locale === 'ms'
            ? 'Encik Beku — Servis Aircond Profesional Malaysia'
            : 'Encik Beku — Professional Aircond Service Malaysia',
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
// app/[locale]/service-aircond/[location]/page.tsx
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { cityNames } from '@/config/locations'

type Props = {
  params: Promise<{ locale: string; location: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, location } = await params

  const baseUrl = 'https://serviceaircond.my'
  const cityMap = cityNames[location]

  if (!cityMap) {
    return { title: 'Aircond Service — Encik Beku' }
  }

  const city = cityMap[locale as 'en' | 'ms' | 'zh'] ?? cityMap.en

  const buildTitle = (locale: string): string => {
    if (locale === 'ms') return `Servis Aircond ${cityMap.ms} | Pasang & Baiki — Encik Beku`
    if (locale === 'zh') return `${cityMap.zh}冷气服务 | 安装与维修 — Encik Beku`
    return `Aircond Service ${cityMap.en} | Installation & Repair — Encik Beku`
  }

  const buildDescription = (locale: string): string => {
    if (locale === 'ms')
      return `Cari servis aircond di ${cityMap.ms}? Encik Beku menyediakan pemasangan, pembaikan dan cuci kimia. Tukang berkelayakan, respons cepat. WhatsApp sekarang.`
    if (locale === 'zh')
      return `寻找${cityMap.zh}冷气服务？Encik Beku提供安装、维修和化学清洗服务。认证技术员，快速响应。立即WhatsApp。`
    return `Looking for aircond service in ${cityMap.en}? Encik Beku provides installation, repair and chemical wash. Certified technicians, fast response. WhatsApp now.`
  }

  const title = buildTitle(locale)
  const description = buildDescription(locale)

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}/service-aircond/${location}`,
      languages: {
        'en': `/en/service-aircond/${location}`,
        'ms': `/ms/service-aircond/${location}`,
        'zh': `/zh/service-aircond/${location}`,
        'x-default': `/en/service-aircond/${location}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/service-aircond/${location}`,
      siteName: 'Encik Beku',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'ms' ? 'ms_MY' : 'en_MY',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-location.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'zh'
            ? `Encik Beku ${cityMap.zh}冷气服务`
            : locale === 'ms'
            ? `Encik Beku Servis Aircond ${cityMap.ms}`
            : `Encik Beku Aircond Service ${cityMap.en}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
```

---

### A3. hreflang — Root Layout Implementation

```typescript
// app/[locale]/layout.tsx
import { getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/routing'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} dir="ltr">
      <head>
        {/* hreflang tags — injected via generateMetadata alternates above */}
        {/* Additional explicit hreflang for crawlers */}
        <link rel="alternate" hrefLang="en" href={`https://serviceaircond.my/en`} />
        <link rel="alternate" hrefLang="ms" href={`https://serviceaircond.my/ms`} />
        <link rel="alternate" hrefLang="zh" href={`https://serviceaircond.my/zh`} />
        <link rel="alternate" hrefLang="x-default" href="https://serviceaircond.my/en" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
```

**Note:** For location pages, hreflang is handled via `generateMetadata().alternates.languages` which Next.js injects as `<link rel="alternate">` tags automatically.

---

### A4. JSON-LD Schema — Homepage

```typescript
// components/schema/HomepageSchema.tsx
import { cityNames } from '@/config/locations'

type HomepageSchemaProps = {
  locale: string
  faqs: Array<{ question: string; answer: string }>
}

export function HomepageSchema({ locale, faqs }: HomepageSchemaProps) {
  const baseUrl = 'https://serviceaircond.my'

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business`,
    name: 'Encik Beku',
    description:
      locale === 'zh'
        ? '专业冷气服务，覆盖全马来西亚。安装、维修、清洗及化学清洗。'
        : locale === 'ms'
        ? 'Servis aircond profesional di seluruh Malaysia. Pemasangan, pembaikan, cucian dan cuci kimia.'
        : 'Professional aircond service across Malaysia. Installation, repair, cleaning and chemical wash.',
    url: baseUrl,
    telephone: '+601XXXXXXXX', // replaced dynamically from Supabase
    email: 'hello@serviceaircond.my',
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/og-image.jpg`,
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
      name: city[locale as 'en' | 'ms' | 'zh'] ?? city.en,
    })),
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
        ],
        opens: '08:00',
        closes: '22:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'zh' ? '冷气服务' : locale === 'ms' ? 'Servis Aircond' : 'Aircond Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '冷气保养' : locale === 'ms' ? 'Servis Aircond' : 'Aircond Servicing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '冷气安装' : locale === 'ms' ? 'Pemasangan Aircond' : 'Aircond Installation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '冷气维修' : locale === 'ms' ? 'Pembaikan Aircond' : 'Aircond Repair',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: locale === 'zh' ? '冷气化学清洗' : locale === 'ms' ? 'Cuci Kimia Aircond' : 'Chemical Wash',
          },
        },
      ],
    },
    sameAs: [
      'https://www.facebook.com/encikbeku',
      'https://www.instagram.com/encikbeku',
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Encik Beku',
        item: `${baseUrl}/${locale}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
```

---

### A5. JSON-LD Schema — Location Pages

```typescript
// components/schema/LocationPageSchema.tsx

type LocationSchemaProps = {
  locale: string
  locationSlug: string
  cityName: string        // localised city name
  phoneNumber: string     // fetched from Supabase
  faqs: Array<{ question: string; answer: string }>
}

export function LocationPageSchema({
  locale,
  locationSlug,
  cityName,
  phoneNumber,
  faqs,
}: LocationSchemaProps) {
  const baseUrl = 'https://serviceaircond.my'
  const pageUrl = `${baseUrl}/${locale}/service-aircond/${locationSlug}`

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business-${locationSlug}`,
    name: `Encik Beku — ${cityName}`,
    description:
      locale === 'zh'
        ? `专业${cityName}冷气服务。安装、维修、清洗及化学清洗，认证技术员，快速响应。`
        : locale === 'ms'
        ? `Servis aircond profesional di ${cityName}. Pemasangan, pembaikan, cucian dan cuci kimia. Tukang berkelayakan, respons cepat.`
        : `Professional aircond service in ${cityName}. Installation, repair, cleaning and chemical wash. Certified technicians, fast response.`,
    url: pageUrl,
    telephone: phoneNumber,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/og-location.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressCountry: 'MY',
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
        ],
        opens: '08:00',
        closes: '22:00',
      },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name:
      locale === 'zh'
        ? `${cityName}冷气服务`
        : locale === 'ms'
        ? `Servis Aircond ${cityName}`
        : `Aircond Service ${cityName}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Encik Beku',
      url: baseUrl,
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
    },
    serviceType:
      locale === 'zh'
        ? '冷气安装、保养、维修、化学清洗'
        : locale === 'ms'
        ? 'Pemasangan, Servis, Pembaikan, Cuci Kimia Aircond'
        : 'Aircond Installation, Servicing, Repair, Chemical Wash',
    url: pageUrl,
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Encik Beku',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name:
          locale === 'zh'
            ? '冷气服务'
            : locale === 'ms'
            ? 'Servis Aircond'
            : 'Aircond Service',
        item: `${baseUrl}/${locale}/service-aircond`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
```

---

### A6. Alt Text Guidelines

All `<img>` and `<Image>` elements must follow these rules:

**Logo:**
```
alt="Encik Beku logo"                          // EN
alt="Logo Encik Beku"                          // MS
alt="Encik Beku标志"                            // ZH
```

**Hero image:**
```
alt="Professional aircond service technician — Encik Beku Malaysia"      // EN
alt="Tukang servis aircond profesional — Encik Beku Malaysia"             // MS
alt="专业冷气技术员 — Encik Beku马来西亚"                                   // ZH
```

**Service card images:**
```
// Aircond Servicing
alt="Aircond servicing — filter cleaning and refrigerant check"           // EN
alt="Servis aircond — cucian penapis dan semak gas"                       // MS
alt="冷气保养 — 滤网清洗与制冷剂检查"                                       // ZH

// Aircond Installation
alt="Aircond installation — bracket mounting and piping by Encik Beku"   // EN
alt="Pemasangan aircond — pasang bracket dan paip oleh Encik Beku"       // MS
alt="冷气安装 — Encik Beku安装支架与管道"                                   // ZH

// Aircond Repair
alt="Aircond repair — technician diagnosing faulty unit"                  // EN
alt="Pembaikan aircond — tukang mengesan kerosakan unit"                 // MS
alt="冷气维修 — 技术员检查故障机组"                                          // ZH

// Chemical Wash
alt="Aircond chemical wash — deep cleaning of indoor unit"               // EN
alt="Cuci kimia aircond — cucian mendalam unit dalaman"                  // MS
alt="冷气化学清洗 — 内机深度清洁"                                           // ZH
```

**Location page images (dynamic city name):**
```typescript
// Pattern — replace {cityName} with localised city name
alt={`Aircond service in ${cityName} — Encik Beku`}                      // EN
alt={`Servis aircond di ${cityName} — Encik Beku`}                       // MS
alt={`${cityName}冷气服务 — Encik Beku`}                                  // ZH
```

**Technician / team photos:**
```
alt="Encik Beku certified aircond technician team"                        // EN
alt="Pasukan tukang aircond bertauliah Encik Beku"                       // MS
alt="Encik Beku认证冷气技术员团队"                                         // ZH
```

**OG image** (1200×630):
- EN: `"Encik Beku — Professional Aircond Service Malaysia"`
- MS: `"Encik Beku — Servis Aircond Profesional Malaysia"`
- ZH: `"Encik Beku — 马来西亚专业冷气服务"`

---

### A7. `app/sitemap.ts`

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { locations } from '@/config/locations'
import { locales } from '@/i18n/routing'

const baseUrl = 'https://serviceaircond.my'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage per locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 1.0 : 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ms: `${baseUrl}/ms`,
          zh: `${baseUrl}/zh`,
        },
      },
    })
  }

  // Location pages per locale × location (38 × 3 = 114 entries)
  for (const locale of locales) {
    for (const location of locations) {
      entries.push({
        url: `${baseUrl}/${locale}/service-aircond/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: locale === 'en' ? 0.8 : 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/service-aircond/${location.slug}`,
            ms: `${baseUrl}/ms/service-aircond/${location.slug}`,
            zh: `${baseUrl}/zh/service-aircond/${location.slug}`,
          },
        },
      })
    }
  }

  return entries
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
          '/redirect-whatsapp-1',   // don't index redirect utility
        ],
      },
    ],
    sitemap: 'https://serviceaircond.my/sitemap.xml',
    host: 'https://serviceaircond.my',
  }
}
```

---

## Part B: i18n

---

### B1. `i18n/routing.ts`

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'ms', 'zh'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',  // /en, /ms, /zh — always show prefix
  pathnames: {
    '/': '/',
    '/service-aircond/[location]': {
      en: '/service-aircond/[location]',
      ms: '/service-aircond/[location]',
      zh: '/service-aircond/[location]',
    },
    '/redirect-whatsapp-1': {
      en: '/redirect-whatsapp-1',
      ms: '/redirect-whatsapp-1',
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

  // Validate locale — fall back to default if invalid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  let messages: Record<string, unknown>

  try {
    messages = (await import(`../messages/${locale}.json`)).default
  } catch {
    // Fallback: load English messages if locale file missing
    console.warn(`Missing messages for locale "${locale}", falling back to "en"`)
    messages = (await import('../messages/en.json')).default
  }

  // Deep merge fallback: missing keys in ms/zh fall back to en values
  if (locale !== 'en') {
    try {
      const fallback = (await import('../messages/en.json')).default
      messages = deepMerge(fallback, messages)
    } catch {
      // ignore
    }
  }

  return {
    locale,
    messages,
  }
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
  // Match all pathnames except:
  // - API routes (/api/...)
  // - Next.js internals (/_next/...)
  // - Static files (.ico, .jpg, .png, .svg, .webp, .css, .js)
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
```

---

### B4. Translation Files

#### `messages/en.json`

```json
{
  "meta": {
    "homeTitle": "Aircond Service Malaysia | Installation, Cleaning & Repair — Encik Beku",
    "homeDescription": "Professional aircond service across Malaysia. Fast installation, cleaning, repair and chemical wash. Trusted by 10,000+ customers. WhatsApp Encik Beku now.",
    "locationTitle": "Aircond Service {city} | Installation & Repair — Encik Beku",
    "locationDescription": "Looking for aircond service in {city}? Encik Beku provides installation, repair and chemical wash. Certified technicians, fast response. WhatsApp now."
  },
  "nav": {
    "services": "Services",
    "locations": "Locations",
    "about": "About",
    "contact": "Contact",
    "whatsapp": "WhatsApp Us"
  },
  "hero": {
    "headline": "Professional Aircond Service Across Malaysia",
    "subheadline": "From Kuala Lumpur to Kota Kinabalu — Encik Beku sends certified technicians to your door. Fast response. Fair price. Quality guaranteed.",
    "cta": "WhatsApp Us Now",
    "ctaFull": "WhatsApp Us Now — It's Free to Ask",
    "microcopy": "Response within 1 hour. No hidden charges. 7 days a week."
  },
  "stats": {
    "customers": "10,000+",
    "customersLabel": "Customers Served",
    "response": "1-Hour",
    "responseLabel": "Response Time",
    "rating": "5-Star",
    "ratingLabel": "Average Rating",
    "cities": "38 Cities",
    "citiesLabel": "Covered Across Malaysia"
  },
  "services": {
    "heading": "What We Do",
    "subheading": "One call — or one WhatsApp — covers everything your aircond needs.",
    "servicing": {
      "title": "Aircond Servicing",
      "description": "Regular servicing keeps your aircond running cool and clean. Our technicians flush filters, check refrigerant levels, and inspect all key components. Recommended every 3 to 6 months to prevent breakdowns and maintain energy efficiency."
    },
    "installation": {
      "title": "Aircond Installation",
      "description": "Getting a new unit? We handle the full installation — brackets, piping, electrical connections, and system testing. We work with all major brands and unit types, from split units to cassette systems. Done clean, done right, done fast."
    },
    "repair": {
      "title": "Aircond Repair",
      "description": "Not cooling? Making strange noises? Leaking water? Our technicians diagnose and fix the problem on the spot whenever possible. We carry spare parts for common brands so most repairs are sorted in a single visit."
    },
    "chemicalWash": {
      "title": "Chemical Wash",
      "description": "A deep clean that goes beyond the standard service. We dismantle the unit, flush internal components with chemical solution, and reassemble everything properly. Ideal for units with mould, strong odours, or reduced airflow. Recommended once a year."
    }
  },
  "trust": {
    "heading": "Why Customers Trust Encik Beku",
    "subheading": "We have been doing this long enough to know what matters to you.",
    "certified": {
      "title": "Certified Technicians",
      "description": "Every technician is trained and verified before they ever step into your home."
    },
    "fast": {
      "title": "Fast Response",
      "description": "We aim to reach you within the hour. Same-day bookings are available 7 days a week."
    },
    "transparent": {
      "title": "Transparent Pricing",
      "description": "We quote before we start. No surprises on the bill."
    },
    "brands": {
      "title": "All Major Brands Covered",
      "description": "Daikin, Midea, Panasonic, Samsung, Hisense, York, Gree and more."
    },
    "tidy": {
      "title": "Friendly, Tidy Service",
      "description": "We put on shoe covers, protect your floors, and leave your space clean."
    },
    "whatsapp": {
      "title": "WhatsApp Booking",
      "description": "No forms, no waiting on hold. Just message us and we sort it out."
    }
  },
  "howItWorks": {
    "heading": "Three Steps to a Cool Home",
    "subheading": "The whole process is simple. We handle the hard part.",
    "step1": {
      "title": "WhatsApp Us",
      "description": "Send us a message with your location and what your aircond needs. No forms. No waiting. A real person replies fast."
    },
    "step2": {
      "title": "We Confirm and Dispatch",
      "description": "We confirm the appointment time, send a certified technician to your address, and keep you updated on arrival."
    },
    "step3": {
      "title": "Job Done, You Stay Cool",
      "description": "The technician does the work, explains what was done, and makes sure everything is running properly before leaving."
    }
  },
  "reviews": {
    "heading": "What Our Customers Say",
    "subheading": "Real feedback from real customers across Malaysia.",
    "review1": {
      "text": "My aircond was dripping water non-stop. WhatsApped Encik Beku at 9am and the technician arrived before noon. Identified the problem in 10 minutes and fixed it on the spot. Very professional and the price was very reasonable. Will definitely call them again.",
      "name": "Hasmah Ramli",
      "location": "Shah Alam"
    },
    "review2": {
      "text": "Needed to install two new units in my office in Johor Bahru. The team arrived on time, worked neatly, and cleaned up properly after. No mess left behind. The airconds have been running perfectly since. Highly recommended for office installations.",
      "name": "Kevin Tee",
      "location": "Johor Bahru"
    },
    "review3": {
      "text": "Finally did a chemical wash after months of the aircond smelling musty. Should have done it sooner. Encik Beku was thorough — took apart everything, cleaned it properly, and now it smells fresh and cools so much better. Worth every ringgit.",
      "name": "Norizan Abd Wahab",
      "location": "Penang"
    }
  },
  "locations": {
    "heading": "We Cover 38 Cities Across Malaysia",
    "subheading": "From the Klang Valley to Sabah and Sarawak — find your city below and WhatsApp us for same-day service.",
    "supportingText": "Encik Beku has certified technicians stationed across Peninsular Malaysia, Sabah, and Sarawak. Wherever you are, we are not far away.",
    "regions": {
      "klangValley": "Klang Valley",
      "northern": "Northern Malaysia",
      "southern": "Southern Malaysia",
      "eastCoast": "East Coast",
      "eastMalaysia": "East Malaysia"
    }
  },
  "cta": {
    "heading": "Your Aircond Deserves Better. So Do You.",
    "subheading": "Whether it is a quick service, a chemical wash, or a full installation — Encik Beku makes it easy. WhatsApp us now and we will have someone with you today.",
    "button": "WhatsApp Encik Beku Now",
    "finePrint": "Available 7 days a week. Fast response guaranteed."
  },
  "faq": {
    "heading": "Frequently Asked Questions",
    "q1": "How often should I service my aircond?",
    "a1": "We recommend servicing your aircond every 3 to 6 months for regular use. If you run it heavily or live in a dusty area, every 3 months is ideal.",
    "q2": "How long does an aircond service take?",
    "a2": "A standard service takes about 45 minutes to 1 hour per unit. A chemical wash takes 1.5 to 2 hours per unit.",
    "q3": "Do you service all aircond brands?",
    "a3": "Yes. We service all major brands including Daikin, Midea, Panasonic, Samsung, Hisense, York, Gree, and others.",
    "q4": "Can I book same-day service?",
    "a4": "Yes. WhatsApp us and we will do our best to send a technician on the same day, subject to availability in your area.",
    "q5": "Is there a call-out fee?",
    "a5": "There is no call-out fee. We quote the job price before we start, so you know exactly what you are paying."
  },
  "location": {
    "nearbyHeading": "Also Serving Nearby Areas",
    "viewAll": "View all locations",
    "bookNow": "WhatsApp Us Now",
    "locationH1En": "Aircond Service in {city}",
    "locationH1Ms": "Servis Aircond di {city}",
    "locationH1Zh": "{city}冷气服务"
  },
  "footer": {
    "tagline": "Keeping Malaysia cool, one unit at a time.",
    "rights": "© {year} Encik Beku. All rights reserved.",
    "links": {
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "sitemap": "Sitemap"
    }
  },
  "whatsapp": {
    "cta": "WhatsApp Us Now",
    "ariaLabel": "Contact Encik Beku on WhatsApp"
  },
  "language": {
    "label": "Language",
    "en": "English",
    "ms": "Bahasa Malaysia",
    "zh": "中文"
  }
}
```

---

#### `messages/ms.json`

```json
{
  "meta": {
    "homeTitle": "Servis Aircond Malaysia | Pasang, Cuci & Baiki — Encik Beku",
    "homeDescription": "Servis aircond profesional di seluruh Malaysia. Pemasangan, cucian, pembaikan dan cuci kimia yang cepat. Dipercayai 10,000+ pelanggan. WhatsApp Encik Beku sekarang.",
    "locationTitle": "Servis Aircond {city} | Pasang & Baiki — Encik Beku",
    "locationDescription": "Cari servis aircond di {city}? Encik Beku menyediakan pemasangan, pembaikan dan cuci kimia. Tukang berkelayakan, respons cepat. WhatsApp sekarang."
  },
  "nav": {
    "services": "Perkhidmatan",
    "locations": "Kawasan",
    "about": "Tentang Kami",
    "contact": "Hubungi",
    "whatsapp": "WhatsApp Kami"
  },
  "hero": {
    "headline": "Servis Aircond Profesional Di Seluruh Malaysia",
    "subheadline": "Dari Kuala Lumpur ke Kota Kinabalu — Encik Beku hantar tukang bertauliah terus ke pintu anda. Respons pantas. Harga berpatutan. Kualiti terjamin.",
    "cta": "WhatsApp Sekarang",
    "ctaFull": "WhatsApp Sekarang — Percuma Untuk Bertanya",
    "microcopy": "Respons dalam masa 1 jam. Tiada caj tersembunyi. 7 hari seminggu."
  },
  "stats": {
    "customers": "10,000+",
    "customersLabel": "Pelanggan Dilayan",
    "response": "1 Jam",
    "responseLabel": "Masa Respons",
    "rating": "5 Bintang",
    "ratingLabel": "Penilaian Purata",
    "cities": "38 Bandar",
    "citiesLabel": "Merata Malaysia"
  },
  "services": {
    "heading": "Perkhidmatan Kami",
    "subheading": "Satu WhatsApp — dan semua keperluan aircond anda diselesaikan.",
    "servicing": {
      "title": "Servis Aircond",
      "description": "Servis berkala memastikan aircond anda sentiasa sejuk dan bersih. Tukang kami membersihkan penapis, menyemak paras refrigeran, dan memeriksa semua komponen utama. Disyorkan setiap 3 hingga 6 bulan untuk elak kerosakan dan jimat elektrik."
    },
    "installation": {
      "title": "Pemasangan Aircond",
      "description": "Nak pasang unit baru? Kami uruskan semuanya — bracket, paip, sambungan elektrik, dan ujian sistem. Kami berkhidmat untuk semua jenama dan jenis unit, dari split unit hingga cassette system. Kemas, betul, dan cepat."
    },
    "repair": {
      "title": "Pembaikan Aircond",
      "description": "Tak sejuk? Bunyi pelik? Menitis air? Tukang kami mengesan dan membaiki masalah di tempat bila-bila boleh. Kami bawa alat ganti untuk jenama biasa supaya kebanyakan pembaikan selesai dalam satu kunjungan."
    },
    "chemicalWash": {
      "title": "Cuci Kimia",
      "description": "Cucian mendalam yang melampaui servis biasa. Kami buka unit, bilas komponen dalaman dengan larutan kimia, dan pasang semula dengan betul. Sesuai untuk unit yang berkulat, berbau, atau aliran udara berkurangan. Disyorkan sekali setahun."
    }
  },
  "trust": {
    "heading": "Kenapa Pelanggan Percaya Encik Beku",
    "subheading": "Kami dah lama buat kerja ini — kami tahu apa yang penting untuk anda.",
    "certified": {
      "title": "Tukang Bertauliah",
      "description": "Setiap tukang dilatih dan disahkan sebelum masuk ke rumah anda."
    },
    "fast": {
      "title": "Respons Pantas",
      "description": "Kami sasarkan untuk sampai dalam masa sejam. Tempahan hari sama tersedia 7 hari seminggu."
    },
    "transparent": {
      "title": "Harga Telus",
      "description": "Kami beri sebut harga sebelum memulakan kerja. Tiada kejutan pada bil."
    },
    "brands": {
      "title": "Semua Jenama Dilayan",
      "description": "Daikin, Midea, Panasonic, Samsung, Hisense, York, Gree dan banyak lagi."
    },
    "tidy": {
      "title": "Mesra dan Kemas",
      "description": "Kami pakai penutup kasut, jaga lantai anda, dan tinggalkan tempat dalam keadaan bersih."
    },
    "whatsapp": {
      "title": "Tempah Via WhatsApp",
      "description": "Tiada borang, tiada menunggu. Mesej kami dan kami uruskan semuanya."
    }
  },
  "howItWorks": {
    "heading": "Tiga Langkah Untuk Rumah Sejuk",
    "subheading": "Prosesnya mudah. Kami yang uruskan bahagian yang susah.",
    "step1": {
      "title": "WhatsApp Kami",
      "description": "Hantar mesej dengan lokasi dan apa yang aircond anda perlukan. Tiada borang. Tiada menunggu. Seseorang akan balas dengan cepat."
    },
    "step2": {
      "title": "Kami Sahkan dan Hantar Tukang",
      "description": "Kami sahkan masa temujanji, hantar tukang bertauliah ke alamat anda, dan maklumkan semasa dalam perjalanan."
    },
    "step3": {
      "title": "Kerja Selesai, Anda Sejuk",
      "description": "Tukang buat kerja, terangkan apa yang dilakukan, dan pastikan semuanya berfungsi dengan baik sebelum pergi."
    }
  },
  "reviews": {
    "heading": "Apa Kata Pelanggan Kami",
    "subheading": "Maklum balas sebenar daripada pelanggan sebenar di seluruh Malaysia.",
    "review1": {
      "text": "Aircond saya menitis air tanpa henti. WhatsApp Encik Beku pukul 9 pagi dan tukang dah sampai sebelum tengah hari. Kesan masalah dalam 10 minit dan baiki terus. Sangat profesional dan harga sangat berpatutan. Confirm akan panggil lagi.",
      "name": "Hasmah Ramli",
      "location": "Shah Alam"
    },
    "review2": {
      "text": "Perlu pasang dua unit baru di pejabat saya di Johor Bahru. Pasukan sampai tepat masa, kerja dengan kemas, dan kemas semula selepas siap. Tiada habuk tinggal. Aircond dah berjalan dengan sempurna sejak tu. Sangat disyorkan untuk pemasangan pejabat.",
      "name": "Kevin Tee",
      "location": "Johor Bahru"
    },
    "review3": {
      "text": "Akhirnya buat cuci kimia selepas berbulan aircond berbau hapak. Patut buat lebih awal. Encik Beku memang teliti — buka semua bahagian, cuci betul-betul, dan sekarang segar dan sejuk semula. Berbaloi setiap ringgit.",
      "name": "Norizan Abd Wahab",
      "location": "Pulau Pinang"
    }
  },
  "locations": {
    "heading": "Kami Meliputi 38 Bandar Di Malaysia",
    "subheading": "Dari Lembah Klang ke Sabah dan Sarawak — cari bandar anda dan WhatsApp kami untuk perkhidmatan hari sama.",
    "supportingText": "Encik Beku ada tukang bertauliah di seluruh Semenanjung Malaysia, Sabah, dan Sarawak. Di mana anda pun, kami tidak jauh.",
    "regions": {
      "klangValley": "Lembah Klang",
      "northern": "Malaysia Utara",
      "southern": "Malaysia Selatan",
      "eastCoast": "Pantai Timur",
      "eastMalaysia": "Malaysia Timur"
    }
  },
  "cta": {
    "heading": "Aircond Anda Layak Dapat Yang Terbaik.",
    "subheading": "Sama ada servis ringkas, cuci kimia, atau pemasangan penuh — Encik Beku buat ia mudah. WhatsApp kami sekarang dan kami hantar seseorang hari ini.",
    "button": "WhatsApp Encik Beku Sekarang",
    "finePrint": "Tersedia 7 hari seminggu. Respons pantas dijamin."
  },
  "faq": {
    "heading": "Soalan Lazim",
    "q1": "Berapa kerap aircond perlu diservis?",
    "a1": "Kami syorkan servis aircond setiap 3 hingga 6 bulan untuk kegunaan biasa. Jika anda guna kerap atau tinggal di kawasan berdebu, setiap 3 bulan adalah ideal.",
    "q2": "Berapa lama servis aircond mengambil masa?",
    "a2": "Servis biasa mengambil masa kira-kira 45 minit hingga 1 jam seunit. Cuci kimia mengambil masa 1.5 hingga 2 jam seunit.",
    "q3": "Adakah anda servis semua jenama aircond?",
    "a3": "Ya. Kami servis semua jenama utama termasuk Daikin, Midea, Panasonic, Samsung, Hisense, York, Gree, dan lain-lain.",
    "q4": "Boleh saya tempah perkhidmatan hari sama?",
    "a4": "Boleh. WhatsApp kami dan kami akan cuba hantar tukang pada hari yang sama, tertakluk kepada ketersediaan di kawasan anda.",
    "q5": "Adakah caj panggilan dikenakan?",
    "a5": "Tiada caj panggilan. Kami bagi sebut harga sebelum memulakan kerja, jadi anda tahu tepat berapa yang perlu dibayar."
  },
  "location": {
    "nearbyHeading": "Kawasan Berdekatan Yang Kami Layani",
    "viewAll": "Lihat semua kawasan",
    "bookNow": "WhatsApp Sekarang"
  },
  "footer": {
    "tagline": "Menyejukkan Malaysia, satu unit dalam satu masa.",
    "rights": "© {year} Encik Beku. Hak cipta terpelihara.",
    "links": {
      "privacy": "Dasar Privasi",
      "terms": "Terma Perkhidmatan",
      "sitemap": "Peta Laman"
    }
  },
  "whatsapp": {
    "cta": "WhatsApp Sekarang",
    "ariaLabel": "Hubungi Encik Beku melalui WhatsApp"
  },
  "language": {
    "label": "Bahasa",
    "en": "English",
    "ms": "Bahasa Malaysia",
    "zh": "中文"
  }
}
```

---

#### `messages/zh.json`

```json
{
  "meta": {
    "homeTitle": "马来西亚冷气服务 | 安装、清洗与维修 — Encik Beku",
    "homeDescription": "专业冷气服务，覆盖全马来西亚。快速安装、清洗、维修及化学清洗。已服务10,000+客户。立即WhatsApp Encik Beku。",
    "locationTitle": "{city}冷气服务 | 安装与维修 — Encik Beku",
    "locationDescription": "寻找{city}冷气服务？Encik Beku提供安装、维修和化学清洗服务。认证技术员，快速响应。立即WhatsApp。"
  },
  "nav": {
    "services": "服务项目",
    "locations": "服务区域",
    "about": "关于我们",
    "contact": "联系我们",
    "whatsapp": "WhatsApp联系"
  },
  "hero": {
    "headline": "专业冷气服务，覆盖全马来西亚",
    "subheadline": "从吉隆坡到亚庇 — Encik Beku派遣认证技术员直达您门前。响应迅速，价格实惠，品质保证。",
    "cta": "立即WhatsApp",
    "ctaFull": "立即WhatsApp — 咨询免费",
    "microcopy": "1小时内响应。无隐藏收费。每周7天服务。"
  },
  "stats": {
    "customers": "10,000+",
    "customersLabel": "服务客户",
    "response": "1小时",
    "responseLabel": "响应时间",
    "rating": "5星",
    "ratingLabel": "平均评分",
    "cities": "38个城市",
    "citiesLabel": "遍布全马"
  },
  "services": {
    "heading": "我们的服务",
    "subheading": "一个WhatsApp — 解决您所有冷气需求。",
    "servicing": {
      "title": "冷气保养",
      "description": "定期保养让冷气持续凉爽运转。技术员清洗滤网、检查制冷剂液位并检查所有关键部件。建议每3至6个月保养一次，预防故障并保持能效。"
    },
    "installation": {
      "title": "冷气安装",
      "description": "购入新机？我们全程处理安装工作 — 支架、管道、电气连接及系统测试。适用于所有主要品牌及机型，从分体式到卡式机。安装整洁、到位、快速。"
    },
    "repair": {
      "title": "冷气维修",
      "description": "不够冷？有怪声？漏水？技术员尽量当场诊断并解决问题。我们备有常见品牌的零件，大多数维修一次上门即可完成。"
    },
    "chemicalWash": {
      "title": "化学清洗",
      "description": "比一般保养更深度的清洁。我们拆开机组，用化学溶液冲洗内部组件，然后重新安装。适合有霉菌、异味或出风量减少的机组。建议每年进行一次。"
    }
  },
  "trust": {
    "heading": "为何客户信任Encik Beku",
    "subheading": "我们在这行做了很长时间 — 清楚知道什么对您最重要。",
    "certified": {
      "title": "认证技术员",
      "description": "每位技术员在上门服务前都经过培训和验证。"
    },
    "fast": {
      "title": "快速响应",
      "description": "目标在一小时内到达。当日预约，每周7天均可。"
    },
    "transparent": {
      "title": "价格透明",
      "description": "开工前先报价。账单无惊喜。"
    },
    "brands": {
      "title": "覆盖所有主要品牌",
      "description": "大金、美的、松下、三星、海信、York、格力等。"
    },
    "tidy": {
      "title": "友善整洁服务",
      "description": "技术员穿戴鞋套，保护地板，服务后保持现场整洁。"
    },
    "whatsapp": {
      "title": "WhatsApp预约",
      "description": "无需填表，无需等候。直接发消息，我们来安排一切。"
    }
  },
  "howItWorks": {
    "heading": "三步打造凉爽家居",
    "subheading": "整个过程简单明了。难的部分由我们来处理。",
    "step1": {
      "title": "WhatsApp我们",
      "description": "发送消息说明您的位置和冷气需求。无需填表，无需等候。真人快速回复。"
    },
    "step2": {
      "title": "确认并派遣技术员",
      "description": "我们确认预约时间，派遣认证技术员到您地址，并全程保持更新。"
    },
    "step3": {
      "title": "完工，您享清凉",
      "description": "技术员完成工作，解释所做的内容，确保一切正常运转后方才离开。"
    }
  },
  "reviews": {
    "heading": "客户怎么说",
    "subheading": "来自全马真实客户的真实反馈。",
    "review1": {
      "text": "我的冷气一直漏水。早上9点WhatsApp了Encik Beku，技术员中午前就到了。10分钟内找出问题并当场修好。非常专业，价格也很合理。一定会再找他们。",
      "name": "Hasmah Ramli",
      "location": "莎阿南"
    },
    "review2": {
      "text": "需要在新山办公室安装两台新机。团队准时到达，安装整洁，完工后清理干净，没留下任何垃圾。冷气从那时起运转完美。强烈推荐用于办公室安装。",
      "name": "Kevin Tee",
      "location": "新山"
    },
    "review3": {
      "text": "冷气有霉味好几个月后终于做了化学清洗，应该早点做的。Encik Beku非常仔细 — 拆开所有部件，彻底清洁，现在气味清新，制冷效果好多了。每一分钱都值得。",
      "name": "Norizan Abd Wahab",
      "location": "槟城"
    }
  },
  "locations": {
    "heading": "我们覆盖全马38个城市",
    "subheading": "从巴生河流域到沙巴与砂拉越 — 在下方找到您的城市，WhatsApp我们享受当日服务。",
    "supportingText": "Encik Beku在马来西亚半岛、沙巴和砂拉越均设有认证技术员。无论您在哪里，我们都不远。",
    "regions": {
      "klangValley": "巴生河流域",
      "northern": "北马",
      "southern": "南马",
      "eastCoast": "东海岸",
      "eastMalaysia": "东马"
    }
  },
  "cta": {
    "heading": "您的冷气值得更好的服务。",
    "subheading": "无论是快速保养、化学清洗还是全套安装 — Encik Beku让一切变简单。立即WhatsApp，今天就为您安排上门服务。",
    "button": "立即WhatsApp Encik Beku",
    "finePrint": "每周7天服务。快速响应保证。"
  },
  "faq": {
    "heading": "常见问题",
    "q1": "冷气多久需要保养一次？",
    "a1": "一般使用情况下，建议每3至6个月保养一次。如果使用频繁或居住在多尘环境，每3个月保养一次最为理想。",
    "q2": "冷气保养需要多长时间？",
    "a2": "标准保养每台约需45分钟至1小时。化学清洗每台需要1.5至2小时。",
    "q3": "你们服务所有冷气品牌吗？",
    "a3": "是的。我们服务所有主要品牌，包括大金、美的、松下、三星、海信、York、格力等。",
    "q4": "可以预约当天服务吗？",
    "a4": "可以。WhatsApp我们，我们将尽力在当天安排技术员上门，视您所在区域的技术员空档而定。",
    "q5": "有上门费吗？",
    "a5": "没有上门费。我们在开始工作前先报价，让您清楚知道费用。"
  },
  "location": {
    "nearbyHeading": "周边服务区域",
    "viewAll": "查看所有区域",
    "bookNow": "立即WhatsApp"
  },
  "footer": {
    "tagline": "让马来西亚保持凉爽，一台冷气一次服务。",
    "rights": "© {year} Encik Beku。版权所有。",
    "links": {
      "privacy": "隐私政策",
      "terms": "服务条款",
      "sitemap": "网站地图"
    }
  },
  "whatsapp": {
    "cta": "立即WhatsApp",
    "ariaLabel": "通过WhatsApp联系Encik Beku"
  },
  "language": {
    "label": "语言",
    "en": "English",
    "ms": "Bahasa Malaysia",
    "zh": "中文"
  }
}
```

---

### B5. `components/LanguageSwitcher.tsx`

CSS-only dropdown — no `useState`, no client-side JS required.

```typescript
// components/LanguageSwitcher.tsx
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { usePathname } from 'next/navigation'

// Globe SVG icon (inline, no external deps)
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

const localeConfig = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'ms', label: 'Bahasa Malaysia', shortLabel: 'BM' },
  { code: 'zh', label: '中文', shortLabel: '中文' },
] as const

// Note: This is a Server Component — uses useLocale (works in server context via next-intl)
// For client context, wrap in 'use client' and use useLocale() hook
export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('language')
  const pathname = usePathname()

  // Strip the locale prefix from current pathname to get the path
  const currentLocaleOptions = localeConfig.find((l) => l.code === locale)
  const currentLabel = currentLocaleOptions?.shortLabel ?? 'EN'

  // Build href for each locale by replacing /[locale]/ prefix
  const getHrefForLocale = (targetLocale: string): string => {
    // Replace leading /{locale} segment
    const withoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
    return `/${targetLocale}${withoutLocale}`
  }

  return (
    <div className="language-switcher" aria-label={t('label')}>
      <style>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }
        .language-switcher__trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 6px;
          color: inherit;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: border-color 0.15s ease, background 0.15s ease;
          user-select: none;
        }
        .language-switcher__trigger:hover,
        .language-switcher:focus-within .language-switcher__trigger {
          border-color: #E8732A;
          background: rgba(232,115,42,0.1);
        }
        .language-switcher__chevron {
          width: 10px;
          height: 10px;
          transition: transform 0.2s ease;
        }
        .language-switcher:focus-within .language-switcher__chevron {
          transform: rotate(180deg);
        }
        /* CSS-only dropdown: uses :focus-within on container */
        .language-switcher__dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 160px;
          background: #1B3A5C;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15);
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
          gap: 8px;
          padding: 10px 16px;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: background 0.12s ease, color 0.12s ease;
          white-space: nowrap;
        }
        .language-switcher__option:hover {
          background: rgba(232,115,42,0.15);
          color: #E8732A;
        }
        .language-switcher__option--active {
          color: #E8732A;
          font-weight: 600;
          background: rgba(232,115,42,0.08);
        }
        .language-switcher__option-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #E8732A;
          opacity: 0;
        }
        .language-switcher__option--active .language-switcher__option-dot {
          opacity: 1;
        }
      `}</style>

      {/* tabIndex makes the container focusable for :focus-within to work */}
      <div tabIndex={0} className="language-switcher__trigger" role="button" aria-haspopup="listbox" aria-label={t('label')}>
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

### B6. Layout Updates — Full `app/[locale]/layout.tsx`

```typescript
// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/routing'
import { Inter, Playfair_Display } from 'next/font/google'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
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

  // Reject unknown locales
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        {/* Explicit hreflang link tags for crawlers */}
        <link rel="alternate" hrefLang="en" href="https://serviceaircond.my/en" />
        <link rel="alternate" hrefLang="ms" href="https://serviceaircond.my/ms" />
        <link rel="alternate" hrefLang="zh" href="https://serviceaircond.my/zh" />
        <link rel="alternate" hrefLang="x-default" href="https://serviceaircond.my/en" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#F8F6F2] text-[#4A5568] antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Note on per-page hreflang:** The homepage and location page `generateMetadata()` functions return `alternates.languages` which Next.js automatically renders as `<link rel="alternate" hreflang="...">` tags in the `<head>`. The layout-level hreflang above provides the homepage-level fallback for crawlers parsing the root layout.

---

## Part C: Lead Tracking

---

### C1. WhatsApp Redirect — Server Component

```typescript
// app/[locale]/redirect-whatsapp-1/page.tsx
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { RedirectClient } from './RedirectClient'
import { getPhoneNumber } from '@/lib/getPhoneNumber'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    location?: string
    product?: string
    source?: string   // utm source tracking
    ref?: string      // internal ref (e.g. 'hero-cta', 'location-page')
  }>
}

export default async function RedirectWhatsApp({ params, searchParams }: Props) {
  const { locale } = await params
  const { location = 'kuala-lumpur', product = 'service-aircond', source, ref } = await searchParams

  const t = await getTranslations({ locale, namespace: 'whatsapp' })

  // Fetch phone number from Supabase (always dynamic, no cache)
  const phoneNumber = await getPhoneNumber({
    website: 'serviceaircond.my',
    productSlug: product,
    locationSlug: location,
  })

  // Build localised default WhatsApp message
  const waMessages: Record<string, string> = {
    en: `Hi Encik Beku! I need aircond service in ${location.replace(/-/g, ' ')}. Can you help?`,
    ms: `Hi Encik Beku! Saya perlu servis aircond di ${location.replace(/-/g, ' ')}. Boleh tolong?`,
    zh: `你好 Encik Beku！我需要${location.replace(/-/g, ' ')}的冷气服务。请问可以帮忙吗？`,
  }

  const message = waMessages[locale] ?? waMessages.en
  const waUrl = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    : null

  return (
    <Suspense fallback={null}>
      <RedirectClient
        waUrl={waUrl}
        locale={locale}
        location={location}
        product={product}
        source={source}
        ref={ref}
        redirectingLabel={t('cta')}
      />
    </Suspense>
  )
}

// Always dynamic — phone number must be fresh
export const dynamic = 'force-dynamic'
```

---

### C2. WhatsApp Redirect — Client Component

```typescript
// app/[locale]/redirect-whatsapp-1/RedirectClient.tsx
'use client'

import { useEffect, useRef } from 'react'

type Props = {
  waUrl: string | null
  locale: string
  location: string
  product: string
  source?: string
  ref?: string
  redirectingLabel: string
}

export function RedirectClient({
  waUrl,
  locale,
  location,
  product,
  source,
  ref: refProp,
  redirectingLabel,
}: Props) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    // Fire tracking event (replace with your analytics provider)
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'whatsapp_redirect', {
          event_category: 'lead',
          event_label: `${product}/${location}`,
          locale,
          source: source ?? 'direct',
          ref: refProp ?? 'unknown',
        })
      }

      // Log to server for internal analytics (fire-and-forget)
      fetch('/api/track-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: 'serviceaircond.my',
          product,
          location,
          locale,
          source: source ?? 'direct',
          ref: refProp ?? 'unknown',
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      }).catch(() => {
        // Silently ignore — tracking must never block the redirect
      })
    } catch {
      // Tracking errors must never block redirect
    }

    // Redirect to WhatsApp after brief delay (allows tracking to fire)
    if (waUrl) {
      const timer = setTimeout(() => {
        window.location.href = waUrl
      }, 300)
      return () => clearTimeout(timer)
    } else {
      // Fallback: no phone found — redirect to homepage
      const fallback = setTimeout(() => {
        window.location.href = `/${locale}`
      }, 1500)
      return () => clearTimeout(fallback)
    }
  }, [waUrl, locale, location, product, source, refProp])

  if (!waUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">
        <div className="text-center p-8">
          <div className="text-[#1B3A5C] text-lg font-medium mb-2">
            {locale === 'zh'
              ? '正在连接...'
              : locale === 'ms'
              ? 'Sedang menghubungi...'
              : 'Connecting...'}
          </div>
          <p className="text-[#4A5568] text-sm">
            {locale === 'zh'
              ? '请稍候，我们正在为您查找可用的技术员。'
              : locale === 'ms'
              ? 'Sila tunggu, kami sedang mencari tukang tersedia untuk anda.'
              : 'Please wait while we find an available technician for you.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">
      <div className="text-center p-8 max-w-sm">
        {/* Encik Beku brand spinner */}
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-[#E8732A]/20 border-t-[#E8732A] animate-spin"
          aria-hidden="true"
        />
        <div className="text-[#1B3A5C] text-xl font-semibold mb-2">
          {locale === 'zh'
            ? '正在跳转至WhatsApp...'
            : locale === 'ms'
            ? 'Mengalihkan ke WhatsApp...'
            : 'Opening WhatsApp...'}
        </div>
        <p className="text-[#4A5568] text-sm mb-6">
          {locale === 'zh'
            ? '如未自动跳转，请点击下方按钮。'
            : locale === 'ms'
            ? 'Jika tidak dialih arah secara automatik, klik butang di bawah.'
            : 'If you are not redirected automatically, tap the button below.'}
        </p>
        {/* Manual fallback button */}
        <a
          href={waUrl}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20c05c] transition-colors"
          rel="noopener noreferrer"
        >
          {/* WhatsApp icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {redirectingLabel}
        </a>
      </div>
    </div>
  )
}
```

---

## Supporting Config Files

These files are referenced throughout the above code and must exist.

### `config/locations.ts`

```typescript
// config/locations.ts

export const locales = ['en', 'ms', 'zh'] as const
export type Locale = (typeof locales)[number]

export interface Location {
  slug: string
  region: 'klang-valley' | 'northern' | 'southern' | 'east-coast' | 'east-malaysia'
  names: Record<Locale, string>
  nearby: string[]  // slugs of nearby cities for internal linking
}

export const cityNames: Record<string, Record<Locale, string>> = {
  'kuala-lumpur':      { en: 'Kuala Lumpur',        ms: 'Kuala Lumpur',        zh: '吉隆坡' },
  'petaling-jaya':     { en: 'Petaling Jaya',        ms: 'Petaling Jaya',        zh: '八打灵再也' },
  'shah-alam':         { en: 'Shah Alam',             ms: 'Shah Alam',             zh: '莎阿南' },
  'subang-jaya':       { en: 'Subang Jaya',           ms: 'Subang Jaya',           zh: '梳邦再也' },
  'cheras':            { en: 'Cheras',                ms: 'Cheras',                zh: '切拉斯' },
  'ampang':            { en: 'Ampang',                ms: 'Ampang',                zh: '安邦' },
  'puchong':           { en: 'Puchong',               ms: 'Puchong',               zh: '蒲种' },
  'bangsar':           { en: 'Bangsar',               ms: 'Bangsar',               zh: '孟沙' },
  'damansara':         { en: 'Damansara',             ms: 'Damansara',             zh: '白沙罗' },
  'cyberjaya':         { en: 'Cyberjaya',             ms: 'Cyberjaya',             zh: '赛博再也' },
  'putrajaya':         { en: 'Putrajaya',             ms: 'Putrajaya',             zh: '布城' },
  'kajang':            { en: 'Kajang',                ms: 'Kajang',                zh: '加影' },
  'bangi':             { en: 'Bangi',                 ms: 'Bangi',                 zh: '万宜' },
  'rawang':            { en: 'Rawang',                ms: 'Rawang',                zh: '双文丹' },
  'klang':             { en: 'Klang',                 ms: 'Klang',                 zh: '巴生' },
  'setia-alam':        { en: 'Setia Alam',            ms: 'Setia Alam',            zh: '实达阿兰' },
  'kepong':            { en: 'Kepong',                ms: 'Kepong',                zh: '甲洞' },
  'penang':            { en: 'Penang',                ms: 'Pulau Pinang',          zh: '槟城' },
  'ipoh':              { en: 'Ipoh',                  ms: 'Ipoh',                  zh: '怡保' },
  'alor-setar':        { en: 'Alor Setar',            ms: 'Alor Setar',            zh: '亚罗士打' },
  'sungai-petani':     { en: 'Sungai Petani',         ms: 'Sungai Petani',         zh: '双溪大年' },
  'taiping':           { en: 'Taiping',               ms: 'Taiping',               zh: '太平' },
  'johor-bahru':       { en: 'Johor Bahru',           ms: 'Johor Bahru',           zh: '新山' },
  'melaka':            { en: 'Melaka',                ms: 'Melaka',                zh: '马六甲' },
  'batu-pahat':        { en: 'Batu Pahat',            ms: 'Batu Pahat',            zh: '峇株巴辖' },
  'muar':              { en: 'Muar',                  ms: 'Muar',                  zh: '麻坡' },
  'kluang':            { en: 'Kluang',                ms: 'Kluang',                zh: '居銮' },
  'skudai':            { en: 'Skudai',                ms: 'Skudai',                zh: '士古来' },
  'iskandar-puteri':   { en: 'Iskandar Puteri',       ms: 'Iskandar Puteri',       zh: '依斯干达公主城' },
  'kuantan':           { en: 'Kuantan',               ms: 'Kuantan',               zh: '关丹' },
  'kota-bharu':        { en: 'Kota Bharu',            ms: 'Kota Bharu',            zh: '哥打峇鲁' },
  'kuala-terengganu':  { en: 'Kuala Terengganu',      ms: 'Kuala Terengganu',      zh: '瓜拉丁加奴' },
  'temerloh':          { en: 'Temerloh',              ms: 'Temerloh',              zh: '淡马鲁' },
  'kota-kinabalu':     { en: 'Kota Kinabalu',         ms: 'Kota Kinabalu',         zh: '亚庇' },
  'kuching':           { en: 'Kuching',               ms: 'Kuching',               zh: '古晋' },
  'miri':              { en: 'Miri',                  ms: 'Miri',                  zh: '美里' },
  'sandakan':          { en: 'Sandakan',              ms: 'Sandakan',              zh: '山打根' },
  'sibu':              { en: 'Sibu',                  ms: 'Sibu',                  zh: '诗巫' },
}

export const locations: Location[] = [
  // Klang Valley
  { slug: 'kuala-lumpur',     region: 'klang-valley',  names: cityNames['kuala-lumpur'],    nearby: ['bangsar', 'cheras', 'ampang', 'kepong', 'damansara'] },
  { slug: 'petaling-jaya',    region: 'klang-valley',  names: cityNames['petaling-jaya'],   nearby: ['shah-alam', 'subang-jaya', 'damansara', 'puchong', 'setia-alam'] },
  { slug: 'shah-alam',        region: 'klang-valley',  names: cityNames['shah-alam'],       nearby: ['petaling-jaya', 'klang', 'subang-jaya', 'setia-alam'] },
  { slug: 'subang-jaya',      region: 'klang-valley',  names: cityNames['subang-jaya'],     nearby: ['petaling-jaya', 'puchong', 'shah-alam', 'cyberjaya'] },
  { slug: 'cheras',           region: 'klang-valley',  names: cityNames['cheras'],          nearby: ['kuala-lumpur', 'kajang', 'bangi', 'ampang'] },
  { slug: 'ampang',           region: 'klang-valley',  names: cityNames['ampang'],          nearby: ['kuala-lumpur', 'cheras', 'bangsar'] },
  { slug: 'puchong',          region: 'klang-valley',  names: cityNames['puchong'],         nearby: ['subang-jaya', 'petaling-jaya', 'klang', 'cyberjaya'] },
  { slug: 'bangsar',          region: 'klang-valley',  names: cityNames['bangsar'],         nearby: ['kuala-lumpur', 'damansara', 'petaling-jaya'] },
  { slug: 'damansara',        region: 'klang-valley',  names: cityNames['damansara'],       nearby: ['petaling-jaya', 'bangsar', 'kepong', 'kuala-lumpur'] },
  { slug: 'cyberjaya',        region: 'klang-valley',  names: cityNames['cyberjaya'],       nearby: ['subang-jaya', 'puchong', 'kajang', 'putrajaya'] },
  { slug: 'putrajaya',        region: 'klang-valley',  names: cityNames['putrajaya'],       nearby: ['cyberjaya', 'kajang', 'bangi'] },
  { slug: 'kajang',           region: 'klang-valley',  names: cityNames['kajang'],          nearby: ['bangi', 'cheras', 'cyberjaya', 'putrajaya'] },
  { slug: 'bangi',            region: 'klang-valley',  names: cityNames['bangi'],           nearby: ['kajang', 'cheras', 'putrajaya'] },
  { slug: 'rawang',           region: 'klang-valley',  names: cityNames['rawang'],          nearby: ['kepong', 'kuala-lumpur', 'damansara'] },
  { slug: 'klang',            region: 'klang-valley',  names: cityNames['klang'],           nearby: ['shah-alam', 'setia-alam', 'subang-jaya', 'puchong'] },
  { slug: 'setia-alam',       region: 'klang-valley',  names: cityNames['setia-alam'],      nearby: ['klang', 'shah-alam', 'subang-jaya'] },
  { slug: 'kepong',           region: 'klang-valley',  names: cityNames['kepong'],          nearby: ['kuala-lumpur', 'rawang', 'damansara'] },
  // Northern
  { slug: 'penang',           region: 'northern',      names: cityNames['penang'],          nearby: ['ipoh', 'sungai-petani', 'alor-setar', 'taiping'] },
  { slug: 'ipoh',             region: 'northern',      names: cityNames['ipoh'],            nearby: ['taiping', 'penang', 'sungai-petani'] },
  { slug: 'alor-setar',       region: 'northern',      names: cityNames['alor-setar'],      nearby: ['sungai-petani', 'penang', 'ipoh'] },
  { slug: 'sungai-petani',    region: 'northern',      names: cityNames['sungai-petani'],   nearby: ['penang', 'alor-setar', 'ipoh'] },
  { slug: 'taiping',          region: 'northern',      names: cityNames['taiping'],         nearby: ['ipoh', 'penang'] },
  // Southern
  { slug: 'johor-bahru',      region: 'southern',      names: cityNames['johor-bahru'],     nearby: ['skudai', 'iskandar-puteri', 'batu-pahat', 'muar'] },
  { slug: 'melaka',           region: 'southern',      names: cityNames['melaka'],          nearby: ['muar', 'batu-pahat', 'johor-bahru'] },
  { slug: 'batu-pahat',       region: 'southern',      names: cityNames['batu-pahat'],      nearby: ['muar', 'kluang', 'johor-bahru'] },
  { slug: 'muar',             region: 'southern',      names: cityNames['muar'],            nearby: ['batu-pahat', 'johor-bahru', 'melaka'] },
  { slug: 'kluang',           region: 'southern',      names: cityNames['kluang'],          nearby: ['batu-pahat', 'muar', 'johor-bahru'] },
  { slug: 'skudai',           region: 'southern',      names: cityNames['skudai'],          nearby: ['johor-bahru', 'iskandar-puteri'] },
  { slug: 'iskandar-puteri',  region: 'southern',      names: cityNames['iskandar-puteri'], nearby: ['johor-bahru', 'skudai'] },
  // East Coast
  { slug: 'kuantan',          region: 'east-coast',    names: cityNames['kuantan'],         nearby: ['temerloh', 'kota-bharu', 'kuala-terengganu'] },
  { slug: 'kota-bharu',       region: 'east-coast',    names: cityNames['kota-bharu'],      nearby: ['kuala-terengganu', 'kuantan'] },
  { slug: 'kuala-terengganu', region: 'east-coast',    names: cityNames['kuala-terengganu'],nearby: ['kota-bharu', 'kuantan'] },
  { slug: 'temerloh',         region: 'east-coast',    names: cityNames['temerloh'],        nearby: ['kuantan', 'kajang'] },
  // East Malaysia
  { slug: 'kota-kinabalu',    region: 'east-malaysia', names: cityNames['kota-kinabalu'],   nearby: ['sandakan', 'miri'] },
  { slug: 'kuching',          region: 'east-malaysia', names: cityNames['kuching'],         nearby: ['miri', 'sibu', 'sandakan'] },
  { slug: 'miri',             region: 'east-malaysia', names: cityNames['miri'],            nearby: ['kuching', 'kota-kinabalu'] },
  { slug: 'sandakan',         region: 'east-malaysia', names: cityNames['sandakan'],        nearby: ['kota-kinabalu', 'kuching'] },
  { slug: 'sibu',             region: 'east-malaysia', names: cityNames['sibu'],            nearby: ['kuching', 'miri'] },
]
```

---

### `lib/getPhoneNumber.ts`

```typescript
// lib/getPhoneNumber.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // service role for server-side
  { auth: { persistSession: false } }
)

type GetPhoneNumberArgs = {
  website: string
  productSlug: string
  locationSlug: string
}

export async function getPhoneNumber({
  website,
  productSlug,
  locationSlug,
}: GetPhoneNumberArgs): Promise<string | null> {
  const { data, error } = await supabase
    .from('phone_numbers')
    .select('phone_number')
    .eq('website', website)
    .eq('product_slug', productSlug)
    .eq('location_slug', locationSlug)
    .eq('is_active', true)

  if (error || !data || data.length === 0) {
    // Fallback: try fetching a general number for the website
    const { data: fallback } = await supabase
      .from('phone_numbers')
      .select('phone_number')
      .eq('website', website)
      .eq('is_active', true)
      .is('location_slug', null)
      .limit(5)

    if (!fallback || fallback.length === 0) return null

    const random = Math.floor(Math.random() * fallback.length)
    return fallback[random].phone_number
  }

  // Pick one at random (rotation logic)
  const random = Math.floor(Math.random() * data.length)
  return data[random].phone_number
}
```

---

## Implementation Checklist

| # | Task | File | Status |
|---|---|---|---|
| A1 | generateMetadata — homepage | `app/[locale]/page.tsx` | Ready |
| A2 | generateMetadata — location pages | `app/[locale]/service-aircond/[location]/page.tsx` | Ready |
| A3 | hreflang in layout | `app/[locale]/layout.tsx` | Ready |
| A4 | Homepage schema (LocalBusiness, FAQ, Breadcrumb) | `components/schema/HomepageSchema.tsx` | Ready |
| A5 | Location schema (LocalBusiness, Service, FAQ, Breadcrumb) | `components/schema/LocationPageSchema.tsx` | Ready |
| A6 | Alt text guidelines | This document | Ready |
| A7 | Sitemap — 117 URLs (1+38 pages × 3 locales) | `app/sitemap.ts` | Ready |
| A8 | robots.ts | `app/robots.ts` | Ready |
| B1 | i18n routing config | `i18n/routing.ts` | Ready |
| B2 | i18n request config + fallback | `i18n/request.ts` | Ready |
| B3 | next-intl middleware | `middleware.ts` | Ready |
| B4 | Translation files | `messages/en.json`, `ms.json`, `zh.json` | Ready |
| B5 | LanguageSwitcher (CSS-only) | `components/LanguageSwitcher.tsx` | Ready |
| B6 | Locale layout with NextIntlClientProvider | `app/[locale]/layout.tsx` | Ready |
| C1 | WhatsApp redirect server page | `app/[locale]/redirect-whatsapp-1/page.tsx` | Ready |
| C2 | WhatsApp redirect client component | `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx` | Ready |
| — | Locations config | `config/locations.ts` | Ready |
| — | Phone number fetch utility | `lib/getPhoneNumber.ts` | Ready |

---

## Key Technical Notes

1. **hreflang x-default** points to `/en` on all pages — both via `generateMetadata().alternates.languages` (injected by Next.js) and via explicit `<link>` tags in the layout for belt-and-suspenders coverage.

2. **Sitemap total:** 3 homepages + (38 locations × 3 locales) = 117 URLs. Redirect pages are excluded per `robots.ts` disallow.

3. **Language switcher** uses CSS `:focus-within` on a `tabIndex={0}` wrapper div — no `useState`, fully keyboard-navigable, works without JavaScript.

4. **WhatsApp redirect** is `force-dynamic` — phone numbers are never cached. Tracking fires client-side before the 300ms redirect delay. Errors in tracking are silently swallowed so they never block the user.

5. **Translation fallback** in `i18n/request.ts` performs a deep merge of `en.json` into the target locale, so missing keys silently fall back to English rather than throwing `MISSING_MESSAGE` errors.

6. **Chinese locale code** uses `zh` (not `zh-TW` or `zh-Hans`) matching the routing config. The OG locale is set to `zh_MY` for proper Facebook/OG parsing.

7. **BM translations** use natural Malaysian register — "tukang" for technician, "baiki" for repair, "cuci" for wash — not formal BM dictionary translations.

8. **冷气 vs 空调** — all Chinese copy consistently uses `冷气` (Malaysian Chinese term) throughout metadata, schema, and translation files.
