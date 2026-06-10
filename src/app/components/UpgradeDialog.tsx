'use client'

import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { ClassifiedTier, TIER_PRICES } from '@/types/classified'
import { upgradeClassified } from '@/lib/classifieds-api'
import { formatPrice } from '@/lib/format'
import { Button } from './ui/Button'

interface UpgradeDialogProps {
  open: boolean
  onClose: () => void
  classifiedId: string
}

export default function UpgradeDialog({ open, onClose, classifiedId }: UpgradeDialogProps) {
  const [selected, setSelected] = useState<Exclude<ClassifiedTier, 'free'>>('premium')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleClose = () => {
    setError(null)
    setBusy(false)
    setSelected('premium')
    onClose()
  }

  const handleUpgrade = async () => {
    setBusy(true)
    setError(null)
    try {
      const { initPoint } = await upgradeClassified(classifiedId, selected)
      window.location.href = initPoint
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar el pago'
      setError(message)
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-[rgba(8,21,46,0.45)] backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Destacá tu aviso"
        className="bg-surface rounded-[var(--radius-xl)] shadow-pop max-w-lg w-full p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <h2 className="font-display text-2xl font-bold text-ink mb-1">¿Querés destacar tu aviso?</h2>
        <p className="text-sm text-muted mb-6">
          Cada mejora extiende la publicación 30 días y le da más visibilidad.
        </p>

        <div className="space-y-3 mb-6">
          {(['premium', 'featured'] as const).map((tier) => {
            const isSelected = selected === tier
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setSelected(tier)}
                aria-pressed={isSelected}
                className={`w-full text-left p-4 rounded-[var(--radius-lg)] border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent-soft'
                    : 'border-line bg-surface hover:border-line-strong'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display font-bold text-base text-ink flex items-center gap-1.5">
                      {tier === 'featured' && (
                        <Star size={14} className="text-accent" aria-hidden="true" />
                      )}
                      {tier === 'premium' ? 'Premium' : 'Destacado'}
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {tier === 'premium'
                        ? 'Aparece arriba de los avisos gratuitos durante 30 días.'
                        : 'Primero en la lista durante 30 días, máxima visibilidad.'}
                    </p>
                  </div>
                  <span className="tm-price text-lg whitespace-nowrap">
                    {formatPrice('USD', TIER_PRICES[tier])}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {error && <p className="text-sm text-danger-ink mb-3">{error}</p>}

        <div className="flex items-center gap-3">
          <Button block loading={busy} onClick={handleUpgrade} className="flex-1">
            {busy
              ? 'Redirigiendo a MercadoPago…'
              : `Pagá ${formatPrice('USD', TIER_PRICES[selected])}`}
          </Button>
          <Button variant="ghost" disabled={busy} onClick={handleClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
