import type { Vehicle } from '@/types/vehicle'

/**
 * Shared shape of the catalogue's URLs.
 *
 * Lives in lib rather than beside the pagination component so the sitemap and
 * the brand pages can build the same links without importing a React component.
 */

/**
 * 24 per page. The catalogue used to render 9 vehicles into the server HTML and
 * load the rest on scroll, leaving 1.230 of 1.239 vehicle pages with no
 * internal link pointing at them. 24 gets a crawler to the tail of a category
 * in a reasonable number of hops without a page that weighs too much.
 */
export const CATALOG_PER_PAGE = 24

export type CatalogParams = Record<string, string | undefined>

/** `/vehiculos?category=autos&page=3`, with `page` omitted on the first. */
export function catalogHref(params: CatalogParams, page: number): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }
  if (page > 1) search.set('page', String(page))
  const qs = search.toString()
  return qs ? `/vehiculos?${qs}` : '/vehiculos'
}

/**
 * Brand name to URL slug: "Mercedes-Benz" → "mercedes-benz", "Omoda & Jaecoo"
 * → "omoda-jaecoo". Accents are stripped so Citroën resolves from an ASCII URL.
 */
export function brandSlug(brand: string): string {
  return brand
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface BrandGroup {
  slug: string
  /** The brand as it is spelled in the catalogue. */
  name: string
  vehicles: Vehicle[]
}

/**
 * Groups a catalogue into brands, alphabetically, skipping empty names.
 * Vehicles within a brand are ordered cheapest first, which is the order the
 * brand page lists them in.
 */
export function groupByBrand(vehicles: Vehicle[]): BrandGroup[] {
  const groups = new Map<string, BrandGroup>()

  for (const vehicle of vehicles) {
    const name = vehicle.brand?.trim()
    if (!name) continue
    const slug = brandSlug(name)
    if (!slug) continue

    const existing = groups.get(slug)
    if (existing) existing.vehicles.push(vehicle)
    else groups.set(slug, { slug, name, vehicles: [vehicle] })
  }

  const out = [...groups.values()]
  for (const group of out) {
    group.vehicles.sort((a, b) => (a.price || Infinity) - (b.price || Infinity))
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

/** Lowest price in a brand's catalogue, for the "desde USD X" line. */
export function cheapest(vehicles: Vehicle[]): Vehicle | undefined {
  return vehicles.find((v) => v.price) ?? vehicles[0]
}
