import { siteConfig } from '@/config/site';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/brand/logo.svg`,
    description: siteConfig.tagline,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${siteConfig.fallbackPhone}`,
      contactType: 'emergency',
      areaServed: 'MY',
      availableLanguage: ['English', 'Malay', 'Chinese'],
      hoursAvailable: 'Mo-Su 00:00-23:59',
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
