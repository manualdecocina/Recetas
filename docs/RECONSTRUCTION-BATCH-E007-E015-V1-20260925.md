# RECONSTRUCTION BATCH — E007–E015 — 2026-09-25

## Closed editorial decisions

### E007 — Pandebono
- ES: /pandebono-casero/
- JA: /ja/パンデボノ自家製/
- Type: Recipe
- Model: one recipe group; Japanese is a fully localized recipe, not a translated shell.
- Required editorial blocks: cultural context, ingredients, dough hydration, shaping, baking, texture troubleshooting, serving, storage, FAQ.
- Publication gate: real dish image + complete ingredients/steps + localized metadata.

### E008 — Pan Matzá
- ES: /receta-de-pan-matza/
- DE: /de/matza-brot-rezept/
- JA: /ja/マッツォパンのレシピ/
- Type: Recipe
- Editorial blocks: culinary context, ingredients, dough, rolling, perforation, baking, texture, storage, FAQ.
- Cultural claims must remain factual and restrained.

### E009 — Pie de limón
- ES: /receta-pie-de-limon/
- JA: /ja/レモンパイのレシピ/
- Type: Recipe
- Editorial blocks: crust, lemon filling, acidity/sweetness balance, baking/chilling, topping, slicing, storage, FAQ.

### E011 — Horchata
- ES: /receta-de-horchata/
- JA: /ja/オルチャータのレシピ/
- Type: REVIEW before multilingual expansion.
- The term “horchata” covers different preparations. The historical language URLs must not be attached to the Spanish recipe group until the preparation represented by each URL is confirmed to match.
- First define the exact style; then ingredients, soaking/grinding/blending, straining, sweetening, chilling, serving, storage and FAQ.
- Recipe Schema only after the preparation identity is fixed.

### E012 — Pollo Alfredo a la Florentina
- ES: /pollo-alfredo-a-la-florentina/
- JA: /ja/フィレンツェ風チキンアルフレッド/
- Type: Recipe
- Current ES public model is being rebuilt from ContentPage to Recipe.
- No final publication while the staged Recipe has empty recipe data.
- Editorial blocks: chicken, sauce, spinach/Florentine-style component as applicable to the new recipe, pasta/serving choice if included, timing, storage and FAQ.
- Japanese page must be complete and localized.

### E013 — Pulpo a la Gallega
- ES: /receta-de-pulpo-a-la-gallega/
- DE: /de/oktopus-rezept-nach-galizischer-art/
- Type: Recipe
- Editorial blocks: octopus tenderness, potatoes, paprika and oil, plating, common mistakes, storage, FAQ.
- German page must be complete localized content.

### E014 — Ajiaco colombiano
- ES: /receta-de-ajiaco/
- IT: /it/ajiaco-ricetta/
- Type: Recipe
- Current ES public model is being rebuilt from ContentPage to Recipe.
- No final publication while staged Recipe has empty recipe data.
- Editorial blocks: Colombian context, potato varieties, chicken, herbs, cooking sequence, texture, serving, storage, FAQ.
- Italian page must be complete localized content.

### E015 — Empanada peruana de pollo
- ES: /empanada-peruana-de-pollo/
- IT: /it/empanada-pollo-peruviana/
- Type: Recipe
- One Recipe entity only; the historical ES ContentPage/NEW_SEED duplication is consolidated.
- Editorial blocks: dough, chicken filling, seasoning, shaping, sealing, baking/frying decision, storage and FAQ.
- Italian page must be complete localized content.

## Common database rules

1. Each entity gets one existing recipe_group_id.
2. No new group is created merely because a historical localized URL is absent from Supabase.
3. Historical public_path is preserved when it is the final URL.
4. Historical body HTML is not copied into final editorial content.
5. New language rows stay unpublished until all visible recipe fields are complete.
6. A staged Recipe with empty ingredients/steps/content is not publishable.
7. A final Recipe must not coexist with its old ContentPage representation.
8. Redirects are created only if the final public URL actually changes.

## Common SEO rules

Each published localized page receives:
- self canonical;
- reciprocal hreflang for all published equivalents only;
- fully qualified HTTPS alternates;
- one sitemap URL;
- Recipe JSON-LD based only on visible recipe facts;
- BreadcrumbList matching the site's user path.

Google's current Recipe documentation requires the marked-up dish image and supports Recipe fields such as ingredients, instructions, cuisine and category. Google also recommends validating with Rich Results Test and then checking deployed pages with URL Inspection. citeturn0search0

For hreflang, every published language version must list itself and all other published equivalents using fully qualified URLs. citeturn0search1turn0search3

BreadcrumbList should represent a normal user navigation path and contain at least two ListItems. citeturn0search2

## Publication status

E007, E008, E009, E013, E014 and E015: editorial master defined, NOT PUBLISHED.

E011: REVIEW gate remains open.

E012: conversion to Recipe is staged; NOT PUBLISHED.

## Next implementation gate

Populate the staged/base Recipe records only after the localized editorial copy and image assets are complete. Then validate route → metadata → schema → hreflang → sitemap → visual output before publication.
