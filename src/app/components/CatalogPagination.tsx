import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { catalogHref, type CatalogParams } from '@/lib/catalog'

interface CatalogPaginationProps {
  currentPage: number
  totalPages: number
  /** Current filters, minus `page` — each link re-adds its own. */
  params: CatalogParams
}

/**
 * Page numbers to show: always the first and last, plus a window around the
 * current one, with gaps collapsed. A 52-page catalogue cannot render every
 * number, but a crawler still needs a real path to the far end — which is why
 * the last page is always present.
 */
function pageWindow(current: number, total: number): (number | 'gap')[] {
  const pages = new Set<number>([1, total, current])
  for (const offset of [-2, -1, 1, 2]) {
    const p = current + offset
    if (p > 1 && p < total) pages.add(p)
  }

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | 'gap')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap')
    out.push(p)
  })
  return out
}

/**
 * Crawlable pagination: real anchors, not router.push handlers.
 *
 * The catalogue rendered 9 of 1.239 vehicles into the server HTML and loaded
 * the rest by scroll, so 1.230 pages had the sitemap as their only route in and
 * received no internal link equity at all. Buttons would not have fixed that —
 * a crawler follows hrefs.
 */
export default function CatalogPagination({ currentPage, totalPages, params }: CatalogPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="pg" aria-label="Paginación del catálogo">
      {currentPage > 1 ? (
        <Link className="pg__arrow" href={catalogHref(params, currentPage - 1)} rel="prev" aria-label="Página anterior">
          <ChevronLeft size={17} aria-hidden="true" />
        </Link>
      ) : (
        <span className="pg__arrow pg__arrow--off" aria-hidden="true"><ChevronLeft size={17} /></span>
      )}

      <ol className="pg__list">
        {pageWindow(currentPage, totalPages).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} className="pg__gap" aria-hidden="true">…</li>
          ) : (
            <li key={p}>
              <Link
                className={`pg__n${p === currentPage ? ' pg__n--on' : ''}`}
                href={catalogHref(params, p)}
                aria-label={`Página ${p}`}
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p}
              </Link>
            </li>
          )
        )}
      </ol>

      {currentPage < totalPages ? (
        <Link className="pg__arrow" href={catalogHref(params, currentPage + 1)} rel="next" aria-label="Página siguiente">
          <ChevronRight size={17} aria-hidden="true" />
        </Link>
      ) : (
        <span className="pg__arrow pg__arrow--off" aria-hidden="true"><ChevronRight size={17} /></span>
      )}
    </nav>
  )
}
