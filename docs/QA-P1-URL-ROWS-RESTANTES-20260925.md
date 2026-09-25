# QA P1 — cierre de las 5 URLs inicialmente ausentes — 2026-09-25

La consulta inicial por `public_path`/slug exactos no reflejó estas entidades, pero el cruce por `source_url` confirmó que las cinco sí existen en `public.recipes` y están publicadas.

| URL histórica | Modelo | Estado |
|---|---|---|
| /receta-envuelto-de-choclo/ | Recipe | publicada, completa |
| /receta-cheesecake-de-agraz/ | Recipe | publicada, completa |
| /receta-de-pancakes-con-fresas-y-arandanos/ | Recipe | publicada, completa |
| /receta-helado-casero/ | Recipe | publicada, completa |
| /receta-trucha-al-ajillo-con-limon/ | Recipe | publicada, completa |

Se verificaron imagen, contenido, ingredientes, pasos, tiempos y servings en las cinco. No se modificó ninguna entidad porque ya está publicada y no apareció evidencia nueva que justifique reabrirla.

## Resultado

Se corrige el falso bloqueo de la comprobación anterior: las cinco filas no estaban ausentes; la discrepancia provenía de la consulta inicial por identificador de ruta/slug.

No se crean filas, redirects ni traducciones.
