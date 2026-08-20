# Guía de compra — árbol curado "Top TodoMotor"

La guía (`/guia-de-compra`) es híbrida:

- El **podio Top 3** sale de este árbol curado (`picks.ts`), filtrado por las respuestas del usuario (precio, motorización, caja, personas).
- Si un nodo queda con menos de 3 picks válidos, o el usuario no eligió uso, el podio se completa con el **ranking por reglas** sobre el catálogo real (`src/lib/buying-guide/scoring.ts`), marcado como "Sugerido por datos".
- "Otros que también encajan" siempre sale del ranking por reglas.

## Estructura

```ts
{ use: 'familia', band: '20-30k', picks: [ { slug, why: ['…', '…'], note? }, … ] }
```

- **Nodos**: 5 usos (`familia`, `ciudad`, `trabajo`, `ruta`, `deportivo`) × 5 franjas (`hasta-20k` ≤ 20.000 · `20-30k` · `30-45k` · `45-70k` · `mas-70k`) = 25 nodos.
- **Pick** = una versión concreta del catálogo (`slug`). El precio de esa versión define la franja; la familia (`modelFamilyId`) se resuelve sola.
- **Orden** = preferencia editorial (el primero es la recomendación más fuerte).
- **`why`**: 2–4 razones cortas en español rioplatense, concretas y verificables con la ficha ("6 airbags y frenado autónomo de emergencia", "Baúl de 475 L"). Se muestran tal cual como chips. Se admite una razón editorial (marca, red de servicio, garantía) siempre que sea factual.
- **`note`**: contexto interno para curadores; nunca se renderiza.

## Reglas (las valida `npm run guide:check`)

1. El slug existe en el catálogo (X-Country uy) y es `cars`, `suvs` o `pickups`.
2. El precio está dentro de la franja del nodo.
3. La carrocería es válida para el uso (ver `USE_AFFINITY` en `src/lib/buying-guide/questions.ts`).
4. Una sola familia por nodo (nunca dos versiones del mismo modelo).
5. 3–5 picks por nodo; menos solo si no hay oferta real (ej. `deportivo` × `hasta-20k`).
6. Al menos 2 razones por pick.

Los picks inválidos **no rompen la página**: en runtime se descartan y se loguea `[guide] pick descartado …` en el server; el hueco lo cubre el ranking por reglas.

## Cómo actualizar

1. Editar `picks.ts` (agregar/quitar/reordenar picks, ajustar `why`).
2. Actualizar `PICKS_UPDATED_AT`.
3. `npm run guide:check` — valida contra la API viva e imprime la cobertura por nodo y escenarios de ejemplo. `npm run guide:check -- --quiet` solo valida (exit 1 si hay problemas).
4. Commit + deploy (Vercel).

Para explorar candidatos: `npm run guide:check -- --dump /ruta/index.json` vuelca el índice slim (1 registro por versión, con precio, carrocería, HP, baúl, airbags, ADAS, equipamiento, autonomía) para filtrar y comparar.

## Fichas sin imagen

La guía muestra tarjetas con foto: el podio (`GuidePodiumCard`) y "otros que también encajan" usan `image` (primera imagen de la ficha). Una ficha sin imagen sale con el placeholder, y eso pega sobre todo en el podio.

`npm run guide:images` audita eso contra el catálogo vivo: arma el índice de la guía, simula el wizard sobre **todo** el espacio de respuestas (uso × presupuesto × personas × motor × caja × prioridad = 15.750 escenarios) y lista las fichas que aparecen como tarjeta y no tienen imagen, agrupadas por `modelFamilyId` y ordenadas por visibilidad:

- `top` — apariciones en el podio curado (Top TodoMotor)
- `data` — apariciones en el podio completado por el ranking por reglas
- `otros` — apariciones en "otros que también encajan"

Las familias marcadas `TOP …` son picks curados: son las que más se ven y las primeras a resolver. `--json <archivo>` vuelca el detalle (slug, id, precio por ficha) para trabajar la carga.

Para cargar las imágenes se sigue el paso "Cargar IMÁGENES" de la routine diaria de TodoMotor (una hero 3/4 frontal por modelo, reutilizada en todas sus versiones; solo fuentes oficiales —fabricante, importador local o sala de prensa—; nunca autoblog; sin remover el fondo; verificación visual antes de subir; 1280×800; `POST /api/admin/vehicles/{uuid}/images?replace=true`).

## Señal de ventas ACAU ("los más vendidos")

La guía usa las estadísticas públicas de ACAU (Asociación de Concesionarios, https://www.acau.com.uy → Estadísticas → **Compilado AAAA**, ventas por modelo/versión de los representantes oficiales) como **una señal más**:

- En el ranking por reglas: criterio `market` (~10% del puntaje, log de unidades). Un modelo sin dato (marcas fuera de ACAU: Tesla, KGM, premium…) queda **neutral**, nunca penalizado.
- En las razones y el podio: chip "Top N ventas 2026" cuando el modelo está entre los 10 más vendidos de su segmento ACAU (autos / SUV / utilitarios) y una razón "N.º 3 en ventas de autos 2026 en Uruguay (ACAU)". En los picks curados entra como 4.ª razón si hay lugar; no reemplaza las editoriales.
- Como input de curaduría: `npm run guide:check` imprime, por nodo, los más vendidos que no están en el top, y `--dump` incluye `sold` / `soldRank`.

Datos: `acau-YYYY.json` (generado, versionado). Regenerar con `npm run acau:import` (resuelve el link "Compilado <año>" en la home de ACAU, parsea el .xlsx sin dependencias, agrega por modelo raíz y cruza con el catálogo). Si el importador lista un modelo ACAU sin familia que sí existe en el catálogo con otro nombre, agregá un alias en `SALES_ALIASES` (`src/lib/buying-guide/sales.ts`). ACAU actualiza mensualmente; la routine lo refresca.

Se cita la fuente en la página ("Ventas: ACAU, acumulado enero–<mes> <año>") y no se republican las tablas.

## Mantenimiento automático (routine)

Una routine semanal de Claude Code revisa si entraron modelos nuevos y propone cambios al árbol como PR (nunca mergea sola). Pasos que sigue:

0. `npm run acau:import`: si `acau-<año>.json` cambió (mes nuevo), va en el PR; usar `sold` / `soldRank` como criterio al comparar picks (un top-10 en ventas es candidato fuerte; un pick con ventas marginales frente a un rival top-5 con datos similares debería ceder).
1. `GET https://api.todomotor.uy/api/vehicles?publishedAfter=<fecha última corrida>&limit=100` con headers `X-Country: uy`, `X-Vehicle-Type: all` (paginar). Quedarse con `cars`/`suvs`/`pickups`.
2. Para cada modelo nuevo: ubicar los nodos candidatos (usos cuya carrocería lo admite × franja de su precio) y compararlo con los picks actuales del nodo por datos de ficha (precio, airbags, ADAS, baúl, potencia, autonomía, equipamiento) y criterio editorial (marca, red de servicio, garantía).
3. Correr `npm run guide:check -- --quiet` para detectar picks rotos (slug que ya no existe, precio que se salió de la franja).
4. Si hay cambios que valgan la pena: editar `picks.ts` (+ `PICKS_UPDATED_AT`), volver a correr el check, y abrir un PR con una tabla "nodo → cambio → por qué".
5. Si no hay nada relevante, no hacer nada.

Reproducible a mano desde el repo: `claude "Revisá la guía de compra: seguí src/data/buying-guide/README.md sección 'Mantenimiento automático' con fecha última corrida <YYYY-MM-DD>"`.
