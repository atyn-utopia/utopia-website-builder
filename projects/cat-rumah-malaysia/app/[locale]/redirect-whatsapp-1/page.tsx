import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber'
import { RedirectClient } from './RedirectClient'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ loc?: string; message?: string }>
}

export default async function WARedirectPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const loc = sp.loc ?? 'all'
  const { phone, whatsappText } = await getPhoneNumber(loc)
  const message = sp.message ?? whatsappText
  const url = waLink(phone, message)
  return <RedirectClient url={url} locale={locale} />
}
