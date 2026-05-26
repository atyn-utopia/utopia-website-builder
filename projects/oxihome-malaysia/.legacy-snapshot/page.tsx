import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site'
import { locations } from '@/config/locations'
import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber'
import { ProductSchema } from '@/components/schema/ProductSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { ReviewsCarousel } from '@/components/ReviewsCarousel'
import { CountdownStrip } from '@/components/CountdownStrip'

const WA_GREEN = '#25D366'

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
)


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `https://oxihome.my/${locale}`,
      languages: {
        en: 'https://oxihome.my/en',
        ms: 'https://oxihome.my/ms',
        zh: 'https://oxihome.my/zh',
        'x-default': 'https://oxihome.my/en',
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `https://oxihome.my/${locale}`,
      images: [{ url: 'https://oxihome.my/og-image.jpg', width: 1200, height: 630, alt: t('meta.ogImageAlt') }],
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'home' })
  const tp = await getTranslations({ locale, namespace: 'products' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const phone = await getPhoneNumber('all')
  const WA_LINK = waLink(phone, 'Hi Oxihome, I am interested in renting an oxygen machine.')

  const faqItems = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
    { question: t('faq.q7'), answer: t('faq.a7') },
  ]

  const WIX = 'https://static.wixstatic.com/media'

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

  return (
    <main>
      <ProductSchema />
      <FAQSchema faqs={faqItems} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Real photo background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src="https://static.wixstatic.com/media/d3104b_35b047fff2574ce5b0fa9c576d2ccf51~mv2.jpg/v1/fill/w_1440,h_1058,al_c,q_85,enc_auto/hero-bg.jpg"
            alt=""
            role="presentation"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(10,37,53,0.93) 0%, rgba(10,37,53,0.80) 45%, rgba(11,107,130,0.65) 100%)' }}
          />
        </div>
        {/* Radial accent glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 72% 40%, rgba(21,160,192,0.25) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Text column */}
          <div className="z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(21,160,192,0.15)', color: 'var(--brand-primary-lt)', border: '1px solid rgba(21,160,192,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {tc('sameDayDelivery')}
            </div>

            <h1
              className="font-display text-5xl md:text-6xl leading-tight mb-5 text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              {t('hero.h1')}
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {t('hero.sub')}
            </p>

            <a
              href={`/${locale}/redirect-whatsapp-1`}
                  target="_blank"
                  rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-bold px-7 py-4 rounded-full text-base text-white transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400"
              style={{ background: WA_GREEN, boxShadow: '0 8px 32px rgba(37,211,102,0.35)' }}
            >
              <WAIcon />
              {t('hero.cta')}
            </a>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 mt-7">
              {[tc('noDeposit'), tc('sameDayDelivery')].map(tag => (
                <div key={tag} className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <CheckIcon />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Hero image column with decorative elements */}
          <div className="relative flex items-center justify-center z-10">
            {/* Decorative orbs */}
            <div
              className="absolute w-72 h-72 rounded-full animate-orb pointer-events-none"
              aria-hidden="true"
              style={{ background: 'radial-gradient(circle, rgba(21,160,192,0.25) 0%, transparent 70%)', top: '-20%', right: '-10%' }}
            />
            <div
              className="absolute w-48 h-48 rounded-full animate-orb-slow pointer-events-none"
              aria-hidden="true"
              style={{ background: 'radial-gradient(circle, rgba(232,105,42,0.2) 0%, transparent 70%)', bottom: '0%', left: '5%' }}
            />

            {/* Decorative ring */}
            <div
              className="absolute w-80 h-80 rounded-full animate-ring pointer-events-none"
              aria-hidden="true"
              style={{ border: '1px dashed rgba(21,160,192,0.25)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
            <div
              className="absolute w-56 h-56 rounded-full pointer-events-none"
              aria-hidden="true"
              style={{ border: '1px solid rgba(255,255,255,0.07)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />

            {/* Stamp badges */}
            {[
              { label: '4H', sub: 'Delivery', top: '8%', left: '-2%', rotate: '-12deg' },
              { label: '96%', sub: 'O₂ Purity', bottom: '12%', left: '-4%', rotate: '10deg' },
              { label: 'No', sub: 'Deposit', top: '10%', right: '-2%', rotate: '14deg' },
            ].map((stamp, i) => (
              <div
                key={i}
                className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center text-center pointer-events-none z-20 select-none"
                style={{
                  ...(stamp.top ? { top: stamp.top } : {}),
                  ...(stamp.bottom ? { bottom: stamp.bottom } : {}),
                  ...(stamp.left ? { left: stamp.left } : {}),
                  ...(stamp.right ? { right: stamp.right } : {}),
                  transform: `rotate(${stamp.rotate})`,
                  background: 'rgba(11,107,130,0.9)',
                  border: '2px dashed rgba(255,255,255,0.5)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span className="text-white font-black text-xl leading-none">{stamp.label}</span>
                <span className="text-white text-[10px] font-semibold uppercase tracking-wide leading-tight mt-0.5 opacity-90">{stamp.sub}</span>
              </div>
            ))}

            {/* Decorative dots */}
            {[
              { top: '10%', right: '20%', delay: '0' },
              { top: '25%', right: '5%', delay: '1' },
              { bottom: '20%', right: '15%', delay: '0.5' },
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full pointer-events-none animate-dot-${i === 0 ? '' : i === 1 ? '2' : '3'}`}
                aria-hidden="true"
                style={{ ...pos as React.CSSProperties, background: 'var(--brand-primary-lt)', opacity: 0.7 }}
              />
            ))}

            {/* Product image */}
            <div className="relative animate-float">
              {/* Glow behind image */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(21,160,192,0.3) 0%, transparent 70%)', filter: 'blur(24px)', transform: 'scale(1.2)' }}
              />
              {/* Stamp frame */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: '-14px',
                  borderRadius: '28px',
                  border: '2px dashed rgba(21,160,192,0.5)',
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: '-28px',
                  borderRadius: '36px',
                  border: '1px solid rgba(21,160,192,0.2)',
                }}
              />
              {/* Corner stamps */}
              {[
                { top: '-8px', left: '-8px' },
                { top: '-8px', right: '-8px' },
                { bottom: '-8px', left: '-8px' },
                { bottom: '-8px', right: '-8px' },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-5 h-5 rounded-sm pointer-events-none"
                  style={{
                    ...pos as React.CSSProperties,
                    background: 'var(--brand-primary-lt)',
                    opacity: 0.7,
                  }}
                />
              ))}
              <img
                src="https://static.wixstatic.com/media/b0f7ef_84d13101bba64c58a8f2b96f966cd98a~mv2.png/v1/fill/w_500,h_500,al_c,q_90,enc_auto/mesin-oksigen.png"
                alt="OxiHome 5L oxygen concentrator — medical-grade home oxygen machine available for rent or purchase in Malaysia"
                width={420}
                height={420}
                className="relative rounded-3xl"
                style={{
                  boxShadow: '0 32px 80px rgba(10,37,53,0.6), 0 8px 24px rgba(11,107,130,0.4)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <CountdownStrip
        waLink={`/${locale}/redirect-whatsapp-1`}
        label={locale === 'ms' ? '⚡ Tawaran Hari Ini Tamat Dalam:' : locale === 'zh' ? '⚡ 今日优惠倒计时：' : '⚡ Today\'s delivery slots close in:'}
      />

      {/* ── STATS BAR ── */}
      <section style={{ background: 'var(--brand-primary)', color: 'white' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '127', label: t('stats.locations') },
            { value: '4H', label: t('stats.delivery') },
            { value: 'RM250', label: t('stats.price') },
            { value: '96%', label: t('stats.purity') },
          ].map(stat => (
            <div key={stat.value} className="flex flex-col items-center text-center py-2">
              <span className="font-display text-3xl font-normal leading-none" style={{ letterSpacing: '-0.02em' }}>
                {stat.value}
              </span>
              <span className="text-xs mt-1 leading-snug opacity-85">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── RISK / PROBLEM SECTION ── */}
      <section className="py-20 px-6" style={{ background: 'var(--brand-dark)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
            style={{ background: 'rgba(232,105,42,0.15)', color: '#F59068', border: '1px solid rgba(232,105,42,0.3)' }}
          >
            {locale === 'ms' ? 'Penting' : locale === 'zh' ? '重要提醒' : 'Important'}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
            {t('risk.h2')}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <p>{t('risk.p1')}</p>
            <p>{t('risk.p2')}</p>
          </div>
          <p className="mt-6 text-lg font-semibold" style={{ color: 'var(--brand-primary-lt)' }}>
            {t('risk.p3')}
          </p>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="py-20 px-6" style={{ background: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl text-center mb-12" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            {t('products.h2')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative flex flex-col rounded-2xl p-6 transition-transform hover:-translate-y-1"
                style={{
                  background: 'var(--brand-white)',
                  boxShadow: product.highlight
                    ? '0 8px 40px rgba(11,107,130,0.18), 0 2px 8px rgba(11,107,130,0.1)'
                    : '0 4px 20px rgba(10,37,53,0.08)',
                  border: product.highlight ? '2px solid var(--brand-primary)' : '1px solid var(--brand-border)',
                }}
              >
                {product.badge && (
                  <div
                    className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      background: product.highlight ? 'var(--brand-primary)' : 'var(--brand-accent)',
                    }}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Product image */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-4" style={{ background: 'var(--brand-primary-xs)' }}>
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    width={320}
                    height={320}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <h3 className="font-display text-lg leading-tight mb-2" style={{ color: 'var(--brand-dark)', minHeight: '3.5rem' }}>
                  {product.name}
                </h3>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--brand-text-muted)', minHeight: '4rem' }}>
                  {product.desc}
                </p>

                {/* Pricing */}
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
                      <span className="text-sm font-semibold" style={{ color: 'var(--brand-accent)' }}>
                        {tc('buyAt')} {product.buyPrice}
                      </span>
                      {product.savings && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: 'var(--brand-accent-lt)', color: 'var(--brand-accent)' }}>
                          {product.savings}
                        </span>
                      )}
                    </div>
                  )}
                  {product.installment && (
                    <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                      {tc('installment')}: {product.installment}
                    </p>
                  )}
                  {product.extras && product.extras.map(e => (
                    <p key={e} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--brand-primary)' }}>
                      <CheckIcon /> {e}
                    </p>
                  ))}
                </div>

                <a
                  href={`/${locale}/redirect-whatsapp-1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm text-white transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400"
                  style={{ background: WA_GREEN }}
                >
                  <WAIcon />
                  {tc('whatsappOrder')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6" style={{ background: 'var(--brand-dark)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl text-center mb-14" style={{ color: 'var(--brand-white)', letterSpacing: '-0.02em' }}>
            {t('how.h2')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: t('how.step1Title'), desc: t('how.step1Desc'), icon: '💬' },
              { num: '02', title: t('how.step2Title'), desc: t('how.step2Desc'), icon: '📋' },
              { num: '03', title: t('how.step3Title'), desc: t('how.step3Desc'), icon: '🚚' },
            ].map(step => (
              <div key={step.num} className="relative flex flex-col items-start rounded-2xl p-7" style={{ background: 'var(--brand-dark-mid)' }}>
                {/* Step number */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white mb-4"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  {step.num}
                </div>
                <h3 className="font-display text-xl mb-2" style={{ color: 'var(--brand-white)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-20 overflow-hidden" style={{ background: 'var(--brand-surface)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center mb-12" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            {t('reviews.h2')}
          </h2>
        </div>
        <ReviewsCarousel reviews={[
          { text: t('reviews.r1'), name: t('reviews.r1name'), city: t('reviews.r1city') },
          { text: t('reviews.r2'), name: t('reviews.r2name'), city: t('reviews.r2city') },
          { text: t('reviews.r3'), name: t('reviews.r3name'), city: t('reviews.r3city') },
          { text: t('reviews.r4'), name: t('reviews.r4name'), city: t('reviews.r4city') },
          { text: t('reviews.r5'), name: t('reviews.r5name'), city: t('reviews.r5city') },
          { text: t('reviews.r6'), name: t('reviews.r6name'), city: t('reviews.r6city') },
          { text: t('reviews.r7'), name: t('reviews.r7name'), city: t('reviews.r7city') },
          { text: t('reviews.r8'), name: t('reviews.r8name'), city: t('reviews.r8city') },
          { text: t('reviews.r9'), name: t('reviews.r9name'), city: t('reviews.r9city') },
        ]} />
      </section>

      {/* ── CUSTOMER GALLERY ── */}
      <section className="py-20 px-6" style={{ background: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl text-center mb-3" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            {locale === 'ms' ? 'Galeri Pelanggan Kami' : locale === 'zh' ? '客户照片' : 'Customer Gallery'}
          </h2>
          <p className="text-center text-base mb-10 max-w-lg mx-auto" style={{ color: 'var(--brand-text-muted)' }}>
            {locale === 'ms'
              ? 'Lihat bagaimana mesin oksigen Oxihome digunakan oleh keluarga di seluruh Malaysia.'
              : locale === 'zh'
              ? '看看马来西亚各地家庭如何使用Oxihome氧气机。'
              : 'See how Oxihome oxygen machines are used by families across Malaysia.'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {galleryImages.map((src, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
                style={{ boxShadow: '0 2px 8px rgba(10,37,53,0.08)' }}
              >
                <img
                  src={src}
                  alt="Rental Oxygen Concentrator Sewa Mesin Oksigen customer photo"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OXIHOME ── */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src="https://static.wixstatic.com/media/d3104b_35b047fff2574ce5b0fa9c576d2ccf51~mv2.jpg/v1/fill/w_1440,h_900,al_c,q_85,enc_auto/why-bg.jpg"
            alt=""
            role="presentation"
            className="w-full h-full object-cover object-bottom"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(10,37,53,0.95) 0%, rgba(13,51,71,0.90) 100%)' }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
              {t('why.h2')}
            </h2>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <p>{t('why.p1')}</p>
              <p>{t('why.p2')}</p>
            </div>
            <a
              href={`/${locale}/redirect-whatsapp-1`}
                  target="_blank"
                  rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mt-7 font-bold px-7 py-4 rounded-full text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: WA_GREEN, boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}
            >
              <WAIcon />
              {t('hero.cta')}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '⚡', value: '4H', label: locale === 'ms' ? 'Penghantaran' : locale === 'zh' ? '送货时效' : 'Delivery' },
              { icon: '📍', value: '127', label: locale === 'ms' ? 'Lokasi' : locale === 'zh' ? '服务地区' : 'Locations' },
              { icon: '💚', value: '96%', label: locale === 'ms' ? 'Ketulenan O₂' : locale === 'zh' ? '氧气纯度' : 'O₂ Purity' },
              { icon: '🏠', value: '0', label: locale === 'ms' ? 'Deposit' : locale === 'zh' ? '押金' : 'Deposit' },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-display text-3xl text-white" style={{ letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section id="locations" className="py-20 px-6" style={{ background: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl text-center mb-3" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            {t('locations.h2')}
          </h2>
          <p className="text-center text-base mb-10 max-w-xl mx-auto" style={{ color: 'var(--brand-text-muted)' }}>
            {t('locations.sub')}
          </p>
          {/* Group by state */}
          {(() => {
            const stateOrder = [
              'Kuala Lumpur', 'Selangor', 'Johor', 'Pulau Pinang', 'Perak',
              'Kedah', 'Kelantan', 'Terengganu', 'Pahang', 'Negeri Sembilan',
              'Melaka', 'Perlis', 'Sabah', 'Sarawak',
            ]
            const grouped = locations.reduce<Record<string, typeof locations>>((acc, loc) => {
              if (!acc[loc.state]) acc[loc.state] = []
              acc[loc.state].push(loc)
              return acc
            }, {})
            const orderedStates = [
              ...stateOrder.filter(s => grouped[s]),
              ...Object.keys(grouped).filter(s => !stateOrder.includes(s)).sort(),
            ]
            return (
              <div className="space-y-8">
                {orderedStates.map(state => {
                  const sorted = [...grouped[state]].sort((a, b) => {
                    if (a.displayName === state) return -1
                    if (b.displayName === state) return 1
                    return 0
                  })
                  return (
                  <div key={state}>
                    <h3
                      className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      <span className="h-px flex-1" style={{ background: 'var(--brand-border)' }} />
                      {state}
                      <span className="h-px flex-1" style={{ background: 'var(--brand-border)' }} />
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sorted.map(loc => (
                        <a
                          key={loc.slug}
                          href={`/${locale}/oxygen-machine/${loc.slug}`}
                          className="location-link px-3 py-2 rounded-xl text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-teal-400"
                          style={{
                            background: 'var(--brand-white)',
                            border: '1px solid',
                            boxShadow: '0 1px 4px rgba(10,37,53,0.05)',
                          }}
                        >
                          {t('locations.linkPrefix')} {loc.displayName}
                        </a>
                      ))}
                    </div>
                  </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl text-center mb-12" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            {t('faq.h2')}
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
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                    style={{ color: 'var(--brand-primary)' }}
                  >
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

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Background image + dark overlay */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src="https://static.wixstatic.com/media/d3104b_c54d3854dbb44b9ebd369f9c9e15187d~mv2.jpg/v1/fill/w_1905,h_852,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d3104b_c54d3854dbb44b9ebd369f9c9e15187d~mv2.jpg"
            alt=""
            role="presentation"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,37,53,0.92) 0%, rgba(11,107,130,0.80) 100%)' }} />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl mb-8"
            style={{ background: 'rgba(11,107,130,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <span className="text-xl">😊</span>
            <div className="text-left">
              <p className="text-white text-sm font-bold leading-tight">
                {locale === 'ms' ? '2,400+ Keluarga' : locale === 'zh' ? '2,400+ 家庭' : '2,400+ Families'}
              </p>
              <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {locale === 'ms' ? 'Sudah mempercayai Oxihome' : locale === 'zh' ? '已信任 Oxihome' : 'already trust Oxihome'}
              </p>
            </div>
          </div>

          {/* CTA text */}
          <div className="flex flex-col justify-center text-center">
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              {t('cta.h2')}
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {t('cta.sub')}
            </p>
            <div>
              <a
                href={`/${locale}/redirect-whatsapp-1`}
                  target="_blank"
                  rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base text-white transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400"
                style={{ background: WA_GREEN, boxShadow: '0 8px 32px rgba(37,211,102,0.4)' }}
              >
                <WAIcon />
                {t('cta.btn')}
              </a>
            </div>
            {/* Small trust nudges */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {[
                locale === 'ms' ? '✓ Tanpa Deposit' : locale === 'zh' ? '✓ 无需押金' : '✓ No deposit',
                locale === 'ms' ? '✓ Penghantaran 4 Jam' : locale === 'zh' ? '✓ 4小时送达' : '✓ 4-hour delivery',
                locale === 'ms' ? '✓ Boleh Dipercayai' : locale === 'zh' ? '✓ 值得信赖' : '✓ Trusted care',
              ].map(tag => (
                <span key={tag} className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>

  )
}
