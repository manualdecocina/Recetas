# QA — Preparación de consolidación/publicación — lote 4

Fecha: 2026-09-25

## Alcance
Último tramo del conjunto de Recipe STAGED/UNPUBLISHED con ContentPage publicado en la misma URL/lenguaje. La consulta devolvió 18 entidades, no 20, porque el universo total de solapamientos es 48.

Entidades:
- pure-de-papa-cremoso
- crema-de-calabaza
- tarta-de-manzana-clasica
- estofado-de-res-con-papas-y-zanahorias
- huevos-revueltos-con-espinacas-y-tomates
- filete-mignon
- bulgogi-carne-marinada-coreana
- casuela-de-mariscos
- revuelto-de-gramajo-vegetariano
- dip-de-aguacate-y-frijoles-negros
- mini-quiches-de-espinaca-y-queso-feta
- sangria-cacera
- papa-rellena-colombiana
- tiramisu
- preparacion-de-aceites-aromatizados-para-cocina
- como-preparar-mayonesa-casera
- tacos-al-pastor-mexico
- solomillo-de-pavo-glaseado-cafe-edamame

## Verificación
18/18 tienen imagen, ingredientes, pasos, tiempos, porciones y SEO title/description.

Universo de solapamientos confirmado: 48 Recipe STAGED + ContentPage PUBLISHED, todos en ES.

No se modificaron datos editoriales ni se ejecutó publicación/despublicación.

## Gate pendiente
La consolidación requiere primero verificación de despliegue/producción: resolución pública, canonical/hreflang, Recipe JSON-LD, BreadcrumbList, sitemap y smoke test HTTP.
