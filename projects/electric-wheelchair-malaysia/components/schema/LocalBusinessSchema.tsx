import { siteConfig } from '@/config/site';

interface LocalBusinessSchemaProps {
  locale: string;
  locationSlug?: string;
  cityName?: string;
}

export function LocalBusinessSchema({
  locale,
  locationSlug,
  cityName,
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: cityName
      ? `${siteConfig.brandName} — ${cityName}`
      : siteConfig.brandName,
    url: locationSlug
      ? `${siteConfig.siteUrl}/${locale}/electric-wheelchair/${locationSlug}`
      : `${siteConfig.siteUrl}/${locale}`,
    telephone: `+${siteConfig.fallbackPhone}`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
      ...(cityName ? { addressLocality: cityName } : {}),
    },
    areaServed: {
      '@type': 'Country',
      name: 'Malaysia',
    },
    priceRange: 'RM400 - RM3200',
    openingHours: 'Mo-Sa 09:00-18:00',
    image: `${siteConfig.siteUrl}/og-image.jpg`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
