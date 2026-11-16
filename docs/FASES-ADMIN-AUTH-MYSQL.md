# Rescate Manual de Cocina — sustitución de Auth y escrituras Supabase por MySQL

Fecha: 2026-11-16. Rama: `rescate-supabase-20261115`, PR #274 en borrador. **No fusionar a `main` hasta completar los criterios.**

## Punto de partida, ya probado
- Hostinger preview: `https://mintcream-squirrel-383743.hostingersite.com`.
- Diagnóstico: `/api/rescate-mysql?adapter=1` responde `mysql_adapter_pass` con 12 comprobaciones reales (es, en, de, fr, it, ja, pt, conteo ES, ingredientes, búsqueda, redirecciones y relación detalle).
- MySQL: 1.782 filas de recetas, 1.764 publicadas, 242 redirecciones activas, 100 históricas. La rama contiene fotos/WebP y video rescatados.
- El frontend público usa Supabase salvo que se habilite `MYSQL_READS_ENABLED=true`. **El panel NO debe habilitarse con ese indicador por separado**.

## Dependencias comprobadas en el código (no son teóricas)
- `src/middleware.ts`: `createServerClient(...).auth.getUser()` protege `/admin/*` (runtime Edge; no abrir conexiones MySQL aquí).
- `src/lib/supabase/admin-guard.ts`: `requireAdmin()` comprueba sesión y RPC `is_admin`.
- `src/app/admin/actions.ts`: login, cierre de sesión, creación, traducción, edición, eliminación; depende de Auth Supabase y las RPC `create_recipe`, `create_recipe_translation`, `update_recipe`.
- `src/app/admin/recuperar/actions.ts` y `src/app/admin/auth/callback/route.ts`: recuperación y cambio de contraseña con OTP de Supabase.
- `src/app/admin/platos/actions.ts`: aprobación/devolución; publicación/despublicación en 7 idiomas; redirecciones, actualización de SEO; depende de `admin_publish_recipe_group` y `admin_unpublish_recipe_group`.
- `src/lib/admin/publication-data.ts`: consulta filas completas, incluso borradores, y revisiones; **no puede utilizar el cliente de lectura pública**, que oculta borradores.
- `src/lib/admin/health-data.ts`: compara todas las filas, redirecciones, SEO, imágenes y publicaciones parciales.
- `src/app/api/rate-recipe/route.ts`: votos mediante `rate_recipe_once` y llave `SUPABASE_SERVICE_ROLE_KEY`/secret, con cookie `md-rating-id`; no confundir con autenticación admin.
- Otros formularios y pantallas admin consumen consultas Supabase.
- La tabla existente `admins` de MySQL solo tiene `user_id`, `email`, `created_at`; **no contiene hashes de contraseña ni sesiones**. No se pueden convertir directamente las contraseñas de Supabase Auth sin un mecanismo seguro de transición.

## Orden de implementación

### Fase 1 — Identidad y sesiones (solo rama aislada)
1. Diseñar esquema MySQL adicional de cuentas, credenciales con hash Argon2id/scrypt, sesiones con **token aleatorio cuyo hash SHA-256 se guarda en DB**, caducidad y revocación, restablecimientos de contraseña de un solo uso, intentos fallidos/auditoría. Jamás migrar contraseñas en claro.
2. Integrar API/login/logout en Node con cookies HttpOnly+Secure+SameSite, protección CSRF/origin, limitación de intentos, validación de roles en cada acción (no basta middleware). Restringir el middleware Edge a verificación criptográfica sin conexión directa a MySQL; confirmar autorización en el servidor Node.
3. Dar de alta al administrador por canal privado en Hostinger/Node con contraseña nueva, sin enviarla al chat ni al repositorio. Validar acceso incorrecto, revocación, expiración y contraseña olvidada.
4. Mantener `ADMIN_AUTH_PROVIDER=supabase` como opción predeterminada hasta QA y sin activar login MySQL público antes de completar autorización.

### Fase 2 — Datos privados, edición y flujo editorial
1. Adaptar lectura de grupos de recetas, estados de revisión y salud usando adaptador **administrativo** separado, que requiera sesión.
2. Traducir RPC de creación/edición a transacciones parametrizadas; UUID en servidor; impedir duplicados (grupo+idioma y ruta), respetar slug/SEO e invariantes por idioma.
3. Copiar gate editorial actual. La publicación de 7 idiomas, fecha y limpieza de redirecciones debe ser **atómica (transaction + rollback)**.
4. Mantener caché de Next invalidada tras operaciones de publicación y SEO; corregir mapa de rutas estáticas después de cada publicación (no dejarlo congelado).
5. Recuperación de contraseña usando correo saliente propio y token de un solo uso; no depender de OTP de Supabase.

### Fase 3 — Valoraciones y estado de escritura
1. Migrar `rate_recipe_once`: deduplicación por votante, conteo, suma, protección de concurrencia y abuso; **no inventar votos anteriores**.
2. Verificar la existencia de su historial de votos en Supabase. La exportación inicial no incluía esta tabla, por lo que todavía no se debe afirmar que las valoraciones estén migradas.
3. Comprobar que los medios nuevos se publiquen en Hostinger (o almacenamiento independiente), no en Supabase Storage.

### Fase 4 — Pruebas y corte
- QA de inicio de sesión, cierre, recuperación, permisos, creación de borrador, siete traducciones, aprobación, publicación, actualización de SEO, despublicación y restauración.
- Verificar sitemap, canonical, hreflang, JSON-LD, 404/301, URL antiguas, imágenes, video, índices y velocidad móvil/escritorio.
- Ensayo de actualización de publicación por 7 idiomas y rollback de DB.
- Solo después: activar lecturas MySQL + auth/acciones MySQL en producción mediante controles independientes, monitorear y conservar Supabase para rollback.
- **No desconectar Supabase hasta que no quede ninguna lectura/escritura/auth/rating/storage dependiente**.

## Riesgos que bloquean producción ahora
- Panel actual depende del servicio Auth de Supabase, no existe sustitución en MySQL.
- Valoraciones actuales dependen de RPC Supabase.
- El `schema` de MySQL no contiene tablas de sesiones ni de votos y no sabemos aún si se extrajeron todos los valores históricos.
- El mapa de rutas usado por middleware en modo MySQL contiene las 1.764 rutas de la fecha del rescate; debe actualizarse dinámicamente o regenerarse por publicación.
- Debe compararse el sitio completo renderizado en modo MySQL antes de activar la bandera de producción.
