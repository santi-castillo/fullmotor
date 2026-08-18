// Server-only: imports the API layer (secret header) — never import from client components.
import { unstable_cache } from 'next/cache'
import { getAllVehicles } from '@/lib/data'
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

async function buildGuideIndex(): Promise<GuideVehicle[]> {
  const started = Date.now()
  const all = await getAllVehicles()
  const index: GuideVehicle[] = []
  for (const v of all) {
    const g = toGuideVehicle(v)
    if (g) index.push(g)
  }
  const sales = attachSales(index, ACAU_DATA)
  console.info(`[guide] index built: ${index.length}/${all.length} vehicles in ${Date.now() - started} ms · ACAU ${sales.matched}/${sales.families} familias con ventas`)
  return index
}

export { salesMeta }

export const getGuideIndex = unstable_cache(buildGuideIndex, ['guide-index-v3'], {
  revalidate: GUIDE_INDEX_REVALIDATE,
  tags: ['guide-index'],
})

/** Curated picks validated against the current index (invalid ones logged and dropped). */
export function getResolvedCurated(index: GuideVehicle[], nodes: CuratedNode[] = CURATED_PICKS) {
  const resolved = resolveCurated(index, nodes)
  if (resolved.issues.length && index.length) {
    for (const i of resolved.issues) console.warn(`[guide] pick descartado ${i.use}/${i.band} ${i.slug}: ${i.problem}`)
  }
  return resolved.picks
}
