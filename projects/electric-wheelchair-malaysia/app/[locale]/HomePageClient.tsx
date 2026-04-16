'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { locations, regionOrder, getLocationsByRegion } from '@/config/locations';

/* ============================================
   HELPER: WhatsApp icon SVG
   ============================================ */
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ============================================
   HELPER: Google "G" icon
   ============================================ */
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ============================================
   HELPER: Star rating
   ============================================ */
function Stars({ count = 5 }: { count?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="var(--google-gold)">
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78L10 1z" />
        </svg>
      ))}
    </span>
  );
}

/* ============================================
   INTERSECTION OBSERVER HOOK
   ============================================ */
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ============================================
   PRODUCT GALLERY DATA
   ============================================ */
const productGallery = [
  'https://static.wixstatic.com/media/d3104b_64b5d16422824a7384e5630d9b70c0ae~mv2.png',
  'https://static.wixstatic.com/media/d3104b_7d971873a0b847e8adf9b4d7fbe36671~mv2.png',
  'https://static.wixstatic.com/media/d3104b_e316a4a91161459bb8480465cea5bea2~mv2.png',
  'https://static.wixstatic.com/media/d3104b_23e852bbc2014f68bf15ba24ed1985cc~mv2.png',
  'https://static.wixstatic.com/media/d3104b_90288668fcea43789582d2f818832e9a~mv2.png',
];

/* ============================================
   WHY CHOOSE ICONS
   ============================================ */
const whyChooseIcons = [
  // KKM Certified - shield
  <svg key="kkm" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  // Same-Day Delivery - truck
  <svg key="delivery" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  // 6-Month Warranty - award
  <svg key="warranty" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  // Flexible Rental - credit-card
  <svg key="rental" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  // Free Setup - tool
  <svg key="setup" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  // Repair & Spare Parts - settings
  <svg key="repair" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
];

/* ============================================
   GALLERY IMAGES
   ============================================ */
const galleryImages = [
  'https://static.wixstatic.com/media/d3104b_e316a4a91161459bb8480465cea5bea2~mv2.png',
  'https://static.wixstatic.com/media/d3104b_23e852bbc2014f68bf15ba24ed1985cc~mv2.png',
  'https://static.wixstatic.com/media/d3104b_b4447471360744dcad575e11b7ab844b~mv2.png',
  'https://static.wixstatic.com/media/d3104b_2886cdd04bdc4d219906b4ca405282b0~mv2.png',
  'https://static.wixstatic.com/media/d3104b_e4be4ee4a4f045e0ad6bc88914d85baa~mv2.png',
  'https://static.wixstatic.com/media/d3104b_a9a66ccdc948499babc488ba93cba1dc~mv2.png',
];

/* ============================================
   MAIN COMPONENT
   ============================================ */
interface LocationProps {
  cityName?: string;
  locationSlug?: string;
  nearbyLocations?: { slug: string; name: string }[];
}

