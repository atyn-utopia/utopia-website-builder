import type { Metadata } from 'next'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function RedirectWhatsAppPage({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string; location?: string }>
}) {
  const sp = await searchParams
  const location = sp.loc ?? sp.location ?? undefined
  const message = sp.message?.trim()

  const { phone, whatsappText } = await getPhoneNumber(location)
  const text = message && message.length > 0 ? message : whatsappText

  return <RedirectClient url={waLink(phone, text)} />
}
