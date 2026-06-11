import type { Metadata } from 'next';
import { seoAlternates } from '@/lib/seoAlternates'
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n/routing';
import { getProducts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { WaIcon } from '@/components/BrandMark';
import { TrackedWhatsAppLink } from '@/components/TrackedWhatsAppLink';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';
import HomePageClient from '@/components/HomePageClient';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';

const HERO_IMAGE = '/brand/hero.png';
// Full-bleed cold-room scene behind the hero copy (sewa-excavator uses the same
// photo-bg + overlay pattern). Darkened by the overlay below for text contrast.
const HERO_SCENE = 'https://static.wixstatic.com/media/d3104b_390cb593d3624032ae4da7fe4603f080~mv2.jpg';

const HERO_TIERS = [
  { slug: 'frozen-storage-minus-18', chip: '-18°C', tone: 'frost-deep' },
  { slug: 'freezer-minus-5-to-minus-10', chip: '-10°C', tone: 'frost-mid' },
  { slug: 'chiller-2-to-4', chip: '+4°C', tone: 'frost-cool' },
  { slug: 'cool-storage-7-to-10', chip: '+10°C', tone: 'frost-pale' },
] as const;

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
    alternates: seoAlternates(locale),
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
  setRequestLocale(locale);
  const products = await getProducts();
  const t = await getTranslations({ locale });

  return (
    <>
      <PageStyles />
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

      <FomoBanner />
      <SiteHeader />

      {/* HERO — H1 + H2 + the image-role background live in the route file so
          the checklist sees them. Below the hero is <HomePageClient />. */}
      <header style={{ position: 'relative', overflow: 'hidden', minHeight: '82vh', display: 'flex', alignItems: 'center', background: 'var(--steel-900)' }}>
        {/* Full-bleed cold-room scene photo */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_SCENE})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        {/* Dark frost overlay so the white hero copy stays legible over the photo */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(11,61,92,0.94) 0%, rgba(11,61,92,0.78) 42%, rgba(19,24,34,0.55) 100%)' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 30%, rgba(79,177,214,0.18), transparent 55%)' }} />
        <div className="section-container" style={{ position: 'relative', zIndex: 2, padding: '72px 24px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div className="hero-copy">
            <span className="eyebrow" style={{ color: 'var(--cold-amber-glow)' }}>{t('hero.eyebrow')}</span>
            <h1 style={{ color: '#fff', marginTop: 14, marginBottom: 22, textShadow: '0 4px 24px rgba(11,61,92,0.45)' }}>
              {t.rich('hero.h1', { accent: (chunks) => <span style={{ color: 'var(--cold-amber-glow)' }}>{chunks}</span> })}
            </h1>
            <span aria-hidden style={{ display: 'block', height: 3, width: 72, background: 'var(--cold-amber)', borderRadius: 3, marginBottom: 18 }} />
            <h2 style={{ color: 'rgba(255,255,255,0.96)', fontWeight: 600, marginBottom: 30, maxWidth: 620 }}>
              {t('hero.h2')}
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 }} className="hero-cta-row">
              <TrackedWhatsAppLink href={waRedirect(locale)} className="btn btn-wa">
                <WaIcon size={18} /> {t('hero.primaryCta')}
              </TrackedWhatsAppLink>
              <a href="#products" className="btn btn-ghost-frost">{t('hero.secondaryCta')}</a>
            </div>
            {/* Temperature tiers — top two are WhatsApp quick-rent CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
              <TrackedWhatsAppLink href={waRedirect(locale, '-18°C Frozen Storage')} className="temp-chip frost-deep">
                -18°C <span style={{ fontWeight: 500 }}>{t('hero.tempLabels.frozen-storage-minus-18')}</span>
              </TrackedWhatsAppLink>
              <TrackedWhatsAppLink href={waRedirect(locale, '+4°C Chiller')} className="temp-chip frost-cool">
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
              aria-label={t('imageAlt')}
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

      <HomePageClient products={products} />

      <SiteFooter locale={locale} />
    </>
  );
}
