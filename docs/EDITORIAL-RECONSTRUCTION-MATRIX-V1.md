# POINT 3 — MATRIZ EDITORIAL DE RECONSTRUCCIÓN V1

## Objetivo

Convertir el catálogo cerrado en una cola de producción editorial. Ninguna URL se publica por existir en el histórico: cada versión debe tener contenido original, localizado, una imagen válida, metadata, schema, canonical, hreflang e integración interna.

Google exige `name` e `image` para Recipe structured data y recomienda validar con Rich Results Test y URL Inspection antes de ampliar el despliegue. citeturn0search0

## Contrato de una Recipe

Cada idioma publicado debe contener, como mínimo:

1. título localizado;
2. introducción única;
3. contexto/historia culinaria cuando aporte valor;
4. ingredientes completos y localizados;
5. preparación paso a paso;
6. tiempos reales;
7. rendimiento;
8. dificultad cuando sea útil;
9. consejos técnicos;
10. variantes solo cuando sean pertinentes;
11. conservación/recalentado cuando aplique;
12. FAQ solo cuando responda preguntas reales;
13. imagen principal del plato;
14. enlaces internos relevantes;
15. title/description/OG localizados;
16. canonical propio;
17. hreflang hacia las versiones publicadas equivalentes;
18. Recipe JSON-LD derivado exclusivamente de datos reales;
19. BreadcrumbList coherente;
20. URL incluida en sitemap solo cuando esté publicada/indexable.

No se inventan rating, review, nutrition, video, autor, tiempos o datos que no existan en la versión reconstruida.

## Orden de producción

### LOTE A — máximo valor histórico

1. E001 Lechona — ES, DE, JA, IT, FR, EN
2. E101 Bondiola — ES
3. E002 Casuela — ES, DE, FR, IT
4. E003 Burrito — ES, JA
5. E004 Teriyaki — ES, IT
6. E006 Porra — ES, FR, IT
7. E102 Pie de maracuyá — ES
8. E103 Salsa de ajo — ES
9. E104 Stroganoff — ES
10. E105 Rollo de carne — ES

### LOTE B — histórico localizado adicional

11. E007 Pandebono — ES, JA
12. E008 Pan Matzá — ES, DE, JA
13. E009 Pie de limón — ES, JA
14. E011 Horchata — ES; DE/IT/FR/EN/JA solo después de verificar equivalencia
15. E012 Pollo Alfredo — ES, JA
16. E013 Pulpo a la Gallega — ES, DE
17. E014 Ajiaco — ES, IT
18. E015 Empanada Peruana — ES, IT

### LOTE C — REVIEW

19. E005 Jugo Anticancerígeno — no publicar traducciones hasta revisión editorial/salud.
20. E010 Batido Grimace — no publicar traducciones hasta revisión.
21. E106 Sopa saludable para enfermos — no publicar hasta resolver tipo de contenido y claims.

## Regla de localización

Una traducción no es una copia lingüística. Cada versión debe sonar natural en el mercado objetivo y conservar la misma intención culinaria. El contenido principal debe estar traducido/localizado; las páginas con contenido principal no traducido no se consideran versiones lingüísticas válidas.

## Arquitectura de URL

Las URLs históricas KEEP se conservan exactamente. No se introduce un prefijo `/receta/` solo para uniformar.

Ejemplos:

- ES: `/receta-de-lechona-colombiana/`
- DE: `/de/kolumbianisches-lechona-rezept/`
- JA: `/ja/コロンビアのレチョナレシピ/`
- IT: `/it/ricetta-colombiana-lechona/`
- FR: `/fr/recette-lechona-colombienne/`
- EN: `/en/colombian-lechona-recipe/`

Cada una representa una versión localizada de la misma entidad E001.

## Imagen

Recipe schema requiere una imagen del plato terminado que sea rastreable/indexable y represente el contenido marcado. Google recomienda, cuando sea posible, varias imágenes de alta resolución en 16:9, 4:3 y 1:1. citeturn0search0turn0search4

Por tanto:

- no reutilizar imágenes irrelevantes;
- no usar una imagen de producto/equipo;
- no declarar una imagen en JSON-LD que no esté realmente asociada a la receta;
- validar accesibilidad pública de la imagen;
- priorizar fotografía propia/reconstruida del plato.

## Schema

### Recipe
Obligatorio para cada página de receta publicada:
- @context
- @type Recipe
- name
- image

Cuando exista realmente:
- author
- datePublished
- description
- prepTime
- cookTime
- totalTime
- recipeYield
- recipeCategory
- recipeCuisine
- keywords
- recipeIngredient
- recipeInstructions
- nutrition
- video

Nunca:
- inventar aggregateRating;
- inventar reviews;
- inventar videos;
- copiar datos históricos que ya no representan la nueva receta.

### BreadcrumbList

Debe reflejar la ruta editorial final y no la antigua arquitectura de WordPress.

### ItemList

Se reserva para páginas reales de colección/listado. Google indica que un host carousel requiere una página resumen que liste las recetas y un ItemList con URLs únicas. citeturn0search0

## Gates antes de publicar cualquier idioma

[ ] entidad correcta
[ ] intención correcta
[ ] URL final aprobada
[ ] contenido completo
[ ] traducción/localización revisada
[ ] imagen principal válida
[ ] ingredients/steps reales
[ ] tiempos reales
[ ] Recipe schema válido
[ ] canonical self
[ ] hreflang solo para versiones publicadas
[ ] enlaces internos
[ ] sitemap
[ ] no duplicate/cannibalization
[ ] no contenido afiliado
[ ] no claims problemáticos
[ ] QA visual
[ ] QA de indexación

## Estado

PUNTO 3 — MATRIZ EDITORIAL V1: CERRADO COMO CONTRATO.

La siguiente ejecución ya no es planificación: es producción. El primer bloque de contenido que debe entrar en reconstrucción es E001 Lechona, seguido por E101/E002/E003/E004.
