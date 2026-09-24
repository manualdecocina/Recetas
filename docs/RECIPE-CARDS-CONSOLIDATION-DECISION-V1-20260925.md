# RECIPE-CARDS CONSOLIDATION — DECISION GATE V1 — 2026-09-25

## Confirmed principle

The 77 historical recipe-card pairs are not 77 additional editorial entities. The recipe-card layer is a technical/historical representation. The editorial URL remains the entity's primary candidate.

Google treats duplicate or substantially similar URLs as a canonicalization problem and recommends consolidating signals toward a representative URL; permanent redirects are appropriate when a URL genuinely moves, while irrelevant redirects should be avoided. citeturn0search0turn0search2

## High-priority confirmed pairs

| Editorial URL | Historical clicks | Recipe-card |
|---|---:|---|
| /receta-de-pie-de-maracuya/ | 193 | /recipe-cards/pie-de-maracuya/ |
| /receta-de-salsa-de-ajo/ | 189 | /recipe-cards/salsa-de-ajo/ |
| /receta-de-rollo-de-carne/ | 74 | /recipe-cards/rollo-de-carne/ |
| /chorizo-santarosano/ | 45 | /recipe-cards/chorizo-santarosano-colombia/ |
| /receta-cheesecake-de-agraz/ | 39 | /recipe-cards/cheesecake-de-agraz/ |
| /lomo-de-cerdo-en-salsa-de-menta/ | 38 | /recipe-cards/lomo-de-cerdo-en-salsa-de-menta/ |
| /receta-de-pollo-teriyaki/ | 34 | /recipe-cards/pollo-teriyaki-con-verduras-al-wok/ |
| /receta-mejillones-al-ajillo/ | 31 | /recipe-cards/mejillones-al-ajillo/ |
| /receta-de-fajitas-mexicanas/ | 21 | /recipe-cards/fajitas-mexicanas/ |
| /receta-de-pancakes-con-fresas-y-arandanos/ | 14 | /recipe-cards/pancakes-con-fresas-y-arandanos/ |
| /pollo-alfredo-a-la-florentina/ | 13 | /recipe-cards/pollo-alfredo-a-la-florentina/ |
| /receta-de-arroz-chino/ | 7 | /recipe-cards/arroz-chino/ |
| /receta-de-burrito-mexicano/ | 2 | /recipe-cards/8708/ |

## Decision

These pairs are treated as **one entity candidate**, not two pages to rebuild independently.

For each pair the next implementation check is:

1. Confirm that both URLs represent the same search intent.
2. Preserve the editorial URL when it is the selected final URL.
3. Rebuild the editorial page as the canonical Recipe entity.
4. Do not publish a second editorial entity for the recipe-card URL.
5. If the recipe-card URL is an actual accessible legacy URL and the equivalence is confirmed, point it directly to the final editorial URL with a permanent server-side redirect.
6. If equivalence is not confirmed, do not redirect automatically; resolve the URL individually in the URL Master.
7. Keep recipe-card URLs out of the new sitemap once retired.
8. Update internal links so users and crawlers use the editorial URL directly.

## Important boundary

This document does not authorize 77 blind redirects. The 13 examples above are the confirmed high-priority subset from the existing Search Console audit. The remaining historical pairs must inherit the same decision procedure, with URL-level evidence before mutation.

## SEO rationale

Canonical tags are hints rather than absolute commands. Google can choose a different canonical based on content quality and other signals. Therefore the clean architecture is one definitive editorial URL, direct internal linking, consistent canonical, and a direct permanent redirect only where a real URL consolidation has been established. citeturn0search0turn0search1

## Status

Model decision: CLOSED.

Redirect execution: NOT YET EXECUTED.

Remaining work: URL-by-URL validation of the full 77-pair inventory before redirects/deletions.
