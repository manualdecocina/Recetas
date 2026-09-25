# FASE 1H.5 — ESTRUCTURA COMPLETA DEL INGREDIENTE

**Fecha:** 2026-09-25  
**Estado:** IMPLEMENTADO

La relación canónica de ingredientes ya permite conservar separadamente:

- ingrediente canónico;
- cantidad;
- unidad;
- preparación;
- nota;
- posición.

## Principio editorial

El texto original de la receta sigue siendo la fuente editorial. La estructura canónica sirve para descubrimiento, reutilización y futuras funciones de producto.

Ejemplos:

- 2 cebollas → ingrediente + cantidad;
- 2 cebollas, picadas finamente → ingrediente + cantidad + preparación;
- 1 limón, para decorar → ingrediente + cantidad + nota;
- ingrediente con alternativa → no fusionar automáticamente.

## Implementación

Se añadió `note` a `public.recipe_ingredients`.

También se añadió índice por receta y posición.

Esto deja preparada la capa de datos para:

- mostrar ingredientes estructurados;
- conservar preparación y notas;
- generar listas de compra en el futuro;
- ajustar cantidades por raciones cuando el dato sea seguro;
- mejorar descubrimiento por ingrediente.

## Regla

No se modifica el JSON editorial original para conseguir esta estructura.

**D-089:** preparación y nota son atributos del uso del ingrediente, no aliases del ingrediente canónico.

**D-090:** la posición del ingrediente forma parte de la relación receta-ingrediente.

**D-091:** la estructura canónica amplía el contenido; no sustituye el texto editorial original.
