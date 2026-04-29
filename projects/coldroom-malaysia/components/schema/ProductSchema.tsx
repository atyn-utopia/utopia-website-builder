import { siteConfig } from '@/config/site';

interface ProductSchemaProps {
  name: string;
  description: string;
  locale: string;
  slug?: string;
  rentalPrice?: string;
  imageUrl?: string;
}

export function ProductSchema({
  name,
  description,
  locale,
  slug,
  rentalPrice = '5',
  imageUrl,
}: ProductSchemaProps) {
  const productUrl = slug
    ? `${siteConfig.siteUrl}/${locale}#${slug}`
    : `${siteConfig.siteUrl}/${locale}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: { '@type': 'Brand', name: siteConfig.brandName },
    url: productUrl,
    image: imageUrl || `${siteConfig.siteUrl}/og-image.jpg`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MYR',
      price: rentalPrice,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      url: productUrl,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: rentalPrice,
        priceCurrency: 'MYR',
        unitCode: 'DAY',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'C62' },
      },
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '256', bestRating: '5' },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
