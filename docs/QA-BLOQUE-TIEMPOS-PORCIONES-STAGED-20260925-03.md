# QA STAGED — TIEMPOS Y PORCIONES 20260925-03

Fecha: 2026-09-25
Estado: STAGED / NO PUBLICAR

## Bloque procesado

Se revisaron las 24 recetas que permanecían sin tiempos ni porciones estructurados.

### Cierre con evidencia

- `receta-facil-de-pasta-al-pesto-casera`
  - `total_time_minutes = 15`
  - Evidencia editorial existente: el contenido de la receta indica que se prepara en solo 15 minutos.
  - No se inventó rendimiento.

### No cerrados por falta de evidencia suficiente

Se conservaron los campos en NULL cuando el contenido solo aporta tiempos parciales, rangos o referencias que no permiten derivar de forma segura un campo estructurado completo.

Ejemplos revisados:
- salmón: 10–12 min de cocción + precalentamiento/reposo; no se fuerza un único valor.
- bowl de carne: 20 min para el camote y 2 min de caramelización; no equivale a tiempo total de receta.
- empanadas: 20–25 min de horno; no se fuerza un único valor.
- lasaña: varias fases de cocción y 40–45 min de horno; no se fuerza un total.
- pan de plátano: 50–60 min de horno; no se convierte el rango en un valor inventado.
- sopa minestrone: múltiples fases con rangos; no se deriva un total.
- arroz con leche: 10–12 min + 20–30 min; no se deriva un total.
- mousse: menos de 10 min y refrigeración mínima de 1 h; no se convierte en un entero arbitrario.

## Porciones

No apareció evidencia fiable suficiente para asignar servings al bloque sin recurrir a inferencias.

## Bloqueos mantenidos

- `irresistible-salmon-en-air-fryer-con-costra-de-hierbas-y-limon`: imagen aún sin evidencia principal válida.
- `la-guia-definitiva-para-lograr-un-verde-esmeralda-perfecto`: bloqueo de entidad/origen ya documentado; no se trata como receta válida por defecto.
- Persisten 23 recetas staged sin ningún campo estructurado de tiempo/rendimiento completo tras este cierre.

## Regla aplicada

No se inventaron tiempos, porciones ni conversiones de rangos a valores únicos. No se publicó ninguna receta y no se activaron redirects.
