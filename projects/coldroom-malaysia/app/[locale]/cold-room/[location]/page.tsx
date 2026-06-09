import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n/routing';
import { locations, getLocation, getNearbyLocations, getState } from '@/config/locations';
import { getProducts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { WaIcon } from '@/components/BrandMark';
import { TrackedWhatsAppLink } from '@/components/TrackedWhatsAppLink';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';
import HomePageClient from '@/components/HomePageClient';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';

const HERO_IMAGE = '/brand/hero.png';

const HERO_TIERS = [
  { slug: 'frozen-storage-minus-18', chip: '-18°C', tone: 'frost-deep' },
  { slug: 'freezer-minus-5-to-minus-10', chip: '-10°C', tone: 'frost-mid' },
  { slug: 'chiller-2-to-4', chip: '+4°C', tone: 'frost-cool' },
  { slug: 'cool-storage-7-to-10', chip: '+10°C', tone: 'frost-pale' },
] as const;

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

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  setRequestLocale(locale);
  const loc = getLocation(location);
  if (!loc) notFound();

  const products = await getProducts();
  const t = await getTranslations({ locale });
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

  const heroH2 =
    locale === 'zh' ? `当天送达${cityName}冷库，清真，24/7 报价。从 -18°C 到 +10°C，5 分钟 WhatsApp 完成预订。`
    : locale === 'ms' ? `Penghantaran cold room hari yang sama ke ${cityName}, HALAL, sebut harga 24/7. Dari -18°C hingga +10°C, tempah 5 minit melalui WhatsApp.`
    : `Same-day refrigerated cold room delivery to ${cityName}, HALAL, 24/7 quotes. From -18°C frozen to +10°C cool storage, booked in 5 minutes via WhatsApp.`;

  return (
    <>
      <PageStyles />
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

      <FomoBanner />
      <SiteHeader />

      {/* HERO — city-aware H1 + H2 + the image-role background live in the route
          file (mirrors the homepage hero). Below is <HomePageClient />. */}
      <header style={{ position: 'relative', overflow: 'hidden', minHeight: '78vh', display: 'flex', alignItems: 'center', background: 'var(--grad-frost)' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 30%, rgba(201,229,242,0.18), transparent 50%), radial-gradient(circle at 15% 85%, rgba(79,177,214,0.22), transparent 45%)' }} />
        <div className="section-container" style={{ position: 'relative', zIndex: 2, padding: '72px 24px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div className="hero-copy">
            <span className="eyebrow" style={{ color: 'var(--cold-amber-glow)' }}>{t('hero.eyebrow')}</span>
            <h1 style={{ color: '#fff', marginTop: 14, marginBottom: 22, textShadow: '0 4px 24px rgba(11,61,92,0.45)' }}>
              {locale === 'zh' ? <><span style={{ color: 'var(--cold-amber-glow)' }}>{cityName}</span>冷库出租，马来西亚</>
              : locale === 'ms' ? <>Sewa <span style={{ color: 'var(--cold-amber-glow)' }}>Cold Room</span> di {cityName}, Malaysia</>
              : <><span style={{ color: 'var(--cold-amber-glow)' }}>Cold Room</span> Rental in {cityName}, Malaysia</>}
            </h1>
            <span aria-hidden style={{ display: 'block', height: 3, width: 72, background: 'var(--cold-amber)', borderRadius: 3, marginBottom: 18 }} />
            <h2 style={{ color: 'rgba(255,255,255,0.96)', fontWeight: 600, marginBottom: 30, maxWidth: 620 }}>
              {heroH2}
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 }} className="hero-cta-row">
              <TrackedWhatsAppLink href={waRedirect(locale, undefined, loc.slug)} className="btn btn-wa">
                <WaIcon size={18} /> {t('hero.primaryCta')}
              </TrackedWhatsAppLink>
              <a href="#products" className="btn btn-ghost-frost">{t('hero.secondaryCta')}</a>
            </div>
            {/* Temperature tiers — top two are WhatsApp quick-rent CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
              <TrackedWhatsAppLink href={waRedirect(locale, `-18°C Frozen Storage — ${cityName}`, loc.slug)} className="temp-chip frost-deep">
                -18°C <span style={{ fontWeight: 500 }}>{t('hero.tempLabels.frozen-storage-minus-18')}</span>
              </TrackedWhatsAppLink>
              <TrackedWhatsAppLink href={waRedirect(locale, `+4°C Chiller — ${cityName}`, loc.slug)} className="temp-chip frost-cool">
                +4°C <span style={{ fontWeight: 500 }}>{t('hero.tempLabels.chiller-2-to-4')}</span>
              </TrackedWhatsAppLink>
              {HERO_TIERS.filter((x) => x.slug === 'freezer-minus-5-to-minus-10' || x.slug === 'cool-storage-7-to-10').map((tier) => (
                <a key={tier.slug} href={`#${tier.slug}`} className={`temp-chip ${tier.tone}`}>
                  {tier.chip} <span style={{ fontWeight: 500 }}>{t(`hero.tempLabels.${tier.slug}`)}</span>
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center', marginTop: 12, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13 }}>
                <span style={{ fontWeight: 800, fontSize: 18 }}>256,800+</span> <span style={{ opacity: 0.82 }}>{t('hero.microStats.tonnes')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13 }}>
                <span style={{ fontWeight: 800, fontSize: 18 }}>1,730+</span> <span style={{ opacity: 0.82 }}>{t('hero.microStats.customers')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13 }}>
                <span style={{ fontWeight: 800, fontSize: 18 }}>99%</span> <span style={{ opacity: 0.82 }}>{t('hero.microStats.onTime')}</span>
              </div>
            </div>
          </div>
          <div className="hero-photo" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              role="img"
              aria-label={`${t('imageAlt')} — ${cityName}`}
              style={{
                width: '100%',
                maxWidth: 620,
                aspectRatio: '620 / 420',
                backgroundImage: `url(${HERO_IMAGE})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 30px 50px rgba(11,61,92,0.45))',
              }}
            />
          </div>
        </div>
      </header>

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
