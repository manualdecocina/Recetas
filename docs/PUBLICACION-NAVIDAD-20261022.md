# Cinco recetas navideñas — publicación del 23 de octubre de 2026

Se publicaron las cinco recetas y sus siete idiomas (35 páginas) mediante el RPC editorial existente, sin crear grupos nuevos ni modificar el esquema. Todas las páginas devolvieron HTTP 200 y pasaron la revisión de contenido, ocho pasos, fotos, FAQ, nutrición, Recipe JSON-LD, canonical y hreflang recíproco.

Las 60 imágenes WebP públicas coinciden con los SHA256 de los manifiestos. Las cinco portadas pasan también por el optimizador de imágenes del sitio con HTTP 200. Los WebP permanecen en Git. Los cinco ZIP de entrega incluyen los 40 originales, los WebP y los textos finales en siete idiomas.

El despliegue de Hostinger no incorporó los nuevos archivos estáticos durante la sesión. Para completar la publicación se utilizó el bucket público existente `recetas` del mismo proyecto Supabase, ya admitido por la aplicación. Un importador autenticado cargó únicamente las rutas y hashes permitidos desde el commit `adff213e2e3ed351f6f2d179f826cfab1aeaaf7a`; después quedó sellado con HTTP 410 y JWT habilitado. No hay credenciales ni importador activo en el repositorio.

El sitemap incluye las 35 páginas, y tanto `/es/recetas` como la portada `/es` incluyen las cinco recetas en la auditoría independiente de producción (GitHub Actions 39956155623, aprobada). La caché CDN local conservó brevemente una respuesta anterior; el informe local preserva esa observación y el informe de CI demuestra las superficies actualizadas. La ejecución de calidad 39956155613 terminó correctamente: typecheck, tests de lógica, pruebas de componentes y build.

Referencias: PR #180 (contenido y medios), PR #181 (publicación y rutas públicas de medios), `editorial/navidad-20261022-production-qa.json` (evidencia HTTP local) y `editorial/navidad-20261022-ci-qa.json` (auditoría independiente aprobada).
