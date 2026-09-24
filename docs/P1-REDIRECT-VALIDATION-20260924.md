# P1 redirects — valid destinations vs URL Master — 2026-09-24

## Resultado

Se comprobaron 27 redirects P1 en `content_redirects`.

### 22 redirects apuntan a destinos Recipe realmente presentes

Sus destinos `/es/receta/<slug>` tienen una fila Recipe ES correspondiente en Supabase.

Esto significa:
- no son redirects técnicamente huérfanos;
- sí existe actualmente un destino en la base;
- pero todavía pueden ser **estratégicamente incorrectos** si el URL Master decide conservar la URL histórica.

### 5 redirects apuntan a ContentPage

- /empanada-peruana-de-pollo/ → /es/empanada-peruana-de-pollo
- /pollo-alfredo-a-la-florentina/ → /es/pollo-alfredo-a-la-florentina
- /receta-de-lechona-colombiana/ → /es/receta-de-lechona-colombiana
- /receta-ensalada-caprese/ → /es/receta-ensalada-caprese
- /souffle-de-queso/ → /es/souffle-de-queso

Estos cinco requieren especial revisión porque varias son recetas claras o candidatas a Recipe.

## Conclusión

El problema no es que los 301 apunten a páginas inexistentes.

El problema es que algunos 301 fueron creados **antes de cerrar el URL Master y antes de decidir si la URL histórica debía conservarse**.

Por tanto:

- técnicamente válidos ≠ estratégicamente aprobados;
- el redirect no puede definir la arquitectura por sí solo.

## Regla

Para cada redirect P1:

`URL histórica → entidad → URL definitiva aprobada → redirect`

Nunca:

`URL histórica → redirect existente → asumir que esa es la URL definitiva`

## Acción

No tocar todavía production.

Una vez cerrado el URL Master:
- KEEP → eliminar ese redirect y servir la URL histórica, cuando el router esté preparado.
- MIGRATE → conservar/ajustar el 301 directo al destino final.
- MERGE → 301 al único contenido consolidado.
- OUT → 404/410 o 301 solo si existe un equivalente editorial real.

Google recomienda evitar cadenas y redirecciones irrelevantes, y que las redirecciones permanentes apunten directamente al destino final. citeturn789202search0turn789202search2


## Actualización de estado — 2026-09-25

La etapa posterior de limpieza eliminó los redirects históricos que ya no estaban aprobados como destino definitivo. El estado conocido de `content_redirects` quedó en **0 registros**.

Por tanto, la tabla de 27 redirects de este documento es evidencia histórica del problema, no un inventario operativo actual.

La arquitectura vigente vuelve a partir de:

`URL histórica → entidad → URL definitiva → redirect solo si corresponde`

Esto evita que redirects heredados decidan por adelantado el URL Master.
