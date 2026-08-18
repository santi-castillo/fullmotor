/**
 * Feature extraction for the guía de compra.
 *
 * `safetyFeatures`, `equipment` and `transmission` are free text written by
 * many hands ("6 airbags", "seis airbags", "airbags frontales y laterales";
 * "Automática (6 vel)", "Steptronic (8 vel)", "Manual de 5 velocidades"…), so
 * the raw arrays don't discriminate. These helpers reduce them to a handful of
 * comparable numbers and tags. Everything here is pure and runs server-side
 * when the index is built — the client only ever sees the results.
 */

import type { Vehicle } from '@/types/vehicle'
import { fuelToTagType } from '@/lib/format'
import type { GuideFuel, GuideType, GuideVehicle } from './types'

const GUIDE_TYPES: GuideType[] = ['cars', 'suvs', 'pickups']

export function isGuideType(t: string): t is GuideType {
  return (GUIDE_TYPES as string[]).includes(t)
}

/** "Manual", "Manual (6 vel)", "Caja manual de 5 velocidades" → true.
 *  "Automática", "Steptronic", "CVT", "DCT", missing → false.
 *  Semi/robotised boxes ("secuencial", "automatizada") are driven like an
 *  automatic, so they count as automatic. */
export function isManualTransmission(text?: string | null): boolean {
  if (!text) return false
  const t = text.toLowerCase()
  if (!/\bmanual\b/.test(t)) return false
  return !/semi|automatizad|robotizad|secuencial|modo manual/.test(t)
}

const NUMBER_WORDS: Record<string, number> = {
  dos: 2, doble: 2, dual: 2, cuatro: 4, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12,
}

/** Best-effort airbag count from strings like "6 airbags (frontales…)",
 *  "seis airbags", "airbags frontales y laterales", "múltiples airbags". */
