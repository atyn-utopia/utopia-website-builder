import { Metadata } from 'next'
import { headers } from 'next/headers'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
// Pin to Singapore so the function sits near Supabase's Cloudflare-KUL edge.
// Default iad1 (US East) round-trip is ~250ms each way and pushes the page's
// cold-start past the wizard's 7s liveness probe.
export const preferredRegion = 'sin1'

// Locale prefixes we strip when deriving a page_slug from a path. Kept in sync
// with the site's configured locales.
const LOCALE_PREFIXES = new Set(['en', 'ms', 'zh'])

// Derive the page identifier for per-page phone routing. Priority:
//   1. an explicit ?page= slug on the redirect link, then
//   2. the first meaningful segment of the Referer path (locale stripped).
// Returns undefined when neither is available (e.g. the wizard liveness probe
// hits the bare URL), so resolution cleanly falls back to the site-wide default.
async function resolvePageSlug(explicit?: string): Promise<string | undefined> {
  if (explicit?.trim()) return explicit.trim()
  try {
    const ref = (await headers()).get('referer')
    if (!ref) return undefined
    const segments = new URL(ref).pathname.split('/').filter(Boolean)
    if (segments.length && LOCALE_PREFIXES.has(segments[0])) segments.shift()
    return segments[0] || undefined
  } catch {
    return undefined
  }
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ location?: string; loc?: string; message?: string; page?: string }>
}

export default async function RedirectWhatsAppPage({ searchParams }: Props) {
  const { location, loc, message, page } = await searchParams
  // This site's own links pass `location=`; `loc=` is the fleet-wide name used
  // by the reference redirect page. Accept both so either link shape routes.
  const locationSlug = location ?? loc ?? 'all'
  const pageSlug = await resolvePageSlug(page)
  const { phone, whatsappText } = await getPhoneNumber(locationSlug, pageSlug)
  const url = waLink(phone, message ?? whatsappText)

  return <RedirectClient url={url} />
}
