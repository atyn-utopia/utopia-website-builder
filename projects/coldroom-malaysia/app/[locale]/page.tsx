import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n/routing';
import { getProducts } from '@/lib/webcore';
import HomePageClient from './HomePageClient';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';

const HOMEPAGE_META: Record<string, { title: string; description: string; ogLocale: string }> = {
  en: {
    title: 'Cold Room Rental Malaysia | HALAL, Same-Day Delivery',
    description: 'Rent -18°C frozen, freezer, chiller & cool-storage cold rooms in Malaysia. HALAL, same-day delivery, 13 states. Free WhatsApp quote.',
    ogLocale: 'en_MY',
  },
  ms: {
    title: 'Sewa Cold Room Malaysia | HALAL, Penghantaran Hari Ini',
    description: 'Sewa cold room beku -18°C, freezer, chiller & stor sejuk di Malaysia. HALAL, penghantaran hari yang sama, 13 negeri.',
    ogLocale: 'ms_MY',
  },
  zh: {
    title: '马来西亚冷库出租 | 清真，当天送达',
    description: '租赁 -18°C 冷冻库、冷冻室、冷藏库与冷藏室，覆盖马来西亚 13 州。清真认证，当天送达。WhatsApp 免费报价。',
    ogLocale: 'zh_CN',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = HOMEPAGE_META[locale] ?? HOMEPAGE_META.en;
  const url = `${siteConfig.siteUrl}/${locale}`;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteConfig.siteUrl}/${l}`;
  languages['x-default'] = `${siteConfig.siteUrl}/en`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'website',
      url,
      title: meta.title,
      description: meta.description,
      siteName: siteConfig.brandName,
      locale: meta.ogLocale,
      images: [{ url: `${siteConfig.siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${siteConfig.siteUrl}/og-image.jpg`],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const products = await getProducts();

  return (
    <>
      {products.map((p) => (
        <ProductSchema
          key={p.id}
          name={p.name}
          description={p.description ?? ''}
          locale={locale}
          slug={p.slug}
          rentalPrice={String(p.rental_price ?? 5)}
          imageUrl={p.product_photos?.[0]?.url}
        />
      ))}
      <FAQSchema
        faqs={[
          { question: 'How fast can you deliver a cold room in Malaysia?', answer: 'Same-day delivery is available for most Peninsular Malaysia locations when you book before noon via WhatsApp.' },
          { question: 'Are your cold rooms HALAL-compliant?', answer: 'Yes. Every cold room in our fleet is HALAL-certified and maintained with HALAL-segregated storage protocols.' },
          { question: 'What temperature ranges do you offer?', answer: 'Four tiers: -18°C frozen, -5°C to -10°C freezer, 2°C to 4°C chiller, and 7°C to 10°C cool storage.' },
          { question: 'Do you serve all 13 Peninsular states?', answer: 'Yes, we cover Kuala Lumpur, Selangor, Putrajaya, Johor, Penang, Perak, Negeri Sembilan, Melaka, Kedah, Kelantan, Terengganu, Pahang and Perlis.' },
        ]}
      />
      <HomePageClient products={products} />
      <SiteFooter locale={locale} />
    </>
  );
}
