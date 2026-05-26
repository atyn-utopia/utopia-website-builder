import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import {
  locations,
  getLocationsByState,
  getNearbyLocations,
  regionOrder,
  regionKeys,
  topCitySlugs,
} from '@/config/locations';
import { getProducts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import Calculator from '@/components/Calculator';
import MarketingMarquee from '@/components/MarketingMarquee';
import PageStyles from '@/components/PageStyles';
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

const GALLERY_IMAGES = [
  '/gallery/3.jpg', '/gallery/4.jpg', '/gallery/5.jpg', '/gallery/6.jpg',
  '/gallery/7.jpg', '/gallery/8.jpg', '/gallery/9.jpg', '/gallery/10.jpg',
  '/gallery/11.jpg', '/gallery/12.jpg', '/gallery/13.jpg', '/gallery/14.jpg',
];
const BRAND_LOGO_ON_DARK = '/brand/oxihome-dark.png';
const HERO_OPERATOR_PHOTO = '/brand/hero-photo.png';
const FINAL_CTA_BG = '/bg/bg-5.avif';

// Build the top cities at build time; the rest render on first request and
// stay cached until a webcore tag (products/phones/blog) is invalidated via
// /api/revalidate. Tag-based only — no time-based revalidate. Avoids 60s/route
// timeouts on Vercel's static worker when we have 489 routes (163 cities × 3 locales).
export const dynamicParams = true;
export function generateStaticParams() {
  return topCitySlugs.flatMap((slug) =>
    routing.locales.map((locale) => ({ locale, location: slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}): Promise<Metadata> {
  const { locale, location } = await params;
  const loc = locations.find((l) => l.slug === location);
  if (!loc) return {};
  const t = await getTranslations({ locale, namespace: 'meta.location' });
  const title = t('title', { location: loc.name });
  const description = t('description', { location: loc.name, state: loc.state });
  const path = `/${siteConfig.productSlug}/${loc.slug}`;
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}${path}`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/${locale}${path}`, languages },
    openGraph: { title, description, url: `${siteConfig.url}/${locale}${path}`, type: 'website' },
  };
}

function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1a6 6 0 0 1-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" fill="#34A853" />
      <path d="M6.4 14a6 6 0 0 1 0-3.8V7.6H3.1a10 10 0 0 0 0 8.8L6.4 14Z" fill="#FBBC04" />
      <path d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 12 2 10 10 0 0 0 3.1 7.6L6.4 10A6 6 0 0 1 12 5.9Z" fill="#EA4335" />
    </svg>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FBBC04" aria-hidden="true">
          <path d="M12 2l3.1 6.3 7 1-5.1 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9L2 9.3l7-1L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const loc = locations.find((l) => l.slug === location);
  if (!loc) notFound();

  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tLocPage = await getTranslations({ locale, namespace: 'location' });
  const tUsp = await getTranslations({ locale, namespace: 'usp' });
  const tBrand = await getTranslations({ locale, namespace: 'brandStrip' });
  const tProducts = await getTranslations({ locale, namespace: 'products' });
  const tCalc = await getTranslations({ locale, namespace: 'calculator' });
  const tProcess = await getTranslations({ locale, namespace: 'process' });
  const tWhy = await getTranslations({ locale, namespace: 'whyUs' });
  const tReviews = await getTranslations({ locale, namespace: 'reviews' });
  const tGallery = await getTranslations({ locale, namespace: 'gallery' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const tLoc = await getTranslations({ locale, namespace: 'locations' });
  const tFinal = await getTranslations({ locale, namespace: 'finalCta' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const { core } = await getProducts();
  const fallback5L = tProducts.raw('fallback.5l') as { eyebrow: string; description: string; price: number; monthly: number };
  const fallback10L = tProducts.raw('fallback.10l') as { eyebrow: string; description: string; price: number; monthly: number };
  const productCards = [
    {
      slug: 'oxihome-5l',
      name: 'Oxihome 5L',
      description: core.find((p) => p.slug === 'oxihome-5l')?.description ?? fallback5L.description,
      rentalPrice: core.find((p) => p.slug === 'oxihome-5l')?.rental_price ?? fallback5L.price,
      eyebrow: fallback5L.eyebrow,
      image: core.find((p) => p.slug === 'oxihome-5l')?.photos[0]?.url ?? '/products/oxihome-5l.png',
    },
    {
      slug: 'oxihome-10l',
      name: 'Oxihome 10L',
      description: core.find((p) => p.slug === 'oxihome-10l')?.description ?? fallback10L.description,
      rentalPrice: core.find((p) => p.slug === 'oxihome-10l')?.rental_price ?? fallback10L.price,
      eyebrow: fallback10L.eyebrow,
      image: core.find((p) => p.slug === 'oxihome-10l')?.photos[0]?.url ?? '/products/oxihome-10l.png',
    },
  ];
  const calcRates = {
    ec200: { daily: Number(productCards[0].rentalPrice), monthly: fallback5L.monthly },
    ec400: { daily: Number(productCards[1].rentalPrice), monthly: fallback10L.monthly },
  };

  const uspItems = tUsp.raw('items') as { title: string; body: string }[];
  const brandItems = tBrand.raw('items') as string[];
  const processSteps = tProcess.raw('steps') as { title: string; body: string }[];
  const whyItems = tWhy.raw('items') as { title: string; body: string }[];
  const reviewItems = tReviews.raw('items') as { name: string; suburb: string; stars: number; body: string }[];
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];
  const localisedFaq = faqItems.map((f) => ({
    q: f.q,
    a: f.a.replace(/Malaysia/g, `${loc.name}, ${loc.state}`),
  }));

  const nearby = getNearbyLocations(loc.slug);
  const locationsByState = getLocationsByState();

  return (
    <>
      <FomoBanner />
      <SiteHeader />

      <LocalBusinessSchema locale={locale} locationName={loc.name} locationSlug={loc.slug} state={loc.state} />
      <BreadcrumbSchema
        items={[
          { name: tLocPage('breadcrumbHome'), url: `${siteConfig.url}/${locale}` },
          { name: tLocPage('breadcrumbLocations'), url: `${siteConfig.url}/${locale}#locations` },
          { name: loc.name, url: `${siteConfig.url}/${locale}/${siteConfig.productSlug}/${loc.slug}` },
        ]}
      />
      {productCards.map((p) => (
        <ProductSchema
          key={p.slug}
          name={p.name}
          slug={p.slug}
          description={p.description}
          rentalPrice={p.rentalPrice}
          image={p.image}
          areaServed={loc.name}
        />
      ))}
      <FAQSchema items={localisedFaq} />

      <section className="hero">
        <div className="hero-bg" role="img" aria-label={tHero('bgAlt')} />
        <div className="container hero-grid">
          <div className="hero-text">
            <nav className="breadcrumb breadcrumb-on-dark" aria-label="Breadcrumb">
              <Link href={`/${locale}`}>{tLocPage('breadcrumbHome')}</Link>
              <span aria-hidden="true">›</span>
              <Link href={`/${locale}#locations`}>{tLocPage('breadcrumbLocations')}</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{loc.name}</span>
            </nav>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_LOGO_ON_DARK} alt={tNav('logoAlt')} width={600} height={441} className="hero-logo" />
            <span className="eyebrow eyebrow-light">OPERATOR STANDBY · {loc.name.toUpperCase()}</span>
            <h1>{tLocPage('h1Template', { location: loc.name })}</h1>
            <h2>{tLocPage('h2Template', { state: loc.state })}</h2>
            <h5 className="hero-support">{tLocPage('introTemplate', { location: loc.name, state: loc.state })}</h5>
            <div className="hero-cta-row">
              <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`hero-${loc.slug}`} className="btn btn-wa">
                <WaIcon /> {tHero('ctaPrimary')}
              </WhatsAppButton>
              <a href="#calculator" className="hero-secondary">{tHero('ctaSecondary')}</a>
            </div>
          </div>
          <div className="hero-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_OPERATOR_PHOTO} alt={tHero('imageAlt')} width={1600} height={1137} className="hero-image-img" />
          </div>
        </div>
      </section>

      <MarketingMarquee locale={locale} variant="light" />

      <section className="brand-strip" aria-labelledby="brand-strip-heading">
        <div className="container">
          <h5 id="brand-strip-heading" className="brand-strip-eyebrow">{tBrand('eyebrow')}</h5>
          <div className="brand-strip-track no-scrollbar">
            <div className="marquee-track">
              {[...brandItems, ...brandItems].map((label, i) => (
                <span key={i} className="brand-chip">{label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="usp-bar" aria-labelledby="usp-heading">
        <h3 id="usp-heading" className="visually-hidden">{tUsp('srHeading')}</h3>
        <div className="container">
          <div className="usp-panel">
            {uspItems.map((u, i) => (
              <div key={i} className="usp-cell">
                <span className="usp-icon">
                  {i === 0 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <path d="M4 22 V14 L11 14 L13 10 L20 10 L22 14 L26 14 L28 16 V22" />
                      <circle cx="9" cy="24" r="3" fill="currentColor" />
                      <circle cx="23" cy="24" r="3" fill="currentColor" />
                      <path d="M14 14 L19 14 L20 18 L13 18 Z" fill="rgba(255,255,255,0.25)" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <path d="M5 22 C5 14, 12 8, 16 8 C20 8, 27 14, 27 22 Z" fill="currentColor" />
                      <path d="M5 22 H27" stroke="rgba(255,255,255,0.3)" />
                      <rect x="14" y="18" width="4" height="4" fill="#0F0F0F" />
                      <path d="M3 24 H29" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <rect x="5" y="9" width="22" height="14" rx="2" fill="currentColor" />
                      <circle cx="16" cy="16" r="4" fill="#0F0F0F" />
                      <text x="16" y="19" textAnchor="middle" fontSize="6" fontWeight="700" fill="currentColor" stroke="none">RM</text>
                      <circle cx="9" cy="13" r="0.8" fill="#0F0F0F" />
                      <circle cx="23" cy="19" r="0.8" fill="#0F0F0F" />
                    </svg>
                  )}
                </span>
                <h5>{u.title}</h5>
                <h5>{u.body}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tProducts('eyebrow')}</span>
            <h3>{tProducts('h3')}</h3>
            <h4>{tProducts('intro')}</h4>
          </div>
          <div className="products-grid">
            {productCards.map((p) => {
              const monthly = p.slug === 'oxihome-5l' ? fallback5L.monthly : fallback10L.monthly;
              return (
                <article key={p.slug} className="product-card" data-product={p.slug}>
                  <ProductImpressionTracker slug={p.slug} />
                  <div className="product-media">
                    <span className="product-tag">{p.eyebrow}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={tProducts('imageAltTemplate', { model: p.name })} loading="lazy" decoding="async" />
                  </div>
                  <div className="product-body">
                    <h4 className="product-title">{p.name}</h4>
                    <h5 className="product-desc">{p.description}</h5>
                    <div className="product-prices">
                      <div className="price-cell">
                        <span className="price-label">{tProducts('priceDailyLabel')}</span>
                        <span className="price-value">{tProducts('priceDaily', { price: Number(p.rentalPrice).toLocaleString() })}</span>
                      </div>
                      <div className="price-divider" aria-hidden="true" />
                      <div className="price-cell">
                        <span className="price-label">{tProducts('priceMonthlyLabel')}</span>
                        <span className="price-value">{tProducts('priceMonthly', { price: Number(monthly).toLocaleString() })}</span>
                      </div>
                    </div>
                    <WhatsAppButton href={waRedirect(locale, `${p.name} di ${loc.name}`, loc.slug)} label={`product-${p.slug}-${loc.slug}`} className="btn btn-wa product-cta">
                      <WaIcon size={16} />
                      {tProducts('ctaTemplate', { model: p.name })}
                    </WhatsAppButton>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="calculator" className="section bg-blueprint-glow calc-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow-light">{tCalc('eyebrow')}</span>
            <h3 style={{ color: '#fff' }}>{tCalc('h3')}</h3>
            <p style={{ color: 'rgba(255,255,255,0.78)' }}>{tCalc('intro')}</p>
          </div>
          <Calculator rates={calcRates} />
        </div>
      </section>

      <MarketingMarquee locale={locale} variant="dark" />

      <section className="section section-bg-image section-bg-process" aria-label={tProcess('bgAlt')}>
        <div className="section-bg-overlay" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow-light">{tProcess('eyebrow')}</span>
            <h3 style={{ color: '#fff' }}>{tProcess('h3')}</h3>
          </div>
          <div className="process-grid">
            {processSteps.map((s, i) => (
              <div key={i} className="process-card">
                <h6 className="process-num">{String(i + 1).padStart(2, '0')}</h6>
                <h5>{s.title}</h5>
                <h5>{s.body}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section why-section">
        <div className="why-bg" role="img" aria-label={tWhy('bgAlt')} />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tWhy('eyebrow')}</span>
            <h3>{tWhy('h3')}</h3>
          </div>
          <div className="why-grid">
            {whyItems.map((w, i) => (
              <div key={i} className="why-card">
                <h5>{w.title}</h5>
                <h5>{w.body}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-bg-image section-bg-reviews" aria-label={tReviews('bgAlt')}>
        <div className="section-bg-overlay" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow-light">{tReviews('eyebrow')}</span>
            <h3 style={{ color: '#fff' }}>{tReviews('h3')}</h3>
            <h5 className="reviews-aggregate reviews-aggregate-light"><GoogleG size={18} /> {tReviews('aggregate')}</h5>
          </div>
          <div className="reviews-grid">
            {reviewItems.map((r, i) => (
              <article key={i} className="review-card">
                <span className="review-g"><GoogleG size={22} /></span>
                <span className="review-source">{tReviews('postedOn')}</span>
                <StarRow count={r.stars} />
                <h5 className="review-body">{r.body}</h5>
                <div>
                  <h6 className="review-author">{r.name}</h6>
                  <h6 className="review-suburb">{r.suburb}</h6>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tGallery('eyebrow')}</span>
            <h3>{tGallery('h3')}</h3>
            <h5>{tGallery('intro')}</h5>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((src, i) => (
              <div key={i} className="gallery-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={((tGallery.raw('alts') as string[])[i]) ?? `Tapak bina ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section bg-paper">
        <div className="container faq-container">
          <div className="section-head">
            <span className="eyebrow">{tFaq('eyebrow')}</span>
            <h3>{tFaq('h3')} — {loc.name}</h3>
          </div>
          <div className="faq-list">
            {localisedFaq.map((f, i) => (
              <details key={i} className="faq-item">
                <summary>{f.q}</summary>
                <h4>{f.a}</h4>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="locations" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tLoc('eyebrow')}</span>
            <h3>{tLoc('h3')}</h3>
            <h4>{tLoc('intro')}</h4>
          </div>
          <div className="top-cities">
            {topCitySlugs.map((slug) => {
              const c = locations.find((l) => l.slug === slug);
              if (!c) return null;
              return (
                <Link key={slug} href={`/${locale}/${siteConfig.productSlug}/${slug}`} className={`loc-city-chip ${slug === loc.slug ? 'is-current' : ''}`}>
                  {c.name}
                </Link>
              );
            })}
          </div>
          <div className="states-grid">
            {regionOrder.map((region) => {
              const cities = locationsByState[region] || [];
              if (cities.length === 0) return null;
              const key = regionKeys[region];
              return (
                <div key={region} className="state-block">
                  <h4>{tLoc(`stateLabels.${key}`)}</h4>
                  <ul>
                    {cities.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/${locale}/${siteConfig.productSlug}/${c.slug}`}>{c.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="section bg-paper">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">{tLocPage('nearbyEyebrow')}</span>
              <h3>{tLocPage('nearbyHeading', { location: loc.name })}</h3>
            </div>
            <div className="nearby-grid">
              {nearby.map((n) => (
                <Link key={n.slug} href={`/${locale}/${siteConfig.productSlug}/${n.slug}`} className="nearby-card">
                  <span className="nearby-name">{n.name}</span>
                  <span className="nearby-state">{n.state}</span>
                  <span className="nearby-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section final-cta">
        <div className="final-cta-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FINAL_CTA_BG} alt={tFinal('bgAlt')} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="container final-cta-inner">
          <span className="eyebrow eyebrow-light">{tFinal('eyebrow')}</span>
          <h3>{tFinal('h3')} — {loc.name}</h3>
          <h5>{tFinal('body')}</h5>
          <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`final-cta-${loc.slug}`} className="btn btn-wa">
            <WaIcon /> {tFinal('ctaLabel')}
          </WhatsAppButton>
        </div>
      </section>

      <SiteFooter locale={locale} />

      <PageStyles />
      <style>{`
        /* Location-only extras (everything else inherited from PageStyles) */
        .breadcrumb {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin: 0 0 4px;
          padding: 7px 12px 7px 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          backdrop-filter: blur(6px);
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          width: fit-content;
          max-width: 100%;
          align-self: center;
        }
        @media (min-width: 880px) { .breadcrumb { align-self: flex-start; } }
        .breadcrumb a {
          color: rgba(255,255,255,0.85);
          transition: color var(--dur) var(--ease-out);
        }
        .breadcrumb a:hover { color: var(--brand-orange-bright); }
        .breadcrumb [aria-current="page"] {
          color: #fff;
          background: var(--brand-orange);
          padding: 3px 10px;
          border-radius: 999px;
          box-shadow: 0 4px 10px rgba(242,108,31,0.32);
        }
        .breadcrumb span[aria-hidden="true"] {
          color: rgba(255,255,255,0.45);
          font-weight: 500;
        }
        .top-cities { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 40px; }
        .city-chip { padding: 8px 16px; background: #fff; border: 1px solid var(--line); border-radius: 999px; font-weight: 600; font-size: 13.5px; color: var(--brand-charcoal); }
        .city-chip:hover { background: var(--brand-orange-pale); border-color: var(--brand-orange-ring); color: var(--brand-orange-deep); }
        .city-chip.is-current { background: var(--brand-charcoal); border-color: var(--brand-charcoal); color: #fff; }
        .nearby-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-width: 960px;
          margin: 0 auto;
        }
        @media (min-width: 640px) { .nearby-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 980px) { .nearby-grid { grid-template-columns: repeat(4, 1fr); } }
        .nearby-card { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 16px 18px; transition: border-color var(--dur) var(--ease-out), transform var(--dur) var(--ease-out); }
        .nearby-card:hover { border-color: var(--brand-orange-ring); transform: translateY(-2px); }
        .nearby-name { color: var(--brand-charcoal); font-weight: 700; font-size: 15px; flex: 1; }
        .nearby-state { font-family: var(--font-mono-stack); font-weight: 600; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
        .nearby-arrow { color: var(--brand-orange); font-weight: 700; }
      `}</style>
    </>
  );
}
