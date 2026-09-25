-- Retire unpublished ContentPages already classified as OUT by the URL Master.
-- They were product/equipment pages and are not part of the recipe/content model.
delete from public.content_pages
where published = false
  and slug in (
    'baterias-de-cocina',
    'licuadoras-para-cocina',
    'mejor-batidora-de-vaso-en-2025',
    'ollas-multiuso',
    'productos-cocina-cafeteras',
    'productos-de-cocina-recomendados-por-el-chef',
    'refrijeradores-de-cocina',
    'utensilios-de-cocina'
  );
