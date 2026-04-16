import { useTranslations } from 'next-intl'
import { swatchChips } from '@/config/products'

export function HowItWorks() {
  const t = useTranslations('howItWorks')
  const steps = [1, 2, 3] as const
  return (
    <section className="section bg-cream">
      <div className="container-p">
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 44px' }}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="t-h2" style={{ marginTop: 18 }}>{t('heading')}</h2>
          <p className="t-lead" style={{ marginTop: 14 }}>{t('subheading')}</p>
        </div>

        <div
          className="steps-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 36,
            position: 'relative',
          }}
        >
          {steps.map((n, i) => (
            <div key={n} style={{ textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  border: '2px solid var(--brand-jade)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  fontWeight: 800,
                  color: 'var(--brand-jade)',
                  background: '#fff',
                  letterSpacing: '-0.04em',
                }}
              >
                {n}
              </div>
              {i < 2 ? (
                <div
                  aria-hidden
                  className="step-connector"
                  style={{
                    position: 'absolute',
                    top: 48,
                    left: 'calc(50% + 60px)',
                    width: 'calc(100% - 120px)',
                    borderTop: '2px dashed var(--brand-jade)',
                    opacity: 0.5,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: -6,
                      transform: 'translateX(-50%)',
                      width: 14,
                      height: 14,
                      background: swatchChips[1],
                      borderRadius: 3,
                    }}
                  />
                </div>
              ) : null}
              <h3 className="t-h3">{t(`step${n}.title`)}</h3>
              <p className="t-body" style={{ marginTop: 10, maxWidth: 320, margin: '10px auto 0' }}>
                {t(`step${n}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .steps-grid { grid-template-columns: 1fr !important; gap: 44px !important; }
          .step-connector { display: none; }
        }
      `}</style>
    </section>
  )
}
