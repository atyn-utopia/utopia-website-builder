'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Wish {
  slug: string
  prompt: string
  createdAt: string
  status: 'deployed' | 'preview' | 'building'
  deployUrl: string | null
  localUrl: string | null
}

export default function WishHistory() {
  const [open, setOpen] = useState(false)
  const [wishes, setWishes] = useState<Wish[]>([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchWishes = () => {
      fetch('/api/wishes')
        .then(r => r.json())
        .then(data => setWishes(data.wishes || []))
        .catch(() => {})
    }
    fetchWishes()
    const interval = setInterval(fetchWishes, 15000)
    return () => clearInterval(interval)
  }, [pathname]) // refetch when page changes + poll every 15s

  const statusDot = (status: string) => {
    const colors: Record<string, string> = {
      deployed: '#4ade80',
      preview: '#7EC8E3',
      building: '#F9A96A',
    }
    return colors[status] || '#607080'
  }

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      deployed: 'Live',
      preview: 'Preview',
      building: 'Building',
    }
    return labels[status] || 'Unknown'
  }

  return (
    <>
      {/* Toggle button — fixed on left edge */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          left: open ? 280 : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1001,
          background: 'rgba(14, 42, 74, 0.95)',
          border: '1px solid var(--input-border)',
          borderLeft: open ? '1px solid var(--input-border)' : 'none',
          borderRadius: open ? '0 8px 8px 0' : '0 8px 8px 0',
          padding: '8px 12px',
          color: 'var(--accent-fairy)',
          cursor: 'pointer',
          fontSize: 13,
          transition: 'left 0.3s ease',
          backdropFilter: 'blur(12px)',
          whiteSpace: 'nowrap',
        }}
      >
        {open ? '✕' : '✦ History'}
      </button>

      {/* Sidebar panel */}
      <div
        style={{
          position: 'fixed',
          left: open ? 0 : -280,
          top: 0,
          bottom: 0,
          width: 280,
          zIndex: 1000,
          background: 'rgba(10, 22, 40, 0.97)',
          borderRight: '1px solid var(--input-border)',
          backdropFilter: 'blur(16px)',
          transition: 'left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 16px 12px',
          borderBottom: '1px solid var(--input-border)',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            color: 'var(--accent-fairy)',
            letterSpacing: '1px',
          }}>
            Wish History
          </div>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: 12,
            marginTop: 4,
          }}>
            {wishes.length} project{wishes.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Wish list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 0',
        }}>
          {wishes.length === 0 && (
            <div style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              textAlign: 'center',
              padding: '32px 16px',
              opacity: 0.6,
            }}>
              No wishes yet
            </div>
          )}

          {wishes.map((wish) => {
            const isActive = pathname === `/wish/${wish.slug}`
            return (
              <button
                key={wish.slug}
                onClick={() => {
                  router.push(`/wish/${wish.slug}`)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  width: '100%',
                  padding: '12px 16px',
                  background: isActive ? 'rgba(79, 195, 247, 0.08)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(79, 195, 247, 0.04)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* Slug + status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                  <span style={{
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                  }}>
                    {wish.slug}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 10,
                    color: statusDot(wish.status),
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: statusDot(wish.status),
                      display: 'inline-block',
                    }} />
                    {statusLabel(wish.status)}
                  </span>
                </div>

                {/* Prompt preview */}
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: 11,
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  display: 'block',
                }}>
                  {wish.prompt || 'No prompt'}
                </span>

                {/* Date */}
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: 10,
                  opacity: 0.5,
                }}>
                  {new Date(wish.createdAt).toLocaleDateString('en-MY', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </button>
            )
          })}
        </div>

        {/* New wish button */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--input-border)',
        }}>
          <button
            onClick={() => { router.push('/'); setOpen(false) }}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--accent-deep), var(--accent-glow))',
              border: 'none',
              borderRadius: 10,
              padding: '10px 0',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            ✦ New Wish
          </button>
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
        />
      )}
    </>
  )
}
