'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { regionOrder, getLocationsByRegion } from '@/config/locations';

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
   PRODUCT DATA
   ============================================ */
const productKeys = ['lightweight', 'reclining', 'heavyDuty', 'travel'] as const;
const productImages = [
  'https://static.wixstatic.com/media/d3104b_175b3c0c18ff4bd8bb8bd8884054b958~mv2.png',
  'https://static.wixstatic.com/media/d3104b_598acc977dc24b6399182a9ce15b3a95~mv2.png',
  'https://static.wixstatic.com/media/d3104b_4a6d8f530d7348088812ea9314658733~mv2.png',
  'https://static.wixstatic.com/media/d3104b_da9710ae55b048e889c8335c6f9dbea7~mv2.png',
];

/* ============================================
   WHY CHOOSE ICONS
   ============================================ */
const whyChooseIcons = [
  <svg key="kkm" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  <svg key="delivery" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  <svg key="warranty" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  <svg key="rental" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  <svg key="setup" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  <svg key="repair" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
];

/* ============================================
   GALLERY IMAGES
   ============================================ */
const galleryImages = [
  'https://static.wixstatic.com/media/d3104b_02a602b69c914df4b5384bed0b324ec7~mv2.png',
  'https://static.wixstatic.com/media/d3104b_38d2726749104980a929dc8126ae27d5~mv2.png',
  'https://static.wixstatic.com/media/d3104b_64b5d16422824a7384e5630d9b70c0ae~mv2.png',
  'https://static.wixstatic.com/media/d3104b_f619ee8825b64808a32f5a8c0abfd3a6~mv2.png',
  'https://static.wixstatic.com/media/d3104b_175b3c0c18ff4bd8bb8bd8884054b958~mv2.png',
  'https://static.wixstatic.com/media/d3104b_598acc977dc24b6399182a9ce15b3a95~mv2.png',
];

/* ============================================
   PROPS
   ============================================ */
interface LocationPageClientProps {
  locale: string;
  locationSlug: string;
  cityName: string;
  nearbyLocations: { slug: string; name: string }[];
}

/* ============================================
   MAIN COMPONENT
   ============================================ */
