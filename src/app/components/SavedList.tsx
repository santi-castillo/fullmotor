'use client'

import { Heart } from 'lucide-react'
import { useSaved } from './SavedProvider'
import { VehicleCard } from './ui/VehicleCard'

export default function SavedList() {
  const { items, hydrated } = useSaved()

  if (!hydrated) {
    return (
      <div className="iv__grid">
        {[0, 1, 2].map((i) => (
          <div className="iv__skel" key={i}>
            <div className="m" />
            <div className="b"><div className="l l--w60" /><div className="l l--w40" /></div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="iv__empty">
        <Heart size={28} style={{ margin: '0 auto 12px', display: 'block', color: 'var(--text-faint)' }} aria-hidden="true" />
        Todavía no guardaste ningún vehículo. Tocá el corazón en cualquier ficha para tenerlo acá.
      </div>
    )
  }

  return (
    <div className="iv__grid">
      {items.map((v) => (
        <VehicleCard
          key={v.slug}
          slug={v.slug}
          brand={v.brand}
          model={v.model}
          version={v.version}
          year={v.year}
          price={v.price}
          currency={v.currency}
          power={v.engineHp}
          fuelType={v.fuelType}
          image={v.image}
        />
      ))}
    </div>
  )
}
