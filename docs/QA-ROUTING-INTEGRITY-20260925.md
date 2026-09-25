# QA ROUTING / INTEGRIDAD — 2026-09-25

## Verificación directa contra Supabase

Consulta ejecutada sobre el proyecto real `eqbdtctxbpepbeickhqi`.

- Duplicados de `public_path` entre Recipes publicadas: **0**
- Duplicados de `public_path` entre ContentPages publicadas: **0**
- Solapamientos `public_path` entre Recipe publicada y ContentPage publicada: **0**
- Recipes staged incompletas según el gate operativo: **1**
- Redirects activos: **1**

## Registro staged excepcional

`la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`

- publicada: false
- imagen: ausente
- prep/cook/total: ausentes
- servings: ausente
- permanece fuera del catálogo
- redirect 308 existente hacia `/es`

No se modifica ni se publica.

## Migraciones

La historia remota de Supabase incluye las migraciones de recuperación, consolidación, metadatos, reconstrucciones y cierre de bloqueadores hasta:

`20260925031444 complete_remaining_recipe_total_times`

## Conclusión

La integridad de rutas públicas publicadas queda verificada sin colisiones Recipe/ContentPage.

El único registro staged que falla el gate de completitud es el registro ya descartado y redirigido.

Esto no equivale a verificación de producción HTTP: build, start y smoke tests de Hostinger siguen pendientes de ejecución externa.

## Siguiente gate

1. Resolver editorialmente las 20 localizaciones no-ES.
2. Cerrar los 5 pares ContentPage → Recipe.
3. Cerrar P3/P4 y revisión editorial pendiente.
4. Ejecutar typecheck/tests/build en CI o Hostinger.
5. Ejecutar smoke tests HTTP después del deploy.
