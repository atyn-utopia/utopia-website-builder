// Flat minimal footer — the fleet default (reference: water-tank-malaysia).
// Wordmark + horizontal nav, divider, then copyright + the "Built by Utopia AI"
// brand-CI credit. No card container, no social buttons, no footer CTA, and no
// language switcher (the header already carries it).
//
// This replaces the bespoke 3-column footer that used to be hardcoded inline in
// app/[locale]/layout.tsx while this component was a stub returning null — so
// the site rendered chrome that no component owned.
//
// Palette stays oxihome's own teal/dark — the CI is a structural element only.
// Uses existing nav.* / footer.* keys, so no new translation keys are needed.
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function SiteFooter({ locale }: { locale: string }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tFoot = await getTranslations({ locale, namespace: 'footer' });
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="footer-top">
          <span className="footer-wordmark" aria-label={tNav('logoAlt')}>
            Oxi<span className="footer-wordmark__accent">home</span>
            <span className="footer-wordmark__tld">.my</span>
          </span>

          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}`}>{tNav('home')}</Link>
            <a href={`/${locale}#products`}>{tNav('products')}</a>
            <a href={`/${locale}#locations`}>{tNav('locations')}</a>
            <Link href={`/${locale}/blog`}>{tNav('blog')}</Link>
          </nav>
        </div>

        <div className="footer-line" aria-hidden="true" />

        <div className="footer-bottom">
          <h6 className="footer-copy">© {year} {tFoot('copyright')}</h6>
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
          background: var(--brand-surface);
          padding: 44px 0 32px;
          border-top: 1px solid var(--brand-border);
        }
        .site-footer__container {
          max-width: 1152px;
          margin: 0 auto;
          padding: 0 clamp(16px, 3vw, 32px);
        }
        .footer-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px 32px;
        }
        .footer-wordmark {
          font-family: var(--font-display);
          font-size: 20px;
          letter-spacing: -0.01em;
          color: var(--brand-dark);
          line-height: 1;
        }
        .footer-wordmark__accent { color: var(--brand-primary); }
        .footer-wordmark__tld {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 400;
          color: var(--brand-text-muted);
          margin-left: 2px;
        }
        .footer-nav { display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .footer-nav a {
          color: var(--brand-text); font-weight: 600; font-size: 14.5px;
          text-decoration: none;
          transition: color var(--dur-hover) var(--ease);
        }
        .footer-nav a:hover { color: var(--brand-primary); }
        .footer-line { height: 1px; background: var(--brand-border); margin: 24px 0; }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px 24px;
        }
        .footer-copy {
          margin: 0; font-size: 12.5px; font-weight: 400;
          color: var(--brand-text-muted);
        }
        @media (max-width: 767px) {
          .site-footer { padding: 32px 0 24px; }
          .footer-top { flex-direction: column; text-align: center; gap: 18px; }
          .footer-nav { justify-content: center; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
