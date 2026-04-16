'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)
const AircondIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" aria-hidden="true">
    <rect x="3" y="6" width="26" height="14" rx="3" stroke="#1B3A5C" strokeWidth="2" />
    <line x1="7" y1="16" x2="25" y2="16" stroke="#1B3A5C" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="13" x2="25" y2="13" stroke="#1B3A5C" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    <path d="M10 20v4c0 1.5-1 3-3 4" stroke="#1B3A5C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 20v5c0 1-0.5 2-2 3" stroke="#1B3A5C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 20v4c0 1.5 1 3 3 4" stroke="#1B3A5C" strokeWidth="1.5" strokeLinecap="round" />
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
        <p className="pb-4 text-sm font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.75' }}>{a}</p>
      </div>
    </div>
  )
}

type Props = {
  locale: string
  locationSlug: string
  cityName: string
  nearby: { slug: string; name: string }[]
}

export default function LocationPageClient({ locale, locationSlug, cityName, nearby }: Props) {
  const t = useTranslations('location')
  const nav = useTranslations('nav')
  const footer = useTranslations('footer')
  const homeServices = useTranslations('home.services')

  const waLink = waRedirect(locale, `Hi, I need aircond service in ${cityName}`, locationSlug)

  const serviceItems = [
    { key: 'servicing', icon: '🔧' },
    { key: 'installation', icon: '🔩' },
    { key: 'repair', icon: '⚡' },
    { key: 'chemicalWash', icon: '💧' },
  ]

  const whyItems = ['fast', 'transparent', 'brands', 'warranty']

  return (
    <>
      {/* NAV */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(27,58,92,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <a href={`/${locale}`} className="flex items-center gap-2 shrink-0" aria-label="Encik Beku homepage">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-yellow)' }}><AircondIcon /></div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg text-white tracking-tight">Encik Beku</span>
              <span className="text-[11px] font-normal" style={{ color: 'rgba(255,255,255,0.45)' }}>serviceaircond.my</span>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ background: 'var(--wa-green)' }}>
              <WAIcon /><span className="hidden sm:inline">{nav('whatsapp')}</span>
            </a>
          </div>
        </div>
      </header>

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
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #2A5280 50%, #1B4F72 100%)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='2' cy='2' r='1' fill='white' fill-opacity='0.04'/%3E%3C/svg%3E\")" }} />
          <div className="relative max-w-6xl mx-auto px-6 py-16 text-center text-white">
            <h1 className="font-extrabold text-white mb-4" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', letterSpacing: '-0.03em', lineHeight: '1.12' }}>
              {t('hero.headline', { city: cityName })}
            </h1>
            <p className="text-base font-normal mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.7' }}>
              {t('cta.subheading', { city: cityName })}
            </p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-base font-bold text-white" style={{ background: 'var(--wa-green)' }}>
              <WAIcon />{t('hero.cta', { city: cityName })}
            </a>
          </div>
        </section>

        {/* SERVICES IN CITY */}
        <section className="dot-texture py-16 px-6" style={{ background: 'var(--brand-cream)' }}>
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>{t('services.heading', { city: cityName })}</h2>
            </FadeSection>
            <div className="grid sm:grid-cols-2 gap-4">
              {serviceItems.map((svc, i) => (
                <FadeSection key={svc.key} delay={i * 60}>
                  <div className="flex gap-4 p-5 rounded-xl bg-white" style={{ border: '1px solid var(--brand-border)' }}>
                    <span className="text-2xl shrink-0" aria-hidden="true">{svc.icon}</span>
                    <p className="text-sm font-normal" style={{ color: 'var(--brand-text)', lineHeight: '1.7' }}>
                      {t(`services.${svc.key}`, { city: cityName })}
                    </p>
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
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>{t('why.heading', { city: cityName })}</h2>
            </FadeSection>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whyItems.map((key, i) => (
                <FadeSection key={key} delay={i * 60}>
                  <div className="flex gap-3 p-4 rounded-xl" style={{ background: 'var(--brand-cream)', border: '1px solid var(--brand-border)' }}>
                    <CheckIcon />
                    <p className="text-sm font-normal" style={{ color: 'var(--brand-text)', lineHeight: '1.6' }}>
                      {t(`why.${key}`, { city: cityName })}
                    </p>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-cream)' }}>
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>{t('faq.heading', { city: cityName })}</h2>
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
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>{t('nearby.heading')}</h2>
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
              <h2 className="font-extrabold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
                {t('cta.heading', { city: cityName })}
              </h2>
              <p className="text-base font-normal mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('cta.subheading', { city: cityName })}
              </p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white" style={{ background: 'var(--wa-green)' }}>
                <WAIcon />{t('cta.button', { city: cityName })}
              </a>
              <p className="mt-4 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('cta.fine')}</p>
            </FadeSection>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ background: '#0F2238' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-yellow)' }}><AircondIcon /></div>
              <span className="font-extrabold text-lg text-white tracking-tight">Encik Beku</span>
            </div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-80" style={{ color: 'var(--wa-green)' }}><WAIcon />{footer('whatsappUs')}</a>
          </div>
          <div className="border-t mt-6 pt-5 text-center text-xs font-normal" style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}>
            <p>{footer('copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
