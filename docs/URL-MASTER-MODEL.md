# URL MASTER — MODELO OPERATIVO

**Fecha:** 2026-09-24  
**Estado:** EN EJECUCIÓN — Sprint 0

## Propósito

Convertir el histórico de Search Console en el inventario operativo del nuevo Manual de Cocina. El contenido se reconstruirá desde cero; la historia aporta evidencia SEO y de relaciones entre URLs.

## Registro maestro

Cada URL debe poder representarse con estos campos:

| Campo | Función |
|---|---|
| historical_url | URL observada históricamente |
| language | idioma de la URL |
| entity_id | entidad editorial común |
| entity_name | nombre interno de la entidad |
| content_type | Recipe / CollectionPage / Article / WebPage / Legacy |
| intent | intención principal |
| clicks | clics históricos |
| impressions | impresiones históricas |
| ctr | CTR histórico |
| avg_position | posición media histórica |
| wp_source | fuente histórica WordPress |
| current_supabase | estado actual en Supabase |
| current_redirect | redirect actual si existe |
| target_url | URL que tendrá la reconstrucción |
| action | KEEP / MIGRATE / MERGE / NOINDEX / 404-410 |
| priority | P0 / P1 / P2 / P3 / P4 |
| hreflang_group | grupo de idiomas |
| notes | justificación |

## Entidad vs URL

Una entidad puede tener varias URLs. Nunca se debe interpretar automáticamente que dos URLs con títulos parecidos son la misma entidad.

La agrupación se acepta cuando existe evidencia suficiente:

1. relación histórica directa;
2. fuente WordPress común;
3. TranslatePress slug relation;
4. equivalencia editorial inequívoca;
5. o decisión manual documentada.

## Prioridades

### P0 — Protección máxima

Tráfico histórico elevado, posiciones fuertes o patrimonio multilingüe crítico.

### P1 — Alto valor

Alta visibilidad, intención clara o relación multilingüe importante.

### P2 — Valor medio

Señales históricas útiles pero menor impacto.

### P3 — Patrimonio residual

Debe revisarse, pero no bloquea la arquitectura.

### P4 — Legacy

Sin valor SEO demostrado o sin equivalencia editorial válida.

## Regla de decisión

La decisión SEO nunca se deduce únicamente de los clics.

Se consideran conjuntamente:

- intención;
- tráfico;
- impresiones;
- posición;
- existencia de entidad equivalente;
- duplicidad real;
- idioma;
- valor de la URL histórica;
- capacidad de reconstruir contenido útil;
- riesgo de crear dos URLs competidoras.

## Regla de reconstrucción

Si una URL histórica P0/P1 tiene una entidad editorial válida y puede recibir contenido nuevo, la primera opción a evaluar es **KEEP**.

Cambiarla a otra URL requiere una razón documentada, no una preferencia estética del nuevo router.

## Regla multilingüe

Cuando varias URLs pertenecen a una misma entidad, forman un grupo de localización. Cada versión publicada debe tener su propia URL y canonical, y las versiones existentes deben enlazarse con `hreflang`. Google exige que cada variante incluya referencias a sí misma y a las demás variantes del grupo. citeturn0search1

No se publican `hreflang` hacia páginas inexistentes.

## Resultado esperado

Al terminar el URL Master debemos poder responder sin ambigüedad:

- cuántas entidades editoriales existen;
- cuántas son recetas;
- cuántas son colecciones;
- cuántas son artículos;
- cuántas URLs históricas se conservan;
- cuántas cambian con 301;
- cuántas se fusionan;
- cuántas se retiran;
- cuántos grupos multilingües existen;
- qué URLs deben construir los otros chats.

## Gate

Hasta que este registro no esté cerrado para las URLs relevantes, el router definitivo y la migración masiva de contenido permanecen bloqueados.
