# QA — BUILD / CI PREPARATION — 2026-09-25

## Estado del repositorio

`package.json` define explícitamente:
- `npm run typecheck`
- `npm run test:logic`
- `npm run build`

El proyecto requiere Node `>=20 <23`.

## CI

No se encontró workflow versionado bajo `.github/workflows` mediante la búsqueda del repositorio. Por tanto, **no existe evidencia de que typecheck/test/build estén ejecutándose automáticamente en GitHub Actions**.

No se crea un workflow en este bloque porque la verificación efectiva requiere primero disponer del entorno de ejecución y secretos/configuración correspondientes. No se debe declarar un build verde sin una ejecución real.

## Gate de producción

La preparación técnica queda documentada como:

- Código: preparado para ejecutar los tres comandos definidos en `package.json`.
- CI automático: pendiente.
- Build real: pendiente.
- Smoke HTTP sobre Hostinger: pendiente.
- Supabase: Performance 0; Security 1 warning de Auth.

Supabase recomienda CI/CD para probar y desplegar cambios, y documenta GitHub Actions como vía para ejecutar pruebas automatizadas y despliegues desde `main`. citeturn0search1turn0search2

## Decisión de control

No se publica contenido staged mientras no exista una ejecución real de build/tests y la verificación desplegada correspondiente.
