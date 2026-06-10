import React from 'react';

const FUEL = {
  nafta:     { label: 'Nafta',     fg: 'var(--c-fuel-nafta)',   bg: 'var(--c-fuel-nafta-bg)',   icon: 'fuel' },
  electrico: { label: 'Eléctrico', fg: 'var(--c-fuel-elec)',    bg: 'var(--c-fuel-elec-bg)',    icon: 'zap' },
  hibrido:   { label: 'Híbrido',   fg: 'var(--c-fuel-hibrido)', bg: 'var(--c-fuel-hibrido-bg)', icon: 'leaf' },
  diesel:    { label: 'Diésel',    fg: 'var(--c-fuel-diesel)',  bg: 'var(--c-fuel-diesel-bg)',  icon: 'container' },
};

const CSS = `
.tm-fuel {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-weight: 500; font-size: var(--text-xs);
  letter-spacing: 0.01em; line-height: 1; border-radius: var(--radius-pill);
  padding: 5px 11px 5px 9px; white-space: nowrap;
}
.tm-fuel__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex: none; }
.tm-fuel--plain { background: transparent; padding-left: 0; padding-right: 0; }
`;

let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'fuel');
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function FuelTag({ type = 'nafta', plain = false, className = '', ...rest }) {
  ensure();
  const f = FUEL[type] || FUEL.nafta;
  const cls = ['tm-fuel', plain ? 'tm-fuel--plain' : '', className].filter(Boolean).join(' ');
  return (
    <span
      className={cls}
      style={{ color: f.fg, background: plain ? 'transparent' : f.bg }}
      {...rest}
    >
      <span className="tm-fuel__dot" aria-hidden="true" />
      {f.label}
    </span>
  );
}

FuelTag.types = Object.keys(FUEL);
