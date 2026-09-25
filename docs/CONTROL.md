# CONTROL CENTRAL — Manual de Cocina

**Fecha:** 2026-09-24  
**Fase:** Sprint 0 — RECUPERACIÓN Y CONTROL  
**Estado:** EN EJECUCIÓN

## Objetivo

Reconstruir Manual de Cocina como un proyecto editorial multilingüe nuevo, preservando los activos SEO históricos que tengan evidencia suficiente.

**Principio rector:** el contenido textual histórico no es un requisito de recuperación. Se volverá a crear y localizar desde cero. Lo que se recupera de la historia es evidencia SEO y estructural.

## Qué se conserva de la historia

- URL histórica.
- Idioma.
- Relación entre versiones lingüísticas cuando existe evidencia.
- Clics, impresiones, CTR y posición de Search Console.
- Intención de búsqueda y tipo de página.
- Relaciones de redirección existentes.
- Evidencia de medios reutilizables cuando proceda.
- Fuente histórica que permite justificar la relación.

## Qué NO se intenta recuperar

- El cuerpo traducido histórico como texto literal.
- Traducciones antiguas de TranslatePress.
- HTML antiguo como requisito editorial.
- Estructuras antiguas solo por ser antiguas.

## Modelo editorial objetivo

**Una entidad editorial → un grupo → una URL canónica por idioma.**

Cada versión lingüística se reconstruirá con contenido completo y localizado, no como traducción superficial. Cada versión puede tener un slug propio, incluyendo la conservación de URLs históricas cuando su valor SEO lo justifique.

Idiomas objetivo actuales: es, en, de, ja, it, fr.

## Regla crítica de URLs

No se impone /lang/receta/slug sobre todo el patrimonio histórico.

Una URL con evidencia SEO relevante entra primero al URL Master y después recibe una decisión explícita:

- KEEP — conservar y reconstruir en la misma URL.
- MIGRATE — cambiar de URL con 301 justificado.
- MERGE — consolidar porque existe duplicidad/intención realmente equivalente.
- NOINDEX — mantener accesible pero fuera del índice cuando exista una razón documentada.
- 404/410 — retirar cuando no exista una equivalencia válida.

No se hacen cambios masivos antes de cerrar el mapa.

## Arquitectura SEO obligatoria

Cada página indexable deberá tener, según corresponda:

- canonical coherente.
- hreflang bidireccional solo hacia versiones realmente publicadas.
- sitemap coherente.
- enlaces internos coherentes.
- schema que corresponda al tipo de página y que refleje datos visibles/reales.
- URL estable.
- ausencia de clones entre idiomas o rutas.
- respuesta HTTP correcta.

Google recomienda conectar explícitamente las versiones localizadas mediante hreflang; cada versión debe referenciarse a sí misma y a las demás versiones equivalentes. Las versiones plenamente traducidas no se consideran duplicados simplemente por estar en idiomas distintos. Ver documentación actual de Google Search Central.

## Separación de chats

### Control Central
Decisiones de producto, arquitectura, SEO, URL, i18n, prioridades y gates.

### Code/System
Next.js, TypeScript, routing, metadata, schema, sitemap, robots, i18n, APIs, Supabase y tests.

### Deploy
Preview, producción, variables de entorno, hosting, DNS, builds y verificaciones post-deploy.

### Web/QA
Pruebas visuales, responsive, navegación, enlaces, redirects, 404, metadata y schema sobre la web desplegada.

### SEO/Search Console
Search Console, indexación, consultas, páginas, rich results, sitemap, clusters y validación SEO.

### Supabase/Data
Modelo de datos, migraciones, RLS, imports, traducciones, redirects, media e integridad.

## Gate de Sprint 0

No se autoriza la construcción masiva del contenido ni el cierre de la arquitectura hasta tener:

1. URL Master completo.
2. Decisión por URL histórica relevante.
3. Arquitectura final aprobada.
4. Contrato i18n aprobado.
5. Contrato canonical/hreflang aprobado.
6. Contrato schema aprobado.
7. Sitemap/indexación definidos.
8. Riesgos de redirects documentados.

## Estado actual

