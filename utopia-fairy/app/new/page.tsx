import Link from 'next/link'
import GenieForm from '@/components/GenieForm'

export default function NewWishPage() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 6,
      width: '100%',
      maxWidth: 560,
      margin: '0 auto',
    }}>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-muted)',
          fontSize: 12,
          fontWeight: 500,
          alignSelf: 'flex-start',
          padding: '6px 14px',
          marginLeft: -8,
          borderRadius: 'var(--radius-pill)',
          marginBottom: 20,
        }}
      >
        ← All projects
      </Link>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 4,
        marginBottom: 8,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/utopia-wizard-logo.png"
          alt="Utopia Wizard"
          className="fade-in uf-logo"
          style={{
            width: 112,
            height: 112,
            marginBottom: -10,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <h1
            className="fade-in"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 30,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.1,
              animationDelay: '0.05s',
            }}
          >
            Utopia Wizard
          </h1>
          <p
            className="fade-in"
            style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.3,
              animationDelay: '0.1s',
            }}
          >
            Website Builder &amp; Monitor
          </p>
        </div>
        <p
          className="fade-in"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontFamily: 'var(--font-sans)',
            margin: '8px 0 16px',
            lineHeight: 1.55,
            animationDelay: '0.18s',
            maxWidth: 420,
          }}
        >
          Your wish is my command — what website shall I create today?
        </p>
      </div>

      <div className="fade-in" style={{ animationDelay: '0.28s' }}>
        <GenieForm />
      </div>
    </main>
  )
}
