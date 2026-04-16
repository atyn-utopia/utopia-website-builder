import { useTranslations } from 'next-intl'

export function RiskProblem() {
  const t = useTranslations('riskProblem')
  const problems = [1, 2, 3, 4] as const
  return (
    <section className="section bg-elevated">
      <div className="container-p">
        <div
          className="risk-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'center',
          }}
        >
          <div>
            <span className="eyebrow">{t('eyebrow')}</span>
            <h2 className="t-h2" style={{ marginTop: 18 }}>{t('heading')}</h2>
            <p className="t-lead" style={{ marginTop: 16 }}>{t('body')}</p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 18 }}>
            {problems.map((n) => (
              <li
                key={n}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '18px 20px',
                  background: 'var(--brand-cream)',
                  borderRadius: 16,
                  border: '1px solid var(--brand-border)',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--brand-coral-soft)',
                    color: 'var(--brand-coral)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  ✕
                </span>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--brand-charcoal)' }}>
                    {t(`problem${n}.title`)}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--brand-body)', marginTop: 4, lineHeight: 1.65 }}>
                    {t(`problem${n}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .risk-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  )
}
