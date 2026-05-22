'use client'

import { useRef, useState, useCallback } from 'react'

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

const ACCEPTED_TYPES = [
  'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'application/pdf',
]

// Per-file: 3.5 MB. Total request: 4 MB (Next.js Route Handler cap).
// Stay safely under the limit so prompt + slug + boundary headers fit too.
const PER_FILE_LIMIT = 3.5 * 1024 * 1024
const TOTAL_LIMIT = 4 * 1024 * 1024

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    const incoming = Array.from(newFiles)
    const wrongType = incoming.filter(f => !ACCEPTED_TYPES.includes(f.type))
    const tooBig = incoming.filter(f => f.size > PER_FILE_LIMIT)
    const accepted = incoming.filter(f => ACCEPTED_TYPES.includes(f.type) && f.size <= PER_FILE_LIMIT)

    // Check total size against everything already attached
    const currentTotal = files.reduce((sum, f) => sum + f.size, 0)
    const addedTotal = accepted.reduce((sum, f) => sum + f.size, 0)
    const keptFromAccepted: File[] = []
    let runningTotal = currentTotal
    for (const f of accepted) {
      if (runningTotal + f.size > TOTAL_LIMIT) break
      keptFromAccepted.push(f)
      runningTotal += f.size
    }
    const skippedForTotal = accepted.length - keptFromAccepted.length

    const messages: string[] = []
    if (tooBig.length > 0) {
      messages.push(`${tooBig.length} file${tooBig.length === 1 ? '' : 's'} skipped — over 3.5 MB per file`)
    }
    if (wrongType.length > 0) {
      messages.push(`${wrongType.length} file${wrongType.length === 1 ? '' : 's'} skipped — only PNG / JPG / SVG / WebP / PDF`)
    }
    if (skippedForTotal > 0) {
      messages.push(`${skippedForTotal} file${skippedForTotal === 1 ? '' : 's'} skipped — total would exceed 4 MB`)
    }
    setWarning(messages.length > 0 ? messages.join(' · ') : null)
    if (keptFromAccepted.length > 0) onFilesChange([...files, ...keptFromAccepted])
    // Suppress unused-var lint; addedTotal is informative for future analytics
    void addedTotal
  }, [files, onFilesChange])

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
    setWarning(null)
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  return (
    <div>
      <div
        className={`fairy-upload ${dragOver ? 'fairy-upload-active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
      >
        ✦ Drop your brand assets here or click to upload
        <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-quiet)' }}>
          PNG / JPG / SVG / WebP / PDF · 3.5 MB per file · 4 MB total
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.svg,.webp,.pdf"
          onChange={(e) => addFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {warning && (
        <div style={{
          marginTop: 8,
          fontSize: 11.5,
          color: 'var(--status-warn)',
          background: 'var(--status-warn-bg)',
          border: '1px solid var(--status-warn-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 10px',
          lineHeight: 1.5,
        }}>
          {warning}
        </div>
      )}

      {files.length > 0 && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="file-chip">
                {file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    style={{ width: 18, height: 18, borderRadius: 3, objectFit: 'cover' }}
                  />
                )}
                <span>{file.name}</span>
                <span style={{ opacity: 0.55, fontSize: 10.5, marginLeft: 2 }}>
                  {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 6,
            fontSize: 10.5,
            color: totalSize > TOTAL_LIMIT ? 'var(--status-fail)' : 'var(--text-quiet)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            Total: {formatSize(totalSize)} / 4.0 MB
          </div>
        </>
      )}
    </div>
  )
}
