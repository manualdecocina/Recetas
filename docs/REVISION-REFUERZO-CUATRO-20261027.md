# Revisión del refuerzo editorial

La segunda revisión encontró tres problemas de contenido y uno de alcance de verificación.

1. La reescritura de las notas de bondiola había eliminado el bloque de sustituciones. Se recuperó su texto original en siete idiomas.
2. La definición nutricional de Stroganoff decía «un crepe, aproximadamente 300 g», aunque el cálculo divide la formulación entre cuatro porciones. Se sustituyó únicamente serving_size por una cuarta parte de la receta, localizada. Los valores estimados no se recalcularon ni se presentan como medidos.
3. En bondiola permanecía un paso que sacaba la carne 30 minutos antes de un adobo refrigerado y otro que daba dos horas como duración fija. Se ordenó la preparación y se subordinó el paso al dorado a la terneza, manteniendo los tiempos como orientación.
4. El «28/28» anterior verificaba que las páginas reproducían el paquete esperado. No demostraba coherencia culinaria completa, mejoras de ranking ni ausencia de respuestas obsoletas en otras formas de URL. La revisión añade porción nutricional, rendimiento, fecha publicada, conservación de sustituciones y ambas formas de las 22 URL históricas: 50 respuestas para 28 recetas. Se conservan los errores de cada intento de caché en el informe.

Las 49 entradas netas de FAQ son siete preguntas localizadas en siete idiomas; no son 49 temas nuevos distintos. Se conservan 56 enlaces internos.

La organización de cuatro grupos con sus siete idiomas permanece estable. Las antiguas URL inglesa y alemana de bondiola que aparecen en Search Console ya redirigen con 308 a las traducciones del mismo grupo; no se encontró un segundo grupo de bondiola en esa revisión.

No se cambiaron ingredientes, cantidades, imágenes, valores nutricionales numéricos, URL ni estado de publicación. La corrección se limita a 14 registros: las siete versiones de bondiola y las siete de Stroganoff. Los archivos revision-before.json, revision-after.json y revision-patches.json separan esta corrección del primer refuerzo, que conserva su evidencia histórica.

La lectura posterior de los 28 registros coincidió con el resultado esperado, salvo las marcas updated_at. La verificación pública pasó 28/28 recetas y 50/50 formas de URL en [GitHub Actions 40607427604](https://github.com/manualdecocina/Recetas/actions/runs/40607427604). Su informe completo está en `editorial/refuerzo-cuatro-20261027/verified-revision-production-qa.json`, separado de la primera verificación. Estos resultados confirman publicación y las comprobaciones indicadas, no un incremento de clics o ingresos.

## Límite observado en caché

La comprobación desde el entorno local no coincidió con la ejecución de GitHub: tras sus reintentos aprobó 43/50 respuestas, equivalentes a 21/28 recetas con todas sus variantes correctas. No se debe ocultar esta discrepancia ni sustituirla por el resultado favorable de otro origen.

Un control específico de `/de/creep-stroganoff` recibió la porción anterior («1 gefüllter Crêpe (ca. 300 g)»), mientras que la misma página con un parámetro nuevo recibió la porción corregida («1 Portion (1/4 des Rezepts, ohne Beilagen)»). Fecha de publicación y rendimiento coincidieron en ambas. Esto demuestra al menos una respuesta obsoleta de caché en el trayecto de consulta; no identifica por sí solo qué capa la conserva. No se afirma consistencia instantánea para todos los visitantes o ubicaciones. La evidencia local se conserva en `editorial/refuerzo-cuatro-20261027/local-cache-observations.json`.

## Revisión posterior de las respuestas públicas

Tras la solicitud «Revisa», la auditoría local terminó con 28/28 recetas y 50/50 formas de URL correctas y ninguna ausente del sitemap. En el primer intento hubo tres respuestas anteriores; los reintentos limitados terminaron aprobando todas. El informe conserva cada intento en `editorial/refuerzo-cuatro-20261027/cache-recheck-20261027.json`.

Una consulta independiente, con tolerancia de caché cero y sin parámetros en las URL, también mostró la porción corregida en `/de/creep-stroganoff` y las sustituciones recuperadas en `/en/pork-bondiola-recipe`. Se comprobó además el contenido español de Stroganoff y bondiola. La discrepancia anterior no apareció en los resultados finales. Este cierre describe las respuestas observadas; no identifica de forma concluyente la capa responsable ni garantiza propagación instantánea en publicaciones futuras. No se cambiaron otra vez los datos editoriales durante esta comprobación.
