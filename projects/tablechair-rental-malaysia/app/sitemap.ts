import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { LOCATIONS } from '@/config/locations'

const SITE_URL = 'https://tablechair-rental-malaysia.vercel.app'
const PRODUCT_SLUG = 'table-chair-rental'


function buildLanguages(pathSuffix: string) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${pathSuffix}`
  }
  languages['x-default'] = `${SITE_URL}/en${pathSuffix}`
  return languages
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: locale === 'en' ? 1.0 : 0.9,
      alternates: { languages: buildLanguages('') },
    })
  }

  for (const locale of routing.locales) {
    for (const loc of LOCATIONS) {
      const suffix = `/${PRODUCT_SLUG}/${loc.slug}`
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: locale === 'en' ? 0.8 : 0.7,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  return entries
}
