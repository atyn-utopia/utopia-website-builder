import { siteConfig } from '@/config/site';

/**
 * MedicalBusiness (a subtype of LocalBusiness) — the static page used the same
 * type, which is the right one for a medical-equipment supplier.
 */
export function OrganizationSchema() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.brandName,
    url: siteConfig.url,
    description:
      'Pembekal katil hospital di Malaysia sejak 2016. Sewa dari RM139/bulan, 5 showroom, penghantaran 2 jam, jaminan beli balik 50%.',
    foundingDate: '2016',
    areaServed: 'Malaysia',
    priceRange: 'RM139-RM4999',
    logo: `${siteConfig.url}/icon.svg`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1247',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
