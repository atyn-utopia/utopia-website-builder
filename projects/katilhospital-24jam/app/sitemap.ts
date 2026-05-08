import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';
import { locales } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

const FEATURED = new Set([
  'kuala-lumpur',
  'petaling-jaya',
  'shah-alam',
  'subang-jaya',
  'johor-bahru',
  'klang',
  'george-town',
  'ipoh',
  'kuantan',
  'kota-kinabalu',
  'kuching',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;
  const entries: MetadataRoute.Sitemap = [];

  // Homepages
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: locale === 'ms' ? 1.0 : 0.9,
    });
  }

  // Location pages (159 × 3)
  for (const locale of locales) {
    for (const loc of locations) {
      entries.push({
        url: `${baseUrl}/${locale}/katil-hospital/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: FEATURED.has(loc.slug) ? 0.8 : 0.7,
      });
    }
  }

  // Blog listing
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  // Blog posts
  try {
    const { getBlogPosts } = await import('@/lib/webcore');
    const posts = await getBlogPosts('ms');
    for (const locale of locales) {
      for (const post of posts) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.published_at ? new Date(post.published_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // Blog fetch failed at build time — skip; sitemap repopulates at next ISR tick.
  }

  return entries;
}
