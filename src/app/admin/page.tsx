'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, Search } from 'lucide-react'
import { getAllVehicles } from '@/lib/data'
import { uploadVehicleImages } from '@/lib/ops-api'
import { translateApiError } from '@/lib/api-error'
import { Vehicle } from '@/types/vehicle'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function AdminImagesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  useEffect(() => {
    getAllVehicles()
      .then(setVehicles)
      .catch(() => setError('No pudimos cargar el catálogo'))
      .finally(() => setLoadingVehicles(false))
  }, [])

  // The catalogue is well over a thousand vehicles, which is unusable as a
  // single <select>. Filtering client-side is fine: getAllVehicles already
  // walked the whole corpus to build the list.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vehicles.slice(0, 50)
    return vehicles
      .filter((v) =>
        `${v.brand} ${v.model} ${v.version ?? ''} ${v.year ?? ''}`.toLowerCase().includes(q)
      )
      .slice(0, 50)
  }, [vehicles, query])

  const selectedVehicle = vehicles.find((v) => v.id === selected)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || files.length === 0) {
      setError('Elegí un vehículo y al menos una imagen')
      return
    }

    setUploading(true)
    setError(null)
    setDone(null)
    try {
      const result = await uploadVehicleImages(selected, files)
      setDone(
        `Subí ${result.uploaded.length} ${result.uploaded.length === 1 ? 'imagen' : 'imágenes'}. ` +
          `El vehículo quedó con ${result.totalImages}.`
      )
      setFiles([])
      const input = document.querySelector<HTMLInputElement>('input[type="file"]')
      if (input) input.value = ''

      // Reflect the new count without refetching the whole catalogue.
      setVehicles((vs) =>
        vs.map((v) =>
          v.id === selected
            ? { ...v, images: [...(v.images ?? []), ...result.uploaded.map((u) => u.url)] }
            : v
        )
      )
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
          Se suben y quedan pegadas al vehículo en el mismo paso. Lo ideal son fotos de 1280×800
          con fondo blanco.
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

      <form
        onSubmit={handleUpload}
        className="bg-surface border border-line p-6 rounded-[var(--radius-lg)] shadow-xs space-y-4"
      >
        <Input
          label="Buscar vehículo"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Marca, modelo, versión o año"
          iconLeft={<Search size={16} aria-hidden="true" />}
          hint={
            loadingVehicles
              ? 'Cargando el catálogo…'
              : `${vehicles.length} vehículos. Se muestran hasta 50.`
          }
        />

        <div className="tm-field">
          <label className="tm-field__label" htmlFor="vehiculo">
            Vehículo
          </label>
          <span className="tm-select-wrap">
            <select
              id="vehiculo"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="tm-select"
              required
            >
              <option value="">Elegí un vehículo</option>
              {matches.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} {v.version} ({v.year})
                  {v.images?.length ? ` — ${v.images.length} foto(s)` : ' — sin fotos'}
                </option>
              ))}
            </select>
            <span className="tm-select__chev" aria-hidden="true" />
          </span>
        </div>

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
          <span className="tm-field__hint">
            Se agregan a las que el vehículo ya tenga.
          </span>
        </div>

        <Button type="submit" block loading={uploading} disabled={!selected || files.length === 0}>
          {files.length > 1 ? `Subir ${files.length} imágenes` : 'Subir imagen'}
        </Button>
      </form>

      {selectedVehicle && selectedVehicle.images?.length > 0 && (
        <div className="bg-surface border border-line p-6 rounded-[var(--radius-lg)] shadow-xs">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Fotos de {selectedVehicle.brand} {selectedVehicle.model}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {selectedVehicle.images.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="w-full aspect-[16/10] object-cover rounded-[var(--radius-md)] border border-hairline"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
