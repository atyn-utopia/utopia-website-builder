import { siteConfig } from '@/config/site';
import { localeHref } from '@/lib/localeHref';

export function WebSiteSchema({ locale }: { locale: string }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}#website`,
    url: localeHref(locale),
    name: siteConfig.brandName,
    inLanguage: locale,
    publisher: { '@id': `${siteConfig.url}#organization` },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
