import { MetadataRoute } from 'next'
import { locations } from '@/config/locations'
import { routing } from '@/i18n/routing'
import { localeAbs } from '@/lib/seoAlternates'

const locales = routing.locales

// localeAbs drops the prefix for the default locale (ms), so every entry is
// the canonical URL — not one that 308-redirects.
const altsFor = (path = '') =>
  Object.fromEntries(locales.map((l) => [l, localeAbs(l, path)]))

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage variants
  for (const locale of locales) {
    entries.push({
      url: localeAbs(locale),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: { languages: altsFor() },
    })
  }

  // Location pages
  for (const location of locations) {
    const path = `/oxygen-machine/${location.slug}`
    for (const locale of locales) {
      entries.push({
        url: localeAbs(locale, path),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: altsFor(path) },
      })
    }
  }

  return entries
}
