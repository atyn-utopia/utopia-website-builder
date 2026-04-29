import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n/routing';
import { locations, getLocation, getNearbyLocations, getState } from '@/config/locations';
import { getSupabase } from '@/lib/supabase';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';
import HomePageClient from '../../HomePageClient';
import { SiteFooter } from '@/components/SiteFooter';

export const revalidate = 3600;

export function generateStaticParams() {
  const params: { locale: string; location: string }[] = [];
  for (const locale of locales) {
    for (const loc of locations) params.push({ locale, location: loc.slug });
  }
  return params;
}

function clamp60(s: string): string {
  return s.length <= 60 ? s : s.slice(0, 57).replace(/\s+\S*$/, '') + '...';
}

function buildLocTitle(locale: string, displayCity: string): string {
  if (locale === 'zh') return clamp60(`${displayCity}冷库出租 | 清真，当天送达`);
  if (locale === 'ms') return clamp60(`Sewa Cold Room di ${displayCity}, Malaysia | Hari Ini`);
  return clamp60(`Cold Room Rental in ${displayCity}, Malaysia | Same-Day`);
}

function buildLocDescription(locale: string, displayCity: string): string {
  if (locale === 'zh') return `${displayCity}冷库出租，冷冻库、冷冻室、冷藏库、冷藏室一应俱全。清真认证，当天送达，WhatsApp 5 分钟报价。`;
  if (locale === 'ms') return `Sewa cold room HALAL di ${displayCity}, beku, freezer, chiller, stor sejuk. Penghantaran hari yang sama, sebut harga WhatsApp 5 minit.`;
  return `Rent HALAL cold rooms in ${displayCity}, frozen, freezer, chiller, cool storage. Same-day delivery, 5-min WhatsApp quote, trusted by ${displayCity} businesses.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}): Promise<Metadata> {
  const { locale, location } = await params;
  const loc = getLocation(location);
  if (!loc) return { title: 'Not Found' };

  const displayCity =
    locale === 'zh' ? loc.name_zh :
    locale === 'ms' ? (loc.name_ms ?? loc.name) :
    loc.name;

  const title = buildLocTitle(locale, displayCity);
  const description = buildLocDescription(locale, displayCity);
  const url = `${siteConfig.siteUrl}/${locale}/${siteConfig.productSlug}/${loc.slug}`;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteConfig.siteUrl}/${l}/${siteConfig.productSlug}/${loc.slug}`;
  languages['x-default'] = `${siteConfig.siteUrl}/en/${siteConfig.productSlug}/${loc.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'website', url, title, description,
      siteName: siteConfig.brandName,
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
      images: [{ url: `${siteConfig.siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rental_price: number | null;
  sale_price: number | null;
  sort_order: number | null;
  product_photos: { url: string }[];
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

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const loc = getLocation(location);
  if (!loc) notFound();

  const products = await fetchProducts();
  const nearby = getNearbyLocations(location);
  const stateInfo = getState(loc.stateSlug);
  const cityName =
    locale === 'zh' ? loc.name_zh :
    locale === 'ms' ? (loc.name_ms ?? loc.name) :
    loc.name;

  const breadcrumbItems = [
    { name: locale === 'zh' ? '首页' : locale === 'ms' ? 'Laman Utama' : 'Home', url: `/${locale}` },
    { name: cityName, url: `/${locale}/${siteConfig.productSlug}/${loc.slug}` },
  ];

  const faqs = [
    { question: `How fast can you deliver a cold room to ${cityName}?`, answer: `Same-day delivery to ${cityName} is available when you book before noon via WhatsApp.` },
    { question: `Are cold rooms in ${cityName} HALAL-certified?`, answer: `Yes, every unit serving ${cityName} follows JAKIM-aligned HALAL-segregated storage protocols.` },
    { question: `What temperatures can I rent in ${cityName}?`, answer: `Four tiers serve ${cityName}: -18°C frozen, -5°C to -10°C freezer, 2°C to 4°C chiller, and 7°C to 10°C cool storage.` },
    { question: `Do you offer monthly rentals in ${cityName}?`, answer: `Yes, daily, weekly and monthly rentals all serve ${cityName}. Volume discounts available for monthly contracts.` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocalBusinessSchema locale={locale} locationSlug={loc.slug} cityName={cityName} />
      <FAQSchema faqs={faqs} />
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
      <HomePageClient
        products={products}
        location={{
          cityName,
          cityNameZh: loc.name_zh,
          cityNameMs: loc.name_ms,
          locationSlug: loc.slug,
          stateName: stateInfo?.name ?? loc.state,
          nearbyLocations: nearby,
        }}
      />
      <SiteFooter locale={locale} />
    </>
  );
}
