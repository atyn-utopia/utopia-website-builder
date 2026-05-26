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
        <Link href={`/${locale}`} className="site-brand" aria-label="Sewa Motor Malaysia homepage">
          <span className="site-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <circle cx="7" cy="23" r="4" stroke="currentColor" strokeWidth="2" />
              <circle cx="25" cy="23" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M11 23h10M7 23l4-10h6l4 3h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 13l2-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="site-brand-text">Sewa Motor Malaysia</span>
        </Link>
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
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z"/>
            </svg>
            <span>{t('whatsappCta')}</span>
          </Link>
          <Link
            href={`/${locale}/redirect-whatsapp-1`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta-mobile"
            aria-label={t('whatsappCta')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z"/>
            </svg>
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
        .site-brand {
          display: inline-flex; align-items: center; gap: 10px;
          font-weight: 800; font-size: 15px; color: var(--brand-dark, #16213E);
          white-space: nowrap; text-decoration: none;
        }
        .site-brand-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--brand-primary, #FF6B35);
          color: #fff;
          box-shadow: 0 4px 12px rgba(255,107,53,0.35);
        }
        .site-brand-text { line-height: 1; }
        .site-nav { display: inline-flex; gap: 24px; }
        .site-nav a { color: var(--brand-text, #1B2432); font-weight: 600; font-size: 14px; white-space: nowrap; }
        .site-nav a:hover { color: var(--brand-primary, #FF6B35); }
        .site-nav--desktop { display: none; }
        .site-actions { display: inline-flex; align-items: center; gap: 10px; }
        .nav-cta {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--wa-green, #25D366); color: #fff;
          padding: 8px 14px; border-radius: 999px; font-weight: 700; font-size: 13px;
          white-space: nowrap;
        }
        .nav-cta:hover { background: #1EBE57; }
        .nav-cta-mobile {
          display: inline-flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 999px;
          background: var(--wa-green, #25D366); color: #fff;
          box-shadow: 0 2px 8px rgba(37,211,102,0.4);
        }
        .nav-cta-mobile:hover { background: #1EBE57; }
        .site-burger { display: inline-flex; flex-direction: column; justify-content: center; gap: 4px; width: 38px; height: 38px; padding: 0 8px; background: transparent; border: 1px solid #CBD5E1; border-radius: 10px; cursor: pointer; }
        .site-burger span { display: block; height: 2px; width: 100%; background: #16213E; border-radius: 2px; }
        .site-mobile-drawer { display: none; background: #fff; border-top: 1px solid #E2E8F0; padding: 14px 20px 18px; }
        .site-mobile-drawer.is-open { display: block; }
        .site-mobile-nav { display: flex; flex-direction: column; }
        .site-mobile-nav a { padding: 13px 4px; font-weight: 700; font-size: 15px; color: #16213E; border-bottom: 1px solid #E2E8F0; }
        @media (min-width: 880px) {
          .site-nav--desktop { display: inline-flex; }
          .site-burger { display: none; }
          .site-mobile-drawer { display: none !important; }
          .nav-cta-mobile { display: none; }
        }
        @media (max-width: 879px) {
          :global(.nav-cta) { display: none !important; }
        }
        @media (max-width: 640px) {
          .site-brand-text { display: none; }
        }
      `}</style>
    </header>
  );
}
