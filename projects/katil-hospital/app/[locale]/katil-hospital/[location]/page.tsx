import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { ogImages } from '@/lib/ogImage';
import { waRedirect } from '@/lib/waRedirect';
import { locations } from '@/config/locations';

import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import PageStyles from '@/components/PageStyles';
import RevealObserver from '@/components/RevealObserver';
import FaqAccordion from '@/components/FaqAccordion';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';
import { FAQSchema } from '@/components/schema/FAQSchema';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';

// No time-based ISR: content is invalidated by cache tag via /api/revalidate,
// so a DB edit appears within seconds instead of on the next time window.

const PRODUCT_SLUG = siteConfig.productSlug;

export function generateStaticParams() {
  return locations.map((l) => ({ location: l.slug }));
}

function findLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}): Promise<Metadata> {
  const { locale, location } = await params;
  const loc = findLocation(location);
  if (!loc) return {};
  const t = await getTranslations({ locale, namespace: 'meta.location' });
  const path = `/${PRODUCT_SLUG}/${loc.slug}`;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${localeHref(l)}${path}`]));
  return {
    title: t('titleTemplate', { location: loc.name }),
    description: t('descriptionTemplate', { location: loc.name, state: loc.state }),
    alternates: { canonical: `${localeHref(locale)}${path}`, languages },
    openGraph: {
      type: 'website',
      url: `${localeHref(locale)}${path}`,
      title: t('titleTemplate', { location: loc.name }),
      description: t('descriptionTemplate', { location: loc.name, state: loc.state }),
      images: ogImages(locale),
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const loc = findLocation(location);
  if (!loc) notFound();

  const t = await getTranslations({ locale, namespace: 'location' });
  const why = await getTranslations({ locale, namespace: 'why' });
  const del = await getTranslations({ locale, namespace: 'delivery' });
  const uspT = await getTranslations({ locale, namespace: 'usp' });
  const rev = await getTranslations({ locale, namespace: 'reviews' });

  const reviews = rev.raw('items') as { name: string; city: string; quote: string }[];
  const marquee = [...reviews, ...reviews];

  const vars = { location: loc.name, state: loc.state };

  const faqs = [1, 2, 3].map((n) => ({
    q: t(`faq${n}Q`, vars),
    a: t(`faq${n}A`, vars),
  }));

  // Other towns in the same state, for internal linking.
  const nearby = locations
    .filter((l) => l.state === loc.state && l.slug !== loc.slug)
    .slice(0, 8);

  const crumbs = [
    { name: t('breadcrumbHome'), url: localeHref(locale) },
    { name: loc.name, url: `${localeHref(locale)}/${PRODUCT_SLUG}/${loc.slug}` },
  ];

  return (
    <>
      <PageStyles />
      <RevealObserver />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={crumbs} />
      <LocalBusinessSchema
        locale={locale}
        locationName={loc.name}
        locationSlug={loc.slug}
        state={loc.state}
      />

      <FomoBanner />
      <SiteHeader />

      <main className="bg-white text-gray-800">
        {/* Hero */}
        <section className="hero-gradient pt-8 pb-12 md:pt-16 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-teal-700">
              <Link href={`/${locale}`} className="hover:text-amber-600">
                {t('breadcrumbHome')}
              </Link>
              <span className="mx-2 text-teal-400">/</span>
              <span className="text-gray-500">{loc.name}</span>
            </nav>

            <span className="sec-badge bg-amber-100 text-amber-800 mb-4">{t('heroBadge')}</span>
            <h1 className="hero-title mb-4">{t('titleTemplate', vars)}</h1>
            <h2 className="hero-sub mb-6 max-w-2xl mx-auto">{t('subtitleTemplate', vars)}</h2>

            <WhatsAppButton
              href={waRedirect(locale, undefined, loc.slug, PRODUCT_SLUG)}
              label={`location-hero-${loc.slug}`}
              className="btn-shine inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <WaIcon size={24} />
              {t('cta')}
            </WhatsAppButton>
          </div>
        </section>

        {/* USP bar — same contained 3-cell panel as the homepage */}
        <section className="bg-white pt-10 md:pt-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="usp-panel">
              <span className="usp-cell">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="usp-title">{uspT('deliveryTitle')}</h3>
                <h6 className="usp-sub body-text">{uspT('deliverySub')}</h6>
              </span>
              <span className="usp-cell">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="usp-title">{uspT('depositTitle')}</h3>
                <h6 className="usp-sub body-text">{uspT('depositSub')}</h6>
              </span>
              <span className="usp-cell">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="usp-title">{uspT('buybackTitle')}</h3>
                <h6 className="usp-sub body-text">{uspT('buybackSub')}</h6>
              </span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-14 md:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center reveal">
            <h5 className="body-text text-gray-600 text-lg">{t('introTemplate', vars)}</h5>
          </div>
        </section>

        {/* Why us */}
        <section className="py-14 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <h3 className="sec-title">{t('whyTitle', vars)}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm card-hover reveal">
                  <h4 className="card-title-lg text-teal-800 mb-1">{why(`card${n}Title`)}</h4>
                  <h6 className="body-text text-sm text-gray-500">{why(`card${n}Desc`)}</h6>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery tiers */}
        <section className="py-14 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <h3 className="sec-title">
                {del('title')} <span className="text-amber-600">{del('titleHighlight')}</span>
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: 1, bg: 'bg-teal-50', time: 'text-teal-700', area: 'text-teal-600' },
                { n: 2, bg: 'bg-amber-50', time: 'text-amber-700', area: 'text-amber-600' },
                { n: 3, bg: 'bg-gray-50', time: 'text-gray-700', area: 'text-gray-600' },
              ].map((tier) => (
                <div key={tier.n} className={`${tier.bg} rounded-2xl p-6 text-center card-hover reveal`}>
                  <h4 className={`font-heading text-3xl ${tier.time} mb-1`}>{del(`tier${tier.n}Time`)}</h4>
                  <h5 className={`body-text text-sm ${tier.area} font-semibold mb-2`}>{del(`tier${tier.n}Area`)}</h5>
                  <h6 className="body-text text-xs text-gray-500">{del(`tier${tier.n}Note`)}</h6>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby areas */}
        {nearby.length > 0 && (
          <section className="py-14 md:py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 text-center reveal">
              <h3 className="sec-title mb-6">{t('coverageTitle')}</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {nearby.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/${locale}/${PRODUCT_SLUG}/${n.slug}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-teal-100 text-teal-700 text-xs font-semibold hover:border-teal-300 transition-colors"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews — same scrolling marquee as the homepage */}
        <section className="py-14 md:py-16 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-amber-50 text-amber-700 mb-3">{rev('badge')}</span>
              <h3 className="sec-title">
                {rev('title')} <span className="text-amber-600">{rev('titleHighlight')}</span>
              </h3>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="testimonial-track" style={{ width: 'max-content' }}>
              {marquee.map((r, i) => (
                <div key={`${r.name}-${i}`} className="bg-white border border-gray-100 rounded-xl p-4 w-72 shrink-0 shadow-sm">
                  <span className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-heading text-sm shrink-0">
                      {(r.name.trim().split(/\s+/).pop() ?? r.name).charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <span className="text-sm font-semibold text-gray-800 block">{r.name}</span>
                      <span className="text-xs text-gray-400 block">{r.city}</span>
                    </span>
                    <span className="ml-auto text-amber-400 text-xs">★★★★★</span>
                  </span>
                  <h6 className="body-text text-sm text-gray-600">&ldquo;{r.quote}&rdquo;</h6>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8 reveal">
              <h3 className="sec-title">{t('faqTitle', vars)}</h3>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-teal-800 to-teal-950 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center reveal">
            <h3 className="sec-title text-white mb-4">{t('ctaTitle', vars)}</h3>
            <h5 className="body-text text-teal-100 text-lg mb-8 max-w-xl mx-auto">{t('ctaBody', vars)}</h5>
            <WhatsAppButton
              href={waRedirect(locale, undefined, loc.slug, PRODUCT_SLUG)}
              label={`location-final-${loc.slug}`}
              className="btn-shine inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <WaIcon size={24} />
              {t('cta')}
            </WhatsAppButton>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />

      <WhatsAppButton
        href={waRedirect(locale, undefined, loc.slug, PRODUCT_SLUG)}
        label={`location-floating-${loc.slug}`}
        ariaLabel="WhatsApp"
        className="hidden md:flex fixed bottom-6 right-4 z-40 w-14 h-14 bg-[#25D366] rounded-full items-center justify-center shadow-lg pulse-wa hover:scale-110 transition-transform"
      >
        <WaIcon size={28} className="text-white" />
      </WhatsAppButton>

      {/* Reserves flow height for the fixed CTA bar below, so it cannot
          cover the end of the footer on mobile. */}
      <div className="mobile-cta-spacer" aria-hidden="true" />

      <div className="mobile-cta-bar fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3 gap-3">
        <WhatsAppButton
          href={waRedirect(locale, undefined, loc.slug, PRODUCT_SLUG)}
          label={`location-sticky-${loc.slug}`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm"
        >
          <WaIcon size={20} />
          {t('cta')}
        </WhatsAppButton>
      </div>
    </>
  );
}
