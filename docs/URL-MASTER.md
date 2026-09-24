# URL MASTER — Manual de Cocina

**Estado:** EN CONSTRUCCIÓN — Sprint 0 / Recuperación y Control  
**Fecha de corte:** 2026-09-24  
**Fuentes:** Search Console export 2025-05-23 → 2026-09-21, WordPress WXR 2026-09-23, migracion-inventario.csv, Supabase actual.

## Regla de control

Ninguna URL histórica con evidencia de tráfico orgánico debe cambiarse, redirigirse o eliminarse de forma masiva hasta que exista una decisión explícita en este documento.

## Hallazgos iniciales

- Search Console contiene 1.000 páginas principales exportadas.
- El WXR contiene 1.495 elementos; 204 posts y 18 pages, además de contenido técnico/adjuntos.
- El inventario de migración contiene 392 filas y 368 URLs publicadas.
- Las 368 URLs publicadas del inventario aparecen también en el WXR; el WXR contiene 74 URLs publicadas adicionales que no están en el inventario.
- Supabase tiene actualmente 160 recetas y 88 páginas de contenido publicadas, además de 219 redirecciones 301.
- Las páginas multilingües históricas de mayor tráfico de Search Console no aparecen actualmente como `source_url` en Supabase en la muestra auditada. Esto incluye DE, JA, IT y FR.
- Por tanto, la arquitectura multilingüe actual NO puede considerarse una reconstrucción de la arquitectura histórica hasta completar el mapa URL por URL.

## Evidencia histórica prioritaria

| Prioridad | URL histórica | Clics | Impresiones | Posición | Idioma | Estado actual observado |
|---:|---|---:|---:|---:|---|---|
| 1 | /de/kolumbianisches-lechona-rezept/ | 1.183 | 9.497 | 5,11 | DE | No existe en Supabase como source_url |
| 2 | /ja/コロンビアのレチョナレシピ/ | 853 | 9.163 | 5,62 | JA | No existe en Supabase como source_url |
| 3 | /receta-bondiola-de-cerdo/ | 711 | 15.355 | 13,03 | ES | Existe como receta |
| 4 | /it/ricetta-colombiana-lechona/ | 623 | 12.876 | 7,66 | IT | No existe en Supabase como source_url |
| 5 | /fr/casuela-aux-haricots-colombiens/ | 320 | 1.611 | 3,15 | FR | No existe en Supabase como source_url |
| 6 | /fr/recette-lechona-colombienne/ | 269 | 9.764 | 7,87 | FR | No existe en Supabase como source_url |
| 7 | /receta-de-lechona-colombiana/ | 265 | 8.825 | 26,31 | ES | Existe como página |
| 8 | /ja/メキシカンブリトーのレシピ/ | 245 | 1.759 | 7,65 | JA | No existe en Supabase como source_url |
| 9 | /it/teriyaki-ricetta-pollo/ | 219 | 993 | 8,84 | IT | No existe en Supabase como source_url |
| 10 | /receta-de-pie-de-maracuya/ | 193 | 9.437 | 13,02 | ES | Existe como receta |
| 11 | /receta-de-salsa-de-ajo/ | 189 | 6.243 | 7,44 | ES | Existe como receta |
| 12 | /en/anti-cancer-juice/ | 159 | 4.355 | 25,22 | EN | No existe en Supabase como source_url |
| 13 | /creep-stroganoff/ | 154 | 19.773 | 6,78 | ES | Existe como receta |
| 14 | /fr/recette-porra-antequerana/ | 130 | 1.983 | 7,05 | FR | No existe en Supabase como source_url |
| 15 | /en/colombian-lechona-recipe/ | 119 | 10.456 | 15,29 | EN | No existe en Supabase como source_url |
| 16 | /de/kolumbianische-bohnen-casuela/ | 114 | 880 | 4,19 | DE | No existe en Supabase como source_url |
| 17 | /ja/パンデボノ自家製/ | 109 | 2.239 | 4,81 | JA | No existe en Supabase como source_url |
| 18 | /receta-de-rollo-de-carne/ | 74 | 3.176 | 11,19 | ES | Existe como receta |
| 19 | /ja/マッツォパンのレシピ/ | 74 | 3.060 | 5,92 | JA | No existe en Supabase como source_url |
| 20 | /ja/レモンパイのレシピ/ | 70 | 1.457 | 6,91 | JA | No existe en Supabase como source_url |
| 21 | /fr/milkshake-grimace-mcdonalds/ | 69 | 5.686 | 11,62 | FR | No existe en Supabase como source_url |
| 22 | /sopa-saludable-para-enfermos/ | 69 | 3.196 | 9,03 | ES | Existe como página |
| 23 | /ja/オルチャータのレシピ/ | 69 | 1.618 | 9,69 | JA | No existe en Supabase como source_url |
| 24 | /ja/フィレンツェ風チキンアルフレッド/ | 67 | 2.333 | 17,45 | JA | No existe en Supabase como source_url |
| 25 | /empanada-peruana-de-pollo/ | 66 | 2.366 | 6,09 | ES | Existe como página |
| 26 | /de/oktopus-rezept-nach-galizischer-art/ | 66 | 1.338 | 28,10 | DE | No existe en Supabase como source_url |
| 27 | /de/matza-brot-rezept/ | 64 | 2.821 | 31,12 | DE | No existe en Supabase como source_url |
| 28 | /de/milchshake-grimaze-mcdonalds/ | 63 | 4.976 | 8,11 | DE | No existe en Supabase como source_url |
| 29 | /it/casuela-colombiana-di-fagioli/ | 62 | 484 | 4,88 | IT | No existe en Supabase como source_url |
| 30 | /de/saft-gegen-krebs/ | 61 | 1.024 | 8,93 | DE | No existe en Supabase como source_url |

