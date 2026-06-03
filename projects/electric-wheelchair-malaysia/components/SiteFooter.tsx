// Dark footer that mirrors sewa-excavator's chrome 1:1: brand block on the
// left, three link columns on the right, copyright row at the bottom.
// Reads electric-wheelchair's existing footer.{tagline,quickLinks,contact,
// copyright,ssm} + nav.* keys (no new translation keys required).
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/i18n/routing';

const FOOTER_LOCATIONS: { slug: string; label: string }[] = [
  { slug: 'kuala-lumpur', label: 'Kuala Lumpur' },
  { slug: 'petaling-jaya', label: 'Petaling Jaya' },
  { slug: 'shah-alam', label: 'Shah Alam' },
  { slug: 'johor-bahru', label: 'Johor Bahru' },
  { slug: 'george-town', label: 'George Town' },
  { slug: 'ipoh', label: 'Ipoh' },
];

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tFoot = await getTranslations({ locale, namespace: 'footer' });
  const waHref = `/${locale}/redirect-whatsapp-1`;
  const year = new Date().getFullYear();

  return (
    <footer className="ewc-footer">
      <div className="ewc-footer__container">
        <div className="ewc-footer__top">
          <div className="ewc-footer__brand">
            <div className="ewc-footer__mark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt={tNav('logoAlt')} className="ewc-footer__logo" />
              <span className="ewc-footer__brand-text">{tNav('brandName')}</span>
            </div>
            <p className="ewc-footer__tag">{tFoot('tagline')}</p>
            <Link href={waHref} target="_blank" rel="noopener noreferrer" className="ewc-footer__wa">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{tNav('whatsappCta')}</span>
            </Link>
          </div>

          <div className="ewc-footer__cols">
            <div>
              <h6>{tFoot('quickLinks')}</h6>
              <ul>
                <li><Link href={`/${locale}`}>{tNav('home')}</Link></li>
                <li><a href={`/${locale}#products`}>{tNav('products')}</a></li>
                <li><a href={`/${locale}#services`}>{tNav('services')}</a></li>
                <li><a href={`/${locale}#reviews`}>{tNav('reviews')}</a></li>
                <li><Link href={`/${locale}/blog`}>{tNav('blog')}</Link></li>
              </ul>
            </div>
            <div>
              <h6>{tNav('locations')}</h6>
              <ul>
                {FOOTER_LOCATIONS.map((loc) => (
                  <li key={loc.slug}>
                    <Link href={`/${locale}/${siteConfig.productSlug}/${loc.slug}`}>{loc.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6>{tFoot('contact')}</h6>
              <ul>
                <li><Link href={waHref} target="_blank" rel="noopener noreferrer">{tNav('whatsapp')}</Link></li>
                <li><a href={`/${locale}#faq`}>{tNav('faq')}</a></li>
                <li><a href={`/${locale}#locations`}>{tNav('locations')}</a></li>
              </ul>
              <div className="ewc-footer__lang">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        <div className="ewc-footer__bottom">
          <p>{tFoot('copyright')}</p>
          <p className="ewc-footer__ssm">{tFoot('ssm')}</p>
        </div>
      </div>

      <style>{`
        .ewc-footer {
          background: #0F1B3A;
          color: #cbd5e1;
          padding: 72px 0 32px;
        }
        .ewc-footer__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 3vw, 32px);
        }
        .ewc-footer__top {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 768px) {
          .ewc-footer__top { grid-template-columns: 1fr 2fr; gap: 64px; }
        }
        .ewc-footer__brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 340px;
        }
        .ewc-footer__mark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .ewc-footer__logo { width: 36px; height: 36px; }
        .ewc-footer__brand-text {
          font-weight: 800;
          font-size: 16px;
          color: #fff;
          letter-spacing: -0.01em;
        }
        .ewc-footer__tag {
          margin: 0;
          color: #fff;
          font-size: 15px;
          line-height: 1.6;
        }
        .ewc-footer__wa {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          padding: 10px 16px;
          background: #25D366;
          color: #fff;
          font-weight: 700;
          font-size: 13.5px;
          border-radius: 999px;
          text-decoration: none;
          transition: background 0.18s ease, transform 0.18s ease;
        }
        .ewc-footer__wa:hover { background: #1EBE57; transform: translateY(-1px); }
        .ewc-footer__cols {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 28px;
        }
        .ewc-footer__cols h6 {
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #F47B20;
          margin: 0 0 14px;
        }
        .ewc-footer__cols ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .ewc-footer__cols li { margin-bottom: 10px; }
        /* Scope to <ul> links so the rule doesn't bleed into the language
           switcher pills (.lsw-item is also an <a> inside .ewc-footer__cols). */
        .ewc-footer__cols ul a {
          color: rgba(255,255,255,0.72);
          font-size: 14px;
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .ewc-footer__cols ul a:hover { color: #F47B20; }
        .ewc-footer__lang { margin-top: 16px; }
        .ewc-footer__bottom {
          margin-top: 56px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.10);
          display: flex;
          flex-wrap: wrap;
          gap: 8px 24px;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }
        .ewc-footer__bottom p { margin: 0; }
        .ewc-footer__ssm { color: rgba(255,255,255,0.4); }
        @media (max-width: 767px) {
          .ewc-footer { padding: 48px 0 28px; }
          .ewc-footer__top, .ewc-footer__brand, .ewc-footer__bottom {
            text-align: center;
            align-items: center;
          }
          .ewc-footer__brand { max-width: none; gap: 14px; }
          .ewc-footer__mark { justify-content: center; }
          .ewc-footer__wa { align-self: center; }
          .ewc-footer__cols { text-align: center; }
          .ewc-footer__lang { display: flex; justify-content: center; }
          .ewc-footer__bottom { justify-content: center; flex-direction: column; align-items: center; }
        }
      `}</style>
    </footer>
  );
}
