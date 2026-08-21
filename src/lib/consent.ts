/**
 * Consent for cookie-based measurement (Ley 18.331 + Decreto 64/020).
 *
 * Uruguay's data protection law asks for consent that is prior, express and
 * informed, so the decision is stored explicitly and nothing cookie-based runs
 * until it exists. What needs consent and what does not is a real distinction
 * here, not a formality:
 *
 *   - Vercel Analytics / Speed Insights: no consent. No cookies, no persistent
 *     identifier, nothing personal leaves the page.
 *   - GA4: consent. The `_ga` cookie is a persistent identifier.
 *   - Our own ad serving: no consent. Targeting is contextual — section, brand,
 *     guide answers — never a profile of the person. This is the reason the ad
 *     server is ours rather than a third party's.
 *   - Third-party ad tags: consent. They set their own cookies.
 */

export const CONSENT_COOKIE = 'tm_consent'

/** Six months. Long enough not to nag, short enough that consent stays current. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 182

export type ConsentValue = 'granted' | 'denied'

/** Fired on the window whenever the decision changes, so anything that depends
 *  on consent (third-party tags) can react without polling the cookie. */
export const CONSENT_EVENT = 'tm:consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function readConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`))
  return match ? (match[1] as ConsentValue) : null
}

export function writeConsent(value: ConsentValue): void {
  if (typeof document === 'undefined') return
  // `Secure` only on https: setting it on http://localhost makes the browser
  // drop the cookie silently, which looks exactly like the banner being broken.
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
  applyConsent(value)
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }))
}

/** Push a Consent Mode v2 update. Safe to call before gtag exists: the defaults
 *  snippet creates `dataLayer` first, and GA reads the queue when it loads. */
export function applyConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(['consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  }])
}

/**
 * Consent Mode v2 defaults, injected before GA loads.
 *
 * It reads the cookie synchronously rather than always defaulting to `denied`,
 * so a returning visitor who already accepted is not measured as cookieless for
 * their first pageview of every session. `wait_for_update` gives the banner a
 * beat to answer for a first-time visitor before GA gives up and models.
 */
export const CONSENT_DEFAULT_SNIPPET = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
window.gtag=window.gtag||gtag;
var v=document.cookie.indexOf('${CONSENT_COOKIE}=granted')!==-1?'granted':'denied';
gtag('consent','default',{
ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v,
functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
`.trim()
