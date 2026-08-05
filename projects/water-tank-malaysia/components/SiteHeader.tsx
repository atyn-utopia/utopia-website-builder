'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { WhatsAppButton, WaIcon } from './WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

export default function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          <Link href={`/${locale}`}>{t('home')}</Link>
          <Link href={`/${locale}#products`}>{t('products')}</Link>
          <Link href={`/${locale}#packages`}>{t('packages')}</Link>
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
          <WhatsAppButton href={waRedirect(locale)} label="nav" className="btn btn-wa nav-cta">
            <WaIcon size={16} />
            <span className="nav-cta-label">{t('whatsappCta')}</span>
          </WhatsAppButton>
        </div>
      </div>

      <div id="site-nav-mobile" className={`site-mobile-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="site-mobile-nav" aria-label="Mobile primary">
          <Link href={`/${locale}`} onClick={close}>{t('home')}</Link>
          <Link href={`/${locale}#products`} onClick={close}>{t('products')}</Link>
          <Link href={`/${locale}#packages`} onClick={close}>{t('packages')}</Link>
          <Link href={`/${locale}#locations`} onClick={close}>{t('locations')}</Link>
          <Link href={`/${locale}/blog`} onClick={close}>{t('blog')}</Link>
        </nav>
        <div className="site-mobile-actions">
          <LanguageSwitcher />
          <WhatsAppButton href={waRedirect(locale)} label="nav-mobile" className="btn btn-wa">
            <WaIcon size={16} />
            {t('whatsappCta')}
          </WhatsAppButton>
        </div>
      </div>

      <style>{`
        .site-header {
          position: sticky; top: 0; z-index: 40;
          background: rgba(255,255,255,0.92);
          backdrop-filter: saturate(180%) blur(10px);
          -webkit-backdrop-filter: saturate(180%) blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .site-header-inner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
          padding: 12px var(--gut);
          min-height: 60px;
        }
        .site-nav { display: inline-flex; gap: 24px; flex-wrap: nowrap; }
        .site-nav a { color: var(--ink); font-weight: 600; font-size: 14px; letter-spacing: -0.005em; transition: color var(--dur) var(--ease-out); white-space: nowrap; }
        .site-nav a:hover { color: var(--brand-orange-deep); }
        .site-nav--desktop { display: none; }
        .site-actions { display: inline-flex; align-items: center; gap: 10px; }
        .nav-cta { height: 40px; padding: 0 14px; font-size: 13px; }
        .nav-cta-label { display: inline; }
        .site-burger { display: inline-flex; flex-direction: column; justify-content: center; gap: 4px; width: 38px; height: 38px; padding: 0 8px; background: transparent; border: 1px solid var(--line-strong); border-radius: 10px; cursor: pointer; }
        .site-burger span { display: block; height: 2px; width: 100%; background: var(--brand-charcoal); border-radius: 2px; transition: transform 0.18s ease, opacity 0.18s ease; }
        .site-burger[aria-expanded="true"] span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .site-burger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
        .site-burger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .site-mobile-drawer { display: none; background: #fff; border-top: 1px solid var(--line); padding: 14px var(--gut) 18px; }
        .site-mobile-drawer.is-open { display: block; }
        .site-mobile-nav { display: flex; flex-direction: column; }
        .site-mobile-nav a { padding: 13px 4px; font-weight: 700; font-size: 15px; color: var(--brand-charcoal); border-bottom: 1px solid var(--line); }
        .site-mobile-nav a:last-child { border-bottom: none; }
        .site-mobile-actions { display: flex; flex-direction: column; gap: 12px; padding-top: 16px; margin-top: 12px; border-top: 1px solid var(--line); }
        .site-mobile-actions .lsw-toggle { justify-content: center; }
        .site-mobile-actions .btn { width: 100%; }
        @media (min-width: 880px) { .site-nav--desktop { display: inline-flex; } .site-burger { display: none; } .site-mobile-drawer { display: none !important; } }
        @media (max-width: 879px) {
          .nav-cta { display: none !important; }
          .site-actions__lang { display: inline-flex; }
          .site-mobile-actions .btn-wa { display: none; }
        }
      `}</style>
    </header>
  );
}
