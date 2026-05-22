import { LOCATIONS } from '@/config/locations'
import { siteConfig } from '@/config/site'

export const SITE_URL = siteConfig.url
export const BRAND_NAME = siteConfig.brandName
export const LEGAL_NAME = siteConfig.legalName
export const BRAND_LOGO = `${SITE_URL}/icon.svg`
export const BRAND_PHONE = `+${siteConfig.fallbackPhone}`
export const BRAND_EMAIL = siteConfig.email
export const BRAND_PRICE_RANGE = 'RM25 - RM38'
export const PRODUCT_SLUG = siteConfig.productSlug

export const BRAND_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Operating across Malaysia',
  addressLocality: 'Kuala Lumpur',
  addressRegion: 'Wilayah Persekutuan',
  postalCode: '50000',
  addressCountry: 'MY',
} as const

export const BRAND_GEO = {
  '@type': 'GeoCoordinates',
  latitude: 3.139,
  longitude: 101.6869,
} as const

export const STATES_SERVED = [
  'Selangor',
  'Kuala Lumpur',
  'Negeri Sembilan',
  'Melaka',
  'Johor',
  'Perak',
  'Penang',
  'Kedah',
  'Perlis',
  'Kelantan',
  'Terengganu',
  'Pahang',
  'Sabah',
  'Sarawak',
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
    sameAs: [`https://wa.me/${siteConfig.fallbackPhone}`],
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
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/${locale}#localbusiness`,
    name: LEGAL_NAME,
    alternateName: BRAND_NAME,
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
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
  }
}

export function localBusinessLocationSchema(
  locale: string,
  slug: string,
  cityDisplay: string,
) {
  const url = `${SITE_URL}/${locale}/${PRODUCT_SLUG}/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
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
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
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
      { '@type': 'ListItem', position: 1, name: labels.home, item: base },
      {
        '@type': 'ListItem',
        position: 2,
        name: labels.locations,
        item: `${base}#locations`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cityDisplay,
        item: `${base}/${PRODUCT_SLUG}/${slug}`,
      },
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
      url: `${SITE_URL}/${locale}/${PRODUCT_SLUG}/${it.slug}`,
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
  const pageUrl = `${SITE_URL}/${locale}/${PRODUCT_SLUG}/${slug}`
  const nextYear = new Date().getFullYear() + 1
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${pageUrl}#product-${product.id}`,
    name: product.name,
    image: product.image,
    brand: { '@type': 'Brand', name: BRAND_NAME },
    category: 'Wall panel installation',
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

export { LOCATIONS }
