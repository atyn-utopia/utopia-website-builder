import { Metadata } from 'next'
import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber'
import RedirectClient from './RedirectClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ location?: string; message?: string }>
}

export default async function RedirectWhatsAppPage({ searchParams }: Props) {
  const { location, message } = await searchParams
  const locationSlug = location ?? 'all'
  const { phone } = await getPhoneNumber(locationSlug)
  const url = waLink(phone, message ?? 'Hi, I need aircond service')

  return <RedirectClient url={url} />
}
