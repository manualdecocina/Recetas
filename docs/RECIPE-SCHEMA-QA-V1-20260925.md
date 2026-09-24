# RECIPE SCHEMA QA GATE — V1 — 2026-09-25

## Current contract

Google requires Recipe structured data to include `name` and `image` for Recipe rich-result eligibility. Recipe instructions should use HowToStep when appropriate, and structured data must represent the visible recipe content. citeturn0search0turn0search1

The current RecipeDocument already emits:
- Recipe
- name
- image when present
- description when present
- URL
- dates when present
- recipeIngredient
- recipeInstructions as HowToStep
- prep/cook time only when both are known
- totalTime only when a valid total exists
- recipeYield when servings exist
- recipeCategory when category exists
- BreadcrumbList

## Gap identified

The data model already contains `cuisine` and `keywords`, but the current Recipe JSON-LD does not yet expose them.

This is not a required-property blocker. It is a quality improvement and should only be added when the values describe the visible recipe.

## Publication gate

Before publishing each rebuilt recipe:
1. name and completed-dish image exist;
2. ingredients and instructions are visible and complete;
3. Recipe JSON-LD matches those visible values;
4. times are emitted only when their source data is valid;
5. no unsupported medical/product claims are encoded;
6. BreadcrumbList matches the visible navigation;
7. canonical and hreflang point only to published final URLs;
8. sitemap contains the final published URL;
9. Rich Results Test and URL Inspection are run after deployment.

## Current implementation status

A direct code update to add optional cuisine/keywords was attempted in this cycle but was blocked by the repository tool safety layer. No false success is claimed. The existing schema remains unchanged and valid under the required-property contract.

## Next executable block

When repository mutation is available, add:
- `recipeCuisine` from `recipe.cuisine`;
- `keywords` from `recipe.keywords`.

Do not add empty properties.
