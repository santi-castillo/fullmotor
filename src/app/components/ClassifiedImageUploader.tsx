'use client'

import { useRef, useState } from 'react'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_CLASSIFIED_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
} from '@/types/classified'
import { deleteClassifiedImage, uploadClassifiedImages } from '@/lib/classifieds-api'

interface ClassifiedImageUploaderProps {
  classifiedId: string
  initialImages?: string[]
  onChange?: (images: string[]) => void
}

interface PendingUpload {
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'error'
  error?: string
}

export default function ClassifiedImageUploader({
  classifiedId,
  initialImages = [],
  onChange,
}: ClassifiedImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [pending, setPending] = useState<PendingUpload[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const totalCount = images.length + pending.length
  const remaining = Math.max(0, MAX_CLASSIFIED_IMAGES - totalCount)

  const updateImages = (next: string[]) => {
    setImages(next)
    onChange?.(next)
  }

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `Tipo no permitido (${file.type}). Solo JPG, PNG, WEBP, GIF.`
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return `Archivo muy grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máx 10 MB.`
    }
    return null
  }

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setError(null)

    const files = Array.from(fileList)
    if (files.length > remaining) {
      setError(`Solo podés subir ${remaining} imagen(es) más (máx ${MAX_CLASSIFIED_IMAGES} en total).`)
      return
    }

    const validated: PendingUpload[] = []
    for (const file of files) {
      const v = validateFile(file)
      if (v) {
        setError(v)
        return
      }
      validated.push({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
      })
    }

    setPending((prev) => [...prev, ...validated])
    setBusy(true)
    try {
      // Upload sequentially for clearer progress feedback
      for (const item of validated) {
        setPending((prev) =>
          prev.map((p) => (p === item ? { ...p, status: 'uploading' } : p))
        )
        try {
          const { images: nextImages } = await uploadClassifiedImages(classifiedId, [item.file])
          updateImages(nextImages)
          setPending((prev) => prev.filter((p) => p !== item))
          URL.revokeObjectURL(item.preview)
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error al subir'
          setPending((prev) =>
            prev.map((p) => (p === item ? { ...p, status: 'error', error: message } : p))
          )
        }
      }
    } finally {
      setBusy(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (url: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    try {
      await deleteClassifiedImage(classifiedId, url)
      updateImages(images.filter((u) => u !== url))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      setError(message)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((url) => (
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border)] group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(url)}
              className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/60 backdrop-blur text-white text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Eliminar imagen"
            >
              ✕
            </button>
          </div>
        ))}
        {pending.map((p, i) => (
          <div
            key={`p-${i}`}
            className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.preview} alt="" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center text-xs">
              {p.status === 'uploading' ? '⏳ Subiendo…' : p.status === 'error' ? `❌ ${p.error}` : '⏳'}
            </div>
          </div>
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="aspect-square rounded-lg border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] flex flex-col items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors disabled:opacity-50"
          >
            <span className="text-3xl">+</span>
            <span className="text-xs mt-1">Agregar foto</span>
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-[var(--foreground-muted)]">
        {totalCount} de {MAX_CLASSIFIED_IMAGES} imágenes · Máx 10 MB · JPG, PNG, WEBP, GIF
      </p>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
