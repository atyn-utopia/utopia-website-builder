'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { locations, regionOrder, regionKeys, getLocationsByRegion } from '@/config/locations'
import { products } from '@/config/products'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { waRedirect } from '@/lib/waRedirect'

/* ── SVG Icons ── */
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
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)
const GoogleSmallIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--brand-yellow)', transition: 'transform 0.3s ease' }} fill="none" aria-hidden="true">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const XIcon = () => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="var(--brand-crimson)" fillOpacity="0.15" />
    <path d="M7 7l6 6M13 7l-6 6" stroke="var(--brand-crimson)" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const ShutterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="var(--brand-charcoal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="2" width="18" height="20" rx="2" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="3" y1="14" x2="21" y2="14" />
    <line x1="3" y1="18" x2="21" y2="18" />
    <circle cx="12" cy="20" r="1" fill="var(--brand-charcoal)" stroke="none" />
  </svg>
)
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

/* ── Helpers ── */
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

/* ── Accordion ── */
function AccordionItem({ title, children, defaultOpen = false, yellowBorder = false }: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; yellowBorder?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--brand-border)', borderLeft: open && yellowBorder ? '4px solid var(--brand-yellow)' : '1px solid var(--brand-border)', background: '#fff' }}>
      <button onClick={() => setOpen(o => !o)} className="accordion-btn w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer text-sm font-semibold" style={{ color: 'var(--brand-charcoal)' }} aria-expanded={open}>
        {title}
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '800px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div className="px-5 pb-5 pt-1">{children}</div>
      </div>
    </div>
  )
}