## Decisiones provisionales

### PROTEGIDAS

Estas URL no se deben sustituir por `/es/receta/...` automáticamente:

- /de/kolumbianisches-lechona-rezept/
- /ja/コロンビアのレチョナレシピ/
- /it/ricetta-colombiana-lechona/
- /fr/casuela-aux-haricots-colombiens/
- /fr/recette-lechona-colombienne/
- /ja/メキシカンブリトーのレシピ/
- /it/teriyaki-ricetta-pollo/
- /fr/recette-porra-antequerana/
- /de/kolumbianische-bohnen-casuela/
- /ja/パンデボノ自家製/

**Motivo:** evidencia directa de tráfico e impresiones en Search Console. La decisión definitiva sobre mantener exactamente la URL, migrarla con 301 o reconstruirla como traducción se tomará después de cruzar el contenido histórico.

### REVISAR

- /receta-bondiola-de-cerdo/
- /receta-de-lechona-colombiana/
- /receta-de-pie-de-maracuya/
- /receta-de-salsa-de-ajo/
- /creep-stroganoff/
- /receta-de-rollo-de-carne/
- /sopa-saludable-para-enfermos/
- /empanada-peruana-de-pollo/

Estas ya tienen correspondencia actual en Supabase, pero **todavía no autorizamos ningún cambio de URL**.

## Próximo cruce

1. Search Console → todas las 1.000 URLs exportadas.
2. WordPress → título, post/page, slug, fecha y contenido.
3. Inventario → tipo, receta/no receta y medios.
4. Supabase → contenido actual y `source_url`.
5. Redirects → destino actual de cada URL histórica.
6. Agrupación por intención/receta para detectar duplicados reales.
7. Decisión final por URL: KEEP / MIGRATE / MERGE / NOINDEX / 404.
8. Solo después se fija la arquitectura definitiva.

## Datos históricos de contexto

Periodo de Search Console: 2025-05-23 → 2026-09-21.

