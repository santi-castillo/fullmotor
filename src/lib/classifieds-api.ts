import {
  AuthUser,
  Classified,
  ClassifiedCategory,
  ClassifiedStatus,
  ClassifiedTier,
  Comment,
  PaginatedClassifieds,
  UpgradeResponse,
} from '@/types/classified'
import { getStoredToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.todomotor.uy'
const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'uy'

async function handleApiError(response: Response): Promise<never> {
  let detail = response.statusText
  try {
    const text = await response.text()
    try {
      const json = JSON.parse(text)
      detail = json.error || json.message || text
    } catch {
      detail = text || response.statusText
    }
  } catch {
    // ignore
  }
  throw new Error(`API Error (${response.status}): ${detail}`)
}

function publicHeaders(): HeadersInit {
  return {
    'X-Country': COUNTRY,
  }
}

function authHeaders(token?: string | null): HeadersInit {
  const t = token ?? getStoredToken()
  if (!t) {
    throw new Error('Authentication required')
  }
  return {
    'X-Country': COUNTRY,
    Authorization: `Bearer ${t}`,
  }
}

function jsonHeaders(token?: string | null): HeadersInit {
  return {
    ...authHeaders(token),
    'Content-Type': 'application/json',
  }
}

// ============================================
// Auth
// ============================================

export async function googleLogin(idToken: string): Promise<{ token: string; user: AuthUser }> {
  const response = await fetch(`${API_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function getMe(token?: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: authHeaders(token),
    cache: 'no-store',
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

// ============================================
// Classifieds — Public
// ============================================

export interface FetchClassifiedsParams {
  page?: number
  limit?: number
  category?: ClassifiedCategory
  city?: string
  signal?: AbortSignal
}

export async function fetchClassifieds(
  params: FetchClassifiedsParams = {}
): Promise<PaginatedClassifieds> {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))
  if (params.category) search.set('category', params.category)
  if (params.city) search.set('city', params.city)

  const url = `${API_URL}/api/classifieds${search.toString() ? `?${search}` : ''}`
  const response = await fetch(url, {
    headers: publicHeaders(),
    next: { revalidate: 30 },
    signal: params.signal,
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

/**
 * Every listing that is safe to expose to crawlers: active, not expired.
 * Pages through the API the same way getAllBlogPosts/getAllVehicles do.
 * Used by the sitemap — never call this from a request path.
 */
export async function getAllIndexableClassifieds(): Promise<Classified[]> {
  try {
    const all: Classified[] = []
    let page = 1
    const limit = 100

    while (true) {
      const { data, meta } = await fetchClassifieds({ page, limit })
      all.push(...data)
      if (page >= meta.lastPage) break
      page++
    }

    const now = Date.now()
    return all.filter(c => c.status === 'active' && new Date(c.expiresAt).getTime() > now)
  } catch (error) {
    console.error('[classifieds] getAllIndexableClassifieds failed — sitemap will omit classifieds:', error)
    return []
  }
}

export async function fetchClassifiedById(id: string): Promise<Classified | null> {
  const response = await fetch(`${API_URL}/api/classifieds/${id}`, {
    headers: publicHeaders(),
    cache: 'no-store',
  })
  if (response.status === 404 || response.status === 400) return null
  if (!response.ok) await handleApiError(response)
  return response.json()
}

// ============================================
// Classifieds — Authenticated
// ============================================

export async function fetchMyClassifieds(
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedClassifieds> {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))

  const url = `${API_URL}/api/classifieds/mine${search.toString() ? `?${search}` : ''}`
  const response = await fetch(url, {
    headers: authHeaders(),
    cache: 'no-store',
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export interface CreateClassifiedPayload {
  title: string
  description: string
  category: ClassifiedCategory
  price: number
  currency: string
  countryCode: string
  city: string
  contactInfo?: string
  showContactInfo?: boolean
}

export async function createClassified(payload: CreateClassifiedPayload): Promise<Classified> {
  const response = await fetch(`${API_URL}/api/classifieds`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export interface UpdateClassifiedPayload {
  title?: string
  description?: string
  category?: ClassifiedCategory
  price?: number
  currency?: string
  city?: string
  contactInfo?: string
  showContactInfo?: boolean
  status?: ClassifiedStatus
}

export async function updateClassified(
  id: string,
  payload: UpdateClassifiedPayload
): Promise<Classified> {
  const response = await fetch(`${API_URL}/api/classifieds/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function deleteClassified(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/classifieds/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!response.ok) await handleApiError(response)
}

export async function uploadClassifiedImages(
  id: string,
  files: File[]
): Promise<{ images: string[]; totalImages: number }> {
  const formData = new FormData()
  for (const file of files) {
    formData.append('images', file)
  }
  // Don't set Content-Type — browser sets multipart boundary
  const response = await fetch(`${API_URL}/api/classifieds/${id}/images`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function deleteClassifiedImage(id: string, url: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/classifieds/${id}/images`, {
    method: 'DELETE',
    headers: jsonHeaders(),
    body: JSON.stringify({ url }),
  })
  if (!response.ok) await handleApiError(response)
}

export async function upgradeClassified(
  id: string,
  tier: Exclude<ClassifiedTier, 'free'>
): Promise<UpgradeResponse> {
  const response = await fetch(`${API_URL}/api/classifieds/${id}/upgrade`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ tier }),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

// ============================================
// Comments
// ============================================

export async function fetchComments(resourceId: string): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/api/comments/${resourceId}`, {
    cache: 'no-store',
  })
  if (response.status === 404) return []
  if (!response.ok) await handleApiError(response)
  const data = await response.json()
  // Backend may return either an array or an envelope { data: [] }
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.data)) return data.data
  return []
}

export async function postComment(resourceId: string, body: string): Promise<Comment> {
  const response = await fetch(`${API_URL}/api/comments/${resourceId}`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ body }),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function deleteComment(resourceId: string, commentId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/comments/${resourceId}/${commentId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!response.ok) await handleApiError(response)
}
