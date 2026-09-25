# QA BLOQUE NEW_SEED — 2026-09-25 — BLOQUE 49

## Alcance

Se procesan las 7 entidades restantes de Recipes con `source_url IS NULL` y `published_at >= 2026-09-23`.

## Resultado

- `salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes`: NEW_SEED independiente; no ContentPage homónima detectada.
- `sloppy-joes`: NEW_SEED independiente; no ContentPage homónima detectada.
- `solomillo-de-pavo-glaseado-con-cafe-y-chipotle-sobre-hummus-de-edamame`: NEW_SEED; no ContentPage homónima detectada. Permanece bajo revisión de consolidación histórica previamente documentada.
- `sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico`: NEW_SEED; existe otra Recipe `receta-sopa-minestrone-saludable`, pero con distinto recipe_group_id. No se fusionan por semejanza nominal sin evidencia editorial.
- `sopa-saludable-para-enfermos-receta-nutritiva-y-facil-de-preparar`: NEW_SEED; existe Recipe histórica/objetivo `sopa-saludable-para-enfermos` con distinto grupo. No se fusiona automáticamente.
- `tacos-de-carne-molida`: NEW_SEED independiente; no ContentPage homónima detectada.
- `vasitos-de-mousse-de-aguacate-y-cacao`: NEW_SEED con ContentPage homónima unpublished. Se marca candidato a consolidación, sin borrar.

## Balance

- 7/7 restantes procesadas.
- 1 ContentPage homónima detectada.
- 2 casos con Recipe semánticamente relacionada pero grupos distintos; se conservan separados hasta evidencia.
- 0 borrados.
- 0 redirects.
- 0 publicaciones.
- Incidentes: ninguno.

## Estado

NEW_SEED 28/28 REVISADAS. No se autoriza publicación automática; quedan pendientes los casos de consolidación/editorial y los gates globales.
