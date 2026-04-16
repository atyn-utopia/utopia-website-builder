'use client'

import { useState, useEffect, useCallback } from 'react'

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

interface MagicLoaderProps {
  projectPath: string
  slug: string
  prompt: string
  onReset: () => void
}

export default function MagicLoader({ projectPath, slug, prompt, onReset }: MagicLoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [deployUrl, setDeployUrl] = useState('')
  const [checking, setChecking] = useState(false)
  const [copied, setCopied] = useState(false)

  const claudeCommand = `claude "Read projects/${slug}/inputs.md and run the full agent pipeline following prompts/new-website.md. The project slug is ${slug}."`

  const copyCommand = async () => {
    await navigator.clipboard.writeText(claudeCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MAGICAL_MESSAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const checkStatus = useCallback(async () => {
    setChecking(true)
    try {
      const res = await fetch(`/api/check-status?slug=${slug}`)
      const data = await res.json()
      if (data.url) {
        setDeployUrl(data.url)
      }
    } catch {
      // silently fail — user can retry
    }
    setChecking(false)
  }, [slug])

  if (deployUrl) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: '40px 0',
      }}>
        <div style={{ fontSize: 48, animation: 'pulse 2s ease-in-out infinite' }}>🎉</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          color: 'var(--accent-fairy)',
          textShadow: '0 0 20px rgba(129, 212, 250, 0.3)',
          textAlign: 'center',
        }}>
          Your wish has come true!
        </div>
        <a
          href={deployUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(135deg, var(--accent-deep), var(--accent-glow))',
            color: 'white',
            padding: '14px 32px',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(79, 195, 247, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(79, 195, 247, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 195, 247, 0.3)'
          }}
        >
          ✦ Visit Your Website
        </a>
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{deployUrl}</div>
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid var(--input-border)',
            borderRadius: 12,
            padding: '10px 24px',
            color: 'var(--text-muted)',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            marginTop: 8,
          }}
        >
          ✧ Make another wish
        </button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      padding: '40px 0',
    }}>
      {/* Animated fairy wand */}
      <div style={{ position: 'relative' }}>
        <div className="fairy-container">
          <div className="fairy-glow" />
          <img
            src="/fairy.gif"
            alt="Fairy working"
            style={{
              width: 100,
              height: 100,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(79, 195, 247, 0.4))',
            }}
          />
        </div>
      </div>

      {/* Rotating magical messages */}
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

      {/* Project info */}
      <div style={{
        color: 'var(--text-muted)',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 1.8,
      }}>
        Project created at <code className="success-code">{projectPath}</code>
      </div>

      {/* Copy command section */}
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
            position: 'relative',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(79, 195, 247, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--input-border)'
            e.currentTarget.style.boxShadow = 'none'
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

      {/* Divider */}
      <div style={{
        width: '60%',
        height: 1,
        background: 'var(--input-border)',
        margin: '4px 0',
      }} />

      <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
        After the fairy team finishes building & deploys your site:
      </div>

      {/* Check status button */}
      <button
        onClick={checkStatus}
        disabled={checking}
        style={{
          background: 'transparent',
          border: '1px solid var(--input-border)',
          borderRadius: 12,
          padding: '10px 24px',
          color: 'var(--text-secondary)',
          fontSize: 14,
          cursor: checking ? 'wait' : 'pointer',
          fontFamily: 'var(--font-body)',
          transition: 'border-color 0.3s, color 0.3s',
          opacity: checking ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!checking) {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent-fairy)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--input-border)'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }}
      >
        {checking ? '✦ Checking...' : '✦ Check if website is ready'}
      </button>

      <button
        onClick={onReset}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          opacity: 0.6,
        }}
      >
        ✧ Make another wish instead
      </button>
    </div>
  )
}
