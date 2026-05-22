'use client'

import { useMemo, useState } from 'react'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'

interface CalculatorStrings {
  eyebrow: string
  heading: string
  intro: string
  lengthLabel: string
  heightLabel: string
  familyLabel: string
  familyStandard: string
  familyMarble: string
  metersUnit: string
  sqftLabel: string
  costLabel: string
  promoPillLabel: string
  freeInstallLabel: string
  ctaLabel: string
  /** Template with literal placeholders {sqft}, {family}, {total} */
  whatsappTemplate: string
}

interface WallPanelCalculatorProps {
  locale: string
  phone: string
  waRedirectBase: string // e.g. `/en/redirect-whatsapp-1`
  locationSlug?: string
  strings: CalculatorStrings
}

export default function WallPanelCalculator({
  phone,
  waRedirectBase,
  locationSlug,
  strings,
}: WallPanelCalculatorProps) {
  const [lengthM, setLengthM] = useState<number>(4)
  const [heightM, setHeightM] = useState<number>(2.7)
  const [family, setFamily] = useState<'standard' | 'marble'>('standard')

  const { sqft, total } = useMemo(() => {
    const safeL = Number.isFinite(lengthM) && lengthM > 0 ? lengthM : 0
    const safeH = Number.isFinite(heightM) && heightM > 0 ? heightM : 0
    const sqftRaw = safeL * safeH * 10.7639
    const ratePerSqft = family === 'marble' ? 38 : 25
    return {
      sqft: Math.max(0, Math.round(sqftRaw)),
      total: Math.max(0, Math.round(sqftRaw * ratePerSqft)),
    }
  }, [lengthM, heightM, family])

  const familyDisplay =
    family === 'marble' ? strings.familyMarble : strings.familyStandard

  const waUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (locationSlug && locationSlug !== 'all') params.set('loc', locationSlug)
    const message = strings.whatsappTemplate
      .replace('[SQFT]', sqft.toLocaleString())
      .replace('[FAMILY]', familyDisplay)
      .replace('[TOTAL]', total.toLocaleString())
    params.set('message', message)
    return `${waRedirectBase}?${params.toString()}`
  }, [
    waRedirectBase,
    locationSlug,
    sqft,
    total,
    familyDisplay,
    strings.whatsappTemplate,
  ])

  return (
    <section className="bg-[#F8F8FA] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:text-left">
          <p className="eyebrow eyebrow-lg">{strings.eyebrow}</p>
          <h3
            className="text-[clamp(28px,4vw,42px)] font-semibold leading-[1.15] tracking-tight text-[#13204C]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {strings.heading}
          </h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[#5A6480]">
            {strings.intro}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ===== Form ===== */}
          <div className="rounded-[22px] border border-[#E5E7EE] bg-white p-7 shadow-[0_4px_10px_rgba(11,21,58,0.04),0_18px_36px_-8px_rgba(11,21,58,0.08)] sm:p-8">
            <div className="space-y-6">
              {/* Length */}
              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.12em] text-[#13204C]">
                  {strings.lengthLabel}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.1}
                    value={lengthM}
                    onChange={(e) => setLengthM(Number(e.target.value))}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[#E5E7EE] accent-[#C8A45C]"
                    aria-label={strings.lengthLabel}
                  />
                  <span className="inline-flex w-24 items-baseline justify-end gap-1 rounded-lg border border-[#E5E7EE] bg-[#F8F8FA] px-3 py-2 text-right">
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={lengthM}
                      onChange={(e) => setLengthM(Number(e.target.value))}
                      className="w-12 bg-transparent text-right text-[15px] font-semibold text-[#13204C] focus:outline-none"
                    />
                    <span className="text-[12px] text-[#5A6480]">
                      {strings.metersUnit}
                    </span>
                  </span>
                </div>
              </label>

              {/* Height */}
              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.12em] text-[#13204C]">
                  {strings.heightLabel}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.5}
                    max={6}
                    step={0.1}
                    value={heightM}
                    onChange={(e) => setHeightM(Number(e.target.value))}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[#E5E7EE] accent-[#C8A45C]"
                    aria-label={strings.heightLabel}
                  />
                  <span className="inline-flex w-24 items-baseline justify-end gap-1 rounded-lg border border-[#E5E7EE] bg-[#F8F8FA] px-3 py-2 text-right">
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={heightM}
                      onChange={(e) => setHeightM(Number(e.target.value))}
                      className="w-12 bg-transparent text-right text-[15px] font-semibold text-[#13204C] focus:outline-none"
                    />
                    <span className="text-[12px] text-[#5A6480]">
                      {strings.metersUnit}
                    </span>
                  </span>
                </div>
              </label>

              {/* Family */}
              <div>
                <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.12em] text-[#13204C]">
                  {strings.familyLabel}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {(['standard', 'marble'] as const).map((opt) => {
                    const active = family === opt
                    const label =
                      opt === 'standard'
                        ? strings.familyStandard
                        : strings.familyMarble
                    const rate = opt === 'standard' ? 'RM25/sqft' : 'RM38/sqft'
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFamily(opt)}
                        className={
                          'rounded-2xl border px-4 py-3 text-left transition-colors duration-200 ' +
                          (active
                            ? 'border-[#13204C] bg-[#13204C] text-white'
                            : 'border-[#E5E7EE] bg-white text-[#13204C] hover:border-[#C8A45C]')
                        }
                      >
                        <span className="block text-[14px] font-semibold leading-tight">
                          {label}
                        </span>
                        <span
                          className={
                            'mt-1 block text-[12px] ' +
                            (active ? 'text-[#C8A45C]' : 'text-[#5A6480]')
                          }
                        >
                          {rate}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ===== Result ===== */}
          <div
            className="relative overflow-hidden rounded-[22px] border border-[#C8A45C]/30 p-7 text-white sm:p-8"
            style={{
              background:
                'linear-gradient(135deg, #0B153A 0%, #13204C 50%, #1F2F66 100%)',
            }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A45C]/50 bg-[#C8A45C]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F3E9D2]"
              style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8A45C]" />
              {strings.promoPillLabel}
            </span>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C8A45C]">
              {strings.sqftLabel}
            </p>
            <p
              className="text-[28px] font-semibold text-white sm:text-[32px]"
              style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              {sqft.toLocaleString()}{' '}
              <span className="text-[14px] font-normal text-white/70">sqft</span>
            </p>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C8A45C]">
              {strings.costLabel}
            </p>
            <p
              className="inline-block text-[40px] font-bold leading-none text-white sm:text-[48px]"
              style={{
                fontFamily: 'var(--font-jakarta), sans-serif',
                borderBottom: '3px solid #C8A45C',
                paddingBottom: '6px',
              }}
            >
              RM{total.toLocaleString()}
            </p>

            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-[#F3E9D2]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="#C8A45C"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {strings.freeInstallLabel}
            </p>

            <div className="mt-7">
              <WhatsAppClickTracker phone={phone}>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-[15px] font-semibold text-white shadow-[0_8px_22px_rgba(37,211,102,0.4)] hover:bg-[#1EBE57] sm:w-auto"
                  style={{ transition: 'background-color 200ms ease' }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
                  </svg>
                  {strings.ctaLabel}
                </a>
              </WhatsAppClickTracker>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
