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

## Auditoría manual de las 7 inconsistencias
Las recetas fueron revisadas contra sus pasos publicados. Las diferencias son explicables por tiempos pasivos o de proceso:
- Horchata de arroz: 4 h de remojo + 1 h de refrigeración; 255 min es coherente con el proceso.
- Helado casero de vainilla: al menos 4 h de refrigeración, además de congelación; 280 min es coherente como mínimo editorial.
- Cheesecake de agraz: al menos 4 h de refrigeración; 320 min es coherente.
- Pie de maracuyá: al menos 2 h de refrigeración; 185 min es coherente.
- Salsa de ajo cremosa: al menos 1 h de refrigeración; 75 min es coherente.
- Porra antequerana: al menos 1 h de refrigeración; 80 min es coherente.
- Pulpo a la Gallega: cocción de 45–60 min + preparación/reposo; 80 min es coherente.

No se modifica ningún valor histórico.

## Cierre V1
- Las 24 recetas con tiempo completo conservan su información existente.
- Las 110 recetas sin tiempo total permanecen sin tiempo.
- `total_time_minutes` queda aprobado como filtro V1 cuando existe.
- Para nuevas recetas, conviene separar en el modelo futuro tiempo activo y tiempo pasivo para representar correctamente procesos de reposo, enfriado, remojo y congelación.

## Nota de seguridad
La documentación oficial de Supabase recomienda proteger las tablas expuestas con RLS y usar políticas para controlar las filas accesibles. Esta auditoría no cambia todavía las políticas de seguridad.
