import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { seoAlternates } from '@/lib/seoAlternates';
import { siteConfig } from '@/config/site';
import { waRedirect } from '@/lib/waRedirect';
import { ogImages } from '@/lib/ogImage';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactNumber from '@/components/ContactNumber';
import PageStyles from '@/components/PageStyles';
import { WhatsAppIcon } from '@/components/sections/Icons';
import UspBar from '@/components/sections/UspBar';
import ProductSection, { getHeroPhoto } from '@/components/sections/ProductSection';
import StepsSection from '@/components/sections/StepsSection';
import DailyLifeSection from '@/components/sections/DailyLifeSection';
import LocationsSection from '@/components/sections/LocationsSection';
import FaqSection from '@/components/sections/FaqSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FinalCta from '@/components/sections/FinalCta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const url = `${siteConfig.siteUrl}/${locale}`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: seoAlternates(locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url,
      siteName: siteConfig.brandName,
      type: 'website',
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
      images: ogImages(locale),
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const waHref = waRedirect(locale);
  const heroPhoto = await getHeroPhoto(locale);
  const callouts = [0, 1, 2, 3].map((i) => tHero(`callouts.${i}`));
  const faqs = [0, 1, 2, 3, 4, 5].map((i) => ({
    question: tFaq(`items.${i}.question`),
    answer: tFaq(`items.${i}.answer`),
  }));

  return (
    <>
      <PageStyles />
      <LocalBusinessSchema locale={locale} />
      <ProductSchema name={tMeta('title')} description={tMeta('description')} locale={locale} />
      <FAQSchema faqs={faqs} />

      <FomoBanner locale={locale as 'en' | 'ms' | 'zh'} />
      <SiteHeader contact={<ContactNumber locale={locale} page="/" />} />

      {/* ── Hero: the chair, annotated ─────────────────────────────────── */}
      <section className="ew-hero">
        <div className="ew-wrap ew-hero__inner">
          <div className="ew-hero__copy">
            <Image
              src="/brand/logo-light.png"
              alt={tNav('logoAlt')}
              className="ew-hero__logo"
              width={1400}
              height={1175}
              priority
            />
            <span className="ew-eyebrow">{tHero('badge')}</span>
            <h1>
              {tHero('h1')} {tHero('h1Highlight')} {tHero('h1Suffix')}
            </h1>
            <h2>{tHero('subheadline')}</h2>
            <p className="ew-hero__trust">{tHero('trustBadge')}</p>
            <div className="ew-hero__ctas">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
                <WhatsAppIcon size={18} />
                {tHero('ctaPrimary')}
              </a>
            </div>
            <Image
              src="/brand/mda-kkm-badge.avif"
              alt={tHero('mdaKkmBadgeAlt')}
              className="ew-hero__badge"
              width={250}
              height={114}
            />
          </div>

          <div className="ew-diagram">
            <Image
              className="ew-diagram__chair"
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              width={1100}
              height={825}
              sizes="(min-width: 900px) 520px, 88vw"
              priority
            />
            {/* Desktop: fine lines from the label to a dot on the chair.
                Below 900px there is no room for them, so the same four facts
                render as the list underneath. The chair is photographed from
                the front, so its right armrest — where the joystick sits — is
                on the viewer's LEFT; the joystick callout goes on that side. */}
            <span className="ew-callout ew-callout--l ew-callout--1">
              <span>{callouts[2]}</span>
              <span className="ew-callout__line" />
              <span className="ew-callout__dot" />
            </span>
            <span className="ew-callout ew-callout--l ew-callout--2">
              <span>{callouts[1]}</span>
              <span className="ew-callout__line" />
              <span className="ew-callout__dot" />
            </span>
            <span className="ew-callout ew-callout--r ew-callout--3">
              <span>{callouts[0]}</span>
              <span className="ew-callout__line" />
              <span className="ew-callout__dot" />
            </span>
            <span className="ew-callout ew-callout--r ew-callout--4">
              <span>{callouts[3]}</span>
              <span className="ew-callout__line" />
              <span className="ew-callout__dot" />
            </span>
            <ul className="ew-spec-list">
              {callouts.map((line) => (
                <li key={line}>
                  <i aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <UspBar locale={locale} />
      <ProductSection locale={locale} waHref={waHref} />
      <StepsSection locale={locale} waHref={waHref} />
      <DailyLifeSection locale={locale} />
      <LocationsSection locale={locale} />
      <FaqSection locale={locale} faqs={faqs} />
      <ReviewsSection locale={locale} />
      <FinalCta locale={locale} waHref={waHref} />

      <SiteFooter locale={locale as 'en' | 'ms' | 'zh'} page="/" />
    </>
  );
}
