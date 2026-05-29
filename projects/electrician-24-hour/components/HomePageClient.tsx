'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Product, BlogPost } from '@/lib/webcore';
import { regionOrder, getLocationsByRegion } from '@/config/locations';
import { siteConfig } from '@/config/site';
import { waRedirect } from '@/lib/waRedirect';

type Props = {
  locale: string;
  products: Product[];
  recentPosts: BlogPost[];
};

// Exactly 12 images — fills 4×3 / 3×4 / 2×6 grids perfectly at every breakpoint.
const GALLERY_IMAGES = [
  '/gallery/gallery-1.jpg',
  '/gallery/gallery-2.jpg',
  '/gallery/gallery-3.jpg',
  '/gallery/gallery-4.jpg',
  '/gallery/gallery-5.jpg',
  '/gallery/gallery-6.jpg',
  '/gallery/gallery-7.jpg',
  '/gallery/gallery-8.jpg',
  '/gallery/gallery-9.jpg',
  '/gallery/gallery-11.jpg',
  '/gallery/gallery-12.jpg',
  '/gallery/gallery-2b.jpg',
];

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path fill="#4285F4" d="M21.8 12.2c0-.7-.06-1.4-.18-2H12v3.9h5.5c-.24 1.3-.96 2.4-2.04 3.14v2.6h3.3c1.93-1.78 3.04-4.4 3.04-7.64z"/>
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.6-2.42l-3.3-2.6c-.92.62-2.1.98-3.3.98-2.54 0-4.7-1.72-5.46-4.02H3.13v2.52C4.77 19.78 8.1 22 12 22z"/>
      <path fill="#FBBC05" d="M6.54 13.94a6 6 0 010-3.88V7.54H3.13a10 10 0 000 8.92l3.41-2.52z"/>
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.96 3.02 14.7 2 12 2 8.1 2 4.77 4.22 3.13 7.54l3.41 2.52C7.3 7.7 9.46 5.98 12 5.98z"/>
    </svg>
  );
}

const USP_ICONS = [
  '/usp/usp-same-day.svg',
  '/usp/usp-speed.svg',
  '/usp/usp-price.svg',
];

function trackClick(label: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    window.uwc('click', { label });
  }
}

