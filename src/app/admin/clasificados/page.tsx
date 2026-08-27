'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Pause, Play, Search, Trash2, Undo2 } from 'lucide-react'
import {
  AdminClassified,
  deleteClassified,
  fetchClassifiedsForModeration,
  moderateClassifiedStatus,
  restoreClassified,
} from '@/lib/ops-api'
import { translateApiError } from '@/lib/api-error'
import { formatDate, formatPrice } from '@/lib/format'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { FilterChip } from '../../components/ui/FilterChip'

const TABS = [
  { value: 'active', label: 'Activos' },
  { value: 'paused', label: 'Pausados' },
  { value: 'sold', label: 'Vendidos' },
  { value: 'deleted', label: 'Eliminados' },
  { value: 'all', label: 'Todos' },
]

export default function ModerateClassifiedsPage() {
  const [status, setStatus] = useState('active')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<AdminClassified[]>([])
  const [total, setTotal] = useState<number | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), 300)
    return () => clearTimeout(timer)
  }, [query])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchClassifiedsForModeration({ status, q: search || undefined, limit: 50 })
      setItems(res.data)
      setTotal(res.meta.total)
      setError(null)
    } catch (err) {
      setError(translateApiError(err, 'No pudimos cargar los avisos'))
    } finally {
      setLoading(false)
    }
  }, [status, search])

  useEffect(() => {
    void load()
  }, [load])

  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id)
    setError(null)
    try {
      await action()
      await load()
    } catch (err) {
      setError(translateApiError(err, 'No pudimos actualizar el aviso'))
    } finally {
      setBusyId(null)
    }
  }

  const remove = (cl: AdminClassified) => {
    // The one destructive-looking action on this screen, and the confirm says
    // what it actually does: the photos survive the retention window, so this
    // is undoable until the purge runs.
    if (
      !window.confirm(
        `Eliminar "${cl.title}".\n\n` +
          'El aviso sale del sitio pero no se borra: se puede restaurar hasta que la ' +
          'purga lo destruya, treinta días después. Las fotos se van con él en ese momento.'
      )
    ) {
      return
    }
    void run(cl.id, () => deleteClassified(cl.id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink" style={{ letterSpacing: '-0.03em' }}>
          Clasificados
        </h1>
        <p className="text-sm text-muted mt-2">
          Pausar lo saca del listado y lo deja al alcance de su dueño. Eliminar es un borrado
          lógico: reversible hasta que la purga pase.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="iv__chips">
          {TABS.map((tab) => (
            <FilterChip key={tab.value} active={status === tab.value} onClick={() => setStatus(tab.value)}>
              {tab.label}
            </FilterChip>
          ))}
        </div>
        <Input
          className="flex-1 min-w-[220px]"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en título o descripción"
          iconLeft={<Search size={16} aria-hidden="true" />}
          aria-label="Buscar avisos"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-danger-soft text-danger-ink text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted py-10 text-center">Cargando…</p>
      ) : items.length === 0 ? (
        <div className="iv__empty">
          <h3 className="font-display text-lg font-bold text-ink mb-2">No hay nada acá</h3>
          <p className="text-sm text-muted">Ningún aviso con estos filtros.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted">
            {total} {total === 1 ? 'aviso' : 'avisos'} con estos filtros.
          </p>

          <div className="space-y-3">
            {items.map((cl) => (
              <div
                key={cl.id}
                className="bg-surface border border-line rounded-[var(--radius-lg)] p-5 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-bold text-ink">{cl.title}</h2>
                    <p className="text-sm text-muted">
                      {formatPrice(cl.currency, cl.price)} · {cl.city} · {cl.category}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {cl.user?.name} · {cl.userEmail}
                      {cl.userSuspended && ' · cuenta de baja'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="tm-eyebrow">{cl.deleted ? 'eliminado' : cl.status}</span>
                    <p className="text-xs text-muted">{formatDate(cl.createdAt)}</p>
                  </div>
                </div>

                {cl.deleted && (
                  <p className="text-sm text-danger-ink">
                    {cl.deletedByRole === 'moderator' ? 'Eliminado por moderación' : 'Borrado por su dueño'}
                    {cl.deletedAt && ` el ${formatDate(cl.deletedAt)}`}
                    {cl.purgeAfter && ` · se puede restaurar hasta el ${formatDate(cl.purgeAfter)}`}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 items-center">
                  {cl.deleted ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busyId === cl.id}
                      iconLeft={<Undo2 size={14} aria-hidden="true" />}
                      onClick={() => void run(cl.id, () => restoreClassified(cl.id))}
                    >
                      Restaurar
                    </Button>
                  ) : (
                    <>
                      {cl.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busyId === cl.id}
                          iconLeft={<Pause size={14} aria-hidden="true" />}
                          onClick={() => void run(cl.id, () => moderateClassifiedStatus(cl.id, 'paused'))}
                        >
                          Pausar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busyId === cl.id}
                          iconLeft={<Play size={14} aria-hidden="true" />}
                          onClick={() => void run(cl.id, () => moderateClassifiedStatus(cl.id, 'active'))}
                        >
                          Activar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="[--_fg:var(--danger)]"
                        disabled={busyId === cl.id}
                        iconLeft={<Trash2 size={14} aria-hidden="true" />}
                        onClick={() => remove(cl)}
                      >
                        Eliminar
                      </Button>
                      {/* Only for live listings: a deleted one 404s on the
                          public detail page, which is the point. */}
                      <Link
                        href={`/clasificados/${cl.id}`}
                        target="_blank"
                        className="text-xs text-muted underline"
                      >
                        Ver el aviso
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