/* ── FAQ Accordion ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--brand-border)', borderTop: open ? '2px solid var(--brand-yellow)' : '0px solid transparent' }}>
      <button onClick={() => setOpen(o => !o)} className="accordion-btn w-full flex items-center justify-between py-4 text-left cursor-pointer text-sm font-semibold" style={{ color: 'var(--brand-charcoal)' }} aria-expanded={open}>
        <span className="pr-4">{q}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '400px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <p className="pb-4 text-sm font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.75' }}>{a}</p>
      </div>
    </div>
  )
}

/* ── FOMO Banner ── */
function FomoBanner() {
  const locale = useLocale()
  const t = useTranslations('fomoBanner')
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [slotsLeft, setSlotsLeft] = useState(3)
  const [textIdx, setTextIdx] = useState(0)

  useEffect(() => {
    const getEndOfDay = () => { const end = new Date(); end.setHours(23, 59, 59, 999); return end }
    const updateTimer = () => {
      const diff = getEndOfDay().getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({ hours: Math.floor(diff / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) })
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    const hour = new Date().getHours()
    if (hour < 10) setSlotsLeft(5); else if (hour < 14) setSlotsLeft(3); else if (hour < 18) setSlotsLeft(2); else setSlotsLeft(1)
    const textInterval = setInterval(() => setTextIdx(i => (i + 1) % 3), 8000)
    return () => { clearInterval(interval); clearInterval(textInterval) }
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const texts: string[] = [t('texts.0'), t('texts.1'), t('texts.2')]

  return (
    <div style={{ background: 'var(--gradient-emergency)' }}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 flex-wrap text-white text-xs sm:text-sm">
        <span className="fomo-dot w-2 h-2 rounded-full bg-white shrink-0" />
        <span className="font-medium">{texts[textIdx]}</span>
        <span className="font-mono font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
        <a href={waRedirect(locale)} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:no-underline shrink-0">{t('bookNow')} &rarr;</a>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   HOMEPAGE
   ══════════════════════════════════════════ */
export default function HomePage() {
  const locale = useLocale()
  const t = useTranslations()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const WA_LINK = waRedirect(locale)

  const productKeys = products.map(p => p.key)

  const whyIcons = ['shield', 'clock', 'map', 'dollar', 'check', 'users']

  const productImages: Record<string, string> = {
    mildSteel: '/images/product-mild-steel.jpg',
    aluminium: '/images/product-aluminium.jpg',
    polycarbonate: '/images/product-polycarbonate.jpg',
    fireRated: '/images/product-fire-rated.jpg',
    grille: '/images/product-grille.jpg',
    motorised: '/images/product-motorised.jpg',
  }

  const galleryImages = [
    { src: '/images/gallery-1.jpg', alt: t('gallery.altTexts.newInstallation') },
    { src: '/images/gallery-2.jpg', alt: t('gallery.altTexts.factory') },
    { src: '/images/gallery-3.jpg', alt: t('gallery.altTexts.repair') },
    { src: '/images/gallery-4.webp', alt: t('gallery.altTexts.commercial') },
    { src: '/images/gallery-5.jpg', alt: t('gallery.altTexts.newInstallation') },
    { src: '/images/gallery-6.jpg', alt: t('gallery.altTexts.factory') },
  ]

  return (
    <>
      <FomoBanner />

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(44,51,56,0.97)', backdropFilter: 'blur(12px)', boxShadow: 'var(--shadow-nav)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <a href={`/${locale}`} className="flex items-center gap-2 shrink-0" aria-label={t('nav.brandName')}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-yellow)' }}>
              <ShutterIcon />
            </div>
            <span className="font-extrabold text-white tracking-tight text-sm sm:text-base">{t('nav.brandName')}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
            {[
              { label: t('nav.products'), href: '#products' },
              { label: t('nav.howItWorks'), href: '#how-it-works' },
              { label: t('nav.reviews'), href: '#reviews' },
              { label: t('nav.locations'), href: '#locations' },
              { label: t('nav.faq'), href: '#faq' },
            ].map(link => (
              <a key={link.href} href={link.href} className="nav-link focus:outline-none">{link.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white">
              <WAIcon /><span>{t('nav.ctaButton')}</span>
            </a>
            <button className="icon-btn md:hidden text-white p-1 cursor-pointer" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60]" style={{ background: 'rgba(28,31,34,0.95)' }}>
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileMenuOpen(false)} className="icon-btn text-white p-2 cursor-pointer" aria-label="Close menu"><CloseIcon /></button>
            </div>
            <nav className="flex flex-col items-center gap-6 pt-8 text-lg font-semibold text-white">
              {[
                { label: t('nav.products'), href: '#products' },
                { label: t('nav.howItWorks'), href: '#how-it-works' },
                { label: t('nav.reviews'), href: '#reviews' },
                { label: t('nav.locations'), href: '#locations' },
                { label: t('nav.faq'), href: '#faq' },
              ].map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--brand-yellow)]">{link.label}</a>
              ))}
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold text-white mt-4">
                <WAIcon />{t('nav.ctaButton')}
              </a>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* ── HERO — Diagonal-Cut ── */}
        <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)', minHeight: '520px' }} aria-label="Hero">
          {/* Hero photo — full bleed background */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'url(/images/hero-worker.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
          }} aria-hidden="true" />
          {/* Gradient blend over photo — dark left for text readability, fades to show photo on right */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to right, rgba(28,31,34,0.92) 0%, rgba(28,31,34,0.75) 40%, rgba(28,31,34,0.4) 70%, rgba(28,31,34,0.2) 100%)',
          }} aria-hidden="true" />
          {/* Bottom gradient fade */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to top, var(--brand-charcoal) 0%, transparent 30%)',
          }} aria-hidden="true" />
          {/* Yellow accent gradient */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--gradient-hero-accent)' }} aria-hidden="true" />
          {/* Corrugated texture */}
          <div className="absolute inset-0 pointer-events-none corrugated-texture" style={{ opacity: 0.5 }} aria-hidden="true" />

          <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24">
            <div className="max-w-2xl">
              {/* Emergency badge */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white mb-6 emergency-pulse" style={{ background: 'var(--gradient-emergency)' }}>
                <span className="w-2 h-2 rounded-full bg-white" />{t('hero.badge')}
              </span>

              <h1 className="font-extrabold text-white mb-4" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                {t('hero.h1')}{' '}
                <span style={{ color: 'var(--brand-yellow)' }}>{t('hero.h1Highlight')}</span>
              </h1>

              <p className="text-base font-normal mb-8 max-w-xl" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.7' }}>
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3 mb-4">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white">
                  <WAIcon />{t('hero.ctaPrimary')}
                </a>
                <a href="#products" className="ghost-btn inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-white" style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                  {t('hero.ctaSecondary')}
                </a>
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--brand-yellow)', opacity: 0.8 }}>{t('hero.ctaPrimarySubtext')}</p>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section aria-label="Statistics" style={{ background: 'var(--brand-gunmetal)', borderTop: '2px solid var(--brand-yellow)' }}>
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[0, 1, 2, 3].map(i => (
                <FadeSection key={i} delay={i * 80}>
                  <div className="stat-number text-3xl md:text-4xl mb-1 font-extrabold">{t(`stats.items.${i}.value`)}</div>
                  <div className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--brand-steel-light)' }}>{t(`stats.items.${i}.label`)}</div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS — Alternating Showcase ── */}
        <section id="products" className="py-16 px-6" style={{ background: 'var(--brand-surface)' }} aria-labelledby="products-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-12">
                <h2 id="products-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('products.heading')}</h2>
                <p className="text-sm font-normal max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t('products.subheading')}</p>
              </div>
            </FadeSection>
            <div className="space-y-6">
              {productKeys.map((key, i) => (
                <FadeSection key={key} delay={i * 80}>
                  <div className={`product-card bg-white rounded-2xl overflow-hidden flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`} style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--brand-border)' }}>
                    {/* Image side */}
                    <div className="relative md:w-2/5 h-56 md:h-auto overflow-hidden" style={{ background: 'var(--brand-gunmetal)', minHeight: '240px' }}>
                      <img
                        src={productImages[key]}
                        alt={t(`products.items.${key}.altText`)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0" style={{ background: i % 2 === 0 ? 'linear-gradient(to right, transparent 50%, rgba(255,255,255,0.05) 100%)' : 'linear-gradient(to left, transparent 50%, rgba(255,255,255,0.05) 100%)' }} />
                      {/* Product number badge */}
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-extrabold" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-charcoal)' }}>
                        0{i + 1}
                      </div>
                    </div>
                    {/* Content side */}
                    <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                      <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.02em' }}>{t(`products.items.${key}.name`)}</h3>
                      <p className="text-sm font-normal mb-4" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t(`products.items.${key}.description`)}</p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {[0, 1, 2].map(j => (
                          <span key={j} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--brand-gunmetal)', color: 'var(--brand-yellow)' }}>{t(`products.items.${key}.keyPoints.${j}`)}</span>
                        ))}
                      </div>
                      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white self-start">
                        <WAIcon />{t(`products.items.${key}.cta`)}
                      </a>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="how-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <h2 id="how-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('howItWorks.heading')}</h2>
                <p className="text-sm font-normal max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t('howItWorks.subheading')}</p>
              </div>
            </FadeSection>
            <div className="grid md:grid-cols-3 gap-8">
              {[0, 1, 2].map((i) => (
                <FadeSection key={i} delay={i * 100}>
                  <div className="text-center relative">
                    {/* Step number circle */}
                    <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-extrabold" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-charcoal)' }}>
                      {t(`howItWorks.steps.${i}.number`)}
                    </div>
                    {/* Connecting dashed line */}
                    {i < 2 && <div className="hidden md:block absolute top-7 border-t-2 border-dashed" style={{ borderColor: 'var(--brand-border)', left: 'calc(50% + 32px)', width: 'calc(100% - 64px + 2rem)' }} />}
                    <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.015em' }}>{t(`howItWorks.steps.${i}.title`)}</h3>
                    <p className="text-xs font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t(`howItWorks.steps.${i}.description`)}</p>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── RISK / PROBLEM ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-surface-warm)', borderTop: '2px solid var(--brand-crimson)' }} aria-labelledby="risk-heading">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <FadeSection>
                <h2 id="risk-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('riskProblem.heading')}</h2>
                <p className="text-sm font-normal mb-6" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t('riskProblem.subheading')}</p>
                <div className="space-y-4">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 items-start">
                      <XIcon />
                      <div>
                        <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--brand-charcoal)' }}>{t(`riskProblem.problems.${i}.title`)}</h4>
                        <p className="text-xs font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t(`riskProblem.problems.${i}.description`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeSection>
              <FadeSection delay={150}>
                <div className="text-center md:text-left">
                  <p className="text-base font-semibold mb-6" style={{ color: 'var(--brand-charcoal)', lineHeight: '1.6' }}>{t('riskProblem.solutionCta')}</p>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white">
                    <WAIcon />{t('shared.whatsappCta')}
                  </a>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ── MID CTA ── */}
        <section className="relative py-14 px-6 corrugated-texture" style={{ background: 'var(--brand-gunmetal)' }}>
          {/* Diagonal accent */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(155deg, transparent 48%, rgba(242,199,68,0.04) 48%, rgba(242,199,68,0.04) 52%, transparent 52%)' }} aria-hidden="true" />
          <div className="relative max-w-6xl mx-auto text-center">
            <FadeSection>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('midCta.heading')}</h2>
              <p className="text-sm font-normal mb-6" style={{ color: 'var(--brand-yellow)', lineHeight: '1.7' }}>{t('midCta.subheading')}</p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white">
                <WAIcon />{t('midCta.ctaButton')}
              </a>
            </FadeSection>
          </div>
        </section>

        {/* ── GOOGLE REVIEWS — Featured + Grid ── */}
        <section id="reviews" className="py-16 px-6" style={{ background: 'var(--brand-charcoal)' }} aria-labelledby="reviews-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-4" style={{ background: 'rgba(251,188,4,0.12)', border: '1px solid rgba(251,188,4,0.25)' }}>
                  <GoogleLogo />
                  <span className="text-2xl font-extrabold" style={{ color: 'var(--brand-yellow)' }}>4.9</span>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <GoogleStarIcon key={i} />)}</div>
                  <span className="text-xs font-medium" style={{ color: 'var(--brand-steel-light)' }}>Google Reviews</span>
                </div>
                <h2 id="reviews-heading" className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.025em' }}>{t('reviews.heading')}</h2>
                <p className="text-sm font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t('reviews.subheading')}</p>
              </div>
            </FadeSection>

            {/* Featured review — large */}
            <FadeSection className="mb-6">
              <article className="relative rounded-2xl p-8 md:p-10 overflow-hidden" style={{ background: 'rgba(242,199,68,0.08)', border: '1px solid rgba(242,199,68,0.2)' }}>
                <div className="absolute top-4 right-6 text-6xl font-serif leading-none" style={{ color: 'rgba(242,199,68,0.15)' }} aria-hidden="true">&ldquo;</div>
                <div className="flex items-center gap-2 mb-4">
                  <GoogleSmallIcon />
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                </div>
                <blockquote className="text-base md:text-lg font-medium text-white mb-6" style={{ lineHeight: '1.8', maxWidth: '720px' }}>
                  &ldquo;{t('reviews.items.0.text')}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-charcoal)' }}>
                    {(t('reviews.items.0.name') as string).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t('reviews.items.0.name')}</div>
                    <div className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t('reviews.items.0.location')}</div>
                  </div>
                </div>
              </article>
            </FadeSection>

            {/* Remaining reviews — 2-col grid, last spans full */}
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <FadeSection key={i} delay={i * 60} className={i === 5 ? 'md:col-span-2' : ''}>
                  <article className="review-card p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-charcoal)' }}>
                          {(t(`reviews.items.${i}.name`) as string).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{t(`reviews.items.${i}.name`)}</div>
                          <div className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t(`reviews.items.${i}.location`)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GoogleSmallIcon />
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                      </div>
                    </div>
                    <blockquote className="text-sm font-normal flex-1" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>&ldquo;{t(`reviews.items.${i}.text`)}&rdquo;</blockquote>
                  </article>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE — Numbered Statements ── */}
        <section className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="why-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="mb-12">
                <h2 id="why-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('whyChoose.heading')}</h2>
                <p className="text-sm font-normal max-w-2xl" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t('whyChoose.subheading')}</p>
              </div>
            </FadeSection>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-0">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <FadeSection key={i} delay={i * 50}>
                  <div className="flex gap-5 py-6" style={{ borderBottom: '1px solid var(--brand-border)' }}>
                    <div className="shrink-0 text-3xl md:text-4xl font-extrabold leading-none" style={{ color: 'var(--brand-yellow)', minWidth: '48px' }}>
                      0{i + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.015em' }}>{t(`whyChoose.items.${i}.title`)}</h3>
                      <p className="text-sm font-normal" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t(`whyChoose.items.${i}.description`)}</p>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-gunmetal)' }} aria-labelledby="gallery-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <h2 id="gallery-heading" className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('gallery.heading')}</h2>
                <p className="text-sm font-normal" style={{ color: 'var(--brand-steel-light)', lineHeight: '1.7' }}>{t('gallery.subheading')}</p>
              </div>
            </FadeSection>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryImages.map((img, i) => (
                <FadeSection key={i} delay={i * 60}>
                  <div className="relative group rounded overflow-hidden cursor-pointer" style={{ aspectRatio: '3/2' }}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" style={{ transition: 'transform 300ms ease' }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end p-3" style={{ background: 'rgba(44,51,56,0.7)', transition: 'opacity 300ms ease', border: '2px solid var(--brand-yellow)' }}>
                      <span className="text-xs font-medium text-white">{img.alt}</span>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCATIONS ACCORDION ── */}
        <section id="locations" className="py-16 px-6" style={{ background: 'var(--brand-surface)' }} aria-labelledby="locations-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <h2 id="locations-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('locations.heading')}</h2>
                <p className="text-sm font-normal max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>{t('locations.subheading')}</p>
              </div>
            </FadeSection>
            <div className="space-y-3">
              {regionOrder.map((region, ri) => {
                const locs = getLocationsByRegion(region)
                const regionKey = regionKeys[region]
                return (
                  <FadeSection key={region} delay={ri * 40}>
                    <AccordionItem
                      yellowBorder
                      defaultOpen={ri === 0}
                      title={
                        <div className="flex items-center gap-2">
                          <span>{t(`locations.regions.${regionKey}`)}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-yellow-pale)', color: 'var(--brand-yellow-dark)' }}>{locs.length}</span>
                        </div>
                      }
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {locs.map(loc => (
                          <a key={loc.slug} href={`/${locale}/roller-shutter/${loc.slug}`} className="loc-link nav-link text-xs font-normal px-3 py-2 rounded-lg" style={{ color: 'var(--brand-steel)', transition: 'opacity 200ms ease' }}>
                            {loc.name}
                          </a>
                        ))}
                      </div>
                    </AccordionItem>
                  </FadeSection>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('faq.heading')}</h2>
              </div>
            </FadeSection>
            <div>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <FAQItem key={i} q={t(`faq.items.${i}.question`)} a={t(`faq.items.${i}.answer`)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative py-16 px-6 corrugated-texture" style={{ background: 'var(--brand-charcoal)' }}>
          {/* Diagonal yellow accent */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(155deg, transparent 46%, rgba(242,199,68,0.06) 46%, rgba(242,199,68,0.06) 54%, transparent 54%)' }} aria-hidden="true" />
          <div className="relative max-w-6xl mx-auto text-center">
            <FadeSection>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('finalCta.heading')}</h2>
              <p className="text-sm font-normal mb-6" style={{ color: 'var(--brand-yellow)', lineHeight: '1.7' }}>{t('finalCta.subheading')}</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white">
                  <WAIcon />{t('finalCta.ctaButton')}
                </a>
                <a href={`tel:+60174287801`} className="ghost-btn inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-white" style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                  {t('common.callNow')}
                </a>
              </div>
              <p className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t('finalCta.supportingText')}</p>
            </FadeSection>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#151719' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--brand-yellow)' }}><ShutterIcon /></div>
                <span className="font-bold text-white text-sm">{t('nav.brandName')}</span>
              </div>
              <p className="text-xs font-normal mb-4" style={{ color: 'var(--brand-steel-light)', lineHeight: '1.7' }}>{t('footer.tagline')}</p>
            </div>
            {/* Services */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">{t('footer.services.heading')}</h4>
              <ul className="space-y-1.5">
                {[0, 1, 2, 3, 4].map(i => (
                  <li key={i}><span className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t(`footer.services.items.${i}`)}</span></li>
                ))}
              </ul>
            </div>
            {/* Products */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">{t('footer.productTypes.heading')}</h4>
              <ul className="space-y-1.5">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <li key={i}><span className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t(`footer.productTypes.items.${i}`)}</span></li>
                ))}
              </ul>
            </div>
            {/* Areas */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">{t('footer.areas.heading')}</h4>
              <ul className="space-y-1.5">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <li key={i}><span className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t(`footer.areas.items.${i}`)}</span></li>
                ))}
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs font-normal" style={{ color: 'var(--brand-steel)' }}>{t('footer.copyright')}</p>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a
        href={WA_LINK}
        className="fixed bottom-6 right-6 z-50 wa-btn flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-white"
        aria-label={t('footer.whatsappFloat')}
        style={{ boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
      >
        <WAIcon /><span className="hidden sm:inline">{t('footer.whatsappFloat')}</span>
      </a>
    </>
  )
}
