'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import type { PrivateListing } from '@/types/private-listing'
import { fetchMyPrivateListings } from '@/lib/private-listings-api'
import { translateApiError } from '@/lib/api-error'
import { formatNumber, formatPrice } from '@/lib/format'
import RequireAuth from '../../components/RequireAuth'
import OfferCountdown from '../../components/OfferCountdown'
import PrivateListingStatusBadge from '../../components/PrivateListingStatusBadge'
import { Button, ButtonLink } from '../../components/ui/Button'

const PAGE_SIZE = 12

function MisCotizacionesInner() {
  const [listings, setListings] = useState<PrivateListing[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, meta } = await fetchMyPrivateListings({ page, limit: PAGE_SIZE })
      setListings(data)
      setLastPage(meta.lastPage)
      setError(null)
    } catch (err) {
      setError(translateApiError(err, 'no pudimos cargar tus cotizaciones'))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink" style={{ letterSpacing: '-0.02em' }}>
          Mis cotizaciones
        </h1>
        <ButtonLink href="/cotizar/nuevo" size="sm" iconLeft={<Plus size={15} aria-hidden="true" />}>
          Cotizar otro auto
        </ButtonLink>
      </header>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {loading && listings.length === 0 && (
        <div className="py-20 flex justify-center">
          <div
            className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"
            aria-label="Cargando"
          />
        </div>
      )}

      {!loading && listings.length === 0 && !error && (
        <div className="rounded-xl border border-line p-8 text-center space-y-3">
          <p className="font-medium text-ink">Todavía no cotizaste ningún auto</p>
          <p className="text-sm text-muted">
            Cargalo una vez y en 72 horas tenés las ofertas de las automotoras registradas.
          </p>
          <ButtonLink href="/cotizar/nuevo">Cotizar mi auto</ButtonLink>
        </div>
      )}

      <ul className="space-y-3">
        {listings.map((l) => (
          <li key={l.id}>
            <Link
              href={`/cotizar/${l.id}`}
              className="flex gap-4 rounded-xl border border-line p-4 hover:border-ink transition-colors"
            >
              <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-2">
                {l.images[0] ? (
                  <Image src={l.images[0]} alt="" fill className="object-cover" sizes="96px" />
                ) : null}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium text-ink capitalize truncate">
                  {l.brand} {l.model} {l.year}
                </p>
                <p className="text-sm text-muted">
                  {formatNumber(l.mileageKm)} km · {l.city}, {l.department}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrivateListingStatusBadge status={l.status} />
                  <OfferCountdown closesAt={l.closesAt} acceptsOffers={l.acceptsOffers} />
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm text-muted">
                  {l.offerCount === 1 ? '1 oferta' : `${l.offerCount} ofertas`}
                </p>
                {/* Offers arrive sorted best first, so the top one is the
                    headline number the seller is waiting on — but only when
                    they share a currency. Across currencies the order is a
                    grouping, not a ranking, and printing the first as the
                    headline would advertise the wrong number. */}
                {l.offers[0] && !l.mixedCurrencies && (
                  <p className="font-display font-bold text-ink tabular-nums">
                    {formatPrice(l.offers[0].currency, l.offers[0].amount)}
                  </p>
                )}
                {l.mixedCurrencies && (
                  <p className="text-xs text-muted">en $ y US$</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-muted">
            {page} de {lastPage}
          </span>
          <Button size="sm" variant="ghost" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}

export default function MisCotizacionesClient() {
  return (
    <RequireAuth>
      <MisCotizacionesInner />
    </RequireAuth>
  )
}
