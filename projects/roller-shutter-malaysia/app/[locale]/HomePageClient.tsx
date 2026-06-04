'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { regionOrder, regionKeys, getLocationsByRegion } from '@/config/locations'
import { products } from '@/config/products'
import { waRedirect } from '@/lib/waRedirect'
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
        <h6 className="body-h6 pb-4 text-sm" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.75', fontWeight: 400 }}>{a}</h6>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   HOMEPAGE — body sections only.
   Chrome (FomoBanner, SiteHeader, SiteFooter) is rendered by page.tsx.
   ══════════════════════════════════════════ */
export default function HomePage() {
  const locale = useLocale()
  const t = useTranslations()
  const WA_LINK = waRedirect(locale)

  const productKeys = products.map(p => p.key)

  const productImages: Record<string, string> = {
    mildSteel: '/images/product-mild-steel.jpg',
    aluminium: '/images/product-aluminium.jpg',
    polycarbonate: '/images/product-polycarbonate.jpg',
    fireRated: '/images/product-fire-rated.jpg',
    grille: '/images/product-grille.jpg',
    motorised: '/images/product-motorised.jpg',
  }

  // Pull gallery alt strings from i18n (alts[] array — checklist item #26)
  // Real installation photos from /public/photos/ — mixed watermarked + clean
  const galleryAlts = t.raw('gallery.alts') as string[] | undefined
  // Yellow-bordered customer install photos only — confirmed visually.
  // Excluded for being borderless: 12, 13, 14, 15, 16, 17, 18, 35.
  const PHOTO_IDS = [32, 33, 34, 36, 38, 41, 42, 43, 44, 45, 47, 49] as const
  const galleryImages = PHOTO_IDS.map((id, i) => ({
    src: `/photos/${id}.jpg`,
    alt: (Array.isArray(galleryAlts) && galleryAlts[i]) || t('gallery.altTexts.newInstallation'),
  }))

  // Client logos for the "Trusted by" proof strip below the hero (task #3)
  const trustLogos: { src: string; alt: string }[] = [
    { src: '/brand-assets/20.png', alt: '99 Speedmart' },
    { src: '/brand-assets/25.png', alt: 'TeaLive' },
    { src: '/brand-assets/22.png', alt: 'AEON' },
    { src: '/brand-assets/26.png', alt: 'FamilyMart' },
    { src: '/brand-assets/27.png', alt: 'Giant' },
    { src: '/brand-assets/23.png', alt: 'MR. D.I.Y.' },
  ]

  return (
    <>
      <PageStyles />

      <main>
        {/* ============================================
            HERO — exactly one H1 + one H2 on the page
            ============================================ */}
        <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)', minHeight: '520px' }} aria-label="Hero">
          {/* Hero photo — full bleed background. role=img + aria-label so the
              decorative bg layer is accessible (checklist item #28). */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'url(/images/hero-worker.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.35,
            }}
            role="img"
            aria-label={t('hero.altText')}
          />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to right, rgba(28,31,34,0.92) 0%, rgba(28,31,34,0.75) 40%, rgba(28,31,34,0.4) 70%, rgba(28,31,34,0.2) 100%)',
          }} aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to top, var(--brand-charcoal) 0%, transparent 30%)',
          }} aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--gradient-hero-accent)' }} aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none corrugated-texture" style={{ opacity: 0.5 }} aria-hidden="true" />

          {/* Wordmark logo at the top of the hero with breathing room
              above and below. */}
          <div className="relative max-w-6xl mx-auto px-6 pt-10 lg:pt-14 pb-12 lg:pb-20">
            <div className="flex justify-center md:justify-start mb-8 lg:mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand-assets/logo-roller-shutter.png"
                alt={t('nav.logoAlt')}
                className="hero-logo"
                style={{ width: 'clamp(220px, 28vw, 320px)', height: 'auto', display: 'block', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))' }}
              />
            </div>
            <div className="max-w-2xl hero-copy mx-auto md:mx-0 text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white mb-6 emergency-pulse" style={{ background: 'var(--gradient-emergency)' }}>
                <span className="w-2 h-2 rounded-full bg-white" />{t('hero.badge')}
              </span>

              <h1 className="font-extrabold text-white mb-4" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                {t('hero.h1')}{' '}
                <span style={{ color: 'var(--brand-yellow)' }}>{t('hero.h1Highlight')}</span>
              </h1>

              <h2 className="text-base font-normal mb-8 max-w-xl mx-auto md:mx-0" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.7' }}>
                {t('hero.subtitle')}
              </h2>

              <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 mb-4">
                <WhatsAppClickTracker
                  label="hero"
                  href={waRedirect(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn cta-pill inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white"
                >
                  <WAIcon />{t('hero.ctaPrimary')}
                </WhatsAppClickTracker>
                <a href="#products" className="ghost-btn cta-pill inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white" style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                  {t('hero.ctaSecondary')}
                </a>
              </div>
              <h6 className="body-h6 text-xs font-medium" style={{ color: 'var(--brand-yellow)', opacity: 0.8 }}>{t('hero.ctaPrimarySubtext')}</h6>
            </div>
          </div>
        </section>

        {/* ============================================
            USP BAR — single .usp-panel with 3 .usp-cell children
            (mandatory per CLAUDE.md + checklist item #32)
            ============================================ */}
        <section aria-label="USPs" style={{ background: 'var(--brand-gunmetal)', borderTop: '2px solid var(--brand-yellow)' }}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="usp-panel">
              <div className="usp-cell">
                <h5 style={{ color: 'var(--brand-yellow)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>24/7 Emergency Service</h5>
                <h5 className="body-h5" style={{ color: 'var(--brand-steel-light)', fontSize: 13, fontWeight: 400 }}>Anytime, any day — our team responds in under 60 minutes.</h5>
              </div>
              <div className="usp-cell">
                <h5 style={{ color: 'var(--brand-yellow)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>50+ Coverage Areas</h5>
                <h5 className="body-h5" style={{ color: 'var(--brand-steel-light)', fontSize: 13, fontWeight: 400 }}>Klang Valley to East Malaysia — your shutter, our network.</h5>
              </div>
              <div className="usp-cell">
                <h5 style={{ color: 'var(--brand-yellow)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>15,000+ Premises Protected</h5>
                <h5 className="body-h5" style={{ color: 'var(--brand-steel-light)', fontSize: 13, fontWeight: 400 }}>Two decades of factory, warehouse, and shop install experience.</h5>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            TRUSTED BY — client / proof logo strip
            ============================================ */}
        <section aria-label="Trusted by" style={{ background: '#fff', borderBottom: '1px solid var(--brand-border)' }}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            <h6 className="trust-strip-label text-[10px] font-bold uppercase tracking-[0.22em] text-center mb-5" style={{ color: 'var(--brand-blue-dark)' }}>
              Trusted by leading Malaysian brands
            </h6>
            <ul className="trust-strip flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {trustLogos.map((logo) => (
                <li key={logo.src} className="trust-strip-item">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="trust-strip-logo"
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* STATS section removed per request — proof now lives in the
            trust-strip above and the USP bar; product pricing tells the
            value story instead. */}

        {/* ============================================
            PRODUCTS — H3 sub-headings (only hero owns h1+h2)
            ============================================ */}
        <section id="products" className="py-16 px-6" style={{ background: 'var(--brand-surface)' }} aria-labelledby="products-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-12">
                <h3 id="products-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('products.heading')}</h3>
                <h5 className="body-h5 section-sub text-sm max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t('products.subheading')}</h5>
              </div>
            </FadeSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productKeys.map((key, i) => (
                <FadeSection key={key} delay={i * 60}>
                  <ProductImpressionTracker slug={products[i].slug}>
                    <div className="product-card bg-white rounded-xl overflow-hidden flex flex-col h-full" style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--brand-border)' }}>
                      <div className="relative h-44 overflow-hidden" style={{ background: 'var(--brand-gunmetal)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImages[key]}
                          alt={t('products.imageAltTemplate', { model: t(`products.items.${key}.name`) })}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="text-base mb-2" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.01em', lineHeight: 1.25, fontWeight: 600 }}>{t(`products.items.${key}.name`)}</h4>
                        {/* Pricing — primary value signal. Coloured with the
                            brand electric blue so it stands out from body text. */}
                        <div className="mb-4">
                          <h6 className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--brand-text-muted)' }}>Harga dari</h6>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-bold leading-none" style={{ color: 'var(--brand-blue-dark)' }}>RM</span>
                            <span className="text-2xl font-extrabold leading-none" style={{ color: 'var(--brand-blue-dark)', letterSpacing: '-0.03em' }}>{products[i].priceFrom?.toLocaleString('en-MY')}</span>
                            <span className="text-[11px] font-medium ml-0.5" style={{ color: 'var(--brand-text-muted)' }}>/ {products[i].unit ?? 'unit'}</span>
                          </div>
                        </div>
                        <WhatsAppClickTracker
                          label={`product-${products[i].slug}`}
                          href={waRedirect(locale)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wa-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white mt-auto"
                        >
                          <WAIcon />{t(`products.items.${key}.cta`)}
                        </WhatsAppClickTracker>
                      </div>
                    </div>
                  </ProductImpressionTracker>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            HOW IT WORKS
            ============================================ */}
        <section id="how-it-works" className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="how-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <h3 id="how-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('howItWorks.heading')}</h3>
                <h5 className="body-h5 section-sub text-sm max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t('howItWorks.subheading')}</h5>
              </div>
            </FadeSection>
            <div className="grid md:grid-cols-3 gap-8">
              {[0, 1, 2].map((i) => (
                <FadeSection key={i} delay={i * 100}>
                  <div className="step text-center relative">
                    <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-extrabold" style={{ background: 'var(--brand-yellow)', color: 'var(--brand-charcoal)' }}>
                      {t(`howItWorks.steps.${i}.number`)}
                    </div>
                    {i < 2 && <div className="hidden md:block absolute top-7 border-t-2 border-dashed" style={{ borderColor: 'var(--brand-border)', left: 'calc(50% + 32px)', width: 'calc(100% - 64px + 2rem)' }} />}
                    <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.015em' }}>{t(`howItWorks.steps.${i}.title`)}</h4>
                    <h5 className="body-h5 text-xs" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t(`howItWorks.steps.${i}.description`)}</h5>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            RISK / PROBLEM
            ============================================ */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-surface-warm)', borderTop: '2px solid var(--brand-crimson)' }} aria-labelledby="risk-heading">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <FadeSection>
                <h3 id="risk-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('riskProblem.heading')}</h3>
                <h5 className="body-h5 text-sm mb-6" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t('riskProblem.subheading')}</h5>
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
              </FadeSection>
              <FadeSection delay={150}>
                <div className="text-center md:text-left">
                  <h5 className="body-h5 text-base mb-6" style={{ color: 'var(--brand-charcoal)', lineHeight: '1.6', fontWeight: 400 }}>{t('riskProblem.solutionCta')}</h5>
                  <WhatsAppClickTracker
                    label="risk"
                    href={waRedirect(locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white"
                  >
                    <WAIcon />{t('shared.whatsappCta')}
                  </WhatsAppClickTracker>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ============================================
            MID CTA — image bg with role=img + aria-label
            ============================================ */}
        <section
          className="relative py-14 px-6 corrugated-texture"
          style={{ background: 'var(--brand-gunmetal)' }}
          role="img"
          aria-label={t('finalCta.bgAlt')}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(155deg, transparent 48%, rgba(242,199,68,0.04) 48%, rgba(242,199,68,0.04) 52%, transparent 52%)' }} aria-hidden="true" />
          <div className="relative max-w-6xl mx-auto text-center">
            <FadeSection>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('midCta.heading')}</h3>
              <h5 className="body-h5 text-sm mb-6" style={{ color: 'var(--brand-yellow)', lineHeight: '1.7', fontWeight: 400 }}>{t('midCta.subheading')}</h5>
              <WhatsAppClickTracker
                label="midcta"
                href={waRedirect(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white"
              >
                <WAIcon />{t('midCta.ctaButton')}
              </WhatsAppClickTracker>
            </FadeSection>
          </div>
        </section>

        {/* ============================================
            GOOGLE REVIEWS — also bg image styling
            ============================================ */}
        <section
          id="reviews"
          className="py-16 px-6"
          style={{ background: 'var(--brand-charcoal)' }}
          aria-labelledby="reviews-heading"
          role="img"
          aria-label={t('imageAlt')}
        >
          <div className="max-w-6xl mx-auto">
            <FadeSection>
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
            </FadeSection>

            <FadeSection className="mb-6">
              <article className="relative rounded-2xl p-8 md:p-10 overflow-hidden" style={{ background: 'rgba(242,199,68,0.08)', border: '1px solid rgba(242,199,68,0.2)' }}>
                <div className="absolute top-4 right-6 text-6xl font-serif leading-none" style={{ color: 'rgba(242,199,68,0.15)' }} aria-hidden="true">&ldquo;</div>
                <div className="flex items-center gap-2 mb-4">
                  <GoogleSmallIcon />
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <GoogleStarIcon key={j} />)}</div>
                </div>
                <blockquote className="review-body text-base md:text-lg font-medium text-white mb-6" style={{ lineHeight: '1.8', maxWidth: '720px' }}>
                  &ldquo;{t('reviews.items.0.text')}&rdquo;
                </blockquote>
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
            </FadeSection>

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
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            WHY CHOOSE — also styled as image-bg via role=img
            ============================================ */}
        <section
          className="py-16 px-6"
          style={{ background: '#fff', backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(242,199,68,0.04), transparent 60%)' }}
          aria-labelledby="why-heading"
          role="img"
          aria-label={t('imageAlt')}
        >
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="mb-12">
                <h3 id="why-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('whyChoose.heading')}</h3>
                <h5 className="body-h5 text-sm max-w-2xl" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t('whyChoose.subheading')}</h5>
              </div>
            </FadeSection>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-0">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <FadeSection key={i} delay={i * 50}>
                  <div className="why-card flex gap-5 py-6" style={{ borderBottom: '1px solid var(--brand-border)' }}>
                    <div className="shrink-0 text-3xl md:text-4xl font-extrabold leading-none" style={{ color: i % 2 === 0 ? 'var(--brand-yellow-dark)' : 'var(--brand-blue-dark)', minWidth: '48px' }}>
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-bold mb-1.5" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.015em' }}>{t(`whyChoose.items.${i}.title`)}</h4>
                      <h5 className="body-h5 text-sm" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t(`whyChoose.items.${i}.description`)}</h5>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            GALLERY
            ============================================ */}
        <section className="py-16 px-6" style={{ background: 'var(--brand-gunmetal)' }} aria-labelledby="gallery-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <h3 id="gallery-heading" className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('gallery.heading')}</h3>
                <h5 className="body-h5 text-sm" style={{ color: 'var(--brand-steel-light)', lineHeight: '1.7', fontWeight: 400 }}>{t('gallery.subheading')}</h5>
              </div>
            </FadeSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {galleryImages.map((img, i) => (
                <FadeSection key={i} delay={i * 50}>
                  <div className="relative group rounded overflow-hidden cursor-pointer" style={{ aspectRatio: '1/1' }}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" style={{ transition: 'transform 300ms ease' }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end p-3" style={{ background: 'rgba(15,33,43,0.7)', transition: 'opacity 300ms ease', border: '2px solid var(--brand-yellow)' }}>
                      <span className="text-xs font-medium text-white">{img.alt}</span>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            LOCATIONS ACCORDION
            ============================================ */}
        <section id="locations" className="py-16 px-6" style={{ background: 'var(--brand-surface)' }} aria-labelledby="locations-heading">
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <h3 id="locations-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('locations.heading')}</h3>
                <h5 className="body-h5 text-sm max-w-2xl mx-auto" style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7', fontWeight: 400 }}>{t('locations.subheading')}</h5>
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

        {/* ============================================
            FAQ
            ============================================ */}
        <section id="faq" className="py-16 px-6" style={{ background: '#fff' }} aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <FadeSection>
              <div className="text-center mb-10">
                <h3 id="faq-heading" className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-charcoal)', letterSpacing: '-0.025em' }}>{t('faq.heading')}</h3>
              </div>
            </FadeSection>
            <div>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <FAQItem key={i} q={t(`faq.items.${i}.question`)} a={t(`faq.items.${i}.answer`)} />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            FINAL CTA — image bg + role=img
            ============================================ */}
        <section
          className="relative py-16 px-6 corrugated-texture"
          style={{ background: 'var(--brand-charcoal)' }}
          role="img"
          aria-label={t('finalCta.bgAlt')}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(155deg, transparent 46%, rgba(242,199,68,0.06) 46%, rgba(242,199,68,0.06) 54%, transparent 54%)' }} aria-hidden="true" />
          <div className="relative max-w-6xl mx-auto text-center">
            <FadeSection>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>{t('finalCta.heading')}</h3>
              <h5 className="body-h5 text-sm mb-6" style={{ color: 'var(--brand-yellow)', lineHeight: '1.7', fontWeight: 400 }}>{t('finalCta.subheading')}</h5>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
                <WhatsAppClickTracker
                  label="final"
                  href={waRedirect(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-lg font-bold text-white"
                >
                  <WAIcon />{t('finalCta.ctaButton')}
                </WhatsAppClickTracker>
                <WhatsAppClickTracker
                  label="final-secondary"
                  href={waRedirect(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-btn inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-white"
                  style={{ border: '2px solid rgba(255,255,255,0.3)' }}
                >
                  {t('common.whatsappUs')}
                </WhatsAppClickTracker>
              </div>
              <h6 className="body-h6 text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{t('finalCta.supportingText')}</h6>
            </FadeSection>
          </div>
        </section>
      </main>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <WhatsAppClickTracker
        label="float"
        href={waRedirect(locale)}
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
