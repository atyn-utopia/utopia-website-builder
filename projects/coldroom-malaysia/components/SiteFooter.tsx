import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BrandMark } from '@/components/BrandMark';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';

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
    <footer className="surface-steel-dark" style={{ padding: '60px 0 28px' }}>
      <div className="section-container footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 36 }}>
        <div>
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BrandMark size={36} />
            <span style={{ fontWeight: 800, color: '#fff', fontSize: 17 }}>{t('nav.brandName')}</span>
          </Link>
          <p style={{ marginTop: 14, color: 'rgba(255,255,255,0.6)', fontSize: 13, maxWidth: 320 }}>{t('footer.tagline')}</p>
          <div style={{ marginTop: 16, height: 2, width: 60, background: 'var(--cold-amber)', borderRadius: 2 }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('footer.cols.products')}</div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FOOTER_TIERS.map((slug) => (
              <li key={slug}>
                <Link href={`/${locale}#cold-room-rental`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  {t(`hero.tempLabels.${slug}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('footer.cols.cities')}</div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FOOTER_CITIES.map((slug) => {
              const c = locations.find((l) => l.slug === slug);
              if (!c) return null;
              const display = locale === 'zh' ? c.name_zh : locale === 'ms' ? (c.name_ms ?? c.name) : c.name;
              return (
                <li key={slug}>
                  <Link href={`/${locale}/${siteConfig.productSlug}/${slug}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                    {display}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('footer.cols.languages')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(['en', 'ms', 'zh'] as const).map((l) => (
              <Link key={l} href={`/${l}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {l === 'en' ? 'English' : l === 'ms' ? 'Bahasa Melayu' : '中文'}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="section-container" style={{ marginTop: 36, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>© {new Date().getFullYear()} {t('nav.brandName')}. {t('footer.rights')}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{t('footer.poweredBy')}</span>
      </div>
    </footer>
  );
}
