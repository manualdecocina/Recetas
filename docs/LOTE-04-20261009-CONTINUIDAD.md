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


## 2026-10-09T03:36:40.777Z — Gazpacho preparado7/7; lote04 7/15preparado,0publicado

Fuente única `editorial/gazpacho-tradicional-espanol-20261009.json`,10ingredientes7pasos3FAQ; ES SHA256`4d59f5bbbb24aae3151c55c9b76b5b63c9c1960c2c78659a91fd22788a37a08b`, paquete`7a38f86cd07e3220dacf4f4730d858460a1334487d013311ef117195f0061f5d`. Siete originales y diezWebP conhashes exactos yQAvisual; corrección limitada alpan excesivo enfase3. DiezUSDA exactos, fórmula1418gcrudos inclguarnición/4, sin colado/pérdidasinventadas;145minpropuestos25prep+120frío,0cocción. Rutas históricasEN/FR/ITconservadas,FRanomalíaGSC no cambia/fr/. SQLguardado`scripts/publish-gazpacho-tradicional-espanol-20261009.sql` SHA256`472cda6bc61643983aef6905577422fa4fa0424ac7c015dd9777f084af055457`,NOejecutado. Siguiente:tarta defresa identidad→ES; no rehacerlas7completas,nootro loteantespublicación+QA15.


## 2026-10-09T04:18:08.874Z — Tarta de fresa preparada7/7; lote04 8/15preparado,0publicado

Fuenteúnica `editorial/receta-de-tarta-de-fresa-20261009.json`,13ingredientes10pasos3FAQ poridioma; ES SHA256`af3a2421071e6e6e84be6eec549d38b8ab62de4939d14765c7468e9950f77013`,paquete`58b89ae7de5687a8c37929f4d9fe82860cf5eaf059116bf441a05eef787ec589`. Diezoriginales13WebP23activosconhashesexactosyQAvisual. Correccionesúnicas:portadamásmargen yretirarcrema/fruta prematurasenfases1/3.13entradas10USDA,1259gcrudos/8porcionespropuestas;238mincompletoscontareasparalelas,50prep43cocción,base22cmhorneadacompleta,crema72C+burbujeo1minyfrío4C. RutasDE/FR/ITconservadas. SQL`scripts/publish-receta-de-tarta-de-fresa-20261009.sql`SHA256`f6e5834b0afc1fc3f7eb58b6535f52de39f4b2e631cc5a9c056de435b2a960fc`,NOejecutado. Siguiente:rollitos-de-anis identidad→ES; no rehacer8listas. Faltan7recetas ypublicación+QA delas15.


## 2026-10-09T04:50:19.472Z — Rollitosdeanís preparados7/7; lote04 9/15preparado,0publicado

Fuenteúnica `editorial/rollitos-de-anis-20261009.json`,7ingredientes8pasos3FAQ;ESSHA256`e9b6c4ffa4a4eb0a2a16d557173a81a43281bd0028ad80f676636648406243c7`,paquete`997fa65d79f0ad5a0256c7e552a759e70587fa0ab6ef3dbf25607db3f76b2544`.8originales11WebP19activosconhashesexactosyQAvisual. Ajustes ImageGenlimitadosaportada/margenydecoraciónanís, cantidadesvisualesanísfases1/2. 7fichasUSDAexactas,561gcrudos/18unidadespropuestas;105min25activo+10reposo+40horno(18+4+18)+30enfriado. AzúcarestotalesPENDIENTESporUSDA171316sin2000:omitido,nunca0;UIyRecipeomitenausentes. Sieterutasaprobadas DE/FRhistóricasconservadas,ptBR. SQL`scripts/publish-rollitos-de-anis-20261009.sql`SHA256`5dee0e95cef8dd73b159c393f5b555db51a222cd8850d44191691495bc304bb2`,NOejecutado. Siguiente:lasagnadecarneresidentidad→ES; preservar9listas. Faltan6recetasypublicación+QA delas15.


## 2026-10-09T05:25:23.839Z — Lasaña de carne de res preparada 7/7; lote 04: 10/15 preparadas, 0 publicadas

