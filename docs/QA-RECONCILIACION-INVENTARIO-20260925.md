# QA — RECONCILIACIÓN DEL INVENTARIO DE RECETAS — 2026-09-25

## Conteo directo Supabase

- Recipes totales: **229**
- Recipes publicadas: **134**
- Recipes staged/no publicadas: **95**
- recipe_group_id distintos: **209**
- ES: **209**
- Otros idiomas: **20** (DE 4, EN 1, FR 3, IT 6, JA 6)
- ContentPages: **87** (69 publicadas, 18 staged)

## Corrección de control

El conteo anterior de 227/132 quedó obsoleto por el estado actual de la base. El dato operativo vigente es **229 Recipes / 134 publicadas / 95 staged**.

La cifra de **71** corresponde exclusivamente a las Recipes staged que actualmente cumplen imagen + contenido + ingredientes + pasos + prep + cook + servings. No representa el total de recetas del proyecto.

## Inventario histórico

La referencia histórica de 213 aparece en documentación/migraciones antiguas, pero no debe utilizarse como conteo actual de recipes. La base actual contiene 229 filas.

## Estado

No se eliminaron recetas para llegar a 71. Las 229 filas permanecen en Supabase. La diferencia entre el inventario histórico y el actual queda pendiente de reconciliación por entidad/URL, no de eliminación automática.
