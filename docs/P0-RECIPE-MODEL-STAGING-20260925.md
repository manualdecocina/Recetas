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

## Próximo cierre

Para cada entidad:
1. reconstruir contenido editorial nuevo;
2. poblar ingredientes/pasos/tiempos/metadatos;
3. validar imagen y schema;
4. crear traducciones bajo el mismo grupo de receta;
5. publicar Recipe;
6. retirar la ContentPage equivalente sin crear una URL paralela.

Esto mantiene la URL histórica estable mientras se cambia el modelo interno.
