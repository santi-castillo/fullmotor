# Handoff: TodoMotor — Design System & Site Rebrand

## Overview
A complete, from-scratch rebrand of **TodoMotor** (todomotor.uy) — Uruguay's vehicle technical-sheet catalog (*fichas técnicas*, precios y comparativas). The name "TodoMotor" stays; the logo, color, type, components and full product UI are new. This package contains everything needed to implement the brand in a production codebase: design tokens (CSS), self-hosted fonts, the logo, a typed React component library, and a fully interactive reference prototype of every screen.

## About the design files
The files in this project are **design references created in HTML/React** — prototypes and a token/component library showing the intended look and behavior. The task is to **recreate / integrate these designs into the target codebase's environment** using its established patterns. Two paths:

1. **If your stack is React** — the components in `components/` are real, dependency-free React (only `react` + CSS custom properties). You can port them nearly verbatim, or use them as the spec for your own component layer.
2. **Any other stack (Vue, Svelte, SwiftUI, plain CSS, etc.)** — treat `components/*.jsx` as precise behavioral/visual specs and reimplement using your framework. **`styles.css` (tokens) is framework-agnostic and should be adopted as-is** — it's the source of truth for all colors, type, spacing, radii and shadows.

Do **not** ship the prototype HTML directly to production.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, shadows and interactions are all defined as tokens and used consistently. Recreate pixel-for-pixel using the exact token values below. The reference prototype in `ui_kits/todomotor/` is the visual source of truth.

---

## Foundation — wire this up first

1. **Link the tokens.** `styles.css` is the single entry point; it `@import`s `tokens/*.css` (which includes the `@font-face` rules). In a bundler, import `styles.css` once at app root, or copy the `tokens/` folder and `@import` it. Everything downstream references these CSS custom properties — never hard-code hex values.
2. **Fonts** are self-hosted woff2 in `assets/fonts/` (referenced by `tokens/fonts.css` via relative `../assets/fonts/...`). Keep that relative structure, or update the `src:` URLs to your asset pipeline.
3. **Theme switching:** the default theme is **Cobalt**. Set `data-theme="signal"` on `<html>` or `<body>` to switch to the warm **Signal** direction. All accent/paper tokens remap automatically — no component changes needed.

```js
// React + the component bundle
import './styles.css';
const { Button, VehicleCard, FuelTag, SpecGrid, Logo } = window.TodoMotorDesignSystem; // see note on namespace
```

> **Namespace note:** in this design-system project the compiled bundle exposes components on `window.TodoMotorDesignSystem_d01d9d`. When you port the `components/*.jsx` into your own codebase you'll import them normally (`import { Button } from '@/components/buttons/Button'`) — drop the window namespace entirely.

---

## Design tokens

All defined in `tokens/`. Full list in `tokens/colors.css`, `typography.css`, `spacing.css`, `semantic.css`.

### Color — Direction A "Cobalt" (default)
| Role | Token | Value |
|---|---|---|
| App background | `--bg-app` | `#F6F8FB` |
| Card surface | `--surface` | `#FFFFFF` |
| Sunken / input fill | `--surface-sunken` | `#EDF0F5` |
| Text strong | `--text-strong` | `#0E131B` |
| Text body | `--text-body` | `#333D4C` |
| Text muted | `--text-muted` | `#6B7686` |
| Text faint | `--text-faint` | `#8C97A6` |
| Border | `--border` | `#DFE4EC` |
| Border strong | `--border-strong` | `#CDD4DE` |
| Hairline | `--hairline` | `#E9EDF3` |
| **Accent** | `--accent` | `#1F4FE0` |
| Accent hover | `--accent-hover` | `#3A66F0` |
| Accent press | `--accent-press` | `#1740BE` |
| Accent soft (tint) | `--accent-soft` | `#DEE8FF` |
| Accent ink (text on tint) | `--accent-ink` | `#102B78` |
| Brand deep (footer/dark) | `--brand-deep` | `#0B1F44` |

### Color — Direction B "Signal" (`[data-theme="signal"]` overrides)
| Role | Token | Value |
|---|---|---|
| App background | `--bg-app` | `#F5F1E8` (cream) |
| Surface | `--surface` | `#FFFEFA` |
| Text strong | `--text-strong` | `#1C1813` |
| **Accent** | `--accent` | `#E5402A` (signal red) |
| Accent press | `--accent-press` | `#C42E1C` |
| Brand deep | `--brand-deep` | `#1C1813` |

