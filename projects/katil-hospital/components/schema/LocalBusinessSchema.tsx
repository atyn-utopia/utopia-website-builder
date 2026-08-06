import { siteConfig } from '@/config/site';
import { localeHref } from '@/lib/localeHref';

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
    '@type': 'MedicalBusiness',
    name: `${siteConfig.brandName} — ${locationName}`,
    url: `${localeHref(locale)}/${siteConfig.productSlug}/${locationSlug}`,
    priceRange: 'RM139-RM4999',
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
