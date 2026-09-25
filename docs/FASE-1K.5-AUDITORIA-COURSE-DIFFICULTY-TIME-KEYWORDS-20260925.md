# FASE 1K.5 — AUDITORÍA COURSE / DIFFICULTY / TIME / KEYWORDS — 20260925

## Estado
AUDITADA — SIN MIGRACIÓN MASIVA

## Course

En 134 recetas ES publicadas:
- 125 sin valor.
- 5 "Plato principal".
- 1 "Entrada".
- 1 "Aperitivo o plato principal".
- 1 "Aperitivo / plato principal".
- 1 "Entrante".

Conclusión: `course` no tiene suficiente cobertura ni consistencia para ser dimensión estructural V1 todavía. Puede conservarse como campo editorial y normalizarse más adelante.

## Difficulty

Valores:
- Fácil: 83
- Media: 24
- Medio: 14
- fácil: 6
- facil: 2
- Facil: 1
- F'acil: 1
- NULL: 3

Conclusión: la dimensión sí tiene cobertura suficiente para ser filtro V1, pero requiere normalización canónica:
- Fácil
- Media

No se inventa dificultad para las 3 recetas sin dato.

## Total time

Solo 24/134 recetas tienen total_time_minutes:
- 0–20: 5
- 21–40: 3
- 41–60: 2
- 61–120: 9
- 121+: 5
- NULL: 110

Conclusión: el tiempo es una dimensión útil para el producto, pero el histórico actual no permite presentarlo como filtro completo sin una futura recuperación de datos. No se rellenan tiempos por inferencia.

## Keywords

Las 134 recetas prácticamente tienen keywords (solo 1 no tiene). Sin embargo, el contenido muestra una mezcla extrema:
- ingredientes;
- títulos;
- consultas de búsqueda;
- errores ortográficos;
- frases completas;
- atributos nutricionales;
- dietas;
- técnicas;
- países/cocinas;
- ocasiones;
- términos duplicados por mayúsculas;
- términos irrelevantes o de baja calidad SEO.

Conclusión: `keywords` no puede convertirse directamente en una taxonomía pública ni en filtros.

Debe tratarse como legado editorial/SEO mientras se define un futuro sistema de tags controlados.

## Matriz V1

| Dimensión | V1 | Acción |
|---|---|---|
| Categoría | Sí | Mantener canónica |
| Ingrediente | Sí | Modelo canónico ya creado |
| Cocina | Sí | Modelo canónico ya creado |
| Dificultad | Sí | Normalizar valores |
| Tiempo | Sí | Usar cuando exista; no inventar históricos |
| Course | No como filtro principal todavía | Mantener y revisar |
| Keywords | No | Legado / futuro tags |
| Protagonista/proteína | Pendiente | No crear aún |
| Dieta | Pendiente | No derivar automáticamente de keywords |
| Estilo | Pendiente | No crear aún |
| Técnica | Futuro | No crear aún |

## Decisiones

- D-143 — Difficulty es filtro V1 y se normalizará sin inventar valores.
- D-144 — Total time es filtro V1 cuando exista, pero no se completará por inferencia.
- D-145 — Course queda fuera del núcleo de filtros V1 por cobertura histórica insuficiente.
- D-146 — Keywords no es una taxonomía canónica.
- D-147 — No se crearán tags controlados hasta definir su modelo y utilidad.
- D-148 — No se derivarán dietas, cocinas o técnicas automáticamente desde keywords.

## Resultado

El núcleo de descubrimiento V1 queda reducido a:
1. Categoría
2. Ingrediente
3. Cocina
4. Dificultad
5. Tiempo

Esto evita una interfaz sobrecargada y mantiene las dimensiones con significado claro.

Supabase/Postgres permite indexar columnas y relaciones según los patrones reales de consulta; la estrategia de índices debe acompañar al uso real y evitar sobre-indexación. citeturn0search0turn0search6
