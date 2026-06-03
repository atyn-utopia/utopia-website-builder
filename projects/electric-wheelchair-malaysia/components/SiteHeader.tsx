// Shared header used by homepage, location pages, blog listing, blog post.
// The WhatsApp CTA carries `nav-cta` so globals.css can hide it on mobile
// AND a styled-jsx :global(.nav-cta) shim (NavCtaGlobalStyle) keeps the
// sizing intact when other components render an element with that class.
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
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
        background: 'rgba(27,45,91,0.96)',
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
          {/* Logo icon = the favicon (/icon.svg, served from app/icon.svg by Next.js)
              so the header logo and favicon always match. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt={tNav('logoAlt')} className="w-8 h-8" />
          <span className="hidden sm:inline font-extrabold text-base text-white tracking-tight whitespace-nowrap">
            {tNav('brandName')}
          </span>
        </Link>

        <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 text-sm font-semibold text-white/85">
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
            {/* Always-visible WhatsApp glyph + label that hides on tight viewports. */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M20.52 3.48A11.86 11.86 0 0012.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 005.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 01-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 01-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 012.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
            </svg>
            <span className="hidden md:inline">{tNav('whatsappCta')}</span>
          </a>
        </div>
      </div>
    </header>
  )
}
