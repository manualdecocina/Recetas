# E012 / E014 — transición editorial coordinada

Fecha: 2026-09-25

Se ejecutó la transición coordinada de las dos entidades que tenían ContentPage publicado y Recipe staged en la misma URL ES:

- E012 /pollo-alfredo-a-la-florentina: ContentPage -> unpublished; Recipe ES -> published.
- E014 /receta-de-ajiaco: ContentPage -> unpublished; Recipe ES -> published.

Las localizaciones JA/IT permanecen staged y no publicadas.

La transición se realizó en una única transacción para evitar un estado público simultáneo Recipe/ContentPage.

Siguiente gate: QA final de rutas, metadata, canonical/hreflang, sitemap y datos estructurados en despliegue.