export default function LocationPageClient({
  locale,
  locationSlug,
  cityName,
  nearbyLocations,
}: LocationPageClientProps) {
  const t = useTranslations();
  const locT = useTranslations('location');
  const waHref = waRedirect(locale, undefined, locationSlug);

  /* ---- state ---- */
  const [fomoIndex, setFomoIndex] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number>(0);
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

          <div
            style={{ display: 'none', alignItems: 'center', gap: '28px' }}
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
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--navy)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="desktop-nav" style={{ display: 'none' }}>
              <LanguageSwitcher />
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn desktop-nav"
              style={{ display: 'none', padding: '8px 20px', fontSize: '14px' }}
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
              <span style={{ width: '22px', height: '2px', background: 'var(--navy)', borderRadius: '2px', transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span style={{ width: '22px', height: '2px', background: 'var(--navy)', borderRadius: '2px', transition: 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)', opacity: mobileMenuOpen ? 0 : 1 }} />
              <span style={{ width: '22px', height: '2px', background: 'var(--navy)', borderRadius: '2px', transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
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

      {/* ============================================
          2b. BREADCRUMBS
          ============================================ */}
      <div style={{ background: 'var(--surface)', padding: 'var(--space-md) 0' }}>
        <div className="section-container">
          <nav style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            <a href={`/${locale}`} style={{ color: 'var(--text-muted)' }}>
              {locT('breadcrumbHome')}
            </a>
            {' > '}
            <a href={`/${locale}#products`} style={{ color: 'var(--text-muted)' }}>
              {locT('breadcrumbProduct')}
            </a>
            {' > '}
            <span style={{ color: 'var(--navy)', fontWeight: 500 }}>
              {cityName}
            </span>
          </nav>
        </div>
      </div>

      {/* ============================================
          3. HERO
          ============================================ */}
      <section
        style={{
          position: 'relative',
          minHeight: '520px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://static.wixstatic.com/media/d3104b_64b5d16422824a7384e5630d9b70c0ae~mv2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(27,45,91,0.85) 0%, rgba(27,45,91,0.4) 60%, transparent 100%)',
          }}
        />

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            minHeight: '520px',
            paddingBottom: 'var(--space-2xl)',
            paddingTop: 'var(--space-2xl)',
          }}
        >
          <div
            className="fade-up"
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-xl)',
              maxWidth: '560px',
              width: '100%',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: 'var(--orange-pale)',
                color: 'var(--orange)',
                fontSize: '13px',
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--space-md)',
              }}
            >
              {t('hero.badge')}
            </span>

            <h1
              style={{
                fontSize: 'clamp(24px, 4vw, 40px)',
                fontWeight: 800,
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--navy)',
                marginBottom: 'var(--space-md)',
              }}
            >
              {locT('h1Prefix')}{' '}
              <span style={{ color: 'var(--orange)' }}>{cityName}</span>
              {' — '}
              {t('hero.h1Highlight')}
            </h1>

            <p
              style={{
                fontSize: '16px',
                lineHeight: 'var(--leading-relaxed)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              {t('hero.subheadline')}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn"
              >
                <WhatsAppIcon size={18} />
                {t('hero.ctaPrimary')}
              </a>
              <button className="ghost-btn" onClick={scrollToProducts}>
                {t('hero.ctaSecondary')}
              </button>
            </div>

            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {t('hero.trustBadge')}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          4. STATS BAR
          ============================================ */}
      <section style={{ background: 'var(--gradient-navy)', padding: 'var(--space-lg) 0' }}>
        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-md)',
            textAlign: 'center',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 800, color: 'var(--orange)', lineHeight: 'var(--leading-tight)' }}>
                {t(`stats.items.${i}.value`)}
              </div>
              <div style={{ fontSize: 'clamp(11px, 1.5vw, 14px)', color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginTop: '4px' }}>
                {t(`stats.items.${i}.label`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          5. PRODUCTS
          ============================================ */}
      <section id="products" ref={productsRef} className="section-spacing" style={{ background: 'var(--surface)' }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-sm)' }}>
              {t('products.heading')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
              {t('products.subheading')}
            </p>
          </div>

          <div className="snap-scroll-x hide-scrollbar">
            {productKeys.map((key, i) => (
              <div
                key={key}
                className="fade-up"
                style={{
                  width: '300px',
                  minWidth: '280px',
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '100%', height: '200px', backgroundImage: `url(${productImages[i]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: 'var(--space-lg)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-sm)' }}>
                    {t(`products.items.${key}.name`)}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-md)' }}>
                    {t(`products.items.${key}.description`)}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '16px' }}>
                      {t(`products.items.${key}.price`)}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--orange)', fontWeight: 600, background: 'var(--orange-pale)', padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>
                      {t(`products.items.${key}.rental`)}
                    </span>
                  </div>
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="brand-btn" style={{ width: '100%', textAlign: 'center', fontSize: '14px', padding: '10px 20px' }}>
                    {t('products.cta')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          6. HOW IT WORKS
          ============================================ */}
      <section id="how-it-works" className="section-spacing">
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-sm)' }}>
              {t('howItWorks.heading')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
              {t('howItWorks.subheading')}
            </p>
          </div>

          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '0', position: 'relative', maxWidth: '800px', margin: '0 auto', flexWrap: 'wrap' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: '1 1 200px', position: 'relative', padding: '0 var(--space-md)' }}>
                {i < 2 && (
                  <div style={{ position: 'absolute', top: '28px', left: 'calc(50% + 28px)', width: 'calc(100% - 56px)', height: '2px', background: 'var(--orange)', opacity: 0.3 }} />
                )}
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', fontWeight: 800, fontSize: '22px', marginBottom: 'var(--space-md)', boxShadow: '0 4px 14px rgba(244, 123, 32, 0.3)', position: 'relative', zIndex: 1 }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-sm)' }}>
                  {t(`howItWorks.steps.${i}.title`)}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)', maxWidth: '220px' }}>
                  {t(`howItWorks.steps.${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          7. RISK / PROBLEM
          ============================================ */}
      <section className="section-spacing" style={{ background: 'var(--surface)' }}>
        <div className="section-container">
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-sm)' }}>
                {t('risk.heading')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                {t('risk.subheading')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', background: 'var(--white)', padding: 'var(--space-md) var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                      <span style={{ display: 'block', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                      <span style={{ fontSize: '15px', color: 'var(--navy)', fontWeight: 500 }}>
                        {t(`risk.points.${i}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-md)', borderLeft: '4px solid var(--orange)' }}>
                <p style={{ fontSize: '17px', lineHeight: 'var(--leading-relaxed)', color: 'var(--navy)', fontWeight: 500, marginBottom: 'var(--space-lg)' }}>
                  {t('risk.solution')}
                </p>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
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
      <section style={{ background: 'var(--gradient-navy)', padding: 'var(--space-3xl) 0' }}>
        <div className="section-container fade-up" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: 'var(--white)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-md)' }}>
            {t('midCta.heading')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            {t('midCta.subheading')}
          </p>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn" style={{ fontSize: '18px', padding: '16px 36px' }}>
            <WhatsAppIcon size={20} />
            {t('midCta.cta')}
          </a>
        </div>
      </section>

      {/* ============================================
          9. GOOGLE REVIEWS
          ============================================ */}
      <section id="reviews" className="section-spacing">
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
              <svg width="74" height="24" viewBox="0 0 74 24" fill="none">
                <path d="M9.24 8.19v2.46h5.88a5.03 5.03 0 01-2.2 3.28l3.56 2.77c2.07-1.92 3.27-4.74 3.27-8.09 0-.78-.07-1.53-.2-2.25H9.24z" fill="#4285F4"/>
                <path d="M3.18 14.09l-.82.63-2.18 1.7C2.99 20.53 6.7 23 10.24 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53h-.9z" fill="#34A853"/>
                <path d="M.18 7.07A11.8 11.8 0 000 12c0 1.78.43 3.45 1.18 4.93l2.82-2.18.82-.63a7.07 7.07 0 010-4.24L.18 7.07z" fill="#FBBC05"/>
                <path d="M10.24 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.8 10.8 0 0010.24.38C6.7.38 2.99 2.84 1.18 7.07L5.08 9.9c.87-2.6 3.3-4.53 6.16-4.53v-.62z" fill="#EA4335"/>
                <text x="26" y="17" fill="#5F6368" fontFamily="sans-serif" fontWeight="500" fontSize="16">Google</text>
              </svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-sm)' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--navy)' }}>
                {t('reviews.rating')}
              </span>
              <Stars count={5} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              {t('reviews.subheading')}
            </p>
          </div>

          <div className="stagger-grid" style={{ display: 'grid', gap: 'var(--space-lg)' }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-lg)',
                  boxShadow: 'var(--shadow-card)',
                  borderLeft: '3px solid var(--navy)',
                  transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <GoogleIcon size={20} />
                  <Stars count={5} />
                </div>
                <p style={{ fontSize: '14px', lineHeight: 'var(--leading-relaxed)', color: 'var(--text)', marginBottom: 'var(--space-md)' }}>
                  &ldquo;{t(`reviews.items.${i}.text`)}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--navy)' }}>
                    {t(`reviews.items.${i}.name`)}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {t(`reviews.items.${i}.location`)}
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
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: 'var(--tracking-tight)' }}>
              {t('whyChoose.heading')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
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
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-md)', boxShadow: '0 4px 12px rgba(244, 123, 32, 0.25)' }}>
                  {whyChooseIcons[i]}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-sm)' }}>
                  {t(`whyChoose.items.${i}.title`)}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                  {t(`whyChoose.items.${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          11. GALLERY
          ============================================ */}
      <section className="section-spacing">
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-sm)' }}>
              {t('gallery.heading')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
              {t('gallery.subheading')}
            </p>
          </div>

          <div className="bento-grid fade-up">
            {galleryImages.map((src, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  minHeight: i === 0 ? '300px' : '200px',
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(27,45,91,0) 0%, rgba(27,45,91,0) 100%)',
                    transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(27,45,91,0.4) 0%, rgba(27,45,91,0.2) 100%)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(27,45,91,0) 0%, rgba(27,45,91,0) 100%)'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          12. LOCATIONS ACCORDION
          ============================================ */}
      <section id="locations" className="section-spacing" style={{ background: 'var(--surface)' }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-sm)' }}>
              {t('locations.heading')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
              {t('locations.subheading')}
            </p>
          </div>

          <div className="fade-up" style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {regionOrder.map((region) => {
              const isOpen = openRegion === region;
              const regionLocs = locationsByRegion[region] || [];
              if (regionLocs.length === 0) return null;

              return (
                <div
                  key={region}
                  style={{
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                    borderLeft: isOpen ? '4px solid var(--orange)' : '4px solid transparent',
                    transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <button
                    onClick={() => setOpenRegion(isOpen ? null : region)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-md) var(--space-lg)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      textAlign: 'left',
                    }}
                  >
                    <span>{region} ({regionLocs.length})</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div
                    className={`accordion-content${isOpen ? ' open' : ''}`}
                    style={{ maxHeight: isOpen ? `${regionLocs.length * 44 + 24}px` : '0' }}
                  >
                    <div style={{ padding: '0 var(--space-lg) var(--space-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                      {regionLocs.map((loc) => (
                        <a
                          key={loc.slug}
                          href={`/${locale}/electric-wheelchair/${loc.slug}`}
                          style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            fontSize: '13px',
                            fontWeight: loc.slug === locationSlug ? 700 : 500,
                            color: loc.slug === locationSlug ? 'var(--orange)' : 'var(--navy-light)',
                            background: loc.slug === locationSlug ? 'var(--orange-pale)' : 'var(--surface)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--orange-pale)';
                            e.currentTarget.style.color = 'var(--orange)';
                          }}
                          onMouseLeave={(e) => {
                            if (loc.slug !== locationSlug) {
                              e.currentTarget.style.background = 'var(--surface)';
                              e.currentTarget.style.color = 'var(--navy-light)';
                            }
                          }}
                        >
                          {loc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          12b. NEARBY LOCATIONS
          ============================================ */}
      {nearbyLocations.length > 0 && (
        <section className="section-spacing">
          <div className="section-container">
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-sm)' }}>
                {locT('nearbyTitle')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                {locT('nearbySubtitle')}
              </p>
            </div>

            <div
              className="fade-up"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 'var(--space-md)',
              }}
            >
              {nearbyLocations.map((nearby) => (
                <a
                  key={nearby.slug}
                  href={`/${locale}/electric-wheelchair/${nearby.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-card)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.color = 'var(--orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.color = 'var(--navy)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {nearby.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          13. FAQ
          ============================================ */}
      <section id="faq" className="section-spacing" style={{ background: nearbyLocations.length > 0 ? 'var(--surface)' : undefined }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: 'var(--tracking-tight)' }}>
              {t('faq.heading')}
            </h2>
          </div>

          <div className="fade-up" style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
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
                    <span>{t(`faq.items.${i}.question`)}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div
                    className={`accordion-content${isOpen ? ' open' : ''}`}
                    style={{ maxHeight: isOpen ? '300px' : '0' }}
                  >
                    <div style={{ padding: '0 var(--space-lg) var(--space-lg)', fontSize: '14px', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-muted)' }}>
                      {t(`faq.items.${i}.answer`)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          14. FINAL CTA
          ============================================ */}
      <section style={{ background: 'var(--gradient-navy-dark)', padding: 'var(--space-4xl) 0' }}>
        <div className="section-container fade-up" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 800, color: 'var(--white)', letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-md)', lineHeight: 'var(--leading-tight)' }}>
            {t('finalCta.heading')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', marginBottom: 'var(--space-xl)', maxWidth: '540px', margin: '0 auto var(--space-xl)', lineHeight: 'var(--leading-relaxed)' }}>
            {t('finalCta.subheading')}
          </p>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn" style={{ fontSize: '18px', padding: '18px 40px', marginBottom: 'var(--space-lg)' }}>
            <WhatsAppIcon size={22} />
            {t('finalCta.cta')}
          </a>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginTop: 'var(--space-lg)' }}>
            {t('finalCta.phone')}
          </p>
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
              <div
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
              </div>
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
              <div
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
              </div>
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
    </>
  );
}
