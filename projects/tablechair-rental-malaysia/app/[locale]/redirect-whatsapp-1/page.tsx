import { headers } from 'next/headers'
import { getPhoneNumber } from '@/lib/getPhoneNumber'
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
  const loc = sp.loc?.trim() || 'all'
  const overrideMessage = sp.message?.trim()

  const hdrs = await headers()
  const host = hdrs.get('host') ?? 'tablechair-rental-malaysia.vercel.app'

  const { phone, whatsappText } = await getPhoneNumber(host, loc)

  const text =
    overrideMessage && overrideMessage.length > 0 ? overrideMessage : whatsappText
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

  return <RedirectClient url={url} />
}
