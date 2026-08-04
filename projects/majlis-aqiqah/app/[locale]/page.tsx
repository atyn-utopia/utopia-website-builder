import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localeAbs, localePath } from '@/lib/localeHref';
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
    routing.locales.map((l) => [l, `${localeAbs(l)}`]),
  );
  languages['x-default'] = `${localeAbs(routing.defaultLocale)}`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${localeAbs(locale)}`,
      languages,
    },
  };
}

// 12 images — a 2/3/4-column grid all divide evenly, so the last row is never
// half-empty at any breakpoint.
const GALLERY_IMAGES = [
  '/gallery/1.jpg',
  '/gallery/2.jpg',
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
];

const HERO_IMG = '/brand/hero-photo.jpg';
const FINAL_CTA_BG = '/bg/final-cta.jpg';

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

  // Packages come from Supabase (`products` + `product_photos`, ISR-revalidated hourly) so the
  // client's real pricing replaces these without a redeploy. The translated fallback list only
  // renders when the DB is unreachable — it is NOT the source of truth. The grid is driven by
  // whatever the query returns, so 1, 4 or 20 packages all lay out correctly.
  const fallbackPackages = tProducts.raw('fallback.items') as {
    slug: string; name: string; eyebrow: string; description: string; price: number; portions: string; includes: string[];
  }[];

  const productCards =
    core.length > 0
      ? core.map((p, i) => {
          const fb = fallbackPackages.find((f) => f.slug === p.slug);
          return {
            slug: p.slug,
            name: p.name,
            description: p.description ?? fb?.description ?? '',
            price: Number(p.sale_price ?? p.rental_price ?? fb?.price ?? 0),
            prices: p.prices ?? [],
            eyebrow: fb?.eyebrow ?? tProducts('tagDefault'),
            portions: fb?.portions ?? '',
            includes: fb?.includes ?? [],
            image: p.photos[0]?.url ?? `/products/pakej-${(i % 4) + 1}.jpg`,
          };
        })
      : fallbackPackages.map((f, i) => ({
          slug: f.slug,
          name: f.name,
          description: f.description,
          price: f.price,
          prices: [],
          eyebrow: f.eyebrow,
          portions: f.portions,
          includes: f.includes,
          image: `/products/pakej-${(i % 4) + 1}.jpg`,
        }));

  // Calculator rates are per head of livestock, keyed to the three package tiers.
  const priceOf = (slug: string, fallbackIndex: number) =>
    Number(
      productCards.find((p) => p.slug === slug)?.price ??
        productCards[fallbackIndex]?.price ??
        0,
    );
  const calcRates = {
    a: priceOf('pakej-aqiqah-a', 0),
    b: priceOf('pakej-aqiqah-b', 1),
    c: priceOf('pakej-aqiqah-c', 2),
    d: priceOf('pakej-aqiqah-d', 3),
  };

  const uspItems = tUsp.raw('items') as { title: string; body: string }[];
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
          price={p.price}
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
            <img src="/brand/majlis-aqiqah-dark.png" alt={tNav('logoAlt')} width={1400} height={374} className="hero-logo" />
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
                <span className="hero-stat-num">3,000+</span>
                <span className="hero-stat-label">{tHero('statFamilies')}</span>
              </div>
              <span className="hero-stat-div" aria-hidden="true" />
              <div>
                <span className="hero-stat-num">14</span>
                <span className="hero-stat-label">{tHero('statStates')}</span>
              </div>
              <span className="hero-stat-div" aria-hidden="true" />
              <div>
                <span className="hero-stat-num">100%</span>
                <span className="hero-stat-label">{tHero('statHalal')}</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="hero-image-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMG} alt={tHero('imageAlt')} width={1600} height={1137} className="hero-image-img" />
            </span>
            <span className="hero-float-tag">
              <span className="hero-float-tag__mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M12 2.6 20 5.6 V12 c0 5.2-3.5 8.6-8 10.2C7.5 20.6 4 17.2 4 12 V5.6 Z" fill="currentColor" />
                  <path d="M8.6 12.2 11 14.6 15.6 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="hero-float-tag__text">
                <h6 className="hero-float-tag__title">{tHero('floatTagTitle')}</h6>
                <h6 className="hero-float-tag__sub">{tHero('floatTagSub')}</h6>
              </span>
            </span>
          </div>
        </div>
      </section>

      <MarketingMarquee locale={locale} variant="light" />

      {/* USP BAR (no section heading) */}
      <section className="usp-bar" aria-labelledby="usp-heading">
        <h3 id="usp-heading" className="visually-hidden">{tUsp('srHeading')}</h3>
        <div className="container">
          <div className="usp-panel">
            {uspItems.map((u, i) => (
              <div key={i} className="usp-cell">
                <span className="usp-icon">
                  {/* 0 — sembelih ikut syariah: shield + crescent */}
                  {i === 0 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <path d="M16 3 L27 7 V15 C27 22, 22 26.5, 16 29 C10 26.5, 5 22, 5 15 V7 Z" fill="currentColor" stroke="none" />
                      <path d="M19.5 11 A5.5 5.5 0 1 0 19.5 21 A4.3 4.3 0 1 1 19.5 11 Z" fill="#FFFFFF" stroke="none" />
                      <path d="M22 13.4 l.9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.4 2.1-.3Z" fill="#FFFFFF" stroke="none" />
                    </svg>
                  )}
                  {/* 1 — masak, pek & hantar: covered serving dish */}
                  {i === 1 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <path d="M4 22 C4 14.5, 9.4 9, 16 9 C22.6 9, 28 14.5, 28 22 Z" fill="currentColor" stroke="none" />
                      <path d="M2.5 25.5 H29.5" />
                      <circle cx="16" cy="6" r="1.8" fill="currentColor" stroke="none" />
                      <path d="M11 17 C11 14.6, 13.2 13, 16 13 C18.8 13, 21 14.6, 21 17" stroke="rgba(255,255,255,0.45)" />
                    </svg>
                  )}
                  {/* 2 — harga telus: price tag with RM */}
                  {i === 2 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <circle cx="16" cy="16" r="12" fill="currentColor" stroke="none" />
                      <text x="16" y="20.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFFFF" stroke="none" fontFamily="system-ui, sans-serif">RM</text>
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
            <h5 className="products-note">{tProducts('note')}</h5>
            <h5 className="products-addons">{tProducts('addOns')}</h5>
          </div>
          <div className="products-grid">
            {productCards.map((p) => {
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
                    {p.includes.length > 0 && (
                      <div className="product-includes">
                        <h6 className="product-includes__label">{tProducts('includesLabel')}</h6>
                        <ul className="product-includes__list">
                          {p.includes.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                          <span className="price-label">{tProducts('priceHeadLabel')}</span>
                          <span className="price-value">{tProducts('priceHead', { price: Number(p.price).toLocaleString() })}</span>
                        </div>
                        <div className="price-divider" aria-hidden="true" />
                        <div className="price-cell">
                          <span className="price-label">{tProducts('portionsLabel')}</span>
                          <span className="price-value">{p.portions}</span>
                        </div>
                      </div>
                    )}
                    <WhatsAppButton
                      href={waRedirect(locale, `${p.name} — ${tProducts('priceHead', { price: String(p.price) })}`)}
                      label={`product-${p.slug}`}
                      className="btn btn-wa product-cta"
                    >
                      <WaIcon size={16} />
                      {tProducts('ctaLabel')}
                    </WhatsAppButton>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALCULATOR — special section */}
      <section id="calculator" className="section bg-girih-glow calc-section">
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
                <div className="review-meta">
                  <span className="review-avatar" aria-hidden="true">{r.name.charAt(0)}</span>
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
                <img src={src} alt={(tGallery.raw('alts') as string[])[i]} loading="lazy" decoding="async" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
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
          {/* One bound index: a headline band of the most-requested cities over
              one ruled row per state. Every town is a plain crawlable link. */}
          <div className="locations-index">
            <div className="top-cities">
              {topCitySlugs.map((slug) => {
                const loc = locations.find((l) => l.slug === slug);
                if (!loc) return null;
                return (
                  <Link
                    key={slug}
                    href={localePath(locale, `/${siteConfig.productSlug}/${slug}`)}
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
                          <Link href={localePath(locale, `/${siteConfig.productSlug}/${c.slug}`)}>{c.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
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
