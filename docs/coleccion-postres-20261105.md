# Postres caseros y orden de colecciones

Encargo del 5 de noviembre de 2026: Navidad fija de primera, solo dos tarjetas de colección en inicio, novedades de segunda y acceso al resto mediante «Ver más colecciones». Cada selección conserva 20 recetas.

## Contenido

Nueva colección `postres-caseros`: 20 recetas en tres secciones, con introducción original, notas prácticas y cinco preguntas frecuentes en es, en, de, fr, it, ja y pt. Se distinguen ocho recetas sin horno, seis tortas/tarta/flan al horno y seis galletas o bocados (incluidos pancakes de sartén). No se presenta «sin horno» como equivalente a «sin cocción» o «rápido». Hay dificultad fácil y media; el texto lo explica. Los tiempos incluyen el reposo indicado en cada ficha.

La consulta acotada de producción encontró las 140 versiones publicadas de los 20 platos, todas con ingredientes, pasos, fotos de los pasos, portada, nutrición y título/descripción SEO. El resultado resumido y la selección están en `editorial/postres-coleccion-20261105/database-qa.json`. No hicieron falta recetas nuevas ni escrituras en la base de datos. Se reutilizan las fichas y las herramientas existentes.

## Orden y navegación

`collection-order.ts` mantiene Navidad primera por identidad, y ordena el resto por `publishedAt` descendente. Orden actual: Navidad, postres, cenas. El inicio carga únicamente las primeras dos colecciones y limita también el render a dos tarjetas. El índice `/es/colecciones` conserva las tres, con el mismo orden. Añadir una colección fechada más recientemente reemplazará la segunda tarjeta del inicio y dejará las anteriores accesibles en el índice.

Las dos tarjetas del inicio ocupan dos columnas en escritorio y una en móvil. El enlace «Ver más colecciones» está localizado en los siete idiomas. Se conservan las URLs de Navidad y cenas, así como sitemap, canonical, alternates y enlaces de vuelta desde las recetas.

## Investigación editorial

Se contrastó el tema con resultados públicos de postres caseros y sin horno. La diferenciación editorial es ayudar a elegir por técnica y tiempo de espera real, sin confundir preparación con momento de servicio. No se afirma volumen de búsqueda, dificultad de posicionamiento ni viralidad; no se repitieron consultas a Semrush que ya había rechazado el acceso por falta de unidades API.

Referencias de contexto (sin reutilizar textos, recetas ni imágenes):

- https://www.recetasnestlecam.com/categorias/postres-sin-horno
- https://www.pastello.com.co/recetas/categoria/sin-horno
- https://www.recetasderechupete.com/todas/postres-sin-horno/

## Portada original

Generada para esta colección. Una escena doméstica con torta de chocolate, tiramisú en vasos, arroz con leche y galletas con chispas. Se produjeron cuatro variantes WebP a partir de un mismo original: 1440×960, 1200×900, 1024×1024 y 1280×720. Los hashes y tamaños figuran en `media.json`. Los archivos publicados viven en `public/colecciones/postres-caseros/`; no dependen de un almacenamiento temporal ni añaden tráfico a Supabase Storage.

Prompt: «Use case: photorealistic-natural. Asset type: original editorial cover for Manual de Cocina collection Postres fáciles con y sin horno. Create a landscape 3:2 photograph, one natural real-life scene, not a collage. Warm welcoming Colombian home kitchen, light oak table and beige linen, soft lateral afternoon sunlight. An inviting selection of exactly four homemade desserts grouped closely in the middle with generous margins for square and 4:3 crops: a modest wedge of moist chocolate cake with a thin chocolate glaze on a ceramic plate; two small clear glasses of tiramisu with natural uneven cocoa dusting and visible soft cream and coffee-soaked biscuit layers; a small bowl of thick rice pudding with cinnamon; and three rustic chocolate chip cookies on a little plate. Realistic edible textures, imperfect homemade portions, harmonious ceramic tableware, a discreet spoon beside the rice pudding. Camera at 45 degrees, shallow depth of field, blurred pleasant kitchen background. The food should look appealing and achievable at home, not luxurious restaurant styling. No lettering, logos, watermarks, people, hands, Christmas decorations or split panels.»

## Verificación

TypeScript y suite completa de lógica correctos, incluidos el orden con una futura colección, el límite de dos y el patrón de 20 recetas por colección. Pruebas de consentimiento e idiomas correctas. Compilación completa de Next.js correcta (1.826 páginas estáticas). El resultado de producción se guarda en el mismo directorio editorial.
