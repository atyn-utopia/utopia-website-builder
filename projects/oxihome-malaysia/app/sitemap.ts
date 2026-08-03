import { MetadataRoute } from 'next'
import { locations } from '@/config/locations'

const BASE_URL = 'https://oksigen.com.my'
const locales = ['en', 'ms', 'zh'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage variants
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          ms: `${BASE_URL}/ms`,
          zh: `${BASE_URL}/zh`,
        },
      },
    })
  }

  // Location pages
  for (const location of locations) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/oxygen-machine/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/oxygen-machine/${location.slug}`,
            ms: `${BASE_URL}/ms/oxygen-machine/${location.slug}`,
            zh: `${BASE_URL}/zh/oxygen-machine/${location.slug}`,
          },
        },
      })
    }
  }

  return entries
}
