'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Check, X } from 'lucide-react'
import {
  fetchOfferReports,
  reviewOfferReport,
  type OfferReportForReview,
} from '@/lib/private-listings-api'
import { translateApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/format'
import RequireAuth from '../../components/RequireAuth'
import { useAuth } from '../../components/AuthProvider'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { FilterChip } from '../../components/ui/FilterChip'

const TABS = [
  { value: 'open', label: 'Sin revisar' },
  { value: 'upheld', label: 'Confirmados' },
  { value: 'dismissed', label: 'Desestimados' },
]

function ReportesInner() {
  const { user } = useAuth()
  const [status, setStatus] = useState('open')
  const [items, setItems] = useState<OfferReportForReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchOfferReports(status)
      setItems(res.data)
      setError(null)
    } catch (err) {
      setError(translateApiError(err, 'No pudimos cargar los reportes'))
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    void load()
  }, [load])

  // Client-side gate only, and deliberately so: the API is the real boundary
  // and answers 403 regardless. This just avoids showing an empty screen with
  // an error to someone who was never meant to be here.
  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">No tenés acceso a esta página</h1>
      </div>
    )
  }

  const review = async (id: string, decision: 'upheld' | 'dismissed') => {
    setBusyId(id)
    try {
      await reviewOfferReport(id, decision, notes[id])
      await load()
    } catch (err) {
      setError(translateApiError(err, 'No pudimos guardar la decisión'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-ink" style={{ letterSpacing: '-0.02em' }}>
          Ofertas no respetadas
        </h1>
        <p className="text-sm text-muted">
          Las ofertas son estimativas y sujetas a inspección, así que una revisión razonable no es
          un incumplimiento. Lo que importa acá es el patrón: mirá cuántos reportes confirmados
          arrastra la automotora antes de decidir.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <FilterChip key={t.value} active={status === t.value} onClick={() => setStatus(t.value)}>
            {t.label}
          </FilterChip>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-danger-soft text-danger-ink text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </div>
      )}

      {loading && (
        <div className="py-20 flex justify-center">
          <div
            className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"
            aria-label="Cargando"
          />
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <p className="text-sm text-muted py-10 text-center">No hay reportes en este estado.</p>
      )}

      <ul className="space-y-4">
        {items.map((r) => (
          <li key={r.id} className="bg-surface border border-line rounded-[var(--radius-lg)] p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/automotoras/${r.dealership.slug}`}
                    className="font-medium text-ink hover:underline"
                  >
                    {r.dealership.name}
                  </Link>
                  {r.dealership.status !== 'approved' && (
                    <Badge tone="danger">{r.dealership.status}</Badge>
                  )}
                  {r.dealership.upheldCount > 0 && (
                    <Badge tone="danger">
                      {r.dealership.upheldCount} confirmado
                      {r.dealership.upheldCount === 1 ? '' : 's'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted capitalize">{r.vehicle}</p>
              </div>

              <p className="font-display font-bold text-ink tabular-nums shrink-0">
                {formatPrice(r.offer.currency, r.offer.amount)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted uppercase tracking-wide">
                Lo que dice el vendedor
              </p>
              <p className="text-sm text-body whitespace-pre-line">{r.reason}</p>
            </div>

            {r.offer.note && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">
                  Condiciones que puso la automotora
                </p>
                <p className="text-sm text-body">{r.offer.note}</p>
              </div>
            )}

            {r.status === 'open' && (
              <div className="space-y-3 pt-2 border-t border-line">
                <Input
                  label="Nota interna"
                  value={notes[r.id] ?? ''}
                  onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                  maxLength={500}
                  hint="No la ve ni el vendedor ni la automotora"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => review(r.id, 'upheld')}
                    loading={busyId === r.id}
                    iconLeft={<Check size={15} aria-hidden="true" />}
                  >
                    Darle la razón al vendedor
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => review(r.id, 'dismissed')}
                    disabled={busyId === r.id}
                    iconLeft={<X size={15} aria-hidden="true" />}
                  >
                    Desestimar
                  </Button>
                </div>
                <p className="text-xs text-muted">
                  Confirmar un reporte no suspende la cuenta. Si el patrón lo amerita, suspendela
                  desde{' '}
                  <Link href="/admin/automotoras" className="underline">
                    automotoras
                  </Link>
                  .
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ReportesPage() {
  return (
    <RequireAuth>
      <ReportesInner />
    </RequireAuth>
  )
}
