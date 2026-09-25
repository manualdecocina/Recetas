# FASE 1G — NORMALIZACIÓN DE CATEGORÍAS — CIERRE 20260925

## Resultado

Se normalizó el campo `public.recipes.category` de las 134 recetas españolas publicadas.

- Antes: 118/134 sin categoría.
- Ahora: 1/134 sin categoría.
- Normalizadas a las 10 categorías oficiales: 117 recetas que estaban sin categoría + 12 registros que tenían categorías heterogéneas.
- El único caso pendiente es **Cómo preparar Queso**, porque no encaja limpiamente en las diez categorías culinarias definidas y no se ha forzado una asignación.

## Categorías oficiales

1. Platos principales
2. Entrantes y aperitivos
3. Sopas y cremas
4. Ensaladas
5. Guarniciones
6. Salsas y aderezos
7. Panes y masas
8. Postres
9. Desayunos y brunch
10. Bebidas

## Distribución final ES publicado

| Categoría | Recetas |
|---|---:|
| Platos principales | 55 |
| Postres | 20 |
| Bebidas | 11 |
| Ensaladas | 11 |
| Sopas y cremas | 10 |
| Desayunos y brunch | 7 |
| Panes y masas | 6 |
| Entrantes y aperitivos | 6 |
| Guarniciones | 4 |
| Salsas y aderezos | 3 |
| Pendiente | 1 |
| **Total** | **134** |

## Criterio

La asignación se hizo usando la evidencia disponible en título, keywords, cuisine y naturaleza del plato. Se evitó usar ingredientes o cocinas como categorías principales cuando el tipo de plato permitía una clasificación culinaria más estable.

La categoría es una dimensión de navegación; cocina, ingrediente, dificultad, tiempo, curso y otras dimensiones deben seguir funcionando como facetas independientes.

## Observación

El dato de `category` queda ahora listo para alimentar las páginas de Categorías y el filtro principal del catálogo.

El caso pendiente no se inventa. Se mantiene abierto para decisión editorial posterior.
