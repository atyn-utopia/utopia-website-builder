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
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0 transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--brand-ink)' }} fill="none" aria-hidden="true">
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

// 8 products — slug aligns with key in messages, image points to the brand
// photo in /public/images/products.
const productKeys = [
  { key: 'interior', slug: 'interior', img: '/images/products/interior-1.png' },
  { key: 'bedroom', slug: 'bedroom', img: '/images/products/bedroom-1.png' },
  { key: 'kitchen', slug: 'kitchen', img: '/images/products/kitchen-1.png' },
  { key: 'bathroom', slug: 'bathroom', img: '/images/products/bathroom-1.png' },
  { key: 'exterior', slug: 'exterior', img: '/images/products/exterior-1.png' },
  { key: 'weathershield', slug: 'weathershield', img: '/images/products/exterior-2.png' },
  { key: 'marble', slug: 'marble', img: '/images/products/marble-1.png' },
  { key: 'texture', slug: 'texture', img: '/images/products/texture-1.png' },
  { key: 'decor3d', slug: 'decor3d', img: '/images/products/decor3d-1.png' },
]

// Why-choose reasons — each has a matching SVG icon name.
const reasonItems: { key: string; icon: 'paint' | 'bolt' | 'shield' | 'tag' | 'badge' | 'pin' }[] = [
  { key: 'reason1', icon: 'paint' },   // Premium paint
  { key: 'reason2', icon: 'bolt' },    // Done in 5 hours
  { key: 'reason3', icon: 'tag' },     // Free quote
  { key: 'reason4', icon: 'shield' },  // Satisfaction guarantee
  { key: 'reason5', icon: 'badge' },   // Certified contractor
  { key: 'reason6', icon: 'pin' },     // Malaysia-wide coverage
]

const ReasonIcon = ({ name }: { name: typeof reasonItems[number]['icon'] }) => {
  const props = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true } as const
  switch (name) {
    case 'paint':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="6" rx="1" />
          <path d="M21 6h2v6h-9v3" />
          <path d="M11 15h3v6h-3z" />
        </svg>
      )
    case 'bolt':
      return (
        <svg {...props}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'tag':
      return (
        <svg {...props}>
          <path d="M20 12l-8.5 8.5a2 2 0 01-2.8 0L2 13.8V4h9.8L20 12z" />
          <circle cx="7" cy="9" r="1.5" />
        </svg>
      )
    case 'badge':
      return (
        <svg {...props}>
          <circle cx="12" cy="9" r="6" />
          <path d="M9 14l-2 7 5-3 5 3-2-7" />
          <path d="M9 9l2 2 4-4" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...props}>
          <path d="M12 22s-7-7.5-7-13a7 7 0 1114 0c0 5.5-7 13-7 13z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      )
  }
}
const faqIndexes = [1, 2, 3, 4, 5, 6, 7, 8]
const reviewIndexes = [1, 2, 3, 4, 5, 6]

// Before/After pairs — stable Unsplash photo IDs that resolve reliably on
// the CDN. Each pair is the SAME room type (interior, exterior, accent
// wall) shown pre- and post-paint so the slider reads as a real
// transformation.
const UNSPLASH = (id: string) => `https://images.unsplash.com/${id}?w=900&h=900&q=80&auto=format&fit=crop&crop=center`
const beforeAfterPairs = [
  // Interior — empty/raw room → freshly painted modern interior
  { before: UNSPLASH('photo-1513694203232-719a280e022f'), after: UNSPLASH('photo-1505691938895-1758d7feb511'), captionKey: 'pair2Caption' },
  // Exterior — weathered/older house → freshly painted exterior
  { before: UNSPLASH('photo-1506744038136-46273834b3fb'), after: UNSPLASH('photo-1518780664697-55e3ad937233'), captionKey: 'pair1Caption' },
  // Living/accent wall — older dim wall → fresh painted living room
  { before: UNSPLASH('photo-1502672260266-1c1ef2d93688'), after: UNSPLASH('photo-1493809842364-78817add7ffb'), captionKey: 'pair3Caption' },
] as const

