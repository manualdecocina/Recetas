-- HISTORIAL. No ejecutar sobre una base nueva: usar supabase/schema.sql.
-- Copia exacta de la migración aplicada el 23 sep en respuesta a la revisión de ChatGPT:
-- corrige la política de escritura (antes permitía a cualquier usuario autenticado) y
-- protege recipe_group_id en el origen, no solo por convención de la UI.

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- Sin políticas públicas a propósito: solo se gestiona desde el dashboard de Supabase
-- o con la service_role key. Para dar de alta al primer admin: crea tu cuenta con
-- Supabase Auth normalmente, luego inserta tu user_id aquí desde el SQL Editor del
-- dashboard (Table Editor → admins → insertar fila, o SQL Editor con tu propio uid).

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "authenticated write recipes" on public.recipes;

create policy "admin write recipes"
on public.recipes for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Único camino sancionado para crear un plato nuevo: genera su propio recipe_group_id
-- en el servidor. El panel de admin NUNCA debe hacer insert directo a la tabla.
create or replace function public.create_recipe(
  p_language text, p_slug text, p_title text, p_excerpt text,
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

  insert into public.recipes (
    recipe_group_id, language, slug, title, excerpt, ingredients, steps,
    category, prep_time_minutes, cook_time_minutes, servings, image_url,
    published, published_at
  ) values (
    gen_random_uuid(), p_language, p_slug, p_title, p_excerpt, p_ingredients, p_steps,
    p_category, p_prep_time_minutes, p_cook_time_minutes, p_servings, p_image_url,
    p_published, case when p_published then now() else null end
  ) returning * into v_row;

  return v_row;
end;
$$;

-- Único camino sancionado para agregar una traducción a una receta que YA existe:
-- exige un recipe_group_id real y rechaza duplicar el mismo idioma en el mismo grupo.
create or replace function public.create_recipe_translation(
  p_recipe_group_id uuid, p_language text, p_slug text, p_title text, p_excerpt text,
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

  if not exists (select 1 from public.recipes where recipe_group_id = p_recipe_group_id) then
    raise exception 'recipe_group_id % no existe — usa create_recipe para un plato nuevo', p_recipe_group_id;
  end if;

  if exists (
    select 1 from public.recipes
    where recipe_group_id = p_recipe_group_id and language = p_language
  ) then
    raise exception 'Ya existe una traducción en % para esta receta', p_language;
  end if;

  insert into public.recipes (
    recipe_group_id, language, slug, title, excerpt, ingredients, steps,
    category, prep_time_minutes, cook_time_minutes, servings, image_url,
    published, published_at
  ) values (
    p_recipe_group_id, p_language, p_slug, p_title, p_excerpt, p_ingredients, p_steps,
    p_category, p_prep_time_minutes, p_cook_time_minutes, p_servings, p_image_url,
    p_published, case when p_published then now() else null end
  ) returning * into v_row;

  return v_row;
end;
$$;
