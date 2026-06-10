/* @ds-bundle: {"format":3,"namespace":"TodoMotorDesignSystem_d01d9d","components":[{"name":"Badge","sourcePath":"components/badges/Badge.jsx"},{"name":"FuelTag","sourcePath":"components/badges/FuelTag.jsx"},{"name":"Mark","sourcePath":"components/brand/Logo.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"SpecGrid","sourcePath":"components/catalog/SpecGrid.jsx"},{"name":"VehicleCard","sourcePath":"components/catalog/VehicleCard.jsx"},{"name":"FilterChip","sourcePath":"components/forms/FilterChip.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"}],"sourceHashes":{"components/badges/Badge.jsx":"254acf432aaa","components/badges/FuelTag.jsx":"82c8461b77b9","components/brand/Logo.jsx":"3f004f6ba2da","components/buttons/Button.jsx":"5b425df91c55","components/catalog/SpecGrid.jsx":"3e6fa1ba7bc6","components/catalog/VehicleCard.jsx":"747f65a32c99","components/forms/FilterChip.jsx":"37283df5257e","components/forms/Input.jsx":"c0390aba7929","components/forms/Select.jsx":"ecfa32cc36c6","ui_kits/todomotor/app.jsx":"21087747a885","ui_kits/todomotor/blog.jsx":"6ed500c997b7","ui_kits/todomotor/chrome.jsx":"f6bf1c94dfd8","ui_kits/todomotor/compare.jsx":"a46cc0ed7891","ui_kits/todomotor/data.jsx":"a73169c2a1fe","ui_kits/todomotor/detail.jsx":"2e10c8a77140","ui_kits/todomotor/home.jsx":"945d7a955807","ui_kits/todomotor/inventory.jsx":"c65ea77d6460","ui_kits/todomotor/lib.jsx":"c7255569cb51"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TodoMotorDesignSystem_d01d9d = window.TodoMotorDesignSystem_d01d9d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/badges/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Badge({
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
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "tm-badge__dot",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badges/Badge.jsx", error: String((e && e.message) || e) }); }

// components/badges/FuelTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FUEL = {
  nafta: {
    label: 'Nafta',
    fg: 'var(--c-fuel-nafta)',
    bg: 'var(--c-fuel-nafta-bg)',
    icon: 'fuel'
  },
  electrico: {
    label: 'Eléctrico',
    fg: 'var(--c-fuel-elec)',
    bg: 'var(--c-fuel-elec-bg)',
    icon: 'zap'
  },
  hibrido: {
    label: 'Híbrido',
    fg: 'var(--c-fuel-hibrido)',
    bg: 'var(--c-fuel-hibrido-bg)',
    icon: 'leaf'
  },
  diesel: {
    label: 'Diésel',
    fg: 'var(--c-fuel-diesel)',
    bg: 'var(--c-fuel-diesel-bg)',
    icon: 'container'
  }
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
function FuelTag({
  type = 'nafta',
  plain = false,
  className = '',
  ...rest
}) {
  ensure();
  const f = FUEL[type] || FUEL.nafta;
  const cls = ['tm-fuel', plain ? 'tm-fuel--plain' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      color: f.fg,
      background: plain ? 'transparent' : f.bg
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "tm-fuel__dot",
    "aria-hidden": "true"
  }), f.label);
}
FuelTag.types = Object.keys(FUEL);
Object.assign(__ds_scope, { FuelTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badges/FuelTag.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Mark({
  size = 40,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    className: "tm-logo__mark",
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    role: "img",
    "aria-label": "TodoMotor"
  }, rest), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "46",
    height: "46",
    rx: "12",
    fill: "var(--accent)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12.74 31.5 A13 13 0 1 1 35.26 31.5",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12.74",
    y1: "18.5",
    x2: "15.34",
    y2: "20",
    stroke: "#fff",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "24",
    y1: "12",
    x2: "24",
    y2: "15",
    stroke: "#fff",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "35.26",
    y1: "18.5",
    x2: "32.66",
    y2: "20",
    stroke: "#fff",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21.5",
    y1: "28.7",
    x2: "30.3",
    y2: "16",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "25",
    r: "3",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "25",
    r: "1.3",
    fill: "var(--accent)"
  }));
}
function Logo({
  size = 30,
  inverse = false,
  showUY = true,
  markOnly = false,
  as = 'a',
  className = '',
  ...rest
}) {
  ensure();
  const Tag = as;
  const markSize = Math.round(size * 1.5);
  if (markOnly) return /*#__PURE__*/React.createElement(Mark, {
    size: markSize
  });
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: ['tm-logo', inverse ? 'tm-logo--inverse' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement(Mark, {
    size: markSize
  }), /*#__PURE__*/React.createElement("span", {
    className: "tm-logo__wm",
    style: {
      fontSize: size
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tm-logo__todo"
  }, "todo"), /*#__PURE__*/React.createElement("span", {
    className: "tm-logo__motor"
  }, "motor")), showUY && /*#__PURE__*/React.createElement("span", {
    className: "tm-logo__uy",
    style: {
      fontSize: Math.max(10, size * 0.34),
      paddingBottom: size * 0.12
    }
  }, "UY"));
}
Object.assign(__ds_scope, { Mark, Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  ensure();
  const Tag = as;
  const cls = ['tm-btn', `tm-btn--${size}`, variant !== 'primary' ? `tm-btn--${variant}` : '', block ? 'tm-btn--block' : '', iconOnly ? 'tm-btn--icon' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    disabled: Tag === 'button' ? disabled || loading : undefined
  }, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "tm-btn__spinner",
    "aria-hidden": "true"
  }), !loading && iconLeft, !iconOnly && children, !loading && iconRight, iconOnly && loading ? null : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/catalog/SpecGrid.jsx
