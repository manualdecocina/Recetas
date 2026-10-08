# Lote 02 — continuidad inmediata

El usuario pidió empezar sin esperar al siguiente horario. La ejecución manual produjo la primera receta completa: limón serrano, 7 idiomas, 11 archivos WebP y QA editorial aprobado. Está guardada en esta rama; todavía no está publicada.

Fuente única de contenido: `editorial/como-preparar-limon-serrano-la-receta-de-ensalada-mas-buscada-20261008.json` (7 registros). Ficha de fotos y prompts: archivo del mismo slug terminado en `-imagenes.json`. Evidencia de rutas y QA: archivos del mismo slug terminados en `-rutas-20261008.json` y `-qa-20261008.json`. Fotos definitivas: `public/recetas/como-preparar-limon-serrano-la-receta-de-ensalada-mas-buscada/`.

El siguiente relevo debe leer `editorial/automation-progress.json` desde `recetas/lote-02-20261008`, adquirir un lease mediante actualización CAS y continuar con **receta-jugo-arcoiris**, sin volver a producir limón serrano. Quedan 14 recetas por preparar en este lote de 15. La primera se incluye en la publicación atómica del lote cuando las 15 estén completas; el resultado publicado ahora es 0/15.

Se resolvió la antigua clasificación REVIEW de limón serrano con evidencia turística primaria de la Sierra de Francia; se conserva la URL histórica. No se alteró ninguna entidad archivada ni otra revisión. Se conservan cinco rutas históricas ES/DE/EN/FR/IT de la matriz GSC; JA/PT son nuevas propuestas sin colisión en recipes, content_pages ni content_redirects al comprobarlas el 2026-10-08. Repetir solo la comprobación transaccional de colisiones al publicar.

Las cantidades, tiempos y rendimiento son propuestas originales; no se afirmó una prueba de cocina. La nutrición se calculó con USDA SR Legacy y usa aproximaciones explícitas para los embutidos. Los registros y fotos ya contienen las siete localizaciones; no regenerar fotos aceptadas ni rehacer investigaciones cerradas.

Continuar según `docs/FLUJO-RECETAS.md` y las instrucciones completas de la automatización. Desplegar mediante GitHub/main → Hostinger automático, verificar activos, ejecutar SQL transaccional, revalidar en Actions con el secreto existente y hacer QA del lote. Noindex sigue activo. No migrar producción.
