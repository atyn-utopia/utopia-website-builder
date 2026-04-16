import { site } from '@/config/site'

interface HomeProps {
  locale: string
  faqs: Array<{ q: string; a: string }>
  kind: 'home'
}
interface LocationProps {
  locale: string
  faqs: Array<{ q: string; a: string }>
  kind: 'location'
  locationSlug: string
  cityName: string
}

export function StructuredData(props: HomeProps | LocationProps) {
  const baseUrl = site.siteUrl
  const phone = `+${site.phone}`

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: site.siteName,
    url: baseUrl,
    telephone: phone,
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: site.siteName,
    inLanguage: ['ms-MY', 'en-MY', 'zh-Hans-MY'],
    publisher: { '@id': `${baseUrl}/#organization` },
  }

  const commonLB = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.siteName,
    url: baseUrl,
    telephone: phone,
    priceRange: 'RM',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
      bestRating: '5',
      worstRating: '1',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const scripts: object[] = [organization, website, faqSchema]

  if (props.kind === 'home') {
    scripts.push({
      ...commonLB,
      '@id': `${baseUrl}/#business`,
      address: { '@type': 'PostalAddress', addressCountry: 'MY', addressRegion: 'Kuala Lumpur' },
    })
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: site.siteName, item: `${baseUrl}/${props.locale}` },
      ],
    })
  } else {
    scripts.push({
      ...commonLB,
      '@id': `${baseUrl}/#business-${props.locationSlug}`,
      name: `${site.siteName} — ${props.cityName}`,
      address: { '@type': 'PostalAddress', addressLocality: props.cityName, addressCountry: 'MY' },
      areaServed: { '@type': 'City', name: props.cityName },
    })
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: site.siteName, item: `${baseUrl}/${props.locale}` },
        { '@type': 'ListItem', position: 2, name: 'Cat Rumah', item: `${baseUrl}/${props.locale}` },
        { '@type': 'ListItem', position: 3, name: props.cityName, item: `${baseUrl}/${props.locale}/cat-rumah/${props.locationSlug}` },
      ],
    })
  }

  return (
    <>
      {scripts.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}
