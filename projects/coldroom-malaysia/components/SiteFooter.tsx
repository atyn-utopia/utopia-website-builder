// Flat minimal footer — the fleet default (reference: water-tank-malaysia).
// Logo + horizontal nav, divider, then copyright + the "Built by Utopia AI"
// brand-CI credit. No card container, no link columns, no social buttons and
// no footer CTA.
//
// Replaces the previous 2-up dark footer (brand block + tagline + accent rule
// beside a Products / Cities / Resources column group).
//
// Palette stays Cold Room Malaysia's own frost + amber — the CI is a structural
// element only, not a reskin. Uses existing nav.* / footer.* keys.
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BrandMark } from '@/components/BrandMark';

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-top">
          <Link href={`/${locale}`} className="footer-mark" aria-label={t('nav.brandName')}>
            <BrandMark size={38} />
            <span className="footer-brand-name">{t('nav.brandName')}</span>
          </Link>

          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}`}>{t('nav.home')}</Link>
            <Link href={`/${locale}#cold-room-rental`}>{t('nav.products')}</Link>
            <Link href={`/${locale}#how-it-works`}>{t('nav.howItWorks')}</Link>
            <Link href={`/${locale}#locations`}>{t('nav.locations')}</Link>
            <Link href={`/${locale}/blog`}>{t('nav.blog')}</Link>
            <Link href={`/${locale}#faq`}>{t('nav.faq')}</Link>
          </nav>
        </div>

        <div className="footer-line" aria-hidden="true" />

        <div className="footer-bottom">
          <h6 className="footer-copy">
            © {new Date().getFullYear()} {t('nav.brandName')}. {t('footer.rights')}
          </h6>
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
          background: var(--frost-mist);
          color: var(--steel-700);
          padding: 44px 0 32px;
          border-top: 1px solid var(--steel-100);
        }
        .footer-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px 32px;
        }
        .footer-mark { display: inline-flex; align-items: center; gap: 10px; }
        .footer-brand-name { font-weight: 800; color: var(--frost-deep); font-size: 17px; letter-spacing: -0.02em; }
        .footer-nav { display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .footer-nav a {
          color: var(--steel-700); font-weight: 600; font-size: 14.5px;
          transition: color var(--dur-hover) var(--ease);
        }
        .footer-nav a:hover { color: var(--cold-amber-dark); }
        .footer-line { height: 1px; background: var(--steel-100); margin: 24px 0; }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px 24px;
        }
        .footer-copy { margin: 0; font-size: 12.5px; font-weight: 400; color: var(--steel-500); }
        .utopia-credit { color: var(--steel-500); }
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
