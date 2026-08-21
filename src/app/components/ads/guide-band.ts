/**
 * Price bands used to target the buying-guide sponsor slot.
 *
 * This lives in the ads module rather than in `src/lib/buying-guide/`, and the
 * dependency only ever points one way: ads code may read a guide answer, guide
 * code never imports anything from here.
 *
 * That is not tidiness. The product being sold is a ranking an advertiser
 * cannot buy, and the strongest form of that promise is one nobody can quietly
 * undo — there is no import path along which a payment could reach the score.
 * `politica-publicitaria` states it publicly; this is what makes it true.
 */

export type GuideBand = 'hasta-20k' | '20-30k' | '30-45k' | 'mas-45k'

/**
 * Buckets the guide's budget answer, in USD.
 *
 * Returns undefined when the visitor skipped the budget step, which the serve
 * endpoint reads as "no signal": a creative that targeted a band will not be
 * shown, rather than being shown to someone whose budget we are guessing at.
 */
export function bandFor(max?: number): GuideBand | undefined {
  if (max == null || !Number.isFinite(max) || max <= 0) return undefined
  if (max <= 20000) return 'hasta-20k'
  if (max <= 30000) return '20-30k'
  if (max <= 45000) return '30-45k'
  return 'mas-45k'
}
