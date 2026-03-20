import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TodoMotor Uruguay',
    short_name: 'TodoMotor',
    description: 'Fichas t\u00e9cnicas de veh\u00edculos en Uruguay. Autos, SUVs, camionetas y motos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1326',
    theme_color: '#00e5a0',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
