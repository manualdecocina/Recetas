# Manual de Cocina — instrucciones de PREVIEW Hostinger / MySQL

**Rama experimental:** rescate-supabase-20261115. **NO fusionar a main ni tocar la app pública sin QA.**

## Hecho, verificado en 2026-11-16
- phpMyAdmin de Hostinger: base u357006512_mdc_migracion. El usuario mostró 6067 consultas de importación y SELECT COUNT(*) = 1782 en recipes.
- Las redirecciones se importaron: phpMyAdmin informó 344 consultas exitosas (342 INSERT + 2 SET). Falta SELECT de verificación de tablas de redirecciones.
- Supabase original seguía ACTIVE_HEALTHY en la última comprobación, pero existe alerta de cuota / posible HTTP 402.
- MySQL esquema 13 tablas; las rutas públicas se leen por un adaptador SELECT parametrizado con mysql2. El panel /admin, votos y otras operaciones de escritura siguen dependiendo de Supabase.
- Las 1764 rutas de recetas publicadas se congelaron solo para que el middleware deje de consultar Supabase cuando MYSQL_READS_ENABLED=true. El mapa necesita regeneración con publicaciones nuevas.
- GitHub Actions validó npm ci, TypeScript y pruebas de SQL con datos simulados.
- 103 WebP + 1 MP4 ausentes fueron rescatados de Supabase Storage, commit confirmado en esta rama. Los 546 WebP de Storage ahora tienen rutas correspondientes en public/recetas; 545 coinciden en longitud con la copia Storage. La imagen arepa-de-huevo/paso-07.webp difiere: NO sobrescribirla hasta revisar la versión editorial correcta.

## Falta el paso importante: validar MySQL desde Node EN HOSTINGER
- La captura de phpMyAdmin verifica MySQL internamente, pero no demuestra que el servidor Next.js pueda alcanzarlo.
- No hay una conexión autenticada a hPanel por el navegador remoto: Cloudflare bloqueó el inicio de sesión; el usuario puede configurar el hosting desde su propia sesión.
- Mantener el sitio original desde main hasta tener preview aislada.

### Variables de entorno exclusivamente del proceso Node (PREVIEW)
MYSQL_HOST = host SQL indicado por Hostinger en el plan donde corre la aplicación
MYSQL_PORT = 3306 (salvo que hPanel indique otro)
MYSQL_DATABASE = u357006512_mdc_migracion
MYSQL_USER = usuario MySQL que creó el usuario en hPanel
MYSQL_PASSWORD = contraseña de la base creada; SOLO en hPanel, JAMÁS por chat/GitHub
MYSQL_READS_ENABLED = true
MYSQL_SSL_MODE = required (solo si el certificado remoto es verificable; no desactivar validación para resolver errores)

Se recomienda crear una **app preview independiente** de Hostinger conectada a la rama de rescate, si el plan existente lo permite sin costo adicional. Evitar indexación de preview. No cambies el branch de la app que sirve manualdecocina.com.

### Comprobaciones previas al corte
1. Instalar deps de la rama con npm ci en entorno Node.
2. Ejecutar node scripts/migracion-hostinger/05-verificar-mysql.mjs desde ese mismo entorno Node. Exige MYSQL_SMOKE_PASS, 11 tablas con conteos exactos y 7 idiomas completos.
3. Consultar sin 500: /es, /en, /de, /fr, /it, /ja, /pt; recetas individuales, categorías, filtros, favoritos y "qué puedo cocinar".
4. Comprobar URLs con y sin barra; sitemap.xml y sitemap_index.xml; meta canonical, hreflang, Recipe JSON-LD, redirecciones 301/308; cookies/legales.
5. Verificar que los recursos /recetas/... WebP y /videos/rollo-tres-carnes-navideno/preparacion.mp4 se sirven con HTTP 200 y Content-Type correcto.
6. Mantener MYSQL_READS_ENABLED sin establecer en producción hasta pasar comparación de rutas y QA manual móvil/escritorio.
7. **Admin sigue en Supabase**: no se puede declarar migración total ni cerrar cuenta hasta sustituir Auth, acciones y storage de escrituras.

### Rollback
El flag MYSQL_READS_ENABLED controla solo las lecturas públicas y el mapa de slash. Dejarlo ausente o false conserva el comportamiento original con Supabase. No borrar la base antigua ni modificar DNS sin completar pruebas.

## Evidencias GitHub
- Rama: https://github.com/manualdecocina/Recetas/tree/rescate-supabase-20261115
- Suite SQL: https://github.com/manualdecocina/Recetas/actions/runs/43815944616
- Rescate medios: https://github.com/manualdecocina/Recetas/actions/runs/43816309429
