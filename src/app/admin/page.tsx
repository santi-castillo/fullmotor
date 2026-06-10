'use client'

import { useState, useEffect } from 'react'
import { getAllVehicles } from '@/lib/data'
import { Vehicle } from '@/types/vehicle'
import { Button } from '../components/ui/Button'

export default function AdminPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getAllVehicles().then(setVehicles)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !selectedVehicle) {
      setMessage('Elegí un vehículo y una imagen')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const filename = `vehicles/${selectedVehicle}-${Date.now()}.${file.name.split('.').pop()}`

      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(filename)}`,
        {
          method: 'POST',
          body: file,
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const blob = await response.json()

      setMessage(`Imagen subida exitosamente: ${blob.url}`)
      console.log('Blob URL:', blob.url)
      console.log(`Actualiza el vehículo ${selectedVehicle} con: "image": "${blob.url}"`)

      setFile(null)
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (error) {
      console.error('Error uploading:', error)
      setMessage('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-2xl font-bold text-ink mb-8">Admin · Subir imágenes</h1>

        <form onSubmit={handleUpload} className="bg-surface border border-line p-6 rounded-[var(--radius-lg)] shadow-xs space-y-4">
          <div className="tm-field">
            <label className="tm-field__label">Seleccionar vehículo</label>
            <span className="tm-select-wrap">
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="tm-select"
                required
              >
                <option value="">Elegí un vehículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} {v.version} ({v.year})
                    {v.image && ' — con imagen'}
                  </option>
                ))}
              </select>
              <span className="tm-select__chev" aria-hidden="true" />
            </span>
          </div>

          <div className="tm-field">
            <label className="tm-field__label">Seleccionar imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="tm-input"
              style={{ paddingTop: 7 }}
              required
            />
          </div>

          <Button type="submit" block loading={uploading}>
            Subir imagen
          </Button>

          {message && (
            <div className={`p-4 rounded-[var(--radius-md)] text-sm ${message.includes('Error') ? 'bg-danger-soft text-danger-ink' : 'bg-positive-soft text-positive-ink'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="mt-8 bg-surface border border-line p-6 rounded-[var(--radius-lg)] shadow-xs">
          <h2 className="font-display text-lg font-bold text-ink mb-4">Vehículos con imágenes</h2>
          <div className="space-y-2">
            {vehicles
              .filter(v => v.image)
              .map(v => (
                <div key={v.id} className="flex items-center gap-4 p-3 border border-hairline rounded-[var(--radius-md)]">
                  {v.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.image} alt={v.model} className="w-20 h-20 object-cover rounded-[var(--radius-sm)]" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{v.brand} {v.model}</p>
                    <p className="font-mono text-xs text-muted truncate">{v.image}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
