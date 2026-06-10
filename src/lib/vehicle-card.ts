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
    image: v.image || v.images?.[0],
  }
}