- 10.403 clics
- 528.274 impresiones
- Pico diario: 2025-06-03 — 259 clics / 6.001 impresiones
- Mejor mes completo: julio 2025 — 1.846 clics / 93.653 impresiones
- Países destacados por clics: Japón 2.071; Italia 1.703; Alemania 1.533; Francia 1.160.
- Aparición «Galería de recetas»: 8.959 clics / 279.534 impresiones / posición 5,17.
- «Resultados enriquecidos de recetas»: 0 clics / 1.625 impresiones / posición 55,29.

## Regla de cierre del Sprint 0

La arquitectura definitiva no se aprueba mientras existan URLs históricas de valor sin una decisión documentada.

## Resultado del cruce masivo Search Console ↔ WordPress ↔ Inventario

Auditoría automática sobre las 1.000 URLs exportadas de Search Console:

- **209/1.000** tienen correspondencia directa en WordPress y en el inventario.
- **25/1.000** tienen 50+ clics y no aparecen ni en WordPress ni en el inventario: **PROTEGER_Y_RECUPERAR**.
- **9/1.000** tienen 50+ clics y sí aparecen en WordPress/inventario: **PROTEGER_REVISAR**.
- **790/1.000** no tienen correspondencia directa en estas dos fuentes locales. Esto no significa que sean inexistentes: incluye especialmente URLs multilingües históricas que deben investigarse contra traducciones, migraciones anteriores, redirects y Supabase.
- Las decisiones siguen deliberadamente en **PENDIENTE** hasta cruzar el contenido y el estado actual.

### Regla nueva de trabajo

Una URL con tráfico histórico no se considera perdida hasta agotar estas comprobaciones: WordPress → inventario → Supabase/source_url → redirects → equivalencia de contenido → traducción histórica.

El campo de control del cruce masivo queda definido como: PROTEGER_Y_RECUPERAR, PROTEGER_REVISAR, MAPEADA o HISTORICA_SIN_FUENTE_LOCAL. No es todavía una decisión SEO final.


## Recuperación 2 — Las 25 URLs de alto tráfico tienen fuente histórica identificable

Cruce adicional realizado el 2026-09-24 sobre las **25 URLs con 50+ clics que inicialmente no tenían correspondencia directa en WordPress/inventario**.

El WXR de WordPress conserva metadatos de TranslatePress con los slugs históricos traducidos ('_trp_automatically_translated_slug_*'). Esto permite recuperar la relación entre muchas URLs multilingües históricas y su contenido fuente en WordPress, aunque esas URLs no aparezcan como 'link' independiente en el WXR.

**Resultado:** las 25 URLs no deben considerarse contenido perdido. Se identificó un post fuente de WordPress para las 25.

