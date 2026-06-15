// Shared footer used by homepage, location pages, blog listing, blog post.
// Pulled out of PageShell so every public page renders the same chrome.
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { KKMark } from '@/components/Ornaments'
import { siteConfig, type Locale } from '@/config/site'
import { TOP_FOOTER_LOCATIONS, findLocation } from '@/config/locations'
import { waRedirect } from '@/lib/waRedirect'

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tFoot = await getTranslations({ locale, namespace: 'footer' })
  const tShared = await getTranslations({ locale, namespace: 'shared' })
  const waDefault = waRedirect(locale, tShared('whatsappMessageDefault'))

  return (
    <footer id="contact" className="relative bg-[#0A0A0A] text-[#FFFEF8]">
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#FDD835] to-transparent opacity-70" />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 text-center md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="flex items-center justify-center gap-2.5">
              <KKMark className="h-10 w-10" />
              <span className="text-lg font-extrabold tracking-tight">Kak Kenduri</span>
            </p>
            <p className="mt-4 text-[15px] leading-[1.7] text-[#FFFEF8]/70">
              {tFoot('tagline')}
            </p>
          </div>
          <div>
            <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
              {tFoot('contact')}
            </h6>
            <ul className="mt-5 space-y-3 text-[15px] leading-[1.7] text-[#FFFEF8]/80">
              <li>{tFoot('address')}</li>
              <li>{tFoot('hours')}</li>
            </ul>
          </div>
          <div>
            <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
              {tFoot('topLocations')}
            </h6>
            <ul className="mt-5 space-y-3 text-[15px] leading-[1.7]">
              {TOP_FOOTER_LOCATIONS.map((sl) => {
                const l = findLocation(sl)
                if (!l) return null
                return (
                  <li key={sl}>
                    <Link
                      href={`/${locale}/${siteConfig.productSlug}/${sl}`}
                      className="py-1 text-[#FFFEF8]/80 hover:text-[#FDD835]"
                      style={{ transition: 'color 160ms ease' }}
                    >
                      {l.display[locale]}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
              {tFoot('getInTouch')}
            </h6>
            <p className="mt-5 text-[15px] leading-[1.7] text-[#FFFEF8]/70">
              {tFoot('getInTouchSub')}
            </p>
            <div className="mt-4 flex justify-center">
              <a
                href={waDefault}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn inline-flex items-center justify-center gap-2 bg-[#25D366] text-[15px] font-semibold text-white hover:bg-[#1EB85A]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
                </svg>
                {tNav('whatsapp')}
              </a>
            </div>
            <div className="mt-5 flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 border-t border-[#FFFEF8]/15 pt-6 text-center text-xs text-[#FFFEF8]/60 sm:flex-row sm:gap-4">
          <p>{tFoot('legal', { year: String(new Date().getFullYear()) })}</p>
          <a
            className="utopia-credit"
            href="https://utopiagroup.com.my"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Built by Utopia AI"
          >
            <span className="utopia-credit-by">Built by</span>
            <span className="utopia-credit-word">Utopia</span>
            <svg className="utopia-tri" viewBox="0 0 64 56" width="11" height="10" aria-hidden="true">
              <defs>
                <linearGradient id="kkUtopiaCreditGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0054A6" />
                  <stop offset="60%" stopColor="#2774AE" />
                  <stop offset="100%" stopColor="#4A9DD0" />
                </linearGradient>
              </defs>
              <polygon points="32,4 60,52 4,52" fill="url(#kkUtopiaCreditGrad)" />
            </svg>
            <span className="utopia-credit-word">AI</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
