import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';
import { locales } from '@/i18n/routing';
import { localeAbs } from '@/lib/seoAlternates';

export const dynamic = 'force-dynamic';

// URLs come from localeAbs(): with localePrefix 'as-needed' English lives at
// `/…` with no prefix, and `/en/…` only redirects there.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: localeAbs(locale),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    });
  }

  // Location pages for each locale
  for (const locale of locales) {
    for (const loc of locations) {
      entries.push({
        url: localeAbs(locale, `/${siteConfig.productSlug}/${loc.slug}`),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  // Blog listing for each locale
  for (const locale of locales) {
    entries.push({
      url: localeAbs(locale, '/blog'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Blog posts - fetch dynamically at runtime
  try {
    const { getBlogPosts } = await import('@/lib/webcore');
    const posts = await getBlogPosts('en');
    for (const locale of locales) {
      for (const post of posts) {
        entries.push({
          url: localeAbs(locale, `/blog/${post.slug}`),
          lastModified: post.published_at ? new Date(post.published_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // Blog fetch failed at build time — skip, will populate at runtime
  }

  return entries;
}
