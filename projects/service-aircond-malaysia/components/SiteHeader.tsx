// Shared header used by homepage, location pages, blog listing, blog post.
// The WhatsApp CTA carries `nav-cta` so globals.css can hide it on mobile
// AND a styled-jsx :global(.nav-cta) shim (NavCtaGlobalStyle) keeps the
// sizing intact when other components render an element with that class.
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NavCtaGlobalStyle from '@/components/NavCtaGlobalStyle'
import type { Locale } from '@/i18n/routing'

function waRedirect(locale: string) {
  return `/${locale}/redirect-whatsapp-1`
}

export default async function SiteHeader({ locale }: { locale: Locale }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const waHref = waRedirect(locale)

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(27,58,92,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <NavCtaGlobalStyle />
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 shrink-0"
          aria-label={tNav('logoAlt')}
        >
          {/* Logo icon = the favicon, so the two always match. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="" className="w-8 h-8" aria-hidden="true" />
          <span className="font-extrabold text-lg text-white tracking-tight">Encik Beku</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-white/85">
          <Link href={`/${locale}`} className="hover:text-white">{tNav('home')}</Link>
          <a href={`/${locale}#services`} className="hover:text-white">{tNav('products')}</a>
          <a href={`/${locale}#locations`} className="hover:text-white">{tNav('locations')}</a>
          <a href={`/${locale}#reviews`} className="hover:text-white">{tNav('reviews')}</a>
          <Link href={`/${locale}/blog`} className="hover:text-white">{tNav('blog')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta wa-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: '#25D366' }}
          >
            <span className="hidden sm:inline">{tNav('whatsappCta')}</span>
          </a>
        </div>
      </div>
    </header>
  )
}
