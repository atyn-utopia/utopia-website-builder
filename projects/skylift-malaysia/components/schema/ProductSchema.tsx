// projects/skylift-malaysia/components/schema/ProductSchema.tsx
import { siteConfig } from '@/config/site';

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string;
  rentalPrice?: number | null;
  locale: string;
  slug?: string;
}

export function ProductSchema({
  name,
  description,
  image,
  rentalPrice,
  locale,
  slug,
}: ProductSchemaProps) {
  const productUrl = slug
    ? `${siteConfig.siteUrl}/${locale}#${slug}`
    : `${siteConfig.siteUrl}/${locale}`;

  const offers =
    rentalPrice && rentalPrice > 0
      ? [
          {
            '@type': 'Offer',
            priceCurrency: 'MYR',
            price: String(rentalPrice),
            priceValidUntil: '2027-12-31',
            availability: 'https://schema.org/InStock',
            name: 'Daily Rental',
            url: productUrl,
          },
        ]
      : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: siteConfig.brandName,
    },
    url: productUrl,
    image: image || `${siteConfig.siteUrl}/og-image.jpg`,
    ...(offers.length ? { offers } : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '80',
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