export function airbagCount(features: string[] | undefined): number {
  let best = 0
  for (const raw of features || []) {
    const s = raw.toLowerCase()
    if (!s.includes('airbag')) continue
    let n = 0
    const digits = s.match(/(\d{1,2})\s*(?:airbags?|bolsas)/) || s.match(/airbags?\s*[:(]?\s*(\d{1,2})\b/)
    if (digits) n = parseInt(digits[1], 10)
    if (!n) {
      const word = s.match(/\b(dos|doble|dual|cuatro|seis|siete|ocho|nueve|diez|once|doce)\b/)
      if (word) n = NUMBER_WORDS[word[1]]
    }
    if (!n) {
      const front = /frontal|front|conductor|acompañante|delanter/.test(s)
      const side = /lateral|side|torax|tórax/.test(s)
      const curtain = /cortina|curtain/.test(s)
      if (/múltiples|multiples|multiple/.test(s)) n = 6
      else if (curtain) n = 6
      else if (side) n = 4
      else if (front) n = 2
      else n = 2
    }
    if (n > best) best = n
  }
  return best
}

export interface FeatureRule {
  code: string
  label: string
  weight: number
  re: RegExp
}

/** Driver-assistance systems (searched in safety + equipment). */
export const ADAS_RULES: FeatureRule[] = [
  { code: 'aeb', label: 'frenado autónomo de emergencia', weight: 1, re: /frenad[oa]\s+(?:autónom|automátic|de emergencia)|\baeb\b|colisión frontal|pre-?colisi|pre-?collision|forward collision|emergency brak/i },
  { code: 'lka', label: 'asistente de carril', weight: 1, re: /carril|\blane\b|\blka\b|\bldw\b/i },
  { code: 'acc', label: 'crucero adaptativo', weight: 1, re: /crucero adaptativo|control de crucero adaptativo|adaptive cruise|\bacc\b|crucero.*adaptativ/i },
  { code: 'bsd', label: 'alerta de punto ciego', weight: 1, re: /punto ciego|blind[- ]?spot|\bblis\b|\bbsd\b|\bbsm\b/i },
  { code: 'rcta', label: 'alerta de tráfico cruzado', weight: 0.7, re: /tráfico (?:cruzado|trasero)|trafico (?:cruzado|trasero)|rear cross|\brcta\b|\brtd\b/i },
  { code: 'fatiga', label: 'monitor de fatiga', weight: 0.6, re: /fatiga|atención del conductor|somnolencia|drowsi|driver attention/i },
  { code: 'tsr', label: 'lectura de señales', weight: 0.5, re: /señales de tr[áa]nsito|traffic sign|\btsr\b/i },
  { code: 'hbeam', label: 'luces altas automáticas', weight: 0.5, re: /luces altas autom|high[- ]?beam assist|\bhba\b/i },
  { code: 'park', label: 'estacionamiento asistido', weight: 0.6, re: /estacionamiento (?:asistido|automático|semiautomático)|park(?:ing)? assist|autopark|self[- ]park/i },
]

/** Comfort / tech equipment. Weights feed the `eq` score; labels feed reasons. */
export const EQUIP_RULES: FeatureRule[] = [
  { code: 'carplay', label: 'CarPlay / Android Auto', weight: 2, re: /carplay|android auto/i },
  { code: 'cam360', label: 'cámara 360°', weight: 1.5, re: /360|surround view|vista de p[áa]jaro|bird'?s? eye/i },
  { code: 'clima', label: 'climatizador', weight: 1.5, re: /climatizador|climatizaci[óo]n|clima autom|dual[- ]zone|bizona|tri-?zona/i },
  { code: 'techo', label: 'techo panorámico', weight: 1.5, re: /techo (?:panor[áa]mico|solar|corredizo)|sunroof|moonroof/i },
  { code: 'hud', label: 'head-up display', weight: 1.5, re: /head-?up|\bhud\b/i },
  { code: 'audio', label: 'audio premium', weight: 1.5, re: /\b(?:bose|harman|jbl|meridian|burmester|bang|beats|focal|bowers|infinity|sony|dynaudio|rockford)\b|audio premium|premium audio/i },
  { code: 'elecseats', label: 'asientos eléctricos', weight: 1.5, re: /asientos? (?:delanteros? )?el[ée]ctric|regulaci[óo]n el[ée]ctrica|power seat|el[ée]ctricos? (?:con|en) \d+ (?:posiciones|vías)/i },
  { code: 'cuero', label: 'tapizado de cuero', weight: 1, re: /cuero|leather|piel/i },
  { code: 'cam', label: 'cámara de retroceso', weight: 1, re: /c[áa]mara (?:de )?(?:retroceso|trasera|reversa|marcha atr[áa]s)|rear[- ]?view camera|backup camera/i },
  { code: 'crucero', label: 'control de crucero', weight: 1, re: /control de crucero|cruise control|velocidad crucero/i },
  { code: 'led', label: 'faros LED', weight: 1, re: /\bled\b/i },
  { code: 'keyless', label: 'acceso sin llave', weight: 1, re: /keyless|sin llave|acceso inteligente|smart (?:entry|key)|llave inteligente|arranque por bot[óo]n/i },
  { code: 'nav', label: 'navegador GPS', weight: 1, re: /navegaci[óo]n|navegador|\bgps\b|navigation/i },
  { code: 'heatseats', label: 'asientos calefaccionados', weight: 1, re: /calefaccionad|calefactad|heated seat|ventilad/i },
  { code: 'wireless', label: 'cargador inalámbrico', weight: 1, re: /cargador inal[áa]mbrico|carga inal[áa]mbrica|wireless charg/i },
  { code: 'digital', label: 'tablero digital', weight: 1, re: /instrumental digital|cuadro digital|tablero digital|digital cluster|virtual cockpit|cockpit digital|pantalla de instrumentos/i },
  { code: 'tailgate', label: 'portón eléctrico', weight: 1, re: /port[óo]n (?:trasero )?el[ée]ctrico|power tailgate|apertura manos libres|hands-?free (?:tailgate|liftgate)/i },
  { code: 'sensores', label: 'sensores de estacionamiento', weight: 0.5, re: /sensores? de estacionamiento|park(?:ing)? sensor/i },
  { code: 'aire', label: 'aire acondicionado', weight: 0.5, re: /aire acondicionado|\ba\/c\b/i },
  { code: 'alloy', label: 'llantas de aleación', weight: 0.5, re: /llantas de aleaci[óo]n|alloy wheel/i },
]

const ADAS_LABELS = Object.fromEntries(ADAS_RULES.map((r) => [r.code, r.label]))
const EQUIP_LABELS = Object.fromEntries(EQUIP_RULES.map((r) => [r.code, r.label]))

export function adasLabel(code: string): string { return ADAS_LABELS[code] || code }
export function equipLabel(code: string): string { return EQUIP_LABELS[code] || code }

function matchRules(rules: FeatureRule[], texts: string[]): { codes: string[]; score: number } {
  const codes: string[] = []
  let score = 0
  for (const rule of rules) {
    if (texts.some((t) => rule.re.test(t))) {
      codes.push(rule.code)
      score += rule.weight
    }
  }
  return { codes, score }
}

export function adasFeatures(safety: string[] | undefined, equipment: string[] | undefined) {
  return matchRules(ADAS_RULES, [...(safety || []), ...(equipment || [])])
}

export function equipmentFeatures(equipment: string[] | undefined) {
  return matchRules(EQUIP_RULES, equipment || [])
}

export function hasIsofix(safety: string[] | undefined, equipment: string[] | undefined): boolean {
  return [...(safety || []), ...(equipment || [])].some((s) => /isofix|latch/i.test(s))
}

function daysSince(iso?: string): number {
  if (!iso) return 9999
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return 9999
  return Math.max(0, Math.round((Date.now() - t) / 86400000))
}

function guideFuel(fuelType?: string): GuideFuel | null {
  if (!fuelType) return null
  return fuelToTagType(fuelType)
}

const MAX_TAGS = 6

/** Maps a full catalogue Vehicle to the slim guide record. Returns null for
 *  vehicle types the guide does not cover (motos, utilitarios…). */
export function toGuideVehicle(v: Vehicle): GuideVehicle | null {
  if (!isGuideType(v.vehicleType)) return null
  const adas = adasFeatures(v.safetyFeatures, v.equipment)
  const eq = equipmentFeatures(v.equipment)
  return {
    slug: v.slug,
    brand: v.brand,
    model: v.model,
    version: v.version || undefined,
    year: v.year,
    family: v.modelFamilyId || v.slug,
    type: v.vehicleType,
    sub: v.vehicleSubtype?.[0] || '',
    price: typeof v.price === 'number' && v.price > 0 ? v.price : undefined,
    cur: v.currency || 'USD',
    hp: v.engineHp || undefined,
    tq: v.engineTorque || undefined,
    kg: v.weight || undefined,
    cc: v.engineCc || undefined,
    fuel: guideFuel(v.fuelType),
    manual: isManualTransmission(v.transmission),
    len: v.length || undefined,
    wb: v.wheelbase || undefined,
    trunk: v.trunkCapacity || undefined,
    auto: v.autonomyKm || undefined,
    airbags: airbagCount(v.safetyFeatures),
    adas: adas.codes.length,
    adasTags: adas.codes.slice(0, MAX_TAGS),
    isofix: hasIsofix(v.safetyFeatures, v.equipment),
    eq: Math.round(eq.score * 10) / 10,
    eqTags: eq.codes.slice(0, MAX_TAGS),
    image: v.image || v.images?.[0] || undefined,
    listed: daysSince(v.publishedAt || v.createdAt),
  }
}
