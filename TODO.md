# FullMotor - Status del Proyecto

## 🎯 Objetivo Actual
Sistema automatizado de scraping y publicación de vehículos

---

## ✅ COMPLETADO

### Base del Proyecto
- ✅ Configuración inicial Next.js
- ✅ Estructura de carpetas y rutas básicas
- ✅ Migración Prisma/SQLite → JSON estático (commit 8767867)
  - Datos exportados a `data/vehicles.json`
  - Prisma removido
  - Sistema de lectura JSON implementado
- ✅ Sistema de storage con Vercel Blob (commit c9c36af)
  - Upload de imágenes a Vercel Blob
  - Endpoint `/api/upload` con autenticación

### Sistema de Scraping - Fase 1: Upload Skill
- ✅ Skill `vercel-image-upload` creado y empaquetado
  - `~/clawd/skills/vercel-image-upload/SKILL.md` - Documentación
  - `~/clawd/skills/vercel-image-upload/scripts/upload-image.js` - Script funcional
  - Soporta URLs remotas y archivos locales
  - Autenticación via API key
  - Sin dependencias externas
- ✅ Seguridad configurada
  - API key: `6a780eb89ce6428ba0dcd586c40ad2843e140a73142a7aaca9b5289eead891a3`
  - Configurada en `~/clawd/fullmotor/.env`
  - `.env.example` actualizado

**Uso:**
```bash
export UPLOAD_API_KEY="6a780eb89ce6428ba0dcd586c40ad2843e140a73142a7aaca9b5289eead891a3"
node ~/clawd/skills/vercel-image-upload/scripts/upload-image.js <imagen-url-o-path>
```

---

## 📝 Cambios Sin Commit
- `src/app/api/upload/route.ts` - Autenticación API key agregada

**Acción:** Hacer commit de estos cambios

---

## ✅ COMPLETADO (continuación)

### Sistema de Scraping - Fase 2: Scrapers ✅
**Ubicación:** `~/clawd/scripts/vehicle-scraper/`

**Estado:** COMPLETADO - 2026-01-29 17:20 UTC

**Scripts implementados:**
1. ✅ `scrape-autoblog.js` - Playwright scraper de autoblog.uy
2. ✅ `scrape-instagram.js` - Scraper de @ondrive.uy  
3. ✅ `fetch-brand-images.js` - Búsqueda de imágenes oficiales
4. ✅ `add-vehicles.js` - Integración completa con fullmotor
   - Detecta duplicados (marca+modelo+año)
   - Valida según types
   - Sube imágenes a Vercel Blob
   - Git commit/push automático
5. ✅ `run-daily.sh` - Pipeline completo con logs y manejo de errores

**Dependencias:** Instaladas (playwright + dotenv)

**Uso:**
```bash
cd ~/clawd/scripts/vehicle-scraper
./run-daily.sh  # Ejecuta pipeline completo
```

**Archivos existentes:**
- ✅ `README.md` - Documentación del sistema
- ✅ `package.json` - Config (playwright + dotenv)
- ✅ `.env` - Variables de entorno
- ✅ `test-upload.sh` - Script de prueba

**Scripts FALTANTES (crítico):**
- ❌ `scrape-autoblog.js` - Scraper de autoblog.uy con Playwright
- ❌ `scrape-instagram.js` - Scraper de @ondrive.uy
- ❌ `fetch-brand-images.js` - Búsqueda de imágenes oficiales
- ❌ `add-vehicles.js` - Integración con fullmotor
- ❌ `run-daily.sh` - Pipeline completo

**Problema:** Claude Code sessions previas (keen-dune, swift-ember) fallaron sin producir output.

---

## 📋 PENDIENTE

### Prioridad 1: Testing y Validación
- ✅ Upload skill testeado (funcional)
- ⏳ Test scrapers individualmente
  - `npm run scrape:autoblog`
  - `npm run scrape:instagram`
  - `npm run add:vehicles`
- ⏳ Test pipeline completo (`./run-daily.sh`)
- ⏳ Verificar deploy automático en Vercel tras commit

### Prioridad 2: Automatización (Fase 4)
- ✅ Cron de resumen (7 AM Uruguay) - Job ID: 698c8385-9a1b-49b1-89c7-aeb18bd461f9
- ⏳ Cron job para ejecutar pipeline diario (9 AM Uruguay)
  - Ejecuta `~/clawd/scripts/vehicle-scraper/run-daily.sh`
  - Notifica resultados a Santiago
  - Manejo de errores incluido en script

---

## 📂 Estructura del Proyecto

```
fullmotor/
├── data/
│   └── vehicles.json          # Base de datos estática
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── upload/
│   │   │       └── route.ts   # Endpoint de upload (modificado, sin commit)
│   │   └── ...
│   └── types/
│       └── vehicle.ts         # Tipos TypeScript

~/clawd/
├── skills/
│   └── vercel-image-upload/   # Skill de upload (✅ completo)
└── scripts/
    └── vehicle-scraper/        # Sistema de scraping (⚠️ incompleto)
```

---

## ⏱️ Estimación de Trabajo Pendiente
- **Fase 2 (Scrapers):** 2-4 horas
- **Testing:** 30 minutos
- **Automatización (Fase 4):** 15 minutos

**Total estimado:** 3-5 horas de desarrollo

---

## 📝 Notas Técnicas
- Sitio completamente estático (SSG con Next.js)
- Vehículos se agregan via scraping automatizado → vehicles.json
- Deploy automático en Vercel tras push a master
- API key protege endpoint de upload
- Scrapers corren diariamente via cron
