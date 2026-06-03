import { siteConfig } from '@/config/site';

/**
 * Build canonical + hreflang alternates for every indexable page.
 * `path` is the canonical path WITHOUT the locale prefix.
 * Empty string `''` = homepage.
 */
export function buildAlternates(path: string, locale: string) {
  const base = siteConfig.siteUrl;
  return {
    canonical: `${base}/${locale}${path}`,
    languages: {
      'ms-MY': `${base}/ms${path}`,
      'en-MY': `${base}/en${path}`,
      'zh-CN': `${base}/zh${path}`,
      'x-default': `${base}/ms${path}`,
    },
  };
}
