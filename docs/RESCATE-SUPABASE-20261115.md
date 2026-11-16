# Rescate Manual de Cocina — Supabase a Hostinger
Fecha: 2026-11-15. Trabajo aislado de main: no publicar cambios sin validación.

## Alerta
Correo de Supabase: egress 12,26 GB de 5,5 GB, posible restricción HTTP 402 desde el 17 de noviembre de 2026. El proyecto estaba ACTIVE_HEALTHY en la verificación del día 15. La optimización no descuenta el consumo ya registrado. Solicitar a soporte una prórroga de migración; no está garantizada.

## Inventario verificado
- Supabase MANUAL DE COCINA, proyecto eqbdtctxbpepbeickhqi, PostgreSQL 17, 13 tablas public.
- Recipes: 1.782 registros (1.764 publicados: 252 por idioma es/en/de/fr/it/ja/pt; y 18 borradores españoles).
- Tamaño JSON de recipes: aproximadamente 17,21 MiB.
- Redirecciones históricas: 242; ingredientes: 1.032; cuentas Auth: 1.
- Storage: 546 WebP (~112,2 MiB) y 1 video MP4 (~17,7 MiB).
- GitHub public/: 3.008 WebP (~551 MiB). No confundirlos con los de Supabase: faltaría cotejar referencias antes de sustituir URLs.
- Aproximadamente 10.000 solicitudes en la muestra diaria de logs, predominantemente consultas Node a /rest/v1/recipes.
- El sitio también utiliza Auth de Supabase, por lo que migrar solo recipes NO es suficiente.

## Paso urgente 0: respaldo seguro
1. En equipo seguro, con Node 20+ y npm ci, ejecutar el archivo scripts/backup-manualdecocina.mjs.
2. Configurar variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY solo en esa sesión segura. Nunca compartir claves en el chat, ni subirlas a GitHub.
3. El script lee las 13 tablas, los usuarios Auth y todos los objetos Storage, guardando JSON y archivos en .local-backups/ (excluido en .gitignore). No borra ni modifica el origen.
4. Verificar manifest.json con complete=true, recuentos y carpetas de fotos/video; hacer segunda copia privada fuera del servidor.
5. Crear además un dump PostgreSQL nativo con pg_dump desde una conexión administrativa para preservar funciones, esquemas, índices, restricciones y políticas que el JSON no recoge.
6. Contactar soporte Supabase para evitar restricción antes de completar la migración.

## Paso 1: confirmar el plan contratado en Hostinger
- Abrir hPanel y verificar MySQL disponible, espacio, backups, persistencia de archivos, límites de Node y capacidades de la aplicación administrada.
- Hosting Node administrado de Hostinger ofrece MySQL; PostgreSQL local requeriría VPS. Priorizar MySQL del hosting ya pagado si cumple los requisitos.
- No crear cargos ni comprar VPS sin evaluar el plan.

## Paso 2: migración de aplicación en esta rama
- Transformar el esquema PostgreSQL a MySQL con índices y relaciones.
- Importar recipes, traducciones, ingredientes, redirecciones, reseñas y borradores verificando conteos.
- Reemplazar capa de consultas PostgREST por acceso MySQL parametrizado desde el servidor Next.js; nunca publicar credenciales de base de datos.
- Reemplazar Supabase Storage por rutas WebP persistentes del hosting con verificación de referencias y HTTP 200.
- Sustituir Supabase Auth por sesiones seguras de administrador; el script de backup NO transfiere contraseñas.
- Configurar caché y respaldos automáticos para no repetir el egress.

## Paso 3: pruebas antes de tocar producción
- Comparar 252 páginas publicadas por cada uno de los siete idiomas, 18 borradores, 242 redirecciones.
- Probar H1, title, canonical, hreflang, sitemap, JSON-LD Recipe, enlaces, búsqueda, fotos, video y herramientas de cocina.
- Probar publicación, edición, despublicación, sesión de admin y restauración.
- Ensayar rollback; solo cambiar main/despliegue al tener resultados PASS.

## Estado
Rama creada, script de respaldo agregado, .local-backups protegida mediante .gitignore.
Pendiente: ejecutar backup con clave en entorno seguro y validar hosting de destino.
No se ha migrado ni desconectado Supabase. Riesgo 17 noviembre vigente.

## Documentación
- https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/
- https://supabase.com/docs/guides/platform/billing-faq#fair-use-policy
- https://supabase.com/docs/guides/platform/manage-your-usage/egress
