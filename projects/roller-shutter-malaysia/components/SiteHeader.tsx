'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { waRedirect } from '@/lib/waRedirect'

function WAIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
    </svg>
  )
}

function ShutterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="var(--brand-charcoal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="3" y1="14" x2="21" y2="14" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <circle cx="12" cy="20" r="1" fill="var(--brand-charcoal)" stroke="none" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export default function SiteHeader() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const waHref = waRedirect(locale)

  const navItems = [
    { label: t('home'), href: `/${locale}` },
    { label: t('products'), href: `/${locale}#products` },
    { label: t('reviews'), href: `/${locale}#reviews` },
    { label: t('locations'), href: `/${locale}#locations` },
    { label: t('blog'), href: `/${locale}/blog` },
  ]

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'rgba(44,51,56,0.97)', backdropFilter: 'blur(12px)', boxShadow: 'var(--shadow-nav)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <a href={`/${locale}`} className="flex items-center gap-2 shrink-0" aria-label={t('brandName')}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--brand-yellow)' }}
            role="img"
            aria-label={t('logoAlt')}
          >
            <ShutterIcon />
          </div>
          <span className="font-extrabold text-white tracking-tight text-sm sm:text-base">{t('brandName')}</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link focus:outline-none">{item.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta wa-btn hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            onClick={() => {
              if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
                window.uwc('click', { label: 'whatsapp-nav' })
              }
            }}
          >
            <WAIcon size={14} />
            <span>{t('whatsappCta')}</span>
          </a>
          <button
            className="icon-btn md:hidden text-white p-1 cursor-pointer"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60]" style={{ background: 'rgba(28,31,34,0.95)' }}>
          <div className="flex justify-end p-4">
            <button onClick={() => setOpen(false)} className="icon-btn text-white p-2 cursor-pointer" aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-6 pt-8 text-lg font-semibold text-white" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="hover:text-[var(--brand-yellow)]"
              >
                {item.label}
              </a>
            ))}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold text-white mt-4"
              onClick={() => {
                setOpen(false)
                if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
                  window.uwc('click', { label: 'whatsapp-nav-mobile' })
                }
              }}
            >
              <WAIcon size={16} />
              {t('whatsappCta')}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
