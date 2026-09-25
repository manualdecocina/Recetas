# QA BLOQUE NEW_SEED — 2026-09-25 — BLOQUE 48

## Alcance

Primer bloque de 20 Recipes con `source_url IS NULL` y `published_at >= 2026-09-23`, orden estable por slug.

## Clasificación

### Casos con evidencia de entidad/histórico ya existente
- `colombian-lechona`: pertenece al mismo `recipe_group_id` que las seis variantes históricas E001. Se trata como variante de E001, no como entidad independiente.
- `empanada-peruana-de-pollo`: comparte grupo con E015 y ya está publicada; su ContentPage equivalente está unpublished. No se crea segunda entidad.
- `ensalada-caprese`: Recipe publicada; la URL histórica `/receta-ensalada-caprese/` está en URL Master como REVIEW / MODEL Recipe. No se crea una segunda Recipe.

### NEW_SEED con ContentPage homónima, sin evidencia suficiente para consolidar automáticamente
- `bowl-de-carne-con-miel-picante-y-queso-cottage`
- `receta-de-pan-de-platano-clasico`
- `receta-facil-de-pasta-al-pesto-casera`

Estas ContentPages están unpublished. Se mantienen como candidatos a consolidación, pero no se borran ni se fusionan por nombre únicamente.

### NEW_SEED sin ContentPage homónima detectada en esta consulta
- `albondigas-suecas`
- `chili-con-carne-express`
- `empanadas-argentinas`
- `espaguetis-con-salsa-de-carne`
- `hamburguesas-caseras`
- `irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon`
- `la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`
- `lasana-de-sarten`
- `pastel-de-carne`
- `picadillo-de-carne-molida-rapido-y-facil`
- `receta-clasica-de-galletas-toll-house-original-con-chispas-de-chocolate`
- `receta-de-arroz-con-leche-un-postre-reconfortante`
- `receta-de-papas-al-horno-y-los-beneficios-para-la-salud`
- `receta-de-souffle-de-queso-esponjoso`

## Reglas aplicadas

- No se interpreta `source_url NULL` como evidencia histórica.
- No se borran duplicados potenciales.
- No se publican NEW_SEED.
- No se cambia identidad/título por inferencia.
- Los casos con grupo histórico se consolidan conceptualmente, pero su migración/retirada queda para el gate editorial correspondiente.

## Balance

- 20/20 entidades revisadas.
- 3 con ContentPage homónima.
- 3 entidades con vínculo directo a grupos/modelos ya controlados.
- 14 NEW_SEED sin ContentPage homónima detectada.
- 0 borrados.
- 0 redirects.
- 0 publicaciones.
- Incidentes: ninguno.

## Estado

NEW_SEED BAJO CONTROL; PUBLICACIÓN BLOQUEADA POR GATES.
