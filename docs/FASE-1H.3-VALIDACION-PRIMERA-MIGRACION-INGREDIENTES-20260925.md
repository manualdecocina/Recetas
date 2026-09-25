# FASE 1H.3 — Validación de la primera migración de ingredientes

**Fecha:** 2026-09-25  
**Estado:** PRIMERA PRUEBA VALIDADA — ESCALADO PENDIENTE

## Resultado

El modelo canónico contiene actualmente:

- 5 ingredientes canónicos.
- 19 aliases.
- 137 relaciones receta → ingrediente.
- 79 recetas españolas publicadas relacionadas.
- 134 recetas españolas publicadas en total.

La distribución por ingrediente, contando recetas únicas, es:

| Ingrediente | Recetas |
|---|---:|
| Aceite de oliva | 44 |
| Ajo | 38 |
| Huevo | 24 |
| Pimienta negra | 17 |
| Comino | 14 |

## Observación importante

Las cifras de apariciones originales y recetas únicas no son equivalentes. Una receta puede contener más de una variante perteneciente al mismo grupo o más de una aparición relevante. Por eso la validación usa `count(distinct recipe_id)` para medir cobertura de recetas.

## Validación

La primera prueba demuestra que:

- las cinco entidades existen;
- los aliases se pueden resolver;
- las relaciones se generan desde los aliases aprobados;
- las relaciones apuntan a recetas existentes;
- el JSON original no se utiliza como destino de escritura;
- la estructura permite contar recetas por ingrediente canónico.

## Decisión

**D-058:** la primera prueba de normalización es suficientemente estable para continuar ampliando el vocabulario, pero todavía no se considera cerrada la normalización global.

## Próximo lote

El siguiente lote deberá priorizar ingredientes frecuentes y claramente identificables, evitando todavía:

- alternativas (`X o Y`);
- agrupadores (`para la salsa`);
- cantidades embebidas;
- variantes regionales ambiguas;
- ingredientes compuestos cuyo significado no esté claro.

El objetivo del siguiente lote es aumentar cobertura sin reducir precisión.

## Producto

No se construirá aún la página pública de ingredientes. Primero se necesita una masa crítica de entidades canónicas y una cobertura suficiente para que el descubrimiento por ingredientes sea realmente útil.

La investigación externa revisada también muestra que las experiencias de búsqueda de recetas suelen tratar los ingredientes como un filtro explícito y permiten combinar varios ingredientes para refinar resultados. citeturn0search0turn0search3
