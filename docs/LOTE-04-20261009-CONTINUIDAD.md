# Lote 04 — continuidad — 2026-10-09

Reserva de 15 entidades culinarias, posiciones 33–47. Main base: 3c8af0eff7a6e6a5c7bfcaedfedd3590e67d3032.

Lote 03 cerrado en PR98: 15 grupos publicados en siete idiomas; 139 grupos publicados en el catálogo. Su contenido, medios y QA se preservan.

Identidad y 105 rutas comprobadas contra Recipes y content_pages: cero colisiones, solo una fila ES no publicada por grupo. Las rutas históricas inequívocas se conservan; las rutas nuevas no tienen colisiones. Matriz GSC consultada una vez para el lote, sin usar cuerpos o imágenes WordPress.

Pasta boloñesa (posición32) retenida para revisión de equivalencia: la reconstrucción publicada de carne boloñesa ya incluye tagliatelle y elaboración completa. No se altera la clasificación histórica ni se inventa redirect.

Estado: 0 preparadas, 0 publicadas. Primera receta: muffins de chocolate. Siguiente acción: ES nuevo con nutrición USDA verificada, congelación y ficha de imágenes antes de ImageGen; cerrar siete idiomas, medios y SQL de esa receta antes de la siguiente.

Publicar las 15 solo después de validación, CI verde, merge y despliegue observado de los medios. Después: SQL transaccional, caché desde Actions, QA 7/7 y auditoría global con recuento real. No ejecutar DNS ni quitar noindex.

Cola: 20 candidatas pendientes (15 reservadas +5 siguientes), 50 retenidas, 70 ES sin publicar. La revisión de enlaces de ingredientes del cierre técnico permanece explícita en automation-progress.json.


## Checkpoint 2026-10-09T01:23:00.444Z

Muffins de chocolate completos para publicación: fuente única editorial/receta-de-muffins-de-chocolate-20261009.json con records[7], ES congelado sin cambios; 8 originales y 11 WebP revisados visualmente y comprobados por hashes Git. Nutrición estimada con diez fichas USDA verificadas. SQL protegido preparado y NO ejecutado. Lote04: 1/15 preparada, 0 publicadas. Próxima receta: acai-bowl, etapa identidad→ES. Conservar todos los medios y localizaciones correctos.

SQL SHA256: 5f04d9f69843aef49eaf11ead0c5a0fc38f956e0ba892b39b3c35f9d25f5e393. Paquete SHA256: b8938e27b160a98111b832bf5e50f86e5df42efee7afdc19a92c0bb1da373e48. El cierre requiere las15, CI, merge, despliegue observado, publicación, caché y QA; no confundir preparación con publicación.


## Checkpoint 2026-10-09T01:41:24.375Z

Açaí bowl completo7/7 para publicación: fuente única editorial/acai-bowl-20261009.json,6pasos ES congelados SHA256 843d0e897be761f13668a469a65452cd0f658e26507000242339dae97e83d0a7;6originales y9WebP con hashes exactos y QA visual. Dos ediciones puntuales eliminaron cobertura prematura de las fases3y4; no se modificaron pasos ni se regeneraron los otros medios. Ficha USDA Branded2653289 obtenida directamente de API oficial y comprobada frente al fabricante; otras entradas extraídas del archivo SRLegacy verificado. SQL protegido NO ejecutado. Lote04:2/15preparadas,0publicadas. Próxima: receta-de-garbanzos-com-chorizo, conservar `com` del slug histórico.

SQLSHA256 eb942ef418fe078a51f43580a62ff97f127b61ade5b2aaa025c02cc032688edc; paqueteSHA256 2995d108e461214b627ba548ba5fc7723115f5994e0947b9df56351c6154b218. Conservar ambos paquetes y medios, seguir la primera etapa pendiente sin abrir otro lote.


## Checkpoint 2026-10-09T02:02:39.593Z

