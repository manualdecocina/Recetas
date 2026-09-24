# CONTROL CENTRAL — Manual de Cocina

**Fecha:** 2026-09-24  
**Fase:** Sprint 0 — RECUPERACIÓN Y CONTROL  
**Estado:** EN EJECUCIÓN

## Objetivo

Reconstruir Manual de Cocina como un proyecto editorial multilingüe nuevo, preservando los activos SEO históricos que tengan evidencia suficiente.

**Principio rector:** el contenido textual histórico no es un requisito de recuperación. Se volverá a crear y localizar desde cero. Lo que se recupera de la historia es evidencia SEO y estructural.

## Qué se conserva de la historia

- URL histórica.
- Idioma.
- Relación entre versiones lingüísticas cuando existe evidencia.
- Clics, impresiones, CTR y posición de Search Console.
- Intención de búsqueda y tipo de página.
- Relaciones de redirección existentes.
- Evidencia de medios reutilizables cuando proceda.
- Fuente histórica que permite justificar la relación.

## Qué NO se intenta recuperar

- El cuerpo traducido histórico como texto literal.
- Traducciones antiguas de TranslatePress.
- HTML antiguo como requisito editorial.
- Estructuras antiguas solo por ser antiguas.

## Modelo editorial objetivo

**Una entidad editorial → un grupo → una URL canónica por idioma.**

Cada versión lingüística se reconstruirá con contenido completo y localizado, no como traducción superficial. Cada versión puede tener un slug propio, incluyendo la conservación de URLs históricas cuando su valor SEO lo justifique.

Idiomas objetivo actuales: es, en, de, ja, it, fr.

## Regla crítica de URLs

No se impone /lang/receta/slug sobre todo el patrimonio histórico.

Una URL con evidencia SEO relevante entra primero al URL Master y después recibe una decisión explícita:

- KEEP — conservar y reconstruir en la misma URL.
- MIGRATE — cambiar de URL con 301 justificado.
- MERGE — consolidar porque existe duplicidad/intención realmente equivalente.
- NOINDEX — mantener accesible pero fuera del índice cuando exista una razón documentada.
- 404/410 — retirar cuando no exista una equivalencia válida.

No se hacen cambios masivos antes de cerrar el mapa.

## Arquitectura SEO obligatoria

Cada página indexable deberá tener, según corresponda:

- canonical coherente.
- hreflang bidireccional solo hacia versiones realmente publicadas.
- sitemap coherente.
- enlaces internos coherentes.
- schema que corresponda al tipo de página y que refleje datos visibles/reales.
- URL estable.
- ausencia de clones entre idiomas o rutas.
- respuesta HTTP correcta.

Google recomienda conectar explícitamente las versiones localizadas mediante hreflang; cada versión debe referenciarse a sí misma y a las demás versiones equivalentes. Las versiones plenamente traducidas no se consideran duplicados simplemente por estar en idiomas distintos. Ver documentación actual de Google Search Central.

## Separación de chats

### Control Central
Decisiones de producto, arquitectura, SEO, URL, i18n, prioridades y gates.

### Code/System
Next.js, TypeScript, routing, metadata, schema, sitemap, robots, i18n, APIs, Supabase y tests.

### Deploy
Preview, producción, variables de entorno, hosting, DNS, builds y verificaciones post-deploy.

### Web/QA
Pruebas visuales, responsive, navegación, enlaces, redirects, 404, metadata y schema sobre la web desplegada.

### SEO/Search Console
Search Console, indexación, consultas, páginas, rich results, sitemap, clusters y validación SEO.

### Supabase/Data
Modelo de datos, migraciones, RLS, imports, traducciones, redirects, media e integridad.

## Gate de Sprint 0

No se autoriza la construcción masiva del contenido ni el cierre de la arquitectura hasta tener:

1. URL Master completo.
2. Decisión por URL histórica relevante.
3. Arquitectura final aprobada.
4. Contrato i18n aprobado.
5. Contrato canonical/hreflang aprobado.
6. Contrato schema aprobado.
7. Sitemap/indexación definidos.
8. Riesgos de redirects documentados.

## Estado actual

- [x] Search Console auditado.
- [x] WXR auditado.
- [x] Inventario auditado.
- [x] Supabase actual auditado.
- [x] 25 URLs históricas de alto tráfico con fuente WP identificada.
- [x] Confirmado que recuperar cuerpos traducidos históricos NO es necesario para el nuevo proyecto.
- [ ] URL Master completo.
- [ ] Arquitectura definitiva.
- [ ] I18N definitivo.
- [ ] SEO Master definitivo.
- [ ] Implementación final.
- [ ] QA.
- [ ] Deploy.
- [ ] Verificación Search Console.

## Regla de cambio

Si cualquier chat de implementación descubre que una decisión técnica obliga a cambiar URLs, canonicals, grupos lingüísticos, redirects, indexación o modelo editorial, debe devolver la decisión a Control Central antes de modificar el contrato.
