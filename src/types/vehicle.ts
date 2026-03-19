export interface Vehicle {
  id: string
  slug: string
  countryCode: string
  vehicleType: string
  vehicleSubtype: string[] | null
  brand: string
  model: string
  year: number
  version?: string
  modelFamilyId?: string
  relatedVersions?: {
    slug: string
    version: string
    price: number
    currency: string
  }[]
  category: 'autos' | 'suvs' | 'pickups' | 'motos' | 'utilitarios'
  subcategory?: string // Keeping this as optional if it was used for something else, or maybe it is redundant with vehicleSubtype
  currency: string
  price: number
  engineCc?: number
  engineHp?: number
  engineTorque?: number
  fuelType?: string
  transmission?: string
  gears?: number
  length?: number
  width?: number
  height?: number
  wheelbase?: number
  trunkCapacity?: number
  fuelTank?: number
  weight?: number
  autonomyKm?: number
  batteryKwh?: number
  safetyFeatures: string[]
  equipment: string[]
  image?: string
  images: string[]
  description?: string
  createdAt?: string
  updatedAt?: string
}

export type Category = 'autos' | 'suvs' | 'pickups' | 'motos' | 'utilitarios'

export const CATEGORIES: { id: Category; name: string; icon: string }[] = [
  { id: 'autos', name: 'Autos', icon: '🚗' },
  { id: 'suvs', name: 'SUVs', icon: '🚙' },
  { id: 'pickups', name: 'Camionetas', icon: '🛻' },
  { id: 'motos', name: 'Motos', icon: '🏍️' },
  { id: 'utilitarios', name: 'Utilitarios', icon: '🚐' },
]
