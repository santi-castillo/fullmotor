import {
  Users, Building2, Truck, Route, Gauge, Wallet, UserRound, Fuel, Droplets, Leaf, Zap, Settings2, Hand,
  Tag, Maximize2, Sparkles, Shield, Ban, type LucideIcon,
} from 'lucide-react'
import type { GuideIcon } from '@/lib/buying-guide/questions'

const ICONS: Record<GuideIcon, LucideIcon> = {
  users: Users, building: Building2, truck: Truck, route: Route, gauge: Gauge,
  wallet: Wallet, user: UserRound, fuel: Fuel, droplets: Droplets, leaf: Leaf, zap: Zap, settings: Settings2, hand: Hand,
  tag: Tag, maximize: Maximize2, sparkles: Sparkles, shield: Shield, ban: Ban,
}

export function GuideIconGlyph({ name, size = 24 }: { name: GuideIcon; size?: number }) {
  const Icon = ICONS[name] || Sparkles
  return <Icon size={size} aria-hidden="true" />
}
