'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  CLASSIFIED_CATEGORIES,
  Classified,
  ClassifiedCategory,
  ALLOWED_IMAGE_TYPES,
  MAX_CLASSIFIED_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
} from '@/types/classified'
import {
  CreateClassifiedPayload,
  UpdateClassifiedPayload,
  createClassified,
  updateClassified,
  uploadClassifiedImages,
} from '@/lib/classifieds-api'
const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'uy'
import ClassifiedImageUploader from './ClassifiedImageUploader'

interface ClassifiedFormProps {
  mode: 'create' | 'edit'
  initial?: Classified
}

export default function ClassifiedForm({ mode, initial }: ClassifiedFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [category, setCategory] = useState<ClassifiedCategory>(
    initial?.category || 'cars'
  )
  const [price, setPrice] = useState<string>(initial?.price ? String(initial.price) : '')
  const [currency, setCurrency] = useState(initial?.currency || 'USD')
  const [city, setCity] = useState(initial?.city || '')
  const [contactInfo, setContactInfo] = useState(initial?.contactInfo || '')
  const [showContactInfo, setShowContactInfo] = useState(initial?.showContactInfo ?? true)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)

  const isCreate = mode === 'create'

  const validateFiles = (files: File[]): string | null => {
    if (files.length > MAX_CLASSIFIED_IMAGES) {
      return `Máximo ${MAX_CLASSIFIED_IMAGES} imágenes.`
    }
    for (const f of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
        return `Tipo no permitido: ${f.name}`
      }
      if (f.size > MAX_IMAGE_SIZE_BYTES) {
        return `Archivo muy grande: ${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`
      }
    }
    return null
  }

  const handleCreateImages = (fileList: FileList | null) => {
    if (!fileList) return
    const files = Array.from(fileList)
    const v = validateFiles(files)
    if (v) {
      setError(v)
      return
    }
    setError(null)
    setPendingFiles(files)
    setPendingPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()
    const trimmedDesc = description.trim()
    const trimmedCity = city.trim()
    const priceNum = Number(price)

    if (!trimmedTitle || !trimmedDesc || !trimmedCity) {
      setError('Completá título, descripción y ciudad.')
      return
    }
    if (trimmedTitle.length > 120) {
      setError('El título debe tener máximo 120 caracteres.')
      return
    }
    if (trimmedDesc.length > 2000) {
      setError('La descripción debe tener máximo 2000 caracteres.')
      return
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError('El precio debe ser un número mayor a 0.')
      return
    }
    if (currency.length !== 3) {
      setError('La moneda debe ser un código de 3 letras (ej. USD, UYU).')
      return
    }
    if (contactInfo.trim().length > 200) {
      setError('El contacto debe tener máximo 200 caracteres.')
      return
    }

    setSubmitting(true)
    try {
      if (isCreate) {
        const payload: CreateClassifiedPayload = {
          title: trimmedTitle,
          description: trimmedDesc,
          category,
          price: priceNum,
          currency: currency.toUpperCase(),
          countryCode: COUNTRY,
          city: trimmedCity,
          showContactInfo,
        }
        if (contactInfo.trim()) payload.contactInfo = contactInfo.trim()

        setProgress('Creando publicación…')
        const created = await createClassified(payload)

        if (pendingFiles.length > 0) {
          for (let i = 0; i < pendingFiles.length; i++) {
            setProgress(`Subiendo imagen ${i + 1} de ${pendingFiles.length}…`)
            try {
              await uploadClassifiedImages(created.id, [pendingFiles[i]])
            } catch (err) {
              const m = err instanceof Error ? err.message : 'Error al subir imagen'
              setError(`Publicación creada, pero falló una imagen: ${m}. Podés reintentar desde Editar.`)
              router.push(`/clasificados/${created.id}/editar`)
              return
            }
          }
        }
        router.push(`/clasificados/${created.id}`)
      } else {
        if (!initial) throw new Error('Falta clasificado original')
        const payload: UpdateClassifiedPayload = {
          title: trimmedTitle,
          description: trimmedDesc,
          category,
          price: priceNum,
          currency: currency.toUpperCase(),
          city: trimmedCity,
          contactInfo: contactInfo.trim(),
          showContactInfo,
        }
        setProgress('Guardando cambios…')
        await updateClassified(initial.id, payload)
        router.push(`/clasificados/${initial.id}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setError(message)
    } finally {
      setSubmitting(false)
      setProgress(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Datos del aviso</h2>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="Ej. Honda Civic 2020 impecable"
            className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none"
            required
          />
          <p className="text-xs text-[var(--foreground-muted)] mt-1">{title.length}/120</p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
            Descripción *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={5}
            placeholder="Detalles del vehículo, kilometraje, estado, etc."
            className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none resize-y"
            required
          />
          <p className="text-xs text-[var(--foreground-muted)] mt-1">{description.length}/2000</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Categoría *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ClassifiedCategory)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none"
            >
              {CLASSIFIED_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Ciudad *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength={100}
              placeholder="Ej. Montevideo"
              className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Precio *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15000"
              className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Moneda *
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none"
            >
              <option value="USD">USD</option>
              <option value="UYU">UYU</option>
              <option value="ARS">ARS</option>
              <option value="CLP">CLP</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
            Contacto (teléfono, WhatsApp, email)
          </label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            maxLength={200}
            placeholder="+598 99 123 456"
            className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none"
          />
          <label className="flex items-center gap-2 mt-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showContactInfo}
              onChange={(e) => setShowContactInfo(e.target.checked)}
              className="w-4 h-4 accent-[var(--primary)]"
            />
            Mostrar contacto en la publicación
          </label>
        </div>
      </div>

      <div className="card p-6 space-y-3">
        <h2 className="text-lg font-semibold">Imágenes</h2>
        {isCreate ? (
          <>
            <p className="text-xs text-[var(--foreground-muted)]">
              Seleccioná hasta {MAX_CLASSIFIED_IMAGES} imágenes; se subirán al crear la publicación.
            </p>
            <input
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              multiple
              onChange={(e) => handleCreateImages(e.target.files)}
              className="block w-full text-sm text-[var(--foreground-muted)] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary-light)]"
            />
            {pendingPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {pendingPreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          initial && (
            <ClassifiedImageUploader
              classifiedId={initial.id}
              initialImages={initial.images}
            />
          )
        )}
      </div>

      {error && (
        <div className="card p-4 border-red-500/40 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary disabled:opacity-60"
        >
          {submitting ? progress || 'Guardando…' : isCreate ? 'Publicar' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
