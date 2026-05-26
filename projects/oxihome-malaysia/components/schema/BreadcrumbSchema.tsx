interface Props {
  locale: string
  cityName: string
  locationSlug: string
}

export function BreadcrumbSchema({ locale, cityName, locationSlug }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://oxihome.my/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `Oxygen Machine in ${cityName}`,
        item: `https://oxihome.my/${locale}/oxygen-machine/${locationSlug}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
