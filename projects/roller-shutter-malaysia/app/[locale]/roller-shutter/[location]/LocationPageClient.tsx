'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { locations, regionOrder, regionKeys, getLocationsByRegion, nearbyMap } from '@/config/locations'
import { products } from '@/config/products'
import { waRedirect } from '@/lib/waRedirect'
import { useParams } from 'next/navigation'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker'
import PageStyles from '@/components/PageStyles'

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

/* ── Helpers ── */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.12 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}
function FadeSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeUp()
  return <div ref={ref} className={`fade-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

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

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--brand-border)', borderTop: open ? '2px solid var(--brand-yellow)' : '0px solid transparent' }}>
      <button onClick={() => setOpen(o => !o)} className="accordion-btn w-full flex items-center justify-between py-4 text-left cursor-pointer text-sm font-semibold" style={{ color: 'var(--brand-charcoal)' }} aria-expanded={open}>
        <span className="pr-4">{q}</span>
        <ChevronIcon open={open} />
      </button>
      <div style={{ maxHeight: open ? '400px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <h6 className="body-h6 pb-4 text-sm" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.75', fontWeight: 400 }}>{a}</h6>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   LOCATION PAGE — body sections only.
   Chrome rendered by page.tsx.
   ══════════════════════════════════════════ */
export default function LocationPage() {
  const params = useParams()
  const locationSlug = params.location as string
  const locale = useLocale()
  const t = useTranslations()

  const locationData = locations.find(l => l.slug === locationSlug)
  const cityName = locationData?.name || locationSlug
  const nearby = (nearbyMap[locationSlug] || []).map(s => locations.find(l => l.slug === s)).filter(Boolean) as typeof locations

  const WA_LINK = waRedirect(locale, undefined, locationSlug)
  const productKeys = products.map(p => p.key)

  const hasLocationCopy = (() => {
    try { t(`locationPages.${locationSlug}.h1`); return true } catch { return false }
  })()
  const locH1 = hasLocationCopy ? t(`locationPages.${locationSlug}.h1`) : `Roller Shutter ${cityName}`
  const locIntro = hasLocationCopy ? t(`locationPages.${locationSlug}.intro`) : ''
  const locClosingCta = hasLocationCopy ? t(`locationPages.${locationSlug}.closingCta`) : ''

  const productImages: Record<string, string> = {
    mildSteel: '/images/product-mild-steel.jpg',
    aluminium: '/images/product-aluminium.jpg',
    polycarbonate: '/images/product-polycarbonate.jpg',
    fireRated: '/images/product-fire-rated.jpg',
    grille: '/images/product-grille.jpg',
    motorised: '/images/product-motorised.jpg',
  }

  const galleryAlts = t.raw('gallery.alts') as string[] | undefined
  // Yellow-bordered customer install photos only (matches homepage filter).
  const PHOTO_IDS = [12, 13, 32, 33, 34, 36, 38, 41, 44, 45, 47, 49] as const
  const galleryImages = PHOTO_IDS.map((id, i) => ({
    src: `/photos/${id}.jpg`,
    alt:
      (Array.isArray(galleryAlts) && galleryAlts[i] && `${galleryAlts[i]} — ${cityName}`) ||
      `Roller shutter project ${cityName}`,
  }))

  return (
    <>
      <PageStyles />

      {/* BREADCRUMBS */}
      <div className="px-6 py-3" style={{ background: 'var(--brand-surface)', borderBottom: '1px solid var(--brand-border)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs">
          <a href={`/${locale}`} style={{ color: 'var(--brand-steel)' }} className="hover:underline">{t('breadcrumbs.home')}</a>
          <span style={{ color: 'var(--brand-border)' }}>/</span>
          <a href={`/${locale}#locations`} style={{ color: 'var(--brand-steel)' }} className="hover:underline">{t('breadcrumbs.rollerShutter')}</a>
          <span style={{ color: 'var(--brand-border)' }}>/</span>
          <span style={{ color: 'var(--brand-yellow)' }} className="font-medium">{cityName}</span>
        </div>
      </div>

      <main>
        {/* ── HERO — one h1 + one h2 ── */}
        <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)', minHeight: '440px' }} aria-label="Hero">
          <div
            className="absolute inset-0 pointer-events-none corrugated-texture"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'var(--gradient-hero-accent)' }}
            role="img"
            aria-label={t('hero.altText')}
          />
          <div className="relative max-w-6xl mx-auto px-6 py-14 lg:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white mb-5 emergency-pulse" style={{ background: 'var(--gradient-emergency)' }}>
                <span className="w-2 h-2 rounded-full bg-white" />{t('hero.badge')}
              </span>
              <h1 className="font-extrabold text-white mb-4" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                {locH1}
              </h1>
              <h2 className="text-base font-normal mb-6 max-w-xl" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.7' }}>
                {locIntro || t('hero.subtitle')}
              </h2>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <WhatsAppClickTracker
                  label={`location-${locationSlug}-hero`}
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white"
                >
                  <WAIcon />{t('hero.ctaPrimary')}
                </WhatsAppClickTracker>
                <a href="#products" className="ghost-btn inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-white" style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                  {t('hero.ctaSecondary')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── USP BAR — single .usp-panel with 3 .usp-cell ── */}
        <section aria-label="USPs" style={{ background: 'var(--brand-gunmetal)', borderTop: '2px solid var(--brand-yellow)' }}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="usp-panel">
              <div className="usp-cell">
                <h5 style={{ color: 'var(--brand-yellow)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>24/7 in {cityName}</h5>
                <h5 className="body-h5" style={{ color: 'var(--brand-steel-light)', fontSize: 13, fontWeight: 400 }}>Local crew responds in under an hour.</h5>
              </div>
              <div className="usp-cell">
                <h5 style={{ color: 'var(--brand-yellow)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Free Site Survey</h5>
                <h5 className="body-h5" style={{ color: 'var(--brand-steel-light)', fontSize: 13, fontWeight: 400 }}>On-site measurement + quote — no obligation.</h5>
              </div>
              <div className="usp-cell">
                <h5 style={{ color: 'var(--brand-yellow)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Warranty Backed</h5>
                <h5 className="body-h5" style={{ color: 'var(--brand-steel-light)', fontSize: 13, fontWeight: 400 }}>Every install + repair covered by warranty.</h5>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section aria-label="Statistics" style={{ background: 'var(--brand-charcoal)' }}>
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[0, 1, 2, 3].map(i => (
                <div key={i}>
                  <h5 className="stat-number text-3xl md:text-4xl mb-1 font-extrabold">{t(`stats.items.${i}.value`)}</h5>
                  <h6 className="body-h6 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--brand-steel-light)' }}>{t(`stats.items.${i}.label`)}</h6>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section id="products" className="py-16 px-6" style={{ background: 'var(--brand-surface)' }} aria-labelledby="products-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 id="products-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('products.heading')}</h3>
              <h5 className="body-h5 text-sm max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', fontWeight: 400 }}>{t('products.subheading')}</h5>
            </div>
            <div className="space-y-6">
              {productKeys.map((key, i) => (
                <ProductImpressionTracker key={key} slug={products[i].slug}>
                  <div className={`product-card bg-white rounded-2xl overflow-hidden flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`} style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--brand-border)' }}>
                    <div className="relative md:w-2/5 h-56 md:h-auto overflow-hidden" style={{ background: 'var(--brand-gunmetal)', minHeight: '240px' }}>
                      <img src={productImages[key]} alt={t('products.imageAltTemplate', { model: t(`products.items.${key}.name`) })} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-extrabold" style={{ background: i % 2 === 0 ? 'var(--brand-yellow)' : 'var(--brand-blue)', color: i % 2 === 0 ? 'var(--brand-charcoal)' : '#fff' }}>0{i + 1}</div>
                    </div>
                    <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                      <h4 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.02em' }}>{t(`products.items.${key}.name`)}</h4>
                      <h5 className="body-h5 product-desc text-sm mb-4" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t(`products.items.${key}.description`)}</h5>
                      <WhatsAppClickTracker
                        label={`product-${products[i].slug}-${locationSlug}`}
                        href={WA_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wa-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white self-start"
                      >
                        <WAIcon />{t(`products.items.${key}.cta`)}
                      </WhatsAppClickTracker>
                    </div>
                  </div>
                </ProductImpressionTracker>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 px-6" style={{ background: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('howItWorks.heading')}</h3>
              <h5 className="body-h5 text-sm max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', fontWeight: 400 }}>{t('howItWorks.subheading')}</h5>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="step text-center relative">
                  <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-extrabold" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-charcoal)' }}>{t(`howItWorks.steps.${i}.number`)}</div>
                  {i < 2 && <div className="hidden md:block absolute top-7 border-t-2 border-dashed" style={{ borderColor: 'var(--brand-border)', left: 'calc(50% + 32px)', width: 'calc(100% - 64px + 2rem)' }} />}
                  <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--brand-charcoal)' }}>{t(`howItWorks.steps.${i}.title`)}</h4>
                  <h5 className="body-h5 text-xs" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t(`howItWorks.steps.${i}.description`)}</h5>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RISK / PROBLEM ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-surface-warm)', borderTop: '2px solid var(--brand-crimson)' }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('riskProblem.heading')}</h3>
              <h5 className="body-h5 text-sm mb-6" style={{ color: 'var(--brand-text-muted)', fontWeight: 400 }}>{t('riskProblem.subheading')}</h5>
              <div className="space-y-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 items-start">
                    <XIcon />
                    <div>
                      <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--brand-charcoal)' }}>{t(`riskProblem.problems.${i}.title`)}</h4>
                      <h6 className="body-h6 text-xs" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t(`riskProblem.problems.${i}.description`)}</h6>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h5 className="body-h5 text-base font-semibold mb-6" style={{ color: 'var(--brand-charcoal)' }}>{locClosingCta || t('riskProblem.solutionCta')}</h5>
              <WhatsAppClickTracker
                label={`location-${locationSlug}-risk`}
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white"
              >
                <WAIcon />{t('shared.whatsappCta')}
              </WhatsAppClickTracker>
            </div>
          </div>
        </section>

        {/* ── MID CTA ── */}
        <section
          className="relative py-14 px-6 corrugated-texture"
          style={{ background: 'var(--brand-gunmetal)' }}
          role="img"
          aria-label={t('finalCta.bgAlt')}
        >
          <div className="relative max-w-6xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('midCta.heading')}</h3>
            <h5 className="body-h5 text-sm mb-6" style={{ color: 'var(--brand-yellow)', fontWeight: 400 }}>{t('midCta.subheading')}</h5>
            <WhatsAppClickTracker
              label={`location-${locationSlug}-midcta`}
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white"
            >
              <WAIcon />{t('midCta.ctaButton')}
            </WhatsAppClickTracker>
          </div>
        </section>

        {/* ── GOOGLE REVIEWS — checklist item #22: mirror homepage by adding this section ── */}
        <section
          id="reviews"
          className="py-16 px-6"
          style={{ background: 'var(--brand-charcoal)' }}
          aria-labelledby="reviews-heading"
          role="img"
          aria-label={t('imageAlt')}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-4" style={{ background: 'rgba(251,188,4,0.12)', border: '1px solid rgba(251,188,4,0.25)' }}>
                <GoogleLogo />
                <span className="text-2xl font-extrabold" style={{ color: 'var(--brand-yellow)' }}>4.9</span>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <GoogleStarIcon key={i} />)}</div>
                <h6 className="body-h6 text-xs font-medium" style={{ color: 'var(--brand-steel-light)' }}>Google Reviews</h6>
              </div>
              <h3 id="reviews-heading" className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.025em' }}>{t('reviews.heading')}</h3>
              <h5 className="body-h5 text-sm" style={{ color: 'var(--brand-steel-light)', fontWeight: 400 }}>{t('reviews.subheading')}</h5>
            </div>

            <article className="relative rounded-2xl p-8 md:p-10 overflow-hidden mb-6" style={{ background: 'rgba(242,199,68,0.08)', border: '1px solid rgba(242,199,68,0.2)' }}>
              <div className="absolute top-4 right-6 text-6xl font-serif leading-none" style={{ color: 'rgba(242,199,68,0.15)' }} aria-hidden="true">&ldquo;</div>
              <div className="flex items-center gap-2 mb-4">
                <GoogleSmallIcon />
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
              </div>
              <blockquote className="review-body text-base md:text-lg font-medium text-white mb-6" style={{ lineHeight: '1.8', maxWidth: '720px' }}>&ldquo;{t('reviews.items.0.text')}&rdquo;</blockquote>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-charcoal)' }}>
                  {(t('reviews.items.0.name') as string).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h6 className="body-h6 text-sm font-semibold text-white">{t('reviews.items.0.name')}</h6>
                  <h6 className="body-h6 text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t('reviews.items.0.location')}</h6>
                </div>
              </div>
            </article>

            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <article key={i} className={`review-card p-5 h-full flex flex-col${i === 5 ? ' md:col-span-2' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-charcoal)' }}>
                        {(t(`reviews.items.${i}.name`) as string).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h6 className="body-h6 text-sm font-semibold text-white">{t(`reviews.items.${i}.name`)}</h6>
                        <h6 className="body-h6 text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t(`reviews.items.${i}.location`)}</h6>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GoogleSmallIcon />
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                    </div>
                  </div>
                  <blockquote className="review-body text-sm font-normal flex-1" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>&ldquo;{t(`reviews.items.${i}.text`)}&rdquo;</blockquote>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE ── */}
        <section className="py-16 px-6" style={{ background: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('whyChoose.heading')}</h3>
              <h5 className="body-h5 text-sm max-w-2xl" style={{ color: 'var(--brand-text-muted)', fontWeight: 400 }}>{t('whyChoose.subheading')}</h5>
            </div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-0">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className="why-card flex gap-5 py-6" style={{ borderBottom: '1px solid var(--brand-border)' }}>
                  <div className="shrink-0 text-3xl md:text-4xl font-extrabold leading-none" style={{ color: i % 2 === 0 ? 'var(--brand-yellow-dark)' : 'var(--brand-blue-dark)', minWidth: '48px' }}>0{i + 1}</div>
                  <div>
                    <h4 className="text-base font-bold mb-1.5" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.015em' }}>{t(`whyChoose.items.${i}.title`)}</h4>
                    <h5 className="body-h5 text-sm" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t(`whyChoose.items.${i}.description`)}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-gunmetal)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('gallery.heading')}</h3>
              <h5 className="body-h5 text-sm" style={{ color: 'var(--brand-steel-light)', fontWeight: 400 }}>{t('gallery.subheading')}</h5>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative group rounded overflow-hidden cursor-pointer" style={{ aspectRatio: '1/1' }}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end p-3" style={{ background: 'rgba(15,33,43,0.7)', transition: 'opacity 300ms ease', border: '2px solid var(--brand-yellow)' }}>
                    <span className="text-xs font-medium text-white">{img.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCATIONS ACCORDION ── */}
        <section id="locations" className="py-16 px-6" style={{ background: 'var(--brand-surface)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('locations.heading')}</h3>
              <h5 className="body-h5 text-sm max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', fontWeight: 400 }}>{t('locations.subheading')}</h5>
            </div>
            <div className="space-y-3">
              {regionOrder.map((region) => {
                const locs = getLocationsByRegion(region)
                const regionKey = regionKeys[region]
                return (
                  <AccordionItem key={region} yellowBorder defaultOpen={locs.some(l => l.slug === locationSlug)} title={
                    <div className="flex items-center gap-2">
                      <span>{t(`locations.regions.${regionKey}`)}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-yellow-pale)', color: 'var(--brand-yellow-dark)' }}>{locs.length}</span>
                    </div>
                  }>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {locs.map(loc => (
                        <a key={loc.slug} href={`/${locale}/roller-shutter/${loc.slug}`} className="text-xs font-normal px-3 py-2 rounded-lg" style={{ color: loc.slug === locationSlug ? 'var(--brand-yellow)' : 'var(--brand-steel)', fontWeight: loc.slug === locationSlug ? 600 : 400 }}>
                          {loc.name}
                        </a>
                      ))}
                    </div>
                  </AccordionItem>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── NEARBY ── */}
        {nearby.length > 0 && (
          <section className="py-12 px-6" style={{ background: 'var(--brand-surface-warm)' }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('nearbyLocations.heading')}</h3>
                <h5 className="body-h5 text-sm" style={{ color: 'var(--brand-text-muted)', fontWeight: 400 }}>{t('nearbyLocations.subheading')}</h5>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {nearby.map(loc => (
                  <a key={loc.slug} href={`/${locale}/roller-shutter/${loc.slug}`} className="product-card loc-link bg-white rounded-lg p-4 flex flex-col" style={{ border: '1px solid var(--brand-border)', borderLeft: '4px solid var(--brand-yellow)', transition: 'transform 200ms ease' }}>
                    <h6 className="body-h6 text-sm font-bold mb-1" style={{ color: 'var(--brand-charcoal)' }}>{loc.name}</h6>
                    <h6 className="body-h6 text-[11px] font-normal" style={{ color: 'var(--brand-text-muted)' }}>Roller Shutter {loc.name}</h6>
                    <span className="text-[11px] font-semibold mt-2" style={{ color: 'var(--brand-yellow-dark)' }}>{t('nearbyLocations.viewService')} &rarr;</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section id="faq" className="py-16 px-6" style={{ background: '#fff' }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('faq.heading')}</h3>
            </div>
            <div>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <FAQItem key={i} q={t(`faq.items.${i}.question`)} a={t(`faq.items.${i}.answer`)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section
          className="relative py-16 px-6 corrugated-texture"
          style={{ background: 'var(--brand-charcoal)' }}
          role="img"
          aria-label={t('finalCta.bgAlt')}
        >
          <div className="relative max-w-6xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('finalCta.heading')}</h3>
            <h5 className="body-h5 text-sm mb-6" style={{ color: 'var(--brand-yellow)', fontWeight: 400 }}>{t('finalCta.subheading')}</h5>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
              <WhatsAppClickTracker
                label={`location-${locationSlug}-final`}
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white"
              >
                <WAIcon />{t('finalCta.ctaButton')}
              </WhatsAppClickTracker>
              <WhatsAppClickTracker
                label={`location-${locationSlug}-final-secondary`}
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-btn inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-white"
                style={{ border: '2px solid rgba(255,255,255,0.3)' }}
              >
                {t('common.whatsappUs')}
              </WhatsAppClickTracker>
            </div>
            <h6 className="body-h6 text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t('finalCta.supportingText')}</h6>
          </div>
        </section>
      </main>

      {/* ── FLOATING WHATSAPP ── */}
      <WhatsAppClickTracker
        label={`float-${locationSlug}`}
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 wa-btn flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-white"
        aria-label={t('footer.whatsappFloat')}
        style={{ boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
      >
        <WAIcon /><span className="hidden sm:inline">{t('footer.whatsappFloat')}</span>
      </WhatsAppClickTracker>
    </>
  )
}
