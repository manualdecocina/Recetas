# PRODUCT / AFFILIATE URL CLOSEOUT — V1 — 2026-09-25

## Final catalogue decision

The following historical URLs are permanently outside the new Manual de Cocina editorial catalogue:

- /licuadoras-para-cocina/
- /mejor-batidora-de-vaso-en-2025/
- /ollas-multiuso/
- /productos-cocina-cafeteras/
- /productos-de-cocina-recomendados-por-el-chef/
- /utensilios-de-cocina/
- /refrijeradores-de-cocina/
- /baterias-de-cocina/

They will not be rebuilt as recipes, product reviews, Amazon/affiliate pages, or a new product section.

## Existing implementation

The migration 20260924214225_consolidate_known_duplicates_and_remove_affiliate_pages.sql already:

1. sets these ContentPages to published=false;
2. removes the old content_redirects that sent them to equivalent-looking product routes.

The current public route only serves published content_pages/recipes; unpublished records therefore do not become public editorial pages. The sitemap also only selects published records.

## Search Console evidence

The available top-1000 Search Console export for 2025-05-23 → 2026-09-21 contains only:

- /mejor-batidora-de-vaso-en-2025/ — 0 clicks, 13 impressions;
- /en/mejor-batidora-de-vaso-en-2025/ — 0 clicks, 22 impressions.

The absence of the other six from that export does not prove zero traffic.

## Redirect decision

No affiliate/product URL is redirected to a recipe merely to avoid a 404.

If a future audit finds a genuinely equivalent editorial destination, it can receive a direct permanent redirect. Otherwise the old URL remains retired and should resolve as a real 404/410 rather than a soft redirect to an unrelated page.

This follows Google's current migration guidance: map old URLs to relevant final destinations, use permanent redirects for genuine moves, update internal links and sitemaps, and avoid irrelevant redirects. citeturn0search0turn0search4

## Status

CATALOGUE: CLOSED.

IMPLEMENTATION: CLOSED in repository migrations.

PRODUCTION DATABASE: requires the existing migration chain to be applied; no new direct Supabase mutation was claimed here.
