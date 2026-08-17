import { siteConfig } from '@/config/site';

const absolute = (url: string) =>
  url.startsWith('http') ? url : `${siteConfig.url}${url}`;

export function ProductSchema({
  name,
  slug,
  description,
  price,
  image,
  areaServed,
}: {
  name: string;
  slug: string;
  description: string | null;
  // Aqiqah packages are sold outright, so this is the sale price (products.sale_price).
  price: number | null;
  image: string | null;
  areaServed?: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    sku: slug,
    description: description ?? `${name} — pakej aqiqah lengkap di seluruh Malaysia.`,
    brand: { '@type': 'Brand', name: siteConfig.brandName },
    // JSON-LD image must be an absolute URL. Supabase photo URLs already are;
    // the local `/products/…` fallbacks are not, so absolutise them.
    image: absolute(image ?? siteConfig.ogImage),
    offers: {
      '@type': 'Offer',
      price: price ?? undefined,
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
