# RECONSTRUCTION BATCH — E101–E105 — 2026-09-25

## Scope

These five Spanish historical URLs are high-value reconstruction candidates. The historical URL is preserved while the editorial content is rebuilt from scratch.

## E101 — Bondiola de cerdo
URL: /receta-bondiola-de-cerdo/
Type: Recipe.
Intent: bondiola de cerdo al horno.
Editorial blocks: introduction; selecting/preparing the cut; seasoning; marinating; searing; slow oven; pan juices/sauce; resting and slicing; accompaniments; storage; FAQ.
Gate: weight, prep time, cook time, yield, oven temperature and doneness must be established from the new tested recipe before schema publication.
No rating/review markup without genuine site data.

## E102 — Pie de maracuyá
URL: /receta-de-pie-de-maracuya/
Type: Recipe.
Editorial blocks: crust; passion-fruit filling; acidity/sweetness balance; chilling; slicing; storage; FAQ.
Gate: decide and test whether the final version is baked or no-bake before fixing times/schema.

## E103 — Salsa de ajo
URL: /receta-de-salsa-de-ajo/
Type: pending content-type gate.
The URL must represent one concrete garlic-sauce preparation. Do not combine unrelated sauce styles. Define ingredients, emulsification, consistency, acidity, storage and uses first. Publish as Recipe only if it is a concrete preparation with recipe instructions; otherwise use the appropriate editorial type.

## E104 — Stroganoff
URL: /creep-stroganoff/
Type: pending entity-content validation, intended Recipe.
Historical slug remains unchanged at this stage despite its unusual wording.
Before content creation, establish whether the historical entity is beef stroganoff or another documented variant. Once fixed, rebuild around meat, searing, sauce, mushroom/onion treatment if applicable, finishing, serving and storage.
No slug cleanup without reopening the URL Master decision.

## E105 — Rollo de carne
URL: /receta-de-rollo-de-carne/
Type: Recipe candidate.
Editorial blocks: meat mixture; binding; filling if selected; shaping; oven cooking; temperature/doneness; resting; slicing; sauce/accompaniments; storage; FAQ.
Gate: exact formulation, yield, times and temperature must come from the new recipe rather than historical metadata.

## Shared publication gate

- Keep historical URL if it remains the selected final URL.
- One entity, one canonical URL.
- No historical body reuse.
- No schema fields invented from old metadata.
- Recipe JSON-LD only when the page visibly contains a complete recipe and a crawlable representative dish image.
- BreadcrumbList must match actual site navigation.
- Publish only after route, canonical, hreflang (where applicable), sitemap, structured-data and visual QA.

Google's current Recipe documentation requires name and image for recipe rich-result eligibility and recommends validating structured data with the Rich Results Test before deployment. It also states that prepTime and cookTime are used together, while totalTime may be used instead. citeturn0search0turn0search2

## Status

E101 and E102: ready for recipe drafting/testing.
E103: content-type validation required.
E104: entity validation required.
E105: recipe drafting/testing ready.

## Implementation readiness — 2026-09-25

E101, E102 and E105 are ready for controlled recipe drafting/testing. E103 and E104 remain explicit validation gates and must not be forced into Recipe until their concrete preparation/entity is defined.

Historical URLs remain protected candidates and no slug or redirect mutation is authorized by this document.


## Implementation closure — 2026-09-25

The E101–E105 batch was executed against the existing Spanish Recipe entities.

- E101 Bondiola: reconstructed as a controlled oven recipe with explicit weight, timing, yield, temperature guidance, resting, storage and FAQ.
- E102 Pie de maracuyá: reconstruction fixed the documented variant as baked, with base, filling, chilling, storage and FAQ.
- E103 Salsa de ajo: historical ingredients/steps establish one concrete creamy garlic-sauce preparation; it is now treated as a Recipe reconstruction rather than an undefined generic sauce.
- E104 Stroganoff: historical evidence establishes that the entity is a crepe filled/served with beef-and-mushroom Stroganoff-style sauce. The historical /creep-stroganoff/ path remains unchanged; no slug cleanup was performed.
- E105 Rollo de carne: reconstructed with a defined meat mixture, oven method, temperature/doneness gate, resting, tomato sauce, storage and FAQ.
- All five existing Recipe rows retain their historical public paths.
- No new parallel entity was created.
- No redirect was created.
- Final publication/indexing QA remains pending: route, metadata, Recipe JSON-LD, canonical, sitemap and visual QA.
