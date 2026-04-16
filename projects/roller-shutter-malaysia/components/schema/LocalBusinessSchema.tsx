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
  const baseUrl = `https://${siteConfig.domain}`;
  const displayCity = cityName || 'Malaysia';
  const url = locationSlug
    ? `${baseUrl}/${locale}/roller-shutter/${locationSlug}`
    : `${baseUrl}/${locale}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#localbusiness`,
    name: `${siteConfig.brandName} — ${displayCity}`,
    image: `${baseUrl}/images/roller-shutter-hero.jpg`,
    url: url,
    telephone: `+${siteConfig.fallbackPhone}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: displayCity,
      addressCountry: 'MY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '3.1390',
      longitude: '101.6869',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Malaysia',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
