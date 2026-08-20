/**
 * Guía de compra — fichas sin imagen.
 *
 *   npm run guide:images                 resumen + listado priorizado
 *   npm run guide:images -- --json f     además vuelca el detalle a f (JSON)
 *
 * Recorre el catálogo vivo, arma el índice de la guía y simula el wizard sobre
 * todo el espacio de respuestas (uso × presupuesto × personas × motor × caja ×
 * prioridad). Para cada ficha cuenta en cuántos escenarios aparece:
 *
 *   top    → podio curado ("Top TodoMotor", src/data/buying-guide/picks.ts)
 *   data   → podio completado por el ranking por reglas
 *   otros  → "otros que también encajan"
 *
 * Después se queda con las que no tienen imagen y las agrupa por modelFamilyId,
 * que es la unidad de trabajo real: una hero por modelo se reutiliza en todas
 * sus versiones (ver el paso "Cargar IMÁGENES" de la routine diaria).
 *
 * Env: NEXT_PUBLIC_API_URL (default https://api.todomotor.uy),
 *      NEXT_PUBLIC_COUNTRY (default uy).
 */

import { writeFileSync } from 'node:fs'
import type { Vehicle } from '../src/types/vehicle'
import type { Answers, GuideFuel, GuideGearbox, GuidePers, GuidePriority, GuideUse, GuideVehicle } from '../src/lib/buying-guide/types'
import { toGuideVehicle } from '../src/lib/buying-guide/features'
import { resolveCurated } from '../src/lib/buying-guide/curated'
import { runGuide } from '../src/lib/buying-guide/scoring'
import { attachSales } from '../src/lib/buying-guide/sales'
import acauJson from '../src/data/buying-guide/acau-2026.json'
import { CURATED_PICKS } from '../src/data/buying-guide/picks'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.todomotor.uy'
const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'uy'
const args = process.argv.slice(2)
const jsonIdx = args.indexOf('--json')
const jsonPath = jsonIdx >= 0 ? args[jsonIdx + 1] : undefined

const FUEL_ES: Record<string, string> = { gasoline: 'nafta', diesel: 'diesel', hybrid: 'híbrido', 'mild-hybrid': 'mild-hybrid', electric: 'eléctrico' }

type ApiVehicle = Omit<Vehicle, 'category' | 'fuelType' | 'images'> & { fuelType?: string; images?: string[] }

async function fetchAll(): Promise<ApiVehicle[]> {
  const out: ApiVehicle[] = []
  let page = 1
  for (;;) {
    const res = await fetch(`${API}/api/vehicles?limit=100&page=${page}`, {
      headers: { 'X-Country': COUNTRY, 'X-Vehicle-Type': 'all', 'User-Agent': 'TodoMotor-guide-images/1.0' },
    })
    if (!res.ok) throw new Error(`API ${res.status} on page ${page}`)
    const json = (await res.json()) as { data: ApiVehicle[]; meta: { lastPage: number } }
    out.push(...json.data)
    if (page >= json.meta.lastPage) break
    page++
  }
  return out
}

const USOS: (GuideUse | undefined)[] = [undefined, 'familia', 'ciudad', 'trabajo', 'ruta', 'deportivo']
const MAXES: (number | undefined)[] = [undefined, 20000, 30000, 45000, 70000]
const PERSS: (GuidePers | undefined)[] = [undefined, 2, 4, 5, 7]
const MOTORS: (GuideFuel | undefined)[] = [undefined, 'nafta', 'diesel', 'hibrido', 'electrico']
const CAJAS: (GuideGearbox | undefined)[] = [undefined, 'auto', 'manual']
const PRIOS: (GuidePriority | undefined)[] = [undefined, 'precio', 'espacio', 'potencia', 'equipamiento', 'seguridad', 'eficiencia']

interface Hit { top: number; data: number; otros: number }

async function main() {
  const raw = await fetchAll()
  const bySlug = new Map(raw.map((v) => [v.slug, v]))
  const index: GuideVehicle[] = []
  for (const v of raw) {
    const g = toGuideVehicle({ ...(v as unknown as Vehicle), fuelType: v.fuelType ? FUEL_ES[v.fuelType] || v.fuelType : undefined })
    if (g) index.push(g)
  }
  attachSales(index, acauJson as never)
  const { picks, issues } = resolveCurated(index, CURATED_PICKS)
  for (const i of issues) console.log(`  ✗ pick descartado ${i.use}/${i.band} ${i.slug}: ${i.problem}`)

  const hits = new Map<string, Hit>()
  const bump = (slug: string, k: keyof Hit) => {
    const h = hits.get(slug) || { top: 0, data: 0, otros: 0 }
    h[k]++
    hits.set(slug, h)
  }
  let runs = 0
  for (const uso of USOS) for (const max of MAXES) for (const pers of PERSS) for (const motor of MOTORS) for (const caja of CAJAS) for (const prio of PRIOS) {
    const r = runGuide(index, picks, { uso, max, pers, motor, caja, prio } as Answers, { salesYear: (acauJson as { year: number }).year })
    runs++
    for (const p of r.podium) bump(p.vehicle.slug, p.source === 'top' ? 'top' : 'data')
    for (const o of r.others) bump(o.best.v.slug, 'otros')
  }

  const curatedSlugs = new Map<string, string[]>()
  for (const p of picks) curatedSlugs.set(p.slug, [...(curatedSlugs.get(p.slug) || []), `${p.use}/${p.band}#${p.rank + 1}`])

  interface Fam { family: string; brand: string; model: string; fichas: { slug: string; version?: string; id?: string; price?: number }[]; top: number; data: number; otros: number; curated: string[] }
  const fams = new Map<string, Fam>()
  for (const [slug, h] of hits) {
    const v = bySlug.get(slug)
    if (!v || (v.images && v.images.length)) continue
    const family = v.modelFamilyId || slug
    const f = fams.get(family) || { family, brand: v.brand, model: v.model, fichas: [], top: 0, data: 0, otros: 0, curated: [] }
    f.fichas.push({ slug, version: v.version, id: v.id, price: v.price })
    f.top += h.top; f.data += h.data; f.otros += h.otros
    f.curated.push(...(curatedSlugs.get(slug) || []))
    fams.set(family, f)
  }
  const list = [...fams.values()].sort((a, b) => (b.top * 3 + b.data + b.otros * 0.2) - (a.top * 3 + a.data + a.otros * 0.2))
  const fichas = list.reduce((n, f) => n + f.fichas.length, 0)

  console.log(`\níndice de la guía: ${index.length} fichas de ${raw.length} del catálogo`)
  console.log(`escenarios simulados: ${runs} · fichas alcanzables: ${hits.size}`)
  console.log(`picks curados válidos: ${picks.length} de ${CURATED_PICKS.reduce((n, x) => n + x.picks.length, 0)}`)
  console.log(`\nSIN IMAGEN: ${fichas} fichas en ${list.length} familias (${list.filter((f) => f.curated.length).length} con picks curados)\n`)
  for (const f of list) {
    const tag = f.curated.length ? `TOP ${f.curated.join(',')} ` : ''
    console.log(`${tag}${f.brand} ${f.model} (${f.family}) · ${f.fichas.length} fichas · top:${f.top} data:${f.data} otros:${f.otros}`)
  }
  if (jsonPath) {
    writeFileSync(jsonPath, JSON.stringify(list, null, 2))
    console.log(`\ndetalle → ${jsonPath}`)
  }
}

main()
