import { useTranslations } from 'next-intl'

export function FomoBanner() {
  const t = useTranslations('fomo')
  return (
    <div
      style={{
        background: 'var(--brand-coral)',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.01em',
      }}
    >
      {t('text')}
    </div>
  )
}
