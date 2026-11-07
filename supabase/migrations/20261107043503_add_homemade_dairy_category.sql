-- Extend the existing published-recipe category constraint without removing
-- any previously permitted label. The existing constraint stays the baseline.
-- Preserve legacy public_path, slug, recipe_group_id and published_at unchanged.
do $$
declare
  previous_check text;
  old_expression text;
  new_check text;
begin
  select pg_get_constraintdef(oid)
    into previous_check
  from pg_constraint
  where conrelid = 'public.recipes'::regclass
    and conname = 'recipes_published_category_canonical';

  if previous_check is null then
    raise exception 'Missing recipes_published_category_canonical; aborting category migration';
  end if;
  if position('Lácteos caseros' in previous_check) > 0 then
    return; -- already applied
  end if;
  if left(previous_check, 7) <> 'CHECK (' or right(previous_check, 1) <> ')' then
    raise exception 'Unexpected canonical-category constraint definition';
  end if;

  -- Strip only the outer CHECK (...) wrapper from PostgreSQL's canonical SQL.
  old_expression := substring(previous_check from 8 for char_length(previous_check) - 8);
  new_check := 'CHECK (' || old_expression || $extra$ OR (
      (language = 'es' AND category = 'Lácteos caseros')
      OR (language = 'en' AND category = 'Homemade dairy')
      OR (language = 'de' AND category = 'Hausgemachte Milchprodukte')
      OR (language = 'fr' AND category = 'Produits laitiers maison')
      OR (language = 'it' AND category = 'Latticini fatti in casa')
      OR (language = 'ja' AND category = '手作り乳製品')
      OR (language = 'pt' AND category = 'Laticínios caseiros')
  )$extra$ || ')';

  execute 'alter table public.recipes drop constraint recipes_published_category_canonical';
  execute 'alter table public.recipes add constraint recipes_published_category_canonical ' || new_check;
end
$$;
