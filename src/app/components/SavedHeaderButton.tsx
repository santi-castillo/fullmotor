'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useSaved } from './SavedProvider'

export default function SavedHeaderButton() {
  const { count, hydrated } = useSaved()
  return (
    <Link href="/guardados" className="k-icbtn" aria-label="Vehículos guardados">
      <Heart size={17} aria-hidden="true" />
      <span className="k-icbtn__label">Guardados</span>
      {hydrated && count > 0 && <span className="k-icbtn__count">{count}</span>}
    </Link>
  )
}
