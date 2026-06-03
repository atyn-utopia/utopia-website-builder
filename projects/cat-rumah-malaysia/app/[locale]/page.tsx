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
  const tBrands = await getTranslations({ locale, namespace: 'home.paintBrands' })
  const tRoot = await getTranslations({ locale })
  const imageAlt = tRoot('imageAlt')

  const { phone } = await getPhoneNumber()
  const waHref = `/${locale}/redirect-whatsapp-1`

  const uspItems = [
    { title: tUsp('usp1Title'), sub: tUsp('usp1Sub'), icon: 'fast' as const },
    { title: tUsp('usp2Title'), sub: tUsp('usp2Sub'), icon: 'quality' as const },
    { title: tUsp('usp3Title'), sub: tUsp('usp3Sub'), icon: 'value' as const },
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

      {/* HERO — dark section with a real painter-at-work image background,
          the canonical role=img wrapper, and the page's single H1/H2 inside. */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(2, 61, 147, 0.90) 0%, rgba(2, 42, 102, 0.92) 50%, rgba(2, 30, 76, 0.96) 100%), url(/images/painters/painter-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="hero-bg"
          role="img"
          aria-label={imageAlt}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,210,63,0.22), transparent 55%), radial-gradient(circle at 15% 80%, rgba(233,30,99,0.18), transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8 md:pt-10 pb-0 text-center text-white">
          {/* Brand logo lives at the very top of the hero per design feedback */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/logo-dark.png"
            alt={tHero('logoAlt')}
            className="mx-auto block"
            style={{ width: 'min(180px, 50%)', height: 'auto' }}
          />
          {/* Trust line — plain uppercase text, no chip styling */}
          <h6 className="mt-5 mb-4 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#FFD23F' }}>
            {tHero('badgeCertified')} · {tHero('badgeCities')}
          </h6>
          <h1
            className="font-bold leading-[1.05] tracking-tight mx-auto"
            style={{ fontSize: 'clamp(2rem, 5.2vw, 3.25rem)', letterSpacing: '-0.03em' }}
          >
            {tHero('headline')}{' '}
            <span style={{ color: '#FFD23F' }}>{tHero('headlineHighlight')}</span>
          </h1>
          <h2 className="mt-4 text-sm md:text-base text-white/80 max-w-2xl mx-auto font-normal" style={{ lineHeight: 1.6 }}>
            {tHero('subheadline')}
          </h2>

          {/* Promise tags — text only, no cutout PNGs */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {[tHero('tag1'), tHero('tag2'), tHero('tag3')].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider"
                style={{ background: 'rgba(255,210,63,0.18)', border: '1px solid rgba(255,210,63,0.36)', color: '#FFD23F' }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#FFD23F' }} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <WhatsAppClickTracker
              phoneNumber={phone}
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold shadow-lg"
              style={{ background: '#25D366', color: '#fff', boxShadow: '0 10px 30px rgba(37,211,102,0.35)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
              </svg>
              {tHero('cta')}
            </WhatsAppClickTracker>
            <span className="text-[11px] font-medium text-white/65">
              {tHero('ctaSubtext')}
            </span>
          </div>

          {/* Painter photo with a rotated yellow "same-day" stamp */}
          <div className="relative mt-10 mx-auto" style={{ maxWidth: 480 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/painters/painter-roller.png"
              alt={tHero('heroAlt')}
              className="mx-auto block"
              style={{ width: 'min(380px, 78%)', filter: 'drop-shadow(0 18px 38px rgba(0,0,0,0.45))' }}
            />
            <div
              aria-hidden="false"
              className="hero-stamp absolute"
              style={{
                top: '12%',
                right: '4%',
                width: 'clamp(110px, 22vw, 150px)',
                height: 'clamp(110px, 22vw, 150px)',
                transform: 'rotate(-12deg)',
                background: '#FFD23F',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1F2A6B',
                textAlign: 'center',
                lineHeight: 1.05,
                padding: 14,
                boxShadow: '0 12px 30px rgba(0,0,0,0.35), inset 0 0 0 4px rgba(31,42,107,0.10)',
                border: '3px dashed rgba(31,42,107,0.35)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ fontSize: 'clamp(11px, 2.4vw, 13px)', opacity: 0.85 }}>{tHero('stampSmall')}</span>
              <span style={{ fontSize: 'clamp(15px, 3.2vw, 19px)', marginTop: 2 }}>{tHero('stampBig')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-POINT USP BAR — brand PNG icons inside a single .usp-panel container */}
      <section
        className="px-6 py-10 md:py-12"
        style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}
        aria-label="Why choose us"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="usp-panel rounded-2xl"
            style={{
              background: 'var(--brand-cream)',
              border: '1px solid var(--line)',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
            }}
          >
            {uspItems.map((item) => (
              <div
                key={item.icon}
                className="usp-cell flex flex-col md:flex-row md:items-center items-center text-center md:text-left gap-3 md:gap-4 p-4 rounded-xl"
                style={{ background: '#fff', border: '1px solid var(--line)' }}
              >
                <span
                  className="shrink-0 inline-flex items-center justify-center"
                  style={{ width: 56, height: 56 }}
                  aria-hidden="true"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/usp/${item.icon}.png`} alt={item.title} style={{ width: 56, height: 56, objectFit: 'contain' }} />
                </span>
                <div>
                  <h5 className="text-sm font-bold" style={{ color: 'var(--brand-ink)' }}>{item.title}</h5>
                  <h5 className="text-xs font-normal mt-0.5" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{item.sub}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAINT BRANDS STRIP */}
      <section className="px-6 py-10" style={{ background: '#fff', borderBottom: '1px solid var(--line)' }} aria-labelledby="brands-heading">
        <div className="max-w-6xl mx-auto text-center">
          <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>{tBrands('tag')}</h5>
          <h3 id="brands-heading" className="text-lg md:text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>{tBrands('heading')}</h3>
          <h5 className="text-xs font-normal mt-2 max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{tBrands('subheading')}</h5>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {[
              { src: '/images/paint-brands/nippon.png', alt: 'Nippon Paint' },
              { src: '/images/paint-brands/jotun.png', alt: 'Jotun' },
              { src: '/images/paint-brands/dulux.png', alt: 'Dulux' },
              { src: '/images/paint-brands/kcc.png', alt: 'KCC Paint' },
              { src: '/images/paint-brands/sissons.png', alt: 'Sissons' },
            ].map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={b.alt} src={b.src} alt={b.alt} style={{ height: 48, width: 'auto', objectFit: 'contain', filter: 'saturate(0.95)' }} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <HomePageClient phoneNumber={phone} />

      <SiteFooter locale={locale} />
    </>
  )
}
