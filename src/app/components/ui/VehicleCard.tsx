'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { formatNumber, fuelToTagType, normalizeCurrency } from '@/lib/format'
import type { VehicleCardProps } from '@/lib/vehicle-card'
import { FuelTag } from './FuelTag'
import { ImageWithFallback } from './ImageWithFallback'
import { useSaved } from '../SavedProvider'

/** Beyond a few chips the card stops being scannable. */
const MAX_VISIBLE_VERSIONS = 3

export function VehicleCard({
  slug,
  brand,
  model,
  version,
  year,
  price,
  currency = 'USD',
  power,
  fuelType,
  condition,
  image,
  hideSave = false,
  sizes = '(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw',
  relatedVersions,
}: VehicleCardProps) {
  const router = useRouter()
  const { has, toggle, hydrated } = useSaved()
  const saved = hydrated && has(slug)
  const used = String(condition).toLowerCase().startsWith('us')
  const cur = normalizeCurrency(currency)

  return (
    <Link href={`/vehiculo/${slug}`} className="tm-vcard">
      <div className="tm-vcard__media">
        <ImageWithFallback
          src={image}
          alt={`${brand} ${model}${version ? ` ${version}` : ''} ${year}`}
          fill
          sizes={sizes}
          style={{ objectFit: 'cover' }}
          fallbackClassName="tm-vcard__ph"
        />
        {condition && (
          <div className="tm-vcard__topl">
            <span className={`tm-cond${used ? ' tm-cond--used' : ''}`}>{condition}</span>
          </div>
        )}
        {!hideSave && (
          <div className="tm-vcard__topr">
            <button
              type="button"
              className="tm-vcard__save"
              data-on={saved}
              aria-label={saved ? 'Quitar de guardados' : 'Guardar'}
              aria-pressed={saved}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggle({ slug, brand, model, version, year, price, currency: cur, fuelType, engineHp: power, image })
              }}
            >
              <Heart size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>
          </div>
        )}
        <FuelTag type={fuelToTagType(fuelType)} className="tm-vcard__fuel" />
      </div>
      <div className="tm-vcard__body">
        <span className="tm-vcard__ey">{[brand, year].filter(Boolean).join(' · ')}</span>
        <h3 className="tm-vcard__model">{model}</h3>
        {version && <p className="tm-vcard__trim">{version}</p>}
        <div className="tm-vcard__foot">
          {/* Not every vehicle carries a price — the SxS quads do not. The
              detail page already says "a consultar"; the card said NaN, or
              crashed the render when the value was null. */}
          {price != null
            ? <span className="tm-vcard__price"><span className="cur">{cur}</span>{formatNumber(price)}</span>
            : <span className="tm-vcard__price tm-vcard__price--ask">Consultar</span>}
          {power != null && <span className="tm-vcard__power">{power} HP</span>}
        </div>
        {relatedVersions && relatedVersions.length > 0 && (
          // Nested inside the card's own <Link>, so these must not be anchors:
          // an <a> inside an <a> is invalid HTML and browsers recover from it
          // by splitting the outer link. Router pushes give the same behaviour.
          <div className="tm-vcard__vers">
            <span className="tm-vcard__vers-l">
              {relatedVersions.length === 1 ? 'Otra versión' : `${relatedVersions.length} versiones más`}
            </span>
            <div className="tm-vcard__vers-list">
              {relatedVersions.slice(0, MAX_VISIBLE_VERSIONS).map((rv) => (
                <button
                  key={rv.slug}
                  type="button"
                  className="tm-vcard__vers-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/vehiculo/${rv.slug}`)
                  }}
                >
                  {rv.version || 'Base'}
                  {rv.price != null && <span className="p">{formatNumber(rv.price)}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
