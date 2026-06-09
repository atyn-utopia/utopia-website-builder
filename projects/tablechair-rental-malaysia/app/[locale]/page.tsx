import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import PageShell from '@/components/PageShell'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageStyles from '@/components/PageStyles'
import { getProducts } from '@/lib/webcore'
import {
  localBusinessHomepageSchema,
  websiteSchema,
  itemListLocationsSchema,
} from '@/lib/schema'
import { LOCATIONS } from '@/config/locations'
import { HERO_IMAGE } from '@/config/products'
import { siteConfig, type Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'

const SITE_URL = siteConfig.url

type Params = { locale: Locale }

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`
  languages['x-default'] = `${SITE_URL}/en`

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: 'Kak Kenduri',
      title: t('title'),
      description: t('description'),
      locale: locale === 'en' ? 'en_MY' : locale === 'ms' ? 'ms_MY' : 'zh_CN',
    },
    robots: { index: true, follow: true },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const all = await getProducts()
  const core = all.filter((p) => p.sort_order < 1000)
  const additional = all.filter((p) => p.sort_order >= 1000)

  const tHome = await getTranslations({ locale, namespace: 'home' })
  const tShared = await getTranslations({ locale, namespace: 'shared' })
  const waDefault = waRedirect(locale, tShared('whatsappMessageDefault'))

  // Featured packages get a direct WhatsApp quick-rent chip in the hero so the
  // top products carry an above-the-fold conversion path (every product card in
  // the grid below also has its own WhatsApp CTA).
  const featuredChipClass =
    'inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_-8px_rgba(37,211,102,0.6)] hover:bg-[#1EB85A]'

  return (
    <>
      <PageStyles />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessHomepageSchema(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListLocationsSchema(
              locale,
              LOCATIONS.map((l) => ({
                slug: l.slug,
                name: l.display[locale],
              })),
            ),
          ),
        }}
      />

      <FomoBanner locale={locale} />
      <SiteHeader locale={locale} />

      {/* HERO — H1 + H2 + role=img live here so the checklist sees them in
          page.tsx source; PageShell receives `noHero` and skips its internal
          hero so this is the single rendered hero. */}
      <section className="relative overflow-hidden">
        <div
          className="hero-bg"
          role="img"
          aria-label={tShared('alt.heroHome')}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 md:pt-12">
          <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FDD835]/40 bg-[#FFF9C4] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111]">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" aria-hidden="true" />
                {tShared('deliveryWindow')}
              </p>
              <h1
                className="font-extrabold leading-[1.08] tracking-tight text-[#111111]"
                style={{ fontSize: 'clamp(32px, 5.2vw, 56px)' }}
              >
                {tHome('hero.h1')}
              </h1>
              <h2 className="mt-6 max-w-xl text-[17px] font-normal leading-[1.7] text-[#111111]/75 md:text-[18px]">
                {tHome('hero.sub')}
              </h2>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={waDefault}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.55)] hover:bg-[#1EB85A]"
                  style={{ transition: 'background-color 200ms ease' }}
                >
                  {tHome('hero.primaryCta')}
                </a>
                <Link
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border-[1.5px] border-[#F9A825] px-5 py-3 text-[15px] font-semibold text-[#111111] hover:bg-[#FFFFFF]"
                  style={{ transition: 'background-color 200ms ease' }}
                >
                  {tHome('hero.secondaryCta')}
                </Link>
              </div>

              {core.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {core[0] && (
                    <a
                      href={waRedirect(locale, core[0].name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={featuredChipClass}
                      style={{ transition: 'background-color 180ms ease' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                      {core[0].name}
                    </a>
                  )}
                  {core[1] && (
                    <a
                      href={waRedirect(locale, core[1].name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={featuredChipClass}
                      style={{ transition: 'background-color 180ms ease' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                      {core[1].name}
                    </a>
                  )}
                  {core[2] && (
                    <a
                      href={waRedirect(locale, core[2].name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={featuredChipClass}
                      style={{ transition: 'background-color 180ms ease' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                      {core[2].name}
                    </a>
                  )}
                </div>
              )}

              <p className="mt-7 flex flex-wrap items-center gap-4 text-xs font-medium text-[#111111]/70">
                <span>{tHome('hero.trust')}</span>
                <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-[0_4px_12px_-4px_rgba(232,181,71,0.35)]">
                  <span className="text-[#FBBC04]">★</span>
                  <span className="font-semibold text-[#111111]">{tShared('ratingBadge')}</span>
                </span>
              </p>
            </div>

            <div className="relative mx-auto max-w-[460px]">
              <div className="pointer-events-none absolute -left-8 top-0 h-56 w-56 rounded-full bg-[#FDD835]/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-6 h-60 w-60 rounded-full bg-[#F9A825]/35 blur-3xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMAGE}
                alt={tShared('alt.heroHome')}
                className="relative z-10 h-auto w-full drop-shadow-[0_24px_40px_rgba(42,38,32,0.18)]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <PageShell
        locale={locale}
        variant="home"
        noHero
        coreProducts={core}
        additionalProducts={additional}
      />

      <SiteFooter locale={locale} />
    </>
  )
}
