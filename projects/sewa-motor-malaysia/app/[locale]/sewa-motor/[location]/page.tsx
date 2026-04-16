import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locations, getNearbyLocations } from '@/config/locations'
import { products } from '@/config/products'
import { siteConfig } from '@/config/site'
import { routing } from '@/i18n/routing'
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'
import { ProductSchema } from '@/components/schema/ProductSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import LocationPageClient from './LocationPageClient'

type Props = {
  params: Promise<{ locale: string; location: string }>
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    locations.map((loc) => ({ locale, location: loc.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, location } = await params
  const loc = locations.find((l) => l.slug === location)
  if (!loc) return {}

  const displayName = loc.displayName
  const state = loc.state
  const baseUrl = siteConfig.baseUrl

  const title =
    locale === 'zh'
      ? `${displayName}摩托车出租 | 日租RM30起 — Sewa Motor Malaysia`
      : `Motor Rental ${displayName} | From RM30/day — Sewa Motor Malaysia`

  const description =
    locale === 'zh'
      ? `${displayName}${state ? `（${state}）` : ''}摩托车出租服务。Honda Vario、Yamaha NMax、Honda PCX等车型，日租/周租/月租。WhatsApp即时预订，快速送车。`
      : `Rent motorcycles in ${displayName}${state ? `, ${state}` : ''}. Honda Vario, Yamaha NMax, Honda PCX & more. Daily, weekly & monthly rentals from RM30/day. WhatsApp to book instantly.`

  const canonicalUrl = `${baseUrl}/${locale}/sewa-motor/${location}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/sewa-motor/${location}`,
        zh: `${baseUrl}/zh/sewa-motor/${location}`,
        'x-default': `${baseUrl}/en/sewa-motor/${location}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.brandName,
      locale: locale === 'zh' ? 'zh_CN' : 'en_MY',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Motor rental in ${displayName}, Malaysia`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
  }
}

export const revalidate = 3600

export default async function LocationPage({ params }: Props) {
  const { locale, location } = await params
  const loc = locations.find((l) => l.slug === location)
  if (!loc) notFound()

  const t = await getTranslations({ locale, namespace: 'location' })
  const tProducts = await getTranslations({ locale, namespace: 'home.products' })

  const displayName = loc.displayName
  const nearby = getNearbyLocations(loc.slug)

  // Build FAQ data for schema
  const faqs = Array.from({ length: 10 }, (_, i) => ({
    question: t(`faq.q${i + 1}` as any, { city: displayName }),
    answer: t(`faq.a${i + 1}` as any, { city: displayName }),
  }))

  // Build product data for schema — nameKey is "products.hondaVario160.name", extract middle part
  const productSchemaData = products.map((p) => {
    const key = p.nameKey.split('.')[1]
    return {
    name: tProducts(`${key}.name` as any),
    description: tProducts(`${key}.description` as any),
    image: `${siteConfig.baseUrl}/og-image.jpg`,
    priceDaily: p.priceDailyNum,
    priceWeekly: p.priceWeeklyNum,
    priceMonthly: p.priceMonthlyNum,
  }
  })

  return (
    <>
      <LocalBusinessSchema
        locationName={displayName}
        locationSlug={loc.slug}
        state={loc.state}
        locale={locale}
      />
      <BreadcrumbSchema
        locationName={displayName}
        locationSlug={loc.slug}
        locale={locale}
      />
      {productSchemaData.map((p, i) => (
        <ProductSchema
          key={products[i].id}
          product={p}
          locationName={displayName}
          locationSlug={loc.slug}
          locale={locale}
        />
      ))}
      <FAQSchema faqs={faqs} />
      <LocationPageClient
        locale={locale}
        locationSlug={loc.slug}
        displayName={displayName}
        state={loc.state}
        nearbyLocations={nearby.map((n) => ({
          slug: n.slug,
          displayName: n.displayName,
          state: n.state,
        }))}
      />
    </>
  )
}
