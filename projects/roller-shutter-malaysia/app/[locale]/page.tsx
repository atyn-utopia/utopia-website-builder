import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import HomePageClient from './HomePageClient';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';

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
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ...alternates,
        'x-default': `${baseUrl}/ms`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
      <LocalBusinessSchema locale={locale} />
      <ProductSchema name="Roller Shutter Door" description="Professional roller shutter door installation, repair & maintenance in Malaysia. 24/7 emergency service." locale={locale} />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      <HomePageClient />
    </>
  );
}
