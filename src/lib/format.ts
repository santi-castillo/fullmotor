/**
 * es-UY formatting helpers — the single source of truth for how
 * numbers, prices and fuel types are rendered across the site.
 * Prices: "USD 42.390" (dot thousands), decimals with comma.
 */

export type FuelTagType = 'nafta' | 'electrico' | 'hibrido' | 'diesel'

export function formatNumber(n: number): string {
  return n.toLocaleString('es-UY')
}

/** "USD 42.390" — normalizes currency aliases (US$ → USD). */
export function formatPrice(currency: string | undefined, price: number | undefined): string {
  if (price == null) return 'Consultar'
  const cur = !currency || currency === 'US$' || currency === 'U$S' ? 'USD' : currency
  return `${cur} ${formatNumber(price)}`
}

/** Maps backend/display fuel values (accented, english, mild-hybrid…) to FuelTag keys. */
export function fuelToTagType(fuelType?: string | null): FuelTagType {
  const f = (fuelType || '').toLowerCase()
  if (f.includes('eléctr') || f.includes('electr')) return 'electrico'
  if (f.includes('híbr') || f.includes('hibr') || f.includes('hybrid')) return 'hibrido'
  if (f.includes('dié') || f.includes('die')) return 'diesel'
  return 'nafta'
}

const FUEL_LABELS: Record<FuelTagType, string> = {
  nafta: 'Nafta',
  electrico: 'Eléctrico',
  hibrido: 'Híbrido',
  diesel: 'Diésel',
}

export function fuelLabel(fuelType?: string | null): string {
  return FUEL_LABELS[fuelToTagType(fuelType)]
}

/** "12 jun 2026" — short es-UY date for blog/classified metadata. */
export function formatDate(iso: string | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })
}
