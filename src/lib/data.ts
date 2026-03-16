import { Vehicle, Category, CATEGORIES } from '@/types/vehicle'
import { fetchVehicles, fetchVehicleBySlug as apiFetchVehicleBySlug, fetchCarouselItems } from './api'

// Re-export CATEGORIES for components that need it
export { CATEGORIES }

export async function getAllVehicles(): Promise<Vehicle[]> {
  try {
    const { vehicles } = await fetchVehicles({ limit: 100 })
    return vehicles
  } catch (error) {
    console.warn("getAllVehicles failed:", error)
    return []
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  try {
    const vehicle = await apiFetchVehicleBySlug(slug)
    return vehicle || undefined
  } catch (error) {
    console.warn(`getVehicleBySlug failed for ${slug}:`, error)
    return undefined
  }
}

export async function getVehiclesByCategory(category: Category): Promise<Vehicle[]> {
  try {
    const { vehicles } = await fetchVehicles({ category, limit: 100 })
    return vehicles.sort((a, b) => a.brand.localeCompare(b.brand))
  } catch (error) {
    console.warn(`getVehiclesByCategory failed for ${category}:`, error)
    return []
  }
}

export async function getLatestVehicles(limit: number = 6, category?: Category): Promise<Vehicle[]> {
  try {
    const vehicles = await fetchCarouselItems(category)
    return vehicles.slice(0, limit)
  } catch (error) {
    console.warn("getLatestVehicles failed:", error)
    return []
  }
}

export async function getCountByCategory(): Promise<{ id: Category; name: string; icon: string; count: number }[]> {
  try {
    const { vehicles } = await fetchVehicles({ limit: 1000, vehicleType: 'all' })
    
    return CATEGORIES.map(cat => ({
      ...cat,
      count: vehicles.filter(v => v.category === cat.id).length
    }))
  } catch (error) {
    console.warn("getCountByCategory failed:", error)
    return CATEGORIES.map(cat => ({ ...cat, count: 0 }))
  }
}

export async function searchVehiclesLocal(query: string, category?: Category): Promise<Vehicle[]> {
  try {
    const { vehicles } = await fetchVehicles({ category, limit: 100 })

    if (!query) return vehicles

    const q = query.toLowerCase()
    return vehicles.filter(v =>
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      (v.description?.toLowerCase().includes(q))
    )
  } catch (error) {
    console.warn("searchVehiclesLocal failed:", error)
    return []
  }
}

export async function getVehiclesBrands(): Promise<string[]> {
  try {
    const { vehicles } = await fetchVehicles({ limit: 1000 })
    return [...new Set(vehicles.map(v => v.brand))].sort()
  } catch (error) {
    console.warn("getVehiclesBrands failed:", error)
    return []
  }
}
