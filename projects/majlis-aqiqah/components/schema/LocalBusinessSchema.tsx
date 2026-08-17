import { siteConfig } from '@/config/site';
import { localeAbs } from '@/lib/localeHref';

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
    // Aqiqah is a livestock + catering service, not a construction trade.
    '@type': 'LocalBusiness',
    name: `${siteConfig.brandName} — ${locationName}`,
    url: localeAbs(locale, `/${siteConfig.productSlug}/${locationSlug}`),
    image: `${siteConfig.url}${siteConfig.ogImage}`,
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
