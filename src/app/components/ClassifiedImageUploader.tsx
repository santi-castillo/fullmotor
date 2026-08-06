'use client'

import { useRef, useState } from 'react'
import { AlertCircle, ImagePlus, Loader2, X } from 'lucide-react'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_CLASSIFIED_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
} from '@/types/classified'
import { deleteClassifiedImage, uploadClassifiedImages } from '@/lib/classifieds-api'
import { translateApiError } from '@/lib/api-error'

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
    setPending((prev) =>
      prev.map((p) => (validated.includes(p) ? { ...p, status: 'uploading' } : p))
    )

    try {
      // One request for the whole batch. This used to loop file by file and
      // destructure a field the API never returns (`images`; it sends
      // `uploaded`), so a successful upload threw and was reported as a failure.
      const result = await uploadClassifiedImages(
        classifiedId,
        validated.map((v) => v.file)
      )
      updateImages([...images, ...result.uploaded])
      validated.forEach((v) => URL.revokeObjectURL(v.preview))
      setPending((prev) => prev.filter((p) => !validated.includes(p)))

      if (result.errors.length > 0) {
        setError(
          `${result.errors.length} de ${validated.length} fotos no se pudieron subir. Probá de nuevo con esas.`
        )
      }
    } catch (err) {
      const message = translateApiError(err, 'Error al subir')
      setPending((prev) =>
        prev.map((p) => (validated.includes(p) ? { ...p, status: 'error', error: message } : p))
      )
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
      const message = translateApiError(err, 'Error al eliminar')
      setError(message)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((url) => (
          <div
            key={url}
            className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-line bg-sunken group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(url)}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-surface shadow-sm text-muted hover:text-danger transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
              aria-label="Eliminar imagen"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
        {pending.map((p, i) => (
          <div
            key={`p-${i}`}
            className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-line bg-sunken"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.preview} alt="" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center text-xs text-ink">
              {p.status === 'error' ? (
                <>
                  <AlertCircle size={16} className="text-danger" aria-hidden="true" />
                  <span className="text-danger-ink">{p.error}</span>
                </>
              ) : (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  {p.status === 'uploading' && <span>Subiendo…</span>}
                </>
              )}
            </div>
          </div>
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="aspect-square rounded-[var(--radius-md)] border border-dashed border-line-strong text-muted hover:border-accent hover:text-accent transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ImagePlus size={22} aria-hidden="true" />
            <span className="text-xs">Agregar foto</span>
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
      <p className="text-xs text-muted">
        Subí hasta {MAX_CLASSIFIED_IMAGES} fotos (JPG, PNG o WebP) ·{' '}
        <span className="font-mono">
          {totalCount}/{MAX_CLASSIFIED_IMAGES}
        </span>{' '}
        · Máx 10 MB cada una
      </p>
      {error && <p className="text-sm text-danger-ink">{error}</p>}
    </div>
  )
}
