import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { brandSlug } from '@/lib/catalog'
import { formatNumber } from '@/lib/format'

/**
 * The home's only entry point into /marcas.
 *
 * Before this, the brand pages were reachable from a vehicle breadcrumb, the
 * footer and the sitemap — which is enough for a crawler and not enough for a
 * person. Those pages are the highest-intent context on the site (someone
 * reading "Chery en Uruguay" is shopping for a Chery), so leaving them without
 * a route from the home meant the traffic never arrived and the page could not
 * be sold as inventory.
 *
 * The counts come from the filters response the home already fetches, so this
 * section costs no extra request.
 */

interface BrandCount {
  name: string
  count: number
}

interface BrandStripProps {
  brands: BrandCount[]
}

/** Two rows of the four-column grid. Enough to look like a catalogue, few
 *  enough that "ver todas" still has a reason to exist. */
const SHOWN = 8

export default function BrandStrip({ brands }: BrandStripProps) {
  const top = [...brands]
    .filter((b) => b.name?.trim())
    // Most models first: the brands with the deepest catalogue are both the
    // most useful to a shopper and the most valuable as ad inventory.
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'))
    .slice(0, SHOWN)

  if (top.length === 0) return null

  return (
    <section className="h-sect">
      <div className="h-sect__head">
        <div>
          <h2>Explorá por marca</h2>
          <p>Precios y fichas técnicas de cada marca disponible en Uruguay</p>
        </div>
        <Link href="/marcas" className="h-link">
          Ver todas las marcas <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="mk__grid">
        {top.map((brand) => (
          <li key={brand.name}>
            <Link href={`/marcas/${brandSlug(brand.name)}`} className="mk__card">
              <span className="mk__name">{brand.name}</span>
              <span className="mk__meta">
                {formatNumber(brand.count)} {brand.count === 1 ? 'modelo' : 'modelos'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
