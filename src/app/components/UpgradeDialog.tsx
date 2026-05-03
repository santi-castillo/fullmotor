'use client'

import { useState } from 'react'
import { ClassifiedTier, TIER_PRICES } from '@/types/classified'
import { upgradeClassified } from '@/lib/classifieds-api'

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div className="card max-w-lg w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)] transition-colors"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2 gradient-text">Mejorar publicación</h2>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Cada upgrade extiende 30 días y mejora la visibilidad.
        </p>

        <div className="space-y-3 mb-6">
          {(['premium', 'featured'] as const).map((tier) => {
            const isSelected = selected === tier
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setSelected(tier)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                    : 'border-[var(--border)] hover:border-[var(--primary-light)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-base">
                      {tier === 'premium' ? '✨ Premium' : '⭐ Destacado'}
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)] mt-1">
                      {tier === 'premium'
                        ? 'Aparece arriba de los avisos gratuitos durante 30 días.'
                        : 'Primero en la lista durante 30 días, máxima visibilidad.'}
                    </p>
                  </div>
                  <div className="price-tag whitespace-nowrap">
                    USD {TIER_PRICES[tier].toFixed(2)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-3">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={busy}
            className="btn btn-primary flex-1 disabled:opacity-60"
          >
            {busy ? 'Redirigiendo a MercadoPago…' : `Pagar USD ${TIER_PRICES[selected].toFixed(2)}`}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className="px-4 py-2 rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
