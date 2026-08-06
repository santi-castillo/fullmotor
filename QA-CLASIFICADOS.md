# QA de producto — Clasificados

**Fecha:** 6 de agosto de 2026 · **Entorno:** producción (`todomotor.uy` + `api.todomotor.uy`) · **Cuenta:** santiago998@gmail.com

Se crearon 14 avisos de prueba reales, se recorrió el ciclo completo (alta, edición, fotos, estados, comentarios, pago, filtros, paginación, mobile) y se borró todo al terminar. La API quedó en `total: 0` y el sitemap regeneró sin residuos.

---

## Resumen

El módulo está **funcionalmente más completo de lo que aparenta**: crear, editar, pausar, vender, comentar, paginar y el SEO por estado funcionan bien y con buen criterio. El problema no es lo que falta construir, sino que **tres defectos bloquean el producto de punta a punta**: no se puede iniciar sesión por el camino natural, no se puede pagar, y el aviso publica el teléfono aunque el vendedor pida ocultarlo.

Los tres son de producción y ninguno es visible sin probar el flujo real. El marketplace vacío (0 avisos) probablemente sea consecuencia, no causa.

| Severidad | Cantidad |
|---|---|
| P0 — bloquea el uso del producto | 6 |
| P1 — fricción alta o pérdida de conversión | 11 |
| P2 — pulido | 16 |

---

## P0 — Bloqueantes

### P0-1 · El botón de Google no aparece en el camino de alta

Un visitante nuevo que toca "Publicá tu aviso" cae en un modal **sin botón de login**. Solo puede tocar "Cancelar".

| Camino | Resultado |
|---|---|
| Clic manual en "Iniciar sesión" del header | Botón renderiza ✅ |
| `/clasificados?login=1` en contexto limpio | Modal vacío, sin botón ❌ |

Consola: `[GSI_LOGGER]: Failed to render button before calling initialize()`

**Causa** — en `src/app/components/AuthProvider.tsx`, el callback ref `googleBtnRef` (líneas 104-116) se ejecuta en la fase de commit, **antes** del `useEffect` que llama a `initialize()` (líneas 91-101). Cuando el modal ya está montado en el instante en que `gsiReady` pasa a `true`, `renderButton` corre primero y Google lo descarta. En el camino manual `initialize()` ya corrió, por eso funciona.

**Alcance** — `RequireAuth.tsx:12` redirige a `?login=1` a todo el que sin sesión toque publicar, "Mis clasificados" o comentar. Es el 100 % del embudo de vendedores nuevos.

**Arreglo** — llamar a `initialize()` de forma síncrona en el `onload` del script (antes de marcar `gsiReady`), o guardar el nodo en un `useRef` y renderizar el botón desde un `useEffect` que dependa de `gsiReady` y del estado del modal.

### P0-2 · La pasarela de pagos no está configurada

```
POST /api/classifieds/:id/upgrade  →  503
{"error": "Payment service not configured"}
```

El usuario ve, en rojo y en inglés: **"API Error (503): Payment service not configured"**.

La única vía de monetización del producto no funciona, y además filtra un mensaje técnico del backend a la cara del usuario. Hasta que se configure, conviene ocultar "Destacá tu aviso" en vez de ofrecer un pago que falla.

### P0-3 · El aviso publica el teléfono aunque el vendedor pida ocultarlo

Defecto de privacidad. `showContactInfo` se ignora al crear y solo se respeta al editar.

| Operación | Enviado | Devuelto por la API |
|---|---|---|
| `POST /api/classifieds` | `false` | **`true`** ❌ |
| `PATCH /api/classifieds/:id` | `false` | `false` ✅ |

El vendedor destilda "Mostrá tu contacto en la publicación", publica, y su teléfono queda visible en una página pública e indexable. Solo se corrige si entra a editar y vuelve a guardar. Es backend: se reprodujo con `fetch` directo, sin pasar por el formulario.

### P0-4 · El filtro de ciudad fragmenta el inventario

Match exacto y sensible a mayúsculas, sobre un campo de **texto libre** tanto al publicar como al filtrar.

| Consulta | Resultados (sobre 13 avisos) |
|---|---|
| `city=Montevideo` | 6 |
| `city=montevideo` | 1 |
| `city=Monte` | 0 |
| `city=Montevideo ` (espacio final) | 0 |

El comprador que escribe en minúscula —lo más común— ve 1 de los 7 avisos de Montevideo. Con vendedores reales tipeando "Mvd", "montevideo" o "Ciudad de la Costa", el filtro deja de funcionar. **Debe ser un select de los 19 departamentos**, no un input.

### P0-5 · No hay búsqueda por texto, tampoco en el backend

`?q=` y `?search=` se aceptan con `200` pero **se ignoran**: devuelven los 13 avisos sin filtrar. El buscador del header (`src/app/actions/search.ts`) consulta solo el catálogo de vehículos, así que quien escribe "Corolla" nunca encuentra un clasificado. No es cablear el frontend: falta implementarlo en la API.

