/**
 * Guía de compra — shared types.
 *
 * The guide runs on a slim, precomputed index of the catalogue (GuideVehicle)
 * so that filtering, live counts and ranking are instant on the client and
 * identical on the server (a shared URL renders the same podium via SSR).
 */

export type GuideType = 'cars' | 'suvs' | 'pickups'
export type GuideFuel = 'nafta' | 'diesel' | 'hibrido' | 'electrico'
export type GuideUse = 'familia' | 'ciudad' | 'trabajo' | 'ruta' | 'deportivo'
export type GuidePers = 2 | 4 | 5 | 7
export type GuideGearbox = 'auto' | 'manual'
export type GuidePriority = 'precio' | 'espacio' | 'potencia' | 'equipamiento' | 'seguridad' | 'eficiencia'
export type PriceBand = 'hasta-20k' | '20-30k' | '30-45k' | '45-70k' | 'mas-70k'

/** Slim vehicle record shipped to the client. Keep it small: ~1100 rows. */
export interface GuideVehicle {
  slug: string
  brand: string
  model: string
  version?: string
  year: number
  /** modelFamilyId — one recommendation per family. */
  family: string
  type: GuideType
  /** First vehicleSubtype ('' when the ficha has none). */
  sub: string
  price?: number
  cur: string
  hp?: number
  tq?: number
  kg?: number
  cc?: number
  fuel: GuideFuel | null
  manual: boolean
  /** mm */
  len?: number
  /** wheelbase, mm */
  wb?: number
  /** litres */
  trunk?: number
  /** autonomy, km (EV / hybrid) */
  auto?: number
  airbags: number
  /** count of distinct ADAS features detected */
  adas: number
  adasTags: string[]
  isofix: boolean
  /** equipment keyword score */
  eq: number
  eqTags: string[]
  image?: string
  /** days since publishedAt/createdAt (9999 when unknown) */
  listed: number
  /** ACAU: units of this model sold in Uruguay in the reference year (undefined = no data). */
  sold?: number
  /** ACAU: rank of this model by units inside its ACAU segment (1 = best seller). */
  soldRank?: number
  /** ACAU segment the rank refers to (ACAU may file a crossover under a different segment). */
  soldSeg?: GuideType
}

/* ---------------- ACAU sales data (src/data/buying-guide/acau-YYYY.json) ---------------- */

export interface AcauModel {
  seg: GuideType
  brand: string
  brandKey: string
  /** Display name of the model root ("Yuan Pro"). */
  model: string
  /** Normalised model root used for matching ("yuan pro"). */
  modelKey: string
  units: number
  /** Rank by units inside the ACAU segment (all model roots, not only catalogue ones). */
  rank: number
  /** Number of ACAU version rows aggregated into this root. */
  versions: number
}

export interface AcauData {
  source: string
  url: string
  year: number
  /** Last month with sales > 0 (1–12). */
  monthsCovered: number
  updatedAt: string
  segments: Record<GuideType, number>
  models: AcauModel[]
}

export interface SalesMeta {
  year: number
  monthsCovered: number
  updatedAt: string
}

export interface Answers {
  uso?: GuideUse
  max?: number
  pers?: GuidePers
  motor?: GuideFuel
  caja?: GuideGearbox
  prio?: GuidePriority
}

export type StepId = 'uso' | 'max' | 'pers' | 'motor' | 'caja' | 'prio'
export type StepParam = StepId | 'res'

export interface CuratedPick {
  /** Concrete version in the catalogue (defines family and price). */
  slug: string
  /** 2–4 editorial reasons in es-UY, shown as chips. */
  why: string[]
  /** Internal note for curators — never rendered. */
  note?: string
}

export interface CuratedNode {
  use: GuideUse
  band: PriceBand
  /** In order of preference, one per model family. */
  picks: CuratedPick[]
}

/** A curated pick validated against the live index. */
export interface ResolvedPick extends CuratedPick {
  use: GuideUse
  band: PriceBand
  family: string
  /** Position inside its node (0 = first choice). */
  rank: number
}

export interface Scored {
  v: GuideVehicle
  score: number
  /** per-criterion 0..1 values, used by the reasons generator */
  c: Record<Criterion, number>
}

export type Criterion = 'fit' | 'price' | 'budget' | 'space' | 'power' | 'equip' | 'safety' | 'eff' | 'recency' | 'market'

export interface RankedFamily {
  /** Representative version (best score in the family). */
  best: Scored
  /** Other versions of the same family that also match the filters. */
  versions: GuideVehicle[]
}

export interface PodiumEntry {
  vehicle: GuideVehicle
  score: number
  reasons: string[]
  source: 'top' | 'data'
  /** Set when this pick only entered after relaxing a filter. */
  relaxedTag?: string
  versions: GuideVehicle[]
}

export interface GuideResult {
  /** Vehicles matching the strict answers. */
  strictCount: number
  strictFamilies: number
  /** Answers actually used after relaxation (equal to input when none). */
  effective: Answers
  /** Human-readable notes about what was relaxed (empty when nothing). */
  notes: string[]
  podium: PodiumEntry[]
  others: RankedFamily[]
}
