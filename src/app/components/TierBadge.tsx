import { ClassifiedTier } from '@/types/classified'

export default function TierBadge({ tier }: { tier: ClassifiedTier }) {
  if (tier === 'free') return null

  if (tier === 'featured') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md">
        ⭐ Destacado
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-md">
      ✨ Premium
    </span>
  )
}
