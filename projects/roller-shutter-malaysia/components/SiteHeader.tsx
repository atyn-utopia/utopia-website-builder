'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { waRedirect } from '@/lib/waRedirect'

function WaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export default function SiteHeader() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const waHref = waRedirect(locale)

  const onWaClick = (label: string) => () => {
    if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
      window.uwc('click', { label: `whatsapp-${label}` })
    }
  }

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href={`/${locale}`} className="site-header-brand site-header-brand--text" aria-label={t('brandName')}>
          <span className="site-header-brand-text">{t('brandName')}</span>
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          <Link href={`/${locale}`}>{t('home')}</Link>
          <Link href={`/${locale}#products`}>{t('products')}</Link>
          <Link href={`/${locale}#how-it-works`}>{t('howItWorks')}</Link>
          <Link href={`/${locale}#locations`}>{t('locations')}</Link>
          <Link href={`/${locale}/blog`}>{t('blog')}</Link>
        </nav>

        <button
          type="button"
          className="site-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-nav-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="site-actions">
          <div className="site-actions__lang"><LanguageSwitcher /></div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa nav-cta wa-btn"
            onClick={onWaClick('nav')}
          >
            <WaIcon size={16} />
            <span className="nav-cta-label">{t('whatsappCta')}</span>
          </a>
        </div>
      </div>

      <div id="site-nav-mobile" className={`site-mobile-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="site-mobile-nav" aria-label="Mobile primary">
          <Link href={`/${locale}`} onClick={close}>{t('home')}</Link>
          <Link href={`/${locale}#products`} onClick={close}>{t('products')}</Link>
          <Link href={`/${locale}#how-it-works`} onClick={close}>{t('howItWorks')}</Link>
          <Link href={`/${locale}#locations`} onClick={close}>{t('locations')}</Link>
          <Link href={`/${locale}/blog`} onClick={close}>{t('blog')}</Link>
        </nav>
        <div className="site-mobile-actions">
          <LanguageSwitcher />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa wa-btn"
            onClick={() => { close(); onWaClick('nav-mobile')() }}
          >
            <WaIcon size={16} />
            {t('whatsappCta')}
          </a>
        </div>
      </div>
    </header>
  )
}
