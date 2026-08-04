import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import {
  locations,
  getLocationsByState,
  getNearbyLocations,
  regionOrder,
  regionKeys,
  topCitySlugs,
} from '@/config/locations';
import { getProducts, type PriceLine } from '@/lib/webcore';
import { fallbackProducts } from '@/config/products';
import { waRedirect } from '@/lib/waRedirect';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import MarketingMarquee from '@/components/MarketingMarquee';
import PageStyles from '@/components/PageStyles';
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

const GALLERY_IMAGES = [
  '/gallery/1.png', '/gallery/2.png', '/gallery/3.png', '/gallery/4.png', '/gallery/5.png', '/gallery/6.png',
  '/gallery/7.png', '/gallery/8.png', '/gallery/9.png', '/gallery/10.png', '/gallery/11.png', '/gallery/12.png',
];
const BRAND_LOGO_ON_DARK = '/brand/tankpro-light.png';
const FINAL_CTA_BG = '/brand/final-cta.png';

export const dynamicParams = true;
export function generateStaticParams() {
  return topCitySlugs.flatMap((slug) =>
    routing.locales.map((locale) => ({ locale, location: slug })),
  );
}

function wasPrice(price: number): number {
  return Math.round((price * 1.15) / 100) * 100;
}

function deriveCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('filter') || n.includes('penapis')) return 'Water Filter';
  if (n.includes('combo') || n.includes('pakej')) return 'Combo Package';
  if (n.includes('pump') || n.includes('pam') || n.includes('tsunami') || n.includes('grundfos') || n.includes('hitachi') || /\bhp\b/.test(n)) return 'Water Pump';
  return 'Water Tank';
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
    routing.locales.map((l) => [l, `${localeHref(l)}${path}`]),
  );
  languages['x-default'] = `${localeHref(routing.defaultLocale)}${path}`;
  return {
    title,
    description,
    alternates: { canonical: `${localeHref(locale)}${path}`, languages },
    openGraph: { title, description, url: `${localeHref(locale)}${path}`, type: 'website' },
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

function WhyIcon({ i }: { i: number }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (i === 0) return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
  if (i === 1) return (<svg {...common}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>);
  if (i === 2) return (<svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" /></svg>);
  return (<svg {...common}><path d="M4 12a8 8 0 0 1 16 0v5a3 3 0 0 1-3 3h-2" /><rect x="3" y="12" width="4" height="6" rx="1" /><rect x="17" y="12" width="4" height="6" rx="1" /></svg>);
}

function DropletTile({ label }: { label: string }) {
  return (
    <div className="product-tile" aria-label={label}>
      <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
        <path d="M32 6C32 6 50 27 50 40a18 18 0 1 1-36 0C14 27 32 6 32 6Z" fill="rgba(255,255,255,0.9)" />
        <path d="M25 36a8 8 0 0 0 3 10" fill="none" stroke="#0E7BD6" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
      <span>{label}</span>
    </div>
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
  const tCombo = await getTranslations({ locale, namespace: 'combo' });
  const tProcess = await getTranslations({ locale, namespace: 'process' });
  const tWhy = await getTranslations({ locale, namespace: 'whyUs' });
  const tReviews = await getTranslations({ locale, namespace: 'reviews' });
  const tGallery = await getTranslations({ locale, namespace: 'gallery' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const tLoc = await getTranslations({ locale, namespace: 'locations' });
  const tFinal = await getTranslations({ locale, namespace: 'finalCta' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const { core, additional } = await getProducts();
  const dbProducts = [...core, ...additional];
  const products = dbProducts.length
    ? dbProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        description: p.description ?? '',
        price: Number(p.sale_price ?? p.rental_price ?? 0),
        image: p.photos?.[0]?.url ?? null,
        category: deriveCategory(p.name),
        prices: p.prices ?? [],
      }))
    : fallbackProducts.map((p) => ({ ...p, prices: [] as PriceLine[] }));

  // One featured Water Tank, the rest (pumps) render in a 4-up row below.
  const featured = products.find((p) => p.category === 'Water Tank') ?? products[0];
  const pumpProducts = products.filter((p) => p.slug !== featured?.slug && p.category === 'Water Pump');
  const otherProducts = products.filter((p) => p.slug !== featured?.slug && p.category !== 'Water Pump');
  const fromWord = locale === 'en' ? 'From' : locale === 'zh' ? '起' : 'Dari';

  type PumpGroup = { brand: string; category: string; image: string | null; description: string; slug: string; variants: { hp: string; price: number }[] };
  const pumpGroups: PumpGroup[] = Object.values(
    pumpProducts.reduce((acc: Record<string, PumpGroup>, p) => {
      const brand = p.name.split(' ')[0];
      if (!acc[brand]) acc[brand] = { brand, category: p.category, image: p.image, description: p.description, slug: `pump-${brand.toLowerCase()}`, variants: [] };
      acc[brand].variants.push({ hp: p.name.slice(brand.length).trim(), price: p.price });
      return acc;
    }, {}),
  );
  const pumpCards = [...pumpGroups, ...otherProducts.map((p) => ({ brand: p.name, category: p.category, image: p.image, description: p.description, slug: p.slug, variants: [{ hp: fromWord, price: p.price }] }))];

  const uspItems = tUsp.raw('items') as { title: string; body: string }[];
  const brandItems = tBrand.raw('items') as string[];
  const comboItems = tCombo.raw('items') as { name: string; spec: string; price: string; tag: string }[];
  const processSteps = tProcess.raw('steps') as { title: string; body: string }[];
  const whyItems = tWhy.raw('items') as { title: string; body: string }[];
  const reviewItems = tReviews.raw('items') as { name: string; suburb: string; stars: number; body: string }[];
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];
  const galleryAlts = tGallery.raw('alts') as string[];
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
          { name: tLocPage('breadcrumbHome'), url: `${localeHref(locale)}` },
          { name: tLocPage('breadcrumbLocations'), url: `${localeHref(locale)}#locations` },
          { name: loc.name, url: `${localeHref(locale)}/${siteConfig.productSlug}/${loc.slug}` },
        ]}
      />
      {products.map((p) => (
        <ProductSchema
          key={p.slug}
          name={p.name}
          slug={p.slug}
          description={p.description}
          rentalPrice={p.price}
          image={p.image ?? `${siteConfig.url}/brand/tankpro-dark.png`}
          areaServed={loc.name}
        />
      ))}
      <FAQSchema items={localisedFaq} />

      {/* HERO */}
      <section className="hero hero-solo">
        <div className="hero-bg" role="img" aria-label={tHero('bgAlt')} />
        <div className="container hero-grid hero-grid-solo">
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
            <span className="eyebrow eyebrow-light">{siteConfig.productName.toUpperCase()} · {loc.name.toUpperCase()}</span>
            <h1>{tLocPage('h1Template', { location: loc.name })}</h1>
            <h2>{tLocPage('h2Template', { state: loc.state })}</h2>
            <h5 className="hero-support">{tLocPage('introTemplate', { location: loc.name, state: loc.state })}</h5>
            <div className="hero-cta-row">
              <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`hero-${loc.slug}`} className="btn btn-wa">
                <WaIcon /> {tHero('ctaPrimary')}
              </WhatsAppButton>
              <a href="#packages" className="hero-secondary">{tHero('ctaSecondary')}</a>
            </div>
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
                  {i === 0 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <path d="M9 27 C9 15, 16 7, 16 7 C16 7, 23 15, 23 27 Z" fill="currentColor" stroke="none" />
                      <path d="M6 27 H26" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <path d="M6 14 L16 6 L26 14 V26 H6 Z" fill="currentColor" stroke="none" />
                      <path d="M13 26 V18 H19 V26" stroke="#0A2540" strokeWidth="2" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <rect x="5" y="9" width="22" height="14" rx="2" fill="currentColor" stroke="none" />
                      <text x="16" y="19" textAnchor="middle" fontSize="7" fontWeight="800" fill="#0A2540" stroke="none">RM</text>
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

      {/* BRAND STRIP — trust brands, mirrors the homepage (below the USP bar) */}
      <section className="brand-strip" aria-labelledby="brand-strip-heading-loc">
        <div className="container">
          <h5 id="brand-strip-heading-loc" className="brand-strip-eyebrow">{tBrand('eyebrow')}</h5>
          <div className="brand-strip-track no-scrollbar">
            <div className="marquee-track">
              {[...brandItems, ...brandItems].map((label, i) => (
                <span key={i} className="brand-chip">{label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS — featured water tank + a row of water pumps */}
      <section id="products" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tProducts('eyebrow')}</span>
            <h3>{tProducts('h3')}</h3>
            <h4>{tProducts('intro')}</h4>
          </div>

          {featured && (
            <article className="product-feature" data-product={featured.slug}>
              <ProductImpressionTracker slug={featured.slug} />
              <div className="product-feature-media">
                <span className="product-tag">{featured.category}</span>
                {featured.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featured.image} alt={tProducts('imageAltTemplate', { model: featured.name })} loading="lazy" decoding="async" />
                ) : (
                  <DropletTile label={featured.category} />
                )}
              </div>
              <div className="product-feature-body">
                <h4 className="product-title">{featured.name}</h4>
                <h5 className="product-desc">{featured.description}</h5>
                {featured.prices.length > 0 ? (
                  <div className="product-prices price-list">
                    {featured.prices.map((line, i) => (
                      <div className="price-line" key={i}>
                        {line.label}: RM {Number(line.amount).toLocaleString()}
                        {line.unit ? ' / ' + line.unit : ''}
                        {line.note ? <span className="price-note">{line.note}</span> : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="product-prices product-prices-single">
                    <div className="price-cell">
                      <span className="price-from-label">{fromWord}</span>
                      <div className="price-row">
                        <span className="price-value">RM {featured.price.toLocaleString()}</span>
                        <span className="price-was">RM {wasPrice(featured.price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
                <WhatsAppButton href={waRedirect(locale, `${featured.name} di ${loc.name}`, loc.slug)} label={`product-${featured.slug}-${loc.slug}`} className="btn btn-wa product-cta">
                  <WaIcon size={16} />
                  {tProducts('ctaTemplate', { model: featured.name })}
                </WhatsAppButton>
              </div>
            </article>
          )}

          <div className="pump-grid">
            {pumpCards.map((g) => (
              <article key={g.slug} className="product-card" data-product={g.slug}>
                <ProductImpressionTracker slug={g.slug} />
                <div className="product-media">
                  <span className="product-tag">{g.category}</span>
                  {g.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.image} alt={tProducts('imageAltTemplate', { model: g.brand })} loading="lazy" decoding="async" />
                  ) : (
                    <DropletTile label={g.category} />
                  )}
                </div>
                <div className="product-body">
                  <h4 className="product-title">{g.brand}</h4>
                  <h5 className="product-desc">{g.description}</h5>
                  <div className="pump-prices">
                    {g.variants.map((v) => (
                      <div key={v.hp} className="pump-price-row">
                        <span className="pump-hp">{v.hp}</span>
                        <span className="pump-price"><span className="pump-from">{fromWord}</span> RM {v.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <WhatsAppButton href={waRedirect(locale, `${g.brand} di ${loc.name}`, loc.slug)} label={`product-${g.slug}-${loc.slug}`} className="btn btn-wa product-cta">
                    <WaIcon size={16} />
                    {tProducts('ctaTemplate', { model: g.brand })}
                  </WhatsAppButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMBO PACKAGES */}
      <section id="packages" className="section combo-section">
        <div className="combo-bg" role="img" aria-label={tCombo('bgAlt')} />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow-light">{tCombo('eyebrow')}</span>
            <h3 style={{ color: '#fff' }}>{tCombo('h3')}</h3>
            <h5 className="combo-intro">{tCombo('intro')}</h5>
          </div>
          <div className="combo-grid">
            {comboItems.map((c, i) => (
              <article key={i} className={`combo-card${i === 0 ? ' combo-card-feature' : ''}`}>
                <span className="combo-cardtag">{c.tag}</span>
                <h4 className="combo-name">{c.name}</h4>
                <h5 className="combo-spec">{c.spec}</h5>
                <div className="combo-price">{c.price}</div>
                <WhatsAppButton
                  href={waRedirect(locale, `${c.name} — ${c.price} · ${loc.name}`, loc.slug)}
                  label={`combo-${i + 1}-${loc.slug}`}
                  className="btn btn-wa combo-cta"
                >
                  <WaIcon size={16} /> {tCombo('ctaLabel')}
                </WhatsAppButton>
              </article>
            ))}
          </div>
          <h6 className="combo-note">{tCombo('note')}</h6>
        </div>
      </section>

      <MarketingMarquee locale={locale} variant="dark" />

      <section className="section process-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tProcess('eyebrow')}</span>
            <h3>{tProcess('h3')}</h3>
          </div>
          <div className="steps-flow">
            {processSteps.map((s, i) => (
              <div key={i} className="step-item">
                <div className="step-badge">{i + 1}</div>
                <h5 className="step-title">{s.title}</h5>
                <h5 className="step-body">{s.body}</h5>
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
                <span className="why-icon"><WhyIcon i={i} /></span>
                <div>
                  <h5 className="why-title">{w.title}</h5>
                  <h5 className="why-body">{w.body}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tReviews('eyebrow')}</span>
            <h3>{tReviews('h3')}</h3>
            <h5 className="reviews-aggregate"><GoogleG size={18} /> {tReviews('aggregate')}</h5>
          </div>
          <div className="reviews-grid">
            {reviewItems.map((r, i) => (
              <article key={i} className="review-card">
                <span className="review-quote" aria-hidden="true">&ldquo;</span>
                <StarRow count={r.stars} />
                <h5 className="review-body">{r.body}</h5>
                <div className="review-foot">
                  <span className="review-avatar" aria-hidden="true">{r.name.charAt(0)}</span>
                  <div className="review-meta">
                    <h6 className="review-author">{r.name}</h6>
                    <h6 className="review-suburb">{r.suburb}</h6>
                  </div>
                  <span className="review-g"><GoogleG size={22} /></span>
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
                <div className="gallery-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="gallery-photo" src={src} alt={galleryAlts[i] ?? `TANKPRO ${loc.name} ${i + 1}`} loading="lazy" decoding="async" />
                  <span className="gallery-logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/tankpro-light.png" alt="TANKPRO Malaysia" />
                  </span>
                </div>
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
          box-shadow: 0 4px 10px rgba(14, 123, 214,0.32);
        }
        .breadcrumb span[aria-hidden="true"] {
          color: rgba(255,255,255,0.45);
          font-weight: 500;
        }
        .top-cities { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 40px; }
        .loc-city-chip { padding: 8px 16px; background: #fff; border: 1px solid var(--line); border-radius: 999px; font-weight: 600; font-size: 13.5px; color: var(--brand-charcoal); }
        .loc-city-chip:hover { background: var(--brand-orange-pale); border-color: var(--brand-orange-ring); color: var(--brand-orange-deep); }
        .loc-city-chip.is-current { background: var(--brand-charcoal); border-color: var(--brand-charcoal); color: #fff; }
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
