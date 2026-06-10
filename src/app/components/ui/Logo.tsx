import Link from 'next/link'

export function Mark({ size = 40, ...rest }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg className="tm-logo__mark" width={size} height={size} viewBox="0 0 48 48" fill="none" role="img" aria-label="TodoMotor" {...rest}>
      <rect x="1" y="1" width="46" height="46" rx="12" fill="var(--accent)" />
      <path d="M12.74 31.5 A13 13 0 1 1 35.26 31.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <line x1="12.74" y1="18.5" x2="15.34" y2="20" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <line x1="24" y1="12" x2="24" y2="15" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <line x1="35.26" y1="18.5" x2="32.66" y2="20" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <line x1="21.5" y1="28.7" x2="30.3" y2="16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="25" r="3" fill="#fff" />
      <circle cx="24" cy="25" r="1.3" fill="var(--accent)" />
    </svg>
  )
}

interface LogoProps {
  size?: number
  inverse?: boolean
  showUY?: boolean
  markOnly?: boolean
  href?: string
  className?: string
}

export function Logo({ size = 30, inverse = false, showUY = true, markOnly = false, href = '/', className = '' }: LogoProps) {
  const markSize = Math.round(size * 1.5)
  if (markOnly) return <Mark size={markSize} />
  return (
    <Link href={href} className={['tm-logo', inverse ? 'tm-logo--inverse' : '', className].filter(Boolean).join(' ')}>
      <Mark size={markSize} />
      <span className="tm-logo__wm" style={{ fontSize: size }}>
        <span className="tm-logo__todo">todo</span><span className="tm-logo__motor">motor</span>
      </span>
      {showUY && <span className="tm-logo__uy" style={{ fontSize: Math.max(10, size * 0.34), paddingBottom: size * 0.12 }}>UY</span>}
    </Link>
  )
}
