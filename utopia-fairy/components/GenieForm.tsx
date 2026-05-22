'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from './FileUpload'

type FormState = 'idle' | 'submitting' | 'error' | 'snapshot-success'

interface SnapshotResult {
  slug: string
  projectPath: string
  command: string
  filesCount: number
}

export default function GenieForm() {
  const [prompt, setPrompt] = useState('')
  const [slug, setSlug] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [snapshotResult, setSnapshotResult] = useState<SnapshotResult | null>(null)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const copyCommand = async () => {
    if (!snapshotResult) return
    await navigator.clipboard.writeText(snapshotResult.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  const formatSlug = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const handleSubmit = async () => {
    if (!prompt.trim() || !slug.trim()) return
    setState('submitting')
    setErrorMsg('')

    const formattedSlug = formatSlug(slug)
    const formData = new FormData()
    formData.append('prompt', prompt)
    formData.append('slug', formattedSlug)
    files.forEach((file) => formData.append('files', file))

    try {
      const res = await fetch('/api/create-project', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })

      // Inspect the response shape before assuming JSON — if Vercel's
      // deployment-protection layer is in the way it returns HTML, which
      // would throw a confusing "Failed to connect" when we try to parse.
      const text = await res.text()
      let data: { success?: boolean; error?: string; mode?: string; slug?: string; projectPath?: string; command?: string } | null = null
      try { data = JSON.parse(text) } catch { /* not JSON */ }

      if (!data) {
        setState('error')
        if (res.status === 401) {
          setErrorMsg('Session expired — refresh the page and sign in again.')
        } else if (text.includes('Vercel') || text.includes('authentication')) {
          setErrorMsg('Blocked by Vercel deployment protection. Disable it in Project Settings → Deployment Protection.')
        } else {
          setErrorMsg(`Server returned HTTP ${res.status} (non-JSON response)`)
        }
        return
      }

      if (!data.success) {
        setState('error')
        setErrorMsg(data.error || 'Something went wrong')
        return
      }

      if (data.mode === 'snapshot' && data.slug && data.command && data.projectPath) {
        setSnapshotResult({
          slug: data.slug,
          projectPath: data.projectPath,
          command: data.command,
          filesCount: 0,
        })
        setState('snapshot-success')
        return
      }
      router.push(`/wish/${formattedSlug}`)
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? `Network error: ${err.message}` : 'Failed to connect to server')
    }
  }

  const canSubmit = prompt.trim() && slug.trim() && state !== 'submitting'

  // Snapshot-mode success card — deployed monitor can't write to disk so we
  // hand the user the Claude command to run on their machine.
  if (state === 'snapshot-success' && snapshotResult) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="uf-card" style={{
          padding: 18,
          background: 'var(--brand-bg)',
          boxShadow: '0 0 0 1px var(--brand-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div>
            <span className="uf-eyebrow" style={{ color: 'var(--brand)' }}>Wish prepared</span>
            <p style={{ color: 'var(--text-primary)', fontSize: 14, margin: '6px 0 0', lineHeight: 1.55 }}>
              The deployed monitor can't create folders on your machine. Copy this command and paste it into Claude Code (running in the <code style={{ background: 'var(--bg-input)', padding: '1px 6px', borderRadius: 4 }}>utopia-website-builder</code> repo) — Claude will scaffold the project locally with your prompt as <code style={{ background: 'var(--bg-input)', padding: '1px 6px', borderRadius: 4 }}>{snapshotResult.projectPath}inputs.md</code>.
            </p>
          </div>
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            wordBreak: 'break-all',
          }}>
            {snapshotResult.command}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={copyCommand} className="uf-btn-brand" style={{ padding: '8px 16px' }}>
              {copied ? '✓ Copied' : '📋 Copy command'}
            </button>
            <button
              onClick={() => {
                setState('idle')
                setSnapshotResult(null)
                setPrompt('')
                setSlug('')
                setFiles([])
              }}
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Make another wish
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 11.5, margin: 0, lineHeight: 1.5 }}>
            After Claude finishes, push to <code>main</code> (or wait for the next hourly scan) and the new project will appear in the monitor.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <textarea
        ref={textareaRef}
        className="fairy-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onPaste={(e) => {
          const items = e.clipboardData.items
          const imageFiles: File[] = []
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
              const file = items[i].getAsFile()
              if (file) {
                const named = new File([file], `pasted-image-${Date.now()}.png`, { type: file.type })
                imageFiles.push(named)
              }
            }
          }
          if (imageFiles.length > 0) {
            e.preventDefault()
            setFiles((prev) => [...prev, ...imageFiles])
          }
        }}
        placeholder="I want to create a website for renting wheelchairs in Malaysia. The brand is WheelCare, domain wheelcare.my. Target cities: KL, PJ, Shah Alam..."
        rows={4}
        style={{ minHeight: 120, resize: 'none' }}
        disabled={state === 'submitting'}
      />

      <input
        type="text"
        className="fairy-input"
        value={slug}
        onChange={(e) => setSlug(formatSlug(e.target.value))}
        placeholder="Project name (slug), e.g. wheelchair-malaysia"
        style={{ padding: '10px 16px', fontSize: 14, borderRadius: 10 }}
        disabled={state === 'submitting'}
      />

      <FileUpload files={files} onFilesChange={setFiles} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        <button
          className="fairy-btn"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {state === 'submitting' ? '✦ Casting spell...' : '✦ Grant My Wish'}
        </button>
        {state === 'error' && (
          <div style={{ color: '#ef9a9a', fontSize: 13, textAlign: 'center' }}>{errorMsg}</div>
        )}
      </div>
    </div>
  )
}
