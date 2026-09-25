# FASE 1H — ESTUDIO DE INGREDIENTES Y DESCUBRIMIENTO — 20260925

## Estado

EN ESTUDIO — NO CERRADO.

## Evidencia

Las recetas ES publicadas contienen ingredientes estructurados como JSON con name, amount y unit. La extracción inicial muestra variantes de singular/plural, formas con preparación, cantidades mezcladas dentro del nombre, variantes semánticas y registros anómalos.

Ejemplos observados: huevo/huevos; ajo/ajo picado/ajo picados; sal/sal al gusto; aceite de oliva/aceite de oliva virgen extra; hielo (opcional); y valores vacíos.

Por ello NO se deben crear todavía páginas SEO automáticas para cada string de ingredients.

## Modelo propuesto

Separar ingrediente canónico, nombre mostrado, preparación, cantidad, unidad, opcionalidad/notas y sinónimos.

El texto original de la receta no debe perderse.

## Producto

Bloque de portada: “¿Qué tienes en casa?” con búsqueda/autocompletado de ingredientes.

Página propuesta: /[lang]/ingredientes/[ingrediente]

La página podrá mostrar recetas relacionadas, combinaciones, filtros y enlaces semánticos. Solo se indexará cuando exista contenido suficiente.

El buscador podrá interpretar consultas como “pollo rápido” como ingrediente + tiempo sin obligar al usuario a conocer la taxonomía interna.

## No hacer

- No crear miles de páginas por variantes textuales.
- No convertir ingredientes en categorías culinarias.
- No indexar combinaciones infinitas.
- No inventar sinónimos.
- No destruir el texto original.
- No mezclar cantidades con el nombre canónico.

## Decisiones propuestas

D-045 ingrediente como dimensión independiente de categoría.
D-046 nombre canónico separado del texto original.
D-047 cantidad, unidad, preparación y notas como dimensiones separadas.
D-048 páginas de ingrediente solo con contenido suficiente.
D-049 descubrimiento por ingredientes desde home y catálogo/buscador.
D-050 no generar automáticamente todas las combinaciones como URLs indexables.

## Siguiente paso

Medir la calidad real de los ingredientes y decidir entre tabla de ingredientes canónicos con relación receta/ingrediente, catálogo derivado sin cambiar el modelo, o una evolución gradual de ambas opciones.
