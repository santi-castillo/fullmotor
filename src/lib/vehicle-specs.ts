import { fuelToTagType } from './format'

/**
 * Which spec rows make sense for a given powertrain.
 *
 * Lived inline in the detail page, which meant the compare page had no such
 * logic at all and showed "Cilindrada –" on battery cars.
 */

/** Battery only — no combustion engine at all. */
export function isElectric(fuelType?: string | null): boolean {
  return fuelToTagType(fuelType) === 'electrico'
}

/** Hybrid: a combustion engine AND a battery, so both sets of specs apply. */
export function isHybrid(fuelType?: string | null): boolean {
  return fuelToTagType(fuelType) === 'hibrido'
}

/**
 * Has a battery worth reporting. Includes hybrids — they were previously
 * excluded, so a hybrid's batteryKwh and autonomyKm were never rendered even
 * when present.
 */
export function hasBattery(fuelType?: string | null): boolean {
  return isElectric(fuelType) || isHybrid(fuelType)
}

/** Has a combustion engine: everything except a pure EV. */
export function hasCombustionEngine(fuelType?: string | null): boolean {
  return !isElectric(fuelType)
}

/** Displacement and a fuel tank only exist where there is an engine. */
export const showsDisplacement = hasCombustionEngine
export const showsFuelTank = hasCombustionEngine

/**
 * Whether to print a gear count.
 *
 * Not simply "hide on electric": some EVs really do have a multi-speed
 * gearbox — the Porsche Taycan and the electric Mercedes GLC use a 2-speed
 * rear axle. What is noise is announcing "1 gear" for a single-speed reducer,
 * which is every other EV.
 */
export function showsGearCount(fuelType?: string | null, gears?: number): boolean {
  if (!gears) return false
  if (isElectric(fuelType)) return gears > 1
  return true
}
