import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { siteConfig } from '@/config/site'
import { getPhoneNumber } from '@/lib/webcore'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema'
import { ProductSchema } from '@/components/schema/ProductSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageStyles from '@/components/PageStyles'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import HomePageClient from './HomePageClient'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  return {
    title: t('title'),
    description: t('description'),
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
      title: t('title'),
      description: t('description'),
      url: `${siteConfig.siteUrl}/${locale}`,
      siteName: siteConfig.brandName,
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      type: 'website',
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const tMeta = await getTranslations({ locale, namespace: 'home.meta' })
  const tHero = await getTranslations({ locale, namespace: 'home.hero' })
  const tUsp = await getTranslations({ locale, namespace: 'home.usp' })
  const tFaq = await getTranslations({ locale, namespace: 'home.faq' })
  const tRoot = await getTranslations({ locale })
  const imageAlt = tRoot('imageAlt')

  const { phone } = await getPhoneNumber()
  const waHref = `/${locale}/redirect-whatsapp-1`

  const uspItems = [
    { title: tUsp('usp1Title'), sub: tUsp('usp1Sub'), icon: 'clock' as const },
    { title: tUsp('usp2Title'), sub: tUsp('usp2Sub'), icon: 'paint' as const },
    { title: tUsp('usp3Title'), sub: tUsp('usp3Sub'), icon: 'shield' as const },
  ]

  const faqs = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    question: tFaq(`q${n}`),
    answer: tFaq(`a${n}`),
  }))

  return (
    <>
      <PageStyles />
      <OrganizationSchema />
      <LocalBusinessSchema locale={locale} />
      <ProductSchema name={tMeta('title')} description={tMeta('description')} locale={locale} />
      <FAQSchema faqs={faqs} />

      <FomoBanner locale={locale as Locale} />
      <SiteHeader />

      {/* HERO — single H1 + H2 + role=img bg sit here. */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(20,28,48,0.92) 0%, rgba(20,28,48,0.88) 50%, rgba(20,28,48,0.94) 100%), url(/images/hero-bg.jpg) center/cover no-repeat',
        }}
      >
        <div
          className="hero-bg"
          role="img"
          aria-label={imageAlt}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-14 md:pt-16 pb-12 text-center text-white">
          <h6 className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider mb-4">
            <span className="h-2 w-2 rounded-full" style={{ background: '#FFD23F' }} aria-hidden="true" />
            {tHero('badgeCertified')} · {tHero('badgeCities')}
          </h6>
          <h1
            className="font-extrabold leading-[1.1] tracking-tight mx-auto"
            style={{ fontSize: 'clamp(1.75rem, 4.4vw, 2.75rem)', letterSpacing: '-0.03em' }}
          >
            {tHero('headline')}{' '}
            <span style={{ color: '#FFD23F' }}>{tHero('headlineHighlight')}</span>
          </h1>
          <h2 className="mt-4 text-sm md:text-base text-white/80 max-w-xl mx-auto font-normal" style={{ lineHeight: 1.6 }}>
            {tHero('subheadline')}
          </h2>
          <div className="mt-6 flex flex-col items-center gap-3">
            <WhatsAppClickTracker
              phoneNumber={phone}
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
              </svg>
              {tHero('cta')}
            </WhatsAppClickTracker>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {tHero('ctaSubtext').split(' · ').map((part, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3-POINT USP BAR — one contained panel, three cells (matches checklist) */}
      <section
        className="px-6 py-8 md:py-10"
        style={{ background: '#fff', borderBottom: '1px solid rgba(20,28,48,0.10)' }}
        aria-label="Why choose us"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="usp-panel rounded-2xl"
            style={{
              background: '#FAF7F2',
              border: '1px solid rgba(20,28,48,0.10)',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {uspItems.map((item) => (
              <div
                key={item.icon}
                className="usp-cell flex flex-col md:flex-row md:items-center items-center text-center md:text-left gap-3 md:gap-4 p-3 md:p-4 rounded-xl"
                style={{ background: '#fff', border: '1px solid rgba(20,28,48,0.06)' }}
              >
                <span
                  className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{ background: 'rgba(20,28,48,0.06)', color: '#142C50' }}
                  aria-hidden="true"
                >
                  {item.icon === 'clock' && (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  )}
                  {item.icon === 'paint' && (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 7V3H5v8h14V7zM12 11v4M9 21h6v-6H9v6z" />
                    </svg>
                  )}
                  {item.icon === 'shield' && (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  )}
                </span>
                <div>
                  <h5 className="text-sm font-bold" style={{ color: '#142C50' }}>{item.title}</h5>
                  <h5 className="text-xs font-normal mt-0.5" style={{ color: '#5B6478', lineHeight: 1.6 }}>{item.sub}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomePageClient phoneNumber={phone} />

      <SiteFooter locale={locale} />
    </>
  )
}
