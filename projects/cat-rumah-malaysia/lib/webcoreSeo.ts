// Per-page SEO overrides from webcore's SEO page.
//
// An editor can set a page's meta title, description and share image in
// webcore without touching this repo. Each override is keyed by the page's
// public path — `/` and `/cat-rumah/shah-alam` for Malay (the default locale,
// unprefixed), `/en/...` and `/zh/...` for the others — plus its language.
// A page with no override keeps the metadata it builds itself.

import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'

// webcore's own public API. The old webcore.utopiaai.my host 307s here.
const WEBCORE_BASE = 'https://webcore.utopiagroup.com.my'
// A hung webcore must not hang a build or a revalidation render.
const TIMEOUT_MS = 6000

type Override = {
  title: string | null
  description: string | null
  og_image: string | null
  language: string | null
}

/** Public path of a page, as webcore keys it (default locale unprefixed). */
function publicPath(locale: string, path: string): string {
  return ((locale === routing.defaultLocale ? '' : `/${locale}`) + path) || '/'
}

// Asks webcore for one page's override. Throws when webcore cannot answer, so
// a timeout is never cached as "no override".
async function fetchOverride(locale: string, path: string): Promise<Override | null> {
  const url = new URL(`${WEBCORE_BASE}/api/public/seo`)
  url.searchParams.set('website', siteConfig.domain)
  url.searchParams.set('path', publicPath(locale, path))
  url.searchParams.set('lang', locale)
  // webcore's CDN keeps this GET for 5 minutes. A unique URL goes past it, so
  // the refill that follows a purge reads the edit, not the copy the CDN kept.
  url.searchParams.set('_', Date.now().toString(36))
  const res = await Promise.race([
    fetch(url, { cache: 'no-store' }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('webcore timeout')), TIMEOUT_MS)),
  ])
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`webcore seo ${res.status}`)
  const o = (await res.json()) as Override
  // webcore falls back to the English row; a Malay page must never take it.
  return o.language === locale ? o : null
}

// One cache entry per page, held until webcore sends `webcore-seo` to
// /api/revalidate. The location pages render per request, so without this
// every view would ask webcore again.
const getOverride = unstable_cache(fetchOverride, ['webcore-seo-override'], { tags: ['webcore-seo'] })

/**
 * Layer the webcore override for this page over the metadata it built. Only
 * fields the override sets are replaced, and Open Graph follows so a shared
 * link says the same thing as the search result.
 */
export async function withSeoOverride(locale: string, path: string, meta: Metadata): Promise<Metadata> {
  let o: Override | null = null
  try {
    o = await getOverride(locale, path)
  } catch {
    // webcore unreachable: keep the page's own metadata.
  }
  if (!o) return meta

  const merged: Metadata = { ...meta }
  const og = { ...(meta.openGraph ?? {}) } as NonNullable<Metadata['openGraph']>
  if (o.title) {
    // `absolute` skips the layout's "%s | brand" template: the title an editor
    // types in webcore is the whole title, and is what gets measured there.
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
