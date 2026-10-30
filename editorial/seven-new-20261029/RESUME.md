# Manual de Cocina — trabajo pendiente

Objetivo autorizado: 7 recetas NUEVAS, una por mercado, traducidas a ES/DE/EN/FR/IT/JA/PT, ocho fotos originales por receta, publicar y verificar catálogo. NO está terminado.

1. Aceitunas: grupo 1b8dcd61-c720-436a-8508-572ba0b733e4, publicada en siete idiomas. Fotos 12 WebP públicas verificadas por SHA256. Auditoría pública completa en olives-production-qa.json: páginas, Recipe, hreflang, catálogo, portada y sitemap.
2. Dip: grupo 808816b0-149e-4889-8dce-da0f9f69334a, publicado en siete idiomas. Corregida categoría francesa a Sauces et vinaigrettes. Siete fichas y fotos verificadas, catálogo español visible. Portada aún no actualizada en última consulta (HIT). Workflow 40987944131 / job 123843248140 invalidó caché pero falló comprobación de portada; se solicitó una repetición acotada. Todavía falta cerrar auditoría de descubrimiento en todos los idiomas.
3–7. Solo seleccionadas, NO creadas: calabaza-feta-miel; tatin-cebolla-cabra; schiacciata-tomates; gyozas-papel-arroz-pollo-tofu; palha italiana. Fuentes y slugs en plan.json. Completar una receta antes de pasar a la siguiente.

El bloqueo largo del dip quedó diagnosticado: categoría francesa no canónica. Los bloques DO grandes devolvían Invalid or expired requestState, ocultando el fallo; usando UPDATE ready y SELECT update_recipe separados salió la restricción concreta. No repetir los bloques DO colgados. Usar funciones normales, primero consultar estado.

Proyecto Supabase eqbdtctxbpepbeickhqi, conexión Manual de Cocina link_6ac25d59cb1c8191aa2a7c5cc7d8b4ac. GitHub manualdecocina/Recetas, conexión link_6ac25c856c9081918e518fe5c4ac2764. NO tocar BEXTA.

Último commit confirmado 0380afb3b8a12a655a1e28e5a3801a041617276f. Carpeta repo editorial/seven-new-20261029/. No repetir generación de fotos correctas: originales locales y generadas en Library. Uploader editorial-seven-20261029-upload quedó sellado (410, versión 4), JWT sigue activo. Para próximas recetas, desplegar manifiesto con rutas y hashes exactos, sin overwrite y con expiración; sellar al finalizar. No modificar RLS ni permisos.

Scripts locales: build_recipe.py valida estructura y metadatos; nutrition.py usa archivo USDA con hash verificado; prepare_images.py crea WebP 4:3 y recortes; recover_images.py recupera SOLO archivos vacíos y exige hash exacto del original y salida; upload_images.py reanuda y verifica bytes públicos. upload-key.json es una clave anon pública: NO incluir en commits ni ZIPs.

No afirmar pruebas físicas de cocina, revisión por nativos, viralidad garantizada ni SEO perfecto. Semrush sin unidades; no reintentar.
