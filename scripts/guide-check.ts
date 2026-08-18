/**
 * Guía de compra — sanity check against the live catalogue.
 *
 *   npm run guide:check              validate picks + print canned scenarios
 *   npm run guide:check -- --dump f  also write the slim index to f (JSON)
 *   npm run guide:check -- --quiet   only validation (exit 1 on issues)
 *
 * Env: NEXT_PUBLIC_API_URL (default https://api.todomotor.uy),
 *      NEXT_PUBLIC_COUNTRY (default uy).
 */

import { writeFileSync } from 'node:fs'
import type { Vehicle } from '../src/types/vehicle'
import type { AcauData, Answers, GuideVehicle } from '../src/lib/buying-guide/types'
import { attachSales } from '../src/lib/buying-guide/sales'
import acauJson from '../src/data/buying-guide/acau-2026.json'
import { toGuideVehicle } from '../src/lib/buying-guide/features'
import { resolveCurated } from '../src/lib/buying-guide/curated'
import { runGuide, countMatches, applyHardFilters } from '../src/lib/buying-guide/scoring'
import { PRICE_BANDS, USES } from '../src/lib/buying-guide/questions'
import { CURATED_PICKS } from '../src/data/buying-guide/picks'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.todomotor.uy'
const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'uy'

const args = process.argv.slice(2)
const quiet = args.includes('--quiet')
const dumpIdx = args.indexOf('--dump')
const dumpPath = dumpIdx >= 0 ? args[dumpIdx + 1] : undefined

interface ApiVehicle extends Omit<Vehicle, 'category' | 'fuelType'> { fuelType?: string }

const FUEL_ES: Record<string, string> = { gasoline: 'nafta', diesel: 'diesel', hybrid: 'híbrido', 'mild-hybrid': 'mild-hybrid', electric: 'eléctrico' }

async function fetchAll(): Promise<Vehicle[]> {
  const out: Vehicle[] = []
  let page = 1
  for (;;) {
    const res = await fetch(`${API}/api/vehicles?limit=100&page=${page}`, {
      headers: { 'X-Country': COUNTRY, 'X-Vehicle-Type': 'all', 'User-Agent': 'TodoMotor-guide-check/1.0' },
    })
    if (!res.ok) throw new Error(`API ${res.status} on page ${page}`)
    const json = (await res.json()) as { data: ApiVehicle[]; meta: { lastPage: number } }
    for (const v of json.data) {
      // Mirror src/lib/api.ts transformVehicle for the fields the guide reads.
      out.push({ ...(v as unknown as Vehicle), fuelType: v.fuelType ? FUEL_ES[v.fuelType] || v.fuelType : undefined })
    }
    if (page >= json.meta.lastPage) break
    page++
  }
  return out
}

function fmtVehicle(v: GuideVehicle): string {
  const sales = v.sold != null ? ` · ACAU ${v.sold} u. (#${v.soldRank})` : ' · ACAU —'
  return `${v.brand} ${v.model}${v.version ? ` ${v.version}` : ''} · USD ${v.price?.toLocaleString('es-UY') ?? '—'} · ${v.sub || '?'} · ${v.fuel ?? '?'}${v.manual ? ' · manual' : ''}${sales}`
}

const SCENARIOS: { name: string; a: Answers }[] = [
  { name: 'familia + 20k', a: { uso: 'familia', max: 20000 } },
  { name: 'familia + 30k + 5 pers + híbrido + seguridad', a: { uso: 'familia', max: 30000, pers: 5, motor: 'hibrido', prio: 'seguridad' } },
  { name: 'ciudad + 20k + eficiencia', a: { uso: 'ciudad', max: 20000, prio: 'eficiencia' } },
  { name: 'trabajo + diésel + manual', a: { uso: 'trabajo', motor: 'diesel', caja: 'manual' } },
  { name: 'ruta + eléctrico', a: { uso: 'ruta', motor: 'electrico' } },
  { name: 'deportivo + 70k', a: { uso: 'deportivo', max: 70000 } },
  { name: '7 personas + 25k (relajación esperada)', a: { pers: 7, max: 25000 } },
  { name: 'sin uso, 30k', a: { max: 30000 } },
  { name: 'nada', a: {} },
]

