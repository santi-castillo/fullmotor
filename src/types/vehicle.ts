export interface Vehicle {
  id: string
  slug: string
  brand: string
  model: string
  year: number
  version?: string
  category: 'autos' | 'suvs' | 'camionetas' | 'motos'
  subcategory?: string
  priceUYU?: number
  priceUSD?: number
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
  safetyFeatures: string[]
  equipment: string[]
  images: string[]
  description?: string
  createdAt: string
  updatedAt: string
}

export type Category = 'autos' | 'suvs' | 'camionetas' | 'motos'

export const CATEGORIES: { id: Category; name: string; icon: string }[] = [
  { id: 'autos', name: 'Autos', icon: '🚗' },
  { id: 'suvs', name: 'SUVs', icon: '🚙' },
  { id: 'camionetas', name: 'Camionetas', icon: '🛻' },
  { id: 'motos', name: 'Motos', icon: '🏍️' },
]
