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
