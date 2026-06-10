import React from 'react';

const CSS = `
.tm-field { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-sans); }
.tm-field__label { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); }
.tm-field__req { color: var(--danger); margin-left: 2px; }
.tm-input-wrap { position: relative; display: flex; align-items: center; }
.tm-input {
  width: 100%; height: var(--control-h-md); box-sizing: border-box;
  font-family: var(--font-sans); font-size: var(--text-base); color: var(--text-strong);
  background: var(--surface); border: var(--border-w) solid var(--border-strong);
  border-radius: var(--radius-md); padding: 0 14px;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.tm-input::placeholder { color: var(--text-faint); }
.tm-input:hover { border-color: var(--c-ink-300); }
.tm-input:focus { outline: none; border-color: var(--accent); box-shadow: var(--focus-ring); }
.tm-input--has-left { padding-left: 40px; }
.tm-input--has-right { padding-right: 40px; }
.tm-input--lg { height: var(--control-h-lg); font-size: var(--text-md); border-radius: var(--radius-lg); }
.tm-input--sm { height: var(--control-h-sm); font-size: var(--text-sm); }
.tm-input[disabled] { background: var(--surface-sunken); color: var(--text-muted); cursor: not-allowed; }
.tm-field--error .tm-input { border-color: var(--danger); }
.tm-field--error .tm-input:focus { box-shadow: 0 0 0 3px var(--danger-soft); }
.tm-input__icon { position: absolute; display: grid; place-items: center; color: var(--text-muted); pointer-events: none; }
.tm-input__icon--left { left: 12px; }
.tm-input__icon--right { right: 12px; }
.tm-field__hint { font-size: var(--text-xs); color: var(--text-muted); }
.tm-field--error .tm-field__hint { color: var(--danger-ink); }
`;

let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'input');
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Input({
  label,
  hint,
  error,
  required = false,
  size = 'md',
  iconLeft = null,
  iconRight = null,
  id,
  className = '',
  ...rest
}) {
  ensure();
  const fid = id || (label ? `tm-${String(label).toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const inputCls = [
    'tm-input',
    `tm-input--${size}`,
    iconLeft ? 'tm-input--has-left' : '',
    iconRight ? 'tm-input--has-right' : '',
  ].filter(Boolean).join(' ');
  const fieldCls = ['tm-field', error ? 'tm-field--error' : '', className].filter(Boolean).join(' ');

  return (
    <div className={fieldCls}>
      {label && (
        <label className="tm-field__label" htmlFor={fid}>
          {label}{required && <span className="tm-field__req">*</span>}
        </label>
      )}
      <div className="tm-input-wrap">
        {iconLeft && <span className="tm-input__icon tm-input__icon--left">{iconLeft}</span>}
        <input id={fid} className={inputCls} aria-invalid={!!error || undefined} {...rest} />
        {iconRight && <span className="tm-input__icon tm-input__icon--right">{iconRight}</span>}
      </div>
      {(error || hint) && <span className="tm-field__hint">{error || hint}</span>}
    </div>
  );
}
