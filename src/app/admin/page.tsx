'use client'

import { useState, useEffect } from 'react'
import { getAllVehicles } from '@/lib/data'
import { Vehicle } from '@/types/vehicle'

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
      setMessage('Selecciona un vehículo y una imagen')
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin - Subir Imágenes</h1>

        <form onSubmit={handleUpload} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Seleccionar Vehículo
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">-- Selecciona un vehículo --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} {v.version} ({v.year})
                  {v.image && ' ✓'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Seleccionar Imagen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? 'Subiendo...' : 'Subir Imagen'}
          </button>

          {message && (
            <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Vehículos con Imágenes</h2>
          <div className="space-y-2">
            {vehicles
              .filter(v => v.image)
              .map(v => (
                <div key={v.id} className="flex items-center gap-4 p-3 border rounded">
                  {v.image && (
                    <img src={v.image} alt={v.model} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div>
                    <p className="font-medium">{v.brand} {v.model}</p>
                    <p className="text-sm text-gray-500">{v.image}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
