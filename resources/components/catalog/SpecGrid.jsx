import React from 'react';

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

export function SpecGrid({ items, groups, cols = 2, className = '' }) {
  ensure();
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
