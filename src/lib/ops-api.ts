import { Classified } from '@/types/classified'
import { ApiError } from './api-error'
import { getStoredToken } from './auth'

/**
 * The operator side of the API — `/api/ops/*`, behind the admin role on a real
 * session rather than the shared ADMIN_API_KEY.
 *
 * A file of its own rather than more exports in `dealerships-api.ts`: these
 * calls only ever run from `/admin`, and keeping them apart is what stops one
 * of them being imported into a public page by autocomplete.
 */

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
  throw new ApiError(detail, response.status)
}

function authHeaders(): HeadersInit {
  const t = getStoredToken()
  if (!t) throw new ApiError('Authentication required', 401)
  return { 'X-Country': COUNTRY, Authorization: `Bearer ${t}` }
}

function jsonHeaders(): HeadersInit {
  return { ...authHeaders(), 'Content-Type': 'application/json' }
}

/** Every operator screen reads live: a cached moderation queue is a wrong one. */
async function opsFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${API_URL}/api/ops${path}`, {
    cache: 'no-store',
    ...init,
    headers: init.body ? jsonHeaders() : authHeaders(),
  })
  if (!response.ok) await handleApiError(response)
  return response
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  lastPage: number
}

// ============================================
// Users
// ============================================

export interface AdminUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  role: 'user' | 'admin'
  createdAt: string
  suspended: boolean
  suspendedAt?: string | null
  suspendedReason?: string | null
  dealershipName?: string | null
  dealershipStatus?: string | null
  classifiedsCount: number
  commentsCount: number
}

export interface UserSummary {
  total: number
  active: number
  suspended: number
  admins: number
  newLast30Days: number
}

export interface UsersPage {
  data: AdminUser[]
  summary: UserSummary
  meta: PaginationMeta
}

export async function fetchUsers(
  params: { q?: string; status?: string; role?: string; page?: number; limit?: number } = {}
): Promise<UsersPage> {
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  if (params.status && params.status !== 'all') search.set('status', params.status)
  if (params.role) search.set('role', params.role)
  if (params.page) search.set('page', String(params.page))
  search.set('limit', String(params.limit ?? 25))

  const response = await opsFetch(`/users?${search}`)
  return response.json()
}

/**
 * Suspend an account or bring it back.
 *
 * `reason` reaches the person at their next login attempt and nowhere else, so
 * it is the only chance to tell them why.
 */
export async function setUserSuspended(
  id: string,
  suspended: boolean,
  reason?: string
): Promise<AdminUser> {
  const response = await opsFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ suspended, reason: reason || undefined }),
  })
  return response.json()
}

// ============================================
// Comments
// ============================================

export interface AdminComment {
  id: string
  resourceId: string
  parentId?: string | null
  body: string
  createdAt: string
  userId: string
  userName: string
  userEmail: string
  userSuspended: boolean
  deleted: boolean
  deletedAt?: string | null
  deletedByRole?: 'author' | 'moderator' | null
}

export async function fetchComments(
  params: { status?: string; resourceId?: string; userId?: string; q?: string; page?: number; limit?: number } = {}
): Promise<{ data: AdminComment[]; meta: PaginationMeta }> {
  const search = new URLSearchParams()
  if (params.status && params.status !== 'all') search.set('status', params.status)
  if (params.resourceId) search.set('resourceId', params.resourceId)
  if (params.userId) search.set('userId', params.userId)
  if (params.q) search.set('q', params.q)
  if (params.page) search.set('page', String(params.page))
  search.set('limit', String(params.limit ?? 25))

  const response = await opsFetch(`/comments?${search}`)
  return response.json()
}

export async function deleteComment(id: string): Promise<AdminComment> {
  const response = await opsFetch(`/comments/${id}`, { method: 'DELETE' })
  return response.json()
}

export async function restoreComment(id: string): Promise<AdminComment> {
  // No body, so opsFetch sends the plain auth headers — a POST with
  // Content-Type: application/json and nothing after it is what makes Fiber's
  // body parser complain about an empty body.
  const response = await opsFetch(`/comments/${id}/restore`, { method: 'POST' })
  return response.json()
}

// ============================================
// Classifieds
// ============================================

export interface AdminClassified extends Classified {
  userEmail: string
  userSuspended: boolean
  deleted: boolean
  deletedAt?: string | null
  deletedByRole?: 'author' | 'moderator' | null
  /** When the purge destroys the row and its photos — the restore deadline. */
  purgeAfter?: string | null
}

export async function fetchClassifiedsForModeration(
  params: { status?: string; userId?: string; q?: string; page?: number; limit?: number } = {}
): Promise<{ data: AdminClassified[]; meta: PaginationMeta }> {
  const search = new URLSearchParams()
  if (params.status && params.status !== 'all') search.set('status', params.status)
  if (params.userId) search.set('userId', params.userId)
  if (params.q) search.set('q', params.q)
  if (params.page) search.set('page', String(params.page))
  search.set('limit', String(params.limit ?? 25))

  const response = await opsFetch(`/classifieds?${search}`)
  return response.json()
}

/** Status only — pausing hides a listing without removing it. */
export async function moderateClassifiedStatus(
  id: string,
  status: 'active' | 'paused' | 'sold'
): Promise<Classified> {
  const response = await opsFetch(`/classifieds/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return response.json()
}

export async function deleteClassified(id: string): Promise<AdminClassified> {
  const response = await opsFetch(`/classifieds/${id}`, { method: 'DELETE' })
  return response.json()
}

export async function restoreClassified(id: string): Promise<AdminClassified> {
  const response = await opsFetch(`/classifieds/${id}/restore`, { method: 'POST' })
  return response.json()
}
