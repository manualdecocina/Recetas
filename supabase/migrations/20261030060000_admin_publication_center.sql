-- Centro de publicación del panel /admin (fase 1).
-- 1) recipe_reviews: la aprobación del chef por plato (grupo de 7 idiomas).
-- 2) admin_publish_recipe_group / admin_unpublish_recipe_group: publicar o retirar
--    un plato completo con un clic, sin SQL manual. Solo administradores (is_admin()).
--    Publicar exige: aprobación del chef + 7 idiomas completos. Al publicar se borran
--    los 302/307 viejos que mandaban la URL del plato al listado (soft 404).

begin;

create table if not exists public.recipe_reviews (
  recipe_group_id uuid primary key,
  status text not null check (status in ('aprobada', 'devuelta')),
  comment text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz not null default now()
);

alter table public.recipe_reviews enable row level security;

drop policy if exists "admin read reviews" on public.recipe_reviews;
create policy "admin read reviews" on public.recipe_reviews
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "admin insert reviews" on public.recipe_reviews;
create policy "admin insert reviews" on public.recipe_reviews
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "admin update reviews" on public.recipe_reviews;
create policy "admin update reviews" on public.recipe_reviews
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

revoke all on public.recipe_reviews from anon;
grant select, insert, update on public.recipe_reviews to authenticated;

-- Problemas que impiden publicar un plato (lista vacía = listo). Misma regla que el panel.
create or replace function public.recipe_group_blockers(p_group uuid)
returns text[]
language sql
stable
set search_path = ''
as $$
  with langs(language) as (values ('es'), ('en'), ('de'), ('fr'), ('it'), ('ja'), ('pt')),
  rows as (select * from public.recipes where recipe_group_id = p_group)
  select coalesce(array_agg(problem order by problem), '{}') from (
    select 'falta el idioma ' || l.language as problem
      from langs l where not exists (select 1 from rows r where r.language = l.language)
    union all
    select r.language || ': ' || p.problem from rows r
    cross join lateral (values
      (case when coalesce(trim(r.title), '') = '' then 'sin título' end),
      (case when coalesce(trim(r.image_url), '') = '' then 'sin foto de portada' end),
      (case when jsonb_typeof(r.ingredients) is distinct from 'array' or jsonb_array_length(r.ingredients) = 0 then 'sin ingredientes' end),
      (case when jsonb_typeof(r.steps) is distinct from 'array' or jsonb_array_length(r.steps) = 0 then 'sin pasos' end),
      (case when r.nutrition is null or r.nutrition->>'calories' is null then 'sin nutrición' end),
      (case when coalesce(trim(r.seo->>'title'), '') = '' or coalesce(trim(r.seo->>'description'), '') = '' then 'sin título o descripción SEO' end)
    ) as p(problem)
    where p.problem is not null
  ) x;
$$;

create or replace function public.admin_publish_recipe_group(p_group uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  blockers text[];
  review_status text;
  paths text[];
  removed integer;
begin
  if not public.is_admin() then
    raise exception 'Solo un administrador puede publicar.' using errcode = '42501';
  end if;

  perform 1 from public.recipes where recipe_group_id = p_group for update;

  select status into review_status from public.recipe_reviews where recipe_group_id = p_group;
  if review_status is distinct from 'aprobada' then
    raise exception 'Falta la aprobación del chef.' using errcode = 'P0001';
  end if;

  blockers := public.recipe_group_blockers(p_group);
  if array_length(blockers, 1) > 0 then
    raise exception 'No se puede publicar: %', array_to_string(blockers, '; ') using errcode = 'P0001';
  end if;

  update public.recipes set published = true, editorial_status = 'published'
   where recipe_group_id = p_group and not published;

  select array_agg(rtrim(public_path, '/')) into paths from public.recipes where recipe_group_id = p_group;
  delete from public.content_redirects
   where rtrim(source_path, '/') = any(paths) and status_code in (302, 307);
  get diagnostics removed = row_count;

  return jsonb_build_object('published', 7, 'redirects_removed', removed);
end;
$$;

create or replace function public.admin_unpublish_recipe_group(p_group uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed integer;
begin
  if not public.is_admin() then
    raise exception 'Solo un administrador puede retirar recetas.' using errcode = '42501';
  end if;
  update public.recipes set published = false, editorial_status = 'draft'
   where recipe_group_id = p_group and published;
  get diagnostics changed = row_count;
  return jsonb_build_object('unpublished', changed);
end;
$$;

revoke all on function public.recipe_group_blockers(uuid) from public, anon;
revoke all on function public.admin_publish_recipe_group(uuid) from public, anon;
revoke all on function public.admin_unpublish_recipe_group(uuid) from public, anon;
grant execute on function public.recipe_group_blockers(uuid) to authenticated;
grant execute on function public.admin_publish_recipe_group(uuid) to authenticated;
grant execute on function public.admin_unpublish_recipe_group(uuid) to authenticated;

-- Los platos que ya están publicados en sus 7 idiomas quedan aprobados: ya pasaron revisión.
insert into public.recipe_reviews (recipe_group_id, status, comment)
select recipe_group_id, 'aprobada', 'Publicada antes de existir la revisión en el panel'
  from public.recipes
 group by recipe_group_id
having bool_and(published) and count(*) = 7
on conflict (recipe_group_id) do nothing;

commit;
