import { Vehicle, Category } from '@/types/vehicle'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'uy'

const getHeaders = (vehicleType: string = 'all') => ({
    'X-Country': COUNTRY || 'uy',
    'X-Vehicle-Type': vehicleType || 'all',
    'User-Agent': 'Mozilla/5.0 (compatible; TodoMotor-WebApp/1.0; +https://todomotor.uy)',
    'X-Api-Secret': process.env.API_SECRET_KEY || '',
})

// ============================================
// Category & Fuel Type Mapping (Backend ↔ Frontend)
// ============================================

// Maps backend vehicleType to frontend category
const vehicleTypeToCategory: Record<string, Category> = {
    'cars': 'autos',
    'suvs': 'suvs',
    'pickups': 'pickups',
    'motorcycles': 'motos',
    'commercial': 'utilitarios',
}

// Maps frontend category to backend vehicleType (for headers and filters)
const categoryToVehicleType: Partial<Record<Category, string>> = {
    'autos': 'cars',
    'suvs': 'suvs',
    'pickups': 'pickups',
    'motos': 'motorcycles',
    'utilitarios': 'commercial',
}

const fuelTypeToFrontend: Record<string, string> = {
    'gasoline': 'nafta',
    'diesel': 'diesel',
    'hybrid': 'híbrido',
    'mild-hybrid': 'mild-hybrid',
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
    modelFamilyId?: string
    countryCode: string
    vehicleType: string
    vehicleSubtype: string[] | null
    subcategory?: string
    currency: string
    price: number
    // priceUYU?: number // Removed
    // priceUSD?: number // Removed
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
    relatedVersions?: { slug: string; version: string; price: number; currency: string }[]
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
    subtypes: Array<{
        id: string
        vehicleType: string
        name: string
        slug: string
        icon?: string
        orderPosition?: number
        active?: boolean
        createdAt?: string
        updatedAt?: string
    }>
    priceRange: { min: number; max: number }
    currency: string
}

interface CarouselItem {
    id: string
    title: string
    imageUrl: string
    linkUrl: string
    price: number
    currency: string
    year: number
    vehicleType: string
    countryCode: string
    createdAt?: string
    engineHp?: number
    fuelType?: string
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
        countryCode: apiVehicle.countryCode,
        vehicleType: apiVehicle.vehicleType,
        vehicleSubtype: apiVehicle.vehicleSubtype,
        brand: apiVehicle.brand,
        model: apiVehicle.model,
        year: apiVehicle.year,
        version: apiVehicle.version,
        modelFamilyId: apiVehicle.modelFamilyId,
        relatedVersions: apiVehicle.relatedVersions,
        category: vehicleTypeToCategory[apiVehicle.vehicleType] || 'autos', // Direct mapping: vehicleType → category
        subcategory: apiVehicle.subcategory,
        currency: apiVehicle.currency,
        price: apiVehicle.price,
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
        autonomyKm: apiVehicle.autonomyKm,
        batteryKwh: apiVehicle.batteryKwh,
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
    sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'power_asc' | 'power_desc' | 'value_asc' | 'value_desc'
    vehicleType?: string
}

export async function fetchVehicles(params: FetchVehiclesParams = {}): Promise<{ vehicles: Vehicle[]; meta: VehiclesResponse['meta'] }> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.brand) searchParams.set('brand', params.brand)
    if (params.fuelType) searchParams.set('fuel_type', params.fuelType)
    if (params.minPrice) searchParams.set('min_price', params.minPrice.toString())
    if (params.maxPrice) searchParams.set('max_price', params.maxPrice.toString())
    if (params.sort) searchParams.set('sort', params.sort)

    const url = `${API_URL}/api/vehicles${searchParams.toString() ? `?${searchParams}` : ''}`

    // Use category to set the X-Vehicle-Type header (backend uses vehicleType for filtering)
    const vehicleTypeHeader = params.category ? categoryToVehicleType[params.category] : params.vehicleType || 'all'

    const response = await fetch(url, {
        next: { revalidate: 60 },
        headers: getHeaders(vehicleTypeHeader)
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.statusText}`)
    }

    const data: VehiclesResponse = await response.json()

    return {
        vehicles: data.data.map(transformVehicle),
        meta: data.meta,
    }
}

export async function fetchVehicleBySlug(slug: string, vehicleType?: string): Promise<Vehicle | null> {
    const url = `${API_URL}/api/vehicles/${slug}`

    const response = await fetch(url, {
        next: { revalidate: 60 },
        headers: getHeaders(vehicleType)
    })

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch vehicle: ${response.statusText}`)
    }

    const apiVehicle: ApiVehicle = await response.json()
    return transformVehicle(apiVehicle)
}

export async function fetchCarouselItems(category?: Category): Promise<Vehicle[]> {
    const searchParams = new URLSearchParams()

    if (category) {
        const vehicleType = categoryToVehicleType[category]
        if (vehicleType) searchParams.set('category', vehicleType)
    }

    const url = `${API_URL}/api/carousel${searchParams.toString() ? `?${searchParams}` : ''}`

    const response = await fetch(url, {
        next: { revalidate: 60 },
        headers: getHeaders('all')
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch carousel: ${response.statusText}`)
    }

    const data: CarouselResponse = await response.json()
    return (data.data || []).map((item): Vehicle => {
        // linkUrl is e.g. "/vehicles/uy-kawasaki-ninja-500-2026-se-abs"
        const slug = item.linkUrl.split('/').pop() || item.id
        const [brand = '', ...modelParts] = item.title.split(' ')
        return {
            id: item.id,
            slug,
            countryCode: item.countryCode,
            vehicleType: item.vehicleType,
            vehicleSubtype: null,
            brand,
            model: modelParts.join(' '),
            year: item.year,
            category: vehicleTypeToCategory[item.vehicleType] || 'autos', // Use simple mapping
            currency: item.currency,
            price: item.price,
            image: item.imageUrl,
            images: [item.imageUrl],
            safetyFeatures: [],
            equipment: [],
            createdAt: item.createdAt,
            engineHp: item.engineHp,
            fuelType: item.fuelType ? fuelTypeToFrontend[item.fuelType] || item.fuelType : undefined,
        }
    })
}

export async function fetchFilters(vehicleType?: string): Promise<FiltersResponse> {
    const url = `${API_URL}/api/filters`

    const response = await fetch(url, {
        next: { revalidate: 300 },
        headers: getHeaders(vehicleType)
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch filters: ${response.statusText}`)
    }

    return response.json()
}

export async function searchVehicles(query: string, type: 'text' | 'semantic' = 'semantic', vehicleType?: string): Promise<Vehicle[]> {
    const searchParams = new URLSearchParams({ q: query, type })
    const url = `${API_URL}/api/search?${searchParams}`

    const response = await fetch(url, {
        headers: getHeaders(vehicleType)
    })

    if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
    }

    const data = await response.json()
    return (data.data || []).map(transformVehicle)
}

// Export mappers for use in other modules (if needed elsewhere)
export { categoryToVehicleType, vehicleTypeToCategory, getHeaders }
