import WishStatus from './WishStatus'
import WishChecklist from '@/components/WishChecklist'
import WishData from '@/components/WishData'
import WishDangerZone from '@/components/WishDangerZone'
import PageShell from '@/components/PageShell'

export default async function WishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <PageShell backLabel="All Projects" maxWidth={880}>
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border-soft)',
      }}>
        <span className="uf-eyebrow">Project</span>
        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(20px, 4vw, 26px)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          margin: 0,
        }}>
          {slug}
        </h1>
      </header>

      <div className="fade-in" style={{ width: '100%' }}>
        <WishStatus slug={slug} />
      </div>

      <div className="fade-in" style={{ width: '100%', marginTop: 16, animationDelay: '0.1s' }}>
        <WishChecklist slug={slug} />
      </div>

      <div className="fade-in" style={{ width: '100%', marginTop: 16, animationDelay: '0.2s' }}>
        <WishData slug={slug} />
      </div>

      <div className="fade-in" style={{ width: '100%', marginTop: 24, animationDelay: '0.3s' }}>
        <WishDangerZone slug={slug} />
      </div>
    </PageShell>
  )
}
