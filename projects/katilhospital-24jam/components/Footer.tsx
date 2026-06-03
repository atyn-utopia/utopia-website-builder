'use client';

import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import WhatsAppButton from '@/components/WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

const FEATURED_CITIES: { slug: string; name: string }[] = [
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur' },
  { slug: 'petaling-jaya', name: 'Petaling Jaya' },
  { slug: 'shah-alam', name: 'Shah Alam' },
  { slug: 'subang-jaya', name: 'Subang Jaya' },
  { slug: 'johor-bahru', name: 'Johor Bahru' },
  { slug: 'klang', name: 'Klang' },
  { slug: 'george-town', name: 'George Town' },
  { slug: 'ipoh', name: 'Ipoh' },
  { slug: 'kuantan', name: 'Kuantan' },
  { slug: 'kota-kinabalu', name: 'Kota Kinabalu' },
  { slug: 'kuching', name: 'Kuching' },
];

const PRODUCT_SLUGS = [
  'katil-hospital-manual-1-fungsi',
  'katil-hospital-manual-2-fungsi',
  'katil-hospital-elektrik-3-fungsi',
  'tilam-hospital-foam',
  'tilam-angin-anti-decubitus',
  'mesin-oksigen',
  'kerusi-roda',
  'mesin-cpap',
];

const PRODUCT_LABELS: Record<string, Record<string, string>> = {
  ms: {
    'katil-hospital-manual-1-fungsi': 'Katil Hospital Manual 1-Fungsi',
    'katil-hospital-manual-2-fungsi': 'Katil Hospital Manual 2-Fungsi',
    'katil-hospital-elektrik-3-fungsi': 'Katil Hospital Elektrik 3-Fungsi',
    'tilam-hospital-foam': 'Tilam Hospital Foam',
    'tilam-angin-anti-decubitus': 'Tilam Angin Anti-Decubitus',
    'mesin-oksigen': 'Mesin Oksigen',
    'kerusi-roda': 'Kerusi Roda',
    'mesin-cpap': 'Mesin CPAP',
  },
  en: {
    'katil-hospital-manual-1-fungsi': 'Manual 1-Function Hospital Bed',
    'katil-hospital-manual-2-fungsi': 'Manual 2-Function Hospital Bed',
    'katil-hospital-elektrik-3-fungsi': 'Electric 3-Function Hospital Bed',
    'tilam-hospital-foam': 'Hospital Foam Mattress',
    'tilam-angin-anti-decubitus': 'Anti-Decubitus Air Mattress',
    'mesin-oksigen': 'Oxygen Concentrator',
    'kerusi-roda': 'Wheelchair',
    'mesin-cpap': 'CPAP Machine',
  },
  zh: {
    'katil-hospital-manual-1-fungsi': '单功能手动病床',
    'katil-hospital-manual-2-fungsi': '双功能手动病床',
    'katil-hospital-elektrik-3-fungsi': '三功能电动病床',
    'tilam-hospital-foam': '医用泡沫床垫',
    'tilam-angin-anti-decubitus': '防褥疮气垫床',
    'mesin-oksigen': '家用制氧机',
    'kerusi-roda': '轮椅',
    'mesin-cpap': 'CPAP 呼吸机',
  },
};

export default function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const locale = useLocale();
  const waHref = waRedirect(locale);
  const labels = PRODUCT_LABELS[locale] || PRODUCT_LABELS.ms;

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #1c3a6a 0%, #0B1120 60%, #050711 100%)',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '56px 20px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 40,
        }}
      >
        {/* Col A — Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/brand/logo/logo-light.svg"
              alt="Katil Hospital 24 Jam"
              style={{ height: 38, width: 'auto' }}
            />
          </div>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.65,
              maxWidth: 280,
            }}
          >
            {t('brand.tagline')}
          </p>
          <div>
            <WhatsAppButton href={waHref} label={navT('cta')} variant="compact" />
          </div>
        </div>

        {/* Col B — Produk */}
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 16,
            }}
          >
            {t('products.heading')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRODUCT_SLUGS.map((slug) => (
              <li key={slug}>
                <a
                  href={`/${locale}#product-${slug}`}
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {labels[slug]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col C — Lokasi */}
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 16,
            }}
          >
            {t('locations.heading')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEATURED_CITIES.map((c) => (
              <li key={c.slug}>
                <a
                  href={`/${locale}/katil-hospital/${c.slug}`}
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {c.name}
                </a>
              </li>
            ))}
            <li style={{ marginTop: 6 }}>
              <a
                href={`/${locale}/sitemap.xml`}
                style={{
                  color: '#F87171',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {t('locations.all')}
              </a>
            </li>
          </ul>
        </div>

        {/* Col D — Language */}
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 16,
            }}
          >
            {t('language.heading')}
          </h4>
          <LanguageSwitcher variant="on-dark" />
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '18px 20px',
          textAlign: 'center',
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {t('copyright')}
      </div>
    </footer>
  );
}
