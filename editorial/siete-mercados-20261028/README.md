# Siete recetas nuevas — publicación del 28 de octubre de 2026

Se publicaron siete grupos nuevos, cada uno traducido íntegramente a español, inglés, alemán, francés, italiano, japonés y portugués de Brasil. Son 49 páginas nuevas; el catálogo pasa de 212 a 219 recetas publicadas por idioma.

| Mercado de origen | Receta | Ruta en español |
|---|---|---|
| España | Castañas en freidora de aire | /castanas-freidora-aire |
| Estados Unidos | Marry Me Chickpeas | /garbanzos-cremosos-tomates-secos |
| Alemania | Zwiebelkuchen | /zwiebelkuchen-tarta-cebolla |
| Francia | Ensalada de lentejas y zanahoria | /ensalada-lentejas-zanahoria-mostaza |
| Italia | Chocolate caliente espeso | /chocolate-caliente-italiano-espeso |
| Japón | Daigaku imo | /daigaku-imo-boniato-caramelizado |
| Brasil | Farofa de plátano maduro | /farofa-platano-maduro |

La selección usa relevancia culinaria y estacional cualitativa documentada en las fuentes de cada formulación. GSC Wizard devolvió `payment_required` y Google Trends HTTP 429. No se han verificado volúmenes, dificultad, tendencias cuantitativas ni ingresos previstos. No se garantiza posicionamiento, aprobación publicitaria ni monetización.

## Contenido e imágenes

Cada receta tiene ocho pasos y tres preguntas frecuentes, cantidades y tiempos coherentes en las siete traducciones, dos enlaces relacionados por idioma y categoría existente de la taxonomía. Los ingredientes conservan peso comestible y referencia nutricional. No se afirma una prueba física en cocina.

Se generaron 56 imágenes originales con IA, una por paso, conservadas sin modificación en la salida de generación y copiadas al directorio local `originales`. Los manifiestos documentan su SHA-256 y los 84 WebP derivados: ocho pasos, portada y variantes 1:1, 4:3 y 16:9 por receta. Los WebP se publicaron en el bucket existente `recetas` sin sobreescribir objetos. La función temporal de subida fue sellada en su versión 2, con autenticación JWT y respuesta 410; la credencial local se eliminó.

## Nutrición e ingredientes de la aplicación

Los valores son estimaciones recalculadas por peso y porción a partir de USDA FoodData Central SR Legacy y TBCA BRC0088B para la harina de mandioca tostada. Se identifican las referencias genéricas utilizadas como aproximación. No se muestran nutrientes sin datos completos. La fórmula, entradas, fuentes y supuestos están en cada bundle JSON.

Las 56 líneas de ingredientes de las siete recetas fuente quedaron vinculadas a ingredientes canónicos, sin pendientes. Se revisaron 14 ingredientes nuevos para búsqueda, sin habilitar nuevas páginas indexables. Las transacciones protegieron los enlaces canónicos existentes. El ingrediente de papa conserva su ID, slug `papas` y nombre **Papa**; boniato permanece como ingrediente distinto.

## Publicación y comprobaciones

`groups.json` conserva los siete identificadores creados mediante `create_recipe` y `create_recipe_translation`. Los SQL de staging y publicación abortan ante colisiones o cambios del borrador. `publication-result.json` acredita las 49 publicaciones.

La auditoría pública verifica HTTP 200, canonical propio, siete hreflang recíprocos, idioma HTML, H1, ocho pasos e imágenes visibles, ingredientes y FAQ visibles, Recipe JSON-LD, tiempos y calorías, Open Graph, enlaces relacionados y ausencia de noindex. Verifica también los SHA-256 de 84 imágenes, las 49 URLs en el sitemap y enlaces HTML reales desde 14 superficies (portada y catálogo en cada idioma).

Resultado después de invalidar la caché protegida: **49/49 páginas, 84/84 imágenes y 14/14 superficies correctas**, sin URLs ausentes del sitemap ni enlaces relacionados fallidos. Ejecución: https://github.com/manualdecocina/Recetas/actions/runs/40783531057. La primera comprobación anterior al refresco detectó el sitemap antiguo; se conserva en `production-qa-before-cache-refresh.json`. El resultado completo posterior está en `production-qa-ci.json`, con una comprobación adicional en `sitemap-after-refresh.json`.
