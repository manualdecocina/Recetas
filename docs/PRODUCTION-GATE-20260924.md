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

### Datos

La lectura directa de Supabase del 2026-09-25 establece el inventario vigente:
- `recipes`: **229 filas; 134 publicadas; 95 staged**.
- `content_pages`: **87 filas; 69 publicadas; 18 staged**.
- Estas cifras sustituyen las cifras históricas de este documento y auditorías anteriores.

### Seguridad / rendimiento Supabase

- Advisors de seguridad: únicamente **Leaked Password Protection Disabled**.
- Advisors de rendimiento: **0 avisos**.

La protección de contraseñas filtradas sigue pendiente antes de considerar cerrado el gate de seguridad al 100%.

### Git / migraciones

Las migraciones del sistema deben mantenerse alineadas con las versiones realmente aplicadas en Supabase. Las operaciones recientes de datos/redirects están documentadas en sus respectivos commits de `main`.

## Pruebas realizadas

Pasaron las pruebas lógicas de SEO/sitemap sobre el código de la rama:
- canonical
- hreflang
- x-default
- robots
- sitemap
- URLs históricas mediante `public_path`

La prueba completa `npm run typecheck` y `npm run build` sigue pendiente de Hostinger/CI porque este entorno no dispone de `node_modules` ni acceso de red para instalar dependencias.

## Smoke test obligatorio después del deploy

1. `/` → 308 a `/es`.
2. `/robots.txt`.
3. `/sitemap.xml` → solo URLs indexables finales.
4. `/receta-bondiola-de-cerdo/` → 200, canonical a sí misma.
5. `/es/receta/receta-bondiola-de-cerdo` → 308/301 a `/receta-bondiola-de-cerdo`.
6. `/de/kolumbianisches-lechona-rezept/` → 200 solo cuando la traducción DE esté publicada.
7. `/mejor-batidora-de-vaso-en-2025/` → 404.
8. HTML de receta → Recipe JSON-LD válido, canonical correcto y hreflang solo de idiomas publicados.
9. `/admin` → noindex y acceso autenticado.
10. receta despublicada → 404 y fuera de sitemap.

## Gate editorial antes del lanzamiento completo

Todavía falta cerrar:
- localizaciones DE/JA/IT/FR/EN de las entidades históricas que se conservarán;
- contenido nuevo completo para cada URL que vaya a indexarse;
- revisión final de salud/nutrición;
- decisión final de institucional/legal;
- cierre de P3/P4 según el catálogo editorial definitivo;
- validación de imágenes/media por entidad.

### Metadata staged — cierre del bloque actual

Quedan tres Recipes staged con metadata incompleta real:
- `receta-de-papas-al-horno-y-los-beneficios-para-la-salud`: cook 50 confirmado; prep/servings/total sin evidencia.
- `salmon-en-costra-de-hierbas-y-limon-con-esparragos-crujientes`: cook 12 confirmado; prep/servings/total sin evidencia.
- `sopa-minestrone-casera-el-secreto-definitivo-para-un-sabor-autentico`: cook 43 confirmado; prep/servings/total sin evidencia.

No se completan estos campos por inferencia.

## Gate externo de despliegue

La sesión actual no tiene acceso operativo a Hostinger ni puede comprobar los dominios en vivo; por tanto **no se afirma que producción esté desplegada**.

Cuando Hostinger reciba la rama `main`, debe ejecutar instalación, build y start con las variables de producción definidas en el proyecto. Después deben ejecutarse todos los smoke tests anteriores.

## Reconciliación de estado — 2026-09-25

La lectura directa de Supabase del 2026-09-25 establece el inventario vigente: 229 Recipes (134 publicadas, 95 staged) y 87 ContentPages (69 publicadas, 18 staged). Estas cifras sustituyen las cifras históricas de este documento y de auditorías anteriores.

La readiness de los staged queda documentada por los QA más recientes: 90 Recipes staged completas por metadata; 5 siguen apareciendo incompletas en la consulta, de las cuales 2 están intencionalmente fuera del catálogo mediante redirects y 3 permanecen bloqueadas por falta de evidencia de prep/servings/total.

La prioridad sigue siendo URL Master → routing histórico → modelo → contenido → QA → deploy. No se autoriza el lanzamiento editorial completo mientras las localizaciones históricas y las decisiones REVIEW permanezcan abiertas.
