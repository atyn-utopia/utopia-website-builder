import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locations, getLocationBySlug } from '@/config/locations';
import { routing } from '@/i18n/routing';
import { buildAlternates } from '@/lib/alternates';
import { siteConfig } from '@/config/site';
import {
  getLocationH2,
  getLocationIntro,
  getLocationMetaTitle,
  getLocationMetaDescription,
  getLocationFAQ,
} from '@/lib/locationCopy';
import { getNearbyLocations } from '@/lib/getNearbyLocations';
import { getProducts } from '@/lib/webcore';
import LocationPageClient from './LocationPageClient';
import { MedicalBusinessSchema } from '@/components/schema/MedicalBusinessSchema';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import type { ProductCardData } from '@/components/ProductCard';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';

export async function generateStaticParams() {
  return locations.flatMap((loc) =>
    routing.locales.map((locale) => ({ locale, location: loc.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const loc = getLocationBySlug(location);
  if (!loc) return {};

  const title = getLocationMetaTitle(location, loc.name, locale);
  const description = getLocationMetaDescription(location, loc.name, locale);

  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title,
    description,
    alternates: buildAlternates(`/katil-hospital/${location}`, locale),
    openGraph: {
      title,
      description,
      url: `${siteConfig.siteUrl}/${locale}/katil-hospital/${location}`,
      type: 'website',
      locale: t('ogLocale'),
      siteName: siteConfig.brandName,
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const loc = getLocationBySlug(location);
  if (!loc) notFound();

  const t = await getTranslations({ locale, namespace: 'location' });
  const faqT = await getTranslations({ locale, namespace: 'faq' });

  const h1 = t('h1Template', { city: loc.name });
  const h2 = getLocationH2(location, loc.state, locale);
  const intro = getLocationIntro(location, loc.state, locale);
  const uniqueFaqs = getLocationFAQ(location, loc.state, locale);

  const dbProducts = await getProducts();
  const cardProducts: ProductCardData[] = dbProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    rental_price: p.rental_price,
    sale_price: p.sale_price,
    prices: p.prices ?? [],
    image: p.photos?.[0]?.url,
  }));

  const nearby = getNearbyLocations(location, 6);

  // Full FAQ list for schema = unique 2 + shared Q1, Q3, Q5
  const fullFaqs = [
    ...uniqueFaqs,
    { q: faqT('q1.q'), a: faqT('q1.a') },
    { q: faqT('q3.q'), a: faqT('q3.a') },
    { q: faqT('q5.q'), a: faqT('q5.a') },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t('breadcrumb.home'), url: `/${locale}` },
          { name: t('breadcrumb.product'), url: `/${locale}#products` },
          {
            name: loc.name,
            url: `/${locale}/katil-hospital/${location}`,
          },
        ]}
      />
      <MedicalBusinessSchema locale={locale} cityName={loc.name} locationSlug={location} />
      <LocalBusinessSchema locale={locale} cityName={loc.name} locationSlug={location} />
      <FAQSchema
        faqs={fullFaqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <PageStyles />
      <FomoBanner />
      {/* Relative wrapper so the absolute Navbar floats over the hero. */}
      <div style={{ position: 'relative' }}>
        <SiteHeader />
        <LocationPageClient
          locale={locale}
          products={cardProducts}
          location={loc}
          h1={h1}
          h2={h2}
          intro={intro}
          uniqueFaqs={uniqueFaqs}
          nearby={nearby}
          chromeProvided
        />
      </div>
      <SiteFooter />
    </>
  );
}
