# P0 RECIPE MODEL STAGING — 2026-09-25

Se preparó la migración de modelo para tres P0 que todavía vivían como ContentPage aunque su destino editorial es Recipe:

- `/pandebono-casero/`
- `/pollo-alfredo-a-la-florentina/`
- `/receta-de-ajiaco/`

## Estado

Cada URL tiene ahora una fila `recipes` española **staged/unpublished** con:
- URL pública histórica conservada.
- `source_url` histórica conservada como procedencia.
- título conservado como referencia.
- imagen histórica localizada cuando existía en el HTML fuente.
- ingredientes y pasos vacíos deliberadamente.
- sin publicación automática.

Las ContentPages originales siguen publicadas para no provocar un 404 durante la reconstrucción.

## E012 — cierre de staging — 2026-09-25

E012 ya no tiene campos de receta vacíos en staging.

- ES Recipe `edaa26d2-3624-458b-9309-dc5b2aad663d` — populated, unpublished.
- JA Recipe `4790daf8-3d8f-49f1-8204-2e3d0e597b43` — populated, unpublished.
- Ambos usan `recipe_group_id=10f7083a-a795-4acf-8b44-22c543e8bd2d`.
- Ambos tienen ingredientes, pasos, contenido editorial, imagen, tiempos, rendimiento y metadata.
- El contenido JA está localizado y completo.
- No se creó redirect porque la URL final ES no cambia.
- La ContentPage ES sigue temporalmente publicada hasta el cutover de publicación.

## Próximo cierre

Para cada entidad:
1. reconstruir contenido editorial nuevo;
2. poblar ingredientes/pasos/tiempos/metadatos;
3. validar imagen y schema;
4. crear traducciones bajo el mismo grupo de receta;
5. publicar Recipe;
6. retirar la ContentPage equivalente sin crear una URL paralela.

Esto mantiene la URL histórica estable mientras se cambia el modelo interno.
