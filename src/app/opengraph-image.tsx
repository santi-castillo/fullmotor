import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from '@/lib/og'

export const alt = 'TodoMotor Uruguay — Fichas técnicas de vehículos'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: 'Uruguay',
    title: 'Fichas técnicas de autos, SUVs, camionetas y motos',
    subtitle: 'Especificaciones, precios y equipamiento del mercado uruguayo.',
  })
}
