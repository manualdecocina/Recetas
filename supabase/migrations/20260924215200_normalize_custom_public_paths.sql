create or replace function public.create_recipe(
  p_language text,
  p_slug text,
  p_title text,
  p_excerpt text,
  p_ingredients jsonb,
  p_steps jsonb,
  p_category text,
  p_prep_time_minutes integer,
  p_cook_time_minutes integer,
  p_servings integer,
  p_image_url text,
  p_published boolean,
  p_public_path text default null
)
returns public.recipes
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_row public.recipes;
  v_public_path text := nullif(regexp_replace(coalesce(p_public_path, ''), '/+$', ''), '');
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  if v_public_path is not null and (
    left(v_public_path, 1) <> '/'
    or v_public_path like '%?%'
    or v_public_path like '%#%'
    or v_public_path ~ '\s'
  ) then
    raise exception 'URL pública no válida';
  end if;

  insert into public.recipes (
    recipe_group_id, language, slug, public_path, title, excerpt, ingredients, steps,
    category, prep_time_minutes, cook_time_minutes, servings, image_url, published
  ) values (
    gen_random_uuid(), p_language, p_slug, v_public_path, p_title, p_excerpt, p_ingredients, p_steps,
    p_category, p_prep_time_minutes, p_cook_time_minutes, p_servings, p_image_url, p_published
  ) returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.create_recipe_translation(
  p_source_recipe_id uuid,
  p_language text,
  p_slug text,
  p_title text,
  p_excerpt text,
  p_ingredients jsonb,
  p_steps jsonb,
  p_category text,
  p_prep_time_minutes integer,
  p_cook_time_minutes integer,
  p_servings integer,
  p_image_url text,
  p_published boolean,
  p_public_path text default null
)
returns public.recipes
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_group uuid;
  v_row public.recipes;
  v_public_path text := nullif(regexp_replace(coalesce(p_public_path, ''), '/+$', ''), '');
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  if v_public_path is not null and (
    left(v_public_path, 1) <> '/'
    or v_public_path like '%?%'
    or v_public_path like '%#%'
    or v_public_path ~ '\s'
  ) then
    raise exception 'URL pública no válida';
  end if;

  select recipe_group_id into v_group
  from public.recipes
  where id = p_source_recipe_id;

  if v_group is null then
    raise exception 'La receta de origen no existe';
  end if;

  if exists (
    select 1 from public.recipes
    where recipe_group_id = v_group and language = p_language
  ) then
    raise exception 'Ya existe una traducción en % para esta receta', p_language;
  end if;

  insert into public.recipes (
    recipe_group_id, language, slug, public_path, title, excerpt, ingredients, steps,
    category, prep_time_minutes, cook_time_minutes, servings, image_url, published
  ) values (
    v_group, p_language, p_slug, v_public_path, p_title, p_excerpt, p_ingredients, p_steps,
    p_category, p_prep_time_minutes, p_cook_time_minutes, p_servings, p_image_url, p_published
  ) returning * into v_row;

  return v_row;
end;
$$;