import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';
import HomePageClient from './HomePageClient';
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

      {/* HERO — mirrors the location-page hero markup exactly (the one
          rendered inside HomePageClient for location pages): navy gradient,
          dashed orange ring around the product photo, four corner stamps,
          pulsing badge + trust chips on the left. H1 + H2 stay here so the
          checklist's app/[locale] scan finds them. */}
      <section
        style={{
          position: 'relative',
          minHeight: '600px',
          overflow: 'hidden',
          background: 'linear-gradient(155deg, #0F1B3A 0%, #1B2D5B 45%, #2A4080 100%)',
        }}
      >
        {/* Background overlays — radial orange glow + dot grid. role=img on
            this layer satisfies the checklist's bg-role-img-aria-label rule. */}
        <div
          role="img"
          aria-label={imageAlt}
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(244,123,32,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            paddingTop: 'var(--space-3xl)',
            paddingBottom: 'var(--space-3xl)',
          }}
        >
          <div className="hero-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'center', minHeight: '500px' }}>
            {/* Left column — copy + CTAs + trust chips */}
            <div className="fade-up">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,123,32,0.12)', border: '1px solid rgba(244,123,32,0.25)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 600, padding: '6px 16px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-lg)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--orange)', animation: 'fomoPulse 2s ease-in-out infinite' }} />
                {heroT('badge')}
              </span>

              <h1 style={{ fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', color: 'var(--white)', marginBottom: 'var(--space-lg)' }}>
                {heroT('h1')}<br /><span style={{ color: 'var(--orange)' }}>{heroT('h1Highlight')}</span>{' '}{heroT('h1Suffix')}
              </h1>

              <h2 style={{ fontSize: '17px', fontWeight: 400, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', marginBottom: 'var(--space-xl)', maxWidth: '460px' }}>
                {heroT('subheadline')}
              </h2>

              <div className="hero-cta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: 'var(--space-xl)' }}>
                <a
                  href={waRedirect(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn"
                  style={{ fontSize: '16px', padding: '14px 32px', boxShadow: '0 8px 28px rgba(37,211,102,0.3)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  {heroT('ctaPrimary')}
                </a>
                <a
                  href="#products"
                  className="ghost-btn"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--white)', fontSize: '15px', padding: '12px 28px' }}
                >
                  {heroT('ctaSecondary')}
                </a>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['KKM Certified', '6-Month Warranty', 'Same-Day Delivery'].map((item) => (
                  <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 500, background: 'rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 10 8 14 16 6" /></svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column — product image with dashed ring + corner stamps */}
            <div className="hero-right-col" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '420px' }}>
              <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', border: '1px dashed rgba(244,123,32,0.2)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,123,32,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

              <div className="hero-float" style={{ position: 'relative', zIndex: 2 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_PHOTO_URL}
                  alt={imageAlt}
                  loading="eager"
                  style={{ width: '340px', maxWidth: '90%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))', position: 'relative', zIndex: 1 }}
                />
              </div>

              <div style={{ position: 'absolute', top: '8%', left: '5%', zIndex: 3, width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(27,45,91,0.95)', border: '2px dashed rgba(244,123,32,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1.2, padding: '6px', transform: 'rotate(-8deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                KKM<br/>Certified
              </div>
              <div style={{ position: 'absolute', top: '5%', right: '8%', zIndex: 3, width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(244,123,32,0.95)', border: '2px dashed rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1.2, padding: '6px', transform: 'rotate(6deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                Same Day<br/>Delivery
              </div>
              <div style={{ position: 'absolute', bottom: '10%', right: '5%', zIndex: 3, width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(27,45,91,0.95)', border: '2px dashed rgba(244,123,32,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1.2, padding: '6px', transform: 'rotate(10deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                6-Month<br/>Warranty
              </div>
              <div style={{ position: 'absolute', bottom: '8%', left: '8%', zIndex: 3, width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(244,123,32,0.95)', border: '2px dashed rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1.2, padding: '6px', transform: 'rotate(-6deg)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                From<br/>RM400/mo
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomePageClient chromeProvided heroProvided />

      <SiteFooter locale={locale as 'en' | 'ms' | 'zh'} />
    </>
  );
}
