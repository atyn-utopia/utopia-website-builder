'use client';

import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import WhatsAppButton from '@/components/WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

const FEATURED_CITIES: { slug: string; name: string }[] = [
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur' },
  { slug: 'petaling-jaya', name: 'Petaling Jaya' },
  { slug: 'johor-bahru', name: 'Johor Bahru' },
  { slug: 'george-town', name: 'Penang' },
  { slug: 'ipoh', name: 'Ipoh' },
  { slug: 'kota-kinabalu', name: 'Kota Kinabalu' },
];

const PRODUCT_SLUGS = [
  'katil-hospital-manual-2-fungsi',
  'katil-hospital-elektrik-3-fungsi',
  'tilam-angin-anti-decubitus',
  'mesin-oksigen',
  'kerusi-roda',
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
          padding: '32px 20px 16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}
      >
        {/* Col A — Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/brand/logo/logo-light.svg"
              alt="Katil Hospital 24 Jam"
              style={{ height: 30, width: 'auto' }}
            />
          </div>
          <p
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.5,
              maxWidth: 260,
              margin: 0,
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
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              margin: '0 0 10px',
            }}
          >
            {t('products.heading')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {PRODUCT_SLUGS.map((slug) => (
              <li key={slug}>
                <a
                  href={`/${locale}#product-${slug}`}
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.45,
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
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              margin: '0 0 10px',
            }}
          >
            {t('locations.heading')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {FEATURED_CITIES.map((c) => (
              <li key={c.slug}>
                <a
                  href={`/${locale}/katil-hospital/${c.slug}`}
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.45,
                  }}
                >
                  {c.name}
                </a>
              </li>
            ))}
            <li style={{ marginTop: 4 }}>
              <a
                href={`/${locale}/sitemap.xml`}
                style={{
                  color: '#F87171',
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.45,
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
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              margin: '0 0 10px',
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
          padding: '12px 20px',
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
