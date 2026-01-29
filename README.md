# FullMotor

Plataforma de fichas tecnicas de vehiculos en Uruguay. 100% estatica, sin base de datos.

## Inicio rapido

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Estructura

```
fullmotor/
├── data/
│   └── vehicles.json      # Base de datos de vehiculos
├── src/
│   ├── app/               # Paginas Next.js
│   ├── lib/
│   │   └── data.ts        # Funciones para leer vehicles.json
│   └── types/
│       └── vehicle.ts     # Tipos TypeScript
└── public/                # Assets estaticos
```

## Agregar vehiculos

Editar `data/vehicles.json` y agregar un nuevo objeto al array:

```json
{
  "id": "marca-modelo-año-version",
  "slug": "marca-modelo-año-version",
  "brand": "Marca",
  "model": "Modelo",
  "year": 2026,
  "version": "Version (opcional)",
  "category": "autos|suvs|camionetas|motos",
  "subcategory": "sedan|suv|pickup|naked|etc (opcional)",
  "priceUSD": 30000,
  "priceUYU": 1260000,
  "engineCc": 2000,
  "engineHp": 150,
  "engineTorque": 200,
  "fuelType": "nafta|diesel|electrico|hibrido",
  "transmission": "manual|automatica|cvt",
  "gears": 6,
  "length": 4500,
  "width": 1800,
  "height": 1400,
  "wheelbase": 2700,
  "trunkCapacity": 450,
  "fuelTank": 50,
  "weight": 1400,
  "safetyFeatures": ["ABS", "Airbags", "ESP"],
  "equipment": ["Pantalla tactil", "Apple CarPlay"],
  "images": [],
  "description": "Descripcion del vehiculo."
}
```

### Campos requeridos

- `id`: Identificador unico
- `slug`: URL amigable (igual que id)
- `brand`: Marca del vehiculo
- `model`: Modelo
- `year`: Año
- `category`: Una de: `autos`, `suvs`, `camionetas`, `motos`
- `safetyFeatures`: Array de caracteristicas de seguridad (puede estar vacio)
- `equipment`: Array de equipamiento (puede estar vacio)
- `images`: Array de URLs de imagenes (puede estar vacio)

### Campos opcionales

Todos los demas campos son opcionales. Si no aplican (ej: `trunkCapacity` en motos), usar `null`.

## Categorias disponibles

| ID | Nombre | Descripcion |
|---|---|---|
| `autos` | Autos | Sedans, hatchbacks, coupes |
| `suvs` | SUVs | SUVs y crossovers |
| `camionetas` | Camionetas | Pickups |
| `motos` | Motos | Todas las motocicletas |

## Build para produccion

```bash
npm run build
npm run start
```

## Deploy

Al ser 100% estatico, se puede deployar en:

- Vercel (recomendado)
- Netlify
- GitHub Pages
- Cualquier hosting estatico

```bash
npm run build
# Los archivos quedan en .next/
```

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
