import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';

const FOOTER_CITY_SLUGS = [
  'kuala-lumpur',
  'petaling-jaya',
  'shah-alam',
  'johor-bahru',
  'george-town',
  'ipoh',
  'kota-kinabalu',
  'kuching',
];

export default async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const nav = await getTranslations({ locale, namespace: 'nav' });

  const footerCities = FOOTER_CITY_SLUGS
    .map((slug) => locations.find((l) => l.slug === slug))
    .filter(Boolean) as typeof locations;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src="/brand/logo-light.svg" alt={nav('logoAlt')} />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: 340 }}>{t('tagline')}</p>
          </div>
          <div>
            <h5>{t('quickLinks')}</h5>
            <ul>
              <li><Link href={`/${locale}#services`}>{nav('services')}</Link></li>
              <li><Link href={`/${locale}#how`}>{nav('howItWorks')}</Link></li>
              <li><Link href={`/${locale}#gallery`}>{nav('gallery')}</Link></li>
              <li><Link href={`/${locale}#reviews`}>{nav('reviews')}</Link></li>
              <li><Link href={`/${locale}/blog`}>{nav('blog')}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{t('coverage')}</h5>
            <ul>
              {footerCities.map((l) => (
                <li key={l.slug}>
                  <Link href={`/${locale}/${siteConfig.productSlug}/${l.slug}`}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('copyright')}</span>
          <span>{t('ssm')}</span>
        </div>
      </div>
    </footer>
  );
}
