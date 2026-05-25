import { siteConfig } from '@/config/site'

interface ProductSchemaProps {
  name: string
  description: string
  locale: string
}

export function ProductSchema({ name, description, locale }: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@type': 'LocalBusiness', name: siteConfig.brandName },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    url: `${siteConfig.url}/${locale}`,
    image: `${siteConfig.url}/og-image.jpg`,
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'MYR',
        price: '3.60',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Chair Rental (per unit)',
        url: `${siteConfig.url}/${locale}`,
      },
      {
        '@type': 'Offer',
        priceCurrency: 'MYR',
        price: '15.00',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Round Table Rental (per unit)',
        url: `${siteConfig.url}/${locale}`,
      },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '210', bestRating: '5' },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
