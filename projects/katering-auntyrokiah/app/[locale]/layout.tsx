import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import { organizationSchema, websiteSchema } from '@/lib/schema'
import '../globals.css'

const SITE_URL = siteConfig.url

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Params = { locale: string }

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return {}
  }
  const t = await getTranslations({ locale, namespace: 'meta' })

  const languages: Record<string, string> = {
    'ms-MY': `${SITE_URL}/ms`,
    'en-MY': `${SITE_URL}/en`,
    'zh-Hans-MY': `${SITE_URL}/zh`,
    'x-default': `${SITE_URL}/ms`,
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('homeTitle'), template: `%s${t('titleSuffix')}` },
    description: t('homeDescription'),
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: siteConfig.brandName,
      title: t('homeTitle'),
      description: t('homeDescription'),
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('homeTitle'),
      description: t('homeDescription'),
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  setRequestLocale(locale)

  const messages = await getMessages()
  const htmlLang =
    locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-Hans-MY' : 'en-MY'

  return (
    <html
      lang={htmlLang}
      className={inter.variable}
    >
      <head>
        {/* Utopia Webcore analytics — data-website must match deployed domain exactly. */}
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website={siteConfig.domain}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema(locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema(locale)),
          }}
        />
      </head>
      <body className="bg-[var(--cream)] text-[var(--ink)] antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
