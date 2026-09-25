# GATE DE PRODUCCIÓN — Manual de Cocina — 2026-09-25

## Estado

**Infraestructura / SEO / datos:** READY para despliegue técnico, con verificación externa pendiente en Hostinger/CI.

**Contenido editorial multilingüe:** NO CERRADO. Las localizaciones existentes están estructuralmente completas, pero siguen staged y requieren revisión editorial/canonical antes de publicación.

## Inventario vigente

Lectura directa de Supabase:
- `recipes`: **229 filas; 134 publicadas; 95 staged**.
- De las 95 Recipes staged: **94 cumplen completitud operativa** (imagen, ingredientes, pasos, prep, cook, total y servings).
- **1 staged no apta para catálogo:** `la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`; permanece descartada mediante redirect 308 a `/es`.
- `content_pages`: **74 filas; 69 publicadas; 5 staged**.
- Las 5 ContentPages staged restantes son pares con Recipes equivalentes staged; no se retiran todavía porque su Recipe aún no está publicada.

## ContentPages staged restantes

- `bowl-de-carne-con-miel-picante-y-queso-cottage`
- `receta-de-pan-de-platano-clasico`
- `receta-facil-de-pasta-al-pesto-casera`
- `souffle-de-queso`
- `vasitos-de-mousse-de-aguacate-y-cacao`

Estos cinco quedan bloqueados únicamente por el cierre del ciclo de publicación/modelo de sus Recipes equivalentes.

## Localizaciones

Las **20 Recipes no-ES** existentes están estructuralmente completas:
- DE: 4
- EN: 1
- FR: 3
- IT: 6
- JA: 6

No presentan faltantes estructurales de título, imagen, contenido, ingredientes, pasos ni metadata principal.

El QA actual confirma que cada localización conserva imagen, número de ingredientes/pasos y tiempos/porciones coherentes con su propio registro. Hay algunos `total_time_minutes` que incluyen reposo/enfriamiento y por eso pueden ser superiores a prep+cook; no se corrigen por inferencia.

Esto **no autoriza todavía su publicación**: queda pendiente QA editorial de traducción, relación de grupo, canonical/hreflang y decisión de qué idiomas se abren.

## URL / SEO

- Las URLs históricas conservadas se representan mediante `public_path`.
- Recipe JSON-LD usa la URL pública.
- Canonical y hreflang usan las URLs públicas reales.
- Sitemap usa únicamente contenido publicado.
- Las rutas internas modernas `/{lang}/receta/{slug}` funcionan como alias cuando corresponde.
- Los redirects históricos usan códigos 301/302/307/308; no se utiliza 403 como mecanismo de redirección.

## Seguridad / rendimiento Supabase

- Advisors de seguridad: únicamente **Leaked Password Protection Disabled** (1 warning).
- Advisors de rendimiento: **0 avisos**.

La protección de contraseñas filtradas sigue pendiente antes de considerar cerrado el gate de seguridad al 100%.

## Pruebas realizadas

Pasaron las comprobaciones lógicas de código para:
- canonical
- hreflang
- x-default
- robots
- sitemap
- resolución por `public_path`
- protección de publicación de Recipes incompletas
- integridad estructural de las 20 localizaciones no-ES

La ejecución completa de `npm run typecheck`, `npm run test:logic` y `npm run build` sigue pendiente de CI/Hostinger porque este entorno no dispone de `node_modules` ni acceso de red para instalar dependencias. El commit vigente no reporta checks CI ejecutados.

## Smoke test obligatorio después del deploy

1. `/` → 308 a `/es`.
2. `/robots.txt`.
3. `/sitemap.xml` → solo URLs indexables finales.
4. `/receta-bondiola-de-cerdo/` → 200, canonical a sí misma.
5. `/es/receta/receta-bondiola-de-cerdo` → 308/301 a `/receta-bondiola-de-cerdo`.
6. `/de/kolumbianisches-lechona-rezept/` → 200 solo cuando DE esté publicada.
7. `/mejor-batidora-de-vaso-en-2025/` → 404.
8. HTML de receta → Recipe JSON-LD válido, canonical correcto y hreflang solo de idiomas publicados.
9. `/admin` → noindex y acceso autenticado.
10. Recipe despublicada → 404 y fuera de sitemap.

## Gate editorial pendiente

Todavía falta cerrar:
- publicación/modelo de los 5 pares ContentPage → Recipe;
- QA editorial de las 20 localizaciones;
- revisión final de salud/nutrición;
- decisión institucional/legal;
- cierre de P3/P4;
- validación final de imágenes/media;
- decisión de publicación por lotes.

## Gate externo

La sesión actual no tiene acceso operativo a Hostinger ni puede comprobar los dominios en vivo; por tanto **no se afirma que producción esté desplegada**.

Cuando Hostinger reciba `main`, debe ejecutar instalación, build y start con las variables de producción definidas y después ejecutar todos los smoke tests anteriores.
