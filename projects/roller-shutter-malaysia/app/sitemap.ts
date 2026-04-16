import type { MetadataRoute } from 'next';
import { locations } from '@/config/locations';
import { siteConfig } from '@/config/site';

const locales = siteConfig.locales;
const baseUrl = `https://${siteConfig.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const languages: Record<string, string> = {};
    for (const loc of locales) {
      languages[loc] = `${baseUrl}/${loc}`;
    }
    languages['x-default'] = `${baseUrl}/ms`;

    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages },
    });
  }

  for (const location of locations) {
    for (const locale of locales) {
      const languages: Record<string, string> = {};
      for (const loc of locales) {
        languages[loc] = `${baseUrl}/${loc}/roller-shutter/${location.slug}`;
      }
      languages['x-default'] = `${baseUrl}/ms/roller-shutter/${location.slug}`;

      entries.push({
        url: `${baseUrl}/${locale}/roller-shutter/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  return entries;
}
