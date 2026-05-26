const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-label="Google">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

type Review = { text: string; name: string; city: string }

export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const doubled = [...reviews, ...reviews]
  const duration = `${reviews.length * 5}s`

  return (
    <div
      className="relative overflow-hidden"
      style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
    >
      <div
        className="marquee-track flex gap-5 w-max py-2"
        style={{ '--marquee-duration': duration } as React.CSSProperties}
      >
        {doubled.map((review, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl p-6 shrink-0 w-80"
            style={{
              background: 'var(--brand-white)',
              boxShadow: '0 4px 20px rgba(10,37,53,0.07)',
              border: '1px solid var(--brand-border)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ color: '#F59E0B' }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <GoogleIcon />
            </div>

            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--brand-text)' }}>
              &ldquo;{review.text}&rdquo;
            </p>

            <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--brand-border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'var(--brand-primary)' }}>
                {review.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--brand-dark)' }}>{review.name}</p>
                <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{review.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
