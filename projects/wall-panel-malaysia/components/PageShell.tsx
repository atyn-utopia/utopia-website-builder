// Shared page shell used by homepage and location pages. Renders all
// sections in the identical order mandated by architecture.md.
//
// Homepage passes variant='home'. Location pages pass variant='location'
// with location-specific props. Breadcrumb + Nearby + LocationFAQ only
// render on location pages.

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { FlutedMarkLight } from '@/components/Ornaments'
import FomoCountdown from '@/components/FomoCountdown'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker'
import WallPanelCalculator from '@/components/WallPanelCalculator'
import { HERO_IMAGE, GALLERY_IMAGES } from '@/config/products'
import { getPhoneNumber, type Product } from '@/lib/webcore'
import {
  LOCATIONS,
  STATES_ORDER,
  STATES_DISPLAY,
  TOP_FOOTER_LOCATIONS,
  findLocation,
  type LocationEntry,
} from '@/config/locations'
import { siteConfig, type Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'
import type { LocationCopy } from '@/lib/locationCopy'

export interface PageShellProps {
  locale: Locale
  variant: 'home' | 'location'
  coreProducts: Product[]
  additionalProducts: Product[]
  locationSlug?: string
  locationCity?: string
  locationCopy?: LocationCopy
}

// ---------- WhatsApp button (always green) ----------

function WAButton({
  href,
  label,
  phone,
  className,
  size = 'md',
}: {
  href: string
  label: string
  phone: string
  className?: string
  size?: 'md' | 'lg'
}) {
  const sizeCls =
    size === 'lg' ? 'px-8 py-4 text-[16px]' : 'px-6 py-3 text-[15px]'
  return (
    <WhatsAppClickTracker phone={phone}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={
          `inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-white shadow-[0_8px_22px_rgba(37,211,102,0.32)] hover:bg-[#1EBE57] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 ${sizeCls} ` +
          (className ?? '')
        }
        style={{ transition: 'transform 200ms ease, background-color 200ms ease' }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
        </svg>
        {label}
      </a>
    </WhatsAppClickTracker>
  )
}

// ---------- Fallback wall-panel variant catalogue ----------

const FALLBACK_VARIANTS: Array<{
  slug: string
  family: 'standard' | 'marble'
  market: number
  ourPrice: number
  promo: number
}> = [
  { slug: 'standard-wood', family: 'standard', market: 50, ourPrice: 30, promo: 25 },
  { slug: 'standard-fluted', family: 'standard', market: 50, ourPrice: 30, promo: 25 },
  { slug: 'standard-pvc', family: 'standard', market: 50, ourPrice: 30, promo: 25 },
  { slug: 'standard-acoustic', family: 'standard', market: 50, ourPrice: 30, promo: 25 },
  { slug: 'marble-gold', family: 'marble', market: 48, ourPrice: 48, promo: 38 },
  { slug: 'marble-silver', family: 'marble', market: 48, ourPrice: 48, promo: 38 },
  { slug: 'marble-black', family: 'marble', market: 48, ourPrice: 48, promo: 38 },
]

const VARIANT_I18N: Record<
  string,
  Record<Locale, { name: string; tag: string; desc: string }>
> = {
  'standard-wood': {
    en: { name: 'Wood Wall Panel', tag: 'Standard · Wood', desc: 'Warm wood-grain finish — top pick for living rooms and bedrooms.' },
    ms: { name: 'Panel Dinding Kayu', tag: 'Standard · Kayu', desc: 'Kemasan urat kayu hangat — pilihan popular untuk ruang tamu dan bilik tidur.' },
    zh: { name: '木纹墙板', tag: '标准 · 木纹', desc: '温暖木纹饰面 — 客厅与卧室的热门之选。' },
  },
  'standard-fluted': {
    en: { name: 'Fluted Wall Panel', tag: 'Standard · Fluted', desc: 'Vertical-groove texture adds rhythm and shadow to TV feature walls.' },
    ms: { name: 'Panel Dinding Fluted', tag: 'Standard · Fluted', desc: 'Alur menegak menambah irama dan bayang pada dinding TV feature.' },
    zh: { name: '凹槽墙板', tag: '标准 · 凹槽', desc: '垂直凹槽为电视主墙增添节奏感与光影层次。' },
  },
  'standard-pvc': {
    en: { name: 'PVC Wall Panel', tag: 'Standard · PVC', desc: 'Water-resistant, easy-clean panels for kitchens, bathrooms and humid spaces.' },
    ms: { name: 'Panel Dinding PVC', tag: 'Standard · PVC', desc: 'Tahan air dan mudah dibersih — untuk dapur, bilik air dan ruang lembap.' },
    zh: { name: 'PVC墙板', tag: '标准 · PVC', desc: '防水易清洁,专为厨房、卫浴与潮湿空间打造。' },
  },
  'standard-acoustic': {
    en: { name: 'Acoustic Wall Panel', tag: 'Standard · Acoustic', desc: 'Sound-absorbing slatted wood — ideal for home offices, studios and meeting rooms.' },
    ms: { name: 'Panel Dinding Akustik', tag: 'Standard · Akustik', desc: 'Penyerap bunyi dengan kayu beralur — sesuai untuk home office dan studio.' },
    zh: { name: '隔音墙板', tag: '标准 · 隔音', desc: '吸音木条饰面 — 居家办公室、录音棚与会议室首选。' },
  },
  'marble-gold': {
    en: { name: 'Gold Marble Wall Panel', tag: 'Marble · Gold', desc: 'Warm gold-vein gloss marble — the luxury pick for reception walls.' },
    ms: { name: 'Panel Dinding Marmar Emas', tag: 'Marmar · Emas', desc: 'PU marmar urat emas hangat kemasan kilat — pilihan mewah untuk reception.' },
    zh: { name: '金色大理石墙板', tag: '大理石 · 金', desc: '暖色金纹亮面大理石 — 客厅与前台的奢华之选。' },
  },
  'marble-silver': {
    en: { name: 'Silver Marble Wall Panel', tag: 'Marble · Silver', desc: 'Cool silver-vein gloss marble for modern minimalist interiors.' },
    ms: { name: 'Panel Dinding Marmar Perak', tag: 'Marmar · Perak', desc: 'Marmar perak nada sejuk — serasi dengan interior minimalis moden.' },
    zh: { name: '银色大理石墙板', tag: '大理石 · 银', desc: '冷色银纹亮面大理石,完美呼应现代极简风格。' },
  },
  'marble-black': {
    en: { name: 'Black Marble Wall Panel', tag: 'Marble · Black', desc: 'Deep-vein black PU marble for dramatic boardroom and lounge walls.' },
    ms: { name: 'Panel Dinding Marmar Hitam', tag: 'Marmar · Hitam', desc: 'PU marmar hitam urat tebal untuk dinding bilik mesyuarat dan lounge.' },
    zh: { name: '黑色大理石墙板', tag: '大理石 · 黑', desc: '深纹黑色大理石,打造戏剧感会议室与休息室主墙。' },
  },
}

const VARIANT_IMAGE: Record<string, string> = {
  'standard-wood': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900',
  'standard-fluted': 'https://images.pexels.com/photos/3214113/pexels-photo-3214113.jpeg?auto=compress&cs=tinysrgb&w=900',
  'standard-pvc': 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=900',
  'standard-acoustic': 'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=900',
  'marble-gold': 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=900',
  'marble-silver': 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=900',
  'marble-black': 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900',
}

interface DisplayProduct {
  id: string
  slug: string
  name: string
  tag: string
  description: string
  market: number
  ourPrice: number
  promo: number
  family: 'standard' | 'marble'
  imageUrl: string
}

function buildDisplayProducts(coreFromDb: Product[], locale: Locale): DisplayProduct[] {
  const dbBySlug = new Map(coreFromDb.map((p) => [p.slug, p]))
  return FALLBACK_VARIANTS.map((v) => {
    const i18n = VARIANT_I18N[v.slug][locale]
    const db = dbBySlug.get(v.slug)
    const imageUrl = db?.photos?.[0]?.url || VARIANT_IMAGE[v.slug] || HERO_IMAGE
    return {
      id: db?.id ?? v.slug,
      slug: v.slug,
      name: db?.name ?? i18n.name,
      tag: i18n.tag,
      description: db?.description ?? i18n.desc,
      market: v.market,
      ourPrice: v.ourPrice,
      promo: db?.sale_price ?? v.promo,
      family: v.family,
      imageUrl,
    }
  })
}

// ---------- Main component ----------

export default async function PageShell({
  locale,
  variant,
  coreProducts,
  locationSlug,
  locationCity,
  locationCopy,
}: PageShellProps) {
  const t = await getTranslations()
  const tShared = await getTranslations('shared')
  const tHome = await getTranslations('home')
  const tNav = await getTranslations('nav')
  const tFoot = await getTranslations('footer')

  const isLoc = variant === 'location'
  const slug = isLoc ? locationSlug! : 'all'
  const city = isLoc ? locationCity! : ''

  const { phone: trackedPhone } = await getPhoneNumber(isLoc ? slug : undefined)

  const waDefault = waRedirect(
    locale,
    isLoc
      ? tShared('whatsappMessageLocation', { city })
      : tShared('whatsappMessageDefault'),
    isLoc ? slug : undefined,
  )

  const displayProducts = buildDisplayProducts(coreProducts, locale)

  // ======= FOMO BANNER =======
  const fomoBanner = (
    <div className="relative z-50 bg-[#B71F2B] py-2.5 text-center text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 text-[13px] sm:gap-5 sm:text-[14px]">
        <span
          className="hidden rounded-full border border-white/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] sm:inline"
          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          {locale === 'ms' ? 'PROMO LIVE' : locale === 'zh' ? '促销进行中' : 'LIVE PROMO'}
        </span>
        <p className="inline-flex items-center gap-2 font-medium">
          <span>{tShared('fomoText')}</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5">
            <FomoCountdown />
          </span>
        </p>
        <WhatsAppClickTracker phone={trackedPhone}>
          <a
            href={waDefault}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 rounded-full border border-white/40 px-3 py-1 text-[12px] font-bold text-white hover:bg-white hover:text-[#B71F2B] sm:inline-flex"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tShared('fomoCta')}
          </a>
        </WhatsAppClickTracker>
      </div>
    </div>
  )

  // ======= HEADER =======
  const header = (
    <header className="relative z-40 bg-transparent">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          href={`/${locale}`}
          aria-label={tShared('alt.logoAria')}
          className="flex shrink-0 items-center gap-2.5"
        >
          <FlutedMarkLight className="h-9 w-9" />
          <span
            className="text-[17px] font-semibold tracking-tight text-white sm:text-[18px]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            Wall Panel Malaysia
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {[
            { href: '#styles', key: 'services' as const },
            { href: '#locations', key: 'locations' as const },
            { href: '#process', key: 'gallery' as const },
            { href: `/${locale}/blog`, key: 'blog' as const },
          ].map((it) => (
            <a
              key={it.key}
              href={it.href}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-medium text-white/90 hover:bg-white/10 hover:text-white"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav(it.key)}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher variant="dark" />
          <div className="hidden sm:block">
            <WAButton href={waDefault} label={tNav('whatsapp')} phone={trackedPhone} />
          </div>
        </div>
      </div>
    </header>
  )

  // ======= HERO =======
  const h1 = isLoc ? t('location.h1', { city }) : tHome('hero.h1')

  const hero = (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(11,21,58,0.5) 0%, rgba(11,21,58,0.78) 100%), url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 md:pb-28 md:pt-16">
        {isLoc && (
          <nav className="mb-6 text-[13px] text-white/70">
            <p className="inline">
              <Link href={`/${locale}`} className="py-1 hover:text-white">
                {t('location.breadcrumbs.home')}
              </Link>
              <span className="mx-2">/</span>
              <Link href={`/${locale}#locations`} className="py-1 hover:text-white">
                {t('location.breadcrumbs.locations')}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{city}</span>
            </p>
          </nav>
        )}

        <div className="max-w-2xl text-left md:pt-10 md:pb-16">
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8A45C]/60 bg-[#13204C]/30 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F3E9D2] backdrop-blur-sm"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8A45C]" aria-hidden="true" />
            {tHome('hero.priceBadge')}
          </p>

          <h1
            className="font-medium leading-[1.05] tracking-tight text-white"
            style={{
              fontFamily: 'var(--font-jakarta), sans-serif',
              fontSize: 'clamp(36px, 6vw, 64px)',
            }}
          >
            {h1}
          </h1>

          <h2
            className="mt-5 max-w-xl text-[18px] font-normal leading-[1.45] text-[#E9DFD0] md:text-[22px]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {isLoc ? t('location.banner', { city }) : tHome('hero.sub')}
          </h2>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WAButton
              href={waDefault}
              label={tHome('hero.primaryCta')}
              phone={trackedPhone}
              size="lg"
            />
            <a
              href="#styles"
              className="inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-white hover:text-[#13204C]"
              style={{ transition: 'background-color 200ms ease, color 200ms ease' }}
            >
              {tHome('hero.secondaryCta')}
            </a>
          </div>

          <p className="mt-7 text-[13px] font-medium text-white/75">
            {tHome('hero.trust')}
          </p>
        </div>
      </div>
    </section>
  )

  // ======= USP BAR (no heading, highlighted icons, equal cards) =======
  const uspBar = (
    <section className="relative bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3" style={{ gap: '24px' }}>
          {(['1', '2', '3'] as const).map((n, i) => {
            const eyebrowLabels = [
              { en: 'INCLUDED FREE', ms: 'TERMASUK PERCUMA', zh: '全免' },
              { en: '5 PREMIUM STYLES', ms: '5 GAYA PREMIUM', zh: '五大高端风格' },
              { en: 'HOMES AND OFFICES', ms: 'RUMAH DAN PEJABAT', zh: '家居与办公室' },
            ]
            return (
              <div
                key={n}
                className="flex h-full flex-col items-center rounded-[20px] border border-[#E5E7EE] bg-white px-7 py-8 text-center"
                style={{ boxShadow: '0 4px 12px rgba(11,21,58,0.04)' }}
              >
                <span className="usp-icon-pill" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {i === 0 && <path d="M20 6 9 17l-5-5" />}
                    {i === 1 && (
                      <>
                        <path d="M4 4h4v16H4z" />
                        <path d="M10 8h4v12h-4z" />
                        <path d="M16 12h4v8h-4z" />
                      </>
                    )}
                    {i === 2 && (
                      <>
                        <path d="M3 9l9-6 9 6" />
                        <path d="M5 8v12h14V8" />
                      </>
                    )}
                  </svg>
                </span>
                <p className="eyebrow mt-5">{eyebrowLabels[i][locale]}</p>
                <h3
                  className="mt-2 text-[19px] font-semibold leading-[1.3] text-[#13204C]"
                  style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  {tShared(`usp${n}Title` as 'usp1Title')}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#5A6480]">
                  {tShared(`usp${n}Sub` as 'usp1Sub')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )

  // ======= LOGO STRIP (Trusted By) =======
  const logoStripItems = [
    tHome('logoStrip.item1' as 'products.heading'),
    tHome('logoStrip.item2' as 'products.heading'),
    tHome('logoStrip.item3' as 'products.heading'),
    tHome('logoStrip.item4' as 'products.heading'),
    tHome('logoStrip.item5' as 'products.heading'),
    tHome('logoStrip.item6' as 'products.heading'),
  ]
  const logoStrip = (
    <section
      className="bg-white py-8"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 text-center">
          <p className="eyebrow">
            {tHome('logoStrip.eyebrow' as 'products.heading')}
          </p>
        </div>
        <div className="logo-strip">
          {logoStripItems.map((label, idx) => (
            <div key={idx} className="logo-strip-item">
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  // ======= PRODUCT GRID =======
  const productGrid = (
    <section id="styles" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:text-left">
          <p className="eyebrow eyebrow-lg">{tHome('products.eyebrow')}</p>
          <h3
            className="text-[clamp(28px,4vw,42px)] font-semibold leading-[1.15] tracking-tight text-[#13204C]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {tHome('products.heading')}
          </h3>
          <p className="mt-5 max-w-3xl text-[15px] leading-[1.7] text-[#5A6480]">
            {tHome('products.intro')}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProducts.map((p) => {
            const waHref = waRedirect(
              locale,
              p.name + (isLoc ? ` — ${city}` : ''),
              isLoc ? slug : undefined,
            )
            const altKey =
              p.slug === 'standard-wood'
                ? 'woodPanel'
                : p.slug === 'standard-fluted'
                  ? 'flutedPanel'
                  : p.slug === 'standard-pvc'
                    ? 'pvcPanel'
                    : p.slug === 'standard-acoustic'
                      ? 'acousticPanel'
                      : p.slug === 'marble-gold'
                        ? 'marbleGoldPanel'
                        : p.slug === 'marble-silver'
                          ? 'marbleSilverPanel'
                          : 'marbleBlackPanel'
            return (
              <ProductImpressionTracker key={p.slug} slug={p.slug}>
                <article
                  className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E5E7EE] bg-white card-shadow card-shadow-hover hover:-translate-y-0.5"
                  style={{ transition: 'transform 220ms ease, box-shadow 220ms ease' }}
                >
                  <span className="free-install-badge" aria-hidden="true">
                    {tShared('freeInstallBadge')}
                  </span>

                  <div className="product-card-img relative h-56">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={tShared(`alt.${altKey}` as 'alt.woodPanel')}
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="eyebrow">{p.tag}</p>
                    <h4
                      className="text-[22px] font-semibold leading-[1.2] tracking-tight text-[#13204C]"
                      style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                    >
                      {p.name}
                    </h4>
                    <p className="product-card-desc mt-3 text-[14px] leading-[1.6] text-[#5A6480]">
                      {p.description}
                    </p>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E7EE] bg-[#F8F8FA] text-sm">
                      <p className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-[#5A6480]">{tHome('products.marketLabel')}</span>
                        <span className="text-[#5A6480] line-through">RM{p.market}/sqft</span>
                      </p>
                      <div className="h-px bg-[#E5E7EE]" />
                      <p className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-[#5A6480]">{tHome('products.ourLabel')}</span>
                        <span className="font-semibold text-[#13204C]">RM{p.ourPrice}/sqft</span>
                      </p>
                      <div className="h-px bg-[#E5E7EE]" />
                      <p className="flex items-center justify-between bg-[#13204C] px-4 py-3 text-white">
                        <span
                          className="text-[12px] font-semibold uppercase tracking-[0.1em]"
                          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                        >
                          {tHome('products.promoLabel')}
                        </span>
                        <span className="font-bold text-[#C8A45C]">From RM{p.promo}/sqft</span>
                      </p>
                    </div>

                    <div className="mt-auto pt-5">
                      <WAButton
                        href={waHref}
                        label={tShared('whatsappCta')}
                        phone={trackedPhone}
                        className="w-full"
                      />
                    </div>
                  </div>
                </article>
              </ProductImpressionTracker>
            )
          })}
        </div>
      </div>
    </section>
  )

  // ======= PROCESS =======
  const processSection = (
    <section id="process" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="eyebrow eyebrow-lg">{tHome('howItWorks.eyebrow')}</p>
          <h3
            className="mx-auto max-w-2xl text-[clamp(26px,3.8vw,38px)] font-semibold leading-[1.15] tracking-tight text-[#13204C]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {tHome('howItWorks.heading')}
          </h3>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => {
            const stepEyebrows = [
              { en: 'STEP 1 · ENQUIRE', ms: 'LANGKAH 1 · TANYA', zh: '第一步 · 咨询' },
              { en: 'STEP 2 · MEASURE', ms: 'LANGKAH 2 · UKUR', zh: '第二步 · 量度' },
              { en: 'STEP 3 · QUOTE', ms: 'LANGKAH 3 · SEBUT HARGA', zh: '第三步 · 报价' },
              { en: 'STEP 4 · INSTALL', ms: 'LANGKAH 4 · PASANG', zh: '第四步 · 安装' },
            ]
            return (
              <div
                key={n}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C8A45C] bg-[#13204C] text-[20px] font-bold text-white"
                  style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  {n}
                </div>
                <p className="eyebrow">{stepEyebrows[n - 1][locale]}</p>
                <h4
                  className="text-[18px] font-semibold leading-[1.3] tracking-tight text-[#13204C]"
                  style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  {tHome(`howItWorks.step${n}Title` as 'howItWorks.step1Title')}
                </h4>
                <p className="mt-3 text-[14px] leading-[1.7] text-[#5A6480]">
                  {tHome(`howItWorks.step${n}Body` as 'howItWorks.step1Body')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )

  // ======= WHY US =======
  const whyUs = (
    <section className="bg-[#0B153A] py-16 text-[#FBF7EF] sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="eyebrow eyebrow-light eyebrow-lg">{tHome('whyUs.eyebrow')}</p>
          <h3
            className="mx-auto max-w-2xl text-[clamp(26px,3.8vw,38px)] font-semibold leading-[1.15] tracking-tight text-[#FBF7EF]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {tHome('whyUs.heading')}
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {([1, 2, 3, 4] as const).map((n) => {
            const cardEyebrows = [
              { en: 'FREE INSTALL', ms: 'PASANG PERCUMA', zh: '免费安装' },
              { en: 'OWN CREW', ms: 'KRU SENDIRI', zh: '自家团队' },
              { en: 'PREMIUM MATERIAL', ms: 'MATERIAL PREMIUM', zh: '优质材料' },
              { en: 'WARRANTY', ms: 'WARANTI', zh: '保修' },
            ]
            return (
              <div
                key={n}
                className="rounded-[20px] border border-[#C8A45C]/20 bg-white p-7 text-center sm:text-left"
              >
                <p className="eyebrow">{cardEyebrows[n - 1][locale]}</p>
                <h4
                  className="text-[18px] font-semibold leading-[1.3] tracking-tight text-[#13204C]"
                  style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  {tHome(`whyUs.p${n}Title` as 'whyUs.p1Title')}
                </h4>
                <p className="mt-3 text-[14px] leading-[1.7] text-[#5A6480]">
                  {tHome(`whyUs.p${n}Body` as 'whyUs.p1Body')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )

  // ======= REVIEWS (Google-Reviews treatment) =======
  const GoogleGLogo = ({ size = 20 }: { size?: number }) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-label="Google"
      role="img"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )

  const GoogleStars = ({ count = 5 }: { count?: number }) => (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="#FBBC04"
          aria-hidden="true"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  )

  const reviews = (
    <section className="relative bg-[#F8F8FA] py-16 text-[#0E172E] sm:py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Aggregate Google badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-[#E5E7EE] bg-white px-5 py-3 shadow-[0_4px_14px_rgba(11,21,58,0.06)]">
            <GoogleGLogo size={28} />
            <div className="text-left">
              <p className="text-[14px] font-bold leading-tight text-[#13204C]">
                4.9 / 5 on Google Reviews
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <GoogleStars count={5} />
                <span className="text-[11px] font-medium text-[#5A6480]">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 text-center">
          <p className="eyebrow">{tHome('reviews.eyebrow')}</p>
          <h3
            className="mx-auto max-w-3xl text-[clamp(26px,3.8vw,38px)] font-semibold leading-[1.15] tracking-tight text-[#13204C]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {tHome('reviews.heading')}
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <figure
              key={n}
              className="flex h-full flex-col rounded-[20px] border border-[#E5E7EE] bg-white p-7"
            >
              {/* Google G + Posted on Google */}
              <div className="mb-3 flex items-center gap-2">
                <GoogleGLogo size={20} />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5A6480]"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  Posted on Google
                </span>
              </div>
              <GoogleStars count={5} />

              <p className="eyebrow mt-4">
                {tHome(`reviews.r${n}Tag` as 'reviews.r1Tag')}
              </p>
              <figcaption
                className="text-[17px] font-semibold leading-[1.25] text-[#13204C]"
                style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                {tHome(`reviews.r${n}Name` as 'reviews.r1Name')}
              </figcaption>
              <blockquote className="mt-3 flex-1 text-[14px] leading-[1.7] text-[#0E172E]/80">
                {tHome(`reviews.r${n}Body` as 'reviews.r1Body')}
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )

  // ======= GALLERY =======
  const gallery = (
    <section className="bg-[#F8F8FA] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="eyebrow eyebrow-lg">
            {locale === 'ms' ? 'KERJA SIAP' : locale === 'zh' ? '完工案例' : 'COMPLETED WORK'}
          </p>
          <h3
            className="mx-auto max-w-2xl text-[clamp(26px,3.6vw,36px)] font-semibold leading-[1.15] tracking-tight text-[#13204C]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {tShared('gallery.heading')}
          </h3>
          <p className="mt-3 text-[14px] text-[#5A6480]">{tShared('gallery.subheading')}</p>
        </div>
        <div className="wp-gallery">
          {GALLERY_IMAGES.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={tShared('alt.gallery', { n: String(i + 1) })}
              className="aspect-[4/3] w-full rounded-[16px] border border-[#E5E7EE] object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  )

  // ======= LOCATION EXTRAS =======
  const locationExtras =
    isLoc && locationCopy ? (
      <>
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <p className="eyebrow">
              {locale === 'ms'
                ? 'PEMASANGAN TEMPATAN'
                : locale === 'zh'
                  ? '本地安装'
                  : 'LOCAL INSTALL'}
            </p>
            <h3
              className="text-[clamp(24px,3.2vw,32px)] font-semibold leading-[1.2] tracking-tight text-[#13204C]"
              style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              {t('location.whyHeading', { city })}
            </h3>
            <p className="mt-6 text-[15px] leading-[1.75] text-[#0E172E]/85">
              {locationCopy.intro}
            </p>
            <ul className="mt-8 grid gap-3">
              {locationCopy.whyPoints.map((pt, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-[14px] border border-[#E5E7EE] bg-[#F8F8FA] p-4 text-[14px] leading-[1.7] text-[#0E172E]"
                >
                  <span className="mt-[3px] inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C8A45C] text-[11px] font-bold text-white">
                    ✓
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#F8F8FA] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <p className="eyebrow">
              {locale === 'ms'
                ? 'SOALAN LAZIM TEMPATAN'
                : locale === 'zh'
                  ? '本地常见问题'
                  : 'LOCAL FAQ'}
            </p>
            <h3
              className="text-[clamp(24px,3.2vw,32px)] font-semibold leading-[1.2] tracking-tight text-[#13204C]"
              style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              {t('location.faqHeading', { city })}
            </h3>
            <div className="mt-8 space-y-3">
              {locationCopy.faqs.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-[14px] border border-[#E5E7EE] bg-white p-5"
                >
                  <summary
                    className="flex cursor-pointer items-start justify-between gap-4 text-[15px] font-semibold text-[#13204C]"
                    style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                  >
                    {f.q}
                    <span
                      className="text-[#C8A45C] group-open:rotate-180"
                      style={{ transition: 'transform 200ms ease' }}
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[#5A6480]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </>
    ) : null

  // ======= HOMEPAGE FAQ =======
  const homepageFaq = !isLoc ? (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="eyebrow eyebrow-lg">{tHome('faq.eyebrow')}</p>
          <h3
            className="text-[clamp(26px,3.6vw,36px)] font-semibold leading-[1.15] tracking-tight text-[#13204C]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {tHome('faq.heading')}
          </h3>
        </div>
        <div className="space-y-3">
          {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((n) => (
            <details
              key={n}
              className="group overflow-hidden rounded-[14px] border border-[#E5E7EE] bg-white"
            >
              <summary
                className="flex cursor-pointer items-start justify-between gap-4 px-6 py-4 text-[15px] font-semibold text-[#13204C]"
                style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                <span className="flex flex-col">
                  <span className="eyebrow mb-1.5 inline-block w-fit">
                    {tHome(`faq.q${n}Tag` as 'faq.q1Tag')}
                  </span>
                  <span>{tHome(`faq.q${n}` as 'faq.q1')}</span>
                </span>
                <span
                  className="mt-1 text-[#C8A45C] group-open:rotate-180"
                  style={{ transition: 'transform 200ms ease' }}
                >
                  ▾
                </span>
              </summary>
              <p className="border-t border-[#E5E7EE] bg-[#F8F8FA] px-6 py-5 text-[14px] leading-[1.75] text-[#5A6480]">
                {tHome(`faq.a${n}` as 'faq.a1')}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  ) : null

  // ======= LOCATIONS CLOUD (homepage) =======
  const locationsAccordion = !isLoc ? (
    <section id="locations" className="bg-[#F8F8FA] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:text-left">
          <p className="eyebrow eyebrow-lg">
            {locale === 'ms' ? 'LIPUTAN' : locale === 'zh' ? '服务覆盖' : 'COVERAGE'}
          </p>
          <h3
            className="text-[clamp(24px,3.2vw,32px)] font-semibold leading-[1.15] tracking-tight text-[#13204C]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {tHome('locationsCta.heading')}
          </h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[#5A6480]">
            {tHome('locationsCta.sub')}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STATES_ORDER.map((state) => {
            const rows = LOCATIONS.filter((l) => l.state === state)
            if (!rows.length) return null
            return (
              <div key={state} className="rounded-[18px] border border-[#E5E7EE] bg-white p-5">
                <h4
                  className="mb-3 text-[15px] font-semibold text-[#13204C]"
                  style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  {STATES_DISPLAY[state][locale]}
                  <span className="ml-2 text-[11px] font-medium text-[#5A6480]">
                    ({rows.length})
                  </span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {rows.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/${locale}/${siteConfig.productSlug}/${l.slug}`}
                      className="rounded-full border border-[#E5E7EE] bg-[#F8F8FA] px-3 py-1 text-[13px] text-[#13204C] hover:border-[#C8A45C] hover:bg-[#13204C] hover:text-white"
                      style={{
                        transition:
                          'background-color 180ms ease, color 180ms ease, border-color 180ms ease',
                      }}
                    >
                      {l.display[locale]}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  ) : null

  // ======= NEARBY LOCATIONS =======
  const nearby =
    isLoc && locationSlug
      ? (() => {
          const cur = findLocation(locationSlug)
          if (!cur) return null
          const items = cur.nearby
            .map((s) => findLocation(s))
            .filter((l): l is LocationEntry => !!l)
          return (
            <section className="bg-[#F8F8FA] py-16 sm:py-20">
              <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <p className="eyebrow eyebrow-lg">
                  {locale === 'ms'
                    ? 'KAWASAN BERDEKATAN'
                    : locale === 'zh'
                      ? '邻近地区'
                      : 'NEARBY AREAS'}
                </p>
                <h3
                  className="text-[clamp(24px,3.2vw,32px)] font-semibold leading-[1.2] tracking-tight text-[#13204C]"
                  style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  {t('location.nearby.heading')}
                </h3>
                <p className="mt-3 text-[14px] text-[#5A6480]">{t('location.nearby.sub')}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {items.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/${locale}/${siteConfig.productSlug}/${l.slug}`}
                      className="group flex items-center justify-between rounded-[14px] border border-[#E5E7EE] bg-white px-5 py-4 hover:border-[#C8A45C] hover:bg-[#F8F8FA]"
                      style={{ transition: 'background-color 180ms ease, border-color 180ms ease' }}
                    >
                      <span
                        className="text-[15px] font-semibold text-[#13204C]"
                        style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                      >
                        {l.display[locale]}
                      </span>
                      <span
                        className="text-[#C8A45C] group-hover:translate-x-1"
                        style={{ transition: 'transform 180ms ease' }}
                      >
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )
        })()
      : null

  // ======= FINAL CTA =======
  const finalCta = (
    <section
      className="relative bg-[#0E172E] py-24 text-white sm:py-28"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(11,21,58,0.85) 0%, rgba(19,32,76,0.78) 100%), url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-12">
        <p className="eyebrow eyebrow-light eyebrow-lg">
          {locale === 'ms' ? 'KUNCI HARI INI' : locale === 'zh' ? '今日锁定' : 'LOCK IN TODAY'}
        </p>
        <h3
          className="text-[clamp(28px,4.6vw,46px)] font-medium leading-[1.1] tracking-tight"
          style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
        >
          {isLoc ? t('location.cta.heading', { city }) : tHome('finalCta.heading')}
        </h3>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-white/80">
          {isLoc ? t('location.cta.sub') : tHome('finalCta.sub')}
        </p>

        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {(['ctaTag1', 'ctaTag2', 'ctaTag3'] as const).map((k) => (
            <p
              key={k}
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A45C]/40 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm"
            >
              <span className="text-[#C8A45C]" aria-hidden="true">
                ✓
              </span>
              {tShared(k)}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <WAButton
            href={waDefault}
            label={isLoc ? t('location.cta.button') : tHome('finalCta.button')}
            phone={trackedPhone}
            size="lg"
          />
        </div>

        <p
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#C8A45C]/60 bg-[#C8A45C]/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C8A45C]"
          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          {locale === 'ms'
            ? 'Pemasangan Percuma Bernilai RM500'
            : locale === 'zh'
              ? '免费安装价值 RM500'
              : 'Free Installation Worth RM500'}
        </p>
      </div>
    </section>
  )

  // ======= FOOTER =======
  const footer = (
    <footer id="contact" className="relative bg-[#0B153A] text-[#FBF7EF]">
      <div
        className="h-[1px] w-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #C8A45C 50%, transparent 100%)',
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="flex items-center gap-2.5">
              <FlutedMarkLight className="h-10 w-10" />
              <span
                className="text-[18px] font-semibold tracking-tight text-[#FBF7EF]"
                style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                Wall Panel Malaysia
              </span>
            </p>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#FBF7EF]/70">
              {tFoot('tagline')}
            </p>
          </div>

          <div>
            <p className="eyebrow eyebrow-light">
              {locale === 'ms' ? 'JELAJAH' : locale === 'zh' ? '导览' : 'EXPLORE'}
            </p>
            <h4
              className="text-[14px] font-semibold tracking-tight text-[#FBF7EF]"
              style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              {tFoot('quickLinks')}
            </h4>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.7]">
              {[
                { href: `/${locale}#styles`, key: 'services' as const },
                { href: `/${locale}#locations`, key: 'locations' as const },
                { href: `/${locale}#process`, key: 'gallery' as const },
                { href: `/${locale}/blog`, key: 'blog' as const },
              ].map((it) => (
                <li key={it.key}>
                  <Link
                    href={it.href}
                    className="text-[#FBF7EF]/75 hover:text-[#C8A45C]"
                    style={{ transition: 'color 160ms ease' }}
                  >
                    {tNav(it.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-light">
              {locale === 'ms'
                ? 'LOKASI PEMASANGAN'
                : locale === 'zh'
                  ? '服务城市'
                  : 'WHERE WE INSTALL'}
            </p>
            <h4
              className="text-[14px] font-semibold tracking-tight text-[#FBF7EF]"
              style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              {tFoot('topLocations')}
            </h4>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.7]">
              {TOP_FOOTER_LOCATIONS.map((sl) => {
                const l = findLocation(sl)
                if (!l) return null
                return (
                  <li key={sl}>
                    <Link
                      href={`/${locale}/${siteConfig.productSlug}/${sl}`}
                      className="text-[#FBF7EF]/75 hover:text-[#C8A45C]"
                      style={{ transition: 'color 160ms ease' }}
                    >
                      {l.display[locale]}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-light">
              {locale === 'ms' ? 'BAHASA' : locale === 'zh' ? '语言' : 'LANGUAGE'}
            </p>
            <h4
              className="text-[14px] font-semibold tracking-tight text-[#FBF7EF]"
              style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              {tFoot('getInTouch')}
            </h4>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#FBF7EF]/70">
              {tFoot('getInTouchSub')}
            </p>
            <div className="mt-4">
              <WAButton href={waDefault} label={tNav('whatsapp')} phone={trackedPhone} />
            </div>
            <div className="mt-4">
              <LanguageSwitcher variant="dark" />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#FBF7EF]/15 pt-6 text-xs text-[#FBF7EF]/60">
          <p>{tFoot('legal', { year: String(new Date().getFullYear()) })}</p>
        </div>
      </div>
    </footer>
  )

  // ======= CALCULATOR (Special Section) =======
  const calculatorStrings = {
    eyebrow: tHome('calculator.eyebrow' as 'products.heading'),
    heading: tHome('calculator.heading' as 'products.heading'),
    intro: tHome('calculator.intro' as 'products.heading'),
    lengthLabel: tHome('calculator.lengthLabel' as 'products.heading'),
    heightLabel: tHome('calculator.heightLabel' as 'products.heading'),
    familyLabel: tHome('calculator.familyLabel' as 'products.heading'),
    familyStandard: tHome('calculator.familyStandard' as 'products.heading'),
    familyMarble: tHome('calculator.familyMarble' as 'products.heading'),
    metersUnit: tHome('calculator.metersUnit' as 'products.heading'),
    sqftLabel: tHome('calculator.sqftLabel' as 'products.heading'),
    costLabel: tHome('calculator.costLabel' as 'products.heading'),
    promoPillLabel: tHome('calculator.promoPillLabel' as 'products.heading'),
    freeInstallLabel: tHome('calculator.freeInstallLabel' as 'products.heading'),
    ctaLabel: tHome('calculator.ctaLabel' as 'products.heading'),
    whatsappTemplate: tHome('calculator.waTemplate' as 'products.heading'),
  }

  const calculatorSection = (
    <WallPanelCalculator
      locale={locale}
      phone={trackedPhone}
      waRedirectBase={`/${locale}/redirect-whatsapp-1`}
      locationSlug={isLoc ? slug : undefined}
      strings={calculatorStrings}
    />
  )

  // ======= FAB =======
  const fab = (
    <WhatsAppClickTracker phone={trackedPhone}>
      <a
        href={waDefault}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={tShared('whatsappCta')}
        className="fab-pulse fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_rgba(11,21,58,0.22),0_4px_12px_rgba(37,211,102,0.35)] hover:bg-[#1EBE57]"
        style={{ transition: 'background-color 200ms ease' }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
        </svg>
      </a>
    </WhatsAppClickTracker>
  )

  return (
    <>
      {fomoBanner}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-30">{header}</div>
        {hero}
      </div>
      {logoStrip}
      {uspBar}
      {productGrid}
      {calculatorSection}
      {processSection}
      {whyUs}
      {reviews}
      {gallery}
      {locationExtras}
      {homepageFaq}
      {locationsAccordion}
      {nearby}
      {finalCta}
      {footer}
      {fab}
    </>
  )
}
