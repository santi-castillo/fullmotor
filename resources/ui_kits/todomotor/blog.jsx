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
(function(){ if(typeof document!=='undefined' && !document.querySelector('[data-tm="blog"]')){ const s=document.createElement('style'); s.setAttribute('data-tm','blog'); s.textContent=BLOG_CSS; document.head.appendChild(s);} })();

const BODIES = {
  mercosur: [
    'El principio de acuerdo entre el Mercosur y la Unión Europea reordena, de a poco, el tablero del sector automotor uruguayo. Para un mercado chico y casi totalmente importador como el nuestro, cada décima de arancel se traslada al precio de góndola.',
    'La baja de aranceles es gradual y se extiende por varios años, con cronogramas distintos según se trate de autos terminados, motos o autopartes. En el corto plazo el efecto sobre los 0 km europeos es marginal; el grueso del ajuste llega en tramos posteriores.',
    'Para el comprador particular, la lectura es simple: no conviene esperar un derrumbe de precios inmediato, pero sí vale la pena seguir los plazos. En categorías premium de origen europeo, la diferencia acumulada puede volverse relevante.',
  ],
  impuestos: [
    'Cuando mirás el precio de un 0 km en Uruguay y lo comparás con el de origen, la brecha sorprende. Buena parte de esa diferencia no es del importador: es impositiva.',
    'Sobre el valor en aduana se aplican aranceles, después el IMESI —que varía según cilindrada y tipo de vehículo— y finalmente el IVA, que se calcula sobre la base ya recargada. Es decir: impuesto sobre impuesto.',
    'Entender esta composición ayuda a leer mejor las fichas. Dos autos con precios de lista parecidos pueden tener cargas muy distintas según su motorización, y eso explica saltos de precio que a primera vista no cierran.',
  ],
  '200cc': [
    'La cilindrada define mucho más que la potencia: marca el tipo de libreta que necesitás y, en los hechos, condiciona cómo arranca buena parte de los motociclistas uruguayos.',
    'La franja hasta 200cc concentra la mayoría del parque por una mezcla de precio, consumo y requisitos. Pasar esa barrera implica otra categoría de licencia y, muchas veces, otro nivel de seguro.',
    'La recomendación es clara: antes de elegir una moto por estética o precio, revisá la cilindrada y el camino correcto para circular en regla. La ficha técnica es el primer lugar donde mirarlo.',
  ],
};

function Blog({ route, onNav }) {
  const { POSTS } = window.TMK;
  const { Icon } = window.TMC;

  if (route.post) {
    const p = POSTS.find((x) => x.id === route.post) || POSTS[0];
    const body = BODIES[p.id] || [];
    return (
      <div className="art">
        <span className="art__back" onClick={() => onNav({ name: 'blog' })}><Icon n="arrow-left" size={16} /> Volver al blog</span>
        <div className="art__meta"><window.TM.Badge tone="accent">{p.tag}</window.TM.Badge><span className="bl__date">{p.date} · 4 min de lectura</span></div>
        <h1 className="art__title">{p.title}</h1>
        <div className="art__hero"><Icon n="newspaper" size={44} /></div>
        <div className="art__body">
          {body.map((para, i) => <p key={i}>{para}</p>)}
          <h3>En resumen</h3>
          <p>{p.excerpt} Seguí las fichas técnicas de TodoMotor para comparar con datos antes de decidir.</p>
        </div>
      </div>
    );
  }

  const [feat, ...rest] = POSTS;
  return (
    <div className="bl">
      <div className="bl__head">
        <span className="bl__kicker">Blog del Motor</span>
        <h1 className="bl__title">Contexto para comprar mejor</h1>
        <p className="bl__sub">Impuestos, normativa y guías del mercado automotor uruguayo.</p>
      </div>

      <article className="bl__feat" onClick={() => onNav({ name: 'blog', post: feat.id })}>
        <div className="bl__featimg"><Icon n="newspaper" size={52} /></div>
        <div className="bl__featb">
          <div className="bl__meta"><span className="bl__tag">{feat.tag}</span><span className="bl__date">{feat.date}</span></div>
          <h2 className="t">{feat.title}</h2>
          <p className="x">{feat.excerpt}</p>
          <span className="h-link" style={{ marginTop: 16, color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', gap: 6, alignItems: 'center' }}>Leer artículo <Icon n="arrow-right" size={16} /></span>
        </div>
      </article>

      <div className="bl__grid">
        {rest.concat(POSTS).slice(0, 6).map((p, i) => (
          <article className="bl__card" key={p.id + i} onClick={() => onNav({ name: 'blog', post: p.id })}>
            <div className="bl__cardtop"><Icon n={p.tag === 'Motos' ? 'bike' : p.tag === 'Impuestos' ? 'receipt' : 'globe'} size={30} /></div>
            <div className="bl__cardb">
              <div className="bl__meta"><span className="bl__tag">{p.tag}</span><span className="bl__date">{p.date}</span></div>
              <h3 className="bl__cardt">{p.title}</h3>
              <p className="bl__cardx">{p.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

window.Screens = Object.assign(window.Screens || {}, { Blog });
