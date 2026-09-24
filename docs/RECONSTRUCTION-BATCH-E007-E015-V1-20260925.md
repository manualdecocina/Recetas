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


## Control editorial E007 — Pandebono — 2026-09-25

**Contrato cerrado para reconstrucción, sin publicación:**
- ES final: `/pandebono-casero/`
- JA final: `/ja/パンデボノ自家製/`
- Modelo: una sola entidad Recipe / un solo `recipe_group_id`.
- No se reutiliza el cuerpo histórico.
- La versión JA debe ser una receta completa localizada, no un contenedor traducido.

**Ficha editorial mínima antes de staging/publicación:**
- rendimiento: 10–12 pandebonos;
- preparación: masa de almidón de yuca/queso, hidratación gradual, formado y horneado;
- ingredientes y cantidades: deben quedar cerrados antes de crear la fila publicable;
- instrucciones: pasos numerados y reproducibles, con temperatura y señal visual de cocción;
- textura objetivo: exterior ligeramente dorado y firme, interior tierno y elástico;
- servicio: mejor recién horneado; incluir conservación y recalentado;
- FAQ: sustituciones razonables, masa seca/blanda, expansión y almacenamiento.

**Gate SEO/schema:** no emitir Recipe JSON-LD como contrato final hasta disponer de imagen real del plato, nombre, ingredientes, instrucciones y datos visibles coherentes. Google exige `image` y `name` para Recipe y recomienda ingredientes/instrucciones, entre otros campos. citeturn0search0

**Estado:** MASTER EDITORIAL → DEFINIDO; DATOS/IMAGEN → PENDIENTES; PUBLICACIÓN → BLOQUEADA.


## E007 Editorial closure — Pandebono

### Canonical entity contract
- Entity: Pandebono casero
- Type: Recipe
- ES public_path: /pandebono-casero/
- JA public_path: /ja/パンデボノ自家製/
- One recipe_group_id for ES and JA.
- No ContentPage parallel representation at the final URL.

### Editorial contract ES
- Yield: 10–12 pandebonos.
- Preparation: 25 min.
- Baking: 18–22 min.
- Total: approximately 45–50 min.
- Core ingredients: almidón de yuca, fécula/almidón de maíz, queso fresco o queso costeño suitable for baking, huevo, leche as needed, mantequilla and salt.
- Method: combine dry starches and salt; incorporate cheese and butter; add egg; hydrate gradually until soft dough; portion and shape; bake until expanded and lightly golden.
- Editorial requirements: explain dough hydration, shaping, baking cues, texture troubleshooting, serving, storage and FAQ.
- Do not present a single cheese substitution as culturally mandatory; explain that cheese choice changes saltiness and texture.

### Editorial contract JA
- Same culinary entity and formulation logic, fully localized rather than machine-translated shell.
- Preserve the Spanish/Colombian culinary identity while explaining ingredients in terms usable by Japanese readers.
- Localized metadata and headings; no invented historical claims.

### Publication gate
The entity is editorially defined but remains unpublished until the final image asset, complete visible ingredients and steps, metadata, canonical/hreflang and route QA are present. Recipe structured data must mirror those visible facts. Google currently requires a dish image and recipe name for Recipe rich-result eligibility and recommends explicit ingredient/instruction fields where applicable. citeturn0search0turn0search4
