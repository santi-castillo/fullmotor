import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy for impression and click events.
 *
 * Always answers 202. The caller is a `sendBeacon` fired during pagehide and
 * can do nothing with an error; failing loudly here would only mean the
 * browser retries a request whose document no longer exists.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    await fetch(`${API_URL}/api/ads/events`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        // The bot filter and the referrer check both live upstream, so the
        // real client's headers have to survive the hop.
        'User-Agent': request.headers.get('user-agent') ?? '',
        'X-Forwarded-For':
          request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '',
        Referer: request.headers.get('referer') ?? '',
      },
    })
  } catch {
    // Swallowed on purpose: see above.
  }

  return new NextResponse(null, { status: 202 })
}
