/**
 * Ad slot contract.
 *
 * Nothing here is called "ad" on the wire. EasyList and uBlock ship generic
 * substring rules for `/ads/`, `adslot`, `ad-container` and friends, so a
 * request or a class name carrying those strings is dropped outright on
 * roughly a third of desktop browsers. The API route is genuinely
 * /api/ads/*, but the browser never touches it — the Next proxy at
 * /api/promos/* does. This is not evasion, it is not stepping on a mine.
 */

export type AdKind = 'image' | 'native' | 'html'

export interface ServedAd {
  /** Signed token that ties an impression or click back to this render. */
  renderId: string
  creativeId: string
  campaignId: string
  placementCode: string
  kind: AdKind
  width: number
  height: number

  imageUrl?: string
  imageAlt?: string

  nativeTitle?: string
  nativeBody?: string
  nativeCta?: string
  nativeLogoUrl?: string

  htmlSnippet?: string

  advertiserName: string
  /** Our own promotion rather than a paid placement. Labelled differently. */
  isHouse: boolean
}

/** Page context passed to the serve endpoint for contextual targeting. */
export interface AdTargeting {
  vehicleType?: string
  brand?: string
  category?: string
  /** Buying-guide answers. Never used to rank, only to target the ad slot. */
  use?: string
  band?: string
  tags?: string[]
}

export type AdEventKind = 'impression' | 'click'

export interface AdEvent {
  renderId: string
  kind: AdEventKind
  pagePath?: string
}
