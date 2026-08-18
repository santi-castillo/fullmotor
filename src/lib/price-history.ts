import type { PriceHistoryEntry } from '@/types/vehicle'
import { formatDate, formatPrice } from '@/lib/format'

/** A drop this recent still earns a "Bajó de precio" badge on the ficha. */
export const PRICE_DROP_DAYS = 30

/** Baseline rows (create/backfill) carry no previous price: "known since". */
export function isBaseline(e: PriceHistoryEntry): boolean {
  return e.oldPrice == null
}

export interface PriceDelta {
  /** Signed percentage, negative on a drop: -8.3 */
  pct: number
  amount: number
  direction: 'down' | 'up'
}

/**
 * Relative change of one row, or null when it can't be expressed as a
 * percentage: baseline rows, a currency switch (comparing USD to UYU is
 * meaningless), or an old price of 0.
 */
export function priceDelta(e: PriceHistoryEntry): PriceDelta | null {
  if (e.oldPrice == null || e.newPrice == null || e.oldPrice === 0) return null
  if (e.oldCurrency && e.oldCurrency !== e.currency) return null
  const amount = e.newPrice - e.oldPrice
  if (amount === 0) return null
  return {
    pct: (amount / e.oldPrice) * 100,
    amount,
    direction: amount < 0 ? 'down' : 'up',
  }
}

/** True when the newest row is a drop within PRICE_DROP_DAYS. Expects newest-first order. */
export function hasRecentPriceDrop(history?: PriceHistoryEntry[]): boolean {
  const latest = history?.[0]
  if (!latest) return false
  const delta = priceDelta(latest)
  if (!delta || delta.direction !== 'down') return false
  const at = Date.parse(latest.changedAt)
  if (Number.isNaN(at)) return false
  return Date.now() - at <= PRICE_DROP_DAYS * 24 * 60 * 60 * 1000
}

/** "−8,3 %" / "+2 %" — es-UY decimal comma, real minus sign, one decimal max. */
export function formatPercent(pct: number): string {
  const abs = Math.abs(pct).toLocaleString('es-UY', { maximumFractionDigits: 1 })
  return `${pct < 0 ? '−' : '+'}${abs} %`
}

/** Row label for a real change: "USD 42.000 → USD 39.900". */
export function formatChange(e: PriceHistoryEntry): { from: string; to: string } {
  return {
    from: formatPrice(e.oldCurrency ?? e.currency, e.oldPrice),
    to: formatPrice(e.currency, e.newPrice),
  }
}

/** Date of the row, formatted for the list. */
export function formatChangedAt(e: PriceHistoryEntry): string {
  return formatDate(e.changedAt)
}
