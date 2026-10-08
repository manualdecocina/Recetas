# Continuidad lote03 — 2026-10-08

Rama vigente: `recetas/lote-03-20261008`. La rama02 contiene el puntero hacia esta rama; main conserva el cierre del lote02 (15 publicadas, catálogo124). Este lote03 tiene15 identidades/rutas reservadas y **0/15 publicadas**.

## Preparado1/15

`receta-de-sopa-de-mariscos-con-mejillones`: fuente única `editorial/receta-de-sopa-de-mariscos-con-mejillones-20261008.json` con records[7], categoría canónica, ingredientes agrupados,8 pasos congelados,3FAQ e información completa. Nutrición estimada trazable a11 fichas USDA SRLegacy; rendimiento de mejillón25% propuesto y sin prueba de cocina. No convertir nutrientes USDA ausentes en cero.

- Pasos ES SHA256: b0d2b5aa72f315e38b2666756e385885148a618df0e3f54d9a3971033cfb1a36
- Paquete SHA256: c1142dcc4cf1705cfa8bb54a0572bc8c5444ecc7d476fe5cc820445f22ff995d
- SQL SHA256: 90046d2ed0c8b723b0cd70d2b33e73a0176909f940384969b06bddf8baf62c8d
- Medios:8 originales PNG exactos y11 WebP; hashes/dimensiones y revisión visual en `editorial/receta-de-sopa-de-mariscos-con-mejillones-imagenes.json`.
- QA: `editorial/receta-de-sopa-de-mariscos-con-mejillones-qa-20261008.json`; PASS editorial/medios/localización, sin afirmar publicación.
- SQL: `scripts/publish-receta-de-sopa-de-mariscos-con-mejillones-20261008.sql`; preparado, NO ejecutado. Bloque debe integrarse en transacción atómica de las15, tras CI/merge y despliegue observado con hashes. Guard de lote exige15 listas/desplegadas; no publicar sopa sola.
- Todos los24 archivos del paquete concilian el git blob SHA de bytes locales con el blob remoto. Un WebP vacío de paso03 fue restaurado desde su mismo PNG y volvió a coincidir con el SHA256 esperado; no se regeneró imagen.

## Siguiente trabajo

`receta-empanadas-argentinas` (posición18), id `00cef267-34b5-4bf9-9192-95dd250a102a`, grupo `5179abcc-7963-45a9-9cd8-a8ed30a192ea`. Es la entidad CORE aprobada; el duplicado archivado `empanadas-argentinas` no se revive. Identidad y siete rutas ya validadas contra URL Master/GSC y recetas/content_pages en `editorial/lote03-identidades-rutas-20261008.json`.

Completar ES nuevo, nutrición USDA, congelar pasos y prompts antes de imágenes; siete idiomas con cantidades/fases idénticas. Luego avanzar restantes13 del mismo lote. No rehacer sopa ni otros archivos correctos. Lease del productor vigente en automation-progress.json: comprobar antes de mutar. Mantener checkpoints CAS con SHA esperado.

## Publicación pendiente

Cerrar las15; SQL105filas y rollback ante divergencia; PR y CI/typecheck/build; merge SHA esperado; observar todos los mediosHTTP200/hash; transacción DB7/7; revalidar mediante Actions sin leer secret;105páginas QA + auditoría global con total real. Catálogo esperado tras lote139 solo si la consulta actual confirma124 antes. Mantener noindex, sin DNS/migración. No afirmar lote terminado por prepared/published=true/CI.

Actualizado 2026-10-08T13:16:56.244Z.


## Checkpoint posterior — 2026-10-08T13:40:44.360Z

Empanadas ES cerrado en12fases y medios completos:12 originalesPNG+15WebP, revisión visual PASS y SHA256/dimensiones en editorial/receta-empanadas-argentinas-imagenes.json. Pasos ES SHA256 658f6db71e55437414fec6224e62be54a9403523e6bf022982827d91ce303426. No rehacer ES ni imágenes. Estado actual: **localización DE,EN,FR,IT,JA,PT-BR pendiente**, después SQL protegido y QA de paquete. Fuente única editorial/receta-empanadas-argentinas-20261008.json; sopa7/7 preparada intacta. Total de lote03:1/15 paquetes preparados completos,0/15publicados. La sección anterior que decía próximo ES queda superada por este checkpoint; consultar automation-progress.json de esta rama.

## Checkpoint 2026-10-08T14:02:21.147Z

Empanadas argentinas completas 7/7: fuente única editorial/receta-empanadas-argentinas-20261008.json, pasos ES SHA256 658f6db71e55437414fec6224e62be54a9403523e6bf022982827d91ce303426; 12 PNG originales y 15 WebP definitivos ya preservados y verificados. Ingredientes15, fases12, FAQ3; nutrición recalculada con13fichas USDA verificadas. DE/EN/FR/IT/PT conservan todas las cifras por fase; JA explicita conteos escritos en ES y repite el subtotal95 sin cambiar total215. SQL protegido SHA256 5d066104ab49dc2153ac259f95bea6d08677008f729eb83d678d0db2968329c6, NO ejecutado. DB actual124ES publicadas, grupo empanadas1ES sin publicar, sin colisiónUUID6; duplicado archivado retenido.

Sopa y empanadas: preparadas2/15; publicadas0/15 del lote03. Siguiente: receta-de-pizza-casera. No rehacer fuentes ni imágenes correctas. Completar13restantes y publicar15 en una transacción tras CI/merge/despliegue observado; caché/QA final pendientes. El lote02 permanece cerrado15publicadas/105páginas verificadas sin errores.

