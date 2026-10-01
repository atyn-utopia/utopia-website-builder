import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { seoAlternates } from '@/lib/seoAlternates';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n/routing';
import { locations, regionKeys, getLocationBySlug, getNearbyLocations } from '@/config/locations';
import { waRedirect } from '@/lib/waRedirect';
import { ogImages } from '@/lib/ogImage';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import PageStyles from '@/components/PageStyles';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactNumber from '@/components/ContactNumber';
import { Icon, WhatsAppIcon } from '@/components/sections/Icons';
import UspBar from '@/components/sections/UspBar';
import ProductSection, { getHeroPhoto } from '@/components/sections/ProductSection';
import StepsSection from '@/components/sections/StepsSection';
import FaqSection from '@/components/sections/FaqSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FinalCta from '@/components/sections/FinalCta';

// Same-day is a Peninsular promise; Sabah and Sarawak are 2–3 business days
// (faq.items.2). The page copy follows the state, never the site-wide line.
const EAST_MALAYSIA = new Set(['Sabah', 'Sarawak']);

export function generateStaticParams() {
  const params: { locale: string; location: string }[] = [];
  for (const locale of locales) {
    for (const loc of locations) {
      params.push({ locale, location: loc.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; location: string }> }) {
  const { locale, location: locationSlug } = await params;
  const loc = getLocationBySlug(locationSlug);
  if (!loc) return { title: 'Not Found' };

  const t = await getTranslations({ locale, namespace: 'location' });
  const title = `${t('h1Prefix')} ${loc.name} ${t('metaTitleSuffix')}`;
  const description = `${t('metaDescPrefix')} ${loc.name}${t('metaDescSuffix')}`;
  const url = `${siteConfig.siteUrl}/${locale}/${siteConfig.productSlug}/${locationSlug}`;

  return {
    title,
    description,
    alternates: seoAlternates(locale, `/${siteConfig.productSlug}/${locationSlug}`),
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.brandName,
      type: 'website',
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
      images: ogImages(locale),
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ locale: string; location: string }> }) {
  const { locale, location: locationSlug } = await params;
  const loc = getLocationBySlug(locationSlug);
  if (!loc) notFound();

  const t = await getTranslations({ locale, namespace: 'location' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });

  const pagePath = `/${siteConfig.productSlug}/${locationSlug}`;
  // The town rides into the redirect so the lead is attributed to it.
  const waHref = waRedirect(locale, undefined, locationSlug);
  const city = loc.name;
  const east = EAST_MALAYSIA.has(loc.state);
  const regionKey = regionKeys[loc.state];
  const heroPhoto = await getHeroPhoto(locale);
  const nearby = getNearbyLocations(locationSlug);

  const cityFaq = {
    question: t('faqCityQ', { city }),
    answer: east ? t('faqCityAEast', { city }) : t('faqCityASameDay', { city }),
  };
  const faqs = [cityFaq, ...[0, 1, 3, 4, 5].map((i) => ({ question: tFaq(`items.${i}.question`), answer: tFaq(`items.${i}.answer`) }))];

  const breadcrumbItems = [
    { name: t('breadcrumbHome'), url: `/${locale}` },
    { name: t('breadcrumbProduct'), url: `/${locale}#products` },
    { name: city, url: `/${locale}${pagePath}` },
  ];

  return (
    <>
      <PageStyles />
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocalBusinessSchema locale={locale} locationSlug={locationSlug} cityName={city} />
      <FAQSchema faqs={faqs} />

      <FomoBanner locale={locale as 'en' | 'ms' | 'zh'} />
      <SiteHeader contact={<ContactNumber locale={locale} page={pagePath} />} />

      {/* ── Hero: dark, the city first ─────────────────────────────────── */}
      <section className="ew-lhero">
        <div className="ew-wrap ew-lhero__inner">
          <div className="ew-lhero__copy">
            <nav className="ew-crumbs" aria-label="Breadcrumb">
              <a href={`/${locale}`}>{t('breadcrumbHome')}</a>
              <span aria-hidden="true">›</span>
              <a href={`/${locale}#products`}>{t('breadcrumbProduct')}</a>
              <span aria-hidden="true">›</span>
              <span>{city}</span>
            </nav>
            <span className="ew-eyebrow ew-eyebrow--on-dark">{t('eyebrow', { state: loc.state })}</span>
            <h1>
              {t('h1Prefix')} {city}
            </h1>
            <h2>{t('subheadline', { city })}</h2>
            <div className="ew-hero__ctas">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
                <WhatsAppIcon size={18} />
                {t('ctaPrimary')}
              </a>
              <a href="#products" className="ghost-btn ghost-btn--dark">
                {t('ctaSecondary')}
              </a>
            </div>
          </div>

          {/* The local card: what delivery to this town looks like. No phone
              number here — CLAUDE.md keeps the number to header and footer. */}
          <aside className="ew-local" aria-label={t('cardTitle', { city })}>
            <div className="ew-local__photo">
              <Image src={heroPhoto.src} alt={heroPhoto.alt} width={1100} height={825} sizes="(min-width: 900px) 360px, 70vw" priority />
            </div>
            <h3 className="ew-local__title">{t('cardTitle', { city })}</h3>
            <ul className="ew-local__rows">
              <li>
                <Icon name="pin" size={20} />
                <span><b>{city}</b><small>{loc.state}</small></span>
              </li>
              <li>
                <Icon name="clock" size={20} />
                <span><b>{east ? t('eastDays') : t('sameDay')}</b><small>{east ? t('eastNote') : t('sameDayNote')}</small></span>
              </li>
              <li>
                <Icon name="wrench" size={20} />
                <span><b>{t('setup')}</b><small>{t('setupNote')}</small></span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <UspBar locale={locale} />

      {/* ── Nearby towns, up top where a visitor from the wrong page needs them ── */}
      {nearby.length > 0 && (
        <div className="ew-nearby">
          <div className="ew-wrap ew-nearby__inner">
            <span className="ew-nearby__label">{t('nearbyStrip')}</span>
            <div className="ew-nearby__chips">
              {nearby.map((n) => (
                <a key={n.slug} href={`/${locale}/${siteConfig.productSlug}/${n.slug}`}>{n.name}</a>
              ))}
              <a href={`/${locale}#locations`} className="ew-nearby__all">{t('allLocations')}</a>
            </div>
          </div>
        </div>
      )}

      <ProductSection locale={locale} location={locationSlug} />
      <StepsSection locale={locale} location={locationSlug} />

      {/* ── Local introduction: one per region, so no two states read alike ── */}
      <section className="ew-sec ew-sec--paper ew-intro">
        <div className="ew-wrap ew-intro__inner">
          <span className="ew-eyebrow">{t('introEyebrow', { city })}</span>
          <h3>{t('introHeading', { city })}</h3>
          <p>{t(`regionIntro.${regionKey}`, { city })}</p>
          <p>
            {t('cityLine', { city, state: loc.state })} {east ? t('eastLong') : t('sameDayLong')}
          </p>
        </div>
      </section>

      <FaqSection locale={locale} faqs={faqs} />
      <ReviewsSection locale={locale} />
      <FinalCta locale={locale} location={locationSlug} heading={t('finalHeading', { city })} />

      <SiteFooter locale={locale as 'en' | 'ms' | 'zh'} page={pagePath} />
    </>
  );
}
