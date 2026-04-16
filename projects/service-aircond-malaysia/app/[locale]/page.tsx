'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { locations, getLocationsByRegion, regions as regionConfig } from '@/config/locations'
import LanguageSwitcher from '@/components/LanguageSwitcher'

/* ── SVG Icons ── */
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
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0 transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--brand-navy)' }} fill="none" aria-hidden="true">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ServiceIcon = ({ type }: { type: string }) => {
  const cls = "w-6 h-6"
  switch (type) {
    case 'wrench': return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
    case 'drill': return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12h6"/><path d="M8 8v8"/><path d="M8 12h4l4-4v8l-4-4H8"/><path d="M20 4v16"/></svg>
    case 'bolt': return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    case 'droplet': return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
    case 'gauge': return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
    case 'unplug': return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
    default: return null
  }
}

/* ── Static data ── */
const serviceKeys = [
  { key: 'servicing', wallPrice: 'RM80', cassettePrice: 'RM120', icon: 'wrench', badgeKey: 'popular', waKey: 'waServicing' },
  { key: 'installation', wallPrice: 'RM250+', cassettePrice: 'RM450+', icon: 'drill', badgeKey: null, waKey: 'waInstallation' },
  { key: 'repair', wallPrice: 'RM120+', cassettePrice: 'RM150+', icon: 'bolt', badgeKey: null, waKey: 'waRepair' },
  { key: 'chemicalWash', wallPrice: 'RM180', cassettePrice: 'RM280', icon: 'droplet', badgeKey: 'recommended', waKey: 'waChemicalWash' },
  { key: 'gasTopUp', wallPrice: 'RM150', cassettePrice: 'RM180', icon: 'gauge', badgeKey: null, waKey: 'waGasTopUp' },
  { key: 'dismantling', wallPrice: 'RM100', cassettePrice: 'RM200', icon: 'unplug', badgeKey: null, waKey: 'waDismantling' },
]

const whyKeys = ['certified', 'sameDay', 'transparent', 'allBrands', 'warranty', 'open7Days']

const brands = [
  { name: 'Daikin', logo: '/images/brands/daikin.svg' },
  { name: 'Panasonic', logo: '/images/brands/panasonic.svg' },
  { name: 'Midea', logo: '/images/brands/midea.svg' },
  { name: 'York', logo: '/images/brands/york.svg' },
  { name: 'Samsung', logo: '/images/brands/samsung.svg' },
]

const galleryImages = Array.from({ length: 15 }, (_, i) => `/images/gallery-${i + 1}.png`)
/* ── WhatsApp redirect helpers ── */
function waRedirect(locale: string, message?: string, location?: string) {
  const params = new URLSearchParams()
  if (message) params.set('message', message)
  if (location) params.set('location', location)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}