### Status & powertrain (domain) colors
| Role | Token | Value |
|---|---|---|
| Positive | `--positive` / soft | `#0E9F6E` / `#DCF4EA` |
| Warning | `--warning` / soft | `#D98412` / `#FBEBCF` |
| Danger | `--danger` / soft | `#DC3B30` / `#FBE2E0` |
| Nafta | `--c-fuel-nafta` / bg | `#2A6FDB` / `#E4EEFB` |
| Eléctrico | `--c-fuel-elec` / bg | `#0E9F6E` / `#DCF4EA` |
| Híbrido | `--c-fuel-hibrido` / bg | `#0E9CB0` / `#D6F1F5` |
| Diésel | `--c-fuel-diesel` / bg | `#6B7686` / `#E9EDF3` |

### Typography
| Family | Token | Use |
|---|---|---|
| Space Grotesk (500/700) | `--font-display` | Headlines, hero, logo |
| Hanken Grotesk (400–700) | `--font-sans` | All UI & body |
| JetBrains Mono (400/500/700) | `--font-mono` | **Prices, specs, all numbers** — `font-feature-settings:"tnum"` |

Scale tokens `--text-2xs (11)` → `--text-6xl (84)`. Headlines: `letter-spacing -0.02…-0.035em`, `line-height 1.0–1.06`. Mono eyebrows: UPPERCASE, `letter-spacing 0.08em`. Prices in es-UY format: `USD 42.390`; decimals with comma (`8,9 s`).

### Spacing / radii / shadows / motion
- Spacing: 4px base — `--space-1 (4)` … `--space-13 (128)`.
- Radii: `--radius-sm (6)`, `--radius-md (10)` (buttons/inputs), `--radius-lg (14)` (cards), `--radius-xl (20)`, `--radius-pill`.
- Shadows (cool navy-tinted, low spread): `--shadow-xs` (card rest) → `--shadow-card` (card hover) → `--shadow-lg/xl`.
- Motion: `--dur 200ms` + `--ease-out` for hovers/lifts; `--dur-fast 120ms` for color/press. Focus ring: `--focus-ring` (3px accent glow).
- Layout: `--container-wide 1360px`, 24px gutters.

---

## Components (`components/`)
Each has `<Name>.jsx` (impl), `<Name>.d.ts` (props/types), `<Name>.prompt.md` (usage). Read the `.d.ts` for the exact prop contract.

| Component | Dir | Key props | Notes |
|---|---|---|---|
| **Button** | `buttons/` | `variant` (primary/secondary/ghost/soft/danger), `size` (sm/md/lg), `block`, `loading`, `iconLeft/Right`, `iconOnly` | Press nudges 1px; hover→`--accent-hover` |
| **Badge** | `badges/` | `tone` (neutral/accent/positive/warning/danger), `variant` (soft/solid/outline), `dot` | |
| **FuelTag** | `badges/` | `type` (nafta/electrico/hibrido/diesel), `plain` | Domain powertrain chip |
| **Input** | `forms/` | `label`, `hint`, `error`, `iconLeft/Right`, `size` | |
| **Select** | `forms/` | `options` (string\|{value,label}[]), `placeholder`, `size` | Styled native select |
| **FilterChip** | `forms/` | `active`, `count`, `icon` | Toggle pill for filters |
| **VehicleCard** | `catalog/` | `brand, model, trim, year, price, power, fuel, condition, image, saved, onToggleSave` | **The signature card.** Composes FuelTag. Photo via `image`, else gauge placeholder |
| **SpecGrid** | `catalog/` | `items` or `groups[{title,items:[{label,value,highlight}]}]`, `cols` | Ficha técnica spec list |
| **Logo / Mark** | `brand/` | `size`, `inverse`, `showUY`, `markOnly` | Gauge mark fills with `--accent` |

**Implementation pattern:** each `.jsx` injects a `<style>` block once (class names prefixed `tm-`) and reads colors from the CSS custom properties. If you port to CSS Modules / Tailwind / styled-components, copy the rules from the injected `CSS` string in each file and map the tokens.

---

## Screens (reference prototype: `ui_kits/todomotor/`)
Interactive click-through SPA. `index.html` loads the screens; each screen is a small JSX file. State lives in `app.jsx` (route + saved + theme, persisted to localStorage).

