-- =============================================================================
-- BORRADOR — NO APLICADO EN SUPABASE. No ejecutar sin aprobación del control.
-- Diseño completo en docs/importacion-historica.md
-- =============================================================================

-- 1. Auditoría / idempotencia / mapa de URLs antiguas
create table public.recipe_import_log (
  id bigint generated always as identity primary key,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  legacy_path text not null unique check (legacy_path like '/%'),
  original_published_at timestamptz not null,
  batch_label text not null,
  imported_at timestamptz not null default now()
);
alter table public.recipe_import_log enable row level security;
-- Sin políticas: invisible para anon/authenticated.

-- 2. Trigger con excepción mínima (sustituye a la versión actual de recipes_guard)
create or replace function public.recipes_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if current_setting('app.historical_import', true) = 'on'
       and current_user not in ('anon', 'authenticated', 'service_role', 'authenticator') then
      if new.published_at is null or new.published_at > now() then
        raise exception 'Importación histórica: published_at debe existir y no ser futura';
      end if;
      -- se conserva la fecha histórica recibida (también si se importa como borrador)
    else
      new.published_at := case when new.published then now() else null end;
    end if;
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

-- 3. Único camino para importar
create function public.import_historical_recipe(
  p_source_recipe_id uuid,              -- null = plato nuevo
  p_language text, p_slug text, p_title text, p_excerpt text,
  p_ingredients jsonb, p_steps jsonb, p_category text,
  p_prep_time_minutes integer, p_cook_time_minutes integer,
  p_servings integer, p_image_url text,
  p_published boolean,
  p_original_published_at timestamptz,
  p_legacy_path text,
  p_batch_label text
)
returns public.recipes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group uuid;
  v_row public.recipes;
begin
  if p_original_published_at is null or p_original_published_at > now() then
    raise exception 'Fecha original inválida';
  end if;
  if p_legacy_path is null or p_legacy_path not like '/%' then
    raise exception 'legacy_path inválido';
  end if;
  if coalesce(trim(p_batch_label), '') = '' then
    raise exception 'batch_label obligatorio';
  end if;
  if exists (select 1 from public.recipe_import_log where legacy_path = p_legacy_path) then
    raise exception 'Ya importada: %', p_legacy_path;
  end if;

  if p_source_recipe_id is null then
    v_group := gen_random_uuid();
  else
    select recipe_group_id into v_group from public.recipes where id = p_source_recipe_id;
    if v_group is null then
      raise exception 'La receta de origen no existe';
    end if;
  end if;

  perform set_config('app.historical_import', 'on', true);
  insert into public.recipes (
    recipe_group_id, language, slug, title, excerpt, ingredients, steps,
    category, prep_time_minutes, cook_time_minutes, servings, image_url,
    published, published_at
  ) values (
    v_group, p_language, p_slug, p_title, p_excerpt, p_ingredients, p_steps,
    p_category, p_prep_time_minutes, p_cook_time_minutes, p_servings, p_image_url,
    p_published, p_original_published_at
  ) returning * into v_row;
  perform set_config('app.historical_import', 'off', true);

  insert into public.recipe_import_log (recipe_id, legacy_path, original_published_at, batch_label)
  values (v_row.id, p_legacy_path, p_original_published_at, p_batch_label);

  return v_row;
end;
$$;

revoke execute on function public.import_historical_recipe(uuid, text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean, timestamptz, text, text) from public, anon, authenticated;
grant execute on function public.import_historical_recipe(uuid, text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean, timestamptz, text, text) to service_role;
