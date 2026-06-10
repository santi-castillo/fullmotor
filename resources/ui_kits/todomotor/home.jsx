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
(function(){ if(typeof document!=='undefined' && !document.querySelector('[data-tm="home"]')){ const s=document.createElement('style'); s.setAttribute('data-tm','home'); s.textContent=HOME_CSS; document.head.appendChild(s);} })();

function Home({ onNav, saved, toggleSave }) {
  const { VEHICLES, CATEGORIES, POSTS } = window.TMK;
  const { Icon } = window.TMC;
  const [q, setQ] = React.useState('');
  const featured = VEHICLES.slice(0, 8);
  return (
    <div>
      <section className="h-hero">
        <div className="h-hero__in">
          <span className="h-eyebrow"><Icon n="badge-check" size={14} /> 1.150 fichas técnicas en Uruguay</span>
          <h1 className="h-title">Encontrá tu <em>próximo</em> vehículo</h1>
          <p className="h-sub">Fichas técnicas completas, precios de referencia y comparativas. Sin vueltas, con datos.</p>
          <div className="h-searchbar">
            <div className="field">
              <Icon n="search" size={20} />
              <input placeholder="Buscá por marca o modelo — ej. Taos, Corolla…" value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onNav({ name: 'inventory', cat: 'all', q }); }} />
            </div>
            <window.TM.Button size="lg" iconRight={<Icon n="arrow-right" size={18} />} onClick={() => onNav({ name: 'inventory', cat: 'all', q })}>Ver inventario</window.TM.Button>
          </div>
          <div className="h-stats">
            <div className="h-stat"><div className="n">1.150</div><div className="l">vehículos</div></div>
            <div className="h-stat"><div className="n">38</div><div className="l">marcas</div></div>
            <div className="h-stat"><div className="n">5</div><div className="l">categorías</div></div>
            <div className="h-stat"><div className="n">2026</div><div className="l">modelos al día</div></div>
          </div>
        </div>
      </section>

      <section className="h-sect">
        <div className="h-sect__head"><div><h2>Explorá por categoría</h2><p>Filtrá el catálogo por tipo de vehículo</p></div></div>
        <div className="h-cats">
          {CATEGORIES.map((c) => (
            <div className="h-cat" key={c.id} onClick={() => onNav({ name: 'inventory', cat: c.id })}>
              <div className="h-cat__ic"><Icon n={c.icon} size={22} /></div>
              <div className="h-cat__l">{c.label}</div>
              <div className="h-cat__c">{c.count.toLocaleString('es-UY')} vehículos</div>
            </div>
          ))}
        </div>
      </section>

      <section className="h-sect">
        <div className="h-sect__head">
          <div><h2>Destacados</h2><p>Novedades y lanzamientos del momento</p></div>
          <span className="h-link" onClick={() => onNav({ name: 'inventory', cat: 'all' })}>Ver todo el inventario <window.TMC.Icon n="arrow-right" size={16} /></span>
        </div>
        <div className="h-grid">
          {featured.map((v) => (
            <window.TM.VehicleCard key={v.id} {...v} as="div"
              saved={!!saved[v.id]} onToggleSave={() => toggleSave(v.id)}
              onClick={() => onNav({ name: 'detail', id: v.id })} style={{ cursor: 'pointer' }} />
          ))}
        </div>
      </section>

      <section className="h-sect">
        <div className="h-sect__head">
          <div><h2>Blog del Motor</h2><p>Contexto, impuestos y guías para comprar mejor</p></div>
          <span className="h-link" onClick={() => onNav({ name: 'blog' })}>Ver todos <window.TMC.Icon n="arrow-right" size={16} /></span>
        </div>
        <div className="h-posts">
          {POSTS.map((p) => (
            <article className="h-post" key={p.id} onClick={() => onNav({ name: 'blog' })}>
              <div className="h-post__top"><Icon n="newspaper" size={30} /></div>
              <div className="h-post__b">
                <span className="h-post__tag">{p.tag}</span>
                <h3 className="h-post__t">{p.title}</h3>
                <span className="h-post__d">{p.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

window.Screens = Object.assign(window.Screens || {}, { Home });