export default function HomePageClient({ cityName, locationSlug, nearbyLocations }: LocationProps = {}) {
  const isLocationPage = !!cityName;
  const locale = useLocale();
  const t = useTranslations();
  const waHref = waRedirect(locale);

  /* ---- state ---- */
  const [fomoIndex, setFomoIndex] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const productsRef = useRef<HTMLDivElement>(null);

  /* ---- FOMO rotation ---- */
  useEffect(() => {
    const timer = setInterval(() => {
      setFomoIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  /* ---- Nav scroll shadow ---- */
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* ---- Scroll animation observer ---- */
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToProducts = useCallback(() => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const locationsByRegion = getLocationsByRegion();

  const navLinks = [
    { label: t('nav.products'), href: '#products' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.reviews'), href: '#reviews' },
    { label: t('nav.locations'), href: '#locations' },
    { label: t('nav.faq'), href: '#faq' },
    { label: t('nav.blog'), href: `/${locale}/blog` },
  ];

  return (
    <>
      {/* ============================================
          1. FOMO BANNER
          ============================================ */}
      <div
        style={{
          background: 'var(--gradient-fomo)',
          padding: '8px 0',
          position: 'relative',
          zIndex: 60,
        }}
      >
        <div
          className="section-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div
            key={fomoIndex}
            className="fomo-text-enter"
            style={{
              color: 'var(--white)',
              fontSize: '13px',
              fontWeight: 600,
              flex: 1,
              textAlign: 'center',
            }}
          >
            {t(`fomoBanner.texts.${fomoIndex}`)}
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--white)',
              fontSize: '13px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              textDecoration: 'underline',
              transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.transform = 'scale(1.05)'); }}
            onMouseLeave={(e) => { (e.currentTarget.style.transform = 'scale(1)'); }}
          >
            {t('fomoBanner.bookNow')}
          </a>
        </div>
      </div>

      {/* ============================================
          2. NAV
          ============================================ */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--white)',
          boxShadow: navScrolled ? 'var(--shadow-nav)' : 'none',
          transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="section-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* Logo */}
          <a href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#1B2D5B"/>
              <circle cx="13" cy="22" r="5.5" stroke="#F47B20" strokeWidth="2" fill="none"/>
              <circle cx="13" cy="22" r="1.5" fill="#F47B20"/>
              <circle cx="15" cy="8" r="2.5" fill="#FFFFFF"/>
              <path d="M14 11v6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 17h6l2 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="22" cy="22" r="2.5" stroke="#F47B20" strokeWidth="1.5" fill="none"/>
              <path d="M24 5l-3 4h3l-3 4" stroke="#F47B20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--navy)', letterSpacing: '-0.02em' }}>{t('nav.brandName')}</span>
          </a>

          {/* Desktop nav links */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '28px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--navy)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="desktop-nav" style={{ display: 'none' }}>
              <LanguageSwitcher />
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn desktop-nav"
              style={{
                display: 'none',
                padding: '8px 20px',
                fontSize: '14px',
              }}
            >
              <WhatsAppIcon size={16} />
              {t('nav.ctaButton')}
            </a>

            {/* Mobile hamburger */}
            <button
              className="mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <span
                style={{
                  width: '22px',
                  height: '2px',
                  background: 'var(--navy)',
                  borderRadius: '2px',
                  transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                }}
              />
              <span
                style={{
                  width: '22px',
                  height: '2px',
                  background: 'var(--navy)',
                  borderRadius: '2px',
                  transition: 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: mobileMenuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  width: '22px',
                  height: '2px',
                  background: 'var(--navy)',
                  borderRadius: '2px',
                  transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '280px',
            height: '100vh',
            background: 'var(--white)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 200,
            padding: '80px 24px 24px',
            transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--navy)',
                borderBottom: '1px solid var(--surface)',
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ marginTop: '16px' }}>
            <LanguageSwitcher />
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
            style={{ marginTop: '16px', textAlign: 'center' }}
          >
            <WhatsAppIcon size={18} />
            {t('nav.ctaButton')}
          </a>
        </div>

        {/* Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 199,
            }}
          />
        )}
      </nav>

      {/* Breadcrumbs — location pages only */}
      {isLocationPage && (
        <div style={{ background: 'var(--surface)', padding: '12px 0', borderBottom: '1px solid rgba(27,45,91,0.06)' }}>
          <div className="section-container" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            <a href={`/${locale}`} style={{ color: 'var(--text-muted)' }}>{t('location.breadcrumbHome')}</a>
            {' > '}
            <a href={`/${locale}#products`} style={{ color: 'var(--text-muted)' }}>{t('location.breadcrumbProduct')}</a>
            {' > '}
            <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{cityName}</span>
          </div>
        </div>
      )}

      {/* ============================================
          3. HERO — Clean Split Layout (no photo BG)
          ============================================ */}
      <section
        style={{
          position: 'relative',
          minHeight: '600px',
          overflow: 'hidden',
          background: 'linear-gradient(155deg, #0F1B3A 0%, #1B2D5B 45%, #2A4080 100%)',
        }}
      >
        {/* Subtle radial accent glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(244,123,32,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Subtle grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            paddingTop: 'var(--space-3xl)',
            paddingBottom: 'var(--space-3xl)',
          }}
        >
          <div className="hero-split-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            alignItems: 'center',
            minHeight: '500px',
          }}>
            {/* Left column — Text */}
            <div className="fade-up">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(244,123,32,0.12)',
                  border: '1px solid rgba(244,123,32,0.25)',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--orange)', animation: 'fomoPulse 2s ease-in-out infinite' }} />
                {t('hero.badge')}
              </span>

              <h1
                style={{
                  fontSize: 'clamp(34px, 5vw, 54px)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                  color: 'var(--white)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                {isLocationPage ? (
                  <>{t('location.h1Prefix')}{' '}<span style={{ color: 'var(--orange)' }}>{cityName}</span>{' — '}{t('hero.h1Highlight')}</>
                ) : (
                  <>{t('hero.h1')}<br /><span style={{ color: 'var(--orange)' }}>{t('hero.h1Highlight')}</span>{' '}{t('hero.h1Suffix')}</>
                )}
              </h1>

              <h2 style={{ fontSize: '17px', fontWeight: 400, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', marginBottom: 'var(--space-xl)', maxWidth: '460px' }}>
                {t('hero.subheadline')}
              </h2>

              <div className="hero-cta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: 'var(--space-xl)' }}>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn"
                  style={{ fontSize: '16px', padding: '14px 32px', boxShadow: '0 8px 28px rgba(37,211,102,0.3)' }}
                >
                  <WhatsAppIcon size={18} />
                  {t('hero.ctaPrimary')}
                </a>
                <button
                  onClick={scrollToProducts}
                  className="ghost-btn"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--white)', fontSize: '15px', padding: '12px 28px' }}
                >
                  {t('hero.ctaSecondary')}
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['KKM Certified', '6-Month Warranty', 'Same-Day Delivery'].map((item) => (
                  <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 500, background: 'rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 10 8 14 16 6" /></svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column — Product image with stamps */}
            <div className="hero-right-col" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '420px' }}>
              {/* Outer decorative ring */}
              <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', border: '1px dashed rgba(244,123,32,0.2)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
              {/* Inner glow */}
              <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,123,32,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

              {/* Main product image */}
              <div className="hero-float" style={{ position: 'relative', zIndex: 2 }}>
                <img
                  src="https://static.wixstatic.com/media/d3104b_64b5d16422824a7384e5630d9b70c0ae~mv2.png"
                  alt={t('products.name')}
                  style={{ width: '340px', maxWidth: '90%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))', position: 'relative', zIndex: 1 }}
                />
              </div>

              {/* Stamp: KKM Certified (top-left) */}
              <div style={{ position: 'absolute', top: '8%', left: '5%', zIndex: 3, width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(27,45,91,0.95)', border: '2px dashed rgba(244,123,32,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1.2, padding: '6px', transform: 'rotate(-8deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                KKM<br/>Certified
              </div>

              {/* Stamp: Same Day (top-right) */}
              <div style={{ position: 'absolute', top: '5%', right: '8%', zIndex: 3, width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(244,123,32,0.95)', border: '2px dashed rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1.2, padding: '6px', transform: 'rotate(6deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                Same Day<br/>Delivery
              </div>

              {/* Stamp: 6-Month Warranty (bottom-right) */}
              <div style={{ position: 'absolute', bottom: '10%', right: '5%', zIndex: 3, width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(27,45,91,0.95)', border: '2px dashed rgba(244,123,32,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1.2, padding: '6px', transform: 'rotate(10deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                6-Month<br/>Warranty
              </div>

              {/* Stamp: RM400/mo (bottom-left) */}
              <div style={{ position: 'absolute', bottom: '8%', left: '8%', zIndex: 3, width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(244,123,32,0.95)', border: '2px dashed rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1.2, padding: '6px', transform: 'rotate(-6deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                From<br/>RM400/mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          4. STATS — Boxed USP Cards
          ============================================ */}
      <section style={{ background: 'var(--white)', padding: 'var(--space-2xl) 0' }}>
        <div
          className="section-container stats-grid"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-lg)',
                textAlign: 'center',
                border: '1px solid rgba(27,45,91,0.06)',
                boxShadow: '0 2px 8px rgba(27,45,91,0.04)',
              }}
            >
              <h5
                style={{
                  fontSize: 'clamp(20px, 3vw, 30px)',
                  fontWeight: 800,
                  color: 'var(--orange)',
                  lineHeight: 1.1,
                  marginBottom: '6px',
                }}
              >
                {t(`stats.items.${i}.value`)}
              </h5>
              <h6
                style={{
                  fontSize: 'clamp(11px, 1.4vw, 13px)',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {t(`stats.items.${i}.label`)}
              </h6>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          5. PRODUCTS — Single Product Showcase
          ============================================ */}
      <section
        id="products"
        ref={productsRef}
        className="section-spacing"
        style={{ background: 'var(--surface)' }}
      >
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span style={{ display: 'inline-block', background: 'var(--orange-pale)', color: 'var(--orange)', fontSize: '13px', fontWeight: 700, padding: '5px 16px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-md)' }}>Rent or Buy</span>
            <h3
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 800,
                color: 'var(--navy)',
                letterSpacing: 'var(--tracking-tight)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              {t('products.heading')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
              {t('products.subheading')}
            </p>
          </div>

          <div
            className="fade-up product-showcase"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--space-2xl)',
              background: 'var(--white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Left: Single Product Image */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
                border: '1px solid var(--surface)',
                position: 'relative',
              }}
            >
              <img
                src={productGallery[0]}
                alt={t('products.name')}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.1))',
                }}
              />
            </div>

            {/* Right: Product Info */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4
                style={{
                  fontSize: 'clamp(22px, 3vw, 30px)',
                  fontWeight: 800,
                  color: 'var(--navy)',
                  letterSpacing: 'var(--tracking-tight)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                {t('products.name')}
              </h4>

              {/* Feature badges */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      background: 'var(--orange-pale)',
                      color: 'var(--orange)',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {t(`products.features.${i}`)}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-xl)',
                }}
              >
                {t('products.description')}
              </p>

              {/* Price block */}
              <div
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-lg)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '16px',
                      color: 'var(--text-muted)',
                      textDecoration: 'line-through',
                      fontWeight: 500,
                    }}
                  >
                    {t('products.rrp')}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'var(--orange)',
                      color: 'var(--white)',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '2px 10px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {t('products.saveLabel')}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 'clamp(28px, 4vw, 36px)',
                    fontWeight: 800,
                    color: 'var(--navy)',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}
                >
                  {t('products.price')}
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    color: 'var(--orange)',
                    fontWeight: 600,
                  }}
                >
                  {t('products.rental')}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn"
                style={{
                  fontSize: '16px',
                  padding: '14px 32px',
                  textAlign: 'center',
                  justifyContent: 'center',
                }}
              >
                <WhatsAppIcon size={20} />
                {t('products.cta')}
              </a>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'var(--space-md)' }}>
                {['Free Delivery', 'No Deposit', 'Pay Online'].map((tag) => (
                  <span key={tag} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--surface)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>✓ {tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          6. HOW IT WORKS — 3 Steps
          ============================================ */}
      <section id="how-it-works" className="section-spacing">
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span style={{ display: 'inline-block', background: 'var(--orange-pale)', color: 'var(--orange)', fontSize: '13px', fontWeight: 700, padding: '5px 16px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-md)' }}>Simple Process</span>
            <h3
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 800,
                color: 'var(--navy)',
                letterSpacing: 'var(--tracking-tight)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              {t('howItWorks.heading')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
              {t('howItWorks.subheading')}
            </p>
          </div>

          <div
            className="fade-up"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '0',
              position: 'relative',
              maxWidth: '800px',
              margin: '0 auto',
              flexWrap: 'wrap',
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  flex: '1 1 200px',
                  position: 'relative',
                  padding: '0 var(--space-md)',
                }}
              >
                {/* Connecting line */}
                {i < 2 && (
                  <div
                    className="step-line"
                    style={{
                      position: 'absolute',
                      top: '28px',
                      left: 'calc(50% + 28px)',
                      width: 'calc(100% - 56px)',
                      height: '2px',
                      background: 'var(--orange)',
                      opacity: 0.3,
                    }}
                  />
                )}

                {/* Number circle */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--gradient-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--white)',
                    fontWeight: 800,
                    fontSize: '22px',
                    marginBottom: 'var(--space-md)',
                    boxShadow: '0 4px 14px rgba(244, 123, 32, 0.3)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {i + 1}
                </div>

                <h5
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--navy)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  {t(`howItWorks.steps.${i}.title`)}
                </h5>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    lineHeight: 'var(--leading-relaxed)',
                    maxWidth: '220px',
                  }}
                >
                  {t(`howItWorks.steps.${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          7. RISK / PROBLEM SECTION
          ============================================ */}
      <section className="section-spacing" style={{ background: 'var(--surface)' }}>
        <div className="section-container">
          <div
            className="fade-up"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--space-2xl)',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
              <h3
                style={{
                  fontSize: 'clamp(24px, 3.5vw, 36px)',
                  fontWeight: 800,
                  color: 'var(--navy)',
                  letterSpacing: 'var(--tracking-tight)',
                  marginBottom: 'var(--space-sm)',
                }}
              >
                {t('risk.heading')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                {t('risk.subheading')}
              </p>
            </div>

            <div
              className="risk-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 'var(--space-2xl)',
                alignItems: 'center',
              }}
            >
              {/* Pain points */}
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-md)',
                        background: 'var(--white)',
                        padding: 'var(--space-md) var(--space-lg)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'var(--orange)',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '15px', color: 'var(--navy)', fontWeight: 500 }}>
                        {t(`risk.points.${i}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution */}
              <div
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  boxShadow: 'var(--shadow-md)',
                  borderLeft: '4px solid var(--orange)',
                }}
              >
                <p
                  style={{
                    fontSize: '17px',
                    lineHeight: 'var(--leading-relaxed)',
                    color: 'var(--navy)',
                    fontWeight: 500,
                    marginBottom: 'var(--space-lg)',
                  }}
                >
                  {t('risk.solution')}
                </p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn"
                >
                  <WhatsAppIcon size={18} />
                  {t('risk.cta')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          8. MID CTA
          ============================================ */}
      <section
        style={{
          background: 'var(--gradient-navy)',
          padding: 'var(--space-3xl) 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background photo */}
        <img
          src="https://images.pexels.com/photos/6646922/pexels-photo-6646922.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, pointerEvents: 'none' }}
        />
        <div
          className="section-container fade-up"
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <h3
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: 800,
              color: 'var(--white)',
              letterSpacing: 'var(--tracking-tight)',
              marginBottom: 'var(--space-md)',
            }}
          >
            {t('midCta.heading')}
          </h3>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '16px',
              marginBottom: 'var(--space-xl)',
              maxWidth: '500px',
              margin: '0 auto var(--space-xl)',
            }}
          >
            {t('midCta.subheading')}
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
            style={{ fontSize: '18px', padding: '16px 36px' }}
          >
            <WhatsAppIcon size={20} />
            {t('midCta.cta')}
          </a>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'var(--space-md)', justifyContent: 'center' }}>
            {['Reply Within 1 Hour', 'No Obligation', 'Free Consultation'].map((tag) => (
              <span key={tag} style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>✓ {tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          9. GOOGLE REVIEWS — Marquee Carousel
          ============================================ */}
      <section
        id="reviews"
        style={{
          paddingTop: 'var(--space-3xl)',
          paddingBottom: 'var(--space-3xl)',
          overflow: 'hidden',
          background: 'var(--surface)',
        }}
      >
        {/* Header (centered) */}
        <div
          className="fade-up reviews-header"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-2xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <GoogleIcon size={24} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--navy)',
                lineHeight: 1,
              }}
            >
              {t('reviews.rating')}
            </span>
            <span style={{ display: 'inline-flex', gap: '2px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="var(--google-gold)">
                  <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78L10 1z" />
                </svg>
              ))}
            </span>
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 'var(--space-md)' }}>
            {t('reviews.subheading')}
          </span>
          <h3
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--navy)',
              letterSpacing: '-0.02em',
            }}
          >
            {t('reviews.heading')}
          </h3>
        </div>

        {/* Marquee track */}
        <div
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
          onMouseEnter={(e) => {
            const track = e.currentTarget.querySelector<HTMLDivElement>('[data-marquee]');
            if (track) track.style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            const track = e.currentTarget.querySelector<HTMLDivElement>('[data-marquee]');
            if (track) track.style.animationPlayState = 'running';
          }}
        >
          <div
            data-marquee
            style={{
              display: 'flex',
              gap: '20px',
              animation: 'marqueeLeft 60s linear infinite',
              width: 'max-content',
            }}
          >
            {/* Double the reviews for seamless loop */}
            {[...[0, 1, 2, 3, 4, 5], ...[0, 1, 2, 3, 4, 5]].map((i, idx) => (
              <div
                key={idx}
                style={{
                  flexShrink: 0,
                  width: '320px',
                  background: 'var(--white)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: '0 4px 20px rgba(27,45,91,0.07)',
                  border: '1px solid rgba(27,45,91,0.08)',
                }}
              >
                {/* Header row: stars + Google icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} width="16" height="16" viewBox="0 0 20 20" fill="var(--google-gold)">
                        <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78L10 1z" />
                      </svg>
                    ))}
                  </span>
                  <GoogleIcon size={18} />
                </div>

                {/* Review text */}
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--text)',
                  }}
                >
                  &ldquo;{t(`reviews.items.${i}.text`)}&rdquo;
                </p>

                {/* Attribution */}
                <div style={{ borderTop: '1px solid rgba(27,45,91,0.08)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                  {/* Avatar circle */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--white)',
                    fontSize: '14px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {t(`reviews.items.${i}.name`).charAt(0)}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                      {t(`reviews.items.${i}.name`)}
                    </h5>
                    <h6 style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400, margin: 0 }}>
                      {t(`reviews.items.${i}.location`)}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          10. WHY CHOOSE
          ============================================ */}
      <section className="section-spacing" style={{ background: 'var(--surface)' }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span style={{ display: 'inline-block', background: 'var(--orange-pale)', color: 'var(--orange)', fontSize: '13px', fontWeight: 700, padding: '5px 16px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-md)' }}>Trusted Nationwide</span>
            <h3
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 800,
                color: 'var(--navy)',
                letterSpacing: 'var(--tracking-tight)',
              }}
            >
              {t('whyChoose.heading')}
            </h3>
          </div>

          <div className="why-grid">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--gradient-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)',
                    boxShadow: '0 4px 12px rgba(244, 123, 32, 0.25)',
                  }}
                >
                  {whyChooseIcons[i]}
                </div>

                <h5
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--navy)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  {t(`whyChoose.items.${i}.title`)}
                </h5>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {t(`whyChoose.items.${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          11. GALLERY — Tight Compact Grid
          ============================================ */}
      <section
        style={{
          paddingTop: 'var(--space-3xl)',
          paddingBottom: 'var(--space-3xl)',
          background: 'var(--surface)',
        }}
      >
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span style={{ display: 'inline-block', background: 'var(--orange-pale)', color: 'var(--orange)', fontSize: '13px', fontWeight: 700, padding: '5px 16px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-md)' }}>Real Customers</span>
            <h3
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--navy)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-sm)',
              }}
            >
              {t('gallery.heading')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              {t('gallery.subheading')}
            </p>
          </div>

          <div className="gallery-grid fade-up">
            {[
              'https://static.wixstatic.com/media/d3104b_e316a4a91161459bb8480465cea5bea2~mv2.png',
              'https://static.wixstatic.com/media/d3104b_23e852bbc2014f68bf15ba24ed1985cc~mv2.png',
              'https://static.wixstatic.com/media/d3104b_b4447471360744dcad575e11b7ab844b~mv2.png',
              'https://static.wixstatic.com/media/d3104b_2886cdd04bdc4d219906b4ca405282b0~mv2.png',
              'https://static.wixstatic.com/media/d3104b_e4be4ee4a4f045e0ad6bc88914d85baa~mv2.png',
              'https://static.wixstatic.com/media/d3104b_a9a66ccdc948499babc488ba93cba1dc~mv2.png',
              'https://static.wixstatic.com/media/d3104b_3bb278b8f9df48058c905f941327117e~mv2.png',
              'https://static.wixstatic.com/media/d3104b_90288668fcea43789582d2f818832e9a~mv2.png',
              'https://static.wixstatic.com/media/d3104b_e316a4a91161459bb8480465cea5bea2~mv2.png',
              'https://static.wixstatic.com/media/d3104b_23e852bbc2014f68bf15ba24ed1985cc~mv2.png',
              'https://static.wixstatic.com/media/d3104b_b4447471360744dcad575e11b7ab844b~mv2.png',
              'https://static.wixstatic.com/media/d3104b_2886cdd04bdc4d219906b4ca405282b0~mv2.png',
            ].map((src, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 200ms ease',
                  boxShadow: '0 2px 8px rgba(27,45,91,0.08)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,45,91,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(27,45,91,0.08)';
                }}
              >
                <img
                  src={src}
                  alt={`${t('gallery.heading')} ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          12. LOCATIONS — City Chip Grid by Region
          ============================================ */}
      <section
        id="locations"
        style={{ background: 'var(--surface)', padding: 'var(--space-2xl) 0' }}
      >
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3
              style={{
                fontSize: 'clamp(22px, 3vw, 32px)',
                fontWeight: 800,
                color: 'var(--navy)',
                letterSpacing: 'var(--tracking-tight)',
                marginBottom: 'var(--space-xs)',
              }}
            >
              {t('locations.heading')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              {t('locations.subheading')}
            </p>
          </div>

          <div
            className="fade-up"
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
            }}
          >
            {regionOrder.map((region) => {
              const regionLocs = locationsByRegion[region] || [];
              if (regionLocs.length === 0) return null;

              return (
                <div key={region}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--navy)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {region}
                  </div>
                  <div className="loc-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {regionLocs.map((loc) => (
                      <a
                        key={loc.slug}
                        href={`/${locale}/electric-wheelchair/${loc.slug}`}
                        className="loc-link"
                        style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--navy)',
                          background: 'var(--white)',
                          border: '1.5px solid var(--navy)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--orange)'; e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--orange)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--navy)'; e.currentTarget.style.borderColor = 'var(--navy)'; }}
                      >
                        {loc.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          13. FAQ
          ============================================ */}
      <section id="faq" className="section-spacing">
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h3
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 800,
                color: 'var(--navy)',
                letterSpacing: 'var(--tracking-tight)',
              }}
            >
              {t('faq.heading')}
            </h3>
          </div>

          <div
            className="fade-up"
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-md)',
                      padding: 'var(--space-md) var(--space-lg)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      textAlign: 'left',
                      lineHeight: 'var(--leading-snug)',
                    }}
                  >
                    <h4 style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', lineHeight: 'inherit', margin: 0 }}>{t(`faq.items.${i}.question`)}</h4>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--orange)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0,
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div
                    className={`accordion-content${isOpen ? ' open' : ''}`}
                    style={{
                      maxHeight: isOpen ? '300px' : '0',
                    }}
                  >
                    <div
                      style={{
                        padding: '0 var(--space-lg) var(--space-lg)',
                        fontSize: '14px',
                        lineHeight: 'var(--leading-relaxed)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {t(`faq.items.${i}.answer`)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nearby Locations — location pages only */}
      {isLocationPage && nearbyLocations && nearbyLocations.length > 0 && (
        <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--white)' }}>
          <div className="section-container">
            <h4 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
              {t('location.nearbyTitle')}
            </h4>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', marginBottom: 'var(--space-lg)' }}>
              {t('location.nearbySubtitle')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {nearbyLocations.map((loc) => (
                <a
                  key={loc.slug}
                  href={`/${locale}/electric-wheelchair/${loc.slug}`}
                  className="loc-link"
                  style={{
                    padding: '8px 20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--navy)',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(27,45,91,0.1)',
                  }}
                >
                  {loc.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          14. FINAL CTA
          ============================================ */}
      <section
        style={{
          background: 'var(--gradient-navy-dark)',
          padding: 'var(--space-4xl) 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Faded wheelchair background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${productGallery[1]})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center right',
            opacity: 0.05,
            pointerEvents: 'none',
          }}
        />
        <div
          className="section-container fade-up"
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <h3
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 800,
              color: 'var(--white)',
              letterSpacing: 'var(--tracking-tight)',
              marginBottom: 'var(--space-md)',
              lineHeight: 'var(--leading-tight)',
            }}
          >
            {t('finalCta.heading')}
          </h3>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '17px',
              marginBottom: 'var(--space-xl)',
              maxWidth: '540px',
              margin: '0 auto var(--space-xl)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            {t('finalCta.subheading')}
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
            style={{ fontSize: '18px', padding: '18px 40px', marginBottom: 'var(--space-lg)' }}
          >
            <WhatsAppIcon size={22} />
            {t('finalCta.cta')}
          </a>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'var(--space-md)', justifyContent: 'center' }}>
            {['Fast Response', 'Free Setup', 'Satisfaction Guaranteed'].map((tag) => (
              <span key={tag} style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>✓ {tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          15. FOOTER
          ============================================ */}
      <footer
        style={{
          background: 'var(--navy-dark)',
          padding: 'var(--space-3xl) 0 var(--space-lg)',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <div className="section-container">
          <div
            className="footer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--space-2xl)',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-sm)' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#1B2D5B"/>
                  <circle cx="13" cy="22" r="5.5" stroke="#F47B20" strokeWidth="2" fill="none"/>
                  <circle cx="13" cy="22" r="1.5" fill="#F47B20"/>
                  <circle cx="15" cy="8" r="2.5" fill="#FFFFFF"/>
                  <path d="M14 11v6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14 17h6l2 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="22" cy="22" r="2.5" stroke="#F47B20" strokeWidth="1.5" fill="none"/>
                  <path d="M24 5l-3 4h3l-3 4" stroke="#F47B20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--white)', letterSpacing: '-0.02em' }}>{t('footer.brandName')}</span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 'var(--leading-relaxed)', maxWidth: '300px' }}>
                {t('footer.tagline')}
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h6
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginBottom: 'var(--space-md)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t('footer.quickLinks')}
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.6)',
                      transition: 'opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--orange)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h6
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginBottom: 'var(--space-md)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t('footer.contact')}
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '14px',
                    color: 'var(--wa-green)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <WhatsAppIcon size={16} />
                  {t('nav.ctaButton')}
                </a>
                <span style={{ fontSize: '14px' }}>
                  electric-wheelchair.com.my
                </span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 'var(--space-lg)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-md)',
            }}
          >
            <p style={{ fontSize: '13px' }}>{t('footer.copyright')}</p>
            <span
              style={{
                fontSize: '12px',
                padding: '4px 12px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {t('footer.ssm')}
            </span>
          </div>
        </div>
      </footer>

      {/* ============================================
          RESPONSIVE STYLES
          ============================================ */}
      <style>{`
        /* Desktop nav */
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-only {
            display: none !important;
          }
          .risk-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr !important;
          }
          .hero-card {
            max-width: 560px !important;
          }
          .reviews-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
          .hero-card {
            max-width: 100% !important;
          }
          .step-line {
            display: none !important;
          }
          .reviews-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
