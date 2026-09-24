-- Consolidate known duplicate editorial entities before production.
-- 1) Preserve historical public URLs on the structured Recipe records.
update public.recipes
set public_path = case slug
  when 'lechona-colombiana' then '/receta-de-lechona-colombiana'
  when 'colombian-lechona' then '/en/colombian-lechona-recipe'
  when 'empanada-peruana-de-pollo' then '/empanada-peruana-de-pollo'
  when 'bowl-de-carne-con-miel-picante-y-queso-cottage' then '/bowl-de-carne-con-miel-picante-y-queso-cottage'
  when 'receta-de-pan-de-platano-clasico' then '/receta-de-pan-de-platano-clasico'
  when 'receta-facil-de-pasta-al-pesto-casera' then '/receta-facil-de-pasta-al-pesto-casera'
  when 'receta-de-souffle-de-queso-esponjoso' then '/souffle-de-queso'
  else public_path
end
where slug in (
  'lechona-colombiana',
  'colombian-lechona',
  'empanada-peruana-de-pollo',
  'bowl-de-carne-con-miel-picante-y-queso-cottage',
  'receta-de-pan-de-platano-clasico',
  'receta-facil-de-pasta-al-pesto-casera',
  'receta-de-souffle-de-queso-esponjoso'
);

-- The alternate NEW_SEED Lechona row is a duplicate entity, not a translation.
update public.recipes
set published = false
where slug = 'lechona-colombiana-receta-tradicional-paso-a-paso'
  and language = 'es';

-- Keep the structured Recipe records; the parallel ContentPage copies must not publish.
update public.content_pages
set published = false
where (language, slug) in (
  ('es','receta-de-lechona-colombiana'),
  ('es','empanada-peruana-de-pollo'),
  ('es','bowl-de-carne-con-miel-picante-y-queso-cottage'),
  ('es','receta-de-pan-de-platano-clasico'),
  ('es','receta-facil-de-pasta-al-pesto-casera'),
  ('es','souffle-de-queso')
);

-- Product / affiliate pages are outside the new editorial catalogue.
update public.content_pages
set published = false
where slug in (
  'licuadoras-para-cocina',
  'mejor-batidora-de-vaso-en-2025',
  'ollas-multiuso',
  'productos-cocina-cafeteras',
  'productos-de-cocina-recomendados-por-el-chef',
  'utensilios-de-cocina',
  'refrijeradores-de-cocina',
  'baterias-de-cocina'
);

-- Do not keep redirects whose only effect is to send removed product pages
-- to non-equivalent product routes.
delete from public.content_redirects
where source_path in (
  '/licuadoras-para-cocina/',
  '/mejor-batidora-de-vaso-en-2025/',
  '/ollas-multiuso/',
  '/productos-cocina-cafeteras/',
  '/productos-de-cocina-recomendados-por-el-chef/',
  '/utensilios-de-cocina/',
  '/refrijeradores-de-cocina/',
  '/baterias-de-cocina/'
);
update public.content_pages
set published = false
where language='es' and slug='vasitos-de-mousse-de-aguacate-y-cacao';
