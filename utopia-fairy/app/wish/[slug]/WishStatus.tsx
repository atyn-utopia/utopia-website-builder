'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const MAGICAL_MESSAGES = [
  '✦ Summoning the fairy team...',
  '✧ Gathering stardust for your project...',
  '✦ Alpha is designing the architecture...',
  '✧ Weaving the blueprint of your website...',
  '✦ Sora is planning your SEO strategy...',
  '✧ Cyclops is preparing the database...',
  '✦ Nana is writing enchanted copy...',
  '✧ Sprinkling magic across every page...',
  '✦ Kagura is crafting a unique design...',
  '✧ Kimmy is casting technical spells...',
  '✦ Almost there... polishing the final touches...',
  '✧ Your website is taking shape...',
]

export default function WishStatus({ slug }: { slug: string }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [deployUrl, setDeployUrl] = useState('')
  const [localUrl, setLocalUrl] = useState('')
  const [checking, setChecking] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const projectPath = `projects/${slug}/`
  const claudeCommand = `claude "Using @CLAUDE.md files, generate the ${slug} website. Read projects/${slug}/inputs.md for the project brief."`

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MAGICAL_MESSAGES.length)
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

  // The current best URL — deploy takes priority over local
  const liveUrl = deployUrl || localUrl
  const isDeployed = !!deployUrl

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      padding: '20px 0',
    }}>
      {/* Fairy image */}
      <div className="fairy-container">
        <div className="fairy-glow" />
        <img
          src="/fairy.gif"
          alt="Fairy working"
          style={{
            width: 80,
            height: 80,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 15px rgba(79, 195, 247, 0.4))',
          }}
        />
      </div>

      {/* Live URL banner — shows when localhost or Vercel is available */}
      {liveUrl && (
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          padding: '20px 0',
          borderRadius: 14,
          background: isDeployed
            ? 'rgba(74, 222, 128, 0.06)'
            : 'rgba(79, 195, 247, 0.06)',
          border: `1px solid ${isDeployed ? 'rgba(74, 222, 128, 0.2)' : 'rgba(79, 195, 247, 0.15)'}`,
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: isDeployed ? '#4ade80' : 'var(--accent-fairy)',
            letterSpacing: '0.5px',
          }}>
            {isDeployed ? 'Your website is live!' : 'Preview Available'}
          </div>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: isDeployed
                ? 'linear-gradient(135deg, #059669, #10b981)'
                : 'linear-gradient(135deg, var(--accent-deep), var(--accent-glow))',
              color: 'white',
              padding: '12px 28px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
              boxShadow: isDeployed
                ? '0 4px 20px rgba(16, 185, 129, 0.3)'
                : '0 4px 20px rgba(79, 195, 247, 0.3)',
              transition: 'transform 0.2s',
            }}
          >
            {isDeployed ? '✦ Visit Your Website' : '✦ Open Preview'}
          </a>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: 12,
            fontFamily: 'monospace',
          }}>
            {liveUrl}
          </div>
          {localUrl && deployUrl && (
            <div style={{ color: 'var(--text-muted)', fontSize: 11, opacity: 0.6 }}>
              Local: {localUrl}
            </div>
          )}
        </div>
      )}

      {/* Rotating magical messages */}
      {!isDeployed && (
        <>
          <div
            key={messageIndex}
            style={{
              color: 'var(--accent-fairy)',
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              textAlign: 'center',
              textShadow: '0 0 15px rgba(129, 212, 250, 0.2)',
              animation: 'fadeUp 0.5s ease-out',
              minHeight: 24,
            }}
          >
            {MAGICAL_MESSAGES[messageIndex]}
          </div>

          {/* Sparkle progress dots */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px rgba(79, 195, 247, 0.5)',
                  animation: `pulse 1.5s ${i * 0.3}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Project info */}
      <div style={{
        color: 'var(--text-muted)',
        fontSize: 13,
        textAlign: 'center',
      }}>
        Project created at <code className="success-code">{projectPath}</code>
      </div>

      {/* Copy command section */}
      {!isDeployed && (
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
        }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
            Paste this into Claude Code terminal to start building:
          </div>
          <div
            onClick={copyCommand}
            style={{
              width: '100%',
              background: 'rgba(79, 195, 247, 0.06)',
              border: '1px solid var(--input-border)',
              borderRadius: 10,
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'var(--accent-fairy)',
              cursor: 'pointer',
              lineHeight: 1.5,
              wordBreak: 'break-all',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
          >
            {claudeCommand}
          </div>
          <button
            onClick={copyCommand}
            style={{
              background: copied
                ? 'rgba(74, 222, 128, 0.15)'
                : 'linear-gradient(135deg, var(--accent-deep), var(--accent-glow))',
              border: 'none',
              borderRadius: 10,
              padding: '10px 28px',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'transform 0.2s',
              boxShadow: copied ? 'none' : '0 4px 15px rgba(79, 195, 247, 0.25)',
            }}
          >
            {copied ? '✓ Copied!' : '✦ Copy Command'}
          </button>
        </div>
      )}

      {/* Status check info */}
      <div style={{ color: 'var(--text-muted)', fontSize: 11, opacity: 0.5 }}>
        {checking ? '✦ Checking status...' : 'Auto-checking every 15 seconds'}
      </div>

      <button
        onClick={() => router.push('/')}
        style={{
          background: 'transparent',
          border: '1px solid var(--input-border)',
          borderRadius: 12,
          padding: '10px 24px',
          color: 'var(--text-muted)',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}
      >
        ✧ Make another wish
      </button>
    </div>
  )
}
