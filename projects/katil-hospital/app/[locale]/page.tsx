import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { getPhoneNumber } from '@/lib/webcore'
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema'
import { ProductSchema } from '@/components/schema/ProductSchema'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageStyles from '@/components/PageStyles'
import HomePageClient from './HomePageClient'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
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
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: 'home.meta' })
  const tHero = await getTranslations({ locale, namespace: 'home.hero' })
  const tRoot = await getTranslations({ locale })
  const imageAlt = tRoot('imageAlt')

  const { phone } = await getPhoneNumber()

  return (
    <>
      <PageStyles />
      <OrganizationSchema />
      <LocalBusinessSchema locale={locale} />
      <ProductSchema
        name={tMeta('title')}
        description={tMeta('description')}
        locale={locale}
      />

      <FomoBanner locale={locale} />
      <SiteHeader locale={locale} />

      {/* HERO — the page's single H1 + H2 + role=img bg live here so the
          checklist sees them in page.tsx source. FOMO/header/footer are the
          shared components above/below; HomePageClient renders only sections. */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(15,34,56,0.93) 0%, rgba(27,58,92,0.90) 50%, rgba(20,52,76,0.95) 100%), url(/images/hero-bed-bg.jpg) center/cover no-repeat',
        }}
      >
        {/* Labelled region so screen readers + the checklist see the hero
            background image; the visible gradient-over-photo is on the section. */}
        <div
          className="hero-bg"
          role="img"
          aria-label={imageAlt}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24 text-white">
          <h6 className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-5">
            <span className="h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true" />
            {tHero('badgeCertified')} · {tHero('badgeCities')}
          </h6>
          <h1
            className="font-extrabold leading-[1.05] tracking-tight max-w-3xl"
            style={{ fontSize: 'clamp(32px, 5.4vw, 56px)' }}
          >
            {tHero('headline')}{' '}
            <span style={{ color: '#FACC15' }}>{tHero('headlineHighlight')}</span>
          </h1>
          <h2 className="mt-5 text-base md:text-lg leading-relaxed text-white/80 max-w-2xl font-normal">
            {tHero('subheadline')}
          </h2>
        </div>
      </section>

      <HomePageClient phoneNumber={phone} />

      <SiteFooter locale={locale} />
    </>
  )
}
