import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { loc?: string; message?: string }

export default async function RedirectWhatsapp1Page({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const loc = sp.loc?.trim() || undefined
  const overrideMessage = sp.message?.trim()

  const { phone, whatsappText } = await getPhoneNumber(loc)
  const url = waLink(phone, overrideMessage || whatsappText)

  return <RedirectClient url={url} />
}
