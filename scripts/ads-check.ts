/**
 * Guards the placement catalogue against drift.
 *
 * The catalogue exists twice on purpose: in Go, where the ad server validates
 * creatives against it, and in TypeScript, where the slot has to reserve its
 * height *before* the fetch that would tell it the size. That reservation is
 * the only thing standing between an ad slot and a layout shift, so it cannot
 * wait for the response.
 *
 * Two copies means they can disagree, and the failure is quiet: we reserve
 * 250px, serve a 600px half-page, and the page jumps for every visitor. This
 * script is what turns that into a build failure instead.
 *
 * Run: npm run ads:check   (needs the API reachable at NEXT_PUBLIC_API_URL)
 */

import { PLACEMENTS } from '../src/app/components/ads/placements'

interface ApiPlacement {
  code: string
  label: string
  widthDesktop: number
  heightDesktop: number
  widthMobile: number
  heightMobile: number
  allowedKinds: string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function main() {
  let remote: ApiPlacement[]
  try {
    const res = await fetch(`${API_URL}/api/ads/placements`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body = (await res.json()) as { data: ApiPlacement[] }
    remote = body.data
  } catch (err) {
    console.error(`[ads:check] No se pudo consultar ${API_URL}/api/ads/placements`)
    console.error(`[ads:check] ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
    return
  }

  const problems: string[] = []
  const remoteByCode = new Map(remote.map((p) => [p.code, p]))
  const localCodes = Object.keys(PLACEMENTS)

  for (const code of localCodes) {
    const api = remoteByCode.get(code)
    if (!api) {
      problems.push(`"${code}" existe en el front pero no en el catálogo de la API`)
      continue
    }
    const local = PLACEMENTS[code as keyof typeof PLACEMENTS]
    const pairs: [string, [number, number], [number, number]][] = [
      ['desktop', local.desktop as unknown as [number, number], [api.widthDesktop, api.heightDesktop]],
      ['mobile', local.mobile as unknown as [number, number], [api.widthMobile, api.heightMobile]],
    ]
    for (const [device, [lw, lh], [rw, rh]] of pairs) {
      if (lw !== rw || lh !== rh) {
        problems.push(
          `"${code}" ${device}: el front reserva ${lw}x${lh} y la API sirve ${rw}x${rh}`
        )
      }
    }
  }

  for (const api of remote) {
    if (!localCodes.includes(api.code)) {
      problems.push(
        `"${api.code}" existe en la API pero ningún componente lo renderiza — es inventario que se podría vender y nunca mostrar`
      )
    }
  }

  if (problems.length > 0) {
    console.error('[ads:check] El catálogo de espacios publicitarios está desincronizado:\n')
    for (const p of problems) console.error(`  · ${p}`)
    console.error('\nSincronizá internal/ads/placements.go con src/app/components/ads/placements.ts.')
    process.exit(1)
  }

  console.log(`[ads:check] OK — ${localCodes.length} espacios sincronizados con la API.`)
}

main()
