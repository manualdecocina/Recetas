# Paso 4 — Seguridad y estabilidad — 2026-10-04

## Estado

La auditoría de seguridad se continuó sin modificar el esquema consolidado de `public.recipes`.

## Backups históricos

Las tablas:
- `recipes_backup_20260927`
- `recipes_published_snapshot_20260927`

se movieron de `public` a `archive`.

Motivo: son copias históricas, no datos de runtime. No deben formar parte de la superficie pública de la Data API.

Estado final:
- `anon`: sin acceso.
- `authenticated`: sin acceso.
- `service_role`: solo SELECT.
- `postgres`: conserva control administrativo.
- no se borró ninguna copia.

El Security Advisor dejó de reportarlas como problema de RLS público. Los avisos de falta de primary key permanecen como INFO de rendimiento porque son snapshots estáticos, no tablas operativas.

## Ratings

El RPC público anterior `rate_recipe(uuid, integer)` fue eliminado.

Nuevo flujo:
- `rate_recipe_once(uuid, integer, text)` es `SECURITY DEFINER`.
- solo `service_role` puede ejecutarlo;
- `PUBLIC`, `anon` y `authenticated` no tienen EXECUTE;
- cada receta admite un único voto por `voter_hash`;
- los hashes se guardan en `private.recipe_rating_votes`, fuera del esquema público;
- el API route nunca usa la anon/publishable key para votar;
- exige `SUPABASE_SERVICE_ROLE_KEY` o `SUPABASE_SECRET_KEY`, ambas solo server-side;
- exige `RATINGS_HASH_SECRET`;
- el identificador del visitante se guarda en cookie HttpOnly/SameSite=Lax/Secure y se HMAC-hashea junto con señales de red/agente;
- si ratings están desactivados, el endpoint falla cerrado.

Se probó el RPC dentro de una transacción ejecutando como `service_role`; actualizó conteo/suma correctamente y luego se hizo rollback.

Ratings siguen apagados por defecto hasta configurar los secretos server-side y completar el gate de activación.

## Admin / Auth

La protección actual del panel es correcta en arquitectura:
- middleware valida sesión;
- `requireAdmin()` llama `getUser()` contra Supabase;
- autorización real usa `is_admin()`;
- RLS limita INSERT/UPDATE/DELETE de recipes a admins;
- mensajes de login no revelan si un email existe.

Inventario actual:
- 1 usuario Auth;
- 1 fila admin;
- 0 admins con MFA verificado.

El único warning actual del Security Advisor es "Leaked Password Protection Disabled".

El proyecto Supabase está en plan Free. La documentación actual de Supabase indica que leaked-password protection mediante HaveIBeenPwned está disponible en Pro o superior. No se recomienda pagar solo para silenciar este warning. Compensación prioritaria antes de producción: activar MFA para la única cuenta administradora.

## Advisors

Security Advisor después del hardening:
- sin funciones SECURITY DEFINER expuestas a anon/authenticated;
- sin tablas backup públicas;
- único WARN: leaked-password protection desactivada (feature de plan Pro+).

Performance Advisor:
- backups archivados siguen sin PK (INFO, aceptable por ser snapshots);
- `cuisines_indexable_idx` figura como unused; no se elimina sin evidencia de ventana/uso.

## Commits relevantes

- d1c37b95b3b95bc517f5f64d5352d8007d5a11e7 — API de ratings segura/fail-closed.
- f71211ed23a3c63de7a84cd784e600c054379748 — SQL aplicado documentado.
- 41b9588c49b2ea30cce59609a0426874d17ad0ad — referencias de ratings actualizadas.

CI: verde.
