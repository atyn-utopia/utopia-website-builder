'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Product, BlogPost } from '@/lib/webcore';
import { regionOrder, getLocationsByRegion } from '@/config/locations';
import { siteConfig } from '@/config/site';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import FomoBanner from '@/components/FomoBanner';

type Props = {
  locale: string;
  products: Product[];
  recentPosts: BlogPost[];
  waUrl: string;
};

// Construction-themed Pexels backgrounds for image sections
const RISK_BG =
  "url('https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1920')";
const MID_CTA_BG =
  "url('https://images.pexels.com/photos/8961343/pexels-photo-8961343.jpeg?auto=compress&cs=tinysrgb&w=1920')";
const FINAL_CTA_BG =
  "url('https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1920')";

// 15-cell gallery — 5×3 desktop / 3×5 mobile divides cleanly.
// Real customer-job photos sourced from skyliftmalaysia.my project showcase.
const GALLERY_IMAGES = [
  '/gallery/gallery-01.png',
  '/gallery/gallery-02.png',
  '/gallery/gallery-03.png',
  '/gallery/gallery-04.png',
  '/gallery/gallery-05.png',
  '/gallery/gallery-06.png',
  '/gallery/gallery-07.png',
  '/gallery/gallery-08.png',
  '/gallery/gallery-09.png',
  '/gallery/gallery-10.png',
  '/gallery/gallery-11.png',
  '/gallery/gallery-12.png',
  '/gallery/gallery-13.png',
  '/gallery/gallery-14.png',
  '/gallery/gallery-15.png',
];

// Mono spec rows shown beneath every product card — fallback when DB lacks specs.
const PRODUCT_SPECS: Record<string, string[]> = {
  '9m': ['REACH · 9M', 'POWER · ELECTRIC', 'ACCESS · INDOOR'],
  '20m': ['REACH · 20M', 'POWER · DIESEL', 'ROAD · TOWABLE'],
  '24m': ['REACH · 24M', 'POWER · DIESEL', 'OUTRIGGER · STABLE'],
  '32m': ['REACH · 32M', 'POWER · DIESEL', 'MOUNT · TRUCK'],
  spider: ['REACH · 18M', 'WIDTH · 90CM', 'TRACK · INDOOR'],
};

function specsFor(slug: string): string[] {
  const key = Object.keys(PRODUCT_SPECS).find((k) => slug.includes(k));
  return key ? PRODUCT_SPECS[key] : ['CIDB OPERATOR', 'INSURED', 'SAME-DAY KL'];
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.8 12.2c0-.7-.06-1.4-.18-2H12v3.9h5.5c-.24 1.3-.96 2.4-2.04 3.14v2.6h3.3c1.93-1.78 3.04-4.4 3.04-7.64z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.6-2.42l-3.3-2.6c-.92.62-2.1.98-3.3.98-2.54 0-4.7-1.72-5.46-4.02H3.13v2.52C4.77 19.78 8.1 22 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.94a6 6 0 010-3.88V7.54H3.13a10 10 0 000 8.92l3.41-2.52z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.96 3.02 14.7 2 12 2 8.1 2 4.77 4.22 3.13 7.54l3.41 2.52C7.3 7.7 9.46 5.98 12 5.98z"
      />
    </svg>
  );
}

