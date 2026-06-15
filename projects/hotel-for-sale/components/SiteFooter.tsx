import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';

const FOOTER_LOCATIONS = [
  'kuala-lumpur', 'johor-bahru', 'george-town', 'kota-kinabalu',
];
const cityNameMap: Record<string, string> = {
  'kuala-lumpur': 'Kuala Lumpur',
  'johor-bahru': 'Johor Bahru',
  'george-town': 'George Town',
  'kota-kinabalu': 'Kota Kinabalu',
};

export default async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-dark.png" alt={navT('logoAlt')} className="footer-logo" />
        </div>
        <p className="footer-tag">{t('tagline')}</p>

        <nav className="footer-links" aria-label="Footer">
          <Link href={`/${locale}`}>{navT('home')}</Link>
          <Link href={`/${locale}/properties`}>{navT('properties')}</Link>
          <Link href={`/${locale}#sell`}>{navT('sell')}</Link>
          {FOOTER_LOCATIONS.map((slug) => (
            <Link key={slug} href={`/${locale}/${siteConfig.productSlug}/${slug}`}>{cityNameMap[slug]}</Link>
          ))}
          <Link href={`/${locale}/blog`}>{t('blogLabel')}</Link>
        </nav>

        <p className="footer-agency">{t('agency')}</p>
        <p className="footer-address">{t('address')}</p>
        <div className="footer-bottom">
          <p className="footer-copy">{t('copyright')}</p>
          <a
            className="utopia-credit"
            href="https://utopiagroup.com.my"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Built by Utopia AI"
          >
            <span className="utopia-credit-by">Built by</span>
            <span className="utopia-credit-word">Utopia</span>
            <svg className="utopia-tri" viewBox="0 0 64 56" width="11" height="10" aria-hidden="true">
              <defs>
                <linearGradient id="utopiaCreditGradHFS" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0054A6" />
                  <stop offset="60%" stopColor="#2774AE" />
                  <stop offset="100%" stopColor="#4A9DD0" />
                </linearGradient>
              </defs>
              <polygon points="32,4 60,52 4,52" fill="url(#utopiaCreditGradHFS)" />
            </svg>
            <span className="utopia-credit-word">AI</span>
          </a>
        </div>
      </div>

      <style>{`
        .site-footer { background: var(--brand-navy-deep); color: #C7D2E3; padding: 56px 0 32px; }
        .footer-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; }
        .footer-mark { display: inline-flex; }
        .footer-logo { width: 220px; height: auto; object-fit: contain; }
        .footer-tag { margin: 0; color: #fff; font-size: 15px; line-height: 1.6; max-width: 560px; }
        .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 22px; margin: 8px 0; }
        .footer-links a { color: #C7D2E3; font-size: 14px; font-weight: 500; transition: color var(--dur) var(--ease-out); }
        .footer-links a:hover { color: var(--brand-orange-bright); }
        .footer-agency { margin: 6px 0 0; color: #fff; font-size: 13.5px; font-weight: 500; }
        .footer-address { margin: 0; color: #93A2BC; font-size: 12.5px; line-height: 1.6; max-width: 520px; }
        .footer-bottom { margin: 14px 0 0; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.12); width: 100%; max-width: 720px; display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .footer-copy { margin: 0; color: #8595B0; font-size: 12px; }
        /* Utopia AI build credit — CI button rules: 8px radius, icon never
           compresses, easeOutExpo lift on hover. Mark carries Utopia's own
           gradient (correct brand-mark usage); site palette/fonts unchanged. */
        .utopia-credit {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: var(--r-button, 8px);
          color: #C7D2E3; font-size: 12px; font-weight: 600;
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
          transition: transform var(--dur-hover, 220ms) var(--ease, ease),
                      border-color var(--dur-hover, 220ms) var(--ease, ease),
                      background-color var(--dur-hover, 220ms) var(--ease, ease);
        }
        .utopia-credit:hover {
          transform: translateY(-1px);
          border-color: rgba(74,157,208,0.55);
          background: rgba(39,116,174,0.12);
        }
        .utopia-credit-by { color: #8595B0; }
        .utopia-credit-word { color: #F1F5F9; font-weight: 800; letter-spacing: -0.01em; }
        .utopia-tri { display: inline-block; flex-shrink: 0; }
      `}</style>
    </footer>
  );
}
