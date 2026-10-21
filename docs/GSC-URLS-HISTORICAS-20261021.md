# Recuperación de URLs históricas de Search Console — 2026-10-21

Fuente: exports de Search Console del 2026-09-23 y 2026-10-21 (1.050 URLs con impresiones,
10.464 clics históricos), cruzados contra `recipes` y `content_redirects` en producción.

## Hallazgos antes del cambio

| Situación | URLs (≥3 clics) | Clics históricos |
|---|---:|---:|
| Receta servida en su URL histórica, canonical correcta | 79 | 2.870 |
| Receta servida en su URL histórica, **canonical sin barra final** (`source_url` nulo) | 70 | 5.156 |
| URL histórica traducida en **404** aunque la receta existe en ese idioma con otro slug | ~64 alias + ~135 | ~1.660 |
| 404 / redirect por decisión editorial (E005, E106, contenido descartado) | resto | — |

## Cambios aplicados (migraciones)

- `20261021060000_restore_gsc_historical_urls.sql`: 198 traducciones publicadas vuelven a su
  `public_path` histórico (regla URL Master KEEP / REBUILD); su ruta provisional queda como
  redirect 308 hacia la URL histórica con barra final. 1 alias español adicional → 308.
- `20261021060100_backfill_gsc_source_urls.sql`: `source_url` exacta (con barra) para recetas
  publicadas cuya URL histórica está en Search Console, para que `recipeCanonicalUrl()`
  emita la canonical con la barra original.

Mapeo completo: `GSC-URLS-HISTORICAS-20261021-MAPPING.json`. Estado previo de las filas
tocadas: `GSC-URLS-HISTORICAS-20261021-BEFORE.json` (permite revertir).

## No tocado a propósito

- E005 jugo anticancerígeno (todas sus variantes): sigue en REVIEW, sin publicar.
- E106 sopa para enfermos: mantiene su redirect actual.
- Traducciones de contenido descartado en español (cerveza artesanal, aborrajado, etc.).
