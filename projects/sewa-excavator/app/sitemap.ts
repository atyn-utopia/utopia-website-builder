import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { locations } from '@/config/locations';
import { getBlogPosts } from '@/lib/webcore';

const PRODUCT_SLUG = siteConfig.productSlug;

function alternates(path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
  );
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${siteConfig.url}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: alternates(''),
    });
  }

  for (const locale of routing.locales) {
    for (const loc of locations) {
      const path = `/${PRODUCT_SLUG}/${loc.slug}`;
      entries.push({
        url: `${siteConfig.url}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: alternates(path),
      });
    }
  }

  for (const locale of routing.locales) {
    entries.push({
      url: `${siteConfig.url}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: alternates('/blog'),
    });
  }

  try {
    const posts = await getBlogPosts(routing.defaultLocale);
    for (const post of posts) {
      const path = `/blog/${post.slug}`;
      const lastMod = post.published_at ? new Date(post.published_at) : now;
      for (const locale of routing.locales) {
        entries.push({
          url: `${siteConfig.url}/${locale}${path}`,
          lastModified: lastMod,
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: alternates(path),
        });
      }
    }
  } catch {
    /* ship sitemap without blog if Supabase unreachable at build */
  }

  return entries;
}
