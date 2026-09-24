# ENTITY REGISTRY V1 — 2026-09-24

## Purpose
Stable entity registry for the editorial reconstruction. This registry separates entity identity from localized URLs and publication state.

## P0 entity decisions
| ID | Entity | Type | Languages/URLs | Decision |
|---|---|---|---|---|
| E001 | Lechona colombiana | Recipe | ES/DE/JA/IT/FR/EN | CORE / REBUILD |
| E002 | Casuela de frijoles colombianos | Recipe | DE/FR/IT | CORE / REBUILD |
| E003 | Burrito mexicano | Recipe | JA | CORE / REBUILD |
| E004 | Pollo teriyaki con verduras | Recipe | IT | CORE / REBUILD |
| E005 | Jugo anticancerígeno | Editorial/Recipe | DE/EN + historical variants | REVIEW |
| E006 | Porra antequerana | Recipe | FR/IT | CORE / REBUILD |
| E007 | Pandebono casero | Recipe | JA | CORE / REBUILD |
| E008 | Pan Matzá | Recipe | DE/JA | CORE / REBUILD |
| E009 | Pie de limón | Recipe | JA | CORE / REBUILD |
| E010 | Batido Grimace | Recipe/Editorial | DE/FR + historical variants | REVIEW |
| E011 | Horchata casera | Recipe | JA + historical variants | CORE / REBUILD; consolidate ES duplicate first |
| E012 | Pollo Alfredo a la Florentina | Recipe | JA | CORE / REBUILD |
| E013 | Pulpo a la Gallega | Recipe | DE | CORE / REBUILD |
| E014 | Ajiaco colombiano | Recipe | IT | CORE / REBUILD |
| E015 | Empanada peruana de pollo | Recipe | ES/IT | CORE / REBUILD |
| E101 | Bondiola de cerdo | Recipe | ES | CORE / REBUILD |
| E102 | Pie de maracuyá | Recipe | ES | CORE / REBUILD |
| E103 | Salsa de ajo | Recipe | ES | CORE / REBUILD |
| E104 | Stroganoff | Recipe | ES | CORE / REBUILD |
| E105 | Rollo de carne | Recipe | ES | CORE / REBUILD |
| E106 | Sopa saludable para enfermos | Editorial | ES | REVIEW |

## Entity rules
1. One culinary entity = one recipe group.
2. A language variant belongs to the same entity only when it represents the same dish and search intent.
3. Different URLs do not create different entities by themselves.
4. Duplicate Recipe and ContentPage representations must be consolidated.
5. Historical translated URLs are evidence and protected assets, not permission to copy historical body text.
6. No translation is considered published until its localized content is complete.
7. Hreflang is generated only for published equivalent variants.
8. Recipe JSON-LD is generated only from real visible recipe data.

## Next consolidation check
Before expanding E001 production, confirm whether /receta-de-horchata/ and the E011 Japanese entity are the same recipe. If they are, keep one entity and assign the Spanish historical URL to that group rather than creating a second entity.

## Current launch principle
The registry is the source of truth for entity identity. URL Master remains the source of truth for URL/provenance/history. Supabase remains the source of truth for current publication state.