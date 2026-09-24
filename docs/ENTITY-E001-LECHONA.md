# E001 — Lechona colombiana — consolidación de control

Fecha: 2026-09-24
Estado: CONTROL / decisión de catálogo, sin cambios de producción

## Evidencia histórica

URLs históricas demostradas por Search Console + TranslatePress:

| Idioma | URL histórica | Clics históricos | Estado de control |
|---|---|---:|---|
| ES | /receta-de-lechona-colombiana/ | 265 | KEEP candidate |
| DE | /de/kolumbianisches-lechona-rezept/ | 1183 | KEEP candidate |
| JA | /ja/コロンビアのレチョナレシピ/ | 853 | KEEP candidate |
| IT | /it/ricetta-colombiana-lechona/ | 623 | KEEP candidate |
| FR | /fr/recette-lechona-colombienne/ | 269 | KEEP candidate |
| EN | /en/colombian-lechona-recipe/ | 119 | KEEP candidate |

## Estado actual Supabase

Existe un grupo `recipe_group_id=d0ad2da1-a1fa-4686-8c83-30303c1c005a` con:

- ES recipe: `lechona-colombiana`
- EN recipe: `colombian-lechona`

Ambas están publicadas y ambas tienen `source_url=null`.

Además existe una `content_page` ES con:

- source_url: `https://manualdecocina.com/receta-de-lechona-colombiana/`
- slug: `receta-de-lechona-colombiana`

También existe otra Recipe NEW_SEED ES:

- `lechona-colombiana-receta-tradicional-paso-a-paso`
- source_url=null

## Decisión de entidad

Las representaciones anteriores pertenecen a **una sola entidad editorial: E001**.

No deben publicarse simultáneamente como tres entidades.

## URL definitiva — control

La candidata principal ES es la URL histórica:

`/receta-de-lechona-colombiana/`

Las URLs históricas multilingües pasan como candidatas principales de cada idioma.

No se decide todavía si las seis versiones se publican al mismo tiempo; eso corresponde al calendario editorial. Si una versión se publica, deberá ser contenido realmente localizado.

## Modelo Supabase previsto

El estado objetivo debe ser:

- una sola entidad/grupo E001;
- una Recipe por idioma realmente publicado;
- `source_url` documentando la procedencia histórica cuando exista;
- sin una ContentPage paralela para la misma receta;
- sin segundo Recipe ES equivalente;
- canonical autorreferente;
- hreflang solamente entre versiones realmente publicadas.

## Redirect

El redirect actual:

`/receta-de-lechona-colombiana/ → /es/receta-de-lechona-colombiana`

queda en estado **REVISAR**.

No se cambia hasta que el router pueda servir correctamente la URL definitiva aprobada.

## Contenido

El cuerpo histórico traducido no se considera recuperado. Todo el contenido nuevo se redactará desde cero y se localizará por idioma.

## Regla de repetición

E001 establece el patrón para las siguientes entidades:

1. identificar una única entidad;
2. conservar las URLs históricas valiosas como candidatas;
3. consolidar NEW_SEED duplicados;
4. resolver una sola Recipe por idioma publicado;
5. adaptar router/SEO al URL Master;
6. solo después modificar redirects.
