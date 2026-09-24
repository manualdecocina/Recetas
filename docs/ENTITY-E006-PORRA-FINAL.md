# E006 — PORRA ANTEQUERANA — FINAL ENTITY CONTRACT

- entity_id: E006
- content_type: Recipe
- recipe_group_id: 54ccca4c-588a-445e-be20-3e3fd2b42b7a
- ES current Recipe: /porra-antequerana-receta/

## Historical assets
FR: /fr/recette-porra-antequerana/ — 130 clicks, 1,983 impressions, avg position 7.05.
IT: /it/porra-antequerana-ricetta/ — 59 clicks, 1,834 impressions, avg position 6.36.

## Decision
One entity: ES + FR + IT. Preserve both historical localized URLs and rebuild them as Recipes under the same recipe_group_id.

No parallel ContentPages and no forced /lang/receta/slug migration.

Each published language version must reference itself and the other published variants through fully qualified hreflang URLs. citeturn0search0turn0search3

Recipe JSON-LD must represent the visible recipe and use a crawlable final-dish image. citeturn0search2