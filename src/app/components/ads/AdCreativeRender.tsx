'use client'

import { recordAdEvent } from './ad-queue'
import type { ServedAd } from './types'

/**
 * Renders one creative according to its kind.
 *
 * Every outbound link carries `rel="sponsored nofollow noopener"`. Google has
 * required `sponsored` on paid links since 2019, and the penalty for getting it
 * wrong is a manual action against the organic traffic that is the only reason
 * this inventory is worth anything.
 */

interface Props {
  ad: ServedAd
}

/** The click goes through our own route so it still counts when the tracking
 *  script fails to load — the anchor href is the tracker, not an onClick. */
function clickHref(renderId: string): string {
  return `/api/promos/click/${encodeURIComponent(renderId)}`
}

export default function AdCreativeRender({ ad }: Props) {
  if (ad.kind === 'html') {
    // Third-party tags run inside a sandboxed iframe, never inline. Two
    // reasons, both load-bearing: an agency's JavaScript must not reach our
    // DOM or the reader's session, and a fixed-size iframe pins the layout no
    // matter what loads inside it, which is the only way to promise an
    // advertiser a slot without risking our own CLS.
    return (
      <iframe
        title={`Publicidad de ${ad.advertiserName}`}
        srcDoc={ad.htmlSnippet}
        width={ad.width}
        height={ad.height}
        loading="lazy"
        scrolling="no"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        style={{ border: 0, display: 'block', maxWidth: '100%' }}
      />
    )
  }

  if (ad.kind === 'native') {
    return (
      <a
        className="tm-promo__native"
        href={clickHref(ad.renderId)}
        target="_blank"
        rel="sponsored nofollow noopener"
        onClick={() => recordAdEvent(ad.renderId, 'click', window.location.pathname)}
      >
        {ad.nativeLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="tm-promo__native-logo" src={ad.nativeLogoUrl} alt="" width={40} height={40} loading="lazy" />
        ) : null}
        <span className="tm-promo__native-body">
          <strong className="tm-promo__native-title">{ad.nativeTitle}</strong>
          {ad.nativeBody ? <span className="tm-promo__native-text">{ad.nativeBody}</span> : null}
          {ad.nativeCta ? <span className="tm-promo__native-cta">{ad.nativeCta}</span> : null}
        </span>
      </a>
    )
  }

  return (
    <a
      href={clickHref(ad.renderId)}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={() => recordAdEvent(ad.renderId, 'click', window.location.pathname)}
    >
      {/* A plain <img>, not next/image, on purpose. next.config.ts allows four
          image hosts; routing advertiser creatives through the optimiser would
          mean adding arbitrary remote hosts, which turns it into an open proxy
          anyone can bill to this Vercel account. Explicit width and height
          still prevent any shift. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ad.imageUrl}
        alt={ad.imageAlt ?? `Publicidad de ${ad.advertiserName}`}
        width={ad.width}
        height={ad.height}
        loading="lazy"
        decoding="async"
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
      />
    </a>
  )
}
