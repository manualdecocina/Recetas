# Claridad de acciones y orden de receta y lista de compra

## Problema

En móvil, los datos de la receta se repartían en cajas de anchuras distintas. «Modo cocina» compartía fila y protagonismo con guardar, compartir e imprimir, sin explicar qué abría. La lista de compra duplicaba el espacio vertical de las filas y no separaba visualmente los ingredientes, las acciones y las recetas añadidas.

## Cambios

- «Empezar a cocinar», con icono de reproducción, flecha y ayuda «Sigue la receta paso a paso», aparece antes de los pasos de preparación. Conserva el diálogo, el paso recordado, los temporizadores y los ingredientes ajustados. Etiqueta y ayuda localizadas en los siete idiomas.
- Tiempo total destacado, seguido por datos alineados en dos columnas en móvil y tres en pantallas mayores. Etiquetas encima de los valores. Los tiempos activos y la espera conservan sus valores y etiquetas.
- Guardar, compartir, imprimir y Pinterest pasan a ser acciones secundarias de menor peso visual.
- Lista de compra con filas compactas, casillas alineadas, cantidades destacadas, acciones con anchuras iguales y una sección separada para las recetas añadidas. «Vaciar lista» queda al final.
- Solo la presentación de cantidades SI cambia: 14000 ml → 14 L; 1200 g → 1,2 kg en español. La suma interna y las claves de comprado permanecen estables; copiar y compartir usan el mismo texto visible.
- Las reglas nuevas de disposición se aplican a pantalla. El acceso interactivo a cocinar se excluye de impresión.

## Verificación

- TypeScript sin errores y batería de lógica existente aprobada.
- Casos añadidos para unidades visibles, puntuación decimal y conservación de cantidades y claves.
- Prueba de navegador existente adaptada a la nueva etiqueta y unidades; espera la hidratación antes de comprobar las raciones restauradas.

- Navegador: 390 y 1366 px, raciones, lista compartida entre recetas, copiar/compartir, persistencia, despensa, recuperación del paso, temporizadores, pantalla activa y siete idiomas aprobados.
- Alternativas con almacenamiento y portapapeles bloqueados aprobadas.
- Revisión visual adicional a 320/390/1366 px, temas claro/oscuro, posición del botón y exclusión de impresión aprobada. Las fotos remotas se sustituyeron en las capturas locales de interfaz; no se modificaron imágenes de producción.

## Ajuste del bloque para añadir ingredientes

El bloque bajo los ingredientes también usa una columna fija: encabezado con icono de bolsa y una indicación breve, botón principal «Añadir faltantes» con icono +, acción secundaria «Añadir todos» y enlace «Ver mi lista» en su propia fila. Los textos están localizados en siete idiomas; las etiquetas accesibles completas se conservan. La variante de resultados de despensa mantiene solo la acción de faltantes y el enlace.

Verificación acotada con el componente real: anchuras 320/390/1366 px, siete idiomas, temas claro/oscuro, controles alineados sin desbordamiento, adición de faltantes/todos, variante de despensa, destino del enlace y exclusión de impresión. No se cambió la lógica de cantidades o almacenamiento. La ruta local usada para la revisión visual se eliminó antes de publicar.
