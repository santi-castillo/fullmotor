---
name: todomotor-design
description: Use this skill to generate well-branded interfaces and assets for TodoMotor (Uruguay's vehicle technical-sheet catalog — autos, SUVs, camionetas, motos), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, logo assets, and UI kit components for prototyping in Rioplatense Spanish.
user-invocable: true
---

Read the `readme.md` file within this skill first — it is the full design guide (brand context, content/voice rules, visual foundations, iconography, and a manifest of every file). Then explore the other files as needed.

Key facts to anchor on:
- **Brand:** TodoMotor — clean, airy, data-forward vehicle catalog for Uruguay. Voice is **Rioplatense Spanish, voseo** ("Encontrá", "Buscá", "Mirá"). No emoji.
- **Foundations:** link `styles.css` for all tokens + self-hosted fonts. Two light directions: **Cobalt** (default) and **Signal** (`data-theme="signal"`).
- **Type:** Space Grotesk (display/logo), Hanken Grotesk (UI/body), JetBrains Mono (all prices & specs — tabular).
- **Components:** read from the compiled bundle as `window.TodoMotorDesignSystem_d01d9d.<Name>` (Button, Badge, FuelTag, Input, Select, FilterChip, VehicleCard, SpecGrid, Logo, Mark). Each has a `.prompt.md` with usage.
- **Icons:** Lucide via CDN (`<i data-lucide="…">` + `lucide.createIcons()`).
- **Logo:** `assets/logo/` (gauge mark) or the `<Logo>` / `<Mark>` components.

How to work:
- If creating **visual artifacts** (slides, mocks, throwaway prototypes), copy the assets you need out of `assets/` and write static HTML files for the user to view. For a working component preview, vendor `ui_kits/todomotor/lib.jsx` or load the bundle. Reuse the patterns in `ui_kits/todomotor/` (VehicleCard grids, ficha técnica spec layout, filter rail).
- If working on **production code**, copy assets and read the rules here to become an expert in designing with this brand — reference the tokens in `styles.css` rather than hard-coding values.
- Keep all copy in Uruguayan Spanish; format prices `USD 42.390` and decimals with comma.

If the user invokes this skill without other guidance, ask what they want to build or design, ask a few focused questions (surface, audience, Cobalt vs Signal, how many variations), then act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
