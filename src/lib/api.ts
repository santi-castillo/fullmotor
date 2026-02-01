import { Vehicle, Category } from '@/types/vehicle'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// ============================================
// Category & Fuel Type Mapping (Backend ↔ Frontend)
// ============================================

const categoryToBackend: Record<Category, string> = {
    'autos': 'cars',
    'suvs': 'suvs',
    'camionetas': 'trucks',
    'motos': 'motorcycles',
}

const categoryToFrontend: Record<string, Category> = {
    'cars': 'autos',
    'suvs': 'suvs',
    'trucks': 'camionetas',
    'motorcycles': 'motos',
}

const fuelTypeToFrontend: Record<string, string> = {
    'gasoline': 'nafta',
    'diesel': 'diesel',
    'hybrid': 'híbrido',
    'electric': 'eléctrico',
}

// ============================================
// Response Types
// ============================================

interface ApiVehicle {
    id: string
    slug: string
    brand: string
    model: string
    year: number
    version?: string
    category: string
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
    autonomyKm?: number
    batteryKwh?: number
    safetyFeatures?: string[]
    equipment?: string[]
    images?: string[]
    description?: string
    createdAt?: string
    updatedAt?: string
}

interface VehiclesResponse {
    data: ApiVehicle[]
    meta: {
        total: number
        page: number
        lastPage: number
    }
}

interface FiltersResponse {
    brands: { name: string; count: number }[]
    categories: string[]
    priceRange: { min: number; max: number }
}

interface CarouselItem {
    id: string
    title: string
    description: string
    imageUrl: string
    linkUrl: string
    order: number
    validFrom: string
    validUntil: string
}

interface CarouselResponse {
    data: CarouselItem[]
}

// ============================================
// Transform API Response to Frontend Types
// ============================================

function transformVehicle(apiVehicle: ApiVehicle): Vehicle {
    return {
        id: apiVehicle.id,
        slug: apiVehicle.slug,
        brand: apiVehicle.brand,
        model: apiVehicle.model,
        year: apiVehicle.year,
        version: apiVehicle.version,
        category: categoryToFrontend[apiVehicle.category] || 'autos',
        subcategory: apiVehicle.subcategory,
        priceUYU: apiVehicle.priceUYU,
        priceUSD: apiVehicle.priceUSD,
        engineCc: apiVehicle.engineCc,
        engineHp: apiVehicle.engineHp,
        engineTorque: apiVehicle.engineTorque,
        fuelType: apiVehicle.fuelType ? fuelTypeToFrontend[apiVehicle.fuelType] || apiVehicle.fuelType : undefined,
        transmission: apiVehicle.transmission,
        gears: apiVehicle.gears,
        length: apiVehicle.length,
        width: apiVehicle.width,
        height: apiVehicle.height,
        wheelbase: apiVehicle.wheelbase,
        trunkCapacity: apiVehicle.trunkCapacity,
        fuelTank: apiVehicle.fuelTank,
        weight: apiVehicle.weight,
        safetyFeatures: apiVehicle.safetyFeatures || [],
        equipment: apiVehicle.equipment || [],
        image: apiVehicle.images?.[0],
        images: apiVehicle.images || [],
        description: apiVehicle.description,
        createdAt: apiVehicle.createdAt,
        updatedAt: apiVehicle.updatedAt,
    }
}

// ============================================
// API Functions
// ============================================

interface FetchVehiclesParams {
    page?: number
    limit?: number
    brand?: string
    category?: Category
    fuelType?: string
    minPrice?: number
    maxPrice?: number
    sort?: 'price_asc' | 'price_desc' | 'newest'
}

export async function fetchVehicles(params: FetchVehiclesParams = {}): Promise<{ vehicles: Vehicle[]; meta: VehiclesResponse['meta'] }> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.brand) searchParams.set('brand', params.brand)
    if (params.category) searchParams.set('category', categoryToBackend[params.category])
    if (params.fuelType) searchParams.set('fuel_type', params.fuelType)
    if (params.minPrice) searchParams.set('min_price', params.minPrice.toString())
    if (params.maxPrice) searchParams.set('max_price', params.maxPrice.toString())
    if (params.sort) searchParams.set('sort', params.sort)

    const url = `${API_URL}/api/vehicles${searchParams.toString() ? `?${searchParams}` : ''}`

    const response = await fetch(url, { next: { revalidate: 60 } })

    if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.statusText}`)
    }

    const data: VehiclesResponse = await response.json()

    return {
        vehicles: data.data.map(transformVehicle),
        meta: data.meta,
    }
}

export async function fetchVehicleBySlug(slug: string): Promise<Vehicle | null> {
    const url = `${API_URL}/api/vehicles/${slug}`

    const response = await fetch(url, { next: { revalidate: 60 } })

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch vehicle: ${response.statusText}`)
    }

    const apiVehicle: ApiVehicle = await response.json()
    return transformVehicle(apiVehicle)
}

export async function fetchCarouselItems(): Promise<CarouselItem[]> {
    const url = `${API_URL}/api/carousel`

    const response = await fetch(url, { next: { revalidate: 60 } })

    if (!response.ok) {
        throw new Error(`Failed to fetch carousel: ${response.statusText}`)
    }

    const data: CarouselResponse = await response.json()
    return data.data || []
}

export async function fetchFilters(): Promise<FiltersResponse> {
    const url = `${API_URL}/api/filters`

    const response = await fetch(url, { next: { revalidate: 300 } })

    if (!response.ok) {
        throw new Error(`Failed to fetch filters: ${response.statusText}`)
    }

    return response.json()
}

export async function searchVehicles(query: string, type: 'text' | 'semantic' = 'text'): Promise<Vehicle[]> {
    const searchParams = new URLSearchParams({ q: query, type })
    const url = `${API_URL}/api/search?${searchParams}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
    }

    const data = await response.json()
    return (data.data || []).map(transformVehicle)
}

// Export mappers for use in other modules
export { categoryToBackend, categoryToFrontend }
