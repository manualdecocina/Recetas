-- Correcciones del catálogo de ingredientes (auditoría 2026-10-29).
-- 1) Slug con "ñ" (inválido en URL): champiñones -> champinones.
-- 2) Banano mal enlazado a "plátano" (en Colombia, plátano = plantain) en tres batidos.
-- 3) Variantes duplicadas unidas a su ingrediente base, para que "¿Qué puedo cocinar?"
--    no las trate como ingredientes distintos: agua fría -> agua, arroz blanco cocido -> arroz,
--    carne molida -> carne molida de res, papa blanca -> papa.
-- El texto visible de las recetas (recipes.ingredients) no cambia.

begin;

-- Respaldo (sin acceso público)
create table if not exists public.ingredient_fix_backup_20261030 as
select 'recipe_ingredients'::text as tabla, to_jsonb(ri) as fila
  from public.recipe_ingredients ri join public.ingredients i on i.id = ri.ingredient_id
 where i.slug in ('platano','agua-fria','arroz-blanco-cocido','carne-molida','papa-blanca')
union all
select 'ingredients', to_jsonb(i) from public.ingredients i
 where i.slug in ('champiñones','agua-fria','arroz-blanco-cocido','carne-molida','papa-blanca')
union all
select 'ingredient_aliases', to_jsonb(a) from public.ingredient_aliases a
 join public.ingredients i on i.id = a.ingredient_id where i.slug = 'platano';
alter table public.ingredient_fix_backup_20261030 enable row level security;
revoke all on public.ingredient_fix_backup_20261030 from anon, authenticated;

-- 1. Slug sin ñ
update public.ingredients set slug = 'champinones', updated_at = now() where slug = 'champiñones';

-- 2. Banano en batidos
update public.recipe_ingredients ri
   set ingredient_id = (select id from public.ingredients where slug = 'banana')
  from public.recipes r
 where r.id = ri.recipe_id
   and ri.ingredient_id = (select id from public.ingredients where slug = 'platano')
   and r.public_path in ('/batido-grimace-mcdonalds', '/receta-batido-de-frutas-con-crema', '/receta-saludable-batido-de-frutas-y-vegetales');

insert into public.ingredient_aliases (ingredient_id, alias, normalized_alias)
select b.id, a.alias, a.normalized_alias
  from public.ingredient_aliases a
  join public.ingredients p on p.id = a.ingredient_id and p.slug = 'platano'
  cross join public.ingredients b
 where b.slug = 'banana' and a.normalized_alias = 'plátano maduro (banano)'
on conflict (ingredient_id, normalized_alias) do nothing;
delete from public.ingredient_aliases a using public.ingredients p
 where p.id = a.ingredient_id and p.slug = 'platano' and a.normalized_alias = 'plátano maduro (banano)';

-- 3. Variantes -> ingrediente base
with pairs(variant, base) as (values
  ('agua-fria', 'agua'), ('arroz-blanco-cocido', 'arroz'),
  ('carne-molida', 'carne-molida-de-res'), ('papa-blanca', 'papas')
), ids as (
  select v.id as vid, v.name as vname, b.id as bid
    from pairs p join public.ingredients v on v.slug = p.variant join public.ingredients b on b.slug = p.base
), moved as (
  update public.recipe_ingredients ri set ingredient_id = ids.bid from ids where ri.ingredient_id = ids.vid returning 1
), aliased as (
  insert into public.ingredient_aliases (ingredient_id, alias, normalized_alias)
  select bid, vname, lower(vname) from ids
  on conflict (ingredient_id, normalized_alias) do nothing returning 1
)
update public.ingredients i
   set status = 'deprecated', searchable = false, indexable = false, updated_at = now()
  from ids where i.id = ids.vid;

-- Los alias de cada variante pasan a su base (los repetidos se quedan en la variante, sin efecto).
with pairs(variant, base) as (values
  ('agua-fria', 'agua'), ('arroz-blanco-cocido', 'arroz'),
  ('carne-molida', 'carne-molida-de-res'), ('papa-blanca', 'papas')
)
update public.ingredient_aliases a
   set ingredient_id = b.id
  from pairs p join public.ingredients v on v.slug = p.variant join public.ingredients b on b.slug = p.base
 where a.ingredient_id = v.id
   and not exists (select 1 from public.ingredient_aliases x where x.ingredient_id = b.id and x.normalized_alias = a.normalized_alias);

commit;
