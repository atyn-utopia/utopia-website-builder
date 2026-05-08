import type { Metadata } from 'next'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function RedirectWhatsAppPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; message?: string }>
}) {
  const sp = await searchParams
  const { phone, whatsappText } = await getPhoneNumber(sp.location || undefined)
  const url = waLink(phone, sp.message || whatsappText)
  return <RedirectClient url={url} phoneNumber={phone} />
}