## Pizza ES congelado 2026-10-08T14:09:37.400Z

Fuente única editorial/receta-de-pizza-casera-20261008.json:10fases,12ingredientes,3FAQ,9fichas USDA con8nutrientes presentes. Categoría exacta Panes y masas.35prep+30horno+153esperas=218min propuestos, no prueba de cocina. Salsa reconciliada151,5g por pizza(150tomate+1sal+0,5orégano); dos pizzas30cm,4raciones. ESsteps SHA256 c46659df9c024fae0638a605b9837b21f122e283710a326370bdea86e49a37d3. Ficha congelada10originales portada+9fases y13WebP finales; imágenes aún pendientes. No publicar parcialmente.

## Pizza medios completos 2026-10-08T14:19:06.430Z

10originalesPNG y13WebP generados con ImageGen y verificados visualmente, todas las fases. Portada4:3 y16:9 mantienenpizza entera; cuadrada es recorte cercano con borde externo/plato recortado y cobertura/corte central visibles. Manifiesto con hashes y prompts actualizado. ES congelado intacto. PendienteDE/EN/FR/IT/JA/PT-BR, SQL protegido y QA; preparado2/15, publicado0/15.

### Pizza idiomas 2026-10-08T14:26:19.578Z

ES/DE/EN3/7 en la fuente única;10fases,12ingredientes,3FAQ; cifras por fase DE/EN coinciden exactamente con ES tras normalizar coma/punto decimal. Medios correctos ya remotos. PendientesFR/IT/JA/PT-BR ySQL/QA. No regenerar ni sobrescribir versiones correctas.

### Pizza5idiomas 2026-10-08T14:33:14.979Z

ES/DE/EN/FR/IT5/7, cifras por fase exactas en cuatro traducciones tras normalizar decimales. Todas las imágenes correctas remotas. PróximoJA yPT-BR, luegoSQL/QA. No rehacer los5idiomas ni medios.

## Checkpoint definitivo pizza7/7 2026-10-08T14:39:54.562Z

Fuente única editorial/receta-de-pizza-casera-20261008.json completa7/7, SHA256 a1dc97fc54fe9299b6c375c93e67a169a4488a00130dc99af177df1e9b685f88; ESsteps c46659df9c024fae0638a605b9837b21f122e283710a326370bdea86e49a37d3 intacto.10PNG/13WebP definitivos,12ingredientes,10fases,3FAQ/idioma y9fichas USDA verificadas. Cantidades/nutrición/medios compartidos; cifras de5traducciones exactas porfase, JA conteos escritos/tercio inferior revisados semánticamente. Supabase124ES publicadas; pizza1ESfalse y6UUID nuevos sincolisión. SQL noejecutado.

Corrección de protecciónSQL para las3recetas: comprobar identidad/fechas históricas también ANTES del retorno idempotente, y grupo/idiomas delpayload. Hashes anteriores deSQLquedan supersedidos; no se ha cambiado ningún contenido/medio de sopa o empanadas. HashSQLvigente sopa a066e3bd56da56cb251d5f2582a117aef702b561d13436088d028de73f3c3b7b; empanadas d59376bd9705ed2deff8f580ecd64ccae7bad563dc553dac4e5852aa198c22ee; pizza3450046fdbfc30134c51d65d2a03d978116b91f6b3ec349a267481b21d823638.

Lote03 preparado3/15, publicado0/15. Próximo lasana-de-calabacin-y-berenjena (posición20). No rehacer3paquetesni susmedios.12restantesantesdepublicar15completas trasCI/merge/despliegue observado; DB/cache/QA pendientes. Lote02permanece cerrado15publicadas.


## 2026-10-08T14:55:43.599Z — Lasaña de calabacín y berenjena: ES congelado

Cuarta entidad, id f7df8371-8273-4b15-ba6e-32390a185395, grupo9a28dffd-cdde-4e20-a746-88336cb0a016. Fuente única editorial/lasana-de-calabacin-y-berenjena-20261008.json; 10 pasos y12ingredientes originales, sin reutilizar WordPress. Hash de pasos8c69d9bf8d3c51a2e8691d844e022a34002ff8a4b1cd9e381fbde9466825b797. Brief congelado antes de imágenes; doce fichas USDA verificadas,8campos presentes. Ricotta170851=150kcal/100g. Nutrición por1/6estimada289.1kcal, no confirmada en cocina. Tiempos30prep+80cocción+30esperas=140min propuestos. Mezcla ricotta301g→2×150.5g, salsa cocinada dividida en4sin inventar peso evaporado, verduras en3. Categoría preservada Platos principales. Siete rutas aprobadas, incluida JA histórica /ja/ズッキーニとナスのラザニア. Pendiente:10 originales y13WebP, revisión visual,6localizaciones,SQL y QA. Primeras3listas; lote03publicado0/15. No regenerar contenido/medios anteriores.


## 2026-10-08T15:08:44.550Z — Lasaña: medios completos

10originalesPNG y13WebP definitivos; todas las fases y variantes revisadas visualmente. Portada1x1recorta lados de fuente de fondo y16x9borde exterior de plato; la porción principal y sus capas permanecen enteras. Hash ES congelado intacto. No regenerar medios. Siguiente: añadir DE,EN,FR,IT,JA,PT-BR a la misma fuente; QA ySQL protegido. Estado03:3recetas completas, cuarta ES+medios,0publicadas.
