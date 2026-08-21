'use client'

import { useEffect, useRef } from 'react'
import { recordAdEvent, noteSeen } from './ad-queue'
import type { ServedAd } from './types'

/**
 * Counts one viewable impression per render, following the MRC display
 * standard: at least 50% of the creative visible for one continuous second.
 *
 * Three details carry the whole thing:
 *
 *   - `observer.disconnect()` once the impression fires. Two of our best slots
 *     (`inv_sidebar`, `detail_panel`) are sticky, so they cross the 50%
 *     threshold dozens of times as the reader scrolls. Without the disconnect
 *     a single ad would bill an advertiser for a scroll.
 *   - The timer is cancelled when the slot drops back below half visible, so
 *     scrolling straight past an ad is not an impression.
 *   - A hidden tab never starts the timer. A slot in a background tab is
 *     technically in the viewport and categorically not viewable.
 */

const VIEWABLE_RATIO = 0.5
const VIEWABLE_MS = 1000

export function useAdImpression(ad: ServedAd | null, ref: React.RefObject<HTMLElement | null>) {
  const firedRef = useRef(false)

  useEffect(() => {
    firedRef.current = false
  }, [ad?.renderId])

  useEffect(() => {
    const el = ref.current
    if (!ad || !el) return
    if (typeof IntersectionObserver === 'undefined') return

    let timer: ReturnType<typeof setTimeout> | null = null

    const cancel = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        const visible =
          entry.isIntersecting &&
          entry.intersectionRatio >= VIEWABLE_RATIO &&
          document.visibilityState === 'visible'

        if (!visible) {
          cancel()
          return
        }
        if (timer || firedRef.current) return

        timer = setTimeout(() => {
          if (firedRef.current) return
          firedRef.current = true
          recordAdEvent(ad.renderId, 'impression', window.location.pathname)
          noteSeen(ad.creativeId)
          // One impression per render, permanently. This is the line that
          // keeps a sticky slot honest.
          observer.disconnect()
        }, VIEWABLE_MS)
      },
      { threshold: [0, VIEWABLE_RATIO, 1] }
    )

    observer.observe(el)

    // Tabbing away mid-count should not complete an impression.
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') cancel()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancel()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ad, ref])
}
