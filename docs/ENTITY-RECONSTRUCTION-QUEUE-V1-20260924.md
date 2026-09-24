# ENTITY RECONSTRUCTION QUEUE — V1

## Point 2 progress
E001 Lechona is consolidated as the canonical entity contract. Its duplicate ES NEW_SEED Recipe and duplicate ES ContentPage were removed; the surviving ES Recipe remains staged and keeps the historical public path. The English Recipe remains staged for later localized reconstruction.

## E002–E015 database crosswalk

| Entity | Current base record | Historical localization work | Immediate action |
|---|---|---|---|
| E002 Casuela | ES Recipe, group ea6708f7-74b0-43cd-a4b8-cc8b016552a9 | DE / FR / IT | Create localized Recipe rows in same group; preserve historical paths |
| E003 Burrito | ES Recipe, group 17fbbc8a-0332-4ce9-ad32-6aa2eccf36c6 | JA | Add JA localized Recipe to same group |
| E004 Teriyaki | ES Recipe, group 6ccc032c-74f2-456f-98a6-4890e3afeaec | IT | Add IT localized Recipe to same group |
| E005 Jugo anticancerígeno | ES Recipe, group 2a3f? | DE / EN | REVIEW health claims before entity publication |
| E006 Porra | ES Recipe, group 54ccca4c-588a-445e-be20-3e3fd2b42b7a | FR / IT | Add localized Recipe rows to same group |
| E007 Pandebono | ES Recipe | JA | Add JA localized Recipe to same group |
| E008 Pan Matzá | ES Recipe, group 9b382d65-c7a5-400e-b710-254446e104d1 | DE / JA | Add localized Recipe rows to same group |
| E009 Pie de limón | ES Recipe, group ae18f891-ce44-4a46-a6a5-4c1857917648 | JA | Add JA localized Recipe to same group |
| E010 Batido Grimace | ES Recipe, group 2a3f91fd-4962-4cf0-940a-0b98e94c7ef0 | DE / FR | REVIEW before rebuilding |
| E011 Horchata | ES Recipe, group feb86ff3-2fd8-4a3f-8877-0ecc975fc816 | JA + other historical variants | Consolidate historical variants into this entity if intent matches |
| E012 Pollo Alfredo | ES ContentPage only | JA | Convert final model to Recipe; no parallel Recipe + ContentPage |
| E013 Pulpo | ES Recipe, group e1346490-827e-44f7-bb1a-eb6d784285da | DE | Add DE localized Recipe to same group |
| E014 Ajiaco | ES Recipe | IT | Add IT localized Recipe to same group |
| E015 Empanada Peruana | ES Recipe staged; historical ContentPage consolidated | IT | Keep one Recipe entity; provenance and content still pending |

## Rules before creating translations
1. Never create a second entity because a translated historical URL is missing from Supabase.
2. Attach each true localized equivalent to the existing recipe_group_id.
3. Historical URL evidence determines public_path; it does not determine whether old body text is reused.
4. A ContentPage that is actually a recipe must not coexist with the final Recipe entity.
5. New localized pages remain unpublished until editorial content, image, metadata, schema, canonical, hreflang and QA are complete.
6. Do not create redirects while the final URL is unchanged.

## Important technical gate
The current generic catch-all content route is insufficient for a final historical Recipe URL because it does not provide the full Recipe SEO contract. Historical root-style recipe URLs must resolve through Recipe entity logic, not merely through generic ContentPage rendering.

## Next batch
E002 Casuela → E003 Burrito → E004 Teriyaki → E006 Porra. These are the next four entities because their historical multilingual URL evidence is already strong and their Spanish Recipe entity is present.