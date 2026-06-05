// projects/skylift-malaysia/components/schema/LocalBusinessSchema.tsx
import { siteConfig } from '@/config/site';

interface LocalBusinessSchemaProps {
  locale: string;
  locationSlug?: string;
  cityName?: string;
  stateName?: string;
}

export function LocalBusinessSchema({
  locale,
  locationSlug,
  cityName,
  stateName,
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: cityName
      ? `${siteConfig.brandName} — ${cityName}`
      : siteConfig.brandName,
    url: locationSlug
      ? `${siteConfig.siteUrl}/${locale}/${siteConfig.productSlug}/${locationSlug}`
      : `${siteConfig.siteUrl}/${locale}`,
    image: `${siteConfig.siteUrl}/brand/hero.png`,
    logo: `${siteConfig.siteUrl}/brand/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
      ...(cityName ? { addressLocality: cityName } : {}),
      ...(stateName ? { addressRegion: stateName } : {}),
    },
    areaServed: cityName
      ? { '@type': 'City', name: cityName }
      : { '@type': 'Country', name: 'Malaysia' },
    priceRange: 'RM500 - RM2000',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