1. **Home** (`home.jsx`) — Hero (display headline + big pill search + stat strip), category cards (5), "Destacados" 4-col VehicleCard grid, blog teaser (3). Sticky translucent header, navy footer.
2. **Inventario** (`inventory.jsx`) — 248px sticky filter rail (category radio-list, powertrain checkboxes, max-price), toolbar with active filter chips + sort Select, responsive 3-col results grid, empty state. Live filtering + sorting.
3. **Ficha técnica / Detail** (`detail.jsx`) — Two-column: media stage + thumbnails (left), sticky info panel (brand/model/trim, FuelTag + badges, large mono price, Comparar/Guardar CTAs, 4 KPI tiles) (right). Below: full `SpecGrid` in groups, plus "Comparables" 4-card strip.
4. **Comparador** (`compare.jsx`) — Horizontal-scroll table, up to 4 vehicles; sticky row labels; **best value per row highlighted** (lowest price / highest power) in positive-green; add-via-Select / remove-X columns.
5. **Blog + Article** (`blog.jsx`) — Index (featured + card grid), and a reader view (badge meta, large title, body paragraphs in Rioplatense Spanish).

### Interactions & behavior
- **Navigation:** SPA route object `{name, ...params}`; on nav, `window.scrollTo({top:0})`. Wire to your router (URLs suggested: `/`, `/?category=suvs`, `/vehiculo/:id`, `/comparar`, `/blog`, `/blog/:slug`).
- **Save / favourite:** heart toggles per-vehicle, count in header; persisted.
- **Theme toggle:** header control flips `data-theme` between `''` (Cobalt) and `signal`; persisted.
- **Hover:** cards lift `translateY(-3px)` + `--shadow-card`; buttons darken; save scales `1.08`.
- **Transitions:** `200ms ease-out`. Focus: 3px accent ring. No decorative loops.
- **Responsive:** grids collapse 4→2→1; filter rail & detail panel un-stick under 1000px.

### State (per screen)
- App: `route`, `saved` (map), `theme`. Inventory: `cat`, `fuels[]`, `q`, `sort`, `maxPrice`. Compare: `ids[]` (max 4). Detail/Blog: derive from `route.id` / `route.post`.
- Real data needs a vehicles endpoint (see `data.jsx` for the exact shape: brand, model, trim, year, price, power, fuel, cat, condition, + spec fields torque/accel/cc/caja/traccion/tanque/consumo/largo/baul).

---

## Voice & content rules (critical)
**Rioplatense Spanish, voseo, no emoji.** "Encontrá / Buscá / Mirá", not "Encuentra/Busca/Mira". Sentence case for headings & buttons; UPPERCASE only for mono eyebrows. Prices `USD 42.390`, decimals with comma. Categories: Autos, SUVs, **Camionetas**, Motos. Full rules in `readme.md` §3.

## Assets
- **Logo:** `assets/logo/todomotor-mark.svg` (cobalt badge) + `todomotor-mark-mono.svg` (currentColor). Also the `<Logo>`/`<Mark>` React components.
- **Fonts:** `assets/fonts/*.woff2` — Space Grotesk, Hanken Grotesk, JetBrains Mono (latin + latin-ext).
- **Icons:** **Lucide** (`lucide.dev`), loaded from CDN in the prototype (`<i data-lucide="…">` + `lucide.createIcons()`). In production use `lucide-react` (or your icon lib). Glyphs used: `search, sliders-horizontal, git-compare, heart, arrow-right, chevron-right, car-front, caravan, truck, bike, fuel, zap, leaf, container, newspaper, receipt, globe`.
- **Vehicle photos:** none included — the system uses an on-brand gauge placeholder. Pass real `image` URLs to `VehicleCard` / the detail stage.

### ⚠️ Substitution flags (decide before shipping)
- **Fonts** (Space Grotesk / Hanken Grotesk / JetBrains Mono) and **icons** (Lucide) were chosen for this rebrand — there was no source codebase. Swap if the team has preferred families.
- The **logo** is a proposed direction (tachometer concept).

## Files in this package (project root)
- `styles.css`, `tokens/` — design tokens + `@font-face`
- `components/` — typed React component library (`.jsx` + `.d.ts` + `.prompt.md`)
- `assets/fonts/`, `assets/logo/` — webfonts + logo SVGs
- `ui_kits/todomotor/` — interactive reference prototype (all 5 screens). Open `index.html`.
- `readme.md` — the full brand/voice/visual guide
- `SKILL.md` — using this system as a Claude skill
- `guidelines/` — foundation specimen cards (color/type/spacing/brand swatches)

> The `_ds_*` files and `*.card.html` thumbnails are design-system tooling — ignore them when implementing.
