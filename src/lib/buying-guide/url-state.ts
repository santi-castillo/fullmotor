/**
 * Guía de compra — URL ⇄ state.
 *
 * The whole wizard state lives in the query string so a result can be shared
 * and the browser's back button walks the steps. Unknown or malformed values
 * are ignored rather than rejected.
 */

import type { Answers, GuideFuel, GuideGearbox, GuidePers, GuidePriority, GuideUse, StepId, StepParam } from './types'
import { FUELS, GEARBOXES, PERS, PRIORITIES, STEP_IDS, USES } from './questions'
import { catalogHref as listingHref } from '@/lib/catalog'

export const GUIDE_PATH = '/guia-de-compra'
export const MIN_BUDGET = 3000
export const MAX_BUDGET = 1_000_000

type SP = { get(name: string): string | null }

function pick<V extends string | number>(raw: string | null, options: { value: V }[]): V | undefined {
  if (raw == null) return undefined
  return options.find((o) => String(o.value) === raw)?.value
}

export function parseBudget(raw: string | null | undefined): number | undefined {
  if (!raw) return undefined
  const n = parseInt(raw.replace(/[^\d]/g, ''), 10)
  if (!Number.isFinite(n) || n < MIN_BUDGET || n > MAX_BUDGET) return undefined
  return n
}

export function parseAnswers(sp: SP): Answers {
  const a: Answers = {}
  const uso = pick<GuideUse>(sp.get('uso'), USES)
  if (uso) a.uso = uso
  const max = parseBudget(sp.get('max'))
  if (max) a.max = max
  const pers = pick<GuidePers>(sp.get('pers'), PERS)
  if (pers) a.pers = pers
  const motor = pick<GuideFuel>(sp.get('motor'), FUELS)
  if (motor) a.motor = motor
  const caja = pick<GuideGearbox>(sp.get('caja'), GEARBOXES)
  if (caja) a.caja = caja
  const prio = pick<GuidePriority>(sp.get('prio'), PRIORITIES)
  if (prio) a.prio = prio
  return a
}

/** `paso` → step id or 'res'. Missing/invalid → first step. */
export function parseStep(sp: SP): StepParam {
  const raw = sp.get('paso')
  if (raw === 'res') return 'res'
  const n = raw ? parseInt(raw, 10) : NaN
  if (Number.isInteger(n) && n >= 1 && n <= STEP_IDS.length) return STEP_IDS[n - 1]
  return STEP_IDS[0]
}

export function stepNumber(step: StepId): number {
  return STEP_IDS.indexOf(step) + 1
}

export function nextStep(step: StepId): StepParam {
  const i = STEP_IDS.indexOf(step)
  return i >= STEP_IDS.length - 1 ? 'res' : STEP_IDS[i + 1]
}

export function prevStep(step: StepParam): StepId {
  if (step === 'res') return STEP_IDS[STEP_IDS.length - 1]
  const i = STEP_IDS.indexOf(step)
  return STEP_IDS[Math.max(0, i - 1)]
}

export function hasAnyAnswer(a: Answers): boolean {
  return Object.values(a).some((v) => v !== undefined)
}

export function buildGuideUrl(answers: Answers, step: StepParam): string {
  const p = new URLSearchParams()
  if (answers.uso) p.set('uso', answers.uso)
  if (answers.max) p.set('max', String(answers.max))
  if (answers.pers) p.set('pers', String(answers.pers))
  if (answers.motor) p.set('motor', answers.motor)
  if (answers.caja) p.set('caja', answers.caja)
  if (answers.prio) p.set('prio', answers.prio)
  if (step === 'res') p.set('paso', 'res')
  else if (step !== STEP_IDS[0] || hasAnyAnswer(answers)) p.set('paso', String(stepNumber(step)))
  const qs = p.toString()
  return qs ? `${GUIDE_PATH}?${qs}` : GUIDE_PATH
}

/* ---------------- Outbound links ---------------- */

const FUEL_TO_CATALOG: Record<GuideFuel, string> = {
  nafta: 'gasoline', diesel: 'diesel', hibrido: 'hybrid', electrico: 'electric',
}

const TYPE_TO_CATEGORY: Record<'cars' | 'suvs' | 'pickups', string> = {
  cars: 'autos', suvs: 'suvs', pickups: 'pickups',
}

/** Link to the catalogue with the closest filters the listing supports.
 *  `types` = vehicle types present in the candidate set; a single type maps to
 *  its category, otherwise the listing shows everything.
 *
 *  Built through the listing's own helper so the guide follows the catalogue
 *  wherever it lives. It used to hardcode `/?…`, which still worked only
 *  because of the `/` → `/vehiculos` redirect the SEO move left behind. */
export function catalogHref(answers: Answers, types: Array<'cars' | 'suvs' | 'pickups'>): string {
  const uniq = Array.from(new Set(types))
  return listingHref({
    category: uniq.length === 1 ? TYPE_TO_CATEGORY[uniq[0]] : 'all',
    max_price: answers.max ? String(answers.max) : undefined,
    fuel: answers.motor ? FUEL_TO_CATALOG[answers.motor] : undefined,
    sort: answers.prio === 'precio' ? 'price_asc' : answers.prio === 'potencia' ? 'power_desc' : undefined,
  }, 1)
}

export function compareHref(slugs: string[]): string {
  return `/compare?vehicles=${slugs.map(encodeURIComponent).join(',')}`
}
