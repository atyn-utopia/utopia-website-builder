import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { locations, cityDisplay } from '@/config/locations'
import { products } from '@/config/products'
import { currentYear } from '@/lib/utils'

interface Props { locale: string }

export function Footer({ locale }: Props) {
  const t = useTranslations('footer')
  const tp = useTranslations('products')
  const tn = useTranslations('nav')

  const topLocations = locations.slice(0, 8)

  return (
    <footer
      style={{
        background: 'var(--brand-charcoal)',
        color: 'rgba(255,255,255,0.75)',
        paddingTop: 72,
        paddingBottom: 40,
      }}
    >
      <div
        className="container-p footer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 48,
        }}
      >
        <div>
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 38, height: 38,
                background: 'var(--brand-jade)',
                borderRadius: 10,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 18,
              }}
            >C</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>{tn('brand')}</span>
          </Link>
          <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
            {t('tagline')}
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
            {t('servicesHeading')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: 14 }}>
            {products.map((p) => (
              <li key={p.key}>
                <a href="#services" className="footer-link">{tp(`${p.key}.title`)}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
            {t('locationsHeading')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: 14 }}>
            {topLocations.map((l) => (
              <li key={l.slug}>
                <Link href={`/${locale}/cat-rumah/${l.slug}`} className="footer-link">
                  {cityDisplay(l.slug, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
            {t('companyHeading')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: 14 }}>
            <li><a href="#services" className="footer-link">{t('about')}</a></li>
            <li><a href="#gallery" className="footer-link">{tn('gallery')}</a></li>
            <li><a href="#reviews" className="footer-link">{tn('reviews')}</a></li>
            <li><a href="#faq" className="footer-link">{tn('faq')}</a></li>
            <li><a href="#services" className="footer-link">{t('contact')}</a></li>
          </ul>
        </div>
      </div>
      <div
        className="container-p"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 56,
          paddingTop: 24,
          fontSize: 12,
          color: 'rgba(255,255,255,0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <span>{t('copyright', { year: currentYear() })}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>Nippon Paint</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>Jotun</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>Dulux</span>
        </span>
      </div>
      <style>{`
        .footer-link { color: rgba(255,255,255,0.65); transition: color 0.3s ease-out; }
        .footer-link:hover { color: var(--brand-jade-soft); }
        @media (max-width: 860px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
