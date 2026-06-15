import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif", margin: 0, background: '#F1F3F5' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '72px', fontWeight: 800, color: '#FF6B35', letterSpacing: '-0.03em', lineHeight: 1 }}>
              404
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#16213E', marginTop: '16px', marginBottom: '8px' }}>
              Page Not Found
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7B8D', lineHeight: 1.7, marginBottom: '24px' }}>
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/en"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                background: '#FF6B35',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
