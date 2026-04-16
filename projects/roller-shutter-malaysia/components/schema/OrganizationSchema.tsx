import { siteConfig } from '@/config/site';

export function OrganizationSchema() {
  const baseUrl = `https://${siteConfig.domain}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${siteConfig.fallbackPhone}`,
      contactType: 'customer service',
      areaServed: 'MY',
      availableLanguage: ['Malay', 'English', 'Chinese'],
    },
    sameAs: [
      'https://www.facebook.com/rollershutterdoormy',
      'https://www.instagram.com/rollershutterdoormy',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
