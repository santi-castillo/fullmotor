'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { DealerListing, MyOffer } from '@/types/private-listing'
import { fetchDealerListing } from '@/lib/private-listings-api'
import { translateApiError } from '@/lib/api-error'
import { formatNumber } from '@/lib/format'
import { fuelTypeLabels, transmissionLabels } from '@/types/classified'
import RequireDealership from '../../../../components/RequireDealership'
import OfferCountdown from '../../../../components/OfferCountdown'
import DealerOfferForm from '../../../../components/DealerOfferForm'

function CompraDetailInner() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [listing, setListing] = useState<DealerListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    try {
      setListing(await fetchDealerListing(id))
      setError(null)
    } catch (err) {
      setError(translateApiError(err, 'no pudimos cargar este auto'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const handleSaved = (offer: MyOffer | null) => {
    setSaved(true)
    setListing((prev) => (prev ? { ...prev, myOffer: offer ?? undefined } : prev))
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex justify-center">
        <div
          className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"
          aria-label="Cargando"
        />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">No encontramos este auto</h1>
        <p className="text-sm text-muted">{error ?? 'Puede que el vendedor lo haya dado de baja.'}</p>
        <Link href="/automotoras/panel/compras" className="tm-btn">
          Ver autos para tasar
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Link
        href="/automotoras/panel/compras"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Autos para tasar
      </Link>

      <header className="space-y-2">
        <OfferCountdown closesAt={listing.closesAt} acceptsOffers={listing.acceptsOffers} />
        <h1
          className="font-display text-2xl sm:text-3xl font-bold text-ink capitalize"
          style={{ letterSpacing: '-0.02em' }}
        >
          {listing.brand} {listing.model} {listing.year}
          {listing.version && <span className="text-muted font-normal"> {listing.version}</span>}
        </h1>
        <p className="text-sm text-muted">
          {formatNumber(listing.mileageKm)} km ·{' '}
          {fuelTypeLabels[listing.fuelType] ?? listing.fuelType} ·{' '}
          {transmissionLabels[listing.transmission] ?? listing.transmission} · {listing.city},{' '}
          {listing.department}
        </p>
      </header>

      {listing.images.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {listing.images.map((src) => (
            <li key={src} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-2">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </li>
          ))}
        </ul>
      )}

      {listing.description && (
        <section className="space-y-1">
          <h2 className="font-medium text-ink">Lo que dice el vendedor</h2>
          <p className="text-sm text-muted whitespace-pre-line">{listing.description}</p>
        </section>
      )}

      {saved && (
        <p role="status" className="text-sm text-ink">
          Guardamos tu oferta. Si el vendedor la acepta, te pasamos su teléfono.
        </p>
      )}

      <DealerOfferForm listing={listing} onSaved={handleSaved} />
    </div>
  )
}

export default function CompraDetailClient() {
  return (
    <RequireDealership>
      <CompraDetailInner />
    </RequireDealership>
  )
}
