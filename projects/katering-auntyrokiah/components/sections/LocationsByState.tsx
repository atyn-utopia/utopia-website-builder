import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { SectionHead, Eyebrow } from '@/components/PageShell'
import {
  STATES_ORDER,
  STATES_DISPLAY,
  LOCATIONS,
  getNearbyLocations,
} from '@/config/locations'
import { siteConfig, type Locale } from '@/config/site'

interface Props {
  locale: Locale
  eyebrow: string
  heading: string
  intro: string
  stateIntro: Record<string, string>
  viewAllLabel: string
  currentSlug?: string
  nearbyHeading?: string
  nearbySub?: string
}

export default function LocationsByState({
  locale,
  eyebrow,
  heading,
  intro,
  viewAllLabel,
  currentSlug,
  nearbyHeading,
  nearbySub,
}: Props) {
  const nearby = currentSlug ? getNearbyLocations(currentSlug) : []
  return (
    <section id="locations" className="bg-[var(--cream)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex justify-center text-center">
          <SectionHead eyebrow={eyebrow} heading={heading} intro={intro} align="center" />
        </div>

        {currentSlug && nearby.length > 0 ? (
          <div className="mx-auto mb-10 max-w-3xl rounded-2xl border border-[var(--hairline)] bg-white p-6 shadow-[0_10px_30px_-22px_var(--shadow-tint)]">
            <Eyebrow className="mb-2">{nearbyHeading ?? 'Nearby'}</Eyebrow>
            <p className="mb-4 text-[14px] text-[var(--ink-soft)]">{nearbySub}</p>
            <ul className="flex flex-wrap gap-2">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/${locale}/${siteConfig.productSlug}/${n.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-white px-3 py-1 text-[13px] text-[var(--ink)] hover:border-[var(--forest)] hover:bg-[var(--forest)] hover:text-white"
                    style={{ transition: 'background-color 180ms ease, color 180ms ease, border-color 180ms ease' }}
                  >
                    <MapPin size={12} />
                    {n.display[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
          {STATES_ORDER.map((state) => {
            const rows = LOCATIONS.filter((l) => l.state === state)
            if (rows.length === 0) return null
            const stateName = STATES_DISPLAY[state]?.[locale] ?? state
            return (
              <div key={state} className="flex flex-col gap-3">
                <h4 className="text-[15px] font-extrabold tracking-[-0.01em] text-[var(--forest-deep)]">
                  {stateName}
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {rows.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/${locale}/${siteConfig.productSlug}/${l.slug}`}
                        className="text-[13.5px] leading-[1.6] text-[var(--ink-soft)] hover:text-[var(--honey-dark)] hover:underline underline-offset-4"
                        style={{ transition: 'color 180ms ease' }}
                      >
                        {l.display[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <p className="mt-10 text-center text-[14px] font-semibold text-[var(--honey-dark)]">
          {viewAllLabel}
        </p>
      </div>
    </section>
  )
}
