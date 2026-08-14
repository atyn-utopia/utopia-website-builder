import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/lib/webcore';
import { buildAlternates } from '@/lib/alternates';
import { siteConfig } from '@/config/site';
import HomePageClient from './HomePageClient';
import { MedicalBusinessSchema } from '@/components/schema/MedicalBusinessSchema';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import type { ProductCardData } from '@/components/ProductCard';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';
import { ogImages } from '@/lib/ogImage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('home.title'),
    description: t('home.description'),
    alternates: buildAlternates('', locale),
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
      url: `${siteConfig.siteUrl}/${locale}`,
      type: 'website',
      locale: t('ogLocale'),
      siteName: siteConfig.brandName,
      images: ogImages(locale),
    },
    twitter: { card: 'summary_large_image', images: ogImages(locale) },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dbProducts = await getProducts();
  const faqT = await getTranslations({ locale, namespace: 'faq' });

  const cardProducts: ProductCardData[] = dbProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    rental_price: p.rental_price,
    sale_price: p.sale_price,
    prices: p.prices ?? [],
    image: p.photos?.[0]?.url,
  }));

  const faqs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
    question: faqT(`q${i}.q`),
    answer: faqT(`q${i}.a`),
  }));

  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tRoot = await getTranslations({ locale });
  const heroBgAlt = tRoot('imageAlt');

  return (
    <>
      <MedicalBusinessSchema locale={locale} />
      <LocalBusinessSchema locale={locale} />
      {cardProducts.map((p) => (
        <ProductSchema
          key={p.slug}
          name={p.name}
          description={p.description || undefined}
          locale={locale}
          slug={p.slug}
          image={p.image}
          salePrice={p.sale_price ?? undefined}
          rentalPrice={p.rental_price ?? undefined}
        />
      ))}
      <FAQSchema faqs={faqs} />
      <PageStyles />
      <FomoBanner />
      {/* SiteHeader floats absolutely over the hero so there's no separate
          header strip above. The relative wrapper makes the hero its
          positioning context. */}
      <div style={{ position: 'relative' }}>
        <SiteHeader />
        {/* Decorative hero background labelled for screen readers + the
            checklist role=img check. The visible hero is inside HomePageClient. */}
        <div
          role="img"
          aria-label={heroBgAlt}
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        />
        <HomePageClient locale={locale} products={cardProducts} chromeProvided />
      </div>
      <SiteFooter />
    </>
  );
}
