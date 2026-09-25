# FASE 1I.3 — VALIDADOR INTERNO DE PUBLICACIÓN

**Fecha:** 2026-09-25  
**Estado:** ESPECIFICACIÓN

El proyecto no tendrá panel administrativo. El control se ejecutará como lógica interna del proceso de publicación.

## Bloqueadores de publicación

Una receta no puede pasar a `published` si falla cualquiera de estos controles:

1. `title` válido.
2. `slug` válido y estable.
3. `language` válido.
4. `ingredients` presente y utilizable.
5. `steps` presente y utilizable.
6. imagen principal válida.
7. categoría canónica o incidencia explícita pendiente de decisión.
8. URL pública válida.
9. JSON-LD Recipe coherente con el contenido visible.
10. no existen datos inventados para completar campos.

Google considera `name` e `image` propiedades obligatorias para elegibilidad del marcado Recipe y recomienda validar el marcado antes del despliegue. citeturn0search0turn0search4

## Controles de calidad no bloqueantes

Se revisan y se corrigen cuando haya información fiable:

- prep_time_minutes;
- cook_time_minutes;
- total_time_minutes;
- servings;
- difficulty;
- cuisine;
- course;
- keywords;
- nutrition;
- galería;
- vídeo;
- aliases y relaciones de ingredientes.

La ausencia de un dato que realmente no conocemos no se convierte en un error artificial.

## Ingredientes

Cada ingrediente nuevo sigue la regla canónica existente:

`texto original → búsqueda de alias → relación canónica si es inequívoca → pendiente si no lo es`.

No se fusionan automáticamente ingredientes ambiguos.

## Datos estructurados

El generador debe incluir únicamente propiedades que existan y sean fiables. Para instrucciones, se prioriza `HowToStep`; para tiempos se usa `prepTime` + `cookTime` cuando ambos existen, o `totalTime` cuando corresponde. `recipeYield` se incluye cuando se conoce el rendimiento. citeturn0search0

La nutrición no se añade al marcado si no es fiable; Google exige `recipeYield` cuando se proporciona información nutricional por porción. citeturn0search0

## Resultado del validador

El proceso devolverá conceptualmente:

- `PASS` → puede publicarse;
- `BLOCKED` → falta un requisito estructural;
- `REVIEW` → contenido publicable pero requiere revisión de un dato ambiguo.

## Principio

**El validador protege la calidad; no sustituye el criterio editorial.**

No se debe transformar una receta en una ficha artificialmente completa solo para satisfacer una validación técnica.

## Decisiones

**D-078:** no se construirá panel administrativo para este flujo.

**D-079:** la validación será interna al proceso de publicación.

**D-080:** se distinguen bloqueadores estructurales de controles de calidad.

**D-081:** ningún dato faltante se inventa para superar el validador.
