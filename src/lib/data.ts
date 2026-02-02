import { Vehicle, Category, CATEGORIES } from '@/types/vehicle'
import { fetchVehicles, fetchVehicleBySlug as apiFetchVehicleBySlug } from './api'

// Re-export CATEGORIES for components that need it
export { CATEGORIES }

export async function getAllVehicles(): Promise<Vehicle[]> {
  try {
    const { vehicles } = await fetchVehicles({ limit: 100 })
    return vehicles
  } catch (error) {
    console.warn("Failed to fetch vehicles (likely empty DB during build). Returning empty list.", error)
    return []
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  const vehicle = await apiFetchVehicleBySlug(slug)
  return vehicle || undefined
}

export async function getVehiclesByCategory(category: Category): Promise<Vehicle[]> {
  const { vehicles } = await fetchVehicles({ category, limit: 100 })
  return vehicles.sort((a, b) => a.brand.localeCompare(b.brand))
}

export async function getLatestVehicles(limit: number = 6): Promise<Vehicle[]> {
  const { vehicles } = await fetchVehicles({ limit, sort: 'newest' })
  return vehicles
}

export async function getCountByCategory(): Promise<{ id: Category; name: string; icon: string; count: number }[]> {
  const { vehicles } = await fetchVehicles({ limit: 1000 })
  return CATEGORIES.map(cat => ({
    ...cat,
    count: vehicles.filter(v => v.category === cat.id).length
  }))
}

export async function searchVehiclesLocal(query: string, category?: Category): Promise<Vehicle[]> {
  const { vehicles } = await fetchVehicles({ category, limit: 100 })

  if (!query) return vehicles

  const q = query.toLowerCase()
  return vehicles.filter(v =>
    v.brand.toLowerCase().includes(q) ||
    v.model.toLowerCase().includes(q) ||
    (v.description?.toLowerCase().includes(q))
  )
}

export async function getVehiclesBrands(): Promise<string[]> {
  const { vehicles } = await fetchVehicles({ limit: 1000 })
  return [...new Set(vehicles.map(v => v.brand))].sort()
}
