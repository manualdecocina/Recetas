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

