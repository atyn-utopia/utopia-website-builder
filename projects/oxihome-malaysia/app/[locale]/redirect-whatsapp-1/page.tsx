import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

export default async function RedirectWhatsapp1() {
  const { phone, whatsappText } = await getPhoneNumber('all')
  const url = waLink(phone, whatsappText)
  return <RedirectClient url={url} />
}
