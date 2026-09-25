# FASE 1K.8 — AUDITORÍA DE TIEMPOS V1 — 20260925

## Resultado
En las 134 recetas ES publicadas:
- 24 tienen prep_time, cook_time y total_time.
- 110 no tienen total_time.
- Los valores existentes están almacenados como minutos numéricos.
- 7 recetas presentan total_time distinto de prep_time + cook_time.
- Rango de total_time existente: 10–320 minutos.

## Inconsistencias detectadas
- Horchata de arroz: 15 + 0 = 15; total 255.
- Helado casero de vainilla: 25 + 15 = 40; total 280.
- Cheesecake de agraz: 30 + 50 = 80; total 320.
- Pie de maracuyá: 25 + 40 = 65; total 185.
- Salsa de ajo cremosa: 15 + 0 = 15; total 75.
- Porra antequerana: 20 + 0 = 20; total 80.
- Pulpo a la Gallega: 15 + 60 = 75; total 80.

## Decisión
No se corrigen automáticamente estos 7 valores. La diferencia puede representar reposo, enfriado, hidratación u otros tiempos que no están separados en prep/cook. El modelo actual no permite saberlo con seguridad.

Tampoco se rellenan los 110 valores ausentes mediante inferencia.

## Producto
`total_time_minutes` puede utilizarse como filtro V1 cuando existe. Las recetas sin dato deben seguir siendo visibles y no recibir un tiempo inventado.

## Próximo paso
Auditar manualmente las 7 inconsistencias y, después, decidir si el modelo de tiempo necesita un tercer concepto explícito de tiempo activo/pasivo antes de corregir datos históricos.

## Nota de seguridad
La documentación oficial de Supabase recomienda proteger las tablas expuestas con RLS y usar políticas para controlar las filas accesibles. Esta auditoría no cambia todavía las políticas de seguridad.
