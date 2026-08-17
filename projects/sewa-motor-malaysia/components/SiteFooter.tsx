'use client';

// Flat minimal footer — the fleet default (reference: water-tank-malaysia).
// Logo + horizontal nav, divider, then copyright + the "Built by Utopia AI"
// brand-CI credit.
//
// Replaces the previous 3-column dark footer (brand + tagline / Quick Links /
// Top Locations). Also adds the brand-CI credit, which this site was missing
// entirely.
//
// Palette stays Sewa Motor Malaysia's own navy + orange; the CI is a
// structural element only, not a reskin.

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-top">
          <span className="footer-brand">
            <span className="footer-brand-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="24" height="24">
                <circle cx="9" cy="22" r="5" fill="#fff" />
                <circle cx="9" cy="22" r="2" fill="#FF6B35" />
                <circle cx="23" cy="22" r="5" fill="#fff" />
                <circle cx="23" cy="22" r="2" fill="#FF6B35" />
                <path d="M12 19 L14 12 L19 12 L22 16 L26 16 L26 21 L22 21 L20 18 Z" fill="#fff" />
                <path d="M19 12 L22 8 L25 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span className="footer-brand-text">Sewa Motor Malaysia</span>
          </span>

          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}`}>{nav('home')}</Link>
            <Link href={`/${locale}#products`}>{nav('products')}</Link>
            <Link href={`/${locale}#locations`}>{nav('locations')}</Link>
            <Link href={`/${locale}/blog`}>{nav('blog')}</Link>
          </nav>
        </div>

        <div className="footer-line" aria-hidden="true" />

        <div className="footer-bottom">
          <h6 className="footer-copy">{t('copyright', { year })}</h6>
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
