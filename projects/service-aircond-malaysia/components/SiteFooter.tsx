// Flat minimal footer — the fleet default (reference: water-tank-malaysia).
// Logo + horizontal nav, divider, then copyright + the "Built by Utopia AI"
// brand-CI credit.
//
// Replaces the previous 4-column dark footer (brand + blurb + its own WhatsApp
// CTA / Locations / Quick links, with a LanguageSwitcher tucked in a column).
// The default layout drops the footer CTA and the footer language switcher —
// SiteHeader already carries both.
//
// Palette stays Encik Beku's own navy + yellow; the CI is a structural element
// only, not a reskin. Uses existing nav.* / footer.* keys.
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tFoot = await getTranslations({ locale, namespace: 'footer' })
  const year = new Date().getFullYear()

  const linkClass =
    'text-[14.5px] font-semibold text-white/80 transition-colors hover:text-[#FFE500]'

  return (
    <footer className="px-6 py-11" style={{ background: '#0F2238' }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:gap-8">
          <p className="flex items-center gap-2.5">
            {/* Logo icon = the favicon, so the two always match. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt={tNav('logoAlt')} className="h-9 w-9" />
            <span className="text-lg font-extrabold tracking-tight text-white">Encik Beku</span>
          </p>

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3" aria-label="Footer">
            <Link href={`/${locale}`} className={linkClass}>{tNav('home')}</Link>
            <a href={`/${locale}#services`} className={linkClass}>{tNav('services')}</a>
            <a href={`/${locale}#locations`} className={linkClass}>{tNav('locations')}</a>
            <a href={`/${locale}#reviews`} className={linkClass}>{tNav('reviews')}</a>
            <Link href={`/${locale}/blog`} className={linkClass}>{tNav('blog')}</Link>
          </nav>
        </div>

        <div className="mt-7 h-px w-full bg-white/10" aria-hidden="true" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <h6 className="m-0 text-xs font-normal text-white/55">
            {tFoot('copyright', { year })}
          </h6>
          {/* Colour set inline, not with a Tailwind class: the shared
              .utopia-credit rule in globals.css is unlayered and outranks
              @layer utilities, so a text-* class here silently lost. */}
          <a
            className="utopia-credit"
            style={{ color: 'rgba(255,255,255,0.82)' }}
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