- [x] Search Console auditado.
- [x] WXR auditado.
- [x] Inventario auditado.
- [x] Supabase actual auditado.
- [x] 25 URLs históricas de alto tráfico con fuente WP identificada.
- [x] Confirmado que recuperar cuerpos traducidos históricos NO es necesario para el nuevo proyecto.
- [ ] URL Master completo.
- [ ] Arquitectura definitiva.
- [ ] I18N definitivo.
- [ ] SEO Master definitivo.
- [ ] Implementación final.
- [ ] QA.
- [ ] Deploy.
- [ ] Verificación Search Console.

## Regla de cambio

Si cualquier chat de implementación descubre que una decisión técnica obliga a cambiar URLs, canonicals, grupos lingüísticos, redirects, indexación o modelo editorial, debe devolver la decisión a Control Central antes de modificar el contrato.


## Actualización de control — 2026-09-24

### Limpieza del catálogo

La auditoría completa del inventario confirmó **8 URLs de producto/equipamiento fuera del nuevo catálogo**. La primera auditoría había identificado 6; posteriormente se detectaron también:
- `/refrijeradores-de-cocina/`
- `/baterias-de-cocina/`

Esto corrige el conteo anterior y queda como 8 definitivo para este corte.

También quedan separadas:
- 2 URLs técnicas WPRM;
- 9 páginas institucionales/legales;
- 5 páginas de salud/nutrición para revisión;
- 2 posibles CollectionPage;
- 1 artículo editorial de veganismo;
- 61 URLs culinarias de baja señal como P4/CATALOG CANDIDATE.

### Supabase / procedencia

Se confirmó que las 28 recetas sin `source_url` tienen `published_at` del 23 de septiembre de 2026. Se consideran NEW_SEED, no evidencia histórica, salvo cuando otra fuente demuestra la URL histórica.

### Conflicto de routing

Existen 27 redirects P1 actualmente activos hacia rutas `/es/...`. Varios apuntan correctamente a registros existentes en Supabase, pero todavía no están aprobados como URLs definitivas porque el URL Master puede conservar la URL histórica.

### Bloqueadores antes de producción

1. Cerrar URL Master por entidad/idioma.
2. Resolver las 27 decisiones de redirect P1.
3. Resolver el routing de URLs históricas raíz si se mantienen.
4. Consolidar NEW_SEED duplicado con entidades históricas.
5. Solo entonces crear migraciones de datos/traducciones finales.

No se autoriza borrar, redirigir masivamente ni publicar traducciones en bloque antes de superar estos gates.


## Actualización de control — 2026-09-25 — continuidad automática de trabajo

### Cerrados en este ciclo

- [x] Control de paginación del catálogo: página 1 mantiene hreflang; páginas 2+ mantienen canonical propio y no se incluyen como URLs independientes del sitemap.
- [x] ItemList del catálogo: solo se emite cuando existen al menos 2 recetas visibles.
- [x] Recipe-card: tratado como artefacto técnico/histórico, no como entidad editorial.
- [x] Recipe-card: excluido explícitamente del sitemap.
- [x] Producto/afiliación: 8 URLs cerradas como OUT del catálogo.
- [x] Producto/afiliación: registros fuera de publicación y redirects históricos no equivalentes eliminados por la migración existente.
- [x] No se autorizan redirects hacia recetas genéricas para las URLs de producto/afiliación.
- [x] Evidencia Search Console de producto/afiliación incorporada al cierre.

### Estado operativo

El trabajo continúa por bloques sin requerir una confirmación entre cada bloque. Las decisiones ya cerradas no vuelven a abrirse salvo evidencia nueva.

Siguiente prioridad: cerrar decisiones de URLs históricas P1 y sus equivalencias reales antes de activar nuevos redirects; después continuar con la reconstrucción editorial de entidades que ya tienen content packs completos.


## Ruta de ejecución vigente — 2026-09-25

Esta sección es la referencia operativa para no desviarse del objetivo. Si una tarea técnica entra en conflicto con esta ruta, se detiene la ejecución de esa tarea y se vuelve a Control Central.

### Orden obligatorio

