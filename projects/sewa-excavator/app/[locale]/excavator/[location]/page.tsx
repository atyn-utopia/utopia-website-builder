import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { locations, getNearbyLocations } from '@/config/locations';
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
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

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
    alternates: {
      canonical: `${siteConfig.url}/${locale}${path}`,
      languages,
    },
    openGraph: { title, description, url: `${siteConfig.url}/${locale}${path}`, type: 'website' },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const loc = locations.find((l) => l.slug === location);
  if (!loc) notFound();

  const tLocPage = await getTranslations({ locale, namespace: 'location' });
  const tProducts = await getTranslations({ locale, namespace: 'products' });
  const tCalc = await getTranslations({ locale, namespace: 'calculator' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const tFinal = await getTranslations({ locale, namespace: 'finalCta' });
  const tLoc = await getTranslations({ locale, namespace: 'locations' });

  const { core } = await getProducts();
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
  const calcRates = { ec200: Number(productCards[0].rentalPrice), ec400: Number(productCards[1].rentalPrice) };

  const nearby = getNearbyLocations(loc.slug);
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];

  const localisedFaq = faqItems.map((f) => ({
    q: f.q,
    a: f.a.replace(/Malaysia/g, `${loc.name}, ${loc.state}`),
  }));

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

      <nav className="breadcrumb container" aria-label="Breadcrumb">
        <Link href={`/${locale}`}>{tLocPage('breadcrumbHome')}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${locale}#locations`}>{tLocPage('breadcrumbLocations')}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{loc.name}</span>
      </nav>

      {/* HERO */}
      <section className="loc-hero">
        <div className="loc-hero-bg" aria-hidden="true" />
        <div className="container loc-hero-grid">
          <div className="loc-hero-text">
            <span className="eyebrow eyebrow-light">OPERATOR STANDBY · {loc.name.toUpperCase()}</span>
            <h1>{tLocPage('h1Template', { location: loc.name })}</h1>
            <h2>{tLocPage('h2Template', { state: loc.state })}</h2>
            <p className="loc-hero-intro">{tLocPage('introTemplate', { location: loc.name, state: loc.state })}</p>
            <div className="loc-hero-cta">
              <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`location-${loc.slug}`} className="btn btn-wa">
                <WaIcon /> WhatsApp {loc.name}
              </WhatsAppButton>
              <a href="#calculator" className="loc-secondary">{tCalc('h3')} →</a>
            </div>
          </div>
        </div>
      </section>

      <div className="tread-divider" aria-hidden="true" />

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
                  <Image src={p.image} alt={tProducts('imageAltTemplate', { model: p.name })} width={600} height={450} style={{ objectFit: 'contain' }} />
                </div>
                <div className="product-body">
                  <h4 className="product-title">{p.name}</h4>
                  <p className="product-desc">{p.description}</p>
                  <p className="product-price">{tProducts('priceFrom', { price: Number(p.rentalPrice).toLocaleString() })}</p>
                  <WhatsAppButton
                    href={waRedirect(locale, `${p.name} di ${loc.name}`, loc.slug)}
                    label={`product-${p.slug}-${loc.slug}`}
                    className="btn btn-wa product-cta"
                  >
                    <WaIcon size={16} />
                    {tProducts('ctaTemplate', { model: p.name })}
                  </WhatsAppButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="section bg-blueprint-glow" style={{ color: '#fff' }}>
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

      {/* NEARBY LOCATIONS */}
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

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="container faq-container">
          <div className="section-head">
            <span className="eyebrow">{tFaq('eyebrow')}</span>
            <h3>{tFaq('h3')} — {loc.name}</h3>
          </div>
          <div className="faq-list">
            {localisedFaq.map((f, i) => (
              <details key={i} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section final-cta">
        <div className="final-cta-bg" aria-hidden="true" />
        <div className="container final-cta-inner">
          <span className="eyebrow eyebrow-light">{tFinal('eyebrow')}</span>
          <h3>{tFinal('h3')} — {loc.name}</h3>
          <p>{tFinal('body')}</p>
          <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`final-cta-${loc.slug}`} className="btn btn-wa">
            <WaIcon /> WhatsApp {loc.name}
          </WhatsAppButton>
        </div>
      </section>

      <SiteFooter locale={locale} />

      <style>{`
        .breadcrumb {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 18px var(--gut);
          font-size: 13px;
          color: var(--ink-muted);
        }
        .breadcrumb a { color: var(--brand-orange-deep); font-weight: 600; }
        .breadcrumb [aria-current="page"] { color: var(--brand-charcoal); font-weight: 600; }
        .breadcrumb span[aria-hidden="true"] { color: var(--ink-faint); }

        .loc-hero {
          position: relative;
          color: #fff;
          padding: 64px 0 80px;
          overflow: hidden;
        }
        .loc-hero-bg {
          position: absolute; inset: 0;
          background-color: var(--brand-charcoal);
          background-image:
            var(--gradient-hero-glow),
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: auto, 56px 56px, 56px 56px;
          z-index: 0;
        }
        .loc-hero-grid { position: relative; z-index: 1; text-align: center; max-width: 880px; margin: 0 auto; }
        .loc-hero-text { display: flex; flex-direction: column; align-items: center; gap: 18px; }
        .loc-hero-text h1 {
          font-size: clamp(2rem, 5vw, 3.75rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0;
        }
        .loc-hero-text h2 {
          font-size: clamp(1.0625rem, 1.8vw, 1.375rem);
          font-weight: 600;
          color: rgba(255,255,255,0.82);
          margin: 0;
          letter-spacing: -0.01em;
        }
        .loc-hero-intro {
          font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin: 4px 0 0;
          max-width: 60ch;
        }
        .loc-hero-cta { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 6px; }
        @media (min-width: 640px) { .loc-hero-cta { flex-direction: row; } }
        .loc-secondary { color: var(--brand-orange-bright); font-weight: 700; font-size: 15px; }

        .nearby-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .nearby-card {
          display: flex; align-items: center; gap: 10px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          transition: border-color var(--dur) var(--ease-out), transform var(--dur) var(--ease-out);
        }
        .nearby-card:hover { border-color: var(--brand-orange-ring); transform: translateY(-2px); }
        .nearby-name { color: var(--brand-charcoal); font-weight: 700; font-size: 15px; flex: 1; }
        .nearby-state {
          font-family: var(--font-mono-stack);
          font-weight: 600;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        .nearby-arrow { color: var(--brand-orange); font-weight: 700; }

        .final-cta { position: relative; color: #fff; padding: 80px 0; background: var(--brand-charcoal); overflow: hidden; }
        .final-cta-bg {
          position: absolute; inset: 0;
          background-color: var(--brand-charcoal);
          background-image: var(--gradient-hero-glow),
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: auto, 56px 56px, 56px 56px;
        }
        .final-cta-inner {
          position: relative; z-index: 1;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          max-width: 720px; margin: 0 auto;
        }
        .final-cta-inner h3 {
          font-size: clamp(1.75rem, 3.2vw, 2.5rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin: 0;
        }
        .final-cta-inner p { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.78); margin: 0; }
      `}</style>
    </>
  );
}
