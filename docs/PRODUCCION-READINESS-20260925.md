# PRODUCCIÓN — CHECKPOINT 2026-09-25

## Estado
**Código:** preparado para fase de despliegue, pero producción externa todavía bloqueada por infraestructura y QA de build real.

## Cerrado
- arquitectura de producto y navegación V1
- taxonomía y filtros V1
- páginas de recetas, catálogo e ingredientes
- Home editorial
- header/footer responsive
- tipografía editorial Cormorant Garamond + Inter
- sistema visual base
- JSON-LD de recetas/breadcrumbs
- RLS de taxonomía aplicado
- páginas institucionales V1
- espacios publicitarios todavía no activos

## Bloqueos antes de publicar
1. Ejecutar `npm install`, `npm run typecheck`, `npm run test:logic` y `npm run build` en un entorno con red/dependencias. En esta sesión el entorno de ejecución no pudo acceder a GitHub, por lo que no se declara un build verificado.
2. Generar y comprometer `package-lock.json`; el workflow de calidad usa actualmente `npm install` porque el repositorio no contiene lockfile.
3. Resolver actualización de Next.js: el proyecto está en Next 14.2.x, y la documentación oficial actual marca 14 como no soportado; antes de producción debe planificarse una actualización a una rama soportada y ejecutar su migración/QA.
4. Configurar variables de producción reales: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y hosts de imágenes.
5. Integrar los assets maestros reales de marca/SVG/favicon si aún no están publicados en `public/`.
6. Confirmar infraestructura Hostinger capaz de ejecutar Node.js/Next.js. Hostinger documenta Node.js para VPS; los planes Web/Cloud no ofrecen el acceso de sistema necesario para ejecutar Node.js de esta forma.
7. Configurar dominio, HTTPS, proceso de Node, reinicio automático y logs en Hostinger.
8. Hacer smoke test en dominio real: Home, catálogo, filtros, ingrediente, receta, favoritos, compartir, imprimir, sitemap y robots.
9. Ejecutar Lighthouse sobre el build de producción y corregir regresiones de Core Web Vitals.
10. Activar AdSense solamente después de cerrar CMP/consentimiento y verificar la implementación real de terceros.

## Criterio de lanzamiento
No declarar producción hasta que el build real sea PASS, el dominio responda por HTTPS, las rutas críticas funcionen y no haya datos/servicios ficticios activos.