function SkyliftIcon() {
  // Bucket-truck silhouette icon — clean, single-tone, boom + basket left,
  // truck cab right. Optional yellow accent on the basket so the brand
  // palette still reads.
  return (
    <svg
      className="nav-logo-icon"
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden="true"
    >
      {/* basket / bucket — top-left */}
      <path
        d="M3 8 L3 18 L13 18 L13 8 Z M5 10 L11 10 L11 16 L5 16 Z"
        fill="#1C1F2A"
        fillRule="evenodd"
      />
      {/* yellow safety lip on the bucket */}
      <rect x="3" y="8" width="10" height="2" fill="#F5B400" />
      {/* boom upper segment — going down-right from basket */}
      <path
        d="M11 13 L26 22 L24 25.5 L9 16.5 Z"
        fill="#1C1F2A"
      />
      {/* boom hinge knuckle */}
      <circle cx="26" cy="22" r="2.4" fill="#1C1F2A" />
      <circle cx="26" cy="22" r="0.8" fill="#F5B400" />
      {/* boom lower segment — from hinge down to turntable */}
      <path
        d="M24.5 21 L31 30 L28 32 L21.5 23 Z"
        fill="#1C1F2A"
      />
      {/* turntable / pedestal on flatbed */}
      <rect x="26" y="29" width="8" height="4" rx="0.6" fill="#1C1F2A" />
      {/* truck flatbed */}
      <rect x="10" y="33" width="38" height="5" rx="0.6" fill="#1C1F2A" />
      {/* truck cab — right side, sloped windscreen */}
      <path
        d="M48 33 L48 23 L54 23 L60 28 L60 33 Z"
        fill="#1C1F2A"
      />
      {/* headlight notch */}
      <rect x="58.5" y="30" width="1.4" height="1.4" fill="#F5B400" />
      {/* under-chassis */}
      <rect x="10" y="38" width="50" height="2" rx="0.4" fill="#1C1F2A" />
      {/* wheels */}
      <circle cx="18" cy="40" r="3.4" fill="#1C1F2A" />
      <circle cx="18" cy="40" r="1.4" fill="#FFFFFF" />
      <circle cx="52" cy="40" r="3.4" fill="#1C1F2A" />
      <circle cx="52" cy="40" r="1.4" fill="#FFFFFF" />
    </svg>
  );
}

function BrandLogo() {
  // Identical structure + spacing to the footer brand lockup,
  // just rendered in charcoal so it reads on the off-white nav.
  return (
    <span className="brand-lockup brand-lockup--dark">
      <svg className="brand-lockup-icon" viewBox="0 0 64 48" fill="none" aria-hidden="true">
        <path d="M3 8 L3 18 L13 18 L13 8 Z M5 10 L11 10 L11 16 L5 16 Z" fill="currentColor" fillRule="evenodd" />
        <rect x="3" y="8" width="10" height="2" fill="#F5B400" />
        <path d="M11 13 L26 22 L24 25.5 L9 16.5 Z" fill="currentColor" />
        <circle cx="26" cy="22" r="2.4" fill="currentColor" />
        <circle cx="26" cy="22" r="0.8" fill="#F5B400" />
        <path d="M24.5 21 L31 30 L28 32 L21.5 23 Z" fill="currentColor" />
        <rect x="26" y="29" width="8" height="4" rx="0.6" fill="currentColor" />
        <rect x="10" y="33" width="38" height="5" rx="0.6" fill="currentColor" />
        <path d="M48 33 L48 23 L54 23 L60 28 L60 33 Z" fill="currentColor" />
        <rect x="58.5" y="30" width="1.4" height="1.4" fill="#F5B400" />
        <rect x="10" y="38" width="50" height="2" rx="0.4" fill="currentColor" />
        <circle cx="18" cy="40" r="3.4" fill="currentColor" />
        <circle cx="18" cy="40" r="1.4" fill="var(--off-white)" />
        <circle cx="52" cy="40" r="3.4" fill="currentColor" />
        <circle cx="52" cy="40" r="1.4" fill="var(--off-white)" />
      </svg>
      <span className="brand-lockup-text">
        <strong>Skylift Malaysia</strong>
        <small>SCAFFOLDING MALAYSIA SDN. BHD.</small>
      </span>
    </span>
  );
}

function WhatsappGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function trackClick(label: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    window.uwc('click', { label });
  }
}

