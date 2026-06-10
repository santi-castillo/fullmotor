**Logo** — the TodoMotor lockup (gauge mark + wordmark + UY tag). **Mark** — the gauge mark alone, for app icons / favicons.

```jsx
import { Logo, Mark } from '@todomotor/brand';

<Logo size={30} />                     {/* default light lockup */}
<Logo size={24} inverse showUY={false} />  {/* on a dark header */}
<Logo markOnly size={28} />            {/* mark only */}
<Mark size={40} />                     {/* raw SVG mark */}
```

`size` drives the wordmark px (mark scales 1.5×). `inverse` for dark surfaces, `showUY` toggles the country tag, `markOnly`/`Mark` for icon use. The mark fills with `--accent`, so it follows the active theme (cobalt or signal).
