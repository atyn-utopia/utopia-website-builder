import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BrandMark } from '@/components/BrandMark';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';

// Footer layout mirrors the canonical sewa-excavator SiteFooter: a brand block
// (logo + tagline) beside a column group (Products / Top Locations / Resources),
// centred on mobile, with a bottom copyright bar. Re-themed to the cold-chain
// palette (steel-900 surface, cold-amber accent).
const FOOTER_TIERS = [
  'frozen-storage-minus-18',
  'freezer-minus-5-to-minus-10',
  'chiller-2-to-4',
  'cool-storage-7-to-10',
];

const FOOTER_CITIES = ['bukit-bintang', 'petaling-jaya', 'shah-alam', 'johor-bahru', 'george-town', 'ipoh'];

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href={`/${locale}`} className="footer-mark" aria-label={t('nav.brandName')}>
              <BrandMark size={40} />
              <span className="footer-brand-name">{t('nav.brandName')}</span>
            </Link>
            <p className="footer-tag">{t('footer.tagline')}</p>
            <span aria-hidden className="footer-accent" />
          </div>

          <div className="footer-cols">
            <div>
              <h6>{t('footer.cols.products')}</h6>
              <ul>
                {FOOTER_TIERS.map((slug) => (
                  <li key={slug}>
                    <Link href={`/${locale}#cold-room-rental`}>{t(`hero.tempLabels.${slug}`)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6>{t('footer.cols.cities')}</h6>
              <ul>
                {FOOTER_CITIES.map((slug) => {
                  const c = locations.find((l) => l.slug === slug);
                  if (!c) return null;
                  const display = locale === 'zh' ? c.name_zh : locale === 'ms' ? (c.name_ms ?? c.name) : c.name;
                  return (
                    <li key={slug}>
                      <Link href={`/${locale}/${siteConfig.productSlug}/${slug}`}>{display}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h6>{t('footer.cols.resources')}</h6>
              <ul>
                <li><Link href={`/${locale}/blog`}>{t('nav.blog')}</Link></li>
                <li><Link href={`/${locale}#faq`}>{t('nav.faq')}</Link></li>
                <li><Link href={`/${locale}#locations`}>{t('nav.locations')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} {t('nav.brandName')}. {t('footer.rights')}</p>
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
                <linearGradient id="coldroomUtopiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0054A6" />
                  <stop offset="60%" stopColor="#2774AE" />
                  <stop offset="100%" stopColor="#4A9DD0" />
                </linearGradient>
              </defs>
              <polygon points="32,4 60,52 4,52" fill="url(#coldroomUtopiaGrad)" />
            </svg>
            <span className="utopia-credit-word">AI</span>
          </a>
        </div>
      </div>

      <style>{`
        .site-footer { background: var(--steel-900); color: rgba(255,255,255,0.7); padding: 72px 0 32px; }
        .footer-top { display: grid; grid-template-columns: 1fr; gap: 40px; }
        @media (min-width: 768px) { .footer-top { grid-template-columns: 1fr 2fr; gap: 64px; } }
        .footer-brand { display: flex; flex-direction: column; gap: 16px; max-width: 340px; }
        .footer-mark { display: inline-flex; align-items: center; gap: 10px; }
        .footer-brand-name { font-weight: 800; color: #fff; font-size: 18px; letter-spacing: -0.02em; }
        .footer-tag { margin: 0; color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; }
        .footer-accent { display: block; height: 2px; width: 60px; background: var(--cold-amber); border-radius: 2px; }
        .footer-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 28px; }
        .footer-cols h6 { font-weight: 700; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #fff; margin: 0 0 14px; }
        .footer-cols ul { list-style: none; padding: 0; margin: 0; }
        .footer-cols li { margin-bottom: 10px; }
        .footer-cols a { color: rgba(255,255,255,0.7); font-size: 14px; transition: color 200ms var(--ease-out); }
        .footer-cols a:hover { color: var(--cold-amber-glow); }
        .footer-bottom { margin-top: 56px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.10); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 12px; color: rgba(255,255,255,0.5); }
        .footer-copy { margin: 0; }
        /* Utopia AI build credit — CI button rules: 8px radius, icon never
           compresses, easeOutExpo lift on hover. The triangle mark carries
           Utopia's own gradient (correct brand-mark usage); the site palette
           and fonts are unchanged. */
        .utopia-credit {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: var(--r-button, 8px);
          color: #CBD5E1; font-size: 12px; font-weight: 600;
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
        .utopia-credit-by { color: rgba(255,255,255,0.45); }
        .utopia-credit-word { color: #F1F5F9; font-weight: 800; letter-spacing: -0.01em; }
        .utopia-tri { display: inline-block; flex-shrink: 0; }
        @media (max-width: 767px) {
          .site-footer { padding: 48px 0 24px; }
          .footer-top { gap: 28px; }
          .footer-top, .footer-brand, .footer-bottom { text-align: center; align-items: center; }
          .footer-brand { max-width: none; gap: 12px; }
          .footer-mark { justify-content: center; }
          .footer-accent { align-self: center; }
          .footer-cols { display: block; column-count: 2; column-gap: 24px; text-align: center; }
          .footer-cols > div { break-inside: avoid; display: inline-block; width: 100%; margin: 0 0 24px; }
          .footer-bottom { margin-top: 32px; padding-top: 18px; justify-content: center; }
        }
      `}</style>
    </footer>
  );
}
