import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { locations, locationBySlug, cityDisplay } from '@/config/locations'
import { locales } from '@/i18n/routing'
import { getLocationCopy } from '@/lib/locationCopy'
import { FomoBanner } from '@/components/sections/FomoBanner'
import { Nav } from '@/components/sections/Nav'
import { Breadcrumbs } from '@/components/sections/Breadcrumbs'
import { Hero } from '@/components/sections/Hero'
import { Stats } from '@/components/sections/Stats'
import { Products } from '@/components/sections/Products'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { RiskProblem } from '@/components/sections/RiskProblem'
import { MidCta } from '@/components/sections/MidCta'
import { GoogleReviews } from '@/components/sections/GoogleReviews'
import { WhyChoose } from '@/components/sections/WhyChoose'
import { Gallery } from '@/components/sections/Gallery'
import { LocationsAccordion } from '@/components/sections/LocationsAccordion'
import { NearbyLocations } from '@/components/sections/NearbyLocations'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Footer } from '@/components/sections/Footer'
import { StructuredData } from '@/components/seo/StructuredData'
import { getProducts, getPhoneNumber } from '@/lib/webcore'

type Props = { params: Promise<{ locale: string; location: string }> }

const baseUrl = 'https://cat-rumah-malaysia.vercel.app'

export function generateStaticParams() {
  const out: Array<{ locale: string; location: string }> = []
  for (const locale of locales) {
    for (const l of locations) out.push({ locale, location: l.slug })
  }
  return out
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, location } = await params
  const copy = getLocationCopy(location, locale)
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/cat-rumah/${location}`,
      languages: {
        ms: `/ms/cat-rumah/${location}`,
        en: `/en/cat-rumah/${location}`,
        zh: `/zh/cat-rumah/${location}`,
        'x-default': `/ms/cat-rumah/${location}`,
      },
    },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: `${baseUrl}/${locale}/cat-rumah/${location}`,
      siteName: 'Cat Rumah Malaysia',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      type: 'website',
    },
  }
}

export default async function LocationPage({ params }: Props) {
  const { locale, location } = await params
  const loc = locationBySlug(location)
  if (!loc) notFound()
  setRequestLocale(locale)

  const [copy, products, phoneResult] = await Promise.all([
    Promise.resolve(getLocationCopy(location, locale)),
    getProducts(),
    getPhoneNumber(location),
  ])
  const phoneNumber = phoneResult.phone
  const cityName = cityDisplay(location, locale)

  return (
    <>
      <StructuredData
        kind="location"
        locale={locale}
        faqs={copy.faqs.map((f) => ({ q: f.q, a: f.a }))}
        locationSlug={location}
        cityName={cityName}
      />
      <FomoBanner />
      <Nav locale={locale} phoneNumber={phoneNumber} />
      <Breadcrumbs locale={locale} cityName={cityName} />
      <Hero locale={locale} locationSlug={location} cityOverride={copy.h1} phoneNumber={phoneNumber} />
      <Stats />
      <Products locale={locale} locationSlug={location} products={products} phoneNumber={phoneNumber} />
      <HowItWorks />
      <RiskProblem />
      <MidCta locale={locale} locationSlug={location} phoneNumber={phoneNumber} />
      <GoogleReviews />
      <WhyChoose />
      <Gallery locale={locale} />
      <LocationsAccordion locale={locale} />
      <NearbyLocations locale={locale} slugs={loc.nearby} />
      <Faq items={copy.faqs} heading={copy.h1} />
      <FinalCta locale={locale} locationSlug={location} phoneNumber={phoneNumber} />
      <Footer locale={locale} />
    </>
  )
}
