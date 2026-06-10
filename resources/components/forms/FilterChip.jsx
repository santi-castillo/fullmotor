import React from 'react';

const CSS = `
.tm-chip {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--font-sans); font-size: var(--text-sm); font-weight: var(--weight-medium);
  color: var(--text-body); background: var(--surface);
  border: var(--border-w) solid var(--border-strong); border-radius: var(--radius-pill);
  height: 36px; padding: 0 14px; cursor: pointer; white-space: nowrap;
  transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.tm-chip:hover { border-color: var(--c-ink-300); background: var(--surface-sunken); }
.tm-chip:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.tm-chip__count { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-faint); }
.tm-chip--active {
  background: var(--accent); border-color: var(--accent); color: var(--text-on-accent);
}
.tm-chip--active:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.tm-chip--active .tm-chip__count { color: rgba(255,255,255,0.7); }
.tm-chip__ico { display: grid; place-items: center; margin-left: -2px; }
`;

let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'chip');
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function FilterChip({ children, active = false, count, icon = null, className = '', ...rest }) {
  ensure();
  const cls = ['tm-chip', active ? 'tm-chip--active' : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-pressed={active} {...rest}>
      {icon && <span className="tm-chip__ico">{icon}</span>}
      {children}
      {count != null && <span className="tm-chip__count">{count}</span>}
    </button>
  );
}
