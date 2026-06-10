'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { AlertCircle, ImagePlus } from 'lucide-react'
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
import { Button } from './ui/Button'
import { Input, Textarea } from './ui/Input'
import { Select } from './ui/Select'
import ClassifiedImageUploader from './ClassifiedImageUploader'

const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'uy'

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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
      <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-ink">Datos del aviso</h2>

        <Input
          label="Título"
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="Ej. Honda Civic 2020 impecable"
          hint={`${title.length}/120`}
          className="[&_.tm-field__hint]:font-mono"
        />

        <Textarea
          label="Descripción"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={5}
          placeholder="Detalles del vehículo, kilometraje, estado, etc."
          hint={`${description.length}/2000`}
          className="[&_.tm-field__hint]:font-mono"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value as ClassifiedCategory)}
            options={CLASSIFIED_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
          />
          <Input
            label="Ciudad"
            required
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={100}
            placeholder="Ej. Montevideo"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Precio"
              required
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15000"
              className="[&_.tm-input]:font-mono"
            />
          </div>
          <Select
            label="Moneda"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={['USD', 'UYU', 'ARS', 'CLP']}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Contacto (teléfono, WhatsApp, email)"
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            maxLength={200}
            placeholder="+598 99 123 456"
          />
          <label className="flex items-center gap-2 text-sm text-body cursor-pointer">
            <input
              type="checkbox"
              checked={showContactInfo}
              onChange={(e) => setShowContactInfo(e.target.checked)}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            Mostrá tu contacto en la publicación
          </label>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-6 space-y-3">
        <h2 className="font-display text-lg font-bold text-ink">Fotos</h2>
        {isCreate ? (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 px-4 border border-dashed border-line-strong rounded-[var(--radius-lg)] text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <ImagePlus size={24} aria-hidden="true" />
              <span className="text-sm">
                Subí hasta {MAX_CLASSIFIED_IMAGES} fotos (JPG, PNG o WebP)
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              multiple
              onChange={(e) => handleCreateImages(e.target.files)}
              className="hidden"
            />
            <p className="text-xs text-muted">
              Las fotos se suben al crear la publicación.
            </p>
            {pendingPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {pendingPreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-line bg-sunken"
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
        <div className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-danger-soft text-danger-ink text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={submitting}>
          {submitting ? progress || 'Guardando…' : isCreate ? 'Publicá tu aviso' : 'Guardá los cambios'}
        </Button>
        <Button variant="ghost" onClick={() => router.back()} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
