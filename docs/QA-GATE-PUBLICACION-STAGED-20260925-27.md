# QA — Gate de publicación STAGED — 2026-09-25

## Estado Supabase

- Recipes STAGED/UNPUBLISHED: 95
- Recipes PUBLISHED: 134
- Equivalencias Recipe + ContentPage publicado: 48

## Gate final

La publicación masiva **no queda autorizada en este bloque** porque el propio CONTROL vigente exige cerrar antes:

1. URL Master URL-by-URL.
2. routing histórico.
3. redirects definitivos, si corresponden.
4. modelo Recipe/ContentPage sin representación paralela.
5. contrato canonical/hreflang.
6. schema.
7. sitemap/indexación.
8. QA/deploy.

La consulta de las Recipes staged confirma que el campo `seo` está actualmente como objeto vacío en las primeras filas inspeccionadas; por tanto no existe evidencia suficiente para declarar cerrado el contrato canonical/hreflang/schema solo desde Supabase.

No se publicaron Recipes ni se retiraron ContentPages para evitar romper la ruta publicada antes de tener destino/canonical/hreflang definitivos.

## Incidentes reales

- No se detectó contenido, imagen, ingredientes, pasos o metadata estructurada faltante en el bloque final revisado.
- El bloqueo actual es de **gobernanza/arquitectura de publicación**, no de completitud editorial.

Estado: STAGED / UNPUBLISHED.
