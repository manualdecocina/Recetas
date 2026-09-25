# QA — Preparación de consolidación/publicación — lote 1

Fecha: 2026-09-25

## Alcance
Primer lote de 10 entidades Recipe actualmente STAGED/UNPUBLISHED con ContentPage publicado en la misma URL/lenguaje.

1. pandebono-casero — /pandebono-casero
2. ensalada-de-pollo-y-aguacate — /ensalada-de-pollo-y-aguacate
3. pasta-con-salsa-de-tomate-y-albondigas — /pasta-con-salsa-de-tomate-y-albondigas
4. empanadas-colombianas — /empanadas-colombianas
5. arroz-con-leche-el-postre-casero — /arroz-con-leche-el-postre-casero
6. ensalada-cesar — /ensalada-cesar
7. arroz-mixto — /arroz-mixto
8. alitas-de-pollo-al-horno — /alitas-de-pollo-al-horno
9. pollo-a-la-naranja — /pollo-a-la-naranja
10. paella-valenciana — /paella-valenciana

## Verificación de estado
- Recipe: STAGED/UNPUBLISHED.
- ContentPage equivalente: PUBLISHED.
- La URL pública no se libera del ContentPage antes de que el Recipe esté publicado, porque el resolver de la aplicación solo sirve Recipes publicados y ContentPages publicados.
- No se ejecuta todavía el cambio de publicación ni el retiro del ContentPage.

## Gate
El lote queda preparado para una transición atómica/ordenada cuando exista verificación de despliegue:
1. publicar Recipe;
2. verificar resolución de URL, canonical, hreflang, Recipe JSON-LD, BreadcrumbList y sitemap en el despliegue;
3. retirar el ContentPage equivalente solo después de confirmar que Recipe resuelve correctamente;
4. ejecutar smoke test HTTP posterior al despliegue.

## Bloqueo actual
La verificación de producción/deploy sigue pendiente. La consulta web anterior no permitió verificar robots.txt, sitemap.xml ni una URL de receta en producción, y GitHub no mostró ejecuciones de CI disponibles. Por tanto, este documento no autoriza publicación.

## Regla
No se modifica el contenido editorial ni se inventan datos en este paso. El objetivo es dejar definido el primer lote seguro de consolidación, preservando las URLs existentes.