// Draggable before/after comparison slider. Pointer events handle both mouse
// and touch in one path.
function BeforeAfterSlider({ before, after, beforeLabel, afterLabel }: { before: string; after: string; beforeLabel: string; afterLabel: string }) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(0, Math.min(100, pct)))
  }

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    update(e.clientX)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    update(e.clientX)
  }
  const onUp = () => { dragging.current = false }

  return (
    <div
      ref={ref}
      className="relative w-full select-none overflow-hidden rounded-2xl"
      style={{ aspectRatio: '1 / 1', background: 'var(--brand-cream)', border: '1px solid var(--line)', cursor: 'ew-resize', touchAction: 'none' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="img"
      aria-label={`${beforeLabel} / ${afterLabel}`}
    >
      {/* After (bottom layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <span className="absolute bottom-3 right-3 z-20 text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-ink)' }}>{afterLabel}</span>

      {/* Before (top layer, clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeLabel} className="absolute inset-0 h-full object-cover" style={{ width: ref.current?.clientWidth ? `${ref.current.clientWidth}px` : '100%' }} draggable={false} />
        <span className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: 'var(--brand-ink)', color: '#fff' }}>{beforeLabel}</span>
      </div>

      {/* Divider + drag handle */}
      <div className="absolute top-0 bottom-0 pointer-events-none z-10" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div style={{ width: 3, height: '100%', background: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.15)' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7 5l-4 5 4 5M13 5l4 5-4 5" stroke="var(--brand-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Real customer work photos — 12 cells exactly so the grid stays full at every
// breakpoint (2/3/4 cols all divide 12).
const galleryImages = [
  'job-80', 'job-82', 'job-83', 'job-85',
  'job-86', 'job-87', 'job-88', 'job-89',
  'job-90', 'job-92', 'job-94', 'job-96',
].map((n) => `/images/gallery/${n}.png`)

// ────────────────────────────────────────────────────────────
// Cost calculator
// Rates mirror the catrumah.com.my pricing exactly. Wall services bill per
// sqft; specialty services (marble/texture/3D) bill per package size.
// ────────────────────────────────────────────────────────────
type CalcMode = 'sqft' | 'package'

interface CalcService {
  key: string
  mode: CalcMode
  rate: number // RM per sqft when mode='sqft'
  packages?: { id: 'single' | 'medium' | 'large'; price: number }[]
}

const CALC_SERVICES: CalcService[] = [
  { key: 'interior',      mode: 'sqft',    rate: 3.5 },
  { key: 'bedroom',       mode: 'sqft',    rate: 3.5 },
  { key: 'kitchen',       mode: 'sqft',    rate: 3.5 },
  { key: 'bathroom',      mode: 'sqft',    rate: 3.5 },
  { key: 'exterior',      mode: 'sqft',    rate: 3.5 },
  { key: 'weathershield', mode: 'sqft',    rate: 4.5 },
  { key: 'marble',        mode: 'package', rate: 0, packages: [
    { id: 'single', price: 2250 }, { id: 'medium', price: 3500 }, { id: 'large', price: 5500 },
  ] },
  { key: 'texture',       mode: 'package', rate: 0, packages: [
    { id: 'single', price: 2500 }, { id: 'medium', price: 3800 }, { id: 'large', price: 6000 },
  ] },
  { key: 'decor3d',       mode: 'package', rate: 0, packages: [
    { id: 'single', price: 3500 }, { id: 'medium', price: 5500 }, { id: 'large', price: 8500 },
  ] },
]

function formatRM(value: number): string {
  return value.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function CostCalculator({ locale, phoneNumber }: { locale: string; phoneNumber: string }) {
  const t = useTranslations('home.calculator')
  const tProducts = useTranslations('home.products')
  const [serviceKey, setServiceKey] = useState(CALC_SERVICES[0].key)
  const [area, setArea] = useState(1000)
  const [pkg, setPkg] = useState<'single' | 'medium' | 'large'>('single')

  const service = CALC_SERVICES.find((s) => s.key === serviceKey) ?? CALC_SERVICES[0]
  const minArea = 50

  const estimate = (() => {
    if (service.mode === 'sqft') {
      return Math.round(Math.max(area, minArea) * service.rate)
    }
    return service.packages?.find((p) => p.id === pkg)?.price ?? 0
  })()

  const detail = service.mode === 'sqft'
    ? `${Math.max(area, minArea)} sqft`
    : t(`package${pkg.charAt(0).toUpperCase() + pkg.slice(1)}` as 'packageSingle' | 'packageMedium' | 'packageLarge')

  const message = t('messageTemplate', {
    service: tProducts(`${serviceKey}.title`),
    price: formatRM(estimate),
    detail,
  })
  const waHref = waRedirect(locale, message)

  const sqftServices = CALC_SERVICES.filter((s) => s.mode === 'sqft')
  const packageServices = CALC_SERVICES.filter((s) => s.mode === 'package')

  return (
    <div className="rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-6 md:gap-8" style={{ background: '#fff', border: '1px solid var(--line)', boxShadow: '0 20px 50px rgba(2, 61, 147, 0.08)' }}>
      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="calc-service" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
            {t('serviceLabel')}
          </label>
          <select
            id="calc-service"
            value={serviceKey}
            onChange={(e) => setServiceKey(e.target.value)}
            className="calc-select w-full px-4 py-3 rounded-xl text-sm font-semibold"
          >
            <optgroup label="Per sqft">
              {sqftServices.map((s) => (
                <option key={s.key} value={s.key}>{tProducts(`${s.key}.title`)} — RM{s.rate}{t('perSqftSuffix')}</option>
              ))}
            </optgroup>
            <optgroup label="Pakej">
              {packageServices.map((s) => (
                <option key={s.key} value={s.key}>{tProducts(`${s.key}.title`)}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {service.mode === 'sqft' ? (
          <div>
            <label htmlFor="calc-area" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
              {t('areaLabel')}
            </label>
            <input
              id="calc-area"
              type="number"
              min={minArea}
              step={50}
              value={area}
              onChange={(e) => setArea(Math.max(minArea, Number(e.target.value) || 0))}
              placeholder={t('areaPlaceholder')}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--brand-cream)', border: '1px solid var(--line-strong)', color: 'var(--brand-ink)' }}
            />
            <input
              type="range"
              min={minArea}
              max={5000}
              step={50}
              value={Math.min(area, 5000)}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full mt-3 accent-yellow-400"
              style={{ accentColor: 'var(--brand-yellow)' }}
            />
          </div>
        ) : (
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
              {t('packageLabel')}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['single', 'medium', 'large'] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPkg(id)}
                  className="px-3 py-2.5 rounded-xl text-[11px] font-bold text-center"
                  style={{
                    background: pkg === id ? 'var(--brand-blue)' : 'var(--brand-cream)',
                    color: pkg === id ? '#fff' : 'var(--brand-ink)',
                    border: `1px solid ${pkg === id ? 'var(--brand-blue)' : 'var(--line-strong)'}`,
                  }}
                >
                  {t(`package${id.charAt(0).toUpperCase() + id.slice(1)}` as 'packageSingle' | 'packageMedium' | 'packageLarge')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Estimate output — blue dark panel per the palette rule (blue = bg) */}
      <div className="rounded-2xl p-6 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-blue-deep) 100%)', color: '#fff' }}>
        <div>
          <span className="block text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--brand-yellow)' }}>{t('estimateLabel')}</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>RM</span>
            <span className="text-5xl font-bold tabular-nums" style={{ color: '#fff', letterSpacing: '-0.02em' }}>{formatRM(estimate)}</span>
          </div>
          <p className="text-xs font-normal mt-3" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{t('estimateNote')}</p>
        </div>
        <WhatsAppClickTracker phoneNumber={phoneNumber} href={waHref} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold w-full" style={{ background: '#25D366', color: '#fff' }}>
          <WAIcon /> <span style={{ color: '#fff' }}>{t('ctaButton')}</span>
        </WhatsAppClickTracker>
      </div>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer text-sm font-medium" style={{ color: 'var(--brand-ink)' }} aria-expanded={open}>
        <span className="pr-4">{q}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '500px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <h5 className="pb-4 text-sm font-normal" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{a}</h5>
      </div>
    </div>
  )
}

// State card — header with state name + city count, body is a wrapped pill
// cloud of every city in that state. Always-open (no toggle).
function StateCard({ stateName, cities, citiesLabel, locale }: { stateName: string; cities: { slug: string; name: string }[]; citiesLabel: string; locale: string }) {
  return (
    <article className="rounded-2xl p-5 flex flex-col" style={{ background: '#fff', border: '1px solid var(--line)', boxShadow: '0 4px 14px rgba(2, 61, 147, 0.04)', height: '100%' }}>
      <header className="flex items-baseline justify-between gap-2 pb-3 mb-3" style={{ borderBottom: '1px solid var(--line)' }}>
        <h4 className="text-sm font-bold m-0" style={{ color: 'var(--brand-ink)', letterSpacing: '-0.005em' }}>{stateName}</h4>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: 'var(--brand-pink)' }}>{cities.length} {citiesLabel}</span>
      </header>
      <div className="flex flex-wrap gap-1.5">
        {cities.map((city) => (
          <a
            key={city.slug}
            href={`/${locale}/cat-rumah/${city.slug}`}
            className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full hover:opacity-90 transition-opacity"
            style={{ background: 'var(--brand-cream)', color: 'var(--brand-ink)', border: '1px solid var(--line)' }}
          >
            {city.name}
          </a>
        ))}
      </div>
    </article>
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
  const tBA = useTranslations('home.beforeAfter')
  const tCalc = useTranslations('home.calculator')
  const WA_LINK = waRedirect(locale)

  // Group every location by its state. Preserves config order, falls back to
  // alphabetical inside each state.
  const stateOrder = [
    'WP Kuala Lumpur',
    'Selangor',
    'WP Putrajaya',
    'Negeri Sembilan',
    'Melaka',
    'Johor',
    'Pulau Pinang',
    'Perak',
    'Kedah',
    'Perlis',
    'Pahang',
    'Terengganu',
    'Kelantan',
    'Sarawak',
    'Sabah',
    'WP Labuan',
  ]
  const groupedByState: { state: string; cities: { slug: string; name: string }[] }[] = stateOrder
    .map((state) => ({
      state,
      cities: locationConfig
        .filter((l) => l.state === state)
        .map((l) => ({ slug: l.slug, name: l.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((g) => g.cities.length > 0)
  const totalCities = groupedByState.reduce((s, g) => s + g.cities.length, 0)

  return (
    <main>
      {/* PRODUCTS */}
      <section id="products" className="py-16 px-6" style={{ background: 'var(--brand-cream)' }} aria-labelledby="products-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{t('products.tag')}</h5>
              <h3 id="products-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{t('products.heading')}</h3>
              <h5 className="text-sm font-normal mt-2 max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{t('products.subheading')}</h5>
            </div>
          </FadeSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ gridAutoRows: '1fr' }}>
            {productKeys.map((p, i) => (
              <ProductImpressionTracker key={p.key} slug={p.slug}>
                <FadeSection delay={i * 40}>
                  <div
                    className="product-card bg-white rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      border: '1px solid var(--line)',
                      boxShadow: '0 6px 20px rgba(17, 17, 17, 0.04)',
                      height: '100%',
                    }}
                  >
                    {/* Photo */}
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', background: 'var(--brand-cream)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt={t(`products.${p.key}.title`)} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    </div>

                    {/* Body */}
                    <div className="px-5 pt-6 pb-6 flex flex-col flex-1">
                      <h3
                        className="text-[17px] m-0"
                        style={{
                          color: 'var(--brand-ink)',
                          fontWeight: 700,
                          lineHeight: 1.3,
                          letterSpacing: '-0.01em',
                          minHeight: 'calc(1.3em * 2)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {t(`products.${p.key}.title`)}
                      </h3>

                      <p
                        className="m-0 mt-3"
                        style={{
                          color: 'var(--muted)',
                          fontSize: 13.5,
                          lineHeight: 1.6,
                          // Lock to exactly 2 lines so every card in the row
                          // has identical vertical spacing — shorter
                          // descriptions don't leave ghost whitespace and
                          // longer ones truncate cleanly with an ellipsis.
                          height: 'calc(1.6em * 2)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {t(`products.${p.key}.description`)}
                      </p>

                      {/* Footer: price (left) + CTA (right) — hairline divider above.
                          mt-auto pushes the footer to the bottom of the card
                          body so cards in the same row stay equal-height; the
                          larger pt-6 + body padding give the card vertical
                          breathing room. */}
                      <div
                        className="mt-auto pt-6 flex items-center justify-between gap-3"
                        style={{ borderTop: '1px solid var(--line)' }}
                      >
                        <div className="flex flex-col leading-tight">
                          <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--muted)', fontWeight: 500 }}>
                            {t('products.fromLabel')}
                          </span>
                          <span className="text-[20px]" style={{ color: 'var(--brand-pink)', fontWeight: 700, letterSpacing: '-0.01em' }}>
                            {t(`products.${p.key}.price`).replace(/^Dari\s+/i, '')}
                          </span>
                        </div>
                        <WhatsAppClickTracker
                          phoneNumber={phoneNumber}
                          href={WA_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t('products.bookNow')}
                          className="shrink-0 inline-flex items-center justify-center rounded-full"
                          style={{ background: '#25D366', color: '#fff', width: 44, height: 44, boxShadow: '0 6px 16px rgba(37, 211, 102, 0.30)' }}
                        >
                          <WAIcon />
                        </WhatsAppClickTracker>
                      </div>
                    </div>
                  </div>
                </FadeSection>
              </ProductImpressionTracker>
            ))}
          </div>
          <h5 className="text-center text-xs font-normal mt-6 max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{t('products.disclaimer')}</h5>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-16 px-6" style={{ background: '#fff', borderTop: '1px solid var(--line)' }} aria-labelledby="calc-heading">
        <div className="max-w-5xl mx-auto">
          <FadeSection>
            <div className="text-center mb-8">
              <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{tCalc('tag')}</h5>
              <h3 id="calc-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{tCalc('heading')}</h3>
              <h5 className="text-sm font-normal mt-2 max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{tCalc('subheading')}</h5>
            </div>
          </FadeSection>
          <FadeSection>
            <CostCalculator locale={locale} phoneNumber={phoneNumber} />
          </FadeSection>
        </div>
      </section>

      {/* BEFORE & AFTER */}
      <section className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="ba-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{tBA('tag')}</h5>
              <h3 id="ba-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{tBA('heading')}</h3>
              <h5 className="text-sm font-normal mt-2 max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{tBA('subheading')}</h5>
            </div>
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beforeAfterPairs.map((pair, i) => (
              <FadeSection key={i} delay={i * 80}>
                <figure className="rounded-2xl overflow-hidden flex flex-col h-full" style={{ background: '#fff', border: '1px solid var(--line)' }}>
                  <BeforeAfterSlider
                    before={pair.before}
                    after={pair.after}
                    beforeLabel={tBA('before')}
                    afterLabel={tBA('after')}
                  />
                  <figcaption className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
                    {tBA(pair.captionKey)}
                  </figcaption>
                </figure>
              </FadeSection>
            ))}
          </div>
          <FadeSection>
            <div className="text-center mt-8">
              <WhatsAppClickTracker phoneNumber={phoneNumber} href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold" style={{ background: '#25D366', color: '#fff' }}>
                <WAIcon /> {tBA('ctaButton')}
              </WhatsAppClickTracker>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 px-6" style={{ background: 'var(--brand-cream)' }} aria-labelledby="why-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{t('whyChoose.tag')}</h5>
              <h3 id="why-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{t('whyChoose.heading')}</h3>
            </div>
          </FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
            {reasonItems.map((r, i) => (
              <FadeSection key={r.key} delay={i * 60}>
                <div className="why-card p-5 rounded-2xl flex gap-4" style={{ background: '#fff', border: '1px solid var(--line)', height: '100%' }}>
                  <span
                    className="shrink-0 inline-flex items-center justify-center rounded-full"
                    style={{ width: 52, height: 52, background: 'var(--brand-yellow)', color: 'var(--brand-blue)', boxShadow: 'inset 0 0 0 4px rgba(2, 61, 147, 0.10)' }}
                    aria-hidden="true"
                  >
                    <ReasonIcon name={r.icon} />
                  </span>
                  <div>
                    <h5 className="text-sm font-bold mb-1" style={{ color: 'var(--brand-ink)' }}>{t(`whyChoose.${r.key}.title`)}</h5>
                    <h5 className="text-xs font-normal" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{t(`whyChoose.${r.key}.description`)}</h5>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{t('howItWorks.tag')}</h5>
              <h3 id="how-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{t('howItWorks.heading')}</h3>
            </div>
          </FadeSection>
          <div className="grid md:grid-cols-3 gap-5">
            {[1, 2, 3].map((n, i) => (
              <FadeSection key={n} delay={i * 100}>
                <div className="step p-6 rounded-2xl text-center h-full" style={{ background: 'var(--brand-cream)', border: '1px solid var(--line)' }}>
                  <div className="text-5xl font-bold mb-3" style={{ color: 'var(--brand-yellow-deep)' }} aria-hidden="true">{t(`howItWorks.step${n}Num`)}</div>
                  <h5 className="text-base font-bold mb-2" style={{ color: 'var(--brand-ink)' }}>{t(`howItWorks.step${n}Title`)}</h5>
                  <h5 className="text-sm font-normal" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{t(`howItWorks.step${n}Desc`)}</h5>
                </div>
              </FadeSection>
            ))}
          </div>
          <FadeSection>
            <div className="text-center mt-8">
              <WhatsAppClickTracker phoneNumber={phoneNumber} href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold" style={{ background: '#25D366', color: '#fff' }}>
                <WAIcon />{t('howItWorks.cta')}
              </WhatsAppClickTracker>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* REVIEWS — dark section with a real painter-in-action background image */}
      <section
        id="reviews"
        className="relative py-16 px-6 overflow-hidden"
        aria-labelledby="reviews-heading"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(2, 61, 147, 0.88) 0%, rgba(2, 42, 102, 0.94) 100%), url(/images/painters/painter-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-bg" role="img" aria-label={t('reviews.heading')} aria-hidden="false" style={{ pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,210,63,0.18), transparent 55%), radial-gradient(circle at 15% 80%, rgba(233,30,99,0.10), transparent 55%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <GoogleLogo />
                <span className="text-sm font-medium text-white">{t('reviews.googleReviews')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl font-bold" style={{ color: 'var(--brand-yellow)' }}>4.9</span>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <GoogleStarIcon key={i} />)}</div>
              </div>
              <h3 id="reviews-heading" className="text-2xl md:text-3xl font-bold text-white">{t('reviews.heading')}</h3>
              <h5 className="text-xs font-normal mt-2" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{t('reviews.reviewCount')}</h5>
            </div>
          </FadeSection>
          <div className="grid md:grid-cols-3 gap-4">
            {reviewIndexes.map((n, i) => (
              <FadeSection key={n} delay={i * 80}>
                <article className="p-5 rounded-2xl h-full flex flex-col" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <GoogleLogo />
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                  </div>
                  <blockquote className="review-body text-sm font-normal mb-5 flex-1" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>&ldquo;{t(`reviews.review${n}Text`)}&rdquo;</blockquote>
                  <div className="flex items-center gap-2.5 mt-auto">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-ink)' }}>
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

      {/* GALLERY — real customer work photos with the brand watermark */}
      <section className="py-16 px-6" style={{ background: '#fff' }} aria-label="Customer gallery">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{t('gallery.tag')}</h5>
              <h3 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{t('gallery.heading')}</h3>
            </div>
          </FadeSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {galleryImages.map((src, i) => (
              <div key={src} className="aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--brand-cream)', border: '1px solid var(--line)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={t('gallery.imageAlt', { number: i + 1 })} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" style={{ background: 'var(--brand-cream)' }} aria-labelledby="faq-heading">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <div className="text-center mb-10">
              <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{t('faq.tag')}</h5>
              <h3 id="faq-heading" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{t('faq.heading')}</h3>
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
              <h5 className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--brand-pink)' }}>{t('locations.tag')}</h5>
              <h3 id="locations-heading" className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--brand-ink)' }}>{t('locations.heading')}</h3>
              <h5 className="text-sm font-normal" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{t('locations.subheading')}</h5>
            </div>
          </FadeSection>
          <FadeSection>
            <h5 className="text-center text-sm font-medium mb-6" style={{ color: 'var(--brand-ink)' }}>
              {t('locations.totalLine', { count: totalCities })}
            </h5>
          </FadeSection>
          <FadeSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
              {groupedByState.map((group) => (
                <StateCard
                  key={group.state}
                  stateName={group.state}
                  cities={group.cities}
                  citiesLabel={t('locations.cities')}
                  locale={locale}
                />
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* FINAL CTA — dark section, real exterior repaint photo as the background */}
      <section
        className="relative py-20 px-6 text-center text-white overflow-hidden"
        aria-label="Call to action"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(2, 61, 147, 0.88) 0%, rgba(2, 30, 76, 0.93) 100%), url(/images/gallery/job-84.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-bg" role="img" aria-label={t('finalCta.headline')} aria-hidden="false" style={{ pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,210,63,0.18), transparent 55%), radial-gradient(circle at 15% 80%, rgba(233,30,99,0.15), transparent 55%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <FadeSection>
            <h3 className="font-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
              {t('finalCta.headline')} <span style={{ color: 'var(--brand-yellow)' }}>{t('finalCta.headlineHighlight')}</span>
            </h3>
            <h5 className="text-base font-normal mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              {t('finalCta.subheadline')}
            </h5>
            <WhatsAppClickTracker phoneNumber={phoneNumber} href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-lg font-bold" style={{ background: '#25D366', color: '#fff', boxShadow: '0 10px 30px rgba(37,211,102,0.35)' }}>
              <WAIcon />{t('finalCta.cta')}
            </WhatsAppClickTracker>
            <h5 className="mt-4 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.55)' }}>{t('finalCta.fine')}</h5>
          </FadeSection>
        </div>
      </section>
    </main>
  )
}
