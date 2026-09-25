# FASE 1H.4 — AUDITORÍA DE INGREDIENTES PENDIENTES

**Fecha:** 2026-09-25  
**Estado:** AUDITADO — NO CERRADO

La auditoría actual muestra que todavía existen variantes de ingredientes que no deben resolverse mediante un único algoritmo agresivo.

## Grupos detectados

### 1. Variantes claramente normalizables
Ejemplos:
- ajo picado / ajo picados / ajo, picados;
- comino molido / comino en polvo;
- pimienta negra molida / pimienta negra recién molida;
- espinacas frescas;
- perejil fresco;
- pimiento rojo picado;
- tomates maduros;
- queso parmesano rallado;
- queso mozzarella rallado;
- vino blanco seco.

Estas variantes pueden pasar a revisión de alias, pero **no se modificará el texto original de la receta**.

### 2. Expresiones que contienen preparación
Ejemplos:
- mantequilla derretida;
- cebolla picada;
- jengibre fresco rallado;
- ajo picado.

La preparación debe vivir separada del nombre canónico cuando podamos extraerla con seguridad.

### 3. Expresiones que contienen cantidad
Ejemplos:
- 2 cucharadas de aceite de oliva;
- 1 cucharadita de esencia de vainilla.

Estas no deben registrarse como simples aliases. Requieren separar cantidad/unidad del ingrediente cuando el parser pueda hacerlo con seguridad.

### 4. Ingredientes ambiguos o que requieren criterio
No se deben fusionar automáticamente:
- sal y pimienta al gusto;
- pimienta;
- queso rallado;
- azúcar moreno;
- esencia de vainilla;
- harina;
- alternativas o combinaciones.

## Resultado

La auditoría confirma que el modelo canónico funciona, pero que necesitamos una capa explícita para **ingredientes pendientes de resolución**.

No vamos a forzar los ingredientes que todavía no están relacionados con el catálogo.

## Siguiente paso

Crear una tabla de pendientes que conserve:
- receta;
- posición;
- texto original;
- cantidad;
- unidad;
- estado;
- motivo de revisión.

Esto permitirá que las nuevas recetas puedan publicarse sin perder información, mientras los casos ambiguos quedan identificados para una normalización posterior.

**D-082:** no se realizará normalización masiva de ingredientes ambiguos.

**D-083:** cantidad y preparación no se tratarán como aliases.

**D-084:** las combinaciones como sal y pimienta al gusto permanecerán pendientes hasta definir una regla segura.

**D-085:** el sistema conservará explícitamente los ingredientes pendientes.
