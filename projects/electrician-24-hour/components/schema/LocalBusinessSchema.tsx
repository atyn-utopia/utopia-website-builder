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
    '@type': 'Electrician',
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
    priceRange: 'RM60 - RM2500',
    openingHours: 'Mo-Su 00:00-23:59',
    image: `${siteConfig.siteUrl}/brand/hero.jpg`,
    logo: `${siteConfig.siteUrl}/brand/logo.svg`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
