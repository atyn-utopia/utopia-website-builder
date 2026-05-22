import Link from 'next/link'
import WishStatus from './WishStatus'
import WishChecklist from '@/components/WishChecklist'
import WishData from '@/components/WishData'

export default async function WishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      width: '100%',
      maxWidth: 880,
    }}>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          color: 'var(--text-muted)',
          fontSize: 12,
          fontWeight: 500,
          alignSelf: 'flex-start',
          padding: '6px 14px',
          marginLeft: -8,
          borderRadius: 'var(--radius-pill)',
          transition: 'color var(--transition-snap)',
        }}
      >
        ← All projects
      </Link>

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
    </main>
  )
}
