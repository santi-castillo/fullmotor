'use client'

import { useEffect, useState } from 'react'
import { translateApiError } from '@/lib/api-error'
import { Button } from './ui/Button'
import { Textarea } from './ui/Input'

/**
 * The seller says a dealership did not honour the offer it accepted.
 *
 * The copy sets the bar deliberately. Offers here are indicative and a
 * dealership may legitimately revise after inspecting the car; a report is for
 * the other thing — quoting high to win and walking it back on arrival. Saying
 * so up front is what keeps the operator's queue worth reading.
 */
export default function ReportOfferDialog({
  onSubmit,
  onClose,
}: {
  onSubmit: (reason: string) => Promise<void>
  onClose: () => void
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = reason.trim()
    if (!trimmed) {
      setError('Contanos qué pasó.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(trimmed)
    } catch (err) {
      setError(translateApiError(err, 'no pudimos registrar el reporte'))
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        className="w-full max-w-md rounded-2xl bg-surface p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <h2 id="report-title" className="font-display text-lg font-bold text-ink">
            La automotora no respetó su oferta
          </h2>
          <p className="text-sm text-muted">
            Las ofertas son estimativas y sujetas a ver el auto, así que una diferencia razonable
            después de revisarlo es normal. Contanos si lo que pasó fue otra cosa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            // The shared Textarea does not forward a ref, and autoFocus is the
            // right behaviour for a dialog that opens on a deliberate click.
            autoFocus
            label="Qué pasó"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Ej. Ofertaron $700.000 y al ver el auto bajaron a $520.000 sin explicar por qué."
          />

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="submit" loading={submitting}>
              Enviar reporte
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
