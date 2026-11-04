# Herramientas de cocina

Implementación del 3 de noviembre de 2026. Se reutilizan las casillas, identidades de despensa, ficha pública, componentes de botones, traducciones y modo cocina existentes.

## Raciones

El estado compartido de la ficha recalcula ingredientes, medidas explícitas de los pasos (incluidas cantidades parciales) y consultas del modo cocina desde los valores originales. El selector conserva la elección por receta en el navegador. Restablecer recupera la receta original. Los tiempos, temperaturas, porcentajes, tamaños de molde y temporizadores no se multiplican. Se conservan las cantidades «al gusto». No se modifican los registros editoriales ni el JSON-LD de la receta original.

## Compra y despensa

La lista se abre desde la bolsa del encabezado, el pie, la receta y «¿Qué puedo cocinar?», en `/<idioma>/lista-de-compra`. Permite añadir todos los ingredientes o solo los faltantes. Las posiciones y cantidades provienen del contenido real localizado; los faltantes usan las mismas identidades que la despensa. Añadir de nuevo un plato actualiza su contribución, incluso desde otra traducción del mismo grupo.

La agregación usa identidades de ingredientes y unidades compatibles. Convierte kg/g/mg y l/dl/cl/ml, pero no mezcla volumen con peso ni presupone equivalencias de tazas y cucharas entre países. Los rangos y textos libres no se suman como números inventados. Marcar una compra actualiza la despensa existente. Se puede quitar una receta, vaciar la lista y copiar o compartir los pendientes mediante las funciones nativas del navegador. No hay cuenta obligatoria ni almacenamiento de la compra en el servidor. Si el navegador bloquea el guardado, se avisa y se conserva la lista en memoria durante la navegación de esa visita; si bloquea el portapapeles, se ofrece texto seleccionable.

## Modo cocina

Recuerda el último paso por receta. Permite consultar las cantidades ajustadas sin salir. Los temporizadores usan `timer_seconds` editorial o una única duración inequívoca; ante rangos o varias duraciones se permite configurar uno manual, sin inventar una recomendación. Persisten plazos absolutos para mantener la cuenta al cambiar de paso, cerrar el modo o recargar. No se prometen avisos con la página cerrada: al volver se muestra el vencimiento. El bloqueo de pantalla se solicita solo con el modo abierto, se recupera al regresar a una pestaña visible y se libera al salir. Su rechazo no bloquea la receta. Se conservan Escape, gestión de foco y navegación por teclado.

## Relacionadas

La clasificación se calcula en el servidor y queda cacheada con la etiqueta pública de recetas. Combina ingredientes (con menor peso para los frecuentes), técnicas, proximidad de tiempo y categoría/cocina. Usa la versión española como referencia editorial común y devuelve tarjetas publicadas en el idioma solicitado, sin recomendar el mismo grupo.

## Verificación

- `npm run typecheck`
- `npm run test:logic` (incluye `kitchen-tools.test.mts`)
- `npm run build`
- `CHROME_PATH=/ruta/al/chrome node tests/e2e/kitchen-tools.cjs` inicia y verifica la compilación local.
- `KITCHEN_BASE=https://manualdecocina.com CHROME_PATH=/ruta/al/chrome node tests/e2e/kitchen-tools.cjs` verifica producción. Solo modifica el almacenamiento del contexto aislado del navegador de prueba; copia, compartir y pantalla activa se simulan.

La prueba recorre móvil y escritorio, las siete traducciones, raciones, tiempos, compra de varias recetas, suma compatible, recarga, despensa, reanudación, temporizadores y funciones no disponibles. También hay pruebas unitarias del singular inglés «1 recipe found». La generación estática usa dos procesos para acotar la memoria al construir las más de 1.700 páginas; no altera el funcionamiento del servidor público.

El planificador semanal sigue pendiente de una propuesta posterior. No se cambian robots, directivas de indexación, DNS ni Search Console.
