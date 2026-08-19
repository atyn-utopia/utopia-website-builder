import { siteConfig } from '@/config/site'

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    // /logo.png never existed. The real wordmark is public/kak-kenduri-logo.png.
    logo: `${siteConfig.url}/kak-kenduri-logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${siteConfig.fallbackPhone}`,
      contactType: 'sales',
      areaServed: 'MY',
      availableLanguage: ['English', 'Malay', 'Chinese'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressCountry: 'MY',
    },
    sameAs: [],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
