-- Remove unpublished ContentPage duplicates where the canonical Recipe is already published.
-- These rows have the same public path as the published Recipe and therefore cannot
-- represent an independent public entity.
delete from public.content_pages
where published = false
  and slug in (
    'empanada-peruana-de-pollo',
    'pollo-alfredo-a-la-florentina',
    'receta-de-ajiaco'
  );
