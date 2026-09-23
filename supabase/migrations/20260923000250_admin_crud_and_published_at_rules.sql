-- HISTORIAL. No ejecutar sobre una base nueva: usar supabase/schema.sql.
-- Copia exacta de la migración aplicada en Supabase (fase infraestructura).
-- Lectura de borradores para admin, reglas de published_at, inmutabilidad de
-- recipe_group_id/language, RPC de edición y permisos de ejecución.

create policy "admin read all recipes"
on public.recipes for select
to authenticated
using (public.is_admin());

-- Regla de published_at (la controla la base de datos, nunca el cliente):
--   * se fija la PRIMERA vez que la receta se publica;
--   * despublicar NO la borra;
--   * volver a publicar conserva la fecha original.
create or replace function public.recipes_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.published_at := case when new.published then now() else null end;
  else
    if new.recipe_group_id is distinct from old.recipe_group_id
       or new.language is distinct from old.language then
      raise exception 'recipe_group_id y language no se pueden modificar';
    end if;
    new.published_at := old.published_at;
    if new.published and new.published_at is null then
      new.published_at := now();
    end if;
  end if;
  return new;
end;
$$;

create trigger recipes_guard
before insert or update on public.recipes
for each row execute function public.recipes_guard();

create or replace function public.update_recipe(
  p_id uuid, p_slug text, p_title text, p_excerpt text,
  p_ingredients jsonb, p_steps jsonb, p_category text,
  p_prep_time_minutes integer, p_cook_time_minutes integer,
  p_servings integer, p_image_url text, p_published boolean
)
returns public.recipes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.recipes;
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  update public.recipes set
    slug = p_slug, title = p_title, excerpt = p_excerpt,
    ingredients = p_ingredients, steps = p_steps, category = p_category,
    prep_time_minutes = p_prep_time_minutes, cook_time_minutes = p_cook_time_minutes,
    servings = p_servings, image_url = p_image_url, published = p_published
  where id = p_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Receta no encontrada';
  end if;

  return v_row;
end;
$$;

revoke execute on function public.create_recipe(text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) from public, anon;
revoke execute on function public.create_recipe_translation(uuid, text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) from public, anon;
revoke execute on function public.update_recipe(uuid, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) from public, anon;
revoke execute on function public.is_admin() from public, anon;

grant execute on function public.create_recipe(text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) to authenticated;
grant execute on function public.create_recipe_translation(uuid, text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) to authenticated;
grant execute on function public.update_recipe(uuid, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) to authenticated;
grant execute on function public.is_admin() to authenticated;

alter function public.set_updated_at() set search_path = public;
