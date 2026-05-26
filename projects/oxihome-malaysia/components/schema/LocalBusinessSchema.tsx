interface Props {
  cityName: string
  stateName: string
  locationSlug: string
  locale: string
  phoneNumber: string
}

export function LocalBusinessSchema({ cityName, stateName, locationSlug, locale, phoneNumber }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: `Oxihome Malaysia - ${cityName}`,
    url: `https://oxihome.my/${locale}/oxygen-machine/${locationSlug}`,
    description: `Oxygen machine rental and sales in ${cityName}, Malaysia. 4-hour same-day delivery. Rent from RM250/month.`,
    telephone: phoneNumber,
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: { '@type': 'State', name: stateName },
    },
    priceRange: 'RM40 - RM2,599',
    currenciesAccepted: 'MYR',
    openingHours: 'Mo-Su 08:00-22:00',
    parentOrganization: {
      '@type': 'Organization',
      name: 'Oxihome Malaysia',
      url: 'https://oxihome.my',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
