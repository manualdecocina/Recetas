# REGLA — Ingredientes en nuevas recetas

**Fecha:** 2026-09-25  
**Estado:** REGLA OPERATIVA

## Regla

Toda receta nueva debe conservar siempre el ingrediente tal como fue redactado editorialmente, pero debe intentar resolver cada ingrediente contra el catálogo canónico antes de publicarse.

## Flujo obligatorio

1. El ingrediente entra con nombre, cantidad, unidad y preparación/notas cuando estén disponibles.
2. Se busca coincidencia en `ingredient_aliases`.
3. Si existe una coincidencia inequívoca, se crea la relación en `recipe_ingredients`.
4. Si no existe, se conserva el ingrediente original y se marca como pendiente de normalización.
5. No se inventan aliases ni equivalencias.
6. Las alternativas (`A o B`) no se fusionan automáticamente.
7. Un ingrediente nuevo no se convierte en página indexable automáticamente.
8. Antes de publicar, la receta debe poder cocinarse aunque algún ingrediente todavía esté pendiente de normalización.

## Responsabilidad editorial

La publicación diaria debe seguir esta regla. La incorporación de una receta nueva no debe crear una segunda lógica paralela de ingredientes.

## Estados

El catálogo canónico usa:

- `canonical`: ingrediente validado y utilizable para descubrimiento.
- `pending`: detectado pero todavía no validado.
- `review`: requiere decisión manual.
- `deprecated`: ya no debe utilizarse para nuevas relaciones.

## Principio

**La receta nunca depende de que el ingrediente esté normalizado para conservar su contenido. El descubrimiento sí depende de la normalización.**

Por tanto:

`contenido editorial` ≠ `capa de descubrimiento`

La primera debe ser preservada siempre. La segunda puede evolucionar progresivamente.

## Decisión

**D-059:** ninguna receta nueva debe introducir una lógica de ingredientes paralela a la existente.

**D-060:** cada ingrediente nuevo se intenta resolver contra el catálogo antes de publicar; si no existe, queda pendiente sin bloquear el contenido editorial.

**D-061:** ningún alias o equivalencia se inventa automáticamente cuando exista ambigüedad.

**D-062:** el catálogo de ingredientes y sus estados será una capa administrable independientemente de las recetas.
