import Link from 'next/link'
import { Button, BrandLogo, Eyebrow, WhatsAppIcon } from '@/components/PageShell'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { STATES_ORDER, STATES_DISPLAY } from '@/config/locations'
import { siteConfig, type Locale } from '@/config/site'

interface Labels {
  tagline: string
  legal: string
  col1Eyebrow: string
  col1Heading: string
  col1Link1: string
  col1Link2: string
  col1Link3: string
  col1Link4: string
  col2Eyebrow: string
  col2Heading: string
  col3Eyebrow: string
  col3Heading: string
  col3Link: string
  col4Eyebrow: string
  col4Heading: string
  col4Cta: string
}

interface Props {
  locale: Locale
  labels: Labels
  waHref: string
  phone: string
}

export default function SiteFooter({ locale, labels, waHref, phone }: Props) {
  return (
    <>
      {/* Saffron strip — single horizontal invitation above footer */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-white hover:brightness-[1.06] [background-image:var(--grad-saffron)]"
        style={{ transition: 'filter 180ms ease' }}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-2.5 px-6 text-[13px] font-bold uppercase tracking-[0.16em] sm:text-[14px]">
          <WhatsAppIcon size={18} className="text-white" />
          <span>{labels.col4Cta}</span>
        </div>
      </a>

      <footer id="contact" className="bg-[var(--forest-deep)] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-4">
          {/* Column 1 — Brand + Pakej links */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1.5">
                <BrandLogo width={36} className="w-[36px]" />
              </span>
              <span className="text-[16px] font-extrabold tracking-tight text-white">
                {siteConfig.brandName}
              </span>
            </div>
            <p className="text-[14px] leading-[1.7] text-white/70">
              {labels.tagline}
            </p>
            <div className="mt-2 flex flex-col gap-2">
              <Eyebrow variant="light">{labels.col1Eyebrow}</Eyebrow>
              <h6 className="text-[15px] font-bold text-[var(--honey-bright)]">{labels.col1Heading}</h6>
              <ul className="flex flex-col gap-1 text-[14px] text-white/75">
                <li>
                  <a href={`/${locale}#pakej`} className="hover:text-[var(--honey-bright)]">
                    {labels.col1Link1}
                  </a>
                </li>
                <li>
                  <a href={`/${locale}#pakej`} className="hover:text-[var(--honey-bright)]">
                    {labels.col1Link2}
                  </a>
                </li>
                <li>
                  <a href={`/${locale}#pakej`} className="hover:text-[var(--honey-bright)]">
                    {labels.col1Link3}
                  </a>
                </li>
                <li>
                  <a href={`/${locale}#pakej`} className="hover:text-[var(--honey-bright)]">
                    {labels.col1Link4}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2 — Locations */}
          <div className="flex flex-col gap-3">
            <Eyebrow variant="light">{labels.col2Eyebrow}</Eyebrow>
            <h6 className="text-[15px] font-bold text-[var(--honey-bright)]">{labels.col2Heading}</h6>
            <ul className="flex flex-col gap-1 text-[13px] text-white/75">
              {STATES_ORDER.map((state) => (
                <li key={state}>
                  <a href={`/${locale}#locations`} className="hover:text-[var(--honey-bright)]">
                    {STATES_DISPLAY[state]?.[locale] ?? state}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Blog */}
          <div className="flex flex-col gap-3">
            <Eyebrow variant="light">{labels.col3Eyebrow}</Eyebrow>
            <h6 className="text-[15px] font-bold text-[var(--honey-bright)]">{labels.col3Heading}</h6>
            <Link
              href={`/${locale}/blog`}
              className="text-[14px] font-semibold text-[var(--honey-bright)] hover:text-white"
              style={{ transition: 'color 180ms ease' }}
            >
              {labels.col3Link} →
            </Link>
          </div>

          {/* Column 4 — Contact */}
          <div className="flex flex-col gap-3">
            <Eyebrow variant="light">{labels.col4Eyebrow}</Eyebrow>
            <h6 className="text-[15px] font-bold text-[var(--honey-bright)]">{labels.col4Heading}</h6>
            <WhatsAppClickTracker phone={phone}>
              <Button
                href={waHref}
                variant="whatsapp"
                size="default"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={18} />
                {labels.col4Cta}
              </Button>
            </WhatsAppClickTracker>
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="bg-[#0A2A1D] py-4 text-white/65">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-center text-[12px] md:flex-row md:text-left">
            <p>{labels.legal}</p>
            <p className="text-[var(--honey-soft)]/80">{siteConfig.heritageLine}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
