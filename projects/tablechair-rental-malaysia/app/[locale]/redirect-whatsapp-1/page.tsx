import { headers } from 'next/headers'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

export const dynamic = 'force-dynamic'

// Pin to Singapore so the function sits near Supabase's Cloudflare-KUL edge.
// Default iad1 (US East) round-trip is ~250ms each way and pushes the page's
// cold-start past the wizard's 7s liveness probe.
export const preferredRegion = 'sin1'

// The redirect page is a lead hand-off, never a landing page — keep it out of
// the index so it can't compete with real pages or absorb ad traffic.
export const metadata = {
  robots: { index: false, follow: false },
}

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

type Search = { loc?: string; message?: string; page?: string }

export default async function RedirectWhatsapp1Page({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const loc = sp.loc?.trim() || undefined
  const overrideMessage = sp.message?.trim()
  const pageSlug = await resolvePageSlug(sp.page)

  // webcore resolves the host from headers internally — no need to pass it.
  const { phone, whatsappText } = await getPhoneNumber(loc, pageSlug)

  const text =
    overrideMessage && overrideMessage.length > 0 ? overrideMessage : whatsappText

  return <RedirectClient url={waLink(phone, text)} />
}
