import type { Metadata } from 'next'
import RedirectClient from './RedirectClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function RedirectWhatsAppPage() {
  return <RedirectClient />
}
