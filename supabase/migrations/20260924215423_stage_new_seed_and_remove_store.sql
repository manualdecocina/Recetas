update public.recipes
set published = false
where source_url is null
  and published = true;

update public.content_pages
set published = false
where language='es'
  and slug='tienda'
  and published = true;