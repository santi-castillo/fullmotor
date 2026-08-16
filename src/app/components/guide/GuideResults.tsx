'use client'

import { type RefObject } from 'react'
import { GitCompareArrows, RotateCcw, SlidersHorizontal, AlertTriangle, LayoutGrid } from 'lucide-react'
import type { Answers, GuideResult, GuideVehicle, SalesMeta } from '@/lib/buying-guide/types'
import { MONTHS_ES } from '@/lib/buying-guide/sales'
import { catalogHref, compareHref } from '@/lib/buying-guide/url-state'
import type { VehicleCardProps } from '@/lib/vehicle-card'
import { formatNumber } from '@/lib/format'
import { VehicleCard } from '@/app/components/ui/VehicleCard'
import { Button, ButtonLink } from '@/app/components/ui/Button'
import GuidePodiumCard from './GuidePodiumCard'

interface Props {
  result: GuideResult
  answers: Answers
  salesMeta?: SalesMeta
  headingRef: RefObject<HTMLHeadingElement | null>
  onAdjust: () => void
  onRestart: () => void
}

const RECENT_DAYS = 30

function toCardProps(v: GuideVehicle, versions: GuideVehicle[]): VehicleCardProps {
  return {
    slug: v.slug,
    brand: v.brand,
    model: v.model,
    version: v.version,
    year: v.year,
    price: v.price ?? 0,
    currency: v.cur,
    power: v.hp,
    fuelType: v.fuel ?? undefined,
    condition: v.listed <= RECENT_DAYS ? 'Nuevo' : undefined,
    image: v.image,
    sizes: '(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw',
    relatedVersions: versions.map((x) => ({ slug: x.slug, version: x.version, price: x.price, currency: x.cur })),
  }
}

export default function GuideResults({ result, answers, salesMeta, headingRef, onAdjust, onRestart }: Props) {
  const { podium, others, notes, strictCount, strictFamilies, effective } = result
  const podiumSlugs = podium.map((p) => p.vehicle.slug)
  const types = [...podium.map((p) => p.vehicle.type), ...others.map((o) => o.best.v.type)]
  const nothing = podium.length === 0

  return (
    <section className="gd__results" aria-labelledby="gd-results-title">
      <div className="gd__results-head">
        <h2 id="gd-results-title" className="gd__q" ref={headingRef} tabIndex={-1}>
          {nothing ? 'No encontramos coincidencias' : 'Tu Top 3'}
        </h2>
        <p className="gd__sub">
          {strictCount > 0
            ? <>Según tus respuestas · {formatNumber(strictCount)} {strictCount === 1 ? 'vehículo coincide' : 'vehículos coinciden'} ({formatNumber(strictFamilies)} {strictFamilies === 1 ? 'modelo' : 'modelos'})</>
            : <>Ningún vehículo del catálogo cumple todas tus respuestas.</>}
        </p>
      </div>

      {notes.length > 0 && (
        <div className="gd__notice" role="status">
          <AlertTriangle size={18} aria-hidden="true" />
          <p>
            No había 3 modelos que cumplieran todo. Para completar el podio {notes.join(' y ')}.
            Los marcados con una etiqueta entraron por ese ajuste.
          </p>
        </div>
      )}

      {nothing ? (
        <div className="iv__empty">
          <p>Probá aflojar alguna respuesta — el presupuesto suele ser lo que más recorta.</p>
          <div className="gd__ctas" style={{ justifyContent: 'center', marginTop: 16 }}>
            <Button variant="primary" onClick={onAdjust} iconLeft={<SlidersHorizontal size={16} aria-hidden="true" />}>Ajustar respuestas</Button>
            <ButtonLink href="/?category=all" variant="secondary">Ver todo el catálogo</ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <div className={`gd__podium gd__podium--${podium.length}`}>
            {podium.map((entry, i) => (
              <GuidePodiumCard key={entry.vehicle.slug} entry={entry} rank={i + 1} salesYear={salesMeta?.year} />
            ))}
          </div>

          {salesMeta && (
            <p className="gd__source">
              Ventas: ACAU (Asociación de Concesionarios), acumulado enero–{MONTHS_ES[Math.max(0, salesMeta.monthsCovered - 1)]} {salesMeta.year}, ventas de representantes oficiales.
              Precios y fichas: catálogo TodoMotor.
            </p>
          )}

          <div className="gd__ctas">
            {podium.length >= 2 && (
              <ButtonLink href={compareHref(podiumSlugs)} variant="primary" iconLeft={<GitCompareArrows size={16} aria-hidden="true" />}>
                Comparar {podium.length === 3 ? 'los 3' : 'estos'}
              </ButtonLink>
            )}
            <ButtonLink href={catalogHref(effective, types)} variant="secondary" iconLeft={<LayoutGrid size={16} aria-hidden="true" />}>
              Ver todos en el catálogo
            </ButtonLink>
            <Button variant="ghost" onClick={onAdjust} iconLeft={<SlidersHorizontal size={16} aria-hidden="true" />}>Ajustar respuestas</Button>
            <Button variant="ghost" onClick={onRestart} iconLeft={<RotateCcw size={16} aria-hidden="true" />}>Empezar de nuevo</Button>
          </div>

          {others.length > 0 && (
            <div className="gd__others">
              <h3 className="gd__others-t">Otros que también encajan</h3>
              <p className="gd__others-s">Ordenados por afinidad con tus respuestas{answers.prio ? ' y tu prioridad' : ''}. Una versión por modelo.</p>
              <div className="gd__grid">
                {others.map((o) => (
                  <div key={o.best.v.slug} className="gd__card">
                    <VehicleCard {...toCardProps(o.best.v, o.versions)} />
                    <span className="gd__score" title="Puntaje de afinidad con tus respuestas">Afinidad {o.best.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
