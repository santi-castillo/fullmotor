/**
 * The API's pagination envelope. Declared here rather than imported: the
 * classifieds' PaginatedClassifieds inlines its own and omits `limit`, which
 * these endpoints do return.
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  lastPage: number
}

/**
 * `closed` is not the end of the road, and that distinction is the whole
 * feature: once the 72 h window elapses no dealership can bid any more, but the
 * seller may still accept one of the offers already on the table.
 */
export type PrivateListingStatus = 'open' | 'closed' | 'sold' | 'cancelled'

export type OfferStatus = 'active' | 'withdrawn' | 'accepted'

export type OfferCurrency = 'UYU' | 'USD'

/** The dealership behind an offer, as the seller sees it. */
export interface OfferDealership {
  slug: string
  name: string
  logoUrl?: string | null
  city?: string | null
  /**
   * Present only on the offer the seller accepted. That is the handoff — from
   * here the two of them coordinate directly.
   */
  phone?: string | null
  whatsapp?: string | null
}

/** One offer, as its seller sees it. */
export interface SellerOffer {
  id: string
  amount: number
  currency: OfferCurrency
  note?: string | null
  status: OfferStatus
  dealership: OfferDealership
  createdAt: string
  updatedAt: string
}

/** A quote request as its own seller sees it. */
export interface PrivateListing {
  id: string
  countryCode: string
  department: string
  city: string

  brand: string
  model: string
  version?: string | null
  year: number
  mileageKm: number
  fuelType: string
  transmission: string
  description?: string | null
  images: string[]

  /** Echoed to the owner only, so the form can prefill it. */
  contactPhone: string

  /**
   * Resolved against the clock by the API, not read from a column — a row stays
   * `open` past its window until something writes to it. Trust this, never a
   * comparison of `closesAt` done here.
   */
  status: PrivateListingStatus
  closesAt: string
  /** Whether dealerships can still bid. */
  acceptsOffers: boolean
  /** Whether the seller can still accept. Stays true after the window closes. */
  canAccept: boolean
  acceptedOfferId?: string | null

  offerCount: number
  offers: SellerOffer[]
  /**
   * True when the offers are not all in one currency.
   *
   * When it is, nothing in `offers` is ranked — UYU 987.654 and USD 25.000
   * cannot be ordered against each other, and the second is worth more. Never
   * present the first offer as the highest while this is true.
   */
  mixedCurrencies: boolean
  maxImages: number

  createdAt: string
  updatedAt: string
}

/** A dealership's own offer, echoed back to it. */
export interface MyOffer {
  id: string
  amount: number
  currency: OfferCurrency
  note?: string | null
  status: OfferStatus
  createdAt: string
  updatedAt: string
}

/**
 * A quote request as a dealership sees it.
 *
 * Note what is missing, and keep it missing: nothing identifies the seller, and
 * there is no trace of any other dealership's offer — not even a count. Offers
 * here are blind, and knowing how much competition a bid faces is most of what
 * that is meant to withhold.
 */
export interface DealerListing {
  id: string
  countryCode: string
  department: string
  city: string

  brand: string
  model: string
  version?: string | null
  year: number
  mileageKm: number
  fuelType: string
  transmission: string
  description?: string | null
  images: string[]

  status: PrivateListingStatus
  closesAt: string
  acceptsOffers: boolean

  /** This dealership's own bid. Absent until it makes one. */
  myOffer?: MyOffer

  createdAt: string
}

/** One of this dealership's offers, plus enough of the car to recognise it. */
export interface MyOfferWithListing extends MyOffer {
  listing: DealerListing
  won: boolean
  /** Present only on the offer this dealership won. */
  sellerPhone?: string | null
}

export interface PaginatedPrivateListings {
  data: PrivateListing[]
  meta: PaginationMeta
}

export interface PaginatedDealerListings {
  data: DealerListing[]
  meta: PaginationMeta
}

export interface PaginatedMyOffers {
  data: MyOfferWithListing[]
  meta: PaginationMeta
}

/** Filters on the dealership feed. */
export interface DealerFeedParams {
  department?: string
  brand?: string
  yearMin?: number
  yearMax?: number
  maxKm?: number
  /** Only listings this dealership has not quoted yet. */
  onlyPending?: boolean
  page?: number
  limit?: number
}

export interface CreatePrivateListingInput {
  countryCode?: string
  department: string
  city: string
  brand: string
  model: string
  version?: string
  year: number
  mileageKm: number
  fuelType: string
  transmission: string
  description?: string
  contactPhone: string
}

export interface PlaceOfferInput {
  amount: number
  currency: OfferCurrency
  note?: string
}
