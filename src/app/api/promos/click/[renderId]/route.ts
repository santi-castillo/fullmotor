import { NextRequest, NextResponse } from 'next/server'

/**
 * Click tracker.
 *
 * This is the anchor's href, not an onClick handler, so a click still records
 * and still lands on the advertiser when the tracking script is blocked or
 * fails to load.
 *
 * Redirects are 302 and never 301: a permanent redirect gets cached by the
 * browser, and every click after the first would skip the server entirely and
 * go uncounted — the advertiser would see their traffic collapse after day one.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, context: { params: Promise<{ renderId: string }> }) {
  const { renderId } = await context.params

  try {
    const upstream = await fetch(
      `${API_URL}/api/ads/click/${encodeURIComponent(renderId)}`,
      {
        redirect: 'manual',
        cache: 'no-store',
        headers: {
          'User-Agent': request.headers.get('user-agent') ?? '',
          'X-Forwarded-For':
            request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '',
          Referer: request.headers.get('referer') ?? '',
        },
      }
    )

    const destination = upstream.headers.get('location')
    if (destination) {
      return NextResponse.redirect(destination, {
        status: 302,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      })
    }
  } catch {
    // Fall through to the home page rather than showing an error: the reader
    // clicked something and deserves to land somewhere.
  }

  return NextResponse.redirect(new URL('/', request.url), { status: 302 })
}
