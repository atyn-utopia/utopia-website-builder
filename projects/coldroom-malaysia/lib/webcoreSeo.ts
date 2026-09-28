// Per-page SEO overrides from webcore (`webcore.seo_overrides`).
//
// Webcore's SEO page lets an editor set a page's meta title, description and
// share image without touching this repo. Rows are keyed by the page's public
// path — `/` for the English homepage, `/ms/cold-room/ampang` for a Malay
// location page — plus the language. A page with no row keeps the metadata it
// builds itself.
//
// All rows for the site come back in one fetch tagged `webcore-seo`, so
// webcore's ping to /api/revalidate refreshes them without a redeploy.

import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import { webcoreFetch } from '@/lib/webcore'

type Override = {
  path: string
  language: string
  title: string | null
  description: string | null
  og_image: string | null
}

async function getOverrides(): Promise<Override[]> {
  const rows = await webcoreFetch<Override[]>(
    `seo_overrides?select=path,language,title,description,og_image&website=eq.${encodeURIComponent(siteConfig.domain)}&is_pattern=eq.false`,
    'webcore-seo',
    { service: true },
  )
  return rows ?? []
}

/** The page's public path, as the sitemap and canonical tags write it. */
function publicPath(locale: string, path: string): string {
  return ((locale === routing.defaultLocale ? '' : `/${locale}`) + path) || '/'
}

/**
 * Layer the webcore override for this page over the metadata the page built.
 * Only fields the override actually sets are replaced, and the Open Graph and
 * Twitter copy follow so a shared link says the same thing as the search result.
 */
export async function withSeoOverride(locale: string, path: string, meta: Metadata): Promise<Metadata> {
  const key = publicPath(locale, path)
  const o = (await getOverrides()).find((r) => r.path === key && r.language === locale)
  if (!o) return meta

  const merged: Metadata = { ...meta }
  const og = { ...(meta.openGraph ?? {}) } as NonNullable<Metadata['openGraph']>
  const tw = { ...(meta.twitter ?? {}) } as NonNullable<Metadata['twitter']>
  if (o.title) {
    merged.title = { absolute: o.title }
    og.title = o.title
    if (meta.twitter) tw.title = o.title
  }
  if (o.description) {
    merged.description = o.description
    og.description = o.description
    if (meta.twitter) tw.description = o.description
  }
  if (o.og_image) {
    og.images = [o.og_image]
    tw.images = [o.og_image]
  }
  if (meta.openGraph || o.og_image) merged.openGraph = og
  if (meta.twitter || o.og_image) merged.twitter = tw
  return merged
}
