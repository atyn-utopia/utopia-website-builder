import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber'
import RedirectClient from './RedirectClient'

export const revalidate = 60

export default async function RedirectWhatsapp1() {
  const { phone, whatsappText } = await getPhoneNumber('all')
  const url = waLink(phone, whatsappText)
  return <RedirectClient url={url} />
}
