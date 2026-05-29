import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import MarketingMarquee from '@/components/MarketingMarquee'
import PageStyles from '@/components/PageStyles'
import HomePageClient from './HomePageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  const url = `${siteConfig.siteUrl}/${locale}`
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.siteUrl}/en`,
        ms: `${siteConfig.siteUrl}/ms`,
        zh: `${siteConfig.siteUrl}/zh`,
        'x-default': `${siteConfig.siteUrl}/en`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url,
      siteName: siteConfig.brandName,
      type: 'website',
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const hero = await getTranslations({ locale, namespace: 'home.hero' })
  const shared = await getTranslations({ locale, namespace: 'shared' })
  const stats = [1, 2, 3, 4] as const

  return (
    <>
      <OrganizationSchema />
      <FomoBanner />
      <SiteHeader />

      <section className="home-hero">
        <div
          className="home-hero-bg"
          role="img"
          aria-label={hero('bgAlt')}
        />
        <div className="home-hero-inner">
          <div className="home-hero-text">
            <h1>{hero('headline')}</h1>
            <h2>{hero('subheadline')}</h2>
            <Link
              href={`/${locale}/redirect-whatsapp-1`}
              target="_blank"
              rel="noopener noreferrer"
              className="home-hero-cta"
            >
              {hero('cta')}
            </Link>
          </div>
          <div className="home-hero-media">
            <img
              src="https://static.wixstatic.com/media/d3104b_9219aed8e59e4a0d9ee86be2066ff532~mv2.png"
              alt={hero('imageAlt')}
              className="home-hero-photo"
            />
            <div className="home-hero-stamp" aria-hidden="true">
              <span className="home-hero-stamp-from">From</span>
              <span className="home-hero-stamp-price">RM30</span>
              <span className="home-hero-stamp-per">/day</span>
            </div>
          </div>
        </div>
        <div className="home-hero-stats" aria-label="Service highlights">
          {stats.map((n) => (
            <div className="home-stat" key={n}>
              <div className="home-stat-value">{shared(`stats.value${n}` as 'stats.value1')}</div>
              <div className="home-stat-label">{shared(`stats.label${n}` as 'stats.label1')}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="usp-panel">
        <div className="usp-cell">
          <h3>{shared('whyChoose.title1')}</h3>
          <h5>{shared('whyChoose.desc1')}</h5>
        </div>
        <div className="usp-cell">
          <h3>{shared('whyChoose.title2')}</h3>
          <h5>{shared('whyChoose.desc2')}</h5>
        </div>
        <div className="usp-cell">
          <h3>{shared('whyChoose.title3')}</h3>
          <h5>{shared('whyChoose.desc3')}</h5>
        </div>
      </div>

      <HomePageClient />

      <MarketingMarquee variant="dark" />
      <SiteFooter />
      <PageStyles />
    </>
  )
}
