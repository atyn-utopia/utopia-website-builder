import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getProducts, getBlogPosts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';
import HomePageClient from '@/components/HomePageClient';

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
  const faqT = await getTranslations({ locale, namespace: 'faq' });
  const hero = await getTranslations({ locale, namespace: 'hero' });
  const fomo = await getTranslations({ locale, namespace: 'fomoBanner' });
  const finalCtaT = await getTranslations({ locale, namespace: 'finalCta' });

  const faqs = [];
  for (let i = 0; i < 6; i++) {
    faqs.push({
      question: faqT(`items.${i}.question`),
      answer: faqT(`items.${i}.answer`),
    });
  }

  const [products, blogPosts] = await Promise.all([
    getProducts(),
    getBlogPosts(locale),
  ]);

  const fomoTexts = fomo.raw('texts') as string[];
  const fomoText = fomoTexts[0];

  return (
    <>
      <PageStyles />
      <LocalBusinessSchema locale={locale} />
      <FAQSchema faqs={faqs} />

      <FomoBanner text={fomoText} />
      <SiteHeader />

      {/* HERO — same treatment as the location page (.hero dark band, badge →
          H1 → H2 → WhatsApp CTA) with the technician photo restored. */}
      <section className="hero">
        <div className="hero-bg" role="img" aria-label={hero('imageAlt')} />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="hero-badge">● {hero('badge')}</span>
              <h1>
                {hero('h1Pre')}{' '}
                <span className="hl">{hero('h1Highlight')}</span>{' '}
                {hero('h1Suffix')}
              </h1>
              <h2 className="hero-sub">{hero('subheadline')}</h2>
              <div className="hero-ctas">
                <a
                  href={waRedirect(locale)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-wa btn-lg"
                >
                  {hero('ctaPrimary')}
                </a>
                <a href="#services" className="btn btn-outline btn-lg">
                  {hero('ctaSecondary')}
                </a>
              </div>
              <div className="hero-trust">✓ {hero('trustBadge')}</div>
            </div>
            <div className="hero-media">
              <span className="arrival-flag">⚡ {hero('arrivalFlag')}</span>
              <img
                src="/brand/hero-technician.png"
                alt={hero('imageAlt')}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <HomePageClient
        locale={locale}
        products={products}
        recentPosts={blogPosts.slice(0, 3)}
      />

      <SiteFooter locale={locale} />
    </>
  );
}
