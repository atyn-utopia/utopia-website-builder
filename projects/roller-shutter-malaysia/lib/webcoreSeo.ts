// Per-page SEO overrides from webcore (`webcore.seo_overrides`).
//
// Webcore's SEO page lets an editor set a page's meta title, description and
// share image without touching this repo. Rows are keyed by the page's public
// path — `/` for the Malay homepage, `/en/roller-shutter/ampang` for an English
// location page — plus the language. A page with no row keeps its own copy.
//
// The anon key reads nothing from seo_overrides, so this one query uses the
// service-role key (server-only; this module is never imported by a client
// component). All of the site's rows come back in one request, cached under the
// `webcore-seo` tag that webcore purges through /api/revalidate on every edit.

import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { siteConfig } from '@/config/site'
import { routing } from '@/i18n/routing'

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const FETCH_TIMEOUT_MS = 6000

interface Override {
  path: string
  language: string
  title: string | null
  description: string | null
  og_image: string | null
}

// Throws on failure so unstable_cache does not keep an empty answer: the next
// request tries again instead of serving no overrides until the next purge.
async function fetchOverrides(): Promise<Override[]> {
  if (!SUPABASE_URL || !SERVICE_KEY) return []
  const query =
    `seo_overrides?select=path,language,title,description,og_image` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}&is_pattern=eq.false`
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Accept: 'application/json',
      'Accept-Profile': 'webcore',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`[webcore] seo_overrides ${res.status}`)
  return (await res.json()) as Override[]
}

const getOverrides = unstable_cache(fetchOverrides, ['webcore-seo-overrides'], {
  tags: ['webcore-seo'],
})

function publicPath(locale: string, path: string): string {
  return ((locale === routing.defaultLocale ? '' : `/${locale}`) + path) || '/'
}

/**
 * Layer the webcore override for this page over the metadata the page built.
 * Only fields the override sets are replaced, and the Open Graph copy follows
 * so a shared link says the same thing as the search result.
 */
export async function withSeoOverride(
  locale: string,
  path: string,
  meta: Metadata,
): Promise<Metadata> {
  let rows: Override[] = []
  try {
    rows = await getOverrides()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[webcore] seo overrides unavailable:', err)
    return meta
  }
  const key = publicPath(locale, path)
  const o = rows.find((r) => r.path === key && r.language === locale)
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
