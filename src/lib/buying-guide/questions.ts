/**
 * Guía de compra — the questionnaire, as data.
 *
 * Single source of truth for the wizard UI, the URL parser and the scoring
 * rules: every option's `value` is exactly what travels in the URL.
 */

import type {
  Answers, GuideFuel, GuideGearbox, GuidePers, GuidePriority, GuideUse, PriceBand, StepId,
} from './types'

/** Icon names resolved by the client (lucide-react) — keeps this module React-free. */
export type GuideIcon =
  | 'users' | 'building' | 'truck' | 'route' | 'gauge'
  | 'wallet' | 'user' | 'fuel' | 'droplets' | 'leaf' | 'zap' | 'settings' | 'hand'
  | 'tag' | 'maximize' | 'sparkles' | 'shield' | 'ban'

export interface StepOption<V extends string | number = string | number> {
  value: V
  label: string
  desc?: string
  icon: GuideIcon
}

export interface Step {
  id: StepId
  /** Short label for progress chips. */
  short: string
  title: string
  subtitle?: string
  /** Fine print under the options (e.g. data caveats). */
  caption?: string
  options: StepOption[]
  /** Label of the "skip" action for this step. */
  skipLabel: string
}

export const USES: StepOption<GuideUse>[] = [
  { value: 'familia', label: 'Familia', desc: 'Espacio, seguridad y baúl para el día a día con la familia.', icon: 'users' },
  { value: 'ciudad', label: 'Ciudad', desc: 'Compacto, fácil de estacionar y económico de mantener.', icon: 'building' },
  { value: 'trabajo', label: 'Trabajo y carga', desc: 'Camionetas y vehículos con capacidad de carga y torque.', icon: 'truck' },
  { value: 'ruta', label: 'Ruta y viajes', desc: 'Confort, autonomía y seguridad para kilómetros largos.', icon: 'route' },
  { value: 'deportivo', label: 'Manejo deportivo', desc: 'Potencia y carácter: coupés, hot hatches y deportivos.', icon: 'gauge' },
]

export const BUDGET_CHIPS: StepOption<number>[] = [
  { value: 20000, label: 'Hasta USD 20.000', icon: 'wallet' },
  { value: 30000, label: 'Hasta USD 30.000', icon: 'wallet' },
  { value: 45000, label: 'Hasta USD 45.000', icon: 'wallet' },
  { value: 70000, label: 'Hasta USD 70.000', icon: 'wallet' },
]

export const PERS: StepOption<GuidePers>[] = [
  { value: 2, label: '1 o 2', desc: 'Voy solo o en pareja.', icon: 'user' },
  { value: 4, label: '3 o 4', desc: 'Pareja e hijos, o amigos seguido.', icon: 'users' },
  { value: 5, label: '5', desc: 'Necesito cinco plazas cómodas.', icon: 'users' },
  { value: 7, label: 'Más de 5', desc: 'Familia numerosa: busco SUVs medianos o grandes.', icon: 'users' },
]

export const FUELS: StepOption<GuideFuel>[] = [
  { value: 'nafta', label: 'Nafta', desc: 'La opción más amplia y accesible.', icon: 'fuel' },
  { value: 'diesel', label: 'Diésel', desc: 'Torque y consumo bajo en ruta y carga.', icon: 'droplets' },
  { value: 'hibrido', label: 'Híbrido', desc: 'Menos consumo sin depender de enchufe.', icon: 'leaf' },
  { value: 'electrico', label: 'Eléctrico', desc: 'Cero emisiones y bajo costo por km.', icon: 'zap' },
]

export const GEARBOXES: StepOption<GuideGearbox>[] = [
  { value: 'auto', label: 'Automática', desc: 'Comodidad, sobre todo en el tránsito.', icon: 'settings' },
  { value: 'manual', label: 'Manual', desc: 'Control total y, en general, menor precio.', icon: 'hand' },
]

export const PRIORITIES: StepOption<GuidePriority>[] = [
  { value: 'precio', label: 'Precio', desc: 'Que sea lo más accesible posible.', icon: 'tag' },
  { value: 'espacio', label: 'Espacio', desc: 'Baúl y habitáculo generosos.', icon: 'maximize' },
  { value: 'potencia', label: 'Potencia', desc: 'Motor con respuesta.', icon: 'zap' },
  { value: 'equipamiento', label: 'Equipamiento', desc: 'Tecnología y confort a bordo.', icon: 'sparkles' },
  { value: 'seguridad', label: 'Seguridad', desc: 'Airbags y asistencias de conducción.', icon: 'shield' },
  { value: 'eficiencia', label: 'Consumo / autonomía', desc: 'Gastar poco por kilómetro.', icon: 'leaf' },
]

