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
          // The trailing slash is load-bearing: it blocks everything under
          // /cotizar — the form, a seller's own quotes, and every detail page
          // with its offers — while leaving /cotizar itself crawlable, which is
          // the landing that explains the feature and the only public page in
          // it. Those pages send noindex as well; this is the other half of the
          // pair, as with /clasificados above.
          '/cotizar/',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
