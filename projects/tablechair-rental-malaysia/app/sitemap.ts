import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import { localeHref } from '@/lib/localeHref'
import { LOCATIONS } from '@/config/locations'

const PRODUCT_SLUG = siteConfig.productSlug

// `localeHref` already drops the prefix for the default locale, so no emitted
// URL is one of the redirecting forms (`/en/...` 307s to the unprefixed path).
// Sitemap URLs that redirect get reported as "Page with redirect" in Search
// Console instead of being indexed.
function localeUrl(locale: string, pathSuffix: string) {
  return `${localeHref(locale)}${pathSuffix}`
}

function buildLanguages(pathSuffix: string) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = localeUrl(l, pathSuffix)
  }
  languages['x-default'] = localeUrl(routing.defaultLocale, pathSuffix)
  return languages
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: localeUrl(locale, ''),
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
        url: localeUrl(locale, suffix),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: locale === 'en' ? 0.8 : 0.7,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  return entries
}
