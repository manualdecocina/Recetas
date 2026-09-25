# QA — BLOQUE METADATA REMANENTE 2026-09-25 (cierre)

## Alcance
Revisión final de las 3 Recipes staged que permanecían con metadata incompleta después de las verificaciones históricas adicionales.

## Resultado
### 1. receta-de-papas-al-horno-y-los-beneficios-para-la-salud
- staged / published=false.
- cook_time_minutes=50: respaldado por la instrucción explícita de horneado de 40–50 min.
- prep_time_minutes, servings y total_time_minutes: sin evidencia histórica inequívoca localizada.
- source_url: null.
- La documentación editorial confirma que es un caso NEW_SEED/consolidación con contenido de papas al horno y claims de salud; no se completa metadata por inferencia.

### 2. salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes
- staged / published=false.
- cook_time_minutes=12: respaldado por la instrucción explícita de cocción de 10–12 min.
- Existe evidencia de imagen histórica en el repositorio, pero no se localizó una página histórica inequívoca con prep/servings.
- prep_time_minutes, servings y total_time_minutes: bloqueados por falta de evidencia.
- source_url: null.
- Clasificado previamente como NEW_SEED independiente.

### 3. sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico
- staged / published=false.
- cook_time_minutes=43: respaldado por la suma documentada de fases explícitas 8–10 + 1 + 5 + 15 + 8–10 + 2, tomando extremos superiores.
- Existe evidencia de imagen histórica y documentación de consolidación con la entidad Minestrone.
- No se localizó una fuente histórica inequívoca que permita fijar prep/servings.
- prep_time_minutes, servings y total_time_minutes: bloqueados por falta de evidencia.
- No se fusiona automáticamente con la Recipe "receta-sopa-minestrone-saludable" porque pertenece a otro recipe_group_id.

## Regla aplicada
No se inventan prep, servings ni total_time. Las tres permanecen staged y fuera de publicación hasta que aparezca evidencia verificable.

## Verificación
Consulta directa de Supabase posterior: las tres siguen published=false y conservan únicamente los cook times respaldados.

## Estado
Bloque cerrado por evidencia insuficiente; no hay cambios de datos en este cierre.
