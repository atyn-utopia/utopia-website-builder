// Flat minimal footer — the fleet default (reference: water-tank-malaysia).
// Logo + horizontal nav, divider, then copyright + the "Built by Utopia AI"
// brand-CI credit. No card container, no social buttons, no footer CTA, and no
// language switcher (SiteHeader already carries it).
// Palette stays electric-wheelchair's own navy/orange — the CI is a structural
// element only, not a reskin.
// Uses existing nav.* / footer.* keys, so no new translation keys are needed.
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tFoot = await getTranslations({ locale, namespace: 'footer' });

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="footer-top">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt={tNav('logoAlt')} className="footer-logo" />
            <span className="footer-brand-text">{tNav('brandName')}</span>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}`}>{tNav('home')}</Link>
            <a href={`/${locale}#products`}>{tNav('products')}</a>
            <a href={`/${locale}#services`}>{tNav('services')}</a>
            <a href={`/${locale}#reviews`}>{tNav('reviews')}</a>
            <Link href={`/${locale}/blog`}>{tNav('blog')}</Link>
            <a href={`/${locale}#faq`}>{tNav('faq')}</a>
          </nav>
        </div>

        <div className="footer-line" aria-hidden="true" />

        <div className="footer-bottom">
          <div className="footer-legal">
            <h6 className="footer-copy">{tFoot('copyright')}</h6>
            <h6 className="footer-ssm">{tFoot('ssm')}</h6>
          </div>
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

      <style>{`
        .site-footer {
          background: var(--surface);
          padding: 44px 0 32px;
          border-top: 1px solid #E3E9F2;
        }
        .site-footer__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 3vw, 32px);
        }
        .footer-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px 32px;
        }
        .footer-brand { display: inline-flex; align-items: center; gap: 10px; }
        .footer-logo { width: 34px; height: 34px; }
        .footer-brand-text {
          font-weight: 800; font-size: 16px; color: var(--navy);
          letter-spacing: -0.01em;
        }
        .footer-nav { display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .footer-nav a {
          color: var(--text); font-weight: 600; font-size: 14.5px;
          text-decoration: none;
          transition: color var(--dur-hover) var(--ease);
        }
        .footer-nav a:hover { color: var(--orange); }
        .footer-line { height: 1px; background: #DDE4EF; margin: 24px 0; }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px 24px;
        }
        .footer-legal { display: flex; flex-direction: column; gap: 4px; }
        .footer-copy, .footer-ssm {
          margin: 0; font-size: 12.5px; font-weight: 400; color: var(--text-muted);
        }
        .footer-ssm { opacity: 0.8; }
        @media (max-width: 767px) {
          .site-footer { padding: 32px 0 24px; }
          .footer-top { flex-direction: column; text-align: center; gap: 18px; }
          .footer-nav { justify-content: center; }
          .footer-bottom { flex-direction: column; text-align: center; }
          .footer-legal { align-items: center; }
        }
      `}</style>
    </footer>
  );
}
