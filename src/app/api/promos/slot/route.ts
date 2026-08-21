import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy for the ad server's serve endpoint.
 *
 * Same origin, and named `promos` rather than `ads`, because EasyList drops
 * requests whose path contains `/ads/` on a large share of desktop browsers.
 * The Go route is genuinely /api/ads/serve; the browser just never asks for it
 * by that name.
 *
 * It also forwards the real client IP and User-Agent. Without them the ad
 * server sees Vercel's edge for every request and its bot filter is blind.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams
  const params = new URLSearchParams(incoming)
  if (!params.has('country')) {
    params.set('country', process.env.NEXT_PUBLIC_COUNTRY || 'uy')
  }

  try {
    const upstream = await fetch(`${API_URL}/api/ads/serve?${params.toString()}`, {
      cache: 'no-store',
      headers: {
        'User-Agent': request.headers.get('user-agent') ?? '',
        'X-Forwarded-For':
          request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '',
        Referer: request.headers.get('referer') ?? '',
      },
    })

    if (upstream.status === 204) {
      return new NextResponse(null, { status: 204 })
    }
    if (!upstream.ok) {
      // An unfilled slot, not an error the page has to handle.
      return new NextResponse(null, { status: 204 })
    }

    const body = await upstream.json()
    return NextResponse.json(body, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}
