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


## Implementación automática aplicada — 2026-10-04

El flujo de ingredientes quedó automatizado sin modificar el esquema consolidado de `public.recipes`.

### Al crear o cambiar una receta ES

Un trigger interno:

1. conserva intacto el texto editorial de `recipes.ingredients`;
2. intenta resolver cada nombre contra `ingredients` + `ingredient_aliases`;
3. si hay una coincidencia canónica inequívoca, crea/actualiza `recipe_ingredients`;
4. si la expresión contiene alternativas o combinaciones evidentes, la registra en `recipe_ingredient_pending` con `reason = ambiguous_expression`;
5. si no existe ninguna coincidencia y parece un ingrediente individual nuevo, crea un registro no indexable con `ingredients.status = pending` y registra el pendiente;
6. nunca convierte automáticamente un ingrediente pendiente en página SEO.

La automatización se aplica solo a la receta fuente en español, porque la herramienta pública `/es/que-puedo-cocinar` usa la taxonomía canónica en español.

### Reconciliación automática

Cuando se añade un alias o un ingrediente pendiente se convierte en `canonical`, el sistema vuelve a revisar automáticamente las recetas pendientes que coincidan con ese nombre. Si la coincidencia ya es inequívoca, el pendiente desaparece y se crea `recipe_ingredients`.

### Publicación

Se mantiene **D-087**: una receta válida puede publicarse aunque queden expresiones ambiguas en `recipe_ingredient_pending`. La herramienta nunca debe declarar “¡Lo tienes todo!” mientras exista un ingrediente editorial sin relación canónica.

### Seguridad

Las funciones de sincronización viven en el esquema interno `private`, usan `SECURITY DEFINER` con `search_path = ''` y no tienen permiso de ejecución para `PUBLIC`, `anon` ni `authenticated`.

### Verificación 2026-10-04

- prueba transaccional: ingrediente canónico conocido → relación automática;
- prueba transaccional: ingrediente desconocido → `ingredients.status=pending` + pendiente;
- prueba transaccional: pendiente promovido a `canonical` → reconciliación automática y creación de relación;
- las 20 recetas ES publicadas fueron reconciliadas;
- quedan pendientes únicamente expresiones realmente ambiguas o ingredientes todavía no aprobados;
- el Security Advisor no reporta las funciones internas como expuestas.


### Regla específica para aceites — 2026-10-04

El catálogo no usa un canonical genérico `aceite`.

Por ahora solo existen como canónicos:
- `Aceite de oliva`
- `Aceite vegetal`

Si una receta indica únicamente `aceite`, se considera una expresión ambigua y queda en `recipe_ingredient_pending` hasta precisar el tipo.

Otros aceites (por ejemplo, aceite de coco) solo se crean como canonical cuando una receta realmente los use de forma explícita.
