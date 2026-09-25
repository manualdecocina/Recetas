# CONTENTPAGE TO RECIPE QUEUE — 2026-09-25

## Objective

Individual recipe pages must end in the `recipes` model. The same public URL must not exist simultaneously as Recipe and ContentPage. The public URL is preserved while editorial content is rebuilt from scratch.

## Individual recipe candidates

- `/alitas-de-pollo-al-horno`
- `/arroz-con-leche-el-postre-casero`
- `/arroz-frito`
- `/arroz-mixto`
- `/empanadas-colombianas`
- `/ensalada-cesar`
- `/ensalada-de-espinacas-y-fresas`
- `/ensalada-de-pollo-y-aguacate`
- `/paella-valenciana`
- `/pandebono-casero`
- `/pasta-con-salsa-de-tomate-y-albondigas`
- `/pasta-primavera-con-salsa-de-tomate-asado-y-albondigas-de-pollo`
- `/pollo-a-la-naranja`
- `/pollo-alfredo-a-la-florentina`
- `/receta-clasica-de-galletas-toll-house`
- `/receta-de-aborrajado`
- `/receta-ensalada-caprese`
- `/receta-sopa-minestrone-saludable`
- `/salmon-a-la-parrilla-con-salsa-de-limon-y-hierbas`
- `/salmon-en-air-fryer-saludable`
- `/salsa-inglesa`
- `/sopa-de-tomate`
- `/sopa-de-verduras`
- `/sopa-mexicana`
- `/spaghetti-con-salsa-de-champinones-y-ajo`
- `/torta-de-chocolate`

## Keep as collection/editorial pages

- `/10-recetas-de-postres`
- `/indice-de-recetas-manual-de-cocina`
- `/recetas-de-carne-molida`

## Rule

Close entity and URL first. Then create a staged Recipe row, rebuild content, ingredients, steps, image and metadata, validate it, publish it, and only then retire the equivalent ContentPage.

Historical bodies are reference material only; the new editorial content is rebuilt from scratch.

## Control de consolidación — 2026-09-25

### Lote E007–E015

| Entidad | URL ES | Modelo final | Localización | Estado operativo |
|---|---|---|---|---|
| E007 Pandebono | /pandebono-casero/ | Recipe | JA | MASTER LISTO · NO PUBLICAR |
| E008 Pan Matzá | /receta-de-pan-matza/ | Recipe | DE / JA | MASTER LISTO · NO PUBLICAR |
| E009 Pie de limón | /receta-pie-de-limon/ | Recipe | JA | MASTER LISTO · NO PUBLICAR |
| E012 Pollo Alfredo | /pollo-alfredo-a-la-florentina/ | Recipe | JA | CONVERSIÓN STAGED · NO PUBLICAR |
| E013 Pulpo a la Gallega | /receta-de-pulpo-a-la-gallega/ | Recipe | DE | MASTER LISTO · NO PUBLICAR |
| E014 Ajiaco | /receta-de-ajiaco/ | Recipe | IT | MASTER LISTO · NO PUBLICAR |
| E015 Empanada peruana | /empanada-peruana-de-pollo/ | Recipe | IT | ENTIDAD CONSOLIDADA · CONTENIDO PENDIENTE |

### Gate

No se crea una segunda entidad por ausencia de una traducción histórica en la base. No se publica mientras falte contenido visible completo, ingredientes, pasos o imagen. El schema se añadirá/validará únicamente contra el contenido visible de la página final.

### Siguiente acción

Completar primero E007 Pandebono y E008 Pan Matzá como entidades Recipe únicas; después pasar a E009 y E012. E011 Horchata permanece fuera del lote hasta cerrar su identidad de preparación.

## Cierre operativo — Bloques 38–39 — 2026-09-25

Bloque 38: 20 entidades procesadas; las Recipes equivalentes existen y las 19 que permanecen staged tienen imagen, ingredientes, pasos y metadata estructurada completa. No se publicaron ni se retiraron ContentPages porque los gates superiores siguen abiertos.

Bloque 39: se procesaron las 6 entidades restantes. Las 6 Recipes están staged con imagen, ingredientes, pasos y metadata completa; las 6 ContentPages equivalentes siguen publicadas. No se publicó ni retiró contenido.

QA bloque 38: `docs/QA-BLOQUE-CONTENTPAGE-RECIPE-20260925-38.md`.
QA bloque 39: `docs/QA-BLOQUE-CONTENTPAGE-RECIPE-20260925-39.md`.

Estado de esta fase: STAGED / CONSOLIDACIÓN PENDIENTE.


## Segunda ola completa — Bloque 50 — 2026-09-25

La auditoría integral detectó 48 ContentPages publicadas con Recipe ES homónima staged/unpublished. Las 48 Recipes tienen título, imagen, contenido, ingredientes, pasos y metadata básica completa. Quedan clasificadas como MODEL Recipe / STAGED / READY FOR PUBLICATION GATE. No se retira ninguna ContentPage hasta publicar y verificar su Recipe equivalente.

QA: docs/QA-BLOQUE-CONTENTPAGE-RECIPE-20260925-50.md.
