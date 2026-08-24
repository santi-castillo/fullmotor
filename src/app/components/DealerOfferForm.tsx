'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { DealerListing, MyOffer, OfferCurrency } from '@/types/private-listing'
import { placeOffer, withdrawOffer } from '@/lib/private-listings-api'
import { translateApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/format'
import { Button } from './ui/Button'
import { Input, Textarea } from './ui/Input'
import { Select } from './ui/Select'

/**
 * The dealership's bid on one car.
 *
 * An upsert on the API side, so this form does not care whether an offer
 * already exists — it prefills from `myOffer` when there is one and posts the
 * same way either way.
 */
export default function DealerOfferForm({
  listing,
  onSaved,
}: {
  listing: DealerListing
  onSaved: (offer: MyOffer | null) => void
}) {
  const existing = listing.myOffer && listing.myOffer.status !== 'withdrawn' ? listing.myOffer : undefined

  const [amount, setAmount] = useState(existing ? String(existing.amount) : '')
  const [currency, setCurrency] = useState<OfferCurrency>(existing?.currency ?? 'UYU')
  const [note, setNote] = useState(existing?.note ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)

  if (!listing.acceptsOffers) {
    return (
      <div className="rounded-xl border border-line p-4 space-y-1">
        <p className="text-sm font-medium text-ink">Esta cotización ya no recibe ofertas</p>
        {existing && (
          <p className="text-sm text-muted">
            Tu oferta fue de {formatPrice(existing.currency, existing.amount)}. El vendedor todavía
            puede aceptarla.
          </p>
        )}
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) {
      setError('Escribí cuánto ofrecés.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const saved = await placeOffer(listing.id, {
        amount: value,
        currency,
        note: note.trim() || undefined,
      })
      onSaved(saved)
    } catch (err) {
      setError(translateApiError(err, 'no pudimos guardar tu oferta'))
    } finally {
      setSaving(false)
    }
  }

  const handleWithdraw = async () => {
    setWithdrawing(true)
    setError(null)
    try {
      await withdrawOffer(listing.id)
      onSaved(null)
      setAmount('')
      setNote('')
    } catch (err) {
      setError(translateApiError(err, 'no pudimos retirar tu oferta'))
    } finally {
      setWithdrawing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-line p-4 space-y-4">
      <div className="space-y-1">
        <h2 className="font-medium text-ink">{existing ? 'Tu oferta' : 'Ofertá por este auto'}</h2>
        <p className="text-sm text-muted">
          No ves lo que ofrecieron las demás automotoras, ni ellas lo tuyo. Poné tu mejor precio de
          entrada.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Input
            label="Cuánto ofrecés"
            required
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej. 750000"
          />
        </div>
        <div className="tm-field">
          <span className="tm-field__label">Moneda</span>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as OfferCurrency)}
            options={[
              { value: 'UYU', label: '$ (UYU)' },
              { value: 'USD', label: 'US$ (USD)' },
            ]}
          />
        </div>
      </div>

      <Textarea
        label="Condiciones"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={300}
        rows={2}
        placeholder="Ej. Sujeto a ver el auto y verificar que no tenga deuda de patente."
        hint="Opcional. El vendedor las ve junto al monto"
      />

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" loading={saving}>
          {existing ? 'Actualizar oferta' : 'Enviar oferta'}
        </Button>
        {existing && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleWithdraw}
            loading={withdrawing}
            iconLeft={<Trash2 size={15} aria-hidden="true" />}
          >
            Retirar
          </Button>
        )}
      </div>

      <p className="text-xs text-muted">
        La oferta es una estimación sobre lo declarado y las fotos, sujeta a ver el auto. Si el
        vendedor la acepta y después no la respetás sin motivo, puede reportarlo y la cuenta puede
        quedar suspendida.
      </p>
    </form>
  )
}
