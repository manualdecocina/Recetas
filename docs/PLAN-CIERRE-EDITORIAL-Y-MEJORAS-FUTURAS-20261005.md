# Manual de Cocina — cierre editorial y mejoras posteriores

Fecha: 2026-10-05. Estado: plan operativo, sin autorización de publicación masiva ni cutover.

## Ahora: contenido y migración

1. **Conservar los 20 grupos publicados** y sus siete versiones actuales. El QA de su contenido, URL, canonical, hreflang, Recipe JSON-LD, imagen y enlaces es independiente del trabajo de nuevas recetas.
2. **Recetas pendientes:** partir de cada URL e idioma del sitemap antiguo y del URL Master aprobado. Usar Search Console para ordenar la cola. No usar textos ni traducciones de TranslatePress/WordPress, ni convertir automáticamente borradores heredados en publicaciones. El contenido de la nueva receta se investiga, se cocina/verifica editorialmente, se redacta desde cero para su intención de búsqueda, se localiza en los idiomas aplicables y se valida con el modelo y el gate de publicación existentes.
3. **Antes de publicar cada URL:** revisar que la entidad no duplique otra receta, la acción URL Master, la receta cocinable, ingredientes y pasos, nutrición estimada y trazable, medio autorizado y persistente, SEO localizado, canonical, hreflang solo entre versiones existentes, schema y enlace interno. No inventar datos para pasar el gate. Mantener REVIEW sin publicar hasta resolverlo.
4. **Antes del dominio principal:** cerrar un mapa URL por URL (200, 301 cuando MIGRATE/MERGE, 404/410 cuando OUT esté aprobado), contrastar sitemap y Search Console, comprobar que páginas heredadas de `content_pages` no sustituyen a recetas sin rehacer, y probar rutas prioritarias, robots/indexación, schema y reversión del despliegue. El preview permanece noindex hasta el cambio controlado. Un 403 se investiga como error de acceso; no se soluciona con texto vacío.
5. **Search Console:** revisar las restricciones o retiradas que el propietario aplicó a prefijos como `/en/` y `/no/` con su alcance, fecha y motivo. `/no/` no pertenece a los siete idiomas actuales; no asumir que se puede retirar la restricción ni redirigir ese prefijo en bloque. Ajustar solo después del mapa de URLs y del cutover verificado.

## Después: búsqueda con pocos ingredientes

Añadir un filtro visible **«Hasta 5 ingredientes»** en el listado/búsqueda y evaluar su uso también en «¿Qué puedo cocinar?». Debe contar el total de ingredientes reales de la receta, no los que faltan en la despensa. Definir antes si sal, agua, aceite y otros básicos cuentan; evitar que alternativas o expresiones compuestas inflen el número. Mostrar el total y mantener separado el indicador «ingredientes por conseguir». Probar casos con 5, 6 y expresiones ambiguas, así como la combinación con categoría y búsqueda. Es una mejora de descubrimiento, no un requisito del lanzamiento.

## Después: favoritos y recetario de usuarios

Primera fase: inicio de sesión simple y guardar favoritos, con elección de método de acceso, recuperación de cuenta, privacidad y políticas de datos. Separar claramente cuentas públicas del rol administrativo existente y restringir cada favorito al propietario mediante RLS.

Segunda fase: recetario privado de cada usuario, con creación/edición y exportación o borrado de sus propios datos. Una comunidad pública requeriría además moderación de recetas e imágenes, derechos de autor, reportes, abuso/spam, privacidad, reglas de publicación y control editorial/SEO antes de indexar contenido generado por usuarios. No mezclar recetas de usuarios con las editoriales aprobadas ni sus métricas/valoraciones.

## Orden

Primero cerrar recetas y el mapa técnico de migración; después el filtro; luego favoritos; finalmente valorar el recetario y la comunidad según uso real de la web.
