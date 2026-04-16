import { useTranslations } from 'next-intl'

interface Props {
  /** Optional extra FAQs (location page). If provided, they replace the homepage list. */
  items?: Array<{ q: string; a: string }>
  heading?: string
}

export function Faq({ items, heading }: Props) {
  const t = useTranslations('faq')
  const list =
    items && items.length > 0
      ? items
      : [1, 2, 3, 4, 5, 6].map((n) => ({ q: t(`q${n}`), a: t(`a${n}`) }))

  return (
    <section id="faq" className="section bg-cream">
      <div className="container-p" style={{ maxWidth: 860 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="t-h2" style={{ marginTop: 18 }}>{heading ?? t('heading')}</h2>
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          {list.map((it, i) => (
            <details key={i} className="faq-row">
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
