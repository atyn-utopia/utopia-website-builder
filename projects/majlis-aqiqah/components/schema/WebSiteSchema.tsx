import { siteConfig } from '@/config/site';
import { localeAbs } from '@/lib/localeHref';

export function WebSiteSchema({ locale }: { locale: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.brandName,
    // localeAbs, not `${url}/${locale}` — the default locale is served
    // un-prefixed, so a hardcoded /ms would point at a 301.
    url: localeAbs(locale),
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
