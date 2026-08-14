import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { seoAlternates } from '@/lib/seoAlternates'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import { ogImages } from '@/lib/ogImage'

// Self-hosted via next/font rather than a Google Fonts <link>. The stylesheet
// link shipped Inter with display=swap and no metric-matched fallback, so the
// hero H1 rendered in system-ui, then rewrapped when Inter arrived and shoved
// the whole page down ~34px (CLS 0.125). next/font emits a size-adjusted
// fallback face, so the swap no longer changes layout.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  return {
    title: {
      default: t('title'),
      template: `%s | ${siteConfig.brandName}`,
    },
    description: t('description'),
    metadataBase: new URL(siteConfig.baseUrl),
    alternates: seoAlternates(locale),
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'ms' ? 'ms_MY' : 'en_MY',
      url: `${siteConfig.baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
      images: ogImages(locale),
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'ms' | 'zh')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} dir="ltr" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script defer src="https://webcore.utopiaai.my/t.js" data-website={siteConfig.domain}></script>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5XJJ4HFN');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5XJJ4HFN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
