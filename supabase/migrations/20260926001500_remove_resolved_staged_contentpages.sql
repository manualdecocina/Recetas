-- Remove staged ContentPages whose public model is already resolved.
-- Caprese is represented by a published Recipe at the same path.
-- Tienda is an empty legacy WooCommerce placeholder and is not part of the current model.
delete from public.content_pages
where published = false
  and slug in ('receta-ensalada-caprese', 'tienda');
