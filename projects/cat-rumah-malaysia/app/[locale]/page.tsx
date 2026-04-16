import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { FomoBanner } from '@/components/sections/FomoBanner'
import { Nav } from '@/components/sections/Nav'
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
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Footer } from '@/components/sections/Footer'
import { StructuredData } from '@/components/seo/StructuredData'
import { getProducts } from '@/lib/getProducts'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string }> }

const baseUrl = 'https://cat-rumah-malaysia.vercel.app'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ms: '/ms',
        en: '/en',
        zh: '/zh',
        'x-default': '/ms',
      },
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: `${baseUrl}/${locale}`,
      siteName: 'Cat Rumah Malaysia',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      type: 'website',
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [tFaq, products] = await Promise.all([
    getTranslations({ locale, namespace: 'faq' }),
    getProducts(),
  ])
  const faqs = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: tFaq(`q${n}`),
    a: tFaq(`a${n}`),
  }))

  return (
    <>
      <StructuredData kind="home" locale={locale} faqs={faqs} />
      <FomoBanner />
      <Nav locale={locale} />
      <Hero locale={locale} />
      <Stats />
      <Products locale={locale} products={products} />
      <HowItWorks />
      <RiskProblem />
      <MidCta locale={locale} />
      <GoogleReviews />
      <WhyChoose />
      <Gallery locale={locale} />
      <LocationsAccordion locale={locale} />
      <Faq />
      <FinalCta locale={locale} />
      <Footer locale={locale} />
    </>
  )
}
