/* TodoMotor UI kit — app shell / router. */

function App() {
  const { Header, Footer } = window.TMC;
  const { Home, Inventory, Detail, Compare, Blog } = window.Screens;

  const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const [route, setRoute] = React.useState(() => load('tm_route', { name: 'home' }));
  const [saved, setSaved] = React.useState(() => load('tm_saved', {}));
  const [theme, setTheme] = React.useState(() => load('tm_theme', 'cobalt'));
  const [query, setQuery] = React.useState('');

  React.useEffect(() => { localStorage.setItem('tm_route', JSON.stringify(route)); }, [route]);
  React.useEffect(() => { localStorage.setItem('tm_saved', JSON.stringify(saved)); }, [saved]);
  React.useEffect(() => {
    localStorage.setItem('tm_theme', JSON.stringify(theme));
    document.documentElement.dataset.theme = theme === 'signal' ? 'signal' : '';
  }, [theme]);

  // refresh lucide icons after every render
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const onNav = (r) => { setRoute(r); window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' }); };
  const toggleSave = (id) => setSaved((s) => { const n = { ...s }; if (n[id]) delete n[id]; else n[id] = true; return n; });
  const savedCount = Object.keys(saved).length;

  let Screen = Home;
  if (route.name === 'inventory') Screen = Inventory;
  else if (route.name === 'detail') Screen = Detail;
  else if (route.name === 'compare') Screen = Compare;
  else if (route.name === 'blog') Screen = Blog;

  return (
    <div>
      <Header route={route.name} onNav={onNav} savedCount={savedCount} theme={theme} onTheme={setTheme} query={query} onQuery={setQuery} />
      <main>
        <Screen route={route} onNav={onNav} saved={saved} toggleSave={toggleSave} />
      </main>
      <Footer onNav={onNav} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
