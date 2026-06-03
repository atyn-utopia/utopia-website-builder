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
      ? `${siteConfig.siteUrl}/${locale}/${siteConfig.productSlug}/${locationSlug}`
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
    priceRange: 'RM3.50 - RM12.00 / sqft',
    openingHours: 'Mo-Su 09:00-21:00',
    image: `${siteConfig.siteUrl}/og-image.jpg`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
