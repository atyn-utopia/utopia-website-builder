import { siteConfig } from '@/config/site';

/**
 * Social share card — a 1200x630 screenshot of the hero section, one per locale
 * (`public/og-{locale}.png`). Regenerate with `node scripts/og-shot.mjs` after
 * any hero copy / image / palette change, or the card silently goes stale.
 * Relative URLs resolve against the `metadataBase` set in
 * app/[locale]/layout.tsx.
 *
 * Next.js replaces a parent's `openGraph` object wholesale when a page defines
 * its own, so every page that sets `openGraph` must spread this in explicitly —
 * inheriting it from the layout does NOT work.
 */
export function ogImage(locale: string) {
  const known = (siteConfig.locales as readonly string[]).includes(locale);
  return {
    url: `/og-${known ? locale : siteConfig.defaultLocale}.png`,
    width: 1200,
    height: 630,
    alt: siteConfig.tagline,
  };
}

/** Ready-to-spread `images` array for `openGraph` / `twitter`. */
export function ogImages(locale: string) {
  return [ogImage(locale)];
}
