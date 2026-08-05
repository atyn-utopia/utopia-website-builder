'use client'

// Flat minimal footer — the fleet default (reference: water-tank-malaysia).
// Logo + horizontal nav, divider, then copyright + the "Built by Utopia AI"
// brand-CI credit.
//
// Replaces the previous 4-column dark footer (brand + tagline + its own
// WhatsApp CTA / Services / Product Types / Areas, with a LanguageSwitcher in
// the bottom bar). The default layout drops the footer CTA and the footer
// language switcher — SiteHeader already carries both — and drops the column
// <h4>s that competed with the page heading hierarchy.
//
// Palette stays Encik Roller Shutter's own gunmetal + yellow; the logo lockup
// is white-on-dark, so this footer keeps the brand's dark surface. The CI is a
// structural element only, not a reskin.

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function SiteFooter() {
  const locale = useLocale()
  const navT = useTranslations('nav')
  const footT = useTranslations('footer')

  const linkClass =
    'text-[14.5px] font-semibold text-white/80 transition-colors hover:text-[var(--brand-yellow)]'

  return (
    <footer style={{ background: 'var(--brand-gunmetal)' }} className="px-6 py-11">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand-assets/logo-roller-shutter.png"
            alt={navT('logoAlt')}
            style={{ width: 176, height: 'auto' }}
            className="block"
          />

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3" aria-label="Footer">
            <Link href={`/${locale}`} className={linkClass}>{navT('home')}</Link>
            <a href={`/${locale}#products`} className={linkClass}>{navT('products')}</a>
            <a href={`/${locale}#how-it-works`} className={linkClass}>{navT('howItWorks')}</a>
            <a href={`/${locale}#locations`} className={linkClass}>{navT('locations')}</a>
            <Link href={`/${locale}/blog`} className={linkClass}>{navT('blog')}</Link>
            <a href={`/${locale}#faq`} className={linkClass}>{navT('faq')}</a>
          </nav>
        </div>

        <div className="mt-7 h-px w-full bg-white/15" aria-hidden="true" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <h6
            className="m-0 text-xs font-normal"
            style={{ color: 'var(--brand-steel-light)' }}
          >
            {footT('copyright')}
          </h6>
          <a
            className="utopia-credit"
            style={{ color: 'var(--brand-steel-light)' }}
            href="https://utopiagroup.com.my"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Built by</span>
            <span className="utopia-credit__word">Utopia</span>
            <svg className="utopia-credit__mark" width="14" height="12" viewBox="0 0 64 56" aria-hidden="true">
              <defs>
                <linearGradient id="utopiaCreditGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0054A6" />
                  <stop offset="50%" stopColor="#2774AE" />
                  <stop offset="100%" stopColor="#4A9DD0" />
                </linearGradient>
              </defs>
              <polygon points="32,4 60,52 4,52" fill="url(#utopiaCreditGrad)" />
            </svg>
            <span className="utopia-credit__word">AI</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
