/**
 * The 19 departments, in the order the select renders them.
 *
 * A closed list rather than the free-text box the city field uses. The
 * department is what a dealership filters on to decide whether a car is close
 * enough to be worth quoting, so a misspelling would not merely look untidy —
 * it would drop the listing out of the feed of every dealership nearby, and the
 * seller would never know why nobody bid.
 *
 * The API validates against the same 19 and stores the canonical spelling, so
 * these strings are submitted as-is.
 */
export const DEPARTAMENTOS = [
  'Artigas',
  'Canelones',
  'Cerro Largo',
  'Colonia',
  'Durazno',
  'Flores',
  'Florida',
  'Lavalleja',
  'Maldonado',
  'Montevideo',
  'Paysandú',
  'Río Negro',
  'Rivera',
  'Rocha',
  'Salto',
  'San José',
  'Soriano',
  'Tacuarembó',
  'Treinta y Tres',
] as const

export type Departamento = (typeof DEPARTAMENTOS)[number]
