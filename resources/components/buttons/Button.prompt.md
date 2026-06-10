**Button** — the primary action control; use cobalt `primary` for the main action on a view, `secondary` for adjacent actions, `ghost` for low-emphasis, `soft` for tinted inline actions, `danger` for destructive.

```jsx
import { Button } from '@todomotor/buttons';

<Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
  Ver ficha técnica
</Button>
<Button variant="secondary">Comparar</Button>
<Button variant="ghost" size="sm">Cancelar</Button>
<Button iconOnly iconLeft={<Heart size={18} />} variant="secondary" aria-label="Guardar" />
```

Variants: `primary · secondary · ghost · soft · danger`. Sizes: `sm · md · lg`. Props: `block`, `loading`, `iconLeft`, `iconRight`, `iconOnly`, `as="a"`. Icons come from Lucide — pass them as nodes; the button only handles layout.
