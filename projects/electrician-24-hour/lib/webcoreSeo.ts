// Per-page SEO overrides from webcore.
//
// Webcore's SEO page lets an editor set a page's meta title, description and
// share image without touching this repo. A row is keyed by the page's public
// path — `/`, `/ms`, `/electrician-service/ampang`, `/zh/blog/x` — plus its
// language. A page with no row keeps the metadata it builds itself.
//
// Read through webcore's public API: the table sits behind RLS, so the anon
// PostgREST reads in lib/webcore.ts see no rows. The fetch is tagged
// `webcore-seo`, which /api/revalidate flushes when an override is saved.

import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'

const WEBCORE_PUBLIC_BASE = 'https://webcore.utopiaai.my'
// A hung webcore must not hang a build or a revalidation render.
const TIMEOUT_MS = 6000

interface Override {
  title: string | null
  description: string | null
  og_image: string | null
  language: string | null
}

const publicPath = (locale: string, path: string) =>
  ((locale === routing.defaultLocale ? '' : `/${locale}`) + path) || '/'

async function fetchOverride(locale: string, path: string): Promise<Override | null> {
  const url = new URL(`${WEBCORE_PUBLIC_BASE}/api/public/seo`)
  url.searchParams.set('website', siteConfig.domain)
  url.searchParams.set('path', publicPath(locale, path))
  url.searchParams.set('lang', locale)
  // Webcore's CDN keeps this GET for 5 minutes, so the render that follows a
  // purge would otherwise read the pre-edit row. A page asks once per render,
  // so a unique URL costs nothing; the tag still binds the page to the purge.
  url.searchParams.set('_', Date.now().toString(36))
  try {
    const res = await Promise.race([
      fetch(url, { cache: 'force-cache', next: { tags: ['webcore-seo'] } }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('webcore timeout')), TIMEOUT_MS)),
    ])
    if (!res.ok) return null
    const row = (await res.json()) as Override
    // The API falls back to English; a Malay page must never take an English title.
    return row.language === locale ? row : null
  } catch {
    return null
  }
}

// Layer the webcore override for this page over the metadata the page built.
// Only fields the override sets are replaced, and Open Graph follows so a
// shared link says the same thing as the search result.
export async function withSeoOverride(locale: string, path: string, meta: Metadata): Promise<Metadata> {
  const o = await fetchOverride(locale, path)
  if (!o) return meta

  const merged: Metadata = { ...meta }
  const og = { ...(meta.openGraph ?? {}) } as NonNullable<Metadata['openGraph']>
  if (o.title) {
    merged.title = { absolute: o.title }
    og.title = o.title
  }
  if (o.description) {
    merged.description = o.description
    og.description = o.description
  }
  if (o.og_image) {
    og.images = [o.og_image]
    merged.twitter = { ...(meta.twitter ?? {}), images: [o.og_image] } as Metadata['twitter']
  }
  if (meta.openGraph || o.og_image) merged.openGraph = og
  return merged
}
