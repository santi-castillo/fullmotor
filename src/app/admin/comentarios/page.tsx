'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Search, Trash2, Undo2 } from 'lucide-react'
import { AdminComment, deleteComment, fetchComments, restoreComment } from '@/lib/ops-api'
import { translateApiError } from '@/lib/api-error'
import { formatDate } from '@/lib/format'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { FilterChip } from '../../components/ui/FilterChip'

const TABS = [
  { value: 'visible', label: 'Visibles' },
  { value: 'deleted', label: 'Eliminados' },
  { value: 'all', label: 'Todos' },
]

export default function CommentsPage() {
  const [status, setStatus] = useState('visible')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<AdminComment[]>([])
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
      const res = await fetchComments({ status, q: search || undefined, limit: 50 })
      setItems(res.data)
      setTotal(res.meta.total)
      setError(null)
    } catch (err) {
      setError(translateApiError(err, 'No pudimos cargar los comentarios'))
    } finally {
      setLoading(false)
    }
  }, [status, search])

  useEffect(() => {
    void load()
  }, [load])

  const act = async (comment: AdminComment, remove: boolean) => {
    setBusyId(comment.id)
    setError(null)
    try {
      await (remove ? deleteComment(comment.id) : restoreComment(comment.id))
      await load()
    } catch (err) {
      setError(translateApiError(err, 'No pudimos actualizar el comentario'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink" style={{ letterSpacing: '-0.03em' }}>
          Comentarios
        </h1>
        <p className="text-sm text-muted mt-2">
          Eliminar deja el comentario como &ldquo;Comentario eliminado&rdquo; en su lugar del hilo.
          Las respuestas siguen donde estaban, y se puede restaurar.
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
          placeholder="Buscar en el texto"
          iconLeft={<Search size={16} aria-hidden="true" />}
          aria-label="Buscar comentarios"
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
          <p className="text-sm text-muted">Ningún comentario con estos filtros.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted">
            {total} {total === 1 ? 'comentario' : 'comentarios'} con estos filtros.
          </p>

          <div className="space-y-3">
            {items.map((cm) => (
              <div
                key={cm.id}
                className="bg-surface border border-line rounded-[var(--radius-lg)] p-5 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{cm.userName}</p>
                    <p className="text-xs text-muted">{cm.userEmail}</p>
                    <p className="text-xs text-muted font-mono mt-1 truncate">{cm.resourceId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">{formatDate(cm.createdAt)}</p>
                    {cm.deleted && (
                      <span className="tm-eyebrow text-danger-ink">
                        {cm.deletedByRole === 'moderator' ? 'Eliminado por moderación' : 'Borrado por el autor'}
                      </span>
                    )}
                    {cm.userSuspended && (
                      <span className="tm-eyebrow text-danger-ink block">Autor de baja</span>
                    )}
                  </div>
                </div>

                {/* The real text, deleted or not: judging whether a removal
                    was right is impossible against the placeholder readers
                    see. */}
                <p className="text-sm text-body whitespace-pre-wrap">{cm.body}</p>

                {cm.parentId && <p className="text-xs text-muted">Es una respuesta dentro del hilo.</p>}

                <div className="flex flex-wrap gap-2">
                  {cm.deleted ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busyId === cm.id}
                      iconLeft={<Undo2 size={14} aria-hidden="true" />}
                      onClick={() => act(cm, false)}
                    >
                      Restaurar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="[--_fg:var(--danger)]"
                      disabled={busyId === cm.id}
                      iconLeft={<Trash2 size={14} aria-hidden="true" />}
                      onClick={() => act(cm, true)}
                    >
                      Eliminar
                    </Button>
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
