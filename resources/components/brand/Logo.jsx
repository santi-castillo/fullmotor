import React from 'react';

const CSS = `
.tm-logo { display: inline-flex; align-items: flex-end; gap: 0.32em; text-decoration: none; line-height: 1; }
.tm-logo__mark { flex: none; display: block; }
.tm-logo__wm { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.03em; line-height: 0.9; }
.tm-logo__todo { color: var(--text-strong); }
.tm-logo__motor { color: var(--accent); }
.tm-logo--inverse .tm-logo__todo { color: #fff; }
.tm-logo--inverse .tm-logo__motor { color: #6E97FF; }
.tm-logo__uy {
  font-family: var(--font-mono); letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--text-muted); align-self: flex-end;
}
.tm-logo--inverse .tm-logo__uy { color: var(--text-inverse-muted); }
`;

let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'logo');
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Mark({ size = 40, ...rest }) {
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
  );
}

export function Logo({ size = 30, inverse = false, showUY = true, markOnly = false, as = 'a', className = '', ...rest }) {
  ensure();
  const Tag = as;
  const markSize = Math.round(size * 1.5);
  if (markOnly) return <Mark size={markSize} />;
  return (
    <Tag className={['tm-logo', inverse ? 'tm-logo--inverse' : '', className].filter(Boolean).join(' ')} {...rest}>
      <Mark size={markSize} />
      <span className="tm-logo__wm" style={{ fontSize: size }}>
        <span className="tm-logo__todo">todo</span><span className="tm-logo__motor">motor</span>
      </span>
      {showUY && <span className="tm-logo__uy" style={{ fontSize: Math.max(10, size * 0.34), paddingBottom: size * 0.12 }}>UY</span>}
    </Tag>
  );
}