1. **URL Master** — cerrar decisiones URL-by-URL de las históricas P0/P1: KEEP / MIGRATE / MERGE / NOINDEX / 404-410.
2. **Routing histórico** — garantizar que cada URL KEEP pueda resolverse directamente como la entidad editorial correcta, con el contrato SEO completo.
3. **Redirects** — solo crear/ajustar 301 después de que la fila URL Master tenga destino definitivo; estado operativo actual conocido: 0 redirects.
4. **Modelo editorial** — consolidar Recipe/ContentPage y eliminar representaciones paralelas antes de publicar.
5. **Contenido** — reconstruir/localizar entidades ya aprobadas por el URL Master.
6. **Schema/SEO** — validar Recipe, BreadcrumbList, canonical, hreflang y sitemap contra contenido visible y URL final.
7. **QA/deploy** — probar rutas, metadata, schema, 404/redirects, sitemap y páginas desplegadas.
8. **Search Console** — verificar indexación y resultados después del despliegue.

### Guardas

- No crear traducciones masivas antes de cerrar URL Master.
- No publicar contenido staged incompleto.
- No convertir una tarea de schema o código en sustituto del cierre de URLs.
- No abrir de nuevo decisiones ya cerradas sin evidencia nueva.
- Los packs E002–E006 y E101–E105 pueden estar preparados editorialmente, pero su preparación **no autoriza** publicación ni altera el orden anterior.

### Corrección de rumbo

Durante este ciclo se hicieron ajustes de QA de schema y pruebas de contrato. Son controles auxiliares, no un cambio de prioridad. La prioridad vuelve ahora al cierre URL-by-URL P0/P1 antes de continuar con la reconstrucción masiva.


## Actualización de control — 2026-09-25 — Bloque 36 metadata staged

### Bloque 36 cerrado
Se procesó el siguiente bloque estable de 20 Recipes staged con metadata incompleta:

`albondigas-suecas`; `bowl-de-carne-con-miel-picante-y-queso-cottage`; `chili-con-carne-express`; `empanadas-argentinas`; `espaguetis-con-salsa-de-carne`; `hamburguesas-caseras`; `irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon`; `la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`; `lasana-de-sarten`; `pastel-de-carne`; `picadillo-de-carne-molida-rapido-y-facil`; `receta-clasica-de-galletas-toll-house-original-con-chispas-de-chocolate`; `receta-de-arroz-con-leche-un-postre-reconfortante`; `receta-de-pan-de-platano-clasico`; `receta-de-papas-al-horno-y-los-beneficios-para-la-salud`; `receta-de-souffle-de-queso-esponjoso`; `receta-facil-de-pasta-al-pesto-casera`; `salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes`; `sloppy-joes`; `solomillo-de-pavo-glaseado-con-cafe-y-chipotle-sobre-hummus-de-edamame`.

Los tiempos parciales previamente establecidos y respaldados se mantienen. No se rellenan prep/total/servings sin evidencia suficiente. No se publica ninguna de estas entidades.

### Incidente de ejecución
La consulta inicial del bloque se hizo sobre todas las Recipes con metadata incompleta en vez de limitarse a `published=false`. Se modificaron temporalmente 8 Recipes publicadas fuera del objetivo. El desvío se detectó y se revirtió inmediatamente; los 8 registros quedaron restaurados a sus valores previos. Sin cambio neto.

### Documentación
QA completo: `docs/QA-BLOQUE-METADATA-STAGED-20260925-36.md`.


## Actualización de control — 2026-09-25 — Bloque 37 metadata staged

### Cierre del conjunto de 24
Se procesaron las últimas 4 entidades staged del conjunto estable de metadata incompleta:
`sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico`; `sopa-saludable-para-enfermos-receta-nutritiva-y-facil-de-preparar`; `tacos-de-carne-molida`; `vasitos-de-mousse-de-aguacate-y-cacao`.

No existe evidencia nueva suficiente para completar prep/total/servings sin inferencia. Los cook times parciales ya respaldados se mantienen.

Documentación: `docs/QA-BLOQUE-METADATA-STAGED-20260925-37.md`.


## Actualización de control — 2026-09-25 — Bloque 40 URL Master

Se cerraron las primeras 20 filas URL-by-URL P0 en orden estable: 17 KEEP / REBUILD y 3 REVIEW. E001, E002, E003, E004, E006, E007, E008 y E009 quedan cerradas como KEEP / REBUILD para las URLs procesadas. E005 mantiene sus dos URLs en REVIEW y E010 mantiene en REVIEW la URL francesa procesada; la URL alemana de E010 queda para el siguiente bloque. No se crean redirects ni se publica contenido.

