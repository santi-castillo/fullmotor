import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from '@/lib/og'

export const alt = 'Noticias del motor en Uruguay — TodoMotor'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function BlogOpengraphImage() {
  return renderOgImage({
    eyebrow: 'Blog del Motor',
    title: 'Noticias y novedades del motor en Uruguay',
    subtitle: 'Lanzamientos, precios, impuestos y guías para comprar mejor.',
  })
}
