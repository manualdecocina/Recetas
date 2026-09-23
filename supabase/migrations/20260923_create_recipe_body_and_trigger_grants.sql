-- Aplicada en Supabase como "create_recipe_body_and_trigger_grants".
-- create_recipe: published_at lo decide solo el trigger recipes_guard.
create or replace function public.create_recipe(
  p_language text, p_slug text, p_title text, p_excerpt text,
  p_ingredients jsonb, p_steps jsonb, p_category text,
  p_prep_time_minutes integer, p_cook_time_minutes integer,
  p_servings integer, p_image_url text, p_published boolean
)
returns public.recipes
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_row public.recipes;
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  insert into public.recipes (
    recipe_group_id, language, slug, title, excerpt, ingredients, steps,
    category, prep_time_minutes, cook_time_minutes, servings, image_url, published
  ) values (
    gen_random_uuid(), p_language, p_slug, p_title, p_excerpt, p_ingredients, p_steps,
    p_category, p_prep_time_minutes, p_cook_time_minutes, p_servings, p_image_url, p_published
  ) returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.recipes_guard() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
