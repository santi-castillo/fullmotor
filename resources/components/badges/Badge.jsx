import React from 'react';

const CSS = `
.tm-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: var(--font-sans); font-weight: var(--weight-semibold);
  border-radius: var(--radius-sm); line-height: 1; white-space: nowrap;
  border: var(--border-w) solid transparent;
}
.tm-badge--sm { font-size: var(--text-2xs); padding: 3px 7px; }
.tm-badge--md { font-size: var(--text-xs); padding: 5px 9px; }
.tm-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* soft (default) */
.tm-badge--neutral.tm-badge--soft { background: var(--surface-sunken); color: var(--text-body); }
.tm-badge--accent.tm-badge--soft { background: var(--accent-soft); color: var(--accent-ink); }
.tm-badge--positive.tm-badge--soft { background: var(--positive-soft); color: var(--positive-ink); }
.tm-badge--warning.tm-badge--soft { background: var(--warning-soft); color: var(--warning-ink); }
.tm-badge--danger.tm-badge--soft { background: var(--danger-soft); color: var(--danger-ink); }

/* solid */
.tm-badge--neutral.tm-badge--solid { background: var(--c-ink-800); color: #fff; }
.tm-badge--accent.tm-badge--solid { background: var(--accent); color: var(--text-on-accent); }
.tm-badge--positive.tm-badge--solid { background: var(--positive); color: #fff; }
.tm-badge--warning.tm-badge--solid { background: var(--warning); color: #fff; }
.tm-badge--danger.tm-badge--solid { background: var(--danger); color: #fff; }

/* outline */
.tm-badge--outline { background: transparent; }
.tm-badge--neutral.tm-badge--outline { border-color: var(--border-strong); color: var(--text-body); }
.tm-badge--accent.tm-badge--outline { border-color: var(--accent); color: var(--accent); }
.tm-badge--positive.tm-badge--outline { border-color: var(--positive); color: var(--positive-ink); }
.tm-badge--warning.tm-badge--outline { border-color: var(--warning); color: var(--warning-ink); }
.tm-badge--danger.tm-badge--outline { border-color: var(--danger); color: var(--danger-ink); }
`;

let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'badge');
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  className = '',
  ...rest
}) {
  ensure();
  const cls = ['tm-badge', `tm-badge--${tone}`, `tm-badge--${variant}`, `tm-badge--${size}`, className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && <span className="tm-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
