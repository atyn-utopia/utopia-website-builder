'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from './FileUpload'

type FormState = 'idle' | 'submitting' | 'error'

export default function GenieForm() {
  const [prompt, setPrompt] = useState('')
  const [slug, setSlug] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

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
      const res = await fetch('/api/create-project', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        router.push(`/wish/${formattedSlug}`)
      } else {
        setState('error')
        setErrorMsg(data.error || 'Something went wrong')
      }
    } catch {
      setState('error')
      setErrorMsg('Failed to connect to server')
    }
  }

  const canSubmit = prompt.trim() && slug.trim() && state !== 'submitting'

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
