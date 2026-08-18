'use client'

import Link from 'next/link'
import { Check, Heart, Award, BarChart3, TrendingUp } from 'lucide-react'
import { segmentLabel } from '@/lib/buying-guide/sales'
import type { PodiumEntry } from '@/lib/buying-guide/types'
import { formatNumber, fuelToTagType } from '@/lib/format'
import { FuelTag } from '@/app/components/ui/FuelTag'
import { ImageWithFallback } from '@/app/components/ui/ImageWithFallback'
import { ButtonLink } from '@/app/components/ui/Button'
import { useSaved } from '@/app/components/SavedProvider'

interface Props {
  entry: PodiumEntry
  rank: number
  /** ACAU reference year (for the sales chip tooltip). */
  salesYear?: number
}

export default function GuidePodiumCard({ entry, rank, salesYear }: Props) {
  const v = entry.vehicle
  const { has, toggle, hydrated } = useSaved()
  const saved = hydrated && has(v.slug)
  const cur = v.cur === 'US$' || v.cur === 'U$S' ? 'USD' : v.cur

  return (
    <article className={`gd__pod gd__pod--${rank}`}>
      <div className="gd__pod-media">
        <ImageWithFallback
          src={v.image}
          alt={`${v.brand} ${v.model}${v.version ? ` ${v.version}` : ''} ${v.year}`}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          priority={rank === 1}
          style={{ objectFit: 'cover' }}
          fallbackClassName="tm-vcard__ph"
        />
        <span className="gd__rank" aria-label={`Puesto ${rank}`}>{rank}</span>
        <button
          type="button"
          className="tm-vcard__save gd__pod-save"
          data-on={saved}
          aria-label={saved ? 'Quitar de guardados' : 'Guardar'}
          aria-pressed={saved}
          onClick={() => toggle({ slug: v.slug, brand: v.brand, model: v.model, version: v.version, year: v.year, price: v.price ?? 0, currency: cur, fuelType: v.fuel ?? undefined, engineHp: v.hp, image: v.image })}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
        {v.fuel && <FuelTag type={fuelToTagType(v.fuel)} className="tm-vcard__fuel" />}
      </div>

      <div className="gd__pod-body">
        <div className="gd__pod-src">
          {entry.source === 'top' ? (
            <span className="gd__src gd__src--top"><Award size={13} aria-hidden="true" /> Top TodoMotor</span>
          ) : (
            <span className="gd__src gd__src--data"><BarChart3 size={13} aria-hidden="true" /> Sugerido por datos</span>
          )}
          {entry.relaxedTag && <span className="gd__src gd__src--relaxed">{entry.relaxedTag}</span>}
          {v.soldRank != null && v.soldRank <= 10 && (
            <span
              className="gd__src gd__src--sales"
              title={`Puesto ${v.soldRank} en ventas de ${segmentLabel(v.soldSeg ?? v.type)}${salesYear ? ` ${salesYear}` : ''} en Uruguay · Fuente: ACAU`}
            >
              <TrendingUp size={13} aria-hidden="true" /> Top {v.soldRank} ventas{salesYear ? ` ${salesYear}` : ''}
            </span>
          )}
        </div>
        <span className="tm-vcard__ey">{[v.brand, v.year].filter(Boolean).join(' · ')}</span>
        <h3 className="gd__pod-model">
          <Link href={`/vehiculo/${v.slug}`}>{v.model}</Link>
        </h3>
        {v.version && <p className="tm-vcard__trim">{v.version}</p>}
        <div className="gd__pod-price">
          <span className="tm-vcard__price"><span className="cur">{cur}</span>{v.price != null ? formatNumber(v.price) : 'Consultar'}</span>
          {v.hp != null && <span className="tm-vcard__power">{v.hp} HP</span>}
        </div>

        <p className="gd__why-l">Por qué te lo recomendamos</p>
        <ul className="gd__why">
          {entry.reasons.map((r) => (
            <li key={r}><Check size={14} aria-hidden="true" /><span>{r}</span></li>
          ))}
        </ul>

        {entry.versions.length > 0 && (
          <p className="gd__pod-vers">
            {entry.versions.length === 1 ? 'Otra versión que también encaja' : `${entry.versions.length} versiones más que también encajan`}
            {entry.versions.slice(0, 2).map((x) => (
              <Link key={x.slug} href={`/vehiculo/${x.slug}`} className="gd__pod-ver">
                {x.version || 'Base'}{x.price != null && <span className="p"> {formatNumber(x.price)}</span>}
              </Link>
            ))}
          </p>
        )}

        <div className="gd__pod-foot">
          <ButtonLink href={`/vehiculo/${v.slug}`} variant={rank === 1 ? 'primary' : 'secondary'} block>Ver ficha</ButtonLink>
        </div>
      </div>
    </article>
  )
}
