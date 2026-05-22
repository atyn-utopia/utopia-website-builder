import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getPhoneNumber, getProducts } from '@/lib/webcore'
import {
  faqPageSchema,
  itemListLocationsSchema,
  productSchema,
} from '@/lib/schema'
import { LOCATIONS } from '@/config/locations'
import { siteConfig, type Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'
import HomePageClient from './HomePageClient'

const SITE_URL = siteConfig.url

type Params = { locale: Locale }

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  const languages: Record<string, string> = {
    'ms-MY': `${SITE_URL}/ms`,
    'en-MY': `${SITE_URL}/en`,
    'zh-Hans-MY': `${SITE_URL}/zh`,
    'x-default': `${SITE_URL}/ms`,
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
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

  const [{ core, additional }, phoneResult] = await Promise.all([
    getProducts(),
    getPhoneNumber(),
  ])

  const t = await getTranslations({ locale })

  const homeWaHref = waRedirect(locale, t('hero.lede'))
  const pageUrl = `${SITE_URL}/${locale}`

  return (
    <>
      {[...core, ...additional].map((p) => (
        <script
          key={p.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              productSchema(
                locale,
                pageUrl,
                {
                  id: p.slug,
                  name: p.name,
                  description: p.description,
                  image: p.photos[0]?.url,
                  price: (p.sale_price ?? p.rental_price)?.toString() ?? null,
                },
              ),
            ),
          }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqPageSchema(
              [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
                q: t(`faq.q${n}` as 'faq.q1'),
                a: t(`faq.a${n}` as 'faq.a1'),
              })),
            ),
          ),
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

      <HomePageClient
        locale={locale}
        coreProducts={core}
        additionalProducts={additional}
        defaultWaHref={homeWaHref}
        phone={phoneResult.phone}
      />
    </>
  )
}
