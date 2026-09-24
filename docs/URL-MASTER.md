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
