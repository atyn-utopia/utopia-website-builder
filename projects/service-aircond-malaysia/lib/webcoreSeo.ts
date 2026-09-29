// Per-page SEO overrides from webcore.
//
// Webcore's SEO page lets an editor set a page's meta title, description and
// share image without touching this repo. Each row is keyed by the page's
// public path — `/` for the English homepage and `/ms/service-aircond/ampang`
// for a Malay location page — plus the language. A page with no row keeps the metadata it builds itself.
//
// Read through webcore's public API rather than Supabase REST: the anon key
// this site holds gets nothing back from `seo_overrides`. That GET is cached
// on webcore's CDN for 5 minutes, so the request carries a unique buster and
// the freshness comes from Next's cache instead — tagged `webcore-seo`, which
// /api/revalidate flushes when webcore pings. No time-based ISR.

import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { siteConfig } from '@/config/site'
import { routing } from '@/i18n/routing'

const WEBCORE_BASE = 'https://webcore.utopiagroup.com.my'

// The path a visitor sees: the default locale is served without a prefix.
function publicPath(locale: string, path: string): string {
  return (locale === routing.defaultLocale ? '' : `/${locale}`) + path || '/'
}
const FETCH_TIMEOUT_MS = 6000

interface Override {
  path: string
  language: string
  title: string | null
  description: string | null
  og_image: string | null
  is_pattern: boolean
}

// Throws on any failure so an outage is never cached as "no overrides".
async function fetchOverrides(): Promise<Override[]> {
  const url =
    `${WEBCORE_BASE}/api/public/seo?website=${encodeURIComponent(siteConfig.domain)}` +
    `&_=${Date.now()}`
  const res = await Promise.race([
    fetch(url, { cache: 'no-store' }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('webcore seo timeout')), FETCH_TIMEOUT_MS),
    ),
  ])
  if (!res.ok) throw new Error(`webcore seo ${res.status}`)
  const rows = (await res.json()) as Override[]
  return rows.filter((r) => !r.is_pattern)
}

// Concurrent callers share one request in flight, so a build rendering
// hundreds of pages sends one request, not hundreds that time out. Cleared on
// settle: freshness is still Next's cache and the webcore-seo tag, not this.
let inflight: Promise<Override[]> | null = null

function fetchOverridesShared(): Promise<Override[]> {
  if (!inflight) {
    inflight = fetchOverrides().finally(() => {
      inflight = null
    })
  }
  return inflight
}

const getOverrides = unstable_cache(fetchOverridesShared, ['webcore-seo-overrides'], {
  tags: ['webcore-seo'],
})

/**
 * Layer the webcore override for this page over the metadata the page built.
 * Only fields the override sets are replaced.
 *
 * Share cards: a page that builds its own Open Graph card gets the override's
 * copy in it too. A page that inherits the layout's card (home, blog listing)
 * keeps it untouched — returning a partial card would replace the layout's
 * wholesale and drop its image, URL and site name.
 */
export async function withSeoOverride(
  locale: string,
  path: string,
  meta: Metadata,
): Promise<Metadata> {
  let rows: Override[]
  try {
    rows = await getOverrides()
  } catch (err) {
    console.error('[webcore] seo overrides unavailable:', err)
    return meta
  }
  const key = publicPath(locale, path)
  const o = rows.find((r) => r.path === key && r.language === locale)
  if (!o) return meta

  const merged: Metadata = { ...meta }
  if (o.title) merged.title = { absolute: o.title }
  if (o.description) merged.description = o.description

  if (meta.openGraph) {
    const og = { ...meta.openGraph } as NonNullable<Metadata['openGraph']>
    // Articles deliberately share the article title rather than the SEO
    // title, so the card only follows when the editor changed the copy.
    if (o.title && o.title !== meta.title) og.title = o.title
    if (o.description && o.description !== meta.description) og.description = o.description
    if (o.og_image) og.images = [o.og_image]
    merged.openGraph = og
  }
  // No card of its own: only an override image justifies writing one, and
  // then it carries the page URL so it stands on its own.
  if (!meta.openGraph && o.og_image) {
    merged.openGraph = {
      title: o.title ?? undefined,
      description: o.description ?? undefined,
      images: [o.og_image],
      url: meta.alternates?.canonical as string | undefined,
      siteName: siteConfig.brandName,
    }
  }
  return merged
}
