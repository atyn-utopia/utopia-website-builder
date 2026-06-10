import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { locations, getNearbyLocations } from '@/config/locations'
import { siteConfig } from '@/config/site'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import FomoBanner from '@/components/FomoBanner'
import PageStyles from '@/components/PageStyles'
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker'
import { ReviewsCarousel } from '@/components/ReviewsCarousel'
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'

const WA_GREEN = '#25D366'

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0" style={{ color: 'var(--brand-primary)' }}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
)

type Params = { locale: string; location: string }

export async function generateStaticParams() {
  const params: Params[] = []
  for (const locale of routing.locales) {
    for (const loc of locations) {
      params.push({ locale, location: loc.slug })
    }
  }
  return params
}


export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, location } = await params
  const locationData = locations.find(l => l.slug === location)
  if (!locationData) return {}

  const t = await getTranslations({ locale, namespace: 'location' })
  const cityName = locationData.displayName

  return {
    title: t('meta.title', { city: cityName }),
    description: t('meta.description', { city: cityName }),
    alternates: seoAlternates(locale, `/oxygen-machine/${location}`),
    openGraph: {
      title: t('meta.title', { city: cityName }),
      description: t('meta.description', { city: cityName }),
      url: `https://oxihome.my/${locale}/oxygen-machine/${location}`,
      images: [{ url: 'https://oxihome.my/og-image.jpg', width: 1200, height: 630, alt: t('meta.ogImageAlt', { city: cityName }) }],
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { locale, location } = await params

  const locationData = locations.find(l => l.slug === location)
  if (!locationData) notFound()

  const cityName = locationData.displayName
  const stateName = locationData.state

  const { phone: phoneNumber } = await getPhoneNumber(location)

  const t  = await getTranslations({ locale, namespace: 'location' })
  const tp = await getTranslations({ locale, namespace: 'products' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const th = await getTranslations({ locale, namespace: 'home' })

  const nearbyLocs = getNearbyLocations(location)

  const faqItems = [
    { question: t('faq.q1', { city: cityName }), answer: t('faq.a1', { city: cityName }) },
    { question: t('faq.q2', { city: cityName }), answer: t('faq.a2', { city: cityName }) },
    { question: t('faq.q3', { city: cityName }), answer: t('faq.a3', { city: cityName }) },
    { question: t('faq.q4', { city: cityName }), answer: t('faq.a4', { city: cityName }) },
    { question: t('faq.q5', { city: cityName }), answer: t('faq.a5', { city: cityName }) },
  ]

  const WIX = 'https://static.wixstatic.com/media'

  const galleryImages = [
    `${WIX}/d3104b_0f13a4f64be14a9fb1e74942a4af5ea1~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g1.png`,
    `${WIX}/d3104b_56d4ea78d863418c84ee73a8e8d58b75~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g2.png`,
    `${WIX}/d3104b_a88449d5f2c6425e87d6d4cd0b1fb239~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g3.png`,
    `${WIX}/d3104b_f9de524aaf8f4cd28c5b26a0b7d227b0~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g4.png`,
    `${WIX}/d3104b_5c58f3e9b77a4370a792bc65a616a00d~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g5.png`,
    `${WIX}/d3104b_73a24372e90d4d40b7e981043119bf7c~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g6.png`,
    `${WIX}/d3104b_01a2506e092745b5b7b60c6e01b80654~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g7.png`,
    `${WIX}/d3104b_f295d191dafe4cc4a944505733cf918c~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g8.png`,
    `${WIX}/d3104b_1795b71be2ec44b39163e5a7a63274f0~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g9.png`,
    `${WIX}/d3104b_d30845e269474972ab0469465d9e02c7~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g10.png`,
    `${WIX}/d3104b_027e3d0194b64821a1684a6df0456558~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g11.png`,
    `${WIX}/d3104b_27a7c0a3095348a0b5aab1f9fd0f18ce~mv2.png/v1/fill/w_400,h_400,al_c,q_85,enc_auto/g12.png`,
  ]

  type Product = {
    id: string
    name: string
    desc: string
    image: string
    imageAlt: string
    rentPrice?: string
    buyPrice?: string
    installment?: string
    marketPrice?: string
    savings?: string
    badge?: string
    highlight?: boolean
    extras?: string[]
  }

  const products: Product[] = [
    {
      id: 'mesin-5l',
      name: tp('mesin5l.name'),
      desc: tp('mesin5l.desc'),
      image: `${WIX}/b0f7ef_84d13101bba64c58a8f2b96f966cd98a~mv2.png/v1/fill/w_320,h_320,al_c,q_85,enc_auto/mesin-5l.png`,
      imageAlt: 'OxiHome Mesin 5L oxygen concentrator with nasal cannula and humidifier bottle',
      rentPrice: 'RM250/mo',
      buyPrice: 'RM2,599',
      installment: 'RM279 × 10 mo',
      marketPrice: 'RM3,200',
      savings: 'Save RM601',
      badge: locale === 'ms' ? 'Paling Popular' : locale === 'zh' ? '最受欢迎' : 'Most Popular',
      highlight: true,
    },
    {
      id: 'tangki',
      name: tp('tangki.name'),
      desc: tp('tangki.desc'),
      image: `${WIX}/d3104b_83a1e346f88542bea4af1fc55ee1b941~mv2.png/v1/fill/w_320,h_320,al_c,q_85,enc_auto/tangki.png`,
      imageAlt: '10-litre emergency oxygen tank by Oxihome for home backup use',
      rentPrice: 'RM90/mo',
      marketPrice: 'RM150',
      savings: 'Save RM60',
    },
    {
      id: 'combo',
      name: tp('combo.name'),
      desc: tp('combo.desc'),
      image: `${WIX}/b0f7ef_f5648d945f6b44758ff1f504e089b1a3~mv2.png/v1/fill/w_320,h_320,al_c,q_85,enc_auto/combo.png`,
      imageAlt: 'Oxihome value combo package — oxygen concentrator, emergency tank, and free oximeter',
      rentPrice: 'RM320/mo',
      badge: locale === 'ms' ? 'Nilai Terbaik' : locale === 'zh' ? '超值套餐' : 'Best Value',
      extras: [tc('freeOximeter'), tc('sameDayDelivery')],
    },
    {
      id: 'oximeter',
      name: tp('oximeter.name'),
      desc: tp('oximeter.desc'),
      image: `${WIX}/d3104b_b1603a4e8c81438e852a19a57cc94b77~mv2.png/v1/fill/w_320,h_320,al_c,q_85,enc_auto/oximeter.png`,
      imageAlt: 'Oxihome pulse oximeter for checking blood oxygen levels at home',
      buyPrice: 'RM40',
      marketPrice: 'RM60',
      savings: 'Save RM20',
    },
  ]

  return (
    <>
      <FomoBanner />
      <SiteHeader />
      <PageStyles />
      <main>
      <LocalBusinessSchema
        cityName={cityName}
        stateName={stateName}
        locationSlug={location}
        locale={locale}
        phoneNumber={phoneNumber}
      />
      <FAQSchema faqs={faqItems} />
      <BreadcrumbSchema locale={locale} cityName={cityName} locationSlug={location} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: '60vh' }}>
        {/* Real photo background */}
        <div className="absolute inset-0 pointer-events-none" role="img" aria-label={`Oxihome oxygen machine ready for delivery in ${cityName}, Malaysia`}>
          <img
            src="https://static.wixstatic.com/media/d3104b_35b047fff2574ce5b0fa9c576d2ccf51~mv2.jpg/v1/fill/w_1440,h_1058,al_c,q_85,enc_auto/hero-bg.jpg"
            alt={`Oxihome oxygen machine ready for delivery in ${cityName}, Malaysia`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,37,53,0.93) 0%, rgba(10,37,53,0.80) 45%, rgba(11,107,130,0.65) 100%)' }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 72% 40%, rgba(21,160,192,0.25) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto w-full px-6 py-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <a href={`/${locale}`} className="hover:text-white transition-colors">{t('breadcrumb.home')}</a>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{t('breadcrumb.page', { city: cityName })}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{ background: 'rgba(21,160,192,0.15)', color: 'var(--brand-primary-lt)', border: '1px solid rgba(21,160,192,0.3)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {stateName}
              </div>
              <h1 className="font-display text-4xl md:text-5xl leading-tight text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                {t('hero.h1', { city: cityName })}
              </h1>
              <h5 className="text-base leading-relaxed mb-6 max-w-md" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {t('hero.sub', { city: cityName })}
              </h5>
              <a href={`/${locale}/redirect-whatsapp-1`}
                  target="_blank"
                  rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-bold px-7 py-4 rounded-full text-base text-white transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400"
                style={{ background: WA_GREEN, boxShadow: '0 8px 32px rgba(37,211,102,0.35)' }}>
                <WAIcon />
                {t('hero.cta', { city: cityName })}
              </a>
            </div>

            {/* Hero image with stamp frame + badges */}
            <div className="relative flex items-center justify-center z-10">
              {/* Orbs */}
              <div className="absolute w-72 h-72 rounded-full animate-orb pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(21,160,192,0.25) 0%, transparent 70%)', top: '-20%', right: '-10%' }} />
              <div className="absolute w-48 h-48 rounded-full animate-orb-slow pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(232,105,42,0.2) 0%, transparent 70%)', bottom: '0%', left: '5%' }} />
              {/* Ring */}
              <div className="absolute w-80 h-80 rounded-full animate-ring pointer-events-none"
                style={{ border: '1px dashed rgba(21,160,192,0.25)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              {/* Stamp badges */}
              {[
                { label: '4H',  sub: 'Delivery', top: '8%',    left: '-2%',  rotate: '-12deg' },
                { label: '96%', sub: 'O₂ Purity', bottom: '12%', left: '-4%', rotate: '10deg' },
                { label: 'No',  sub: 'Deposit',   top: '10%',  right: '-2%', rotate: '14deg' },
              ].map((stamp, i) => (
                <div key={i} className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center text-center pointer-events-none z-20"
                  style={{
                    ...(stamp.top    ? { top:    stamp.top    } : {}),
                    ...(stamp.bottom ? { bottom: stamp.bottom } : {}),
                    ...(stamp.left   ? { left:   stamp.left   } : {}),
                    ...(stamp.right  ? { right:  stamp.right  } : {}),
                    transform: `rotate(${stamp.rotate})`,
                    background: 'rgba(11,107,130,0.9)',
                    border: '2px dashed rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  }}>
                  <span className="text-white font-black text-xl leading-none">{stamp.label}</span>
                  <span className="text-white text-[10px] font-semibold uppercase tracking-wide leading-tight mt-0.5 opacity-90">{stamp.sub}</span>
                </div>
              ))}
              {/* Product image with stamp frame */}
              <div className="relative animate-float">
                <div className="absolute pointer-events-none" style={{ inset: '-14px', borderRadius: '28px', border: '2px dashed rgba(21,160,192,0.5)' }} />
                <div className="absolute pointer-events-none" style={{ inset: '-28px', borderRadius: '36px', border: '1px solid rgba(21,160,192,0.2)' }} />
                {[{ top: '-8px', left: '-8px' }, { top: '-8px', right: '-8px' }, { bottom: '-8px', left: '-8px' }, { bottom: '-8px', right: '-8px' }].map((pos, i) => (
                  <div key={i} className="absolute w-5 h-5 rounded-sm pointer-events-none"
                    style={{ ...pos as React.CSSProperties, background: 'var(--brand-primary-lt)', opacity: 0.7 }} />
                ))}
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(21,160,192,0.3) 0%, transparent 70%)', filter: 'blur(24px)', transform: 'scale(1.2)' }} />
                <img
                  src="https://static.wixstatic.com/media/b0f7ef_84d13101bba64c58a8f2b96f966cd98a~mv2.png/v1/fill/w_500,h_500,al_c,q_90,enc_auto/mesin-oksigen.png"
                  alt={`Oxygen machine delivery in ${cityName} — Oxihome same-day 4-hour delivery service`}
                  width={380} height={380}
                  className="relative rounded-3xl"
                  style={{ boxShadow: '0 32px 80px rgba(10,37,53,0.6), 0 8px 24px rgba(11,107,130,0.4)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS / USP BAR (mirrors homepage) ── */}
      <section className="usp-bar" style={{ background: 'var(--brand-primary)', color: 'white' }}>
        <div className="usp-panel max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '4H', label: tc('sameDayDelivery') },
            { value: 'RM250', label: locale === 'ms' ? 'Sewa dari' : locale === 'zh' ? '每月起租' : 'Rent from' },
            { value: '96%', label: locale === 'ms' ? 'Ketulenan O₂' : locale === 'zh' ? 'O₂纯度' : 'O₂ Purity' },
            { value: '0', label: locale === 'ms' ? 'Deposit' : locale === 'zh' ? '押金' : 'Deposit' },
          ].map(stat => (
            <div key={stat.value} className="usp-cell flex flex-col items-center text-center py-2">
              <span className="font-display text-2xl leading-none">{stat.value}</span>
              <span className="text-xs mt-1 opacity-85">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTRO PARAGRAPH ── */}
      <section className="py-12 px-6" style={{ background: 'var(--brand-surface)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h5 className="text-lg leading-relaxed" style={{ color: 'var(--brand-text)' }}>
            {t('intro', { city: cityName })}
          </h5>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display text-3xl text-center mb-10"
            style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}
          >
            {locale === 'ms'
              ? `Produk Tersedia di ${cityName}`
              : locale === 'zh'
              ? `${cityName}可购产品`
              : `Products Available in ${cityName}`}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map(product => (
              <div
                key={product.id}
                className="relative flex flex-col rounded-2xl p-5 transition-transform hover:-translate-y-1"
                style={{
                  background: 'var(--brand-white)',
                  boxShadow: product.highlight
                    ? '0 8px 40px rgba(11,107,130,0.18)'
                    : '0 4px 20px rgba(10,37,53,0.07)',
                  border: product.highlight ? '2px solid var(--brand-primary)' : '1px solid var(--brand-border)',
                }}
              >
                {product.badge && (
                  <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: product.highlight ? 'var(--brand-primary)' : 'var(--brand-accent)' }}>
                    {product.badge}
                  </div>
                )}
                {/* Product image */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-4" style={{ background: 'var(--brand-primary-xs)' }}>
                  <img src={product.image} alt={product.imageAlt} width={320} height={320} className="w-full h-full object-contain p-2" />
                </div>
                <h3 className="font-display text-lg leading-tight mb-2" style={{ color: 'var(--brand-dark)', minHeight: '3.5rem' }}>
                  {product.name}
                </h3>
                <h5 className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--brand-text-muted)', minHeight: '4rem' }}>
                  {product.desc}
                </h5>
                <div className="space-y-1.5 mb-4">
                  {product.rentPrice && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>{product.rentPrice}</span>
                      {product.marketPrice && (
                        <span className="text-xs line-through" style={{ color: 'var(--brand-text-muted)' }}>{product.marketPrice}</span>
                      )}
                    </div>
                  )}
                  {product.buyPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: 'var(--brand-accent)' }}>{tc('buyAt')} {product.buyPrice}</span>
                      {product.savings && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: 'var(--brand-accent-lt)', color: 'var(--brand-accent)' }}>
                          {product.savings}
                        </span>
                      )}
                    </div>
                  )}
                  {product.installment && (
                    <h5 className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{tc('installment')}: {product.installment}</h5>
                  )}
                  {product.extras && product.extras.map(e => (
                    <h5 key={e} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--brand-primary)' }}>
                      <CheckIcon /> {e}
                    </h5>
                  ))}
                </div>
                <a href={`/${locale}/redirect-whatsapp-1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm text-white transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400"
                  style={{ background: WA_GREEN }}>
                  <WAIcon />
                  {tc('whatsappOrder')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE IN CITY ── */}
      <section className="relative overflow-hidden py-16 px-6">
        <div className="absolute inset-0 pointer-events-none" role="img" aria-label={`Oxihome oxygen machine at a Malaysian home in ${cityName}`}>
          <img src="https://static.wixstatic.com/media/d3104b_c54d3854dbb44b9ebd369f9c9e15187d~mv2.jpg/v1/fill/w_1440,h_900,al_c,q_85,enc_auto/why-bg.jpg" alt="Oxihome oxygen machine at a Malaysian home" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,37,53,0.96) 0%, rgba(13,51,71,0.92) 100%)' }} />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-8" style={{ letterSpacing: '-0.02em' }}>
            {t('why.h2', { city: cityName })}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: t('why.b1title', { city: cityName }), desc: t('why.b1desc', { city: cityName }) },
              { title: t('why.b2title'), desc: t('why.b2desc') },
              { title: t('why.b3title'), desc: t('why.b3desc') },
              { title: t('why.b4title'), desc: t('why.b4desc', { city: cityName }) },
            ].map(item => (
              <div
                key={item.title}
                className="flex gap-4 p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <CheckIcon />
                <div>
                  <h5 className="font-semibold text-white text-sm mb-1">{item.title}</h5>
                  <h5 className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.desc}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS (mirrors homepage) ── */}
      <section className="py-20 overflow-hidden" style={{ background: 'var(--brand-surface)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="font-display text-3xl md:text-4xl text-center mb-12" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            {locale === 'ms'
              ? `Apa Kata Pelanggan di ${cityName}`
              : locale === 'zh'
              ? `${cityName}客户怎么说`
              : `What Customers in ${cityName} Say`}
          </h3>
        </div>
        <ReviewsCarousel reviews={[
          { text: th('reviews.r1'), name: th('reviews.r1name'), city: th('reviews.r1city') },
          { text: th('reviews.r2'), name: th('reviews.r2name'), city: th('reviews.r2city') },
          { text: th('reviews.r3'), name: th('reviews.r3name'), city: th('reviews.r3city') },
          { text: th('reviews.r4'), name: th('reviews.r4name'), city: th('reviews.r4city') },
          { text: th('reviews.r5'), name: th('reviews.r5name'), city: th('reviews.r5city') },
          { text: th('reviews.r6'), name: th('reviews.r6name'), city: th('reviews.r6city') },
          { text: th('reviews.r7'), name: th('reviews.r7name'), city: th('reviews.r7city') },
          { text: th('reviews.r8'), name: th('reviews.r8name'), city: th('reviews.r8city') },
          { text: th('reviews.r9'), name: th('reviews.r9name'), city: th('reviews.r9city') },
        ]} />
      </section>

      {/* ── CUSTOMER GALLERY (mirrors homepage) ── */}
      <section className="py-20 px-6" style={{ background: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="font-display text-3xl md:text-4xl text-center mb-3" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            {locale === 'ms' ? 'Galeri Pelanggan Kami' : locale === 'zh' ? '客户照片' : 'Customer Gallery'}
          </h3>
          <h5 className="text-center text-base mb-10 max-w-lg mx-auto" style={{ color: 'var(--brand-text-muted)' }}>
            {locale === 'ms'
              ? `Lihat bagaimana mesin oksigen Oxihome digunakan oleh keluarga di ${cityName} dan seluruh Malaysia.`
              : locale === 'zh'
              ? `看看${cityName}及马来西亚各地家庭如何使用Oxihome氧气机。`
              : `See how Oxihome oxygen machines are used by families in ${cityName} and across Malaysia.`}
          </h5>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {galleryImages.map((src, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
                style={{ boxShadow: '0 2px 8px rgba(10,37,53,0.08)' }}
              >
                <img
                  src={src}
                  alt={`Oxihome oxygen machine customer photo in ${cityName}, Malaysia`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6" style={{ background: 'var(--brand-surface)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-10" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            {t('faq.h2', { city: cityName })}
          </h2>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--brand-border)', background: 'var(--brand-white)' }}
              >
                <summary
                  className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none font-semibold text-sm list-none"
                  style={{ color: 'var(--brand-dark)' }}
                >
                  {faq.question}
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" style={{ color: 'var(--brand-primary)' }}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--brand-text-muted)', borderTop: '1px solid var(--brand-border)' }}>
                  <div className="pt-4">{faq.answer}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEARBY LOCATIONS ── */}
      {nearbyLocs.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="font-display text-2xl mb-6 text-center" style={{ color: 'var(--brand-dark)' }}>
              {t('nearby.h3')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyLocs.map(loc => (
                <a
                  key={loc.slug}
                  href={`/${locale}/oxygen-machine/${loc.slug}`}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  style={{
                    background: 'var(--brand-surface)',
                    color: 'var(--brand-primary)',
                    border: '1px solid var(--brand-border)',
                  }}
                >
                  {t('nearby.linkPrefix')} {loc.displayName}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="py-16 px-6 text-center" style={{ background: 'var(--brand-primary)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            {t('cta.h2', { city: cityName })}
          </h2>
          <h5 className="text-base leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {t('cta.sub', { city: cityName })}
          </h5>
          <a
            href={`/${locale}/redirect-whatsapp-1`}
                  target="_blank"
                  rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base text-white transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/40"
            style={{ background: WA_GREEN, boxShadow: '0 8px 32px rgba(37,211,102,0.4)' }}
          >
            <WAIcon />
            {t('cta.btn')}
          </a>
        </div>
      </section>
    </main>
      <SiteFooter locale={locale} />
    </>
  )
}
