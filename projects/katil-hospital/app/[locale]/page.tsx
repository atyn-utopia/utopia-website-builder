import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { localeHref } from '@/lib/localeHref';
import { ogImages } from '@/lib/ogImage';
import { routing } from '@/i18n/routing';
import { waRedirect } from '@/lib/waRedirect';
import { getProducts } from '@/lib/webcore';
import { fallbackBeds, fallbackAddons } from '@/config/products';
import { locations } from '@/config/locations';

import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import PageStyles from '@/components/PageStyles';
import RevealObserver from '@/components/RevealObserver';
import Counter from '@/components/Counter';
import FaqAccordion from '@/components/FaqAccordion';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker';
import { FAQSchema } from '@/components/schema/FAQSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';

// No time-based ISR: content is invalidated by cache tag via /api/revalidate,
// so a DB edit appears within seconds instead of on the next time window.

const CHECK =
  'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localeHref(l)]));
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: localeHref(locale), languages },
    openGraph: {
      type: 'website',
      url: localeHref(locale),
      title: t('title'),
      description: t('description'),
      images: ogImages(locale),
    },
  };
}

function Check({ className = 'w-4 h-4 text-teal-500 mt-0.5 shrink-0' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d={CHECK} clipRule="evenodd" />
    </svg>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const uspT = await getTranslations({ locale, namespace: 'usp' });
  const emo = await getTranslations({ locale, namespace: 'emotional' });
  const how = await getTranslations({ locale, namespace: 'how' });
  const comfort = await getTranslations({ locale, namespace: 'comfort' });
  const why = await getTranslations({ locale, namespace: 'why' });
  const prod = await getTranslations({ locale, namespace: 'products' });
  const buyback = await getTranslations({ locale, namespace: 'buyback' });
  const addons = await getTranslations({ locale, namespace: 'addons' });
  const del = await getTranslations({ locale, namespace: 'delivery' });
  const show = await getTranslations({ locale, namespace: 'showroom' });
  const rev = await getTranslations({ locale, namespace: 'reviews' });
  const faqT = await getTranslations({ locale, namespace: 'faq' });
  const final = await getTranslations({ locale, namespace: 'finalCta' });

  // Products come from Supabase (webcore) and fall back to the static
  // catalogue only when the DB has no rows for this domain yet.
  const { core, additional } = await getProducts();
  const useDbBeds = core.length > 0;
  const useDbAddons = additional.length > 0;

  // Feature bullets and the corner badge are presentation copy, so they stay in
  // messages/*.json and are matched to the DB row by slug — the DB owns names,
  // prices and photos, translations own the rest. Without this merge the cards
  // would lose their bullets and JIMAT/PREMIUM badges as soon as Supabase had
  // rows.
  const bedCopy = (slug: string, count: number) => ({
    features: Array.from({ length: count }, (_, i) => `items.${slug}.f${i + 1}`)
      .filter((k) => prod.has(k))
      .map((k) => prod(k)),
    tag: prod.has(`items.${slug}.tag`) ? prod(`items.${slug}.tag`) : '',
  });

  const beds = useDbBeds
    ? core.map((p, i) => {
        const fb = fallbackBeds.find((b) => b.slug === p.slug);
        const copy = bedCopy(p.slug, fb?.featureCount ?? 5);
        return {
          slug: p.slug,
          name: p.name,
          desc: p.description ?? '',
          image: p.photos[0]?.url ?? fb?.image ?? fallbackBeds[i % fallbackBeds.length].image,
          rentalPrice: p.rental_price ?? 0,
          salePrice: p.sale_price ?? 0,
          popular: fb ? Boolean(fb.popular) : i === 1,
          features: copy.features,
          tag: copy.tag,
          accent: (fb?.accent ?? (i === 2 ? 'amber' : 'teal')) as 'teal' | 'amber',
        };
      })
    : fallbackBeds.map((b) => ({
        slug: b.slug,
        name: prod(`items.${b.slug}.name`),
        desc: prod(`items.${b.slug}.desc`),
        image: b.image,
        rentalPrice: b.rentalPrice,
        salePrice: b.salePrice,
        popular: Boolean(b.popular),
        features: Array.from({ length: b.featureCount }, (_, i) => prod(`items.${b.slug}.f${i + 1}`)),
        tag: prod(`items.${b.slug}.tag`),
        accent: b.accent,
      }));

  const addonItems = useDbAddons
    ? additional.map((p, i) => ({
        slug: p.slug,
        name: p.name,
        desc: p.description ?? '',
        price: p.sale_price != null ? `RM${p.sale_price.toLocaleString('en-US')}` : '',
        image: p.photos[0]?.url ?? fallbackAddons[i % fallbackAddons.length].image,
      }))
    : fallbackAddons.map((a) => ({
        slug: a.slug,
        name: addons(`items.${a.slug}.name`),
        desc: addons(`items.${a.slug}.desc`),
        price: addons(`items.${a.slug}.price`),
        image: a.image,
      }));

  const faqs = faqT.raw('items') as { q: string; a: string }[];
  const reviews = rev.raw('items') as { name: string; city: string; quote: string }[];
  const marquee = [...reviews, ...reviews];

  const showrooms = [
    { key: 'kl', name: show('klName'), sub: show('klSub'), desc: show('klDesc') },
    { key: 'penang', name: show('penangName'), sub: '', desc: show('penangDesc') },
    { key: 'melaka', name: show('melakaName'), sub: '', desc: show('melakaDesc') },
    { key: 'johor', name: show('johorName'), sub: '', desc: show('johorDesc') },
    { key: 'langkawi', name: show('langkawiName'), sub: '', desc: show('langkawiDesc') },
  ];

  const featuredLocations = locations.slice(0, 12);

  return (
    <>
      <PageStyles />
      <RevealObserver />
      <FAQSchema faqs={faqs} />
      <ProductSchema
        products={beds.map((b) => ({
          name: b.name,
          description: b.desc,
          image: b.image,
          rentalPrice: b.rentalPrice,
          salePrice: b.salePrice,
        }))}
      />

      <FomoBanner />
      <SiteHeader />

      <main className="bg-white text-gray-800">
        {/* ========== HERO ========== */}
        <section className="hero hero-gradient pt-8 pb-12 md:pt-16 md:pb-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t('badge')}
                </span>

                <h1 className="hero-title mb-4">
                  {t('titleLine1')}
                  <br />
                  <span className="text-amber-600">{t('titleHighlight')}</span>
                </h1>

                <h2 className="hero-sub mb-2 max-w-lg mx-auto md:mx-0">{t('subtitle')}</h2>
                <h6 className="body-text text-teal-700 font-semibold text-base mb-6">{t('bullets')}</h6>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-6">
                  <WhatsAppButton
                    href={waRedirect(locale)}
                    label="hero"
                    className="btn-shine inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <WaIcon size={24} />
                    {t('ctaPrimary')}
                  </WhatsAppButton>
                  <WhatsAppButton
                    href={waRedirect(locale)}
                    label="hero-secondary"
                    className="inline-flex items-center justify-center gap-2 bg-white text-teal-800 px-6 py-4 rounded-xl font-bold text-lg border-2 border-teal-200 hover:border-teal-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {t('ctaSecondary')}
                  </WhatsAppButton>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {(['kkm', 'mda', 'resmed'] as const).map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1.5 bg-white/80 border border-teal-100 text-teal-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                    >
                      <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      {t(`trust.${k}`)}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 bg-white/80 border border-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('trust.since')}
                  </span>
                </div>
              </div>

              {/* Hero image + stat overlay */}
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-family.png"
                  alt={t('imageAlt')}
                  className="rounded-2xl shadow-2xl w-full object-cover"
                  loading="eager"
                />
                <div className="hero-stats absolute -bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 flex justify-around text-center">
                  <span>
                    <Counter target={1247} className="stat-num text-teal-700 counter block" />
                    <span className="text-xs text-gray-500 font-medium">{t('stats.reviews')}</span>
                  </span>
                  <span className="border-l border-gray-200" aria-hidden="true" />
                  <span>
                    <Counter target={5} className="stat-num text-teal-700 counter block" />
                    <span className="text-xs text-gray-500 font-medium">{t('stats.showrooms')}</span>
                  </span>
                  <span className="border-l border-gray-200" aria-hidden="true" />
                  <span>
                    <Counter target={2} className="stat-num text-amber-600 counter block" />
                    <span className="text-xs text-gray-500 font-medium">{t('stats.delivery')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== USP BAR ========== */}
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

        {/* ========== EMOTIONAL ========== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center reveal">
            <span className="sec-badge bg-teal-50 text-teal-700 mb-4">{emo('badge')}</span>
            <h3 className="sec-title mb-4">
              {emo('titleLine1')}
              <br />
              <span className="text-amber-600">{emo('titleHighlight')}</span>
            </h3>
            <h5 className="body-text text-gray-600 text-lg max-w-2xl mx-auto mb-8">{emo('body')}</h5>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { n: 1, bg: 'bg-teal-50', icon: 'bg-teal-100', fg: 'text-teal-700', title: 'text-teal-800', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { n: 2, bg: 'bg-amber-50', icon: 'bg-amber-100', fg: 'text-amber-700', title: 'text-amber-800', d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                { n: 3, bg: 'bg-teal-50', icon: 'bg-teal-100', fg: 'text-teal-700', title: 'text-teal-800', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { n: 4, bg: 'bg-amber-50', icon: 'bg-amber-100', fg: 'text-amber-700', title: 'text-amber-800', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              ].map((c) => (
                <div key={c.n} className={`${c.bg} rounded-2xl p-5 card-hover`}>
                  <span className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <svg className={`w-6 h-6 ${c.fg}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.d} />
                    </svg>
                  </span>
                  <h4 className={`card-title ${c.title} mb-1`}>{emo(`card${c.n}Title`)}</h4>
                  <h6 className="body-text text-xs text-gray-500">{emo(`card${c.n}Desc`)}</h6>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-teal-100 text-teal-700 mb-3">{how('badge')}</span>
              <h3 className="sec-title">
                {how('title')} <span className="text-amber-600">{how('titleHighlight')}</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="reveal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/delivery-install.png" alt={how('imageAlt')} className="rounded-2xl shadow-lg w-full object-cover" />
              </div>
              <div className="space-y-6 reveal">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex gap-4">
                    <span
                      className={`w-12 h-12 ${n === 3 ? 'bg-amber-500' : 'bg-teal-700'} rounded-xl flex items-center justify-center text-white font-heading text-lg shrink-0`}
                    >
                      {n}
                    </span>
                    <span>
                      <h4 className="card-title-lg text-teal-800 mb-1">{how(`step${n}Title`)}</h4>
                      <h6 className="body-text text-gray-500 text-sm">{how(`step${n}Desc`)}</h6>
                    </span>
                  </div>
                ))}
                <WhatsAppButton
                  href={waRedirect(locale)}
                  label="how-it-works"
                  className="btn-shine inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1da851] transition-colors mt-2"
                >
                  <WaIcon size={20} />
                  {how('cta')}
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </section>

        {/* ========== COMFORT & DIGNITY ========== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 reveal">
                <span className="sec-badge bg-amber-50 text-amber-700 mb-4">{comfort('badge')}</span>
                <h3 className="sec-title mb-4">
                  {comfort('titleLead')} <span className="text-amber-600">{comfort('titleHighlight')}</span>
                </h3>
                <h5 className="body-text text-gray-600 mb-4">{comfort('body')}</h5>
                <ul className="space-y-3 mb-6">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-start gap-3 text-gray-600">
                      <Check className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                      {comfort(`point${n}`)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 reveal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/elderly-comfort.png" alt={comfort('imageAlt')} className="rounded-2xl shadow-lg w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ========== WHY US ========== */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-teal-100 text-teal-700 mb-3">{why('badge')}</span>
              <h3 className="sec-title">
                {why('titleLine1')}
                <br className="hidden md:block" />
                <span className="text-amber-600">{why('titleHighlight')}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { n: 1, icon: 'bg-teal-50', fg: 'text-teal-600', title: 'text-teal-800', d: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { n: 2, icon: 'bg-amber-50', fg: 'text-amber-600', title: 'text-teal-800', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
                { n: 3, icon: 'bg-amber-50', fg: 'text-amber-600', title: 'text-amber-700', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', exclusive: true },
                { n: 4, icon: 'bg-teal-50', fg: 'text-teal-600', title: 'text-teal-800', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { n: 5, icon: 'bg-teal-50', fg: 'text-teal-600', title: 'text-teal-800', d: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
                { n: 6, icon: 'bg-teal-50', fg: 'text-teal-600', title: 'text-teal-800', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              ].map((c) => (
                <div
                  key={c.n}
                  className={`bg-white rounded-2xl p-5 md:p-6 border ${c.exclusive ? 'border-amber-200' : 'border-gray-100'} shadow-sm card-hover reveal relative overflow-hidden`}
                >
                  {c.exclusive && (
                    <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                      {why('exclusiveTag')}
                    </span>
                  )}
                  <span className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center mb-3`}>
                    <svg className={`w-6 h-6 ${c.fg}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.d} />
                    </svg>
                  </span>
                  <h4 className={`card-title-lg ${c.title} mb-1`}>{why(`card${c.n}Title`)}</h4>
                  <h6 className="body-text text-sm text-gray-500">{why(`card${c.n}Desc`)}</h6>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== PRODUCTS ========== */}
        <section id="produk" className="py-16 md:py-20 bg-white scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-teal-50 text-teal-700 mb-3">{prod('badge')}</span>
              <h3 className="sec-title mb-2">
                {prod('title')} <span className="text-amber-600">{prod('titleHighlight')}</span>
              </h3>
              <h6 className="body-text text-gray-500 max-w-xl mx-auto">{prod('note')}</h6>
            </div>

            <div id="sewa" className="grid md:grid-cols-3 gap-6 scroll-mt-24">
              {beds.map((bed) => (
                <div
                  key={bed.slug}
                  className={`bg-white rounded-2xl overflow-hidden card-hover reveal relative ${
                    bed.popular ? 'border-2 border-teal-500 shadow-lg' : 'border border-gray-200 shadow-sm'
                  }`}
                >
                  <ProductImpressionTracker slug={bed.slug} />
                  {bed.popular && (
                    <span className="badge-popular block text-white text-center py-1.5 text-sm font-bold">
                      {prod('popular')}
                    </span>
                  )}
                  <span className="relative block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bed.image}
                      alt={prod('imageAltTemplate', { model: bed.name })}
                      className="w-full h-48 object-cover"
                    />
                    {bed.tag && (
                      <span
                        className={`absolute top-3 left-3 ${bed.accent === 'amber' ? 'bg-amber-500' : 'bg-teal-700'} text-white text-xs font-bold px-3 py-1 rounded-full`}
                      >
                        {bed.tag}
                      </span>
                    )}
                  </span>

                  <div className="p-5">
                    <h4 className="card-title-lg text-teal-800 mb-1">{bed.name}</h4>
                    <h6 className="body-text text-sm text-gray-500 mb-4">{bed.desc}</h6>

                    <div className={`${bed.accent === 'amber' ? 'bg-amber-50' : 'bg-teal-50'} rounded-xl p-4 mb-4`}>
                      <span className="flex items-end gap-2 mb-1">
                        <span
                          className={`font-heading text-3xl ${bed.accent === 'amber' ? 'text-amber-700' : 'text-teal-700'}`}
                        >
                          {prod('priceFrom', { price: bed.rentalPrice })}
                        </span>
                        <span className="text-gray-500 text-sm">{prod('perMonth')}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        {prod('orBuy')}{' '}
                        <span className={`font-semibold ${bed.accent === 'amber' ? 'text-amber-700' : 'text-teal-700'}`}>
                          RM{bed.salePrice.toLocaleString('en-US')}
                        </span>{' '}
                        {prod('buyOutright')}
                      </span>
                    </div>

                    {bed.features.length > 0 && (
                      <ul className="space-y-2 mb-5 text-sm text-gray-600">
                        {bed.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    <WhatsAppButton
                      href={waRedirect(locale, undefined, undefined, siteConfig.productSlug)}
                      label={`product-${bed.slug}`}
                      className={`btn-shine block text-center ${
                        bed.popular ? 'bg-[#25D366] hover:bg-[#1da851]' : 'bg-teal-700 hover:bg-teal-800'
                      } text-white py-3 rounded-xl font-bold transition-colors`}
                    >
                      {prod('cta')}
                    </WhatsAppButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== BUYBACK GUARANTEE ========== */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-teal-800 to-teal-950 text-white relative overflow-hidden">
          <span className="absolute inset-0 opacity-10" aria-hidden="true">
            <span className="absolute top-10 left-10 w-40 h-40 bg-amber-400 rounded-full blur-3xl block" />
            <span className="absolute bottom-10 right-10 w-60 h-60 bg-teal-400 rounded-full blur-3xl block" />
          </span>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10 reveal">
            <span className="sec-badge bg-amber-500/20 text-amber-300 mb-4">{buyback('badge')}</span>
            <h3 className="sec-title text-white mb-4">
              {buyback('title')} <span className="text-amber-400">{buyback('titleHighlight')}</span>
            </h3>
            <h5 className="body-text text-teal-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">{buyback('body')}</h5>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <span className="font-heading text-2xl text-amber-400 block">{buyback(`stat${n}Value`)}</span>
                  <span className="text-xs text-teal-200">{buyback(`stat${n}Label`)}</span>
                </div>
              ))}
            </div>
            <WhatsAppButton
              href={waRedirect(locale)}
              label="buyback"
              className="btn-shine inline-flex items-center gap-2 bg-amber-500 text-teal-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors"
            >
              <WaIcon size={20} />
              {buyback('cta')}
            </WhatsAppButton>
          </div>
        </section>

        {/* ========== ADD-ONS ========== */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-amber-50 text-amber-700 mb-3">{addons('badge')}</span>
              <h3 className="sec-title">
                {addons('title')} <span className="text-amber-600">{addons('titleHighlight')}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {addonItems.map((a) => (
                <div key={a.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover reveal">
                  <ProductImpressionTracker slug={a.slug} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.image} alt={prod('imageAltTemplate', { model: a.name })} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <h4 className="card-title text-teal-800 mb-1">{a.name}</h4>
                    <h6 className="body-text text-xs text-gray-500 mb-2">{a.desc}</h6>
                    <span className="font-heading text-xl text-teal-700 block">{a.price}</span>
                    <WhatsAppButton
                      href={waRedirect(locale, undefined, undefined, siteConfig.productSlug)}
                      label={`addon-${a.slug}`}
                      className="mt-3 block text-center bg-teal-50 text-teal-700 py-2 rounded-lg text-sm font-semibold hover:bg-teal-100 transition-colors"
                    >
                      {addons('cta')}
                    </WhatsAppButton>
                  </div>
                </div>
              ))}
            </div>

            {/* CPAP / ResMed callout */}
            <div className="mt-8 bg-white rounded-2xl border border-blue-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 reveal">
              <span className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </span>
              <div className="text-center md:text-left">
                <h4 className="card-title-lg text-teal-800 mb-1">{addons('cpapTitle')}</h4>
                <h6 className="body-text text-gray-500 text-sm mb-3">{addons('cpapDesc')}</h6>
                <WhatsAppButton
                  href={waRedirect(locale)}
                  label="cpap"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800"
                >
                  {addons('cpapCta')} →
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </section>

        {/* ========== DELIVERY COVERAGE ========== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-teal-50 text-teal-700 mb-3">{del('badge')}</span>
              <h3 className="sec-title">
                {del('title')} <span className="text-amber-600">{del('titleHighlight')}</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { n: 1, bg: 'bg-teal-50', icon: 'bg-teal-100', fg: 'text-teal-700', time: 'text-teal-700', area: 'text-teal-600', d: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { n: 2, bg: 'bg-amber-50', icon: 'bg-amber-100', fg: 'text-amber-700', time: 'text-amber-700', area: 'text-amber-600', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { n: 3, bg: 'bg-gray-50', icon: 'bg-gray-100', fg: 'text-gray-600', time: 'text-gray-700', area: 'text-gray-600', d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((tier) => (
                <div key={tier.n} className={`${tier.bg} rounded-2xl p-6 text-center card-hover reveal`}>
                  <span className={`w-14 h-14 ${tier.icon} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <svg className={`w-7 h-7 ${tier.fg}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tier.d} />
                    </svg>
                  </span>
                  <h4 className={`font-heading text-3xl ${tier.time} mb-1`}>{del(`tier${tier.n}Time`)}</h4>
                  <h5 className={`body-text text-sm ${tier.area} font-semibold mb-2`}>{del(`tier${tier.n}Area`)}</h5>
                  <h6 className="body-text text-xs text-gray-500">{del(`tier${tier.n}Note`)}</h6>
                </div>
              ))}
            </div>

            {/* Location links — local SEO entry points */}
            <div id="lokasi" className="flex flex-wrap justify-center gap-2 reveal scroll-mt-24">
              {featuredLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/${locale}/${siteConfig.productSlug}/${loc.slug}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors"
                >
                  {loc.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SHOWROOMS ========== */}
        <section id="showroom" className="py-16 md:py-20 bg-gray-50 scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-amber-50 text-amber-700 mb-3">{show('badge')}</span>
              <h3 className="sec-title">
                {show('title')} <span className="text-amber-600">{show('titleHighlight')}</span>
              </h3>
              <h6 className="body-text text-gray-500 mt-2">{show('note')}</h6>
            </div>

            <div className="mb-8 reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/showroom.png"
                alt={show('imageAlt')}
                className="rounded-2xl shadow-lg w-full object-cover max-h-72 md:max-h-96"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {showrooms.map((s) => (
                <div key={s.key} className="showroom-gradient rounded-2xl p-6 text-white card-hover reveal">
                  <span className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <span>
                      <h4 className="card-title-lg text-white">{s.name}</h4>
                      {s.sub && <span className="text-teal-200 text-xs">{s.sub}</span>}
                    </span>
                  </span>
                  <h6 className="body-text text-teal-100 text-sm mb-3">{s.desc}</h6>
                  <WhatsAppButton
                    href={waRedirect(locale)}
                    label={`showroom-${s.key}`}
                    className="inline-flex items-center gap-1 text-amber-300 text-sm font-semibold hover:text-amber-200"
                  >
                    {show('cta')} →
                  </WhatsAppButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== TESTIMONIALS ========== */}
        <section className="py-16 md:py-20 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-amber-50 text-amber-700 mb-3">{rev('badge')}</span>
              <h3 className="sec-title">
                {rev('title')} <span className="text-amber-600">{rev('titleHighlight')}</span>
              </h3>
            </div>
          </div>

          <div className="overflow-hidden mb-4">
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

        {/* ========== FAQ ========== */}
        <section id="faq" className="py-16 md:py-20 bg-gray-50 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10 reveal">
              <span className="sec-badge bg-teal-50 text-teal-700 mb-3">{faqT('badge')}</span>
              <h3 className="sec-title">
                {faqT('title')} <span className="text-amber-600">{faqT('titleHighlight')}</span>
              </h3>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-teal-800 to-teal-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" role="img" aria-label={final('bgAlt')}>
            <span className="absolute top-20 right-20 w-80 h-80 bg-amber-400 rounded-full blur-3xl block" />
          </div>
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10 reveal">
            <h3 className="sec-title text-white mb-4">
              {final('title')}
              <br />
              <span className="text-amber-400">{final('titleHighlight')}</span>
            </h3>
            <h5 className="body-text text-teal-100 text-lg md:text-xl mb-8 max-w-xl mx-auto">{final('body')}</h5>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppButton
                href={waRedirect(locale)}
                label="final-cta"
                className="btn-shine inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <WaIcon size={24} />
                {final('ctaPrimary')}
              </WhatsAppButton>
              <WhatsAppButton
                href={waRedirect(locale)}
                label="final-cta-secondary"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {final('ctaSecondary')}
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />

      {/* Floating WhatsApp FAB — desktop only. On mobile the sticky bottom
          bar already carries this CTA, and a FAB there would sit on top of
          the footer copy. */}
      <WhatsAppButton
        href={waRedirect(locale)}
        label="floating"
        ariaLabel="WhatsApp"
        className="hidden md:flex fixed bottom-6 right-4 z-40 w-14 h-14 bg-[#25D366] rounded-full items-center justify-center shadow-lg pulse-wa hover:scale-110 transition-transform"
      >
        <WaIcon size={28} className="text-white" />
      </WhatsAppButton>

      {/* Reserves flow height for the fixed CTA bar below, so it cannot
          cover the end of the footer on mobile. */}
      <div className="mobile-cta-spacer" aria-hidden="true" />

      {/* Sticky mobile CTA bar */}
      <div className="mobile-cta-bar fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3 gap-3">
        <WhatsAppButton
          href={waRedirect(locale)}
          label="sticky-mobile"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm"
        >
          <WaIcon size={20} />
          {final('ctaPrimary')}
        </WhatsAppButton>
      </div>
    </>
  );
}
