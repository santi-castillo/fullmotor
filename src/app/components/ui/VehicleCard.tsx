'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { formatNumber, fuelToTagType } from '@/lib/format'
import type { VehicleCardProps } from '@/lib/vehicle-card'
import { FuelTag } from './FuelTag'
import { useSaved } from '../SavedProvider'

const GaugePH = () => (
  <svg className="tm-vcard__ph" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M12.74 31.5 A13 13 0 1 1 35.26 31.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="21.5" y1="28.7" x2="30.3" y2="16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="25" r="3" fill="currentColor" />
  </svg>
)

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
}: VehicleCardProps) {
  const { has, toggle, hydrated } = useSaved()
  const saved = hydrated && has(slug)
  const used = String(condition).toLowerCase().startsWith('us')
  const cur = !currency || currency === 'US$' || currency === 'U$S' ? 'USD' : currency

  return (
    <Link href={`/vehiculo/${slug}`} className="tm-vcard">
      <div className="tm-vcard__media">
        {image
          ? <Image src={image} alt={`${brand} ${model}`} fill sizes={sizes} style={{ objectFit: 'cover' }} />
          : <GaugePH />}
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
          <span className="tm-vcard__price"><span className="cur">{cur}</span>{formatNumber(price)}</span>
          {power != null && <span className="tm-vcard__power">{power} HP</span>}
        </div>
      </div>
    </Link>
  )
}