Fuente única `editorial/receta-de-lasagna-de-carne-de-res-20261009.json`:16 ingredientes,15 fichas USDA exactas,10 pasos y3FAQ por idioma. ES congelado SHA256 `1a295311e2638dc0dbb9879fed88a508ec666787b452cc453c551b5eaee60135`. Paquete SHA256 `84acd1f44ae0f971d1ef939d3e59c5ec637f9cf3560ba66f8bbd50ea65d848a2`. Diez originales y trece WebP,23 hashes y QA visual comprobados; portada principal completa en cuatro recortes, fuente secundaria parcialmente recortada. Un WebP local vacío fue reconstruido desde el PNG aceptado con el mismo hash exacto; no se regeneró imagen. Seis porciones y146min propuestos:35 preparación+96 cocción crítica+15reposo; bechamel10 yprecalentado15 dentro de últimos15del ragú. USDA169736 es referencia genérica de pasta seca enriquecida, no producto exacto; etiqueta de placas sin huevo compatible con horno directo180C45min requerida. No ensayo ni peso cocinado confirmados. Identidad/fechas/MD5 de ES y siete rutas revisados sin colisiones. SQL `scripts/publish-receta-de-lasagna-de-carne-de-res-20261009.sql` SHA256 `4286c7a91e26da771f8ea24bcbc8e3b6f95ccdc53b410e73a77295e60508186c`, NO ejecutado. Siguiente: tarta de queso cheesecake, identidad→ES. Preservar10listas; faltan5recetas y publicación+QA de las15. No abrir otro lote ni alterar noindex/DNS.


## Checkpoint — cheesecake complete7/7, eleven prepared

Cheesecake classic baked plain: source records7, 8 original PNG and11WebP, 19 hashes decoded/verified, eight USDA foods/eight nutrients. Steps hash 6dac3ca1d082e87cd7330cd175a7b33c3a0c639ab806b636eaf0192aa908a5c0. Proposed eight portions and505minutes including complete chilling; no kitchen trial claimed. Preserved seven approved paths; fresh DB single ES unpublished unchanged MD5, no route collisions. SQL protected by full15 deployed gate and NOT executed. Phase1 butter corrected only; two local empty WebP restored to identical recorded hashes from accepted originals. Next recipe ensalada-de-frijoles-con-salsa-romesco; eleven prepared, zero batch04 published. Preserve all completed work.


## Checkpoint 2026-10-09T06:22:53.772Z: 12/15 preparados

Ensalada de frijoles con romesco completa7/7,7PNG y10WebP;17hashes y cifras/estructura/medios verificados. SQL protegido no ejecutado. Azúcares omitidos en los7idiomas porque USDA175243 no informa nutrient2000. Portada completa en los4recortes. Fuente única editorial/ensalada-de-frijoles-con-salsa-romesco-20261009.json, SHA256 6799ef5436ea30ec6de7869cfdb12a9bc0c82112406c9a5f8bd23609d6cbb8a6; SQL SHA256 8df843e7151cb6f32daad5c2060c3d4c7cdfb539bd556c613d68699e8c067859. Identidad/fechas/MD5 y7rutas sin colisiones verificados en DB. Siguiente receta: galletas de jengibre. Ninguna del lote04 publicada; mantener gate del lote completo.


## Checkpoint 2026-10-09T06:40:53.713Z: 13/15 preparados

Galletas de jengibre y melaza completas7/7,8PNG y11WebP;19hashes y cifras/estructura/medios verificados. Nueve fichas USDA con8nutrientes informados. Fórmula inicial644g,24unidades y159min propuestos sin ensayo. SQL protegido no ejecutado. SHAfuente 72e542ca2072ea6e20f50e5c0704d06c2de68ef5149846297b2d87cbb9ffde93, SQL 6b37c4d1950bc0c0d0f9ae62cfe57787e449810bf674cd11480bed6e465c7d5f. Identidad/fechas/MD5 y7rutas preservados. Siguiente: ensalada griega, después trufas de chocolate. Cero recetas del lote04 publicadas; mantener gates del lote completo.
