import { siteConfig } from '@/config/site';

interface MedicalBusinessSchemaProps {
  locale: string;
  cityName?: string;
  locationSlug?: string;
}

export function MedicalBusinessSchema({
  locale,
  cityName,
  locationSlug,
}: MedicalBusinessSchemaProps) {
  const url = locationSlug
    ? `${siteConfig.siteUrl}/${locale}/katil-hospital/${locationSlug}`
    : `${siteConfig.siteUrl}/${locale}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: cityName ? `${siteConfig.brandName} — ${cityName}` : siteConfig.brandName,
    image: `${siteConfig.siteUrl}/brand/hero/hero.jpg`,
    url,
    areaServed: cityName
      ? { '@type': 'City', name: cityName }
      : { '@type': 'Country', name: 'Malaysia' },
    priceRange: 'RM',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    potentialAction: {
      '@type': 'CommunicateAction',
      target: `${siteConfig.siteUrl}/${locale}/redirect-whatsapp-1`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
