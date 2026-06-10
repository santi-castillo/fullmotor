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
(function(){ if(typeof document!=='undefined' && !document.querySelector('[data-tm="det"]')){ const s=document.createElement('style'); s.setAttribute('data-tm','det'); s.textContent=DET_CSS; document.head.appendChild(s);} })();

const Gauge = () => (
  <svg className="ph" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M12.74 31.5 A13 13 0 1 1 35.26 31.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="21.5" y1="28.7" x2="30.3" y2="16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="25" r="3" fill="currentColor" />
  </svg>
);

function Detail({ route, onNav, saved, toggleSave }) {
  const { VEHICLES } = window.TMK;
  const { Icon } = window.TMC;
  const v = VEHICLES.find((x) => x.id === route.id) || VEHICLES[0];
  const isSaved = !!saved[v.id];
  const related = VEHICLES.filter((x) => x.cat === v.cat && x.id !== v.id).slice(0, 4);
  const batt = v.fuel === 'electrico';

  return (
    <div>
      <div className="dt">
        <div className="dt__crumb">
          <a onClick={() => onNav({ name: 'home' })}>Inicio</a><Icon n="chevron-right" size={13} />
          <a onClick={() => onNav({ name: 'inventory', cat: v.cat })}>Vehículos</a><Icon n="chevron-right" size={13} />
          <span style={{ color: 'var(--text-strong)' }}>{v.brand} {v.model}</span>
        </div>

        <div className="dt__top">
          <div className="dt__gallery">
            <div className="dt__stage"><span className="cond">{v.condition} · {v.year}</span><Gauge /></div>
            <div className="dt__thumbs">
              {[0,1,2,3].map((i) => <div key={i} className={'dt__thumb' + (i===0?' on':'')}><Icon n={i===3?'camera':'image'} size={20} /></div>)}
            </div>
          </div>

          <div className="dt__panel">
            <div className="dt__ey"><span>{v.brand}</span><span>·</span><span>{v.year}</span></div>
            <h1 className="dt__model">{v.model}</h1>
            <div className="dt__trim">{v.trim}</div>
            <div className="dt__tags">
              <window.TM.FuelTag type={v.fuel} />
              <window.TM.Badge tone="neutral" variant="outline">{v.cat === 'pickups' ? 'Camioneta' : v.cat === 'suvs' ? 'SUV' : v.cat === 'motos' ? 'Moto' : 'Auto'}</window.TM.Badge>
              <window.TM.Badge tone="positive" dot>Disponible</window.TM.Badge>
            </div>
            <div className="dt__price"><span className="cur">USD</span>{Number(v.price).toLocaleString('es-UY')}</div>
            <div className="dt__pricenote">Precio de referencia · no incluye gastos de gestoría</div>
            <div className="dt__cta">
              <window.TM.Button size="lg" iconLeft={<Icon n="git-compare" size={18} />} onClick={() => onNav({ name: 'compare', add: v.id })}>Comparar</window.TM.Button>
              <window.TM.Button size="lg" variant={isSaved ? 'soft' : 'secondary'} iconLeft={<Icon n="heart" size={18} />} onClick={() => toggleSave(v.id)}>{isSaved ? 'Guardado' : 'Guardar'}</window.TM.Button>
            </div>
            <div className="dt__kpis">
              <div className="dt__kpi"><div className="k">Potencia</div><div className="v">{v.power} HP</div></div>
              <div className="dt__kpi"><div className="k">0–100 km/h</div><div className="v">{v.accel}</div></div>
              <div className="dt__kpi"><div className="k">Caja</div><div className="v">{v.caja}</div></div>
              <div className="dt__kpi"><div className="k">Tracción</div><div className="v">{v.traccion}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="dt__specs">
        <h2>Ficha técnica</h2>
        <div className="dt__cols">
          <window.TM.SpecGrid groups={[{ title: 'Motor y rendimiento', items: [
            { label: batt ? 'Batería' : 'Cilindrada', value: v.cc },
            { label: 'Potencia', value: v.power + ' HP', highlight: true },
            { label: 'Torque', value: v.torque },
            { label: '0–100 km/h', value: v.accel },
            { label: 'Caja', value: v.caja },
            { label: 'Tracción', value: v.traccion },
          ] }]} />
          <window.TM.SpecGrid groups={[
            { title: batt ? 'Autonomía' : 'Consumo y capacidad', items: [
              { label: 'Combustible', value: batt ? 'Eléctrico' : v.fuel === 'diesel' ? 'Diésel' : v.fuel === 'hibrido' ? 'Híbrido' : 'Nafta' },
              { label: batt ? 'Autonomía' : 'Consumo', value: v.consumo },
              { label: batt ? 'Capacidad batería' : 'Tanque', value: v.tanque },
            ] },
            { title: 'Dimensiones', items: [
              { label: 'Largo', value: v.largo },
              { label: v.cat === 'pickups' ? 'Capacidad de carga' : 'Baúl', value: v.baul },
              { label: 'Año modelo', value: String(v.year) },
            ] },
          ]} />
        </div>
      </div>

      <div className="dt__related">
        <h2>Comparables en {v.cat === 'pickups' ? 'camionetas' : v.cat === 'suvs' ? 'SUVs' : v.cat === 'motos' ? 'motos' : 'autos'}</h2>
        <div className="dt__rgrid">
          {related.map((r) => (
            <window.TM.VehicleCard key={r.id} {...r} as="div"
              saved={!!saved[r.id]} onToggleSave={() => toggleSave(r.id)}
              onClick={() => onNav({ name: 'detail', id: r.id })} style={{ cursor: 'pointer' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

window.Screens = Object.assign(window.Screens || {}, { Detail });
