# QA — CONTENTPAGE → RECIPE — BLOQUE 38 — 2026-09-25

## Alcance
Bloque de 20 entidades procesado desde la cola estable de consolidación:

1. alitas-de-pollo-al-horno
2. arroz-con-leche-el-postre-casero
3. arroz-frito
4. arroz-mixto
5. empanadas-colombianas
6. ensalada-cesar
7. ensalada-de-espinacas-y-fresas
8. ensalada-de-pollo-y-aguacate
9. paella-valenciana
10. pandebono-casero
11. pasta-con-salsa-de-tomate-y-albondigas
12. pasta-primavera-con-salsa-de-tomate-asado-y-albondigas-de-pollo
13. pollo-a-la-naranja
14. pollo-alfredo-a-la-florentina
15. receta-clasica-de-galletas-toll-house
16. receta-de-aborrajado
17. receta-ensalada-caprese
18. receta-sopa-minestrone-saludable
19. salmon-a-la-parrilla-con-salsa-de-limon-y-hierbas
20. salmon-en-air-fryer-saludable

## Verificación Supabase
Las 20 entidades tienen Recipe existente. Para las 19 entidades no publicadas se verificó presencia de imagen, ingredientes y pasos; todas presentan contenido estructurado no vacío. Sus campos de tiempos/porciones están completos.

Pollo Alfredo ya está publicado como Recipe y su ContentPage equivalente está sin publicar.

En las restantes conversiones, el ContentPage equivalente sigue publicado. No se retira todavía porque el gate exige que la Recipe equivalente esté lista para el modelo final y publicada antes de retirar la representación paralela.

## Resultado
No se realizaron publicaciones, retiros de ContentPages, cambios de URL ni cambios de contenido. Esto es deliberado: la existencia de una Recipe staged completa no autoriza publicación mientras sigan abiertos los gates de URL Master, canonical/hreflang, schema, sitemap y despliegue.

## Bloqueos
No se detectó un bloqueo de imagen o de contenido estructurado nuevo dentro de estas 20 entidades. El bloqueo operativo común sigue siendo el gate de publicación/consolidación.

## Estado
STAGED / CONSOLIDACIÓN PENDIENTE.
