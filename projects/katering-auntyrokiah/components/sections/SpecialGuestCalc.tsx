import Image from 'next/image'
import { Button, Eyebrow, WhatsAppIcon } from '@/components/PageShell'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'

interface TierLabels {
  label: string
  title: string
  pakej: string
  rationale: string
  cta: string
}

interface Props {
  eyebrow: string
  heading: string
  intro: string
  estimateLabel: string
  tiers: TierLabels[]
  tierPricesPerPax: number[]
  tierGuestEstimates: number[]
  locale: string
  phone: string
  slug?: string
  citySuffix?: string
}

// "Dark green credibility band" — matches the cateringservice.my reference: forest-deep bg,
// LEFT half = lifestyle photo, RIGHT half = white H3 + 4 yellow-check bullets + WhatsApp CTA.
// Pulls a curated bullet list out of the tier labels so existing translations still drive copy.
export default function SpecialGuestCalc({
  eyebrow,
  heading,
  intro,
  tiers,
  locale: _locale,
  phone,
  slug: _slug,
}: Props) {
  // Build 4 trust bullets from the first 4 tier titles (existing translations).
  const bullets = tiers.slice(0, 4).map((t) => t.title)

  const waHref = `/${_locale}/redirect-whatsapp-1${_slug ? `?loc=${_slug}` : ''}`

  return (
    <section className="relative overflow-hidden bg-[var(--forest-deep)] py-16 md:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 95% 50%, rgba(244,193,21,0.10) 0%, transparent 55%)',
        }}
      />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-[1fr_1.15fr]">
        {/* LEFT — lifestyle photo */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl ring-2 ring-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5)]">
          <Image
            src="/photos/gallery-1.jpg"
            alt="Hidangan kenduri kahwin AuntyRokiah — pelamin dan dulang nasi minyak"
            fill
            sizes="(max-width: 768px) 90vw, 460px"
            className="object-cover"
          />
        </div>

        {/* RIGHT — copy + bullets + CTA */}
        <div className="flex flex-col gap-5 text-white">
          <Eyebrow variant="light">{eyebrow}</Eyebrow>
          <h3 className="text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
            {heading}
          </h3>
          <p className="text-[15px] leading-[1.7] text-white/80 md:text-[16px]">{intro}</p>

          <ul className="mt-3 flex flex-col gap-3">
            {bullets.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[15px] leading-[1.55] text-white/90"
              >
                <span className="mt-[2px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--honey)] text-[var(--forest-deep)]">
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 w-full sm:w-auto">
            <WhatsAppClickTracker phone={phone}>
              <Button
                href={waHref}
                variant="whatsapp"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={18} />
                {tiers[0]?.cta ?? 'WhatsApp Kami'}
              </Button>
            </WhatsAppClickTracker>
          </div>
        </div>
      </div>
    </section>
  )
}
