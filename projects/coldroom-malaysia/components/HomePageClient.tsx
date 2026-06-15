'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';
import { siteConfig } from '@/config/site';
import { trackWhatsApp } from '@/lib/track';
import { useImpression } from '@/lib/useImpression';
import { STATES, locations, type Location } from '@/config/locations';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rental_price: number | null;
  product_photos: { url: string }[];
}

interface LocationContext {
  cityName: string;
  cityNameZh?: string;
  cityNameMs?: string;
  locationSlug: string;
  stateName: string;
  nearbyLocations: Location[];
}

interface Props {
  products: Product[];
  location?: LocationContext;
}

/* ============== ICONS (Inline SVG, transform/opacity-only animation) ============== */
/** Official WhatsApp icon — bubble + phone handset (canonical simple-icons glyph) */
function WaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.463 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm5.421-7.403c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      />
    </svg>
  );
}
function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FBBC04" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#4285F4" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBC04" aria-hidden>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
function CheckIcon({ color = '#2F8F4E' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
  );
}

/* ============== Hero & Section Imagery (brand asset + reference Wix CDN) ============== */
const HERO_BG = '/brand/hero.png';
const RISK_BG = 'https://static.wixstatic.com/media/d3104b_165b800a24ab4e94b27815b3dbb5b3a7~mv2.jpg';
const MIDCTA_BG = 'https://static.wixstatic.com/media/d3104b_2a6d8a5afa5b4ec09ef24c9b8c130d17~mv2.jpg';
const FINALCTA_BG = 'https://static.wixstatic.com/media/d3104b_390cb593d3624032ae4da7fe4603f080~mv2.jpg';

// 12 verified cold-room photos (each visually inspected — refrigerated warehouse, cold-room
// doors, evaporator units, insulated panels, frozen storage racking). Marketing-banner
// image previously included was removed.
const GALLERY_IMAGES = [
  'https://static.wixstatic.com/media/d3104b_165b800a24ab4e94b27815b3dbb5b3a7~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_07e54eaffc154eeea47fbd4e1f5c3e16~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_043aecb4f7644ddd8543c798c0396d28~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_3473e766890746e5be19fd9c22839039~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_6b334a062142416b974ca0fa845ae7ce~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_d6e6c20f46ab49469d65c446d05e2c59~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_0fb1a1baecfb4fcd957ff23c8b6ebb21~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_e512168f033f46aba74c2d90ba1f0c37~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_e67141e4bd09424aaeff1086b51775cb~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_f9da114d9d08442c8f10c02dac68b573~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_b7233cf3a1b746d69554a326384aed4d~mv2.jpg',
  'https://static.wixstatic.com/media/d3104b_5c372c1c51b4438d90c64ec710ebaa4c~mv2.jpeg',
];

// Wix media URLs point at the FULL-RES originals (multi-MB each). Request a sized,
// compressed variant via Wix's on-the-fly transform so tiles load fast on mobile
// instead of downloading 5-8 MB per cell. e.g. 7.7 MB -> ~120 KB at w_640.
function wixFill(url: string, w: number, h: number, q = 80): string {
  const i = url.indexOf('/media/');
  if (i === -1) return url; // not a wix media url — leave untouched
  const file = url.slice(i + '/media/'.length);
  return `${url}/v1/fill/w_${w},h_${h},al_c,q_${q},enc_auto/${file}`;
}

type Tone = 'frost-deep' | 'frost-mid' | 'frost-cool' | 'frost-pale';
const TEMP_TIERS: { slug: string; chip: string; tone: Tone }[] = [
  { slug: 'frozen-storage-minus-18',     chip: '-18°C',  tone: 'frost-deep' },
  { slug: 'freezer-minus-5-to-minus-10', chip: '-10°C',  tone: 'frost-mid' },
  { slug: 'chiller-2-to-4',              chip: '+4°C',   tone: 'frost-cool' },
  { slug: 'cool-storage-7-to-10',        chip: '+10°C',  tone: 'frost-pale' },
];

/* Tier helpers removed — single-service layout no longer needs per-tier gradients */

