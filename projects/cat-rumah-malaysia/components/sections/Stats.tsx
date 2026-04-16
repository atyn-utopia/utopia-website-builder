import { useTranslations } from 'next-intl'

export function Stats() {
  const t = useTranslations('stats')
  const items = [
    { num: t('rating'), label: t('ratingLabel') },
    { num: t('homes'), label: t('homesLabel') },
    { num: t('years'), label: t('yearsLabel') },
    { num: t('brands'), label: t('brandsLabel') },
  ]
  return (
    <section className="bg-cream" style={{ paddingBottom: 'clamp(40px, 5vw, 72px)' }}>
      <div className="container-p">
        <div
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            borderTop: '1px solid var(--brand-border)',
            borderBottom: '1px solid var(--brand-border)',
            padding: '36px 0',
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                borderLeft: i === 0 ? 'none' : '1px solid var(--brand-border)',
                padding: '8px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--brand-charcoal)',
                  lineHeight: 1,
                }}
              >
                {it.num}
              </div>
              <div
                style={{
                  width: 24,
                  height: 2,
                  background: 'var(--brand-coral)',
                  margin: '10px auto 12px',
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--brand-muted)',
                }}
              >
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; row-gap: 28px !important; }
          .stats-grid > div { border-left: none !important; }
        }
      `}</style>
    </section>
  )
}
