import type { MetadataRoute } from 'next'
import { getAllVehicles } from '@/lib/data'
import { getAllBlogPosts } from '@/lib/blog'
import { getAllIndexableClassifieds } from '@/lib/classifieds-api'
import { CATEGORIES } from '@/types/vehicle'
import { absoluteUrl, SITE_URL } from '@/lib/site'

// Refresh the sitemap without a rebuild — new articles and listings show up
// within the hour instead of waiting for the next deploy.
export const revalidate = 3600

function warnIfEmpty(label: string, count: number) {
  if (count === 0) {
    console.warn(`[sitemap] no ${label} found — the API is likely unreachable, sitemap will be incomplete`)
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, posts, classifieds] = await Promise.all([
    getAllVehicles(),
    getAllBlogPosts(),
    getAllIndexableClassifieds(),
  ])

  warnIfEmpty('vehicles', vehicles.length)
  warnIfEmpty('blog posts', posts.length)
  warnIfEmpty('classifieds', classifieds.length)

  const now = new Date()

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: absoluteUrl(`/vehiculos?category=${cat.id}`),
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const vehicleEntries: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: absoluteUrl(`/vehiculo/${vehicle.slug}`),
    lastModified: vehicle.updatedAt ? new Date(vehicle.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const classifiedEntries: MetadataRoute.Sitemap = classifieds.map((classified) => ({
    url: absoluteUrl(`/clasificados/${classified.id}`),
    lastModified: classified.updatedAt ? new Date(classified.updatedAt) : now,
    changeFrequency: 'daily',
    priority: 0.5,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified: posts[0]?.publishedAt ? new Date(posts[0].publishedAt) : now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/clasificados'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...categoryEntries,
    ...blogEntries,
    ...vehicleEntries,
    ...classifiedEntries,
  ]
}
