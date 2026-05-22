import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import { locations } from '@/config/locations'
import { getBlogPostSlugs } from '@/lib/webcore'

const SITE_URL = siteConfig.url
const PRODUCT_SLUG = siteConfig.productSlug

export const revalidate = 86400

function buildLanguages(pathSuffix: string) {
  const languages: Record<string, string> = {
    'ms-MY': `${SITE_URL}/ms${pathSuffix}`,
    'en-MY': `${SITE_URL}/en${pathSuffix}`,
    'zh-Hans-MY': `${SITE_URL}/zh${pathSuffix}`,
    'x-default': `${SITE_URL}/ms${pathSuffix}`,
  }
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: buildLanguages('') },
    })
  }

  for (const locale of routing.locales) {
    for (const loc of locations) {
      const suffix = `/${PRODUCT_SLUG}/${loc.slug}`
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: { languages: buildLanguages('/blog') },
    })
  }

  const slugs = await getBlogPostSlugs()
  for (const locale of routing.locales) {
    for (const { slug } of slugs) {
      const suffix = `/blog/${slug}`
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  return entries
}
