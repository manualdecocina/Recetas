# FASE 1I.4 — FLUJO INTERNO DE PUBLICACIÓN DIARIA

**Fecha:** 2026-09-25  
**Estado:** REGLA OPERATIVA

## Objetivo

Definir el proceso que se seguirá cada vez que se incorpore una receta nueva, sin necesidad de panel administrativo.

## Flujo

### 1. Crear

La receta entra como `draft` con su contenido editorial y medios disponibles.

### 2. Estructurar

Se revisan y estructuran:
- título;
- slug;
- excerpt;
- ingredientes;
- cantidades/unidades;
- preparación y notas;
- pasos;
- tiempos;
- raciones;
- dificultad;
- categoría;
- cocina;
- curso/momento;
- keywords;
- medios.

### 3. Resolver ingredientes

Cada ingrediente se busca primero en `ingredient_aliases`.

- coincidencia inequívoca → `recipe_ingredients`;
- coincidencia ambigua → `recipe_ingredient_pending`;
- ingrediente nuevo → `ingredients.status = pending` + pendiente;
- nunca se modifica el texto editorial original para conseguir una coincidencia.

### 4. Revisar

La receta pasa a `review` y se comprueban contenido, taxonomía, medios, SEO y coherencia.

### 5. Preparar publicación

Si supera los bloqueadores pasa a `ready`.

### 6. Publicar

La publicación cambia el estado a `published` y genera/actualiza las representaciones públicas necesarias.

### 7. Seguimiento

Los ingredientes pendientes permanecen registrados para futuras normalizaciones. No se convierten automáticamente en páginas SEO.

## Principio

**Publicar una receta no significa que todos sus datos secundarios tengan que estar perfectamente normalizados; significa que la receta es válida, cocinable, coherente y trazable.**

## Decisiones

**D-086:** este es el flujo operativo por defecto para toda receta nueva.

**D-087:** la normalización de ingredientes puede continuar después de publicar.

**D-088:** ningún pendiente puede destruir o sustituir el texto editorial original.
