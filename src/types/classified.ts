export type ClassifiedCategory =
  | 'cars'
  | 'motorcycles'
  | 'trucks'
  | 'parts'
  | 'accessories'
  | 'other'

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

export interface UpgradeResponse {
  paymentId: string
  preferenceId: string
  initPoint: string
}

export const CLASSIFIED_CATEGORIES: { id: ClassifiedCategory; label: string }[] = [
  { id: 'cars', label: 'Autos' },
  { id: 'motorcycles', label: 'Motos' },
  { id: 'trucks', label: 'Camionetas' },
  { id: 'parts', label: 'Repuestos' },
  { id: 'accessories', label: 'Accesorios' },
  { id: 'other', label: 'Otros' },
]

export const categoryLabels: Record<ClassifiedCategory, string> = {
  cars: 'Autos',
  motorcycles: 'Motos',
  trucks: 'Camionetas',
  parts: 'Repuestos',
  accessories: 'Accesorios',
  other: 'Otros',
}

export const tierLabels: Record<ClassifiedTier, string> = {
  free: 'Gratis',
  premium: 'Premium',
  featured: 'Destacado',
}

export const statusLabels: Record<ClassifiedStatus, string> = {
  active: 'Activa',
  sold: 'Vendida',
  paused: 'Pausada',
}

export const TIER_PRICES: Record<Exclude<ClassifiedTier, 'free'>, number> = {
  premium: 9.99,
  featured: 19.99,
}

export const MAX_CLASSIFIED_IMAGES = 5
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
