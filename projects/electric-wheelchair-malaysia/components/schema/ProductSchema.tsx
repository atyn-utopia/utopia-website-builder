import { siteConfig } from '@/config/site';

interface ProductSchemaProps {
  name: string;
  description: string;
  locale: string;
}

export function ProductSchema({ name, description, locale }: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: siteConfig.brandName,
    },
    url: `${siteConfig.siteUrl}/${locale}`,
    image: `${siteConfig.siteUrl}/og-image.jpg`,
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'MYR',
        price: '400',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Monthly Rental',
        url: `${siteConfig.siteUrl}/${locale}`,
      },
      {
        '@type': 'Offer',
        priceCurrency: 'MYR',
        price: '2400',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Purchase',
        url: `${siteConfig.siteUrl}/${locale}`,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '230',
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
