import { siteConfig } from '@/config/site';

interface ProductSchemaProps {
  name: string;
  description?: string | null;
  locale: string;
  slug?: string;
  image?: string | string[];
  salePrice?: number | null;
  rentalPrice?: number | null;
}

export function ProductSchema({
  name,
  description,
  locale,
  slug,
  image,
  salePrice,
  rentalPrice,
}: ProductSchemaProps) {
  const images = image
    ? Array.isArray(image)
      ? image
      : [image]
    : [`${siteConfig.siteUrl}/brand/hero/hero.jpg`];

  const hasPriceRange =
    typeof salePrice === 'number' && typeof rentalPrice === 'number';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description ? { description } : {}),
    brand: {
      '@type': 'Brand',
      name: siteConfig.brandName,
    },
    url: slug
      ? `${siteConfig.siteUrl}/${locale}#product-${slug}`
      : `${siteConfig.siteUrl}/${locale}`,
    image: images,
    offers: hasPriceRange
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'MYR',
          lowPrice: String(rentalPrice),
          highPrice: String(salePrice),
          availability: 'https://schema.org/InStock',
          url: `${siteConfig.siteUrl}/${locale}/redirect-whatsapp-1`,
        }
      : {
          '@type': 'Offer',
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
          url: `${siteConfig.siteUrl}/${locale}/redirect-whatsapp-1`,
        },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
