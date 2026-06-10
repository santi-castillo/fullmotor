/* TodoMotor UI kit — Header, Footer, Icon. Exposes window.TMC. */

function Icon({ n, size = 18, style }) {
  return <i data-lucide={n} style={{ width: size, height: size, display: 'inline-flex', ...style }}></i>;
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
(function(){ if(typeof document!=='undefined' && !document.querySelector('[data-tm="chrome"]')){ const s=document.createElement('style'); s.setAttribute('data-tm','chrome'); s.textContent=CHROME_CSS; document.head.appendChild(s);} })();

function Header({ route, onNav, savedCount = 0, theme = 'cobalt', onTheme, query = '', onQuery }) {
  return (
    <header className="k-header">
      <div className="k-header__in">
        <Logo as="div" size={26} onClick={() => onNav({ name: 'home' })} style={{ cursor: 'pointer' }} />
        <nav className="k-nav">
          <a className={route === 'inventory' ? 'is-active' : ''} onClick={() => onNav({ name: 'inventory', cat: 'all' })}>Vehículos</a>
          <a className={route === 'blog' ? 'is-active' : ''} onClick={() => onNav({ name: 'blog' })}>Blog</a>
        </nav>
        <div className="k-search">
          <Icon n="search" size={17} />
          <input placeholder="Buscar marca o modelo…" value={query} onChange={(e) => onQuery && onQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onNav({ name: 'inventory', cat: 'all', q: query }); }} />
        </div>
        <div className="k-actions">
          <div className="k-theme" title="Cambiar dirección visual">
            <button className={theme === 'cobalt' ? 'on' : ''} onClick={() => onTheme('cobalt')} aria-label="Cobalt"><Icon n="droplet" size={16} /></button>
            <button className={theme === 'signal' ? 'on' : ''} onClick={() => onTheme('signal')} aria-label="Signal"><Icon n="flame" size={16} /></button>
          </div>
          <button className="k-icbtn" onClick={() => onNav({ name: 'compare' })}><Icon n="git-compare" size={17} />Comparar</button>
          <button className="k-icbtn"><Icon n="heart" size={17} />Guardados {savedCount > 0 && <span className="k-icbtn__count">{savedCount}</span>}</button>
        </div>
      </div>
    </header>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="k-footer">
      <div className="k-footer__in">
        <div style={{ maxWidth: 280 }}>
          <Logo as="div" size={24} inverse />
          <p style={{ color: 'var(--text-inverse-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginTop: 14 }}>
            Fichas técnicas, precios y comparativas de vehículos en Uruguay. Información de referencia para decidir mejor.
          </p>
        </div>
        <div className="k-footer__cols">
          <div className="k-footer__col">
            <h5>Catálogo</h5>
            <a onClick={() => onNav({ name: 'inventory', cat: 'autos' })}>Autos</a>
            <a onClick={() => onNav({ name: 'inventory', cat: 'suvs' })}>SUVs</a>
            <a onClick={() => onNav({ name: 'inventory', cat: 'pickups' })}>Camionetas</a>
            <a onClick={() => onNav({ name: 'inventory', cat: 'motos' })}>Motos</a>
          </div>
          <div className="k-footer__col">
            <h5>TodoMotor</h5>
            <a onClick={() => onNav({ name: 'blog' })}>Blog del Motor</a>
            <a onClick={() => onNav({ name: 'compare' })}>Comparador</a>
            <a>Cómo leemos las fichas</a>
          </div>
        </div>
      </div>
      <div className="k-footer__bottom"><div className="in">
        <span>© 2026 TodoMotor Uruguay · Información de referencia</span>
        <span>Hecho en Montevideo, Uruguay</span>
      </div></div>
    </footer>
  );
}

window.TMC = { Icon, Header, Footer };
