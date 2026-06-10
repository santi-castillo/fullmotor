import { CarFront, Caravan, Truck, Bike, Bus, LayoutGrid } from 'lucide-react'
import type { CategoryIconName } from '@/types/vehicle'

const ICONS: Record<CategoryIconName, React.ComponentType<{ size?: number | string; className?: string }>> = {
  'car-front': CarFront,
  'caravan': Caravan,
  'truck': Truck,
  'bike': Bike,
  'bus': Bus,
  'layout-grid': LayoutGrid,
}

export function CategoryIcon({ name, size = 18, className }: { name: CategoryIconName; size?: number; className?: string }) {
  const Icon = ICONS[name] || LayoutGrid
  return <Icon size={size} className={className} />
}