/* ── FOMO countdown ── */
function FomoBanner() {
  const locale = useLocale()
  const t = useTranslations('home.fomo')
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [slotsLeft, setSlotsLeft] = useState(3)
  useEffect(() => {
    const getEndOfDay = () => { const now = new Date(); const end = new Date(now); end.setHours(23, 59, 59, 999); return end }
    const updateTimer = () => {
      const diff = getEndOfDay().getTime() - Date.now()
      if (diff <= 0) { setTimeLeft({ hours: 0, minutes: 0, seconds: 0 }); return }
      setTimeLeft({ hours: Math.floor(diff / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) })
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    const hour = new Date().getHours()
    if (hour < 10) setSlotsLeft(5); else if (hour < 14) setSlotsLeft(3); else if (hour < 18) setSlotsLeft(2); else setSlotsLeft(1)
    return () => clearInterval(interval)
  }, [])
  const pad = (n: number) => n.toString().padStart(2, '0')
  return (
    <div style={{ background: '#DC2626' }}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 flex-wrap text-white text-xs sm:text-sm">
        <span className="fomo-dot w-2 h-2 rounded-full bg-white shrink-0" />
        <span className="font-medium"><span className="hidden sm:inline">{t('promo')}</span>{t('slotsLeft', { slots: slotsLeft })}</span>
        <span className="font-mono font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
        <a href={waRedirect(locale)} className="font-semibold underline underline-offset-2 hover:no-underline shrink-0">{t('bookNow')} &rarr;</a>
      </div>
    </div>
  )
}

/* ── Components ── */
function AccordionItem({ regionName, cities, citiesLabel, defaultOpen = false, locale }: { regionName: string; cities: { slug: string; name: string }[]; citiesLabel: string; defaultOpen?: boolean; locale: string }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: open ? '1.5px solid var(--brand-navy)' : '1.5px solid var(--brand-border)', background: '#fff', transition: 'border-color 0.2s' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer text-sm font-semibold" style={{ color: 'var(--brand-navy)', borderLeft: open ? '4px solid var(--brand-navy)' : '4px solid transparent' }} aria-expanded={open}>
        <span>{regionName}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-normal" style={{ color: 'var(--brand-text-muted)' }}>{cities.length} {citiesLabel}</span>
          <ChevronIcon open={open} />
        </div>
      </button>
      <div style={{ maxHeight: open ? '600px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div className="px-5 pb-5 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cities.map(city => (
              <a key={city.slug} href={`/${locale}/service-aircond/${city.slug}`} className="text-xs font-normal px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity" style={{ background: 'var(--brand-blue-xs)', color: 'var(--brand-navy)' }}>
                {city.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
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

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.12 }); obs.observe(el); return () => obs.disconnect() }, [])
  return ref
}
function FadeSection({ children, className = '', delay = 0, full = false }: { children: React.ReactNode; className?: string; delay?: number; full?: boolean }) {
  const ref = useFadeUp()
  return <div ref={ref} className={`fade-up ${full ? 'h-full' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

/* ══════════════════════════════════════════
   HOMEPAGE
   ══════════════════════════════════════════ */
export default function HomePage() {
  const locale = useLocale()
  const t = useTranslations('home')
  const nav = useTranslations('nav')
  const footer = useTranslations('footer')

  const WA_LINK = waRedirect(locale)
  const waServiceLink = (waKey: string) => waRedirect(locale, t(`services.${waKey}`))

  const regionData = regionConfig.map(r => {
    const locs = getLocationsByRegion(r.name)
    const regionName = locale === 'ms' ? r.nameMs : locale === 'zh' ? r.nameZh : r.name
    return {
      regionName,
      cities: locs.map(l => ({ slug: l.slug, name: l.names[locale as 'en' | 'ms' | 'zh'] ?? l.displayName })),
    }
  })

  const faqKeys = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <>
      <FomoBanner />

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
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
            {[{ label: nav('services'), href: '#services' }, { label: nav('reviews'), href: '#reviews' }, { label: nav('locations'), href: '#locations' }].map(link => (
              <a key={link.href} href={link.href} className="nav-link focus:outline-none">{link.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ background: 'var(--wa-green)' }}>
              <WAIcon /><span className="hidden sm:inline">{nav('whatsapp')}</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #2A5280 50%, #1B4F72 100%)' }} aria-label="Hero">
          {/* Aircond background image — right side only */}
          <div className="absolute inset-0 pointer-events-none" role="presentation" aria-hidden="true" style={{ backgroundImage: 'url(/images/hero-aircond.png)', backgroundSize: 'cover', backgroundPosition: 'center right', opacity: 0.15 }} />
          <div className="absolute inset-0 pointer-events-none" role="presentation" aria-hidden="true" style={{ background: 'linear-gradient(to right, #1B3A5C 0%, #1B3A5C 35%, transparent 75%)' }} />
          {/* Dot texture */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='2' cy='2' r='1' fill='white' fill-opacity='0.04'/%3E%3C/svg%3E\")" }} />
          <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-0 text-center text-white" style={{ paddingBottom: 0 }}>
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,229,0,0.2)', border: '1px solid rgba(255,229,0,0.4)', color: 'var(--brand-yellow)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />{t('hero.badgeCertified')}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(161,209,255,0.15)', border: '1px solid rgba(161,209,255,0.3)', color: 'var(--brand-blue-light)' }}>{t('hero.badgeCities')}</span>
            </div>

            <h1 className="font-extrabold text-white mb-3" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', letterSpacing: '-0.03em', lineHeight: '1.12' }}>
              {t('hero.headline')}{' '}
              <span style={{ color: 'var(--brand-yellow)' }}>{t('hero.headlineHighlight')}</span>
            </h1>

            <p className="text-base font-normal mb-6 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.7' }}>
              {t('hero.subheadline')}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-base font-bold text-white" style={{ background: 'var(--wa-green)' }}>
                <WAIcon />{t('hero.cta')}
              </a>
              <span className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('hero.ctaSubtext')}</span>
            </div>

            {/* Hero image + floating stamps */}
            <div className="relative max-w-md mx-auto">
              <img src="/images/hero-new.png" alt={t('hero.heroAlt')} className="mx-auto w-72 sm:w-80 md:w-[360px] lg:w-[400px]" style={{ display: 'block', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))', marginBottom: '-1px' }} />
              {/* Price stamp — top right, near image edge */}
              <div className="absolute top-6 -right-4 sm:-right-8 md:-right-10 w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] rounded-full flex flex-col items-center justify-center text-center z-10" style={{ background: 'var(--brand-yellow)', boxShadow: '0 4px 16px rgba(255,229,0,0.35)' }}>
                <span className="text-[11px] font-semibold uppercase leading-none" style={{ color: 'var(--brand-navy)' }}>{t('hero.stampFrom')}</span>
                <span className="text-xl font-extrabold leading-none" style={{ color: 'var(--brand-navy)' }}>{t('hero.stampPrice')}</span>
                <span className="text-[10px] font-medium uppercase" style={{ color: 'var(--brand-navy)' }}>{t('hero.stampUnit')}</span>
              </div>
              {/* Same-day stamp — bottom left, outside image flow */}
              <div className="absolute bottom-16 left-0 sm:-left-20 md:-left-28 px-3 py-2 rounded-xl flex items-center gap-2 z-10" style={{ background: '#fff', boxShadow: '0 4px 16px rgba(27,58,92,0.15)' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--brand-navy)' }}>
                  <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" aria-hidden="true"><path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold" style={{ color: 'var(--brand-navy)' }}>{t('hero.sameDayTitle')}</div>
                  <div className="text-[11px] font-normal" style={{ color: 'var(--brand-text-muted)' }}>{t('hero.sameDaySub')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section aria-label="Statistics" style={{ background: 'var(--brand-navy)' }}>
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: t('stats.customers'), label: t('stats.customersLabel') },
                { value: t('stats.response'), label: t('stats.responseLabel') },
                { value: t('stats.rating'), label: t('stats.ratingLabel') },
                { value: t('stats.experience'), label: t('stats.experienceLabel') },
              ].map((stat, i) => (
                <FadeSection key={i} delay={i * 80}>
                  <div className="stat-number text-3xl md:text-4xl mb-1 font-extrabold">{stat.value}</div>
                  <div className="text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--brand-blue-light)' }}>{stat.label}</div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRANDS ── */}
        <section className="py-7 px-6" style={{ background: '#fff', borderBottom: '1px solid var(--brand-border)' }} aria-label="Brands we service">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-text-muted)' }}>{t('brands.label')}</span>
              {brands.map(brand => (
                <img key={brand.name} src={brand.logo} alt={brand.name} className="h-6 sm:h-7" style={{ opacity: 0.4, filter: 'grayscale(100%)' }} loading="lazy" />
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES & PRICING ── */}
        <section id="services" className="dot-texture py-16 px-6" style={{ background: 'var(--brand-cream)' }} aria-labelledby="services-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-text-muted)' }}>{t('services.tag')}</p>
                <h2 id="services-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{t('services.heading')}</h2>
                <p className="text-sm font-normal mt-2" style={{ color: 'var(--brand-text-muted)' }}>{t('services.subheading')}</p>
              </div>
            </FadeSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceKeys.map((svc, i) => (
                <FadeSection key={svc.key} delay={i * 50}>
                  <div className="relative bg-white rounded-xl p-5 h-full flex flex-col" style={{ border: '1px solid var(--brand-border)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(27,58,92,0.1)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                    {svc.badgeKey && (
                      <div className="absolute -top-2.5 right-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: svc.badgeKey === 'popular' ? '#DC2626' : 'var(--brand-navy)' }}>{t(`services.${svc.badgeKey}`)}</span>
                      </div>
                    )}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--brand-blue-xs)', color: 'var(--brand-navy)' }}><ServiceIcon type={svc.icon} /></div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--brand-navy)' }}>{t(`services.${svc.key}`)}</h3>
                    <p className="text-xs font-normal mb-4 flex-1" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.6' }}>{t(`services.${svc.key}Desc`)}</p>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 px-2.5 py-2 rounded-lg text-center" style={{ background: 'var(--brand-blue-xs)' }}>
                        <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--brand-text-muted)' }}>{t('services.wall')}</div>
                        <div className="text-sm font-extrabold" style={{ color: 'var(--brand-navy)' }}>{svc.wallPrice}</div>
                      </div>
                      <div className="flex-1 px-2.5 py-2 rounded-lg text-center" style={{ background: 'var(--brand-yellow-xs)' }}>
                        <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--brand-text-muted)' }}>{t('services.cassette')}</div>
                        <div className="text-sm font-extrabold" style={{ color: 'var(--brand-navy)' }}>{svc.cassettePrice}</div>
                      </div>
                    </div>
                    <a href={waServiceLink(svc.waKey)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 w-full" style={{ background: 'var(--wa-green)' }}><WAIcon />{t('services.bookNow')}</a>
                  </div>
                </FadeSection>
              ))}
            </div>
            <p className="text-center text-xs font-normal mt-5" style={{ color: 'var(--brand-text-muted)' }}>{t('services.disclaimer')}</p>
          </div>
        </section>

        {/* ── WHY CHOOSE ── */}
        <section className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="why-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-text-muted)' }}>{t('why.tag')}</p>
                <h2 id="why-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{t('why.heading')}</h2>
              </div>
            </FadeSection>
            <div className="grid sm:grid-cols-2 gap-4">
              {whyKeys.map((key, i) => (
                <FadeSection key={key} delay={i * 60} full>
                  <div className="flex gap-3 p-5 rounded-xl h-full" style={{ background: 'var(--brand-cream)', border: '1px solid var(--brand-border)' }}>
                    <div className="shrink-0 pt-0.5"><CheckIcon /></div>
                    <p className="text-sm font-normal" style={{ color: 'var(--brand-text)', lineHeight: '1.6' }}>
                      <strong className="font-semibold" style={{ color: 'var(--brand-navy)' }}>{t(`why.${key}`)}</strong>
                      <span style={{ color: 'var(--brand-text-muted)' }}> — {t(`why.${key}Desc`)}</span>
                    </p>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── MID-PAGE CTA ── */}
        <section className="py-10 px-6" style={{ background: 'var(--brand-cream)', borderTop: '1px solid var(--brand-border)', borderBottom: '1px solid var(--brand-border)' }}>
          <div className="max-w-6xl mx-auto text-center">
            <FadeSection>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--brand-text)' }}>{t('midCta.text')}</p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--wa-green)' }}>
                <WAIcon />{t('midCta.button')}
              </a>
              <div className="flex items-center justify-center gap-2 mt-4">
                <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true"><path d="M10 1l2.5 5.5H18l-4.5 3.5 1.5 5.5L10 12.5 5 15.5l1.5-5.5L2 6.5h5.5L10 1z" fill="var(--brand-yellow)" stroke="var(--brand-yellow)" strokeWidth="0.5" /></svg>
                <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>{t('guarantee.text')}</span>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ── GOOGLE REVIEWS ── */}
        <section id="reviews" className="relative py-16 px-6 overflow-hidden" aria-labelledby="reviews-heading">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/bg-review.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} role="presentation" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: 'rgba(27,58,92,0.92)' }} />
          <div className="relative max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <GoogleLogo />
                  <span className="text-sm font-medium text-white">{t('reviews.googleReviews')}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-3xl font-extrabold" style={{ color: 'var(--brand-yellow)' }}>4.9</span>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <GoogleStarIcon key={i} />)}</div>
                </div>
                <h2 id="reviews-heading" className="text-2xl md:text-3xl font-bold text-white">{t('reviews.heading')}</h2>
                <p className="text-xs font-normal mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('reviews.reviewCount')}</p>
              </div>
            </FadeSection>
            <div className="grid grid-flow-col md:grid-flow-row auto-cols-[75%] md:auto-cols-auto md:grid-cols-3 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory -mx-2 px-2 md:mx-0 md:px-0 hide-scrollbar">
              {[1, 2, 3, 4, 5, 6].map((n, i) => (
                <FadeSection key={n} delay={i * 100} full>
                  <article className="review-card p-5 snap-start h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <GoogleLogo />
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                    </div>
                    <blockquote className="text-sm font-normal mb-5 leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.85)' }}>&ldquo;{t(`reviews.review${n}Text`)}&rdquo;</blockquote>
                    <div className="flex items-center gap-2.5 mt-auto">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-navy)' }}>
                        {t(`reviews.review${n}Name`).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{t(`reviews.review${n}Name`)}</div>
                        <div className="text-xs font-normal" style={{ color: 'var(--brand-blue-light)' }}>{t(`reviews.review${n}Location`)}</div>
                      </div>
                    </div>
                  </article>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-yellow-xs)' }} aria-labelledby="how-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-text-muted)' }}>{t('howItWorks.tag')}</p>
                <h2 id="how-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{t('howItWorks.heading')}</h2>
              </div>
            </FadeSection>
            <div className="grid md:grid-cols-3 gap-5">
              {[1, 2, 3].map((n, i) => (
                <FadeSection key={n} delay={i * 100} full>
                  <div className="relative p-6 rounded-xl text-center h-full" style={{ background: '#fff', border: '1px solid var(--brand-border)' }}>
                    <div className="text-5xl font-extrabold mb-3 leading-none" style={{ color: 'var(--brand-blue-light)', opacity: 0.4, letterSpacing: '-0.04em' }} aria-hidden="true">{t(`howItWorks.step${n}Num`)}</div>
                    <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--brand-navy)' }}>{t(`howItWorks.step${n}Title`)}</h3>
                    <p className="text-sm font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.65' }}>{t(`howItWorks.step${n}Desc`)}</p>
                  </div>
                </FadeSection>
              ))}
            </div>
            <FadeSection>
              <div className="text-center mt-8">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--wa-green)' }}><WAIcon />{t('howItWorks.cta')}</a>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ── CUSTOMER GALLERY ── */}
        <section className="py-16 px-0 overflow-hidden" style={{ background: '#fff' }} aria-label="Customer gallery">
          <FadeSection>
            <div className="text-center mb-8 px-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-text-muted)' }}>{t('gallery.tag')}</p>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{t('gallery.heading')}</h2>
            </div>
          </FadeSection>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #fff, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #fff, transparent)' }} />
            <div className="marquee-track">
              {[...galleryImages, ...galleryImages].map((img, i) => (
                <div key={i} className="shrink-0 w-44 h-44 md:w-52 md:h-52 rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(27,58,92,0.08)' }}>
                  <img src={img} alt={t('gallery.imageAlt', { number: (i % 15) + 1 })} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-cream)' }} aria-labelledby="faq-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-text-muted)' }}>{t('faq.tag')}</p>
                <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{t('faq.heading')}</h2>
              </div>
            </FadeSection>
            <FadeSection>
              <div className="max-w-3xl mx-auto">
                {faqKeys.map(n => (
                  <FAQItem key={n} q={t(`faq.q${n}`)} a={t(`faq.a${n}`)} />
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ── LOCATIONS ── */}
        <section id="locations" className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="locations-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-text-muted)' }}>{t('locations.tag')}</p>
                <h2 id="locations-heading" className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>{t('locations.heading')}</h2>
                <p className="text-sm font-normal" style={{ color: 'var(--brand-text-muted)' }}>{t('locations.subheading')}</p>
              </div>
            </FadeSection>
            <FadeSection>
              <div className="space-y-2.5">
                {regionData.map((region, i) => (
                  <AccordionItem key={region.regionName} regionName={region.regionName} cities={region.cities} citiesLabel={t('locations.cities')} defaultOpen={i === 0} locale={locale} />
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative py-20 px-6 text-center text-white overflow-hidden" aria-label="Call to action">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/bg-cta.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} role="presentation" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: 'rgba(27,58,92,0.9)' }} />
          <div className="relative max-w-6xl mx-auto">
            <FadeSection>
              <h2 className="font-extrabold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
                {t('cta.headline')} <span style={{ color: 'var(--brand-yellow)' }}>{t('cta.headlineHighlight')}</span>
              </h2>
              <p className="text-base font-normal mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('cta.subheadline')}
              </p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white" style={{ background: 'var(--wa-green)' }}><WAIcon />{t('cta.button')}</a>
              <p className="mt-4 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('cta.fine')}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true"><path d="M10 1L3 5v5c0 4.5 3 8.5 7 9.5 4-1 7-5 7-9.5V5l-7-4z" fill="var(--brand-yellow)" fillOpacity="0.3" stroke="var(--brand-yellow)" strokeWidth="1.5" /><path d="M7 10l2 2 4-4" stroke="var(--brand-yellow)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-xs font-medium" style={{ color: 'var(--brand-yellow)', opacity: 0.8 }}>{t('guarantee.text')}</span>
              </div>
            </FadeSection>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ background: '#0F2238' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-yellow)' }}><AircondIcon /></div>
                <span className="font-extrabold text-lg text-white tracking-tight">Encik Beku</span>
              </div>
              <p className="text-xs font-normal leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{footer('description')}</p>
              <div className="flex items-center gap-4 mt-4">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-80" style={{ color: 'var(--wa-green)' }}><WAIcon />{footer('whatsappUs')}</a>
                <span className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>{footer('phone')}</span>
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-yellow)' }}>{footer('servicesTitle')}</h3>
              <ul className="space-y-2 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {serviceKeys.map(svc => <li key={svc.key}><a href="#services" className="hover:text-white transition-colors">{t(`services.${svc.key}`)}</a></li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-yellow)' }}>{footer('locationsTitle')}</h3>
              <ul className="space-y-2 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {locations.slice(0, 5).map(loc => <li key={loc.slug}><a href={`/${locale}/service-aircond/${loc.slug}`} className="hover:text-white transition-colors">{loc.names[locale as 'en' | 'ms' | 'zh'] ?? loc.displayName}</a></li>)}
                <li><a href="#locations" className="font-medium hover:text-white transition-colors" style={{ color: 'var(--brand-blue-light)' }}>{footer('viewAll')} &rarr;</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-normal" style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}>
            <p>{footer('copyright', { year: new Date().getFullYear() })} · {footer('ssm')}</p>
            <div className="flex gap-5">
              <a href="#services" className="hover:text-white transition-colors">{nav('services')}</a>
              <a href="#reviews" className="hover:text-white transition-colors">{nav('reviews')}</a>
              <a href="#locations" className="hover:text-white transition-colors">{nav('locations')}</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
