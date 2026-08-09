interface AvatarProps {
  src?: string | null
  /** Used for the alt text and to derive the initial when there is no image. */
  name: string
  size?: 'sm' | 'md' | 'lg'
  /** Fallback circle colour. `accent` reads as "this is you". */
  tone?: 'sunken' | 'accent' | 'accent-soft'
  className?: string
}

const SIZES = {
  sm: { box: 'w-8 h-8', text: 'text-xs' },
  md: { box: 'w-10 h-10', text: 'text-sm' },
  lg: { box: 'w-12 h-12', text: 'text-lg' },
} as const

const TONES = {
  sunken: 'bg-sunken text-muted',
  accent: 'bg-accent text-white',
  'accent-soft': 'bg-accent-soft text-accent-ink',
} as const

/**
 * A user or business avatar, with an initial as the fallback.
 *
 * This was inlined in three places with three slightly different fallbacks, and
 * the dealership work adds two more uses. `referrerPolicy="no-referrer"` is not
 * optional: Google profile images 403 when a referrer is sent, which is why
 * these are plain `<img>` rather than `next/image` — the host is also not in
 * next.config's remotePatterns.
 */
export function Avatar({ src, name, size = 'sm', tone = 'sunken', className = '' }: AvatarProps) {
  const { box, text } = SIZES[size]
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || '?'

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={`${box} rounded-full object-cover flex-shrink-0 ${className}`}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`${box} ${text} ${TONES[tone]} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
    >
      {initial}
    </div>
  )
}
