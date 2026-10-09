# Reparación de asociaciones de ingredientes

Las 12 recetas publicadas que no aparecían en la herramienta tenían 81 entradas editoriales pendientes. El sincronizador compara nombres completos y alias exactos; 78 no coincidían con el catálogo y tres activaban la detección de expresiones ambiguas.

Se revisaron las 81 entradas y se incorporaron 79 alias exactos y 18 identidades canónicas necesarias. El plan y los nombres originales están en `editorial/pantry-ingredient-repair-20261009.json`; la transacción reproducible está en `scripts/repair-pantry-ingredients-20261009.sql`. Las identidades nuevas son buscables y no indexables. Las descripciones editoriales, cantidades, nutrición, traducciones y URL se conservan.

La banana para el açaí se distingue del plátano de cocinar. La crema de coco endulzada se distingue de la leche de coco. Colza y canola se resuelven como una sola identidad; el reparto de sal entre partes de una receta no representa ingredientes distintos. Las galletas María o digestive se asocian a la categoría específica de galletas dulces sencillas. Los calificativos originales siguen en la receta.

El control de publicación comprueba, al finalizar la transacción, que una receta fuente ES publicada tenga al menos una asociación canónica buscable. También rechaza borrar la última asociación. La comprobación diferida permite reconstruir las relaciones y respeta D-087: las expresiones aún pendientes pueden coexistir con asociaciones válidas. La herramienta mantiene su protección frente a coincidencias incompletas.

La herramienta presenta una sola exigencia por ingrediente aunque aparezca en varias partes. La cobertura se calcula por posiciones editoriales para no confundir repeticiones con pendientes. Los recuentos de la página de ingredientes cuentan recetas distintas.

Verificación de base de datos: 12/12 recetas, 81/81 posiciones asociadas, cero pendientes en estas recetas y cero recetas ES publicadas sin asociaciones. El hash del catálogo completo de recetas antes y después fue `a056d55e06012af8d3a26915badaca19`, confirmando que ninguna fila editorial cambió. Las pruebas de publicación, edición sin asociaciones y borrado de la última relación se rechazaron; la reconstrucción y una receta con ingrediente conocido más un pendiente se aceptaron. Todas las mutaciones de prueba se revirtieron.
