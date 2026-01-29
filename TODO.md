# FullMotor - Status del Proyecto

## 🎯 Objetivo Actual
Migrar de Prisma/SQLite a sitio estático con JSON

## ✅ Completado
- Configuración inicial del proyecto Next.js
- Estructura de carpetas y rutas básicas

## 🔄 En Progreso
- [Claude Code - faint-canyon] Refactor Prisma → JSON estático (lanzado: 2026-01-28 19:42)
  - Exportar datos de dev.db a data/vehicles.json
  - Eliminar Prisma (carpeta, dependencias, .env)
  - Eliminar rutas API (src/app/api/)
  - Crear sistema de lectura JSON estático
  - Actualizar README.md con instrucciones
  - Build + commit

## 📋 Pendiente
- Verificar que el build funcione después del refactor
- Deploy a producción
- (Agregar nuevas tareas aquí)

## 📝 Notas
- Todo será estático, sin endpoints de API
- Los vehículos se agregan editando data/vehicles.json manualmente
- README.md debe documentar cómo agregar nuevos vehículos
