# Colección: cenas fáciles y rápidas

Fecha: 4 de noviembre de 2026. Tema permanente para acompañar la colección de Navidad.

La selección aborda la decisión «qué hago de cenar hoy»: recetas con tiempos totales de 20 a 40 minutos, organizadas en tres bloques (20–30 minutos, 31–40 minutos y propuestas sin carne). No se prometen posiciones ni incrementos de clics.

## Selección y publicación

- Contenido: `src/lib/dinners-collection.ts`, con introducción original, tres secciones y cinco preguntas útiles, localizadas en es, en, de, fr, it, ja y pt.
- 20 grupos de recetas existentes, 140 versiones publicadas. Consulta de producción: siete idiomas por grupo, ingredientes y pasos presentes, ninguna foto de paso ausente, portada, nutrición y título/descripción SEO presentes. Tiempos totales iguales entre idiomas, entre 20 y 40 minutos.
- No se encontraron huecos entre las recetas elegidas: no se crearon recetas duplicadas ni borradores para rellenar la selección. No hubo escrituras en la base de datos.
- Portada original de la colección, creada mediante generación de imagen. Variantes WebP: 1440×960, 1200×900, 1024×1024 y 1280×720. Las recetas conservan sus propias fotos y su paso a paso.
- Registro al principio de `COLLECTIONS`: aparece en inicio, índice de colecciones, sitemap y enlaces de vuelta de sus recetas mediante las integraciones existentes. Navidad conserva su URL y contenido.
- Las tarjetas de colecciones incorporan una descripción del tema. Las páginas temáticas ofrecen enlaces directos a sus secciones.
- Canonical, hreflang, Open Graph e ItemList reutilizan la implementación de colecciones existente. El índice tiene una presentación que incluye temas cotidianos además de ocasiones especiales.

## Investigación y límites

Se revisaron el catálogo real y ejemplos públicos de resultados para cenas y freidora de aire. La elección de cenas aprovecha un catálogo más amplio y variado sin depender de temporada o de un electrodoméstico. Es una decisión editorial; no se dispone de volúmenes o dificultad verificados.

Semrush no permitió consultar datos por falta de unidades API. GSC Wizard rechazó la consulta porque la cuenta no tiene una suscripción activa. No se cambió Search Console, robots, indexación, DNS ni configuración de hosting.

Referencias de contexto (no se reutiliza texto ni recetas):

- https://www.nestlecocina.es/momentos/cenas
- https://www.cocinatis.com/como-cocinar/consejos-trucos/cenas-sencillas-y-rapidas.html
- https://www.recetasnestle.com.co/categorias/recetas-en-la-air-fryer

## Imagen: prompt de producción

Photorealistic editorial cover for quick easy weeknight dinners. Warm Colombian home kitchen, light natural wood table, beige linen, ceramic plates. Four dishes together: honey mustard chicken, chicken avocado salad with lettuce and cherry tomatoes, creamy mushroom spaghetti, and ground beef tacos. Central composition with room for 4:3, square and 16:9 crops. Shot at 45 degrees, soft lateral golden light, blurred kitchen, realistic home-cooked texture. No seasonal decorations, text, logos, people, hands, collage or divided panels.

## Validación

TypeScript, suite de lógica (incluidas colecciones y sitemap), pruebas de componentes de consentimiento e idiomas y compilación completa: correctas. CI `quality` de GitHub también terminó correctamente. La prueba de sitemap dejó de asumir una sola colección: verifica todas las rutas declaradas una vez por idioma.

La comprobación HTTP de producción está en `editorial/cenas-faciles-20261104-live-qa.json`: 27 comprobaciones correctas, sin errores. Cubre las siete páginas de la colección (20 recetas, tres secciones, cinco preguntas, canonical de producción, ocho hreflang e ItemList de 20 entradas), los siete índices, las siete portadas de inicio, sitemap, cuatro imágenes WebP y un enlace de vuelta desde una receta. Revisión visual: se conserva únicamente el menú de secciones que ya tenía la plantilla, evitando duplicarlo.
