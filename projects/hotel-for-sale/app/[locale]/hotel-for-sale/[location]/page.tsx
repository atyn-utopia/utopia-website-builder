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
import { getPropertiesInCity, getPropertiesInState, getFeaturedProperties } from '@/lib/getProperties';
import { waRedirect } from '@/lib/waRedirect';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import PageStyles from '@/components/PageStyles';
import HotelCard from '@/components/HotelCard';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';

const COVERAGE_IMAGES = [
  'photo-1566073771259-6a8506099945', 'photo-1564501049412-61c2a3083791',
  'photo-1571896349842-33c89424de2d', 'photo-1582719478250-c89cae4dc85b',
  'photo-1551882547-ff40c63fe5fa', 'photo-1542314831-068cd1dbfeeb',
  'photo-1520250497591-112f2f40a3f4', 'photo-1611892440504-42a792e24d32',
  'photo-1445019980597-93fa8acb246c', 'photo-1568084680786-a84f91d1153c',
].map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=520&q=70`);
const SELLER_IMG = 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1100&q=75';

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
  const tHot = await getTranslations({ locale, namespace: 'hotlist' });
  const tProcess = await getTranslations({ locale, namespace: 'process' });
  const tSeller = await getTranslations({ locale, namespace: 'seller' });
  const tGallery = await getTranslations({ locale, namespace: 'gallery' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const tLoc = await getTranslations({ locale, namespace: 'locations' });
  const tFinal = await getTranslations({ locale, namespace: 'finalCta' });

  let cityHotels = await getPropertiesInCity(loc.slug);
  if (cityHotels.length === 0) cityHotels = await getPropertiesInState(loc.stateSlug);
  if (cityHotels.length === 0) cityHotels = await getFeaturedProperties(8);
  cityHotels = cityHotels.slice(0, 8);

  const uspItems = tUsp.raw('items') as { title: string; body: string }[];
  const processSteps = tProcess.raw('steps') as { title: string; body: string }[];
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];
  const galleryAlts = tGallery.raw('alts') as string[];
  const localisedFaq = faqItems.map((f) => ({ q: f.q, a: f.a.replace(/Malaysia/g, `${loc.name}, ${loc.state}`) }));
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
      <FAQSchema items={localisedFaq} />

      {/* HERO */}
      <section className="lp-hero">
        <div className="container lp-hero-inner">
          <nav className="lp-hero-crumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{tLocPage('breadcrumbHome')}</Link>
            {' › '}
            <Link href={`/${locale}#locations`}>{tLocPage('breadcrumbLocations')}</Link>
            {' › '}
            <span aria-current="page">{loc.name}</span>
          </nav>
          <h1>{tLocPage('h1Template', { location: loc.name })}</h1>
          <h2>{tLocPage('h2Template', { state: loc.state })}</h2>
          <h5>{tLocPage('introTemplate', { location: loc.name, state: loc.state })}</h5>
          <div className="lp-hero-cta">
            <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`hero-${loc.slug}`} className="btn btn-wa">
              <WaIcon /> {tHero('ctaPrimary')}
            </WhatsAppButton>
            <a href="#products" className="btn btn-navy-outline">{tHero('ctaSecondary')}</a>
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="lp-section">
        <div className="container">
          <div className="usp3">
            {uspItems.map((u, i) => (
              <div key={i} className="usp3-card">
                <span className="usp3-icon">
                  {i === 0 && (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 17l5-5 4 4 8-9" /><path d="M16 7h4v4" /><path d="M3 21h18" /></svg>)}
                  {i === 1 && (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>)}
                  {i === 2 && (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 1v22" /><path d="M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.6 7 6.5 9 9.5 12 10s5 1.4 5 3.5-2.2 3.5-5 3.5-5-1.1-5-3" /></svg>)}
                </span>
                <h3>{u.title}</h3>
                <h5>{u.body}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOT LIST — city */}
      <section id="products" className="lp-section alt">
        <div className="container">
          <div className="lp-head">
            <h3>{tLocPage('hotlistHeading', { location: loc.name })}</h3>
            <h5 className="lp-sub">{tLocPage('hotlistIntro', { location: loc.name })}</h5>
          </div>
          <div className="hotel-grid">
            {cityHotels.map((h) => (<HotelCard key={h.id} h={h} />))}
          </div>
          <div className="lp-more">
            <Link href={`/${locale}/properties`} className="btn btn-navy">{tHot('viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
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
        </div>
      </section>

      {/* SELLER */}
      <section id="sell" className="seller2">
        <div className="container">
          <div className="seller2-grid">
            <div className="seller2-text">
              <h3>{tSeller('h3')}</h3>
              <h5 className="seller2-body">{tSeller('body')}</h5>
              <WhatsAppButton href={waRedirect(locale, tSeller('waMessage'), loc.slug)} label={`sell-${loc.slug}`} className="btn btn-wa">
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

      {/* COVERAGE */}
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
                <img src={src} alt={galleryAlts[i] ?? `Hotel for sale in ${loc.name}`} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="lp-section">
        <div className="container">
          <div className="lp-head">
            <h3>{tFaq('h3')} — {loc.name}</h3>
          </div>
          <div className="faq-wrap">
            {localisedFaq.map((f, i) => (
              <details key={i} className="faq-item">
                <summary>{f.q}</summary>
                <h4>{f.a}</h4>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS + NEARBY */}
      <section id="locations" className="lp-section alt">
        <div className="container">
          <div className="lp-head">
            <h3>{tLoc('h3')}</h3>
            <h5 className="lp-sub">{tLoc('intro')}</h5>
          </div>
          <div className="lp-cities">
            {topCitySlugs.map((slug) => {
              const c = locations.find((l) => l.slug === slug);
              if (!c) return null;
              return (<Link key={slug} href={`/${locale}/${siteConfig.productSlug}/${slug}`} className={`lp-city ${slug === loc.slug ? 'is-current' : ''}`}>{c.name}</Link>);
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
          {nearby.length > 0 && (
            <div className="lp-nearby">
              <h4 className="lp-nearby-head">{tLocPage('nearbyHeading', { location: loc.name })}</h4>
              <div className="lp-cities">
                {nearby.map((n) => (
                  <Link key={n.slug} href={`/${locale}/${siteConfig.productSlug}/${n.slug}`} className="lp-city">{n.name}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* URGENCY */}
      <section className="urgency">
        <div className="container urgency-inner">
          <h3>{tFinal('h3')}</h3>
          <h5>{tFinal('body')}</h5>
          <WhatsAppButton href={waRedirect(locale, undefined, loc.slug)} label={`final-cta-${loc.slug}`} className="btn btn-wa">
            <WaIcon /> {tFinal('ctaLabel')}
          </WhatsAppButton>
        </div>
      </section>

      <SiteFooter locale={locale} />
      <PageStyles />
      <style>{`
        .lp-nearby { margin-top: 44px; padding-top: 32px; border-top: 1px solid #E3E8EF; text-align: center; }
        .lp-nearby-head { font-size: 15px; font-weight: 700; color: var(--brand-navy); margin: 0 0 16px; }
      `}</style>
    </>
  );
}
