'use client';

import { useTranslations } from 'next-intl';
import FomoBar from '@/components/FomoBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HomeSections from '@/components/HomeSections';
import { waRedirect } from '@/lib/waRedirect';
import type { ProductCardData } from '@/components/ProductCard';
import type { Location } from '@/config/locations';

interface Props {
  locale: string;
  products: ProductCardData[];
  location: Location;
  h1: string;
  h2: string;
  intro: string;
  uniqueFaqs: { q: string; a: string }[];
  nearby: Location[];
  chromeProvided?: boolean;
}

export default function LocationPageClient({
  locale,
  products,
  location,
  h1,
  h2,
  intro,
  uniqueFaqs,
  nearby,
  chromeProvided = false,
}: Props) {
  const locT = useTranslations('location');
  const waHref = waRedirect(locale, undefined, location.slug);

  return (
    <>
      {!chromeProvided && <FomoBar />}
      {!chromeProvided && <Navbar />}

      {/* SECTION 1 — Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        style={{
          background: '#F0F4FA',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 16px',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            fontSize: 13,
            color: 'rgba(28,58,106,0.65)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a href={`/${locale}`} style={{ color: 'rgba(28,58,106,0.65)' }}>
            {locT('breadcrumb.home')}
          </a>
          <span aria-hidden="true">›</span>
          <a href={`/${locale}#products`} style={{ color: 'rgba(28,58,106,0.65)' }}>
            {locT('breadcrumb.product')}
          </a>
          <span aria-hidden="true">›</span>
          <span style={{ color: '#1c3a6a', fontWeight: 600 }}>{location.name}</span>
        </div>
      </nav>

      {/* SECTION 3 — HERO */}
      <section
        style={{
          padding: 'clamp(96px, 12vw, 132px) 16px 32px',
          background:
            'radial-gradient(circle at 70% 20%, rgba(143,184,224,0.25), transparent 60%), #FFFFFF',
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
              {location.name} · 24 Jam
            </div>
            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 800,
                color: '#1c3a6a',
                letterSpacing: -0.8,
                lineHeight: 1.1,
                margin: '0 0 16px',
              }}
            >
              {h1}
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
              {h2}
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
              <WhatsAppButton
                href={waHref}
                label="WhatsApp"
                variant="pill"
                locationSlug={location.slug}
              />
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
                {locale === 'en'
                  ? 'View Products'
                  : locale === 'zh'
                  ? '查看产品'
                  : 'Lihat Produk'}
              </a>
            </div>
          </div>

          {/* Right — circular bed disc */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'min(520px, 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/brand/hero/hero-bed.png"
                alt={`Katil hospital dihantar ke ${location.name}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 30px 40px rgba(15,31,80,0.18)) drop-shadow(0 12px 16px rgba(15,31,80,0.10))',
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '8%',
                  right: '6%',
                  width: 92,
                  height: 92,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 28px rgba(28,58,106,0.18), 0 4px 10px rgba(15,31,80,0.12)',
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

      <HomeSections
        locale={locale}
        products={products}
        location={{
          city: location.name,
          slug: location.slug,
          intro,
          uniqueFaqs,
        }}
      />

      {/* SECTION 13 — Nearby Locations */}
      {nearby.length > 0 && (
        <section
          style={{
            background: '#FFFFFF',
            padding: '64px 16px',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <div style={{ maxWidth: 1040, margin: '0 auto', textAlign: 'center' }}>
            <h3
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#1c3a6a',
                letterSpacing: -0.3,
                margin: '0 0 10px',
              }}
            >
              {locT('nearby.h3')}
            </h3>
            <p
              style={{
                fontSize: 15,
                color: 'rgba(28,58,106,0.65)',
                margin: '0 0 22px',
              }}
            >
              {locT('nearby.intro')}
            </p>
            <div
              style={{
                display: 'grid',
                gap: 10,
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              }}
            >
              {nearby.map((n) => (
                <a
                  key={n.slug}
                  href={`/${locale}/katil-hospital/${n.slug}`}
                  style={{
                    display: 'block',
                    padding: '14px 16px',
                    background: '#F0F4FA',
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    color: '#1c3a6a',
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  {locT('nearby.anchor', { city: n.name })}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {!chromeProvided && <Footer />}

      <WhatsAppButton
        href={waHref}
        label="WhatsApp"
        variant="floating"
        locationSlug={location.slug}
        ariaLabel="WhatsApp"
      />
    </>
  );
}
