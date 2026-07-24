'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

// Flat, minimal site footer — mirrors projects/water-tank-malaysia SiteFooter:
// logo + horizontal nav + divider + copyright and the mandatory "Built by
// Utopia AI" credit. Client component (reads locale via hook) so the prop-less
// <SiteFooter /> calls across every page keep working. Only brand/logo/labels
// differ from the reference; palette is katil navy on a light tint.
export default function SiteFooter() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const locale = useLocale();

  const links = [
    { href: `/${locale}`, label: navT('home') },
    { href: `/${locale}#products`, label: navT('products') },
    { href: `/${locale}#how`, label: navT('how') },
    { href: `/${locale}#reviews`, label: navT('reviews') },
    { href: `/${locale}/blog`, label: navT('blog') },
    { href: `/${locale}#lokasi`, label: navT('locations') },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo/logo-dark.png" alt="Katil Hospital Murah" className="footer-logo" />
          <nav className="footer-nav" aria-label="Footer">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-line" aria-hidden="true" />

        <div className="footer-bottom">
          <p className="footer-copy">{t('copyright')}</p>
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

      <style jsx>{`
        .site-footer {
          background: #EEF5FB;
          padding: 44px 0 32px;
          border-top: 1px solid #E1EEFA;
          font-family: Inter, sans-serif;
        }
        .site-footer-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .footer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px 32px;
        }
        .footer-logo {
          height: 54px;
          width: auto;
          object-fit: contain;
        }
        .footer-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 26px;
        }
        .footer-nav :global(a) {
          color: #1c3a6a;
          font-weight: 600;
          font-size: 14.5px;
          transition: color 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-nav :global(a:hover) {
          color: #e63030;
        }
        .footer-line {
          height: 1px;
          background: #DCE9F6;
          margin: 24px 0;
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px 24px;
        }
        .footer-copy {
          margin: 0;
          font-size: 12.5px;
          color: rgba(28, 58, 106, 0.65);
        }
        .utopia-credit {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(28, 58, 106, 0.7);
          text-decoration: none;
          border-radius: var(--r-button);
          transition: transform var(--dur-hover) var(--ease),
            opacity var(--dur-hover) var(--ease);
        }
        .utopia-credit:hover {
          transform: translateY(-1px);
          opacity: 0.85;
        }
        .utopia-credit__word {
          font-weight: 700;
          color: #1c3a6a;
        }
        .utopia-credit__mark {
          display: inline-block;
          flex: none;
        }
        @media (max-width: 767px) {
          .site-footer {
            padding: 32px 0 24px;
          }
          .footer-top {
            flex-direction: column;
            text-align: center;
            gap: 18px;
          }
          .footer-nav {
            justify-content: center;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
