import { getIndexNowKey } from '@/lib/indexnow'

/**
 * IndexNow proves ownership by fetching this file and checking that its
 * contents match the key sent in the payload. It must stay publicly readable.
 */
// Read at request time, not build time, so rotating the key only needs an env
// change rather than a redeploy.
export const dynamic = 'force-dynamic'

export function GET() {
  const key = getIndexNowKey()

  if (!key) {
    return new Response('IndexNow key not configured', { status: 404 })
  }

  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
