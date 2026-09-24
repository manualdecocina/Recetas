# AUDITORÍA DE LIMPIEZA — PRIMEROS RESULTADOS

**Fecha:** 2026-09-24  
**Fuente:** `migracion-inventario.csv`  
**Estado:** hallazgos para revisión/control; no modifica producción.

## Resultado del inventario

El inventario contiene 392 filas correspondientes a 368 URLs publicadas.

## Afiliación/productos — FUERA DEL NUEVO CATÁLOGO

Se identificaron 8 URLs claramente orientadas a productos/equipamiento y no a recetas:

1. `/licuadoras-para-cocina/` — Licuadoras Para Cocina
2. `/mejor-batidora-de-vaso-en-2025/` — Guía para elegir la mejor batidora de vaso en 2025
3. `/ollas-multiuso/` — Ollas Multiuso
4. `/productos-cocina-cafeteras/` — Cafeteras
5. `/productos-de-cocina-recomendados-por-el-chef/` — Productos de Cocina
6. `/utensilios-de-cocina/` — Utensilios de Cocina
7. `/refrijeradores-de-cocina/` — Refrijeradores de Cocina
8. `/baterias-de-cocina/` — Baterías de Cocina

**Decisión editorial:** no reconstruir estas páginas como parte del nuevo catálogo de Manual de Cocina. No se crea una nueva sección de Amazon/afiliación.

**Decisión SEO:** todavía no borrar ni redirigir en producción. Cada URL se cruzará con Search Console y redirects para decidir `301`, `MERGE` o `404/410`.

## Clones técnicos / recipe-cards

El inventario tiene **77 pares de URLs con el mismo título normalizado**. Una parte importante corresponde a una URL de contenido y otra a una URL `/recipe-cards/...` generada por el sistema de recetas.

Esto es un hallazgo de limpieza de primer nivel: no debemos reconstruir ambas como páginas editoriales independientes.

Ejemplos detectados:

- `/receta-de-alfajores-de-maicena/` ↔ `/recipe-cards/alfajores-de-maicena/`
- `/receta-arepa-con-todo/` ↔ `/recipe-cards/arepa-con-todo/`
- `/receta-de-arroz-chino/` ↔ `/recipe-cards/arroz-chino/`
- `/arroz-pilaf/` ↔ `/recipe-cards/7671/`
- `/receta-de-burrito-mexicano/` ↔ `/recipe-cards/8708/`
- `/casuela-de-frijoles-colombianos/` ↔ `/recipe-cards/casuela-de-frijoles-colombianos/`

Estos pares quedan clasificados como **DUPLICATE_CANDIDATE** hasta comprobar Search Console y el destino/canonical actual.

## No todo duplicado de título es automáticamente el mismo contenido

La igualdad de título no basta para ejecutar un 301. Antes de consolidar se comprobará la equivalencia real de intención y contenido, y se elegirá una única URL editorial.

## Contenido sensible / claims de salud

El inventario contiene páginas/recetas con lenguaje de salud fuerte, por ejemplo:

- `Jugo Anticancerígeno`
- `Sopa Saludable para Enfermos`
- `Consejos Esenciales para una Dieta Saludable`
- `Principios de una Dieta Saludable para Personas Enfermas`

No se eliminan automáticamente por el título. Se clasifican para **REVISIÓN EDITORIAL** porque el nuevo contenido debe evitar promesas médicas o afirmaciones no respaldadas y debe determinar si realmente pertenece al catálogo de cocina.

## Próxima acción

Cruzar los 6 candidatos de afiliación y los 77 pares de duplicados contra Search Console y `content_redirects`. Después asignar una acción concreta a cada URL:

`KEEP` / `MERGE` / `301` / `404-410`.

El resultado debe incorporarse al URL Master antes de modificar producción.
