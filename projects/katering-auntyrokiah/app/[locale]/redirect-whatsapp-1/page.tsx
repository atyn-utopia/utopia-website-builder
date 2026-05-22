import { getPhoneNumber, waLink } from '@/lib/webcore'
import { getTranslations } from 'next-intl/server'
import RedirectClient from './RedirectClient'

// CLAUDE.md webcore rule: this page is the ONLY allowed `revalidate = 0` exception.
// It must re-pick a phone on every hit so leads_mode rotation behaves correctly.
export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { loc?: string; message?: string }

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

  const { phone, whatsappText } = await getPhoneNumber(loc)
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
