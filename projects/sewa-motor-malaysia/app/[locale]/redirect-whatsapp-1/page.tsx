import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

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

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function RedirectWhatsAppPage({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string; location?: string; page?: string }>
}) {
  const sp = await searchParams
  const location = sp.loc ?? sp.location ?? undefined
  const message = sp.message?.trim()
  const pageSlug = await resolvePageSlug(sp.page)

  const { phone, whatsappText } = await getPhoneNumber(location, pageSlug)
  const text = message && message.length > 0 ? message : whatsappText

  return <RedirectClient url={waLink(phone, text)} />
}
