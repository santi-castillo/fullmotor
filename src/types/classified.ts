export type ClassifiedCategory =
  | 'cars'
  | 'motorcycles'
  | 'trucks'
  | 'parts'
  | 'accessories'
  | 'other'

/**
 * Still returned by the API, but monetization is switched off: every listing is
 * `free` and lasts 30 days. Kept so the response type stays honest, and because
 * paid tiers are expected back later.
 */
export type ClassifiedTier = 'free' | 'premium' | 'featured'

export type ClassifiedStatus = 'active' | 'sold' | 'paused'

export interface ClassifiedUser {
  id: string
  name: string
  avatarUrl?: string | null
}

export interface Classified {
  id: string
  userId: string
  user: ClassifiedUser
  countryCode: string
  city: string
  title: string
  description: string
  category: ClassifiedCategory
  price: number
  currency: string
  contactInfo: string | null
  showContactInfo: boolean
  images: string[]
  tier: ClassifiedTier
  status: ClassifiedStatus
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedClassifieds {
  data: Classified[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Comment {
  id: string
  resourceId: string
  userId: string
  user: ClassifiedUser
  body: string
  createdAt: string
}

export const CLASSIFIED_CATEGORIES: { id: ClassifiedCategory; label: string }[] = [
  { id: 'cars', label: 'Autos' },
  { id: 'motorcycles', label: 'Motos' },
  { id: 'trucks', label: 'Camionetas' },
  { id: 'parts', label: 'Repuestos' },
  { id: 'accessories', label: 'Accesorios' },
  { id: 'other', label: 'Otros' },
]

/** Narrows an untrusted query-string value to a real category. */
export function isClassifiedCategory(value: string | undefined): value is ClassifiedCategory {
  return !!value && CLASSIFIED_CATEGORIES.some((c) => c.id === value)
}

export const categoryLabels: Record<ClassifiedCategory, string> = {
  cars: 'Autos',
  motorcycles: 'Motos',
  trucks: 'Camionetas',
  parts: 'Repuestos',
  accessories: 'Accesorios',
  other: 'Otros',
}

export const statusLabels: Record<ClassifiedStatus, string> = {
  active: 'Activa',
  sold: 'Vendida',
  paused: 'Pausada',
}

/**
 * How close to expiry a listing has to be before it can be renewed. Mirrors the
 * window the API enforces; kept in sync by hand.
 */
export const RENEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

export function isExpired(classified: Pick<Classified, 'expiresAt'>, now = Date.now()): boolean {
  return new Date(classified.expiresAt).getTime() < now
}

export function isRenewable(classified: Pick<Classified, 'expiresAt'>, now = Date.now()): boolean {
  return new Date(classified.expiresAt).getTime() - now <= RENEW_WINDOW_MS
}

export const MAX_CLASSIFIED_IMAGES = 5
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
