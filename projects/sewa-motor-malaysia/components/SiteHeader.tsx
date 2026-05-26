'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={`/${locale}`} className="site-brand">Sewa Motor Malaysia</Link>
        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          <Link href={`/${locale}`}>{t('home')}</Link>
          <Link href={`/${locale}#products`}>{t('products')}</Link>
          <Link href={`/${locale}#calculator`}>{t('calculator')}</Link>
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
          <LanguageSwitcher />
          <Link
            href={`/${locale}/redirect-whatsapp-1`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
          >
            {t('whatsappCta')}
          </Link>
        </div>
      </div>

      <div id="site-nav-mobile" className={`site-mobile-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="site-mobile-nav" aria-label="Mobile primary">
          <Link href={`/${locale}`} onClick={close}>{t('home')}</Link>
          <Link href={`/${locale}#products`} onClick={close}>{t('products')}</Link>
          <Link href={`/${locale}#calculator`} onClick={close}>{t('calculator')}</Link>
          <Link href={`/${locale}#locations`} onClick={close}>{t('locations')}</Link>
          <Link href={`/${locale}/blog`} onClick={close}>{t('blog')}</Link>
        </nav>
      </div>

      <style jsx>{`
        .site-header {
          position: sticky; top: 0; z-index: 40;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: saturate(180%) blur(10px);
          -webkit-backdrop-filter: saturate(180%) blur(10px);
          border-bottom: 1px solid #E2E8F0;
        }
        .site-header-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 12px 20px; min-height: 60px;
        }
        .site-brand { font-weight: 800; font-size: 15px; color: var(--brand-dark, #16213E); white-space: nowrap; }
        .site-nav { display: inline-flex; gap: 24px; }
        .site-nav a { color: var(--brand-text, #1B2432); font-weight: 600; font-size: 14px; white-space: nowrap; }
        .site-nav a:hover { color: var(--brand-primary, #FF6B35); }
        .site-nav--desktop { display: none; }
        .site-actions { display: inline-flex; align-items: center; gap: 10px; }
        .nav-cta {
          background: var(--wa-green, #25D366); color: #fff;
          padding: 8px 14px; border-radius: 999px; font-weight: 700; font-size: 13px;
          white-space: nowrap;
        }
        .site-burger { display: inline-flex; flex-direction: column; justify-content: center; gap: 4px; width: 38px; height: 38px; padding: 0 8px; background: transparent; border: 1px solid #CBD5E1; border-radius: 10px; cursor: pointer; }
        .site-burger span { display: block; height: 2px; width: 100%; background: #16213E; border-radius: 2px; }
        .site-mobile-drawer { display: none; background: #fff; border-top: 1px solid #E2E8F0; padding: 14px 20px 18px; }
        .site-mobile-drawer.is-open { display: block; }
        .site-mobile-nav { display: flex; flex-direction: column; }
        .site-mobile-nav a { padding: 13px 4px; font-weight: 700; font-size: 15px; color: #16213E; border-bottom: 1px solid #E2E8F0; }
        @media (min-width: 880px) { .site-nav--desktop { display: inline-flex; } .site-burger { display: none; } .site-mobile-drawer { display: none !important; } }
        @media (max-width: 879px) {
          :global(.nav-cta) { display: none !important; }
        }
      `}</style>
    </header>
  );
}
