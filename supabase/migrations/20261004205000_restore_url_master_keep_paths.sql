-- Manual de Cocina — restaurar public_path históricos aprobados por URL Master.
-- Fuente de verdad: docs/URL-MASTER-URL-ROWS-20260924.md + QA bloques 40/41.
-- No cambia esquema ni contenido editorial; solo devuelve a estas traducciones publicadas
-- la URL histórica que el estudio previo cerró como KEEP / REBUILD.

update public.recipes
set public_path = case
  when recipe_group_id='ea6708f7-74b0-43cd-a4b8-cc8b016552a9' and language='fr' then '/fr/casuela-aux-haricots-colombiens'
  when recipe_group_id='ea6708f7-74b0-43cd-a4b8-cc8b016552a9' and language='de' then '/de/kolumbianische-bohnen-casuela'
  when recipe_group_id='ea6708f7-74b0-43cd-a4b8-cc8b016552a9' and language='it' then '/it/casuela-colombiana-di-fagioli'
  when recipe_group_id='17fbbc8a-0332-4ce9-ad32-6aa2eccf36c6' and language='ja' then '/ja/メキシカンブリトーのレシピ/'
  when recipe_group_id='6ccc032c-74f2-456f-98a6-4890e3afeaec' and language='it' then '/it/teriyaki-ricetta-pollo'
  when recipe_group_id='2a3f91fd-4962-4cf0-940a-0b98e94c7ef0' and language='fr' then '/fr/milkshake-grimace-mcdonalds'
  when recipe_group_id='2a3f91fd-4962-4cf0-940a-0b98e94c7ef0' and language='de' then '/de/milchshake-grimaze-mcdonalds'
  else public_path
end,
updated_at = now()
where
 (recipe_group_id='ea6708f7-74b0-43cd-a4b8-cc8b016552a9' and language in ('fr','de','it'))
 or (recipe_group_id='17fbbc8a-0332-4ce9-ad32-6aa2eccf36c6' and language='ja')
 or (recipe_group_id='6ccc032c-74f2-456f-98a6-4890e3afeaec' and language='it')
 or (recipe_group_id='2a3f91fd-4962-4cf0-940a-0b98e94c7ef0' and language in ('fr','de'));
