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
