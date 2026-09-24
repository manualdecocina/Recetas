# E014 — AJIACO COLOMBIANO

**Type:** Recipe

**ES:** `/receta-de-ajiaco/` — staged Recipe.

**Historical IT:** `/it/ajiaco-ricetta/` — historical localized URL.

Decision: one entity, ES + IT. Preserve the Italian historical URL and rebuild it as a localized Recipe under the same recipe group.

## Reconstruction closure — 2026-09-25

- `recipe_group_id`: `3225779c-4c03-4b93-8c68-7454142f87f3`
- ES staged Recipe populated; unpublished.
- IT localized Recipe added to the same group; unpublished.
- Both rows have complete ingredients, steps, editorial content, image, timing, yield and metadata.
- Editorial scope: factual Colombian/Bogota context, potato varieties, chicken, herbs, cooking sequence, texture, service, common mistakes, storage and FAQ.
- Historical body HTML was not reused as final editorial copy.
- `ajiaco.jpg` is the identified historical dish image asset and is used by both staged rows.
- IT is a complete localized recipe, not a translation shell.
- No redirect is required because the final ES URL is unchanged.

## Publication gate

Do not publish until route, metadata, Recipe JSON-LD, canonical/hreflang, sitemap and visual QA are complete. ES and IT must be reciprocal hreflang equivalents under this same recipe group after publication.
