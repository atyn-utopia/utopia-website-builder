import Image from 'next/image'
import { Button, WhatsAppIcon } from '@/components/PageShell'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'

interface Props {
  eyebrow: string
  h1: string
  h2: string
  lede: string
  primaryCta: string
  secondaryCta: string
  waHref: string
  phone: string
  breadcrumb?: React.ReactNode
}

// Inline icon list — small chip row at the bottom of the hero (4 USP chips, ref-style)
const HERO_CHIPS = [
  { label: 'Halal Certified', svg: 'M9 12.75 11.25 15 15 9.75' },
  { label: 'Pakar Sejak 1998', svg: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z' },
  { label: 'On-Time Setup', svg: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  { label: 'Sedap Dijamin', svg: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z' },
]

export default function Hero({
  eyebrow,
  h1,
  h2,
  lede,
  primaryCta,
  secondaryCta,
  waHref,
  phone,
  breadcrumb,
}: Props) {
  return (
    <section className="hero-plate relative overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-10 md:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {breadcrumb ? (
            <div className="mb-4 self-center text-[13px] text-white/60 md:self-start">
              {breadcrumb}
            </div>
          ) : null}

          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--honey-bright)] ring-1 ring-white/15 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--honey)]" />
            {eyebrow}
          </p>

          <h1
            className="max-w-[20ch] text-balance font-extrabold leading-[1.04] tracking-[-0.035em] text-[var(--honey-bright)]"
            style={{ fontSize: 'clamp(34px, 5.8vw, 60px)' }}
          >
            {h1}
          </h1>

          <h2
            className="mt-5 max-w-[44ch] font-medium leading-[1.5] tracking-[-0.005em] text-white/85"
            style={{ fontSize: 'clamp(15px, 1.6vw, 18px)' }}
          >
            {h2}
          </h2>

          <p className="mt-4 max-w-[54ch] text-[14px] leading-[1.7] text-white/75 md:text-[15px]">
            {lede}
          </p>

          {/* USP chip row */}
          <ul className="mt-8 grid w-full max-w-md grid-cols-2 gap-x-5 gap-y-3 md:flex md:max-w-none md:flex-wrap md:items-center md:gap-x-6 md:gap-y-3">
            {HERO_CHIPS.map((c) => (
              <li
                key={c.label}
                className="inline-flex items-center justify-start gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/90"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--honey)] text-[var(--forest-deep)]">
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={c.svg} />
                  </svg>
                </span>
                <span className="whitespace-nowrap">{c.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <WhatsAppClickTracker phone={phone}>
              <Button
                href={waHref}
                variant="whatsapp"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
              >
                <WhatsAppIcon size={18} />
                {primaryCta}
              </Button>
            </WhatsAppClickTracker>
            <Button href="#pakej" variant="ghost-light" size="lg" fullWidth>
              {secondaryCta}
            </Button>
          </div>
        </div>

        {/* Right column — chef cutout floating against green bg (no card frame) */}
        <div className="relative mx-auto w-full max-w-md md:mx-0 md:max-w-none">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px]">
            {/* Halo behind chef */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(244,193,21,0.22) 0%, rgba(244,193,21,0) 65%)',
              }}
            />
            <Image
              src="/photos/hero-chef.jpg"
              alt="Pakar katering AuntyRokiah menyiapkan dulang nasi minyak untuk majlis kenduri"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 420px"
              className="rounded-full object-cover ring-4 ring-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)]"
            />
          </div>
          {/* Floating rating badge */}
          <div className="absolute -bottom-2 left-2 hidden flex-col items-start gap-1 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_36px_-12px_rgba(0,0,0,0.4)] sm:flex md:-bottom-4 md:left-0">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="#FBBC04"
                  aria-hidden="true"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ink)]">
              4.9 · 5,000 Majlis
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
