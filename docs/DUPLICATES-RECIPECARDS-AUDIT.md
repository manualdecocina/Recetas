# DUPLICADOS RECIPE-CARDS — AUDITORÍA SC

**Fecha:** 2026-09-24

## Hallazgo

El cruce entre el inventario y el export de Search Console confirma que las URLs editoriales normales concentran el tráfico y las URLs `/recipe-cards/` no aparecen entre las páginas con tráfico registrado del export analizado.

Ejemplos con clics históricos:

| URL editorial | Clics | URL recipe-card |
|---|---:|---|
| /receta-de-pie-de-maracuya/ | 193 | /recipe-cards/pie-de-maracuya/ |
| /receta-de-salsa-de-ajo/ | 189 | /recipe-cards/salsa-de-ajo/ |
| /receta-de-rollo-de-carne/ | 74 | /recipe-cards/rollo-de-carne/ |
| /chorizo-santarosano/ | 45 | /recipe-cards/chorizo-santarosano-colombia/ |
| /receta-cheesecake-de-agraz/ | 39 | /recipe-cards/cheesecake-de-agraz/ |
| /lomo-de-cerdo-en-salsa-de-menta/ | 38 | /recipe-cards/lomo-de-cerdo-en-salsa-de-menta/ |
| /receta-de-pollo-teriyaki/ | 34 | /recipe-cards/pollo-teriyaki-con-verduras-al-wok/ |
| /receta-mejillones-al-ajillo/ | 31 | /recipe-cards/mejillones-al-ajillo/ |
| /receta-de-fajitas-mexicanas/ | 21 | /recipe-cards/fajitas-mexicanas/ |
| /receta-de-pancakes-con-fresas-y-arandanos/ | 14 | /recipe-cards/pancakes-con-fresas-y-arandanos/ |
| /pollo-alfredo-a-la-florentina/ | 13 | /recipe-cards/pollo-alfredo-a-la-florentina/ |
| /receta-de-arroz-chino/ | 7 | /recipe-cards/arroz-chino/ |
| /receta-de-burrito-mexicano/ | 2 | /recipe-cards/8708/ |

## Decisión de arquitectura

`/recipe-cards/` queda tratado como **artefacto técnico/histórico**, no como tipo de contenido editorial.

No se crean dos entidades para el mismo plato.

La URL editorial definitiva será la que entre en el catálogo nuevo. Los recipe-cards históricos se resolverán después mediante redirect/canonical/404 según equivalencia real y el URL Master.

Google indica que cuando varias URLs representan contenido igual o muy similar, deben consolidarse las señales hacia una URL representativa; además, las redirecciones deben apuntar a destinos relevantes y definitivos. citeturn0search0turn0search2

## Prioridad

P0/P1 para los pares con tráfico histórico significativo, especialmente:

1. Pie de maracuyá — 193
2. Salsa de ajo — 189
3. Rollo de carne — 74
4. Chorizo santarosano — 45
5. Cheesecake de agraz — 39
6. Lomo de cerdo en salsa de menta — 38
7. Pollo teriyaki — 34
8. Mejillones al ajillo — 31
9. Fajitas mexicanas — 21

No se ejecutan redirects todavía. Primero se cierra la URL editorial definitiva de cada entidad.
