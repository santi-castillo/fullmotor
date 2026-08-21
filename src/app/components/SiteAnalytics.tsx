import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { CONSENT_DEFAULT_SNIPPET } from '@/lib/consent'
import ConsentBanner from './ConsentBanner'

/**
 * Every measurement tag on the site, in one place.
 *
 * Three tools, three different jobs — none of them redundant:
 *
 *   - Vercel Analytics: pageviews and visitors, cookieless. The number the
 *     business runs on.
 *   - Speed Insights: Core Web Vitals from the field. This is the instrument
 *     that tells us whether ad slots are wrecking CLS, so it has to be in place
 *     *before* the first slot ships or there is no baseline to compare against.
 *   - GA4: a commercial requirement rather than a technical one. No media
 *     agency buys against Vercel Analytics; they ask for read access to a GA4
 *     property or an export.
 *
 * GTM is deliberately absent: a ~90KB container we do not control, able to
 * inject anything, for no benefit we cannot get directly.
 *
 * GA is skipped entirely when NEXT_PUBLIC_GA_ID is unset — the same
 * self-disabling pattern the API uses for MercadoPago and IndexNow, so a
 * missing variable degrades instead of breaking the build.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function SiteAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      {GA_ID ? (
        <>
          {/* Must run before GA loads: Consent Mode reads the defaults off
              dataLayer, and a `config` that lands first would set cookies. */}
          <Script
            id="tm-consent-default"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }}
          />
          <GoogleAnalytics gaId={GA_ID} />
          <ConsentBanner />
        </>
      ) : null}
    </>
  )
}
