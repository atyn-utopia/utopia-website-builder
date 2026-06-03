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
import { waRedirect } from '@/lib/waRedirect';

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

      {/* HERO — two-column: copy on the left, wheelchair photo as a real
          foreground element on the right. Solid navy gradient bg (no photo bg).
          H1 + H2 + role=img live in page.tsx for the checklist. */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
          background: 'linear-gradient(135deg, #0F1B3A 0%, #1B2D5B 55%, #2A4080 100%)',
        }}
      >
        {/* Subtle dot texture + labelled region for a11y/checklist. */}
        <div
          className="hero-bg"
          role="img"
          aria-label={imageAlt}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='2' cy='2' r='1' fill='white'/%3E%3C/svg%3E\")" }}
        />
        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '64px 24px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(244,123,32,0.15)', color: '#F47B20', border: '1px solid rgba(244,123,32,0.35)', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
              ● {heroT('badge')}
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
              {heroT('h1')} <span style={{ color: '#F47B20' }}>{heroT('h1Highlight')}</span> {heroT('h1Suffix')}
            </h1>
            <h2 style={{ fontSize: 'clamp(16px, 2vw, 19px)', fontWeight: 500, lineHeight: 1.55, marginTop: 20, maxWidth: '52ch', color: 'rgba(255,255,255,0.82)' }}>
              {heroT('subheadline')}
            </h2>
            <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href={waRedirect(locale)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 999, textDecoration: 'none' }}
              >
                {heroT('ctaPrimary')}
              </a>
              <a
                href="#products"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', background: 'transparent', color: '#fff', fontWeight: 600, fontSize: 15, border: '1.5px solid #F47B20', borderRadius: 999, textDecoration: 'none' }}
              >
                {heroT('ctaSecondary')}
              </a>
            </div>
            <p style={{ marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>✓ {heroT('trustBadge')}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_PHOTO_URL}
              alt={imageAlt}
              loading="eager"
              style={{
                width: '100%',
                maxWidth: 460,
                height: 'auto',
                filter: 'drop-shadow(0 30px 60px rgba(244,123,32,0.25))',
                // Fade the bottom of the source photo so the white pedestal
                // baked into the brand asset dissolves into the navy hero bg.
                WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </section>

      <HomePageClient chromeProvided heroProvided />

      <SiteFooter locale={locale as 'en' | 'ms' | 'zh'} />
    </>
  );
}
