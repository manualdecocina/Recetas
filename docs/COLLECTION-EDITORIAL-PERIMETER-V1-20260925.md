# COLLECTION / EDITORIAL PERIMETER — FINAL V1 — 2026-09-25

## Pages that remain ContentPage

These are collection/editorial resources, not individual recipes:

1. /10-recetas-de-postres
2. /indice-de-recetas-manual-de-cocina
3. /recetas-de-carne-molida

They must not emit Recipe JSON-LD merely because they link to recipes. Their structured data should describe the actual page type, while linked recipe cards point to individual Recipe URLs.

## Pages that should become Recipe

The current queue contains 26 individual recipe candidates:

- /alitas-de-pollo-al-horno
- /arroz-con-leche-el-postre-casero
- /arroz-frito
- /arroz-mixto
- /empanadas-colombianas
- /ensalada-cesar
- /ensalada-de-espinacas-y-fresas
- /ensalada-de-pollo-y-aguacate
- /paella-valenciana
- /pandebono-casero
- /pasta-con-salsa-de-tomate-y-albondigas
- /pasta-primavera-con-salsa-de-tomate-asado-y-albondigas-de-pollo
- /pollo-a-la-naranja
- /pollo-alfredo-a-la-florentina
- /receta-clasica-de-galletas-toll-house
- /receta-de-aborrajado
- /receta-ensalada-caprese
- /receta-sopa-minestrone-saludable
- /salmon-a-la-parrilla-con-salsa-de-limon-y-hierbas
- /salmon-en-air-fryer-saludable
- /salsa-inglesa
- /sopa-de-tomate
- /sopa-de-verduras
- /sopa-mexicana
- /spaghetti-con-salsa-de-champinones-y-ajo
- /torta-de-chocolate

## Conversion rule

For each candidate:

1. verify the entity;
2. verify the final URL;
3. stage one Recipe row;
4. rebuild content, ingredients, steps, image and metadata;
5. validate route and structured data;
6. publish the Recipe;
7. retire the equivalent ContentPage.

Never publish both models for the same final URL.

## Collection schema rule

A collection page may list recipes but does not become a Recipe. Its structured data must represent the collection/editorial page. Individual recipes remain the source of Recipe structured data.

## Explicit exclusions

Do not automatically convert:

- /10-recetas-de-postres
- /indice-de-recetas-manual-de-cocina
- /recetas-de-carne-molida
- health-sensitive editorial pages
- product/affiliate pages

Product/affiliate pages remain outside the new editorial catalog; their final URL action still requires URL-level SEO review before deletion or redirect.

## Duplicate-clone rule

Recipe-card URLs and editorial recipe URLs are not reconstructed as two entities. Before any deletion or redirect, compare historical Search Console evidence and true intent. Equal titles alone are insufficient evidence for a redirect.

## Completion criterion

The public catalog will contain one canonical editorial representation per recipe entity, while collection pages remain collections. This closes the model-level boundary; individual URL migrations still require their own URL Master decisions.