### P0-6 · Marketplace vacío

`GET /api/classifieds` devuelve `total: 0` en `uy`, `ar`, `cl` y `br`. Cold-start de dos lados. Dados P0-1 y P0-3, conviene arreglar primero el embudo y recién después sembrar oferta.

---

## P1 — Fricción alta

**P1-1 · Sin orden ni filtro de precio, tampoco en el backend.** `sort`, `order`, `sortBy`, `minPrice` y `maxPrice` se ignoran (13 de 13 en todos los casos). El orden es fijo: más reciente primero. Es la interacción número uno en un clasificado de autos.

**P1-2 · Todo contacto se renderiza como `tel:`.** Verificado en vivo con un email: `href="tel:ventas@ejemplo.com"`, un link roto. El campo se ofrece como "teléfono, WhatsApp, email" (`ClassifiedForm.tsx:245`) pero `ContactReveal.tsx:27` asume teléfono siempre. Y falta botón de WhatsApp, que en Uruguay es el canal de venta de usados.

**P1-3 · Ventana de doble publicación.** Medido: el botón vuelve a decir "Publicá tu aviso" y queda habilitado a los **6,0 s**, mientras el redirect ocurre a los **7,8 s**. Son 1,8 s en los que un segundo clic crea un aviso duplicado. El `finally` de `ClassifiedForm.tsx:168-171` corre antes de que `router.push` navegue.

**P1-4 · En mobile el contacto queda al fondo de todo.** La columna lateral se apila **después de los comentarios**: para encontrar "Mostrá el contacto" hay que pasar la galería, la ficha y el hilo completo. Es la acción más importante de la página.

**P1-5 · En mobile no se ve ningún aviso sin scrollear.** A 390 px, título, contador, CTA y los dos filtros consumen la pantalla entera. El primer producto asoma recién abajo del pliegue. Los filtros deberían colapsar detrás de un botón.

**P1-6 · En desktop, precio y título también quedan bajo el pliegue.** La galería ocupa más de 550 px de alto y empuja toda la información. A 1470×775 no se ve ni el título ni el precio sin scrollear.

**P1-7 · Subida de fotos secuencial y frágil.** Un POST por imagen: 5 fotos de 14 KB tardaron 5,1 s (~900 ms cada una). Con fotos reales de celular sobre 4G es mucho peor. Si falla la tercera, el aviso queda publicado a medias y expulsa al usuario a `/editar` (`ClassifiedForm.tsx:135-147`). Además no se puede elegir la portada, reordenar, ni quitar una sola foto del set pendiente: hay que rehacer la selección entera.

**P1-8 · El listado sirve datos viejos.** `clasificados/page.tsx:14` declara `force-dynamic`, pero `classifieds-api.ts:103` pide `next: { revalidate: 30 }` y el caché de datos gana. Verificado: con 13 avisos en la API, `/clasificados` mostraba **"0 avisos" y "Todavía no hay clasificados acá"**. El que publica el primer aviso ve el marketplace vacío justo después de publicarlo.

**P1-9 · Sin renovación.** El aviso vence a los 30 días (`expiresAt` confirmado) y la única salida es un pago que hoy falla. No hay preaviso, no hay botón "Renovar", y `/clasificados/mis` **no muestra la fecha de vencimiento** en ningún lado.

**P1-10 · Cero moderación.** Sin denuncias, sin cola de revisión, sin panel admin de clasificados. Contenido de usuarios, público e indexado, sin control.

**P1-11 · Los errores del backend se muestran crudos y en inglés.** `handleApiError` (`classifieds-api.ts:16-30`) arma `API Error (${status}): ${detail}` y cada `catch` del módulo lo pinta tal cual en pantalla. Falta una capa de traducción a mensajes accionables.

---

## P2 — Pulido

