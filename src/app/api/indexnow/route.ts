import { NextResponse } from 'next/server'
import { submitToIndexNow, submitBlogPosts } from '@/lib/indexnow'
import { absoluteUrl } from '@/lib/site'

/**
 * Call this right after publishing so search engines are notified instead of
 * waiting for the next sitemap crawl:
 *
 *   curl -X POST https://todomotor.uy/api/indexnow \
 *     -H "x-api-key: $INDEXNOW_TRIGGER_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"slugs":["mi-articulo-nuevo"]}'
 *
 * Accepts `slugs` (blog articles) and/or `urls` (any path or absolute URL).
 */
export async function POST(request: Request) {
  const validSecret = process.env.INDEXNOW_TRIGGER_SECRET

  if (!validSecret) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  // Authenticated because an open endpoint would let anyone burn through the
  // rate limit on our key and get it throttled.
  if (request.headers.get('x-api-key') !== validSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { slugs?: unknown; urls?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const slugs = Array.isArray(body.slugs) ? body.slugs.filter((s): s is string => typeof s === 'string') : []
  const urls = Array.isArray(body.urls) ? body.urls.filter((u): u is string => typeof u === 'string') : []

  if (slugs.length === 0 && urls.length === 0) {
    return NextResponse.json({ error: 'Provide "slugs" and/or "urls"' }, { status: 400 })
  }

  const result = slugs.length > 0 && urls.length === 0
    ? await submitBlogPosts(slugs)
    : await submitToIndexNow([
        ...slugs.map(slug => absoluteUrl(`/blog/${slug}`)),
        ...urls.map(url => (url.startsWith('http') ? url : absoluteUrl(url))),
        ...(slugs.length > 0 ? [absoluteUrl('/blog')] : []),
      ])

  if (!result.submitted) {
    return NextResponse.json(result, { status: 400 })
  }

  // `submitted` only means the request completed — surface IndexNow's own
  // verdict so a 403 (bad key) doesn't look like a success to the caller.
  const accepted = result.status === 200 || result.status === 202
  return NextResponse.json(result, { status: accepted ? 200 : 502 })
}
