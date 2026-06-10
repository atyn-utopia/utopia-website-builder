import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import { siteConfig } from '@/config/site'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = siteConfig.url

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
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`
  languages['x-default'] = `${SITE_URL}/en`

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: '%s | Kak Kenduri' },
    description: t('description'),
    alternates: seoAlternates(locale),
    verification: { google: 'tm0matiWoFe5vrz_jjCFkYpuL_iokve1Je2zV1ObdXc' },
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

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website={siteConfig.domain}
        />
      </head>
      <body className="bg-[#FFFEF8] text-[#111111] antialiased overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OrganizationSchema />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
