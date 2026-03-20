import type { MetadataRoute } from 'next'
import { getAllVehicles } from '@/lib/data'
import { CATEGORIES } from '@/types/vehicle'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await getAllVehicles()

  const vehicleEntries: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `https://todomotor.uy/vehiculo/${vehicle.slug}`,
    lastModified: vehicle.updatedAt ? new Date(vehicle.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `https://todomotor.uy/?category=${cat.id}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://todomotor.uy',
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...categoryEntries,
    ...vehicleEntries,
  ]
}
