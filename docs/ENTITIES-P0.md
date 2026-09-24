# ENTIDADES — PRIMER LOTE PRIORITARIO

**Fecha:** 2026-09-24  
**Estado:** CONTROL / borrador operativo

Este documento no autoriza todavía cambios de producción. Es el primer lote de entidades que debe entrar en el URL Master definitivo.

## P0 — Entidades con evidencia histórica multilingüe fuerte

| entity_id | Entidad | Tipo | Idiomas históricos evidenciados | URLs prioritarias |
|---|---|---|---|---|
| E001 | Lechona colombiana | Recipe | ES/DE/JA/IT/FR/EN | `/receta-de-lechona-colombiana/`, `/de/kolumbianisches-lechona-rezept/`, `/ja/コロンビアのレチョナレシピ/`, `/it/ricetta-colombiana-lechona/`, `/fr/recette-lechona-colombienne/`, `/en/colombian-lechona-recipe/` |
| E002 | Casuela de frijoles colombianos | Recipe | DE/FR/IT (+ relación histórica EN documentada) | `/de/kolumbianische-bohnen-casuela/`, `/fr/casuela-aux-haricots-colombiens/`, `/it/casuela-colombiana-di-fagioli/` |
| E003 | Burrito mexicano | Recipe | JA | `/ja/メキシカンブリトーのレシピ/` |
| E004 | Pollo teriyaki con verduras al wok | Recipe | IT | `/it/teriyaki-ricetta-pollo/` |
| E005 | Jugo anticancerígeno | Editorial/Recipe — revisar | DE/EN (+ relación histórica FR/IT/JA documentada) | `/en/anti-cancer-juice/`, `/de/saft-gegen-krebs/` |
| E006 | Porra Antequerana | Recipe | FR/IT (+ DE/JA/EN documentados históricamente) | `/fr/recette-porra-antequerana/`, `/it/porra-antequerana-ricetta/` |
| E007 | Pandebono casero | Recipe | JA | `/ja/パンデボノ自家製/` |
| E008 | Pan Matzá casero | Recipe | DE/JA | `/de/matza-brot-rezept/`, `/ja/マッツォパンのレシピ/` |
| E009 | Pie de limón | Recipe | JA | `/ja/レモンパイのレシピ/` |
| E010 | Batido Grimace | Recipe/Editorial — revisar | DE/FR (+ relación histórica JA/IT/EN documentada) | `/de/milchshake-grimaze-mcdonalds/`, `/fr/milkshake-grimace-mcdonalds/` |
| E011 | Horchata casera | Recipe | JA (+ relación histórica DE/IT/FR/EN documentada) | `/ja/オルチャータのレシピ/` |
| E012 | Pollo Alfredo a la Florentina | Recipe | JA | `/ja/フィレンツェ風チキンアルフレッド/` |
| E013 | Pulpo a la Gallega | Recipe | DE | `/de/oktopus-rezept-nach-galizischer-art/` |
| E014 | Ajiaco colombiano | Recipe | IT | `/it/ajiaco-ricetta/` |
| E015 | Empanada peruana de pollo | Recipe | IT/ES | `/it/empanada-pollo-peruviana/`, `/empanada-peruana-de-pollo/` |

## P0/P1 — Entidades españolas con tráfico histórico y presencia actual

| entity_id | Entidad | Tipo | Evidencia |
|---|---|---|---|
| E101 | Bondiola de cerdo | Recipe | `/receta-bondiola-de-cerdo/` — 711 clics |
| E102 | Pie de maracuyá | Recipe | `/receta-de-pie-de-maracuya/` — 193 clics |
| E103 | Salsa de ajo | Recipe | `/receta-de-salsa-de-ajo/` — 189 clics |
| E104 | Stroganoff | Recipe | `/creep-stroganoff/` — 154 clics |
| E105 | Rollo de carne | Recipe | `/receta-de-rollo-de-carne/` — 74 clics |
| E106 | Sopa saludable para enfermos | Editorial — revisar | `/sopa-saludable-para-enfermos/` — 69 clics |

## Reglas de este lote

1. La clasificación `Recipe` es provisional hasta revisar el contenido nuevo que se va a producir.
2. `Jugo anticancerígeno`, `Batido Grimace` y `Sopa saludable para enfermos` requieren una revisión editorial específica antes de fijar schema y tipo final.
3. La existencia histórica de una URL no obliga a conservarla, pero todas las P0 deben recibir una decisión explícita antes de cualquier migración.
4. Los idiomas adicionales documentados históricamente son relaciones útiles para construir los grupos, pero no significan que esas versiones estén ya publicadas en el nuevo sitio.
5. No se crean todavía registros traducidos en Supabase.

## Siguiente lote

Extender esta tabla al resto de las URLs de Search Console y después cruzarla con las 368 URLs publicadas del inventario para descubrir entidades adicionales, duplicados y páginas que nunca llegaron a Search Console con tráfico relevante.

## Nueva regla editorial — limpieza radical del catálogo

El nuevo Manual de Cocina no conservará contenido por el simple hecho de existir en el WordPress histórico.

Se elimina del alcance editorial todo contenido que:

- no tenga relación real con cocina, recetas, alimentación o el propósito editorial definido;
- sea contenido ajeno introducido por estrategias antiguas;
- sea duplicado o clon de otra entidad;
- exista principalmente por una estrategia de monetización que ya no forma parte del proyecto;
- esté ligado a afiliación de productos que ya no se utiliza, incluyendo páginas de batidoras y contenido equivalente de Amazon;
- no tenga una entidad editorial útil que queramos reconstruir.

### Regla de limpieza

Si sirve → reconstruir.
Si está duplicado → consolidar en una sola entidad.
Si no pertenece al proyecto → eliminar del catálogo nuevo.
Si solo existía para Amazon/afiliación → fuera.

La existencia de tráfico histórico no convierte automáticamente una página en contenido que deba conservarse. Primero debe pasar el filtro de relevancia editorial.

### Importante: eliminar del catálogo no significa borrar una URL a ciegas

Antes de retirar una URL se comprobará:

1. tráfico e impresiones históricos;
2. intención de búsqueda;
3. existencia de una entidad relacionada;
4. posibilidad de consolidación;
5. backlinks/redirects conocidos cuando estén disponibles;
6. si existe una URL equivalente válida.

Después se decide entre MERGE, 301 o 404/410.

No se redirigirá una página irrelevante hacia una receta simplemente para evitar un 404. Google considera legítimos los redirects para migraciones y consolidaciones cuando son coherentes, pero los redirects que llevan a contenido significativamente distinto pueden ser problemáticos. citeturn0search4

### Amazon / afiliación

Las páginas creadas principalmente para monetización mediante Amazon o productos de terceros quedan fuera del nuevo modelo editorial, salvo que una página concreta tenga una función editorial independiente que se decida conservar.

No se reconstruirá una sección de batidoras, comparativas de productos ni contenido equivalente únicamente para rellenar el sitio.

La nueva arquitectura se centra en Manual de Cocina, no en un catálogo de afiliación.

### Google y calidad del sitio

Esta limpieza también protege la coherencia temática del proyecto. Google advierte contra grandes cantidades de contenido creado principalmente para manipular rankings y contra páginas sin valor añadido; además, la política de reputación del sitio contempla contenido de terceros publicado principalmente para aprovechar señales de posicionamiento existentes. citeturn0search1turn0search6

La regla del proyecto no es borrar por borrar: es reconstruir un catálogo editorial coherente y útil.