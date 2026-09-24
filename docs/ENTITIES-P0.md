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
