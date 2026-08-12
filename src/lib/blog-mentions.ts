import type { Vehicle } from '@/types/vehicle'

/**
 * Finds catalogue vehicles mentioned in an article body.
 *
 * The blog is the strongest internal-authority source on the site and it linked
 * to zero vehicle pages: posts name the Seagull Surf, the HB20 or the BYD Han
 * as plain text while a full spec page for each sits one route away.
 *
 * Matching is deliberately conservative, because a false link is worse than a
 * missing one. Model names alone are frequently ambiguous or meaningless as
 * text — "Han", "911", "#1", "Versa" — so a bare model only counts when it is
 * distinctive enough (4+ characters) AND its brand is named somewhere in the
 * same article. Anything shorter has to appear right next to its brand.
 */

/** Lowercase, unaccented, tag-free, single-spaced — the form both sides match in. */
function normalize(text: string): string {
  return text
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/** Regex-escapes a needle — model names carry #, +, ( and . */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Word-boundary match that survives the punctuation in model names. \b is
 * useless next to "#1" or "e-CVT", since # and - are already non-word
 * characters, so the edges are asserted against whitespace instead.
 */
function mentions(haystack: string, needle: string): boolean {
  if (!needle) return false
  return new RegExp(`(^|\\s)${escapeRegex(needle)}(\\s|$|[.,;:!?)])`).test(haystack)
}

/**
 * @param limit caps the block so a market-roundup post naming twenty models
 *   does not turn its footer into a second catalogue.
 */
export function findMentionedVehicles(
  contentHtml: string,
  vehicles: Vehicle[],
  limit = 6
): Vehicle[] {
  const text = normalize(contentHtml)
  if (!text) return []

  // Which brands the article talks about at all — the gate for bare-model hits.
  const brandsInPost = new Set<string>()
  for (const v of vehicles) {
    const brand = normalize(v.brand)
    if (brand && mentions(text, brand)) brandsInPost.add(brand)
  }

  const matched: Vehicle[] = []
  const seen = new Set<string>()

  for (const v of vehicles) {
    const brand = normalize(v.brand)
    const model = normalize(v.model)
    if (!model) continue

    const hit =
      mentions(text, `${brand} ${model}`) ||
      (model.length >= 4 && brandsInPost.has(brand) && mentions(text, model))
    if (!hit) continue

    // One card per model, not per trim: a catalogue with five RAV4 versions
    // would otherwise fill the block with the same vehicle. Keyed on what the
    // card actually shows rather than on modelFamilyId, which splits two
    // catalogue entries that both read "Porsche Taycan" into separate families.
    const key = `${brand}|${model}`
    if (seen.has(key)) continue
    seen.add(key)
    matched.push(v)
  }

  // Drop a model whose name is the opening of another matched model from the
  // same brand: "BYD Seagull" matches inside the text "BYD Seagull Surf", so an
  // article about the Surf would claim to mention a vehicle it never named.
  // Keeping only the more specific name can omit a genuine second mention —
  // the safer error, since the block asserts these vehicles appear in the text.
  const kept = matched.filter((v) => {
    const self = `${normalize(v.brand)} ${normalize(v.model)}`
    return !matched.some((other) => {
      if (other === v) return false
      const otherName = `${normalize(other.brand)} ${normalize(other.model)}`
      return otherName.startsWith(`${self} `)
    })
  })

  // Cheapest first — the entry version is the useful landing point for a reader
  // who just read the model's name in an article.
  kept.sort((a, b) => (a.price || Infinity) - (b.price || Infinity))

  return kept.slice(0, limit)
}
