// Flat minimal footer — the fleet default (reference: water-tank-malaysia).
// Logo + horizontal nav, divider, then copyright + the "Built by Utopia AI"
// brand-CI credit. No card container, no link columns, no social buttons and
// no footer CTA.
//
// Replaces the previous 2-up dark footer (brand block + tagline beside a
// Products / Locations / Resources column group).
//
// Palette stays Abang Excavator's own charcoal + orange — the CI is a
// structural element only, not a reskin. Uses existing nav.* / footer.* keys,
// so no new translation keys are needed.
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/abang-excavator-light.png" alt={navT('logoAlt')} className="footer-logo" />
          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}`}>{navT('home')}</Link>
            <Link href={`/${locale}#products`}>{navT('products')}</Link>
            <Link href={`/${locale}#calculator`}>{navT('calculator')}</Link>
            <Link href={`/${locale}#locations`}>{navT('locations')}</Link>
            <Link href={`/${locale}/blog`}>{navT('blog')}</Link>
            <Link href={`/${locale}#faq`}>{t('faqLabel')}</Link>
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
        .site-footer {
          background: var(--brand-grey-soft);
          color: var(--ink);
          padding: 44px 0 32px;
          border-top: 1px solid var(--line);
        }
        .footer-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px 32px;
        }
        .footer-logo { width: 168px; height: auto; object-fit: contain; }
        .footer-nav { display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .footer-nav a {
          color: var(--brand-charcoal); font-weight: 600; font-size: 14.5px;
          transition: color var(--dur-hover) var(--ease);
        }
        .footer-nav a:hover { color: var(--brand-orange); }
        .footer-line { height: 1px; background: var(--line); margin: 24px 0; }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px 24px;
        }
        .footer-copy { margin: 0; font-size: 12.5px; font-weight: 400; color: var(--ink-muted); }
        .utopia-credit { color: var(--ink-muted); }
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
