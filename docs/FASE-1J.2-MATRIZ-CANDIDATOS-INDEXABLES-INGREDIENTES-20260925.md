# FASE 1J.2 — MATRIZ DE CANDIDATOS INDEXABLES DE INGREDIENTES — 20260925

## Estado
DECISIÓN OPERATIVA V1 — APLICAR

## Criterio
Un ingrediente canónico puede pasar a `indexable=true` cuando:
1. está en estado `canonical`;
2. tiene slug estable;
3. tiene al menos 5 recetas ES publicadas vinculadas;
4. la página pública ofrece una colección real de recetas, no contenido de relleno;
5. no existe una alerta conocida de normalización ambigua.

El umbral de 5 recetas es operativo para V1 y podrá revisarse con datos reales de uso.

## Resultado de la auditoría actual

Candidatos V1 (>=5 recetas ES publicadas):

- Aceite de oliva — 44
- Sal — 42
- Ajo — 38
- Huevo — 24
- Azúcar — 19
- Pimienta negra — 17
- Cebolla — 15
- Comino — 14
- Mantequilla — 14
- Extracto de vainilla — 12
- Harina de trigo — 12
- Aceite vegetal — 11
- Agua — 11
- Leche — 10
- Orégano seco — 10
- Pimentón dulce — 8
- Vino blanco — 8
- Miel — 6
- Queso parmesano — 6
- Cilantro — 5
- Crema de leche — 5
- Jengibre — 5
- Laurel — 5
- Salsa de soja — 5

No candidatos V1:
- ingredientes con 4 o menos recetas;
- expresiones ambiguas o de uso circunstancial;
- ingredientes pendientes/review/deprecated.

## Regla de publicación

`indexable=true` no significa que el ingrediente sea un artículo editorial. Significa que existe una landing pública útil basada en recetas reales.

La página debe:
- mostrar el ingrediente;
- mostrar recetas publicadas que lo usan;
- mantener navegación hacia la receta;
- no inventar descripción culinaria;
- no aparecer en sitemap si no es indexable.

## Decisiones

- D-108 — Umbral operativo V1 de 5 recetas ES publicadas.
- D-109 — La colección de recetas constituye utilidad suficiente para una landing V1; no se exige texto editorial inventado.
- D-110 — Los ingredientes con 4 o menos recetas permanecen canónicos pero no indexables.
- D-111 — No se cambia el estado canónico por falta de indexación.
- D-112 — La indexación se controla desde `ingredients.indexable`, no desde el número de recetas calculado en tiempo de render.

## Siguiente paso

Aplicar `indexable=true` exclusivamente a los 24 candidatos V1 y actualizar sitemap/enlazado público para que solo esos ingredientes sean descubribles/indexables.
