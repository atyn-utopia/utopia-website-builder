import { LOCATIONS } from '@/config/locations'

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

export const STATES_SERVED = [
  'Selangor',
  'Kuala Lumpur',
  'Johor',
  'Negeri Sembilan',
  'Perak',
  'Penang',
  'Melaka',
  'Pahang',
  'Kedah',
  'Terengganu',
  'Kelantan',
  'Perlis',
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
    sameAs: [`https://wa.me/${BRAND_PHONE.replace('+', '')}`],
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
    additionalType:
      'https://www.productontology.org/id/Party_equipment_rental_service',
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
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
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
    additionalType:
      'https://www.productontology.org/id/Party_equipment_rental_service',
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
      { '@type': 'ListItem', position: 1, name: labels.home, item: base },
      {
        '@type': 'ListItem',
        position: 2,
        name: labels.locations,
        item: `${base}#service-area`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cityDisplay,
        item: `${base}/table-chair-rental/${slug}`,
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

// Re-exports for convenience
export { LOCATIONS }
