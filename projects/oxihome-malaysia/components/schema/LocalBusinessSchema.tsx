import { siteConfig } from '@/config/site';

export function LocalBusinessSchema({
  locale,
  locationName,
  locationSlug,
  state,
}: {
  locale: string;
  locationName: string;
  locationSlug: string;
  state: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: `${siteConfig.brandName} — ${locationName}`,
    url: `${siteConfig.url}/${locale}/${siteConfig.productSlug}/${locationSlug}`,
    priceRange: 'RM$$',
    areaServed: { '@type': 'City', name: locationName },
    address: {
      '@type': 'PostalAddress',
      addressLocality: locationName,
      addressRegion: state,
      addressCountry: 'MY',
    },
    parentOrganization: { '@type': 'Organization', name: siteConfig.legalName },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
