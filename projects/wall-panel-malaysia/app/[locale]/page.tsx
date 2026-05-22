import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import PageShell from '@/components/PageShell'
import { getProducts } from '@/lib/webcore'
import {
  localBusinessHomepageSchema,
  websiteSchema,
  itemListLocationsSchema,
} from '@/lib/schema'
import { LOCATIONS } from '@/config/locations'
import { siteConfig, type Locale } from '@/config/site'

const SITE_URL = siteConfig.url

type Params = { locale: Locale }

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`
  languages['x-default'] = `${SITE_URL}/en`

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: siteConfig.brandName,
      title: t('title'),
      description: t('description'),
      locale: locale === 'en' ? 'en_MY' : locale === 'ms' ? 'ms_MY' : 'zh_CN',
    },
    robots: { index: true, follow: true },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const { core, additional } = await getProducts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessHomepageSchema(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListLocationsSchema(
              locale,
              LOCATIONS.map((l) => ({
                slug: l.slug,
                name: l.display[locale],
              })),
            ),
          ),
        }}
      />
      <PageShell
        locale={locale}
        variant="home"
        coreProducts={core}
        additionalProducts={additional}
      />
    </>
  )
}