const REVIEW_TIER_TAGS = ['-18°C Frozen', '+4°C Chiller', '-10°C Freezer', '+10°C Cool Storage', '+4°C Chiller', '-18°C Frozen'];

/* ============== Hooks ============== */
function useScrollFade() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}


/* ============== Reusable bits ============== */
/**
 * Canonical brand mark — used by nav, footer, blog nav, and favicon.
 * MUST stay identical to `app/icon.svg` (CLAUDE.md logo rule).
 */
function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="7" fill="#0B3D5C" />
      <rect x="2" y="2" width="28" height="28" rx="6" fill="none" stroke="#4FB1D6" strokeWidth="0.6" strokeOpacity="0.55" />
      <g strokeLinecap="round" fill="none" stroke="#FFFFFF">
        <line x1="16" y1="6.5" x2="16" y2="25.5" strokeWidth="2.2" />
        <line x1="7.5" y1="11" x2="24.5" y2="21" strokeWidth="2.2" />
        <line x1="7.5" y1="21" x2="24.5" y2="11" strokeWidth="2.2" />
        <path d="M13 9 L16 12 L19 9 M13 23 L16 20 L19 23" strokeWidth="1.8" />
        <path d="M9.5 12.5 L12 13.5 L13 11 M22.5 19.5 L20 18.5 L19 21" strokeWidth="1.6" />
        <path d="M9.5 19.5 L12 18.5 L13 21 M22.5 12.5 L20 13.5 L19 11" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

function SnowflakeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="16" y1="4" x2="16" y2="28" />
      <line x1="6" y1="10" x2="26" y2="22" />
      <line x1="6" y1="22" x2="26" y2="10" />
      <path d="M12 7 L16 11 L20 7 M12 25 L16 21 L20 25" strokeWidth="1.5" />
      <path d="M9 13 L12.5 14 L13 10.5 M23 19 L19.5 18 L19 21.5" strokeWidth="1.4" />
      <path d="M9 19 L12.5 18 L13 21.5 M23 13 L19.5 14 L19 10.5" strokeWidth="1.4" />
    </svg>
  );
}

