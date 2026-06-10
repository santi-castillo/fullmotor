**Badge** — compact status/metadata label. **FuelTag** — domain powertrain chip for vehicle cards & fichas.

```jsx
import { Badge } from '@todomotor/badges';
import { FuelTag } from '@todomotor/badges';

<Badge tone="positive" dot>Disponible</Badge>
<Badge tone="accent" variant="solid">Nuevo</Badge>
<Badge tone="warning" variant="outline">Por encargo</Badge>

<FuelTag type="electrico" />
<FuelTag type="nafta" plain />
```

Badge tones: `neutral · accent · positive · warning · danger`; variants `soft · solid · outline`; sizes `sm · md`; `dot` for a leading status dot. FuelTag types: `nafta · electrico · hibrido · diesel`; `plain` removes the tinted pill.
