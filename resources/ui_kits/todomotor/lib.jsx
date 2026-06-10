/* AUTO-VENDORED from /components — do not edit by hand.
   Mirror of the design-system bundle so the UI kit renders standalone. */

// ===== Button.jsx =====
const CSS_0 = `
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

let injected_0 = false;
function ensure_0() {
  if (injected_0 || typeof document === 'undefined') return;
  injected_0 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'button');
  s.textContent = CSS_0;
  document.head.appendChild(s);
}

function Button({
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
  ensure_0();
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

// ===== Badge.jsx =====
const CSS_1 = `
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

let injected_1 = false;
function ensure_1() {
  if (injected_1 || typeof document === 'undefined') return;
  injected_1 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'badge');
  s.textContent = CSS_1;
  document.head.appendChild(s);
}

function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  className = '',
  ...rest
}) {
  ensure_1();
  const cls = ['tm-badge', `tm-badge--${tone}`, `tm-badge--${variant}`, `tm-badge--${size}`, className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && <span className="tm-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

// ===== FuelTag.jsx =====
const FUEL = {
  nafta:     { label: 'Nafta',     fg: 'var(--c-fuel-nafta)',   bg: 'var(--c-fuel-nafta-bg)',   icon: 'fuel' },
  electrico: { label: 'Eléctrico', fg: 'var(--c-fuel-elec)',    bg: 'var(--c-fuel-elec-bg)',    icon: 'zap' },
  hibrido:   { label: 'Híbrido',   fg: 'var(--c-fuel-hibrido)', bg: 'var(--c-fuel-hibrido-bg)', icon: 'leaf' },
  diesel:    { label: 'Diésel',    fg: 'var(--c-fuel-diesel)',  bg: 'var(--c-fuel-diesel-bg)',  icon: 'container' },
};

const CSS_2 = `
.tm-fuel {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-weight: 500; font-size: var(--text-xs);
  letter-spacing: 0.01em; line-height: 1; border-radius: var(--radius-pill);
  padding: 5px 11px 5px 9px; white-space: nowrap;
}
.tm-fuel__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex: none; }
.tm-fuel--plain { background: transparent; padding-left: 0; padding-right: 0; }
`;

let injected_2 = false;
function ensure_2() {
  if (injected_2 || typeof document === 'undefined') return;
  injected_2 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'fuel');
  s.textContent = CSS_2;
  document.head.appendChild(s);
}

function FuelTag({ type = 'nafta', plain = false, className = '', ...rest }) {
  ensure_2();
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

// ===== Input.jsx =====
const CSS_3 = `
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

let injected_3 = false;
function ensure_3() {
  if (injected_3 || typeof document === 'undefined') return;
  injected_3 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'input');
  s.textContent = CSS_3;
  document.head.appendChild(s);
}

function Input({
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
  ensure_3();
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

// ===== Select.jsx =====
const CSS_4 = `
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

let injected_4 = false;
function ensure_4() {
  if (injected_4 || typeof document === 'undefined') return;
  injected_4 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'select');
  s.textContent = CSS_4;
  document.head.appendChild(s);
}

function Select({ children, options, size = 'md', placeholder, className = '', ...rest }) {
  ensure_4();
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

// ===== FilterChip.jsx =====
const CSS_5 = `
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

let injected_5 = false;
function ensure_5() {
  if (injected_5 || typeof document === 'undefined') return;
  injected_5 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'chip');
  s.textContent = CSS_5;
  document.head.appendChild(s);
}

function FilterChip({ children, active = false, count, icon = null, className = '', ...rest }) {
  ensure_5();
  const cls = ['tm-chip', active ? 'tm-chip--active' : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-pressed={active} {...rest}>
      {icon && <span className="tm-chip__ico">{icon}</span>}
      {children}
      {count != null && <span className="tm-chip__count">{count}</span>}
    </button>
  );
}

// ===== SpecGrid.jsx =====
const CSS_6 = `
.tm-specs { font-family: var(--font-sans); }
.tm-specs__group + .tm-specs__group { margin-top: var(--space-7); }
.tm-specs__gtitle {
  font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 500;
  letter-spacing: var(--tracking-label); text-transform: uppercase; color: var(--text-muted);
  margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
}
.tm-specs__grid { display: grid; grid-template-columns: repeat(var(--cols, 2), 1fr); gap: 1px; background: var(--hairline); border-radius: var(--radius-md); overflow: hidden; }
.tm-specs__row {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  background: var(--surface); padding: 12px 14px;
}
.tm-specs__k { font-size: var(--text-sm); color: var(--text-muted); }
.tm-specs__v { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 500; color: var(--text-strong); text-align: right; font-feature-settings: "tnum"; }
.tm-specs__v--hl { color: var(--accent-ink); }
`;

let injected_6 = false;
function ensure_6() {
  if (injected_6 || typeof document === 'undefined') return;
  injected_6 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'specs');
  s.textContent = CSS_6;
  document.head.appendChild(s);
}

function Grid({ items, cols }) {
  return (
    <div className="tm-specs__grid" style={{ '--cols': cols }}>
      {items.map((it, i) => (
        <div className="tm-specs__row" key={i}>
          <span className="tm-specs__k">{it.label}</span>
          <span className={`tm-specs__v${it.highlight ? ' tm-specs__v--hl' : ''}`}>{it.value}</span>
        </div>
      ))}
    </div>
  );
}

function SpecGrid({ items, groups, cols = 2, className = '' }) {
  ensure_6();
  return (
    <div className={['tm-specs', className].filter(Boolean).join(' ')}>
      {groups
        ? groups.map((g, i) => (
            <section className="tm-specs__group" key={i}>
              {g.title && <h4 className="tm-specs__gtitle">{g.title}</h4>}
              <Grid items={g.items} cols={cols} />
            </section>
          ))
        : <Grid items={items || []} cols={cols} />}
    </div>
  );
}

// ===== VehicleCard.jsx =====
const CSS_7 = `
.tm-vcard {
  display: flex; flex-direction: column; background: var(--surface);
  border: var(--border-w) solid var(--border); border-radius: var(--radius-lg);
  overflow: hidden; cursor: pointer; text-decoration: none; color: inherit;
  box-shadow: var(--shadow-xs);
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
}
.tm-vcard:hover { transform: translateY(-3px); box-shadow: var(--shadow-card); border-color: var(--border-strong); }
.tm-vcard:focus-visible { outline: none; box-shadow: var(--focus-ring); }

.tm-vcard__media { position: relative; aspect-ratio: 16 / 10; background:
  radial-gradient(120% 120% at 50% 0%, var(--surface) 0%, var(--surface-sunken) 100%);
  display: grid; place-items: center; overflow: hidden; }
.tm-vcard__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tm-vcard__ph { width: 46%; opacity: 0.12; color: var(--c-ink-900); }
.tm-vcard__topl { position: absolute; top: 10px; left: 10px; display: flex; gap: 6px; }
.tm-vcard__topr { position: absolute; top: 10px; right: 10px; }
.tm-vcard__fuel { position: absolute; bottom: 10px; left: 10px; background: var(--surface); box-shadow: var(--shadow-sm); }
.tm-vcard__save {
  width: 34px; height: 34px; border-radius: var(--radius-pill); border: none;
  background: rgba(255,255,255,0.92); backdrop-filter: blur(4px); color: var(--text-muted);
  display: grid; place-items: center; cursor: pointer; box-shadow: var(--shadow-sm);
  transition: color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}
.tm-vcard__save:hover { transform: scale(1.08); color: var(--text-strong); }
.tm-vcard__save[data-on="true"] { color: var(--danger); }

.tm-cond {
  font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.04em;
  text-transform: uppercase; padding: 4px 8px; border-radius: var(--radius-sm);
  background: var(--c-ink-900); color: #fff;
}
.tm-cond--used { background: var(--surface); color: var(--text-body); box-shadow: var(--shadow-sm); }

.tm-vcard__body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
.tm-vcard__ey { font-family: var(--font-sans); font-size: var(--text-xs); font-weight: 600; color: var(--text-muted); }
.tm-vcard__model { font-family: var(--font-display); font-weight: 700; font-size: var(--text-xl); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.1; margin: 1px 0 0; }
.tm-vcard__trim { font-size: var(--text-sm); color: var(--text-muted); margin: 2px 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tm-vcard__foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--hairline); }
.tm-vcard__price { font-family: var(--font-mono); font-weight: 500; font-size: var(--text-lg); color: var(--price); letter-spacing: -0.01em; font-feature-settings: "tnum"; }
.tm-vcard__price .cur { font-size: var(--text-xs); color: var(--text-muted); margin-right: 3px; }
.tm-vcard__power { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); }
`;

let injected_7 = false;
function ensure_7() {
  if (injected_7 || typeof document === 'undefined') return;
  injected_7 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'vcard');
  s.textContent = CSS_7;
  document.head.appendChild(s);
}

const GaugePH = () => (
  <svg className="tm-vcard__ph" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M12.74 31.5 A13 13 0 1 1 35.26 31.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="21.5" y1="28.7" x2="30.3" y2="16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="25" r="3" fill="currentColor" />
  </svg>
);

function fmt(n) {
  if (typeof n !== 'number') return n;
  return n.toLocaleString('es-UY');
}

function VehicleCard({
  brand,
  model,
  trim,
  year,
  price,
  currency = 'USD',
  power,
  fuel = 'nafta',
  condition = 'Nuevo',
  image,
  saved = false,
  onToggleSave,
  as = 'a',
  className = '',
  ...rest
}) {
  ensure_7();
  const Tag = as;
  const used = String(condition).toLowerCase().startsWith('us');
  return (
    <Tag className={['tm-vcard', className].filter(Boolean).join(' ')} {...rest}>
      <div className="tm-vcard__media">
        {image ? <img src={image} alt={`${brand} ${model}`} /> : <GaugePH />}
        <div className="tm-vcard__topl">
          <span className={`tm-cond${used ? ' tm-cond--used' : ''}`}>{condition}</span>
        </div>
        {onToggleSave && (
          <div className="tm-vcard__topr">
            <button
              type="button"
              className="tm-vcard__save"
              data-on={saved}
              aria-label={saved ? 'Quitar de guardados' : 'Guardar'}
              aria-pressed={saved}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(e); }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
              </svg>
            </button>
          </div>
        )}
        <FuelTag type={fuel} className="tm-vcard__fuel" />
      </div>
      <div className="tm-vcard__body">
        <span className="tm-vcard__ey">{[brand, year].filter(Boolean).join(' · ')}</span>
        <h3 className="tm-vcard__model">{model}</h3>
        {trim && <p className="tm-vcard__trim">{trim}</p>}
        <div className="tm-vcard__foot">
          <span className="tm-vcard__price"><span className="cur">{currency}</span>{fmt(price)}</span>
          {power && <span className="tm-vcard__power">{power} HP</span>}
        </div>
      </div>
    </Tag>
  );
}

// ===== Logo.jsx =====
const CSS_8 = `
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

let injected_8 = false;
function ensure_8() {
  if (injected_8 || typeof document === 'undefined') return;
  injected_8 = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'logo');
  s.textContent = CSS_8;
  document.head.appendChild(s);
}

function Mark({ size = 40, ...rest }) {
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

function Logo({ size = 30, inverse = false, showUY = true, markOnly = false, as = 'a', className = '', ...rest }) {
  ensure_8();
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

window.TM = { Button, Badge, FuelTag, Input, Select, FilterChip, SpecGrid, VehicleCard, Logo, Mark };
Object.assign(window, window.TM);
