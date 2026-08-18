/**
 * Guía de compra — the curated "Top TodoMotor" tree.
 *
 * `src/data/buying-guide/picks.ts` names concrete catalogue versions per
 * (use × price band). This module validates them against the live index so the
 * wizard never shows a pick that disappeared or drifted out of its band, and
 * turns them into a flat, ordered candidate list.
 */

import type { CuratedNode, GuideUse, GuideVehicle, PriceBand, ResolvedPick } from './types'
import { USE_AFFINITY, bandFor, bandIndex, DEFAULT_SUB } from './questions'

export interface CuratedIssue {
  use: GuideUse
  band: PriceBand
  slug: string
  problem: string
}

export interface ResolvedCurated {
  picks: ResolvedPick[]
  issues: CuratedIssue[]
}

/** Effective body type (fichas without one fall back to the type's default). */
export function subOf(v: GuideVehicle): string {
  return v.sub || DEFAULT_SUB[v.type]
}

/**
 * Validates every pick: it must exist, be priced inside its node's band, be a
 * body type allowed for the node's use, and be the only pick of its family in
 * that node. Invalid picks are dropped and reported (the page logs them).
 */
export function resolveCurated(index: GuideVehicle[], nodes: CuratedNode[]): ResolvedCurated {
  const bySlug = new Map(index.map((v) => [v.slug, v]))
  const picks: ResolvedPick[] = []
  const issues: CuratedIssue[] = []

  for (const node of nodes) {
    const seenFamilies = new Set<string>()
    let rank = 0
    for (const pick of node.picks) {
      const v = bySlug.get(pick.slug)
      const issue = (problem: string) => issues.push({ use: node.use, band: node.band, slug: pick.slug, problem })
      if (!v) { issue('no existe en el catálogo'); continue }
      if (v.price == null) { issue('sin precio'); continue }
      if (bandFor(v.price) !== node.band) { issue(`precio USD ${v.price} fuera de la franja ${node.band}`); continue }
      if (!(USE_AFFINITY[node.use][subOf(v)] > 0)) { issue(`carrocería "${subOf(v)}" no aplica al uso ${node.use}`); continue }
      if (seenFamilies.has(v.family)) { issue('familia repetida en el nodo'); continue }
      if (!pick.why || pick.why.length < 2) { issue('menos de 2 razones') }
      seenFamilies.add(v.family)
      picks.push({ ...pick, use: node.use, band: node.band, family: v.family, rank: rank++ })
    }
  }
  return { picks, issues }
}

/**
 * Curated candidates for a use, ordered for a budget: the user's band first,
 * then lower bands (a great USD 18k car is still a valid pick for a USD 30k
 * budget), curated order inside each band. Without a budget every band
 * qualifies and the caller ranks by score instead.
 */
export function curatedCandidates(picks: ResolvedPick[], use: GuideUse, max?: number): ResolvedPick[] {
  const userBand = max != null ? bandIndex(bandFor(max)) : Infinity
  return picks
    .filter((p) => p.use === use && bandIndex(p.band) <= userBand)
    .sort((a, b) => (bandIndex(b.band) - bandIndex(a.band)) || (a.rank - b.rank))
}