export const STEPS: Step[] = [
  {
    id: 'uso', short: 'Uso',
    title: '¿Para qué lo vas a usar más?',
    subtitle: 'Elegí el uso principal: define el tipo de vehículo que te vamos a proponer.',
    options: USES, skipLabel: 'No sé todavía',
  },
  {
    id: 'max', short: 'Presupuesto',
    title: '¿Cuál es tu presupuesto máximo?',
    subtitle: 'Precios de lista de referencia en dólares, 0 km.',
    options: BUDGET_CHIPS, skipLabel: 'Sin tope',
  },
  {
    id: 'pers', short: 'Personas',
    title: '¿Cuántas personas viajan habitualmente?',
    caption: 'No tenemos el dato de plazas en todas las fichas: para más de 5 filtramos SUVs medianos y grandes de más de 4,6 m — verificá las plazas en la ficha.',
    options: PERS, skipLabel: 'Indistinto',
  },
  {
    id: 'motor', short: 'Motor',
    title: '¿Qué motorización preferís?',
    options: FUELS, skipLabel: 'Me da igual',
  },
  {
    id: 'caja', short: 'Caja',
    title: '¿Caja automática o manual?',
    options: GEARBOXES, skipLabel: 'Me da igual',
  },
  {
    id: 'prio', short: 'Prioridad',
    title: '¿Qué es lo más importante para vos?',
    subtitle: 'Lo usamos para ordenar los resultados; no descarta nada.',
    options: PRIORITIES, skipLabel: 'Ver resultados',
  },
]

export const STEP_IDS: StepId[] = STEPS.map((s) => s.id)

/* ---------------- Price bands (curated tree axis) ---------------- */

export const PRICE_BANDS: { id: PriceBand; label: string; max: number }[] = [
  { id: 'hasta-20k', label: 'Hasta USD 20.000', max: 20000 },
  { id: '20-30k', label: 'USD 20.000 – 30.000', max: 30000 },
  { id: '30-45k', label: 'USD 30.000 – 45.000', max: 45000 },
  { id: '45-70k', label: 'USD 45.000 – 70.000', max: 70000 },
  { id: 'mas-70k', label: 'Más de USD 70.000', max: Infinity },
]

/** Band a price falls in (upper bound inclusive). */
export function bandFor(price: number): PriceBand {
  for (const b of PRICE_BANDS) if (price <= b.max) return b.id
  return 'mas-70k'
}

export function bandIndex(band: PriceBand): number {
  return PRICE_BANDS.findIndex((b) => b.id === band)
}

/* ---------------- Use → body-type affinity ---------------- */

/** > 0 = allowed for that use (hard filter); the value is the soft `fit`. */
export const USE_AFFINITY: Record<GuideUse, Record<string, number>> = {
  familia: { wagon: 1, 'midsize-suv': 1, 'fullsize-suv': 1, sedan: 0.9, 'compact-suv': 0.8, 'coupe-suv': 0.7, hatchback: 0.6, 'double-cab': 0.5 },
  ciudad: { hatchback: 1, 'compact-suv': 0.9, sedan: 0.7, 'coupe-suv': 0.5, coupe: 0.5, convertible: 0.5, wagon: 0.5, 'midsize-suv': 0.3 },
  trabajo: { 'double-cab': 1, 'single-cab': 1, 'extended-cab': 1, 'fullsize-suv': 0.5, 'midsize-suv': 0.4, wagon: 0.4 },
  ruta: { 'midsize-suv': 1, 'fullsize-suv': 0.9, wagon: 0.9, sedan: 0.8, 'compact-suv': 0.7, 'coupe-suv': 0.7, 'double-cab': 0.7, hatchback: 0.4, coupe: 0.3, convertible: 0.3 },
  deportivo: { coupe: 1, convertible: 1, 'coupe-suv': 0.7, sedan: 0.6, hatchback: 0.6, 'compact-suv': 0.4, 'midsize-suv': 0.4, 'fullsize-suv': 0.4, wagon: 0.4 },
}

/** Fichas without a body type: assume the most common one of their vehicleType
 *  so they are not silently dropped from every use. */
export const DEFAULT_SUB: Record<'cars' | 'suvs' | 'pickups', string> = {
  cars: 'sedan', suvs: 'compact-suv', pickups: 'double-cab',
}

/** Minimum power for "manejo deportivo". */
export const SPORTY_MIN_HP = 150

/** Human labels for subtypes (reasons, chips). */
export const SUB_LABELS: Record<string, string> = {
  sedan: 'Sedán', hatchback: 'Hatchback', coupe: 'Coupé', convertible: 'Descapotable', wagon: 'Rural / wagon',
  'compact-suv': 'SUV compacto', 'midsize-suv': 'SUV mediano', 'fullsize-suv': 'SUV grande', 'coupe-suv': 'SUV coupé',
  'double-cab': 'Pickup doble cabina', 'single-cab': 'Pickup cabina simple', 'extended-cab': 'Pickup cabina extendida',
}

/* ---------------- Labels for progress chips ---------------- */

export function answerLabel(id: StepId, answers: Answers): string | undefined {
  switch (id) {
    case 'uso': return USES.find((o) => o.value === answers.uso)?.label
    case 'max': return answers.max != null ? `Hasta USD ${answers.max.toLocaleString('es-UY')}` : undefined
    case 'pers': return PERS.find((o) => o.value === answers.pers)?.label
    case 'motor': return FUELS.find((o) => o.value === answers.motor)?.label
    case 'caja': return GEARBOXES.find((o) => o.value === answers.caja)?.label
    case 'prio': return PRIORITIES.find((o) => o.value === answers.prio)?.label
  }
}
