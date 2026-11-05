# Derivados de la leche caseros

Encargo: colección de derivados cotidianos que se puedan preparar en casa y creación de las recetas ausentes. Selección de 12 preparaciones, sin completar la cifra de otras colecciones con platos ajenos al tema o quesos de maduración especializada.

## Contenido

Se conservan las fichas y URLs de queso blanco fresco y manjar blanco del Valle. Se crean diez grupos completos en español, inglés, alemán, francés, italiano, japonés y portugués: yogur natural, yogur griego, cuajada con cuajo, mozzarella, requesón de leche, queso crema rápido para untar, mantequilla, leche condensada, leche evaporada y arequipe. Total: 70 versiones nuevas y 84 versiones en la colección.

Las fuentes editoriales, cantidades, pasos, preguntas, estimación nutricional trazable y siete localizaciones de cada receta se guardan en `editorial/lacteos-20261105/<slug>.source.json` y su archivo generado `<slug>.json`. Cada grupo se crea por `create_recipe` y `create_recipe_translation`; se publica por `update_recipe` después de verificar sus imágenes públicas. No se reutiliza contenido de WordPress ni se inventan pruebas de cocina o valoraciones.

El queso blanco previo se moldea; el requesón queda en copos sin prensar; el queso crema se tritura para untar y no se promete como reemplazo universal en pastelería. La cuajada usa cuajo; la mozzarella necesita también ácido cítrico y una leche adecuada. Se distinguen suero de queso, suero ácido de yogur y líquido de batido de mantequilla. Esta última se prepara con crema de leche grasa. Las recetas incluyen refrigeración y los tiempos de espera además del trabajo. Nutrición de quesos, mantequilla y yogur escurrido usa aproximaciones del producto terminado, sin atribuirles todos los nutrientes de la leche descartando el suero.

## Imágenes y navegación

42 imágenes originales generadas de pasos, revisadas visualmente. La imagen final de cada receta se reutiliza como portada y se recorta en 1:1, 4:3 y 16:9. Hay 82 WebP de recetas y cuatro variantes de una portada propia de colección. Se sirven desde `public/recetas/` y `public/colecciones/derivados-de-la-leche/`, sin añadir archivos a Supabase Storage.

Las escenas de cada receta están en su fuente JSON. Prompt común: fotografía gastronómica editorial realista, escena única 4:3, cocina doméstica cálida, madera clara, lino beige y luz lateral natural; utensilios simples coherentes, sin texto, marcas, personas o collage. Solo el hilado de mozzarella muestra dos manos con guantes alimentarios resistentes al calor. Portada: queso blanco, mozzarella, mantequilla, yogur, leche condensada y arequipe agrupados alrededor de una botella de leche, con margen para los recortes.

La colección se organiza en tres secciones: yogures; quesos frescos; mantequilla y leches concentradas. Tiene introducción y cuatro preguntas útiles en siete idiomas. Navidad permanece primera y lácteos ocupa el segundo lugar del inicio; postres y cenas siguen accesibles en «Ver más colecciones». Se conserva el límite de dos tarjetas, las rutas, sitemap, canonical, hreflang y enlaces desde cada receta.

## Verificación

TypeScript, la suite de lógica y las pruebas de consentimiento e idiomas pasan. Los informes `*.assets-qa.json` comprueban bytes y SHA-256 públicos; `*.live-qa.json` comprueba las siete páginas por receta, ingredientes, fotos, nutrición, canonical y hreflang. La compilación y la verificación final de colección se registran al cerrar el despliegue.
