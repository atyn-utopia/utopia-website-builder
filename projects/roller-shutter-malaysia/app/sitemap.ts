import type { MetadataRoute } from 'next';
import { locations } from '@/config/locations';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localeAbs } from '@/lib/seoAlternates';

const locales = siteConfig.locales;

// Every URL goes through localeAbs(): the default locale (ms) is served without
// a prefix, so a `/ms/...` entry would list a redirect instead of the page.
function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = localeAbs(loc, path);
  }
  languages['x-default'] = localeAbs(routing.defaultLocale, path);
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: localeAbs(locale),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: languagesFor('') },
    });
  }

  for (const location of locations) {
    const path = `/roller-shutter/${location.slug}`;
    for (const locale of locales) {
      entries.push({
        url: localeAbs(locale, path),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: languagesFor(path) },
      });
    }
  }

  return entries;
}
