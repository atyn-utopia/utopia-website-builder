import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { locations, getLocationsByState, regionOrder, regionKeys, topCitySlugs } from '@/config/locations';
import { getProducts, type PriceLine } from '@/lib/webcore';
import { fallbackProducts } from '@/config/products';
import { waRedirect } from '@/lib/waRedirect';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
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

// Real TANKPRO customer/install photos (12 distinct scenes — no repeats).
const GALLERY_IMAGES = [
  '/gallery/1.png', '/gallery/2.png', '/gallery/3.png', '/gallery/4.png', '/gallery/5.png', '/gallery/6.png',
  '/gallery/7.png', '/gallery/8.png', '/gallery/9.png', '/gallery/10.png', '/gallery/11.png', '/gallery/12.png',
];

const FINAL_CTA_BG = '/brand/final-cta.png';

/** Dummy "before" price (~15% higher, rounded to RM100) shown struck-through. */
function wasPrice(price: number): number {
  return Math.round((price * 1.15) / 100) * 100;
}

/** Derive a display category from a product name when the DB row has none. */
function deriveCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('filter') || n.includes('penapis')) return 'Water Filter';
  if (n.includes('combo') || n.includes('pakej')) return 'Combo Package';
  if (n.includes('pump') || n.includes('pam') || n.includes('tsunami') || n.includes('grundfos') || n.includes('hitachi') || /\bhp\b/.test(n)) return 'Water Pump';
  return 'Water Tank';
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

/** Icon set for the Why-Us cards (matched by index to the 4 items). */
function WhyIcon({ i }: { i: number }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (i === 0) return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>); // fast / one-day
  if (i === 1) return (<svg {...common}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>); // warranty / shield-check
  if (i === 2) return (<svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" /></svg>); // experienced / wrench
  return (<svg {...common}><path d="M4 12a8 8 0 0 1 16 0v5a3 3 0 0 1-3 3h-2" /><rect x="3" y="12" width="4" height="6" rx="1" /><rect x="17" y="12" width="4" height="6" rx="1" /></svg>); // support / headset
}

/** Simple droplet mark used as a branded tile when a product has no photo yet. */
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'hero' });
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

  // Group pump variants by brand → one card per brand listing its 3 HP prices.
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

  const locationsByState = getLocationsByState();

  return (
    <>
      <FomoBanner />
      <SiteHeader />

      {products.map((p) => (
        <ProductSchema
          key={p.slug}
          name={p.name}
          slug={p.slug}
          description={p.description}
          rentalPrice={p.price}
          image={p.image ?? `${siteConfig.url}/brand/tankpro-dark.png`}
        />
      ))}
      <FAQSchema items={faqItems} />

      {/* HERO — bg-hero (rooftop tanks) shows through on the right; text sits left */}
      <section className="hero hero-solo">
        <div className="hero-bg" role="img" aria-label={tHero('bgAlt')} />
        <div className="container hero-grid hero-grid-solo">
          <div className="hero-text">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tankpro-light.png" alt={tNav('logoAlt')} width={600} height={441} className="hero-logo" />
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
              <a href="#packages" className="hero-secondary">{tHero('ctaSecondary')}</a>
            </div>
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

      {/* BRAND STRIP — trust brands, sits below the USP bar */}
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
                <WhatsAppButton
                  href={waRedirect(locale, `${featured.name} — ${tProducts('priceFrom', { price: featured.price.toLocaleString() })}`)}
                  label={`product-${featured.slug}`}
                  className="btn btn-wa product-cta"
                >
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
                  <WhatsAppButton
                    href={waRedirect(locale, `${g.brand}`)}
                    label={`product-${g.slug}`}
                    className="btn btn-wa product-cta"
                  >
                    <WaIcon size={16} />
                    {tProducts('ctaTemplate', { model: g.brand })}
                  </WhatsAppButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMBO PACKAGES — project-unique special section */}
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
                  href={waRedirect(locale, `${c.name} — ${c.price}`)}
                  label={`combo-${i + 1}`}
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

      {/* PROCESS */}
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

      {/* REVIEWS */}
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
                <div className="gallery-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="gallery-photo" src={src} alt={galleryAlts[i] ?? `TANKPRO ${i + 1}`} loading="lazy" decoding="async" />
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
