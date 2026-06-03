'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { locations as locationConfig } from '@/config/locations'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker'

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)

const GoogleStarIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
    <path d="M8 1l1.854 4.146H14l-3.382 2.708 1.236 4.146L8 9.708l-3.854 2.292 1.236-4.146L2 5.146h4.146L8 1z" fill="#FBBC04" />
  </svg>
)

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0 transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: '#142C50' }} fill="none" aria-hidden="true">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function waRedirect(locale: string, message?: string, location?: string) {
  const params = new URLSearchParams()
  if (message) params.set('message', message)
  if (location) params.set('location', location)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}

const productKeys = [
  { key: 'interior', slug: 'interior' },
  { key: 'exterior', slug: 'exterior' },
  { key: 'ceiling', slug: 'ceiling' },
  { key: 'epoxy', slug: 'epoxy' },
  { key: 'fence', slug: 'fence' },
  { key: 'weathershield', slug: 'weathershield' },
]

const reasonKeys = ['reason1', 'reason2', 'reason3', 'reason4', 'reason5', 'reason6']
const faqIndexes = [1, 2, 3, 4, 5, 6, 7, 8]
const reviewIndexes = [1, 2, 3, 4, 5, 6]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(20,28,48,0.10)' }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer text-sm font-semibold" style={{ color: '#142C50' }} aria-expanded={open}>
        <span className="pr-4">{q}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '500px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <h5 className="pb-4 text-sm font-normal" style={{ color: '#5B6478', lineHeight: 1.6 }}>{a}</h5>
      </div>
    </div>
  )
}

