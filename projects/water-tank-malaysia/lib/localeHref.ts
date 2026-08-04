import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

/**
 * Locale-aware base URL. With localePrefix: 'as-needed' the default locale has
 * NO path prefix (served at /), so its canonical/sitemap/hreflang URLs must omit
 * the /{locale} segment. Non-default locales keep their prefix.
 *   localeHref('ms')        → https://site.my          (default — no prefix)
 *   localeHref('en')        → https://site.my/en
 *   `${localeHref('ms')}${path}` → https://site.my${path}
 */
export function localeHref(locale: string): string {
  return locale === routing.defaultLocale ? siteConfig.url : `${siteConfig.url}/${locale}`;
}
