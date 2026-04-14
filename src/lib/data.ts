import { Vehicle, Category, CATEGORIES } from '@/types/vehicle'
import { fetchVehicles, fetchVehicleBySlug as apiFetchVehicleBySlug } from './api'

// Re-export CATEGORIES for components that need it
export { CATEGORIES }

export async function getAllVehicles(): Promise<Vehicle[]> {
  try {
    const allVehicles: Vehicle[] = []
    let page = 1
    const limit = 100

    while (true) {
      const { vehicles, meta } = await fetchVehicles({ page, limit })
      allVehicles.push(...vehicles)
      if (page >= meta.lastPage) break
      page++
    }

    return allVehicles
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
    // Use the full vehicles endpoint (sorted by newest) instead of /api/carousel
    // because the carousel payload is a slim promo shape that omits fuelType,
    // which causes EVs to render without a fuel label on the home.
    const { vehicles } = await fetchVehicles({ category, limit, sort: 'newest' })
    return vehicles
  } catch (error) {
    console.warn("getLatestVehicles failed:", error)
    return []
  }
}

export async function getCountByCategory(): Promise<{ id: Category; name: string; icon: string; count: number }[]> {
  try {
    // Fetch each category separately because X-Vehicle-Type: 'all' doesn't include motorcycles/utilitarios
    // Use Promise.allSettled so one failing category doesn't break the rest
    const results = await Promise.allSettled(
      CATEGORIES.map(cat => fetchVehicles({ category: cat.id, limit: 1 }))
    )

    return CATEGORIES.map((cat, i) => ({
      ...cat,
      count: results[i].status === 'fulfilled' ? results[i].value.meta.total : 0
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
