'use client'

import { useCallback, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { readConsent, writeConsent, CONSENT_EVENT, type ConsentValue } from '@/lib/consent'

/**
 * Cookie consent banner.
 *
 * Two buttons of equal visual weight, on purpose. A banner whose only real
 * action is "Aceptar" — or that buries "Rechazar" behind a second screen — does
 * not collect freely given consent, which is what Ley 18.331 asks for. The
 * cheap dark pattern would also be the one that voids the consent we are
 * collecting, so it buys nothing.
 *
 * Rejecting does not break the site: Vercel Analytics keeps counting pageviews
 * (it sets no cookie) and our own contextual ads keep serving. Only GA4 and any
 * third-party tag stay switched off.
 */

/** Distinguishes "rendered on the server, cookie unknown" from "read on the
 *  client, no choice made yet". Without it the banner would render into the
 *  SSR HTML and flash at people who already decided. */
const UNKNOWN = 'unknown'

type ConsentSnapshot = ConsentValue | null | typeof UNKNOWN

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange)
  return () => window.removeEventListener(CONSENT_EVENT, onChange)
}

export default function ConsentBanner() {
  // useSyncExternalStore rather than reading the cookie into state from an
  // effect: the server snapshot keeps the first client render identical to the
  // SSR output, so there is no hydration mismatch and no setState-in-effect.
  const consent = useSyncExternalStore<ConsentSnapshot>(
    subscribe,
    () => readConsent(),
    () => UNKNOWN
  )

  const decide = useCallback((value: ConsentValue) => {
    // writeConsent dispatches CONSENT_EVENT, which is what re-renders this
    // component and hides the banner.
    writeConsent(value)
  }, [])

  if (consent !== null) return null

  return (
    <div className="tm-consent" role="dialog" aria-live="polite" aria-label="Consentimiento de cookies">
      <div className="tm-consent__in">
        <p className="tm-consent__text">
          Usamos cookies de <strong>Google Analytics</strong> para medir cuánta gente visita el sitio y qué
          secciones lee. No las usamos para armar un perfil tuyo ni para publicidad personalizada.{' '}
          <Link href="/privacidad">Cómo tratamos tus datos</Link>.
        </p>
        <div className="tm-consent__actions">
          <button type="button" className="tm-btn tm-btn--secondary tm-btn--md" onClick={() => decide('denied')}>
            Rechazar
          </button>
          <button type="button" className="tm-btn tm-btn--md" onClick={() => decide('granted')}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
