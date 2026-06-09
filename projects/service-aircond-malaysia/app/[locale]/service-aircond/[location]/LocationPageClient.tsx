'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
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
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="var(--brand-navy)" fillOpacity="0.1" />
    <path d="M6 10l3 3 5-5" stroke="var(--brand-navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0 transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--brand-navy)' }} fill="none" aria-hidden="true">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const galleryImages = Array.from({ length: 15 }, (_, i) => `/images/gallery-${i + 1}.png`)

function waRedirect(locale: string, message?: string, location?: string) {
  const params = new URLSearchParams()
  if (message) params.set('message', message)
  if (location) params.set('location', location)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.12 }); obs.observe(el); return () => obs.disconnect() }, [])
  return ref
}
function FadeSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeUp()
  return <div ref={ref} className={`fade-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--brand-border)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer text-sm font-semibold" style={{ color: 'var(--brand-navy)' }} aria-expanded={open}>
        <span className="pr-4">{q}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '300px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <h5 className="pb-4 text-sm font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: 1.6 }}>{a}</h5>
      </div>
    </div>
  )
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
  const homeReviews = useTranslations('home.reviews')
  const homeGallery = useTranslations('home.gallery')
  const tUsp = useTranslations('home.usp')

  const waLink = waRedirect(locale, `Hi, I need aircond service in ${cityName}`, locationSlug)

  const uspItems = [
    { title: tUsp('usp1Title'), sub: tUsp('usp1Sub'), icon: 'clock' },
    { title: tUsp('usp2Title'), sub: tUsp('usp2Sub'), icon: 'shield' },
    { title: tUsp('usp3Title'), sub: tUsp('usp3Sub'), icon: 'badge' },
  ] as const

  const serviceItems = [
    { key: 'servicing', icon: '🔧' },
    { key: 'installation', icon: '🔩' },
    { key: 'repair', icon: '⚡' },
    { key: 'chemicalWash', icon: '💧' },
  ]

  const whyItems = ['fast', 'transparent', 'brands', 'warranty']

  return (
    <>
      <main>
        {/* BREADCRUMB */}
        <nav className="max-w-6xl mx-auto px-6 py-3" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: 'var(--brand-text-muted)' }}>
            <li><a href={`/${locale}`} className="hover:underline">{t('breadcrumb.home')}</a></li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold" style={{ color: 'var(--brand-navy)' }}>{cityName}</li>
          </ol>
        </nav>

        {/* HERO */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(15,34,56,0.93) 0%, rgba(27,58,92,0.90) 50%, rgba(20,52,76,0.95) 100%), url(/images/hero-aircond-bg.jpg) center/cover no-repeat',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='2' cy='2' r='1' fill='white' fill-opacity='0.04'/%3E%3C/svg%3E\")" }} />
          <div className="relative max-w-4xl mx-auto px-6 pt-14 md:pt-16 pb-0 text-center text-white">
            <h6 className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider mb-4">
              <span className="h-2 w-2 rounded-full bg-[#FFE500]" aria-hidden="true" />
              {t('hero.badge', { city: cityName })}
            </h6>
            <h1
              className="font-extrabold text-white mx-auto"
              style={{ fontSize: 'clamp(1.75rem, 4.4vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: '1.1' }}
            >
              {t('hero.headline', { city: cityName })}{' '}
              <span style={{ color: 'var(--brand-yellow)' }}>{t('hero.headlineHighlight', { city: cityName })}</span>
            </h1>
            <h2 className="mt-4 text-sm md:text-base text-white/75 max-w-xl mx-auto font-normal" style={{ lineHeight: 1.6 }}>
              {t('hero.subheadline', { city: cityName })}
            </h2>
            <div className="mt-6 flex flex-col items-center gap-3">
              <WhatsAppClickTracker phoneNumber={phoneNumber} href={waLink} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--wa-green)' }}>
                <WAIcon />{t('hero.cta', { city: cityName })}
              </WhatsAppClickTracker>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {t('hero.ctaSubtext', { city: cityName }).split(' · ').map((part, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70"
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
            <img
              src="/images/hero-new.png"
              alt={t('hero.heroAlt', { city: cityName })}
              className="mx-auto mt-8 w-64 sm:w-72 md:w-[340px] lg:w-[380px] block"
              style={{ filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.35))', marginBottom: '-1px' }}
            />
          </div>
        </section>

        {/* 3-POINT USP BAR */}
        <section
          className="px-6 py-8 md:py-10"
          style={{ background: '#fff', borderBottom: '1px solid var(--brand-border)' }}
          aria-label="Why choose us"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {uspItems.map((item) => (
              <div
                key={item.icon}
                className="flex flex-col items-center text-center gap-3 md:flex-row md:items-center md:text-left md:gap-4 md:justify-start"
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
                  <h5 className="text-xs font-normal mt-0.5" style={{ color: 'var(--brand-text-muted)', lineHeight: 1.6 }}>{item.sub}</h5>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES IN CITY */}
        <section className="dot-texture py-16 px-6" style={{ background: 'var(--brand-cream)' }}>
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>{t('services.heading', { city: cityName })}</h3>
            </FadeSection>
            <div className="grid sm:grid-cols-2 gap-4">
              {serviceItems.map((svc, i) => (
                <ProductImpressionTracker key={svc.key} slug={svc.key}>
                  <FadeSection delay={i * 60}>
                    <div className="flex gap-4 p-5 rounded-xl bg-white" style={{ border: '1px solid var(--brand-border)' }}>
                      <span className="text-2xl shrink-0" aria-hidden="true">{svc.icon}</span>
                      <h5 className="text-sm font-normal" style={{ color: 'var(--brand-text)', lineHeight: 1.6 }}>
                        {t(`services.${svc.key}`, { city: cityName })}
                      </h5>
                    </div>
                  </FadeSection>
                </ProductImpressionTracker>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="py-16 px-6" style={{ background: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>{t('why.heading', { city: cityName })}</h3>
            </FadeSection>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whyItems.map((key, i) => (
                <FadeSection key={key} delay={i * 60}>
                  <div className="flex gap-3 p-4 rounded-xl" style={{ background: 'var(--brand-cream)', border: '1px solid var(--brand-border)' }}>
                    <CheckIcon />
                    <h5 className="text-sm font-normal" style={{ color: 'var(--brand-text)', lineHeight: 1.6 }}>
                      {t(`why.${key}`, { city: cityName })}
                    </h5>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── CUSTOMER GALLERY ── */}
        <section className="py-16 px-0 overflow-hidden" style={{ background: '#fff' }} aria-label="Customer gallery">
          <FadeSection>
            <div className="text-center mb-8 px-6">
              <h5 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-text-muted)' }}>{homeGallery('tag')}</h5>
              <h3 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{homeGallery('heading')}</h3>
            </div>
          </FadeSection>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #fff, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #fff, transparent)' }} />
            <div className="marquee-track">
              {[...galleryImages, ...galleryImages].map((img, i) => (
                <div key={i} className="shrink-0 w-44 h-44 md:w-52 md:h-52 rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(27,58,92,0.08)' }}>
                  <img src={img} alt={homeGallery('imageAlt', { number: (i % 15) + 1 })} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEWS */}
        <section id="reviews" className="relative py-16 px-6 overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/bg-review.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} role="presentation" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: 'rgba(27,58,92,0.92)' }} />
          <div className="relative max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <GoogleLogo />
                  <span className="text-sm font-medium text-white">{homeReviews('googleReviews')}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-3xl font-extrabold" style={{ color: 'var(--brand-yellow)' }}>4.9</span>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <GoogleStarIcon key={i} />)}</div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">{homeReviews('heading')}</h3>
                <h6 className="text-xs font-normal mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{homeReviews('reviewCount')}</h6>
              </div>
            </FadeSection>
            <div className="grid grid-flow-col md:grid-flow-row auto-cols-[75%] md:auto-cols-auto md:grid-cols-3 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory -mx-2 px-2 md:mx-0 md:px-0 hide-scrollbar">
              {[1, 2, 3, 4, 5, 6].map((n, i) => (
                <FadeSection key={n} delay={i * 100}>
                  <article className="review-card p-5 snap-start h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <GoogleLogo />
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                    </div>
                    <blockquote className="text-sm font-normal mb-5 flex-1" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>&ldquo;{homeReviews(`review${n}Text`)}&rdquo;</blockquote>
                    <div className="flex items-center gap-2.5 mt-auto">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-navy)' }}>
                        {homeReviews(`review${n}Name`).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold text-white">{homeReviews(`review${n}Name`)}</h6>
                        <h6 className="text-xs font-normal" style={{ color: 'var(--brand-blue-light)' }}>{homeReviews(`review${n}Location`)}</h6>
                      </div>
                    </div>
                  </article>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-cream)' }}>
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>{t('faq.heading', { city: cityName })}</h3>
            </FadeSection>
            <FadeSection>
              <div className="max-w-3xl mx-auto">
                {[1, 2, 3, 4].map(n => (
                  <FAQItem key={n} q={t(`faq.q${n}`, { city: cityName })} a={t(`faq.a${n}`, { city: cityName })} />
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* NEARBY LOCATIONS */}
        {nearby.length > 0 && (
          <section className="py-16 px-6" style={{ background: '#fff' }}>
            <div className="max-w-6xl mx-auto">
              <FadeSection>
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>{t('nearby.heading')}</h3>
              </FadeSection>
              <FadeSection>
                <div className="flex flex-wrap justify-center gap-3">
                  {nearby.map(n => (
                    <a key={n.slug} href={`/${locale}/service-aircond/${n.slug}`} className="px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80" style={{ background: 'var(--brand-blue-xs)', color: 'var(--brand-navy)', border: '1px solid var(--brand-border)' }}>
                      {t('nearby.viewService', { city: n.name })}
                    </a>
                  ))}
                </div>
              </FadeSection>
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="relative py-20 px-6 text-center text-white overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #2A5280 100%)' }} />
          <div className="relative max-w-6xl mx-auto">
            <FadeSection>
              <h3 className="font-extrabold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
                {t('cta.heading', { city: cityName })}
              </h3>
              <h5 className="text-base font-normal mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('cta.subheading', { city: cityName })}
              </h5>
              <WhatsAppClickTracker phoneNumber={phoneNumber} href={waLink} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white" style={{ background: 'var(--wa-green)' }}>
                <WAIcon />{t('cta.button', { city: cityName })}
              </WhatsAppClickTracker>
              <h5 className="mt-4 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('cta.fine')}</h5>
            </FadeSection>
          </div>
        </section>
      </main>
    </>
  )
}
