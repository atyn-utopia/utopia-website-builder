'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import WhatsAppButton from '@/components/WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

// Flat, minimal site header — mirrors projects/water-tank-malaysia SiteHeader:
// logo + horizontal nav + language switcher + green WhatsApp CTA, with a burger
// drawer on mobile. Static (not sticky) so it sits below the sticky FOMO bar
// without overlapping it. Only brand/logo/labels differ from the reference.
export default function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const waHref = waRedirect(locale);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}#products`, label: t('products') },
    { href: `/${locale}#how`, label: t('how') },
    { href: `/${locale}#reviews`, label: t('reviews') },
    { href: `/${locale}/blog`, label: t('blog') },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Logo */}
        <Link href={`/${locale}`} className="site-brand" aria-label={t('home')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo/logo-dark.png" alt="Katil Hospital Murah" className="site-logo" />
        </Link>

        {/* Desktop nav */}
        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="site-actions">
          <div className="site-actions__lang">
            <LanguageSwitcher />
          </div>
          <WhatsAppButton href={waHref} label={t('whatsappCta')} variant="compact" />
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
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="site-nav-mobile" className={`site-mobile-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="site-mobile-nav" aria-label="Mobile primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="site-mobile-actions">
          <LanguageSwitcher />
          <WhatsAppButton href={waHref} label={t('whatsappCta')} variant="full" />
        </div>
      </div>

      <style>{`
        .site-header {
          position: relative;
          z-index: 40;
          background: #ffffff;
          border-bottom: 1px solid #E2E8F0;
        }
        .site-header-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          min-height: 60px;
        }
        .site-brand {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
        }
        .site-logo {
          height: 54px;
          width: auto;
          display: block;
        }
        .site-nav {
          display: inline-flex;
          gap: 24px;
          flex-wrap: nowrap;
        }
        .site-nav a {
          color: #334155;
          font-weight: 600;
          font-size: 14px;
          font-family: Inter, sans-serif;
          white-space: nowrap;
          transition: color 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .site-nav a:hover {
          color: #e63030;
        }
        .site-nav--desktop {
          display: none;
        }
        .site-actions {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
        }
        .site-actions__lang {
          display: none;
        }
        .site-burger {
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          width: 40px;
          height: 40px;
          padding: 0 9px;
          background: #F0F4FA;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          cursor: pointer;
        }
        .site-burger span {
          display: block;
          height: 2px;
          width: 100%;
          background: #1c3a6a;
          border-radius: 2px;
          transition: transform 0.18s ease, opacity 0.18s ease;
        }
        .site-burger[aria-expanded='true'] span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .site-burger[aria-expanded='true'] span:nth-child(2) {
          opacity: 0;
        }
        .site-burger[aria-expanded='true'] span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }
        .site-mobile-drawer {
          display: none;
          background: #fff;
          border-top: 1px solid #E2E8F0;
          padding: 14px 16px 18px;
        }
        .site-mobile-drawer.is-open {
          display: block;
        }
        .site-mobile-nav {
          display: flex;
          flex-direction: column;
        }
        .site-mobile-nav a {
          padding: 13px 4px;
          font-weight: 700;
          font-size: 15px;
          font-family: Inter, sans-serif;
          color: #1c3a6a;
          border-bottom: 1px solid #E2E8F0;
        }
        .site-mobile-nav a:last-child {
          border-bottom: none;
        }
        .site-mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          padding-top: 16px;
          margin-top: 12px;
          border-top: 1px solid #E2E8F0;
        }
        @media (min-width: 880px) {
          .site-nav--desktop {
            display: inline-flex;
          }
          .site-actions__lang {
            display: inline-flex;
          }
          .site-burger {
            display: none;
          }
          .site-mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
