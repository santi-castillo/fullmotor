**Input · Select · FilterChip** — the form & filtering primitives.

```jsx
import { Input } from '@todomotor/forms';
import { Select } from '@todomotor/forms';
import { FilterChip } from '@todomotor/forms';

<Input label="Buscar" placeholder="Marca o modelo…" iconLeft={<Search size={17} />} />
<Input label="Email" error="Email inválido" required />

<Select placeholder="Ordenar por" options={['Precio: menor a mayor', 'Más nuevos', 'Más potentes']} />

<FilterChip active count={566} icon={<Car size={15} />}>SUVs</FilterChip>
<FilterChip>Autos</FilterChip>
```

Input: `label · hint · error · required · iconLeft · iconRight · size`. Select: pass `options` (strings or `{value,label}`) or `<option>` children, plus `placeholder`. FilterChip: `active`, `count`, `icon` — use for the category/brand/fuel filter rows.
