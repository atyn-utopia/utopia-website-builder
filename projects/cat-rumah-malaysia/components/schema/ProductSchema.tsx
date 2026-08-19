import { siteConfig } from '@/config/site';

interface ProductSchemaProps {
  name: string;
  description: string;
  locale: string;
}

export function ProductSchema({ name, description, locale }: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'LocalBusiness',
      name: siteConfig.brandName,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Malaysia',
    },
    url: `${siteConfig.siteUrl}/${locale}`,
    image: `${siteConfig.siteUrl}/og-${locale}.png`,
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'MYR',
        price: '3.50',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Cat Dinding Dalaman (per sqft)',
        url: `${siteConfig.siteUrl}/${locale}`,
      },
      {
        '@type': 'Offer',
        priceCurrency: 'MYR',
        price: '4.50',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Cat Dinding Luar (per sqft)',
        url: `${siteConfig.siteUrl}/${locale}`,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
      bestRating: '5',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
