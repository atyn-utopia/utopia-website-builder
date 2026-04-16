import { siteConfig } from '@/config/site';

interface ProductSchemaProps {
  name: string;
  description: string;
  locale: string;
}

export function ProductSchema({ name, description, locale }: ProductSchemaProps) {
  const baseUrl = `https://${siteConfig.domain}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    brand: {
      '@type': 'Brand',
      name: siteConfig.brandName,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MYR',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/${locale}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
