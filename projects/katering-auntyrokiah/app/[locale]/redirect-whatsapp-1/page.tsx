import { headers } from 'next/headers'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import { getTranslations } from 'next-intl/server'
import RedirectClient from './RedirectClient'

// CLAUDE.md webcore rule: this page is the ONLY allowed `revalidate = 0` exception.
// It must re-pick a phone on every hit so leads_mode rotation behaves correctly.
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

type Search = { loc?: string; message?: string; page?: string }

export default async function RedirectWhatsapp1Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Search>
}) {
  const { locale } = await params
  const sp = await searchParams
  const loc = sp.loc?.trim() || undefined
  const overrideMessage = sp.message?.trim()
  const pageSlug = await resolvePageSlug(sp.page)

  const { phone, whatsappText } = await getPhoneNumber(loc, pageSlug)
  const url = waLink(phone, overrideMessage || whatsappText)

  const t = await getTranslations({ locale, namespace: 'redirect' })

  return (
    <RedirectClient
      url={url}
      openingLabel={t('openingLabel')}
      fallbackLabel={t('fallbackLabel')}
    />
  )
}

export const metadata = {
  robots: { index: false, follow: false },
}
