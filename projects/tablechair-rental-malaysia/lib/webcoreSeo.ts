// Per-page SEO overrides from webcore (`webcore.seo_overrides`).
//
// Webcore's SEO page lets an editor set a page's meta title, description and
// share image without touching this repo. Rows are keyed by the page's public
// path — `/` for the English homepage, `/ms/table-chair-rental/klang` for a
// Malay location page — plus the language. A page with no row keeps the
// metadata it builds itself.
//
// The anon key cannot read seo_overrides (RLS), so this one read uses the
// service-role key. It runs on the server only and the key never reaches the
// client. All rows come back in one request, cached under `webcore-seo`, which
// /api/revalidate flushes when webcore sends that tag.

import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

type Override = {
  path: string
  language: string
  title: string | null
  description: string | null
  og_image: string | null
}

async function getOverrides(): Promise<Override[]> {
  if (!SUPABASE_URL || !SERVICE_KEY) return []
  const query =
    `seo_overrides?select=path,language,title,description,og_image` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}&is_pattern=eq.false`
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Accept: 'application/json',
        'Accept-Profile': 'webcore',
      },
      cache: 'force-cache',
      next: { tags: ['webcore-seo'] },
    })
    if (!res.ok) return []
    return (await res.json()) as Override[]
  } catch {
    return []
  }
}

/** The public path webcore keys a page by: no prefix for the default locale. */
function publicPath(locale: string, path: string): string {
  return ((locale === routing.defaultLocale ? '' : `/${locale}`) + path) || '/'
}

/**
 * Layer the webcore override for this page over the metadata the page built.
 * Only fields the override sets are replaced; the Open Graph copy follows so a
 * shared link says the same thing as the search result.
 */
export async function withSeoOverride(
  locale: string,
  path: string,
  meta: Metadata,
): Promise<Metadata> {
  const key = publicPath(locale, path)
  const o = (await getOverrides()).find((r) => r.path === key && r.language === locale)
  if (!o) return meta

  const merged: Metadata = { ...meta }
  const og = { ...(meta.openGraph ?? {}) } as NonNullable<Metadata['openGraph']>
  if (o.title) {
    // `absolute` skips the layout's "%s | Kak Kenduri" template: the title an
    // editor types in webcore is the whole title, and is what gets measured there.
    merged.title = { absolute: o.title }
    og.title = o.title
  }
  if (o.description) {
    merged.description = o.description
    og.description = o.description
  }
  if (o.og_image) og.images = [{ url: o.og_image }]
  if (meta.openGraph || o.og_image) merged.openGraph = og
  return merged
}
