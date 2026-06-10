type Tone = 'neutral' | 'accent' | 'positive' | 'warning' | 'danger'
type Variant = 'soft' | 'solid' | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  variant?: Variant
  size?: 'sm' | 'md'
  dot?: boolean
}

export function Badge({ children, tone = 'neutral', variant = 'soft', size = 'md', dot = false, className = '', ...rest }: BadgeProps) {
  const cls = ['tm-badge', `tm-badge--${tone}`, `tm-badge--${variant}`, `tm-badge--${size}`, className].filter(Boolean).join(' ')
  return (
    <span className={cls} {...rest}>
      {dot && <span className="tm-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
