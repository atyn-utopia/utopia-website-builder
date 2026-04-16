import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { locations, getNearbyLocations, getCityName } from '@/config/locations'
import { siteConfig } from '@/config/site'
import { routing } from '@/i18n/routing'
import LocationPageClient from './LocationPageClient'

type Params = { locale: string; location: string }

export function generateStaticParams() {
  const params: Params[] = []
  for (const locale of routing.locales) {
    for (const loc of locations) {
      params.push({ locale, location: loc.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, location } = await params
  const loc = locations.find(l => l.slug === location)
  if (!loc) return { title: 'Aircond Service — Encik Beku' }

  const t = await getTranslations({ locale, namespace: 'location.meta' })
  const city = loc.names[locale as 'en' | 'ms' | 'zh'] ?? loc.displayName

  const title = t('title', { city })
  const description = t('description', { city })

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.baseUrl),
    alternates: {
      canonical: `/${locale}/service-aircond/${location}`,
      languages: {
        en: `/en/service-aircond/${location}`,
        ms: `/ms/service-aircond/${location}`,
        zh: `/zh/service-aircond/${location}`,
        'x-default': `/en/service-aircond/${location}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.baseUrl}/${locale}/service-aircond/${location}`,
      siteName: siteConfig.brandName,
      locale: locale === 'zh' ? 'zh_MY' : locale === 'ms' ? 'ms_MY' : 'en_MY',
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { locale, location } = await params

  const loc = locations.find(l => l.slug === location)
  if (!loc) notFound()

  const city = loc.names[locale as 'en' | 'ms' | 'zh'] ?? loc.displayName
  const nearby = getNearbyLocations(location)

  return (
    <LocationPageClient
      locale={locale}
      locationSlug={location}
      cityName={city}
      nearby={nearby.map(n => ({
        slug: n.slug,
        name: n.names[locale as 'en' | 'ms' | 'zh'] ?? n.displayName,
      }))}
    />
  )
}
