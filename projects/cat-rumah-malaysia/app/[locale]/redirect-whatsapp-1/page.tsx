import { headers } from 'next/headers'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import { RedirectClient } from './RedirectClient'

export const dynamic = 'force-dynamic'

const LOCALE_PREFIXES = new Set(['en', 'ms', 'zh'])

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
  searchParams: Promise<{ loc?: string; message?: string; page?: string }>
}

export default async function WARedirectPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const loc = sp.loc ?? 'all'
  const pageSlug = await resolvePageSlug(sp.page)
  const { phone, whatsappText } = await getPhoneNumber(loc, pageSlug)
  const message = sp.message ?? whatsappText
  const url = waLink(phone, message)
  return <RedirectClient url={url} locale={locale} />
}
