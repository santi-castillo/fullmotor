import type { AcauData, SalesMeta } from './types'
import acau from '@/data/buying-guide/acau-2026.json'

/** The ACAU sales dataset bundled with the build (regenerate with `npm run acau:import`). */
export const ACAU_DATA: AcauData = acau as AcauData

export const salesMeta: SalesMeta = {
  year: ACAU_DATA.year,
  monthsCovered: ACAU_DATA.monthsCovered,
  updatedAt: ACAU_DATA.updatedAt,
}
