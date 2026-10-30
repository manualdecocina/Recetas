-- Las recetas se ordenan por ready_at en el listado y en "Últimas recetas".
-- 1) Mini quiches: publicadas sin ready_at, quedaban al final del listado.
-- 2) El botón Publicar del panel ahora llena ready_at si está vacío.
begin;

update public.recipes set ready_at = published_at
 where recipe_group_id = '9f31d294-05e2-418c-8801-09db0f42907f' and ready_at is null;

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

  update public.recipes
     set published = true, editorial_status = 'published', ready_at = coalesce(ready_at, now())
   where recipe_group_id = p_group and (not published or ready_at is null);

  select array_agg(rtrim(public_path, '/')) into paths from public.recipes where recipe_group_id = p_group;
  delete from public.content_redirects
   where rtrim(source_path, '/') = any(paths) and status_code in (302, 307);
  get diagnostics removed = row_count;

  return jsonb_build_object('published', 7, 'redirects_removed', removed);
end;
$$;

commit;
