import { siteConfig } from '@/config/site';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/icon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${siteConfig.fallbackPhone}`,
      contactType: 'sales',
      areaServed: 'MY',
      availableLanguage: ['Malay', 'English', 'Chinese'],
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
