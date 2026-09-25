# FASE 1H.2 — Plan de migración de ingredientes de alta confianza

**Fecha:** 2026-09-25  
**Estado:** PLAN PREPARADO — EJECUCIÓN DE DATOS PENDIENTE

## Objetivo

Migrar una primera muestra pequeña y verificable desde el JSON histórico de ingredientes hacia el modelo canónico creado en Supabase.

## Muestra inicial

Se seleccionan cinco familias con evidencia suficiente:

- Ajo — 50 apariciones en las variantes seleccionadas.
- Aceite de oliva — 44.
- Huevo — 24.
- Pimienta negra — 17.
- Comino — 14.

La cifra es la cantidad de apariciones de las variantes incluidas en la muestra, no una afirmación de recetas únicas.

## Variantes incluidas

### Ajo
- ajo
- ajo picado
- ajo picados
- ajo, picados
- ajo, picados finamente

### Huevo
- huevo
- huevos
- huevos grandes
- huevos batidos

### Aceite de oliva
- aceite de oliva
- aceite de oliva virgen extra
- aceite de oliva extra virgen

### Comino
- comino molido
- comino en polvo
- comino al gusto

### Pimienta negra
- pimienta negra
- pimienta negra molida
- pimienta al gusto
- pimienta negra al gusto
- pimienta negra recién molida

## Criterio de migración

La migración debe:

1. Crear/usar la entidad canónica.
2. Registrar el alias original normalizado.
3. Crear la relación receta → ingrediente.
4. Conservar la posición original.
5. Conservar cantidad y unidad cuando ya existan como propiedades del JSON.
6. No modificar el JSON original.
7. Poder auditarse comparando el origen con la relación nueva.

## Validación posterior obligatoria

Después de la carga se deben obtener:

- número de entidades canónicas;
- número de aliases;
- número de relaciones `recipe_ingredients`;
- recetas únicas afectadas;
- distribución por ingrediente;
- posibles duplicados;
- relaciones cuyo alias no debería haberse asignado.

## Criterio de aceptación

La primera migración solo se considerará correcta si:

- no modifica `recipes.ingredients`;
- cada relación procede de una variante explícitamente aprobada;
- no aparecen ingredientes alternativos fusionados;
- la posición original se conserva;
- la cobertura coincide con la consulta de auditoría;
- no se generan relaciones duplicadas.

## Lo que NO se hará todavía

- No migrar todos los ingredientes.
- No crear páginas SEO de ingredientes.
- No crear sinónimos lingüísticos especulativos.
- No interpretar automáticamente alternativas.
- No convertir preparación o notas en ingredientes.
- No eliminar el JSON histórico.

## Decisión

**D-056:** la primera migración será una prueba controlada de cinco familias de ingredientes de alta confianza y tendrá que superar una validación de cobertura antes de ampliar el vocabulario.

**D-057:** cualquier fallo de la prueba se corrige en el modelo o reglas antes de escalar la migración.
