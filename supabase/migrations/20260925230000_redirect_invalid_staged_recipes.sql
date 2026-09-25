-- Manual de Cocina: retire two non-public staged recipe paths to homepage
insert into public.content_redirects (source_path, target_path, status_code)
values
  ('/es/receta/irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon', '/es', 308),
  ('/es/receta/la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto', '/es', 308)
on conflict (source_path) do update
set target_path = excluded.target_path,
    status_code = excluded.status_code;
