import React from 'react';

interface BadgeProps {
  /** Icon to display, e.g., ⚡, 🔋, ⛽ */
  icon: string;
  /** Single‑letter label, e.g., E, H, D */
  letter: string;
  /** Tailwind‑like color class for background (optional, defaults to primary gradient) */
  colorClass?: string;
  /** Tooltip text */
  title?: string;
}

/**
 * Reusable badge component that follows the premium design system.
 * Uses the global CSS variables defined in `globals.css`.
 */
export default function Badge({ icon, letter, colorClass = 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]', title }: BadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: 'var(--gradient-primary)' }} title={title}>
      <span>{icon}</span>
      <span>{letter}</span>
    </div>
  );
}