| URL histórica | Clics | Idioma | Post WP fuente | Slug ES fuente | Estado |
|---|---:|---|---|---|---|
| /de/kolumbianisches-lechona-rezept/ | 1.183 | DE | Irresistible Lechona Colombiana | receta-de-lechona-colombiana | RECUPERADA_FUENTE |
| /ja/コロンビアのレチョナレシピ/ | 853 | JA | Irresistible Lechona Colombiana | receta-de-lechona-colombiana | RECUPERADA_FUENTE |
| /it/ricetta-colombiana-lechona/ | 623 | IT | Irresistible Lechona Colombiana | receta-de-lechona-colombiana | RECUPERADA_FUENTE |
| /fr/casuela-aux-haricots-colombiens/ | 320 | FR | Casuela de frijoles Colombianos | casuela-de-frijoles-colombianos | RECUPERADA_FUENTE |
| /fr/recette-lechona-colombienne/ | 269 | FR | Irresistible Lechona Colombiana | receta-de-lechona-colombiana | RECUPERADA_FUENTE |
| /ja/メキシカンブリトーのレシピ/ | 245 | JA | Burrito mexicano | receta-de-burrito-mexicano | RECUPERADA_FUENTE |
| /it/teriyaki-ricetta-pollo/ | 219 | IT | Pollo Teriyaki con Verduras al Wok | receta-de-pollo-teriyaki | RECUPERADA_FUENTE |
| /en/anti-cancer-juice/ | 159 | EN | Jugo Anticancerígeno | jugo-anticancerigeno | RECUPERADA_FUENTE |
| /fr/recette-porra-antequerana/ | 130 | FR | Porra Antequerana | porra-antequerana-receta | RECUPERADA_FUENTE |
| /en/colombian-lechona-recipe/ | 119 | EN | Irresistible Lechona Colombiana | receta-de-lechona-colombiana | RECUPERADA_FUENTE |
| /de/kolumbianische-bohnen-casuela/ | 114 | DE | Casuela de frijoles Colombianos | casuela-de-frijoles-colombianos | RECUPERADA_FUENTE |
| /ja/パンデボノ自家製/ | 109 | JA | Pandebono casero (Colombia) | pandebono-casero | RECUPERADA_FUENTE |
| /ja/マッツォパンのレシピ/ | 74 | JA | Pan Matzá Casero | receta-de-pan-matza | RECUPERADA_FUENTE |
| /ja/レモンパイのレシピ/ | 70 | JA | Pie de Limón | receta-pie-de-limon | RECUPERADA_FUENTE |
| /fr/milkshake-grimace-mcdonalds/ | 69 | FR | Batido Grimace | batido-grimace-mcdonalds | RECUPERADA_FUENTE |
| /ja/オルチャータのレシピ/ | 69 | JA | Horchata Casera Refrescante | receta-de-horchata | RECUPERADA_FUENTE |
| /ja/フィレンツェ風チキンアルフレッド/ | 67 | JA | Pollo Alfredo a la Florentina | pollo-alfredo-a-la-florentina | RECUPERADA_FUENTE |
| /de/oktopus-rezept-nach-galizischer-art/ | 66 | DE | Pulpo a la Gallega (España) | receta-de-pulpo-a-la-gallega | RECUPERADA_FUENTE |
| /de/matza-brot-rezept/ | 64 | DE | Pan Matzá Casero | receta-de-pan-matza | RECUPERADA_FUENTE |
| /de/milchshake-grimaze-mcdonalds/ | 63 | DE | Batido Grimace | batido-grimace-mcdonalds | RECUPERADA_FUENTE |
| /it/casuela-colombiana-di-fagioli/ | 62 | IT | Casuela de frijoles Colombianos | casuela-de-frijoles-colombianos | RECUPERADA_FUENTE |
| /de/saft-gegen-krebs/ | 61 | DE | Jugo Anticancerígeno | jugo-anticancerigeno | RECUPERADA_FUENTE |
| /it/ajiaco-ricetta/ | 60 | IT | Ajiaco (100% Colombiano) | receta-de-ajiaco | RECUPERADA_FUENTE |
| /it/porra-antequerana-ricetta/ | 59 | IT | Porra Antequerana | porra-antequerana-receta | RECUPERADA_FUENTE |
| /it/empanada-pollo-peruviana/ | 52 | IT | La Increíble Empanada Peruana de Pollo que Debes Probar | empanada-peruana-de-pollo | RECUPERADA_FUENTE |

### Hallazgo crítico

La ausencia de estas URLs en 'source_url' de Supabase **no significa que las traducciones históricas no existieran**. WordPress conserva sus slugs traducidos en los metadatos de TranslatePress.

Esto cambia el diagnóstico del Sprint 0:

- **25/25 URLs de alto tráfico tienen fuente histórica recuperable.**
- La mayoría son traducciones de contenido español concreto.
- Varias URLs históricas de distintos idiomas apuntan al mismo contenido fuente, lo que permite reconstruir los grupos de traducción sin inventar relaciones.
- Aún **NO** se decide si la URL histórica exacta se conserva, se sirve directamente, o se redirige.
- Aún **NO** se deben crear registros traducidos nuevos en Supabase.
- Aún **NO** se debe aplicar una arquitectura '/lang/receta/slug' a estas URLs.