export default function HomePageClient({ locale, products, waUrl }: Props) {
  const nav = useTranslations('nav');
  const hero = useTranslations('hero');
  const usp = useTranslations('usp');
  const productsT = useTranslations('products');
  const how = useTranslations('howItWorks');
  const risk = useTranslations('risk');
  const mid = useTranslations('midCta');
  const rev = useTranslations('reviews');
  const why = useTranslations('whyChoose');
  const gal = useTranslations('gallery');
  const locs = useTranslations('locations');
  const faq = useTranslations('faq');
  const fin = useTranslations('finalCta');
  const fo = useTranslations('footer');
  const shared = useTranslations('shared');

  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute('data-slug');
            if (slug && window.uwc) window.uwc('impression', { label: `product-${slug}` });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    Object.values(productRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [products]);

  const locationsByState = getLocationsByRegion();

  const uspItems = usp.raw('items') as { title: string; description: string }[];
  const uspMetas = ['01 / RATE', '02 / DELIVERY', '03 / OPERATOR'];

  const steps = how.raw('steps') as { title: string; description: string }[];
  const riskPoints = risk.raw('points') as { title: string; description: string }[];
  const reviewItems = rev.raw('items') as {
    name: string;
    location: string;
    rating: number;
    text: string;
  }[];
  const whyItems = why.raw('items') as { title: string; description: string }[];
  const galleryCaptions = gal.raw('captions') as string[];
  const stateIntros = locs.raw('stateIntros') as Record<string, string>;
  const faqItems = faq.raw('items') as { question: string; answer: string }[];

  // Display all products as equal-weight cards (no hero highlight)

  return (
    <>
      {/* FOMO — charcoal background, yellow countdown */}
      <FomoBanner />

      {/* NAV */}
      <header className="nav-wrap">
        <nav className="nav-pill" aria-label="Main">
          <Link href={`/${locale}`} className="nav-brand" aria-label={nav('brandName')}>
            <BrandLogo />
          </Link>
          <div className="nav-links">
            <a href="#products">{nav('products')}</a>
            <a href="#locations">{nav('locations')}</a>
            <Link href={`/${locale}/blog`}>{nav('blog')}</Link>
          </div>
          <div className="nav-actions">
            <LanguageSwitcher />
            <a
              href={waUrl}
              target="_blank"
              rel="noopener"
              onClick={() => trackClick('whatsapp-nav')}
              className="btn btn-wa btn-sm"
            >
              <WhatsappGlyph />
              {nav('ctaButton')}
            </a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>
                {hero('h1').split(' ').slice(0, -1).join(' ')}{' '}
                <span className="hl">{hero('h1').split(' ').slice(-1)[0]}</span>
              </h1>
              <h2 className="hero-sub">{hero('h2')}</h2>
              <p className="hero-supporting">{hero('supporting')}</p>
              <div className="hero-ctas">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackClick('whatsapp-hero')}
                  className="btn btn-wa btn-lg"
                >
                  <WhatsappGlyph />
                  {hero('ctaPrimary')}
                </a>
                <a href="#products" className="btn btn-secondary btn-lg">
                  {hero('ctaSecondary')}
                </a>
              </div>
            </div>
            <div className="hero-media">
              <div className="hero-tape tape-stripe" aria-hidden="true" />
              <img
                src="/hero-skylift-truck.png"
                alt="Skylift truck — 24-metre boom, daily rental"
                className="hero-truck"
                loading="eager"
              />
              <img
                src="/hero-skylift-supervisor.png"
                alt={hero('imageAlt')}
                className="hero-cutout"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* USP BAR — 3 points */}
      <section className="usp-bar" aria-label="Key benefits">
        <div className="usp-grid">
          {uspItems.map((item, i) => (
            <div className="usp-card" key={i}>
              <div className="usp-icon" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="usp-card-body">
                <div className="usp-meta">{uspMetas[i]}</div>
                <div className="usp-title">{item.title}</div>
                <div className="usp-desc">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS — asymmetric spec-sheet grid */}
      <section className="section section-off-white" id="products">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">UNIT CATALOGUE</span>
            <h3>{productsT('heading')}</h3>
            <p>{productsT('subheading')}</p>
          </div>

          {products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--white)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--ink-muted)',
              }}
            >
              <p>Unit list loading from our database — please WhatsApp us for the full catalogue.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => {
                const photo = p.photos[0]?.url || '/brand/hero.png';
                return (
                  <div
                    key={p.id}
                    ref={(el) => {
                      productRefs.current[p.slug] = el;
                    }}
                    data-slug={p.slug}
                    className="product-card"
                  >
                    <div className="product-card-img">
                      <img src={photo} alt={p.name} loading="lazy" />
                    </div>
                    <div className="product-card-body">
                      <h4>{p.name}</h4>
                      <p>{p.description}</p>
                      {(p.sale_price || p.rental_price) && (
                        <div className="product-price">
                          {shared('from')} RM{' '}
                          {Math.round(p.sale_price || p.rental_price || 0)}
                          <small>{shared('perDay')}</small>
                        </div>
                      )}
                      <div className="product-spec">
                        {specsFor(p.slug).map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                      </div>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener"
                        onClick={() => trackClick(`whatsapp-product-${p.slug}`)}
                        className="btn btn-wa btn-sm"
                        style={{ alignSelf: 'flex-start', marginTop: 8 }}
                      >
                        <WhatsappGlyph />
                        {productsT('cta')}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-white" id="how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">PROCESS</span>
            <h3>{how('heading')}</h3>
            <p>{how('subheading')}</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step" key={i}>
                <span className="step-tag">STEP {String(i + 1).padStart(2, '0')}</span>
                <span className="step-num">{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RISK — image background */}
      <section
        className="section section-image"
        style={{ backgroundImage: RISK_BG }}
      >
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">SAFETY BRIEF</span>
            <h3>{risk('heading')}</h3>
            <p>{risk('subheading')}</p>
          </div>
          <ul className="risk-list">
            {riskPoints.map((p, i) => (
              <li key={i}>
                <h4>{p.title}</h4>
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* MID CTA — yellow image-bg */}
      <section
        className="section-mid-cta"
        style={{ backgroundImage: MID_CTA_BG }}
      >
        <div className="container">
          <span className="eyebrow eyebrow-light">{mid('eyebrow')}</span>
          <h3>{mid('heading')}</h3>
          <p>{mid('subheading')}</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            onClick={() => trackClick('whatsapp-mid')}
            className="btn btn-wa btn-lg"
          >
            <WhatsappGlyph />
            {mid('cta')}
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section-off-white" id="reviews">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">{rev('eyebrow')}</span>
            <h3>{rev('heading')}</h3>
            <span className="reviews-rating-badge">
              ★ {rev('rating')} · {rev('googleLabel')}
            </span>
            <p>{rev('subheading')}</p>
          </div>
          <div className="reviews-row">
            {reviewItems.map((r, i) => {
              const initials = r.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('');
              return (
                <article className="review-card" key={i}>
                  <div className="review-top">
                    <div className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
                      {'★'.repeat(r.rating)}
                    </div>
                    <span className="review-google">
                      <GoogleG />
                      Google
                    </span>
                  </div>
                  <p className="review-body">&ldquo;{r.text}&rdquo;</p>
                  <div className="review-meta">
                    <div className="review-avatar" aria-hidden="true">
                      {initials}
                    </div>
                    <div>
                      <div className="review-name">{r.name}</div>
                      <div className="review-loc">{r.location}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">DIFFERENTIATORS</span>
            <h3>{why('heading')}</h3>
          </div>
          <div className="why-grid">
            {whyItems.map((item, i) => (
              <div className="why-card" key={i}>
                <span className="why-num">
                  {String(i + 1).padStart(2, '0')} / {String(whyItems.length).padStart(2, '0')}
                </span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section section-off-white" id="gallery">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">PROJECT LOG</span>
            <h3>{gal('heading')}</h3>
            <p>{gal('subheading')}</p>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((src, i) => (
              <div className="gallery-item" key={`${src}-${i}`}>
                <img src={src} alt={galleryCaptions[i] || `Skylift project ${i + 1}`} loading="lazy" />
                {galleryCaptions[i] && (
                  <div className="gallery-caption">{galleryCaptions[i]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS ACCORDION */}
      <section className="section section-white" id="locations">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">COVERAGE MAP</span>
            <h3>{locs('heading')}</h3>
            <p>{locs('subheading')}</p>
          </div>
          <div className="state-accordion">
            {regionOrder.map((state) => {
              const cities = locationsByState[state] || [];
              if (cities.length === 0) return null;
              const stateSlug = cities[0]?.stateSlug || '';
              const intro = stateIntros[stateSlug] || '';
              return (
                <details className="state-row" key={state}>
                  <summary>
                    <span className="state-name">{state}</span>
                    <span className="state-count">{cities.length} cities</span>
                    <span className="state-toggle" aria-hidden="true" />
                  </summary>
                  {intro && <div className="state-intro">{intro}</div>}
                  <div className="state-cities">
                    {cities.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/${locale}/${siteConfig.productSlug}/${c.slug}`}
                        className="city-pill"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-off-white">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">FAQ</span>
            <h3>{faq('heading')}</h3>
          </div>
          <div className="faq-list">
            {faqItems.map((item, i) => (
              <details className="faq-item" key={i}>
                <summary>{item.question}</summary>
                <div className="faq-item-body">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — image bg */}
      <section
        className="section-final-cta"
        style={{ backgroundImage: FINAL_CTA_BG }}
      >
        <div className="container">
          <span className="eyebrow eyebrow-light">{fin('eyebrow')}</span>
          <h3>{fin('heading')}</h3>
          <p>{fin('subheading')}</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            onClick={() => trackClick('whatsapp-final')}
            className="btn btn-wa btn-lg"
          >
            <WhatsappGlyph />
            {fin('cta')}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand-lockup brand-lockup--light" style={{ marginBottom: 14 }}>
                <svg className="brand-lockup-icon" viewBox="0 0 64 48" fill="none" aria-hidden="true">
                  <path d="M3 8 L3 18 L13 18 L13 8 Z M5 10 L11 10 L11 16 L5 16 Z" fill="currentColor" fillRule="evenodd" />
                  <rect x="3" y="8" width="10" height="2" fill="#F5B400" />
                  <path d="M11 13 L26 22 L24 25.5 L9 16.5 Z" fill="currentColor" />
                  <circle cx="26" cy="22" r="2.4" fill="currentColor" />
                  <circle cx="26" cy="22" r="0.8" fill="#F5B400" />
                  <path d="M24.5 21 L31 30 L28 32 L21.5 23 Z" fill="currentColor" />
                  <rect x="26" y="29" width="8" height="4" rx="0.6" fill="currentColor" />
                  <rect x="10" y="33" width="38" height="5" rx="0.6" fill="currentColor" />
                  <path d="M48 33 L48 23 L54 23 L60 28 L60 33 Z" fill="currentColor" />
                  <rect x="58.5" y="30" width="1.4" height="1.4" fill="#F5B400" />
                  <rect x="10" y="38" width="50" height="2" rx="0.4" fill="currentColor" />
                  <circle cx="18" cy="40" r="3.4" fill="currentColor" />
                  <circle cx="18" cy="40" r="1.4" fill="var(--charcoal)" />
                  <circle cx="52" cy="40" r="3.4" fill="currentColor" />
                  <circle cx="52" cy="40" r="1.4" fill="var(--charcoal)" />
                </svg>
                <span className="brand-lockup-text">
                  <strong>Skylift Malaysia</strong>
                  <small>SCAFFOLDING MALAYSIA SDN. BHD.</small>
                </span>
              </div>
              <p className="footer-tagline">{fo('tagline')}</p>
              <div style={{ marginTop: 16 }}>
                <LanguageSwitcher />
              </div>
            </div>
            <div>
              <h5>{fo('unitsHeading')}</h5>
              <ul>
                <li><a href="#products">20m Skylift</a></li>
                <li><a href="#products">24m Skylift</a></li>
              </ul>
            </div>
            <div>
              <h5>{fo('topLocationsHeading')}</h5>
              <ul>
                <li><Link href={`/${locale}/skylift/kuala-lumpur`}>Kuala Lumpur</Link></li>
                <li><Link href={`/${locale}/skylift/petaling-jaya`}>Petaling Jaya</Link></li>
                <li><Link href={`/${locale}/skylift/shah-alam`}>Shah Alam</Link></li>
                <li><Link href={`/${locale}/skylift/johor-bahru`}>Johor Bahru</Link></li>
                <li><Link href={`/${locale}/skylift/george-town`}>George Town</Link></li>
                <li><Link href={`/${locale}/skylift/ipoh`}>Ipoh</Link></li>
              </ul>
            </div>
            <div>
              <h5>{fo('resourcesHeading')}</h5>
              <ul>
                <li><Link href={`/${locale}/blog`}>{fo('blog')}</Link></li>
                <li><a href="#how">{fo('siteSafety')}</a></li>
                <li><a href="#products">{fo('operatorCert')}</a></li>
                <li><a href="#locations">{locs('viewAll')}</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{fo('copyright')}</span>
            <span>{fo('ssm')}</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp FAB */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener"
        onClick={() => trackClick('whatsapp-fab')}
        className="fab-wa"
        aria-label={shared('whatsappCtaShort')}
      >
        <WhatsappGlyph />
      </a>
    </>
  );
}
