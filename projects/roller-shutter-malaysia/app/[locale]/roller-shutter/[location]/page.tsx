import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';
import LocationPageClient from './LocationPageClient';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';

type Params = { locale: string; location: string };

export function generateStaticParams() {
  const params: Params[] = [];
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
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, location } = await params;
  const locationData = locations.find((l) => l.slug === location);
  if (!locationData) return notFound();

  const baseUrl = `https://${siteConfig.domain}`;

  let metaTitle = `Roller Shutter ${locationData.name} | ${siteConfig.brandName}`;
  let metaDescription = `Professional roller shutter service in ${locationData.name}. Installation, repair & maintenance 24 hours.`;

  try {
    const t = await getTranslations({ locale, namespace: 'locationPages' });
    const titleKey = `${location}.metaTitle`;
    const descKey = `${location}.metaDescription`;
    // Use raw() to check existence without throwing
    try { const v = t(titleKey); if (v && !v.startsWith('locationPages.')) metaTitle = v; } catch { /* key not found */ }
    try { const v = t(descKey); if (v && !v.startsWith('locationPages.')) metaDescription = v; } catch { /* key not found */ }
  } catch {
    // Use defaults if translations not available
  }

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `${baseUrl}/${loc}/roller-shutter/${location}`;
  }

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${baseUrl}/${locale}/roller-shutter/${location}`,
      languages: {
        ...alternates,
        'x-default': `${baseUrl}/ms/roller-shutter/${location}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${baseUrl}/${locale}/roller-shutter/${location}`,
      siteName: siteConfig.brandName,
      locale: locale,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const revalidate = 86400;

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const locationData = locations.find((l) => l.slug === location);
  if (!locationData) return notFound();

  let faqs: { question: string; answer: string }[] = [];
  try {
    const t = await getTranslations({ locale, namespace: 'faq' });
    faqs = [0, 1, 2, 3, 4, 5].map((i) => ({
      question: t(`items.${i}.question`),
      answer: t(`items.${i}.answer`),
    }));
  } catch { /* fallback empty */ }

  return (
    <>
      <LocalBusinessSchema locale={locale} locationSlug={location} cityName={locationData.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: `/${locale}` },
        { name: 'Roller Shutter', href: `/${locale}#products` },
        { name: locationData.name, href: `/${locale}/roller-shutter/${location}` },
      ]} />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      <LocationPageClient />
    </>
  );
}
