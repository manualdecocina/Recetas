# Visibilidad de siete recetas y nombre canónico Papa — 2026-10-28

Solicitud: las recetas abren por enlace directo, pero el usuario no las ve al navegar portada/catálogo; el ingrediente de la aplicación debe llamarse Papa.

## Corrección de datos aplicada

Se conserva el ingrediente existente `98322e50-1f0c-406c-8681-b5718d3801ee` y su slug `papas`. Su nombre visible pasa de Papas a Papa y su nombre normalizado a papa. Los equivalentes papa, papas, patata y patatas apuntan al mismo ingrediente, sin crear otro ingrediente canónico.

Bravas y tartiflette ya estaban asociadas a ese ID. Los disparadores existentes reconciliaron además dos coincidencias antes pendientes: papa en crema de camarones y patata en kare raisu. La transacción comprueba que ninguna relación anterior cambie de ingrediente, posición, cantidad, unidad, preparación o nota; si ocurre, revierte todo. La lectura posterior confirmó nueve relaciones y cero pendientes para los cuatro términos exactos.

El SQL reproducible está en `scripts/repair-papa-equivalents-20261028.sql`; el estado anterior del ingrediente, sus alias y los dos grupos afectados está en `editorial/siete-mercados-20261027/papa-before-20261028.json`. No se modifican textos de recetas, títulos regionales, URL, imágenes ni publicación.

## Evidencia de navegación y sus límites

La prueba independiente con navegador de TinyFish, run `5276a2d7-0cdb-4fc6-998a-23bbcda4b7ab`, vio Morango en el hero y las otras seis recetas en Recién publicadas de la portada habitual. El hero se excluye intencionadamente de la lista de tarjetas para evitar repetirlo.

Esa sesión recibió HTTP 429 al intentar Recetas: no terminó la comprobación visual de catálogo, filtros ni móvil. El 429 corresponde a esa prueba y no demuestra que sea la causa de lo que observa el usuario. Las lecturas HTTP anteriores desde este entorno sí encontraron siete enlaces reales en el catálogo español, en sus primeras siete tarjetas, y las siete páginas directas respondieron 200.

No se atribuye la discrepancia del usuario a una capa concreta de caché ni se asegura consistencia mundial a partir de una comprobación favorable.

## Refresco y comprobación

El workflow `discovery-papa-20261028` utiliza exclusivamente el secreto existente de GitHub para invocar la ruta protegida de revalidación y exige `cacheMode=expire-now`. No extrae secretos ni hace despliegues.

La auditoría comprueba enlaces de portada y catálogo en los siete idiomas sin parámetros nuevos, una respuesta RSC de navegación, la búsqueda de bravas y el nombre Papa en los chips de ¿Qué cocino?. Conserva intentos fallidos en el informe. El informe y el estado de ejecución determinan el resultado; la creación del PR no se considera prueba de publicación.

## Resultado posterior al refresco

La primera ejecución, [40660613895](https://github.com/manualdecocina/Recetas/actions/runs/40660613895), falló al conectar con el sitio (`Network is unreachable`). No confirmó invalidación y no se presenta como aprobada.

La ejecución por IPv4 [40661028530](https://github.com/manualdecocina/Recetas/actions/runs/40661028530) confirmó `revalidated=true`, `cacheMode=expire-now`, a las 09:01:33 UTC del 28 de octubre de 2026, y terminó con **17/17 comprobaciones**. El informe original de Actions está archivado en `discovery-after-refresh-20261028.json`.

El primer informe local anterior al refresco aprobó 16/17: todas las superficies y búsquedas estaban bien; ¿Qué cocino? todavía devolvía la etiqueta anterior. Se conserva en `discovery-before-refresh-20261028.json`. Una nueva lectura independiente de la URL habitual de ¿Qué cocino?, después del refresco, confirmó el chip **Papa** y el mismo ID canónico en el primer intento; su evidencia está en `pantry-after-refresh-20261028.json`.

Estos resultados verifican las respuestas observadas y la corrección del ingrediente. La sesión particular del usuario y la causa precisa de su discrepancia anterior no quedaron reproducidas de forma concluyente. El PR registra una corrección de datos ya aplicada y su auditoría; no necesita desplegar código nuevo para mostrar Papa.


