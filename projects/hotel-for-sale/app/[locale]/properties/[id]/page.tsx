import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { formatRM, formatRMShort, pricePerRoom } from '@/config/properties';
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
  return all.flatMap((h) => routing.locales.map((locale) => ({ locale, id: h.id })));
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

function StarRow({ count }: { count: number }) {
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
  const perRoom = pricePerRoom(h);

  // Spec strip (only fields we have data for).
  const specs: { label: string; value: string }[] = [
    h.builtUpSqft > 0 ? { label: t('propertySizeLabel'), value: `${h.builtUpSqft.toLocaleString('en-MY')} ${t('sqft')}` } : null,
    { label: t('propertyTypeLabel'), value: h.propertyType },
    h.unitType && h.unitType !== '-' ? { label: t('unitTypeLabel'), value: h.unitType } : null,
    h.rooms > 0 ? { label: t('roomsLabel'), value: `${h.rooms}` } : null,
    { label: t('tenureLabel'), value: h.tenure },
  ].filter(Boolean) as { label: string; value: string }[];
  const mapQuery = encodeURIComponent(`${h.city}, ${h.state}, Malaysia`);

  // 3 similar listings — rank by same state, then same star rating.
  const all = await getProperties();
  const similar = all
    .filter((p) => p.id !== h.id)
    .map((p) => ({ p, score: (p.stateSlug === h.stateSlug ? 2 : 0) + (p.stars === h.stars ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);
  const waMsg = `${h.name} (${h.id}) — ${formatRM(h.sellingPrice)}. I'd like more details and a viewing.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: h.name,
    description: h.shortDesc,
    image: h.cover,
    starRating: { '@type': 'Rating', ratingValue: h.stars },
    address: { '@type': 'PostalAddress', addressLocality: h.city, addressRegion: h.state, addressCountry: 'MY' },
    numberOfRooms: h.rooms || undefined,
    makesOffer: { '@type': 'Offer', price: h.sellingPrice, priceCurrency: 'MYR', availability: 'https://schema.org/InStock' },
  };

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
                  <StarRow count={h.stars} />
                  {h.onSale && <span className="detail-badge">{t('onSale')}</span>}
                </div>
                <h1>{h.name}</h1>
                <h2 className="detail-loc">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  {h.city}, {h.state}
                </h2>
                <div className="detail-priceline">
                  <span className="detail-price-label">{t('sellingPriceLabel')}</span>
                  <span className="detail-price">{formatRM(h.sellingPrice)}</span>
                  {perRoom > 0 && <span className="detail-perroom">· {formatRMShort(perRoom)} {t('pricePerRoomLabel')}</span>}
                </div>
              </div>

              <aside className="detail-interested">
                <span className="interested-seal" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.1 6.3 7 1-5.1 4.9 1.2 6.9L12 16.8 5.8 20l1.2-6.9L2 8.3l7-1L12 1z" /></svg>
                </span>
                <h3>{t('ctaHeadline')}</h3>
                <h5>{t('ctaBody')}</h5>
                <WhatsAppButton href={waRedirect(locale, waMsg, h.citySlug)} label={`detail-${h.id}`} className="btn btn-wa">
                  <WaIcon /> {t('enquireCta')}
                </WhatsAppButton>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* BODY — full rich-text listing description */}
      <section className="section detail-body">
        <div className="container">
          {h.descriptionHtml ? (
            <div className="detail-content" dangerouslySetInnerHTML={{ __html: h.descriptionHtml }} />
          ) : (
            <div className="detail-content">
              <p>{h.description}</p>
              {h.highlights.length > 0 && (
                <>
                  <p><strong><u>{t('highlightsHeading')}</u></strong></p>
                  <ul>{h.highlights.map((hl, i) => <li key={i}>{hl}</li>)}</ul>
                </>
              )}
            </div>
          )}

          {/* SPECIFICATIONS strip */}
          <div className="detail-specs">
            {specs.map((s) => (
              <div key={s.label} className="detail-spec">
                <span className="detail-spec-label">{s.label}</span>
                <span className="detail-spec-value">{s.value}</span>
              </div>
            ))}
          </div>

          {/* PROPERTY LOCATION map */}
          <h3 className="detail-loc-head">{t('locationHeading')}</h3>
          <p className="detail-loc-sub">{h.city}, {h.state}, Malaysia</p>
          <div className="detail-map">
            <iframe
              title={`${h.name} location map`}
              src={`https://maps.google.com/maps?q=${mapQuery}&z=13&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
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

      {/* SIMILAR LISTINGS */}
      {similar.length > 0 && (
        <section className="lp-section alt similar-section">
          <div className="container">
            <h3 className="similar-head">{t('similarHeading')}</h3>
            <div className="hotel-grid is-wide">
              {similar.map((p) => (<HotelCard key={p.id} h={p} />))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter locale={locale} />

      <PageStyles />
      <style>{`
        .detail-top { background: var(--brand-paper); }
        .detail-banner { width: 100%; aspect-ratio: 16 / 7; max-height: 480px; overflow: hidden; background: var(--brand-grey-soft); }
        .detail-banner img { width: 100%; height: 100%; object-fit: cover; }
        .detail-headcard {
          position: relative; margin: -56px auto 0; background: #fff;
          border: 1px solid var(--line); border-radius: var(--radius-card);
          box-shadow: 0 30px 70px -30px rgba(10,37,64,0.35); padding: 18px;
        }
        @media (min-width: 768px) { .detail-headcard { padding: 22px 30px; } }
        /* Clean text breadcrumb (Inter, no pill, no uppercase) */
        .breadcrumb {
          display: flex; flex-wrap: wrap; align-items: center; gap: 7px;
          margin-bottom: 16px; font-size: 13px; font-weight: 500; color: var(--ink-muted);
        }
        .breadcrumb a { color: var(--ink-muted); transition: color var(--dur) var(--ease-out); }
        .breadcrumb a:hover { color: var(--brand-orange-deep); }
        .breadcrumb [aria-current="page"] { color: var(--brand-navy); font-weight: 600; }
        .breadcrumb span[aria-hidden="true"] { color: var(--ink-faint); font-size: 11px; }

        .detail-headrow { display: flex; flex-direction: column; gap: 18px; }
        @media (min-width: 880px) { .detail-headrow { flex-direction: row; align-items: stretch; justify-content: space-between; gap: 30px; } }
        .detail-headleft { display: flex; flex-direction: column; justify-content: center; flex: 1; }
        .detail-starline { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .stars { display: inline-flex; gap: 2px; }
        .detail-badge { display: inline-flex; align-items: center; gap: 5px; font-weight: 700; font-size: 12px; color: #1FA463; }
        .detail-headleft h1 { font-size: clamp(1.6rem, 3.2vw, 2.4rem); font-weight: 800; letter-spacing: -0.025em; line-height: 1.12; color: var(--brand-navy); margin: 0; }
        .detail-loc { display: inline-flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 500; color: var(--ink-muted); margin: 8px 0 0; }
        .detail-loc svg { color: var(--brand-orange); }
        .detail-priceline { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; margin-top: 12px; }
        .detail-price-label { font-family: var(--font-mono-stack); font-weight: 700; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); width: 100%; }
        .detail-price { font-weight: 800; font-size: clamp(1.6rem, 3.2vw, 2.2rem); color: var(--brand-navy); letter-spacing: -0.01em; }
        .detail-perroom { font-size: 14px; color: var(--ink-muted); }

        .detail-interested {
          flex-shrink: 0; width: 100%; background: var(--section-alt);
          border: 1px solid #E3E8EF; border-radius: 14px; padding: 18px 20px;
          display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px;
        }
        @media (min-width: 880px) { .detail-interested { width: 300px; } }
        .interested-seal { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: var(--brand-navy); color: #fff; box-shadow: 0 10px 22px -8px rgba(22,53,107,0.5); }
        .interested-seal svg { width: 22px; height: 22px; }
        .detail-interested h3 { font-size: 16px; font-weight: 700; color: var(--brand-navy); margin: 0; }
        .detail-interested h5 { font-weight: inherit; font-size: 13px; line-height: 1.45; color: var(--ink-muted); margin: 0 0 4px; }
        .detail-interested .btn { width: 100%; }

        /* Rich-text listing body — matches the reference's bullet sections */
        .detail-body { padding-top: clamp(28px, 4vw, 44px); }
        .detail-content { max-width: 860px; }
        .detail-content p { font-size: 16px; line-height: 1.8; color: var(--ink); margin: 0 0 1.1em; }
        .detail-content ul, .detail-content ol { margin: 0 0 1.5em; padding-left: 1.35em; }
        .detail-content li { font-size: 16px; line-height: 1.7; color: var(--ink); margin: 0.5em 0; }
        .detail-content li::marker { color: var(--brand-orange); }
        .detail-content li > p { display: inline; margin: 0; }
        .detail-content strong { font-weight: 700; color: var(--brand-charcoal); }
        .detail-content u { text-decoration: underline; text-underline-offset: 2px; }
        .detail-content h3 { font-size: 19px; font-weight: 700; color: var(--brand-navy); margin: 1.6em 0 0.6em; }
        /* "Property Features:" style headings the Wix data renders as bold+underlined paragraphs */
        .detail-content p:has(> strong > u) { margin-top: 1.6em; margin-bottom: 0.4em; font-size: 17px; }

        /* Specifications strip */
        .detail-specs {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
          max-width: 860px; margin: 8px 0 36px;
          background: #E3E8EF; border: 1px solid #E3E8EF; border-radius: var(--radius-md); overflow: hidden;
        }
        @media (min-width: 640px) { .detail-specs { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); } }
        .detail-spec { display: flex; flex-direction: column; gap: 5px; padding: 16px 18px; background: #fff; }
        .detail-spec-label { font-family: var(--font-mono-stack); font-weight: 700; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
        .detail-spec-value { font-size: 15px; font-weight: 700; color: var(--brand-navy); }

        /* Property location map */
        .detail-loc-head { font-size: 19px; font-weight: 700; color: var(--brand-navy); margin: 0 0 4px; }
        .detail-loc-sub { font-size: 14px; color: var(--ink-muted); margin: 0 0 14px; }
        .detail-map { max-width: 860px; aspect-ratio: 16 / 8; border-radius: var(--radius-md); overflow: hidden; border: 1px solid #E3E8EF; box-shadow: var(--shadow-sm); }
        .detail-map iframe { width: 100%; height: 100%; border: 0; display: block; }

        /* Pull up 1px to hide the hairline seam where the CTA section meets this one
           (same fix as .partners right after the hero). */
        .similar-section { position: relative; z-index: 1; margin-top: -1px; }
        .similar-head { font-size: 20px !important; font-weight: 600 !important; color: var(--ink-muted); margin: 0 0 22px; text-align: center; letter-spacing: 0; }

        @media (max-width: 559px) {
          .detail-headleft h1 { font-size: 22px; }
          .detail-loc { font-size: 13px; }
          .detail-price { font-size: 22px; }
          .detail-content p, .detail-content li { font-size: 14px; }
        }
      `}</style>
    </>
  );
}
