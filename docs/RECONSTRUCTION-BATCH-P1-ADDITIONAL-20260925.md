# RECONSTRUCTION BATCH — P1 ADDITIONAL — 2026-09-25

## Scope

Seven P1 Spanish URLs already confirmed as KEEP / REBUILD were reconstructed in their existing Recipe rows. No new entity, URL or redirect was created.

## Completed

- /receta-envuelto-de-choclo/ — 12 ingredients, 8 steps, 45/60/105 min, 8 servings.
- /receta-cheesecake-de-agraz/ — 9 ingredients, 8 steps, 30/50/320 min, 8 servings.
- /lomo-de-cerdo-en-salsa-de-menta/ — 9 ingredients, 8 steps, 20/60/80 min, 6 servings.
- /receta-de-pancakes-con-fresas-y-arandanos/ — 11 ingredients, 8 steps, 10/20/30 min, 4 servings.
- /cangrejo-al-limon/ — 8 ingredients, 8 steps, 10/10/20 min, 4 servings.
- /receta-helado-casero/ — rebuilt as a vanilla base, 5 ingredients, 7 steps, 25/15/280 min, 6 servings.
- /receta-trucha-al-ajillo-con-limon/ — 7 ingredients, 8 steps, 10/10/20 min, 4 servings.

## Editorial controls

- Existing public paths retained exactly.
- Existing Recipe entities retained; no parallel rows created.
- Historical body text was not reused as final editorial copy.
- Historical health/benefit claims were removed from the rebuilt visible content.
- E103/E104 and E101–E105 were not reopened.
- No redirect created because the final URL did not change.
- All seven rows remain published=true in the current database; this block is reconstruction, not a new publication action.

## Verification

Supabase verification confirmed all seven rows have non-empty ingredients, steps and content_html, timings, servings and image_url, with their original public paths.

## Pending final gate

Route, metadata, Recipe JSON-LD, canonical/hreflang, sitemap and visual QA remain the final QA gate before any broader publication/indexing changes.

## Commit

- Documentation commit: 2ffb1ba105807b19c8f353d8c7a8b0a8c38a246d
