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
  // Buttons pass a short context (bike model, city) in `message`. Append it to
  // the WhatsApp text configured in Supabase so the agent's greeting is always
  // honoured while the lead still says which bike / location they want.
  const text = message && message.length > 0 ? `${whatsappText} — ${message}` : whatsappText

  return <RedirectClient url={waLink(phone, text)} />
}
