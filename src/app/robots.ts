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
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
