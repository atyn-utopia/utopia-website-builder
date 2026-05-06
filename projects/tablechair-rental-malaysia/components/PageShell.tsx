// Shared page shell used by homepage and location pages. Renders all
// sections in the identical order mandated by architecture.md.
//
// Homepage passes variant='home'. Location pages pass variant='location'
// with location-specific props. Breadcrumb + Nearby + LocationFAQ only
// render on location pages, between Header→Hero and Accordion→Footer
// respectively.

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import {
  BungaManggar,
  KKMark,
} from '@/components/Ornaments'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker'
import {
  HERO_IMAGE,
  GALLERY_IMAGES,
} from '@/config/products'
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
  // location-only
  locationSlug?: string
  locationCity?: string
  locationCopy?: LocationCopy
}

// ---------- small presentational helpers ----------

function WAButton({
  href,
  label,
  phone,
  className,
}: {
  href: string
  label: string
  phone: string
  className?: string
}) {
  return (
    <WhatsAppClickTracker phone={phone}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={
          'inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.55)] hover:bg-[#1EB85A] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 ' +
          (className ?? '')
        }
        style={{
          transition: 'transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease',
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
        </svg>
        {label}
      </a>
    </WhatsAppClickTracker>
  )
}

// ---------- Main component ----------

export default async function PageShell({
  locale,
  variant,
  coreProducts,
  additionalProducts,
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

  // Resolve the phone server-side for analytics labelling. The actual click
  // still navigates through /redirect-whatsapp-1 (which re-resolves and may
  // pick a different rotated number), but for the click-tracking label we
  // need a stable identifier, so we use the number resolved at render time.
  const { phone: trackedPhone } = await getPhoneNumber(isLoc ? slug : undefined)

  const waDefault = waRedirect(
    locale,
    isLoc
      ? tShared('whatsappMessageLocation', { city })
      : tShared('whatsappMessageDefault'),
    isLoc ? slug : undefined,
  )

  // ======= FOMO COUNTDOWN STRIP (mandatory) =======
  const fomoBanner = (
    <div className="relative z-50 overflow-hidden bg-[#111111] py-2.5 text-center text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-4 text-[13px] sm:gap-5 sm:text-[14px]">
        <p className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FDD835] opacity-75" />
            <span className="inline-flex h-2 w-2 rounded-full bg-[#FDD835]" />
          </span>
          <span className="font-medium">
            {tShared('fomoText')}
          </span>
        </p>
        <WhatsAppClickTracker phone={trackedPhone}>
          <a
            href={waDefault}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 rounded-full bg-[#25D366] px-4 py-1 text-[12px] font-bold text-white hover:bg-[#1EB85A] sm:inline-flex"
            style={{ transition: 'background-color 180ms ease' }}
          >
            {tShared('fomoCta')}
          </a>
        </WhatsAppClickTracker>
      </div>
    </div>
  )

  // ======= HEADER — floating white pill, centered =======
  const header = (
    <header className="relative z-40 flex justify-center bg-transparent px-4 pb-4 pt-5 sm:pt-6">
      <div className="flex w-full max-w-5xl items-center justify-between gap-3 rounded-full bg-white py-2 pl-3 pr-2 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)] ring-1 ring-black/5 sm:gap-5 sm:pl-5 sm:pr-3">
        <Link
          href={`/${locale}`}
          aria-label={tShared('alt.logoAria')}
          className="flex shrink-0 items-center gap-2"
        >
          <KKMark className="h-9 w-9" />
          <span className="text-[16px] font-extrabold tracking-tight text-[#111111] sm:text-[17px]">
            Kak Kenduri
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <a
            href="#services"
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('services')}
          </a>
          <a
            href="#service-area"
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('locations')}
          </a>
          <a
            href="#gallery"
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('gallery')}
          </a>
          <a
            href={`/${locale}/blog`}
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('blog')}
          </a>
          <a
            href="#contact"
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('contact')}
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )

  // ======= HERO =======
  const h1 = isLoc
    ? t('location.h1', { city })
    : tHome('hero.h1')
  const heroSub = tHome('hero.sub')

  const hero = (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 md:pt-12">
        {isLoc && (
          <nav className="mb-5 text-sm text-[#111111]/60">
            <p className="inline">
              <Link href={`/${locale}`} className="py-1 hover:text-[#111111]">
                {t('location.breadcrumbs.home')}
              </Link>
              <span className="mx-2">/</span>
              <Link href={`/${locale}#service-area`} className="py-1 hover:text-[#111111]">
                {t('location.breadcrumbs.locations')}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#111111]">{city}</span>
            </p>
          </nav>
        )}

        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FDD835]/40 bg-[#FFF9C4] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111]">
              <span className="h-2 w-2 rounded-full bg-[#25D366]" aria-hidden="true" />
              {tShared('deliveryWindow')}
            </p>
            <h1 className="font-extrabold leading-[1.08] tracking-tight text-[#111111]"
                style={{ fontSize: 'clamp(32px, 5.2vw, 56px)' }}>
              {h1}
            </h1>
            <h2 className="mt-6 max-w-xl text-[17px] font-normal leading-[1.7] text-[#111111]/75 md:text-[18px]">
              {isLoc ? t('location.banner', { city }) : heroSub}
            </h2>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <WAButton href={waDefault} label={tHome('hero.primaryCta')} phone={trackedPhone} />
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border-[1.5px] border-[#F9A825] px-5 py-3 text-[15px] font-semibold text-[#111111] hover:bg-[#FFFFFF] text-center"
                style={{ transition: 'background-color 200ms ease, transform 200ms ease' }}
              >
                {tHome('hero.secondaryCta')}
              </a>
            </div>

            <p className="mt-7 flex flex-wrap items-center gap-4 text-xs font-medium text-[#111111]/70">
              <span>{tHome('hero.trust')}</span>
              <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-[0_4px_12px_-4px_rgba(232,181,71,0.35)]">
                <span className="text-[#FBBC04]">★</span>
                <span className="font-semibold text-[#111111]">{tShared('ratingBadge')}</span>
              </span>
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -left-8 top-0 h-56 w-56 rounded-full bg-[#FDD835]/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-6 h-60 w-60 rounded-full bg-[#F9A825]/35 blur-3xl" />

            <div className="relative mx-auto max-w-[460px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMAGE}
                alt={tShared(isLoc ? 'alt.heroLocation' : 'alt.heroHome', isLoc ? { city } : undefined)}
                className="relative z-10 h-auto w-full drop-shadow-[0_24px_40px_rgba(42,38,32,0.18)]"
                loading="eager"
              />

              {/* === Single floating Google review badge === */}
              <a
                href="https://www.google.com/search?q=kak+kenduri+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -right-2 bottom-8 z-20 flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_24px_50px_-18px_rgba(42,38,32,0.35)] ring-1 ring-black/5 hover:-translate-y-0.5 sm:-right-4 sm:bottom-12 sm:px-6 sm:py-5"
                style={{ transition: 'transform 220ms ease, box-shadow 220ms ease' }}
                aria-label="Kak Kenduri Google reviews — 4.9 stars"
              >
                {/* Google G mark */}
                <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>

                <div className="leading-tight">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#111111]/55">
                    Google Reviews
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[22px] font-extrabold text-[#111111] sm:text-[24px]">
                      4.9
                    </span>
                    <span className="text-[14px] tracking-tight text-[#FBBC04] sm:text-[15px]">
                      ★★★★★
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-[#111111]/65 sm:text-[12px]">
                    Based on 500+ reviews
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  // ======= USP BAR (3 points below hero) =======
  const uspBar = (
    <section className="border-y border-[#FDD835]/30 bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6">
        {[
          { icon: '⚡', titleKey: 'usp1Title' as const, subKey: 'usp1Sub' as const },
          { icon: '🛡️', titleKey: 'usp2Title' as const, subKey: 'usp2Sub' as const },
          { icon: '📦', titleKey: 'usp3Title' as const, subKey: 'usp3Sub' as const },
        ].map((u) => (
          <div key={u.titleKey} className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF9C4] text-[22px]">
              {u.icon}
            </span>
            <div>
              <h5 className="text-[15px] font-bold text-[#111111]">
                {tShared(u.titleKey)}
              </h5>
              <p className="mt-1 text-[15px] leading-[1.6] text-[#111111]/65">
                {tShared(u.subKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  // ======= PRODUCT GRID =======
  const productGrid = coreProducts.length > 0 ? (
    <section id="services" className="bg-[#FFFEF8] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl text-center sm:text-left">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#F9A825]">
            {tShared('priceFrom')}
          </h4>
          <h3 className="text-[clamp(28px,3.8vw,38px)] font-bold leading-[1.15] tracking-tight text-[#111111]">
            {tHome('products.heading')}
          </h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreProducts.map((p) => {
            const waHref = waRedirect(
              locale,
              p.name + (isLoc ? ` — ${city}` : ''),
              isLoc ? slug : undefined,
            )
            const imageUrl = p.photos[0]?.url
            const rentalDisplay = p.rental_price != null ? `RM${p.rental_price.toFixed(2)}` : '—'
            const saleDisplay = p.sale_price != null ? `RM${p.sale_price.toFixed(2)}` : '—'
            return (
              <ProductImpressionTracker key={p.id} slug={p.slug}>
              <article
                className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#FDD835]/35 bg-[#FFFFFF] kk-card-shadow hover:-translate-y-0.5 hover:kk-card-shadow-hover"
                style={{ transition: 'transform 220ms ease, box-shadow 220ms ease' }}
              >
                {imageUrl && (
                  <div
                    className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFFFFF]/60 to-[#FFFEF8]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h5 className="text-[22px] font-bold tracking-tight text-[#111111]">
                    {p.name}
                  </h5>
                  {p.description && (
                    <p
                      className="mt-4 text-[15px] leading-[1.7] text-[#111111]/75"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: 'calc(1.7em * 3)',
                      }}
                    >
                      {p.description}
                    </p>
                  )}

                  <div className="mt-5 overflow-hidden rounded-2xl border border-[#FDD835]/25 bg-[#FFF9C4]/60 text-sm">
                    <p className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-[#111111]/60">
                        {tHome('products.plainLabel')}
                      </span>
                      <span className="font-semibold text-[#111111]">{rentalDisplay}</span>
                    </p>
                    <div className="h-px bg-[#FDD835]/35" />
                    <p className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-[#111111]/60">
                        {tHome('products.withCoverLabel')}
                      </span>
                      <span className="font-semibold text-[#111111]">{saleDisplay}</span>
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
  ) : null

  // ======= ADDITIONAL RENTALS =======
  const additional = additionalProducts.length > 0 ? (
    <section className="bg-[#7a9a83] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl text-center sm:text-left">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FDD835]">
            {tHome('additional.eyebrow')}
          </h4>
          <h3 className="text-[clamp(26px,3.4vw,34px)] font-bold leading-[1.15] tracking-tight text-white">
            {tHome('additional.heading')}
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {additionalProducts.map((a) => {
            const waHref = waRedirect(
              locale,
              a.name + (isLoc ? ` — ${city}` : ''),
              isLoc ? slug : undefined,
            )
            const imageUrl = a.photos[0]?.url
            return (
              <ProductImpressionTracker key={a.id} slug={a.slug}>
              <article
                className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[#FDD835]/30 bg-[#FFFFFF] kk-card-shadow hover:-translate-y-0.5"
                style={{ transition: 'transform 220ms ease, box-shadow 220ms ease' }}
              >
                {imageUrl && (
                  <div className="flex h-40 items-center justify-center bg-[#FFFEF8] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={a.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h5 className="text-[17px] font-bold tracking-tight text-[#111111]">
                    {a.name}
                  </h5>
                  {a.description && (
                    <p
                      className="mt-3 text-[15px] leading-[1.7] text-[#111111]/75"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: 'calc(1.7em * 2)',
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                  <div className="flex-1" />
                  <WhatsAppClickTracker phone={trackedPhone}>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-[15px] font-semibold text-[#1EB85A] hover:text-[#25D366]"
                      style={{ transition: 'color 180ms ease' }}
                    >
                      {tShared('whatsappCtaShort')} →
                    </a>
                  </WhatsAppClickTracker>
                </div>
              </article>
              </ProductImpressionTracker>
            )
          })}
        </div>
      </div>
    </section>
  ) : null

  // ======= 3-STEP PROCESS =======
  const howItWorks = (
    <section
      className="relative overflow-hidden bg-[#111111] py-20 text-[#FFFEF8] sm:py-24"
      style={{
        backgroundImage:
          'linear-gradient(rgba(17,17,17,0.82), rgba(17,17,17,0.88)), url(https://static.wixstatic.com/media/d3104b_475eea6601814ca69a712b7f99019b07~mv2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FDD835]">
            {tShared('deliveryWindow')}
          </h4>
          <h3 className="text-[clamp(28px,3.8vw,38px)] font-bold leading-[1.15] tracking-tight">
            {tHome('howItWorks.heading')}
          </h3>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#FDD835] text-[40px] font-extrabold text-[#111111] shadow-[0_22px_40px_-14px_rgba(232,181,71,0.55)]">
                {n}
              </div>
              <h5 className="text-[20px] font-bold tracking-tight">
                {tHome(`howItWorks.step${n}Title` as 'howItWorks.step1Title')}
              </h5>
              <p className="mt-4 max-w-xs text-[15px] leading-[1.7] text-[#FFFEF8]/70">
                {tHome(`howItWorks.step${n}Body` as 'howItWorks.step1Body')}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <WAButton href={waDefault} label={tHome('hero.primaryCta')} phone={trackedPhone} className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  )

  // ======= REVIEWS + GALLERY =======
  const reviews = (
    <section id="gallery" className="bg-[#FFFEF8] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div className="max-w-2xl">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#F9A825]">
              {tShared('reviewsLabel')}
            </h4>
            <h3 className="text-[clamp(28px,3.8vw,38px)] font-bold leading-[1.15] tracking-tight text-[#111111]">
              {tHome('reviews.heading')}
            </h3>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#FDD835]/35 bg-white px-5 py-3 shadow-[0_12px_28px_-14px_rgba(232,181,71,0.4)]">
            <p className="flex items-center gap-1 text-lg font-bold" aria-label="Google">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC04]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </p>
            <div className="flex flex-col text-xs">
              <p className="font-semibold text-[#111111]">
                {tHome('reviews.badge')}
              </p>
              <a
                href="https://www.google.com/search?q=kak+kenduri+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F9A825] hover:text-[#111111] underline"
                style={{ transition: 'color 180ms ease' }}
              >
                {tShared('seeAllReviews')}
              </a>
            </div>
          </div>
        </div>

        <div className="mb-10 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <figure
              key={n}
              className="flex h-full flex-col rounded-[22px] border border-[#FDD835]/30 bg-[#FFFFFF] p-6 sm:p-7 kk-card-shadow"
            >
              <p className="mb-4 text-[#FBBC04]">★★★★★</p>
              <blockquote className="flex-1 text-[15px] leading-[1.7] text-[#111111]/80">
                “{tHome(`reviews.r${n}Body` as 'reviews.r1Body')}”
              </blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-[#111111]">
                {tHome(`reviews.r${n}Name` as 'reviews.r1Name')}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Desktop masonry */}
        <div className="kk-masonry hidden sm:block">
          {GALLERY_IMAGES.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={tShared('alt.gallery', { n: String(i + 1) })}
              className="w-full rounded-2xl border border-[#FDD835]/20 object-cover hover:scale-[1.02]"
              style={{ transition: 'transform 260ms ease' }}
              loading="lazy"
            />
          ))}
        </div>

        {/* Mobile marquee */}
        <div className="no-scrollbar relative -mx-4 flex overflow-hidden sm:hidden">
          <div className="kk-marquee flex shrink-0 gap-3 px-4">
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={tShared('alt.gallery', { n: String((i % 24) + 1) })}
                className="h-40 w-60 shrink-0 rounded-2xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  // ======= LOCATIONS ACCORDION =======
  const locationsAccordion = (
    <section id="service-area" className="bg-[#FFF9C4] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl text-center sm:text-left">
          <h3 className="text-[clamp(26px,3.4vw,34px)] font-bold leading-[1.15] tracking-tight text-[#111111]">
            {tHome('locationsCta.heading')}
          </h3>
          <h4 className="mt-4 text-[15px] font-normal leading-[1.7] text-[#111111]/75">
            {tHome('locationsCta.sub')}
          </h4>
        </div>
        <div className="divide-y divide-[#FDD835]/35 overflow-hidden rounded-[22px] border border-[#FDD835]/30 bg-[#FFFFFF]">
          {STATES_ORDER.map((state) => {
            const rows = LOCATIONS.filter((l) => l.state === state)
            if (!rows.length) return null
            return (
              <details key={state} className="group">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-[15px] font-semibold text-[#111111] hover:bg-[#FFFEF8]">
                  <span>
                    {STATES_DISPLAY[state][locale]}
                    <span className="ml-2 text-xs font-medium text-[#111111]/60">
                      ({rows.length})
                    </span>
                  </span>
                  <span className="text-[#FDD835] group-open:rotate-180" style={{ transition: 'transform 200ms ease' }}>
                    ▾
                  </span>
                </summary>
                <div className="flex flex-wrap gap-2 px-6 pb-5">
                  {rows.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/${locale}/${siteConfig.productSlug}/${l.slug}`}
                      className="rounded-full border border-[#FDD835]/40 bg-[#FFF9C4] px-4 py-2 text-[15px] min-h-[44px] inline-flex items-center text-[#111111] hover:bg-[#FFF176]"
                      style={{ transition: 'background-color 180ms ease' }}
                    >
                      {l.display[locale]}
                    </Link>
                  ))}
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )

  // ======= Location-only: Why + FAQ + Nearby =======
  const locationExtras = isLoc && locationCopy ? (
    <>
      <section className="bg-[#FFFEF8] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-[15px] leading-[1.75] text-[#111111]/80">
            {locationCopy.intro}
          </p>
          <h4 className="mt-12 text-[clamp(24px,3vw,30px)] font-bold tracking-tight text-[#111111]">
            {t('location.whyHeading', { city })}
          </h4>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {locationCopy.whyPoints.map((pt, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-[#FDD835]/30 bg-[#FFFFFF] p-5 text-[15px] leading-[1.7] text-[#111111]/85"
              >
                <span className="mt-[3px] inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#FDD835] text-[11px] font-bold text-[#111111]">
                  ✓
                </span>
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#FFF9C4] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h4 className="text-[clamp(24px,3vw,30px)] font-bold tracking-tight text-[#111111]">
            {t('location.faqHeading', { city })}
          </h4>
          <div className="mt-8 space-y-4">
            {locationCopy.faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-[#FDD835]/35 bg-[#FFFFFF] p-6 sm:p-7"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 text-[15px] font-semibold text-[#111111]">
                  {f.q}
                  <span className="text-[#FDD835] group-open:rotate-180" style={{ transition: 'transform 200ms ease' }}>▾</span>
                </summary>
                <p className="mt-4 text-[15px] leading-[1.7] text-[#111111]/75">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  ) : null

  const nearby =
    isLoc && locationSlug
      ? (() => {
          const cur = findLocation(locationSlug)
          if (!cur) return null
          const items = cur.nearby
            .map((s) => findLocation(s))
            .filter((l): l is LocationEntry => !!l)
          return (
            <section className="bg-[#FFFEF8] py-16 sm:py-20">
              <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <h4 className="text-[clamp(24px,3vw,30px)] font-bold tracking-tight text-[#111111]">
                  {t('location.nearby.heading')}
                </h4>
                <p className="mt-4 text-[15px] leading-[1.7] text-[#111111]/65">
                  {t('location.nearby.sub')}
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {items.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/${locale}/${siteConfig.productSlug}/${l.slug}`}
                      className="group flex items-center justify-between rounded-2xl border border-[#FDD835]/35 bg-[#FFFFFF] px-5 py-4 hover:bg-[#FFF9C4]"
                      style={{ transition: 'background-color 180ms ease' }}
                    >
                      <span className="text-[15px] font-semibold text-[#111111]">
                        {l.display[locale]}
                      </span>
                      <span className="text-[#FDD835] group-hover:translate-x-1" style={{ transition: 'transform 180ms ease' }}>→</span>
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
      className="relative overflow-hidden bg-[#111111] py-24 text-white sm:py-28"
      style={{
        backgroundImage:
          'linear-gradient(rgba(17,17,17,0.78), rgba(17,17,17,0.85)), url(https://static.wixstatic.com/media/d3104b_870aa6e8b831475794b6b63d59bde8cb~mv2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-12">
        <h3 className="text-[clamp(28px,4.5vw,44px)] font-extrabold leading-[1.1] tracking-tight">
          {isLoc
            ? t('location.cta.heading', { city })
            : tHome('finalCta.heading')}
        </h3>
        <h4 className="mx-auto mt-6 max-w-xl text-[17px] font-normal leading-[1.7] text-white/75">
          {isLoc ? t('location.cta.sub') : tHome('finalCta.sub')}
        </h4>

        {/* 3-point trust tags (mandatory) */}
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {(['ctaTag1', 'ctaTag2', 'ctaTag3'] as const).map((k) => (
            <p
              key={k}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm sm:text-[14px]"
            >
              <span className="text-[#FDD835]" aria-hidden="true">✓</span>
              {tShared(k)}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <WAButton
            href={waDefault}
            label={isLoc ? t('location.cta.button') : tHome('finalCta.button')}
            phone={trackedPhone}
          />
        </div>
      </div>
    </section>
  )

  // ======= FOOTER =======
  const footer = (
    <footer id="contact" className="relative bg-[#0A0A0A] text-[#FFFEF8]">
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#FDD835] to-transparent opacity-70" />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="flex items-center gap-2.5">
              <KKMark className="h-10 w-10" />
              <span className="text-lg font-extrabold tracking-tight">Kak Kenduri</span>
            </p>
            <p className="mt-4 text-[15px] leading-[1.7] text-[#FFFEF8]/70">
              {tFoot('tagline')}
            </p>
          </div>
          <div>
            <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
              {tFoot('contact')}
            </h6>
            <ul className="mt-5 space-y-3 text-[15px] leading-[1.7] text-[#FFFEF8]/80">
              <li>{tFoot('address')}</li>
              <li>{tFoot('hours')}</li>
            </ul>
          </div>
          <div>
            <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
              {tFoot('topLocations')}
            </h6>
            <ul className="mt-5 space-y-3 text-[15px] leading-[1.7]">
              {TOP_FOOTER_LOCATIONS.map((sl) => {
                const l = findLocation(sl)
                if (!l) return null
                return (
                  <li key={sl}>
                    <Link
                      href={`/${locale}/${siteConfig.productSlug}/${sl}`}
                      className="py-1 text-[#FFFEF8]/80 hover:text-[#FDD835]"
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
            <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
              {tFoot('getInTouch')}
            </h6>
            <p className="mt-5 text-[15px] leading-[1.7] text-[#FFFEF8]/70">
              {tFoot('getInTouchSub')}
            </p>
            <div className="mt-4">
              <WAButton href={waDefault} label={tNav('whatsapp')} phone={trackedPhone} />
            </div>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#FFFEF8]/15 pt-6 text-xs text-[#FFFEF8]/60 md:flex-row">
          <p>
            {tFoot('legal', { year: String(new Date().getFullYear()) })}
          </p>
        </div>
      </div>
    </footer>
  )

  return (
    <>
      {fomoBanner}
      <div
        className="bg-[#FFFEF8]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 0%, rgba(253,216,53,0.15) 0%, rgba(122,154,131,0.08) 35%, transparent 70%)',
        }}
      >
        {header}
        {hero}
      </div>
      {uspBar}
      {productGrid}
      {additional}
      {howItWorks}
      {reviews}
      {locationsAccordion}
      {locationExtras}
      {nearby}
      {finalCta}
      {footer}
    </>
  )
}
