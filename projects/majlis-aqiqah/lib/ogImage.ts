import { siteConfig } from '@/config/site';

/**
 * Social preview image descriptor for `generateMetadata().openGraph.images`.
 *
 * Every page must ship one — WhatsApp/Facebook shares of a page with no
 * og:image render as a bare grey card, which matters a lot for a site whose
 * entire funnel is WhatsApp shares. Pass a page-specific image (e.g. a blog
 * cover) to override the site default.
 */
export function ogImage(alt: string, url?: string | null) {
  if (url) return { url, alt };
  return {
    url: siteConfig.ogImage,
    width: siteConfig.ogImageWidth,
    height: siteConfig.ogImageHeight,
    alt,
  };
}