function LocationAccordion({ regionName, cities, citiesLabel, defaultOpen, locale }: { regionName: string; cities: { slug: string; name: string }[]; citiesLabel: string; defaultOpen: boolean; locale: string }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: open ? '1.5px solid #142C50' : '1.5px solid rgba(20,28,48,0.12)', background: '#fff' }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer text-sm font-semibold" style={{ color: '#142C50', borderLeft: open ? '4px solid #142C50' : '4px solid transparent' }} aria-expanded={open}>
        <span>{regionName}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-normal" style={{ color: '#5B6478' }}>{cities.length} {citiesLabel}</span>
          <ChevronIcon open={open} />
        </div>
      </button>
      <div style={{ maxHeight: open ? '600px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div className="px-5 pb-5 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cities.map((city) => (
              <a key={city.slug} href={`/${locale}/cat-rumah/${city.slug}`} className="text-xs font-normal px-3 py-1.5 rounded-lg hover:opacity-80" style={{ background: 'rgba(20,28,48,0.06)', color: '#142C50' }}>
                {city.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
    }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function FadeSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeUp()
  return <div ref={ref} className={`fade-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

type Props = { phoneNumber: string }

export default function HomePageClient({ phoneNumber }: Props) {
  const locale = useLocale()
  const t = useTranslations('home')
  const tBlog = useTranslations('blog')
  const WA_LINK = waRedirect(locale)

  const regionGroups: { name: string; nameMs: string; nameZh: string; cities: string[] }[] = [
    { name: 'Klang Valley', nameMs: 'Lembah Klang', nameZh: '巴生谷', cities: ['kuala-lumpur', 'petaling-jaya', 'shah-alam', 'subang-jaya', 'puchong', 'cheras', 'ampang', 'klang', 'kajang', 'cyberjaya', 'putrajaya'] },
    { name: 'Southern Malaysia', nameMs: 'Selatan Malaysia', nameZh: '马来西亚南部', cities: ['seremban', 'melaka', 'johor-bahru'] },
    { name: 'Northern Malaysia', nameMs: 'Utara Malaysia', nameZh: '马来西亚北部', cities: ['ipoh', 'george-town'] },
  ]

  return (
    <main>
      {/* PRODUCTS */}
      <section id="products" className="py-16 px-6" style={{ background: '#FAF7F2' }} aria-labelledby="products-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#5B6478' }}>{t('products.tag')}</h5>
              <h3 id="products-heading" className="text-2xl md:text-3xl font-bold" style={{ color: '#142C50' }}>{t('products.heading')}</h3>
              <h5 className="text-sm font-normal mt-2" style={{ color: '#5B6478', lineHeight: 1.6 }}>{t('products.subheading')}</h5>
            </div>
          </FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productKeys.map((p, i) => (
              <ProductImpressionTracker key={p.key} slug={p.slug}>
                <FadeSection delay={i * 50}>
                  <div className="bg-white rounded-xl p-5 h-full flex flex-col" style={{ border: '1px solid rgba(20,28,48,0.10)' }}>
                    <h3 className="text-sm font-bold mb-1" style={{ color: '#142C50' }}>{t(`products.${p.key}.title`)}</h3>
                    <h5 className="text-xs font-normal mb-4 flex-1" style={{ color: '#5B6478', lineHeight: 1.6 }}>{t(`products.${p.key}.description`)}</h5>
                    <div className="mb-3">
                      <div className="text-sm font-extrabold" style={{ color: '#142C50' }}>{t(`products.${p.key}.price`)}</div>
                    </div>
                    <WhatsAppClickTracker phoneNumber={phoneNumber} href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: '#25D366' }}>
                      <WAIcon /> {t('products.bookNow')}
                    </WhatsAppClickTracker>
                  </div>
                </FadeSection>
              </ProductImpressionTracker>
            ))}
          </div>
          <h5 className="text-center text-xs font-normal mt-5" style={{ color: '#5B6478', lineHeight: 1.6 }}>{t('products.disclaimer')}</h5>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="why-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#5B6478' }}>{t('whyChoose.tag')}</h5>
              <h3 id="why-heading" className="text-2xl md:text-3xl font-bold" style={{ color: '#142C50' }}>{t('whyChoose.heading')}</h3>
            </div>
          </FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reasonKeys.map((r, i) => (
              <FadeSection key={r} delay={i * 60}>
                <div className="why-card p-5 rounded-xl h-full" style={{ background: '#FAF7F2', border: '1px solid rgba(20,28,48,0.10)' }}>
                  <h5 className="text-sm font-bold mb-1" style={{ color: '#142C50' }}>{t(`whyChoose.${r}.title`)}</h5>
                  <h5 className="text-xs font-normal" style={{ color: '#5B6478', lineHeight: 1.6 }}>{t(`whyChoose.${r}.description`)}</h5>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6" style={{ background: '#FAF7F2' }} aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#5B6478' }}>{t('howItWorks.tag')}</h5>
              <h3 id="how-heading" className="text-2xl md:text-3xl font-bold" style={{ color: '#142C50' }}>{t('howItWorks.heading')}</h3>
            </div>
          </FadeSection>
          <div className="grid md:grid-cols-3 gap-5">
            {[1, 2, 3].map((n, i) => (
              <FadeSection key={n} delay={i * 100}>
                <div className="step p-6 rounded-xl text-center h-full" style={{ background: '#fff', border: '1px solid rgba(20,28,48,0.10)' }}>
                  <div className="text-5xl font-extrabold mb-3" style={{ color: 'rgba(20,28,48,0.18)' }} aria-hidden="true">{t(`howItWorks.step${n}Num`)}</div>
                  <h5 className="text-base font-semibold mb-2" style={{ color: '#142C50' }}>{t(`howItWorks.step${n}Title`)}</h5>
                  <h5 className="text-sm font-normal" style={{ color: '#5B6478', lineHeight: 1.6 }}>{t(`howItWorks.step${n}Desc`)}</h5>
                </div>
              </FadeSection>
            ))}
          </div>
          <FadeSection>
            <div className="text-center mt-8">
              <WhatsAppClickTracker phoneNumber={phoneNumber} href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: '#25D366' }}>
                <WAIcon />{t('howItWorks.cta')}
              </WhatsAppClickTracker>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* REVIEWS */}
      <section
        id="reviews"
        className="relative py-16 px-6 overflow-hidden"
        aria-labelledby="reviews-heading"
        style={{ backgroundImage: 'linear-gradient(rgba(20,28,48,0.92), rgba(20,28,48,0.92)), url(/images/bg-review.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 hero-bg" role="img" aria-label={t('reviews.heading')} aria-hidden="false" style={{ pointerEvents: 'none' }} />
        <div className="relative max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <GoogleLogo />
                <span className="text-sm font-medium text-white">{t('reviews.googleReviews')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl font-extrabold" style={{ color: '#FFD23F' }}>4.9</span>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <GoogleStarIcon key={i} />)}</div>
              </div>
              <h3 id="reviews-heading" className="text-2xl md:text-3xl font-bold text-white">{t('reviews.heading')}</h3>
              <h5 className="text-xs font-normal mt-2" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{t('reviews.reviewCount')}</h5>
            </div>
          </FadeSection>
          <div className="grid md:grid-cols-3 gap-4">
            {reviewIndexes.map((n, i) => (
              <FadeSection key={n} delay={i * 80}>
                <article className="p-5 rounded-xl h-full flex flex-col" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <GoogleLogo />
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                  </div>
                  <blockquote className="review-body text-sm font-normal mb-5 flex-1" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>&ldquo;{t(`reviews.review${n}Text`)}&rdquo;</blockquote>
                  <div className="flex items-center gap-2.5 mt-auto">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#FFD23F', color: '#142C50' }}>
                      {t(`reviews.review${n}Name`).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t(`reviews.review${n}Name`)}</div>
                      <div className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.6)' }}>{t(`reviews.review${n}Location`)}</div>
                    </div>
                  </div>
                </article>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-16 px-6" style={{ background: '#fff' }} aria-label="Customer gallery">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#5B6478' }}>{t('gallery.tag')}</h5>
              <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#142C50' }}>{t('gallery.heading')}</h3>
            </div>
          </FadeSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(20,28,48,0.05), rgba(20,28,48,0.12))', border: '1px solid rgba(20,28,48,0.08)' }}>
                <img src={`/images/gallery-${(i % 12) + 1}.jpg`} alt={t('gallery.imageAlt', { number: i + 1 })} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" style={{ background: '#FAF7F2' }} aria-labelledby="faq-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#5B6478' }}>{t('faq.tag')}</h5>
              <h3 id="faq-heading" className="text-2xl md:text-3xl font-bold" style={{ color: '#142C50' }}>{t('faq.heading')}</h3>
            </div>
          </FadeSection>
          <FadeSection>
            <div className="max-w-3xl mx-auto">
              {faqIndexes.map((n) => (
                <FAQItem key={n} q={t(`faq.q${n}`)} a={t(`faq.a${n}`)} />
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="locations-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#5B6478' }}>{t('locations.tag')}</h5>
              <h3 id="locations-heading" className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#142C50' }}>{t('locations.heading')}</h3>
              <h5 className="text-sm font-normal" style={{ color: '#5B6478', lineHeight: 1.6 }}>{t('locations.subheading')}</h5>
            </div>
          </FadeSection>
          <FadeSection>
            <div className="space-y-2.5">
              {regionGroups.map((region, i) => {
                const regionName = locale === 'ms' ? region.nameMs : locale === 'zh' ? region.nameZh : region.name
                const cities = region.cities
                  .map((slug) => locationConfig.find((l) => l.slug === slug))
                  .filter((l): l is NonNullable<typeof l> => Boolean(l))
                  .map((l) => ({ slug: l.slug, name: l.name }))
                return (
                  <LocationAccordion key={region.name} regionName={regionName} cities={cities} citiesLabel={t('locations.cities')} defaultOpen={i === 0} locale={locale} />
                )
              })}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative py-20 px-6 text-center text-white overflow-hidden"
        aria-label="Call to action"
        style={{ backgroundImage: 'linear-gradient(rgba(20,28,48,0.88), rgba(20,28,48,0.88)), url(/images/bg-cta.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 hero-bg" role="img" aria-label={tBlog('ctaHeading')} aria-hidden="false" style={{ pointerEvents: 'none' }} />
        <div className="relative max-w-3xl mx-auto">
          <FadeSection>
            <h3 className="font-extrabold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
              {t('finalCta.headline')} <span style={{ color: '#FFD23F' }}>{t('finalCta.headlineHighlight')}</span>
            </h3>
            <h5 className="text-base font-normal mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              {t('finalCta.subheadline')}
            </h5>
            <WhatsAppClickTracker phoneNumber={phoneNumber} href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white" style={{ background: '#25D366' }}>
              <WAIcon />{t('finalCta.cta')}
            </WhatsAppClickTracker>
            <h5 className="mt-4 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('finalCta.fine')}</h5>
          </FadeSection>
        </div>
      </section>
    </main>
  )
}
