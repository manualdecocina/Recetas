-- =============================================================================
-- Manual de Cocina — ESQUEMA FINAL (estado completo tras las 6 migraciones)
-- =============================================================================
-- Ejecutable de una sola vez sobre una base vacía. No depende de migraciones
-- posteriores para quedar seguro. Historial en supabase/migrations/.
-- Equivale a: 20260922234249 → create_recipe_body_and_trigger_grants (6 migraciones).
-- Verificado contra la BD real (políticas, funciones, índices, triggers, permisos).
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Tablas
-- -----------------------------------------------------------------------------

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  recipe_group_id uuid not null,
  language text not null check (language in ('es','de','ja','it','fr','en')),
  slug text not null,
  title text not null,
  excerpt text,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  category text,
  prep_time_minutes integer,
  cook_time_minutes integer,
  servings integer,
  image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recipes_language_slug_key unique (language, slug)
);

-- Un solo registro por idioma dentro de cada grupo de traducciones.
create unique index recipes_group_language_key on public.recipes (recipe_group_id, language);
create index recipes_group_idx on public.recipes (recipe_group_id);
create index recipes_published_feed_idx on public.recipes (language, published_at desc) where published = true;
create index recipes_category_idx on public.recipes (language, category) where published = true;

-- Administradores. Se gestiona solo desde el dashboard / SQL Editor.
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Funciones
-- -----------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- is_admin: SECURITY INVOKER. Solo puede leer la fila propia en admins (RLS).
create function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Guardia de integridad (no depende de la UI):
--   * recipe_group_id y language son inmutables tras crearse.
--   * published_at lo controla la BD: se fija en la primera publicación,
--     despublicar no lo borra, republicar conserva la fecha original,
--     cualquier valor enviado por el cliente se ignora.
create function public.recipes_guard()
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

-- Plato nuevo: el grupo lo genera la BD.
create function public.create_recipe(
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

  -- published_at no se envía: lo fija el trigger recipes_guard.
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

-- Traducción: recibe la receta ORIGEN; el grupo lo resuelve la función.
create function public.create_recipe_translation(
  p_source_recipe_id uuid, p_language text, p_slug text, p_title text, p_excerpt text,
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
  v_group uuid;
  v_row public.recipes;
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
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
    recipe_group_id, language, slug, title, excerpt, ingredients, steps,
    category, prep_time_minutes, cook_time_minutes, servings, image_url, published
  ) values (
    v_group, p_language, p_slug, p_title, p_excerpt, p_ingredients, p_steps,
    p_category, p_prep_time_minutes, p_cook_time_minutes, p_servings, p_image_url, p_published
  ) returning * into v_row;

  return v_row;
end;
$$;

-- Edición: no acepta grupo, idioma ni published_at.
create function public.update_recipe(
  p_id uuid, p_slug text, p_title text, p_excerpt text,
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

-- -----------------------------------------------------------------------------
-- Triggers (orden alfabético de ejecución: recipes_guard, luego recipes_set_updated_at)
-- -----------------------------------------------------------------------------

create trigger recipes_guard
before insert or update on public.recipes
for each row execute function public.recipes_guard();

create trigger recipes_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.recipes enable row level security;
alter table public.admins enable row level security;

-- Visitantes (anon y autenticados): solo recetas publicadas.
create policy "public read published recipes"
on public.recipes for select
using (published = true);

-- Admin: ve también borradores.
create policy "admin read all recipes"
on public.recipes for select
to authenticated
using (public.is_admin());

-- Admin: escribe (insert/update/delete). Un autenticado que no es admin no puede.
create policy "admin write recipes"
on public.recipes for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Cada usuario solo ve su propia fila de admins (necesario para is_admin como invoker).
-- Sin políticas de escritura: admins solo se modifica desde el dashboard.
create policy "user reads own admin row"
on public.admins for select
to authenticated
using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Permisos de ejecución (anónimos no pueden llamar a las funciones de escritura)
-- -----------------------------------------------------------------------------

revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.create_recipe(text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) from public, anon;
revoke execute on function public.create_recipe_translation(uuid, text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) from public, anon;
revoke execute on function public.update_recipe(uuid, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) from public, anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.create_recipe(text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) to authenticated;
grant execute on function public.create_recipe_translation(uuid, text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) to authenticated;
grant execute on function public.update_recipe(uuid, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) to authenticated;

-- Funciones de trigger: nadie necesita EXECUTE directo.
revoke execute on function public.recipes_guard() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
