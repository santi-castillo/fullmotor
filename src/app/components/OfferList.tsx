'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, MessageCircle, Phone, ShieldAlert } from 'lucide-react'
import type { PrivateListing, SellerOffer } from '@/types/private-listing'
import { formatPrice } from '@/lib/format'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

/**
 * The offers on a seller's quote request, best first.
 *
 * Every offer names its dealership from the moment it lands: the seller is not
 * only picking a number, they are picking who to hand the car to. The phone
 * arrives only with the accept, which is what keeps the list from being mined
 * to negotiate outside the platform.
 */
export default function OfferList({
  listing,
  onAccept,
  onReport,
}: {
  listing: PrivateListing
  onAccept: (offerId: string) => Promise<void>
  onReport: (offerId: string) => void
}) {
  const [confirming, setConfirming] = useState<string | null>(null)
  const [accepting, setAccepting] = useState<string | null>(null)

  if (listing.offers.length === 0) {
    return (
      <div className="rounded-xl border border-line p-6 text-center space-y-1">
        <p className="text-sm font-medium text-ink">Todavía no hay ofertas</p>
        <p className="text-sm text-muted">
          {listing.acceptsOffers
            ? 'Les avisamos a las automotoras. Suelen empezar a llegar en las primeras horas.'
            : 'La ventana cerró sin ofertas. Podés volver a publicar el auto cuando quieras.'}
        </p>
      </div>
    )
  }

  const handleAccept = async (offerId: string) => {
    setAccepting(offerId)
    try {
      await onAccept(offerId)
    } finally {
      setAccepting(null)
      setConfirming(null)
    }
  }

  return (
    <ul className="space-y-3">
      {listing.offers.map((offer, index) => (
        <OfferRow
          key={offer.id}
          offer={offer}
          // Only meaningful while nothing has been accepted: once the seller
          // picks, "the highest" stops being the useful label.
          isBest={index === 0 && !listing.acceptedOfferId}
          isAccepted={listing.acceptedOfferId === offer.id}
          canAccept={listing.canAccept}
          confirming={confirming === offer.id}
          accepting={accepting === offer.id}
          onConfirm={() => setConfirming(offer.id)}
          onCancelConfirm={() => setConfirming(null)}
          onAccept={() => handleAccept(offer.id)}
          onReport={() => onReport(offer.id)}
        />
      ))}
    </ul>
  )
}

function OfferRow({
  offer,
  isBest,
  isAccepted,
  canAccept,
  confirming,
  accepting,
  onConfirm,
  onCancelConfirm,
  onAccept,
  onReport,
}: {
  offer: SellerOffer
  isBest: boolean
  isAccepted: boolean
  canAccept: boolean
  confirming: boolean
  accepting: boolean
  onConfirm: () => void
  onCancelConfirm: () => void
  onAccept: () => void
  onReport: () => void
}) {
  const { dealership } = offer

  return (
    <li className={`rounded-xl border p-4 ${isAccepted ? 'border-accent' : 'border-line'}`}>
      <div className="flex items-start gap-3">
        {dealership.logoUrl ? (
          <Image
            src={dealership.logoUrl}
            alt=""
            width={44}
            height={44}
            className="rounded-lg object-contain bg-surface-2 shrink-0"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-11 h-11 rounded-lg bg-surface-2 shrink-0 grid place-items-center text-sm font-semibold text-muted"
          >
            {dealership.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/automotoras/${dealership.slug}`}
              className="font-medium text-ink hover:underline truncate"
            >
              {dealership.name}
            </Link>
            {isBest && <Badge tone="positive">La más alta</Badge>}
            {isAccepted && <Badge tone="accent">Aceptada</Badge>}
          </div>
          {dealership.city && <p className="text-sm text-muted">{dealership.city}</p>}
          {offer.note && <p className="text-sm text-muted mt-2">{offer.note}</p>}
        </div>

        <p className="font-display text-xl font-bold text-ink tabular-nums shrink-0">
          {formatPrice(offer.currency, offer.amount)}
        </p>
      </div>

      {isAccepted && (dealership.phone || dealership.whatsapp) && (
        <div className="mt-4 pt-4 border-t border-line flex flex-wrap gap-2">
          {dealership.whatsapp && (
            <a
              className="tm-btn tm-btn--sm"
              href={`https://wa.me/${dealership.whatsapp.replace(/[\s.\-()]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={15} aria-hidden="true" />
              WhatsApp
            </a>
          )}
          {dealership.phone && (
            <a className="tm-btn tm-btn--sm tm-btn--secondary" href={`tel:${dealership.phone}`}>
              <Phone size={15} aria-hidden="true" />
              {dealership.phone}
            </a>
          )}
          <Button variant="ghost" size="sm" onClick={onReport} iconLeft={<ShieldAlert size={15} aria-hidden="true" />}>
            No respetó la oferta
          </Button>
        </div>
      )}

      {!isAccepted && canAccept && (
        <div className="mt-4 pt-4 border-t border-line">
          {confirming ? (
            <div className="space-y-2">
              <p className="text-sm text-ink">
                Al aceptar cerrás la cotización: no vas a recibir más ofertas y te pasamos el
                contacto de {dealership.name}.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={onAccept} loading={accepting}>
                  Sí, aceptar
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancelConfirm} disabled={accepting}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={onConfirm}
              iconLeft={<Check size={15} aria-hidden="true" />}
            >
              Aceptar esta oferta
            </Button>
          )}
        </div>
      )}
    </li>
  )
}
