# E013 — PULPO A LA GALLEGA

**Type:** Recipe

**ES:** `/receta-de-pulpo-a-la-gallega/`
**DE:** `/de/oktopus-rezept-nach-galizischer-art/`

## Reconstruction closure — 2026-09-25

The existing Spanish Recipe entity is the canonical group:

- `recipe_group_id`: `e1346490-827e-44f7-bb1a-eb6d784285da`
- ES existing Recipe preserved.
- DE localized Recipe added to the same group.
- No second entity/group was created.

### Editorial formulation

- Yield: 4 portions.
- Preparation: 15 min.
- Cooking: 60 min.
- Total: 80 min.
- Core: 1 kg cleaned octopus, 1 kg potatoes, bay leaf, coarse salt, sweet paprika, optional hot paprika and extra-virgin olive oil.
- Editorial blocks: octopus tenderness, potatoes, paprika/oil, plating, common mistakes, storage and FAQ.
- Cooking time is explicitly treated as an orientation; tenderness is the final doneness test.
- DE is complete localized editorial content, not a translation shell.
- Historical body HTML was not reused as final editorial copy.
- The identified historical dish image is registered in `media_assets` and reused as the recipe image asset.

### Data state

- ES Recipe populated and **unpublished pending QA**.
- DE Recipe populated and **unpublished pending QA**.
- Both rows contain non-empty ingredients, steps, editorial content, image, timing, yield and metadata.
- No redirect is required because both final URLs are unchanged.

### Publication gate

Do not publish until route → metadata → Recipe JSON-LD → canonical/hreflang → sitemap → visual QA is completed. After publication, ES and DE must be reciprocal hreflang equivalents under this same recipe group.
