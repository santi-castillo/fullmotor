import type { Vehicle } from '@/types/vehicle'

/** Props contract of components/ui/VehicleCard — lives outside the
 *  client module so server components can map Vehicle → props. */
export interface VehicleCardProps {
  slug: string
  brand: string
  model: string
  version?: string
  year: number
  price: number
  currency?: string
  power?: number
  fuelType?: string
  condition?: string
  image?: string
  /** Hide the save (heart) button — e.g. inside non-interactive contexts */
  hideSave?: boolean
  sizes?: string
}

const RECENT_DAYS = 30

/**
 * "Nuevo" means recently listed, not 0 km — we don't have condition data.
 *
 * Prefers the editorial publishedAt so a re-dated listing reads as new, and
 * falls back to createdAt for rows that predate that field.
 */
export function isRecentlyListed(publishedAt?: string, createdAt?: string): boolean {
  const raw = publishedAt || createdAt
  if (!raw) return false
  const listed = Date.parse(raw)
  if (Number.isNaN(listed)) return false
  return Date.now() - listed <= RECENT_DAYS * 24 * 60 * 60 * 1000
}

export function vehicleToCardProps(v: Vehicle): VehicleCardProps {
  return {
    slug: v.slug,
    brand: v.brand,
    model: v.model,
    version: v.version,
    year: v.year,
    price: v.price,
    currency: v.currency,
    power: v.engineHp,
    fuelType: v.fuelType,
    condition: isRecentlyListed(v.publishedAt, v.createdAt) ? 'Nuevo' : undefined,
    image: v.image || v.images?.[0],
  }
}
