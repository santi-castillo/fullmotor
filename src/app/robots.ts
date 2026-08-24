import type { MetadataRoute } from 'next'
import { absoluteUrl, SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private or user-specific surfaces. They also send noindex, but
        // keeping them out of the crawl saves budget for vehicles and articles.
        disallow: [
          '/admin',
          '/api',
          '/guardados',
          '/compare',
          '/clasificados/nuevo',
          '/clasificados/mis',
          '/clasificados/*/editar',
          // The storefronts themselves stay crawlable — they are the point.
          // Only the private surfaces around them are excluded. /panel covers
          // the buy-side feed nested under it.
          '/automotoras/solicitar',
          '/automotoras/panel',
          // /cotizar itself stays crawlable: it is the landing that explains
          // the feature. Everything under it holds cars whose owners asked us
          // not to publish them, so it must never be reached from a search.
          '/cotizar/nuevo',
          '/cotizar/mis',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
