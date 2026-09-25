-- MANUAL DE COCINA — RLS PREPARADO PARA APLICACIÓN
-- NO EJECUTAR AÚN: requiere validar el acceso real de la aplicación.
-- Supabase recomienda RLS + grants + policies y pruebas para tablas expuestas.

alter table public.ingredients enable row level security;
alter table public.ingredient_aliases enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_ingredient_pending enable row level security;
alter table public.cuisines enable row level security;
alter table public.recipe_cuisines enable row level security;

revoke all on table public.ingredients, public.ingredient_aliases, public.recipe_ingredients,
  public.recipe_ingredient_pending, public.cuisines, public.recipe_cuisines from anon, authenticated;

grant select on public.ingredients, public.ingredient_aliases, public.recipe_ingredients,
  public.cuisines, public.recipe_cuisines to anon, authenticated;
grant select, insert, update, delete on public.recipe_ingredient_pending to authenticated;

create policy "anon read indexable ingredients"
on public.ingredients for select to anon
using (searchable = true and status = 'canonical');

create policy "authenticated read indexable ingredients"
on public.ingredients for select to authenticated
using ((searchable = true and status = 'canonical') or is_admin());

create policy "anon read ingredient aliases"
on public.ingredient_aliases for select to anon
using (exists (select 1 from public.ingredients i where i.id = ingredient_id and i.indexable = true and i.status in ('canonical','review')));

create policy "authenticated read ingredient aliases"
on public.ingredient_aliases for select to authenticated
using (exists (select 1 from public.ingredients i where i.id = ingredient_id and i.indexable = true and i.status in ('canonical','review')) or is_admin());

create policy "anon read recipe ingredients"
on public.recipe_ingredients for select to anon
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.published = true));

create policy "authenticated read recipe ingredients"
on public.recipe_ingredients for select to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.published = true) or is_admin());

create policy "admin read pending ingredients"
on public.recipe_ingredient_pending for select to authenticated
using (is_admin());
create policy "admin insert pending ingredients"
on public.recipe_ingredient_pending for insert to authenticated
with check (is_admin());
create policy "admin update pending ingredients"
on public.recipe_ingredient_pending for update to authenticated
using (is_admin()) with check (is_admin());
create policy "admin delete pending ingredients"
on public.recipe_ingredient_pending for delete to authenticated
using (is_admin());

create policy "anon read searchable cuisines"
on public.cuisines for select to anon
using (indexable = true and status in ('canonical','review'));
create policy "authenticated read searchable cuisines"
on public.cuisines for select to authenticated
using ((indexable = true and status in ('canonical','review')) or is_admin());

create policy "anon read recipe cuisines"
on public.recipe_cuisines for select to anon
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.published = true));
create policy "authenticated read recipe cuisines"
on public.recipe_cuisines for select to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.published = true) or is_admin());

-- Antes de ejecutar: probar la aplicación con anon/authenticated y crear tests pgTAP.
