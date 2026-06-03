'use client';

import { useTranslations } from 'next-intl';
import FomoBar from '@/components/FomoBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HomeSections from '@/components/HomeSections';
import { waRedirect } from '@/lib/waRedirect';
import type { ProductCardData } from '@/components/ProductCard';

interface Props {
  locale: string;
  products: ProductCardData[];
  /** When true, skip internal FomoBar/Navbar/Footer — the server page renders
   *  the canonical SiteHeader/SiteFooter/FomoBanner instead. */
  chromeProvided?: boolean;
}

export default function HomePageClient({ locale, products, chromeProvided = false }: Props) {
  const heroT = useTranslations('hero');
  const waHref = waRedirect(locale);

  return (
    <>
      {!chromeProvided && <FomoBar />}

      {/* HEADER + HERO share the same gradient background so the floating pill nav blends with the hero */}
      <div
        style={{
          position: 'relative',
          background:
            'radial-gradient(ellipse 70% 60% at 85% 10%, rgba(36,144,216,0.16) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(220,238,248,0.85) 0%, transparent 60%), linear-gradient(180deg, #f4f9fd 0%, #dceef8 100%)',
        }}
      >
        {!chromeProvided && <Navbar />}

        {/* SECTION 3 — HERO */}
        <section
          style={{
            padding: '64px 16px 72px',
            background: 'transparent',
          }}
        >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'grid',
            gap: 32,
            alignItems: 'center',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          {/* Left — copy */}
          <div className="kh-hero-copy">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 9999,
                background: '#FDECEC',
                color: '#c01e1e',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  background: '#e63030',
                  borderRadius: '50%',
                }}
              />
              Sewa · Jual · Hantar 24 Jam
            </div>

            <h1
              style={{
                fontSize: 'clamp(30px, 5vw, 54px)',
                fontWeight: 800,
                color: '#1c3a6a',
                letterSpacing: -0.8,
                lineHeight: 1.1,
                margin: '0 0 16px',
              }}
            >
              {heroT('h1')}
            </h1>
            <h2
              style={{
                fontSize: 'clamp(16px, 1.6vw, 20px)',
                fontWeight: 500,
                color: '#334155',
                lineHeight: 1.55,
                margin: '0 0 24px',
              }}
            >
              {heroT('h2')}
            </h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 16,
              }}
              className="kh-hero-cta-row"
            >
              <WhatsAppButton href={waHref} label={heroT('ctaPrimary')} variant="pill" />
              <a
                href="#products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '11px 22px',
                  border: '2px solid #1c3a6a',
                  color: '#1c3a6a',
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 9999,
                  textDecoration: 'none',
                  background: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {heroT('ctaSecondary')}
              </a>
            </div>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(28,58,106,0.65)',
                lineHeight: 1.55,
                margin: 0,
                maxWidth: 460,
              }}
            >
              {heroT('trustMicro')}
            </p>
          </div>

          {/* Right — bed photo floats freely (transparent PNG, no frame) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
            className="kh-hero-disc-wrap"
          >
            <img
              src="/brand/hero/hero-bed.jpg"
              alt="Katil hospital elektrik berkualiti tinggi"
              style={{
                width: 'min(520px, 100%)',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 30px 40px rgba(15,31,80,0.18)) drop-shadow(0 12px 16px rgba(15,31,80,0.10))',
              }}
            />
            {/* Floating 24-jam badge */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '6%',
                right: '4%',
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 28px rgba(28,58,106,0.22), 0 4px 10px rgba(15,31,80,0.14)',
                transform: 'rotate(8deg)',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#e63030" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
              </svg>
              <span
                style={{
                  marginTop: 3,
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#e63030',
                  letterSpacing: 0.5,
                }}
              >
                24 JAM
              </span>
            </div>

            {/* Stamp — Tilam Percuma (bottom-left, clean pill) */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '12%',
                left: '4%',
                padding: '8px 14px',
                background: '#FFFFFF',
                color: '#1c3a6a',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 0.2,
                borderRadius: 9999,
                boxShadow: '0 8px 20px rgba(28,58,106,0.18), 0 2px 6px rgba(15,31,80,0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
              Tilam Percuma
            </div>
          </div>
        </div>

        <style jsx>{`
          .kh-hero-copy {
            text-align: center;
          }
          @media (min-width: 900px) {
            .kh-hero-copy {
              text-align: left;
            }
          }
          .kh-hero-cta-row {
            justify-content: center;
          }
          @media (min-width: 900px) {
            .kh-hero-cta-row {
              justify-content: flex-start;
            }
          }
        `}</style>
        </section>
      </div>

      <HomeSections locale={locale} products={products} />

      {!chromeProvided && <Footer />}

      {/* Floating WhatsApp FAB */}
      <WhatsAppButton href={waHref} label="WhatsApp" variant="floating" ariaLabel="WhatsApp" />
    </>
  );
}
