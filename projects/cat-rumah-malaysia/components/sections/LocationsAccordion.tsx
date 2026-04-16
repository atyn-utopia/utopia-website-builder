import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { locations, cityDisplay, type LocationRegion } from '@/config/locations'

const regionOrder: LocationRegion[] = ['klangValley', 'southern', 'northern']

interface Props { locale: string }

export function LocationsAccordion({ locale }: Props) {
  const t = useTranslations('locations')
  const grouped: Record<LocationRegion, typeof locations> = {
    klangValley: [],
    southern: [],
    northern: [],
  }
  for (const l of locations) grouped[l.region].push(l)

  return (
    <section id="locations" className="section bg-elevated">
      <div className="container-p">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="t-h2" style={{ marginTop: 18 }}>{t('heading')}</h2>
          <p className="t-lead" style={{ marginTop: 14 }}>{t('subheading')}</p>
        </div>

        <div style={{ display: 'grid', gap: 16, maxWidth: 860, margin: '0 auto' }}>
          {regionOrder.map((region) => {
            const items = grouped[region]
            if (items.length === 0) return null
            return (
              <details
                key={region}
                className="loc-region"
                open={region === 'klangValley'}
                style={{
                  background: 'var(--brand-cream)',
                  border: '1px solid var(--brand-border)',
                  borderRadius: 16,
                  padding: '18px 24px',
                }}
              >
                <summary
                  style={{
                    listStyle: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--brand-charcoal)' }}>
                      {t(`regions.${region}`)}
                    </span>
                    <span
                      style={{
                        background: 'var(--brand-jade-soft)',
                        color: 'var(--brand-jade-dark)',
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {items.length}
                    </span>
                  </span>
                  <span style={{ color: 'var(--brand-jade)', fontSize: 22, fontWeight: 700 }} aria-hidden>
                    ⌄
                  </span>
                </summary>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    marginTop: 18,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                  }}
                  className="loc-list"
                >
                  {items.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/${locale}/cat-rumah/${l.slug}`}
                        style={{
                          display: 'block',
                          padding: '10px 14px',
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--brand-charcoal)',
                          transition: 'background-color 0.3s ease-out',
                        }}
                        className="loc-link"
                      >
                        {cityDisplay(l.slug, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )
          })}
        </div>
      </div>
      <style>{`
        details.loc-region summary::-webkit-details-marker { display: none; }
        .loc-link:hover { background: var(--brand-jade-wash); }
        @media (max-width: 640px) {
          .loc-list { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
