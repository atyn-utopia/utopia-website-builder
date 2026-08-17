import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { locations, getLocationsByState, regionOrder, regionKeys, topCitySlugs } from '@/config/locations';
import { getProducts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import Calculator from '@/components/Calculator';
import MarketingMarquee from '@/components/MarketingMarquee';
import PageStyles from '@/components/PageStyles';
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${localeHref(l)}`]),
  );
  languages['x-default'] = `${localeHref(routing.defaultLocale)}`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${localeHref(locale)}`,
      languages,
    },
  };
}

// Pexels search-based image URLs (royalty-free, hot-linked). Until the user
// uploads real assets, these stand in for the gallery + hero composition.
const GALLERY_IMAGES = [
  '/gallery/3.jpg',
  '/gallery/4.jpg',
  '/gallery/5.jpg',
  '/gallery/6.jpg',
  '/gallery/7.jpg',
  '/gallery/8.jpg',
  '/gallery/9.jpg',
  '/gallery/10.jpg',
  '/gallery/11.jpg',
  '/gallery/12.jpg',
  '/gallery/13.jpg',
  '/gallery/14.jpg',
];

const HERO_EXCAVATOR_IMG = '/brand/hero-photo.png';
const FINAL_CTA_BG = '/bg/bg-5.avif';

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const tHero = await getTranslations({ locale, namespace: 'hero' });
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

  // Build product cards — DB first, fallback values from translations if DB unavailable.
  const fallbackEc200 = tProducts.raw('fallback.ec200') as { eyebrow: string; description: string; price: number; monthly: number };
  const fallbackEc400 = tProducts.raw('fallback.ec400') as { eyebrow: string; description: string; price: number; monthly: number };

  const productCards = [
    {
      slug: 'volvo-ec200',
      name: 'Volvo EC200',
      description: core.find((p) => p.slug === 'volvo-ec200')?.description ?? fallbackEc200.description,
      rentalPrice: core.find((p) => p.slug === 'volvo-ec200')?.rental_price ?? fallbackEc200.price,
      prices: core.find((p) => p.slug === 'volvo-ec200')?.prices ?? [],
      eyebrow: fallbackEc200.eyebrow,
      image: core.find((p) => p.slug === 'volvo-ec200')?.photos[0]?.url ?? '/products/volvo-ec200.png',
    },
    {
      slug: 'volvo-ec400',
      name: 'Volvo EC400',
      description: core.find((p) => p.slug === 'volvo-ec400')?.description ?? fallbackEc400.description,
      rentalPrice: core.find((p) => p.slug === 'volvo-ec400')?.rental_price ?? fallbackEc400.price,
      prices: core.find((p) => p.slug === 'volvo-ec400')?.prices ?? [],
      eyebrow: fallbackEc400.eyebrow,
      image: core.find((p) => p.slug === 'volvo-ec400')?.photos[0]?.url ?? '/products/volvo-ec400.png',
    },
  ];

  const calcRates = {
    ec200: { daily: Number(productCards[0].rentalPrice), monthly: Number(fallbackEc200.monthly) },
    ec400: { daily: Number(productCards[1].rentalPrice), monthly: Number(fallbackEc400.monthly) },
  };

  const uspItems = tUsp.raw('items') as { title: string; body: string }[];
  const brandItems = tBrand.raw('items') as string[];
  const processSteps = tProcess.raw('steps') as { title: string; body: string }[];
  const whyItems = tWhy.raw('items') as { title: string; body: string }[];
  const reviewItems = tReviews.raw('items') as { name: string; suburb: string; stars: number; body: string }[];
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];

  const locationsByState = getLocationsByState();

  return (
    <>
      <FomoBanner />
      <SiteHeader />

      {productCards.map((p) => (
        <ProductSchema
          key={p.slug}
          name={p.name}
          slug={p.slug}
          description={p.description}
          rentalPrice={p.rentalPrice}
          image={p.image}
        />
      ))}
      <FAQSchema items={faqItems} />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" role="img" aria-label={tHero('bgAlt')} />
        <div className="container hero-grid">
          <div className="hero-text">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/abang-excavator-dark.png" alt={tNav('logoAlt')} width={600} height={441} className="hero-logo" />
            <span className="eyebrow eyebrow-light">{tHero('eyebrow')}</span>
            <h1>
              {tHero('h1Part1')}{' '}
              <span className="hero-h1-accent">{tHero('h1Highlight')}</span>{' '}
              {tHero('h1Part2')}
            </h1>
            <h2>{tHero('h2')}</h2>
            <h5 className="hero-support">{tHero('supporting')}</h5>
            <div className="hero-cta-row">
              <WhatsAppButton href={waRedirect(locale)} label="hero" className="btn btn-wa">
                <WaIcon /> {tHero('ctaPrimary')}
              </WhatsAppButton>
              <a href="#calculator" className="hero-secondary">{tHero('ctaSecondary')}</a>
            </div>
            <div className="hero-stats">
              <div>
                <span className="hero-stat-num">2</span>
                <span className="hero-stat-label">{tHero('statModels')}</span>
              </div>
              <span className="hero-stat-div" aria-hidden="true" />
              <div>
                <span className="hero-stat-num">14</span>
                <span className="hero-stat-label">{tHero('statStates')}</span>
              </div>
              <span className="hero-stat-div" aria-hidden="true" />
              <div>
                <span className="hero-stat-num">24</span>
                <span className="hero-stat-label">{tHero('statDelivery')}</span>
              </div>
            </div>
            <div className="ops-ticker" aria-hidden="true">
              <div className="ops-ticker-inner">
                <div className="ops-ticker-row">SITE-READY · KL ▸ KOTA KINABALU</div>
                <div className="ops-ticker-row">SITE-READY · JB ▸ KUCHING</div>
                <div className="ops-ticker-row">SITE-READY · PENANG ▸ IPOH</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_EXCAVATOR_IMG} alt={tHero('imageAlt')} width={1600} height={1137} className="hero-image-img" />
          </div>
        </div>
      </section>

      <MarketingMarquee locale={locale} variant="light" />

      {/* BRAND STRIP */}
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

      {/* USP BAR (no section heading) */}
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

      {/* PRODUCTS */}
      <section id="products" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tProducts('eyebrow')}</span>
            <h3>{tProducts('h3')}</h3>
            <h4>{tProducts('intro')}</h4>
          </div>
          <div className="products-grid">
            {productCards.map((p) => {
              const monthly = p.slug === 'volvo-ec200' ? fallbackEc200.monthly : fallbackEc400.monthly;
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
                    {p.prices.length > 0 ? (
                      <div className="product-prices price-list">
                        {p.prices.map((line, i) => (
                          <div className="price-line" key={i}>
                            {line.label}: RM {Number(line.amount).toLocaleString()}
                            {line.unit ? ' / ' + line.unit : ''}
                            {line.note ? <span className="price-note">{line.note}</span> : null}
                          </div>
                        ))}
                      </div>
                    ) : (
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
                    )}
                    <WhatsAppButton
                      href={waRedirect(locale, `${p.name} — ${tProducts('priceDaily', { price: String(p.rentalPrice) })}`)}
                      label={`product-${p.slug}`}
                      className="btn btn-wa product-cta"
                    >
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

      {/* CALCULATOR — special section */}
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

      {/* PROCESS */}
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

      {/* WHY US */}
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

      {/* REVIEWS */}
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

      {/* GALLERY */}
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
                {/* Plain <img> — Next/Image rejects the very large source files; this also lets lazy loading work straight through */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={((tGallery.raw('alts') as string[])[i]) ?? `Tapak bina ${i + 1}`} loading="lazy" decoding="async" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-paper">
        <div className="container faq-container">
          <div className="section-head">
            <span className="eyebrow">{tFaq('eyebrow')}</span>
            <h3>{tFaq('h3')}</h3>
          </div>
          <div className="faq-list">
            {faqItems.map((f, i) => (
              <details key={i} className="faq-item">
                <summary>{f.q}</summary>
                <h4>{f.a}</h4>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tLoc('eyebrow')}</span>
            <h3>{tLoc('h3')}</h3>
            <h4>{tLoc('intro')}</h4>
          </div>
          <div className="top-cities">
            {topCitySlugs.map((slug) => {
              const loc = locations.find((l) => l.slug === slug);
              if (!loc) return null;
              return (
                <Link
                  key={slug}
                  href={`/${locale}/${siteConfig.productSlug}/${slug}`}
                  className="city-chip"
                >
                  {loc.name}
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

      {/* FINAL CTA */}
      <section className="section final-cta">
        <div className="final-cta-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FINAL_CTA_BG} alt={tFinal('bgAlt')} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="container final-cta-inner">
          <span className="eyebrow eyebrow-light">{tFinal('eyebrow')}</span>
          <h3>{tFinal('h3')}</h3>
          <h5>{tFinal('body')}</h5>
          <WhatsAppButton href={waRedirect(locale)} label="final-cta" className="btn btn-wa">
            <WaIcon /> {tFinal('ctaLabel')}
          </WhatsAppButton>
        </div>
      </section>

      <SiteFooter locale={locale} />

      <PageStyles />
    </>
  );
}
