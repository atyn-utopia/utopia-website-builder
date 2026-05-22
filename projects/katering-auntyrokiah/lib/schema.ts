import { LOCATIONS } from '@/config/locations'
import { siteConfig } from '@/config/site'

export const SITE_URL = siteConfig.url
export const BRAND_NAME = siteConfig.brandName
export const LEGAL_NAME = siteConfig.legalName
export const BRAND_LOGO = `${siteConfig.url}/icon.svg`
export const BRAND_PHONE = `+${siteConfig.fallbackPhone}`
export const BRAND_PRICE_RANGE = siteConfig.priceRange

export function organizationSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: BRAND_NAME,
    legalName: LEGAL_NAME,
    alternateName: BRAND_NAME,
    foundingDate: siteConfig.foundingYear,
    slogan: siteConfig.slogan,
    url: SITE_URL,
    logo: BRAND_LOGO,
    areaServed: 'MY',
    sameAs: [`https://wa.me/${siteConfig.fallbackPhone}`],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        areaServed: 'MY',
        availableLanguage: ['ms', 'en', 'zh'],
        url: `${SITE_URL}/${locale}/redirect-whatsapp-1`,
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
  }
}

export function localBusinessSchema(
  locale: string,
  slug: string,
  cityDisplay: string,
  state: string,
) {
  const url = `${SITE_URL}/${locale}/${siteConfig.productSlug}/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': `${url}#localbusiness`,
    name: `${BRAND_NAME} — ${cityDisplay}`,
    image: BRAND_LOGO,
    logo: BRAND_LOGO,
    url,
    priceRange: BRAND_PRICE_RANGE,
    servesCuisine: siteConfig.servesCuisine,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityDisplay,
      addressRegion: state,
      addressCountry: 'MY',
    },
    areaServed: {
      '@type': 'City',
      name: cityDisplay,
      containedInPlace: { '@type': 'State', name: state, addressCountry: 'MY' },
    },
    parentOrganization: { '@id': `${SITE_URL}#organization` },
  }
}

export function faqPageSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function breadcrumbSchema(
  items: Array<{ name: string; item: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  }
}

export function productSchema(
  locale: string,
  pageUrl: string,
  product: {
    id: string
    name: string
    description?: string | null
    image?: string
    price?: string | null
  },
  cityDisplay?: string,
) {
  const nextYear = new Date().getFullYear() + 1
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${pageUrl}#product-${product.id}`,
    name: product.name,
    description: product.description ?? undefined,
    image: product.image ? [product.image] : undefined,
    brand: { '@type': 'Brand', name: BRAND_NAME },
    category: 'Catering package',
    ...(product.price
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'MYR',
            price: product.price,
            priceValidUntil: `${nextYear}-12-31`,
            availability: 'https://schema.org/InStock',
            seller: { '@id': `${SITE_URL}#organization` },
            ...(cityDisplay
              ? {
                  areaServed: {
                    '@type': 'City',
                    name: cityDisplay,
                    addressCountry: 'MY',
                  },
                }
              : {}),
          },
        }
      : {}),
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
      url: `${SITE_URL}/${locale}/${siteConfig.productSlug}/${it.slug}`,
      name: it.name,
    })),
  }
}

export { LOCATIONS }
