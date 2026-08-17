import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

/**
 * Canonical Utopia footer (templates/site-chrome + water-tank-malaysia): flat
 * and minimal — logo lockup + horizontal nav, a divider, then copyright and the
 * "Built by Utopia AI" credit. No card, no columns, no social buttons.
 *
 * Only the palette is this site's own (teal instead of water-tank's blue), per
 * the brand-CI rule: adopt the structure, keep the site's colours. Values are
 * literal rather than var(--…) so nothing depends on tokens this project does
 * not define.
 */
export default async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <Link href={`/${locale}`} className="footer-logo" aria-label={navT('logoAlt')}>
            <span className="footer-logo__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </span>
            <span className="footer-logo__text">Ibnu Sina Care</span>
          </Link>

          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}#produk`}>{navT('products')}</Link>
            <Link href={`/${locale}#sewa`}>{navT('rentBuy')}</Link>
            <Link href={`/${locale}#showroom`}>{navT('showroom')}</Link>
            <Link href={`/${locale}#lokasi`}>{navT('locations')}</Link>
            <Link href={`/${locale}/blog`}>{navT('blog')}</Link>
            <Link href={`/${locale}#faq`}>{navT('faq')}</Link>
          </nav>
        </div>

        <div className="footer-line" aria-hidden="true" />

        <div className="footer-bottom">
          <h6 className="footer-copy">{t('copyright')}</h6>
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
        .site-footer { background: #F0FDFA; padding: 44px 0 32px; border-top: 1px solid #CCFBF1; }
        .footer-container { max-width: 1152px; margin: 0 auto; padding: 0 16px; }
        .footer-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px 32px;
        }
        .footer-logo { display: inline-flex; align-items: center; gap: 10px; }
        .footer-logo__mark {
          width: 36px; height: 36px; border-radius: 10px; background: #0f766e;
          display: inline-flex; align-items: center; justify-content: center; color: #fff;
          flex: 0 0 auto;
        }
        .footer-logo__mark svg { width: 21px; height: 21px; }
        .footer-logo__text {
          font-family: var(--font-rubik), Rubik, system-ui, sans-serif;
          font-size: 18px; color: #115e59; line-height: 1.2;
        }
        .footer-nav { display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .footer-nav a {
          color: #334155; font-weight: 600; font-size: 14.5px;
          transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .footer-nav a:hover { color: #d97706; }
        .footer-line { height: 1px; background: #CCFBF1; margin: 24px 0; }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px 24px;
        }
        .footer-copy { margin: 0; font-size: 12.5px; font-weight: 400; color: #6b7280; }
        .utopia-credit {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; color: #6b7280;
          transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .utopia-credit:hover { color: #0f766e; }
        .utopia-credit__word { font-weight: 700; }
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
