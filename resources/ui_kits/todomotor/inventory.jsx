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
(function(){ if(typeof document!=='undefined' && !document.querySelector('[data-tm="inv"]')){ const s=document.createElement('style'); s.setAttribute('data-tm','inv'); s.textContent=INV_CSS; document.head.appendChild(s);} })();

const FUELS = [{ id:'nafta', l:'Nafta' }, { id:'electrico', l:'Eléctrico' }, { id:'hibrido', l:'Híbrido' }, { id:'diesel', l:'Diésel' }];

function Inventory({ route, onNav, saved, toggleSave }) {
  const { VEHICLES, CATEGORIES } = window.TMK;
  const { Icon } = window.TMC;
  const [cat, setCat] = React.useState(route.cat || 'all');
  const [fuels, setFuels] = React.useState([]);
  const [q, setQ] = React.useState(route.q || '');
  const [sort, setSort] = React.useState('relevancia');
  const [maxP, setMaxP] = React.useState('');

  React.useEffect(() => { setCat(route.cat || 'all'); if (route.q != null) setQ(route.q); }, [route.cat, route.q]);

  const toggleFuel = (f) => setFuels((s) => s.includes(f) ? s.filter((x) => x !== f) : [...s, f]);

  let list = VEHICLES.filter((v) => (cat === 'all' || v.cat === cat)
    && (fuels.length === 0 || fuels.includes(v.fuel))
    && (!q || (v.brand + ' ' + v.model + ' ' + v.trim).toLowerCase().includes(q.toLowerCase()))
    && (!maxP || v.price <= Number(maxP)));
  if (sort === 'precio-asc') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'precio-desc') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'potencia') list = [...list].sort((a, b) => b.power - a.power);

  const catLabel = (CATEGORIES.find((c) => c.id === cat) || {}).label || 'Todos';

  return (
    <div className="iv">
      <div className="iv__crumb"><a onClick={() => onNav({ name: 'home' })}>Inicio</a><Icon n="chevron-right" size={13} /><span>Vehículos</span><Icon n="chevron-right" size={13} /><span style={{ color: 'var(--text-strong)' }}>{catLabel}</span></div>
      <h1 className="iv__title">{catLabel}</h1>
      <div className="iv__count">{list.length} de {VEHICLES.length} vehículos mostrados</div>

      <div className="iv__body">
        <aside className="iv__filters">
          <div className="fgroup">
            <h4>Categoría</h4>
            <div className="fcat">
              {CATEGORIES.map((c) => (
                <button key={c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>
                  <Icon n={c.icon} size={17} />{c.label}<span className="c">{c.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="fgroup">
            <h4>Combustible</h4>
            <div className="fchecks">
              {FUELS.map((f) => (
                <label className="fcheck" key={f.id}>
                  <input type="checkbox" checked={fuels.includes(f.id)} onChange={() => toggleFuel(f.id)} />
                  <window.TM.FuelTag type={f.id} plain />
                </label>
              ))}
            </div>
          </div>
          <div className="fgroup">
            <h4>Precio máximo (USD)</h4>
            <div className="fprice">
              <input placeholder="Sin tope" value={maxP} onChange={(e) => setMaxP(e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
        </aside>

        <div>
          <div className="iv__toolbar">
            <div className="iv__chips">
              <window.TM.FilterChip active={fuels.length === 0 && cat === 'all'} onClick={() => { setCat('all'); setFuels([]); setMaxP(''); }}>Todos</window.TM.FilterChip>
              {fuels.map((f) => <window.TM.FilterChip key={f} active onClick={() => toggleFuel(f)}>{(FUELS.find(x=>x.id===f)||{}).l} ✕</window.TM.FilterChip>)}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>ORDENAR</span>
              <window.TM.Select size="sm" value={sort} onChange={(e) => setSort(e.target.value)}
                options={[{ value:'relevancia', label:'Relevancia' }, { value:'precio-asc', label:'Precio: menor a mayor' }, { value:'precio-desc', label:'Precio: mayor a menor' }, { value:'potencia', label:'Más potentes' }]} />
            </label>
          </div>
          {list.length === 0
            ? <div className="iv__empty">No hay vehículos con esos filtros. Probá ampliar la búsqueda.</div>
            : <div className="iv__grid">
                {list.map((v) => (
                  <window.TM.VehicleCard key={v.id} {...v} as="div"
                    saved={!!saved[v.id]} onToggleSave={() => toggleSave(v.id)}
                    onClick={() => onNav({ name: 'detail', id: v.id })} style={{ cursor: 'pointer' }} />
                ))}
              </div>}
        </div>
      </div>
    </div>
  );
}

window.Screens = Object.assign(window.Screens || {}, { Inventory });
