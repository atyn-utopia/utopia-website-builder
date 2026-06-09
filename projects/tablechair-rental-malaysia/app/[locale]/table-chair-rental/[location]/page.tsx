import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import PageShell from '@/components/PageShell'
import PageStyles from '@/components/PageStyles'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { findLocation, LOCATIONS } from '@/config/locations'
import { getLocationCopy } from '@/lib/locationCopy'
import { getProducts } from '@/lib/webcore'
import {
  localBusinessLocationSchema,
  breadcrumbLocationSchema,
  faqPageSchema,
  productSchemaForLocation,
} from '@/lib/schema'
import { siteConfig, type Locale } from '@/config/site'


const SITE_URL = siteConfig.url
const PRODUCT_SLUG = 'table-chair-rental'

type Params = { locale: Locale; location: string }

export async function generateStaticParams() {
  const params: { locale: Locale; location: string }[] = []
  for (const locale of routing.locales) {
    for (const l of LOCATIONS) {
      params.push({ locale: locale as Locale, location: l.slug })
    }
  }
  return params
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { locale, location } = await params
  const loc = findLocation(location)
  if (!loc) return {}

  const t = await getTranslations({ locale, namespace: 'location' })
  const city = loc.display[locale]

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}/${PRODUCT_SLUG}/${location}`
  }
  languages['x-default'] = `${SITE_URL}/en/${PRODUCT_SLUG}/${location}`

  const canonical = `${SITE_URL}/${locale}/${PRODUCT_SLUG}/${location}`

  return {
    metadataBase: new URL(SITE_URL),
    title: t('meta.title', { city }),
    description: t('meta.description', { city }),
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Kak Kenduri',
      title: t('meta.title', { city }),
      description: t('meta.description', { city }),
      locale: locale === 'en' ? 'en_MY' : locale === 'ms' ? 'ms_MY' : 'zh_CN',
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocationPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale, location } = await params
  const loc = findLocation(location)
  if (!loc) notFound()
  setRequestLocale(locale)

  const city = loc.display[locale]
  const copy = getLocationCopy(locale, location)
  // Old getProducts returned { core, additional }. Webcore returns a flat list
  // ordered by sort_order — partition by sort_order < 1000 vs >= 1000.
  const all = await getProducts()
  const core = all.filter((p) => p.sort_order < 1000)
  const additional = all.filter((p) => p.sort_order >= 1000)

  const t = await getTranslations({ locale, namespace: 'location' })

  return (
    <>
      <PageStyles />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            localBusinessLocationSchema(locale, location, city),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLocationSchema(locale, location, city, {
              home: t('breadcrumbs.home'),
              locations: t('breadcrumbs.locations'),
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema(copy.faqs)),
        }}
      />
      {core.map((p) => (
        <script
          key={p.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              productSchemaForLocation(locale, location, city, {
                id: p.slug,
                name: p.name,
                image: p.photos[0]?.url ?? '',
                low: p.rental_price != null ? p.rental_price.toFixed(2) : '0',
                high: p.sale_price != null ? p.sale_price.toFixed(2) : '0',
              }),
            ),
          }}
        />
      ))}
      <FomoBanner locale={locale} />
      <SiteHeader locale={locale} />
      <PageShell
        locale={locale}
        variant="location"
        locationSlug={location}
        locationCity={city}
        locationCopy={copy}
        coreProducts={core}
        additionalProducts={additional}
      />
      <SiteFooter locale={locale} />
    </>
  )
}
