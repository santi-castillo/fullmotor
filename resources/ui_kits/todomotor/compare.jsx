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
(function(){ if(typeof document!=='undefined' && !document.querySelector('[data-tm="cmp"]')){ const s=document.createElement('style'); s.setAttribute('data-tm','cmp'); s.textContent=CMP_CSS; document.head.appendChild(s);} })();

function Compare({ route, onNav, saved, toggleSave }) {
  const { VEHICLES } = window.TMK;
  const { Icon } = window.TMC;
  const [ids, setIds] = React.useState(() => {
    const base = ['vw-taos-highline', 'renault-boreal-iconic', 'corolla-cross-hv'];
    if (route.add && !base.includes(route.add)) return [route.add, ...base].slice(0, 3);
    return base;
  });
  React.useEffect(() => { if (route.add) setIds((s) => s.includes(route.add) ? s : [...s, route.add].slice(0, 4)); }, [route.add]);

  const cars = ids.map((id) => VEHICLES.find((v) => v.id === id)).filter(Boolean);
  const remaining = VEHICLES.filter((v) => !ids.includes(v.id));
  const remove = (id) => setIds((s) => s.filter((x) => x !== id));
  const add = (id) => { if (id) setIds((s) => [...s, id].slice(0, 4)); };

  const rows = [
    { k: 'Precio', get: (v) => 'USD ' + v.price.toLocaleString('es-UY'), best: 'min', val: (v) => v.price, cls: 'price' },
    { k: 'Combustible', get: (v) => <window.TM.FuelTag type={v.fuel} plain /> },
    { k: 'Potencia', get: (v) => v.power + ' HP', best: 'max', val: (v) => v.power },
    { k: 'Torque', get: (v) => v.torque },
    { k: '0–100 km/h', get: (v) => v.accel },
    { k: 'Caja', get: (v) => v.caja },
    { k: 'Tracción', get: (v) => v.traccion },
    { k: 'Consumo / Autonomía', get: (v) => v.consumo },
    { k: 'Baúl / Carga', get: (v) => v.baul },
    { k: 'Largo', get: (v) => v.largo },
  ];

  const bestId = (row) => {
    if (!row.best) return null;
    const vals = cars.map((c) => ({ id: c.id, n: row.val(c) }));
    const pick = row.best === 'min' ? Math.min(...vals.map((x) => x.n)) : Math.max(...vals.map((x) => x.n));
    return vals.filter((x) => x.n === pick).map((x) => x.id);
  };

  return (
    <div className="cm">
      <h1 className="cm__title">Comparador</h1>
      <p className="cm__sub">Enfrentá hasta 4 vehículos y mirá las diferencias que importan.</p>

      <div className="cm__wrap">
        <table className="cm__table">
          <thead>
            <tr>
              <th className="cm__rowlabel" style={{ borderTop: 'none' }}></th>
              {cars.map((v) => (
                <th className="cm__col cm__head" key={v.id}>
                  <div className="cm__hcard">
                    <div className="cm__media">
                      <button className="cm__rm" onClick={() => remove(v.id)} aria-label="Quitar"><Icon n="x" size={15} /></button>
                      <Icon n="car-front" size={26} />
                    </div>
                    <span className="cm__hbrand">{v.brand} · {v.year}</span>
                    <span className="cm__hmodel">{v.model}</span>
                    <span className="cm__htrim">{v.trim}</span>
                  </div>
                </th>
              ))}
              {cars.length < 4 && (
                <th className="cm__col cm__add">
                  <div className="cm__addbox">
                    <Icon n="plus" size={22} style={{ color: 'var(--accent)' }} />
                    <p>Agregá un vehículo</p>
                    <window.TM.Select size="sm" value="" placeholder="Elegir modelo…" onChange={(e) => add(e.target.value)}
                      options={remaining.map((r) => ({ value: r.id, label: r.brand + ' ' + r.model + ' · ' + r.trim }))} />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const best = bestId(row);
              return (
                <tr key={ri}>
                  <td className="cm__rowlabel">{row.k}</td>
                  {cars.map((v) => (
                    <td key={v.id} className={'cm__col cm__cell ' + (row.cls || '') + (best && best.includes(v.id) ? ' best' : '')}>
                      {row.get(v)}
                    </td>
                  ))}
                  {cars.length < 4 && <td className="cm__col"></td>}
                </tr>
              );
            })}
            <tr>
              <td className="cm__rowlabel"></td>
              {cars.map((v) => (
                <td key={v.id} className="cm__col cm__cell">
                  <window.TM.Button size="sm" variant="secondary" block onClick={() => onNav({ name: 'detail', id: v.id })}>Ver ficha</window.TM.Button>
                </td>
              ))}
              {cars.length < 4 && <td className="cm__col"></td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.Screens = Object.assign(window.Screens || {}, { Compare });
