# GATE DE PRODUCCIÓN — Manual de Cocina — 2026-09-24

## Estado

**Infraestructura / SEO / datos:** READY para despliegue técnico, con una verificación externa pendiente en Hostinger.

**Contenido editorial multilingüe:** NO CERRADO. Las traducciones/localizaciones históricas de alto valor todavía deben crearse y publicarse como contenido nuevo. No se deben inventar como si ya existieran.

## Cierre realizado

### URL / SEO

- Las URLs históricas conservadas se representan mediante `public_path`.
- La URL histórica es la URL pública/canónica cuando existe una entidad publicada.
- La ruta interna moderna `/{lang}/receta/{slug}` funciona como alias y redirige permanentemente a la URL pública cuando son distintas.
- Recipe JSON-LD usa la URL pública.
- Canonical y hreflang usan las URLs públicas reales.
- Sitemap usa las URLs públicas.
- Los enlaces de RecipeCard usan la URL pública.
- Se eliminó la tabla de redirects operativa como mecanismo de conservación de estas URLs; las URLs publicadas se resuelven directamente por `public_path`.
- No se crean cadenas de redirects para este catálogo.

Esto sigue el enfoque recomendado por Google: canonical autorreferente, hreflang actualizado en sitios multilingües, enlaces internos apuntando a las nuevas URLs y redirects permanentes solo cuando realmente existe un cambio de URL. citeturn491842search0turn491842search2

### Datos

Supabase, después de las migraciones aplicadas:

- `recipes`: 160 filas; 159 publicadas.
- `content_pages`: 88 filas; 74 publicadas.
- recetas sin `public_path`: 0.
- content pages sin `public_path`: 0.
- duplicados exactos publicados entre Recipe y ContentPage por idioma+slug: 0.
- rutas `public_path` duplicadas entre entidades publicadas: 0.
- redirects históricos restantes: 0.
- las 8 páginas de producto/afiliación quedaron fuera del catálogo y sus redirects fueron retirados.
- la copia duplicada de Lechona NEW_SEED quedó despublicada.
- las copias Recipe/ContentPage conocidas quedaron consolidadas a un único tipo publicado.

### Seguridad / rendimiento Supabase

- RLS sigue activo.
- Se eliminaron políticas permisivas redundantes y se optimizó la policy de `admins`.
- Se eliminó el índice duplicado de `recipes(language, slug)`.
- Advisors de seguridad: únicamente queda **Leaked Password Protection Disabled**.
- Advisors de rendimiento: 0 avisos.

La protección de contraseñas filtradas debe activarse en Supabase Auth antes de considerar el cierre de seguridad al 100%.

### Git / migraciones

Las migraciones nuevas del sistema están alineadas con las versiones realmente aplicadas en Supabase:

- 20260924213945 — public paths
- 20260924214154 — sync public paths
- 20260924214225 — consolidación / afiliación
- 20260924214355 — último duplicate cleanup
- 20260924214655 — eliminación de redirects redundantes
- 20260924214757 — RLS / índices

`supabase/schema.sql` fue restaurado como **baseline v0.3 válido**. El estado actual debe reproducirse mediante `supabase/migrations/`.

## Pruebas realizadas

Pasaron las pruebas lógicas de SEO/sitemap sobre el código de la rama:

- canonical
- hreflang
- x-default
- robots
- sitemap
- URLs históricas mediante `public_path`

La prueba completa `npm run typecheck` y `npm run build` **no se pudo ejecutar en este entorno** porque el paquete no contiene `node_modules`, y este entorno no tiene acceso de red para instalar dependencias.

No se debe marcar el build como verificado hasta ejecutarlo en Hostinger/CI.

## Configuración de producción

Variables requeridas:

```
NEXT_PUBLIC_SUPABASE_URL=<Supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable/anon key>
NEXT_PUBLIC_SITE_URL=https://manualdecocina.com
NEXT_PUBLIC_ALLOW_INDEXING=true
NEXT_PUBLIC_IMAGE_HOSTS=<opcional>
```

Preview:

```
NEXT_PUBLIC_ALLOW_INDEXING=false
```

No usar ni agregar `SUPABASE_SERVICE_ROLE_KEY` al frontend.

Hostinger permite configurar las variables durante el despliegue de Node.js y recomienda mantener secretos fuera del repositorio. citeturn491842search1

## Smoke test obligatorio después del deploy

Comprobar en producción:

1. `/` → 308 a `/es`.
2. `/robots.txt` → permite rastreo y referencia el sitemap cuando `NEXT_PUBLIC_ALLOW_INDEXING=true`.
3. `/sitemap.xml` → solo URLs indexables finales.
4. `/receta-bondiola-de-cerdo/` → 200, canonical a sí misma.
5. `/es/receta/receta-bondiola-de-cerdo` → 308/301 a `/receta-bondiola-de-cerdo`.
6. `/de/kolumbianisches-lechona-rezept/` → 200 solo cuando la traducción DE haya sido creada/publicada.
7. `/mejor-batidora-de-vaso-en-2025/` → 404, ya que la página fue retirada del catálogo.
8. fuente HTML de una receta → Recipe JSON-LD válido, canonical correcto y hreflang solo de idiomas publicados.
9. panel `/admin` → noindex y acceso autenticado.
10. una receta eliminada/despublicada → 404 y fuera de sitemap.

## Gate editorial antes del lanzamiento completo

Todavía falta cerrar:

- localizaciones DE/JA/IT/FR/EN de las entidades históricas que se conservarán;
- contenido nuevo completo para cada URL que vaya a indexarse;
- revisión final de salud/nutrición;
- decisión final de institucional/legal;
- cierre de P3/P4 según el catálogo editorial definitivo;
- validación de imágenes/media por entidad.

Las páginas multilingües deben tener contenido principal realmente localizado; Google no considera duplicadas las versiones cuyo contenido principal está en idiomas diferentes. citeturn491842search2

## Gate externo de despliegue

La sesión actual no tiene acceso operativo a Hostinger ni pudo comprobar los dominios en vivo; por tanto **no se afirma que producción esté desplegada**.

Cuando Hostinger reciba la rama `main`, debe ejecutar:

```
npm install
npm run build
npm run start
```

con Node.js compatible con Next.js y las variables anteriores.

Después del cambio de hosting, Google recomienda revisar Search Console, sitemap, canonical/hreflang, tráfico de URLs antiguas y nuevas y errores de rastreo. citeturn491842search0
