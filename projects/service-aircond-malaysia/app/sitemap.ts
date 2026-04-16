import type { MetadataRoute } from 'next'
import { locations } from '@/config/locations'
import { siteConfig } from '@/config/site'
import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage for each locale
  for (const locale of routing.locales) {
    entries.push({
      url: `${siteConfig.baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map(l => [l, `${siteConfig.baseUrl}/${l}`])
        ),
      },
    })
  }

  // Location pages for each locale
  for (const locale of routing.locales) {
    for (const loc of locations) {
      entries.push({
        url: `${siteConfig.baseUrl}/${locale}/service-aircond/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map(l => [l, `${siteConfig.baseUrl}/${l}/service-aircond/${loc.slug}`])
          ),
        },
      })
    }
  }

  return entries
}
