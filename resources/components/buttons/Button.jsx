import React from 'react';

const CSS = `
.tm-btn {
  --_bg: var(--accent); --_fg: var(--text-on-accent); --_bd: transparent; --_bgh: var(--accent-hover); --_bgp: var(--accent-press);
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-sans); font-weight: var(--weight-semibold); white-space: nowrap;
  border: var(--border-w) solid var(--_bd); background: var(--_bg); color: var(--_fg);
  border-radius: var(--radius-md); cursor: pointer; text-decoration: none;
  transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
  -webkit-user-select: none; user-select: none;
}
.tm-btn:hover { background: var(--_bgh); }
.tm-btn:active { background: var(--_bgp); transform: translateY(1px); }
.tm-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.tm-btn[disabled] { opacity: 0.45; pointer-events: none; }
.tm-btn--block { width: 100%; }

/* sizes */
.tm-btn--sm { height: var(--control-h-sm); padding: 0 12px; font-size: var(--text-sm); border-radius: var(--radius-sm); }
.tm-btn--md { height: var(--control-h-md); padding: 0 18px; font-size: var(--text-base); }
.tm-btn--lg { height: var(--control-h-lg); padding: 0 24px; font-size: var(--text-md); }

/* variants */
.tm-btn--secondary { --_bg: var(--surface); --_fg: var(--text-strong); --_bd: var(--border-strong); --_bgh: var(--surface-sunken); --_bgp: var(--c-ink-100); }
.tm-btn--ghost { --_bg: transparent; --_fg: var(--text-body); --_bd: transparent; --_bgh: var(--surface-sunken); --_bgp: var(--c-ink-100); }
.tm-btn--soft { --_bg: var(--accent-soft); --_fg: var(--accent-ink); --_bd: transparent; --_bgh: var(--accent-faint); --_bgp: var(--accent-soft); }
.tm-btn--danger { --_bg: var(--danger); --_fg: #fff; --_bgh: #c63329; --_bgp: #b02c23; }
.tm-btn--icon { padding: 0; aspect-ratio: 1; }
.tm-btn__spinner { width: 15px; height: 15px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: tm-spin 0.6s linear infinite; }
@keyframes tm-spin { to { transform: rotate(360deg); } }
`;

let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'button');
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  iconOnly = false,
  as = 'button',
  className = '',
  ...rest
}) {
  ensure();
  const Tag = as;
  const cls = [
    'tm-btn',
    `tm-btn--${size}`,
    variant !== 'primary' ? `tm-btn--${variant}` : '',
    block ? 'tm-btn--block' : '',
    iconOnly ? 'tm-btn--icon' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag className={cls} disabled={Tag === 'button' ? (disabled || loading) : undefined} {...rest}>
      {loading && <span className="tm-btn__spinner" aria-hidden="true" />}
      {!loading && iconLeft}
      {!iconOnly && children}
      {!loading && iconRight}
      {iconOnly && loading ? null : null}
    </Tag>
  );
}
