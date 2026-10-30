-- Auditoría SEO 2026-10-29: URLs históricas que terminaban en soft 404.
--
-- 1) URLs antiguas cuya receta ya está reconstruida y publicada en otra ruta, pero que
--    respondían 302 hacia /es/recetas (Google lo trata como soft 404) o 404 directo.
--    Pasan a 301 hacia la URL canónica exacta de la receta (con su barra final si la tiene).
-- 2) Filas 302 "temporales" que ya no hacen nada: la receta está publicada en esa misma
--    URL y se sirve antes de consultar content_redirects. Se eliminan para que, si algún
--    día esa receta se despublica, no vuelva a aparecer un 302 al listado.
--
-- No toca: URLs de idiomas restauradas el 2026-10-21, ni contenido descartado.

begin;

-- 1. Redirecciones permanentes hacia la receta reconstruida -------------------------------
with fixes(source_path, target_path) as (values
  ('/vasitos-de-mousse-de-aguacate-y-cacao', '/es/receta/vasitos-de-mousse-de-aguacate-y-cacao'),
  ('/es/receta/hamburguesas-caseras', '/hamburguesas-caseras'),
  ('/es/receta/receta-clasica-de-galletas-toll-house-original-con-chispas-de-chocolate', '/receta-clasica-de-galletas-toll-house/'),
  ('/receta-pasta-bolognesa-original', '/carne-bolonesa-a-la-italiana/')
),
upd as (
  update public.content_redirects c
     set target_path = f.target_path, status_code = 301
    from fixes f
   where rtrim(c.source_path, '/') = f.source_path
  returning f.source_path
)
insert into public.content_redirects (source_path, target_path, status_code)
select f.source_path, f.target_path, 301
  from fixes f
 where f.source_path not in (select source_path from upd);

-- 2. Filas 302 sin efecto (la receta publicada en la misma URL tiene prioridad) ------------
delete from public.content_redirects c
 where c.status_code in (302, 307)
   and exists (
     select 1 from public.recipes r
      where r.published
        and rtrim(r.public_path, '/') = rtrim(c.source_path, '/')
   );

commit;
