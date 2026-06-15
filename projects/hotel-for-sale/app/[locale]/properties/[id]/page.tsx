import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { localeHref } from '@/lib/localeHref';
import {
  formatRM,
  formatRMShort,
  pricePerRoom,
  discountPct,
} from '@/config/properties';
import { getProperty, getProperties } from '@/lib/getProperties';
import { waRedirect } from '@/lib/waRedirect';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import PageStyles from '@/components/PageStyles';
import HotelCard from '@/components/HotelCard';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

export const dynamicParams = true;
export async function generateStaticParams() {
  const all = await getProperties();
  return all.flatMap((h) =>
    routing.locales.map((locale) => ({ locale, id: h.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const h = await getProperty(id);
  if (!h) return {};
  const title = `${h.name} — ${formatRM(h.sellingPrice)} | HotelForSale.my`;
  const description = h.shortDesc;
  const path = `/properties/${h.id}`;
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${localeHref(l)}${path}`]),
  );
  languages['x-default'] = `${localeHref(routing.defaultLocale)}${path}`;
  return {
    title,
    description,
    alternates: { canonical: `${localeHref(locale)}${path}`, languages },
    openGraph: { title, description, url: `${localeHref(locale)}${path}`, type: 'website', images: [h.cover] },
  };
}

function StarRow({ count }: { count: number; label: string }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#FBBC04">
          <path d="M12 2l3.1 6.3 7 1-5.1 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9L2 9.3l7-1L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const h = await getProperty(id);
  if (!h) notFound();

  const t = await getTranslations({ locale, namespace: 'detail' });
  const discount = discountPct(h);
  const allHotels = await getProperties();
  const related = allHotels.filter((p) => p.id !== h.id).slice(0, 3);

  const waMsg = `${h.name} (${h.id}) — ${formatRM(h.sellingPrice)}. I'd like more details and a viewing.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: h.name,
    description: h.shortDesc,
    image: h.cover,
    starRating: { '@type': 'Rating', ratingValue: h.stars },
    address: {
      '@type': 'PostalAddress',
      addressLocality: h.city,
      addressRegion: h.state,
      addressCountry: 'MY',
    },
    numberOfRooms: h.rooms,
    makesOffer: {
      '@type': 'Offer',
      price: h.sellingPrice,
      priceCurrency: 'MYR',
      availability: 'https://schema.org/InStock',
    },
  };

  const specRows: { label: string; value: string }[] = [
    { label: t('propertyTypeLabel'), value: h.propertyType },
    { label: t('locationLabel'), value: `${h.city}, ${h.state}` },
    { label: t('starLabel'), value: `${h.stars} ${t('starsUnit')}` },
    { label: t('roomsLabel'), value: `${h.rooms} ${t('roomsUnit')}` },
    { label: t('tenureLabel'), value: h.tenure },
    { label: t('yieldLabel'), value: `${h.grossYield}% ${t('perYear')}` },
    { label: t('landSizeLabel'), value: `${h.landSizeSqft.toLocaleString('en-MY')} ${t('sqft')}` },
    { label: t('builtUpLabel'), value: `${h.builtUpSqft.toLocaleString('en-MY')} ${t('sqft')}` },
  ];

  return (
    <>
      <FomoBanner />
      <SiteHeader />

      <BreadcrumbSchema
        items={[
          { name: t('breadcrumbHome'), url: `${localeHref(locale)}` },
          { name: t('breadcrumbProperties'), url: `${localeHref(locale)}/properties` },
          { name: h.name, url: `${localeHref(locale)}/properties/${h.id}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* BANNER */}
      <section className="detail-top">
        <div className="detail-banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={h.cover} alt={`${h.name} — ${h.city}, ${h.state} hotel for sale`} />
        </div>

        <div className="container">
          <div className="detail-headcard">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href={`/${locale}`}>{t('breadcrumbHome')}</Link>
              <span aria-hidden="true">›</span>
              <Link href={`/${locale}/properties`}>{t('breadcrumbProperties')}</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{h.name}</span>
            </nav>

            <div className="detail-headrow">
              <div className="detail-headleft">
                <div className="detail-starline">
                  <StarRow count={h.stars} label={`${h.stars} stars`} />
                  {h.onSale && <span className="detail-badge">{t('onSale')}</span>}
                </div>
                <h1>{h.name}</h1>
                <h2 className="detail-loc">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  {h.city}, {h.state}
                </h2>
              </div>
              <div className="detail-headright">
                <span className="detail-price-label">{t('sellingPriceLabel')}</span>
                <span className="detail-price">{formatRM(h.sellingPrice)}</span>
                <span className="detail-perroom">{formatRMShort(pricePerRoom(h))} {t('pricePerRoomLabel')}</span>
              </div>
            </div>

            <div className="detail-cta">
              <div className="detail-cta-text">
                <h3>{t('ctaHeadline')}</h3>
                <h5>{t('ctaBody')}</h5>
              </div>
              <WhatsAppButton href={waRedirect(locale, waMsg, h.citySlug)} label={`detail-${h.id}`} className="btn btn-wa">
                <WaIcon /> {t('enquireCta')}
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="section detail-body">
        <div className="container detail-grid">
          <div className="detail-main">
            <h4 className="detail-lead">{h.description}</h4>

            <h3 className="detail-h3">{t('overviewHeading')}</h3>
            <div className="overview-grid">
              {specRows.slice(0, 6).map((s) => (
                <div key={s.label} className="overview-cell">
                  <h6 className="overview-label">{s.label}</h6>
                  <h4 className="overview-value">{s.value}</h4>
                </div>
              ))}
            </div>

            <h3 className="detail-h3">{t('highlightsHeading')}</h3>
            <ul className="highlights-list">
              {h.highlights.map((hl, i) => (
                <li key={i}>
                  <span className="highlight-check" aria-hidden="true">✓</span>
                  <h4 className="highlight-text">{hl}</h4>
                </li>
              ))}
            </ul>

            <h3 className="detail-h3">{t('specsHeading')}</h3>
            <table className="specs-table">
              <tbody>
                {specRows.map((s) => (
                  <tr key={s.label}>
                    <th scope="row">{s.label}</th>
                    <td>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="detail-h3">{t('facilitiesHeading')}</h3>
            <div className="facilities">
              {h.facilities.map((f) => (
                <span key={f} className="facility-chip">{f}</span>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="detail-aside">
            <div className="invest-card">
              <h3 className="invest-heading">{t('investmentHeading')}</h3>
              <div className="invest-row">
                <span className="invest-label">{t('marketValueLabel')}</span>
                <span className="invest-value invest-strike">{formatRM(h.marketValue)}</span>
              </div>
              <div className="invest-row">
                <span className="invest-label">{t('sellingPriceLabel')}</span>
                <span className="invest-value invest-accent">{formatRM(h.sellingPrice)}</span>
              </div>
              <div className="invest-row">
                <span className="invest-label">{t('pricePerRoomLabel')}</span>
                <span className="invest-value">{formatRM(pricePerRoom(h))}</span>
              </div>
              <div className="invest-row">
                <span className="invest-label">{t('yieldLabel')}</span>
                <span className="invest-value invest-accent">{h.grossYield}%</span>
              </div>
              {discount > 0 && (
                <div className="invest-discount">−{discount}% {t('marketValueLabel')}</div>
              )}
              <WhatsAppButton href={waRedirect(locale, waMsg, h.citySlug)} label={`detail-aside-${h.id}`} className="btn btn-wa invest-cta">
                <WaIcon /> {t('enquireCta')}
              </WhatsAppButton>
            </div>
          </aside>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="urgency">
        <div className="container urgency-inner">
          <h3>{t('closingHeadline')}</h3>
          <h5>{t('closingBody')}</h5>
          <WhatsAppButton href={waRedirect(locale, waMsg, h.citySlug)} label={`detail-final-${h.id}`} className="btn btn-wa">
            <WaIcon /> {t('closingCta')}
          </WhatsAppButton>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="lp-section alt">
          <div className="container">
            <div className="lp-head">
              <h3>{t('relatedHeading')}</h3>
            </div>
            <div className="hotel-grid is-wide">
              {related.map((p) => (
                <HotelCard key={p.id} h={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter locale={locale} />

      <PageStyles />
      <style>{`
        .detail-top { background: var(--brand-paper); }
        .detail-banner { width: 100%; aspect-ratio: 16 / 7; max-height: 460px; overflow: hidden; background: var(--brand-grey-soft); }
        .detail-banner img { width: 100%; height: 100%; object-fit: cover; }
        .detail-headcard {
          position: relative;
          margin: -64px auto 0;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          box-shadow: 0 30px 70px -30px rgba(10,37,64,0.35);
          padding: 24px;
        }
        @media (min-width: 768px) { .detail-headcard { padding: 32px 36px; } }
        .breadcrumb {
          display: inline-flex; flex-wrap: wrap; align-items: center; gap: 10px;
          margin-bottom: 18px; padding: 7px 12px;
          background: var(--brand-paper); border: 1px solid var(--line);
          border-radius: 999px;
          font-family: var(--font-mono-stack); font-weight: 700; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-muted);
          width: fit-content; max-width: 100%;
        }
        .breadcrumb a { color: var(--ink-muted); }
        .breadcrumb a:hover { color: var(--brand-orange-deep); }
        .breadcrumb [aria-current="page"] { color: #fff; background: var(--brand-orange); padding: 3px 10px; border-radius: 999px; box-shadow: 0 4px 10px rgba(239,65,35,0.32); }
        .breadcrumb span[aria-hidden="true"] { color: var(--ink-faint); font-weight: 500; }
        .detail-headrow { display: flex; flex-direction: column; gap: 18px; }
        @media (min-width: 768px) { .detail-headrow { flex-direction: row; align-items: flex-start; justify-content: space-between; } }
        .detail-starline { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .stars { display: inline-flex; gap: 2px; }
        .detail-badge { font-family: var(--font-mono-stack); font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; background: var(--brand-orange); color: #fff; padding: 5px 10px; border-radius: 999px; }
        .detail-headleft h1 { font-size: clamp(1.6rem, 3.2vw, 2.5rem); font-weight: 700; letter-spacing: -0.025em; line-height: 1.1; color: var(--brand-charcoal); margin: 0; }
        .detail-loc { display: inline-flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 500; color: var(--ink-muted); margin: 8px 0 0; }
        .detail-loc svg { color: var(--brand-orange); }
        .detail-headright { display: flex; flex-direction: column; gap: 2px; }
        @media (min-width: 768px) { .detail-headright { align-items: flex-end; text-align: right; } }
        .detail-price-label { font-family: var(--font-mono-stack); font-weight: 700; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); }
        .detail-price { font-weight: 700; font-size: clamp(1.5rem, 3vw, 2rem); color: var(--brand-navy); letter-spacing: -0.01em; }
        .detail-perroom { font-size: 13px; color: var(--ink-muted); }
        .detail-cta { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--line); }
        @media (min-width: 768px) { .detail-cta { flex-direction: row; align-items: center; justify-content: space-between; } }
        .detail-cta-text h3 { font-size: 18px; font-weight: 700; color: var(--brand-charcoal); margin: 0; }
        .detail-cta-text h5 { font-weight: inherit; font-size: 14px; color: var(--ink-muted); margin: 4px 0 0; line-height: 1.5; }

        .detail-grid { display: grid; grid-template-columns: 1fr; gap: 36px; }
        @media (min-width: 980px) { .detail-grid { grid-template-columns: minmax(0,1.7fr) minmax(0,1fr); gap: 48px; align-items: start; } }
        .detail-lead { font-size: 16.5px; font-weight: 400; line-height: 1.8; color: var(--ink); margin: 0 0 8px; }
        .detail-h3 { font-size: clamp(1.25rem, 2vw, 1.5rem); font-weight: 700; letter-spacing: -0.02em; color: var(--brand-charcoal); margin: 36px 0 16px; }
        .overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (min-width: 640px) { .overview-grid { grid-template-columns: repeat(3, 1fr); } }
        .overview-cell { background: var(--brand-paper); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 16px; }
        .overview-label { font-family: var(--font-mono-stack); font-weight: 700; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); margin: 0 0 6px; }
        .overview-value { font-size: 16px; font-weight: 700; color: var(--brand-charcoal); margin: 0; line-height: 1.3; }
        .highlights-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .highlights-list li { display: flex; gap: 12px; align-items: flex-start; }
        .highlight-check { flex-shrink: 0; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; background: var(--brand-orange-pale); color: var(--brand-orange-deep); font-weight: 700; font-size: 13px; }
        .highlight-text { font-weight: inherit; font-size: 15.5px; line-height: 1.6; color: var(--ink); margin: 1px 0 0; }
        .specs-table { width: 100%; border-collapse: collapse; border: 1px solid var(--line); border-radius: var(--radius-md); overflow: hidden; }
        .specs-table tr:nth-child(odd) { background: var(--brand-paper); }
        .specs-table th, .specs-table td { text-align: left; padding: 13px 16px; font-size: 14.5px; }
        .specs-table th { font-weight: 700; color: var(--ink-muted); width: 45%; }
        .specs-table td { color: var(--brand-charcoal); font-weight: 500; }
        .facilities { display: flex; flex-wrap: wrap; gap: 8px; }
        .facility-chip { padding: 8px 14px; background: #fff; border: 1px solid var(--line-strong); border-radius: 999px; font-size: 13.5px; font-weight: 500; color: var(--brand-charcoal); }

        .detail-aside { position: relative; }
        @media (min-width: 980px) { .detail-aside { position: sticky; top: 84px; } }
        .invest-card { background: #fff; border: 1px solid #E3E8EF; border-radius: 14px; padding: 24px 22px; box-shadow: 0 18px 44px -26px rgba(22,53,107,0.3); }
        .invest-heading { font-size: 16px; font-weight: 700; color: var(--brand-navy); margin: 0 0 16px; letter-spacing: -0.01em; }
        .invest-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid #EEF2F7; }
        .invest-label { font-size: 13px; color: var(--ink-muted); }
        .invest-value { font-weight: 700; font-size: 15px; color: var(--brand-navy); }
        .invest-strike { text-decoration: line-through; color: var(--ink-faint); }
        .invest-accent { color: var(--brand-orange-deep); }
        .invest-discount { margin: 14px 0 0; text-align: center; font-weight: 700; font-size: 12px; letter-spacing: 0.06em; color: #fff; background: var(--brand-orange); padding: 8px; border-radius: 8px; }
        .invest-cta { width: 100%; margin-top: 16px; }
        @media (max-width: 559px) {
          .detail-headleft h1 { font-size: 22px; }
          .detail-loc { font-size: 13px; }
          .detail-price { font-size: 22px; }
          .detail-h3 { font-size: 20px; }
          .detail-lead { font-size: 13px; }
          .detail-cta-text h3 { font-size: 18px; }
          .detail-cta-text h5 { font-size: 12px; }
          .overview-value { font-size: 14px; }
          .highlight-text { font-size: 13px; }
        }
      `}</style>
    </>
  );
}
