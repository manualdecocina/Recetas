# FASE 1K.2 — MIGRACIÓN DE COCINAS DE ALTA CONFIANZA — 20260925

## Estado
APLICADA Y VERIFICADA

Se creó el modelo canónico `cuisines` + `recipe_cuisines` sin modificar ni borrar `recipes.cuisine`.

## Correspondencias migradas

| Cocina canónica | Registros |
|---|---:|
| Cocina andaluza | 1 |
| Cocina colombiana | 2 |
| Cocina gallega | 1 |
| Cocina italiana | 2 |
| Cocina japonesa | 1 |
| Cocina mexicana | 1 |
| Cocina peruana | 1 |
| **Total** | **9** |

### Fuentes históricas absorbidas
- `Cocina andaluza` → Cocina andaluza
- `Cocina colombiana` → Cocina colombiana
- `Cocina italiana casera` → Cocina italiana
- `Italiana` → Cocina italiana
- `Cocina japonesa` → Cocina japonesa
- `Cocina mexicana` → Cocina mexicana
- `Cocina peruana` → Cocina peruana
- `Gallega` → Cocina gallega

## Integridad

- `recipes.cuisine` histórico permanece intacto.
- La nueva relación usa claves foráneas.
- No se migraron valores ambiguos.
- No se migraron categorías, dietas ni estilos como cocinas.
- No se activó indexación pública para estas cocinas.
- Las 7 entidades canónicas están en estado `canonical`.
- Se verificaron 9 relaciones receta/cocina.

## Siguiente fase

Auditar los valores restantes:
- Internacional
- Fusión
- Carnes
- Aves
- De Mar
- Vegetariano / variantes
- Lacteos
- Pasta / variantes
- demás valores residuales

El objetivo será decidir su dimensión correcta antes de crear otras taxonomías.

## Decisiones
- D-125 — La migración canónica de cocina se limita inicialmente a correspondencias inequívocas.
- D-126 — El histórico `recipes.cuisine` se conserva durante la transición.
- D-127 — La indexabilidad pública queda separada de la canonicidad.
- D-128 — Los valores ambiguos quedan fuera hasta auditoría semántica.