- **Categoría inválida deja la UI incoherente.** `?category=noexiste` responde `200` con 0 resultados; el select vuelve a "Todas las categorías" mientras la página dice "0 avisos" habiendo 13. No se valida contra `CLASSIFIED_CATEGORIES` (`clasificados/page.tsx:73`).
- **El contador engaña.** Página 1: "Mostrando 12 de 13". Página 2: "Mostrando 1 de 13". Debería ser un rango ("1-12 de 13").
- **`/clasificados/mis` sin paginación** — `limit: 50` fijo (`mis/page.tsx:23`); a partir del aviso 51 desaparecen en silencio.
- **Sin acciones rápidas en las tarjetas de "Mis clasificados"** — para pausar o marcar vendido hay que entrar al aviso.
- **`TIER_PRICES` hardcodeado en el cliente** (`types/classified.ts:103`) y siempre en USD, sin importar el país.
- **GIF permitido en código, prohibido en el copy** — `ALLOWED_IMAGE_TYPES` incluye `image/gif` (`types/classified.ts:110`), el botón dice "JPG, PNG o WebP".
- **El error de validación de fotos aparece al pie del formulario**, lejos de la sección Fotos donde ocurrió.
- **Sin favoritos para avisos** — `/guardados` es solo del catálogo.
- **Galería sin lightbox, sin zoom y sin swipe en mobile**; usa `<img>` crudo, no `next/image`.
- **Sin contador de vistas** — es, además, el argumento natural para vender el upgrade.
- **`confirm()` nativo para eliminar** (`OwnerActions.tsx:47`), rompe el design system.
- **Fechas inconsistentes** — el aviso muestra "Publicado el 06 de agosto de 2026"; los comentarios, "hace 1 minuto". En clasificados importa la relativa.
- **El botón de Google está en inglés** ("Sign in as Santiago") sobre un sitio íntegramente en voseo: falta `locale: 'es'` en `initialize()` (`AuthProvider.tsx:94-100`).
- **El sitemap se traga los errores** y devuelve `[]` (`classifieds-api.ts:132-135`): un hipo de la API borra todos los clasificados sin alertar a nadie.
- **Código muerto duplicado** — `googleLogin`, `getMe`, `fetchComments`, `postComment` y `deleteComment` en `classifieds-api.ts` no se importan en ningún lado, y conviven dos tipos `Comment` divergentes.
- **La API ignora parámetros desconocidos en silencio** en vez de rechazarlos, lo que enmascara errores del frontend (así se descubrieron P0-5 y P1-1).

---

## Lo que funciona bien

Vale registrarlo, porque es la base sobre la que se corrige lo anterior.

- **Alta con fotos**: 5 imágenes subidas, previews en orden, progreso paso a paso legible.
- **Validación de fotos**: cantidad ("Máximo 5 imágenes"), tipo ("Tipo no permitido: no-permitido.svg") y tamaño ("Archivo muy grande: enorme.jpg (11.0 MB)"), las tres correctas.
- **Edición**: precarga bien y **preserva las 5 fotos, el estado y el tier** al guardar.
- **Estados**: pausar, reactivar y marcar vendido funcionan y se reflejan al instante.
- **SEO por estado**: pausada y vendida aplican `noindex, follow` correctamente; el sitemap incluyó 13 de 14 (excluyó la pausada) y se limpió solo tras borrar. Los avisos eliminados devuelven `404`.
- **Comentarios**: publicar, responder, borrar, contador, límite de 200 y bloqueo con motivo explícito cuando el aviso está pausado, vendido o vencido.
- **Paginación y filtro de categoría**: correctos.
- **Formato de precios**: `USD 12.500` / `UYU 18.000` en monoespaciada, según el design system.
- **Permisos**: sin sesión no se ven las acciones de dueño; el gate de rutas privadas funciona.
- **Sin errores de consola** en ninguna pantalla del módulo.

---

## Roadmap de producto

**La oportunidad que no se está usando:** TodoMotor ya tiene fichas técnicas completas. Ningún competidor puede pegar eso a sus clasificados. Hoy los dos módulos viven separados.

**0 · Destrabar (días).** P0-1 login, P0-2 pagos, P0-3 privacidad, P0-4 ciudad como select. Sin esto no hay producto que medir.

**1 · Campos estructurados de vehículo.** Año, kilometraje, marca, modelo, combustible y transmisión hoy van sueltos en un textarea de 2000 caracteres. Sin estructura no hay filtros serios, ni SEO de cola larga, ni comparación, ni puente con el catálogo. Es el habilitador de casi todo lo demás y requiere cambio de esquema en la API.

**2 · Puente con el catálogo.** Al publicar, elegir el modelo desde las fichas existentes y autocompletar specs. En el detalle, "Ver ficha técnica completa" hacia `/vehiculo/[slug]`. Sube la calidad de los avisos, baja la fricción de publicar y hace circular tráfico entre módulos. Es la ventaja competitiva real.

**3 · Búsqueda y filtros.** Texto libre, rango de precio, año, kilometraje y orden. Requiere trabajo de backend (hoy no existe nada de esto) y depende de 1.

**4 · Mensajería y notificaciones.** Contacto privado y aviso por email al vendedor ante consultas. Hoy, si oculta el teléfono, la única vía es un comentario público que puede no ver nunca.

**5 · Confianza y moderación.** Denuncias, cola de revisión, verificación de vendedor, distintivo de concesionaria. Condición para escalar sin quemar la marca.

**6 · Monetización.** Los tiers ya existen pero se venden a ciegas: sin contador de vistas el vendedor no tiene motivo para pagar. Instrumentar primero, vender después. El volumen está en planes para concesionarias.

**Siembra de oferta (P0-6)** va después del punto 0 y en paralelo al 1: no tiene sentido atraer vendedores a un embudo roto.
