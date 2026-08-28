// Server-only: imports the API layer (secret header) — never import from client components.
import { unstable_cache } from 'next/cache'
import { fetchAllVehicles } from '@/lib/data'
import type { CuratedNode, GuideVehicle } from './types'
import { toGuideVehicle } from './features'
import { resolveCurated } from './curated'
import { attachSales } from './sales'
import { CURATED_PICKS } from '@/data/buying-guide/picks'
import { ACAU_DATA, salesMeta } from './acau-data'

/**
 * Slim catalogue index for the guía de compra: cars, SUVs and pickups only,
 * reduced to the fields the wizard filters and scores on.
 *
 * Paging the whole catalogue costs ~13 requests, so the result is cached for
 * an hour (the listing itself revalidates every minute; the guide does not
 * need to be that fresh). Tag `guide-index` allows a manual purge.
 */
export const GUIDE_INDEX_REVALIDATE = 3600

/**
 * Throws rather than returning an empty index, which is what keeps a blip from
 * turning into an outage: `unstable_cache` stores whatever the callback
 * returns, so an empty array would be served as "the catalogue is empty" for
 * the whole hour, long after the API recovered. A throw is cached by nothing.
 *
 * `fetchAllVehicles` already retries each page, so reaching the empty case
 * means the API answered and had nothing to say — never a real state for a
 * live catalogue, so it is treated as a failure too.
 */
async function buildGuideIndex(): Promise<GuideVehicle[]> {
  const started = Date.now()
  const all = await fetchAllVehicles()
  const index: GuideVehicle[] = []
  for (const v of all) {
    const g = toGuideVehicle(v)
    if (g) index.push(g)
  }
  if (index.length === 0) {
    throw new Error(`[guide] empty index (catalogue returned ${all.length} vehicles) — refusing to cache it`)
  }
  const sales = attachSales(index, ACAU_DATA)
  console.info(`[guide] index built: ${index.length}/${all.length} vehicles in ${Date.now() - started} ms · ACAU ${sales.matched}/${sales.families} familias con ventas`)
  return index
}

export { salesMeta }

// v4 rather than v3: a deploy of this fix starts from a clean key, so any
// empty index already stored under the old one stops being served.
const cachedGuideIndex = unstable_cache(buildGuideIndex, ['guide-index-v4'], {
  revalidate: GUIDE_INDEX_REVALIDATE,
  tags: ['guide-index'],
})

/**
 * The index, or an empty array when the catalogue could not be read.
 *
 * The page renders its own "no pudimos cargar el catálogo" state for the empty
 * case. The difference from before is that nothing about this failure is
 * stored: the very next request builds the index again.
 */
export async function getGuideIndex(): Promise<GuideVehicle[]> {
  try {
    return await cachedGuideIndex()
  } catch (error) {
    console.error('[guide] index build failed — showing the empty state, retrying on the next request:', error)
    return []
  }
}

/** Curated picks validated against the current index (invalid ones logged and dropped). */
export function getResolvedCurated(index: GuideVehicle[], nodes: CuratedNode[] = CURATED_PICKS) {
  const resolved = resolveCurated(index, nodes)
  if (resolved.issues.length && index.length) {
    for (const i of resolved.issues) console.warn(`[guide] pick descartado ${i.use}/${i.band} ${i.slug}: ${i.problem}`)
  }
  return resolved.picks
}
