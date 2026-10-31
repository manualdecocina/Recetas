-- Cazuela de mariscos quedó publicada sin ready_at, y el listado de Recetas ordena por ready_at:
-- sin fecha, el plato aparece al final en vez de entre las más recientes.
-- Se copia published_at (mismo arreglo que se hizo con las mini quiches). Idempotente.
update public.recipes
   set ready_at = published_at
 where published
   and ready_at is null
   and published_at is not null
   and recipe_group_id in (select recipe_group_id from public.recipes where language = 'es' and slug = 'casuela-de-mariscos');
