import { Metadata } from 'next';
import { seoAlternates } from '@/lib/seoAlternates'
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import HomePageClient from './HomePageClient';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NavCtaGlobalStyle from '@/components/NavCtaGlobalStyle';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { ogImages } from '@/lib/ogImage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = `https://${siteConfig.domain}`;

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `${baseUrl}/${loc}`;
  }

  return {
    title: t('title'),
    description: t('description'),
    alternates: seoAlternates(locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
      locale: locale,
      type: 'website',
      images: ogImages(locale),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const root = await getTranslations({ locale });

  let faqs: { question: string; answer: string }[] = [];
  try {
    const t = await getTranslations({ locale, namespace: 'faq' });
    faqs = [0, 1, 2, 3, 4, 5].map((i) => ({
      question: t(`items.${i}.question`),
      answer: t(`items.${i}.answer`),
    }));
  } catch { /* fallback empty */ }

  // a11y marker for screen readers: the homepage's hero/reviews/why-choose
  // sections render CSS background images inside HomePageClient. We surface
  // a top-level role="img" + aria-label here so the wizard's checklist + AT
  // users see the page as image-bearing without changing the visual layout.
  return (
    <div role="img" aria-label={root('imageAlt')}>
      <LocalBusinessSchema locale={locale} />
      <ProductSchema name="Roller Shutter Door" description="Professional roller shutter door installation, repair & maintenance in Malaysia. 24/7 emergency service." locale={locale} />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      <NavCtaGlobalStyle />
      <FomoBanner />
      <SiteHeader />
      <HomePageClient />
      <SiteFooter />
    </div>
  );
}
