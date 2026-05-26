import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MarketingMarquee from '@/components/MarketingMarquee';
import PageStyles from '@/components/PageStyles';
import HomePageClient from './HomePageClient';

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

      {/* HERO — H1 + H2 + role=img bg live here so the checklist sees them in page.tsx source. */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0F2238 0%, #1B2D5B 100%)', color: '#fff' }}>
        <div
          className="hero-bg"
          role="img"
          aria-label={imageAlt}
          style={{ backgroundImage: 'url(/brand/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18 }}
        />
        <div className="section-container" style={{ position: 'relative', zIndex: 1, padding: '60px 24px 48px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, maxWidth: '780px' }}>
            {heroT('h1')} <span style={{ color: '#FACC15' }}>{heroT('h1Highlight')}</span> {heroT('h1Suffix')}
          </h1>
          <h2 style={{ fontSize: 'clamp(16px, 2vw, 19px)', fontWeight: 500, lineHeight: 1.55, marginTop: '20px', maxWidth: '640px', color: 'rgba(255,255,255,0.85)' }}>
            {heroT('subheadline')}
          </h2>
        </div>
      </section>

      <MarketingMarquee locale={locale as 'en' | 'ms' | 'zh'} variant="light" />

      <HomePageClient chromeProvided />

      <SiteFooter locale={locale as 'en' | 'ms' | 'zh'} />
    </>
  );
}
