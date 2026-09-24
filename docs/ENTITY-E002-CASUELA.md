# E002 — Casuela de frijoles colombianos — consolidación de control

Fecha: 2026-09-24
Estado: CONTROL / sin cambios de producción

## Evidencia histórica

URLs históricas demostradas:
- DE /de/kolumbianische-bohnen-casuela/ — 114 clics
- FR /fr/casuela-aux-haricots-colombiens/ — 320 clics
- IT /it/casuela-colombiana-di-fagioli/ — 62 clics

TranslatePress también documentó una relación histórica EN `colombian-bean-casuela`.

## Estado actual Supabase

Existe una Recipe ES:
- slug: `casuela-de-frijoles-colombianos`
- title: Frijoles Colombianos
- source_url: `https://manualdecocina.com/casuela-de-frijoles-colombianos/`
- recipe_group_id: `ea6708f7-74b0-43cd-a4b8-cc8b016552a9`

No se localizaron redirects actuales para las tres URLs históricas multilingües auditadas.

## Decisión de entidad

Una sola entidad editorial: **E002**.

La Recipe ES existente es la base actual de la entidad. Las versiones DE/FR/IT históricas son candidatas de localización nueva.

## URL definitiva

ES candidata:
`/casuela-de-frijoles-colombianos/`

DE/FR/IT:
conservar como candidatas sus URLs históricas si se reconstruyen.

No imponer `/lang/receta/slug` por razones de uniformidad.

## Supabase objetivo

- una Recipe por idioma realmente publicado;
- mismo `recipe_group_id`;
- source_url documentado para la procedencia histórica;
- no crear content_pages paralelas para la misma receta.

## Redirects

No existen redirects para las tres URLs multilingües auditadas. No crear todavía.

## Gate editorial

El contenido multilingüe será reconstruido desde cero. La relación histórica de URLs sí está recuperada y es válida como evidencia de agrupación.