async function main() {
  const t0 = Date.now()
  const all = await fetchAll()
  const index = all.map(toGuideVehicle).filter((g): g is GuideVehicle => !!g)
  const acau = acauJson as AcauData
  const sales = attachSales(index, acau)
  console.log(`catálogo: ${all.length} vehículos, índice guía: ${index.length} (${Date.now() - t0} ms) · ACAU ${acau.year} hasta mes ${acau.monthsCovered}: ${sales.matched}/${sales.families} familias con ventas`)
  if (dumpPath) {
    writeFileSync(dumpPath, JSON.stringify(index), 'utf-8')
    console.log(`índice volcado en ${dumpPath} (${(JSON.stringify(index).length / 1024).toFixed(0)} KB)`)
  }

  // ---- data quality (informative)
  const missing = (f: (v: GuideVehicle) => unknown) => index.filter((v) => f(v) == null || f(v) === 0 || f(v) === '').length
  console.log(`sin precio ${missing((v) => v.price)} · sin carrocería ${missing((v) => v.sub)} · sin hp ${missing((v) => v.hp)} · sin largo ${missing((v) => v.len)} · sin baúl ${missing((v) => v.trunk)} · airbags=0 ${missing((v) => v.airbags)} · sin combustible ${index.filter((v) => !v.fuel).length} · manual ${index.filter((v) => v.manual).length}`)

  // ---- curated validation
  const { picks, issues } = resolveCurated(index, CURATED_PICKS)
  console.log(`\npicks curados válidos: ${picks.length} · problemas: ${issues.length}`)
  for (const i of issues) console.log(`  ✗ ${i.use}/${i.band} ${i.slug}: ${i.problem}`)
  const coverage: string[] = []
  for (const u of USES) for (const b of PRICE_BANDS) {
    const n = picks.filter((p) => p.use === u.value && p.band === b.id).length
    const avail = countMatches(index, { uso: u.value, max: b.max === Infinity ? undefined : b.max }).families
    coverage.push(`${u.value}/${b.id}: ${n} picks (${avail} familias disponibles)`)
  }
  console.log('cobertura por nodo:\n  ' + coverage.join('\n  '))
  const thin = coverage.filter((c) => /: [0-2] picks/.test(c)).length
  if (thin) console.log(`  → ${thin} nodos con menos de 3 picks (se rellenan con datos)`)

  // Informative: best-selling models of each node that the curated tree leaves out.
  console.log('\nmás vendidos (ACAU) que no están en el top de su nodo (informativo):')
  let lo = 0
  for (const b of PRICE_BANDS) {
    for (const u of USES) {
      const inBand = index.filter((v) => v.price != null && v.price > lo && v.price <= b.max)
      const C = applyHardFilters(inBand, { uso: u.value })
      const fams = new Map<string, GuideVehicle>()
      for (const v of C) if (!fams.has(v.family)) fams.set(v.family, v)
      const nodePicks = new Set(picks.filter((p) => p.use === u.value && p.band === b.id).map((p) => p.family))
      const top = Array.from(fams.values()).filter((v) => v.sold != null && v.sold >= 100).sort((x, y) => (y.sold! - x.sold!)).slice(0, 5)
      const missing = top.filter((v) => !nodePicks.has(v.family))
      if (missing.length) console.log(`  ${u.value}/${b.id}: ${missing.map((v) => `${v.brand} ${v.model} (${v.sold} u.)`).join(', ')}`)
    }
    lo = b.max
  }

  if (quiet) {
    process.exit(issues.length ? 1 : 0)
  }

  // ---- scenarios
  for (const s of SCENARIOS) {
    const r = runGuide(index, picks, s.a, { salesYear: acau.year })
    console.log(`\n=== ${s.name} — estricto: ${r.strictCount} vehículos / ${r.strictFamilies} familias${r.notes.length ? ` · relajado: ${r.notes.join('; ')}` : ''}`)
    r.podium.forEach((p, i) => {
      console.log(`  #${i + 1} [${p.source}${p.relaxedTag ? ` · ${p.relaxedTag}` : ''}] ${fmtVehicle(p.vehicle)} · score ${p.score}`)
      console.log(`      ${p.reasons.join(' | ')}`)
    })
    console.log(`  otros: ${r.others.slice(0, 5).map((o) => `${o.best.v.brand} ${o.best.v.model} (${o.best.score})`).join(', ')}${r.others.length > 5 ? ` … +${r.others.length - 5}` : ''}`)
  }
  process.exit(issues.length ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(2) })
