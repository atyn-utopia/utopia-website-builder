import { Button, SectionHead, Eyebrow } from '@/components/PageShell'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker'
import type { Product } from '@/lib/webcore'
import { waRedirect } from '@/lib/waRedirect'

interface Labels {
  eyebrow: string
  heading: string
  intro: string
  cardCta: string
  bestSellerBadge: string
  addonEyebrow: string
  addonHeading: string
  fallbackJimat: string
  fallbackStandard: string
  fallbackPremium: string
  fallbackAirBalang: string
  priceSuffix: string
}

interface Props {
  labels: Labels
  core: Product[]
  additional: Product[]
  locale: string
  locationSlug?: string
  locationCity?: string
  phone: string
}

function priceOf(p: Product): number | null {
  return p.sale_price ?? p.rental_price ?? null
}

function fallbackFor(slug: string, labels: Labels): string {
  switch (slug) {
    case 'pakej-jimat':
      return labels.fallbackJimat
    case 'pakej-standard':
      return labels.fallbackStandard
    case 'pakej-premium':
      return labels.fallbackPremium
    case 'add-on-air-balang':
      return labels.fallbackAirBalang
    default:
      return ''
  }
}

// Map product slugs to local Pexels images so cards always render.
function localPhotoFor(slug: string): string | null {
  switch (slug) {
    case 'pakej-jimat':
      return '/photos/pakej-jimat.jpg'
    case 'pakej-standard':
      return '/photos/pakej-standard.jpg'
    case 'pakej-premium':
      return '/photos/pakej-premium.jpg'
    case 'add-on-air-balang':
      return '/photos/pakej-airbalang.jpg'
    default:
      return null
  }
}

// Static fallback used when Supabase returns 0 products (local dev / cache miss).
// Keeps the pakej grid visible at all times so the design never collapses.
const STATIC_CORE: Product[] = [
  {
    id: 'static-jimat',
    name: 'Pakej Jimat',
    slug: 'pakej-jimat',
    description: null,
    sale_price: 15,
    rental_price: null,
    sort_order: 1,
    is_active: true,
    parent_id: null,
    photos: [],
    prices: [],
  },
  {
    id: 'static-standard',
    name: 'Pakej Standard',
    slug: 'pakej-standard',
    description: null,
    sale_price: 21,
    rental_price: null,
    sort_order: 2,
    is_active: true,
    parent_id: null,
    photos: [],
    prices: [],
  },
  {
    id: 'static-premium',
    name: 'Pakej Premium',
    slug: 'pakej-premium',
    description: null,
    sale_price: 25,
    rental_price: null,
    sort_order: 3,
    is_active: true,
    parent_id: null,
    photos: [],
    prices: [],
  },
]

const STATIC_ADDON: Product[] = [
  {
    id: 'static-airbalang',
    name: 'Add-on Air Balang',
    slug: 'add-on-air-balang',
    description: null,
    sale_price: 80,
    rental_price: null,
    sort_order: 10,
    is_active: true,
    parent_id: null,
    photos: [],
    prices: [],
  },
]

export default function PakejGrid({
  labels,
  core,
  additional,
  locale,
  locationSlug,
  locationCity,
  phone,
}: Props) {
  const coreList = core.length > 0 ? core : STATIC_CORE
  const addonList = additional.length > 0 ? additional : STATIC_ADDON

  const renderCard = (p: Product, isCore = true) => {
    const price = priceOf(p)
    const description = p.description || fallbackFor(p.slug, labels)
    const image = p.photos[0]?.url || localPhotoFor(p.slug)
    const isBestSeller = isCore && p.sort_order === 1
    const message =
      p.name +
      (locationCity ? ` — ${locationCity}` : '') +
      (isCore ? '' : ' (add-on)')
    const waHref = waRedirect(locale, message, locationSlug)

    // Inclusion bullets per pakej tier (matches ref-style 4-5 line list)
    const inclusions =
      p.slug === 'pakej-jimat'
        ? ['Nasi Putih + 4 Lauk', 'Set Kerusi Meja', 'Hidangan Self-Service', 'Setup & Bersih']
        : p.slug === 'pakej-standard'
          ? ['Nasi Minyak + 6 Lauk', 'Pulut Kuning + Rendang', 'Kerusi Tudung + Meja Bulat', 'Setup, Servis & Bersih']
          : p.slug === 'pakej-premium'
            ? ['Nasi Minyak + 8 Lauk', 'Air Balang & Kuih Muih', 'Pelamin Set Lengkap', 'Cef & Krew Profesional']
            : ['Air Balang Pelbagai Rasa', '20 Liter Per Balang', 'Penghantaran Ke Lokasi', 'Cawan & Penutup Disediakan']

    return (
      <ProductImpressionTracker key={p.id} slug={p.slug}>
        <article
          className="card-product flex h-full flex-col overflow-hidden rounded-2xl hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-20px_var(--shadow-tint)]"
          style={{ transition: 'transform 220ms ease, box-shadow 220ms ease' }}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--cream)]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            ) : null}
            {isBestSeller ? (
              <span
                className="absolute left-0 top-4 inline-flex items-center rounded-r-full bg-[var(--sambal)] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md"
              >
                {labels.bestSellerBadge}
              </span>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6">
            <h4 className="text-[20px] font-extrabold tracking-[-0.025em] text-[var(--forest-deep)]">
              {p.name}
            </h4>
            <ul className="flex flex-col gap-2 text-[13.5px] leading-[1.55] text-[var(--ink-soft)]">
              {inclusions.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-[3px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-white">
                    <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            {p.prices.length > 0 ? (
              <div className="product-prices price-list">
                {p.prices.map((line, i) => (
                  <div className="price-line" key={i}>
                    {line.label}: RM {Number(line.amount).toLocaleString()}
                    {line.unit ? ' / ' + line.unit : ''}
                    {line.note ? <span className="price-note">{line.note}</span> : null}
                  </div>
                ))}
              </div>
            ) : price != null ? (
              <div className="mt-2 inline-flex items-baseline gap-1 self-start rounded-xl bg-[var(--honey)] px-4 py-2 text-[24px] font-extrabold tabular leading-none text-[var(--forest-deep)]">
                RM{price}
                <small className="text-[12px] font-bold text-[var(--forest-deep)]/80">
                  {p.slug === 'add-on-air-balang' ? '/balang' : labels.priceSuffix}
                </small>
              </div>
            ) : null}
            <div className="mt-auto pt-2">
              <WhatsAppClickTracker phone={phone}>
                <Button
                  href={waHref}
                  variant="whatsapp"
                  size="default"
                  fullWidth
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {labels.cardCta}
                </Button>
              </WhatsAppClickTracker>
            </div>
          </div>
        </article>
      </ProductImpressionTracker>
    )
  }

  return (
    <section id="pakej" className="bg-[var(--cream)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex justify-center md:mb-12">
          <SectionHead
            eyebrow={labels.eyebrow}
            heading={labels.heading}
            intro={labels.intro}
            align="center"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {coreList.map((p) => renderCard(p, true))}
        </div>

        {addonList.length > 0 ? (
          <div className="mt-16">
            <div className="mb-8 flex flex-col items-center gap-3">
              <Eyebrow>{labels.addonEyebrow}</Eyebrow>
              <h4 className="text-[22px] font-extrabold tracking-[-0.025em] text-[var(--ink)]">
                {labels.addonHeading}
              </h4>
            </div>
            <div className="mx-auto max-w-md">
              {addonList.map((p) => renderCard(p, false))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
