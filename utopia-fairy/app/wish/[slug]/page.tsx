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
      alignItems: 'center',
      gap: 6,
      width: '100%',
      maxWidth: 760,
    }}>
      <div className="fade-in" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(79, 195, 247, 0.08)',
            border: '1px solid var(--input-border)',
            borderRadius: 10,
            padding: '8px 14px',
            color: 'var(--accent-fairy)',
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.3px',
          }}
        >
          ← Back to Monitor
        </Link>
      </div>
      <h1
        className="fade-in"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 6vw, 34px)',
          fontWeight: 400,
          color: 'var(--accent-fairy)',
          letterSpacing: '3px',
          margin: 0,
          textShadow: '0 0 30px rgba(129, 212, 250, 0.3)',
          textAlign: 'center',
        }}
      >
        Utopia Fairy
      </h1>
      <p
        className="fade-in"
        style={{
          color: 'var(--text-muted)',
          fontSize: 14,
          marginBottom: 20,
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          letterSpacing: '0.3px',
          animationDelay: '0.15s',
          textAlign: 'center',
        }}
      >
        Your wish is being granted...
      </p>
      <div className="fade-in" style={{ width: '100%', animationDelay: '0.3s' }}>
        <WishStatus slug={slug} />
      </div>

      <div className="fade-in" style={{ width: '100%', marginTop: 40, animationDelay: '0.45s' }}>
        <WishChecklist slug={slug} />
      </div>

      <div className="fade-in" style={{ width: '100%', marginTop: 40, animationDelay: '0.6s' }}>
        <WishData slug={slug} />
      </div>
    </main>
  )
}
