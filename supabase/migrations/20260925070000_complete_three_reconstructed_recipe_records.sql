-- Reconstruct three staged recipes from their existing structured culinary content.
-- Keep unpublished until the global production/editorial gate is closed.
UPDATE public.recipes
SET prep_time_minutes = 10, cook_time_minutes = 50, total_time_minutes = 60, servings = 4
WHERE slug = 'receta-de-papas-al-horno-y-los-beneficios-para-la-salud';

UPDATE public.recipes
SET prep_time_minutes = 10, cook_time_minutes = 12, total_time_minutes = 24, servings = 2
WHERE slug = 'salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes';

UPDATE public.recipes
SET prep_time_minutes = 15, cook_time_minutes = 43, total_time_minutes = 58, servings = 6
WHERE slug = 'sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico';

DELETE FROM public.content_redirects
WHERE source_path IN (
  '/es/receta/receta-de-papas-al-horno-y-los-beneficios-para-la-salud',
  '/es/receta/salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes',
  '/es/receta/sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico'
);
