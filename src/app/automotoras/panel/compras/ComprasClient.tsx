'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import type { DealerListing } from '@/types/private-listing'
import { fetchDealerFeed } from '@/lib/private-listings-api'
import { translateApiError } from '@/lib/api-error'
import { formatNumber, formatPrice } from '@/lib/format'
import { DEPARTAMENTOS } from '@/lib/uruguay'
import { fuelTypeLabels, transmissionLabels } from '@/types/classified'
import RequireDealership from '../../../components/RequireDealership'
import OfferCountdown from '../../../components/OfferCountdown'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

const PAGE_SIZE = 12

function ComprasInner() {
  const [listings, setListings] = useState<DealerListing[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // On by default: what a dealership opens this page to find is what it has not
  // priced yet, not the whole board again.
  const [onlyPending, setOnlyPending] = useState(true)
  const [department, setDepartment] = useState('')
  const [maxKm, setMaxKm] = useState('')

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true)
      try {
        const { data, meta } = await fetchDealerFeed(
          {
            page,
            limit: PAGE_SIZE,
            onlyPending,
            department: department || undefined,
            maxKm: maxKm ? Number(maxKm) : undefined,
          },
          signal
        )
        setListings(data)
        setTotal(meta.total)
        setLastPage(meta.lastPage)
        setError(null)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError(translateApiError(err, 'no pudimos cargar los autos para tasar'))
      } finally {
        setLoading(false)
      }
    },
    [page, onlyPending, department, maxKm]
  )

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  // Any filter change invalidates the page number — staying on page 3 of a
  // narrower result set shows an empty list that looks like a bug.
  useEffect(() => {
    setPage(1)
  }, [onlyPending, department, maxKm])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/automotoras/panel"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Mi panel
      </Link>

      <header className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-ink" style={{ letterSpacing: '-0.02em' }}>
          Autos para tasar
        </h1>
        <p className="text-sm text-muted">
          Particulares que pusieron su auto a cotizar. Ofertás a ciegas: no ves lo que ofrecieron
          las demás automotoras, ni ellas lo tuyo. Los que cierran antes van primero.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-3">
        <Button
          size="sm"
          variant={onlyPending ? 'primary' : 'ghost'}
          onClick={() => setOnlyPending((v) => !v)}
          aria-pressed={onlyPending}
        >
          Sin mi oferta
        </Button>

        <Select
          label="Departamento"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Todos"
          options={[...DEPARTAMENTOS]}
          size="sm"
        />

        <Input
          label="Km máximo"
          type="number"
          inputMode="numeric"
          size="sm"
          value={maxKm}
          onChange={(e) => setMaxKm(e.target.value)}
          placeholder="Sin límite"
        />
      </div>

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
        <div className="rounded-xl border border-line p-8 text-center space-y-1">
          <p className="font-medium text-ink">No hay autos esperando tu oferta</p>
          <p className="text-sm text-muted">
            {onlyPending
              ? 'Ya ofertaste por todo lo que hay abierto. Te avisamos por mail cuando entre uno nuevo.'
              : 'Cuando un particular ponga su auto a cotizar, lo vas a ver acá.'}
          </p>
        </div>
      )}

      {listings.length > 0 && (
        <>
          <p className="text-sm text-muted">
            {total === 1 ? '1 auto' : `${total} autos`}
          </p>

          <ul className="space-y-3">
            {listings.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/automotoras/panel/compras/${l.id}`}
                  className="flex gap-4 rounded-xl border border-line p-4 hover:border-ink transition-colors"
                >
                  <div className="relative w-28 h-24 shrink-0 rounded-lg overflow-hidden bg-surface-2">
                    {l.images[0] ? (
                      <Image src={l.images[0]} alt="" fill className="object-cover" sizes="112px" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium text-ink capitalize truncate">
                      {l.brand} {l.model} {l.year}
                      {l.version && <span className="text-muted font-normal"> {l.version}</span>}
                    </p>
                    <p className="text-sm text-muted">
                      {formatNumber(l.mileageKm)} km ·{' '}
                      {fuelTypeLabels[l.fuelType] ?? l.fuelType} ·{' '}
                      {transmissionLabels[l.transmission] ?? l.transmission}
                    </p>
                    <p className="text-sm text-muted">
                      {l.city}, {l.department}
                    </p>
                    <div className="pt-1">
                      <OfferCountdown closesAt={l.closesAt} acceptsOffers={l.acceptsOffers} />
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {l.myOffer && l.myOffer.status !== 'withdrawn' ? (
                      <>
                        <Badge tone="accent">Ofertaste</Badge>
                        <p className="font-display font-bold text-ink tabular-nums mt-1">
                          {formatPrice(l.myOffer.currency, l.myOffer.amount)}
                        </p>
                      </>
                    ) : (
                      <Badge tone="warning">Sin ofertar</Badge>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

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

export default function ComprasClient() {
  return (
    <RequireDealership>
      <ComprasInner />
    </RequireDealership>
  )
}
