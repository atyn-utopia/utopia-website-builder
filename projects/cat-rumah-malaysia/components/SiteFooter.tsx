import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';

const FOOTER_LOCATIONS = [
  'kuala-lumpur', 'petaling-jaya', 'shah-alam',
  'subang-jaya', 'johor-bahru', 'george-town',
];

const CITY_DISPLAY: Record<string, string> = {
  'kuala-lumpur': 'Kuala Lumpur',
  'petaling-jaya': 'Petaling Jaya',
  'shah-alam': 'Shah Alam',
  'subang-jaya': 'Subang Jaya',
  'johor-bahru': 'Johor Bahru',
  'george-town': 'George Town',
};

export default async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  const productLinks = t.raw('productsLinks') as string[];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-mark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.svg" alt={navT('logoAlt')} className="footer-logo" />
              <span className="footer-name">{siteConfig.brandName}</span>
            </div>
            <p className="footer-tag">{t('tagline')}</p>
          </div>

          <div className="footer-cols">
            <div>
              <h6>{t('productsHeading')}</h6>
              <ul>
                {productLinks.map((label) => (
                  <li key={label}>
                    <Link href={`/${locale}#products`}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6>{t('locationsHeading')}</h6>
              <ul>
                {FOOTER_LOCATIONS.map((slug) => (
                  <li key={slug}>
                    <Link href={`/${locale}/${siteConfig.productSlug}/${slug}`}>
                      {CITY_DISPLAY[slug]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6>{t('resourcesHeading')}</h6>
              <ul>
                <li><Link href={`/${locale}/blog`}>{t('blogLabel')}</Link></li>
                <li><Link href={`/${locale}#faq`}>{t('faqLabel')}</Link></li>
                <li><Link href={`/${locale}#calculator`}>{navT('calculator')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">{t('copyright')}</p>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--brand-ink, #142C50);
          color: #E5E7EB;
          padding: 72px 0 32px;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 768px) {
          .footer-top { grid-template-columns: 1fr 2fr; gap: 64px; }
        }
        .footer-brand { display: flex; flex-direction: column; gap: 16px; max-width: 360px; }
        .footer-mark { display: inline-flex; align-items: center; gap: 10px; }
        .footer-logo { width: 36px; height: 36px; object-fit: contain; }
        .footer-name { color: #fff; font-weight: 800; font-size: 18px; letter-spacing: -0.01em; }
        .footer-tag { margin: 0; color: #fff; font-size: 15px; line-height: 1.6; opacity: 0.9; }
        .footer-cols {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 28px;
        }
        .footer-cols h6 {
          font-weight: 700;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 14px;
        }
        .footer-cols ul { list-style: none; padding: 0; margin: 0; }
        .footer-cols li { margin-bottom: 10px; }
        .footer-cols a {
          color: #cbd5d8;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .footer-cols a:hover { color: var(--brand-accent, #FFD23F); }
        .footer-bottom {
          margin-top: 56px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.10);
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
          color: #9ca3af;
        }
        .footer-copy { margin: 0; }
        @media (max-width: 767px) {
          .site-footer { padding: 48px 0 24px; }
          .footer-top { gap: 24px; }
          .footer-top, .footer-brand, .footer-bottom { text-align: center; align-items: center; }
          .footer-cols { text-align: center; }
          .footer-cols > div { align-self: start; }
          .footer-brand { max-width: none; gap: 12px; }
          .footer-mark { justify-content: center; }
          .footer-tag { font-size: 14px; }
          .footer-cols ul { padding: 0; }
          .footer-cols { display: block; column-count: 2; column-gap: 24px; }
          .footer-cols > div { break-inside: avoid; display: inline-block; width: 100%; margin: 0 0 24px; }
          .footer-cols h6 { margin: 0 0 10px; }
          .footer-bottom { margin-top: 32px; padding-top: 18px; }
        }
      `}</style>
    </footer>
  );
}
