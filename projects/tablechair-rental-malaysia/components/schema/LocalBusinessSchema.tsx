import { siteConfig } from '@/config/site'

interface LocalBusinessSchemaProps {
  locale: string
  locationSlug?: string
  cityName?: string
}

export function LocalBusinessSchema({
  locale,
  locationSlug,
  cityName,
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: cityName ? `${siteConfig.brandName} — ${cityName}` : siteConfig.brandName,
    url: locationSlug
      ? `${siteConfig.url}/${locale}/${siteConfig.productSlug}/${locationSlug}`
      : `${siteConfig.url}/${locale}`,
    telephone: `+${siteConfig.fallbackPhone}`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
      ...(cityName ? { addressLocality: cityName } : {}),
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    priceRange: siteConfig.priceRange,
    openingHours: 'Mo-Su 08:00-22:00',
    // /og-image.jpg never existed in public/. The per-locale share cards do,
    // and this component already receives the locale.
    image: `${siteConfig.url}/og-${locale}.png`,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
