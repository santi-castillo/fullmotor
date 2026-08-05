/**
 * Fallback artwork for items without a usable image.
 *
 * The same gauge SVG was duplicated verbatim in VehicleCard and ImageCarousel
 * under different class names; this is the single source. `className` carries
 * the per-context sizing that lives in the stylesheets.
 */
export function GaugePlaceholder({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12.74 31.5 A13 13 0 1 1 35.26 31.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="21.5" y1="28.7" x2="30.3" y2="16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="25" r="3" fill="currentColor" />
    </svg>
  )
}
