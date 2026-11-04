# Revisión de las mejoras de Manual de Cocina — 4 de noviembre de 2026

## Alcance y resultado

Se revisaron las funciones modificadas en esta conversación y su convivencia con la impresión editorial: ficha de receta, raciones, acciones de compra, lista compartida, modo cocina, fotos, temporizadores y desplazamiento entre páginas. Se ejecutaron pruebas contra la web pública, pruebas de lógica y revisión visual de PDFs. No es una auditoría editorial de todas las recetas del catálogo ni una certificación de todos los navegadores.

## Comprobaciones realizadas

| Función | Comprobación | Resultado |
|---|---|---|
| Ficha y acciones | Tiempo total diferenciado; datos alineados; acciones secundarias; acceso a cocinar junto a preparación | PASS |
| Diseño adaptable | 320, 360, 390, 768 y 1366 px; temas claro y oscuro; controles de compra alineados | PASS |
| Raciones | Sabajón de 8 a 16; cerveza de 30 a 15; ingredientes, cantidades parciales y pasos ajustados; tiempos y temperaturas conservados | PASS |
| Compra | Añadir faltantes/todos; dos recetas sumadas; unidades compatibles; copiar y compartir; persistencia; quitar una receta | PASS |
| Fallos de capacidades | Almacenamiento bloqueado, copia manual y alternativa sin pantalla activa | PASS en las pruebas de comportamiento |
| Modo cocina | Ocho imágenes reales del sabajón; selección de foto al avanzar/retroceder; controles visibles; lectura desde el título del paso; finalizar y cerrar | PASS |
| Traducciones | Herramientas, raciones, lista y recetas reales en es/en/de/fr/it/ja/pt; foto y texto alternativo en los siete idiomas | PASS |
| Temporizadores | Manual plegado; anterior compacto; continuidad; vencimiento; reanudación tras recargar; restablecimiento | PASS |
| Navegación | Página 2 del catálogo, receta abierta desde la parte inferior, botón Atrás y salto a ingredientes con fragmento | PASS |
| Acciones existentes | Guardar y restaurar favorita; compartir URL; destino de Pinterest | PASS |
| Impresión | Siete versiones del tiramisú, guacamole, tamal, tiramisú ajustado y comando de impresión del navegador | PASS |

La prueba completa `tests/e2e/kitchen-tools.cjs` pasó contra producción a 390 y 1366 px con los siete idiomas y sin errores de JavaScript. Copiar, compartir y mantener pantalla activa se simulan en esa prueba para comprobar sus respuestas y alternativas sin enviar información ni depender de permisos del dispositivo. Otra revisión contra producción verificó imágenes reales, favoritos, desplazamiento, temas y tamaños de pantalla.

## Correcciones adicionales encontradas

1. **Unidades de cantidades expresadas como intervalo.** «1–2 kg» podía convertirse visualmente en «1–2 g» al no poderse sumar como un número. Ahora conserva su unidad original. Los intervalos de recetas distintas se mantienen separados, y tampoco se confunden rangos escritos en kg y en g. Las cantidades numéricas compatibles siguen sumándose y convirtiéndose para lectura, como 14 L o 1,2 kg.
2. **Referencias por unidad.** Una anotación como «huevos medianos, unos 50 g sin cáscara cada uno» podía pasar a «100 g cada uno» al duplicar las raciones. Se conserva esa referencia por pieza mientras cambia el número total de huevos. Se probaron formas equivalentes de los siete idiomas, también en notas y preparación del ingrediente.
3. **Duraciones en anotaciones.** Una expresión como «aprox. 20 minutos» en el nombre o preparación de un ingrediente podía multiplicarse. Se conservan duraciones, temperaturas, porcentajes y dimensiones en esas referencias; las cantidades totales siguen ajustándose.

4. **Número de piezas de la masa.** En la arepa, el título «Forma cuatro discos» y el reparto en cuatro bolas debían pasar a ocho al duplicar las raciones. Se ajustan los recuentos explícitos en instrucciones de dividir o formar piezas, conservando diámetros, grosor, fritura de una pieza a la vez y cantidades por pieza. Hay casos de prueba en los siete idiomas.

La normalización corregida de los intervalos migra las casillas de comprado guardadas con las claves anteriores. Hay pruebas que comprueban la conservación de esas marcas. Las claves de cantidades numéricas habituales no cambian.

## PDFs revisados

Se exportaron 11 PDFs y se renderizaron sus 12 páginas para inspección visual. El tamal largo ocupa dos páginas con flujo normal de notas y nutrición; no hay páginas vacías. Las demás muestras caben en una página. Se compararon ingredientes, instrucciones y notas completos con el texto extraído. Las portadas son las publicadas; la exportación japonesa se verificó con una fuente CJK disponible en el entorno de prueba.

La prueba añadió anuncios de forma artificial dentro y fuera de la receta, incluso en las notas y en contenedores desconocidos: no aparecen en los PDFs ni reservan espacio. También pasó la impresión desde el tema oscuro, la identificación de raciones ajustadas y la restauración de la vista tras imprimir.

## Calidad y rendimiento

TypeScript y la batería de lógica del repositorio pasaron. Se añadieron regresiones para unidades de intervalos, contribuciones separadas, migración de comprado, pesos por pieza y duraciones de anotaciones.

El último informe Lighthouse consultado para la versión previa a estas correcciones de cálculo registró 91/100 en inicio, 95/100 en receta y 96/100 en la herramienta, con CLS 0 en las tres. Son mediciones de laboratorio; el éxito del flujo de rendimiento no significa una puntuación 100 ni certifica métricas de campo.

Se conservaron las URLs, indexación, datos publicados, fotos y configuración de alojamiento. Las correcciones son de cálculo y presentación de las herramientas existentes.
