import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

export const dynamic = 'force-dynamic'

type Search = { loc?: string; message?: string }

export default async function RedirectWhatsapp1Page({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const loc = sp.loc?.trim() || undefined
  const overrideMessage = sp.message?.trim()

  // webcore resolves the host from headers internally — no need to pass it.
  const { phone, whatsappText } = await getPhoneNumber(loc)

  const text =
    overrideMessage && overrideMessage.length > 0 ? overrideMessage : whatsappText

  return <RedirectClient url={waLink(phone, text)} />
}
