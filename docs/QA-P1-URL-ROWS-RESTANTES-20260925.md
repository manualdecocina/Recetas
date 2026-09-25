# QA P1 URL MASTER — FILA ESPAÑOLA RESTANTE — 2026-09-25

## Estado
CONTROL / sin publicación ni creación de entidades.

Se verificaron las siete filas españolas que permanecían después de E101–E106 y E012–E015:

| URL histórica | Resultado actual Supabase |
|---|---|
| /receta-envuelto-de-choclo/ | No existe Recipe ni ContentPage por slug/path consultado |
| /receta-cheesecake-de-agraz/ | No existe Recipe ni ContentPage por slug/path consultado |
| /lomo-de-cerdo-en-salsa-de-menta/ | Recipe existente y publicada |
| /receta-de-pancakes-con-fresas-y-arandanos/ | No existe Recipe ni ContentPage por slug/path consultado |
| /cangrejo-al-limon/ | Recipe existente y publicada |
| /receta-helado-casero/ | No existe Recipe ni ContentPage por slug/path consultado |
| /receta-trucha-al-ajillo-con-limon/ | No existe Recipe ni ContentPage por slug/path consultado |

## Incidentes reales

### Ya resueltas en producción
- `/lomo-de-cerdo-en-salsa-de-menta`
- `/cangrejo-al-limon`

No se tocaron: cambiar una entidad ya publicada sin evidencia nueva violaría el control vigente.

### Sin representación actual
Cinco URLs KEEP / REBUILD del URL Master no tienen una entidad actual en Recipe ni ContentPage. No se crean filas nuevas automáticamente porque el URL Master exige cerrar primero la procedencia, entidad y modelo antes de materializar NEW_SEED.

Estas cinco quedan como bloqueo de recuperación/modelado, no como permiso de inventar contenido.

## Decisión

No se modificó producción, no se crearon redirects y no se publicaron traducciones. La comprobación confirma que el siguiente trabajo debe resolver la procedencia y entidad de estas cinco URLs antes de su reconstrucción.

## Siguiente

Cerrar la procedencia/modelo de las cinco filas P1 ausentes; después continuar con el siguiente bloque URL-by-URL.
