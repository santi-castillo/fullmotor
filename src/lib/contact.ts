/**
 * Making sense of the free-text contact field on a classified.
 *
 * Sellers are asked for a "teléfono, WhatsApp o email" and get one text box, so
 * the value can be any of those. The detail page used to assume a phone and
 * render `tel:` unconditionally, producing links like `tel:ventas@ejemplo.com`
 * — dead on desktop, and opening the dialer with an address on mobile.
 */

export type ContactKind = 'phone' | 'email' | 'other'

export interface ParsedContact {
  kind: ContactKind
  /** Always the seller's own text; we never rewrite what is shown. */
  display: string
  /** `tel:` or `mailto:` target. Absent when the value is neither. */
  href?: string
  /** wa.me target, only when the number can be resolved internationally. */
  whatsappHref?: string
}

/** Dial codes for the countries this runs in, keyed by NEXT_PUBLIC_COUNTRY. */
const DIAL_CODES: Record<string, string> = {
  uy: '598',
  ar: '54',
  cl: '56',
  br: '55',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Strips the punctuation people type in phone numbers: spaces, dashes, dots,
 * parentheses and non-breaking spaces.
 */
function stripPhonePunctuation(value: string): string {
  return value.replace(/[\s.\-() ]/g, '')
}

function isPhoneLike(compact: string): boolean {
  if (!/^\+?\d+$/.test(compact)) return false
  const digits = compact.replace(/\D/g, '')
  // Short enough to be an extension, long enough to be an E.164 number.
  return digits.length >= 6 && digits.length <= 15
}

/**
 * Best-effort E.164 digits for wa.me, which accepts no punctuation and no
 * leading plus. Returns null when the number cannot be resolved confidently —
 * better no WhatsApp button than one that opens a chat with a stranger.
 */
export function toWhatsappNumber(value: string, country = 'uy'): string | null {
  const compact = stripPhonePunctuation(value)
  if (!isPhoneLike(compact)) return null

  const dial = DIAL_CODES[country.toLowerCase()]
  if (!dial) return null

  // Already international, either +598… or 00598…
  if (compact.startsWith('+')) return compact.slice(1)
  if (compact.startsWith('00')) return compact.slice(2)
  if (compact.startsWith(dial)) return compact

  // National format: a trunk 0 stands in for the country code.
  const national = compact.startsWith('0') ? compact.slice(1) : compact
  if (national.length < 6) return null

  return dial + national
}

export function parseContact(value: string, country = 'uy'): ParsedContact {
  const display = value.trim()

  if (EMAIL_RE.test(display)) {
    return { kind: 'email', display, href: `mailto:${display}` }
  }

  const compact = stripPhonePunctuation(display)
  if (isPhoneLike(compact)) {
    const wa = toWhatsappNumber(display, country)
    return {
      kind: 'phone',
      display,
      href: `tel:${compact}`,
      ...(wa ? { whatsappHref: `https://wa.me/${wa}` } : {}),
    }
  }

  // An Instagram handle, a name, an address — show it, but do not guess a
  // protocol for it.
  return { kind: 'other', display }
}
