import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';
import HomePageClient from '@/components/HomePageClient';

// The wheelchair hero photo is hosted on the brand's Wix CDN (no public/brand
// dir exists in this project). HomePageClient already references the same URL
// for its product gallery, so it's already cached on visitors' browsers.
const HERO_PHOTO_URL =
  'https://static.wixstatic.com/media/d3104b_64b5d16422824a7384e5630d9b70c0ae~mv2.png';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const url = `${siteConfig.siteUrl}/${locale}`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.siteUrl}/en`,
        ms: `${siteConfig.siteUrl}/ms`,
        zh: `${siteConfig.siteUrl}/zh`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url,
      siteName: siteConfig.brandName,
      type: 'website',
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const faqT = await getTranslations({ locale, namespace: 'faq' });
  const heroT = await getTranslations({ locale, namespace: 'hero' });
  const tRoot = await getTranslations({ locale });
  const imageAlt = tRoot('imageAlt');

  // Build FAQ array for schema
  const faqs = [];
  for (let i = 0; i < 6; i++) {
    faqs.push({
      question: faqT(`items.${i}.question`),
      answer: faqT(`items.${i}.answer`),
    });
  }

  return (
    <>
      <PageStyles />
      <LocalBusinessSchema locale={locale} />
      <ProductSchema name={t('title')} description={t('description')} locale={locale} />
      <FAQSchema faqs={faqs} />

      <FomoBanner locale={locale as 'en' | 'ms' | 'zh'} />
      <SiteHeader locale={locale as 'en' | 'ms' | 'zh'} />

      {/* HERO — gradient-over-photo layout. H1 + H2 + role=img bg live in
          page.tsx source so the checklist sees them. */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
          background: `linear-gradient(135deg, rgba(15,27,58,0.86) 0%, rgba(27,45,91,0.82) 50%, rgba(42,64,128,0.86) 100%), url('${HERO_PHOTO_URL}') center right / cover no-repeat`,
        }}
      >
        {/* Labelled region for screen readers + checklist; the visible
            gradient-over-photo is on the section itself. */}
        <div
          className="hero-bg"
          role="img"
          aria-label={imageAlt}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
        <div className="section-container" style={{ position: 'relative', zIndex: 1, padding: '64px 24px 56px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, maxWidth: '780px' }}>
            {heroT('h1')} <span style={{ color: '#F47B20' }}>{heroT('h1Highlight')}</span> {heroT('h1Suffix')}
          </h1>
          <h2 style={{ fontSize: 'clamp(16px, 2vw, 19px)', fontWeight: 500, lineHeight: 1.55, marginTop: '20px', maxWidth: '640px', color: 'rgba(255,255,255,0.85)' }}>
            {heroT('subheadline')}
          </h2>
        </div>
      </section>

      <HomePageClient chromeProvided heroProvided />

      <SiteFooter locale={locale as 'en' | 'ms' | 'zh'} />
    </>
  );
}
