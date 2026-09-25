# QA BLOQUE NEW_SEED — 2026-09-25 — BLOQUE 45

## Alcance

Revisión de los casos NEW_SEED duplicados identificados en el URL Master. Se procesan los 10 casos documentados en un único bloque.

## Resultado

- **lechona-colombiana**: tiene `source_url` histórica `/receta-de-lechona-colombiana/`; no debe tratarse como NEW_SEED puro. Se mantiene como evidencia histórica de E001 y no se crea una segunda entidad.
- **lechona-colombiana-receta-tradicional-paso-a-paso**: no aparece como Recipe en la consulta actual; queda como representación histórica/duplicada pendiente de cierre URL-by-URL. No se borra.
- **empanada-peruana-de-pollo**: Recipe publicada y ContentPage equivalente no publicada; queda identificada como entidad consolidada. No se crea una segunda Recipe.
- **bowl-de-carne-con-miel-picante-y-queso-cottage**: Recipe staged, NEW_SEED sin source_url.
- **receta-facil-de-pasta-al-pesto-casera**: Recipe staged, NEW_SEED sin source_url; existe ContentPage equivalente staged.
- **receta-de-souffle-de-queso-esponjoso**: Recipe staged, NEW_SEED sin source_url.
- **sopa-saludable-para-enfermos-receta-nutritiva-y-facil-de-preparar**: Recipe staged, NEW_SEED sin source_url.
- **receta-de-papas-al-horno-y-los-beneficios-para-la-salud**: Recipe staged, NEW_SEED sin source_url.
- **solomillo-de-pavo-glaseado-con-cafe-y-chipotle-sobre-hummus-de-edamame**: Recipe staged, NEW_SEED sin source_url.
- **sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico**: Recipe staged, NEW_SEED sin source_url.

## Regla aplicada

La ausencia de `source_url` no convierte una Recipe en evidencia histórica. No se elimina ni publica ninguna entidad por este bloque. La consolidación definitiva requiere identificar la entidad histórica/URL objetivo antes de retirar representaciones paralelas.

## Incidentes

Ninguno.

## Estado

NEW_SEED / DUPLICATE REVIEW — CONSOLIDACIÓN PENDIENTE.
