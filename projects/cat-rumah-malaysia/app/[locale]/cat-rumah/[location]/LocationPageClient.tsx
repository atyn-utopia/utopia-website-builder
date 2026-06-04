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

// Product list mirrors HomePageClient so the location page shows the same
// 9-card services grid as the homepage.
const PRODUCT_KEYS = [
  { key: 'interior', img: '/images/products/interior-1.jpg' },
  { key: 'bedroom', img: '/images/products/bedroom-1.jpg' },
  { key: 'kitchen', img: '/images/products/kitchen-1.jpg' },
  { key: 'bathroom', img: '/images/products/bathroom-1.jpg' },
  { key: 'exterior', img: '/images/products/exterior-1.jpg' },
  { key: 'weathershield', img: '/images/products/exterior-2.jpg' },
  { key: 'marble', img: '/images/products/marble-1.jpg' },
  { key: 'texture', img: '/images/products/texture-1.jpg' },
  { key: 'decor3d', img: '/images/products/decor3d-1.jpg' },
]

// Calculator service rates — mirror catrumah.com.my (also mirrors homepage).
type CalcMode = 'sqft' | 'package'
interface CalcService { key: string; mode: CalcMode; rate: number; packages?: { id: 'single' | 'medium' | 'large'; price: number }[] }
const CALC_SERVICES: CalcService[] = [
  { key: 'interior', mode: 'sqft', rate: 3.5 },
  { key: 'bedroom', mode: 'sqft', rate: 3.5 },
  { key: 'kitchen', mode: 'sqft', rate: 3.5 },
  { key: 'bathroom', mode: 'sqft', rate: 3.5 },
  { key: 'exterior', mode: 'sqft', rate: 3.5 },
  { key: 'weathershield', mode: 'sqft', rate: 4.5 },
  { key: 'marble', mode: 'package', rate: 0, packages: [{ id: 'single', price: 2250 }, { id: 'medium', price: 3500 }, { id: 'large', price: 5500 }] },
  { key: 'texture', mode: 'package', rate: 0, packages: [{ id: 'single', price: 2500 }, { id: 'medium', price: 3800 }, { id: 'large', price: 6000 }] },
  { key: 'decor3d', mode: 'package', rate: 0, packages: [{ id: 'single', price: 3500 }, { id: 'medium', price: 5500 }, { id: 'large', price: 8500 }] },
]

function formatRM(value: number): string {
  return value.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// Mirror the homepage 6-reason whyChoose grid (with matching icons).
const REASON_ITEMS: { key: string; icon: 'paint' | 'bolt' | 'shield' | 'tag' | 'badge' | 'pin' }[] = [
  { key: 'reason1', icon: 'paint' },
  { key: 'reason2', icon: 'bolt' },
  { key: 'reason3', icon: 'tag' },
  { key: 'reason4', icon: 'shield' },
  { key: 'reason5', icon: 'badge' },
  { key: 'reason6', icon: 'pin' },
]

const ReasonIcon = ({ name }: { name: typeof REASON_ITEMS[number]['icon'] }) => {
  const props = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true } as const
  switch (name) {
    case 'paint':  return (<svg {...props}><rect x="3" y="3" width="18" height="6" rx="1" /><path d="M21 6h2v6h-9v3" /><path d="M11 15h3v6h-3z" /></svg>)
    case 'bolt':   return (<svg {...props}><path d="M13 2L3 14h9l-1 8 10-12h-9z" /></svg>)
    case 'shield': return (<svg {...props}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>)
    case 'tag':    return (<svg {...props}><path d="M20 12l-8.5 8.5a2 2 0 01-2.8 0L2 13.8V4h9.8L20 12z" /><circle cx="7" cy="9" r="1.5" /></svg>)
    case 'badge':  return (<svg {...props}><circle cx="12" cy="9" r="6" /><path d="M9 14l-2 7 5-3 5 3-2-7" /><path d="M9 9l2 2 4-4" /></svg>)
    case 'pin':    return (<svg {...props}><path d="M12 22s-7-7.5-7-13a7 7 0 1114 0c0 5.5-7 13-7 13z" /><circle cx="12" cy="9" r="2.5" /></svg>)
  }
}

