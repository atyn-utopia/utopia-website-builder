import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localeAbs, localePath } from '@/lib/localeHref';
import { ogImage } from '@/lib/ogImage';
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
  '/gallery/1.jpg', '/gallery/2.jpg', '/gallery/3.jpg', '/gallery/4.jpg',
  '/gallery/5.jpg', '/gallery/6.jpg', '/gallery/7.jpg', '/gallery/8.jpg',
  '/gallery/9.jpg', '/gallery/10.jpg', '/gallery/11.jpg', '/gallery/12.jpg',
];
const BRAND_LOGO_ON_DARK = '/brand/majlis-aqiqah-dark.png';
const HERO_OPERATOR_PHOTO = '/brand/hero-photo.jpg';
const FINAL_CTA_BG = '/bg/final-cta.jpg';

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
    routing.locales.map((l) => [l, `${localeAbs(l)}${path}`]),
  );
  languages['x-default'] = `${localeAbs(routing.defaultLocale)}${path}`;
  return {
    title,
    description,
    alternates: { canonical: `${localeAbs(locale)}${path}`, languages },
    openGraph: {
      title,
      description,
      url: `${localeAbs(locale)}${path}`,
      type: 'website',
      siteName: siteConfig.brandName,
      images: [ogImage(title)],
    },
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
  // Same dynamic Supabase-backed package list as the homepage — see the comment there.
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
          { name: tLocPage('breadcrumbHome'), url: `${localeAbs(locale)}` },
          { name: tLocPage('breadcrumbLocations'), url: `${localeAbs(locale)}#locations` },
          { name: loc.name, url: `${localeAbs(locale)}/${siteConfig.productSlug}/${loc.slug}` },
        ]}
      />
      {productCards.map((p) => (
        <ProductSchema
          key={p.slug}
          name={p.name}
          slug={p.slug}
          description={p.description}
          price={p.price}
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
              <Link href={localePath(locale)}>{tLocPage('breadcrumbHome')}</Link>
              <span aria-hidden="true">›</span>
              <Link href={`${localePath(locale)}#locations`}>{tLocPage('breadcrumbLocations')}</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{loc.name}</span>
            </nav>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_LOGO_ON_DARK} alt={tNav('logoAlt')} width={600} height={441} className="hero-logo" />
            <span className="eyebrow eyebrow-light">OPERATOR STANDBY · {loc.name.toUpperCase()}</span>
            <h1>{tLocPage('h1Template', { location: loc.name })}</h1>
            <h2>{tLocPage('h2Template', { location: loc.name, state: loc.state })}</h2>
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
            <span className="hero-image-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_OPERATOR_PHOTO} alt={tHero('imageAlt')} width={1600} height={1137} className="hero-image-img" />
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
                    <WhatsAppButton href={waRedirect(locale, `${p.name} di ${loc.name}`, loc.slug)} label={`product-${p.slug}-${loc.slug}`} className="btn btn-wa product-cta">
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
          {/* Same bound index as the homepage; the city being viewed is marked
              current in the headline band. */}
          <div className="locations-index">
            <div className="top-cities">
              {topCitySlugs.map((slug) => {
                const c = locations.find((l) => l.slug === slug);
                if (!c) return null;
                return (
                  <Link
                    key={slug}
                    href={localePath(locale, `/${siteConfig.productSlug}/${slug}`)}
                    className={`city-chip ${slug === loc.slug ? 'is-current' : ''}`}
                    aria-current={slug === loc.slug ? 'page' : undefined}
                  >
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

      {nearby.length > 0 && (
        <section className="section bg-paper">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">{tLocPage('nearbyEyebrow')}</span>
              <h3>{tLocPage('nearbyHeading', { location: loc.name })}</h3>
            </div>
            <div className="nearby-grid">
              {nearby.map((n) => (
                <Link key={n.slug} href={localePath(locale, `/${siteConfig.productSlug}/${n.slug}`)} className="nearby-card">
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
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: var(--label-tracking);
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
        .breadcrumb a:hover { color: var(--brand-gold-bright); }
        .breadcrumb [aria-current="page"] {
          color: #fff;
          background: var(--brand-gold);
          padding: 3px 10px;
          border-radius: 999px;
          box-shadow: 0 4px 10px rgba(199, 154, 75,0.32);
        }
        .breadcrumb span[aria-hidden="true"] {
          color: rgba(255,255,255,0.45);
          font-weight: 500;
        }
        /* The locations index (.locations-index / .top-cities / .city-chip /
           .state-block) is shared with the homepage and lives in PageStyles —
           this page must not fork it. Only the extras below are location-only. */
        /* Two columns do not fit at 390px — the card's min-content width is
           ~187px against a 350px container, which pushed 11px of horizontal
           scroll onto every location page. Single column below 480px. */
        .nearby-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          max-width: 960px;
          margin: 0 auto;
        }
        @media (min-width: 480px) { .nearby-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 640px) { .nearby-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 980px) { .nearby-grid { grid-template-columns: repeat(4, 1fr); } }
        .nearby-card { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 16px 18px; transition: border-color var(--dur) var(--ease-out), transform var(--dur) var(--ease-out); }
        .nearby-card:hover { border-color: var(--brand-gold-ring); transform: translateY(-2px); }
        .nearby-name { color: var(--brand-emerald); font-weight: 700; font-size: 15px; flex: 1; }
        .nearby-state { font-family: var(--font-display); font-weight: 600; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
        .nearby-arrow { color: var(--brand-gold); font-weight: 700; }
      `}</style>
    </>
  );
}
