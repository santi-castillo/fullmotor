'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Check, Search } from 'lucide-react'
import { searchVehicles } from '@/lib/api'
import { uploadVehicleImages } from '@/lib/ops-api'
import { translateApiError } from '@/lib/api-error'
import { Vehicle } from '@/types/vehicle'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function AdminImagesPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Vehicle[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  // Searches server-side, one request per pause in typing.
  //
  // This screen used to pull the whole catalogue up front — thirteen
  // sequential pages, about nine seconds — and only then let you filter it in
  // memory. For nine seconds the box looked broken, because it was empty and
  // nothing you typed matched anything.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const found = await searchVehicles(q, 'text', 'all', 20)
        // A slow earlier request must not overwrite the results of a later
        // one — the classic out-of-order autocomplete bug.
        if (!cancelled) {
          setResults(found)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(translateApiError(err, 'No pudimos buscar vehículos'))
      } finally {
        if (!cancelled) setSearching(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || files.length === 0) return

    setUploading(true)
    setError(null)
    setDone(null)
    try {
      const result = await uploadVehicleImages(selected.id, files)
      setDone(
        `Subí ${result.uploaded.length} ${result.uploaded.length === 1 ? 'imagen' : 'imágenes'}. ` +
          `${selected.brand} ${selected.model} quedó con ${result.totalImages}.`
      )
      setFiles([])
      const input = document.querySelector<HTMLInputElement>('input[type="file"]')
      if (input) input.value = ''
      setSelected({
        ...selected,
        images: [...(selected.images ?? []), ...result.uploaded.map((u) => u.url)],
      })
    } catch (err) {
      setError(translateApiError(err, 'No pudimos subir las imágenes'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink" style={{ letterSpacing: '-0.03em' }}>
          Imágenes
        </h1>
        <p className="text-sm text-muted mt-2">
          Buscá el vehículo, elegí las fotos y quedan pegadas a la ficha en el mismo paso. Lo
          ideal son 1280×800 con fondo blanco.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-danger-soft text-danger-ink text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </div>
      )}

      {done && (
        <div className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-positive-soft text-positive-ink text-sm">
          <Check size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {done}
        </div>
      )}

      <div className="bg-surface border border-line p-6 rounded-[var(--radius-lg)] shadow-xs space-y-4">
        <Input
          label="Buscar vehículo"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Marca, modelo o versión"
          iconLeft={<Search size={16} aria-hidden="true" />}
          hint={
            query.trim().length > 0 && query.trim().length < 2
              ? 'Escribí al menos dos letras.'
              : searching
                ? 'Buscando…'
                : 'Se muestran hasta 20 resultados.'
          }
        />

        {results.length > 0 && (
          <ul className="divide-y divide-hairline border border-line rounded-[var(--radius-md)] overflow-hidden">
            {results.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(v)
                    setDone(null)
                  }}
                  aria-pressed={selected?.id === v.id}
                  className={[
                    'w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors',
                    selected?.id === v.id ? 'bg-sunken' : 'hover:bg-sunken',
                  ].join(' ')}
                >
                  <span className="flex-1 min-w-0">
                    <span className="font-semibold text-ink">
                      {v.brand} {v.model}
                    </span>{' '}
                    <span className="text-muted">
                      {v.version} ({v.year})
                    </span>
                  </span>
                  <span className="tm-eyebrow flex-shrink-0">
                    {v.images?.length ? `${v.images.length} foto(s)` : 'sin fotos'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!searching && query.trim().length >= 2 && results.length === 0 && (
          <p className="text-sm text-muted">No encontramos vehículos con eso.</p>
        )}
      </div>

      {selected && (
        <form
          onSubmit={handleUpload}
          className="bg-surface border border-line p-6 rounded-[var(--radius-lg)] shadow-xs space-y-4"
        >
          <div>
            <p className="tm-eyebrow">Vehículo elegido</p>
            <p className="font-display text-lg font-bold text-ink">
              {selected.brand} {selected.model} {selected.version} ({selected.year})
            </p>
            <p className="text-xs text-muted font-mono">{selected.slug}</p>
          </div>

          {selected.images?.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {selected.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="w-full aspect-[16/10] object-cover rounded-[var(--radius-md)] border border-hairline"
                />
              ))}
            </div>
          )}

          <div className="tm-field">
            <label className="tm-field__label" htmlFor="imagenes">
              Imágenes
            </label>
            <input
              id="imagenes"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="tm-input"
              style={{ paddingTop: 7 }}
              required
            />
            <span className="tm-field__hint">Se agregan a las que ya tenga.</span>
          </div>

          <Button type="submit" block loading={uploading} disabled={files.length === 0}>
            {files.length > 1 ? `Subir ${files.length} imágenes` : 'Subir imagen'}
          </Button>
        </form>
      )}
    </div>
  )
}
