'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X } from 'lucide-react'
import { createPrivateListing, uploadPrivateListingImages } from '@/lib/private-listings-api'
import { fetchClassifiedFacets } from '@/lib/classifieds-api'
import { translateApiError } from '@/lib/api-error'
import { DEPARTAMENTOS } from '@/lib/uruguay'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  fuelTypeLabels,
  transmissionLabels,
  type BrandOption,
} from '@/types/classified'
import { Button } from './ui/Button'
import { Input, Textarea } from './ui/Input'
import { Select } from './ui/Select'

/** Matches MaxPrivateListingImages on the API. */
const MAX_IMAGES = 12

/**
 * The form a seller fills in once.
 *
 * Modelled on ClassifiedForm, with two deliberate differences. There is no
 * price — the seller states none, and asking for one would anchor the bidding
 * down, which is the opposite of what the feature is for. And every vehicle
 * field is required rather than optional: a dealership prices this car without
 * ever seeing it, so a blank mileage does not leave a gap in the record, it
 * makes the listing unanswerable.
 */
export default function PrivateListingForm() {
  const router = useRouter()

  const [brands, setBrands] = useState<BrandOption[]>([])
  const [fuelTypes, setFuelTypes] = useState<string[]>([])
  const [transmissions, setTransmissions] = useState<string[]>([])

  const [department, setDepartment] = useState('')
  const [city, setCity] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [version, setVersion] = useState('')
  const [year, setYear] = useState('')
  const [mileageKm, setMileageKm] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [description, setDescription] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetched rather than hardcoded so this cannot drift from the whitelist the
  // API validates against — a brand missing here would be unpickable, and one
  // missing there would be rejected on submit.
  useEffect(() => {
    fetchClassifiedFacets()
      .then((f) => {
        setBrands(f.brands)
        setFuelTypes(f.fuelTypes)
        setTransmissions(f.transmissions)
      })
      .catch(() => {
        // Non-fatal: the selects stay empty and the seller sees the error only
        // if they submit, which is better than blocking the whole page.
      })
  }, [])

  // Object URLs are not garbage collected on their own.
  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const files = Array.from(fileList)

    if (files.length > MAX_IMAGES) {
      setError(`Máximo ${MAX_IMAGES} fotos.`)
      return
    }
    for (const f of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
        setError(`Tipo no permitido: ${f.name}`)
        return
      }
      if (f.size > MAX_IMAGE_SIZE_BYTES) {
        setError(`Archivo muy grande: ${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`)
        return
      }
    }

    setError(null)
    setPreviews((old) => {
      old.forEach(URL.revokeObjectURL)
      return files.map((f) => URL.createObjectURL(f))
    })
    setPendingFiles(files)
  }

  const removeFile = (index: number) => {
    setPreviews((old) => {
      URL.revokeObjectURL(old[index])
      return old.filter((_, i) => i !== index)
    })
    setPendingFiles((old) => old.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const yearNum = Number(year)
    const kmNum = Number(mileageKm)

    if (!department) return setError('Elegí el departamento donde está el auto.')
    if (!city.trim()) return setError('Escribí la ciudad o el barrio.')
    if (!brand) return setError('Elegí la marca.')
    if (!model.trim()) return setError('Escribí el modelo.')
    if (!Number.isFinite(yearNum) || yearNum < 1900) return setError('Revisá el año.')
    // Number('') is 0, which is a valid mileage meaning new — so the empty
    // string has to be caught on its own or a blank box would submit as 0 km.
    if (mileageKm.trim() === '' || !Number.isFinite(kmNum) || kmNum < 0) {
      return setError('Escribí los kilómetros. Si es 0 km, poné 0.')
    }
    if (!fuelType) return setError('Elegí el combustible.')
    if (!transmission) return setError('Elegí la transmisión.')
    if (!contactPhone.trim()) return setError('Dejanos un teléfono para pasarte la oferta.')

    setSubmitting(true)
    try {
      setProgress('Creando tu cotización…')
      const created = await createPrivateListing({
        department,
        city: city.trim(),
        brand,
        model: model.trim(),
        version: version.trim() || undefined,
        year: yearNum,
        mileageKm: kmNum,
        fuelType,
        transmission,
        description: description.trim() || undefined,
        contactPhone: contactPhone.trim(),
      })

      if (pendingFiles.length > 0) {
        const n = pendingFiles.length
        setProgress(n === 1 ? 'Subiendo la foto…' : `Subiendo ${n} fotos…`)
        try {
          const result = await uploadPrivateListingImages(created.id, pendingFiles)
          if (result.errors.length > 0) {
            // The listing is already live and already taking offers, so this is
            // a warning on the way to it, not a failure.
            setError(
              `Publicamos tu cotización, pero ${result.errors.length} de ${n} fotos no se pudieron subir. Agregalas desde acá.`
            )
          }
        } catch (err) {
          setError(
            `Publicamos tu cotización, pero ${translateApiError(err, 'no pudimos subir las fotos')}. Agregalas desde acá.`
          )
        }
      }

      setProgress('Abriendo tu cotización…')
      router.push(`/cotizar/${created.id}`)
    } catch (err) {
      setError(translateApiError(err, 'no pudimos crear la cotización'))
      setSubmitting(false)
      setProgress(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="tm-field">
          <span className="tm-field__label">
            Departamento <span aria-hidden="true">*</span>
          </span>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Elegí el departamento"
            options={[...DEPARTAMENTOS]}
            required
          />
        </div>

        <Input
          label="Ciudad o barrio"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          maxLength={100}
          placeholder="Ej. Pocitos"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="tm-field">
          <span className="tm-field__label">
            Marca <span aria-hidden="true">*</span>
          </span>
          <Select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Elegí la marca"
            options={brands.map((b) => ({ value: b.value, label: b.label }))}
            required
          />
        </div>

        <Input
          label="Modelo"
          required
          value={model}
          onChange={(e) => setModel(e.target.value)}
          maxLength={60}
          placeholder="Ej. Gol"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Versión"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          maxLength={80}
          placeholder="Ej. Trend 1.6"
          hint="Opcional"
        />
        <Input
          label="Año"
          required
          type="number"
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Ej. 2018"
        />
        <Input
          label="Kilómetros"
          required
          type="number"
          inputMode="numeric"
          min="0"
          value={mileageKm}
          onChange={(e) => setMileageKm(e.target.value)}
          placeholder="Ej. 80000"
          hint="Si es 0 km, poné 0"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="tm-field">
          <span className="tm-field__label">
            Combustible <span aria-hidden="true">*</span>
          </span>
          <Select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            placeholder="Elegí el combustible"
            options={fuelTypes.map((f) => ({ value: f, label: fuelTypeLabels[f] ?? f }))}
            required
          />
        </div>

        <div className="tm-field">
          <span className="tm-field__label">
            Transmisión <span aria-hidden="true">*</span>
          </span>
          <Select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            placeholder="Elegí la transmisión"
            options={transmissions.map((t) => ({ value: t, label: transmissionLabels[t] ?? t }))}
            required
          />
        </div>
      </div>

      <Textarea
        label="Estado del auto"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={2000}
        rows={4}
        placeholder="Contá lo que una automotora querría saber: service al día, detalles de chapa, si tiene deuda de patente…"
        hint="Opcional, pero cuanto más claro seas, más firme es la oferta"
      />

      <div className="space-y-3">
        <div>
          <span className="tm-field__label">Fotos</span>
          <p className="text-sm text-muted">
            Hasta {MAX_IMAGES}. Las automotoras ofertan sin ver el auto en persona, así que las
            fotos son casi toda la base del precio.
          </p>
        </div>

        <input
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="block w-full text-sm"
        />

        {previews.length > 0 && (
          <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <li key={src} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-2">
                <Image src={src} alt="" fill unoptimized className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Quitar la foto ${i + 1}`}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Input
        label="Tu teléfono"
        required
        type="tel"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        maxLength={40}
        placeholder="Ej. 099 123 456"
        hint="No se lo damos a nadie hasta que vos aceptes una oferta"
      />

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} block size="lg">
        {progress ?? 'Publicar y recibir ofertas'}
      </Button>

      <p className="text-xs text-muted text-center">
        Gratis y sin compromiso. Tu auto no se publica en internet: sólo lo ven las automotoras
        registradas en TodoMotor.
      </p>
    </form>
  )
}
