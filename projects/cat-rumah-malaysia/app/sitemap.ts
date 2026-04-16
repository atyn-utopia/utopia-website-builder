import { MetadataRoute } from 'next'
import { locations } from '@/config/locations'
import { locales } from '@/i18n/routing'

const baseUrl = 'https://cat-rumah-malaysia.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: locale === 'ms' ? 1.0 : 0.9,
      alternates: {
        languages: {
          ms: `${baseUrl}/ms`,
          en: `${baseUrl}/en`,
          zh: `${baseUrl}/zh`,
          'x-default': `${baseUrl}/ms`,
        },
      },
    })
  }

  for (const locale of locales) {
    for (const location of locations) {
      entries.push({
        url: `${baseUrl}/${locale}/cat-rumah/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: locale === 'ms' ? 0.8 : 0.7,
        alternates: {
          languages: {
            ms: `${baseUrl}/ms/cat-rumah/${location.slug}`,
            en: `${baseUrl}/en/cat-rumah/${location.slug}`,
            zh: `${baseUrl}/zh/cat-rumah/${location.slug}`,
            'x-default': `${baseUrl}/ms/cat-rumah/${location.slug}`,
          },
        },
      })
    }
  }

  return entries
}