QA: docs/QA-BLOQUE-URLMASTER-20260925-40.md. Commit de matriz URL: e595d7384674f7c08f3d422010b696e653899fee.


## Actualización de control — 2026-09-25 — Bloque 41 URL Master

Se cerraron las filas 21–40 del URL Master P0/P1: 20 URLs, todas KEEP / REBUILD. E010 queda cerrado en sus dos URLs históricas. También quedan procesadas E011–E015 y las filas españolas E101–E106, E015 y las URLs adicionales hasta /receta-helado-casero/. No se crean redirects para KEEP y no se publica contenido.

QA: docs/QA-BLOQUE-URLMASTER-20260925-41.md. Commit de matriz URL: c0778ecf4038780cd514fe3fbad75ca5e16f01d1.


## Actualización de control — 2026-09-25 — Bloque 42 URL Master

Se procesaron las 11 filas restantes de la primera tanda P2 en un único bloque por quedar menos de 20. Diez quedan KEEP / REBUILD y /receta-ensalada-caprese/ permanece REVIEW / MODEL Recipe. No se crean redirects ni se publica contenido.

QA: docs/QA-BLOQUE-URLMASTER-20260925-42.md. Commit de matriz URL: 50995d8cb05de07a08c494a8fe5e3c10fe70c5c4.


## Actualización de control — 2026-09-25 — Bloque 43 URL Master P3

Se procesaron 20 URLs P3. Las 20 permanecen CATALOG CANDIDATE; esta clasificación no equivale a KEEP/MIGRATE/MERGE/NOINDEX/404-410. No se crean redirects, no se borran URLs y no se publica contenido.

QA: docs/QA-BLOQUE-URLMASTER-20260925-43.md.


## Actualización de control — 2026-09-25 — Bloque 44 URL Master P3/P4

Se procesaron las 19 URLs restantes del inventario P3/P4 en un único bloque: 1 CATALOG CANDIDATE, 10 OUT (8 catálogo + 2 técnicos) y 8 REVIEW. No se crean redirects, no se ejecutan borrados y no se publica contenido. Las clasificaciones OUT/REVIEW quedan documentadas como decisiones de control, no como ejecución destructiva.

QA: docs/QA-BLOQUE-URLMASTER-20260925-44.md. Commit de matriz URL: 7bcadec499f831450025cbedc40dded49beca72c.


## Actualización de control — 2026-09-25 — Bloque 45 NEW_SEED

Se revisaron los 10 casos de duplicidad NEW_SEED documentados. Se confirmó que lechona-colombiana tiene fuente histórica y no debe tratarse como NEW_SEED puro; empanada-peruana-de-pollo está consolidada como Recipe; los demás casos sin source_url permanecen NEW_SEED/DUPLICATE REVIEW. No se eliminan ni publican entidades.

QA: docs/QA-BLOQUE-NEWSEED-20260925-45.md.


## Actualización de control — 2026-09-25 — Bloque 46 REVIEW

Se procesaron las 11 decisiones REVIEW pendientes: E005 (2 URLs), E010 (2), Caprese (1), salud/nutrición (5), colecciones (2) y artículo de veganismo (1). No se forzaron decisiones editoriales. E005/E010 no tienen ContentPage equivalente bajo los slugs consultados; Caprese tiene ContentPage unpublished y no Recipe visible con ese slug; salud, colecciones y veganismo mantienen sus ContentPages publicadas. No se crean redirects, borrados ni publicaciones.

QA: docs/QA-BLOQUE-REVIEW-20260925-46.md.


## Actualización de control — Bloque 50 — 2026-09-25

Se dejó atrás la revisión incremental de candidatos ContentPage→Recipe. Auditoría integral: 48 ContentPages publicadas tienen una Recipe ES homónima staged, y las 48 Recipes están completas en los campos básicos (imagen, contenido, ingredientes, pasos y metadata). No se publican ni retiran aún por el gate de routing/SEO/despliegue. El siguiente punto de trabajo es Publication Gate: validar contrato de URL pública, canonical/hreflang, schema, sitemap y verificación desplegada, y después ejecutar publicaciones/retiros por lotes.

QA: docs/QA-BLOQUE-CONTENTPAGE-RECIPE-20260925-50.md.
