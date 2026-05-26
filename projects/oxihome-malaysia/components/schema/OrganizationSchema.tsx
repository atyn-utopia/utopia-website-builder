export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Oxihome Malaysia',
    url: 'https://oxihome.my',
    logo: 'https://oxihome.my/logo.svg',
    description: "Malaysia's dedicated home oxygen equipment provider. Rent or buy oxygen machines with 4-hour same-day delivery across 127 locations.",
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Malay', 'Chinese'],
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
