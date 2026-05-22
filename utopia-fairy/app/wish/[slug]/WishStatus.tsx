'use client'

import { useState, useEffect, useCallback } from 'react'

const BUILD_MESSAGES = [
  'Designing system architecture…',
  'Planning SEO keywords + page hierarchy…',
  'Generating homepage + location copy…',
  'Drafting unique design direction…',
  'Wiring i18n routing + tracking…',
  'Inserting product rows into Supabase…',
  'Generating blog articles…',
  'Pushing to GitHub + Vercel…',
  'Almost there…',
]

export default function WishStatus({ slug }: { slug: string }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [deployUrl, setDeployUrl] = useState('')
  const [localUrl, setLocalUrl] = useState('')
  const [checking, setChecking] = useState(false)
  const [copied, setCopied] = useState(false)

  const projectPath = `projects/${slug}/`
  const claudeCommand = `claude "Using @CLAUDE.md files, generate the ${slug} website. Read projects/${slug}/inputs.md for the project brief."`

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % BUILD_MESSAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Auto-check status every 15 seconds
  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 15000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const copyCommand = async () => {
    await navigator.clipboard.writeText(claudeCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const checkStatus = useCallback(async () => {
    setChecking(true)
    try {
      const res = await fetch(`/api/check-status?slug=${slug}`)
      const data = await res.json()
      if (data.deployUrl) setDeployUrl(data.deployUrl)
      if (data.localUrl) setLocalUrl(data.localUrl)
    } catch {
      // silently fail
    }
    setChecking(false)
  }, [slug])

  const liveUrl = deployUrl || localUrl
  const isDeployed = !!deployUrl

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      {liveUrl ? (
        <div className="uf-card" style={{
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: isDeployed ? 'var(--status-pass-bg)' : 'var(--accent-bg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span className="uf-eyebrow" style={{ color: isDeployed ? 'var(--status-pass)' : 'var(--text-secondary)' }}>
              {isDeployed ? '● Live' : '● Preview'}
            </span>
            <code style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              {liveUrl}
            </code>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: isDeployed ? 'var(--status-pass)' : 'var(--text-primary)',
                color: isDeployed ? 'var(--bg-base)' : 'var(--bg-base)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'opacity var(--transition-snap)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              {isDeployed ? 'Visit website →' : 'Open preview →'}
            </a>
            {localUrl && deployUrl && (
              <a
                href={localUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-soft)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Local: {localUrl.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="uf-card" style={{
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--status-warn)',
              animation: 'pulseDot 1.6s ease-in-out infinite',
            }} />
            <span className="uf-eyebrow" style={{ color: 'var(--status-warn)' }}>Building</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13.5, fontFamily: 'var(--font-sans)' }}>
            {BUILD_MESSAGES[messageIndex]}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Project scaffolded at <code style={{ background: 'var(--bg-input)', padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{projectPath}</code>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500, letterSpacing: 0.3 }}>
              Paste this into Claude Code to start building:
            </span>
            <div
              onClick={copyCommand}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11.5,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                lineHeight: 1.55,
                wordBreak: 'break-all',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)' }}
            >
              {claudeCommand}
            </div>
            <button
              onClick={copyCommand}
              style={{
                background: copied ? 'var(--status-pass-bg)' : 'var(--text-primary)',
                color: copied ? 'var(--status-pass)' : 'var(--bg-base)',
                border: copied ? '1px solid var(--status-pass-border)' : 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 18px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                alignSelf: 'flex-start',
                transition: 'opacity var(--transition-snap)',
              }}
            >
              {copied ? '✓ Copied' : 'Copy command'}
            </button>
          </div>
        </div>
      )}

      <div style={{ color: 'var(--text-quiet)', fontSize: 11, textAlign: 'left' }}>
        {checking ? 'Checking status…' : 'Auto-checking every 15 seconds'}
      </div>

      <style jsx>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
