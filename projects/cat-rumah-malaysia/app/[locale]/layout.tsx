import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
import { Inter, Noto_Sans_SC } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: {
      default: t('title'),
      template: `%s | ${siteConfig.brandName}`,
    },
    description: t('description'),
    alternates: seoAlternates(locale),
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      url: `${siteConfig.baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
    },
    robots: { index: true, follow: true },
  }
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script defer src="https://webcore.utopiaai.my/t.js" data-website={siteConfig.domain}></script>
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