Garbanzos con chorizo completos7/7, fuente única editorial/receta-de-garbanzos-com-chorizo-20261009.json, ES congelado SHA256 045680f7380dfd7d95d48f500771c4041adead1d8fe6e64ccb9b19192a09728f. Siete originales y diez WebP con hashes exactos y revisión visual; temperatura se ilustra con sonda lateral sin lectura inventada. Nutrición estimada por cuatro raciones con diez fichas USDA verificadas: chorizo fresco de cerdo crudo, no curado. SQL protegido preparado y NO ejecutado. Lote04:3/15preparadas,0publicadas. Conservar muffins,açaí,garbanzos. Próxima alitas-bbq, distinta de alitas con miel/soja ya publicadas.

SQL SHA256 959228916fce5431082915727e3176725781e00794bb4e323755240206c96535; paquete SHA256 58623ad24fc16a6c07b1391503ebfc9ed676070fd933733e067eb1db15646fff. Mantener slug histórico `com`, siete rutas autorizadas y gate de lote completo.


## 2026-10-09T02:25:20.069Z — Alitas BBQ completas7/7; lote04 4/15 preparado,0/15publicado

Fuente única `editorial/alitas-bbq-20261009.json`:7idiomas,11ingredientes,7pasos,3FAQporidioma; cantidades y números verificados entre idiomas. ES congelado SHA256`c63a81107954b1ac4a1a2f2bbc0d1ce54f46fc9dd15d582d63c466f0f2886329`. Originales7 yWebP10 conservados con hashes; corregidos únicamente ajo fresco enpaso1 y eliminación de alitas prematuramente glaseadas enpaso4; portada y fases aprobadas visualmente. Nutrición USDA11fichas:700gcomestibles sobre1000galitas conhueso es hipótesis70% explícita pendiente depesaje, sin afirmar ensayo. SQL protegido `scripts/publish-alitas-bbq-20261009.sql` SHA256`0625038e47a90a2cf52d2005bf0797d60e8757f0974234f6a28a9a527213671e`, NOejecutado. Paquete SHA256`995ba6f6f6beb1b56550f48f9f742106ab71fc93a75eb1e0b31eebbf061edea3`. Siguiente:galletas-de-avena-y-chocolate. No abrir otro lote ni publicar parcial; quedan11recetas antesdePR/CI/merge/deployobservado/DB/cache/QA.


## 2026-10-09T02:49:39.073Z — Galletas avena y chocolate completas7/7; lote04 5/15preparado,0/15publicado

Fuente única `editorial/galletas-de-avena-y-chocolate-20261009.json`:7idiomas,10ingredientes,9pasos,3FAQ; ES SHA256`21dda2498f731939b1590b4741fcc30271cacfecb1343be3b595961756ccfcfc`, paquete`5577482ff76104c529e990728dc2a644581ec227fa657bf28c616fe966c6587e`. Nueve originales y doceWebP guardados con hashes exactos; correcciones ImageGenlimitadas a yemaextra y recuento10piezas en dosfases. Todos los números de pasos coinciden; ingredientes/nutrición/tiempos/medios iguales, ptBR y rutas aprobadas. Fórmula669gcrudos para20unidades,118mincon20atemperado+20activo+30frío+28horno+20enfriado, todospropuestos sinensayo. USDA10fichas verificadas. SQL protegido `scripts/publish-galletas-de-avena-y-chocolate-20261009.sql` SHA256`9a121d5f56d87b23a47566fd93031b36fb83ad51d311891815464c2bba708496`, NOejecutado. Siguiente:receta-de-donas-glaseadas. Faltan10recetas del lote y publicación+QA de las15; no publicar parcial.


## Checkpoint 2026-10-09T03:17:24.655Z

Donas glaseadas completadas y preparadas7/7,10originales13WebP,23activos con hash exacto y QA visual. ES congelado b4caacc7d75625430b021d7d83ae618c317dc84f76ca8328d908d274577acfb3. Paquete d2a0c10151cabc1140dc091366343958d28b7a08476c92b06c73977cded81c32; SQL protegido c3127cd6052acca0c8314b25a37762b82e5b1c74c2ac51edf9e212ef3383b702, no ejecutado. Nutrición:30gaceite retenido hipótesis NO medida, baño900g excluido. Lote04:6de15preparadas,0publicadas. Siguiente gazpacho-tradicional-espanol en identidad/ES; preservar todas las seis completas. Publicación+QA del lote completo pendiente.
