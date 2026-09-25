# QA — BLOQUE METADATA STAGED 2026-09-25 — continuación

Se procesó el siguiente bloque de candidatos con metadata incompleta.

Cambios respaldados directamente por instrucciones existentes:
- chili-con-carne-express: cook_time_minutes=20, por instrucción de cocción de 15–20 min.
- receta-de-papas-al-horno-y-los-beneficios-para-la-salud: cook_time_minutes=50, por instrucción de horneado de 40–50 min.
- receta-de-pan-de-platano-clasico: cook_time_minutes=60, por instrucción de horneado de 50–60 min.

Verificación posterior en Supabase: los tres valores quedaron almacenados y las recetas siguen published=false.

No se completaron prep/servings/total cuando no existía evidencia suficiente.
