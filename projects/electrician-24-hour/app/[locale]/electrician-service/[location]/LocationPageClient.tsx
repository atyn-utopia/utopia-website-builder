'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Product } from '@/lib/webcore';
import { siteConfig } from '@/config/site';
import { waRedirect } from '@/lib/waRedirect';

type Nearby = { slug: string; name: string };

type Props = {
  locale: string;
  city: string;
  slug: string;
  nearby: Nearby[];
  products: Product[];
};

const CITY_INTROS: Record<string, string> = {
  'kuala-lumpur':
    'KL apartments and shoplots regularly face tripping MCBs, overloaded DB boxes and burnt plug points — especially older blocks in Bukit Bintang, Wangsa Maju and Setapak. We dispatch within 90 minutes anywhere inside the city.',
  'petaling-jaya':
    'PJ terrace homes in SS2, Damansara and Section 14 often need full rewiring due to 30-year-old aluminium cabling. Our PJ team covers condo, landed and shoplot rewiring every day.',
  'shah-alam':
    'Shah Alam condos and Seksyen-numbered terrace houses frequently call about water heater wiring, ceiling fan rattle and tripped RCCB. Same-day response across Seksyen 7 to Seksyen 36.',
  'subang-jaya':
    'From USJ to SS15 and Subang Bestari, our electricians handle daily emergencies at apartments, shoplots and factories. 4-hour arrival guaranteed.',
  'puchong':
    'Puchong Perdana, Bandar Kinrara and Bukit Puchong terrace and condo residents trust us for plug point repairs, DB upgrades and emergency rewiring — 24/7.',
  'cheras':
    'Cheras apartments, landed homes in Taman Connaught and shoplots along Jalan Cheras — we service all of them same day, including after-hours calls.',
  'ampang':
    'Ampang hilltop condos and bungalows often have complex cabling. Our Ampang team handles everything from DB upgrades to main switch rewiring.',
  'cyberjaya':
    'Cyberjaya apartments and office suites — we handle server room electrical work, lift lobby rewiring and residential emergencies 24/7.',
  'kajang':
    'Kajang shoplots and Bandar Baru Bangi bungalows often need rewiring after heavy rain trips. We cover all of Kajang within 4 hours, same day.',
  'klang':
    'Klang town, Kota Kemuning and Bandar Bukit Tinggi — our electricians handle residential and shoplot calls daily with fast 4-hour arrival.',
  'johor-bahru':
    'JB landed and condo units in Iskandar, Taman Pelangi and Skudai frequently call for same-day plug point repair, water heater wiring and emergency DB work.',
  'ipoh':
    'Ipoh Garden, Bercham and Ipoh Old Town — our Perak team dispatches same-day for emergency wiring, rewiring and water heater calls.',
  'georgetown':
    'Heritage shophouses in Georgetown need careful rewiring by licensed electricians. We handle old-meets-new electrical work across Penang Island.',
  'melaka':
    'Melaka Tengah, Ayer Keroh and Klebang residents call us for fast 24/7 electrical service — landed, condo and shoplots.',
};

function trackClick(label: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    window.uwc('click', { label });
  }
}

export default function LocationPageClient({
  locale,
  city,
  slug,
  nearby,
  products,
}: Props) {
  // Pass the location slug so the redirect picks a location-routed phone number
  // (relevant for `location` / `hybrid` leads modes).
  const waHref = waRedirect(locale, undefined, slug);
  const t = useTranslations('location');
  const services = useTranslations('services');
  const faq = useTranslations('faq');
  const fin = useTranslations('finalCta');

  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const s = entry.target.getAttribute('data-slug');
          if (s && window.uwc) window.uwc('impression', { label: `product-${s}` });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    Object.values(productRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [products]);

  const intro =
    CITY_INTROS[slug] ||
    `Our ST-registered electricians serve ${city} every day with same-day plug point repair, rewiring, DB upgrade and emergency call-outs. Typical response time: under 4 hours.`;

  const faqItems = faq.raw('items') as { question: string; answer: string }[];

  return (
    <>
      {/* HERO — smaller, location-focused */}
      <section className="hero" style={{ padding: '80px 0 72px' }}>
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb" style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            <Link href={`/${locale}`} style={{ color: 'var(--gold)' }}>{t('breadcrumbHome')}</Link>
            <span className="sep">/</span>
            <Link href={`/${locale}#services`} style={{ color: 'var(--gold)' }}>{t('breadcrumbProduct')}</Link>
            <span className="sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{city}</span>
          </nav>
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <span className="hero-badge">📍 {city} · 24/7</span>
            <h1 style={{ color: 'var(--white)', margin: '18px 0 16px' }}>
              {t('h1Prefix')} <span className="hl">{city}</span> {t('h1Suffix')}
            </h1>
            <h2 className="hero-sub" style={{ margin: '0 auto 22px' }}>{intro}</h2>
            <div className="hero-ctas" style={{ justifyContent: 'center' }}>
              <a
                href={waHref}
                target="_blank"
                rel="noopener"
                onClick={() => trackClick(`whatsapp-hero-${slug}`)}
                className="btn btn-wa btn-lg"
              >
                WhatsApp a {city} Electrician
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES — Supabase products */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{city}</span>
            <h3>{services('heading')}</h3>
            <p>{services('subheading')}</p>
          </div>
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
                    <h4>{p.name} · {city}</h4>
                    <p>{p.description}</p>
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
                      p.sale_price && (
                        <div className="service-price">
                          <span>from</span> RM {Math.round(p.sale_price)}
                        </div>
                      )
                    )}
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener"
                      onClick={() => trackClick(`whatsapp-service-${slug}-${p.slug}`)}
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
        </div>
      </section>

      {/* NEARBY */}
      {nearby.length > 0 && (
        <section className="section section-ice">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Coverage</span>
              <h3>{t('nearbyTitle')}</h3>
              <p>{t('nearbySubtitle')}</p>
            </div>
            <div className="loc-grid" style={{ maxWidth: 820, margin: '0 auto' }}>
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${locale}/${siteConfig.productSlug}/${n.slug}`}
                  className="loc-chip"
                >
                  <span>{n.name}</span>
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
            <span className="eyebrow">FAQ · {city}</span>
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
            onClick={() => trackClick(`whatsapp-final-${slug}`)}
            className="btn btn-wa btn-lg"
          >
            {fin('cta')}
          </a>
        </div>
      </section>

      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        onClick={() => trackClick(`whatsapp-fab-${slug}`)}
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
