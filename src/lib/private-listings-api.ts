import type {
  CreatePrivateListingInput,
  DealerFeedParams,
  DealerListing,
  MyOffer,
  PaginatedDealerListings,
  PaginatedMyOffers,
  PaginatedPrivateListings,
  OfferCurrency,
  PaginationMeta,
  PlaceOfferInput,
  PrivateListing,
} from '@/types/private-listing'
import type { UploadImagesResult } from './classifieds-api'
import { getStoredToken } from './auth'
import { ApiError } from './api-error'

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
  // The backend's own wording is kept for logs; use translateApiError from
  // '@/lib/api-error' before putting anything from here on screen.
  throw new ApiError(detail, response.status)
}

function authHeaders(token?: string | null): HeadersInit {
  const t = token ?? getStoredToken()
  if (!t) {
    throw new ApiError('Authentication required', 401)
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

/**
 * Everything here is authenticated, with no public counterpart — that is the
 * point of the feature. A quote request is visible to its own seller and to
 * approved dealerships, and to nobody else. There is deliberately no
 * `fetchPrivateListings` for anonymous callers to reach for.
 */

// ============================================
// Seller
// ============================================

export async function createPrivateListing(
  input: CreatePrivateListingInput
): Promise<PrivateListing> {
  const response = await fetch(`${API_URL}/api/private-listings`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ countryCode: COUNTRY, ...input }),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function fetchMyPrivateListings(
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedPrivateListings> {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))

  const response = await fetch(
    `${API_URL}/api/private-listings/mine${search.toString() ? `?${search}` : ''}`,
    { headers: authHeaders(), cache: 'no-store' }
  )
  if (!response.ok) await handleApiError(response)
  return response.json()
}

/**
 * `no-store` everywhere, and it matters more here than on a classified: this is
 * what the seller's page polls while offers land, so a cached response would
 * quietly freeze the very thing the page exists to show.
 */
export async function fetchPrivateListing(
  id: string,
  signal?: AbortSignal
): Promise<PrivateListing> {
  const response = await fetch(`${API_URL}/api/private-listings/${id}`, {
    headers: authHeaders(),
    cache: 'no-store',
    signal,
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function acceptOffer(listingId: string, offerId: string): Promise<PrivateListing> {
  const response = await fetch(`${API_URL}/api/private-listings/${listingId}/accept`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ offerId }),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function cancelPrivateListing(id: string): Promise<PrivateListing> {
  const response = await fetch(`${API_URL}/api/private-listings/${id}/cancel`, {
    method: 'POST',
    headers: authHeaders(),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function reportOffer(
  listingId: string,
  offerId: string,
  reason: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/private-listings/${listingId}/report`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ offerId, reason }),
  })
  if (!response.ok) await handleApiError(response)
}

/**
 * Batch size and sequencing follow uploadClassifiedImages for the same reason:
 * five 10 MB photos already sit on the API's 50 MB body limit, and concurrent
 * appends would race on the images array.
 */
const UPLOAD_BATCH_SIZE = 5

export async function uploadPrivateListingImages(
  id: string,
  files: File[]
): Promise<UploadImagesResult> {
  if (files.length <= UPLOAD_BATCH_SIZE) {
    return uploadBatch(id, files)
  }

  const merged: UploadImagesResult = { uploaded: [], totalImages: 0, errors: [] }
  for (let i = 0; i < files.length; i += UPLOAD_BATCH_SIZE) {
    const result = await uploadBatch(id, files.slice(i, i + UPLOAD_BATCH_SIZE))
    merged.uploaded.push(...result.uploaded)
    merged.errors.push(...result.errors)
    // The last batch knows the true total; earlier ones are already stale.
    merged.totalImages = result.totalImages
  }
  return merged
}

async function uploadBatch(id: string, files: File[]): Promise<UploadImagesResult> {
  const formData = new FormData()
  for (const file of files) {
    formData.append('images', file)
  }
  // Don't set Content-Type — browser sets multipart boundary
  const response = await fetch(`${API_URL}/api/private-listings/${id}/images`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })
  if (!response.ok) await handleApiError(response)

  const body = await response.json()

  // 207 Multi-Status means some files landed and others did not, and it counts
  // as ok, so a partial failure would otherwise pass for success. It also nests
  // the payload under `data`, unlike the 201.
  if (response.status === 207) {
    return {
      uploaded: body?.data?.uploaded ?? [],
      totalImages: body?.data?.totalImages ?? 0,
      errors: body?.errors ?? [],
    }
  }

  return {
    uploaded: body?.uploaded ?? [],
    totalImages: body?.totalImages ?? 0,
    errors: [],
  }
}

export async function deletePrivateListingImage(id: string, url: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/private-listings/${id}/images`, {
    method: 'DELETE',
    headers: jsonHeaders(),
    body: JSON.stringify({ url }),
  })
  if (!response.ok) await handleApiError(response)
}

// ============================================
// Dealership (buy side)
// ============================================

export async function fetchDealerFeed(
  params: DealerFeedParams = {},
  signal?: AbortSignal
): Promise<PaginatedDealerListings> {
  const search = new URLSearchParams()
  if (params.department) search.set('department', params.department)
  if (params.brand) search.set('brand', params.brand)
  if (params.yearMin) search.set('yearMin', String(params.yearMin))
  if (params.yearMax) search.set('yearMax', String(params.yearMax))
  if (params.maxKm) search.set('maxKm', String(params.maxKm))
  if (params.onlyPending) search.set('onlyPending', '1')
  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))

  const response = await fetch(
    `${API_URL}/api/dealer/private-listings${search.toString() ? `?${search}` : ''}`,
    { headers: authHeaders(), cache: 'no-store', signal }
  )
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function fetchDealerListing(id: string): Promise<DealerListing> {
  const response = await fetch(`${API_URL}/api/dealer/private-listings/${id}`, {
    headers: authHeaders(),
    cache: 'no-store',
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

/**
 * Create or replace this dealership's bid. An upsert, so the form does not need
 * to know whether an offer already exists — and a withdrawn one comes back with
 * the same call.
 */
export async function placeOffer(listingId: string, input: PlaceOfferInput): Promise<MyOffer> {
  const response = await fetch(`${API_URL}/api/dealer/private-listings/${listingId}/offer`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(input),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function withdrawOffer(listingId: string): Promise<MyOffer> {
  const response = await fetch(`${API_URL}/api/dealer/private-listings/${listingId}/offer`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function fetchMyOffers(
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedMyOffers> {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))

  const response = await fetch(
    `${API_URL}/api/dealer/offers${search.toString() ? `?${search}` : ''}`,
    { headers: authHeaders(), cache: 'no-store' }
  )
  if (!response.ok) await handleApiError(response)
  return response.json()
}

/**
 * How many open listings this dealership has not quoted yet — the badge in the
 * panel. Asks for one row and reads the total off the envelope.
 */
export async function fetchPendingCount(): Promise<number> {
  const { meta } = await fetchDealerFeed({ onlyPending: true, limit: 1 })
  return meta.total
}

// ============================================
// Operator
// ============================================

export type ReportStatus = 'open' | 'upheld' | 'dismissed'

export interface OfferReportForReview {
  id: string
  offerId: string
  listingId: string
  dealershipId: string
  reason: string
  status: ReportStatus
  createdAt: string
  dealership: {
    id: string
    slug: string
    name: string
    /**
     * How many reports this business has been upheld against before. The
     * number the decision actually turns on: one report is an argument, a
     * pattern is a decision.
     */
    upheldCount: number
    status: string
  }
  offer: {
    amount: number
    currency: OfferCurrency
    note?: string | null
  }
  vehicle: string
}

export async function fetchOfferReports(
  status = 'open'
): Promise<{ data: OfferReportForReview[]; meta: PaginationMeta }> {
  const response = await fetch(
    `${API_URL}/api/ops/offer-reports?status=${encodeURIComponent(status)}&limit=50`,
    { headers: authHeaders(), cache: 'no-store' }
  )
  if (!response.ok) await handleApiError(response)
  return response.json()
}

export async function reviewOfferReport(
  id: string,
  status: 'upheld' | 'dismissed',
  note?: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/ops/offer-reports/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify({ status, note: note?.trim() || undefined }),
  })
  if (!response.ok) await handleApiError(response)
}
