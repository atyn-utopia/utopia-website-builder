import { useTranslations } from 'next-intl'

const icons = ['★', '⚡', '✓', '♡']

export function WhyChoose() {
  const t = useTranslations('whyChoose')
  const reasons = [1, 2, 3, 4] as const
  return (
    <section className="section bg-jade-wash">
      <div className="container-p">
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 40px' }}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="t-h2" style={{ marginTop: 18 }}>{t('heading')}</h2>
        </div>
        <div
          className="why-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {reasons.map((n, i) => (
            <div
              key={n}
              style={{
                padding: '4px 18px',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(23,168,144,0.18)',
              }}
            >
              <div
                aria-hidden
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--brand-jade)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                {icons[i]}
              </div>
              <h3 className="t-h3">{t(`reason${n}.title`)}</h3>
              <p className="t-body" style={{ marginTop: 8 }}>
                {t(`reason${n}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 960px) {
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; row-gap: 36px !important; }
          .why-grid > div { border-left: none !important; padding: 0 !important; }
        }
        @media (max-width: 560px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
