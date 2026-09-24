# E002 — CASUELA DE FRIJOLES COLOMBIANOS — FINAL ENTITY CONTRACT

## Entity
- entity_id: E002
- content_type: Recipe
- recipe_group_id: ea6708f7-74b0-43cd-a4b8-cc8b016552a9
- current ES Recipe: /casuela-de-frijoles-colombianos/
- current ES record is published and has historical source_url.

## Historical multilingual assets

| Language | Historical URL | Search evidence | Final treatment |
|---|---|---:|---|
| ES | /casuela-de-frijoles-colombianos/ | historical source | preserve |
| DE | /de/kolumbianische-bohnen-casuela/ | 114 clicks; 880 impressions; avg pos 4.19 | preserve / rebuild |
| FR | /fr/casuela-aux-haricots-colombiens/ | 320 clicks; 1,611 impressions; avg pos 3.15 | preserve / rebuild |
| IT | /it/casuela-colombiana-di-fagioli/ | 62 clicks; 484 impressions; avg pos 4.88 | preserve / rebuild |

## Model decision
One entity, four localized Recipe pages.

No separate ContentPage should represent these recipes. The DE/FR/IT pages are not yet current Supabase Recipe rows and must be created later under this same recipe_group_id.

## Publication gate
A language variant is not publishable until it has:
- complete localized recipe content;
- final image;
- localized metadata;
- self-canonical;
- reciprocal hreflang with all other published E002 variants;
- Recipe JSON-LD matching visible content;
- internal links;
- sitemap inclusion;
- QA.

Google requires Recipe structured data to represent a particular dish and requires the markup to reflect crawlable/indexable recipe imagery and the page content. citeturn0search0turn0search2

## URL rule
The historical paths above are protected. Do not force the entity into a generic /lang/receta/slug pattern.

## Editorial rule
Historical body text is not recovered. All language variants will be written anew and localized.

## Next action
Create the DE, FR and IT Recipe records only after the editorial URL/entity registry is accepted; keep them unpublished until their content and SEO gates are complete.