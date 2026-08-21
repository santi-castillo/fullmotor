/**
 * Mirror of the placement catalogue in internal/ads/placements.go.
 *
 * The duplication is deliberate and bounded. The slot has to reserve its height
 * *before* the fetch resolves — that reservation is the only thing standing
 * between an ad slot and a layout shift — so the size cannot come from the
 * response it is waiting for.
 *
 * `npm run ads:check` compares this file against GET /api/ads/placements and
 * fails when they drift, the same way `guide:check` guards the buying guide.
 */

export interface PlacementSize {
  /** 0 means the slot is not rendered on that device at all. */
  desktop: [number, number]
  mobile: [number, number]
}

export const PLACEMENTS = {
  home_top: { desktop: [970, 250], mobile: [320, 100] },
  home_mid: { desktop: [970, 250], mobile: [300, 250] },
  // Lives inside the sticky filter column, which collapses below 1000px.
  inv_sidebar: { desktop: [300, 600], mobile: [0, 0] },
  inv_infeed: { desktop: [300, 250], mobile: [300, 250] },
  brand_top: { desktop: [970, 250], mobile: [320, 100] },
  brand_infeed: { desktop: [300, 250], mobile: [300, 250] },
  detail_panel: { desktop: [300, 250], mobile: [300, 250] },
  detail_below: { desktop: [728, 90], mobile: [320, 100] },
  blog_infeed: { desktop: [300, 250], mobile: [300, 250] },
  article_top: { desktop: [728, 90], mobile: [320, 100] },
  article_mid: { desktop: [336, 280], mobile: [300, 250] },
  article_bottom: { desktop: [728, 90], mobile: [320, 100] },
  // Native only: we control the markup so a paid card can never be mistaken
  // for an editorial recommendation.
  guide_sponsor: { desktop: [0, 0], mobile: [0, 0] },
  dealer_storefront: { desktop: [300, 250], mobile: [300, 250] },
  classifieds_infeed: { desktop: [300, 250], mobile: [300, 250] },
} as const satisfies Record<string, PlacementSize>

export type PlacementCode = keyof typeof PLACEMENTS

/** CSS modifier class for a placement, e.g. `tm-promo--inv-sidebar`. */
export function placementModifier(code: PlacementCode): string {
  return `tm-promo--${code.replace(/_/g, '-')}`
}
