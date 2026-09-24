# P1 español — estado del modelo Supabase — 2026-09-24

## Resultado

De las 14 URLs P1 revisadas en este bloque:

- **12** ya están modeladas como `Recipe`.
- **2** están como `content_pages` aunque representan recetas: Empanada Peruana y Pollo Alfredo.
- Todas las URLs revisadas tienen procedencia `source_url` en Supabase.
- Los `recipe_group_id` existentes permiten mantener una sola entidad por receta.

## KEEP / REBUILD directo

Estas ya tienen modelo Recipe y pueden conservar su entidad actual:

- /receta-bondiola-de-cerdo/
- /receta-de-pie-de-maracuya/
- /receta-de-salsa-de-ajo/
- /creep-stroganoff/
- /receta-de-rollo-de-carne/
- /receta-envuelto-de-choclo/
- /receta-cheesecake-de-agraz/
- /lomo-de-cerdo-en-salsa-de-menta/
- /receta-de-pancakes-con-fresas-y-arandanos/
- /cangrejo-al-limon/
- /receta-helado-casero/
- /receta-trucha-al-ajillo-con-limon/

No deben recibir una nueva entidad solo por cambiar el routing.

## Corrección de modelo requerida

### /empanada-peruana-de-pollo/

Modelo actual:
- content_pages

Existe una Recipe NEW_SEED con el mismo slug.

Decisión:
- consolidar ambas;
- utilizar una única entidad Recipe ES;
- posteriormente añadir IT cuando se reconstruya el contenido localizado.

### /pollo-alfredo-a-la-florentina/

Modelo actual:
- content_pages

Decisión:
- si el contenido nuevo mantiene intención de receta, migrar al modelo Recipe;
- conectar con la entidad E012 y la URL JA histórica;
- no mantener una ContentPage paralela.

## Caso especial: /creep-stroganoff/

La entidad está modelada como Recipe y conserva la URL histórica. No cambiar el slug solo por ser inusual.

Primero se valida que la receta nueva corresponda realmente a la intención histórica. Si es así, KEEP.

## Regla de modelo

Para las URLs históricas que se conservan:

- Recipe histórica válida → conservar el `recipe_group_id`;
- no crear otra Recipe para el mismo source_url;
- no mantener ContentPage paralela si el tipo final es Recipe;
- canonical y schema deben corresponder a la URL definitiva.

## Redirects

El modelo actual tiene redirects hacia rutas /es/... para muchas de estas URLs. Esas filas quedan en REVISAR hasta que el router permita servir la URL raíz histórica cuando el URL Master la apruebe.

No se ejecutan modificaciones de datos en esta fase.
