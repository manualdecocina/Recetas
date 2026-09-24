# E012 — POLLO ALFREDO A LA FLORENTINA

ES: `/pollo-alfredo-a-la-florentina/`
JA: `/ja/フィレンツェ風チキンアルフレッド/`

Final content type: Recipe. The existing Spanish ContentPage must not coexist with a Recipe record.

Editorial structure: chicken; sauce; Florentine component; serving; consistency; storage; FAQ.

Schema: Recipe + BreadcrumbList.

## Staging closure — 2026-09-25

The editorial formulation has been reconstructed and staged from scratch.

### ES

- 4 portions.
- 15 min preparation.
- 30 min cooking.
- 45 min total.
- 500 g chicken breast.
- 350 g fettuccine or linguine.
- 2 cups fresh spinach.
- Butter, olive oil, garlic, cream, Parmesan, pasta water, salt and pepper; optional nutmeg and parsley.
- 7 complete preparation steps.
- Editorial sections: chicken, Alfredo sauce, spinach/pasta, common mistakes, storage and FAQ.
- Historical dish image reused as the identified media asset only; historical body HTML was not reused.

### JA

- Same culinary formulation and recipe group as ES.
- Complete localized ingredients and 7 preparation steps.
- Japanese editorial sections covering chicken, sauce, spinach/pasta, common mistakes, storage and FAQ.
- Localized title, description and metadata.
- Not a translation shell.

### Data state

- Existing ES staged Recipe populated; remains unpublished.
- JA Recipe created in the same `recipe_group_id`; remains unpublished.
- Both rows have non-empty ingredients, steps, editorial content, image, timing, yield and metadata.
- Existing ES ContentPage remains temporarily published only to protect the historical route until the Recipe publication cutover.

### Next gate

Run the E012 route/model/schema QA. Do not publish until the Recipe route resolves directly, Recipe JSON-LD reflects visible fields, canonical/hreflang are correct for actually published equivalents, and the equivalent ES ContentPage is retired in the same publication cutover.
