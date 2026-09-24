# POINT 2 — ENTITY CONSOLIDATION CLOSEOUT

## Final P0 state

### CORE / REBUILD
- E001 Lechona — ES/DE/JA/IT/FR/EN
- E002 Casuela — ES/DE/FR/IT
- E003 Burrito — ES/JA
- E004 Teriyaki — ES/IT
- E006 Porra — ES/FR/IT
- E007 Pandebono — ES/JA
- E008 Pan Matzá — ES/DE/JA
- E009 Pie de limón — ES/JA
- E011 Horchata — ES + historical variants pending equivalence verification
- E012 Pollo Alfredo — ES/JA; final model Recipe
- E013 Pulpo — ES/DE
- E014 Ajiaco — ES/IT
- E015 Empanada Peruana — ES/IT
- E101 Bondiola — ES
- E102 Pie de maracuyá — ES
- E103 Salsa de ajo — ES
- E104 Stroganoff — ES
- E105 Rollo de carne — ES

### REVIEW
- E005 Jugo anticancerígeno — health-claim review
- E010 Batido Grimace — editorial/relevance review
- E106 Sopa saludable para enfermos — health-claim/content-type review

## Hard decisions completed

1. Historical URL evidence is separated from historical body content.
2. One entity is represented by one recipe group.
3. Localized URLs remain protected when they have been selected as final.
4. Recipe-like ContentPages are not allowed to coexist with final Recipe entities.
5. New translations remain unpublished until complete.
6. No redirects are created when the historical URL remains final.
7. Redirects are only for genuine URL changes to a relevant final destination.
8. No mass historical-content recovery is required.

Google's migration guidance requires an old-to-new URL mapping before URL changes, self-canonical targets, updated hreflang/internal links, and direct permanent redirects when a URL actually changes. citeturn0search1

Google's localized-version guidance requires each published language version to reference itself and the other published versions with fully qualified URLs. citeturn0search0turn0search2

## Point 2 status

ENTITY IDENTITY: CLOSED
URL RELATIONSHIPS: CLOSED FOR P0, EXCEPT E011 VERIFICATION
CONTENT PRODUCTION: NOT STARTED BY THIS STEP
PUBLICATION: NOT AUTHORIZED BY THIS STEP

## Next phase

Point 3 is the editorial reconstruction matrix: for every CORE entity/language, define final title, slug/path, search intent, content sections, image requirement, metadata, schema fields, internal links and publication dependencies. No bulk translation should begin before this matrix exists.
