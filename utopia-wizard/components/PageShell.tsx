import BackLink from './BackLink'

/**
 * Consistent secondary-page wrapper. The outer container matches the topbar
 * width (1400) so the back button always sits in the SAME position — aligned
 * with the topbar logo — on every page. Content sits at a per-page `maxWidth`
 * directly under it.
 */
export default function PageShell({
  backLabel,
  backHref = '/',
  maxWidth = 820,
  children,
}: {
  backLabel?: string
  backHref?: string
  maxWidth?: number
  children: React.ReactNode
}) {
  return (
    <main style={{ width: '100%', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {backLabel ? <BackLink href={backHref} label={backLabel} /> : null}
      <div style={{ width: '100%', maxWidth, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {children}
      </div>
    </main>
  )
}
