# FASE 1K.6 — NORMALIZACIÓN DIFFICULTY V1 — 20260925

## Estado
APLICADA Y VERIFICADA

Se normalizaron únicamente los valores históricos inequívocos de dificultad de las 134 recetas ES publicadas.

### Antes
- Fácil: 83
- fácil: 6
- facil: 2
- Facil: 1
- F'acil: 1
- Media: 24
- Medio: 14
- NULL: 3

### Después
- Fácil: 93
- Media: 38
- NULL: 3

## Reglas
- Las variantes de Fácil se unificaron en Fácil.
- Medio se unificó en Media.
- Los 3 valores nulos permanecen nulos.
- No se inventaron dificultades.
- No se modificaron recetas fuera de ES publicado.
- No se creó una nueva tabla porque el dominio es pequeño, estable y pertenece directamente a la receta.

## Decisiones
- D-149 — Difficulty V1 usa exactamente dos valores canónicos: Fácil y Media.
- D-150 — Los valores históricos inequívocos se normalizan directamente.
- D-151 — La ausencia de dificultad se conserva como ausencia.
- D-152 — Difficulty queda disponible como filtro V1.
