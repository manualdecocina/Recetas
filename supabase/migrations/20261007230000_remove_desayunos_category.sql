-- Elimina la categoría "Desayunos y brunch" (decisión del propietario, 7 oct 2026).
-- Ya aplicada en Supabase; este archivo queda como registro y es idempotente.
do $mv$
declare n int;
begin
  with tgt(grp, slug) as (values
    ('21bd2bc4-ce0d-40f1-a400-e300d8dab577'::uuid,'salsas'),   -- Mermelada de higos
    ('864524e9-8bc9-4c58-b37c-cf661a9b6855','salsas'),         -- Mermelada de uva
    ('bf8c875f-0372-4866-9be5-088c07d19cbe','postres'),        -- Pancakes con fresas y arándanos
    ('48e3dbf3-5da5-4a03-b828-bfa37cb8aaee','entrantes'),      -- Tostadas de aguacate y huevo
    ('b67728b9-bce4-4c97-b366-528cd318140a','postres'),        -- Barras de cereal (sin publicar)
    ('b6b4397e-f51a-4c05-bf7a-fa285432829b','postres'),        -- Açaí bowl (sin publicar)
    ('5ec0b548-d9d8-4c42-ab6c-70c32958aad9','platos')),        -- Tortilla de espinaca (sin publicar)
  lab(slug, lang, label) as (values
    ('salsas','es','Salsas y aderezos'),('salsas','de','Saucen und Dressings'),('salsas','en','Sauces & dressings'),('salsas','fr','Sauces et vinaigrettes'),('salsas','it','Salse e condimenti'),('salsas','ja','ソース・ドレッシング'),('salsas','pt','Molhos e temperos'),
    ('postres','es','Postres'),('postres','de','Desserts'),('postres','en','Desserts'),('postres','fr','Desserts'),('postres','it','Dolci'),('postres','ja','デザート'),('postres','pt','Sobremesas'),
    ('entrantes','es','Entrantes y aperitivos'),('entrantes','de','Vorspeisen'),('entrantes','en','Starters & appetizers'),('entrantes','fr','Entrées et apéritifs'),('entrantes','it','Antipasti'),('entrantes','ja','前菜・おつまみ'),('entrantes','pt','Entradas e aperitivos'),
    ('platos','es','Platos principales'),('platos','de','Hauptgerichte'),('platos','en','Main dishes'),('platos','fr','Plats principaux'),('platos','it','Secondi piatti'),('platos','ja','主菜'),('platos','pt','Pratos principais'))
  update public.recipes r set category = lab.label
  from tgt join lab on lab.slug = tgt.slug
  where r.recipe_group_id = tgt.grp and lab.lang = r.language;
  get diagnostics n = row_count;
  if n <> 31 then raise exception 'Filas afectadas: % (esperadas 31)', n; end if;
end
$mv$;
