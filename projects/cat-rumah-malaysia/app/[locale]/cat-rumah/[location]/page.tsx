import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locations, locationBySlug, cityDisplay } from '@/config/locations'
import { routing, type Locale } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import { getPhoneNumber } from '@/lib/webcore'
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'
import { ProductSchema } from '@/components/schema/ProductSchema'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageStyles from '@/components/PageStyles'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import LocationPageClient from './LocationPageClient'

type Params = { locale: string; location: string }

export function generateStaticParams() {
  const out: Array<Params> = []
  for (const locale of routing.locales) {
    for (const l of locations) out.push({ locale, location: l.slug })
  }
  return out
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, location } = await params
  const loc = locationBySlug(location)
  if (!loc) return { title: siteConfig.brandName }
  const t = await getTranslations({ locale, namespace: 'location.meta' })
  const city = cityDisplay(location, locale)
  return {
    title: t('title', { city }),
    description: t('description', { city }),
    metadataBase: new URL(siteConfig.baseUrl),
    alternates: seoAlternates(locale, `/${siteConfig.productSlug}/${location}`),
    openGraph: {
      title: t('title', { city }),
      description: t('description', { city }),
      url: `${siteConfig.baseUrl}/${locale}/${siteConfig.productSlug}/${location}`,
      siteName: siteConfig.brandName,
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { locale, location } = await params
  setRequestLocale(locale)
  const loc = locationBySlug(location)
  if (!loc) notFound()

  const city = cityDisplay(location, locale)
  const tHero = await getTranslations({ locale, namespace: 'location.hero' })
  const tBread = await getTranslations({ locale, namespace: 'location.breadcrumb' })
  const tMeta = await getTranslations({ locale, namespace: 'location.meta' })
  const tRoot = await getTranslations({ locale })
  const imageAlt = tRoot('imageAlt')

  const { phone } = await getPhoneNumber(location)
  const waHref = `/${locale}/redirect-whatsapp-1?loc=${encodeURIComponent(location)}`

  const nearby = loc.nearby
    .map((slug) => {
      const n = locationBySlug(slug)
      if (!n) return null
      return { slug: n.slug, name: cityDisplay(n.slug, locale) }
    })
    .filter((n): n is { slug: string; name: string } => Boolean(n))

  return (
    <>
      <PageStyles />
      <LocalBusinessSchema locale={locale} locationSlug={location} cityName={city} />
      <ProductSchema name={tMeta('title', { city })} description={tMeta('description', { city })} locale={locale} />
      <BreadcrumbSchema
        items={[
          { name: tBread('home'), url: `/${locale}` },
          { name: city, url: `/${locale}/${siteConfig.productSlug}/${location}` },
        ]}
      />

      <FomoBanner locale={locale as Locale} />
      <SiteHeader />

      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(20,28,48,0.92) 0%, rgba(20,28,48,0.88) 50%, rgba(20,28,48,0.94) 100%), url(/images/hero-bg.jpg) center/cover no-repeat',
        }}
      >
        <div className="hero-bg" role="img" aria-label={imageAlt} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-14 md:pt-16 pb-12 text-center text-white">
          <h6 className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[11px] font-medium uppercase tracking-wider mb-4">
            <span className="h-2 w-2 rounded-full" style={{ background: '#FFD23F' }} aria-hidden="true" />
            {tHero('badge', { city })}
          </h6>
          <h1 className="font-bold mx-auto" style={{ fontSize: 'clamp(1.75rem, 4.4vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {tHero('headline', { city })}{' '}
            <span style={{ color: '#FFD23F' }}>{tHero('headlineHighlight', { city })}</span>
          </h1>
          <h2 className="mt-4 text-sm md:text-base text-white/80 max-w-xl mx-auto font-normal" style={{ lineHeight: 1.6 }}>
            {tHero('subheadline', { city })}
          </h2>
          <div className="mt-6 flex flex-col items-center gap-3">
            <WhatsAppClickTracker phoneNumber={phone} href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: '#25D366' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
              </svg>
              {tHero('cta', { city })}
            </WhatsAppClickTracker>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {tHero('ctaSubtext', { city }).split(' · ').map((part, i) => (
                <span key={i} className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70">
                  {part}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LocationPageClient
        locale={locale}
        locationSlug={location}
        cityName={city}
        phoneNumber={phone}
        nearby={nearby}
      />

      <SiteFooter locale={locale} />
    </>
  )
}
