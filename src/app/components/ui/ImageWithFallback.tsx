'use client'

import { useState, type ReactNode } from 'react'
import Image, { type ImageProps } from 'next/image'
import { GaugePlaceholder } from './ImagePlaceholder'

interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null
  /** Class applied to the placeholder, not the image. */
  fallbackClassName?: string
  /** Overrides the gauge — a newspaper reads better on an article card. */
  fallback?: ReactNode
}

/**
 * next/image that degrades to the gauge placeholder.
 *
 * Cards previously only checked whether a URL was present, so a broken, expired
 * or 403 image rendered as a broken image rather than the placeholder — with
 * 39% of the catalogue lacking photos, that gap is visible.
 *
 * It also covers hosts missing from next.config's remotePatterns, which
 * otherwise throw at runtime instead of falling back.
 */
export function ImageWithFallback({ src, fallbackClassName, fallback, alt, ...props }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <>{fallback ?? <GaugePlaceholder className={fallbackClassName} />}</>
  }

  return <Image {...props} src={src} alt={alt} onError={() => setFailed(true)} />
}

interface RawImageWithFallbackProps {
  src?: string | null
  alt: string
  fallback: ReactNode
  className?: string
}

/**
 * Same idea over a plain <img>, for user-uploaded images.
 *
 * Classified photos come from arbitrary hosts that are not in next.config's
 * remotePatterns, so next/image would throw on them instead of rendering.
 */
export function RawImageWithFallback({ src, alt, fallback, className }: RawImageWithFallbackProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <>{fallback}</>
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
}
