'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import WhatsAppButton from '@/components/WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const waHref = waRedirect(locale);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}#products`, label: t('products') },
    { href: `/${locale}#how`, label: t('how') },
    { href: `/${locale}#reviews`, label: t('reviews') },
    { href: `/${locale}/blog`, label: t('blog') },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 55,
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <nav
        style={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: 1240,
          background: '#FFFFFF',
          borderRadius: 9999,
          boxShadow: '0 8px 24px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Logo */}
        <a
          href={`/${locale}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'Inter, sans-serif',
            color: '#1c3a6a',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          <img
            src="/brand/logo/logo-dark.svg"
            alt="Katil Hospital Murah logo"
            style={{ height: 34, width: 'auto', display: 'block' }}
          />
          <span style={{ display: 'none' }} className="brand-word">
            Katil Hospital Murah
          </span>
        </a>

        {/* Desktop links */}
        <ul
          className="nav-desktop"
          style={{
            display: 'none',
            listStyle: 'none',
            gap: 22,
            margin: '0 auto',
            padding: 0,
          }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                style={{
                  color: '#334155',
                  fontWeight: 500,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div className="lang-desktop" style={{ display: 'none' }}>
            <LanguageSwitcher />
          </div>
          <WhatsAppButton href={waHref} label={t('cta')} variant="compact" />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="burger"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 9999,
              background: '#F0F4FA',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c3a6a" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            pointerEvents: 'auto',
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            zIndex: 70,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 80,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'calc(100% - 32px)',
              maxWidth: 420,
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              textAlign: 'center',
            }}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: '#1c3a6a',
                  fontWeight: 600,
                  fontSize: 16,
                  padding: '10px 0',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                {l.label}
              </a>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 6,
              }}
            >
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          :global(.nav-desktop) {
            display: flex !important;
          }
          :global(.lang-desktop) {
            display: inline-flex !important;
          }
          :global(.burger) {
            display: none !important;
          }
          :global(.brand-word) {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
}
