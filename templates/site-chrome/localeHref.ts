import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

/**
 * Canonical locale-URL helpers — the SINGLE source of truth for building SEO URLs.
 *
 * With `localePrefix: 'as-needed'` the default locale is served at `/` with NO
 * prefix, so every canonical / hreflang / sitemap URL must DROP the `/{locale}`
 * segment for the default locale (otherwise it points at a URL that 301-redirects
 * — a muddy SEO signal). NEVER hardcode `` `${base}/${locale}` `` in a page or
 * sitemap; always go through these. The wizard's `seo-locale-url-helper` check
 * fails the build if you do.
 */

const seg = (locale: string) => (locale === routing.defaultLocale ? '' : `/${locale}`);

/** Relative path for a locale ('' default → '/'). For canonical/hreflang (resolved by metadataBase). */
export function localePath(locale: string, path = ''): string {
  return (seg(locale) + path) || '/';
}

/** Absolute locale URL (for sitemap entries). */
export function localeAbs(locale: string, path = ''): string {
  return `https://${siteConfig.domain}` + seg(locale) + path;
}

/**
 * Absolute locale BASE url — `localeAbs(locale)` with no path.
 *
 * Kept because the reference project's pages (and every site scaffolded from an
 * older reference) build SEO URLs as `` `${localeHref(locale)}${path}` ``. The
 * scaffold overwrites lib/localeHref.ts with THIS file, so dropping the export
 * breaks every one of those call sites at typecheck — which it silently did
 * until Aug 2026. Derived from `siteConfig.domain` rather than `.url`/`.siteUrl`
 * because only `domain` is guaranteed present across the fleet.
 */
export function localeHref(locale: string): string {
  return localeAbs(locale);
}

/** Ready-to-spread `{ canonical, languages }` for generateMetadata().alternates (relative). */
export function seoAlternates(locale: string, path = '') {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localePath(l, path);
  languages['x-default'] = localePath(routing.defaultLocale, path);
  return { canonical: localePath(locale, path), languages };
}
