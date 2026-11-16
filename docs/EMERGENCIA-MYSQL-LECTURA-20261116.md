# Despliegue de emergencia: lecturas públicas en MySQL (16/11/2026)

Esta rama toma de rescate-supabase-20261115 exclusivamente lecturas públicas, mapa de redirección canónica y los 103 archivos WebP + video faltantes. Mantiene intacto el acceso administrativo y las escrituras con Supabase; NO es la migración total.

## Condiciones para activar

1. Antes de fusionar, comprobar CI (typecheck, test:logic, build), 7 idiomas, imágenes locales y URL antiguas.
2. En el servidor de producción de Hostinger configurar SOLO variables privadas MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_SSL_MODE según las comprobaciones del hosting; no colocar secretos en GitHub.
3. MYSQL_READS_ENABLED=true en el proceso Node de Hostinger una vez listo el despliegue; reiniciar/redeploy la aplicación. La opción está desactivada por defecto (sin variable o false = Supabase). Las consultas administrativas y votos siguen usando Supabase.
4. Comparar en producción home/listados/detalles, 7 idiomas, ingredientes, redirects, canonical, hreflang, sitemaps, WebP y MP4. Asegurar que la web NO consulta REST recipes de Supabase salvo /admin y valoraciones.
5. Si el control falla: MYSQL_READS_ENABLED=false + redeploy, sin borrar MySQL ni Supabase. Este rollback requiere Supabase operativa.

**Importante:** este conmutador reduce la dependencia pública y el gasto de lectura de recetas, pero NO garantiza continuidad si Supabase se bloquea: /admin, votos, y varias funciones de Auth siguen dependiendo de ella. El mapa estático de 1.764 rutas debe regenerarse cuando haya nuevas publicaciones.

**Origen probado:** vista previa mintcream-squirrel-383743.hostingersite.com, /api/rescate-mysql?adapter=1 → mysql_adapter_pass (12 comprobaciones). /api/rescate-mysql?editorial=1 → 270 grupos, 18 borradores, 252 publicados. Variables no verificadas en producción. No fusionar automáticamente.
