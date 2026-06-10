import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

const rel = (locale: string, path: string) =>
  ((locale === routing.defaultLocale ? '' : `/${locale}`) + path) || '/';

/** { canonical, languages } with the default locale UN-prefixed (as-needed). Relative — resolved by metadataBase. */
export function seoAlternates(locale: string, path = '') {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = rel(l, path);
  languages['x-default'] = rel(routing.defaultLocale, path);
  return { canonical: rel(locale, path), languages };
}

/** Absolute locale URL for sitemaps (default locale un-prefixed). */
export function localeAbs(locale: string, path = ''): string {
  return `https://${siteConfig.domain}` + (locale === routing.defaultLocale ? '' : `/${locale}`) + path;
}
