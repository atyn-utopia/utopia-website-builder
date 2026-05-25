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
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

const GALLERY_IMAGES = [
  '/gallery/3.png', '/gallery/4.png', '/gallery/5.png', '/gallery/6.png',
  '/gallery/7.png', '/gallery/8.png', '/gallery/9.png', '/gallery/10.png',
  '/gallery/11.png', '/gallery/12.png', '/gallery/13.png', '/gallery/14.png',
];
const BRAND_LOGO_ON_DARK = '/brand/abang-excavator-dark.png';
const HERO_OPERATOR_PHOTO = '/brand/hero-photo.png';
const FINAL_CTA_BG = '/bg/bg-2.webp';

export function generateStaticParams() {
  return locations.flatMap((loc) =>
    routing.locales.map((locale) => ({ locale, location: loc.slug })),
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

  const { core } = await getProducts();
  const fallbackEc200 = tProducts.raw('fallback.ec200') as { eyebrow: string; description: string; price: number; monthly: number };
  const fallbackEc400 = tProducts.raw('fallback.ec400') as { eyebrow: string; description: string; price: number; monthly: number };
  const productCards = [
    {
      slug: 'volvo-ec200',
      name: 'Volvo EC200',
      description: core.find((p) => p.slug === 'volvo-ec200')?.description ?? fallbackEc200.description,
      rentalPrice: core.find((p) => p.slug === 'volvo-ec200')?.rental_price ?? fallbackEc200.price,
      eyebrow: fallbackEc200.eyebrow,
      image: core.find((p) => p.slug === 'volvo-ec200')?.photos[0]?.url ?? '/products/volvo-ec200.png',
    },
    {
      slug: 'volvo-ec400',
      name: 'Volvo EC400',
      description: core.find((p) => p.slug === 'volvo-ec400')?.description ?? fallbackEc400.description,
      rentalPrice: core.find((p) => p.slug === 'volvo-ec400')?.rental_price ?? fallbackEc400.price,
      eyebrow: fallbackEc400.eyebrow,
      image: core.find((p) => p.slug === 'volvo-ec400')?.photos[0]?.url ?? '/products/volvo-ec400.png',
    },
  ];
  const calcRates = {
    ec200: { daily: Number(productCards[0].rentalPrice), monthly: fallbackEc200.monthly },
    ec400: { daily: Number(productCards[1].rentalPrice), monthly: fallbackEc400.monthly },
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

      <nav className="loc-breadcrumb container" aria-label="Breadcrumb">
        <Link href={`/${locale}`}>{tLocPage('breadcrumbHome')}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${locale}#locations`}>{tLocPage('breadcrumbLocations')}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{loc.name}</span>
      </nav>

      <section className="loc-hero">
        <div className="loc-hero-bg" aria-hidden="true" />
        <div className="container loc-hero-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND_LOGO_ON_DARK} alt="Abang Excavator" className="loc-hero-logo" />
          <span className="eyebrow eyebrow-light">OPERATOR STANDBY · {loc.name.toUpperCase()}</span>
          <h1>{tLocPage('h1Template', { location: loc.name })}</h1>
          <h2>{tLocPage('h2Template', { state: loc.state })}</h2>
          <p className="loc-hero-support">{tLocPage('introTemplate', { location: loc.name, state: loc.state })}</p>
          <div className="loc-hero-cta">
            <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`hero-${loc.slug}`} className="btn btn-wa">
              <WaIcon /> {tHero('ctaPrimary')}
            </WhatsAppButton>
            <a href="#calculator" className="loc-hero-secondary">{tHero('ctaSecondary')}</a>
          </div>
          <Image src={HERO_OPERATOR_PHOTO} alt={tHero('imageAlt')} width={1000} height={700} priority className="loc-hero-operator" />
        </div>
      </section>

      <MarketingMarquee locale={locale} variant="light" />

      <section className="loc-brand-strip">
        <div className="container">
          <p className="loc-brand-eyebrow">{tBrand('eyebrow')}</p>
          <div className="loc-brand-track no-scrollbar">
            <div className="marquee-track">
              {[...brandItems, ...brandItems].map((label, i) => (
                <span key={i} className="loc-brand-chip">{label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="loc-usp">
        <div className="container">
          <div className="loc-usp-panel">
            {uspItems.map((u, i) => (
              <div key={i} className="loc-usp-cell">
                <span className="loc-usp-icon">
                  {i === 0 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M3 17h13V5H3v12Z" /><path d="M16 9h4l3 4v4h-7" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg>}
                  {i === 1 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M12 3a5 5 0 0 0-5 5v3H4a1 1 0 0 0-1 1v3h18v-3a1 1 0 0 0-1-1h-3V8a5 5 0 0 0-5-5Z" /><path d="M3 18h18v3H3z" /></svg>}
                  {i === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M21 12L12 21 3 12l9-9 9 9Z" /><circle cx="9" cy="9" r="1.5" fill="currentColor" /></svg>}
                </span>
                <h4>{u.title}</h4>
                <p>{u.body}</p>
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
            <p>{tProducts('intro')}</p>
          </div>
          <div className="loc-products-grid">
            {productCards.map((p) => {
              const monthly = p.slug === 'volvo-ec200' ? fallbackEc200.monthly : fallbackEc400.monthly;
              return (
                <article key={p.slug} className="loc-product-card" data-product={p.slug}>
                  <div className="loc-product-media">
                    <span className="loc-product-tag">{p.eyebrow}</span>
                    <Image src={p.image} alt={tProducts('imageAltTemplate', { model: p.name })} width={600} height={600} />
                  </div>
                  <div className="loc-product-body">
                    <h4 className="loc-product-title">{p.name}</h4>
                    <p className="loc-product-desc">{p.description}</p>
                    <div className="loc-product-prices">
                      <div className="loc-price-cell">
                        <span className="loc-price-label">{tProducts('priceDailyLabel')}</span>
                        <span className="loc-price-value">{tProducts('priceDaily', { price: Number(p.rentalPrice).toLocaleString() })}</span>
                      </div>
                      <div className="loc-price-divider" aria-hidden="true" />
                      <div className="loc-price-cell">
                        <span className="loc-price-label">{tProducts('priceMonthlyLabel')}</span>
                        <span className="loc-price-value">{tProducts('priceMonthly', { price: Number(monthly).toLocaleString() })}</span>
                      </div>
                    </div>
                    <WhatsAppButton href={waRedirect(locale, `${p.name} di ${loc.name}`, loc.slug)} label={`product-${p.slug}-${loc.slug}`} className="btn btn-wa loc-product-cta">
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

      <section id="calculator" className="section bg-blueprint-glow loc-calc-section">
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

      <section className="section bg-paper">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tProcess('eyebrow')}</span>
            <h3>{tProcess('h3')}</h3>
          </div>
          <div className="loc-process-grid">
            {processSteps.map((s, i) => (
              <div key={i} className="loc-process-card">
                <span className="loc-process-num">{String(i + 1).padStart(2, '0')}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section loc-why-section">
        <div className="loc-why-bg" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow-light">{tWhy('eyebrow')}</span>
            <h3 style={{ color: '#fff' }}>{tWhy('h3')}</h3>
          </div>
          <div className="loc-why-grid">
            {whyItems.map((w, i) => (
              <div key={i} className="loc-why-card">
                <h4>{w.title}</h4>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tReviews('eyebrow')}</span>
            <h3>{tReviews('h3')}</h3>
            <p className="loc-reviews-aggregate"><GoogleG size={18} /> {tReviews('aggregate')}</p>
          </div>
          <div className="loc-reviews-grid">
            {reviewItems.map((r, i) => (
              <article key={i} className="loc-review-card">
                <span className="loc-review-g"><GoogleG size={22} /></span>
                <span className="loc-review-source">{tReviews('postedOn')}</span>
                <StarRow count={r.stars} />
                <p className="loc-review-body">{r.body}</p>
                <div>
                  <p className="loc-review-author">{r.name}</p>
                  <p className="loc-review-suburb">{r.suburb}</p>
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
            <p>{tGallery('intro')}</p>
          </div>
          <div className="loc-gallery-grid">
            {GALLERY_IMAGES.map((src, i) => (
              <div key={i} className="loc-gallery-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Construction site gallery image ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section bg-paper">
        <div className="container loc-faq-container">
          <div className="section-head">
            <span className="eyebrow">{tFaq('eyebrow')}</span>
            <h3>{tFaq('h3')} — {loc.name}</h3>
          </div>
          <div className="loc-faq-list">
            {localisedFaq.map((f, i) => (
              <details key={i} className="loc-faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
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
            <p>{tLoc('intro')}</p>
          </div>
          <div className="loc-top-cities">
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
          <div className="loc-states-grid">
            {regionOrder.map((region) => {
              const cities = locationsByState[region] || [];
              if (cities.length === 0) return null;
              const key = regionKeys[region];
              return (
                <div key={region} className="loc-state-block">
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
            <div className="loc-nearby-grid">
              {nearby.map((n) => (
                <Link key={n.slug} href={`/${locale}/${siteConfig.productSlug}/${n.slug}`} className="loc-nearby-card">
                  <span className="loc-nearby-name">{n.name}</span>
                  <span className="loc-nearby-state">{n.state}</span>
                  <span className="loc-nearby-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section loc-final-cta">
        <div className="loc-final-cta-bg" aria-hidden="true">
          <Image src={FINAL_CTA_BG} alt="" fill priority={false} style={{ objectFit: 'cover' }} sizes="100vw" />
        </div>
        <div className="container loc-final-cta-inner">
          <span className="eyebrow eyebrow-light">{tFinal('eyebrow')}</span>
          <h3>{tFinal('h3')} — {loc.name}</h3>
          <p>{tFinal('body')}</p>
          <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`final-cta-${loc.slug}`} className="btn btn-wa">
            <WaIcon /> {tFinal('ctaLabel')}
          </WhatsAppButton>
        </div>
      </section>

      <SiteFooter locale={locale} />

      <style>{`
        .loc-breadcrumb { display: flex; flex-wrap: wrap; gap: 8px; padding: 18px var(--gut); font-size: 13px; color: var(--ink-muted); }
        .loc-breadcrumb a { color: var(--brand-orange-deep); font-weight: 600; }
        .loc-breadcrumb [aria-current="page"] { color: var(--brand-charcoal); font-weight: 600; }
        .loc-breadcrumb span[aria-hidden="true"] { color: var(--ink-faint); }
        .loc-hero { position: relative; color: #fff; padding: 56px 0 80px; overflow: hidden; }
        .loc-hero-bg { position: absolute; inset: 0; background-color: var(--brand-charcoal); background-image: var(--gradient-hero-glow), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: auto, 56px 56px, 56px 56px; z-index: 0; }
        .loc-hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; max-width: 1100px; margin: 0 auto; }
        .loc-hero-logo { width: clamp(96px, 12vw, 160px); height: auto; filter: drop-shadow(0 14px 24px rgba(242, 108, 31, 0.22)); margin: 0 0 16px; }
        .loc-hero-operator { width: 100%; max-width: 700px; height: auto; margin: 18px auto 0; filter: drop-shadow(0 24px 48px rgba(0,0,0,0.55)); }
        .loc-hero-inner h1 { font-size: clamp(1.875rem, 4vw, 3rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; color: #fff; margin: 4px 0 0; text-wrap: balance; }
        .loc-hero-inner h2 { font-size: clamp(1rem, 1.6vw, 1.25rem); font-weight: 600; line-height: 1.35; letter-spacing: -0.01em; color: rgba(255,255,255,0.82); margin: 0; }
        .loc-hero-support { font-size: clamp(0.95rem, 1.1vw, 1.0625rem); line-height: 1.7; color: rgba(255,255,255,0.66); margin: 0; max-width: 56ch; }
        .loc-hero-cta { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 8px; }
        @media (min-width: 640px) { .loc-hero-cta { flex-direction: row; } }
        .loc-hero-secondary { color: var(--brand-orange-bright); font-weight: 700; font-size: 15px; }
        .loc-brand-strip { background: var(--brand-paper); padding: 32px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .loc-brand-eyebrow { font-family: var(--font-mono-stack); font-weight: 700; font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-muted); margin: 0 0 16px; text-align: center; }
        .loc-brand-track { overflow: hidden; mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%); }
        .loc-brand-chip { color: var(--ink-muted); font-weight: 600; font-size: 14px; letter-spacing: 0.01em; padding: 8px 18px; border: 1px solid var(--line); border-radius: 999px; flex-shrink: 0; }
        .loc-usp { padding: 56px 0; background: #fff; }
        .loc-usp-panel { display: grid; grid-template-columns: 1fr; max-width: 1080px; margin: 0 auto; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-card); box-shadow: var(--shadow-md); overflow: hidden; }
        @media (min-width: 768px) { .loc-usp-panel { grid-template-columns: repeat(3, 1fr); } }
        .loc-usp-cell { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px 24px; border-bottom: 1px solid var(--line); }
        .loc-usp-cell:last-child { border-bottom: none; }
        @media (min-width: 768px) { .loc-usp-cell { border-bottom: none; border-right: 1px solid var(--line); } .loc-usp-cell:last-child { border-right: none; } }
        .loc-usp-icon { width: 60px; height: 60px; display: grid; place-items: center; border-radius: 18px; background: linear-gradient(135deg, var(--brand-orange-pale) 0%, #FFE2CB 100%); box-shadow: inset 0 0 0 2px var(--brand-orange-ring); color: var(--brand-orange-deep); margin-bottom: 14px; }
        .loc-usp-cell h4 { font-size: 17px; font-weight: 700; color: var(--brand-charcoal); letter-spacing: -0.015em; margin: 0; }
        .loc-usp-cell p { font-size: 14px; line-height: 1.55; color: var(--ink-muted); margin: 6px 0 0; max-width: 30ch; }
        .loc-products-grid { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 980px; margin: 0 auto; }
        @media (min-width: 768px) { .loc-products-grid { grid-template-columns: 1fr 1fr; gap: 28px; } }
        .loc-product-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-card); overflow: hidden; display: flex; flex-direction: column; transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out); }
        .loc-product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--brand-orange-ring); }
        .loc-product-media { position: relative; aspect-ratio: 1 / 1; background-color: var(--brand-charcoal); background-image: radial-gradient(80% 60% at 50% 110%, rgba(242,108,31,0.22) 0%, rgba(242,108,31,0) 65%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: auto, 36px 36px, 36px 36px; padding: 20px; display: grid; place-items: center; overflow: hidden; }
        .loc-product-media img { width: 100%; height: 100%; object-fit: contain; object-position: center; }
        .loc-product-tag { position: absolute; top: 14px; left: 14px; font-family: var(--font-mono-stack); font-weight: 700; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; background: var(--brand-orange); color: #fff; padding: 7px 11px; border-radius: 999px; z-index: 2; box-shadow: 0 6px 14px rgba(242,108,31,0.35); }
        .loc-product-body { padding: 22px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .loc-product-title { font-size: 22px; font-weight: 800; color: var(--brand-charcoal); letter-spacing: -0.02em; line-height: 1.15; margin: 0; }
        .loc-product-desc { font-size: 14px; line-height: 1.55; color: var(--ink-muted); margin: 0 0 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .loc-product-prices { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; background: var(--brand-orange-pale); border: 1px solid var(--brand-orange-ring); border-radius: var(--radius-md); padding: 12px 14px; margin: 6px 0 14px; }
        .loc-price-cell { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
        .loc-price-label { font-family: var(--font-mono-stack); font-weight: 700; font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--brand-orange-deep); }
        .loc-price-value { font-family: var(--font-mono-stack); font-weight: 700; font-size: 17px; color: var(--brand-charcoal); letter-spacing: -0.01em; line-height: 1; }
        .loc-price-divider { width: 1px; height: 28px; background: var(--brand-orange-ring); }
        .loc-product-cta { margin-top: auto; width: 100%; }
        .loc-calc-section { color: #fff; }
        .loc-process-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .loc-process-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 980px) { .loc-process-grid { grid-template-columns: repeat(4, 1fr); } }
        .loc-process-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-card); padding: 28px 22px; display: flex; flex-direction: column; gap: 10px; }
        .loc-process-num { font-family: var(--font-mono-stack); font-weight: 700; font-size: 28px; color: var(--brand-orange); line-height: 1; }
        .loc-process-card h4 { font-size: 17px; font-weight: 700; margin: 4px 0 0; color: var(--brand-charcoal); }
        .loc-process-card p { font-size: 14.5px; color: var(--ink-muted); line-height: 1.6; margin: 0; }
        .loc-why-section { position: relative; color: #fff; overflow: hidden; }
        .loc-why-bg { position: absolute; inset: 0; z-index: 0; background-image: url('/bg/bg-3.webp'); background-size: cover; background-position: center; }
        .loc-why-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(15,15,15,0.92), rgba(15,15,15,0.82)); }
        .loc-why-section .container { position: relative; z-index: 1; }
        .loc-why-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .loc-why-grid { grid-template-columns: 1fr 1fr; } }
        .loc-why-card { background: rgba(255,255,255,0.06); border: 1px solid var(--line-on-dark); border-left: 3px solid var(--brand-orange); border-radius: var(--radius-md); padding: 26px 24px; backdrop-filter: blur(6px); }
        .loc-why-card h4 { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 8px; letter-spacing: -0.015em; }
        .loc-why-card p { font-size: 14.5px; line-height: 1.65; color: rgba(255,255,255,0.78); margin: 0; }
        .loc-reviews-aggregate { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; color: var(--ink-muted); background: #fff; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); }
        .loc-reviews-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .loc-reviews-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .loc-reviews-grid { grid-template-columns: repeat(3, 1fr); } }
        .loc-review-card { position: relative; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-card); padding: 24px 22px; display: flex; flex-direction: column; gap: 12px; box-shadow: var(--shadow-sm); }
        .loc-review-g { position: absolute; top: 18px; right: 18px; display: inline-flex; }
        .loc-review-source { font-family: var(--font-mono-stack); font-weight: 700; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-muted); }
        .loc-review-body { font-size: 14.5px; line-height: 1.65; color: var(--ink); margin: 0; }
        .loc-review-author { font-size: 14px; font-weight: 700; color: var(--brand-charcoal); margin: 0; }
        .loc-review-suburb { font-size: 12.5px; color: var(--ink-muted); margin: 2px 0 0; }
        .loc-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 640px) { .loc-gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
        @media (min-width: 1024px) { .loc-gallery-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        .loc-gallery-item { position: relative; aspect-ratio: 1 / 1; border-radius: var(--radius-md); overflow: hidden; background: var(--brand-grey-soft); }
        .loc-gallery-item img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
        .loc-faq-container { max-width: 860px; }
        .loc-faq-list { display: flex; flex-direction: column; gap: 12px; }
        .loc-faq-item { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-md); overflow: hidden; }
        .loc-faq-item summary { padding: 18px 22px; font-weight: 600; font-size: 15.5px; color: var(--brand-charcoal); cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .loc-faq-item summary::-webkit-details-marker { display: none; }
        .loc-faq-item summary::after { content: '+'; font-weight: 700; color: var(--brand-orange); font-size: 22px; }
        .loc-faq-item[open] summary::after { content: '−'; }
        .loc-faq-item p { padding: 0 22px 20px; font-size: 14.5px; line-height: 1.7; color: var(--ink-muted); margin: 0; }
        .loc-top-cities { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 40px; }
        .loc-city-chip { padding: 8px 16px; background: #fff; border: 1px solid var(--line); border-radius: 999px; font-weight: 600; font-size: 13.5px; color: var(--brand-charcoal); }
        .loc-city-chip:hover { background: var(--brand-orange-pale); border-color: var(--brand-orange-ring); color: var(--brand-orange-deep); }
        .loc-city-chip.is-current { background: var(--brand-charcoal); border-color: var(--brand-charcoal); color: #fff; }
        .loc-states-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
        @media (min-width: 640px) { .loc-states-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .loc-states-grid { grid-template-columns: repeat(3, 1fr); } }
        .loc-state-block h4 { font-family: var(--font-mono-stack); font-weight: 700; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--brand-orange-deep); margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid var(--brand-orange-ring); }
        .loc-state-block ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .loc-state-block a { color: var(--ink-muted); font-size: 14px; }
        .loc-state-block a:hover { color: var(--brand-orange-deep); }
        .loc-nearby-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
        .loc-nearby-card { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-md); padding: 16px 18px; transition: border-color var(--dur) var(--ease-out), transform var(--dur) var(--ease-out); }
        .loc-nearby-card:hover { border-color: var(--brand-orange-ring); transform: translateY(-2px); }
        .loc-nearby-name { color: var(--brand-charcoal); font-weight: 700; font-size: 15px; flex: 1; }
        .loc-nearby-state { font-family: var(--font-mono-stack); font-weight: 600; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
        .loc-nearby-arrow { color: var(--brand-orange); font-weight: 700; }
        .loc-final-cta { position: relative; color: #fff; overflow: hidden; padding: 80px 0; }
        .loc-final-cta-bg { position: absolute; inset: 0; z-index: 0; }
        .loc-final-cta-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(15,15,15,0.78), rgba(15,15,15,0.92)); }
        .loc-final-cta-inner { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 760px; margin: 0 auto; }
        .loc-final-cta-inner h3 { font-size: clamp(1.75rem, 3.2vw, 2.5rem); font-weight: 800; color: #fff; letter-spacing: -0.025em; line-height: 1.15; margin: 0; }
        .loc-final-cta-inner p { font-size: clamp(1rem, 1.25vw, 1.125rem); line-height: 1.7; color: rgba(255,255,255,0.78); margin: 0; }
      `}</style>
    </>
  );
}