function ServiceCard({ product, locale, waHref }: { product: Product; locale: string; waHref: string }) {
  const ref = useImpression(product.slug);
  const t = useTranslations('products');
  return (
    <article
      ref={ref as React.Ref<HTMLElement>}
      id={product.slug}
      className="card service-split-grid"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', overflow: 'hidden', border: 0, maxWidth: 1080, margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}
    >
      {/* Visual side */}
      <div
        style={{
          background: 'var(--grad-frost)',
          color: '#fff',
          padding: '36px 28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 18,
          minHeight: 380,
        }}
      >
        <div aria-hidden style={{ position: 'absolute', right: -20, top: -20, opacity: 0.12 }}>
          <SnowflakeIcon size={180} />
        </div>
        <div style={{ position: 'relative' }}>
          <span className="eyebrow" style={{ color: 'var(--cold-amber-glow)' }}>{t('eyebrow')}</span>
          <h4 style={{ color: '#fff', marginTop: 12, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{product.name}</h4>
          <h5 className="body-text" style={{ marginTop: 12, color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.55 }}>{product.description}</h5>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: '-0.02em' }}>
              {t('priceFrom', { price: product.rental_price ?? 5 })}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {t('perPalletDay')}
            </span>
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp(siteConfig.fallbackPhone)}
            className="btn btn-wa"
            style={{ marginTop: 16 }}
          >
            <WaIcon size={16} /> {t('cta')}
          </a>
        </div>
      </div>

      {/* Temperature options side */}
      <div style={{ background: '#fff', padding: '28px 28px 30px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--steel-500)', marginBottom: 18 }}>
          {t('tempOptionsLabel')}
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TEMP_TIERS.map((tier) => (
            <li key={tier.slug} style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 14, alignItems: 'center' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  height: 38,
                  borderRadius: 8,
                  background: 'var(--frost-pale)',
                  color: 'var(--frost-deep)',
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: '-0.01em',
                  border: '1px solid rgba(31,123,170,0.18)',
                }}
              >
                {tier.chip}
              </span>
              <span style={{ fontSize: 13.5, color: 'var(--steel-500)', lineHeight: 1.5 }}>
                {t(`tempItems.${tier.slug}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ============== Main Component ============== */
export default function HomePageClient({ products, location }: Props) {
  useScrollFade();
  const locale = useLocale();
  const t = useTranslations();
  const waHref = waRedirect(locale, undefined, location?.locationSlug);

  const [openFaq, setOpenFaq] = useState<number>(0);

  const isLocationPage = !!location;

  const stateGroups = STATES.map((s) => ({
    state: s,
    items: locations.filter((l) => l.stateSlug === s.slug),
  }));

  /* ============== RENDER ============== */
  return (
    <>
      {/* Chrome (FomoBanner + SiteHeader) and the hero (H1/H2/role=img/CTAs)
          are rendered by the route server component — app/[locale]/page.tsx for
          the homepage and the location page — so the checklist sees them in the
          route file. This client component renders everything below the hero. */}

      {/* 4. USP BAR */}
      <section className="surface-paper-cool" style={{ padding: '36px 0' }}>
        <div className="section-container usp-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {(['delivery', 'halal', 'whatsapp'] as const).map((k) => (
            <div key={k} className="usp-cell fade-up" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--grad-cold)', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: 'var(--shadow-amber)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', color: 'var(--cold-amber)', fontWeight: 800, fontSize: 18 }}>
                  {k === 'delivery' ? '⚡' : k === 'halal' ? '✓' : '💬'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--steel-900)' }}>{t(`usp.${k}.title`)}</div>
                <div style={{ fontSize: 13, color: 'var(--steel-500)' }}>{t(`usp.${k}.subtitle`)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STATS — compact strip */}
      <section className="surface-steel-dark" style={{ padding: '32px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="section-container" style={{ position: 'relative' }}>
          <div className="stats-strip" style={{ display: 'grid', gridTemplateColumns: 'auto repeat(4, 1fr)', gap: 24, alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--frost-pale)', letterSpacing: '0.08em', textTransform: 'uppercase', borderRight: '1px solid rgba(255,255,255,0.18)', paddingRight: 24 }}>
              {t('stats.heading')}
            </div>
            {(['tonnes', 'customers', 'states', 'response'] as const).map((k) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                  {t(`stats.${k}.value`)}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(219,229,239,0.8)', fontWeight: 500, letterSpacing: '0.02em' }}>
                  {t(`stats.${k}.label`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRODUCTS — single service with temperature options */}
      <section id="products" style={{ padding: '76px 0', background: 'var(--frost-white)' }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="eyebrow">{t('products.eyebrow')}</span>
            <h3 style={{ marginTop: 6 }}>{t('products.heading')}</h3>
            <h5 className="body-text" style={{ maxWidth: 600, margin: '10px auto 0', color: 'var(--steel-500)' }}>{t('products.subheading')}</h5>
          </div>
          <div className="fade-up">
            {products.map((product) => (
              <ServiceCard key={product.id} product={product} locale={locale} waHref={waHref} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS — 3 steps */}
      <section id="how-it-works" className="surface-paper-warm" style={{ padding: '80px 0' }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 44 }}>
            <span className="eyebrow">{t('howItWorks.eyebrow')}</span>
            <h3 style={{ fontSize: 'var(--text-h3)', marginTop: 8 }}>{t('howItWorks.heading')}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }} className="steps-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="fade-up" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid var(--steel-100)', boxShadow: 'var(--shadow-md)' }}>
                <span
                  aria-hidden
                  style={{
                    display: 'block',
                    fontSize: 72,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    color: 'transparent',
                    WebkitTextStroke: '1.5px var(--cold-amber)',
                    marginBottom: 14,
                  }}
                >
                  0{n}
                </span>
                <h4 style={{ fontSize: 18 }}>{t(`howItWorks.steps.${n - 1}.title`)}</h4>
                <h6 className="body-text" style={{ marginTop: 8, fontSize: 14, color: 'var(--steel-500)' }}>{t(`howItWorks.steps.${n - 1}.body`)}</h6>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. RISK + INLINE CTA — solid dark blue */}
      <section style={{ position: 'relative', padding: '76px 0 84px', overflow: 'hidden', background: 'linear-gradient(180deg, #0B3D5C 0%, #0E4870 100%)' }}>
        {/* faint snowflake watermark */}
        <div aria-hidden style={{ position: 'absolute', top: 32, right: 40, color: 'rgba(255,255,255,0.06)' }}>
          <SnowflakeIcon size={140} />
        </div>
        <div aria-hidden style={{ position: 'absolute', bottom: 40, left: 60, color: 'rgba(255,255,255,0.04)' }}>
          <SnowflakeIcon size={90} />
        </div>

        <div className="section-container" style={{ position: 'relative', color: '#fff', maxWidth: 920 }}>
          {/* Heading + body */}
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="eyebrow" style={{ color: 'var(--cold-amber-glow)' }}>{t('risk.eyebrow')}</span>
            <h3 style={{ marginTop: 8, color: '#fff' }}>{t('risk.heading')}</h3>
            <h5 className="body-text" style={{ marginTop: 14, color: 'rgba(255,255,255,0.85)', maxWidth: 680, margin: '14px auto 0' }}>{t('risk.body')}</h5>
          </div>

          {/* 2x2 bullet grid */}
          <ul className="risk-bullets fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
            {[0, 1, 2, 3].map((i) => (
              <li
                key={i}
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                }}
              >
                <span style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: 7,
                  background: 'rgba(240,138,28,0.18)', color: 'var(--cold-amber-glow)',
                  display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14,
                }}>!</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13.5, lineHeight: 1.55 }}>
                  {t(`risk.bullets.${i}`)}
                </span>
              </li>
            ))}
          </ul>

          {/* Compare + CTA — single horizontal strip */}
          <div
            className="fade-up risk-cta"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: 0,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              alignItems: 'stretch',
            }}
          >
            <div style={{ padding: '18px 22px', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                {t('risk.compare.withoutLabel')}
              </div>
              <div style={{ marginTop: 4, fontSize: 22, fontWeight: 800, color: 'var(--danger)', letterSpacing: '-0.02em' }}>RM12,400</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)' }}>{t('risk.compare.spoiled')}</div>
            </div>
            <div style={{ padding: '18px 22px', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cold-amber-glow)' }}>
                {t('risk.compare.withLabel')}
              </div>
              <div style={{ marginTop: 4, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>RM5</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)' }}>{t('risk.compare.saved')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 22px' }}>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp(siteConfig.fallbackPhone)}
                className="btn btn-wa"
                style={{ height: 44, fontSize: 13, padding: '0 22px', width: 'auto' }}
              >
                <WaIcon size={16} /> {t('midCta.cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. GOOGLE REVIEWS */}
      <section id="reviews" style={{ padding: '80px 0', background: 'var(--frost-white)' }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <GoogleG />
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--steel-900)' }}>{t('reviews.eyebrow')}</span>
              <div style={{ display: 'flex', gap: 2 }}>{Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}</div>
              <span style={{ fontWeight: 700, color: 'var(--steel-900)' }}>4.9</span>
            </div>
            <h3 style={{ fontSize: 'var(--text-h3)', marginTop: 12 }}>{t('reviews.heading')}</h3>
          </div>
          <div className="reviews-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <article key={i} className="card fade-up" style={{ padding: 22, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--grad-frost)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
                      {t(`reviews.items.${i}.initials`)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t(`reviews.items.${i}.name`)}</div>
                      <div style={{ fontSize: 11, color: 'var(--steel-300)' }}>{t(`reviews.items.${i}.role`)}</div>
                    </div>
                  </div>
                  <GoogleG size={16} />
                </div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>{Array.from({ length: 5 }).map((_, j) => <StarIcon key={j} />)}</div>
                <h5 className="body-text" style={{ fontSize: 13, color: 'var(--steel-500)', lineHeight: 1.6 }}>"{t(`reviews.items.${i}.body`)}"</h5>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="temp-chip frost-pale" style={{ fontSize: 11, padding: '4px 10px' }}>{REVIEW_TIER_TAGS[i]}</span>
                  <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckIcon /> Verified</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. WHY CHOOSE — bento dark */}
      <section className="surface-steel-dark" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(43,169,181,0.12), transparent 40%), radial-gradient(circle at 20% 80%, rgba(240,138,28,0.10), transparent 40%)' }} />
        <div className="section-container" style={{ position: 'relative' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="eyebrow" style={{ color: 'var(--cold-amber-glow)' }}>{t('whyChoose.eyebrow')}</span>
            <h3 style={{ fontSize: 'var(--text-h3)', marginTop: 8, color: '#fff' }}>{t('whyChoose.heading')}</h3>
          </div>
          <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 'minmax(180px, auto)', gap: 16 }}>
            <div className="fade-up" style={{ gridColumn: 'span 2', gridRow: 'span 2', background: 'var(--steel-700)', border: '1px solid rgba(43,169,181,0.3)', borderRadius: 'var(--radius-xl)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="temp-chip frost-mid">{t('whyChoose.featured.badge')}</span>
                <h4 style={{ color: '#fff', marginTop: 14, fontSize: 26 }}>{t('whyChoose.featured.title')}</h4>
                <h5 className="body-text" style={{ color: 'rgba(255,255,255,0.78)', marginTop: 12, fontSize: 15 }}>{t('whyChoose.featured.body')}</h5>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <span className="temp-chip frost-pale" style={{ fontSize: 11 }}>JAKIM</span>
                <span className="temp-chip frost-pale" style={{ fontSize: 11 }}>ISO 22000</span>
              </div>
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="fade-up" style={{ background: 'var(--steel-700)', border: '1px solid rgba(43,169,181,0.18)', borderRadius: 'var(--radius-xl)', padding: 22 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--grad-cold)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>{['⚡', '💬', '🚚', '🧊'][i]}</div>
                <h4 style={{ color: '#fff', marginTop: 14, fontSize: 16 }}>{t(`whyChoose.tiles.${i}.title`)}</h4>
                <h6 className="body-text" style={{ color: 'rgba(255,255,255,0.72)', marginTop: 6, fontSize: 13 }}>{t(`whyChoose.tiles.${i}.body`)}</h6>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. GALLERY */}
      <section style={{ padding: '80px 0', background: 'var(--frost-white)' }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="eyebrow">{t('gallery.eyebrow')}</span>
            <h3 style={{ fontSize: 'var(--text-h3)', marginTop: 8 }}>{t('gallery.heading')}</h3>
            <h5 className="body-text" style={{ maxWidth: 600, margin: '12px auto 0', color: 'var(--steel-500)' }}>{t('gallery.subheading')}</h5>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((src, idx) => (
              <div key={idx} className={`gallery-tile ${idx % 2 === 0 ? 'tint-frost' : 'tint-amber'} fade-up`}>
                {/* Sized Wix variant (not the multi-MB original); bypass next/image optimizer */}
                <img src={wixFill(src, 640, 480)} width={640} height={480} alt={`Cold room project ${idx + 1} — Malaysia HALAL cold storage`} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. LOCATIONS ACCORDION */}
      <section id="locations" className="surface-paper-cool" style={{ padding: '80px 0' }}>
        <div className="section-container">
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="eyebrow">{t('locationsSection.eyebrow')}</span>
            <h3 style={{ fontSize: 'var(--text-h3)', marginTop: 8 }}>{t('locationsSection.heading')}</h3>
            <h5 className="body-text" style={{ maxWidth: 600, margin: '12px auto 0', color: 'var(--steel-500)' }}>{t('locationsSection.subheading')}</h5>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="states-grid">
            {stateGroups.map(({ state, items }) => (
              <details key={state.slug} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', cursor: 'pointer', listStyle: 'none' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cold-amber)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>
                      {locale === 'zh' ? state.name_zh : locale === 'ms' ? state.name_ms : state.name}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--steel-300)' }}>· {items.length} {t('locationsSection.cities')}</span>
                  </span>
                  <span style={{ color: 'var(--cold-amber)', fontWeight: 700 }}>+</span>
                </summary>
                <div style={{ padding: '6px 22px 22px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {items.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${locale}/${siteConfig.productSlug}/${c.slug}`}
                      style={{ background: 'var(--frost-pale)', color: 'var(--frost-deep)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 500 }}
                    >
                      {locale === 'zh' ? c.name_zh : locale === 'ms' ? (c.name_ms ?? c.name) : c.name}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby locations (location pages only) */}
      {isLocationPage && location && location.nearbyLocations.length > 0 && (
        <section style={{ padding: '60px 0', background: 'var(--frost-white)' }}>
          <div className="section-container">
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 'var(--text-h3)' }}>{t('nearby.heading', { city: location.cityName })}</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {location.nearbyLocations.map((n) => (
                <Link key={n.slug} href={`/${locale}/${siteConfig.productSlug}/${n.slug}`} className="card" style={{ padding: '12px 18px', fontSize: 14, fontWeight: 600, color: 'var(--steel-900)' }}>
                  {locale === 'zh' ? n.name_zh : locale === 'ms' ? (n.name_ms ?? n.name) : n.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 14. FAQ */}
      <section id="faq" style={{ padding: '80px 0', background: 'var(--frost-white)' }}>
        <div className="section-container" style={{ maxWidth: 820 }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="eyebrow">{t('faq.eyebrow')}</span>
            <h3 style={{ fontSize: 'var(--text-h3)', marginTop: 8 }}>{t('faq.heading')}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="card fade-up" style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                  style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--steel-900)' }}>{t(`faq.items.${i}.q`)}</span>
                  <span style={{ fontSize: 22, color: 'var(--cold-amber)', fontWeight: 700, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }}>+</span>
                </button>
                <div className="accordion-content" data-open={openFaq === i ? 'true' : 'false'}>
                  <h5 className="body-text" style={{ padding: '0 22px 18px', fontSize: 14, color: 'var(--steel-500)', lineHeight: 1.7 }}>{t(`faq.items.${i}.a`)}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FINAL CTA */}
      <section style={{ position: 'relative', padding: '90px 0', overflow: 'hidden' }}>
        <div role="img" aria-label={t('finalCta.bgAlt')} style={{ position: 'absolute', inset: 0, background: `url(${FINALCTA_BG}) center/cover no-repeat` }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)' }} />
        <div className="section-container" style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
          <div className="fade-up">
            <span className="eyebrow" style={{ color: 'var(--cold-amber-glow)' }}>{t('finalCta.eyebrow')}</span>
            <h3 style={{ color: '#fff', fontSize: 'var(--text-h3)', marginTop: 10 }}>{t('finalCta.heading')}</h3>
            <h5 className="body-text" style={{ color: 'rgba(255,255,255,0.88)', marginTop: 12, maxWidth: 580, margin: '12px auto 0' }}>{t('finalCta.body')}</h5>
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp(siteConfig.fallbackPhone)} className="btn btn-wa" style={{ marginTop: 24, height: 56, fontSize: 16 }}>
              <WaIcon size={20} /> {t('finalCta.cta')}
            </a>
            <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.7)', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span>⚡ {t('finalCta.trustTags.0')}</span>
              <span>✓ {t('finalCta.trustTags.1')}</span>
              <span>🚚 {t('finalCta.trustTags.2')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 16. FOOTER — rendered by parent server component (SiteFooter) */}

      {/* 17. STICKY WHATSAPP FAB */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsApp(siteConfig.fallbackPhone)}
        aria-label={t('stickyFab.ariaLabel')}
        className="wa-fab"
        style={{ position: 'fixed', bottom: 22, right: 22, width: 60, height: 60, borderRadius: '50%', background: 'var(--wa-green)', color: '#fff', display: 'grid', placeItems: 'center', zIndex: 60 }}
      >
        <WaIcon size={28} />
      </a>

      {/* Responsive helpers now live in <PageStyles /> (rendered by the route). */}
    </>
  );
}
