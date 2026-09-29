import type { MetadataRoute } from 'next'
import { locations } from '@/config/locations'
import { routing } from '@/i18n/routing'
import { localeAbs } from '@/lib/seoAlternates'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage for each locale
  for (const locale of routing.locales) {
    entries.push({
      url: localeAbs(locale),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map(l => [l, localeAbs(l)])
        ),
      },
    })
  }

  // Location pages for each locale
  for (const locale of routing.locales) {
    for (const loc of locations) {
      entries.push({
        url: localeAbs(locale, `/service-aircond/${loc.slug}`),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map(l => [l, localeAbs(l, `/service-aircond/${loc.slug}`)])
          ),
        },
      })
    }
  }

  return entries
}
