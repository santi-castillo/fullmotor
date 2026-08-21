'use client'

import type { AdEvent, AdEventKind } from './types'

/**
 * Batches ad events and flushes them with sendBeacon.
 *
 * Two things make this worth having over a fetch per impression:
 *
 *   - A page with four slots would otherwise fire four requests within a
 *     second of each other, on the critical path of a page the reader is
 *     still loading.
 *   - A `fetch` started during `unload` is cancelled when the document goes
 *     away, so the last impressions of every visit — the ones on the page
 *     somebody actually read — were the ones most likely to be lost.
 *     `sendBeacon` is queued by the browser and survives the navigation.
 */

const FLUSH_DELAY_MS = 5000
const ENDPOINT = '/api/promos/events'

let queue: AdEvent[] = []
let timer: ReturnType<typeof setTimeout> | null = null
let listenersBound = false

/** Local guard against queueing the same event twice within one page view.
 *  The server dedupes as well, on a unique index; this just avoids the round
 *  trip. */
const queued = new Set<string>()

function flush() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (queue.length === 0) return

  const payload = JSON.stringify({ events: queue })
  queue = []

  // Blob rather than a bare string: without an explicit type sendBeacon sends
  // text/plain, which Fiber's BodyParser will not read as JSON.
  const blob = new Blob([payload], { type: 'application/json' })

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    if (navigator.sendBeacon(ENDPOINT, blob)) return
  }

  // Fallback for browsers without sendBeacon, or when the beacon queue is
  // full. keepalive gives it the same survive-the-navigation behaviour.
  fetch(ENDPOINT, { method: 'POST', body: blob, keepalive: true }).catch(() => {
    // An ad event that fails to record is not worth surfacing to the reader.
  })
}

function bindLifecycleListeners() {
  if (listenersBound || typeof document === 'undefined') return
  listenersBound = true

  // pagehide rather than unload: it fires for bfcache navigations too, which
  // `unload` does not, and iOS Safari never fires `unload` at all.
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
}

export function recordAdEvent(renderId: string, kind: AdEventKind, pagePath?: string) {
  const key = `${renderId}:${kind}`
  if (queued.has(key)) return
  queued.add(key)

  queue.push({ renderId, kind, pagePath })
  bindLifecycleListeners()

  if (!timer) timer = setTimeout(flush, FLUSH_DELAY_MS)
}

/* -------------------------------------------------------------------------
 * Frequency cap counters
 *
 * Client-side and therefore only a courtesy: someone who clears storage sees
 * the ad again. It is never a billing control, which is why the server treats
 * the counts as a hint and not as truth.
 * ---------------------------------------------------------------------- */

const SEEN_KEY = 'tm_promo_seen'

interface SeenState {
  day: string
  counts: Record<string, number>
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function readSeen(): SeenState {
  const empty = { day: today(), counts: {} }
  if (typeof localStorage === 'undefined') return empty
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as SeenState
    // Counters are per day, so a stale day starts over rather than capping
    // someone out on yesterday's impressions.
    if (parsed.day !== empty.day) return empty
    return { day: parsed.day, counts: parsed.counts ?? {} }
  } catch {
    return empty
  }
}

/** Serialised as `creativeId:count,creativeId:count` for the serve query. */
export function seenParam(): string {
  const { counts } = readSeen()
  return Object.entries(counts)
    .map(([id, n]) => `${id}:${n}`)
    .join(',')
}

export function noteSeen(creativeId: string) {
  if (typeof localStorage === 'undefined') return
  try {
    const state = readSeen()
    state.counts[creativeId] = (state.counts[creativeId] ?? 0) + 1
    localStorage.setItem(SEEN_KEY, JSON.stringify(state))
  } catch {
    // Private mode, or storage full. The cap is best-effort by design.
  }
}
