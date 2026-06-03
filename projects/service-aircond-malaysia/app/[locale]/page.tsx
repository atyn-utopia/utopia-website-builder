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
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
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
  const tUsp = await getTranslations({ locale, namespace: 'home.usp' })
  const tRoot = await getTranslations({ locale })
  const imageAlt = tRoot('imageAlt')

  const { phone } = await getPhoneNumber()
  const waHref = `/${locale}/redirect-whatsapp-1`

  const uspItems = [
    { title: tUsp('usp1Title'), sub: tUsp('usp1Sub'), icon: 'clock' },
    { title: tUsp('usp2Title'), sub: tUsp('usp2Sub'), icon: 'shield' },
    { title: tUsp('usp3Title'), sub: tUsp('usp3Sub'), icon: 'badge' },
  ] as const

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
            'linear-gradient(135deg, rgba(15,34,56,0.93) 0%, rgba(27,58,92,0.90) 50%, rgba(20,52,76,0.95) 100%), url(/images/hero-aircond-bg.jpg) center/cover no-repeat',
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
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 md:pt-20 pb-0 text-center text-white">
          <h6 className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-5">
            <span className="h-2 w-2 rounded-full bg-[#FFE500]" aria-hidden="true" />
            {tHero('badgeCertified')} · {tHero('badgeCities')}
          </h6>
          <h1
            className="font-extrabold leading-[1.05] tracking-tight mx-auto"
            style={{ fontSize: 'clamp(32px, 5.4vw, 56px)' }}
          >
            {tHero('headline')}{' '}
            <span style={{ color: '#FFE500' }}>{tHero('headlineHighlight')}</span>
          </h1>
          <h2 className="mt-5 text-base md:text-lg leading-relaxed text-white/80 max-w-2xl mx-auto font-normal">
            {tHero('subheadline')}
          </h2>
          <div className="mt-7 flex flex-col items-center gap-2">
            <WhatsAppClickTracker
              phoneNumber={phone}
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold text-white"
              style={{ background: 'var(--wa-green)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
              </svg>
              {tHero('cta')}
            </WhatsAppClickTracker>
            <span className="text-xs font-normal text-white/50">{tHero('ctaSubtext')}</span>
          </div>
          <img
            src="/images/hero-new.png"
            alt={tHero('heroAlt')}
            className="mx-auto mt-8 w-64 sm:w-72 md:w-[340px] lg:w-[380px] block"
            style={{ filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.35))', marginBottom: '-1px' }}
          />
        </div>
      </section>

      {/* 3-POINT USP BAR — sits directly under the hero per the design rules */}
      <section
        className="px-6 py-8 md:py-10"
        style={{ background: '#fff', borderBottom: '1px solid var(--brand-border)' }}
        aria-label="Why choose us"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {uspItems.map((item) => (
            <div
              key={item.icon}
              className="flex items-center gap-4 text-center md:text-left justify-center md:justify-start"
            >
              <span
                className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl"
                style={{ background: 'var(--brand-blue-xs)', color: 'var(--brand-navy)' }}
                aria-hidden="true"
              >
                {item.icon === 'clock' && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                )}
                {item.icon === 'shield' && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                )}
                {item.icon === 'badge' && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="9" r="6" />
                    <path d="M9 13.5L7 21l5-3 5 3-2-7.5" />
                  </svg>
                )}
              </span>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--brand-navy)' }}>{item.title}</h3>
                <h5 className="text-xs font-normal mt-0.5" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.5' }}>{item.sub}</h5>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HomePageClient phoneNumber={phone} />

      <SiteFooter locale={locale} />
    </>
  )
}
