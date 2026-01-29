import { Vehicle, Category, CATEGORIES } from '@/types/vehicle'
import vehiclesData from '../../data/vehicles.json'

const vehicles: Vehicle[] = vehiclesData as Vehicle[]

export function getAllVehicles(): Vehicle[] {
  return vehicles
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find(v => v.slug === slug)
}

export function getVehiclesByCategory(category: Category): Vehicle[] {
  return vehicles
    .filter(v => v.category === category)
    .sort((a, b) => a.brand.localeCompare(b.brand))
}

export function getLatestVehicles(limit: number = 6): Vehicle[] {
  return vehicles.slice(0, limit)
}

export function getCountByCategory(): { id: Category; name: string; icon: string; count: number }[] {
  return CATEGORIES.map(cat => ({
    ...cat,
    count: vehicles.filter(v => v.category === cat.id).length
  }))
}

export function searchVehicles(query: string, category?: Category): Vehicle[] {
  let results = vehicles

  if (category) {
    results = results.filter(v => v.category === category)
  }

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(v =>
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      (v.description?.toLowerCase().includes(q))
    )
  }

  return results
}

export function getVehiclesBrands(): string[] {
  return [...new Set(vehicles.map(v => v.brand))].sort()
}
