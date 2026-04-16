'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { products } from '@/config/products'
import { locations, footerLocations } from '@/config/locations'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Link from 'next/link'

/* ── SVG Icons ── */
const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)
const MotorcycleIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" aria-hidden="true">
    <circle cx="7" cy="23" r="4" stroke="white" strokeWidth="2" />
    <circle cx="25" cy="23" r="4" stroke="white" strokeWidth="2" />
    <path d="M11 23h10M7 23l4-10h6l4 3h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 13l2-4h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="var(--brand-primary)" fillOpacity="0.1" />
    <path d="M6 10l3 3 5-5" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0 transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--brand-dark)' }} fill="none" aria-hidden="true">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
    <path d="M12 2l8 4v6c0 5.25-3.4 10.06-8 11.5C7.4 22.06 4 17.25 4 12V6l8-4z" stroke="var(--brand-primary)" strokeWidth="2" />
    <path d="M9 12l2 2 4-4" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── WhatsApp redirect helper ── */
function waRedirect(locale: string, message?: string, location?: string) {
  const params = new URLSearchParams()
  if (message) params.set('message', message)
  if (location) params.set('location', location)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}

/* ── Product key mapping ── */
const productKeys = [
  { id: 'honda-vario-160', key: 'hondaVario160', waMsg: 'Hi, I want to rent a Honda Vario 160. Please quote me.', image: 'https://static.wixstatic.com/media/d3104b_faf2c9b553024c99a574ba1c3f88f540~mv2.png' },
  { id: 'yamaha-nmax-155', key: 'yamahaNMax155', waMsg: 'Hi, I want to rent a Yamaha NMax 155. Please quote me.', image: 'https://static.wixstatic.com/media/d3104b_aa0965363b834584b47f1d8151b3af0d~mv2.png' },
  { id: 'honda-pcx-160', key: 'hondaPCX160', waMsg: 'Hi, I want to rent a Honda PCX 160. Please quote me.', image: 'https://static.wixstatic.com/media/d3104b_64644788b376433cab1adba0d3511c7c~mv2.png' },
  { id: 'honda-wave-125', key: 'hondaWave125', waMsg: 'Hi, I want to rent a Honda Wave 125. Please quote me.', image: 'https://static.wixstatic.com/media/d3104b_5c25b842c6174b3789267ddcb6db06cf~mv2.png' },
  { id: 'yamaha-y15zr', key: 'yamahaY15ZR', waMsg: 'Hi, I want to rent a Yamaha Y15ZR. Please quote me.', image: 'https://static.wixstatic.com/media/d3104b_bda6410cb3b14a8691845502dfa4fdc9~mv2.png' },
  { id: 'modenas-kriss-mr3', key: 'modenasKrissMR3', waMsg: 'Hi, I want to rent a Modenas Kriss MR3. Please quote me.', image: 'https://static.wixstatic.com/media/d3104b_1365fb72ef5b40f6bbf0fe1a788ab721~mv2.png' },
]

const galleryImages = [
  'https://static.wixstatic.com/media/d3104b_094523df361a4317bd8b72c793db7731~mv2.png',
  'https://static.wixstatic.com/media/d3104b_107d036393404dd48a6f5cde0f114563~mv2.png',
  'https://static.wixstatic.com/media/d3104b_14893fda01dc4f4990934ac48d29e3f8~mv2.png',
  'https://static.wixstatic.com/media/d3104b_3ee03ff97c634ba9820f97c08b44866f~mv2.png',
  'https://static.wixstatic.com/media/d3104b_445b3558948c44b7a71304bd530c8b49~mv2.png',
  'https://static.wixstatic.com/media/d3104b_54a39cfcad034d49a13050b072dd6466~mv2.png',
  'https://static.wixstatic.com/media/d3104b_5bf689a5800540809fc0960f131afd0c~mv2.png',
  'https://static.wixstatic.com/media/d3104b_609ca5dec3bc49e8bdc11549b278ad51~mv2.png',
  'https://static.wixstatic.com/media/d3104b_6d1163d7a1d941d18f046abe7f076295~mv2.png',
  'https://static.wixstatic.com/media/d3104b_755dbff91a0340ce96d44512185a152b~mv2.png',
  'https://static.wixstatic.com/media/d3104b_792a3ce428f944dc86b37e9560353b59~mv2.png',
  'https://static.wixstatic.com/media/d3104b_8c29f6eb05a14295bbd2e7236ce46c0f~mv2.png',
]

