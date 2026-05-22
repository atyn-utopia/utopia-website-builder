'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { WhatsAppButton, WaIcon } from './WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

export default function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href={`/${locale}`} className="brand" aria-label={t('logoAlt')}>
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="32" height="32">
              <rect width="64" height="64" rx="14" fill="#0F0F0F" />
              <g fill="#F26C1F">
                <path d="M11 44 L11 47 L13 49 L51 49 L53 47 L53 44 L11 44 Z" />
                <rect x="13" y="40" width="38" height="4" rx="1" />
                <circle cx="17" cy="46.5" r="2.4" fill="#0F0F0F" />
                <circle cx="25" cy="46.5" r="2.4" fill="#0F0F0F" />
                <circle cx="33" cy="46.5" r="2.4" fill="#0F0F0F" />
                <circle cx="41" cy="46.5" r="2.4" fill="#0F0F0F" />
                <circle cx="47" cy="46.5" r="2.4" fill="#0F0F0F" />
                <path d="M31 26 L31 40 L48 40 L48 30 L42 30 L40 26 Z" />
                <rect x="34" y="29" width="6" height="6" fill="#FFC9A1" />
                <path d="M30 33 L18 16 L15 19 L26 33 Z" />
                <path d="M19 17 L9 27 L11 30 L14 28 L13 30 L18 28 L20 22 Z" />
              </g>
            </svg>
          </span>
          <span className="brand-name">Abang Excavator</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <Link href={`/${locale}#products`}>{t('products')}</Link>
          <Link href={`/${locale}#calculator`}>{t('calculator')}</Link>
          <Link href={`/${locale}#locations`}>{t('locations')}</Link>
          <Link href={`/${locale}/blog`}>{t('blog')}</Link>
        </nav>

        <div className="site-actions">
          <LanguageSwitcher />
          <WhatsAppButton href={waRedirect(locale)} label="nav" className="btn btn-wa nav-cta">
            <WaIcon size={16} />
            <span>{t('whatsappCta')}</span>
          </WhatsAppButton>
        </div>
      </div>

      <style jsx>{`
        .site-header {
          position: sticky; top: 0; z-index: 40;
          background: rgba(255,255,255,0.92);
          backdrop-filter: saturate(180%) blur(10px);
          -webkit-backdrop-filter: saturate(180%) blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .site-header-inner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          padding: 14px var(--gut);
        }
        .brand { display: inline-flex; align-items: center; gap: 10px; }
        .brand-name { font-weight: 800; font-size: 16px; letter-spacing: -0.015em; color: var(--brand-charcoal); }
        .site-nav { display: none; gap: 28px; }
        .site-nav a {
          color: var(--ink-muted);
          font-weight: 500;
          font-size: 14px;
          transition: color var(--dur) var(--ease-out);
        }
        .site-nav a:hover { color: var(--brand-orange-deep); }
        .site-actions { display: inline-flex; align-items: center; gap: 10px; }
        .nav-cta { height: 42px; padding: 0 16px; font-size: 13px; }
        @media (min-width: 960px) { .site-nav { display: inline-flex; } }
        @media (max-width: 640px) {
          .nav-cta { display: none; }
          .brand-name { display: none; }
        }
      `}</style>
    </header>
  );
}
