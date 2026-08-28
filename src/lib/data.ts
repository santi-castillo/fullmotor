import { Vehicle, Category, CATEGORIES } from '@/types/vehicle'
import { fetchVehicles, fetchVehicleBySlug as apiFetchVehicleBySlug, fetchCarouselItems } from './api'

// Re-export CATEGORIES for components that need it
export { CATEGORIES }

const CATALOGUE_PAGE_SIZE = 100

/** Attempts per catalogue page before the whole walk gives up. */
const PAGE_ATTEMPTS = 3

/** Backoff between attempts on the same page. */
const RETRY_DELAY_MS = 250

async function fetchVehiclePage(page: number) {
  let lastError: unknown
  for (let attempt = 1; attempt <= PAGE_ATTEMPTS; attempt++) {
    try {
      return await fetchVehicles({ page, limit: CATALOGUE_PAGE_SIZE, retryAttempt: attempt })
    } catch (error) {
      lastError = error
      console.warn(`[data] catalogue page ${page} failed (attempt ${attempt}/${PAGE_ATTEMPTS}):`, error)
      if (attempt < PAGE_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt))
      }
    }
  }
  throw lastError
}

/**
 * The whole catalogue, page by page — around a dozen requests.
 *
 * Throws if any page still fails after its retries. A partial catalogue is
 * indistinguishable from a catalogue that shrank, so callers that cache the
 * result would happily cache the truncated one; failing loudly lets them
 * decide, and lets them retry instead.
 */
export async function fetchAllVehicles(): Promise<Vehicle[]> {
  const allVehicles: Vehicle[] = []
  let page = 1

  while (true) {
    const { vehicles, meta } = await fetchVehiclePage(page)
    allVehicles.push(...vehicles)
    if (page >= meta.lastPage) break
    page++
  }

  return allVehicles
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  try {
    return await fetchAllVehicles()
  } catch (error) {
    // Swallowing this keeps the build green but silently empties the sitemap
    // and skips every prerendered vehicle — log loudly so it shows up in CI.
    // Callers that cache their result should use fetchAllVehicles instead, so
    // an API blip is not stored as "the catalogue is empty".
    console.error("[data] getAllVehicles failed — sitemap and prerendered vehicles will be empty:", error)
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
    // /api/carousel returns one version per model family (the most expensive),
    // newest first — /api/vehicles would list every version of the same family.
    const vehicles = await fetchCarouselItems(category)
    return vehicles.slice(0, limit)
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
