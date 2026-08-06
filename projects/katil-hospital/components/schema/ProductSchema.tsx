import { siteConfig } from '@/config/site';

export interface ProductOffer {
  name: string;
  description?: string | null;
  image?: string | null;
  rentalPrice?: number | null;
  salePrice?: number | null;
}

export function ProductSchema({ products }: { products: ProductOffer[] }) {
  if (products.length === 0) return null;
  const json = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: siteConfig.productName,
    itemListElement: products.map((p) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: p.name,
        ...(p.description ? { description: p.description } : {}),
        ...(p.image ? { image: p.image } : {}),
      },
      priceCurrency: 'MYR',
      ...(p.rentalPrice != null
        ? { price: String(p.rentalPrice) }
        : p.salePrice != null
          ? { price: String(p.salePrice) }
          : {}),
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${siteConfig.url}#organization` },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
