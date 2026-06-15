import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
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
    alternates: seoAlternates(locale),
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
                  className="wa-btn inline-flex items-center justify-center gap-2 bg-[#25D366] text-[15px] font-semibold text-white hover:bg-[#1EB85A]"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
                  </svg>
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
