import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { locations, getLocationsByState, regionOrder, regionKeys, topCitySlugs } from '@/config/locations';
import { getProperties, getHotListed } from '@/lib/getProperties';
import { waRedirect } from '@/lib/waRedirect';
import { FAQSchema } from '@/components/schema/FAQSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import PageStyles from '@/components/PageStyles';
import HotelCard from '@/components/HotelCard';
import PropertiesCatalogClient from './properties/PropertiesCatalogClient';
import CountUp from '@/components/CountUp';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

export const dynamic = 'force-static';

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
    alternates: { canonical: `${localeHref(locale)}`, languages },
  };
}

const PARTNERS = ['CBRE', 'Marriott', 'IHG', 'HYATT', 'JLL', 'Booking.com', 'Knight Frank'];
const COVERAGE_IMAGES = [
  'photo-1566073771259-6a8506099945', 'photo-1564501049412-61c2a3083791',
  'photo-1571896349842-33c89424de2d', 'photo-1582719478250-c89cae4dc85b',
  'photo-1551882547-ff40c63fe5fa', 'photo-1542314831-068cd1dbfeeb',
  'photo-1520250497591-112f2f40a3f4', 'photo-1611892440504-42a792e24d32',
  'photo-1445019980597-93fa8acb246c', 'photo-1568084680786-a84f91d1153c',
].map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=520&q=70`);
const SELLER_IMG = 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1100&q=75';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tUsp = await getTranslations({ locale, namespace: 'usp' });
  const tHot = await getTranslations({ locale, namespace: 'hotlist' });
  const tCta2 = await getTranslations({ locale, namespace: 'cta2' });
  const tAgency = await getTranslations({ locale, namespace: 'agency' });
  const tProcess = await getTranslations({ locale, namespace: 'process' });
  const tSeller = await getTranslations({ locale, namespace: 'seller' });
  const tGallery = await getTranslations({ locale, namespace: 'gallery' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const tLoc = await getTranslations({ locale, namespace: 'locations' });
  const tFinal = await getTranslations({ locale, namespace: 'finalCta' });
  const tProp = await getTranslations({ locale, namespace: 'properties' });

  const hotListed = await getHotListed(5);
  const allHotels = await getProperties();
  const hotelStates = Array.from(
    new Map(allHotels.map((h) => [h.stateSlug, { slug: h.stateSlug, name: h.state }])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const uspItems = tUsp.raw('items') as { title: string; body: string }[];
  const processSteps = tProcess.raw('steps') as { title: string; body: string }[];
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];
  const galleryAlts = tGallery.raw('alts') as string[];
  const rotatingWords = tHero.raw('rotatingWords') as string[];
  const locationsByState = getLocationsByState();

  return (
    <>
      <FomoBanner />
      <SiteHeader />
      <FAQSchema items={faqItems} />

      {/* HERO */}
      <section className="lp-hero">
        <div className="container lp-hero-inner">
          <h1>
            {tHero('h1Prefix') ? <>{tHero('h1Prefix')}{' '}</> : null}
            <span className="rotating-word">
              <span className="rotating-word-list">
                {[...rotatingWords, rotatingWords[0]].map((w, i) => (<span key={i}>{w}</span>))}
              </span>
            </span>
            {' '}{tHero('h1Suffix')}
          </h1>
          <h2>{tHero('h2')}</h2>
          <h5>{tHero('supporting')}</h5>
          <div className="lp-hero-cta">
            <WhatsAppButton href={waRedirect(locale)} label="hero" className="btn btn-wa">
              <WaIcon /> {tHero('ctaPrimary')}
            </WhatsAppButton>
            <a href="#products" className="btn btn-navy-outline">{tHero('ctaSecondary')}</a>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-hero-stat"><span className="lp-hero-statnum"><CountUp value={1270} suffix="+" /></span><span className="lp-hero-statlabel">{tHero('statHotels')}</span></div>
            <div className="lp-hero-stat"><span className="lp-hero-statnum"><CountUp value={14} /></span><span className="lp-hero-statlabel">{tHero('statStates')}</span></div>
            <div className="lp-hero-stat"><span className="lp-hero-statnum"><CountUp value={13} suffix="%" /></span><span className="lp-hero-statlabel">{tHero('statYield')}</span></div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners">
        <div className="container">
          <h6 className="partners-title">{tHero('partnersTitle')}</h6>
          <div className="partners-row">
            {PARTNERS.map((p) => (<span key={p} className="partner-logo">{p}</span>))}
          </div>
        </div>
      </section>

      {/* USP 3-up */}
      <section className="lp-section">
        <div className="container">
          <div className="usp3">
            {uspItems.map((u, i) => (
              <div key={i} className="usp3-card">
                <span className="usp3-icon">
                  {i === 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 17l5-5 4 4 8-9" /><path d="M16 7h4v4" /><path d="M3 21h18" /></svg>
                  )}
                  {i === 1 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>
                  )}
                  {i === 2 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 1v22" /><path d="M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.6 7 6.5 9 9.5 12 10s5 1.4 5 3.5-2.2 3.5-5 3.5-5-1.1-5-3" /></svg>
                  )}
                </span>
                <h3>{u.title}</h3>
                <h5>{u.body}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOT LIST — 5 hot-listed hotels */}
      <section id="hotlist" className="lp-section alt">
        <div className="container">
          <div className="lp-head">
            <h3>{tHot('h3')} <span className="accent">{tHot('h3Accent')}</span></h3>
            <h5 className="lp-sub">{tHot('intro')}</h5>
          </div>
          <div className="hotlist-grid">
            {hotListed.map((h) => (<HotelCard key={h.id} h={h} />))}
          </div>
        </div>
      </section>

      {/* FILTERABLE CATALOGUE */}
      <section id="products" className="lp-section">
        <div className="container">
          <div className="lp-head">
            <h3>{tProp('h2')}</h3>
            <h5 className="lp-sub">{tProp('intro')}</h5>
          </div>
          <PropertiesCatalogClient hotels={allHotels} states={hotelStates} />
        </div>
      </section>

      {/* CTA BAND */}
      <section className="ctaband">
        <div className="container ctaband-inner">
          <h3>{tCta2('h3')}</h3>
          <h5 className="accent" style={{ fontWeight: 700, fontSize: '18px' }}>{tCta2('body')}</h5>
          <WhatsAppButton href={waRedirect(locale)} label="cta-band" className="btn btn-wa">
            <WaIcon /> {tCta2('ctaLabel')}
          </WhatsAppButton>
        </div>
      </section>

      {/* AGENCY BAND */}
      <section className="agencyband">
        <div className="container agencyband-inner">
          <span className="agencyband-logo">VIVA<span>HOMES</span></span>
          <h3>{tAgency('h3')}</h3>
          <h5>{tAgency('sub')}</h5>
          <div className="agencyband-badges">
            {[0, 1, 2].map((i) => (
              <span key={i} className="agencyband-badge">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.1 6.3 7 1-5.1 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9L2 9.3l7-1L12 2Z" /></svg>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — Best Hotel Deals in 5 Minutes */}
      <section id="process" className="lp-section">
        <div className="container">
          <div className="lp-head">
            <h3>{tProcess('h3')} <span className="accent">{tProcess('h3Accent')}</span></h3>
            <h5 className="lp-sub">{tProcess('intro')}</h5>
          </div>
          <div className="steps">
            {processSteps.map((s, i) => (
              <div key={i} className="step-card">
                <span className="step-num">{i + 1}</span>
                <div>
                  <h5 className="step-title">{s.title}</h5>
                  <h5 className="step-body">{s.body}</h5>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-more">
            <WhatsAppButton href={waRedirect(locale)} label="process" className="btn btn-wa">
              <WaIcon /> {tHero('ctaPrimary')}
            </WhatsAppButton>
          </div>
        </div>
      </section>

      {/* SELLER */}
      <section id="sell" className="seller2">
        <div className="container">
          <div className="seller2-grid">
            <div className="seller2-text">
              <h3>{tSeller('h3')}</h3>
              <h5 className="seller2-body">{tSeller('body')}</h5>
              <WhatsAppButton href={waRedirect(locale, tSeller('waMessage'))} label="sell" className="btn btn-wa">
                <WaIcon /> {tSeller('ctaLabel')}
              </WhatsAppButton>
            </div>
            <div className="seller2-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SELLER_IMG} alt={tSeller('imageAlt')} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE + GALLERY */}
      <section className="lp-section alt">
        <div className="container">
          <div className="lp-head">
            <h3>{tGallery('h3')}<br /><span className="accent">{tGallery('stat')}</span> {tGallery('statLabel')}</h3>
            <h5 className="lp-sub">{tGallery('intro')}</h5>
          </div>
          <div className="coverage-grid">
            {COVERAGE_IMAGES.map((src, i) => (
              <div key={i} className="coverage-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={galleryAlts[i] ?? `Hotel for sale in Malaysia ${i + 1}`} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="lp-section">
        <div className="container">
          <div className="lp-head">
            <h3>{tFaq('h3')}</h3>
          </div>
          <div className="faq-wrap">
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
      <section id="locations" className="lp-section alt">
        <div className="container">
          <div className="lp-head">
            <h3>{tLoc('h3')}</h3>
            <h5 className="lp-sub">{tLoc('intro')}</h5>
          </div>
          <div className="lp-cities">
            {topCitySlugs.map((slug) => {
              const loc = locations.find((l) => l.slug === slug);
              if (!loc) return null;
              return (<Link key={slug} href={`/${locale}/${siteConfig.productSlug}/${slug}`} className="lp-city">{loc.name}</Link>);
            })}
          </div>
          <div className="lp-states">
            {regionOrder.map((region) => {
              const cities = locationsByState[region] || [];
              if (cities.length === 0) return null;
              const key = regionKeys[region];
              return (
                <div key={region} className="lp-state">
                  <h4>{tLoc(`stateLabels.${key}`)}</h4>
                  <ul>
                    {cities.map((c) => (<li key={c.slug}><Link href={`/${locale}/${siteConfig.productSlug}/${c.slug}`}>{c.name}</Link></li>))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* URGENCY FINAL CTA */}
      <section className="urgency">
        <div className="container urgency-inner">
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
