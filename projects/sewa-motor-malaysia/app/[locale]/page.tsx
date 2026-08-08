import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
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
    alternates: seoAlternates(locale),
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
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
              </svg>
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
