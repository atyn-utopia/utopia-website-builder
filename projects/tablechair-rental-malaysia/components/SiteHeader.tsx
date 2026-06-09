// Shared header used by homepage, location pages, blog listing, blog post.
// Pulled out of PageShell so every public page renders the same nav island.
// The WhatsApp CTA carries `nav-cta` so globals.css can hide it on mobile.
// A small client-side `<NavCtaGlobalStyle />` adds a styled-jsx :global(.nav-cta)
// rule for sizing parity across components that re-render the class.
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NavCtaGlobalStyle from '@/components/NavCtaGlobalStyle'
import { KKMark } from '@/components/Ornaments'
import { waRedirect } from '@/lib/waRedirect'
import type { Locale } from '@/config/site'

export default async function SiteHeader({ locale }: { locale: Locale }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tShared = await getTranslations({ locale, namespace: 'shared' })
  const waDefault = waRedirect(locale, tShared('whatsappMessageDefault'))

  return (
    <header className="relative z-40 flex justify-center bg-transparent px-4 pb-4 pt-5 sm:pt-6">
      <NavCtaGlobalStyle />
      <div className="flex w-full max-w-5xl items-center justify-between gap-3 rounded-full bg-white py-2 pl-3 pr-2 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)] ring-1 ring-black/5 sm:gap-5 sm:pl-5 sm:pr-3">
        <Link
          href={`/${locale}`}
          aria-label={tNav('logoAlt')}
          className="flex shrink-0 items-center gap-2"
        >
          <KKMark className="h-9 w-9" />
          <span className="text-[16px] font-extrabold tracking-tight text-[#111111] sm:text-[17px]">
            Kak Kenduri
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href={`/${locale}`}
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('home')}
          </Link>
          <a
            href={`/${locale}#services`}
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('products')}
          </a>
          <a
            href={`/${locale}#service-area`}
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('locations')}
          </a>
          <a
            href={`/${locale}#gallery`}
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('gallery')}
          </a>
          <Link
            href={`/${locale}/blog`}
            className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
            style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
          >
            {tNav('blog')}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <a
            href={waDefault}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta hidden shrink-0 items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-1.5 text-[13px] font-bold text-white hover:bg-[#1EB85A] lg:inline-flex"
            style={{ transition: 'background-color 180ms ease' }}
          >
            {tNav('whatsappCta')}
          </a>
        </div>
      </div>
    </header>
  )
}