try { (() => {
const CSS = `
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
let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'specs');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Grid({
  items,
  cols
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tm-specs__grid",
    style: {
      '--cols': cols
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "tm-specs__row",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "tm-specs__k"
  }, it.label), /*#__PURE__*/React.createElement("span", {
    className: `tm-specs__v${it.highlight ? ' tm-specs__v--hl' : ''}`
  }, it.value))));
}
function SpecGrid({
  items,
  groups,
  cols = 2,
  className = ''
}) {
  ensure();
  return /*#__PURE__*/React.createElement("div", {
    className: ['tm-specs', className].filter(Boolean).join(' ')
  }, groups ? groups.map((g, i) => /*#__PURE__*/React.createElement("section", {
    className: "tm-specs__group",
    key: i
  }, g.title && /*#__PURE__*/React.createElement("h4", {
    className: "tm-specs__gtitle"
  }, g.title), /*#__PURE__*/React.createElement(Grid, {
    items: g.items,
    cols: cols
  }))) : /*#__PURE__*/React.createElement(Grid, {
    items: items || [],
    cols: cols
  }));
}
Object.assign(__ds_scope, { SpecGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/SpecGrid.jsx", error: String((e && e.message) || e) }); }

// components/catalog/VehicleCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
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
let injected = false;
function ensure() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tm', 'vcard');
  s.textContent = CSS;
  document.head.appendChild(s);
}
const GaugePH = () => /*#__PURE__*/React.createElement("svg", {
  className: "tm-vcard__ph",
  viewBox: "0 0 48 48",
  fill: "none",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12.74 31.5 A13 13 0 1 1 35.26 31.5",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("line", {
  x1: "21.5",
  y1: "28.7",
  x2: "30.3",
  y2: "16",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "24",
  cy: "25",
  r: "3",
  fill: "currentColor"
}));
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
  ensure();
  const Tag = as;
  const used = String(condition).toLowerCase().startsWith('us');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: ['tm-vcard', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__media"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: `${brand} ${model}`
  }) : /*#__PURE__*/React.createElement(GaugePH, null), /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__topl"
  }, /*#__PURE__*/React.createElement("span", {
    className: `tm-cond${used ? ' tm-cond--used' : ''}`
  }, condition)), onToggleSave && /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__topr"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tm-vcard__save",
    "data-on": saved,
    "aria-label": saved ? 'Quitar de guardados' : 'Guardar',
    "aria-pressed": saved,
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
      onToggleSave(e);
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: saved ? 'currentColor' : 'none',
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"
  })))), /*#__PURE__*/React.createElement(__ds_scope.FuelTag, {
    type: fuel,
    className: "tm-vcard__fuel"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tm-vcard__ey"
  }, [brand, year].filter(Boolean).join(' · ')), /*#__PURE__*/React.createElement("h3", {
    className: "tm-vcard__model"
  }, model), trim && /*#__PURE__*/React.createElement("p", {
    className: "tm-vcard__trim"
  }, trim), /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tm-vcard__price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, currency), fmt(price)), power && /*#__PURE__*/React.createElement("span", {
    className: "tm-vcard__power"
  }, power, " HP"))));
}
Object.assign(__ds_scope, { VehicleCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/VehicleCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/FilterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function FilterChip({
  children,
  active = false,
  count,
  icon = null,
  className = '',
  ...rest
}) {
  ensure();
  const cls = ['tm-chip', active ? 'tm-chip--active' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-pressed": active
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    className: "tm-chip__ico"
  }, icon), children, count != null && /*#__PURE__*/React.createElement("span", {
    className: "tm-chip__count"
  }, count));
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  ensure();
  const fid = id || (label ? `tm-${String(label).toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const inputCls = ['tm-input', `tm-input--${size}`, iconLeft ? 'tm-input--has-left' : '', iconRight ? 'tm-input--has-right' : ''].filter(Boolean).join(' ');
  const fieldCls = ['tm-field', error ? 'tm-field--error' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: fieldCls
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "tm-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "tm-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "tm-input-wrap"
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    className: "tm-input__icon tm-input__icon--left"
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: inputCls,
    "aria-invalid": !!error || undefined
  }, rest)), iconRight && /*#__PURE__*/React.createElement("span", {
    className: "tm-input__icon tm-input__icon--right"
  }, iconRight)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: "tm-field__hint"
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Select({
  children,
  options,
  size = 'md',
  placeholder,
  className = '',
  ...rest
}) {
  ensure();
  const cls = ['tm-select', size === 'sm' ? 'tm-select--sm' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", {
    className: "tm-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: cls
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options ? options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  }) : children), /*#__PURE__*/React.createElement("span", {
    className: "tm-select__chev",
    "aria-hidden": "true"
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/app.jsx
try { (() => {
/* TodoMotor UI kit — app shell / router. */

function App() {
  const {
    Header,
    Footer
  } = window.TMC;
  const {
    Home,
    Inventory,
    Detail,
    Compare,
    Blog
  } = window.Screens;
  const load = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return d;
    }
  };
  const [route, setRoute] = React.useState(() => load('tm_route', {
    name: 'home'
  }));
  const [saved, setSaved] = React.useState(() => load('tm_saved', {}));
  const [theme, setTheme] = React.useState(() => load('tm_theme', 'cobalt'));
  const [query, setQuery] = React.useState('');
  React.useEffect(() => {
    localStorage.setItem('tm_route', JSON.stringify(route));
  }, [route]);
  React.useEffect(() => {
    localStorage.setItem('tm_saved', JSON.stringify(saved));
  }, [saved]);
  React.useEffect(() => {
    localStorage.setItem('tm_theme', JSON.stringify(theme));
    document.documentElement.dataset.theme = theme === 'signal' ? 'signal' : '';
  }, [theme]);

  // refresh lucide icons after every render
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const onNav = r => {
    setRoute(r);
    window.scrollTo({
      top: 0,
      behavior: 'instant' in window ? 'instant' : 'auto'
    });
  };
  const toggleSave = id => setSaved(s => {
    const n = {
      ...s
    };
    if (n[id]) delete n[id];else n[id] = true;
    return n;
  });
  const savedCount = Object.keys(saved).length;
  let Screen = Home;
  if (route.name === 'inventory') Screen = Inventory;else if (route.name === 'detail') Screen = Detail;else if (route.name === 'compare') Screen = Compare;else if (route.name === 'blog') Screen = Blog;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    route: route.name,
    onNav: onNav,
    savedCount: savedCount,
    theme: theme,
    onTheme: setTheme,
    query: query,
    onQuery: setQuery
  }), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Screen, {
    route: route,
    onNav: onNav,
    saved: saved,
    toggleSave: toggleSave
  })), /*#__PURE__*/React.createElement(Footer, {
    onNav: onNav
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/blog.jsx
try { (() => {
/* TodoMotor UI kit — Blog index + article. window.Screens.Blog */

const BLOG_CSS = `
.bl { max-width: var(--container-wide); margin: 0 auto; padding: 36px 24px 0; }
.bl__head { margin-bottom: 28px; }
.bl__kicker { font-family: var(--font-mono); font-size: var(--text-xs); letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); }
.bl__title { font-size: var(--text-5xl); letter-spacing: -0.035em; margin: 8px 0 0; }
.bl__sub { color: var(--text-muted); font-size: var(--text-lg); margin: 10px 0 0; }
.bl__feat { display: grid; grid-template-columns: 1.1fr 1fr; gap: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden; cursor: pointer; margin-bottom: 28px; }
.bl__feat:hover { box-shadow: var(--shadow-card); }
.bl__featimg { background: linear-gradient(135deg, var(--accent-faint), var(--surface-sunken)); display: grid; place-items: center; color: var(--accent); min-height: 280px; }
.bl__featb { padding: 36px; display: flex; flex-direction: column; justify-content: center; }
.bl__featb .t { font-family: var(--font-display); font-weight: 700; font-size: var(--text-3xl); letter-spacing: -0.025em; line-height: 1.1; color: var(--text-strong); margin: 14px 0; }
.bl__featb .x { color: var(--text-body); font-size: var(--text-md); line-height: 1.55; }
.bl__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.bl__card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; display: flex; flex-direction: column; transition: box-shadow var(--dur), transform var(--dur), border-color var(--dur); }
.bl__card:hover { box-shadow: var(--shadow-card); transform: translateY(-3px); border-color: var(--border-strong); }
.bl__cardtop { height: 130px; background: linear-gradient(135deg, var(--surface-sunken), var(--bg-app)); display: grid; place-items: center; color: var(--accent); }
.bl__cardb { padding: 18px 20px 20px; }
.bl__meta { display: flex; align-items: center; gap: 10px; }
.bl__tag { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); }
.bl__date { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-faint); }
.bl__cardt { font-family: var(--font-display); font-weight: 700; font-size: var(--text-lg); color: var(--text-strong); line-height: 1.2; margin: 10px 0 6px; letter-spacing: -0.01em; }
.bl__cardx { color: var(--text-muted); font-size: var(--text-sm); line-height: 1.5; }

.art { max-width: 720px; margin: 0 auto; padding: 32px 24px 0; }
.art__back { font-family: var(--font-sans); font-weight: 600; color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: var(--text-sm); }
.art__back:hover { color: var(--text-strong); }
.art__meta { display: flex; align-items: center; gap: 10px; margin: 24px 0 14px; }
.art__title { font-size: clamp(32px, 4.5vw, 52px); letter-spacing: -0.03em; line-height: 1.04; }
.art__hero { aspect-ratio: 16/8; border-radius: var(--radius-xl); background: linear-gradient(135deg, var(--accent-faint), var(--surface-sunken)); display: grid; place-items: center; color: var(--accent); margin: 28px 0; }
.art__body p { font-size: var(--text-lg); line-height: 1.7; color: var(--text-body); margin: 0 0 20px; }
.art__body h3 { font-size: var(--text-2xl); letter-spacing: -0.02em; margin: 34px 0 14px; }
@media (max-width: 900px){ .bl__feat{ grid-template-columns: 1fr; } .bl__grid{ grid-template-columns: 1fr; } }
`;
(function () {
  if (typeof document !== 'undefined' && !document.querySelector('[data-tm="blog"]')) {
    const s = document.createElement('style');
    s.setAttribute('data-tm', 'blog');
    s.textContent = BLOG_CSS;
    document.head.appendChild(s);
  }
})();
const BODIES = {
  mercosur: ['El principio de acuerdo entre el Mercosur y la Unión Europea reordena, de a poco, el tablero del sector automotor uruguayo. Para un mercado chico y casi totalmente importador como el nuestro, cada décima de arancel se traslada al precio de góndola.', 'La baja de aranceles es gradual y se extiende por varios años, con cronogramas distintos según se trate de autos terminados, motos o autopartes. En el corto plazo el efecto sobre los 0 km europeos es marginal; el grueso del ajuste llega en tramos posteriores.', 'Para el comprador particular, la lectura es simple: no conviene esperar un derrumbe de precios inmediato, pero sí vale la pena seguir los plazos. En categorías premium de origen europeo, la diferencia acumulada puede volverse relevante.'],
  impuestos: ['Cuando mirás el precio de un 0 km en Uruguay y lo comparás con el de origen, la brecha sorprende. Buena parte de esa diferencia no es del importador: es impositiva.', 'Sobre el valor en aduana se aplican aranceles, después el IMESI —que varía según cilindrada y tipo de vehículo— y finalmente el IVA, que se calcula sobre la base ya recargada. Es decir: impuesto sobre impuesto.', 'Entender esta composición ayuda a leer mejor las fichas. Dos autos con precios de lista parecidos pueden tener cargas muy distintas según su motorización, y eso explica saltos de precio que a primera vista no cierran.'],
  '200cc': ['La cilindrada define mucho más que la potencia: marca el tipo de libreta que necesitás y, en los hechos, condiciona cómo arranca buena parte de los motociclistas uruguayos.', 'La franja hasta 200cc concentra la mayoría del parque por una mezcla de precio, consumo y requisitos. Pasar esa barrera implica otra categoría de licencia y, muchas veces, otro nivel de seguro.', 'La recomendación es clara: antes de elegir una moto por estética o precio, revisá la cilindrada y el camino correcto para circular en regla. La ficha técnica es el primer lugar donde mirarlo.']
};
function Blog({
  route,
  onNav
}) {
  const {
    POSTS
  } = window.TMK;
  const {
    Icon
  } = window.TMC;
  if (route.post) {
    const p = POSTS.find(x => x.id === route.post) || POSTS[0];
    const body = BODIES[p.id] || [];
    return /*#__PURE__*/React.createElement("div", {
      className: "art"
    }, /*#__PURE__*/React.createElement("span", {
      className: "art__back",
      onClick: () => onNav({
        name: 'blog'
      })
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "arrow-left",
      size: 16
    }), " Volver al blog"), /*#__PURE__*/React.createElement("div", {
      className: "art__meta"
    }, /*#__PURE__*/React.createElement(window.TM.Badge, {
      tone: "accent"
    }, p.tag), /*#__PURE__*/React.createElement("span", {
      className: "bl__date"
    }, p.date, " \xB7 4 min de lectura")), /*#__PURE__*/React.createElement("h1", {
      className: "art__title"
    }, p.title), /*#__PURE__*/React.createElement("div", {
      className: "art__hero"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "newspaper",
      size: 44
    })), /*#__PURE__*/React.createElement("div", {
      className: "art__body"
    }, body.map((para, i) => /*#__PURE__*/React.createElement("p", {
      key: i
    }, para)), /*#__PURE__*/React.createElement("h3", null, "En resumen"), /*#__PURE__*/React.createElement("p", null, p.excerpt, " Segu\xED las fichas t\xE9cnicas de TodoMotor para comparar con datos antes de decidir.")));
  }
  const [feat, ...rest] = POSTS;
  return /*#__PURE__*/React.createElement("div", {
    className: "bl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bl__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl__kicker"
  }, "Blog del Motor"), /*#__PURE__*/React.createElement("h1", {
    className: "bl__title"
  }, "Contexto para comprar mejor"), /*#__PURE__*/React.createElement("p", {
    className: "bl__sub"
  }, "Impuestos, normativa y gu\xEDas del mercado automotor uruguayo.")), /*#__PURE__*/React.createElement("article", {
    className: "bl__feat",
    onClick: () => onNav({
      name: 'blog',
      post: feat.id
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "bl__featimg"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "newspaper",
    size: 52
  })), /*#__PURE__*/React.createElement("div", {
    className: "bl__featb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bl__meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl__tag"
  }, feat.tag), /*#__PURE__*/React.createElement("span", {
    className: "bl__date"
  }, feat.date)), /*#__PURE__*/React.createElement("h2", {
    className: "t"
  }, feat.title), /*#__PURE__*/React.createElement("p", {
    className: "x"
  }, feat.excerpt), /*#__PURE__*/React.createElement("span", {
    className: "h-link",
    style: {
      marginTop: 16,
      color: 'var(--accent)',
      fontWeight: 600,
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, "Leer art\xEDculo ", /*#__PURE__*/React.createElement(Icon, {
    n: "arrow-right",
    size: 16
  })))), /*#__PURE__*/React.createElement("div", {
    className: "bl__grid"
  }, rest.concat(POSTS).slice(0, 6).map((p, i) => /*#__PURE__*/React.createElement("article", {
    className: "bl__card",
    key: p.id + i,
    onClick: () => onNav({
      name: 'blog',
      post: p.id
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "bl__cardtop"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: p.tag === 'Motos' ? 'bike' : p.tag === 'Impuestos' ? 'receipt' : 'globe',
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    className: "bl__cardb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bl__meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl__tag"
  }, p.tag), /*#__PURE__*/React.createElement("span", {
    className: "bl__date"
  }, p.date)), /*#__PURE__*/React.createElement("h3", {
    className: "bl__cardt"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "bl__cardx"
  }, p.excerpt))))));
}
window.Screens = Object.assign(window.Screens || {}, {
  Blog
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/blog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/chrome.jsx
try { (() => {
/* TodoMotor UI kit — Header, Footer, Icon. Exposes window.TMC. */

function Icon({
  n,
  size = 18,
  style
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      ...style
    }
  });
}
const CHROME_CSS = `
.k-header { position: sticky; top: 0; z-index: 100; background: color-mix(in srgb, var(--surface) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
.k-header__in { max-width: var(--container-wide); margin: 0 auto; height: 64px; display: flex; align-items: center; gap: 28px; padding: 0 24px; }
.k-nav { display: flex; align-items: center; gap: 4px; }
.k-nav a { font-family: var(--font-sans); font-size: var(--text-base); font-weight: 600; color: var(--text-body); padding: 8px 12px; border-radius: var(--radius-md); cursor: pointer; }
.k-nav a:hover { background: var(--surface-sunken); color: var(--text-strong); }
.k-nav a.is-active { color: var(--accent); }
.k-search { flex: 1; max-width: 360px; position: relative; display: flex; align-items: center; }
.k-search i { position: absolute; left: 13px; color: var(--text-muted); }
.k-search input { width: 100%; height: 40px; border: 1px solid var(--border-strong); border-radius: var(--radius-pill); background: var(--surface); padding: 0 16px 0 38px; font-family: var(--font-sans); font-size: var(--text-base); color: var(--text-strong); }
.k-search input::placeholder { color: var(--text-faint); }
.k-search input:focus { outline: none; border-color: var(--accent); box-shadow: var(--focus-ring); }
.k-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.k-icbtn { height: 40px; min-width: 40px; padding: 0 12px; border-radius: var(--radius-md); border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-body); display: inline-flex; align-items: center; gap: 7px; cursor: pointer; font-family: var(--font-sans); font-size: var(--text-sm); font-weight: 600; }
.k-icbtn:hover { background: var(--surface-sunken); }
.k-icbtn__count { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--accent); }
.k-theme { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-pill); overflow: hidden; }
.k-theme button { border: none; background: var(--surface); color: var(--text-muted); width: 38px; height: 38px; display: grid; place-items: center; cursor: pointer; }
.k-theme button.on { background: var(--accent); color: #fff; }

.k-footer { background: var(--brand-deep); color: var(--text-on-inverse); margin-top: 64px; }
.k-footer__in { max-width: var(--container-wide); margin: 0 auto; padding: 48px 24px 36px; display: flex; flex-wrap: wrap; gap: 40px; justify-content: space-between; }
.k-footer__cols { display: flex; gap: 64px; flex-wrap: wrap; }
.k-footer__col h5 { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-inverse-muted); margin: 0 0 14px; font-weight: 500; }
.k-footer__col a { display: block; color: var(--text-on-inverse); font-size: var(--text-base); padding: 5px 0; cursor: pointer; opacity: 0.85; }
.k-footer__col a:hover { opacity: 1; color: #fff; }
.k-footer__bottom { border-top: 1px solid var(--border-inverse); }
.k-footer__bottom .in { max-width: var(--container-wide); margin: 0 auto; padding: 18px 24px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-inverse-muted); }
`;
(function () {
  if (typeof document !== 'undefined' && !document.querySelector('[data-tm="chrome"]')) {
    const s = document.createElement('style');
    s.setAttribute('data-tm', 'chrome');
    s.textContent = CHROME_CSS;
    document.head.appendChild(s);
  }
})();
function Header({
  route,
  onNav,
  savedCount = 0,
  theme = 'cobalt',
  onTheme,
  query = '',
  onQuery
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "k-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-header__in"
  }, /*#__PURE__*/React.createElement(Logo, {
    as: "div",
    size: 26,
    onClick: () => onNav({
      name: 'home'
    }),
    style: {
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    className: "k-nav"
  }, /*#__PURE__*/React.createElement("a", {
    className: route === 'inventory' ? 'is-active' : '',
    onClick: () => onNav({
      name: 'inventory',
      cat: 'all'
    })
  }, "Veh\xEDculos"), /*#__PURE__*/React.createElement("a", {
    className: route === 'blog' ? 'is-active' : '',
    onClick: () => onNav({
      name: 'blog'
    })
  }, "Blog")), /*#__PURE__*/React.createElement("div", {
    className: "k-search"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "search",
    size: 17
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Buscar marca o modelo\u2026",
    value: query,
    onChange: e => onQuery && onQuery(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') onNav({
        name: 'inventory',
        cat: 'all',
        q: query
      });
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-theme",
    title: "Cambiar direcci\xF3n visual"
  }, /*#__PURE__*/React.createElement("button", {
    className: theme === 'cobalt' ? 'on' : '',
    onClick: () => onTheme('cobalt'),
    "aria-label": "Cobalt"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "droplet",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: theme === 'signal' ? 'on' : '',
    onClick: () => onTheme('signal'),
    "aria-label": "Signal"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "flame",
    size: 16
  }))), /*#__PURE__*/React.createElement("button", {
    className: "k-icbtn",
    onClick: () => onNav({
      name: 'compare'
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "git-compare",
    size: 17
  }), "Comparar"), /*#__PURE__*/React.createElement("button", {
    className: "k-icbtn"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "heart",
    size: 17
  }), "Guardados ", savedCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "k-icbtn__count"
  }, savedCount)))));
}
function Footer({
  onNav
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "k-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-footer__in"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    as: "div",
    size: 24,
    inverse: true
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-inverse-muted)',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.6,
      marginTop: 14
    }
  }, "Fichas t\xE9cnicas, precios y comparativas de veh\xEDculos en Uruguay. Informaci\xF3n de referencia para decidir mejor.")), /*#__PURE__*/React.createElement("div", {
    className: "k-footer__cols"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "Cat\xE1logo"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'inventory',
      cat: 'autos'
    })
  }, "Autos"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'inventory',
      cat: 'suvs'
    })
  }, "SUVs"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'inventory',
      cat: 'pickups'
    })
  }, "Camionetas"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'inventory',
      cat: 'motos'
    })
  }, "Motos")), /*#__PURE__*/React.createElement("div", {
    className: "k-footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "TodoMotor"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'blog'
    })
  }, "Blog del Motor"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'compare'
    })
  }, "Comparador"), /*#__PURE__*/React.createElement("a", null, "C\xF3mo leemos las fichas")))), /*#__PURE__*/React.createElement("div", {
    className: "k-footer__bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "in"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 TodoMotor Uruguay \xB7 Informaci\xF3n de referencia"), /*#__PURE__*/React.createElement("span", null, "Hecho en Montevideo, Uruguay"))));
}
window.TMC = {
  Icon,
  Header,
  Footer
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/compare.jsx
try { (() => {
/* TodoMotor UI kit — Comparador. window.Screens.Compare */

const CMP_CSS = `
.cm { max-width: var(--container-wide); margin: 0 auto; padding: 28px 24px 0; }
.cm__title { font-size: var(--text-4xl); letter-spacing: -0.03em; margin: 0; }
.cm__sub { color: var(--text-muted); margin: 8px 0 24px; font-size: var(--text-lg); }
.cm__wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--surface); }
.cm__table { width: 100%; border-collapse: collapse; min-width: 720px; }
.cm__table th, .cm__table td { padding: 0; vertical-align: top; }
.cm__rowlabel { width: 180px; font-family: var(--font-mono); font-size: var(--text-xs); letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-muted); padding: 14px 18px !important; border-top: 1px solid var(--hairline); text-align: left; white-space: nowrap; background: var(--bg-app); position: sticky; left: 0; }
.cm__col { border-left: 1px solid var(--hairline); min-width: 200px; }
.cm__head { padding: 18px !important; border-bottom: 1px solid var(--border); }
.cm__hcard { display: flex; flex-direction: column; gap: 8px; }
.cm__media { aspect-ratio: 16/10; border-radius: var(--radius-md); background: radial-gradient(110% 120% at 50% 0%, var(--surface-sunken), var(--bg-app)); display: grid; place-items: center; color: var(--c-ink-300); position: relative; }
.cm__rm { position: absolute; top: 6px; right: 6px; width: 26px; height: 26px; border-radius: 50%; border: none; background: var(--surface); box-shadow: var(--shadow-sm); cursor: pointer; display: grid; place-items: center; color: var(--text-muted); }
.cm__rm:hover { color: var(--danger); }
.cm__hbrand { font-size: var(--text-sm); color: var(--text-muted); font-weight: 600; }
.cm__hmodel { font-family: var(--font-display); font-weight: 700; font-size: var(--text-lg); color: var(--text-strong); line-height: 1.1; }
.cm__htrim { font-size: var(--text-xs); color: var(--text-muted); }
.cm__cell { padding: 14px 18px !important; border-top: 1px solid var(--hairline); font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text-strong); font-feature-settings: "tnum"; }
.cm__cell.best { color: var(--positive-ink); background: var(--positive-soft); font-weight: 600; }
.cm__cell.price { font-size: var(--text-lg); }
.cm__add { padding: 18px !important; }
.cm__addbox { border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg); padding: 22px 16px; text-align: center; display: flex; flex-direction: column; gap: 12px; align-items: center; }
.cm__addbox p { margin: 0; color: var(--text-muted); font-size: var(--text-sm); }
`;
(function () {
  if (typeof document !== 'undefined' && !document.querySelector('[data-tm="cmp"]')) {
    const s = document.createElement('style');
    s.setAttribute('data-tm', 'cmp');
    s.textContent = CMP_CSS;
    document.head.appendChild(s);
  }
})();
function Compare({
  route,
  onNav,
  saved,
  toggleSave
}) {
  const {
    VEHICLES
  } = window.TMK;
  const {
    Icon
  } = window.TMC;
  const [ids, setIds] = React.useState(() => {
    const base = ['vw-taos-highline', 'renault-boreal-iconic', 'corolla-cross-hv'];
    if (route.add && !base.includes(route.add)) return [route.add, ...base].slice(0, 3);
    return base;
  });
  React.useEffect(() => {
    if (route.add) setIds(s => s.includes(route.add) ? s : [...s, route.add].slice(0, 4));
  }, [route.add]);
  const cars = ids.map(id => VEHICLES.find(v => v.id === id)).filter(Boolean);
  const remaining = VEHICLES.filter(v => !ids.includes(v.id));
  const remove = id => setIds(s => s.filter(x => x !== id));
  const add = id => {
    if (id) setIds(s => [...s, id].slice(0, 4));
  };
  const rows = [{
    k: 'Precio',
    get: v => 'USD ' + v.price.toLocaleString('es-UY'),
    best: 'min',
    val: v => v.price,
    cls: 'price'
  }, {
    k: 'Combustible',
    get: v => /*#__PURE__*/React.createElement(window.TM.FuelTag, {
      type: v.fuel,
      plain: true
    })
  }, {
    k: 'Potencia',
    get: v => v.power + ' HP',
    best: 'max',
    val: v => v.power
  }, {
    k: 'Torque',
    get: v => v.torque
  }, {
    k: '0–100 km/h',
    get: v => v.accel
  }, {
    k: 'Caja',
    get: v => v.caja
  }, {
    k: 'Tracción',
    get: v => v.traccion
  }, {
    k: 'Consumo / Autonomía',
    get: v => v.consumo
  }, {
    k: 'Baúl / Carga',
    get: v => v.baul
  }, {
    k: 'Largo',
    get: v => v.largo
  }];
  const bestId = row => {
    if (!row.best) return null;
    const vals = cars.map(c => ({
      id: c.id,
      n: row.val(c)
    }));
    const pick = row.best === 'min' ? Math.min(...vals.map(x => x.n)) : Math.max(...vals.map(x => x.n));
    return vals.filter(x => x.n === pick).map(x => x.id);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "cm"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "cm__title"
  }, "Comparador"), /*#__PURE__*/React.createElement("p", {
    className: "cm__sub"
  }, "Enfrent\xE1 hasta 4 veh\xEDculos y mir\xE1 las diferencias que importan."), /*#__PURE__*/React.createElement("div", {
    className: "cm__wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "cm__table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "cm__rowlabel",
    style: {
      borderTop: 'none'
    }
  }), cars.map(v => /*#__PURE__*/React.createElement("th", {
    className: "cm__col cm__head",
    key: v.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "cm__hcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cm__media"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cm__rm",
    onClick: () => remove(v.id),
    "aria-label": "Quitar"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "x",
    size: 15
  })), /*#__PURE__*/React.createElement(Icon, {
    n: "car-front",
    size: 26
  })), /*#__PURE__*/React.createElement("span", {
    className: "cm__hbrand"
  }, v.brand, " \xB7 ", v.year), /*#__PURE__*/React.createElement("span", {
    className: "cm__hmodel"
  }, v.model), /*#__PURE__*/React.createElement("span", {
    className: "cm__htrim"
  }, v.trim)))), cars.length < 4 && /*#__PURE__*/React.createElement("th", {
    className: "cm__col cm__add"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cm__addbox"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "plus",
    size: 22,
    style: {
      color: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement("p", null, "Agreg\xE1 un veh\xEDculo"), /*#__PURE__*/React.createElement(window.TM.Select, {
    size: "sm",
    value: "",
    placeholder: "Elegir modelo\u2026",
    onChange: e => add(e.target.value),
    options: remaining.map(r => ({
      value: r.id,
      label: r.brand + ' ' + r.model + ' · ' + r.trim
    }))
  }))))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, ri) => {
    const best = bestId(row);
    return /*#__PURE__*/React.createElement("tr", {
      key: ri
    }, /*#__PURE__*/React.createElement("td", {
      className: "cm__rowlabel"
    }, row.k), cars.map(v => /*#__PURE__*/React.createElement("td", {
      key: v.id,
      className: 'cm__col cm__cell ' + (row.cls || '') + (best && best.includes(v.id) ? ' best' : '')
    }, row.get(v))), cars.length < 4 && /*#__PURE__*/React.createElement("td", {
      className: "cm__col"
    }));
  }), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "cm__rowlabel"
  }), cars.map(v => /*#__PURE__*/React.createElement("td", {
    key: v.id,
    className: "cm__col cm__cell"
  }, /*#__PURE__*/React.createElement(window.TM.Button, {
    size: "sm",
    variant: "secondary",
    block: true,
    onClick: () => onNav({
      name: 'detail',
      id: v.id
    })
  }, "Ver ficha"))), cars.length < 4 && /*#__PURE__*/React.createElement("td", {
    className: "cm__col"
  }))))));
}
window.Screens = Object.assign(window.Screens || {}, {
  Compare
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/compare.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/data.jsx
try { (() => {
/* TodoMotor UI kit — shared data + chrome. Exposes window.TMK. */

const VEHICLES = [{
  id: 'vw-taos-highline',
  brand: 'Volkswagen',
  model: 'Taos',
  trim: 'Highline 250 TSI 1.4 A/T',
  year: 2026,
  price: 42390,
  power: 150,
  fuel: 'nafta',
  cat: 'suvs',
  condition: 'Nuevo',
  torque: '250 Nm',
  accel: '8,9 s',
  cc: '1.4 L',
  caja: 'DSG 6v',
  traccion: 'Delantera',
  tanque: '51 L',
  consumo: '14,1 km/L',
  largo: '4.461 mm',
  baul: '498 L'
}, {
  id: 'vw-taos-comfort',
  brand: 'Volkswagen',
  model: 'Taos',
  trim: 'Comfortline 250 TSI 1.4 A/T',
  year: 2026,
  price: 40390,
  power: 150,
  fuel: 'nafta',
  cat: 'suvs',
  condition: 'Nuevo',
  torque: '250 Nm',
  accel: '9,1 s',
  cc: '1.4 L',
  caja: 'DSG 6v',
  traccion: 'Delantera',
  tanque: '51 L',
  consumo: '14,1 km/L',
  largo: '4.461 mm',
  baul: '498 L'
}, {
  id: 'toyota-bz4x-awd',
  brand: 'Toyota',
  model: 'bZ4X',
  trim: 'Limited AWD-i',
  year: 2026,
  price: 52990,
  power: 338,
  fuel: 'electrico',
  cat: 'suvs',
  condition: 'Nuevo',
  torque: '337 Nm',
  accel: '6,9 s',
  cc: '71,4 kWh',
  caja: 'Automática',
  traccion: 'AWD',
  tanque: '71,4 kWh',
  consumo: '460 km',
  largo: '4.690 mm',
  baul: '452 L'
}, {
  id: 'toyota-bz4x-2wd',
  brand: 'Toyota',
  model: 'bZ4X',
  trim: 'Limited 2WD',
  year: 2026,
  price: 49990,
  power: 221,
  fuel: 'electrico',
  cat: 'suvs',
  condition: 'Nuevo',
  torque: '266 Nm',
  accel: '7,5 s',
  cc: '71,4 kWh',
  caja: 'Automática',
  traccion: 'Delantera',
  tanque: '71,4 kWh',
  consumo: '513 km',
  largo: '4.690 mm',
  baul: '452 L'
}, {
  id: 'renault-boreal-iconic',
  brand: 'Renault',
  model: 'Boreal',
  trim: 'Iconic 1.3 TCe EDC6',
  year: 2026,
  price: 41000,
  power: 156,
  fuel: 'nafta',
  cat: 'suvs',
  condition: 'Nuevo',
  torque: '270 Nm',
  accel: '9,4 s',
  cc: '1.3 L',
  caja: 'EDC 6v',
  traccion: 'Delantera',
  tanque: '50 L',
  consumo: '15,2 km/L',
  largo: '4.560 mm',
  baul: '522 L'
}, {
  id: 'renault-boreal-evo',
  brand: 'Renault',
  model: 'Boreal',
  trim: 'Evolution 1.3 TCe EDC6',
  year: 2026,
  price: 36000,
  power: 156,
  fuel: 'nafta',
  cat: 'suvs',
  condition: 'Nuevo',
  torque: '270 Nm',
  accel: '9,4 s',
  cc: '1.3 L',
  caja: 'EDC 6v',
  traccion: 'Delantera',
  tanque: '50 L',
  consumo: '15,2 km/L',
  largo: '4.560 mm',
  baul: '522 L'
}, {
  id: 'corolla-cross-hv',
  brand: 'Toyota',
  model: 'Corolla Cross',
  trim: 'XLI Hybrid e-CVT',
  year: 2026,
  price: 38900,
  power: 122,
  fuel: 'hibrido',
  cat: 'suvs',
  condition: 'Nuevo',
  torque: '185 Nm',
  accel: '9,1 s',
  cc: '1.8 L',
  caja: 'e-CVT',
  traccion: 'Delantera',
  tanque: '36 L',
  consumo: '24,0 km/L',
  largo: '4.460 mm',
  baul: '440 L'
}, {
  id: 'corolla-xei',
  brand: 'Toyota',
  model: 'Corolla',
  trim: 'XEi 2.0 CVT',
  year: 2026,
  price: 33500,
  power: 170,
  fuel: 'nafta',
  cat: 'autos',
  condition: 'Nuevo',
  torque: '200 Nm',
  accel: '8,8 s',
  cc: '2.0 L',
  caja: 'CVT',
  traccion: 'Delantera',
  tanque: '50 L',
  consumo: '13,8 km/L',
  largo: '4.630 mm',
  baul: '470 L'
}, {
  id: 'vw-amarok-v6',
  brand: 'Volkswagen',
  model: 'Amarok',
  trim: 'V6 Highline 3.0 TDI',
  year: 2026,
  price: 58000,
  power: 258,
  fuel: 'diesel',
  cat: 'pickups',
  condition: 'Nuevo',
  torque: '580 Nm',
  accel: '7,9 s',
  cc: '3.0 L',
  caja: 'Automática 8v',
  traccion: '4x4',
  tanque: '80 L',
  consumo: '11,2 km/L',
  largo: '5.350 mm',
  baul: '1.050 kg'
}, {
  id: 'toyota-hilux-srx',
  brand: 'Toyota',
  model: 'Hilux',
  trim: 'SRX 2.8 TDI 4x4',
  year: 2026,
  price: 54500,
  power: 204,
  fuel: 'diesel',
  cat: 'pickups',
  condition: 'Nuevo',
  torque: '500 Nm',
  accel: '10,7 s',
  cc: '2.8 L',
  caja: 'Automática 6v',
  traccion: '4x4',
  tanque: '80 L',
  consumo: '12,1 km/L',
  largo: '5.325 mm',
  baul: '1.000 kg'
}, {
  id: 'byd-dolphin',
  brand: 'BYD',
  model: 'Dolphin',
  trim: 'GL 44 kWh',
  year: 2026,
  price: 28900,
  power: 95,
  fuel: 'electrico',
  cat: 'autos',
  condition: 'Nuevo',
  torque: '180 Nm',
  accel: '12,3 s',
  cc: '44,9 kWh',
  caja: 'Automática',
  traccion: 'Delantera',
  tanque: '44,9 kWh',
  consumo: '340 km',
  largo: '4.290 mm',
  baul: '345 L'
}, {
  id: 'chery-tiggo4',
  brand: 'Chery',
  model: 'Tiggo 4 Pro',
  trim: 'Comfort 1.5 CVT',
  year: 2026,
  price: 24990,
  power: 113,
  fuel: 'nafta',
  cat: 'suvs',
  condition: 'Nuevo',
  torque: '138 Nm',
  accel: '11,8 s',
  cc: '1.5 L',
  caja: 'CVT',
  traccion: 'Delantera',
  tanque: '51 L',
  consumo: '13,0 km/L',
  largo: '4.318 mm',
  baul: '340 L'
}, {
  id: 'renault-kwid',
  brand: 'Renault',
  model: 'Kwid',
  trim: 'Iconic 1.0 SCe',
  year: 2026,
  price: 15500,
  power: 66,
  fuel: 'nafta',
  cat: 'autos',
  condition: 'Nuevo',
  torque: '93 Nm',
  accel: '14,9 s',
  cc: '1.0 L',
  caja: 'Manual 5v',
  traccion: 'Delantera',
  tanque: '38 L',
  consumo: '18,9 km/L',
  largo: '3.731 mm',
  baul: '290 L'
}, {
  id: 'yamaha-mt03',
  brand: 'Yamaha',
  model: 'MT-03',
  trim: '321 cc ABS',
  year: 2026,
  price: 8900,
  power: 42,
  fuel: 'nafta',
  cat: 'motos',
  condition: 'Nuevo',
  torque: '30 Nm',
  accel: '—',
  cc: '321 cc',
  caja: 'Manual 6v',
  traccion: 'Cadena',
  tanque: '14 L',
  consumo: '27,0 km/L',
  largo: '2.090 mm',
  baul: '—'
}];
const CATEGORIES = [{
  id: 'all',
  label: 'Todos',
  icon: 'layout-grid',
  count: 1150
}, {
  id: 'autos',
  label: 'Autos',
  icon: 'car-front',
  count: 304
}, {
  id: 'suvs',
  label: 'SUVs',
  icon: 'caravan',
  count: 566
}, {
  id: 'pickups',
  label: 'Camionetas',
  icon: 'truck',
  count: 185
}, {
  id: 'motos',
  label: 'Motos',
  icon: 'bike',
  count: 91
}];
const POSTS = [{
  id: 'mercosur',
  tag: 'Mercosur',
  date: '2 may 2026',
  title: 'Acuerdo Mercosur–UE y el sector automotor uruguayo',
  excerpt: 'Qué cambia para autos, motos y repuestos con la baja gradual de aranceles, y en qué plazos.'
}, {
  id: 'impuestos',
  tag: 'Impuestos',
  date: '17 abr 2026',
  title: 'Impuestos en autos en Uruguay: por qué pagás el doble (y a veces más)',
  excerpt: 'IMESI, IVA y aranceles: cómo se compone el precio final y por qué un 0 km cuesta lo que cuesta.'
}, {
  id: '200cc',
  tag: 'Motos',
  date: '16 abr 2026',
  title: 'La barrera de los 200cc: por qué tantos motociclistas arrancan sin libreta',
  excerpt: 'La normativa, los límites de cilindrada y el camino correcto para circular en regla.'
}];
const fmtPrice = n => 'USD ' + Number(n).toLocaleString('es-UY');
window.TMK = {
  VEHICLES,
  CATEGORIES,
  POSTS,
  fmtPrice
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/detail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* TodoMotor UI kit — Ficha técnica (detail). window.Screens.Detail */

const DET_CSS = `
.dt { max-width: var(--container-wide); margin: 0 auto; padding: 24px 24px 0; }
.dt__crumb { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.dt__crumb a { cursor: pointer; }
.dt__top { display: grid; grid-template-columns: 1.15fr 1fr; gap: 32px; margin-top: 18px; align-items: start; }
.dt__gallery { display: flex; flex-direction: column; gap: 12px; }
.dt__stage { aspect-ratio: 16/10; border-radius: var(--radius-xl); border: 1px solid var(--border); background:
  radial-gradient(110% 120% at 50% 0%, var(--surface) 0%, var(--surface-sunken) 100%); display: grid; place-items: center; position: relative; overflow: hidden; }
.dt__stage .ph { width: 30%; opacity: 0.12; color: var(--c-ink-900); }
.dt__stage .cond { position: absolute; top: 16px; left: 16px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; background: var(--c-ink-900); color: #fff; padding: 6px 11px; border-radius: var(--radius-sm); }
.dt__thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.dt__thumb { aspect-ratio: 16/11; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--surface-sunken); display: grid; place-items: center; color: var(--c-ink-300); cursor: pointer; }
.dt__thumb.on { border-color: var(--accent); box-shadow: var(--focus-ring); }

.dt__panel { position: sticky; top: 84px; }
.dt__ey { font-family: var(--font-sans); font-weight: 600; color: var(--text-muted); font-size: var(--text-base); display: flex; align-items: center; gap: 8px; }
.dt__model { font-family: var(--font-display); font-weight: 700; font-size: var(--text-4xl); letter-spacing: -0.03em; line-height: 1; color: var(--text-strong); margin: 10px 0 6px; }
.dt__trim { color: var(--text-muted); font-size: var(--text-lg); }
.dt__tags { display: flex; gap: 8px; margin-top: 16px; }
.dt__price { font-family: var(--font-mono); font-weight: 500; font-size: var(--text-4xl); color: var(--price); letter-spacing: -0.02em; margin: 22px 0 4px; }
.dt__price .cur { font-size: var(--text-lg); color: var(--text-muted); margin-right: 6px; }
.dt__pricenote { font-size: var(--text-sm); color: var(--text-muted); }
.dt__cta { display: flex; gap: 10px; margin: 22px 0; }
.dt__kpis { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--hairline); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.dt__kpi { background: var(--surface); padding: 14px 16px; }
.dt__kpi .k { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-faint); }
.dt__kpi .v { font-family: var(--font-display); font-weight: 700; font-size: var(--text-xl); color: var(--text-strong); margin-top: 3px; }

.dt__specs { max-width: var(--container-wide); margin: 0 auto; padding: 48px 24px 0; }
.dt__specs h2 { font-size: var(--text-2xl); letter-spacing: -0.02em; margin: 0 0 20px; }
.dt__cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px 48px; }
.dt__related { max-width: var(--container-wide); margin: 0 auto; padding: 48px 24px 0; }
.dt__related h2 { font-size: var(--text-2xl); letter-spacing: -0.02em; margin: 0 0 20px; }
.dt__rgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
@media (max-width: 1000px){ .dt__top{ grid-template-columns: 1fr; } .dt__panel{ position: static; } .dt__cols{ grid-template-columns: 1fr; } .dt__rgrid{ grid-template-columns: repeat(2,1fr);} }
`;
(function () {
  if (typeof document !== 'undefined' && !document.querySelector('[data-tm="det"]')) {
    const s = document.createElement('style');
    s.setAttribute('data-tm', 'det');
    s.textContent = DET_CSS;
    document.head.appendChild(s);
  }
})();
const Gauge = () => /*#__PURE__*/React.createElement("svg", {
  className: "ph",
  viewBox: "0 0 48 48",
  fill: "none",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12.74 31.5 A13 13 0 1 1 35.26 31.5",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("line", {
  x1: "21.5",
  y1: "28.7",
  x2: "30.3",
  y2: "16",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "24",
  cy: "25",
  r: "3",
  fill: "currentColor"
}));
function Detail({
  route,
  onNav,
  saved,
  toggleSave
}) {
  const {
    VEHICLES
  } = window.TMK;
  const {
    Icon
  } = window.TMC;
  const v = VEHICLES.find(x => x.id === route.id) || VEHICLES[0];
  const isSaved = !!saved[v.id];
  const related = VEHICLES.filter(x => x.cat === v.cat && x.id !== v.id).slice(0, 4);
  const batt = v.fuel === 'electrico';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt__crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'home'
    })
  }, "Inicio"), /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-right",
    size: 13
  }), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'inventory',
      cat: v.cat
    })
  }, "Veh\xEDculos"), /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-right",
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)'
    }
  }, v.brand, " ", v.model)), /*#__PURE__*/React.createElement("div", {
    className: "dt__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt__gallery"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt__stage"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cond"
  }, v.condition, " \xB7 ", v.year), /*#__PURE__*/React.createElement(Gauge, null)), /*#__PURE__*/React.createElement("div", {
    className: "dt__thumbs"
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'dt__thumb' + (i === 0 ? ' on' : '')
  }, /*#__PURE__*/React.createElement(Icon, {
    n: i === 3 ? 'camera' : 'image',
    size: 20
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "dt__panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt__ey"
  }, /*#__PURE__*/React.createElement("span", null, v.brand), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, v.year)), /*#__PURE__*/React.createElement("h1", {
    className: "dt__model"
  }, v.model), /*#__PURE__*/React.createElement("div", {
    className: "dt__trim"
  }, v.trim), /*#__PURE__*/React.createElement("div", {
    className: "dt__tags"
  }, /*#__PURE__*/React.createElement(window.TM.FuelTag, {
    type: v.fuel
  }), /*#__PURE__*/React.createElement(window.TM.Badge, {
    tone: "neutral",
    variant: "outline"
  }, v.cat === 'pickups' ? 'Camioneta' : v.cat === 'suvs' ? 'SUV' : v.cat === 'motos' ? 'Moto' : 'Auto'), /*#__PURE__*/React.createElement(window.TM.Badge, {
    tone: "positive",
    dot: true
  }, "Disponible")), /*#__PURE__*/React.createElement("div", {
    className: "dt__price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, "USD"), Number(v.price).toLocaleString('es-UY')), /*#__PURE__*/React.createElement("div", {
    className: "dt__pricenote"
  }, "Precio de referencia \xB7 no incluye gastos de gestor\xEDa"), /*#__PURE__*/React.createElement("div", {
    className: "dt__cta"
  }, /*#__PURE__*/React.createElement(window.TM.Button, {
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      n: "git-compare",
      size: 18
    }),
    onClick: () => onNav({
      name: 'compare',
      add: v.id
    })
  }, "Comparar"), /*#__PURE__*/React.createElement(window.TM.Button, {
    size: "lg",
    variant: isSaved ? 'soft' : 'secondary',
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      n: "heart",
      size: 18
    }),
    onClick: () => toggleSave(v.id)
  }, isSaved ? 'Guardado' : 'Guardar')), /*#__PURE__*/React.createElement("div", {
    className: "dt__kpis"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt__kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Potencia"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, v.power, " HP")), /*#__PURE__*/React.createElement("div", {
    className: "dt__kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "0\u2013100 km/h"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, v.accel)), /*#__PURE__*/React.createElement("div", {
    className: "dt__kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Caja"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, v.caja)), /*#__PURE__*/React.createElement("div", {
    className: "dt__kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Tracci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, v.traccion)))))), /*#__PURE__*/React.createElement("div", {
    className: "dt__specs"
  }, /*#__PURE__*/React.createElement("h2", null, "Ficha t\xE9cnica"), /*#__PURE__*/React.createElement("div", {
    className: "dt__cols"
  }, /*#__PURE__*/React.createElement(window.TM.SpecGrid, {
    groups: [{
      title: 'Motor y rendimiento',
      items: [{
        label: batt ? 'Batería' : 'Cilindrada',
        value: v.cc
      }, {
        label: 'Potencia',
        value: v.power + ' HP',
        highlight: true
      }, {
        label: 'Torque',
        value: v.torque
      }, {
        label: '0–100 km/h',
        value: v.accel
      }, {
        label: 'Caja',
        value: v.caja
      }, {
        label: 'Tracción',
        value: v.traccion
      }]
    }]
  }), /*#__PURE__*/React.createElement(window.TM.SpecGrid, {
    groups: [{
      title: batt ? 'Autonomía' : 'Consumo y capacidad',
      items: [{
        label: 'Combustible',
        value: batt ? 'Eléctrico' : v.fuel === 'diesel' ? 'Diésel' : v.fuel === 'hibrido' ? 'Híbrido' : 'Nafta'
      }, {
        label: batt ? 'Autonomía' : 'Consumo',
        value: v.consumo
      }, {
        label: batt ? 'Capacidad batería' : 'Tanque',
        value: v.tanque
      }]
    }, {
      title: 'Dimensiones',
      items: [{
        label: 'Largo',
        value: v.largo
      }, {
        label: v.cat === 'pickups' ? 'Capacidad de carga' : 'Baúl',
        value: v.baul
      }, {
        label: 'Año modelo',
        value: String(v.year)
      }]
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dt__related"
  }, /*#__PURE__*/React.createElement("h2", null, "Comparables en ", v.cat === 'pickups' ? 'camionetas' : v.cat === 'suvs' ? 'SUVs' : v.cat === 'motos' ? 'motos' : 'autos'), /*#__PURE__*/React.createElement("div", {
    className: "dt__rgrid"
  }, related.map(r => /*#__PURE__*/React.createElement(window.TM.VehicleCard, _extends({
    key: r.id
  }, r, {
    as: "div",
    saved: !!saved[r.id],
    onToggleSave: () => toggleSave(r.id),
    onClick: () => onNav({
      name: 'detail',
      id: r.id
    }),
    style: {
      cursor: 'pointer'
    }
  }))))));
}
window.Screens = Object.assign(window.Screens || {}, {
  Detail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/detail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* TodoMotor UI kit — Home screen. window.Screens.Home */

const HOME_CSS = `
.h-hero { position: relative; overflow: hidden; background:
  radial-gradient(80% 120% at 85% -10%, var(--accent-faint) 0%, transparent 55%),
  linear-gradient(180deg, var(--surface) 0%, var(--bg-app) 100%);
  border-bottom: 1px solid var(--border); }
.h-hero__in { max-width: var(--container-wide); margin: 0 auto; padding: 72px 24px 56px; }
.h-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: var(--text-xs); letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent-ink); background: var(--accent-soft); padding: 6px 12px; border-radius: var(--radius-pill); }
.h-title { font-family: var(--font-display); font-weight: 700; font-size: clamp(40px, 6vw, 76px); line-height: 0.98; letter-spacing: -0.035em; color: var(--text-strong); margin: 20px 0 0; max-width: 16ch; }
.h-title em { font-style: normal; color: var(--accent); }
.h-sub { font-size: var(--text-xl); color: var(--text-muted); margin: 18px 0 0; max-width: 46ch; line-height: 1.4; }
.h-searchbar { margin-top: 34px; display: flex; gap: 10px; max-width: 620px; }
.h-searchbar .field { flex: 1; position: relative; display: flex; align-items: center; }
.h-searchbar .field i { position: absolute; left: 18px; color: var(--text-muted); }
.h-searchbar input { width: 100%; height: 56px; border: 1.5px solid var(--border-strong); border-radius: var(--radius-lg); background: var(--surface); padding: 0 18px 0 48px; font-family: var(--font-sans); font-size: var(--text-md); color: var(--text-strong); box-shadow: var(--shadow-sm); }
.h-searchbar input:focus { outline: none; border-color: var(--accent); box-shadow: var(--focus-ring); }
.h-stats { display: flex; gap: 40px; margin-top: 40px; flex-wrap: wrap; }
.h-stat .n { font-family: var(--font-mono); font-weight: 500; font-size: var(--text-3xl); color: var(--text-strong); letter-spacing: -0.02em; }
.h-stat .l { font-size: var(--text-sm); color: var(--text-muted); margin-top: 2px; }

.h-sect { max-width: var(--container-wide); margin: 0 auto; padding: 56px 24px 0; }
.h-sect__head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
.h-sect__head h2 { font-size: var(--text-3xl); letter-spacing: -0.025em; }
.h-sect__head p { color: var(--text-muted); margin: 6px 0 0; font-size: var(--text-base); }
.h-link { font-family: var(--font-sans); font-weight: 600; color: var(--accent); display: inline-flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap; }

.h-cats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.h-cat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 18px; cursor: pointer; transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur); }
.h-cat:hover { transform: translateY(-3px); box-shadow: var(--shadow-card); border-color: var(--accent); }
.h-cat__ic { width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-soft); color: var(--accent-ink); display: grid; place-items: center; margin-bottom: 16px; }
.h-cat__l { font-family: var(--font-display); font-weight: 700; font-size: var(--text-lg); color: var(--text-strong); }
.h-cat__c { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text-muted); margin-top: 2px; }

.h-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.h-posts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.h-post { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; display: flex; flex-direction: column; transition: box-shadow var(--dur), transform var(--dur), border-color var(--dur); }
.h-post:hover { box-shadow: var(--shadow-card); transform: translateY(-3px); border-color: var(--border-strong); }
.h-post__top { height: 116px; background: linear-gradient(135deg, var(--accent-faint), var(--surface-sunken)); display: grid; place-items: center; color: var(--accent); }
.h-post__b { padding: 16px 18px 18px; }
.h-post__tag { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); }
.h-post__t { font-family: var(--font-display); font-weight: 700; font-size: var(--text-lg); color: var(--text-strong); line-height: 1.18; margin: 8px 0; letter-spacing: -0.01em; }
.h-post__d { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-faint); }
@media (max-width: 1000px){ .h-cats{ grid-template-columns: repeat(2,1fr);} .h-grid{ grid-template-columns: repeat(2,1fr);} .h-posts{ grid-template-columns:1fr;} }
`;
(function () {
  if (typeof document !== 'undefined' && !document.querySelector('[data-tm="home"]')) {
    const s = document.createElement('style');
    s.setAttribute('data-tm', 'home');
    s.textContent = HOME_CSS;
    document.head.appendChild(s);
  }
})();
function Home({
  onNav,
  saved,
  toggleSave
}) {
  const {
    VEHICLES,
    CATEGORIES,
    POSTS
  } = window.TMK;
  const {
    Icon
  } = window.TMC;
  const [q, setQ] = React.useState('');
  const featured = VEHICLES.slice(0, 8);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    className: "h-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-hero__in"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-eyebrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "badge-check",
    size: 14
  }), " 1.150 fichas t\xE9cnicas en Uruguay"), /*#__PURE__*/React.createElement("h1", {
    className: "h-title"
  }, "Encontr\xE1 tu ", /*#__PURE__*/React.createElement("em", null, "pr\xF3ximo"), " veh\xEDculo"), /*#__PURE__*/React.createElement("p", {
    className: "h-sub"
  }, "Fichas t\xE9cnicas completas, precios de referencia y comparativas. Sin vueltas, con datos."), /*#__PURE__*/React.createElement("div", {
    className: "h-searchbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "search",
    size: 20
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Busc\xE1 por marca o modelo \u2014 ej. Taos, Corolla\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') onNav({
        name: 'inventory',
        cat: 'all',
        q
      });
    }
  })), /*#__PURE__*/React.createElement(window.TM.Button, {
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      n: "arrow-right",
      size: 18
    }),
    onClick: () => onNav({
      name: 'inventory',
      cat: 'all',
      q
    })
  }, "Ver inventario")), /*#__PURE__*/React.createElement("div", {
    className: "h-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "1.150"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "veh\xEDculos")), /*#__PURE__*/React.createElement("div", {
    className: "h-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "38"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "marcas")), /*#__PURE__*/React.createElement("div", {
    className: "h-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "5"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "categor\xEDas")), /*#__PURE__*/React.createElement("div", {
    className: "h-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "2026"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "modelos al d\xEDa"))))), /*#__PURE__*/React.createElement("section", {
    className: "h-sect"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-sect__head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Explor\xE1 por categor\xEDa"), /*#__PURE__*/React.createElement("p", null, "Filtr\xE1 el cat\xE1logo por tipo de veh\xEDculo"))), /*#__PURE__*/React.createElement("div", {
    className: "h-cats"
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement("div", {
    className: "h-cat",
    key: c.id,
    onClick: () => onNav({
      name: 'inventory',
      cat: c.id
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-cat__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: c.icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "h-cat__l"
  }, c.label), /*#__PURE__*/React.createElement("div", {
    className: "h-cat__c"
  }, c.count.toLocaleString('es-UY'), " veh\xEDculos"))))), /*#__PURE__*/React.createElement("section", {
    className: "h-sect"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-sect__head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Destacados"), /*#__PURE__*/React.createElement("p", null, "Novedades y lanzamientos del momento")), /*#__PURE__*/React.createElement("span", {
    className: "h-link",
    onClick: () => onNav({
      name: 'inventory',
      cat: 'all'
    })
  }, "Ver todo el inventario ", /*#__PURE__*/React.createElement(window.TMC.Icon, {
    n: "arrow-right",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "h-grid"
  }, featured.map(v => /*#__PURE__*/React.createElement(window.TM.VehicleCard, _extends({
    key: v.id
  }, v, {
    as: "div",
    saved: !!saved[v.id],
    onToggleSave: () => toggleSave(v.id),
    onClick: () => onNav({
      name: 'detail',
      id: v.id
    }),
    style: {
      cursor: 'pointer'
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "h-sect"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-sect__head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Blog del Motor"), /*#__PURE__*/React.createElement("p", null, "Contexto, impuestos y gu\xEDas para comprar mejor")), /*#__PURE__*/React.createElement("span", {
    className: "h-link",
    onClick: () => onNav({
      name: 'blog'
    })
  }, "Ver todos ", /*#__PURE__*/React.createElement(window.TMC.Icon, {
    n: "arrow-right",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "h-posts"
  }, POSTS.map(p => /*#__PURE__*/React.createElement("article", {
    className: "h-post",
    key: p.id,
    onClick: () => onNav({
      name: 'blog'
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-post__top"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "newspaper",
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    className: "h-post__b"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-post__tag"
  }, p.tag), /*#__PURE__*/React.createElement("h3", {
    className: "h-post__t"
  }, p.title), /*#__PURE__*/React.createElement("span", {
    className: "h-post__d"
  }, p.date)))))));
}
window.Screens = Object.assign(window.Screens || {}, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/inventory.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* TodoMotor UI kit — Inventory listing. window.Screens.Inventory */

const INV_CSS = `
.iv { max-width: var(--container-wide); margin: 0 auto; padding: 28px 24px 0; }
.iv__crumb { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); display: flex; gap: 8px; align-items: center; }
.iv__crumb a { cursor: pointer; }
.iv__title { font-size: var(--text-4xl); letter-spacing: -0.03em; margin: 12px 0 0; }
.iv__count { font-family: var(--font-mono); color: var(--text-muted); font-size: var(--text-base); margin-top: 6px; }
.iv__body { display: grid; grid-template-columns: 248px 1fr; gap: 28px; margin-top: 24px; align-items: start; }
.iv__filters { position: sticky; top: 84px; display: flex; flex-direction: column; gap: 24px; }
.fgroup h4 { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 12px; }
.fcat { display: flex; flex-direction: column; gap: 4px; }
.fcat button { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 8px 10px; border-radius: var(--radius-md); font-family: var(--font-sans); font-size: var(--text-base); color: var(--text-body); font-weight: 500; }
.fcat button:hover { background: var(--surface-sunken); }
.fcat button.on { background: var(--accent-soft); color: var(--accent-ink); font-weight: 600; }
.fcat button .c { margin-left: auto; font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-faint); }
.fchecks { display: flex; flex-direction: column; gap: 8px; }
.fcheck { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: var(--text-base); color: var(--text-body); }
.fcheck input { appearance: none; width: 18px; height: 18px; border: 1.5px solid var(--border-strong); border-radius: var(--radius-xs); cursor: pointer; position: relative; flex: none; }
.fcheck input:checked { background: var(--accent); border-color: var(--accent); }
.fcheck input:checked::after { content: ""; position: absolute; left: 5px; top: 2px; width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.fprice { display: flex; align-items: center; gap: 8px; }
.fprice input { width: 100%; height: 38px; border: 1px solid var(--border-strong); border-radius: var(--radius-md); padding: 0 10px; font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text-strong); background: var(--surface); }
.fprice span { color: var(--text-faint); }
.iv__toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.iv__chips { display: flex; gap: 8px; flex-wrap: wrap; }
.iv__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.iv__empty { padding: 60px; text-align: center; color: var(--text-muted); background: var(--surface); border: 1px dashed var(--border-strong); border-radius: var(--radius-lg); }
@media (max-width: 1000px){ .iv__body{ grid-template-columns: 1fr; } .iv__filters{ position: static; } .iv__grid{ grid-template-columns: repeat(2,1fr);} }
`;
(function () {
  if (typeof document !== 'undefined' && !document.querySelector('[data-tm="inv"]')) {
    const s = document.createElement('style');
    s.setAttribute('data-tm', 'inv');
    s.textContent = INV_CSS;
    document.head.appendChild(s);
  }
})();
const FUELS = [{
  id: 'nafta',
  l: 'Nafta'
}, {
  id: 'electrico',
  l: 'Eléctrico'
}, {
  id: 'hibrido',
  l: 'Híbrido'
}, {
  id: 'diesel',
  l: 'Diésel'
}];
function Inventory({
  route,
  onNav,
  saved,
  toggleSave
}) {
  const {
    VEHICLES,
    CATEGORIES
  } = window.TMK;
  const {
    Icon
  } = window.TMC;
  const [cat, setCat] = React.useState(route.cat || 'all');
  const [fuels, setFuels] = React.useState([]);
  const [q, setQ] = React.useState(route.q || '');
  const [sort, setSort] = React.useState('relevancia');
  const [maxP, setMaxP] = React.useState('');
  React.useEffect(() => {
    setCat(route.cat || 'all');
    if (route.q != null) setQ(route.q);
  }, [route.cat, route.q]);
  const toggleFuel = f => setFuels(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f]);
  let list = VEHICLES.filter(v => (cat === 'all' || v.cat === cat) && (fuels.length === 0 || fuels.includes(v.fuel)) && (!q || (v.brand + ' ' + v.model + ' ' + v.trim).toLowerCase().includes(q.toLowerCase())) && (!maxP || v.price <= Number(maxP)));
  if (sort === 'precio-asc') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'precio-desc') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'potencia') list = [...list].sort((a, b) => b.power - a.power);
  const catLabel = (CATEGORIES.find(c => c.id === cat) || {}).label || 'Todos';
  return /*#__PURE__*/React.createElement("div", {
    className: "iv"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iv__crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav({
      name: 'home'
    })
  }, "Inicio"), /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-right",
    size: 13
  }), /*#__PURE__*/React.createElement("span", null, "Veh\xEDculos"), /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-right",
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)'
    }
  }, catLabel)), /*#__PURE__*/React.createElement("h1", {
    className: "iv__title"
  }, catLabel), /*#__PURE__*/React.createElement("div", {
    className: "iv__count"
  }, list.length, " de ", VEHICLES.length, " veh\xEDculos mostrados"), /*#__PURE__*/React.createElement("div", {
    className: "iv__body"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "iv__filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fgroup"
  }, /*#__PURE__*/React.createElement("h4", null, "Categor\xEDa"), /*#__PURE__*/React.createElement("div", {
    className: "fcat"
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: cat === c.id ? 'on' : '',
    onClick: () => setCat(c.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: c.icon,
    size: 17
  }), c.label, /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, c.count))))), /*#__PURE__*/React.createElement("div", {
    className: "fgroup"
  }, /*#__PURE__*/React.createElement("h4", null, "Combustible"), /*#__PURE__*/React.createElement("div", {
    className: "fchecks"
  }, FUELS.map(f => /*#__PURE__*/React.createElement("label", {
    className: "fcheck",
    key: f.id
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: fuels.includes(f.id),
    onChange: () => toggleFuel(f.id)
  }), /*#__PURE__*/React.createElement(window.TM.FuelTag, {
    type: f.id,
    plain: true
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "fgroup"
  }, /*#__PURE__*/React.createElement("h4", null, "Precio m\xE1ximo (USD)"), /*#__PURE__*/React.createElement("div", {
    className: "fprice"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Sin tope",
    value: maxP,
    onChange: e => setMaxP(e.target.value.replace(/\D/g, ''))
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "iv__toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iv__chips"
  }, /*#__PURE__*/React.createElement(window.TM.FilterChip, {
    active: fuels.length === 0 && cat === 'all',
    onClick: () => {
      setCat('all');
      setFuels([]);
      setMaxP('');
    }
  }, "Todos"), fuels.map(f => /*#__PURE__*/React.createElement(window.TM.FilterChip, {
    key: f,
    active: true,
    onClick: () => toggleFuel(f)
  }, (FUELS.find(x => x.id === f) || {}).l, " \u2715"))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, "ORDENAR"), /*#__PURE__*/React.createElement(window.TM.Select, {
    size: "sm",
    value: sort,
    onChange: e => setSort(e.target.value),
    options: [{
      value: 'relevancia',
      label: 'Relevancia'
    }, {
      value: 'precio-asc',
      label: 'Precio: menor a mayor'
    }, {
      value: 'precio-desc',
      label: 'Precio: mayor a menor'
    }, {
      value: 'potencia',
      label: 'Más potentes'
    }]
  }))), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "iv__empty"
  }, "No hay veh\xEDculos con esos filtros. Prob\xE1 ampliar la b\xFAsqueda.") : /*#__PURE__*/React.createElement("div", {
    className: "iv__grid"
  }, list.map(v => /*#__PURE__*/React.createElement(window.TM.VehicleCard, _extends({
    key: v.id
  }, v, {
    as: "div",
    saved: !!saved[v.id],
    onToggleSave: () => toggleSave(v.id),
    onClick: () => onNav({
      name: 'detail',
      id: v.id
    }),
    style: {
      cursor: 'pointer'
    }
  })))))));
}
window.Screens = Object.assign(window.Screens || {}, {
  Inventory
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/inventory.jsx", error: String((e && e.message) || e) }); }

// ui_kits/todomotor/lib.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const cls = ['tm-btn', `tm-btn--${size}`, variant !== 'primary' ? `tm-btn--${variant}` : '', block ? 'tm-btn--block' : '', iconOnly ? 'tm-btn--icon' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    disabled: Tag === 'button' ? disabled || loading : undefined
  }, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "tm-btn__spinner",
    "aria-hidden": "true"
  }), !loading && iconLeft, !iconOnly && children, !loading && iconRight, iconOnly && loading ? null : null);
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
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "tm-badge__dot",
    "aria-hidden": "true"
  }), children);
}

