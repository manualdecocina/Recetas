# E012 — POLLO ALFREDO A LA FLORENTINA

**Type:** Recipe

**Current ES:** `/pollo-alfredo-a-la-florentina/` exists as a published ContentPage.

**Historical JA:** `/ja/フィレンツェ風チキンアルフレッド/` — 67 clicks.

Decision: final model must be Recipe, not ContentPage. Before publishing the rebuilt entity, migrate the Spanish record into the Recipe model and attach the Japanese localization to the same recipe_group_id. Do not maintain parallel Recipe and ContentPage representations.

## Reconstruction closure — 2026-09-25

The staged Recipe model is now populated for both approved localizations under the existing recipe group:

- `recipe_group_id`: `10f7083a-a795-4acf-8b44-22c543e8bd2d`
- ES: `/pollo-alfredo-a-la-florentina`
- JA: `/ja/フィレンツェ風チキンアルフレッド/`
- Both Recipe rows remain `published=false`.
- No new recipe group was created for JA.

### Editorial formulation frozen for staging

- Yield: 4 portions.
- Preparation: 15 min.
- Cooking: 30 min.
- Total: 45 min.
- Main structure: browned chicken + pasta + creamy Alfredo sauce + spinach.
- Sauce: cream, Parmesan and pasta water; controlled heat and gradual cheese incorporation.
- Florentine component: spinach.
- Serving: immediate, with optional Parmesan and parsley.
- Storage: refrigerate up to 3 days; reheat gently with a small amount of liquid; freezing is not preferred because cream-sauce texture can change.
- FAQ covers the meaning of “Florentine”, frozen spinach, pasta substitutions and preventing sauce separation.

The ES and JA rows contain complete ingredients, numbered preparation steps, editorial HTML, metadata and the same verified historical dish image asset already present in `media_assets` (`alfredo-2.png`). The JA page is a complete localized recipe, not a translation shell.

### Publication gate

Publication remains blocked until route/schema/hreflang/sitemap QA is completed. The Spanish ContentPage remains published only as the temporary legacy representation; it must be retired when the Recipe is actually published so the final URL never serves both models simultaneously.

No redirect is required because the final ES URL is unchanged.
