'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Ban } from 'lucide-react'
import type { PrivateListing } from '@/types/private-listing'
import {
  acceptOffer,
  cancelPrivateListing,
  fetchPrivateListing,
  reportOffer,
} from '@/lib/private-listings-api'
import { translateApiError } from '@/lib/api-error'
import { formatNumber } from '@/lib/format'
import { fuelTypeLabels, transmissionLabels } from '@/types/classified'
import RequireAuth from '../../components/RequireAuth'
import OfferCountdown from '../../components/OfferCountdown'
import OfferList from '../../components/OfferList'
import PrivateListingStatusBadge from '../../components/PrivateListingStatusBadge'
import ReportOfferDialog from '../../components/ReportOfferDialog'
import { Button } from '../../components/ui/Button'

/**
 * How often to re-fetch while the window is open.
 *
 * There is no websocket or SSE anywhere in this app, so "en tiempo real" here
 * means polling — near-live, not push, and worth being honest about. Twenty
 * seconds is frequent enough that an offer feels immediate and slow enough that
 * a tab left open all afternoon is not hammering the API.
 */
const POLL_MS = 20_000

function CotizacionDetailInner() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [listing, setListing] = useState<PrivateListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reporting, setReporting] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  // Kept in a ref so the polling effect does not restart on every refresh.
  const acceptsOffers = useRef(false)

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return
      try {
        const data = await fetchPrivateListing(id, signal)
        setListing(data)
        acceptsOffers.current = data.acceptsOffers
        setError(null)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError(translateApiError(err, 'no pudimos cargar la cotización'))
      } finally {
        setLoading(false)
      }
    },
    [id]
  )

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  useEffect(() => {
    // Polling stops once nothing more can arrive. A sold or cancelled listing
    // is finished, and a closed one takes no new offers, so continuing would be
    // pure noise.
    const tick = () => {
      if (acceptsOffers.current) load()
    }
    const interval = setInterval(tick, POLL_MS)

    // Coming back to the tab should show fresh numbers immediately rather than
    // whatever was on screen when it was hidden.
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [load])

  const handleAccept = async (offerId: string) => {
    if (!id) return
    try {
      setListing(await acceptOffer(id, offerId))
      acceptsOffers.current = false
      setError(null)
    } catch (err) {
      setError(translateApiError(err, 'no pudimos aceptar la oferta'))
    }
  }

  const handleCancel = async () => {
    if (!id) return
    setCancelling(true)
    try {
      setListing(await cancelPrivateListing(id))
      acceptsOffers.current = false
      setConfirmCancel(false)
      setError(null)
    } catch (err) {
      setError(translateApiError(err, 'no pudimos dar de baja la cotización'))
    } finally {
      setCancelling(false)
    }
  }

  const handleReport = async (reason: string) => {
    if (!id || !reporting) return
    await reportOffer(id, reporting, reason)
    setReporting(null)
    await load()
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
        <h1 className="font-display text-2xl font-bold text-ink">No encontramos esta cotización</h1>
        <p className="text-sm text-muted">{error ?? 'Puede que la hayas dado de baja.'}</p>
        <Link href="/cotizar/mis" className="tm-btn">
          Ver mis cotizaciones
        </Link>
      </div>
    )
  }

  const vehicle = `${listing.brand} ${listing.model} ${listing.year}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Link href="/cotizar/mis" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft size={15} aria-hidden="true" />
        Mis cotizaciones
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <PrivateListingStatusBadge status={listing.status} />
          <OfferCountdown closesAt={listing.closesAt} acceptsOffers={listing.acceptsOffers} />
        </div>

        <h1
          className="font-display text-2xl sm:text-3xl font-bold text-ink capitalize"
          style={{ letterSpacing: '-0.02em' }}
        >
          {vehicle}
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
        <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {listing.images.map((src) => (
            <li key={src} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-2">
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 640px) 33vw, 25vw" />
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink">
            {listing.offerCount === 1 ? '1 oferta' : `${listing.offerCount} ofertas`}
          </h2>
          {listing.acceptsOffers && (
            <p className="text-xs text-muted">Se actualiza sola cada 20 segundos</p>
          )}
        </div>

        {listing.status === 'closed' && listing.canAccept && listing.offerCount > 0 && (
          <p className="text-sm text-muted">
            La ventana cerró, pero todavía podés aceptar cualquiera de estas ofertas. Puede que la
            automotora la quiera revisar después de tanto tiempo, así que no la dejes enfriar.
          </p>
        )}

        <OfferList listing={listing} onAccept={handleAccept} onReport={setReporting} />
      </section>

      {listing.status !== 'sold' && listing.status !== 'cancelled' && (
        <section className="pt-4 border-t border-line">
          {confirmCancel ? (
            <div className="space-y-2">
              <p className="text-sm text-ink">
                Al dar de baja, las automotoras dejan de ver tu auto y perdés las ofertas
                recibidas. No se puede deshacer.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="danger" onClick={handleCancel} loading={cancelling}>
                  Sí, dar de baja
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmCancel(false)} disabled={cancelling}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmCancel(true)}
              iconLeft={<Ban size={15} aria-hidden="true" />}
            >
              Dar de baja esta cotización
            </Button>
          )}
        </section>
      )}

      {reporting && (
        <ReportOfferDialog
          onSubmit={handleReport}
          onClose={() => setReporting(null)}
        />
      )}
    </div>
  )
}

export default function CotizacionDetailClient() {
  return (
    <RequireAuth>
      <CotizacionDetailInner />
    </RequireAuth>
  )
}
