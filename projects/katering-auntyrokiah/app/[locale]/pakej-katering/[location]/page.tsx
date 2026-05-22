import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import {
  LOCATIONS,
  STATES_DISPLAY,
  findLocation,
  getNearbyLocations,
} from '@/config/locations'
import { siteConfig, type Locale } from '@/config/site'
import { getPhoneNumber, getProducts } from '@/lib/webcore'
import {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  productSchema,
} from '@/lib/schema'
import LocationPageClient from './LocationPageClient'

const SITE_URL = siteConfig.url
const PRODUCT_SLUG = siteConfig.productSlug

type Params = { locale: Locale; location: string }

export async function generateStaticParams() {
  const params: { locale: Locale; location: string }[] = []
  for (const locale of routing.locales) {
    for (const l of LOCATIONS) {
      params.push({ locale: locale as Locale, location: l.slug })
    }
  }
  return params
}

function fmt(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, location } = await params
  const loc = findLocation(location)
  if (!loc) return {}

  const city = loc.display[locale]
  const state = STATES_DISPLAY[loc.state]?.[locale] ?? loc.state

  // Locale-specific meta templates
  const metaTitleTpl: Record<string, string> = {
    ms: 'Pakej Katering {city} · Kenduri Kahwin · AuntyRokiah Katering',
    en: 'Catering Services {city} · Malay Halal · AuntyRokiah Katering',
    zh: '{city} 马来餐饮配套 · 清真宴会 | AuntyRokiah Katering',
  }
  const metaDescTpl: Record<string, string> = {
    ms: 'Pakej katering kenduri kahwin, aqiqah & doa selamat di {city}. Nasi minyak dari RM15/pax. Hantar & hidang dalam {state}. WhatsApp untuk tempah.',
    en: 'Halal Malay wedding, aqiqah & event catering in {city}. Nasi minyak packages from RM15/pax. Delivery & on-site service across {state}. WhatsApp to book.',
    zh: '{city} 马来婚宴、Aqiqah 及活动清真餐饮配套。Nasi minyak 套餐每位 RM15 起,{state} 全区送餐及现场服务。WhatsApp 立即预订。',
  }

  const title = fmt(metaTitleTpl[locale] ?? metaTitleTpl.ms, { city, state })
  const description = fmt(metaDescTpl[locale] ?? metaDescTpl.ms, { city, state })

  const languages: Record<string, string> = {
    'ms-MY': `${SITE_URL}/ms/${PRODUCT_SLUG}/${location}`,
    'en-MY': `${SITE_URL}/en/${PRODUCT_SLUG}/${location}`,
    'zh-Hans-MY': `${SITE_URL}/zh/${PRODUCT_SLUG}/${location}`,
    'x-default': `${SITE_URL}/ms/${PRODUCT_SLUG}/${location}`,
  }
  const canonical = `${SITE_URL}/${locale}/${PRODUCT_SLUG}/${location}`

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: siteConfig.brandName,
      title,
      description,
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocationPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale, location } = await params
  const loc = findLocation(location)
  if (!loc) notFound()
  setRequestLocale(locale)

  const city = loc.display[locale]
  const state = STATES_DISPLAY[loc.state]?.[locale] ?? loc.state
  const nearby = getNearbyLocations(location)
  const nearbyNames = nearby.map((n) => n.display[locale])

  const [{ core, additional }, phoneResult] = await Promise.all([
    getProducts(),
    getPhoneNumber(location),
  ])

  const t = await getTranslations({ locale })

  const pageUrl = `${SITE_URL}/${locale}/${PRODUCT_SLUG}/${location}`
  const breadcrumbItems = [
    { name: t('breadcrumb.home'), item: `${SITE_URL}/${locale}` },
    { name: t('breadcrumb.pakej'), item: `${SITE_URL}/${locale}#pakej` },
    { name: city, item: pageUrl },
  ]

  // Mandatory 3 FAQs from the universal template (Section 3.2 of variants doc)
  const q1Tpl: Record<string, { q: string; a: string }> = {
    ms: {
      q: 'Berapa harga pakej katering kenduri di {city}?',
      a: 'Pakej AuntyRokiah Katering bermula RM15/pax untuk Pakej Jimat, RM21/pax untuk Pakej Standard dan RM25/pax untuk Pakej Premium di {city}. Semua harga sudah termasuk nasi minyak, hidangan utama dan khidmat hidang asas. Air Balang RM80 satu balang untuk 50 tetamu, sebagai tambahan pilihan. Liputan kami menjangkau seluruh {state} termasuk kawasan berdekatan seperti {nearby1}, {nearby2}, {nearby3} dan {nearby4}. WhatsApp kami untuk anggaran lengkap mengikut saiz majlis di {city}.',
    },
    en: {
      q: 'How much does a catering package cost in {city}?',
      a: 'AuntyRokiah Katering packages start at RM15/pax for Pakej Jimat, RM21/pax for Pakej Standard and RM25/pax for Pakej Premium in {city}. Prices include nasi minyak, main dishes and basic on-site service. Add-on Air Balang barrels are RM80 each, serving up to 50 guests. Our coverage extends across {state} including nearby areas like {nearby1}, {nearby2}, {nearby3} and {nearby4}. WhatsApp us for a full estimate tailored to your {city} guest count.',
    },
    zh: {
      q: '{city} 餐饮配套每位收费多少?',
      a: 'AuntyRokiah Katering 在 {city} 配套从 Pakej Jimat 每位 RM15 起、Pakej Standard 每位 RM21、Pakej Premium 每位 RM25。价格已含 nasi minyak、主菜与基本现场服务。Air Balang 大桶饮料 RM80 一桶,可供 50 位。覆盖 {state} 全区,包括周边 {nearby1}、{nearby2}、{nearby3} 与 {nearby4}。WhatsApp 联络获取 {city} 完整报价。',
    },
  }
  const q2Tpl: Record<string, { q: string; a: string }> = {
    ms: {
      q: 'Adakah AuntyRokiah Katering hantar ke {city}?',
      a: 'Ya, kami hantar pakej katering terus ke {city} dan kawasan berdekatan di {state}. Liputan kami merangkumi {nearby1}, {nearby2}, {nearby3} dan {nearby4} — krew kami biasa dengan laluan ini dan tiba awal untuk pemasangan. Caj penghantaran sudah termasuk dalam harga pakej standard di {city}, tertakluk pada saiz majlis dan jarak dari dapur pusat kami.',
    },
    en: {
      q: 'Does AuntyRokiah Katering deliver to {city}?',
      a: 'Yes, we deliver catering packages straight to {city} and nearby areas across {state}. Our coverage includes {nearby1}, {nearby2}, {nearby3} and {nearby4} — our crew knows the routes and arrives early for setup. Delivery is included in the standard package price for {city}, subject to event size and distance from our central kitchen.',
    },
    zh: {
      q: 'AuntyRokiah Katering 配送到 {city} 吗?',
      a: '配送。我们将餐饮配套直送 {city} 与 {state} 周边。覆盖包括 {nearby1}、{nearby2}、{nearby3} 与 {nearby4} — 团队熟悉路线,提前到场布置。{city} 标准配套价格已含送货,视宴会规模与中央厨房距离而定。',
    },
  }
  const q3Tpl: Record<string, { q: string; a: string }> = {
    ms: {
      q: 'Pakej apa sesuai untuk kenduri 200 pax di {city}?',
      a: 'Untuk kenduri 200 tetamu di {city}, kami cadangkan Pakej Standard atau Pakej Premium bergantung pada bajet anda. Pakej Standard RM21/pax memberi nasi minyak, ayam merah, daging hitam, acar timun dan papadom dalam susunan kemas. Pakej Premium RM25/pax menambah buah segar dan kuih untuk pengalaman lebih istimewa. Tambah 4 balang Air Balang untuk 200 pax di {city}.',
    },
    en: {
      q: 'Which package suits a 200-guest kenduri in {city}?',
      a: 'For a 200-guest kenduri in {city}, we recommend Pakej Standard or Pakej Premium depending on budget. Pakej Standard at RM21/pax delivers nasi minyak, ayam merah, daging hitam, acar timun and papadom in a tidy layout. Pakej Premium at RM25/pax adds fresh fruit and kuih for a more memorable spread. Add 4 Air Balang barrels for 200 pax in {city}.',
    },
    zh: {
      q: '{city} 200 人 kenduri 适合哪个配套?',
      a: '{city} 200 人 kenduri,视预算建议 Pakej Standard 或 Pakej Premium。Pakej Standard 每位 RM21,含 nasi minyak、ayam merah、daging hitam、acar timun 与 papadom。Pakej Premium 每位 RM25,加新鲜水果与 kuih。{city} 200 人建议加 4 桶 Air Balang。',
    },
  }

  const tokenVars = {
    city,
    state,
    nearby1: nearbyNames[0] ?? state,
    nearby2: nearbyNames[1] ?? state,
    nearby3: nearbyNames[2] ?? state,
    nearby4: nearbyNames[3] ?? state,
  }

  const renderTpl = (s: string) => fmt(s, tokenVars)

  const locationFaqs = [
    {
      q: renderTpl(q1Tpl[locale]?.q ?? q1Tpl.ms.q),
      a: renderTpl(q1Tpl[locale]?.a ?? q1Tpl.ms.a),
    },
    {
      q: renderTpl(q2Tpl[locale]?.q ?? q2Tpl.ms.q),
      a: renderTpl(q2Tpl[locale]?.a ?? q2Tpl.ms.a),
    },
    {
      q: renderTpl(q3Tpl[locale]?.q ?? q3Tpl.ms.q),
      a: renderTpl(q3Tpl[locale]?.a ?? q3Tpl.ms.a),
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            localBusinessSchema(locale, location, city, state),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema(locationFaqs)),
        }}
      />
      {[...core, ...additional].map((p) => (
        <script
          key={p.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              productSchema(
                locale,
                pageUrl,
                {
                  id: p.slug,
                  name: p.name,
                  description: p.description,
                  image: p.photos[0]?.url,
                  price: (p.sale_price ?? p.rental_price)?.toString() ?? null,
                },
                city,
              ),
            ),
          }}
        />
      ))}

      <LocationPageClient
        locale={locale}
        slug={location}
        city={city}
        state={state}
        coreProducts={core}
        additionalProducts={additional}
        phone={phoneResult.phone}
        locationFaqs={locationFaqs}
      />
    </>
  )
}

