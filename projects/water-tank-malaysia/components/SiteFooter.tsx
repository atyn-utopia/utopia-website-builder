import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import ContactNumber from './ContactNumber';

export default async function SiteFooter({
  locale,
  page,
}: {
  locale: string;
  /** Locale-stripped path, forwarded to ContactNumber — see that component. */
  page?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/tankpro-dark.png" alt={navT('logoAlt')} className="footer-logo" />
          <nav className="footer-nav" aria-label="Footer">
            <Link href={`/${locale}`}>{navT('home')}</Link>
            <Link href={`/${locale}#products`}>{navT('products')}</Link>
            <Link href={`/${locale}#packages`}>{navT('packages')}</Link>
            <Link href={`/${locale}#locations`}>{navT('locations')}</Link>
            <Link href={`/${locale}/blog`}>{navT('blog')}</Link>
            <Link href={`/${locale}#faq`}>{t('faqLabel')}</Link>
          </nav>
          <ContactNumber locale={locale} page={page} className="contact-number--footer" />
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
        /* Colour comes from the SITE's palette, never from this file.
           --brand-orange is the fleet's primary-accent token name (kept even on
           sites whose accent is blue or green), so the color-mix defaults tint
           the panel with whatever that site's accent actually is — a project
           that defines nothing still gets a footer in its own colours.
           Override any --footer-* token in globals.css to depart from that; a
           dark footer needs --footer-bg plus the two ink tokens. */
        .site-footer {
          --_tint: var(--footer-tint, var(--brand-orange, #5B6B7F));
          background: var(--footer-bg, color-mix(in srgb, var(--_tint) 8%, #FFFFFF));
          border-top: 1px solid var(--footer-border, color-mix(in srgb, var(--_tint) 14%, #FFFFFF));
          padding: 44px 0 32px;
        }
        .footer-top {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px 32px;
        }
        .footer-logo { width: 152px; height: auto; object-fit: contain; }
        .footer-nav { display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .footer-nav a {
          color: var(--footer-ink, var(--brand-charcoal)); font-weight: 600; font-size: 14.5px;
          transition: color var(--dur) var(--ease-out);
        }
        .footer-nav a:hover { color: var(--footer-link-hover, var(--brand-orange)); }
        .footer-line { height: 1px; background: var(--footer-rule, color-mix(in srgb, var(--_tint) 18%, #FFFFFF)); margin: 24px 0; }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px 24px;
        }
        .footer-copy { margin: 0; font-size: 12.5px; color: var(--footer-ink-muted, var(--ink-muted)); }
        .utopia-credit { color: var(--footer-ink, var(--brand-charcoal)); }
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
