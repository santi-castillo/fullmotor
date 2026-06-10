# TodoMotor — Design System

A complete, **from-scratch rebrand** of [todomotor.uy](https://todomotor.uy) — Uruguay's vehicle technical-sheet catalog (*fichas técnicas*, precios y comparativas). The name **TodoMotor** is kept; everything else here — logo, color, type, components and full product UI — is new.

This is a self-contained design system. Consumers link one file (`styles.css`) for tokens + fonts, and read components from the compiled bundle as `window.TodoMotorDesignSystem_d01d9d.<Component>`.

---

## 1. Product context

TodoMotor is a **research tool for car buyers in Uruguay**, not a marketplace. People come to read complete spec sheets, check reference prices, and compare vehicles before they buy. The catalog spans **autos, SUVs, camionetas (pickups) and motos** (~1.150 vehicles, 38 brands), plus *Blog del Motor* — articles on taxes, regulation and the local market.

**Primary user:** a particular buyer who researches before purchasing. The design serves that person: airy, scannable, data-forward, trustworthy. The *ficha técnica* (the spec sheet) is the soul of the product, so numbers are treated as a first-class typographic citizen (tabular mono).

**Sources used to build this system**
- Live site (content & IA reference only): `https://todomotor.uy` and `https://todomotor.uy/blog`. Real catalog data (VW Taos, Toyota bZ4X, Renault Boreal, categories & counts, blog posts) was pulled from the homepage and seeded into the UI kit.
- No codebase or Figma was provided — this is a greenfield visual identity. The original site uses Material Symbols icons and a generic blue; **none of that visual language is carried over.**

---

## 2. Brand at a glance

| | |
|---|---|
| **Name / wordmark** | `todomotor` — lowercase, Space Grotesk Bold, with a small mono `UY` tag. "todo" in ink, "motor" in the accent color. |
| **Mark** | A **tachometer / speedometer gauge** in a cobalt rounded-square — precision, performance, the "ficha técnica" idea. `assets/logo/`. |
| **Direction A — Cobalt** (default) | Airy cool-white paper, near-black ink, **electric cobalt** accent (`#1F4FE0`), deep showroom **navy** for dark surfaces. Cool, precise, technical. |
| **Direction B — Signal** (`data-theme="signal"`) | Warm **cream** paper, **racing signal-red** accent (`#E5402A`), warm charcoal ink. Editorial, magazine-like. Same fonts & structure — only paper + accent change. |

Both directions are **light and airy** (per the brief). Flip between them by setting `data-theme="signal"` on `:root`/`<body>`; the UI kit has a live toggle in its header.

---

## 3. Content fundamentals (voice & tone)

Spanish, **Rioplatense (Uruguay)** — this is non-negotiable and threads through every label.

- **Voseo, always.** "Encontrá tu próximo vehículo", "Buscá por modelo", "Mirá las diferencias". Never "Encuentra / Busca / Mira".
- **Second person, warm and direct.** We talk *to* the buyer ("antes de decidir", "para comprar mejor"), not about ourselves. First person plural appears only for the brand's own voice in the blog ("cómo leemos las fichas").
- **Plain, confident, no hype.** The original tagline energy is "Sin vueltas, con datos." Avoid adjectives like "increíble/espectacular". Let the numbers talk.
- **Data is written precisely and locally:** prices `USD 42.390` (dot thousands, es-UY), decimals with comma (`8,9 s`, `14,1 km/L`), units spelled the local way (HP, km/L, cc, Nm, mm).
- **Casing:** Sentence case for headings and buttons ("Ver ficha técnica", "Ver inventario"). UPPERCASE only for mono eyebrows/labels with wide tracking ("FICHAS TÉCNICAS EN URUGUAY", spec labels). Never ALL-CAPS prose.
- **Categories use local words:** Autos, SUVs, **Camionetas** (not "pickups" in UI), Motos, Utilitarios.
- **Emoji:** none. The brand is precise and grown-up. (Icons do the iconographic work.)
- **Microcopy examples:** empty state → "No hay vehículos con esos filtros. Probá ampliar la búsqueda." · price caveat → "Precio de referencia · no incluye gastos de gestoría."

---

## 4. Visual foundations

**Color.** Light/airy is the rule. App background is a cool off-white (`--bg-app #F6F8FB`), cards are pure white, ink is a cool near-black. The accent (cobalt) is used **sparingly and decisively** — CTAs, links, active filters, the wordmark's "motor", selection. Deep **navy** anchors the footer and any dark/inverse section. Status is conventional (green positive / amber warning / red danger). A domain-specific touch: **powertrain colors** (nafta = blue, eléctrico = green, híbrido = teal, diésel = graphite) appear as `FuelTag` chips across cards, filters and fichas. Avoid purple/violet gradients entirely.

**Type.** Three families, each with a job:
- **Space Grotesk** (Bold/Medium) — display, headlines, the logo. Technical, slightly mechanical, automotive.
- **Hanken Grotesk** (400–700) — all UI and body. Neutral, warm, highly legible.
- **JetBrains Mono** (400/500/700) — **prices, specs, VIN, any number on a ficha técnica**. Tabular figures (`font-feature-settings:"tnum"`). This is the signature move: data always looks like data.

Headlines are tight (`letter-spacing -0.02 to -0.035em`, line-height ~1.0–1.06). Mono eyebrows are uppercase with `0.08em` tracking.

**Spacing & layout.** 4px base scale. Generous whitespace; content maxes at `--container-wide 1360px` with 24px gutters. Catalog grids: 3–4 columns desktop, 2 on tablet, 1 on mobile. Filters live in a 248px sticky left rail.

**Corners.** Soft but not bubbly. Cards `--radius-lg 14px`, inputs/buttons `10px`, pills for chips/tags. Hero/stage elements go to `20px`.

**Cards.** White surface, `1px` hairline border (`--border`), `--shadow-xs` at rest. On hover they **lift 3px** and gain `--shadow-card` + a stronger border (vehicle cards). No heavy drop shadows; everything is a short, cool-tinted shadow (`rgba(11,31,68,…)`).

**Borders & dividers.** 1px hairlines everywhere (`--hairline #E9EDF3`). Spec grids use a 1px gap on a hairline background to draw clean cell separators.

**Shadows / elevation.** A restrained ramp: `xs → sm → md → card → lg → xl`. Cards rest at `xs`, hover at `card`, popovers at `pop`. All shadows are cool navy-tinted and low-spread — airy, never moody.

**Motion.** Quick and functional. `--dur 200ms` with `--ease-out` for hovers/lifts; `--dur-fast 120ms` for color/press. Buttons translate down `1px` on press. A `--ease-spring` exists for playful accents. No infinite/decorative loops, no parallax.

**Hover / press states.** Buttons darken to `--accent-hover` on hover, `--accent-press` + 1px nudge on press. Secondary/ghost fill with `--surface-sunken`. Cards lift. Save (heart) scales `1.08` and turns red when active. Focus is always a 3px `--accent-ring` glow (`--focus-ring`).

**Imagery.** Where real vehicle photos exist, they fill the card media (`object-fit: cover`, 16:10). Where they don't, the system shows an **honest, on-brand placeholder**: the gauge mark at ~12% opacity on a subtle radial of paper→sunken. No fake stock, no AI imagery. Pass a real `image` URL to `VehicleCard` / fill the detail stage to upgrade.

**Transparency & blur.** Used only for the sticky header (`color-mix` surface at 88% + `backdrop-filter: blur(10px)`) and the floating save button. Sparingly.

---

## 5. Iconography

- **Library:** [**Lucide**](https://lucide.dev) (v0.469.0), loaded from CDN (`unpkg.com/lucide`). Clean, consistent ~2px stroke icons — a deliberate move away from the original site's Material Symbols, and a better fit for the airy, precise look.
- **Usage in HTML/React:** render `<i data-lucide="car-front"></i>` then call `lucide.createIcons()` (the UI kit re-runs it after every render). Default size 16–22px, `currentColor`.
- **Common glyphs:** `search, sliders-horizontal, git-compare, heart, arrow-right, chevron-right` (UI); `car-front, caravan, truck, bike, layout-grid` (categories); `fuel, zap, leaf, container` (powertrains, mirrored by `FuelTag`); `newspaper, receipt, globe` (blog).
- **The logo mark is bespoke**, not an icon-font glyph — a hand-built gauge SVG (`assets/logo/`), also available as the `<Mark>` / `<Logo markOnly>` React component (fills with `--accent`, so it follows the theme).
- **Emoji / unicode as icons:** not used.
- ⚠️ **Substitution flag:** Lucide is a *new* choice, not extracted from any TodoMotor source (there was no codebase). If you have a preferred icon set, swap it here.

---

## 6. What's in this project (manifest)

**Foundations**
- `styles.css` — the entry point (consumers link this). `@import`s everything below.
- `tokens/` — `fonts.css` (self-hosted woff2 @font-face), `colors.css` (raw palette), `typography.css`, `spacing.css` (spacing/radii/shadows/motion/z), `semantic.css` (roles + `data-theme="signal"`), `base.css` (element defaults + helper classes).
- `assets/fonts/` — Space Grotesk, Hanken Grotesk, JetBrains Mono (latin + latin-ext woff2).
- `assets/logo/` — `todomotor-mark.svg` (cobalt badge), `todomotor-mark-mono.svg` (currentColor).
- `guidelines/*.card.html` — the foundation specimen cards shown in the Design System tab (Brand, Type, Colors, Spacing).

**Components** (`components/<group>/`, exposed on `window.TodoMotorDesignSystem_d01d9d`)
- `brand/` — **Logo**, **Mark**
- `buttons/` — **Button** (primary · secondary · ghost · soft · danger; sm/md/lg; icon/loading)
- `badges/` — **Badge** (5 tones × soft/solid/outline), **FuelTag** (nafta/eléctrico/híbrido/diésel)
- `forms/` — **Input**, **Select**, **FilterChip**
- `catalog/` — **VehicleCard** (the signature card), **SpecGrid** (ficha técnica)

Each component has `<Name>.jsx`, `<Name>.d.ts` (props), `<Name>.prompt.md` (usage), and a directory `*.card.html` thumbnail. Starting points: Logo, Button, Badge, Input, VehicleCard.

**UI kit** (`ui_kits/todomotor/`) — a full, interactive click-through of the rebranded site: **Home → Inventario (con filtros) → Ficha técnica → Comparador → Blog/artículo**, with a live Cobalt/Signal theme toggle, save/favourite, and search. `index.html` is the entry. `lib.jsx` is an auto-vendored mirror of the components so the kit renders standalone (the canonical source lives in `/components`).

---

## 7. Using it

```html
<link rel="stylesheet" href="styles.css">
<!-- React + Babel + the bundle, then: -->
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { Button, VehicleCard, FuelTag, SpecGrid, Logo } = window.TodoMotorDesignSystem_d01d9d;
</script>
```

Switch directions: `document.documentElement.dataset.theme = 'signal'` (or remove for Cobalt).

See `SKILL.md` for using this as a downloadable Claude skill.
