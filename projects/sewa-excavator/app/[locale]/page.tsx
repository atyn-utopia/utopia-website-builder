import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { locations, getLocationsByState, regionOrder, regionKeys, topCitySlugs } from '@/config/locations';
import { getProducts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import Calculator from '@/components/Calculator';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages,
    },
  };
}

// Pexels search-based image URLs (royalty-free, hot-linked). Until the user
// uploads real assets, these stand in for the gallery + hero composition.
const GALLERY_IMAGES = [
  'https://images.pexels.com/photos/2058134/pexels-photo-2058134.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/162539/architecture-building-construction-162539.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/210251/pexels-photo-210251.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2059706/pexels-photo-2059706.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2102427/pexels-photo-2102427.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2480807/pexels-photo-2480807.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2898199/pexels-photo-2898199.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3637795/pexels-photo-3637795.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2480862/pexels-photo-2480862.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2898202/pexels-photo-2898202.jpeg?auto=compress&cs=tinysrgb&w=900',
];

const HERO_EXCAVATOR_IMG = 'https://images.pexels.com/photos/2058134/pexels-photo-2058134.jpeg?auto=compress&cs=tinysrgb&w=1200';
const FINAL_CTA_BG = 'https://images.pexels.com/photos/2898199/pexels-photo-2898199.jpeg?auto=compress&cs=tinysrgb&w=1600';

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

  const { core } = await getProducts();

  // Build product cards — DB first, fallback values from translations if DB unavailable.
  const fallbackEc200 = tProducts.raw('fallback.ec200') as { eyebrow: string; description: string; price: number };
  const fallbackEc400 = tProducts.raw('fallback.ec400') as { eyebrow: string; description: string; price: number };

  const productCards = [
    {
      slug: 'volvo-ec200',
      name: 'Volvo EC200',
      description: core.find((p) => p.slug === 'volvo-ec200')?.description ?? fallbackEc200.description,
      rentalPrice: core.find((p) => p.slug === 'volvo-ec200')?.rental_price ?? fallbackEc200.price,
      eyebrow: fallbackEc200.eyebrow,
      image: core.find((p) => p.slug === 'volvo-ec200')?.photos[0]?.url ?? 'https://images.pexels.com/photos/2102427/pexels-photo-2102427.jpeg?auto=compress&cs=tinysrgb&w=700',
    },
    {
      slug: 'volvo-ec400',
      name: 'Volvo EC400',
      description: core.find((p) => p.slug === 'volvo-ec400')?.description ?? fallbackEc400.description,
      rentalPrice: core.find((p) => p.slug === 'volvo-ec400')?.rental_price ?? fallbackEc400.price,
      eyebrow: fallbackEc400.eyebrow,
      image: core.find((p) => p.slug === 'volvo-ec400')?.photos[0]?.url ?? 'https://images.pexels.com/photos/2059706/pexels-photo-2059706.jpeg?auto=compress&cs=tinysrgb&w=700',
    },
  ];

  const calcRates = {
    ec200: Number(productCards[0].rentalPrice),
    ec400: Number(productCards[1].rentalPrice),
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
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="eyebrow eyebrow-light">{tHero('eyebrow')}</span>
            <h1>
              {tHero('h1Part1')}{' '}
              <span className="hero-h1-accent">{tHero('h1Highlight')}</span>{' '}
              {tHero('h1Part2')}
            </h1>
            <h2>{tHero('h2')}</h2>
            <p className="hero-support">{tHero('supporting')}</p>
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
            <Image
              src={HERO_EXCAVATOR_IMG}
              alt={tHero('imageAlt')}
              width={900}
              height={700}
              priority
              className="hero-image-img"
            />
          </div>
        </div>
      </section>

      <div className="tread-divider" aria-hidden="true" />

      {/* BRAND STRIP */}
      <section className="brand-strip">
        <div className="container">
          <p className="brand-strip-eyebrow">{tBrand('eyebrow')}</p>
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
      <section className="usp-bar">
        <div className="container">
          <div className="usp-grid">
            {uspItems.map((u, i) => (
              <div key={i} className="usp-card">
                <span className="usp-icon">
                  {i === 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M3 17h13V5H3v12Z" /><path d="M16 9h4l3 4v4h-7" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg>
                  )}
                  {i === 1 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M12 3a5 5 0 0 0-5 5v3H4a1 1 0 0 0-1 1v3h18v-3a1 1 0 0 0-1-1h-3V8a5 5 0 0 0-5-5Z" /><path d="M3 18h18v3H3z" /></svg>
                  )}
                  {i === 2 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M21 12L12 21 3 12l9-9 9 9Z" /><circle cx="9" cy="9" r="1.5" fill="currentColor" /></svg>
                  )}
                </span>
                <h4>{u.title}</h4>
                <p>{u.body}</p>
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
            <p>{tProducts('intro')}</p>
          </div>
          <div className="products-grid">
            {productCards.map((p) => (
              <article key={p.slug} className="product-card" data-product={p.slug}>
                <div className="product-media">
                  <span className="product-tag">{p.eyebrow}</span>
                  <Image
                    src={p.image}
                    alt={tProducts('imageAltTemplate').replace('{model}', p.name)}
                    width={600}
                    height={450}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="product-body">
                  <h4 className="product-title">{p.name}</h4>
                  <p className="product-desc">{p.description}</p>
                  <p className="product-price">{tProducts('priceFrom').replace('{price}', String(p.rentalPrice).toLocaleString())}</p>
                  <WhatsAppButton
                    href={waRedirect(locale, `${p.name} — ${tProducts('priceFrom').replace('{price}', String(p.rentalPrice))}`)}
                    label={`product-${p.slug}`}
                    className="btn btn-wa product-cta"
                  >
                    <WaIcon size={16} />
                    {tProducts('ctaTemplate').replace('{model}', p.name)}
                  </WhatsAppButton>
                </div>
              </article>
            ))}
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

      <div className="tread-divider tread-divider-on-dark" aria-hidden="true" />

      {/* PROCESS */}
      <section className="section bg-paper">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tProcess('eyebrow')}</span>
            <h3>{tProcess('h3')}</h3>
          </div>
          <div className="process-grid">
            {processSteps.map((s, i) => (
              <div key={i} className="process-card">
                <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tWhy('eyebrow')}</span>
            <h3>{tWhy('h3')}</h3>
          </div>
          <div className="why-grid">
            {whyItems.map((w, i) => (
              <div key={i} className="why-card">
                <h4>{w.title}</h4>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section bg-paper">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tReviews('eyebrow')}</span>
            <h3>{tReviews('h3')}</h3>
            <p className="reviews-aggregate"><GoogleG size={18} /> {tReviews('aggregate')}</p>
          </div>
          <div className="reviews-grid">
            {reviewItems.map((r, i) => (
              <article key={i} className="review-card">
                <span className="review-g"><GoogleG size={22} /></span>
                <span className="review-source">{tReviews('postedOn')}</span>
                <StarRow count={r.stars} />
                <p className="review-body">{r.body}</p>
                <div>
                  <p className="review-author">{r.name}</p>
                  <p className="review-suburb">{r.suburb}</p>
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
            <p>{tGallery('intro')}</p>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((src, i) => (
              <div key={i} className="gallery-item">
                <Image src={src} alt={`Construction site gallery image ${i + 1}`} width={600} height={450} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
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
                <p>{f.a}</p>
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
            <p>{tLoc('intro')}</p>
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
          <Image src={FINAL_CTA_BG} alt="" fill priority={false} style={{ objectFit: 'cover' }} sizes="100vw" />
        </div>
        <div className="container final-cta-inner">
          <span className="eyebrow eyebrow-light">{tFinal('eyebrow')}</span>
          <h3>{tFinal('h3')}</h3>
          <p>{tFinal('body')}</p>
          <WhatsAppButton href={waRedirect(locale)} label="final-cta" className="btn btn-wa">
            <WaIcon /> {tFinal('ctaLabel')}
          </WhatsAppButton>
        </div>
      </section>

      <SiteFooter locale={locale} />

      <style>{`
        /* HERO */
        .hero {
          position: relative;
          color: #fff;
          padding: 80px 0 96px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background-color: var(--brand-charcoal);
          background-image:
            var(--gradient-hero-glow),
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: auto, 56px 56px, 56px 56px;
          z-index: 0;
        }
        .hero-grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (min-width: 880px) { .hero-grid { grid-template-columns: minmax(0,1fr) minmax(0,1.1fr); gap: 64px; } }
        .hero-text { display: flex; flex-direction: column; gap: 20px; text-align: center; }
        @media (min-width: 880px) { .hero-text { text-align: left; align-items: flex-start; } }
        .hero-text h1 {
          font-size: clamp(2.25rem, 5.5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: #fff;
          margin: 0;
        }
        .hero-h1-accent { color: var(--brand-orange); }
        .hero-text h2 {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: -0.01em;
          color: rgba(255,255,255,0.82);
          margin: 0;
        }
        .hero-support {
          font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
          line-height: 1.7;
          color: rgba(255,255,255,0.66);
          margin: 0;
          max-width: 56ch;
        }
        .hero-cta-row {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        @media (min-width: 640px) { .hero-cta-row { flex-direction: row; align-items: center; } }
        @media (min-width: 880px) { .hero-cta-row { justify-content: flex-start; } }
        .hero-secondary {
          color: var(--brand-orange-bright);
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.005em;
        }
        .hero-stats {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          margin-top: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (min-width: 880px) { .hero-stats { justify-content: flex-start; } }
        .hero-stats > div { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        @media (min-width: 880px) { .hero-stats > div { align-items: flex-start; } }
        .hero-stat-num {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 28px;
          color: #fff;
          line-height: 1;
        }
        .hero-stat-label {
          font-family: var(--font-mono-stack);
          font-weight: 500;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .hero-stat-div { width: 1px; height: 32px; background: var(--brand-orange); opacity: 0.4; }
        .hero-image { position: relative; display: flex; justify-content: center; }
        :global(.hero-image-img) {
          width: 100%;
          max-width: 560px;
          height: auto;
          filter: drop-shadow(0 30px 60px rgba(242, 108, 31, 0.25));
          border-radius: var(--radius-card);
        }

        /* BRAND STRIP */
        .brand-strip { background: var(--brand-paper); padding: 32px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .brand-strip-eyebrow {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin: 0 0 16px;
          text-align: center;
        }
        .brand-strip-track {
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
        .marquee-track { display: inline-flex; gap: 40px; padding: 6px 0; white-space: nowrap; will-change: transform; }
        .brand-chip {
          color: var(--ink-muted);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.01em;
          padding: 8px 18px;
          border: 1px solid var(--line);
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* USP */
        .usp-bar { padding: 56px 0; background: #fff; border-bottom: 1px solid var(--line); }
        .usp-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 768px) { .usp-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
        :global(.usp-card) {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          background: #fff; border: 1px solid var(--line);
          border-radius: var(--radius-card);
          padding: 28px 24px;
          transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
        }
        :global(.usp-card):hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        :global(.usp-icon) {
          width: 64px; height: 64px; display: grid; place-items: center;
          border-radius: 18px;
          background: linear-gradient(135deg, var(--brand-orange-pale) 0%, #FFE2CB 100%);
          box-shadow: inset 0 0 0 2px var(--brand-orange-ring);
          color: var(--brand-orange-deep);
          margin-bottom: 16px;
        }
        :global(.usp-card h4) {
          font-size: 18px; font-weight: 700;
          color: var(--brand-charcoal);
          letter-spacing: -0.015em;
          margin: 0;
        }
        :global(.usp-card p) {
          font-size: 14.5px; line-height: 1.6;
          color: var(--ink-muted);
          margin: 6px 0 0;
          max-width: 32ch;
        }

        /* PRODUCTS */
        .products-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .products-grid { grid-template-columns: 1fr 1fr; } }
        :global(.product-media) {
          position: relative;
          aspect-ratio: 4 / 3;
          background: linear-gradient(180deg, #FAFAFA 0%, #F0F0F0 100%);
          padding: 22px;
          display: grid; place-items: center;
        }
        :global(.product-media img) { width: 100%; height: 100%; object-fit: contain; }
        :global(.product-tag) {
          position: absolute; top: 14px; left: 14px;
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: var(--brand-charcoal);
          color: #fff;
          padding: 6px 10px;
          border-radius: 999px;
        }
        :global(.product-body) { padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        :global(.product-title) {
          font-size: 22px; font-weight: 700;
          color: var(--brand-charcoal); letter-spacing: -0.02em;
          margin: 0;
        }
        :global(.product-desc) {
          font-size: 15px; line-height: 1.55;
          color: var(--ink-muted);
          margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        :global(.product-price) {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 15px;
          color: var(--brand-orange);
          letter-spacing: -0.01em;
          margin: 0;
        }
        :global(.product-cta) { margin-top: auto; }

        /* CALC SECTION */
        .calc-section { color: #fff; }

        .bg-paper { background: var(--brand-paper); }

        /* PROCESS */
        .process-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .process-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 980px) { .process-grid { grid-template-columns: repeat(4, 1fr); } }
        .process-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          padding: 28px 22px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .process-num {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 28px;
          color: var(--brand-orange);
          line-height: 1;
        }
        .process-card h4 { font-size: 17px; font-weight: 700; margin: 4px 0 0; color: var(--brand-charcoal); }
        .process-card p { font-size: 14.5px; color: var(--ink-muted); line-height: 1.6; margin: 0; }

        /* WHY US */
        .why-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .why-grid { grid-template-columns: 1fr 1fr; } }
        .why-card {
          background: #fff;
          border: 1px solid var(--line);
          border-left: 3px solid var(--brand-orange);
          border-radius: var(--radius-md);
          padding: 24px;
        }
        .why-card h4 { font-size: 17px; font-weight: 700; color: var(--brand-charcoal); margin: 0 0 6px; letter-spacing: -0.015em; }
        .why-card p { font-size: 14.5px; line-height: 1.65; color: var(--ink-muted); margin: 0; }

        /* REVIEWS */
        .reviews-aggregate {
          display: inline-flex; align-items: center; gap: 8px;
          font-weight: 600; font-size: 14px;
          color: var(--ink-muted);
          background: #fff;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid var(--line);
        }
        .reviews-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .reviews-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .reviews-grid { grid-template-columns: repeat(3, 1fr); } }
        .review-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          padding: 24px 22px;
          display: flex; flex-direction: column; gap: 12px;
          box-shadow: var(--shadow-sm);
        }
        .review-g { position: absolute; top: 18px; right: 18px; display: inline-flex; }
        .review-source {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .stars { display: inline-flex; gap: 2px; }
        .review-body { font-size: 14.5px; line-height: 1.65; color: var(--ink); margin: 0; }
        .review-author { font-size: 14px; font-weight: 700; color: var(--brand-charcoal); margin: 0; }
        .review-suburb { font-size: 12.5px; color: var(--ink-muted); margin: 2px 0 0; }

        /* GALLERY */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        @media (min-width: 768px) { .gallery-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } }
        .gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #f3f4f6;
        }

        /* FAQ */
        .faq-container { max-width: 860px; }
        .faq-list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .faq-item summary {
          padding: 18px 22px;
          font-weight: 600;
          font-size: 15.5px;
          color: var(--brand-charcoal);
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after { content: '+'; font-weight: 700; color: var(--brand-orange); font-size: 22px; }
        .faq-item[open] summary::after { content: '−'; }
        .faq-item p { padding: 0 22px 20px; font-size: 14.5px; line-height: 1.7; color: var(--ink-muted); margin: 0; }

        /* LOCATIONS */
        .top-cities {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
          margin-bottom: 40px;
        }
        .city-chip {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 999px;
          font-weight: 600;
          font-size: 13.5px;
          color: var(--brand-charcoal);
          transition: background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
        }
        .city-chip:hover { background: var(--brand-orange-pale); border-color: var(--brand-orange-ring); color: var(--brand-orange-deep); }
        .states-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 640px) { .states-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .states-grid { grid-template-columns: repeat(3, 1fr); } }
        .state-block h4 {
          font-family: var(--font-mono-stack);
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--brand-orange-deep);
          margin: 0 0 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--brand-orange-ring);
        }
        .state-block ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .state-block a { color: var(--ink-muted); font-size: 14px; transition: color var(--dur) var(--ease-out); }
        .state-block a:hover { color: var(--brand-orange-deep); }

        /* FINAL CTA */
        .final-cta {
          position: relative;
          color: #fff;
          overflow: hidden;
          padding: 96px 0;
        }
        .final-cta-bg {
          position: absolute; inset: 0; z-index: 0;
        }
        .final-cta-bg::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(15,15,15,0.78), rgba(15,15,15,0.92));
        }
        .final-cta-inner {
          position: relative; z-index: 1;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 18px;
          max-width: 760px;
          margin: 0 auto;
        }
        .final-cta-inner h3 {
          font-size: clamp(1.75rem, 3.4vw, 2.5rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin: 0;
        }
        .final-cta-inner p {
          font-size: clamp(1rem, 1.25vw, 1.125rem);
          line-height: 1.7;
          color: rgba(255,255,255,0.78);
          margin: 0;
        }
      `}</style>
    </>
  );
}
