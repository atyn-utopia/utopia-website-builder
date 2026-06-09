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
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="flex items-center gap-2.5">
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
            <div className="mt-4">
              <a
                href={waDefault}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.55)] hover:bg-[#1EB85A]"
                style={{ transition: 'background-color 200ms ease' }}
              >
                {tNav('whatsapp')}
              </a>
            </div>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#FFFEF8]/15 pt-6 text-xs text-[#FFFEF8]/60 md:flex-row">
          <p>{tFoot('legal', { year: String(new Date().getFullYear()) })}</p>
        </div>
      </div>
    </footer>
  )
}
