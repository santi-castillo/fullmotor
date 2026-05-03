'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Classified, ClassifiedStatus, statusLabels } from '@/types/classified'
import { deleteClassified, updateClassified } from '@/lib/classifieds-api'
import { useAuth } from './AuthProvider'
import UpgradeDialog from './UpgradeDialog'
import StatusBadge from './StatusBadge'

interface OwnerActionsProps {
  classified: Classified
}

export default function OwnerActions({ classified }: OwnerActionsProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [status, setStatus] = useState<ClassifiedStatus>(classified.status)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  // Only render for the owner
  if (!user || user.id !== classified.userId) {
    return null
  }

  const handleStatusChange = async (next: ClassifiedStatus) => {
    if (next === status) return
    setBusy(true)
    setError(null)
    try {
      const updated = await updateClassified(classified.id, { status: next })
      setStatus(updated.status)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar estado'
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return
    setBusy(true)
    setError(null)
    try {
      await deleteClassified(classified.id)
      router.push('/clasificados/mis')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      setError(message)
      setBusy(false)
    }
  }

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
          Tus acciones
        </h3>
        <StatusBadge status={status} expiresAt={classified.expiresAt} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['active', 'sold', 'paused'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleStatusChange(s)}
            disabled={busy || s === status}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              s === status
                ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary-light)]'
                : 'bg-[var(--glass-bg)] border-[var(--border)] hover:border-[var(--primary)] disabled:opacity-50'
            }`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/clasificados/${classified.id}/editar`}
          className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm hover:border-[var(--primary)] transition-colors"
        >
          ✏️ Editar
        </Link>
        <button
          type="button"
          onClick={() => setUpgradeOpen(true)}
          disabled={busy}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:opacity-90 transition-opacity"
        >
          ✨ Renovar / Mejorar
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="px-4 py-2 rounded-lg text-sm border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 ml-auto"
        >
          🗑️ Eliminar
        </button>
      </div>

      {classified.contactInfo && !classified.showContactInfo && (
        <p className="text-xs text-[var(--foreground-muted)] border-t border-[var(--border)] pt-3">
          Contacto privado: <span className="font-mono">{classified.contactInfo}</span>
        </p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <UpgradeDialog
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        classifiedId={classified.id}
      />
    </div>
  )
}
