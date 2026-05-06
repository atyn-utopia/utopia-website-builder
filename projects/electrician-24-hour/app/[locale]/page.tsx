import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getProducts, getBlogPosts, getPhoneNumber, waLink } from '@/lib/webcore';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
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
  const faqT = await getTranslations({ locale, namespace: 'faq' });

  const faqs = [];
  for (let i = 0; i < 6; i++) {
    faqs.push({
      question: faqT(`items.${i}.question`),
      answer: faqT(`items.${i}.answer`),
    });
  }

  const [products, blogPosts, phoneResult] = await Promise.all([
    getProducts(),
    getBlogPosts(locale),
    getPhoneNumber(),
  ]);
  const waUrl = waLink(phoneResult.phone, phoneResult.whatsappText);

  return (
    <>
      <LocalBusinessSchema locale={locale} />
      <FAQSchema faqs={faqs} />
      <HomePageClient
        locale={locale}
        products={products}
        recentPosts={blogPosts.slice(0, 3)}
        waUrl={waUrl}
        phoneNumber={phoneResult.phone}
      />
    </>
  );
}
