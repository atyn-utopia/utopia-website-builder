import type { Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
})

const notoSC = Noto_Sans_SC({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sc',
  weight: ['400', '500', '700', '800'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL('https://cat-rumah-malaysia.vercel.app'),
  title: {
    default: 'Cat Rumah Malaysia | Servis Dari RM3.50/sqft',
    template: '%s',
  },
  description:
    'Servis cat rumah Malaysia dari RM3.50/sqft. Cat dinding, luar, siling, epoxy lantai & pagar. Nippon, Jotun, Dulux. WhatsApp sekarang!',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale === 'zh' ? 'zh-Hans' : locale}
      className={`${inter.variable} ${notoSC.variable}`}
    >
      <head>
        <script defer src="https://utopia-webcore.vercel.app/t.js" data-website="cat-rumah-malaysia.vercel.app"></script>
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
