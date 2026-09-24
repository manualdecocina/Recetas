# E003 — Burrito mexicano — consolidación de control

Fecha: 2026-09-24
Estado: CONTROL / sin cambios de producción

## Evidencia histórica

- JA /ja/メキシカンブリトーのレシピ/ — 245 clics
- ES /receta-de-burrito-mexicano/ — 2 clics

## Estado actual Supabase

Existe Recipe ES:
- slug: `receta-de-burrito-mexicano`
- title: Receta de Burrito Mexicano
- source_url: `https://manualdecocina.com/receta-de-burrito-mexicano/`
- recipe_group_id: `17fbbc8a-0332-4ce9-ad32-6aa2eccf36c6`

## Decisión

Una sola entidad editorial: **E003**.

La URL JA histórica es una candidata de alta prioridad por sus 245 clics.

ES puede mantenerse en su URL histórica actual.

## Redirects

Existe:
`/receta-de-burrito-mexicano/ → /es/receta/receta-de-burrito-mexicano`

Estado: **REVISAR** junto con el resto de redirects P1, porque el URL Master actual prioriza conservar URLs históricas válidas cuando no hay razón editorial para cambiarlas.

No modificar todavía.

## Supabase objetivo

- Recipe ES existente;
- Recipe JA solo cuando el contenido localizado esté listo;
- mismo `recipe_group_id`;
- canonical self por idioma;
- hreflang solo entre versiones publicadas.

## Gate

No crear el registro JA ni retirar el redirect hasta cerrar el routing de URL histórica.
