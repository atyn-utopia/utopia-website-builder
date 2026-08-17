import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { localePath } from '@/lib/localeHref';

/**
 * House-default footer layout — the `water-tank-malaysia` pattern, which is the
 * standard for every Utopia site (NOT the older 4-column sewa-excavator block):
 * a single tinted band, logo left with an inline nav right, a hairline rule, then
 * copyright left and the "Built by Utopia AI" credit right.
 *
 * Only the palette and the logo file are per-project. This site runs the band in
 * brand emerald, so it uses the DARK-background logo variant (white + gold wordmark).
 */
export default async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/majlis-aqiqah-dark.png" alt={navT('logoAlt')} className="footer-logo" />
          <nav className="footer-nav" aria-label="Footer">
            <Link href={localePath(locale)}>{navT('home')}</Link>
            <Link href={`${localePath(locale)}#products`}>{navT('products')}</Link>
            <Link href={`${localePath(locale)}#calculator`}>{navT('calculator')}</Link>
            <Link href={`${localePath(locale)}#locations`}>{navT('locations')}</Link>
            <Link href={localePath(locale, '/blog')}>{navT('blog')}</Link>
            <Link href={`${localePath(locale)}#faq`}>{t('faqLabel')}</Link>
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

      <style>{`
        .site-footer { background: var(--brand-emerald); padding: 44px 0 32px; border-top: 1px solid var(--brand-gold-ring); }
        .footer-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px 32px;
        }
        .footer-logo { width: 172px; height: auto; object-fit: contain; }
        .footer-nav { display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .footer-nav a {
          color: #FFFFFF; font-weight: 600; font-size: 14.5px;
          transition: color var(--dur) var(--ease-out);
        }
        .footer-nav a:hover { color: var(--brand-gold-bright); }
        .footer-nav a:focus-visible { outline: 2px solid var(--brand-gold-bright); outline-offset: 3px; border-radius: 4px; }
        .footer-line { height: 1px; background: rgba(199,154,75,0.32); margin: 24px 0; }
        .footer-bottom {
          color: rgba(255,255,255,0.72);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px 24px;
        }
        .footer-copy { margin: 0; font-size: 12.5px; color: rgba(255,255,255,0.62); }
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
