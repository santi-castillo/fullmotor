import React from 'react';

const CSS = `
.tm-select-wrap { position: relative; display: inline-flex; align-items: center; width: 100%; }
.tm-select {
  width: 100%; height: var(--control-h-md); box-sizing: border-box;
  font-family: var(--font-sans); font-size: var(--text-base); color: var(--text-strong);
  background: var(--surface); border: var(--border-w) solid var(--border-strong);
  border-radius: var(--radius-md); padding: 0 38px 0 14px;
  -webkit-appearance: none; appearance: none; cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.tm-select:hover { border-color: var(--c-ink-300); }
.tm-select:focus { outline: none; border-color: var(--accent); box-shadow: var(--focus-ring); }
.tm-select:disabled { background: var(--surface-sunken); color: var(--text-muted); cursor: not-allowed; }
.tm-select--sm { height: var(--control-h-sm); font-size: var(--text-sm); }
.tm-select__chev {
  position: absolute; right: 12px; width: 16px; height: 16px; pointer-events: none;
  color: var(--text-muted);
}
.tm-select__chev::before, .tm-select__chev::after {
  content: ""; position: absolute; width: 7px; height: 1.6px; background: currentColor; top: 7px; border-radius: 2px;
}
.tm-select__chev::before { left: 1px; transform: rotate(45deg); }
.tm-select__chev::after { right: 1px; transform: rotate(-45deg); }
`;

let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'select');
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Select({ children, options, size = 'md', placeholder, className = '', ...rest }) {
  ensure();
  const cls = ['tm-select', size === 'sm' ? 'tm-select--sm' : '', className].filter(Boolean).join(' ');
  return (
    <span className="tm-select-wrap">
      <select className={cls} {...rest}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options
          ? options.map((o) => {
              const val = typeof o === 'string' ? o : o.value;
              const lab = typeof o === 'string' ? o : o.label;
              return <option key={val} value={val}>{lab}</option>;
            })
          : children}
      </select>
      <span className="tm-select__chev" aria-hidden="true" />
    </span>
  );
}
