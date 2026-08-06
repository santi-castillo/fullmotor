'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle, Pause, Pencil, Play, Sparkles, Trash2 } from 'lucide-react'
import { Classified, ClassifiedStatus } from '@/types/classified'
import { deleteClassified, updateClassified } from '@/lib/classifieds-api'
import { useAuth } from './AuthProvider'
import { Button, ButtonLink } from './ui/Button'
import UpgradeDialog from './UpgradeDialog'
import StatusBadge from './StatusBadge'
import { translateApiError } from '@/lib/api-error'

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
      const message = translateApiError(err, 'Error al actualizar estado')
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
      const message = translateApiError(err, 'Error al eliminar')
      setError(message)
      setBusy(false)
    }
  }

  return (
    <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="tm-eyebrow">Tus acciones</h3>
        <StatusBadge status={status} expiresAt={classified.expiresAt} />
      </div>

      <div className="flex flex-wrap gap-2">
        <ButtonLink
          href={`/clasificados/${classified.id}/editar`}
          variant="secondary"
          size="sm"
          iconLeft={<Pencil size={14} aria-hidden="true" />}
        >
          Editar
        </ButtonLink>

        {status === 'active' && (
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            iconLeft={<Pause size={14} aria-hidden="true" />}
            onClick={() => handleStatusChange('paused')}
          >
            Pausá
          </Button>
        )}
        {status !== 'active' && (
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            iconLeft={<Play size={14} aria-hidden="true" />}
            onClick={() => handleStatusChange('active')}
          >
            Reactivá
          </Button>
        )}
        {status !== 'sold' && (
          <Button
            variant="soft"
            size="sm"
            disabled={busy}
            iconLeft={<CheckCircle size={14} aria-hidden="true" />}
            onClick={() => handleStatusChange('sold')}
          >
            Marcá como vendido
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button
          size="sm"
          disabled={busy}
          iconLeft={<Sparkles size={14} aria-hidden="true" />}
          onClick={() => setUpgradeOpen(true)}
        >
          Destacá tu aviso
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={busy}
          className="ml-auto [--_fg:var(--danger)]"
          iconLeft={<Trash2 size={14} aria-hidden="true" />}
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </div>

      {classified.contactInfo && !classified.showContactInfo && (
        <p className="text-xs text-muted border-t border-line pt-3">
          Contacto privado: <span className="font-mono text-ink">{classified.contactInfo}</span>
        </p>
      )}

      {error && <p className="text-sm text-danger-ink">{error}</p>}

      <UpgradeDialog
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        classifiedId={classified.id}
      />
    </div>
  )
}
