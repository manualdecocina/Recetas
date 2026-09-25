# FASE 1H.6 — INTEGRIDAD DE INGREDIENTES EN LA CARGA DE RECETA

**Fecha:** 2026-09-25  
**Estado:** IMPLEMENTADO

## Problema detectado

La primera integración de recipe_ingredients podía sustituir toda la lista original cuando existía al menos una relación estructurada. Eso era incorrecto para una migración progresiva: una receta parcialmente normalizada podía perder visualmente ingredientes todavía no relacionados.

## Corrección

La carga de la receta ahora:
1. conserva la lista original de recipes.ingredients;
2. busca relaciones estructuradas por position;
3. aplica únicamente los datos estructurados disponibles sobre la posición correspondiente;
4. mantiene el name original/editorial;
5. conserva cantidades/unidades originales cuando la relación estructurada no aporta un valor;
6. añade preparación y nota estructuradas cuando existen;
7. deja intactos los ingredientes que todavía no tienen relación canónica.

## Principio

**La normalización es una capa de enriquecimiento, nunca una sustitución destructiva del contenido editorial.**

Esto permite seguir migrando ingredientes por lotes sin riesgo de que una receta parcialmente normalizada muestre menos ingredientes de los que realmente contiene.

Google recomienda que recipeIngredient represente los ingredientes necesarios para preparar la receta y que el marcado refleje el contenido real. citeturn0search1

**D-092:** la lista editorial original es la columna vertebral de la representación de ingredientes.

**D-093:** recipe_ingredients enriquece por posición; no reemplaza una receta parcialmente normalizada.

**D-094:** ninguna migración progresiva puede provocar pérdida visible de ingredientes.

## Próximo control

Comparar automáticamente el número y las posiciones de ingredientes originales frente a las relaciones estructuradas antes de continuar ampliando la normalización.