### Comprobación Supabase / redirects

Para las 25 URLs anteriores:

- No existe actualmente una coincidencia por 'source_url' en 'recipes'/'content_pages'.
- No existe actualmente un redirect registrado en 'content_redirects' para estas rutas históricas.
- Por tanto, el patrimonio histórico está identificado en WordPress pero todavía **no está representado en el modelo actual de URLs de Supabase**.

### Nueva fase de trabajo

El siguiente cruce ya no es «¿de dónde salió esta URL?». Eso está resuelto para estas 25.

Ahora es:

**URL histórica → post fuente WP → contenido fuente → traducción histórica → contenido traducido disponible → grupo de contenido/receta → estado actual Supabase → decisión KEEP/MIGRATE/MERGE/NOINDEX/404**

No se modifica producción hasta cerrar este segundo nivel de equivalencia.


## Recuperación 3 — TranslatePress confirma los grupos multilingües históricos

Nueva comprobación del WXR: los posts fuente conservan metadatos `_trp_automatically_translated_slug_*` con los slugs históricos por idioma. Esto permite reconstruir de forma documental el mapa URL→grupo para las 25 URLs prioritarias.

Ejemplos confirmados:
- Lechona: DE `kolumbianisches-lechona-rezept`, JA `コロンビアのレチョナレシピ`, IT `ricetta-colombiana-lechona`, FR `recette-lechona-colombienne`, EN `colombian-lechona-recipe`.
- Casuela: DE `kolumbianische-bohnen-casuela`, FR `casuela-aux-haricots-colombiens`, IT `casuela-colombiana-di-fagioli`, EN `colombian-bean-casuela`.
- Pan Matzá: DE `matza-brot-rezept`, JA `マッツォパンのレシピ`, IT `ricetta-del-pane-matza`, FR `recette-pain-matza`, EN `matza-bread-recipe`.
- Horchata: DE `horchata-rezept`, JA `オルチャータのレシピ`, IT `ricetta-horchata`, FR `recette-dhorchata`, EN `horchata-recipe`.
- Porra: DE `porra-antequerana-rezept`, JA `ポッラ・アンテケラナ・レシピ`, IT `porra-antequerana-ricetta`, FR `recette-porra-antequerana`, EN `porra-antequerana-recipe`.
- Batido Grimace: DE `milchshake-grimaze-mcdonalds`, JA `ミルクセーキ-しかめっ面-マクドナルド`, FR `milkshake-grimace-mcdonalds`, IT `frappe-smorfia-mcdonalds`, EN `milkshake-grimace-mcdonalds-2`.
- Jugo Anticancerígeno: DE `saft-gegen-krebs`, JA `抗がん剤ジュース`, FR `jus-anti-cancer`, IT `succo-antitumorale`, EN `anti-cancer-juice`.

**Conclusión de control:** ya no estamos reconstruyendo los grupos a partir de similitud de títulos. Para estas URLs existe evidencia directa en WordPress/TranslatePress de la relación lingüística. Lo que sigue es recuperar el **contenido textual traducido**, no volver a descubrir qué URL pertenecía a qué grupo.

**Bloqueo:** no crear traducciones nuevas ni redirects todavía. El siguiente paso es auditar el paquete de migración y cualquier contenido HTML/JSON almacenado para comprobar si conserva los cuerpos traducidos.


## Recuperación 4 — Auditoría de fuentes de contenido traducido

Se auditó el paquete `manualdecocina-migration-package.zip` (archivo `migration-data.json`, 203 posts, 17 páginas y 158 recetas) contra los 25 grupos/URLs prioritarios.

Resultado:

