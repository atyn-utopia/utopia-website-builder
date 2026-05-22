import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { BrandLogo, WhatsAppIcon } from '@/components/PageShell'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import { siteConfig } from '@/config/site'

interface Props {
  locale: string
  labels: {
    logoAria: string
    pakej: string
    locations: string
    blog: string
    contact: string
    whatsapp: string
  }
  waHref: string
  phone: string
}

export default function SiteNav({ locale, labels, waHref, phone }: Props) {
  return (
    <header className="relative z-40 w-full border-b border-[var(--hairline-soft)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href={`/${locale}`}
          aria-label={labels.logoAria}
          className="flex shrink-0 items-center gap-2.5"
        >
          <BrandLogo width={44} className="w-[40px] sm:w-[44px]" />
          <span className="hidden text-[15px] font-extrabold tracking-tight text-[var(--ink)] sm:inline sm:text-[16px]">
            {siteConfig.brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <a
            href="#pakej"
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[var(--ink-soft)] hover:bg-[var(--saffron-soft)] hover:text-[var(--saffron-dark)]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {labels.pakej}
          </a>
          <a
            href="#locations"
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[var(--ink-soft)] hover:bg-[var(--saffron-soft)] hover:text-[var(--saffron-dark)]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {labels.locations}
          </a>
          <Link
            href={`/${locale}/blog`}
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[var(--ink-soft)] hover:bg-[var(--saffron-soft)] hover:text-[var(--saffron-dark)]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {labels.blog}
          </Link>
          <a
            href="#contact"
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[var(--ink-soft)] hover:bg-[var(--saffron-soft)] hover:text-[var(--saffron-dark)]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {labels.contact}
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <WhatsAppClickTracker phone={phone}>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center justify-center gap-1.5 rounded-full bg-[var(--wa-green)] px-4 text-[13px] font-semibold text-white hover:bg-[var(--wa-green-hover)] sm:inline-flex"
              style={{ transition: 'background-color 180ms ease' }}
            >
              <WhatsAppIcon size={16} />
              {labels.whatsapp}
            </a>
          </WhatsAppClickTracker>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
