# FASE 1I.2 — IMPLEMENTACIÓN DE ESTADOS DE RECETA

**Fecha:** 2026-09-25  
**Estado:** IMPLEMENTADO

## Cambio

Se incorporó a `public.recipes` el campo `editorial_status` con los estados:

- `draft`
- `review`
- `ready`
- `published`
- `archived`

También se incorporaron `reviewed_at` y `reviewed_by` para dejar trazabilidad de la revisión cuando exista.

## Migración de datos existentes

- recetas actualmente publicadas → `published`
- recetas no publicadas → `archived`

Resultado actual: **134 published / 95 archived**.

No se modificaron títulos, ingredientes, imágenes ni contenido de las recetas existentes.

## Regla

El campo `published` sigue existiendo por compatibilidad. `editorial_status` pasa a ser el estado editorial explícito del flujo nuevo.

Para nuevas recetas, el flujo previsto es:

`draft → review → ready → published`

Y para retirar una receta:

`published → archived`

No se permite saltar silenciosamente los controles del flujo.

## SEO

El marcado `Recipe` continuará reflejando únicamente información real de la página. Google exige `image` y `name` para la elegibilidad del resultado enriquecido y recomienda validar el marcado antes de desplegarlo. citeturn0search0

## Decisiones

**D-074:** el estado editorial queda almacenado en base de datos.

**D-075:** las recetas existentes se migran conservadoramente sin modificar su contenido.

**D-076:** `reviewed_at` y `reviewed_by` permiten trazabilidad futura.

**D-077:** la publicación nueva utilizará el flujo editorial explícito y no dependerá únicamente del booleano `published`.
