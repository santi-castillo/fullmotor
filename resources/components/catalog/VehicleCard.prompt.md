**VehicleCard · SpecGrid** — the domain heart of TodoMotor.

```jsx
import { VehicleCard } from '@todomotor/catalog';
import { SpecGrid } from '@todomotor/catalog';

<VehicleCard
  brand="Volkswagen" model="Taos" year={2026}
  trim="Highline 250 TSI 1.4 A/T"
  price={42390} power={150} fuel="nafta" condition="Nuevo"
  saved={false} onToggleSave={() => {}}
  href="/vehiculo/uy-volkswagen-taos-2026-highline"
/>

<SpecGrid groups={[
  { title: 'Motor y rendimiento', items: [
    { label: 'Cilindrada', value: '1.4 L' },
    { label: 'Potencia', value: '150 HP', highlight: true },
    { label: '0–100 km/h', value: '8,9 s' },
    { label: 'Caja', value: 'Automática DSG' },
  ]},
]} />
```

VehicleCard: pass `image` for a real photo (falls back to a gauge placeholder); omit `onToggleSave` to hide the heart. SpecGrid: flat `items` or titled `groups`, `cols` controls columns, `highlight` accents a value. Use these for inventory grids and the ficha técnica detail view.
