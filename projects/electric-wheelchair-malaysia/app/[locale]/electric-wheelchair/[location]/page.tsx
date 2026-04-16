import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n/routing';
import { locations, getLocationBySlug, getNearbyLocations } from '@/config/locations';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import HomePageClient from '../../HomePageClient';

export function generateStaticParams() {
  const params: { locale: string; location: string }[] = [];
  for (const locale of locales) {
    for (const loc of locations) {
      params.push({ locale, location: loc.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location: locationSlug } = await params;
  const loc = getLocationBySlug(locationSlug);
  if (!loc) return { title: 'Not Found' };

  const t = await getTranslations({ locale, namespace: 'location' });

  const title = `${t('h1Prefix')} ${loc.name} ${t('metaTitleSuffix')}`;
  const description = `${t('metaDescPrefix')} ${loc.name}${t('metaDescSuffix')}`;
  const url = `${siteConfig.siteUrl}/${locale}/electric-wheelchair/${locationSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.siteUrl}/en/electric-wheelchair/${locationSlug}`,
        ms: `${siteConfig.siteUrl}/ms/electric-wheelchair/${locationSlug}`,
        zh: `${siteConfig.siteUrl}/zh/electric-wheelchair/${locationSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.brandName,
      type: 'website',
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location: locationSlug } = await params;
  const loc = getLocationBySlug(locationSlug);
  if (!loc) notFound();

  const t = await getTranslations({ locale, namespace: 'location' });
  const faqT = await getTranslations({ locale, namespace: 'faq' });

  const nearbyLocs = getNearbyLocations(locationSlug);
  const nearbyData = nearbyLocs.map((n) => ({ slug: n.slug, name: n.name }));

  const faqs = [];
  for (let i = 0; i < 6; i++) {
    faqs.push({
      question: faqT(`items.${i}.question`),
      answer: faqT(`items.${i}.answer`),
    });
  }

  const breadcrumbItems = [
    { name: t('breadcrumbHome'), url: `/${locale}` },
    { name: t('breadcrumbProduct'), url: `/${locale}#products` },
    { name: loc.name, url: `/${locale}/electric-wheelchair/${locationSlug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocalBusinessSchema locale={locale} locationSlug={locationSlug} cityName={loc.name} />
      <FAQSchema faqs={faqs} />
      <HomePageClient
        cityName={loc.name}
        locationSlug={locationSlug}
        nearbyLocations={nearbyData}
      />
    </>
  );
}
