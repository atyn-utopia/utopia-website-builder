'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', color: '#142C50' }} fill="none" aria-hidden="true">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(20,28,48,0.10)' }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer text-sm font-semibold" style={{ color: '#142C50' }} aria-expanded={open}>
        <span className="pr-4">{q}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '300px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <h5 className="pb-4 text-sm font-normal" style={{ color: '#5B6478', lineHeight: 1.6 }}>{a}</h5>
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

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeUp()
  return <div ref={ref} className={`fade-up ${className}`}>{children}</div>
}

function waRedirect(locale: string, message?: string, location?: string) {
  const params = new URLSearchParams()
  if (message) params.set('message', message)
  if (location) params.set('loc', location)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}

type Props = {
  locale: string
  locationSlug: string
  cityName: string
  phoneNumber: string
  nearby: { slug: string; name: string }[]
}

export default function LocationPageClient({ locale, locationSlug, cityName, phoneNumber, nearby }: Props) {
  const t = useTranslations('location')
  const tHomeReviews = useTranslations('home.reviews')
  const tUsp = useTranslations('home.usp')
  const waLink = waRedirect(locale, undefined, locationSlug)

  const uspItems = [
    { title: tUsp('usp1Title'), sub: tUsp('usp1Sub'), icon: 'clock' as const },
    { title: tUsp('usp2Title'), sub: tUsp('usp2Sub'), icon: 'paint' as const },
    { title: tUsp('usp3Title'), sub: tUsp('usp3Sub'), icon: 'shield' as const },
  ]

  return (
    <main>
      {/* 3-POINT USP BAR */}
      <section className="px-6 py-8 md:py-10" style={{ background: '#fff', borderBottom: '1px solid rgba(20,28,48,0.10)' }} aria-label="Why choose us">
        <div className="max-w-6xl mx-auto">
          <div
            className="usp-panel rounded-2xl"
            style={{ background: '#FAF7F2', border: '1px solid rgba(20,28,48,0.10)', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}
          >
            {uspItems.map((item) => (
              <div
                key={item.icon}
                className="usp-cell flex flex-col md:flex-row md:items-center items-center text-center md:text-left gap-3 md:gap-4 p-3 md:p-4 rounded-xl"
                style={{ background: '#fff', border: '1px solid rgba(20,28,48,0.06)' }}
              >
                <span className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: 'rgba(20,28,48,0.06)', color: '#142C50' }} aria-hidden="true">
                  {item.icon === 'clock' && (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>)}
                  {item.icon === 'paint' && (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V3H5v8h14V7zM12 11v4M9 21h6v-6H9v6z"/></svg>)}
                  {item.icon === 'shield' && (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>)}
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

      {/* SERVICES IN CITY */}
      <section className="py-16 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: '#142C50' }}>{t('services.heading', { city: cityName })}</h3>
          </FadeSection>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {(['interior', 'exterior', 'ceiling', 'fence'] as const).map((k) => (
              <FadeSection key={k}>
                <div className="bg-white p-5 rounded-xl" style={{ border: '1px solid rgba(20,28,48,0.10)' }}>
                  <h5 className="text-sm font-normal" style={{ color: '#142C50', lineHeight: 1.6 }}>
                    {t(`services.${k}`, { city: cityName })}
                  </h5>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 px-6" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: '#142C50' }}>{t('why.heading', { city: cityName })}</h3>
          </FadeSection>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {(['fast', 'transparent', 'brands', 'warranty'] as const).map((k) => (
              <FadeSection key={k}>
                <div className="why-card p-4 rounded-xl" style={{ background: '#FAF7F2', border: '1px solid rgba(20,28,48,0.10)' }}>
                  <h5 className="text-sm font-normal" style={{ color: '#142C50', lineHeight: 1.6 }}>{t(`why.${k}`, { city: cityName })}</h5>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS — pulled from home.reviews so locations don't duplicate copy */}
      <section className="relative py-16 px-6 overflow-hidden" id="reviews" style={{ backgroundImage: 'linear-gradient(rgba(20,28,48,0.92), rgba(20,28,48,0.92)), url(/images/bg-review.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 hero-bg" role="img" aria-label={tHomeReviews('heading')} style={{ pointerEvents: 'none' }} />
        <div className="relative max-w-6xl mx-auto">
          <FadeSection>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">{tHomeReviews('heading')}</h3>
          </FadeSection>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <FadeSection key={n}>
                <article className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                  <blockquote className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>&ldquo;{tHomeReviews(`review${n}Text`)}&rdquo;</blockquote>
                  <div className="mt-3 text-xs font-semibold" style={{ color: '#FFD23F' }}>{tHomeReviews(`review${n}Name`)} — {tHomeReviews(`review${n}Location`)}</div>
                </article>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: '#142C50' }}>{t('faq.heading', { city: cityName })}</h3>
          </FadeSection>
          <FadeSection>
            <div className="max-w-3xl mx-auto">
              {[1, 2, 3, 4].map((n) => (
                <FAQItem key={n} q={t(`faq.q${n}`, { city: cityName })} a={t(`faq.a${n}`, { city: cityName })} />
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="py-16 px-6" style={{ background: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: '#142C50' }}>{t('nearby.heading')}</h3>
            </FadeSection>
            <FadeSection>
              <div className="flex flex-wrap justify-center gap-3">
                {nearby.map((n) => (
                  <a key={n.slug} href={`/${locale}/cat-rumah/${n.slug}`} className="px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80" style={{ background: 'rgba(20,28,48,0.06)', color: '#142C50', border: '1px solid rgba(20,28,48,0.10)' }}>
                    {t('nearby.viewService', { city: n.name })}
                  </a>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section
        className="relative py-20 px-6 text-center text-white overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(rgba(20,28,48,0.88), rgba(20,28,48,0.88)), url(/images/bg-cta.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 hero-bg" role="img" aria-label={t('cta.heading', { city: cityName })} style={{ pointerEvents: 'none' }} />
        <div className="relative max-w-3xl mx-auto">
          <FadeSection>
            <h3 className="font-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>{t('cta.heading', { city: cityName })}</h3>
            <h5 className="text-base font-normal mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{t('cta.subheading', { city: cityName })}</h5>
            <WhatsAppClickTracker phoneNumber={phoneNumber} href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white" style={{ background: '#25D366' }}>
              <WAIcon />{t('cta.button', { city: cityName })}
            </WhatsAppClickTracker>
            <h5 className="mt-4 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('cta.fine')}</h5>
          </FadeSection>
        </div>
      </section>
    </main>
  )
}
