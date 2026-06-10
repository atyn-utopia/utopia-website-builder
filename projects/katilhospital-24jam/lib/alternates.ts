import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

/**
 * Build canonical + hreflang alternates for every indexable page.
 * `path` is the canonical path WITHOUT the locale prefix ('' = homepage).
 * The default locale is served at / (localePrefix: 'as-needed'), so it gets NO
 * /{locale} segment — canonical/hreflang point at the un-prefixed URL.
 */
export function buildAlternates(path: string, locale: string) {
  const base = siteConfig.siteUrl;
  const href = (l: string) => `${base}${l === routing.defaultLocale ? '' : `/${l}`}${path}`;
  return {
    canonical: href(locale),
    languages: {
      'ms-MY': href('ms'),
      'en-MY': href('en'),
      'zh-CN': href('zh'),
      'x-default': href(routing.defaultLocale),
    },
  };
}