// ===== FuelTag.jsx =====
const FUEL = {
  nafta: {
    label: 'Nafta',
    fg: 'var(--c-fuel-nafta)',
    bg: 'var(--c-fuel-nafta-bg)',
    icon: 'fuel'
  },
  electrico: {
    label: 'Eléctrico',
    fg: 'var(--c-fuel-elec)',
    bg: 'var(--c-fuel-elec-bg)',
    icon: 'zap'
  },
  hibrido: {
    label: 'Híbrido',
    fg: 'var(--c-fuel-hibrido)',
    bg: 'var(--c-fuel-hibrido-bg)',
    icon: 'leaf'
  },
  diesel: {
    label: 'Diésel',
    fg: 'var(--c-fuel-diesel)',
    bg: 'var(--c-fuel-diesel-bg)',
    icon: 'container'
  }
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
function FuelTag({
  type = 'nafta',
  plain = false,
  className = '',
  ...rest
}) {
  ensure_2();
  const f = FUEL[type] || FUEL.nafta;
  const cls = ['tm-fuel', plain ? 'tm-fuel--plain' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      color: f.fg,
      background: plain ? 'transparent' : f.bg
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "tm-fuel__dot",
    "aria-hidden": "true"
  }), f.label);
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
  const inputCls = ['tm-input', `tm-input--${size}`, iconLeft ? 'tm-input--has-left' : '', iconRight ? 'tm-input--has-right' : ''].filter(Boolean).join(' ');
  const fieldCls = ['tm-field', error ? 'tm-field--error' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: fieldCls
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "tm-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "tm-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "tm-input-wrap"
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    className: "tm-input__icon tm-input__icon--left"
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: inputCls,
    "aria-invalid": !!error || undefined
  }, rest)), iconRight && /*#__PURE__*/React.createElement("span", {
    className: "tm-input__icon tm-input__icon--right"
  }, iconRight)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: "tm-field__hint"
  }, error || hint));
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
function Select({
  children,
  options,
  size = 'md',
  placeholder,
  className = '',
  ...rest
}) {
  ensure_4();
  const cls = ['tm-select', size === 'sm' ? 'tm-select--sm' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", {
    className: "tm-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: cls
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options ? options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  }) : children), /*#__PURE__*/React.createElement("span", {
    className: "tm-select__chev",
    "aria-hidden": "true"
  }));
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
function FilterChip({
  children,
  active = false,
  count,
  icon = null,
  className = '',
  ...rest
}) {
  ensure_5();
  const cls = ['tm-chip', active ? 'tm-chip--active' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-pressed": active
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    className: "tm-chip__ico"
  }, icon), children, count != null && /*#__PURE__*/React.createElement("span", {
    className: "tm-chip__count"
  }, count));
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
function Grid({
  items,
  cols
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tm-specs__grid",
    style: {
      '--cols': cols
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "tm-specs__row",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "tm-specs__k"
  }, it.label), /*#__PURE__*/React.createElement("span", {
    className: `tm-specs__v${it.highlight ? ' tm-specs__v--hl' : ''}`
  }, it.value))));
}
function SpecGrid({
  items,
  groups,
  cols = 2,
  className = ''
}) {
  ensure_6();
  return /*#__PURE__*/React.createElement("div", {
    className: ['tm-specs', className].filter(Boolean).join(' ')
  }, groups ? groups.map((g, i) => /*#__PURE__*/React.createElement("section", {
    className: "tm-specs__group",
    key: i
  }, g.title && /*#__PURE__*/React.createElement("h4", {
    className: "tm-specs__gtitle"
  }, g.title), /*#__PURE__*/React.createElement(Grid, {
    items: g.items,
    cols: cols
  }))) : /*#__PURE__*/React.createElement(Grid, {
    items: items || [],
    cols: cols
  }));
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
const GaugePH = () => /*#__PURE__*/React.createElement("svg", {
  className: "tm-vcard__ph",
  viewBox: "0 0 48 48",
  fill: "none",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12.74 31.5 A13 13 0 1 1 35.26 31.5",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("line", {
  x1: "21.5",
  y1: "28.7",
  x2: "30.3",
  y2: "16",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "24",
  cy: "25",
  r: "3",
  fill: "currentColor"
}));
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
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: ['tm-vcard', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__media"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: `${brand} ${model}`
  }) : /*#__PURE__*/React.createElement(GaugePH, null), /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__topl"
  }, /*#__PURE__*/React.createElement("span", {
    className: `tm-cond${used ? ' tm-cond--used' : ''}`
  }, condition)), onToggleSave && /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__topr"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tm-vcard__save",
    "data-on": saved,
    "aria-label": saved ? 'Quitar de guardados' : 'Guardar',
    "aria-pressed": saved,
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
      onToggleSave(e);
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: saved ? 'currentColor' : 'none',
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"
  })))), /*#__PURE__*/React.createElement(FuelTag, {
    type: fuel,
    className: "tm-vcard__fuel"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tm-vcard__ey"
  }, [brand, year].filter(Boolean).join(' · ')), /*#__PURE__*/React.createElement("h3", {
    className: "tm-vcard__model"
  }, model), trim && /*#__PURE__*/React.createElement("p", {
    className: "tm-vcard__trim"
  }, trim), /*#__PURE__*/React.createElement("div", {
    className: "tm-vcard__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tm-vcard__price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, currency), fmt(price)), power && /*#__PURE__*/React.createElement("span", {
    className: "tm-vcard__power"
  }, power, " HP"))));
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
function Mark({
  size = 40,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    className: "tm-logo__mark",
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    role: "img",
    "aria-label": "TodoMotor"
  }, rest), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "46",
    height: "46",
    rx: "12",
    fill: "var(--accent)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12.74 31.5 A13 13 0 1 1 35.26 31.5",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12.74",
    y1: "18.5",
    x2: "15.34",
    y2: "20",
    stroke: "#fff",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "24",
    y1: "12",
    x2: "24",
    y2: "15",
    stroke: "#fff",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "35.26",
    y1: "18.5",
    x2: "32.66",
    y2: "20",
    stroke: "#fff",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21.5",
    y1: "28.7",
    x2: "30.3",
    y2: "16",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "25",
    r: "3",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "25",
    r: "1.3",
    fill: "var(--accent)"
  }));
}
function Logo({
  size = 30,
  inverse = false,
  showUY = true,
  markOnly = false,
  as = 'a',
  className = '',
  ...rest
}) {
  ensure_8();
  const Tag = as;
  const markSize = Math.round(size * 1.5);
  if (markOnly) return /*#__PURE__*/React.createElement(Mark, {
    size: markSize
  });
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: ['tm-logo', inverse ? 'tm-logo--inverse' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement(Mark, {
    size: markSize
  }), /*#__PURE__*/React.createElement("span", {
    className: "tm-logo__wm",
    style: {
      fontSize: size
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tm-logo__todo"
  }, "todo"), /*#__PURE__*/React.createElement("span", {
    className: "tm-logo__motor"
  }, "motor")), showUY && /*#__PURE__*/React.createElement("span", {
    className: "tm-logo__uy",
    style: {
      fontSize: Math.max(10, size * 0.34),
      paddingBottom: size * 0.12
    }
  }, "UY"));
}
window.TM = {
  Button,
  Badge,
  FuelTag,
  Input,
  Select,
  FilterChip,
  SpecGrid,
  VehicleCard,
  Logo,
  Mark
};
Object.assign(window, window.TM);
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/todomotor/lib.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.FuelTag = __ds_scope.FuelTag;

__ds_ns.Mark = __ds_scope.Mark;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.SpecGrid = __ds_scope.SpecGrid;

__ds_ns.VehicleCard = __ds_scope.VehicleCard;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

})();
