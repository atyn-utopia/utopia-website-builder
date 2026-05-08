import { getPhoneNumber } from '@/lib/webcore'
import HomePageClient from './HomePageClient'

export default async function HomePage() {
  const { phone } = await getPhoneNumber()
  return <HomePageClient phoneNumber={phone} />
}