// 12-image gallery mirrors the homepage.
const GALLERY_IMAGES = ['job-80','job-82','job-83','job-85','job-86','job-87','job-88','job-89','job-90','job-92','job-94','job-96'].map((n) => `/images/gallery/${n}.jpg`)

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
  const tHomeProducts = useTranslations('home.products')
  const tHomeWhy = useTranslations('home.whyChoose')
  const tHomeGallery = useTranslations('home.gallery')
  const tCalc = useTranslations('home.calculator')
  const tUsp = useTranslations('home.usp')
  const waLink = waRedirect(locale, undefined, locationSlug)

  // Calculator state — same component-level state as the homepage.
  const [calcServiceKey, setCalcServiceKey] = useState(CALC_SERVICES[0].key)
  const [calcArea, setCalcArea] = useState(1000)
  const [calcPkg, setCalcPkg] = useState<'single' | 'medium' | 'large'>('single')
  const calcService = CALC_SERVICES.find((s) => s.key === calcServiceKey) ?? CALC_SERVICES[0]
  const calcEstimate = calcService.mode === 'sqft'
    ? Math.round(Math.max(calcArea, 50) * calcService.rate)
    : calcService.packages?.find((p) => p.id === calcPkg)?.price ?? 0
  const calcDetail = calcService.mode === 'sqft'
    ? `${Math.max(calcArea, 50)} sqft`
    : tCalc(`package${calcPkg.charAt(0).toUpperCase() + calcPkg.slice(1)}` as 'packageSingle' | 'packageMedium' | 'packageLarge')
  const calcMessage = tCalc('messageTemplate', {
    service: tHomeProducts(`${calcServiceKey}.title`),
    price: formatRM(calcEstimate),
    detail: `${calcDetail} (${cityName})`,
  })
  const calcWaHref = waRedirect(locale, calcMessage, locationSlug)
  const sqftServices = CALC_SERVICES.filter((s) => s.mode === 'sqft')
  const packageServices = CALC_SERVICES.filter((s) => s.mode === 'package')

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

      {/* WHY CHOOSE — full 6-reason grid mirrors the homepage */}
      <section className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="loc-why-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{tHomeWhy('tag')}</h5>
              <h3 id="loc-why-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{t('why.heading', { city: cityName })}</h3>
            </div>
          </FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
            {REASON_ITEMS.map((r) => (
              <FadeSection key={r.key}>
                <div className="why-card p-5 rounded-2xl flex gap-4" style={{ background: 'var(--brand-cream)', border: '1px solid var(--line)', height: '100%' }}>
                  <span className="shrink-0 inline-flex items-center justify-center rounded-full" style={{ width: 52, height: 52, background: 'var(--brand-yellow)', color: 'var(--brand-blue)' }} aria-hidden="true">
                    <ReasonIcon name={r.icon} />
                  </span>
                  <div>
                    <h5 className="text-sm font-bold mb-1" style={{ color: 'var(--brand-ink)' }}>{tHomeWhy(`${r.key}.title`)}</h5>
                    <h5 className="text-xs font-normal" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{tHomeWhy(`${r.key}.description`)}</h5>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — mirrors the homepage 12-image grid */}
      <section className="py-16 px-6" style={{ background: 'var(--brand-cream)' }} aria-labelledby="loc-gallery-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{tHomeGallery('tag')}</h5>
              <h3 id="loc-gallery-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{tHomeGallery('heading')}</h3>
            </div>
          </FadeSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {GALLERY_IMAGES.map((src, i) => (
              <div key={src} className="aspect-square rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid var(--line)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={tHomeGallery('imageAlt', { number: i + 1 })} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS — mirrors the homepage 9-card services grid */}
      <section id="products" className="py-16 px-6" style={{ background: 'var(--brand-cream)' }} aria-labelledby="loc-products-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{tHomeProducts('tag')}</h5>
              <h3 id="loc-products-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{tHomeProducts('heading')}</h3>
              <h5 className="text-sm font-normal mt-2 max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{tHomeProducts('subheading')}</h5>
            </div>
          </FadeSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ gridAutoRows: '1fr' }}>
            {PRODUCT_KEYS.map((p) => (
              <FadeSection key={p.key}>
                <div className="bg-white rounded-2xl overflow-hidden flex flex-col" style={{ border: '1px solid var(--line)', boxShadow: '0 6px 20px rgba(17, 17, 17, 0.04)', height: '100%' }}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', background: 'var(--brand-cream)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={tHomeProducts(`${p.key}.title`)} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="px-5 pt-5 pb-5 flex flex-col">
                    <h3 className="text-[17px] m-0" style={{ color: 'var(--brand-ink)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em', minHeight: 'calc(1.3em * 2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {tHomeProducts(`${p.key}.title`)}
                    </h3>
                    <p className="m-0 mt-3" style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.6, height: 'calc(1.6em * 2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {tHomeProducts(`${p.key}.description`)}
                    </p>
                    <div className="mt-5 pt-4 flex items-center justify-between gap-3" style={{ borderTop: '1px solid var(--line)' }}>
                      <div className="flex flex-col leading-tight">
                        <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--muted)', fontWeight: 500 }}>{tHomeProducts('fromLabel')}</span>
                        <span className="text-[20px]" style={{ color: 'var(--brand-pink)', fontWeight: 700, letterSpacing: '-0.01em' }}>{tHomeProducts(`${p.key}.price`).replace(/^Dari\s+/i, '')}</span>
                      </div>
                      <WhatsAppClickTracker phoneNumber={phoneNumber} href={waLink} target="_blank" rel="noopener noreferrer" aria-label={tHomeProducts('bookNow')} className="shrink-0 inline-flex items-center justify-center rounded-full" style={{ background: '#25D366', color: '#fff', width: 44, height: 44, boxShadow: '0 6px 16px rgba(37, 211, 102, 0.30)' }}>
                        <WAIcon />
                      </WhatsAppClickTracker>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR — same widget as homepage, pre-tied to this location */}
      <section id="calculator" className="py-16 px-6" style={{ background: '#fff', borderTop: '1px solid var(--line)' }} aria-labelledby="loc-calc-heading">
        <div className="max-w-5xl mx-auto">
          <FadeSection>
            <div className="text-center mb-8">
              <h5 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{tCalc('tag')}</h5>
              <h3 id="loc-calc-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{tCalc('heading')}</h3>
              <h5 className="text-sm font-normal mt-2 max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{tCalc('subheading')}</h5>
            </div>
          </FadeSection>
          <FadeSection>
            <div className="rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-6 md:gap-8" style={{ background: '#fff', border: '1px solid var(--line)', boxShadow: '0 20px 50px rgba(17, 17, 17, 0.06)' }}>
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="loc-calc-service" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>{tCalc('serviceLabel')}</label>
                  <select id="loc-calc-service" value={calcServiceKey} onChange={(e) => setCalcServiceKey(e.target.value)} className="calc-select w-full px-4 py-3 rounded-xl text-sm font-semibold">
                    <optgroup label="Per sqft">
                      {sqftServices.map((s) => (
                        <option key={s.key} value={s.key}>{tHomeProducts(`${s.key}.title`)} — RM{s.rate}{tCalc('perSqftSuffix')}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Pakej">
                      {packageServices.map((s) => (
                        <option key={s.key} value={s.key}>{tHomeProducts(`${s.key}.title`)}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                {calcService.mode === 'sqft' ? (
                  <div>
                    <label htmlFor="loc-calc-area" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>{tCalc('areaLabel')}</label>
                    <input id="loc-calc-area" type="number" min={50} step={50} value={calcArea} onChange={(e) => setCalcArea(Math.max(50, Number(e.target.value) || 0))} placeholder={tCalc('areaPlaceholder')} className="w-full px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: 'var(--brand-cream)', border: '1px solid var(--line-strong)', color: 'var(--brand-ink)' }} />
                    <input type="range" min={50} max={5000} step={50} value={Math.min(calcArea, 5000)} onChange={(e) => setCalcArea(Number(e.target.value))} className="w-full mt-3" style={{ accentColor: 'var(--brand-yellow)' }} />
                  </div>
                ) : (
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>{tCalc('packageLabel')}</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['single', 'medium', 'large'] as const).map((id) => (
                        <button key={id} type="button" onClick={() => setCalcPkg(id)} className="px-3 py-2.5 rounded-xl text-[11px] font-bold text-center" style={{ background: calcPkg === id ? 'var(--brand-blue)' : 'var(--brand-cream)', color: calcPkg === id ? '#fff' : 'var(--brand-ink)', border: `1px solid ${calcPkg === id ? 'var(--brand-blue)' : 'var(--line-strong)'}` }}>
                          {tCalc(`package${id.charAt(0).toUpperCase() + id.slice(1)}` as 'packageSingle' | 'packageMedium' | 'packageLarge')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-6 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-blue-deep) 100%)', color: '#fff' }}>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--brand-yellow)' }}>{tCalc('estimateLabel')}</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>RM</span>
                    <span className="text-5xl font-bold tabular-nums" style={{ color: '#fff', letterSpacing: '-0.02em' }}>{formatRM(calcEstimate)}</span>
                  </div>
                  <p className="text-xs font-normal mt-3" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{tCalc('estimateNote')}</p>
                </div>
                <WhatsAppClickTracker phoneNumber={phoneNumber} href={calcWaHref} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold w-full" style={{ background: '#25D366', color: '#fff' }}>
                  <WAIcon /> <span style={{ color: '#fff' }}>{tCalc('ctaButton')}</span>
                </WhatsAppClickTracker>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* REVIEWS — full 6-card grid mirrors the homepage */}
      <section className="relative py-16 px-6 overflow-hidden" id="reviews" style={{ backgroundImage: 'linear-gradient(135deg, rgba(2, 61, 147, 0.88) 0%, rgba(2, 30, 76, 0.94) 100%), url(/images/painters/painter-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 hero-bg" role="img" aria-label={tHomeReviews('heading')} style={{ pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,210,63,0.16), transparent 55%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-yellow)' }}>{tHomeReviews('tag')}</h5>
              <div className="flex items-center justify-center gap-2 mb-3">
                <GoogleLogo />
                <span className="text-sm font-medium text-white">{tHomeReviews('googleReviews')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl font-bold" style={{ color: 'var(--brand-yellow)' }}>4.9</span>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <GoogleStarIcon key={i} />)}</div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">{tHomeReviews('heading')}</h3>
              <h5 className="text-sm font-normal mt-2" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{tHomeReviews('subheading')}</h5>
              <h5 className="text-xs font-normal mt-1" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{tHomeReviews('reviewCount')}</h5>
            </div>
          </FadeSection>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <FadeSection key={n}>
                <article className="p-5 rounded-2xl h-full flex flex-col" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <GoogleLogo />
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                  </div>
                  <blockquote className="text-sm font-normal mb-5 flex-1" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>&ldquo;{tHomeReviews(`review${n}Text`)}&rdquo;</blockquote>
                  <div className="flex items-center gap-2.5 mt-auto">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-ink)' }}>
                      {tHomeReviews(`review${n}Name`).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{tHomeReviews(`review${n}Name`)}</div>
                      <div className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.6)' }}>{tHomeReviews(`review${n}Location`)}</div>
                    </div>
                  </div>
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
