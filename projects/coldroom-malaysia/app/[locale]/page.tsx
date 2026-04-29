import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n/routing';
import { getSupabase } from '@/lib/supabase';
import HomePageClient from './HomePageClient';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';

export const revalidate = 3600;

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

interface ProductPhoto { url: string }
interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rental_price: number | null;
  sale_price: number | null;
  sort_order: number | null;
  product_photos: ProductPhoto[];
}

const FALLBACK_PRODUCTS: ProductRow[] = [
  {
    id: 'fb-cold-room',
    name: 'Cold Room Rental',
    slug: 'cold-room-rental',
    description: 'Refrigerated cold room rental for frozen, freezer, chiller and cool storage. HALAL fleet, same-day delivery, full Peninsular Malaysia coverage.',
    rental_price: 5,
    sale_price: null,
    sort_order: 1,
    product_photos: [],
  },
];

async function fetchProducts(): Promise<ProductRow[]> {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK_PRODUCTS;
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, rental_price, sale_price, sort_order, product_photos(url)')
    .eq('website', siteConfig.domain)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_PRODUCTS;
  return data as unknown as ProductRow[];
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const products = await fetchProducts();

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
