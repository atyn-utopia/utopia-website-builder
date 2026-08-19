import { siteConfig } from '@/config/site';

export function ProductSchema({
  name,
  slug,
  description,
  rentalPrice,
  image,
  areaServed,
}: {
  name: string;
  slug: string;
  description: string | null;
  rentalPrice: number | null;
  image: string | null;
  areaServed?: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    sku: slug,
    description: description ?? `${name} rental in Malaysia.`,
    brand: { '@type': 'Brand', name: 'Volvo' },
    manufacturer: { '@type': 'Organization', name: 'Volvo Construction Equipment' },
    image: image ?? `${siteConfig.url}/og-ms.png`,
    offers: {
      '@type': 'Offer',
      price: rentalPrice ?? undefined,
      priceCurrency: 'MYR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: siteConfig.brandName },
    },
  };
  if (areaServed) data.areaServed = { '@type': 'City', name: areaServed };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