1. El paquete conserva los **posts fuente en español** y su contenido HTML/receta para los contenidos históricos.
2. El paquete **no contiene registros independientes de las traducciones DE/JA/IT/FR/EN**. Los objetos de migración están modelados esencialmente a partir del contenido español.
3. El WXR tampoco contiene las tablas internas de TranslatePress: en sus postmeta solo aparecen las claves `_trp_automatically_translated_slug_*` y `_trp_translated_slug_*`. El análisis de las claves `_trp_` del XML no encontró una capa de contenido traducido almacenada como postmeta.
4. Por tanto, queda confirmada la siguiente separación de evidencia:
   - **URL histórica + idioma + relación con el contenido fuente:** RECUPERADO.
   - **Contenido traducido histórico completo:** NO RECUPERADO desde los archivos auditados hasta ahora.
   - **Contenido español fuente:** RECUPERADO en el WXR/paquete de migración.

Esto impide justificar todavía una migración literal de las 25 URLs como páginas traducidas. No se deben fabricar cuerpos traducidos ni marcar como recuperado aquello que no está en las fuentes.

### Próxima fuente a investigar

La vía que queda pendiente es la propia instalación/backup de WordPress/TranslatePress o cualquier snapshot de base de datos que conserve las tablas de TranslatePress. El WXR de WordPress no exporta esas tablas de plugin. Si no existe esa fuente, las traducciones deberán clasificarse como **reconstrucción editorial**, no como recuperación documental.

**Regla de control:** una reconstrucción editorial puede conservar una URL histórica si existe contenido equivalente suficiente, pero deberá quedar registrada como reconstrucción y no como recuperación del texto original.

## Cambio de estrategia — 2026-09-24

La recuperación del cuerpo textual traducido histórico queda cerrada como requisito. El proyecto no necesita reproducir las traducciones antiguas de TranslatePress.

Las relaciones históricas URL→idioma→entidad siguen siendo evidencia válida y se conservan. El contenido de cada idioma se reconstruirá editorialmente desde cero.

Por tanto, el siguiente cruce del URL Master ya no debe buscar contenido traducido disponible como condición de recuperación. Debe resolver:

URL histórica → idioma → entidad editorial → intención → rendimiento → estado actual → URL objetivo → acción SEO.

### Acciones permitidas

- KEEP: reconstruir contenido nuevo en la URL histórica.
- MIGRATE: crear una URL nueva y 301 desde la histórica.
- MERGE: consolidar dos URLs cuando representan la misma intención/entidad y una sola URL canónica es suficiente.
- NOINDEX: caso excepcional y documentado.
- 404/410: retirar cuando no exista una equivalencia editorial válida.

### Regla para URLs multilingües históricas

Una URL histórica con tráfico no debe redirigirse únicamente porque la arquitectura nueva prefiera otra estructura. Primero se comprueba si puede reconstruirse como versión localizada de la entidad.

Ejemplo de grupo histórico ya demostrado:

- ES /receta-de-lechona-colombiana/
- DE /de/kolumbianisches-lechona-rezept/
- JA /ja/コロンビアのレチョナレシピ/
- IT /it/ricetta-colombiana-lechona/
- FR /fr/recette-lechona-colombienne/
- EN /en/colombian-lechona-recipe/

Estas URLs forman un grupo editorial candidato; la decisión final de conservación se toma por URL, no por una regla automática de estructura.

## Criterio de prioridad del URL Master

1. URLs con alto tráfico histórico.
2. URLs con alta impresión y posición orgánica fuerte aunque tengan pocos clics.
3. URLs que forman grupos multilingües históricos demostrables.
4. URLs con enlaces/redirects históricos relevantes.
5. Resto del inventario histórico.

El rendimiento de Search Console es evidencia histórica, no una garantía de rendimiento futuro.

## Gate actual

No se crea todavía una migración masiva de URLs. Primero se termina la tabla maestra y se aprueban las decisiones.