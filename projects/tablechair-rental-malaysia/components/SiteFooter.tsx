// Flat minimal footer — the fleet default (reference: water-tank-malaysia).
// Wordmark + horizontal nav, divider, then copyright + the "Built by Utopia AI"
// brand-CI credit. No card container, no social buttons, no footer CTA, and no
// language switcher (SiteHeader already carries it).
//
// Replaces the previous 4-column dark footer (brand blurb / address + hours /
// top locations / "Get in Touch" card with its own WhatsApp CTA).
//
// Palette stays Kak Kenduri's own black + yellow — the CI is a structural
// element only, not a reskin. Keeps id="contact" so existing #contact anchors
// still land here.
// Uses existing nav.* / footer.* keys, so no new translation keys are needed.
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { KKMark } from '@/components/Ornaments'
import { type Locale } from '@/config/site'

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tFoot = await getTranslations({ locale, namespace: 'footer' })

  return (
    <footer id="contact" className="relative bg-[#0A0A0A] text-[#FFFEF8]">
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#FDD835] to-transparent opacity-70" />
      <div className="mx-auto max-w-6xl px-4 py-11 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:gap-8">
          <p className="flex items-center gap-2.5">
            <KKMark className="h-9 w-9" />
            <span className="text-lg font-extrabold tracking-tight">Kak Kenduri</span>
          </p>

          <nav
            className="flex flex-wrap justify-center gap-x-7 gap-y-3"
            aria-label="Footer"
          >
            <Link href={`/${locale}`} className="footer-nav-link">{tNav('home')}</Link>
            <a href={`/${locale}#services`} className="footer-nav-link">{tNav('services')}</a>
            <a href={`/${locale}#gallery`} className="footer-nav-link">{tNav('gallery')}</a>
            <a href={`/${locale}#locations`} className="footer-nav-link">{tNav('locations')}</a>
            <Link href={`/${locale}/blog`} className="footer-nav-link">{tNav('blog')}</Link>
          </nav>
        </div>

        <div className="mt-7 h-px w-full bg-[#FFFEF8]/15" aria-hidden="true" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <h6 className="m-0 text-xs font-normal text-[#FFFEF8]/60">
            {tFoot('legal', { year: String(new Date().getFullYear()) })}
          </h6>
          <a
            className="utopia-credit text-[#FFFEF8]/70"
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

      <style>{`
        .footer-nav-link {
          color: rgba(255, 254, 248, 0.8);
          font-weight: 600;
          font-size: 14.5px;
          text-decoration: none;
          transition: color var(--dur-hover) var(--ease);
        }
        .footer-nav-link:hover { color: #FDD835; }
      `}</style>
    </footer>
  )
}
