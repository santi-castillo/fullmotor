import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * On-demand ISR invalidation, called by the API after it writes a vehicle.
 *
 * Every vehicle fetch uses `next: { revalidate: 60 }`, so an edit could take up
 * to a minute to show up — which is what made image uploads look like they had
 * silently failed, and pushed people into re-uploading and creating duplicates.
 * The API itself is consistent; the delay was always this cache.
 *
 *   curl -X POST https://todomotor.uy/api/revalidate \
 *     -H "x-api-key: $REVALIDATE_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"slugs":["uy-fiat-pulse-2026-audace"]}'
 */
export async function POST(request: Request) {
  const validSecret = process.env.REVALIDATE_SECRET

  if (!validSecret) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  if (request.headers.get('x-api-key') !== validSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { slugs?: unknown; paths?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const slugs = Array.isArray(body.slugs)
    ? body.slugs.filter((s): s is string => typeof s === 'string')
    : []
  const extraPaths = Array.isArray(body.paths)
    ? body.paths.filter((p): p is string => typeof p === 'string')
    : []

  const paths = [
    // The home carousel and the inventory listing both change whenever any
    // vehicle does, so they are always refreshed.
    '/',
    ...slugs.map(slug => `/vehiculo/${slug}`),
    ...extraPaths,
  ]

  const revalidated: string[] = []
  const failed: { path: string; error: string }[] = []

  for (const path of paths) {
    try {
      revalidatePath(path)
      revalidated.push(path)
    } catch (error) {
      failed.push({ path, error: error instanceof Error ? error.message : 'unknown' })
    }
  }

  return NextResponse.json(
    { revalidated, ...(failed.length > 0 && { failed }) },
    { status: failed.length > 0 ? 207 : 200 }
  )
}
