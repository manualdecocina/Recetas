# Importación histórica de recetas (DISEÑO — no implementado)

Estado: mecanismo definido. SQL en `supabase/proposals/historical_import.DRAFT.sql`,
NO aplicado en Supabase. Ninguna importación se ha ejecutado.

## Problema

La regla normal (trigger `recipes_guard`) fija `published_at = now()` en la primera
publicación e ignora cualquier fecha enviada. Es lo correcto para el panel, pero una
receta antigua importada perdería su fecha original y aparecería como "nueva",
desordenando la home y el sitemap.

## Requisitos

1. La regla normal no se debilita para ningún usuario de la API (anon, authenticated,
   admin del panel, service_role llamando a tablas directamente).
2. Solo un proceso controlado y auditable puede fijar una fecha histórica.
3. Idempotente: reimportar la misma receta no la duplica.
4. Reversible por lotes.
5. Conserva la URL antigua para el mapa de redirecciones 301.

## Mecanismo

### 1. Una sola función de importación, fuera del alcance del panel

`import_historical_recipe(...)`:
- `SECURITY DEFINER` (se ejecuta como su dueño, `postgres`).
- `EXECUTE` revocado a `public`, `anon` y `authenticated`; concedido solo a `service_role`.
  El panel (que usa la sesión del admin, rol `authenticated`) no puede llamarla.
- Recibe `p_source_recipe_id` (null = plato nuevo; si no, traducción de esa receta),
  igual que el flujo normal: el grupo nunca lo elige quien llama.
- Recibe `p_original_published_at`, `p_legacy_path` y `p_batch_label`.
- Valida: fecha no nula y no futura; `legacy_path` empieza por `/`; `legacy_path` no
  importado antes.

### 2. Excepción mínima en el trigger, con dos condiciones simultáneas

En el INSERT, `recipes_guard` respeta la `published_at` recibida solo si:
- la variable de transacción `app.historical_import` vale `on`, **y**
- `current_user` no es un rol de la API (`anon`, `authenticated`, `service_role`,
  `authenticator`).

Solo el cuerpo de `import_historical_recipe` cumple ambas: activa la variable con
`set_config(..., true)` (local a la transacción), y como es `SECURITY DEFINER` el
`current_user` dentro de ella es `postgres`. Un cliente de la API no puede cumplir la
segunda condición aunque lograra fijar la variable, y PostgREST no expone
`set_config`. El UPDATE no cambia: después de importada, la receta sigue las reglas
normales (despublicar/republicar conserva la fecha original importada).

### 3. Auditoría e idempotencia: `recipe_import_log`

| Campo | Uso |
|---|---|
| recipe_id | receta creada (FK, cascade) |
| legacy_path | URL del sitio anterior, única → idempotencia y mapa 301 |
| original_published_at | fecha declarada al importar |
| batch_label | lote, para revisar o revertir |
| imported_at | cuándo se importó |

RLS activada sin políticas: invisible para anon/authenticated.

### 4. Proceso operativo (futuro script `scripts/import-legacy.ts`)

1. Se ejecuta en la máquina del operador, nunca en Hostinger ni en la app Next.
2. Usa `SUPABASE_SERVICE_ROLE_KEY` desde un `.env` local no versionado.
3. Modo `--dry-run` por defecto: valida todo con los mismos esquemas Zod del panel y
   muestra qué haría, sin escribir.
4. Orden: primero la versión en español (plato nuevo), después cada traducción con
   `p_source_recipe_id` de la española.
5. Recomendado importar con `p_published = false` para revisar calidad antes de
   publicar (el contenido antiguo tenía textos generados y traducciones con errores).
   Al publicar después desde el panel, se conserva la fecha original.
6. Tras cada lote, la web se actualiza por el respaldo de 1 hora o, cuando exista,
   una ruta de revalidación protegida por secreto.
7. Reversión de un lote (solo con autorización explícita del propietario):
   `delete from recipes where id in (select recipe_id from recipe_import_log where batch_label = '...')`.

## Alternativas descartadas

- Dejar que el admin edite `published_at` en el panel: cualquier sesión de admin
  comprometida podría reordenar el sitio; rompe la regla de publicación.
- Desactivar el trigger durante la importación: afecta a toda la tabla y a cualquier
  escritura concurrente del panel.
- Insertar con `service_role` directamente en la tabla: `service_role` salta la RLS,
  pero no el trigger, y no deja auditoría ni idempotencia.

## Pendiente de decisión antes de implementar

- Fuente de las recetas antiguas (exportación de WordPress, base de datos, scraping
  del propio sitio) y qué fecha es la "original" (fecha de publicación de WordPress).
- Si `legacy_path` alimentará directamente las redirecciones 301 (tabla y
  middleware de redirección: fase de SEO/migración).

## Modelo de amenazas (qué protege y qué no)

- Protege frente a: visitantes, usuarios autenticados, la sesión del admin del panel y
  llamadas directas a la API con `service_role` sobre la tabla. Ninguno puede fijar
  una `published_at` arbitraria.
- No protege frente a: quien tenga acceso de dueño a la base (SQL Editor del dashboard
  con rol `postgres`). Ese acceso ya permite modificar o desactivar cualquier regla,
  así que no se intenta bloquearlo; se controla protegiendo la cuenta de Supabase (2FA).
- La unicidad idioma-por-grupo la garantiza el índice `recipes_group_language_key`
  también durante la importación.
