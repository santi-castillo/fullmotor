import React from 'react';
import { FuelTag } from '../badges/FuelTag.jsx';

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

export function VehicleCard({
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