/* ── Hooks & helpers ── */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function FadeSection({ children, className = '', delay = 0, full = false }: { children: React.ReactNode; className?: string; delay?: number; full?: boolean }) {
  const ref = useFadeUp()
  return <div ref={ref} className={`fade-up ${full ? 'h-full' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

/* ── FOMO Banner ── */
function FomoBanner() {
  const fomoT = useTranslations('fomo')
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
        <span className="font-medium">{fomoT('message', { slots: slotsLeft })}</span>
        <span className="font-mono font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
        <a href="#" className="font-semibold underline underline-offset-2 hover:no-underline shrink-0">{fomoT('bookNow')} &rarr;</a>
      </div>
    </div>
  )
}

/* ── Accordion ── */
function AccordionItem({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--brand-border)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer text-sm font-semibold" style={{ color: 'var(--brand-dark)' }} aria-expanded={open}>
        <span className="pr-4">{title}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '500px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div className="pb-4">{children}</div>
      </div>
    </div>
  )
}

/* ── FAQ Accordion ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--brand-border)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer text-sm font-semibold" style={{ color: 'var(--brand-dark)' }} aria-expanded={open}>
        <span className="pr-4">{q}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '300px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <p className="pb-4 text-sm font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.75' }}>{a}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   LOCATION PAGE CLIENT
   ══════════════════════════════════════════ */
interface LocationPageClientProps {
  locale: string
  locationSlug: string
  displayName: string
  state: string
  nearbyLocations: { slug: string; displayName: string; state: string }[]
}

export default function LocationPageClient({
  locale,
  locationSlug,
  displayName,
  state,
  nearbyLocations,
}: LocationPageClientProps) {
  const t = useTranslations('location')
  const tProducts = useTranslations('home.products')
  const tHome = useTranslations('home')
  const nav = useTranslations('nav')
  const footer = useTranslations('footer')
  const s = useTranslations('shared')

  const WA_LINK = waRedirect(locale, `Hi, I want to rent a motorcycle in ${displayName}. Please quote me.`, locationSlug)

  // Group locations by state (same as homepage)
  const stateGroups = locations.reduce<Record<string, typeof locations>>((acc, loc) => {
    if (!acc[loc.state]) acc[loc.state] = []
    acc[loc.state].push(loc)
    return acc
  }, {})
  const stateNames = Object.keys(stateGroups).sort()

  const reviews = [
    { text: 'Rented a Honda Vario 160 for a month and it was in perfect condition. Same-day delivery as promised. Will definitely rent again.', author: 'Ahmad R.', location: 'Petaling Jaya' },
    { text: 'I needed a motorbike urgently for food delivery work. Sewa Motor delivered a Yamaha Y15ZR to my place the same day I messaged them on WhatsApp. Very reliable.', author: 'Wei Liang C.', location: 'Kuala Lumpur' },
    { text: 'Budget-friendly and hassle-free. I rented the Modenas Kriss MR3 at RM30/day while my own bike was in the workshop. Great service and friendly team.', author: 'Priya S.', location: 'Shah Alam' },
    { text: 'Saya sewa Honda Wave 125 untuk seminggu. Harga sangat berbaloi dan motor dalam keadaan baik. Highly recommend untuk sesiapa yang perlukan motor sementara.', author: 'Faizal M.', location: 'Ipoh' },
    { text: 'Tourist here. Rented the NMax for a week to explore Penang. The bike was clean, well-maintained, and delivered right to my Airbnb. Best way to explore the island!', author: 'Sarah K.', location: 'Penang' },
    { text: 'Grab rider here. My bike was in the workshop so I rented the Vario 160 for 2 weeks. Smooth ride, fuel-efficient, and the rental cost was way less than losing income.', author: 'Rizal A.', location: 'Johor Bahru' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--brand-surface)' }}>
      {/* ── FOMO BANNER ── */}
      <FomoBanner />

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50" style={{ background: 'var(--brand-dark)', boxShadow: '0 2px 12px rgba(22,33,62,0.2)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2.5" aria-label="Sewa Motor Malaysia homepage">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-primary)' }}>
              <MotorcycleIcon />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white leading-tight">Sewa Motor</div>
              <div className="text-[11px] font-normal" style={{ color: 'rgba(255,255,255,0.45)' }}>sewamotor.my</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
            {[{ label: nav('products'), href: '#products' }, { label: nav('locations'), href: '#locations' }].map(link => (
              <a key={link.href} href={link.href} className="nav-link focus:outline-none">{link.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a href={WA_LINK} className="wa-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ background: 'var(--wa-green)' }}>
              <WAIcon /><span className="hidden sm:inline">{nav('whatsapp')}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMBS ── */}
      <nav className="max-w-6xl mx-auto px-6 py-3" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>
          <li>
            <Link href={`/${locale}`} className="hover:underline" style={{ color: 'var(--brand-primary)' }}>
              {t('breadcrumbs.home')}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li style={{ color: 'var(--brand-dark)' }}>{displayName}</li>
        </ol>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden" aria-label="Hero">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/d3104b_f1742c506a064da3af63f6b834024ad4~mv2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(22,33,62,0.92) 0%, rgba(26,39,68,0.88) 40%, rgba(30,45,74,0.85) 100%)' }} />
          <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-0 md:pt-16 md:pb-0">
            <div className="grid md:grid-cols-2 gap-8 items-end">
              {/* Text */}
              <div className="pb-8 md:pb-16">
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-white" style={{ background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.3)' }}>
                    {t('badges.sameDayDelivery', { city: displayName })}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-white" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {t('badges.affordable')}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                  {t('hero.headline', { city: displayName })}
                </h1>
                <p className="text-sm md:text-base font-normal mb-6" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75' }}>
                  {t('hero.intro', { city: displayName })}
                </p>
                <a href={WA_LINK} className="wa-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-base font-bold text-white" style={{ background: 'var(--wa-green)' }}>
                  <WAIcon />{t('cta.button', { city: displayName })}
                </a>
                <p className="text-[11px] mt-3 font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>{s('freeToAsk')}</p>
              </div>
              {/* Hero image */}
              <div className="relative flex justify-center md:justify-end">
                <img src="https://static.wixstatic.com/media/d3104b_9219aed8e59e4a0d9ee86be2066ff532~mv2.png" alt={`Motorcycle rental ${displayName}`} className="w-64 sm:w-72 md:w-[360px] lg:w-[420px]" style={{ display: 'block', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))', marginBottom: '-40px' }} />
                {/* Parallelogram price stamp */}
                <div className="absolute top-4 right-0 md:right-4 px-4 py-2 z-10" style={{ background: 'var(--brand-primary)', transform: 'skewX(-6deg)', boxShadow: '0 4px 16px rgba(255,107,53,0.35)' }}>
                  <div style={{ transform: 'skewX(6deg)' }} className="text-center">
                    <span className="text-[11px] font-semibold uppercase text-white block leading-none">From</span>
                    <span className="text-xl font-extrabold text-white leading-none">RM30</span>
                    <span className="text-[11px] font-medium uppercase text-white block leading-none">/day</span>
                  </div>
                </div>
                {/* Same-day pill */}
                <div className="absolute bottom-16 left-0 sm:left-4 px-3 py-2 rounded-xl flex items-center gap-2 z-10" style={{ background: '#fff', boxShadow: '0 4px 16px rgba(22,33,62,0.15)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--brand-primary)' }}>
                    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" aria-hidden="true"><path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-bold" style={{ color: 'var(--brand-dark)' }}>Same-Day Delivery</div>
                    <div className="text-[11px] font-normal" style={{ color: 'var(--brand-text-muted)' }}>7 Days a Week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ background: 'var(--brand-dark)' }}>
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: s('stats.value1'), label: s('stats.label1') },
              { value: s('stats.value2'), label: s('stats.label2') },
              { value: s('stats.value3'), label: s('stats.label3') },
              { value: s('stats.value4'), label: s('stats.label4') },
            ].map((stat, i) => (
              <FadeSection key={i} delay={i * 80}>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: 'var(--brand-primary)', letterSpacing: '-0.03em' }}>{stat.value}</div>
                  <div className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>{stat.label}</div>
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section id="products" className="py-16 px-6" style={{ background: 'var(--brand-surface)' }} aria-labelledby="products-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>Motorcycles & Pricing</span>
                <h2 id="products-heading" className="text-2xl md:text-3xl font-bold mt-2" style={{ color: 'var(--brand-dark)' }}>
                  {t('banner.heading', { city: displayName })}
                </h2>
                <p className="text-sm font-normal mt-2" style={{ color: 'var(--brand-text-muted)' }}>
                  {t('banner.description', { city: displayName })}
                </p>
              </div>
            </FadeSection>
            <div className="grid md:grid-cols-3 gap-5">
              {productKeys.map((pk, i) => {
                const p = products.find(pr => pr.id === pk.id)!
                return (
                  <FadeSection key={pk.id} delay={i * 60} full>
                    <div className="product-card h-full flex flex-col">
                      <div className="relative p-4 flex items-center justify-center" style={{ background: 'var(--brand-primary-xs)', minHeight: '140px' }}>
                        <img src={pk.image} alt={tProducts(`${pk.key}.name` as any)} className="h-28 object-contain" />
                        {p.badge && (
                          <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide text-white" style={{ background: p.badge === 'badgeMostPopular' ? 'var(--brand-primary-dark)' : p.badge === 'badgeBestValue' ? 'var(--brand-primary)' : 'var(--brand-dark)' }}>
                            {tProducts(p.badge as any)}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>{tProducts(`${pk.key}.name` as any)}</h3>
                        <p className="text-xs font-normal mb-4 flex-1" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.6' }}>{tProducts(`${pk.key}.description` as any)}</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {(['daily', 'weekly', 'monthly'] as const).map(period => (
                            <div key={period} className="px-2 py-2 rounded-lg text-center" style={{ background: 'var(--brand-primary-xs)' }}>
                              <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--brand-text-muted)' }}>{tProducts(period as any)}</div>
                              <div className="text-sm font-extrabold" style={{ color: 'var(--brand-dark)' }}>{tProducts(`${pk.key}.${period}` as any)}</div>
                            </div>
                          ))}
                        </div>
                        <a href={waRedirect(locale, pk.waMsg + ' Location: ' + displayName, locationSlug)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 w-full" style={{ background: 'var(--brand-primary)' }}>
                          <WAIcon />{tProducts('cta')}
                        </a>
                      </div>
                    </div>
                  </FadeSection>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 px-6" style={{ background: '#fff' }}>
          <div className="max-w-4xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>Simple Process</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: 'var(--brand-dark)' }}>{tHome('howItWorks.heading')}</h2>
              </div>
            </FadeSection>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n, i) => (
                <FadeSection key={n} delay={i * 100} full>
                  <div className="text-center p-6 h-full">
                    <div className="text-4xl font-extrabold mb-3 gradient-text">0{n}</div>
                    <h3 className="text-base font-bold mb-2" style={{ color: 'var(--brand-dark)' }}>{tHome(`howItWorks.step${n}Title` as any)}</h3>
                    <p className="text-sm font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{tHome(`howItWorks.step${n}Desc` as any)}</p>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── RISK / PROBLEM ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-surface)' }}>
          <div className="max-w-3xl mx-auto">
            <FadeSection>
              <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: 'var(--brand-dark)' }}>{tHome('risk.heading')}</h2>
              <div className="space-y-4 text-sm font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.8' }}>
                <p>{tHome('risk.paragraph1')}</p>
                <p>{tHome('risk.paragraph2')}</p>
                <p className="font-semibold" style={{ color: 'var(--brand-dark)' }}>{tHome('risk.paragraph3')}</p>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ── MID CTA ── */}
        <section className="py-10 px-6" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-coral))' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white text-base md:text-lg font-semibold mb-4">{s('midCta')}</p>
            <a href={WA_LINK} className="wa-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'var(--wa-green)' }}>
              <WAIcon />{s('midCtaButton')}
            </a>
            <p className="text-[11px] mt-3 font-normal text-white" style={{ opacity: 0.7 }}>
              <ShieldIcon /> {s('safetyNote')}
            </p>
          </div>
        </section>

        {/* ── GOOGLE REVIEWS ── */}
        <section id="reviews" className="relative py-16 px-6 overflow-hidden" aria-labelledby="reviews-heading">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/d3104b_f1742c506a064da3af63f6b834024ad4~mv2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} role="presentation" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: 'rgba(22,33,62,0.90)' }} />
          <div className="relative max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <GoogleLogo />
                  <span className="text-sm font-medium text-white">Google Reviews</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-3xl font-extrabold" style={{ color: 'var(--brand-primary)' }}>4.9</span>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <GoogleStarIcon key={i} />)}</div>
                </div>
                <h2 id="reviews-heading" className="text-2xl md:text-3xl font-bold text-white">{t('cta.heading', { city: displayName })}</h2>
                <p className="text-xs font-normal mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{s('reviewsSubtext')}</p>
              </div>
            </FadeSection>
            <div className="grid grid-flow-col md:grid-flow-row auto-cols-[75%] md:auto-cols-auto md:grid-cols-3 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory -mx-2 px-2 md:mx-0 md:px-0 hide-scrollbar">
              {reviews.map((rev, i) => (
                <FadeSection key={i} delay={i * 100} full>
                  <article className="review-card p-5 snap-start h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <GoogleLogo />
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                    </div>
                    <blockquote className="text-sm font-normal mb-5 leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.85)' }}>&ldquo;{rev.text}&rdquo;</blockquote>
                    <div className="flex items-center gap-2.5 mt-auto">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--brand-primary)', color: '#fff' }}>
                        {rev.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{rev.author}</div>
                        <div className="text-xs font-normal" style={{ color: 'var(--brand-primary)' }}>{rev.location}</div>
                      </div>
                    </div>
                  </article>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE ── */}
        <section className="py-16 px-6" style={{ background: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>{displayName}</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: 'var(--brand-dark)' }}>
                  {t('whyChoose.heading', { city: displayName })}
                </h2>
              </div>
            </FadeSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { title: s('whyChoose.title1'), desc: t('whyChoose.fleet', { city: displayName }) },
                { title: s('whyChoose.title2'), desc: t('whyChoose.delivery', { city: displayName }) },
                { title: s('whyChoose.title3'), desc: t('whyChoose.affordable', { city: displayName }) },
                { title: s('whyChoose.title4'), desc: t('whyChoose.support', { city: displayName }) },
              ].map((item, i) => (
                <FadeSection key={i} delay={i * 80} full>
                  <div className="h-full">
                    <div className="text-4xl font-extrabold" style={{ color: 'var(--brand-primary)', letterSpacing: '-0.03em' }}>0{i + 1}</div>
                    <div className="w-8 h-[2px] mt-3 mb-4" style={{ background: 'var(--brand-primary)' }} />
                    <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--brand-dark)' }}>{item.title}</h3>
                    <p className="text-xs font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{item.desc}</p>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY (marquee) ── */}
        <section className="py-12 px-6 overflow-hidden" style={{ background: 'var(--brand-surface)' }}>
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-8">
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>{s('galleryLabel')}</span>
                <h2 className="text-xl md:text-2xl font-bold mt-2" style={{ color: 'var(--brand-dark)' }}>{s('galleryHeading')}</h2>
              </div>
            </FadeSection>
            <div className="overflow-hidden">
              <div className="marquee-track">
                {[...galleryImages, ...galleryImages].map((img, i) => (
                  <img key={i} src={img} alt={`Motorcycle rental customer ${(i % galleryImages.length) + 1}`} className="w-48 h-36 object-cover rounded-xl shrink-0" style={{ border: '2px solid var(--brand-border)' }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── LOCATIONS ACCORDION ── */}
        <section id="locations" className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="locations-heading">
          <div className="max-w-4xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>Service Coverage</span>
                <h2 id="locations-heading" className="text-2xl md:text-3xl font-bold mt-2" style={{ color: 'var(--brand-dark)' }}>{tHome('locations.heading')}</h2>
                <p className="text-sm font-normal mt-2" style={{ color: 'var(--brand-text-muted)' }}>{tHome('locations.subheading')}</p>
              </div>
            </FadeSection>
            <div>
              {stateNames.map((st, i) => (
                <AccordionItem key={st} title={`${st} (${stateGroups[st].length} cities)`} defaultOpen={st === state}>
                  <div className="flex flex-wrap gap-2">
                    {stateGroups[st].map(loc => (
                      <a key={loc.slug} href={`/${locale}/sewa-motor/${loc.slug}`} className="px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity" style={{ background: 'var(--brand-primary-xs)', color: 'var(--brand-primary)' }}>
                        {loc.displayName}
                      </a>
                    ))}
                  </div>
                </AccordionItem>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-surface)' }} aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>FAQ</span>
                <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold mt-2" style={{ color: 'var(--brand-dark)' }}>
                  {t('faq.heading', { city: displayName })}
                </h2>
              </div>
            </FadeSection>
            <div className="bg-white rounded-xl p-6" style={{ border: '1px solid var(--brand-border)' }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const n = i + 1
                return (
                  <FAQItem
                    key={n}
                    q={t(`faq.q${n}` as any, { city: displayName })}
                    a={t(`faq.a${n}` as any, { city: displayName })}
                  />
                )
              })}
            </div>
          </div>
        </section>

        {/* ── NEARBY LOCATIONS ── */}
        {nearbyLocations.length > 0 && (
          <section className="py-16 px-6" style={{ background: '#fff' }}>
            <div className="max-w-4xl mx-auto">
              <FadeSection>
                <div className="text-center mb-8">
                  <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>{t('nearby.heading')}</span>
                  <p className="text-sm font-normal mt-2" style={{ color: 'var(--brand-text-muted)' }}>
                    {t('nearby.description', { city: displayName })}
                  </p>
                </div>
              </FadeSection>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {nearbyLocations.map((nearby, i) => (
                  <FadeSection key={nearby.slug} delay={i * 60}>
                    <Link
                      href={`/${locale}/sewa-motor/${nearby.slug}`}
                      className="block p-4 rounded-xl text-center hover:scale-[1.02] transition-transform"
                      style={{ background: '#fff', border: '1px solid var(--brand-border)' }}
                    >
                      <div className="text-sm font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>{nearby.displayName}</div>
                      <div className="text-[11px] font-normal" style={{ color: 'var(--brand-text-muted)' }}>{nearby.state}</div>
                    </Link>
                  </FadeSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FINAL CTA ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-dark)' }}>
          <div className="max-w-3xl mx-auto text-center">
            <FadeSection>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {t('cta.heading', { city: displayName })}
              </h2>
              <p className="text-sm font-normal mb-6" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>
                {t('cta.subheading', { city: displayName })}
              </p>
              <a href={WA_LINK} className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white" style={{ background: 'var(--wa-green)' }}>
                <WAIcon />{t('cta.button', { city: displayName })}
              </a>
              <p className="text-[11px] mt-4 font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>Response within 1 hour · No hidden charges · 7 days a week</p>
            </FadeSection>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6" style={{ background: '#0F1A2E' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-primary)' }}>
                <MotorcycleIcon />
              </div>
              <span className="text-sm font-bold text-white">Sewa Motor</span>
            </div>
            <p className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}>{footer('tagline')}</p>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{footer('quickLinks')}</h4>
            <div className="space-y-2">
              <Link href={`/${locale}`} className="block text-xs text-white hover:opacity-80">{footer('home')}</Link>
              <a href="#products" className="block text-xs text-white hover:opacity-80">{footer('products')}</a>
              <a href="#locations" className="block text-xs text-white hover:opacity-80">{footer('locations')}</a>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{footer('topLocations')}</h4>
            <div className="space-y-2">
              {footerLocations.map(loc => (
                <Link key={loc.slug} href={`/${locale}/sewa-motor/${loc.slug}`} className="block text-xs text-white hover:opacity-80">{loc.displayName}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Contact</h4>
            <a href={WA_LINK} className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-80" style={{ color: 'var(--wa-green)' }}><WAIcon />WhatsApp Us</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[11px] font-normal" style={{ color: 'rgba(255,255,255,0.3)' }}>{footer('copyright', { year: new Date().getFullYear().toString() })}</p>
        </div>
      </footer>
    </div>
  )
}
