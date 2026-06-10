import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TodoMotor Uruguay',
    short_name: 'TodoMotor',
    description: 'Fichas t\u00e9cnicas de veh\u00edculos en Uruguay. Autos, SUVs, camionetas y motos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F8FB',
    theme_color: '#1F4FE0',
    icons: [
      {
        src: '/brand/todomotor-mark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
