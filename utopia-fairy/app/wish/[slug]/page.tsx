import WishStatus from './WishStatus'

export default async function WishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      width: '100%',
      maxWidth: 600,
    }}>
      <h1
        className="fade-in"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 34,
          fontWeight: 400,
          color: 'var(--accent-fairy)',
          letterSpacing: '3px',
          margin: 0,
          textShadow: '0 0 30px rgba(129, 212, 250, 0.3)',
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
        }}
      >
        Your wish is being granted...
      </p>
      <div className="fade-in" style={{ width: '100%', animationDelay: '0.3s' }}>
        <WishStatus slug={slug} />
      </div>
    </main>
  )
}
