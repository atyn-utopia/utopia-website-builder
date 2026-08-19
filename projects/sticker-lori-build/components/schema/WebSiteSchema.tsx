import { siteConfig } from '@/config/site';

export function WebSiteSchema({ locale }: { locale: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.brandName,
    url: `${siteConfig.url}/${locale}`,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: siteConfig.brandName },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
