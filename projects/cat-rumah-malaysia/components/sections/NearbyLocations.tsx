import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { cityDisplay, locationBySlug } from '@/config/locations'

interface Props { locale: string; slugs: string[] }

export function NearbyLocations({ locale, slugs }: Props) {
  const t = useTranslations('location')
  const items = slugs.map((s) => locationBySlug(s)).filter((v): v is NonNullable<typeof v> => !!v)
  if (items.length === 0) return null

  return (
    <section className="section bg-cream" style={{ paddingTop: 'clamp(40px, 5vw, 72px)' }}>
      <div className="container-p" style={{ maxWidth: 860 }}>
        <h2 className="t-h3" style={{ marginBottom: 24 }}>{t('nearbyHeading')}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
          className="nearby-grid"
        >
          {items.map((l) => (
            <Link
              key={l.slug}
              href={`/${locale}/cat-rumah/${l.slug}`}
              className="nearby-card"
              style={{
                display: 'block',
                padding: '20px 22px',
                background: '#fff',
                border: '1px solid var(--brand-border)',
                borderRadius: 16,
                transition: 'transform 0.3s ease-out, border-color 0.3s ease-out',
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--brand-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {l.state}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-charcoal)', marginTop: 6 }}>
                {cityDisplay(l.slug, locale)} →
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .nearby-card:hover { transform: translateY(-3px); border-color: var(--brand-jade); }
        @media (max-width: 720px) { .nearby-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
