import { siteConfig } from '@/config/site';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${siteConfig.fallbackPhone}`,
      contactType: 'sales',
      areaServed: 'MY',
      availableLanguage: ['English', 'Malay', 'Chinese'],
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
