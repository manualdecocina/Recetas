# QA — BLOQUE METADATA STAGED 2026-09-25 — BLOQUE 36

## Alcance
Bloque estable de 20 Recipes staged con metadata incompleta, ordenado por `language, slug, id`:

1. albondigas-suecas
2. bowl-de-carne-con-miel-picante-y-queso-cottage
3. chili-con-carne-express
4. empanadas-argentinas
5. espaguetis-con-salsa-de-carne
6. hamburguesas-caseras
7. irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon
8. la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto
9. lasana-de-sarten
10. pastel-de-carne
11. picadillo-de-carne-molida-rapido-y-facil
12. receta-clasica-de-galletas-toll-house-original-con-chispas-de-chocolate
13. receta-de-arroz-con-leche-un-postre-reconfortante
14. receta-de-pan-de-platano-clasico
15. receta-de-papas-al-horno-y-los-beneficios-para-la-salud
16. receta-de-souffle-de-queso-esponjoso
17. receta-facil-de-pasta-al-pesto-casera
18. salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes
19. sloppy-joes
20. solomillo-de-pavo-glaseado-con-cafe-y-chipotle-sobre-hummus-de-edamame

## Resultado

Se revisaron los campos `prep_time_minutes`, `cook_time_minutes`, `total_time_minutes` y `servings` contra el contenido estructurado actual y la documentación QA previa.

Los tiempos de cocción ya establecidos en bloques anteriores se mantienen cuando están respaldados por instrucciones explícitas. No se completan prep, total ni servings cuando requieren inferencia.

Valores parciales confirmados en este bloque:
- albondigas-suecas: cook 10
- chili-con-carne-express: cook 20
- empanadas-argentinas: cook 25
- espaguetis-con-salsa-de-carne: cook 15
- hamburguesas-caseras: cook 10; servings 4
- irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon: cook 12
- lasana-de-sarten: cook 45; total 55
- pastel-de-carne: cook 45
- picadillo-de-carne-molida-rapido-y-facil: cook 15
- receta-de-arroz-con-leche-un-postre-reconfortante: cook 30
- receta-de-pan-de-platano-clasico: cook 60
- receta-de-papas-al-horno-y-los-beneficios-para-la-salud: cook 50
- receta-de-souffle-de-queso-esponjoso: cook 25
- receta-facil-de-pasta-al-pesto-casera: total 15
- salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes: cook 12
- sloppy-joes: cook 10

Sin evidencia suficiente para completar de forma segura los campos restantes. No se publican recetas ni se alteran URLs.

## Bloqueos reales
- `irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon`: bloqueo de imagen ya conocido; sigue sin imagen verificada.
- `la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`: bloqueo de imagen ya conocido y bloqueo editorial de identidad/título; no se modifica identidad por inferencia.
- Los restantes huecos de metadata permanecen abiertos cuando no existe evidencia suficiente.

## Incidente de control y reversión
La consulta inicial se ejecutó erróneamente sobre todas las Recipes incompletas, en lugar de limitarse a `published=false`. Se aplicaron temporalmente valores de metadata a 8 Recipes publicadas fuera del bloque objetivo. Se detectó el desvío inmediatamente y se restauraron esos 8 registros a sus valores previos NULL. No queda cambio neto en esas entidades.

El conteo operativo correcto de Recipes staged con metadata incompleta vuelve a ser 24 antes de este bloque; este bloque no modifica ese conteo porque no había evidencia nueva suficiente para cerrar campos adicionales.

## Estado
STAGED. No hay autorización de publicación derivada de este QA.
