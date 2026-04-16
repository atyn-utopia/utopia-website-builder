'use client'

import { useRef, useState, useCallback } from 'react'

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

const ACCEPTED_TYPES = [
  'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'application/pdf',
]

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    const valid = Array.from(newFiles).filter(f => ACCEPTED_TYPES.includes(f.type))
    onFilesChange([...files, ...valid])
  }, [files, onFilesChange])

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

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
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.svg,.webp,.pdf"
          onChange={(e) => addFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
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
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
