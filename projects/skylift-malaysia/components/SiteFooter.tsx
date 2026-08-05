'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Flat minimal footer — the default layout reference (CLAUDE.md → "Default
// Layout Template", water-tank-malaysia/components/SiteFooter.tsx): logo +
// horizontal nav + divider + copyright + the "Built by Utopia AI" credit.
// No column grid, no card container, no social buttons. Skylift keeps its own
// palette and inline SVG lockup — the CI insertion is the credit + the
// structural tokens in globals.css, not a reskin.
export default function SiteFooter() {
  const locale = useLocale();
  const fo = useTranslations('footer');
  const navT = useTranslations('nav');

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <span className="brand-lockup brand-lockup--dark">
            <svg className="brand-lockup-icon" viewBox="0 0 64 48" fill="none" aria-hidden="true">
              <path d="M3 8 L3 18 L13 18 L13 8 Z M5 10 L11 10 L11 16 L5 16 Z" fill="currentColor" fillRule="evenodd" />
              <rect x="3" y="8" width="10" height="2" fill="#F5B400" />
              <path d="M11 13 L26 22 L24 25.5 L9 16.5 Z" fill="currentColor" />
              <circle cx="26" cy="22" r="2.4" fill="currentColor" />
              <circle cx="26" cy="22" r="0.8" fill="#F5B400" />
              <path d="M24.5 21 L31 30 L28 32 L21.5 23 Z" fill="currentColor" />
              <rect x="26" y="29" width="8" height="4" rx="0.6" fill="currentColor" />
              <rect x="10" y="33" width="38" height="5" rx="0.6" fill="currentColor" />
              <path d="M48 33 L48 23 L54 23 L60 28 L60 33 Z" fill="currentColor" />
              <rect x="58.5" y="30" width="1.4" height="1.4" fill="#F5B400" />
              <rect x="10" y="38" width="50" height="2" rx="0.4" fill="currentColor" />
              <circle cx="18" cy="40" r="3.4" fill="currentColor" />
              <circle cx="18" cy="40" r="1.4" fill="var(--white)" />
              <circle cx="52" cy="40" r="3.4" fill="currentColor" />
              <circle cx="52" cy="40" r="1.4" fill="var(--white)" />
            </svg>
            <span className="brand-lockup-text">
              <strong>{fo('brandName')}</strong>
              <small>{fo('ssm')}</small>
            </span>
          </span>

          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}`}>{navT('home')}</Link>
            <a href={`/${locale}#products`}>{navT('products')}</a>
            <a href={`/${locale}#locations`}>{navT('locations')}</a>
            <Link href={`/${locale}/blog`}>{navT('blog')}</Link>
          </nav>

          <LanguageSwitcher />
        </div>

        <div className="footer-line" aria-hidden="true" />

        <div className="footer-bottom">
          <h6 className="footer-copy body-h6">{fo('copyright')}</h6>
          <a
            className="utopia-credit"
            href="https://utopiagroup.com.my"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Built by</span>
            <span className="utopia-credit__word">Utopia</span>
            <svg className="utopia-credit__mark" width="14" height="12" viewBox="0 0 64 56" aria-hidden="true">
              <defs>
                <linearGradient id="utopiaCreditGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0054A6" />
                  <stop offset="50%" stopColor="#2774AE" />
                  <stop offset="100%" stopColor="#4A9DD0" />
                </linearGradient>
              </defs>
              <polygon points="32,4 60,52 4,52" fill="url(#utopiaCreditGrad)" />
            </svg>
            <span className="utopia-credit__word">AI</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
