'use client'

import { Heart } from 'lucide-react'
import { Button } from './ui/Button'
import { useSaved, type SavedVehicle } from './SavedProvider'

export default function SaveVehicleButton({ snapshot }: { snapshot: Omit<SavedVehicle, 'savedAt'> }) {
  const { has, toggle, hydrated } = useSaved()
  const saved = hydrated && has(snapshot.slug)
  return (
    <Button
      size="lg"
      variant={saved ? 'soft' : 'secondary'}
      iconLeft={<Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />}
      onClick={() => toggle(snapshot)}
      aria-pressed={saved}
    >
      {saved ? 'Guardado' : 'Guardar'}
    </Button>
  )
}
