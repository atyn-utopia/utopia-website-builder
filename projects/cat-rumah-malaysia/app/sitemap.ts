import { MetadataRoute } from 'next'
import { locations } from '@/config/locations'
import { routing } from '@/i18n/routing'
import { localeAbs } from '@/lib/seoAlternates'

const langs = (path = '') => {
  const m: Record<string, string> = {}
  for (const l of routing.locales) m[l] = localeAbs(l, path)
  m['x-default'] = localeAbs(routing.defaultLocale, path)
  return m
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: localeAbs(locale),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: locale === routing.defaultLocale ? 1.0 : 0.9,
      alternates: { languages: langs() },
    })
  }

  for (const locale of routing.locales) {
    for (const location of locations) {
      const path = `/cat-rumah/${location.slug}`
      entries.push({
        url: localeAbs(locale, path),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: locale === routing.defaultLocale ? 0.8 : 0.7,
        alternates: { languages: langs(path) },
      })
    }
  }

  return entries
}
