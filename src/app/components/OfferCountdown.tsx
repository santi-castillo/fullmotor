'use client'

import { useEffect, useState } from 'react'

/**
 * Time left before a quote request stops taking offers.
 *
 * Reaching zero is not the end of the story, which is why the copy changes
 * rather than disappearing: the window closing stops dealerships from bidding,
 * it does not take away the offers the seller already collected.
 *
 * `acceptsOffers` comes from the API, which resolves the window against its own
 * clock. This ticks for the display only — a device with a skewed clock should
 * see a slightly wrong countdown, never a different answer about whether it can
 * still bid.
 */
export default function OfferCountdown({
  closesAt,
  acceptsOffers,
  className = '',
}: {
  closesAt: string
  acceptsOffers: boolean
  className?: string
}) {
  const target = new Date(closesAt).getTime()
  const [remaining, setRemaining] = useState(() => target - Date.now())

  useEffect(() => {
    if (!acceptsOffers) return
    const id = setInterval(() => setRemaining(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target, acceptsOffers])

  if (!acceptsOffers || remaining <= 0) {
    return (
      <span className={`text-sm text-muted ${className}`}>
        Cerrada a ofertas nuevas
      </span>
    )
  }

  const totalMinutes = Math.floor(remaining / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const seconds = Math.floor((remaining % 60000) / 1000)

  // Under twelve hours the number stops being background information and starts
  // being the reason to act, so it gets the accent colour.
  const urgent = remaining < 12 * 60 * 60 * 1000

  return (
    <span
      className={`text-sm font-medium tabular-nums ${urgent ? 'text-accent' : 'text-ink'} ${className}`}
      // The seconds tick, so a screen reader announcing every change would be
      // unusable. The label carries the coarse version instead.
      aria-label={`Cierra en ${hours} horas y ${minutes} minutos`}
    >
      {hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min ${seconds} s`}
    </span>
  )
}
