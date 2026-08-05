import { SITE_URL, absoluteUrl } from './site'

/**
 * IndexNow lets us push newly published URLs to search engines instead of
 * waiting for them to re-crawl the sitemap. Bing, Yandex, Naver and Seznam
 * participate; Google does not, so this complements the sitemap, it does not
 * replace it.
 *
 * https://www.indexnow.org/documentation
 */
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

/**
 * The key file sits at the root directory, so its scope covers every URL on
 * the host. Moving it into a subfolder would silently limit what we may submit.
 */
export const INDEXNOW_KEY_PATH = '/indexnow-key.txt'

export function getIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim()
  return key || null
}

export type IndexNowResult =
  | { submitted: false; reason: string }
  | { submitted: true; status: number; urls: string[] }

function sameHostOnly(urls: string[], host: string) {
  const valid: string[] = []
  const invalid: string[] = []

  for (const url of urls) {
    try {
      if (new URL(url).host === host) valid.push(url)
      else invalid.push(url)
    } catch {
      invalid.push(url)
    }
  }

  return { valid, invalid }
}

/**
 * Submits absolute URLs. Returns a result object rather than throwing — a
 * failed ping must never break the publish flow that triggered it.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = getIndexNowKey()
  if (!key) return { submitted: false, reason: 'INDEXNOW_KEY is not set' }

  const host = new URL(SITE_URL).host
  const { valid, invalid } = sameHostOnly([...new Set(urls)], host)

  if (invalid.length > 0) {
    // The API rejects the whole batch with 422 if any URL is off-host.
    console.warn(`[indexnow] skipping ${invalid.length} URL(s) not on ${host}:`, invalid)
  }
  if (valid.length === 0) return { submitted: false, reason: 'no valid URLs for this host' }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: absoluteUrl(INDEXNOW_KEY_PATH),
        urlList: valid,
      }),
      cache: 'no-store',
    })

    // 200 = accepted, 202 = accepted while the key is still being validated.
    if (!response.ok && response.status !== 202) {
      console.error(`[indexnow] rejected with ${response.status}:`, await response.text())
    }

    return { submitted: true, status: response.status, urls: valid }
  } catch (error) {
    console.error('[indexnow] request failed:', error)
    return { submitted: false, reason: error instanceof Error ? error.message : 'request failed' }
  }
}

/** Pings a set of blog slugs plus the listing page, which also changed. */
export function submitBlogPosts(slugs: string[]): Promise<IndexNowResult> {
  return submitToIndexNow([
    absoluteUrl('/blog'),
    ...slugs.map(slug => absoluteUrl(`/blog/${slug}`)),
  ])
}
