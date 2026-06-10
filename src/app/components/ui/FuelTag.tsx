import type { FuelTagType } from '@/lib/format'

const FUEL: Record<FuelTagType, { label: string; fg: string; bg: string }> = {
  nafta:     { label: 'Nafta',     fg: 'var(--c-fuel-nafta)',   bg: 'var(--c-fuel-nafta-bg)' },
  electrico: { label: 'Eléctrico', fg: 'var(--c-fuel-elec)',    bg: 'var(--c-fuel-elec-bg)' },
  hibrido:   { label: 'Híbrido',   fg: 'var(--c-fuel-hibrido)', bg: 'var(--c-fuel-hibrido-bg)' },
  diesel:    { label: 'Diésel',    fg: 'var(--c-fuel-diesel)',  bg: 'var(--c-fuel-diesel-bg)' },
}

interface FuelTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: FuelTagType
  plain?: boolean
}

export function FuelTag({ type = 'nafta', plain = false, className = '', ...rest }: FuelTagProps) {
  const f = FUEL[type] || FUEL.nafta
  const cls = ['tm-fuel', plain ? 'tm-fuel--plain' : '', className].filter(Boolean).join(' ')
  return (
    <span className={cls} style={{ color: f.fg, background: plain ? 'transparent' : f.bg }} {...rest}>
      <span className="tm-fuel__dot" aria-hidden="true" />
      {f.label}
    </span>
  )
}
