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
        price: '80',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Aircond Service (1 HP)',
        url: `${siteConfig.siteUrl}/${locale}`,
      },
      {
        '@type': 'Offer',
        priceCurrency: 'MYR',
        price: '250',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Chemical Wash',
        url: `${siteConfig.siteUrl}/${locale}`,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '186',
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