export default function HomePageClient({ locale, products, recentPosts }: Props) {
  // Every WhatsApp CTA routes through the redirect page so the request hits the
  // server, the leads-mode logic picks the right phone for the live host, and
  // the click is tracked before forwarding to wa.me.
  const waHref = waRedirect(locale);
  const usp = useTranslations('usp');
  const services = useTranslations('services');
  const how = useTranslations('howItWorks');
  const emerg = useTranslations('emergency');
  const mid = useTranslations('midCta');
  const gal = useTranslations('gallery');
  const rev = useTranslations('reviews');
  const locs = useTranslations('locations');
  const faq = useTranslations('faq');
  const fin = useTranslations('finalCta');
  const blogT = useTranslations('blog');

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
  const steps = how.raw('steps') as { title: string; description: string }[];
  const emergPoints = emerg.raw('points') as string[];
  const faqItems = faq.raw('items') as { question: string; answer: string }[];
  const reviewItems = rev.raw('items') as {
    name: string;
    location: string;
    rating: number;
    text: string;
  }[];

  return (
    <>
      {/* Hero CTA buttons now live in the server-rendered hero (page.tsx). */}

      {/* USP bar — single .usp-panel container with 3 .usp-cell children */}
      <div className="usp-bar">
        <div className="usp-panel usp-grid">
          {uspItems.map((item, i) => (
            <div className="usp-cell usp-card" key={i}>
              <div className="usp-icon">
                <img src={USP_ICONS[i]} alt={item.title} />
              </div>
              <div>
                <div className="usp-title">{item.title}</div>
                <div className="usp-desc">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES — dynamic from Supabase */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{siteConfig.productName}</span>
            <h3>{services('heading')}</h3>
            <p>{services('subheading')}</p>
          </div>

          {products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--ice)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--ink-muted)',
              }}
            >
              <p>Service list loading from our database — please WhatsApp us for the full menu.</p>
            </div>
          ) : (
            <div className="service-grid">
              {products.map((p) => {
                const photo = p.photos[0]?.url || '/brand/hero.jpg';
                return (
                  <div
                    key={p.id}
                    ref={(el) => { productRefs.current[p.slug] = el; }}
                    data-slug={p.slug}
                    className="service-card"
                  >
                    <div className="service-card-img">
                      <img src={photo} alt={p.name} loading="lazy" />
                    </div>
                    <div className="service-card-body">
                      <h4>{p.name}</h4>
                      <p>{p.description}</p>
                      {p.sale_price && (
                        <div className="service-price">
                          <span>from</span> RM {Math.round(p.sale_price)}
                        </div>
                      )}
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener"
                        onClick={() => trackClick(`whatsapp-service-${p.slug}`)}
                        className="btn btn-wa btn-sm"
                        style={{ marginTop: 6, alignSelf: 'flex-start' }}
                      >
                        {services('cta')}
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
      <section className="section section-ice" id="how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">3-Step Process</span>
            <h3>{how('heading')}</h3>
            <p>{how('subheading')}</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step" key={i}>
                <div className="step-num">{i + 1}</div>
                <h4>{s.title}</h4>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY DARK BAND */}
      <section className="section dark-band">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-head">
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>⚡ 24/7 Emergency</span>
            <h3>{emerg('heading')}</h3>
          </div>
          <ul className="emergency-list">
            {emergPoints.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
          <p style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 22px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
            {emerg('solution')}
          </p>
          <div style={{ textAlign: 'center' }}>
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={() => trackClick('whatsapp-emergency')}
              className="btn btn-wa btn-lg"
            >
              {emerg('cta')}
            </a>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section" id="gallery">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Real Site Photos</span>
            <h3>{gal('heading')}</h3>
            <p>{gal('subheading')}</p>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((src, i) => (
              <div className="gallery-item" key={src}>
                <img src={src} alt={`Electrician site visit ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID CTA with real hero image */}
      <section
        className="section"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,30,74,0.82), rgba(10,58,130,0.82)), url('/brand/mid-cta-bg.jpg') center/cover no-repeat",
          color: 'var(--white)',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h3 style={{ color: 'var(--white)', fontSize: 'clamp(24px, 3.5vw, 36px)', marginBottom: 12 }}>
            {mid('heading')}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 640, margin: '0 auto 22px', lineHeight: 1.7 }}>
            {mid('subheading')}
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            onClick={() => trackClick('whatsapp-mid')}
            className="btn btn-wa btn-lg"
          >
            {mid('cta')}
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section-ice" id="reviews">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" style={{ color: '#0b63ce' }}>
              ★ {rev('rating')} on Google
            </span>
            <h3>{rev('heading')}</h3>
            <p>{rev('subheading')}</p>
          </div>
          <div className="reviews-grid">
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
                    <div className="review-avatar" aria-hidden="true">{initials}</div>
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

      {/* LOCATIONS */}
      <section className="section" id="locations">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Coverage Across Malaysia</span>
            <h3>{locs('heading')}</h3>
            <p>{locs('subheading')}</p>
          </div>
          <div className="state-groups">
            {regionOrder.map((state) => {
              const cities = locationsByState[state] || [];
              if (cities.length === 0) return null;
              return (
                <div className="state-group" key={state}>
                  <h4 className="state-title">
                    <span className="state-flag" aria-hidden="true">⚡</span>
                    {state}
                    <span className="state-count">{cities.length} cities</span>
                  </h4>
                  <div className="state-chips">
                    {cities.map((l) => (
                      <Link
                        key={l.slug}
                        href={`/${locale}/${siteConfig.productSlug}/${l.slug}`}
                        className="city-chip"
                      >
                        {l.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RECENT BLOG */}
      {recentPosts.length > 0 && (
        <section className="section section-ice">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Blog</span>
              <h3>{blogT('recentPosts')}</h3>
            </div>
            <div className="blog-grid">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="blog-card"
                  onClick={() => trackClick(`blog-${post.slug}`)}
                >
                  <div className="blog-card-img">
                    <img
                      src={post.cover_image_url || '/brand/hero.jpg'}
                      alt={post.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="blog-card-body">
                    <span className="blog-card-date">
                      {new Date(post.published_at).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <h4>{post.title}</h4>
                    <p>{post.excerpt}</p>
                    <span className="blog-card-more">{blogT('readMore')} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
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

      {/* BOTTOM CTA */}
      <section className="cta-band">
        <div className="container">
          <h3>{fin('heading')}</h3>
          <p>{fin('subheading')}</p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            onClick={() => trackClick('whatsapp-final')}
            className="btn btn-wa btn-lg"
          >
            {fin('cta')}
          </a>
        </div>
      </section>

      {/* FAB WhatsApp */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        onClick={() => trackClick('whatsapp-fab')}
        className="fab-wa"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </>
  );
}
